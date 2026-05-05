import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, SectionBlock } from '../../components/Field'
import { IC_MAP } from './icData'

export default function ICEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(IC_MAP[Number(id)] ?? {})
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Update IC:', id, form)
    navigate('/ic')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">Edit Insurance Company</div>
            <div className="page-subtitle">Update IC master information</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/ic/${id}/integration`)}>Integration Setup</button>
          <button className="btn btn-ghost" onClick={() => navigate('/ic')}>← Back</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon="🏦" title="IC Master Information">
              <div className="form-grid">
                <Field label="IC Name" required>
                  <Input placeholder="IC Name" value={form.icName || ''} onChange={set('icName')} required />
                </Field>
                <Field label="IC Code" required>
                  <Input placeholder="e.g. SHI" value={form.code || ''} onChange={set('code')} required />
                </Field>
                <Field label="Contact Person">
                  <Input placeholder="Primary contact name" value={form.contactPerson || ''} onChange={set('contactPerson')} />
                </Field>
                <Field label="Email" required>
                  <Input type="email" placeholder="api@example.com" value={form.email || ''} onChange={set('email')} required />
                </Field>
                <Field label="Phone">
                  <Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone || ''} onChange={set('phone')} />
                </Field>
                <Field label="Status">
                  <Select value={form.status || 'Active'} onChange={set('status')}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🔌" title="API Credentials">
              <div className="form-grid">
                <Field label="API Base URL" required>
                  <Input type="url" placeholder="https://api.example.com/v1" value={form.apiBaseUrl || ''} onChange={set('apiBaseUrl')} required />
                </Field>
                <Field label="API Key" required>
                  <Input placeholder="Enter API key" value={form.apiKey || ''} onChange={set('apiKey')} required />
                </Field>
                <Field label="API Secret" required>
                  <Input type="password" placeholder="Enter API secret" value={form.apiSecret || ''} onChange={set('apiSecret')} required />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/ic')}>Cancel</button>
              <button type="submit" className="btn btn-primary">Update IC</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
