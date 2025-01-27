import { User } from 'generated-api'

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
