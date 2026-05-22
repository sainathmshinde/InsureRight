import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/UI'
import { ProductIcon } from '../../icons'
import ProductForm from './ProductForm'
import useProductForm from './useProductForm'
import { PREMIUM_CHART } from './productData'

const MOCK_DATA = {
  1: {
    productName: 'Star Comprehensive Health', productCode: 'SHI-HC-001',
    insuranceType: 'Health', icName: 'Star Health Insurance', category: 'Family',
    basePremium: '8500', gstPercent: '18', totalPremium: '10030',
    sumInsuredOptions: '3L, 5L, 10L, 15L, 25L, 50L',
    coverageDetails: 'In-patient hospitalisation, 60 days pre & 90 days post hospitalisation, 541 daycare procedures, AYUSH treatment',
    addOns: ['Critical Illness Rider', 'Personal Accident Cover', 'OPD Cover'],
    policyType: 'Base',
    tenureOptions: ['1 Year', '2 Years', '3 Years'],
    waitingPeriod: '30', roomRentLimit: 'No Limit',
    diseaseRestrictions: 'Pre-existing diseases covered after 36 months waiting period',
    eligibilityCriteria: 'Persons between 18–65 years. Dependent children between 90 days and 25 years.',
    ageMin: '18', ageMax: '65', geography: 'All India',
    exclusions: 'Cosmetic surgery, Self-inflicted injuries, War-related injuries, Infertility treatment',
    notes: 'Renewal guaranteed without medical tests up to 65 years',
    icApiProductId: 'SHI_COMP_HEALTH_V2',
    status: 'Active',
    coveredMembers: ['Self', 'Spouse', 'Child 1', 'Child 2', 'Mother', 'Father'],
  },
  4: {
    productName: 'Bajaj Allianz Comprehensive Motor', productCode: 'BAJ-MC-004',
    insuranceType: 'Motor', icName: 'Bajaj Allianz', category: 'Individual',
    basePremium: '4800', gstPercent: '18', totalPremium: '5664',
    sumInsuredOptions: 'IDV (Insured Declared Value)',
    coverageDetails: 'Own Damage, Third Party Liability, Personal Accident cover for owner-driver',
    addOns: ['Personal Accident Cover'],
    policyType: 'Comprehensive',
    tenureOptions: ['1 Year'],
    waitingPeriod: '0', roomRentLimit: '',
    diseaseRestrictions: '',
    eligibilityCriteria: 'All registered vehicles in India',
    ageMin: '18', ageMax: '80', geography: 'All India',
    exclusions: 'Normal wear and tear, Electrical/Mechanical breakdown, Driving under influence',
    notes: 'Cashless claim at 4000+ network garages',
    icApiProductId: 'BAJ_COMP_MOTOR_V3',
    status: 'Active',
    coveredMembers: ['Self'],
  },
}

function deriveMembers(productId) {
  const mock = MOCK_DATA[productId]
  if (mock?.coveredMembers) return mock.coveredMembers
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
  const navigate = useNavigate()
  const productId = Number(id)
  const { form, set, setFile, setArr, setPremium } = useProductForm(MOCK_DATA[id] ?? {})

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
            onSubmit={handleSubmit}
            onCancel={() => navigate('/product')}
            submitLabel="Update Product"
          />
        </div>
      </div>
    </div>
  )
}
