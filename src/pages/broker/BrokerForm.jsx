import { Field, Input, Select, Textarea, UploadBox, SectionBlock } from '../../components/Field'

export default function BrokerForm({ form, set, setFile, onSubmit, onCancel, submitLabel = 'Save Broker' }) {
  return (
    <form onSubmit={onSubmit}>

      {/* ── 1. Basic Information ─────────────── */}
      <SectionBlock icon="📋" title="Basic Information">
        <div className="form-grid-3">
          <Field label="Broker Name" required>
            <Input placeholder="Enter broker name" value={form.brokerName} onChange={set('brokerName')} required />
          </Field>
          <Field label="Company Name" required>
            <Input placeholder="Enter company name" value={form.companyName} onChange={set('companyName')} required />
          </Field>
          <Field label="Broker Type" required>
            <Select value={form.brokerType} onChange={set('brokerType')} required>
              <option value="">Select type</option>
              <option>Individual</option>
              <option>Corporate</option>
            </Select>
          </Field>
          <Field label="IRDAI License Number" required>
            <Input placeholder="IRDAI-XXXX-XXXX" value={form.licenseNumber} onChange={set('licenseNumber')} required />
          </Field>
          <Field label="License Validity Date" required>
            <Input type="date" value={form.licenseValidity} onChange={set('licenseValidity')} required />
          </Field>
          <Field label="GST Number">
            <Input placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={set('gstNumber')} />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 2. KYC Details ───────────────────── */}
      <SectionBlock icon="🪪" title="KYC Info">
        <div className="form-grid-3">
          <Field label="PAN Number" required>
            <Input placeholder="ABCDE1234F" value={form.panNumber} onChange={set('panNumber')} required />
          </Field>
          <Field label="Aadhaar Number" required>
            <Input placeholder="XXXX XXXX XXXX" value={form.aadhaarNumber} onChange={set('aadhaarNumber')} required />
          </Field>
          <Field label="Upload PAN">
            <UploadBox label="Upload PAN card" hint="JPG, PNG or PDF" value={form.panFile} onChange={setFile('panFile')} />
          </Field>
          <Field label="Upload Aadhaar">
            <UploadBox label="Upload Aadhaar card" hint="JPG, PNG or PDF" value={form.aadhaarFile} onChange={setFile('aadhaarFile')} />
          </Field>
          <Field label="KYC Status" required>
            <Select value={form.kycStatus} onChange={set('kycStatus')}>
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
          <Field label="Email" required>
            <Input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
          </Field>
          <Field label="Mobile Number" required>
            <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.mobile} onChange={set('mobile')} required />
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
          <Field label="Registered Address" required>
            <Textarea placeholder="Enter registered address" value={form.registeredAddress} onChange={set('registeredAddress')} required />
          </Field>
          <Field label="Communication Address">
            <Textarea placeholder="Enter communication address" value={form.communicationAddress} onChange={set('communicationAddress')} />
          </Field>
        </div>
        <div className="form-grid-3" style={{ marginTop: 18 }}>
          <Field label="City" required>
            <Input placeholder="City" value={form.city} onChange={set('city')} required />
          </Field>
          <Field label="State" required>
            <Select value={form.state} onChange={set('state')} required>
              <option value="">Select state</option>
              {['Maharashtra','Delhi','Karnataka','Tamil Nadu','Gujarat','Rajasthan','Uttar Pradesh','West Bengal','Telangana','Kerala'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Pincode" required>
            <Input placeholder="400001" maxLength={6} value={form.pincode} onChange={set('pincode')} required />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 5. Bank Details ──────────────────── */}
      <SectionBlock icon="🏦" title="Bank Info (Commission Payout)">
        <div className="form-grid-3">
          <Field label="Account Holder Name" required>
            <Input placeholder="Full name as per bank" value={form.accountHolder} onChange={set('accountHolder')} required />
          </Field>
          <Field label="Bank Name" required>
            <Input placeholder="e.g. HDFC Bank" value={form.bankName} onChange={set('bankName')} required />
          </Field>
          <Field label="Account Number" required>
            <Input placeholder="Enter account number" value={form.accountNumber} onChange={set('accountNumber')} required />
          </Field>
          <Field label="IFSC Code" required>
            <Input placeholder="HDFC0001234" value={form.ifscCode} onChange={set('ifscCode')} required />
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
            <Input type="date" value={form.agreementStart} onChange={set('agreementStart')} />
          </Field>
          <Field label="Agreement End Date">
            <Input type="date" value={form.agreementEnd} onChange={set('agreementEnd')} />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set('status')}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
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
