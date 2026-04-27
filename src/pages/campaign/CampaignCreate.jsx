import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, Input, Select, Textarea, SectionBlock } from '../../components/Field'
import { PageHeader, FormActions, Toggle, CheckboxGroup } from '../../components/UI'
import { CampaignIcon } from '../../icons'

const MOCK_PRODUCTS = [
  'Star Comprehensive Health', 'HDFC ERGO Optima', 'ICICI Lombard Health',
  'Bajaj Allianz Motor', 'New India Motor', 'LIC Jeevan Anand', 'HDFC Life Sanchay',
]

const INITIAL = {
  name: '', type: '', startDate: '', endDate: '',
  extendOption: false,
  targetType: 'Customer',
  selectedProducts: [],
  discountRules: '', offerType: 'Flat', offerValue: '',
  channels: [],
  messageTemplate: '', whatsappTemplateId: '',
  clickTracking: false, conversionTracking: false,
  status: 'Active',
}

export default function CampaignCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const setBool = f => val => setForm(p => ({ ...p, [f]: val }))

  const toggleProduct = (p) => setForm(prev => ({
    ...prev,
    selectedProducts: prev.selectedProducts.includes(p)
      ? prev.selectedProducts.filter(x => x !== p)
      : [...prev.selectedProducts, p],
  }))

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Create Campaign:', form)
    navigate('/campaign')
  }

  return (
    <div>
      <PageHeader icon={<CampaignIcon />} title="Add Campaign" subtitle="Set up a new marketing campaign">
        <button className="btn btn-ghost" onClick={() => navigate('/campaign')}>← Back</button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* ── 1. Campaign Info ──────────────────────── */}
            <SectionBlock icon="📢" title="Campaign Information">
              <div className="form-grid">
                <Field label="Campaign Name" required>
                  <Input placeholder="e.g. Summer Health Drive 2025" value={form.name} onChange={set('name')} required />
                </Field>
                <Field label="Campaign Type" required>
                  <Select value={form.type} onChange={set('type')} required>
                    <option value="">Select type</option>
                    {['Promotional','Incentive','Renewal','Awareness','Onboarding','Seasonal'].map(t => <option key={t}>{t}</option>)}
                  </Select>
                </Field>
                <Field label="Start Date" required>
                  <Input type="date" value={form.startDate} onChange={set('startDate')} required />
                </Field>
                <Field label="End Date" required>
                  <Input type="date" value={form.endDate} onChange={set('endDate')} required />
                </Field>
                <Field label="Extend Option">
                  <div style={{ paddingTop: 8 }}>
                    <Toggle checked={form.extendOption} onChange={setBool('extendOption')} label="Allow campaign end-date extension" />
                  </div>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onChange={set('status')}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* ── 2. Audience ───────────────────────────── */}
            <SectionBlock icon="🎯" title="Audience">
              <div className="form-grid">
                <Field label="Target Type" required>
                  <Select value={form.targetType} onChange={set('targetType')} required>
                    <option>Customer</option>
                    <option>Agent</option>
                  </Select>
                </Field>
                <Field label="Select Segment">
                  <Select value={form.segment} onChange={set('segment')}>
                    <option value="">All {form.targetType}s</option>
                    <option>Active Policyholders</option>
                    <option>Renewal Due (30 days)</option>
                    <option>Lapsed Customers</option>
                    <option>New Registrations</option>
                    <option>High Value Customers</option>
                  </Select>
                </Field>
                <Field label="Upload Customer List">
                  <label className="upload-box">
                    <input type="file" style={{ display: 'none' }} accept=".csv,.xlsx" />
                    <div className="upload-icon">📋</div>
                    <div className="upload-label">Upload CSV / Excel list</div>
                    <div className="upload-hint">Overrides segment if provided</div>
                  </label>
                </Field>
              </div>
            </SectionBlock>

            {/* ── 3. Product Mapping ────────────────────── */}
            <SectionBlock icon="📦" title="Product Mapping">
              <Field label="Select Products to Promote">
                <div style={{ paddingTop: 6 }}>
                  <CheckboxGroup
                    options={MOCK_PRODUCTS}
                    selected={form.selectedProducts}
                    onChange={v => setForm(p => ({ ...p, selectedProducts: v }))}
                  />
                </div>
              </Field>
              <div className="form-grid" style={{ marginTop: 18 }}>
                <Field label="Offer Type">
                  <Select value={form.offerType} onChange={set('offerType')}>
                    <option value="Flat">Flat (₹)</option>
                    <option value="Percent">Percentage (%)</option>
                  </Select>
                </Field>
                <Field label={`Discount Value ${form.offerType === 'Flat' ? '(₹)' : '(%)'}`}>
                  <Input
                    type="number" min="0"
                    placeholder={form.offerType === 'Flat' ? 'e.g. 500' : 'e.g. 10'}
                    value={form.offerValue} onChange={set('offerValue')}
                  />
                </Field>
                <Field label="Discount Rules" className="col-span-2">
                  <Textarea placeholder="Describe applicable discount conditions…" value={form.discountRules} onChange={set('discountRules')} />
                </Field>
              </div>
            </SectionBlock>

            {/* ── 4. Channels ──────────────────────────── */}
            <SectionBlock icon="📡" title="Communication Channels">
              <Field label="Active Channels">
                <div style={{ paddingTop: 6 }}>
                  <CheckboxGroup
                    options={['SMS', 'WhatsApp (Meta API)', 'Email', 'App Notification']}
                    selected={form.channels}
                    onChange={v => setForm(p => ({ ...p, channels: v }))}
                  />
                </div>
              </Field>
            </SectionBlock>

            {/* ── 5. Content ───────────────────────────── */}
            <SectionBlock icon="✍️" title="Message Content">
              <div className="form-grid">
                <Field label="Message Template" required={form.channels.length > 0}>
                  <Textarea
                    placeholder="Hi {customer_name}, your health cover from {ic_name} is due for renewal…"
                    value={form.messageTemplate} onChange={set('messageTemplate')}
                    style={{ minHeight: 100 }}
                  />
                </Field>
                <Field label="WhatsApp Template ID">
                  <Input
                    placeholder="e.g. summer_health_v1"
                    value={form.whatsappTemplateId} onChange={set('whatsappTemplateId')}
                    disabled={!form.channels.includes('WhatsApp (Meta API)')}
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* ── 6. Tracking ──────────────────────────── */}
            <SectionBlock icon="📊" title="Tracking">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle checked={form.clickTracking} onChange={setBool('clickTracking')} label="Enable Click Tracking (UTM / link tracking)" />
                <Toggle checked={form.conversionTracking} onChange={setBool('conversionTracking')} label="Enable Conversion Tracking (policy issued after campaign click)" />
              </div>
            </SectionBlock>

            <FormActions onCancel={() => navigate('/campaign')} submitLabel="Create Campaign" />
          </form>
        </div>
      </div>
    </div>
  )
}
