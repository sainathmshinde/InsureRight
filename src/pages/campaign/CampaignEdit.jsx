import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, Select, Textarea, SectionBlock } from '../../components/Field'
import { PageHeader, FormActions, Toggle, CheckboxGroup } from '../../components/UI'
import { CampaignIcon } from '../../icons'
import { PRODUCTS, POLICY_TYPE_ICON } from '../product/productData'
import { ASSOCIATIONS } from '../customer/orgAssocData'

const PTYPE_META = {
  'Base Policy':        { color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
  'Top Up Policy':      { color: '#0891b2', bg: '#e0f2fe', border: '#7dd3fc' },
  'Super Top Up':       { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  'OPD':                { color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
  'Age Band Premium':   { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  'Payment Protection': { color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
  'Other':              { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
}

const MOCK_DATA = {
  1: {
    name: 'Summer Health Drive 2025', type: 'Promotional',
    startDate: '2025-06-01', endDate: '2025-06-30',
    extendOption: false, targetType: 'Customer', segment: 'Active Policyholders',
    selectedProducts: [42, 6],
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
  selectedProducts: [], selectedAssociations: [], discountRules: '', offerType: 'Flat', offerValue: '',
  channels: [], messageTemplate: '', whatsappTemplateId: '',
  clickTracking: false, conversionTracking: false, status: 'Active',
}

export default function CampaignEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(MOCK_DATA[id] ?? DEFAULT)
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const setBool = f => val => setForm(p => ({ ...p, [f]: val }))

  const [assocSearch, setAssocSearch] = useState('');
  const [assocOpen, setAssocOpen]     = useState(false);

  const filteredAssoc = ASSOCIATIONS.filter(a =>
    a.name.toLowerCase().includes(assocSearch.toLowerCase())
  );

  const toggleAssoc = id =>
    setForm(prev => ({
      ...prev,
      selectedAssociations: prev.selectedAssociations.includes(id)
        ? prev.selectedAssociations.filter(x => x !== id)
        : [...prev.selectedAssociations, id],
    }));

  const toggleProduct = id =>
    setForm(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(id)
        ? prev.selectedProducts.filter(x => x !== id)
        : [...prev.selectedProducts, id],
    }))

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

            <SectionBlock icon="📦" title="Product Mapping">
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>
                  Select products to promote in this campaign
                  {form.selectedProducts.length > 0 && (
                    <span style={{ marginLeft: 8, fontWeight: 600, color: 'var(--brand)' }}>
                      · {form.selectedProducts.length} selected
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 10 }}>
                  {PRODUCTS.map(p => {
                    const sel = form.selectedProducts.includes(p.id)
                    const m = PTYPE_META[p.policyType] ?? PTYPE_META.Other
                    const icon = POLICY_TYPE_ICON[p.policyType] ?? '📋'
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProduct(p.id)}
                        style={{
                          border: `1.5px solid ${sel ? m.color : 'var(--border)'}`,
                          borderRadius: 10,
                          padding: '11px 13px',
                          cursor: 'pointer',
                          background: sel ? m.bg : '#fff',
                          transition: 'all .13s',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                          userSelect: 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 17 }}>{icon}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                              {p.policyType}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 10, color: m.color, background: '#fff', border: `1px solid ${m.border}`, borderRadius: 4, padding: '1px 5px' }}>
                              {p.code}
                            </span>
                            {sel && <span style={{ color: m.color, fontSize: 14, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text)', lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.provider}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
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
                <Field label="Association" className="col-span-2">
                  <div>
                    {form.selectedAssociations.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                        {form.selectedAssociations.map(id => {
                          const assoc = ASSOCIATIONS.find(a => a.id === id)
                          return (
                            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid var(--brand-mid)', borderRadius: 20, padding: '3px 10px 3px 12px', fontSize: 12.5, fontWeight: 500 }}>
                              {assoc?.name ?? id}
                              <button type="button" onClick={() => toggleAssoc(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          )
                        })}
                      </div>
                    )}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 12px', background: 'var(--surface)', cursor: 'text' }}
                        onClick={() => setAssocOpen(true)}
                      >
                        <input
                          type="text"
                          placeholder={form.selectedAssociations.length === 0 ? 'All Associations' : 'Add more…'}
                          value={assocSearch}
                          onChange={e => { setAssocSearch(e.target.value); setAssocOpen(true); }}
                          onFocus={() => setAssocOpen(true)}
                          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit' }}
                        />
                        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{form.selectedAssociations.length > 0 ? `${form.selectedAssociations.length} selected` : ''}</span>
                        <span style={{ color: 'var(--text-3)', fontSize: 12 }}>{assocOpen ? '▲' : '▼'}</span>
                      </div>
                      {assocOpen && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => { setAssocOpen(false); setAssocSearch(''); }} />
                          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', boxShadow: '0 4px 16px rgba(0,0,0,.1)', maxHeight: 200, overflowY: 'auto' }}>
                            {filteredAssoc.length === 0
                              ? <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-3)' }}>No associations found.</div>
                              : filteredAssoc.map(a => (
                                <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', cursor: 'pointer', fontSize: 13, background: form.selectedAssociations.includes(a.id) ? 'var(--brand-light)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
                                  <input type="checkbox" checked={form.selectedAssociations.includes(a.id)} onChange={() => toggleAssoc(a.id)} />
                                  {a.name}
                                </label>
                              ))
                            }
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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
