from dataclasses import dataclass, field

import pytest

from edurika.prj.shopify.mutations import ProductCreateMutationResponse
from edurika.prj.shopify.operator import ShopifyOperator
from edurika.prj.shopify.queries import Edge, ProductConnection, ProductsEdge
from edurika.prj.shopify.types import ProductInput


@dataclass
class FakeShopifyOperator(ShopifyOperator):
    requests: list[ProductInput] = field(default_factory=list)
    mock_product_search_response: ProductConnection | None = None

    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        return ProductCreateMutationResponse(
            id="gid://shopify/Product/1",
            title=input.title,
            productType=input.productType,
            descriptionHtml=input.descriptionHtml,
            vendor=input.vendor,
            tags=input.tags,
        )

    def product_search(self, vendor: str) -> ProductsEdge[ProductConnection]:
        if self.mock_product_search_response is None:
            raise NotImplementedError("Mocked response for product_search is not implemented.")
        if self.mock_product_search_response.vendor != vendor:
            raise ValueError(f"Vendor mismatch: expected {vendor}, got {self.mock_product_search_response.vendor}")
        return ProductsEdge[ProductConnection](
            edges=[
                Edge(
                    node=ProductConnection(
                        id=self.mock_product_search_response.id,
                        title=self.mock_product_search_response.title,
                        productType=self.mock_product_search_response.productType,
                        descriptionHtml=self.mock_product_search_response.descriptionHtml,
                        vendor=self.mock_product_search_response.vendor,
                        tags=self.mock_product_search_response.tags,
                    )
                ),
            ]
        )


@pytest.fixture(name="shopify_operator")
def fixture_shopify_operator() -> FakeShopifyOperator:
    return FakeShopifyOperator()
