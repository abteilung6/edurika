import { ProductType } from 'generated-api'

const productTypeLabelMap: Record<ProductType, string> = {
  [ProductType.ClassTests]: 'Klassenarbeit',
  [ProductType.ColoringPages]: 'Certification',
  [ProductType.FactSheets]: 'Merkblätter',
  [ProductType.Games]: 'Spiele',
  [ProductType.Poster]: 'Poster',
  [ProductType.Quiz]: 'Quiz',
  [ProductType.Worksheets]: 'Arbeitsblätter'
}

export const formatProductTypeLabel = (productType: ProductType) => {
  return productTypeLabelMap[productType]
}
