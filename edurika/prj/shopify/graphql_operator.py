import json
from dataclasses import asdict, dataclass
from functools import cached_property
from typing import Any, Final, TypeAlias, TypeVar

import requests
from pydantic import BaseModel

from edurika.prj.shopify.errors import ServerError, ShopifyApiError, TooManyRequestsError
from edurika.prj.shopify.mutations import ProductCreateMutationResponse, product_create_mutation
from edurika.prj.shopify.operator import ShopifyOperator
from edurika.prj.shopify.types import ProductInput, UserError

T = TypeVar("T", bound=BaseModel)


JsonObject: TypeAlias = dict[str, Any]

DEFAULT_SHOPIFY_API_VERSION: Final[str] = "2025-01"


@dataclass
class GraphQLShopifyOperator(ShopifyOperator):
    access_token: str
    shop_id: str
    api_version: str = DEFAULT_SHOPIFY_API_VERSION

    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        payload = {"query": product_create_mutation, "variables": {"input": asdict(input)}}
        body = self.execute_request(payload=payload)
        return self.unmarshall_entity(
            body, model=ProductCreateMutationResponse, mutation_name="productCreate", entity_name="product"
        )

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
    def unmarshall_entity(body: JsonObject, *, model: type[T], mutation_name: str, entity_name: str) -> T:
        entity_data = body.get("data", {}).get(mutation_name, {}).get(entity_name, {})
        return model.model_validate(entity_data)
