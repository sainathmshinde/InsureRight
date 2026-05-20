import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, SectionBlock } from '../../components/Field'
import { IntegrationIcon } from '../../icons'

const MOCK_DATA = {
  1: { apiMappingId: 'MAP-SHI-001', productEndpoint: '/products/list', premiumEndpoint: '/premium/calculate', policyEndpoint: '/policy/issue', webhookUrl: 'https://insureright.in/webhook/shi', timeout: '30', retryCount: '3' },
  2: { apiMappingId: 'MAP-HER-002', productEndpoint: '/v2/products', premiumEndpoint: '/v2/premium', policyEndpoint: '/v2/policy/create', webhookUrl: 'https://insureright.in/webhook/her', timeout: '45', retryCount: '2' },
}

const IC_NAMES = { 1: 'Star Health Insurance', 2: 'HDFC ERGO', 3: 'ICICI Lombard' }

export default function ICIntegration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(MOCK_DATA[id] ?? {
    apiMappingId: '', productEndpoint: '', premiumEndpoint: '',
    policyEndpoint: '', webhookUrl: '', timeout: '30', retryCount: '3',
  })
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Save integration config:', id, form)
    navigate('/ic')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><IntegrationIcon /></div>
          <div>
            <div className="page-title">IC Integration Setup</div>
            <div className="page-subtitle">{IC_NAMES[id] ?? `IC #${id}`} — API mapping and endpoint configuration</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/ic/${id}/edit`)}>Edit IC</button>
          <button className="btn btn-ghost" onClick={() => navigate('/ic')}>← Back</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <SectionBlock icon="🗺️" title="API Mapping">
              <div className="form-grid">
                <Field label="API Mapping ID" required>
                  <Input placeholder="MAP-XXX-001" value={form.apiMappingId} onChange={set('apiMappingId')} required />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="🔗" title="API Endpoints">
              <div className="form-grid">
                <Field label="Product API Endpoint" required>
                  <Input placeholder="/products/list" value={form.productEndpoint} onChange={set('productEndpoint')} required />
                </Field>
                <Field label="Premium API Endpoint" required>
                  <Input placeholder="/premium/calculate" value={form.premiumEndpoint} onChange={set('premiumEndpoint')} required />
                </Field>
                <Field label="Policy Issuance API" required>
                  <Input placeholder="/policy/issue" value={form.policyEndpoint} onChange={set('policyEndpoint')} required />
                </Field>
                <Field label="Webhook URL">
                  <Input type="url" placeholder="https://yourdomain.com/webhook" value={form.webhookUrl} onChange={set('webhookUrl')} />
                </Field>
              </div>
            </SectionBlock>

            <SectionBlock icon="⚙️" title="Timeout & Retry Config">
              <div className="form-grid">
                <Field label="Timeout (seconds)" required>
                  <Input type="number" min="5" max="120" placeholder="30" value={form.timeout} onChange={set('timeout')} required />
                </Field>
                <Field label="Retry Count" required>
                  <Input type="number" min="0" max="10" placeholder="3" value={form.retryCount} onChange={set('retryCount')} required />
                </Field>
              </div>
            </SectionBlock>

            {/* Connection test strip */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 13.5 }}>Test API Connection</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>Send a ping to verify credentials and endpoint</div>
              </div>
              <button type="button" className="btn btn-secondary">🔁 Test Connection</button>
            </div>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/ic')}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Integration</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
