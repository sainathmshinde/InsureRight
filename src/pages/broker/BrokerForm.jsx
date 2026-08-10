import { Field, Input, DateInput, Select, Textarea, UploadBox, SectionBlock } from '../../components/Field'
import { useFormValidation } from '../../hooks/useFormValidation'
import { useToast } from '../../context/ToastContext'

export default function BrokerForm({ form, set, setFile, onSubmit, onCancel, submitLabel = 'Save Broker' }) {
  const toast = useToast()

  const fv = useFormValidation(form, {
    brokerName: { required: true, label: 'Broker Name' },
    companyName: { required: true, label: 'Company Name' },
    brokerType: { required: true, label: 'Broker Type' },
    licenseNumber: { required: true, label: 'IRDAI License Number' },
    licenseValidity: { required: true, label: 'License Validity Date' },
    panNumber: { required: true, label: 'PAN Number' },
    aadhaarNumber: { required: true, label: 'Aadhaar Number' },
    email: { required: true, label: 'Email' },
    mobile: { required: true, label: 'Mobile Number' },
    registeredAddress: { required: true, label: 'Registered Address' },
    city: { required: true, label: 'City' },
    state: { required: true, label: 'State' },
    pincode: { required: true, label: 'Pincode' },
    accountHolder: { required: true, label: 'Account Holder Name' },
    bankName: { required: true, label: 'Bank Name' },
    accountNumber: { required: true, label: 'Account Number' },
    ifscCode: { required: true, label: 'IFSC Code' },
    kycStatus: { required: true, label: 'KYC Status' },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fv.validateAll()) {
      toast.error('Please fix the highlighted fields before continuing.')
      return
    }
    toast.success('Broker saved successfully.')
    onSubmit(e)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* ── 1. Basic Information ─────────────── */}
      <SectionBlock icon="📋" title="Basic Information">
        <div className="form-grid-3">
          <Field label="Broker Name" required error={fv.fieldProps('brokerName').error}>
            <Input placeholder="Enter broker name" value={form.brokerName} onChange={set('brokerName')} required {...fv.fieldProps('brokerName')} />
          </Field>
          <Field label="Company Name" required error={fv.fieldProps('companyName').error}>
            <Input placeholder="Enter company name" value={form.companyName} onChange={set('companyName')} required {...fv.fieldProps('companyName')} />
          </Field>
          <Field label="Broker Type" required error={fv.fieldProps('brokerType').error}>
            <Select value={form.brokerType} onChange={set('brokerType')} required {...fv.fieldProps('brokerType')}>
              <option value="">Select type</option>
              <option>Individual</option>
              <option>Corporate</option>
            </Select>
          </Field>
          <Field label="IRDAI License Number" required error={fv.fieldProps('licenseNumber').error}>
            <Input placeholder="IRDAI-XXXX-XXXX" value={form.licenseNumber} onChange={set('licenseNumber')} required {...fv.fieldProps('licenseNumber')} />
          </Field>
          <Field label="License Validity Date" required error={fv.fieldProps('licenseValidity').error}>
            <DateInput value={form.licenseValidity} onChange={set('licenseValidity')} required {...fv.fieldProps('licenseValidity')} />
          </Field>
          <Field label="GST Number">
            <Input placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={set('gstNumber')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 2. KYC Details ───────────────────── */}
      <SectionBlock icon="🪪" title="KYC Info">
        <div className="form-grid-3">
          <Field label="PAN Number" required error={fv.fieldProps('panNumber').error}>
            <Input placeholder="ABCDE1234F" value={form.panNumber} onChange={set('panNumber')} required {...fv.fieldProps('panNumber')} />
          </Field>
          <Field label="Aadhaar Number" required error={fv.fieldProps('aadhaarNumber').error}>
            <Input placeholder="XXXX XXXX XXXX" value={form.aadhaarNumber} onChange={set('aadhaarNumber')} required {...fv.fieldProps('aadhaarNumber')} />
          </Field>
          <Field label="Upload PAN">
            <UploadBox label="Upload PAN card" hint="JPG, PNG or PDF" value={form.panFile} onChange={setFile('panFile')} />
          </Field>
          <Field label="Upload Aadhaar">
            <UploadBox label="Upload Aadhaar card" hint="JPG, PNG or PDF" value={form.aadhaarFile} onChange={setFile('aadhaarFile')} />
          </Field>
          <Field label="KYC Status" required error={fv.fieldProps('kycStatus').error}>
            <Select value={form.kycStatus} onChange={set('kycStatus')} {...fv.fieldProps('kycStatus')}>
              <option>Pending</option>
              <option>Verified</option>
              <option>Rejected</option>
            </Select>
          </Field>
        </div>
      </SectionBlock>

      {/* ── 3. Contact Details ───────────────── */}
      <SectionBlock icon="📞" title="Contact Info">
        <div className="form-grid-3">
          <Field label="Email" required error={fv.fieldProps('email').error}>
            <Input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required {...fv.fieldProps('email')} />
          </Field>
          <Field label="Mobile Number" required error={fv.fieldProps('mobile').error}>
            <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={set('mobile')} required {...fv.fieldProps('mobile')} />
          </Field>
          <Field label="Alternate Contact">
            <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.alternateContact} onChange={set('alternateContact')} />
          </Field>
          <Field label="Website URL">
            <Input type="url" placeholder="https://example.com" value={form.website} onChange={set('website')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 4. Address ───────────────────────── */}
      <SectionBlock icon="📍" title="Address">
        <div className="form-grid-3">
          <Field label="Registered Address" required error={fv.fieldProps('registeredAddress').error}>
            <Textarea placeholder="Enter registered address" value={form.registeredAddress} onChange={set('registeredAddress')} required {...fv.fieldProps('registeredAddress')} />
          </Field>
          <Field label="Communication Address">
            <Textarea placeholder="Enter communication address" value={form.communicationAddress} onChange={set('communicationAddress')} />
          </Field>
        </div>
        <div className="form-grid-3" style={{ marginTop: 18 }}>
          <Field label="City" required error={fv.fieldProps('city').error}>
            <Input placeholder="City" value={form.city} onChange={set('city')} required {...fv.fieldProps('city')} />
          </Field>
          <Field label="State" required error={fv.fieldProps('state').error}>
            <Select value={form.state} onChange={set('state')} required {...fv.fieldProps('state')}>
              <option value="">Select state</option>
              {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Telangana','Kerala'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Pincode" required error={fv.fieldProps('pincode').error}>
            <Input placeholder="400001" maxLength={6} value={form.pincode} onChange={set('pincode')} required {...fv.fieldProps('pincode')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 5. Bank Details ──────────────────── */}
      <SectionBlock icon="🏦" title="Bank Info (Commission Payout)">
        <div className="form-grid-3">
          <Field label="Account Holder Name" required error={fv.fieldProps('accountHolder').error}>
            <Input placeholder="Full name as per bank" value={form.accountHolder} onChange={set('accountHolder')} required {...fv.fieldProps('accountHolder')} />
          </Field>
          <Field label="Bank Name" required error={fv.fieldProps('bankName').error}>
            <Input placeholder="e.g. HDFC Bank" value={form.bankName} onChange={set('bankName')} required {...fv.fieldProps('bankName')} />
          </Field>
          <Field label="Account Number" required error={fv.fieldProps('accountNumber').error}>
            <Input placeholder="Enter account number" value={form.accountNumber} onChange={set('accountNumber')} required {...fv.fieldProps('accountNumber')} />
          </Field>
          <Field label="IFSC Code" required error={fv.fieldProps('ifscCode').error}>
            <Input placeholder="HDFC0001234" value={form.ifscCode} onChange={set('ifscCode')} required {...fv.fieldProps('ifscCode')} />
          </Field>
          <Field label="Cancelled Cheque">
            <UploadBox label="Upload cancelled cheque" hint="JPG, PNG or PDF" value={form.cancelledCheque} onChange={setFile('cancelledCheque')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 6. Agreement & Compliance ────────── */}
      <SectionBlock icon="📄" title="Agreement & Compliance">
        <div className="form-grid-3">
          <Field label="Agreement Upload">
            <UploadBox label="Upload agreement (PDF)" hint="PDF only" value={form.agreementFile} onChange={setFile('agreementFile')} />
          </Field>
          <Field label="Compliance Notes">
            <Textarea placeholder="Enter compliance notes..." value={form.complianceNotes} onChange={set('complianceNotes')} />
          </Field>
          <Field label="Agreement Start Date">
            <DateInput value={form.agreementStart} onChange={set('agreementStart')} />
          </Field>
          <Field label="Agreement End Date">
            <DateInput value={form.agreementEnd} onChange={set('agreementEnd')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── Actions ──────────────────────────── */}
      <div className="actions-row">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
