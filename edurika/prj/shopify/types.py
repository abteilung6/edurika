from dataclasses import dataclass

from pydantic import BaseModel


class UserError(BaseModel):
    """See https://shopify.dev/docs/api/partner/2025-01/objects/UserError"""

    message: str


@dataclass(frozen=True)
class ProductInput:
    """See https://shopify.dev/docs/api/admin-graphql/2025-01/input-objects/ProductInput"""

    title: str
    """The name for the product that displays to customers."""
    productType: str  # noqa: N815
    """The product type that merchants define."""
    descriptionHtml: str  # noqa: N815
    """The description of the product."""
    vendor: str
    """The name of the product's vendor."""
    tags: list[str]
    """A comma-separated list of searchable keywords that are associated with the product."""
