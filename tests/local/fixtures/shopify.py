from dataclasses import dataclass, field

import pytest

from edurika.prj.shopify.mutations import ProductCreateMutationResponse
from edurika.prj.shopify.operator import ShopifyOperator
from edurika.prj.shopify.types import ProductInput


@dataclass
class FakeShopifyOperator(ShopifyOperator):
    requests: list[ProductInput] = field(default_factory=list)

    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        return ProductCreateMutationResponse(
            id="gid://shopify/Product/1",
            title=input.title,
            productType=input.productType,
            descriptionHtml=input.descriptionHtml,
            vendor=input.vendor,
            tags=input.tags,
        )


@pytest.fixture(name="shopify_operator")
def fixture_shopify_operator() -> FakeShopifyOperator:
    return FakeShopifyOperator()
