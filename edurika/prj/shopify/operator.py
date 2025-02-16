from abc import ABC, abstractmethod

from edurika.prj.shopify.mutations import ProductCreateMutationResponse
from edurika.prj.shopify.types import ProductInput


class ShopifyOperator(ABC):
    @abstractmethod
    def product_create(self, *, input: ProductInput) -> ProductCreateMutationResponse:
        """Creates a product with attributes such as title, description, vendor and tags."""
