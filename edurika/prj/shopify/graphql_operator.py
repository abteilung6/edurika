import json
from dataclasses import asdict, dataclass
from functools import cached_property
from typing import Final, TypeVar

import requests
from pydantic import BaseModel

from edurika.prj.json.types import JsonObject
from edurika.prj.shopify.errors import ServerError, ShopifyApiError, TooManyRequestsError
from edurika.prj.shopify.mutations import ProductCreateMutationResponse, product_create_mutation
from edurika.prj.shopify.operator import ShopifyOperator
from edurika.prj.shopify.queries import ProductConnection, ProductsEdge, product_list_by_vendor_query
from edurika.prj.shopify.types import ProductInput, UserError

T = TypeVar("T", bound=BaseModel)


DEFAULT_SHOPIFY_API_VERSION: Final[str] = "2025-01"


@dataclass
class GraphQLShopifyOperator(ShopifyOperator):
    access_token: str
    shop_id: str
    api_version: str = DEFAULT_SHOPIFY_API_VERSION

    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        payload = {"query": product_create_mutation, "variables": {"input": asdict(input)}}
        body = self.execute_request(payload=payload)
        return self.unmarshall_mutation_response(
            body, model=ProductCreateMutationResponse, mutation_name="productCreate", entity_name="product"
        )

    def product_search(self, vendor: str) -> ProductsEdge[ProductConnection]:
        payload = {"query": product_list_by_vendor_query, "variables": {"vendor": vendor}}
        body = self.execute_request(payload=payload)
        return self.unmarshall_query_response(body, model=ProductsEdge[ProductConnection], entity_name="products")  # type: ignore[arg-type]

    def execute_request(self, payload: JsonObject) -> JsonObject:
        response = requests.post(self.shop_url, headers=self.headers, data=json.dumps(payload))
        return self.handle_response(response)

    def handle_response(self, response: requests.Response) -> JsonObject:
        body = response.json()
        if response.status_code < 400:
            return body

        errors = body.get("errors", [])
        user_errors = [UserError.model_validate(error) for error in errors]
        user_error_message = user_errors[0].message if user_errors else None

        if response.status_code == 429:
            raise TooManyRequestsError(user_error_message)
        elif response.status_code >= 500:
            raise ServerError(response.status_code, user_error_message)
        else:
            raise ShopifyApiError(response.status_code, user_error_message)

    @property
    def shop_url(self) -> str:
        return f"https://{self.shop_id}.myshopify.com/admin/api/{self.api_version}/graphql.json"

    @cached_property
    def headers(self) -> JsonObject:
        return {"Content-Type": "application/json", "X-Shopify-Access-Token": self.access_token}

    @staticmethod
    def unmarshall_mutation_response(body: JsonObject, *, model: type[T], mutation_name: str, entity_name: str) -> T:
        entity_data = body.get("data", {}).get(mutation_name, {}).get(entity_name, {})
        return model.model_validate(entity_data)

    @staticmethod
    def unmarshall_query_response(body: JsonObject, *, model: type[T], entity_name: str) -> ProductsEdge[T]:
        entity_data = body.get("data", {}).get(entity_name, {})
        return model.model_validate(entity_data)  # type: ignore[return-value]
