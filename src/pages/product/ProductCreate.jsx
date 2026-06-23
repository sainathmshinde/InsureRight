import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, Button } from '../../components/UI'
import { Field, Input, Select } from '../../components/Field'
import { ProductIcon } from '../../icons'
import ProductForm from './ProductForm'
import useProductForm from './useProductForm'
import { ICS } from '../ic/icData'

const IC_PRODUCT_FIELDS = [
  { icField: 'product_name',       mapsTo: 'productName',       label: 'Product Name'      },
  { icField: 'product_code',       mapsTo: 'productCode',       label: 'Product Code'      },
  { icField: 'policy_type',        mapsTo: 'policyType',        label: 'Policy Type'       },
  { icField: 'insurance_category', mapsTo: 'insuranceType',     label: 'Insurance Type'    },
  { icField: 'base_premium',       mapsTo: 'basePremium',       label: 'Base Premium'      },
  { icField: 'sum_insured',        mapsTo: 'sumInsuredOptions',  label: 'Sum Insured'       },
  { icField: 'gst_percent',        mapsTo: 'gstPercent',        label: 'GST %'             },
  { icField: 'coverage_details',   mapsTo: 'coverageDetails',   label: 'Coverage Details'  },
  { icField: 'waiting_period',     mapsTo: 'waitingPeriod',     label: 'Waiting Period'    },
  { icField: 'age_min',            mapsTo: 'ageMin',            label: 'Min Age'           },
  { icField: 'age_max',            mapsTo: 'ageMax',            label: 'Max Age'           },
  { icField: 'exclusions',         mapsTo: 'exclusions',        label: 'Exclusions'        },
]

const MOCK_IC_SAMPLE = {
  product_name:       'Star Comprehensive Health Plan',
  product_code:       'SHI-COMP-001',
  policy_type:        'Base Policy',
  insurance_category: 'Health',
  base_premium:       '12500',
  sum_insured:        '500000, 1000000, 2000000',
  gst_percent:        '18',
  coverage_details:   'In-patient hospitalisation, Day care, Pre & Post hospitalisation',
  waiting_period:     '30 days',
  age_min:            '18',
  age_max:            '65',
  exclusions:         'Pre-existing diseases for first 4 years',
}

const choiceBtn = {
  textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
  border: '2px solid var(--border)', borderRadius: 16,
  background: '#fff', padding: 28,
  boxShadow: '0 2px 8px rgba(0,0,0,.06)',
  transition: 'all .15s',
}

export default function ProductCreate() {
  const navigate = useNavigate()
  const { form, set, setFile, setArr, setPremium } = useProductForm()
  const [mode, setMode] = useState('manual') // null | 'api' | 'manual'

  // IC API mapping state
  const [selectedIcId, setSelectedIcId] = useState('')
  const [apiProductCode, setApiProductCode] = useState('')
  const [connStatus, setConnStatus] = useState(null) // null | 'testing' | 'success' | 'error'
  const [fieldMapping, setFieldMapping] = useState(
    Object.fromEntries(IC_PRODUCT_FIELDS.map(f => [f.icField, f.mapsTo]))
  )

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Create Product:', form)
    navigate('/product')
  }

  const testConnection = () => {
    setConnStatus('testing')
    setTimeout(() => setConnStatus('success'), 1200)
  }

  const selectedIc = ICS.find(ic => ic.id === Number(selectedIcId))

  // ── Mode selection (commented out — opens manual form directly) ──────────
  // if (!mode) {
  //   return (
  //     <div>
  //       <PageHeader icon={<ProductIcon />} title="Add Product" subtitle="Register a new insurance product in the catalogue">
  //         <button className="btn btn-ghost" onClick={() => navigate('/product')}>← Back</button>
  //       </PageHeader>
  //       <div style={{ maxWidth: 760, margin: '0 auto' }}>
  //         <div style={{ textAlign: 'center', marginBottom: 32 }}>
  //           <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>How would you like to add this product?</div>
  //           <div style={{ fontSize: 13.5, color: 'var(--text-3)' }}>Import directly from an insurer's API or fill in the details manually</div>
  //         </div>
  //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
  //           <button type="button" onClick={() => setMode('api')} style={choiceBtn}>
  //             <div style={{ fontSize: 36, marginBottom: 14 }}>🔌</div>
  //             <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Map via IC API</div>
  //             <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>Connect to an insurance company's API and import product details automatically.</div>
  //           </button>
  //           <button type="button" onClick={() => setMode('manual')} style={choiceBtn}>
  //             <div style={{ fontSize: 36, marginBottom: 14 }}>✏️</div>
  //             <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Create Manually</div>
  //             <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>Fill in product details, pricing, coverage, eligibility and terms manually.</div>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // ── Manual form ───────────────────────────────────────────────────────────
  if (mode === 'manual') {
    return (
      <div>
        <PageHeader icon={<ProductIcon />} title="Add Product" subtitle="Register a new insurance product in the catalogue">
          <button className="btn btn-ghost" onClick={() => setMode(null)}>← Back</button>
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

  // ── IC API Mapping (commented out for now) ────────────────────────────────
  // return (
  //   <div>
  //     <PageHeader icon={<ProductIcon />} title="Map Product via IC API" subtitle="Connect to an insurer's API and map product fields">
  //       <button className="btn btn-ghost" onClick={() => setMode(null)}>← Back</button>
  //     </PageHeader>
  //     <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
  //       {/* IC Connection, Field Mapping sections */}
  //     </div>
  //   </div>
  // )
}
