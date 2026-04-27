import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, Textarea, SectionBlock } from '../../components/Field'
import { PageHeader, FormActions, Toggle, CheckboxGroup } from '../../components/UI'
import { CampaignIcon } from '../../icons'

const MOCK_PRODUCTS = [
  'Star Comprehensive Health', 'HDFC ERGO Optima', 'ICICI Lombard Health',
  'Bajaj Allianz Motor', 'New India Motor', 'LIC Jeevan Anand', 'HDFC Life Sanchay',
]

const MOCK_DATA = {
  1: {
    name: 'Summer Health Drive 2025', type: 'Promotional',
    startDate: '2025-06-01', endDate: '2025-06-30',
    extendOption: false, targetType: 'Customer', segment: 'Active Policyholders',
    selectedProducts: ['Star Comprehensive Health', 'HDFC ERGO Optima'],
    discountRules: 'Applicable on family floater plans only', offerType: 'Percent', offerValue: '10',
    channels: ['SMS', 'Email'],
    messageTemplate: 'Hi {customer_name}, enjoy 10% off on Star Health this summer!',
    whatsappTemplateId: '', clickTracking: true, conversionTracking: true,
    status: 'Active',
  },
  2: {
    name: 'Agent Incentive Q2', type: 'Incentive',
    startDate: '2025-04-01', endDate: '2025-06-30',
    extendOption: false, targetType: 'Agent', segment: '',
    selectedProducts: [],
    discountRules: '', offerType: 'Flat', offerValue: '',
    channels: ['WhatsApp (Meta API)', 'Email'],
    messageTemplate: 'Dear Agent, earn extra commission this quarter. Call for details.',
    whatsappTemplateId: 'agent_incentive_q2',
    clickTracking: false, conversionTracking: false,
    status: 'Active',
  },
}

const DEFAULT = {
  name: '', type: '', startDate: '', endDate: '',
  extendOption: false, targetType: 'Customer', segment: '',
  selectedProducts: [], discountRules: '', offerType: 'Flat', offerValue: '',
  channels: [], messageTemplate: '', whatsappTemplateId: '',
  clickTracking: false, conversionTracking: false, status: 'Active',
}

export default function CampaignEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(MOCK_DATA[id] ?? DEFAULT)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const setBool = f => val => setForm(p => ({ ...p, [f]: val }))

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Update Campaign:', id, form)
    navigate('/campaign')
  }

  return (
    <div>
      <PageHeader icon={<CampaignIcon />} title="Edit Campaign" subtitle="Update campaign settings and content">
        <button className="btn btn-ghost" onClick={() => navigate('/campaign')}>← Back</button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <SectionBlock icon="📢" title="Campaign Information">
              <div className="form-grid">
                <Field label="Campaign Name" required>
                  <Input placeholder="Campaign name" value={form.name} onChange={set('name')} required />
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

            <SectionBlock icon="🎯" title="Audience">
              <div className="form-grid">
                <Field label="Target Type" required>
                  <Select value={form.targetType} onChange={set('targetType')}>
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
              </div>
            </SectionBlock>

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
                  <Input type="number" min="0" placeholder="e.g. 10" value={form.offerValue} onChange={set('offerValue')} />
                </Field>
                <Field label="Discount Rules" className="col-span-2">
                  <Textarea placeholder="Describe applicable discount conditions…" value={form.discountRules} onChange={set('discountRules')} />
                </Field>
              </div>
            </SectionBlock>

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

            <SectionBlock icon="✍️" title="Message Content">
              <div className="form-grid">
                <Field label="Message Template">
                  <Textarea
                    placeholder="Hi {customer_name}…"
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

            <SectionBlock icon="📊" title="Tracking">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Toggle checked={form.clickTracking} onChange={setBool('clickTracking')} label="Enable Click Tracking" />
                <Toggle checked={form.conversionTracking} onChange={setBool('conversionTracking')} label="Enable Conversion Tracking" />
              </div>
            </SectionBlock>

            <FormActions onCancel={() => navigate('/campaign')} submitLabel="Update Campaign" />
          </form>
        </div>
      </div>
    </div>
  )
}
