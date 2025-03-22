from enum import StrEnum

from pydantic import BaseModel


class ProductType(StrEnum):
    poster = "poster"
    worksheets = "worksheets"
    games = "games"
    coloring_pages = "coloring_pages"
    fact_sheets = "fact_sheets"
    class_tests = "class_tests"
    quiz = "quiz"


class ProductCreateRequest(BaseModel):
    title: str
    product_type: ProductType  # noqa: N815
    description_html: str  # noqa: N815
    tags: list[str]


class Product(BaseModel):
    gid: str
    title: str
    product_type: ProductType
    description_html: str  # noqa: N815
    vendor: str
    tags: list[str]
