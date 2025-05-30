from typing import cast

from fastapi import APIRouter, Depends, HTTPException, status

from edurika import models, schemas
from edurika.api.deps import get_current_user, get_shopify_operator
from edurika.prj.shopify.errors import ShopifyApiError
from edurika.prj.shopify.operator import ProductInput, ShopifyOperator
from edurika.prj.shopify.queries import ProductConnection, ProductsEdge
from edurika.schemas.products import ProductType

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=schemas.Product)
def products_create(
    request: schemas.ProductCreateRequest,
    current_user: models.User = Depends(get_current_user),
    shopify_operator: ShopifyOperator = Depends(get_shopify_operator),
) -> schemas.Product:
    try:
        shopify_product = shopify_operator.product_create(
            input=ProductInput(
                title=request.title,
                productType=request.product_type,
                descriptionHtml=request.description_html,
                vendor=str(current_user.public_name),
                tags=request.tags,
            )
        )
    except ShopifyApiError as ex:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Product could not created",
        ) from ex
    return schemas.Product(
        gid=shopify_product.id,
        title=shopify_product.title,
        product_type=cast(ProductType, shopify_product.productType),  # TODO: validate product_type
        description_html=shopify_product.descriptionHtml,
        vendor=shopify_product.vendor,
        tags=shopify_product.tags,
    )


@router.get("/", response_model=list[schemas.Product])
def products_list(
    current_user: models.User = Depends(get_current_user),
    shopify_operator: ShopifyOperator = Depends(get_shopify_operator),
) -> list[schemas.Product]:
    product_edge = shopify_operator.product_search(vendor=str(current_user.public_name))
    return format_product_list(product_edge)


def format_product_list(product_edge: ProductsEdge[ProductConnection]) -> list[schemas.Product]:
    edges = product_edge.edges
    return [
        schemas.Product(
            gid=edge.node.id,
            title=edge.node.title,
            product_type=cast(ProductType, edge.node.productType),
            description_html=edge.node.descriptionHtml,
            vendor=edge.node.vendor,
            tags=edge.node.tags,
        )
        for edge in edges
    ]
