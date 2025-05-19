from abc import ABC, abstractmethod

from edurika.prj.shopify.mutations import ProductCreateMutationResponse
from edurika.prj.shopify.queries import ProductConnection, ProductsEdge
from edurika.prj.shopify.types import ProductInput


class ShopifyOperator(ABC):
    @abstractmethod
    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        """Creates a product with attributes such as title, description, vendor and tags."""

    @abstractmethod
    def product_search(self, vendor: str) -> ProductsEdge[ProductConnection]:
        """Filter products in the store by vendor."""
