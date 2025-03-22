import { useState } from 'react'
import { ProductCreateDrawer } from 'components/products/ProductCreateDrawer'
import { Button } from 'components/Button'

const AdminProductPage: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Material erstellen</Button>
      <ProductCreateDrawer open={open} setOpen={setOpen} />
    </div>
  )
}

export default AdminProductPage
