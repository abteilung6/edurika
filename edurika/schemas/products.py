from pydantic import BaseModel


class ProductCreateRequest(BaseModel):
    title: str
    product_type: str  # noqa: N815
    description_html: str  # noqa: N815
    vendor: str
    tags: list[str]


class Product(BaseModel):
    gid: str
    title: str
    product_type: str  # noqa: N815
    description_html: str  # noqa: N815
    vendor: str
    tags: list[str]
