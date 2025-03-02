import { Product, User } from 'generated-api'

export const createMockUser = (overrides: Partial<User>): User => {
  return {
    user_id: overrides.user_id ?? 1,
    email: overrides.email ?? 'test@example_com',
    username: overrides.username ?? 'testusername',
    public_name: overrides.public_name ?? 'Test public name',
    subtitle: overrides.subtitle ?? 'Test subtitle',
    description: overrides.description ?? 'Test description'
  }
}

export const createMockProduct = (overrides: Partial<Product>): Product => {
  return {
    gid: overrides.gid ?? '1',
    title: overrides.title ?? 'title',
    description_html: overrides.description_html ?? 'description_html',
    product_type: overrides.product_type ?? 'product_type',
    vendor: overrides.vendor ?? 'vendor',
    tags: overrides.tags ?? ['tag1']
  }
}
