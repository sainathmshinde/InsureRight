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
  const [mode, setMode] = useState(null) // null | 'api' | 'manual'

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

  // ── Mode selection ────────────────────────────────────────────────────────
  if (!mode) {
    return (
      <div>
        <PageHeader icon={<ProductIcon />} title="Add Product" subtitle="Register a new insurance product in the catalogue">
          <button className="btn btn-ghost" onClick={() => navigate('/product')}>← Back</button>
        </PageHeader>

        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>How would you like to add this product?</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-3)' }}>
              Import directly from an insurer's API or fill in the details manually
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <button
              type="button"
              onClick={() => setMode('api')}
              style={choiceBtn}
              onMouseEnter={e => { e.currentTarget.style.border = '2px solid var(--brand)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '2px solid var(--border)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>🔌</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Map via IC API</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
                Connect to an insurance company's API and import product details automatically. Ideal for live data sync.
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 18, fontSize: 12, fontWeight: 600, color: 'var(--brand)', background: 'var(--brand-light)', borderRadius: 20, padding: '5px 14px' }}>
                Select &amp; Map →
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('manual')}
              style={choiceBtn}
              onMouseEnter={e => { e.currentTarget.style.border = '2px solid var(--brand)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(124,58,237,.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.border = '2px solid var(--border)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.06)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>✏️</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Create Manually</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>
                Fill in product details, pricing, coverage, eligibility and terms manually. Full control over every field.
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 18, fontSize: 12, fontWeight: 600, color: 'var(--text-2)', background: 'var(--surface-2)', borderRadius: 20, padding: '5px 14px' }}>
                Fill Form →
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

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
              onCancel={() => setMode(null)}
              submitLabel="Create Product"
            />
          </div>
        </div>
      </div>
    )
  }

  // ── IC API Mapping ─────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Map Product via IC API" subtitle="Connect to an insurer's API and map product fields">
        <button className="btn btn-ghost" onClick={() => setMode(null)}>← Back</button>
      </PageHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Section 1 — IC Connection */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontWeight: 700, fontSize: 14 }}>🔌 IC Connection</span>
          </div>
          <div className="card-body">
            <div className="form-grid">
              <Field label="Insurance Company" required>
                <Select value={selectedIcId} onChange={e => { setSelectedIcId(e.target.value); setConnStatus(null); }}>
                  <option value="">Select IC…</option>
                  {ICS.map(ic => (
                    <option key={ic.id} value={ic.id}>{ic.icName} ({ic.code})</option>
                  ))}
                </Select>
              </Field>
              <Field label="IC Product Code / ID" required>
                <Input
                  placeholder="e.g. SHI-COMP-001"
                  value={apiProductCode}
                  onChange={e => { setApiProductCode(e.target.value); setConnStatus(null); }}
                />
              </Field>
            </div>

            {selectedIc && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'var(--surface-2)', borderRadius: 10, padding: '10px 14px', marginTop: 4 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>
                  <span style={{ color: 'var(--text-3)' }}>API Base URL: </span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--brand)' }}>{selectedIc.apiBaseUrl}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginLeft: 'auto' }}>
                  <span style={{ color: 'var(--text-3)' }}>Contact: </span>{selectedIc.contactPerson}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <Button
                disabled={!selectedIcId || !apiProductCode || connStatus === 'testing'}
                onClick={testConnection}
                variant="secondary"
              >
                {connStatus === 'testing' ? '⏳ Testing…' : '⚡ Test Connection'}
              </Button>
              {connStatus === 'success' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                  ✅ Connected — product data fetched
                </span>
              )}
              {connStatus === 'error' && (
                <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 600 }}>❌ Connection failed. Check credentials.</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Field Mapping */}
        {connStatus === 'success' && (
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14 }}>🗺 Field Mapping</span>
              <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 10 }}>
                Map IC API response fields to product catalogue fields
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--surface-2)', borderBottom: '1.5px solid var(--border)' }}>
                    {['IC API Field', 'Sample Value', 'Maps To (Product Field)'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {IC_PRODUCT_FIELDS.map((f, i) => (
                    <tr key={f.icField} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? '#fff' : 'var(--surface-2)' }}>
                      <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--brand)', fontWeight: 600 }}>
                        {f.icField}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-2)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {MOCK_IC_SAMPLE[f.icField] ?? <span style={{ color: 'var(--text-3)' }}>—</span>}
                      </td>
                      <td style={{ padding: '8px 16px' }}>
                        <select
                          className="field-select"
                          value={fieldMapping[f.icField]}
                          onChange={e => setFieldMapping(prev => ({ ...prev, [f.icField]: e.target.value }))}
                          style={{ fontSize: 12.5, padding: '5px 8px', width: '100%' }}
                        >
                          {IC_PRODUCT_FIELDS.map(opt => (
                            <option key={opt.mapsTo} value={opt.mapsTo}>{opt.label}</option>
                          ))}
                          <option value="">— Skip this field —</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {connStatus === 'success' && (
          <div className="actions-row">
            <button className="btn btn-ghost" onClick={() => setMode(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => { console.log('IC API mapping saved', { selectedIcId, apiProductCode, fieldMapping }); navigate('/product'); }}>
              Save Mapped Product
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
