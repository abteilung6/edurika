import { render, screen } from '@testing-library/react'

import AppPage from './AppPage'

describe('<App />', () => {
  it('should render the App', () => {
    render(<AppPage />)

    expect(
      screen.getByRole('heading', {
        name: /Hello World/i,
        level: 1
      })
    ).toBeInTheDocument()
  })
})
