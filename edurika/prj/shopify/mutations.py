from pydantic import BaseModel


class ProductCreateMutationResponse(BaseModel):
    id: str
    title: str
    productType: str  # noqa: N815
    descriptionHtml: str  # noqa: N815
    vendor: str
    tags: list[str]


product_create_mutation = """
mutation productCreate($input: ProductInput) {
  productCreate(input: $input) {
    product {
      id,
      title,
      productType,
      descriptionHtml,
      vendor,
      tags
    }
    userErrors {
      field
      message
    }
  }
}
"""
