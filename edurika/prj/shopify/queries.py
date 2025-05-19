from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class Edge(BaseModel, Generic[T]):
    node: T


class ProductsEdge(BaseModel, Generic[T]):
    edges: list[Edge[T]]


class ProductConnection(BaseModel):
    id: str
    title: str
    productType: str  # noqa: N815
    descriptionHtml: str  # noqa: N815
    vendor: str
    tags: list[str]


# TODO: Search by vendor
# TODO: Add pagination
product_list_by_vendor_query = """
query ($vendor: String!) {
  products(first: 100, query:$vendor) {
    edges {
      node {
        id,
        title,
        productType,
        descriptionHtml,
        vendor,
        tags
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}
"""
