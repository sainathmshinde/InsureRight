import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/UI'
import { ProductIcon } from '../../icons'
import ProductForm from './ProductForm'
import useProductForm from './useProductForm'
import { PRODUCTS, PRODUCT_DETAILS, PREMIUM_CHART, getProductLinks } from './productData'

const POLICY_TYPE_TO_FORM = {
  'Base Policy':   'Base',
  'Top Up Policy': 'Top-up',
  'Super Top Up':  'Super Top-up',
}

function fmtSI(v) {
  return v % 100000 === 0 ? `${v / 100000}L` : `₹${v.toLocaleString('en-IN')}`
}

// Builds ProductForm's initial field values straight from the live product catalogue
// (productData.js) so Edit Product shows the same data Add Product would have captured.
function buildFormData(productId) {
  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) return {}

  const details = PRODUCT_DETAILS[productId] ?? {}
  const rows = PREMIUM_CHART[productId] ?? []
  const { topups } = getProductLinks(productId)
  const linkedTopup = topups[0]
  const basePremium = rows[0]?.selfOnly ?? ''
  const uniqueSIs = [...new Set(rows.map(r => r.sumInsured))]

  return {
    productName: product.name,
    productDescription: details.tagline ?? '',
    productCode: product.code,
    icName: product.provider,
    category: 'Family',
    basePremium: basePremium !== '' ? String(basePremium) : '',
    gstPercent: '18',
    totalPremium: basePremium !== '' ? (basePremium * 1.18).toFixed(2) : '',
    sumInsuredOptions: uniqueSIs.map(fmtSI).join(', '),
    aboutPolicy: details.description ?? '',
    whoShouldBuy: (details.target ?? []).join(', '),
    keyBenefits: (details.benefits ?? []).join(', '),
    coverageDetails: (details.covered ?? []).join(', '),
    exclusions: (details.notCovered ?? []).join(', '),
    policyType: POLICY_TYPE_TO_FORM[product.policyType] ?? 'Base',
    basePolicyId: linkedTopup ? String(linkedTopup.id) : '',
    basePolicyDiscount: linkedTopup?.bundleDiscount?.type === 'Percent' ? String(linkedTopup.bundleDiscount.value) : '',
    eligibilityCriteria: details.eligibilityCriteria ?? '',
    waitingPeriods: details.waitingPeriods ?? '',
    copayment: details.copayment ?? '',
    maternityBenefits: details.maternityBenefits ?? '',
    status: product.status ?? 'Active',
  }
}

function deriveMembers(productId) {
  const rows = PREMIUM_CHART[productId] ?? []
  if (rows.length === 0) return []
  return [
    'Self',
    ...(rows.some(r => r.selfSpouse != null)          ? ['Spouse']           : []),
    ...(rows.some(r => r.selfSpouse2Children != null) ? ['Child 1', 'Child 2'] : []),
  ]
}

export default function ProductEdit() {
  const { id } = useParams()
  // Force a fresh mount when navigating between two products' edit pages —
  // otherwise React Router reuses this component and the form keeps the
  // previous product's state since only the :id param changed.
  return <ProductEditForm key={id} id={id} />
}

function ProductEditForm({ id }) {
  const navigate = useNavigate()
  const productId = Number(id)
  const { form, set, setFile, setArr, setPremium } = useProductForm(buildFormData(productId))

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Update Product:', id, form)
    navigate('/product')
  }

  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Edit Product" subtitle="Update product details and pricing">
        <button className="btn btn-ghost" onClick={() => navigate('/product')}>← Back</button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <ProductForm
            form={form} set={set} setFile={setFile} setArr={setArr} setPremium={setPremium}
            productId={productId}
            initialMembers={deriveMembers(productId)}
            initialGst="18"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/product')}
            submitLabel="Update Product"
          />
        </div>
      </div>
    </div>
  )
}
