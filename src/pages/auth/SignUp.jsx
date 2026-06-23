import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STEPS = [
  { num: 1, label: 'Personal',  icon: '👤' },
  { num: 2, label: 'Company',   icon: '🏢' },
  { num: 3, label: 'Address',   icon: '📍' },
  { num: 4, label: 'Banking',   icon: '🏦' },
  { num: 5, label: 'Documents', icon: '📄' },
  { num: 6, label: 'Review',    icon: '✅' },
]

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry']

const BANKS = ['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Bank of Baroda','Punjab National Bank','Canara Bank','Union Bank of India','Yes Bank','IndusInd Bank','IDFC First Bank','Federal Bank','South Indian Bank']

const INIT = {
  // Step 1
  name: '', dob: '', gender: '', mobile: '', email: '', pan: '',
  // Step 2
  companyName: '', businessType: '', irdaiNo: '', gst: '', established: '',
  // Step 3
  address1: '', address2: '', city: '', state: '', pincode: '',
  // Step 4
  bankName: '', accountNo: '', confirmAccountNo: '', ifsc: '', accountType: 'Current',
  // Step 5 (files)
  panFile: null, irdaiFile: null, chequeFile: null, gstFile: null,
}

export default function SignUp() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = k => e => { setForm(p => ({ ...p, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: '' })) }
  const setFile = k => e => setForm(p => ({ ...p, [k]: e.target.files[0] ?? null }))

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!form.name.trim())    e.name   = 'Full name is required'
      if (!form.dob)            e.dob    = 'Date of birth is required'
      if (!form.gender)         e.gender = 'Select gender'
      if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter valid email'
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan.toUpperCase())) e.pan = 'Enter valid PAN (e.g. ABCDE1234F)'
    }
    if (step === 2) {
      if (!form.companyName.trim()) e.companyName = 'Company name is required'
      if (!form.businessType)       e.businessType = 'Select business type'
      if (!form.irdaiNo.trim())     e.irdaiNo = 'IRDAI license number is required'
    }
    if (step === 3) {
      if (!form.address1.trim()) e.address1 = 'Address is required'
      if (!form.city.trim())     e.city     = 'City is required'
      if (!form.state)           e.state    = 'Select state'
      if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    }
    if (step === 4) {
      if (!form.bankName)          e.bankName   = 'Select bank'
      if (!form.accountNo.trim())  e.accountNo  = 'Account number is required'
      if (form.confirmAccountNo !== form.accountNo) e.confirmAccountNo = 'Account numbers do not match'
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.toUpperCase())) e.ifsc = 'Enter valid IFSC code'
    }
    if (step === 5) {
      if (!form.panFile)    e.panFile   = 'PAN card is required'
      if (!form.irdaiFile)  e.irdaiFile = 'IRDAI certificate is required'
      if (!form.chequeFile) e.chequeFile = 'Cancelled cheque is required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => s + 1) }
  const back = () => setStep(s => s - 1)

  const submit = () => {
    setLoading(true)
    setTimeout(() => {
      register({ ...form, pan: form.pan.toUpperCase(), irdaiNo: form.irdaiNo.toUpperCase() })
      navigate('/dashboard', { replace: true })
    }, 800)
  }

  return (
    <div style={S.page}>
      {/* ── Left branding panel ── */}
      <div style={S.panel}>
        <div style={S.panelInner}>
          <div style={S.logoBox}>KD</div>
          <div style={S.brandName}>K.M. Dastur & Co.</div>
          <div style={S.brandSub}>Insurance Brokers Pvt. Ltd.</div>
          <div style={S.divider} />
          <p style={S.panelText}>
            Join India's trusted network of IRDAI-registered insurance brokers.
            Complete your onboarding in minutes.
          </p>
          <div style={S.stepsList}>
            {STEPS.map(s => (
              <div key={s.num} style={{ ...S.stepRow, opacity: step >= s.num ? 1 : 0.45 }}>
                <div style={{ ...S.stepDot, background: step > s.num ? '#10b981' : step === s.num ? '#fff' : 'rgba(255,255,255,0.3)', color: step === s.num ? '#7c3aed' : step > s.num ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span style={{ fontSize: 13, color: step >= s.num ? '#f3e8ff' : 'rgba(255,255,255,0.4)', fontWeight: step === s.num ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form area ── */}
      <div style={S.formArea}>
        <div style={S.formCard}>
          {/* Header */}
          <div style={S.formHeader}>
            <span style={S.stepEmoji}>{STEPS[step - 1].icon}</span>
            <div>
              <div style={S.formTitle}>Step {step} of {STEPS.length} — {STEPS[step - 1].label}</div>
              <div style={S.formSub}>{stepSubtitle(step)}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={S.progressTrack}>
            <div style={{ ...S.progressBar, width: `${(step / STEPS.length) * 100}%` }} />
          </div>

          {/* Step content */}
          <div style={S.fields}>
            {step === 1 && <Step1 form={form} set={set} errors={errors} />}
            {step === 2 && <Step2 form={form} set={set} errors={errors} />}
            {step === 3 && <Step3 form={form} set={set} errors={errors} />}
            {step === 4 && <Step4 form={form} set={set} errors={errors} />}
            {step === 5 && <Step5 form={form} setFile={setFile} errors={errors} />}
            {step === 6 && <Step6 form={form} />}
          </div>

          {/* Navigation */}
          <div style={S.nav}>
            {step > 1
              ? <button type="button" style={S.backBtn} onClick={back}>← Back</button>
              : <div />
            }
            {step < 6
              ? <button type="button" style={S.nextBtn} onClick={next}>Continue →</button>
              : <button type="button" style={{ ...S.nextBtn, opacity: loading ? 0.75 : 1 }} disabled={loading} onClick={submit}>
                  {loading ? 'Registering…' : '🚀 Submit Registration'}
                </button>
            }
          </div>

          <p style={S.loginLink}>
            Already registered? <Link to="/login" style={S.link}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function stepSubtitle(n) {
  return [
    'Basic personal information for KYC verification',
    'Your firm details and IRDAI license information',
    'Registered office address for correspondence',
    'Bank account for commission disbursement',
    'Upload KYC and license documents',
    'Review all details before submitting',
  ][n - 1]
}

/* ── Step components ── */
function Step1({ form, set, errors }) {
  return (
    <div style={SF.grid}>
      <FRow label="Full Name *" err={errors.name} span={2}>
        <FInput placeholder="e.g. Kavasji Manekji Dastur" value={form.name} onChange={set('name')} />
      </FRow>
      <FRow label="Date of Birth *" err={errors.dob}>
        <FInput type="date" value={form.dob} onChange={set('dob')} max={new Date(Date.now() - 18*365.25*86400000).toISOString().split('T')[0]} />
      </FRow>
      <FRow label="Gender *" err={errors.gender}>
        <FSelect value={form.gender} onChange={set('gender')}>
          <option value="">Select</option>
          <option>Male</option><option>Female</option><option>Other</option>
        </FSelect>
      </FRow>
      <FRow label="Mobile Number *" err={errors.mobile}>
        <FInput type="tel" placeholder="10-digit mobile" value={form.mobile} onChange={set('mobile')} maxLength={10} />
      </FRow>
      <FRow label="Email Address *" err={errors.email}>
        <FInput type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
      </FRow>
      <FRow label="PAN Number *" err={errors.pan} span={2}>
        <FInput placeholder="e.g. ABCDE1234F" value={form.pan} onChange={set('pan')} style={{ textTransform: 'uppercase' }} maxLength={10} />
      </FRow>
    </div>
  )
}

function Step2({ form, set, errors }) {
  return (
    <div style={SF.grid}>
      <FRow label="Company / Firm Name *" err={errors.companyName} span={2}>
        <FInput placeholder="e.g. K.M. Dastur & Co. Insurance Brokers Pvt. Ltd." value={form.companyName} onChange={set('companyName')} />
      </FRow>
      <FRow label="Business Type *" err={errors.businessType}>
        <FSelect value={form.businessType} onChange={set('businessType')}>
          <option value="">Select type</option>
          <option>Proprietorship</option><option>Partnership</option>
          <option>Private Limited</option><option>LLP</option><option>Public Limited</option>
        </FSelect>
      </FRow>
      <FRow label="Year Established" err={errors.established}>
        <FInput type="number" placeholder="e.g. 1968" value={form.established} onChange={set('established')} min="1900" max={new Date().getFullYear()} />
      </FRow>
      <FRow label="IRDAI License Number *" err={errors.irdaiNo}>
        <FInput placeholder="e.g. CB-456/2008" value={form.irdaiNo} onChange={set('irdaiNo')} style={{ textTransform: 'uppercase' }} />
      </FRow>
      <FRow label="GST Number" err={errors.gst}>
        <FInput placeholder="e.g. 27AABCK1234M1Z5" value={form.gst} onChange={set('gst')} style={{ textTransform: 'uppercase' }} maxLength={15} />
      </FRow>
    </div>
  )
}

function Step3({ form, set, errors }) {
  return (
    <div style={SF.grid}>
      <FRow label="Address Line 1 *" err={errors.address1} span={2}>
        <FInput placeholder="Building / Street / Area" value={form.address1} onChange={set('address1')} />
      </FRow>
      <FRow label="Address Line 2" err={errors.address2} span={2}>
        <FInput placeholder="Landmark / Locality (optional)" value={form.address2} onChange={set('address2')} />
      </FRow>
      <FRow label="City *" err={errors.city}>
        <FInput placeholder="e.g. Mumbai" value={form.city} onChange={set('city')} />
      </FRow>
      <FRow label="Pincode *" err={errors.pincode}>
        <FInput type="number" placeholder="6-digit pincode" value={form.pincode} onChange={set('pincode')} maxLength={6} />
      </FRow>
      <FRow label="State *" err={errors.state} span={2}>
        <FSelect value={form.state} onChange={set('state')}>
          <option value="">Select state</option>
          {STATES.map(s => <option key={s}>{s}</option>)}
        </FSelect>
      </FRow>
    </div>
  )
}

function Step4({ form, set, errors }) {
  return (
    <div style={SF.grid}>
      <FRow label="Bank Name *" err={errors.bankName} span={2}>
        <FSelect value={form.bankName} onChange={set('bankName')}>
          <option value="">Select bank</option>
          {BANKS.map(b => <option key={b}>{b}</option>)}
        </FSelect>
      </FRow>
      <FRow label="Account Number *" err={errors.accountNo}>
        <FInput type="number" placeholder="Account number" value={form.accountNo} onChange={set('accountNo')} />
      </FRow>
      <FRow label="Confirm Account Number *" err={errors.confirmAccountNo}>
        <FInput type="number" placeholder="Re-enter account number" value={form.confirmAccountNo} onChange={set('confirmAccountNo')} />
      </FRow>
      <FRow label="IFSC Code *" err={errors.ifsc}>
        <FInput placeholder="e.g. SBIN0001234" value={form.ifsc} onChange={set('ifsc')} style={{ textTransform: 'uppercase' }} maxLength={11} />
      </FRow>
      <FRow label="Account Type *" err={errors.accountType}>
        <FSelect value={form.accountType} onChange={set('accountType')}>
          <option>Current</option><option>Savings</option>
        </FSelect>
      </FRow>
    </div>
  )
}

function Step5({ form, setFile, errors }) {
  const docs = [
    { key: 'panFile',    label: 'PAN Card *',          hint: 'JPG, PNG or PDF, max 5MB', required: true  },
    { key: 'irdaiFile',  label: 'IRDAI Certificate *', hint: 'PDF, max 10MB',             required: true  },
    { key: 'chequeFile', label: 'Cancelled Cheque *',  hint: 'JPG, PNG or PDF, max 5MB', required: true  },
    { key: 'gstFile',    label: 'GST Certificate',     hint: 'PDF, max 5MB (optional)',  required: false },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {docs.map(d => (
        <div key={d.key}>
          <label style={SF.lbl}>{d.label}</label>
          <label style={{ ...SF.uploadBox, borderColor: errors[d.key] ? '#ef4444' : form[d.key] ? '#10b981' : '#e2ddf0', background: form[d.key] ? '#f0fdf4' : '#faf9fc', cursor: 'pointer' }}>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={setFile(d.key)} />
            {form[d.key]
              ? <span style={{ color: '#10b981', fontWeight: 500, fontSize: 13 }}>✓ {form[d.key].name}</span>
              : <span style={{ color: '#64748b', fontSize: 13 }}>📎 Click to upload — {d.hint}</span>
            }
          </label>
          {errors[d.key] && <div style={SF.err}>{errors[d.key]}</div>}
        </div>
      ))}
    </div>
  )
}

function Step6({ form }) {
  const sections = [
    {
      title: '👤 Personal Details',
      rows: [['Full Name', form.name], ['Date of Birth', form.dob], ['Gender', form.gender], ['Mobile', form.mobile], ['Email', form.email], ['PAN', form.pan.toUpperCase()]],
    },
    {
      title: '🏢 Company Details',
      rows: [['Company Name', form.companyName], ['Business Type', form.businessType], ['IRDAI License', form.irdaiNo.toUpperCase()], ['GST', form.gst || '—'], ['Established', form.established || '—']],
    },
    {
      title: '📍 Address',
      rows: [['Address', [form.address1, form.address2].filter(Boolean).join(', ')], ['City', form.city], ['State', form.state], ['Pincode', form.pincode]],
    },
    {
      title: '🏦 Banking',
      rows: [['Bank', form.bankName], ['Account No.', form.accountNo ? '••••' + form.accountNo.slice(-4) : '—'], ['IFSC', form.ifsc.toUpperCase()], ['Type', form.accountType]],
    },
    {
      title: '📄 Documents',
      rows: [['PAN Card', form.panFile?.name || '—'], ['IRDAI Certificate', form.irdaiFile?.name || '—'], ['Cancelled Cheque', form.chequeFile?.name || '—'], ['GST Certificate', form.gstFile?.name || 'Not uploaded']],
    },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={SF.reviewNote}>
        Please review all details carefully. You can go back to correct anything before submitting.
      </div>
      {sections.map(sec => (
        <div key={sec.title} style={SF.reviewCard}>
          <div style={SF.reviewTitle}>{sec.title}</div>
          <div style={SF.reviewGrid}>
            {sec.rows.map(([k, v]) => (
              <div key={k} style={SF.reviewRow}>
                <span style={SF.reviewKey}>{k}</span>
                <span style={SF.reviewVal}>{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: '#5c5573', marginTop: 4 }}>
        <input type="checkbox" required style={{ marginTop: 2 }} />
        I declare that all information provided is accurate. I agree to the Terms & Conditions and confirm this application is made under the provisions of IRDAI (Insurance Brokers) Regulations, 2018.
      </label>
    </div>
  )
}

/* ── Shared field primitives ── */
function FRow({ label, err, children, span }) {
  return (
    <div style={{ gridColumn: span === 2 ? '1 / -1' : undefined }}>
      <label style={SF.lbl}>{label}</label>
      {children}
      {err && <div style={SF.err}>{err}</div>}
    </div>
  )
}
function FInput({ style, ...props }) {
  return <input {...props} style={{ ...SF.inp, ...style }} />
}
function FSelect({ children, ...props }) {
  return <select {...props} style={SF.inp}>{children}</select>
}

/* ── Styles ── */
const S = {
  page:       { minHeight: '100vh', display: 'flex' },
  panel:      { width: 280, flexShrink: 0, background: 'linear-gradient(135deg,#fb7185 0%,#a855f7 100%)', padding: '48px 28px', display: 'flex', flexDirection: 'column' },
  panelInner: { display: 'flex', flexDirection: 'column' },
  logoBox:    { width: 50, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  brandName:  { fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3 },
  brandSub:   { fontSize: 11.5, color: '#c4b5fd', marginTop: 3, marginBottom: 20 },
  divider:    { height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 0 20px' },
  panelText:  { fontSize: 13, color: '#ddd6fe', lineHeight: 1.7, marginBottom: 28 },
  stepsList:  { display: 'flex', flexDirection: 'column', gap: 10 },
  stepRow:    { display: 'flex', alignItems: 'center', gap: 10, transition: 'opacity .2s' },
  stepDot:    { width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, transition: 'background .2s, color .2s' },
  formArea:   { flex: 1, background: '#f5f4f9', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 28px', overflowY: 'auto' },
  formCard:   { width: '100%', maxWidth: 620, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '36px 40px', display: 'flex', flexDirection: 'column' },
  formHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 },
  stepEmoji:  { fontSize: 32, lineHeight: 1 },
  formTitle:  { fontSize: 17, fontWeight: 700, color: '#1a1628' },
  formSub:    { fontSize: 12.5, color: '#64748b', marginTop: 2 },
  progressTrack: { height: 4, background: '#f0edf8', borderRadius: 99, marginBottom: 28, overflow: 'hidden' },
  progressBar:   { height: '100%', background: 'linear-gradient(90deg,#fb7185,#a855f7)', borderRadius: 99, transition: 'width .4s ease' },
  fields:     { flex: 1, marginBottom: 24 },
  nav:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid #f0edf8' },
  backBtn:    { background: 'none', border: '1.5px solid #e2ddf0', color: '#5c5573', borderRadius: 8, padding: '10px 22px', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  nextBtn:    { background: 'linear-gradient(135deg,#fb7185 0%,#a855f7 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 26px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity .15s' },
  loginLink:  { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 18 },
  link:       { color: '#7c3aed', fontWeight: 600, textDecoration: 'none' },
}

const SF = {
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' },
  lbl:        { display: 'block', fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13, fontWeight: 500, color: '#5c5573', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.3px' },
  inp:        { width: '100%', padding: '9px 13px', border: '1.5px solid #e2ddf0', borderRadius: 7, fontSize: 13.5, outline: 'none', fontFamily: 'inherit', color: '#1a1628', background: '#faf9fc', boxSizing: 'border-box' },
  err:        { fontSize: 11.5, color: '#ef4444', marginTop: 4 },
  uploadBox:  { display: 'flex', alignItems: 'center', padding: '13px 16px', border: '1.5px dashed', borderRadius: 8, marginTop: 0, transition: 'all .12s' },
  reviewNote: { padding: '11px 15px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, color: '#92400e' },
  reviewCard: { border: '1px solid #f0edf8', borderRadius: 10, overflow: 'hidden' },
  reviewTitle:{ padding: '10px 16px', background: '#f5f3ff', fontSize: 13, fontWeight: 700, color: '#7c3aed', borderBottom: '1px solid #ede9fe' },
  reviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '8px 0' },
  reviewRow:  { padding: '7px 16px', display: 'flex', flexDirection: 'column', gap: 2 },
  reviewKey:  { fontSize: 13, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.3px' },
  reviewVal:  { fontSize: 13, fontWeight: 500, color: '#1a1628' },
}
