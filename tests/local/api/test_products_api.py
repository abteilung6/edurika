import pytest
from fastapi.testclient import TestClient

from edurika import models
from edurika.prj.shopify.queries import ProductConnection
from edurika.schemas.products import Product, ProductType
from tests.local.fixtures.shopify import FakeShopifyOperator


@pytest.fixture(name="sample_product")
def fixture_sample_product() -> Product:
    return Product(
        gid="gid://shopify/Product/1",
        title="product-title",
        product_type=ProductType.poster,
        description_html="<b>description</b>",
        vendor="Test user",
        tags=["tag1", "tags"],
    )


@pytest.fixture(name="sample_product_connection")
def fixture_sample_product_connection(sample_product: Product) -> ProductConnection:
    return ProductConnection(
        id=sample_product.gid,
        title=sample_product.title,
        productType=sample_product.product_type,
        descriptionHtml=sample_product.description_html,
        vendor=sample_product.vendor,
        tags=sample_product.tags,
    )


def test_products_create(auth_client: TestClient, auth_user: models.User, sample_product: Product) -> None:
    request = sample_product.model_dump()
    response = auth_client.post("/products", json=request)
    assert response.status_code == 200
    content = response.json()
    assert content == {
        "gid": "gid://shopify/Product/1",
        "title": sample_product.title,
        "product_type": sample_product.product_type,
        "description_html": sample_product.description_html,
        "vendor": auth_user.public_name,
        "tags": sample_product.tags,
    }


def test_products_get(
    auth_client: TestClient,
    auth_user: models.User,
    sample_product_connection: ProductConnection,
    sample_product: Product,
    shopify_operator: FakeShopifyOperator,
) -> None:
    shopify_operator.mock_product_search_response = sample_product_connection
    response = auth_client.get("/products")
    assert response.status_code == 200
    content = response.json()
    assert content == [sample_product.model_dump()]
