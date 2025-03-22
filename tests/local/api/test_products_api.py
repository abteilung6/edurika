import pytest
from fastapi.testclient import TestClient

from edurika.schemas.products import Product, ProductType


@pytest.fixture(name="sample_product")
def fixture_sample_product() -> Product:
    return Product(
        gid="gid://shopify/Product/1",
        title="product-title",
        product_type=ProductType.poster,
        description_html="<b>description</b>",
        vendor="vendor",
        tags=["tag1", "tags"],
    )


def test_products_create(auth_client: TestClient, sample_product: Product) -> None:
    request = sample_product.model_dump()
    response = auth_client.post("/products", json=request)
    assert response.status_code == 200
    content = response.json()
    assert content == {
        "gid": "gid://shopify/Product/1",
        "title": sample_product.title,
        "product_type": sample_product.product_type,
        "description_html": sample_product.description_html,
        "vendor": sample_product.vendor,
        "tags": sample_product.tags,
    }
