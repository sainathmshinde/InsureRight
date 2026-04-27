import { useState } from 'react'
import { Field, Input, Select, Textarea, UploadBox, SectionBlock } from '../../components/Field'
import { CheckboxGroup, FormActions } from '../../components/UI'

const IC_LIST = ['Star Health Insurance', 'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'New India Assurance', 'LIC', 'HDFC Life', 'SBI Life', 'Reliance General', 'Tata AIG']
const ADDONS  = ['Critical Illness Rider', 'Personal Accident Cover', 'OPD Cover', 'Maternity Cover', 'Dental Cover', 'Vision Cover', 'Home Nursing', 'Air Ambulance', 'No Claim Bonus', 'Global Cover']
const TENURES = ['1 Year', '2 Years', '3 Years', '5 Years']
const STATES  = ['All India', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Kerala']

const POLICY_TOC = [
  { id: 'S1',  icon: '📋', title: '1. Product Overview',           content: 'This policy provides comprehensive health coverage for the insured and family members against hospitalisation expenses arising from illness, accidents or injury. Covers in-patient, day-care, and emergency treatment at network hospitals across India.' },
  { id: 'S2',  icon: '👤', title: '2. Eligibility & Entry Age',    content: 'Entry age: 18–65 years for adults. Dependent children: 91 days to 25 years. Senior citizens up to 75 years under senior health plan. Lifetime renewability guaranteed with no exit age restriction.' },
  { id: 'S3',  icon: '💰', title: '3. Sum Insured Options',        content: '₹3L, ₹5L, ₹10L, ₹15L, ₹25L, ₹50L, ₹1 Cr. Automatic restoration of 100% sum insured once per policy year for unrelated illness. Super top-up options available separately.' },
  { id: 'S4',  icon: '🏥', title: '4. In-Patient Hospitalisation', content: 'Room rent, ICU charges, surgeon/anaesthetist fees, blood, oxygen, medicines. Minimum 24-hour admission required. Single private room covered up to sum insured per policy terms. Pre-authorisation required for planned procedures.' },
  { id: 'S5',  icon: '📅', title: '5. Pre & Post Hospitalisation', content: '60 days pre-hospitalisation and 90 days post-hospitalisation expenses covered. Includes diagnostics, prescribed medicines, follow-up consultations directly related to the hospitalisation event.' },
  { id: 'S6',  icon: '💉', title: '6. Day Care Procedures',        content: '541 listed day-care procedures covered without 24-hour admission requirement. Includes cataract, dialysis, chemotherapy, radiotherapy, tonsillectomy, hysterectomy, varicose vein treatment and more.' },
  { id: 'S7',  icon: '⏳', title: '7. Waiting Periods',            content: 'Initial: 30 days (except accidents). Pre-existing diseases (PED): 48 months. Specific diseases (hernia, piles, sinusitis): 24 months. Maternity (with rider): 9 months. Accident claims: no waiting period.' },
  { id: 'S8',  icon: '🚫', title: '8. Exclusions',                 content: 'Cosmetic/plastic surgery, dental (unless accidental), self-inflicted injuries, war/nuclear hazard, unproven treatments, obesity surgery, infertility, congenital defects declared at inception, substance abuse.' },
  { id: 'S9',  icon: '📝', title: '9. Claim Procedure',            content: 'Cashless: Pre-authorise 48 hrs prior (planned) or within 24 hrs (emergency) at network hospital. Reimbursement: Submit original documents within 30 days of discharge. 24×7 TPA helpline available.' },
  { id: 'S10', icon: '🔄', title: '10. Renewal & No Claim Bonus',  content: 'Lifetime renewability. Grace period: 30 days. NCB: 10% SI increase per claim-free year up to 50%. Premium revision on anniversary per IRDAI approved rates. Portability as per IRDAI guidelines.' },
]

export default function ProductForm({ form, set, setFile, setArr, setPremium, onSubmit, onCancel, submitLabel = 'Save Product' }) {
  const [activeToc, setActiveToc] = useState(null)

  return (
    <form onSubmit={onSubmit}>

      {/* ── 1. Basic Information ──────────────────── */}
      <SectionBlock icon="📦" title="Basic Information">
        <div className="form-grid">
          <Field label="Product Name" required>
            <Input placeholder="e.g. Star Comprehensive Health" value={form.productName} onChange={set('productName')} required />
          </Field>
          <Field label="Product Code" required>
            <Input placeholder="e.g. SHI-HC-001" value={form.productCode} onChange={set('productCode')} required />
          </Field>
          <Field label="Insurance Type" required>
            <Select value={form.insuranceType} onChange={set('insuranceType')} required>
              <option value="">Select type</option>
              <option>Health</option>
              <option>Motor</option>
              <option>Life</option>
              <option>Travel</option>
              <option>Home</option>
              <option>Fire</option>
              <option>Marine</option>
            </Select>
          </Field>
          <Field label="Insurance Company (IC)" required>
            <Select value={form.icName} onChange={set('icName')} required>
              <option value="">Select IC</option>
              {IC_LIST.map(ic => <option key={ic}>{ic}</option>)}
            </Select>
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={set('category')} required>
              <option value="">Select category</option>
              <option>Individual</option>
              <option>Family</option>
              <option>Group</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </Field>
        </div>
      </SectionBlock>

      {/* ── 2. Financial Details ──────────────────── */}
      <SectionBlock icon="💰" title="Financial Details">
        <div className="form-grid">
          <Field label="Base Premium (₹)" required>
            <Input type="number" min="0" placeholder="e.g. 8500" value={form.basePremium} onChange={setPremium('basePremium')} required />
          </Field>
          <Field label="GST %" required>
            <Select value={form.gstPercent} onChange={setPremium('gstPercent')} required>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
            </Select>
          </Field>
          <Field label="Total Premium (₹) — auto calculated">
            <Input value={form.totalPremium} readOnly disabled placeholder="Auto-calculated" />
          </Field>
          <Field label="Sum Insured Options" required>
            <Input placeholder="e.g. 3L, 5L, 10L, 15L, 25L, 50L" value={form.sumInsuredOptions} onChange={set('sumInsuredOptions')} required />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 3. Documents ─────────────────────────── */}
      <SectionBlock icon="📄" title="Documents">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

          {/* Left — upload boxes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Policy Wordings Document">
              <UploadBox label="Upload Policy Wordings (PDF)" hint="PDF only, max 20MB" onChange={setFile('policyWordingsFile')} />
            </Field>
            <Field label="Brochure / Sales Material">
              <UploadBox label="Upload Brochure" hint="PDF, JPG or PNG" onChange={setFile('brochureFile')} />
            </Field>
          </div>

          {/* Right — Document Table of Contents */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            <div style={{
              padding: '11px 16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>📑</span>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>Policy Document — Table of Contents</span>
            </div>
            <div style={{ maxHeight: 390, overflowY: 'auto' }}>
              {POLICY_TOC.map(item => (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveToc(prev => prev === item.id ? null : item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '10px 16px', textAlign: 'left',
                      background: activeToc === item.id ? 'var(--brand-light)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--border)',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'background .12s',
                      color: activeToc === item.id ? 'var(--brand)' : 'var(--text)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <span>{item.icon}</span>
                      <span style={{ fontWeight: activeToc === item.id ? 600 : 400 }}>{item.title}</span>
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0 }}>
                      {activeToc === item.id ? '▲' : '▼'}
                    </span>
                  </button>
                  {activeToc === item.id && (
                    <div style={{
                      padding: '12px 16px 14px', background: 'var(--brand-light)',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.75,
                    }}>
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{
              padding: '9px 16px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)',
              fontSize: 11.5, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>ℹ</span> TOC is auto-extracted from the uploaded policy wording document
            </div>
          </div>

        </div>
      </SectionBlock>

      {/* ── 4. Coverage ───────────────────────────── */}
      <SectionBlock icon="🛡️" title="Coverage Details">
        <div style={{ marginBottom: 18 }}>
          <Field label="Coverage Highlights">
            <Textarea
              placeholder="Describe key coverage points, in-patient hospitalisation, pre & post hospitalisation, day care procedures…"
              value={form.coverageDetails} onChange={set('coverageDetails')}
              style={{ minHeight: 120 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Add-ons / Riders">
            <div style={{ paddingTop: 8 }}>
              <CheckboxGroup options={ADDONS} selected={form.addOns} onChange={setArr('addOns')} />
            </div>
          </Field>
        </div>
        <div className="form-grid">
          <Field label="Policy Type">
            <Select value={form.policyType} onChange={set('policyType')}>
              <option>Base</option>
              <option>Top-up</option>
              <option>Super Top-up</option>
              <option>Comprehensive</option>
            </Select>
          </Field>
        </div>
      </SectionBlock>

      {/* ── 5. Policy Details ─────────────────────── */}
      <SectionBlock icon="📋" title="Policy Details">
        <div style={{ marginBottom: 18 }}>
          <Field label="Tenure Options">
            <div style={{ paddingTop: 8 }}>
              <CheckboxGroup options={TENURES} selected={form.tenureOptions} onChange={setArr('tenureOptions')} />
            </div>
          </Field>
        </div>
        <div className="form-grid">
          <Field label="Waiting Period (days)" required>
            <Input type="number" min="0" placeholder="e.g. 30" value={form.waitingPeriod} onChange={set('waitingPeriod')} required />
          </Field>
          <Field label="Room Rent Limit">
            <Select value={form.roomRentLimit} onChange={set('roomRentLimit')}>
              <option value="">Select limit</option>
              <option>No Limit</option>
              <option>1% of Sum Insured per day</option>
              <option>2% of Sum Insured per day</option>
              <option>₹3,000 per day</option>
              <option>₹5,000 per day</option>
              <option>₹10,000 per day</option>
              <option>Single AC Room</option>
            </Select>
          </Field>
          <Field label="Disease Restrictions" className="col-span-2">
            <Textarea placeholder="e.g. Pre-existing diseases covered after 36 months, Maternity after 2 years…" value={form.diseaseRestrictions} onChange={set('diseaseRestrictions')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 6. Terms & Conditions ────────────────── */}
      <SectionBlock icon="📜" title="Terms & Conditions (AI-Editable)">
        <div className="form-grid">
          <Field label="Eligibility Criteria" required>
            <Textarea placeholder="e.g. Persons between 18–65 years. Dependent children up to 25 years…" value={form.eligibilityCriteria} onChange={set('eligibilityCriteria')} required />
          </Field>
          <Field label="Exclusions">
            <Textarea placeholder="e.g. Cosmetic surgery, self-inflicted injuries, war-related injuries…" value={form.exclusions} onChange={set('exclusions')} />
          </Field>
          <Field label="Min Age (years)">
            <Input type="number" min="0" max="100" placeholder="18" value={form.ageMin} onChange={set('ageMin')} />
          </Field>
          <Field label="Max Age (years)">
            <Input type="number" min="0" max="100" placeholder="65" value={form.ageMax} onChange={set('ageMax')} />
          </Field>
          <Field label="Geography">
            <Select value={form.geography} onChange={set('geography')}>
              <option value="">Select geography</option>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Additional Notes">
            <Textarea placeholder="Any additional terms, conditions or notes…" value={form.notes} onChange={set('notes')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 7. IC API Mapping ──────────────────────── */}
      <SectionBlock icon="🔌" title="IC API Mapping">
        <div className="form-grid">
          <Field label="IC API Product ID">
            <Input placeholder="e.g. SHI_COMP_HEALTH_V2" value={form.icApiProductId} onChange={set('icApiProductId')} />
          </Field>
        </div>
      </SectionBlock>

      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  )
}
