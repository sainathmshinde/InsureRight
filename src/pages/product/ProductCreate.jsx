import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/UI'
import { ProductIcon } from '../../icons'
import ProductForm from './ProductForm'
import useProductForm from './useProductForm'

export default function ProductCreate() {
  const navigate = useNavigate()
  const { form, set, setFile, setArr, setPremium } = useProductForm()

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Create Product:', form)
    navigate('/product')
  }

  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Add Product" subtitle="Register a new insurance product in the catalogue">
        <button className="btn btn-ghost" onClick={() => navigate('/product')}>← Back</button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <ProductForm
            form={form} set={set} setFile={setFile} setArr={setArr} setPremium={setPremium}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/product')}
            submitLabel="Create Product"
          />
        </div>
      </div>
    </div>
  )
}
