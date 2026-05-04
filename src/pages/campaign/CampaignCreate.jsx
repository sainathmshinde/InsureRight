import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field, Input, Select, Textarea, SectionBlock } from '../../components/Field'
import { PageHeader, FormActions, Toggle, CheckboxGroup } from '../../components/UI'
import { Tabs } from '../../components/ui/Tabs'
import { CampaignIcon } from '../../icons'

const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu & Kashmir',
]

const MOCK_USERS = [
  { id:1,  name:'Aarav Sharma',    age:34, gender:'Male',   marital:'Married',  segment:'Active Policyholders',    type:'Customer', state:'Maharashtra'    },
  { id:2,  name:'Priya Mehta',     age:28, gender:'Female', marital:'Single',   segment:'New Registrations',       type:'Customer', state:'Gujarat'        },
  { id:3,  name:'Rohan Verma',     age:52, gender:'Male',   marital:'Married',  segment:'Renewal Due (30 days)',   type:'Customer', state:'Delhi'          },
  { id:4,  name:'Sneha Iyer',      age:41, gender:'Female', marital:'Divorced', segment:'High Value Customers',    type:'Customer', state:'Karnataka'      },
  { id:5,  name:'Karan Patel',     age:23, gender:'Male',   marital:'Single',   segment:'New Registrations',       type:'Customer', state:'Gujarat'        },
  { id:6,  name:'Divya Nair',      age:37, gender:'Female', marital:'Married',  segment:'Active Policyholders',    type:'Customer', state:'Kerala'         },
  { id:7,  name:'Arjun Singh',     age:60, gender:'Male',   marital:'Widowed',  segment:'Renewal Due (30 days)',   type:'Customer', state:'Punjab'         },
  { id:8,  name:'Meera Joshi',     age:45, gender:'Female', marital:'Married',  segment:'Lapsed Customers',        type:'Customer', state:'Rajasthan'      },
  { id:9,  name:'Vikram Rao',      age:31, gender:'Male',   marital:'Single',   segment:'Active Policyholders',    type:'Customer', state:'Telangana'      },
  { id:10, name:'Anjali Desai',    age:29, gender:'Female', marital:'Married',  segment:'New Registrations',       type:'Customer', state:'Maharashtra'    },
  { id:11, name:'Rahul Gupta',     age:48, gender:'Male',   marital:'Married',  segment:'High Value Customers',    type:'Customer', state:'Uttar Pradesh'  },
  { id:12, name:'Pooja Reddy',     age:33, gender:'Female', marital:'Single',   segment:'Active Policyholders',    type:'Customer', state:'Telangana'      },
  { id:13, name:'Suresh Kumar',    age:55, gender:'Male',   marital:'Married',  segment:'Renewal Due (30 days)',   type:'Customer', state:'Tamil Nadu'     },
  { id:14, name:'Kavita Pillai',   age:26, gender:'Female', marital:'Single',   segment:'New Registrations',       type:'Customer', state:'Kerala'         },
  { id:15, name:'Nikhil Bansal',   age:39, gender:'Male',   marital:'Divorced', segment:'Lapsed Customers',        type:'Customer', state:'Delhi'          },
  { id:16, name:'Swati Tiwari',    age:44, gender:'Female', marital:'Married',  segment:'Active Policyholders',    type:'Customer', state:'Madhya Pradesh' },
  { id:17, name:'Amit Saxena',     age:57, gender:'Male',   marital:'Married',  segment:'High Value Customers',    type:'Customer', state:'Uttar Pradesh'  },
  { id:18, name:'Ritu Bhatia',     age:22, gender:'Female', marital:'Single',   segment:'New Registrations',       type:'Customer', state:'Haryana'        },
  { id:19, name:'Deepak Mishra',   age:36, gender:'Male',   marital:'Married',  segment:'Active Policyholders',    type:'Customer', state:'Bihar'          },
  { id:20, name:'Nisha Chauhan',   age:50, gender:'Female', marital:'Widowed',  segment:'Lapsed Customers',        type:'Customer', state:'Rajasthan'      },
  { id:21, name:'Rajesh Agarwal',  age:43, gender:'Male',   marital:'Married',  segment:'Renewal Due (30 days)',   type:'Agent',    state:'Maharashtra'    },
  { id:22, name:'Sunita Yadav',    age:30, gender:'Female', marital:'Single',   segment:'Active Policyholders',    type:'Agent',    state:'Uttar Pradesh'  },
  { id:23, name:'Manoj Tomar',     age:47, gender:'Male',   marital:'Married',  segment:'High Value Customers',    type:'Agent',    state:'Delhi'          },
  { id:24, name:'Geeta Rawat',     age:35, gender:'Female', marital:'Divorced', segment:'Active Policyholders',    type:'Agent',    state:'Uttarakhand'    },
  { id:25, name:'Sanjay Kapoor',   age:53, gender:'Male',   marital:'Married',  segment:'Renewal Due (30 days)',   type:'Agent',    state:'Punjab'         },
  { id:26, name:'Lakshmi Menon',   age:27, gender:'Female', marital:'Single',   segment:'New Registrations',       type:'Agent',    state:'Tamil Nadu'     },
  { id:27, name:'Vivek Pandey',    age:40, gender:'Male',   marital:'Married',  segment:'Lapsed Customers',        type:'Agent',    state:'Madhya Pradesh' },
  { id:28, name:'Anita Soni',      age:32, gender:'Female', marital:'Married',  segment:'Active Policyholders',    type:'Agent',    state:'Gujarat'        },
  { id:29, name:'Harish Dubey',    age:58, gender:'Male',   marital:'Widowed',  segment:'High Value Customers',    type:'Agent',    state:'Karnataka'      },
  { id:30, name:'Rekha Malhotra',  age:24, gender:'Female', marital:'Single',   segment:'New Registrations',       type:'Agent',    state:'West Bengal'    },
]

const PAGE_SIZE = 10

const MOCK_PRODUCTS = [
  'Star Comprehensive Health', 'HDFC ERGO Optima', 'ICICI Lombard Health',
  'Bajaj Allianz Motor', 'New India Motor', 'LIC Jeevan Anand', 'HDFC Life Sanchay',
]

const INITIAL = {
  name: '', type: '', startDate: '', endDate: '',
  extendOption: false,
  targetType: 'Customer', segment: '',
  ageMin: '', ageMax: '', gender: '', maritalStatus: '', state: '',
  selectedProducts: [],
  discountRules: '', offerType: 'Flat', offerValue: '',
  channels: [],
  messageTemplate: '', whatsappTemplateId: '',
  clickTracking: false, conversionTracking: false,
  status: 'Active',
}

const toInputDate = v => {
  if (!v) return ''
  const [dd, mm, yyyy] = v.split('/')
  return `${yyyy}-${mm}-${dd}`
}
const fromInputDate = v => {
  if (!v) return ''
  const [yyyy, mm, dd] = v.split('-')
  return `${dd}/${mm}/${yyyy}`
}

export default function CampaignCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [audienceTab, setAudienceTab] = useState('filter')
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const setDate = f => e => setForm(p => ({ ...p, [f]: fromInputDate(e.target.value) }))
  const setBool = f => val => setForm(p => ({ ...p, [f]: val }))

  const [filteredUsers, setFilteredUsers] = useState([])
  const [userPage, setUserPage] = useState(1)
  const [tableVisible, setTableVisible] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState(new Set())

  const handleFilterUsers = () => {
    const min = form.ageMin ? Number(form.ageMin) : 0
    const max = form.ageMax ? Number(form.ageMax) : 999
    const results = MOCK_USERS.filter(u => {
      if (u.type !== form.targetType) return false
      if (form.segment && u.segment !== form.segment) return false
      if (u.age < min || u.age > max) return false
      if (form.gender && u.gender !== form.gender) return false
      if (form.maritalStatus && u.marital !== form.maritalStatus) return false
      if (form.state && u.state !== form.state) return false
      return true
    })
    setFilteredUsers(results)
    setUserPage(1)
    setTableVisible(true)
    setSelectedUserIds(new Set())
  }

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)
  const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE)

  const allPageSelected = pagedUsers.length > 0 && pagedUsers.every(u => selectedUserIds.has(u.id))
  const somePageSelected = pagedUsers.some(u => selectedUserIds.has(u.id)) && !allPageSelected

  const toggleUser = id => setSelectedUserIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const togglePageAll = () => {
    setSelectedUserIds(prev => {
      const next = new Set(prev)
      if (allPageSelected) pagedUsers.forEach(u => next.delete(u.id))
      else pagedUsers.forEach(u => next.add(u.id))
      return next
    })
  }

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
                  <Input type="date" value={toInputDate(form.startDate)} onChange={setDate('startDate')} required />
                </Field>
                <Field label="End Date" required>
                  <Input type="date" value={toInputDate(form.endDate)} onChange={setDate('endDate')} required />
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
              <Tabs
                tabs={[
                  { key: 'filter', label: 'Filter for User' },
                  { key: 'upload', label: 'Upload Customer List' },
                ]}
                active={audienceTab}
                onChange={setAudienceTab}
              />
              {audienceTab === 'filter' && (
                <div className="form-grid" style={{ marginTop: 16 }}>
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
                  <Field label="Age Range">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Input
                        type="number" min="0" max="120" placeholder="Min"
                        value={form.ageMin} onChange={set('ageMin')}
                        style={{ width: '50%' }}
                      />
                      <span style={{ color: 'var(--text-3)', flexShrink: 0 }}>to</span>
                      <Input
                        type="number" min="0" max="120" placeholder="Max"
                        value={form.ageMax} onChange={set('ageMax')}
                        style={{ width: '50%' }}
                      />
                    </div>
                  </Field>
                  <Field label="Gender">
                    <Select value={form.gender} onChange={set('gender')}>
                      <option value="">All</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Marital Status">
                    <Select value={form.maritalStatus} onChange={set('maritalStatus')}>
                      <option value="">All</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </Select>
                  </Field>
                  <Field label="State">
                    <Select value={form.state} onChange={set('state')}>
                      <option value="">All States</option>
                      {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
                    </Select>
                  </Field>
                </div>
              )}

              {audienceTab === 'filter' && (
                <div style={{ marginTop: 16 }}>
                  <button type="button" className="btn btn-primary" onClick={handleFilterUsers}>
                    Filter
                  </button>

                  {tableVisible && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
                          {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                        </span>
                        {selectedUserIds.size > 0 && (
                          <span style={{ fontSize: 13, color: 'var(--brand-mid)', fontWeight: 600 }}>
                            {selectedUserIds.size} selected
                          </span>
                        )}
                      </div>

                      {filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 14 }}>
                          No users match the selected filters.
                        </div>
                      ) : (
                        <>
                          <div className="table-wrap">
                            <table>
                              <thead>
                                <tr>
                                  <th style={{ width: 36 }}>
                                    <input
                                      type="checkbox"
                                      checked={allPageSelected}
                                      ref={el => { if (el) el.indeterminate = somePageSelected }}
                                      onChange={togglePageAll}
                                    />
                                  </th>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Type</th>
                                  <th>Age</th>
                                  <th>Gender</th>
                                  <th>Marital Status</th>
                                  <th>State</th>
                                  <th>Segment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pagedUsers.map((u, i) => (
                                  <tr
                                    key={u.id}
                                    style={{ background: selectedUserIds.has(u.id) ? 'var(--brand-light)' : undefined, cursor: 'pointer' }}
                                    onClick={() => toggleUser(u.id)}
                                  >
                                    <td onClick={e => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={selectedUserIds.has(u.id)}
                                        onChange={() => toggleUser(u.id)}
                                      />
                                    </td>
                                    <td>{(userPage - 1) * PAGE_SIZE + i + 1}</td>
                                    <td>{u.name}</td>
                                    <td>{u.type}</td>
                                    <td>{u.age}</td>
                                    <td>{u.gender}</td>
                                    <td>{u.marital}</td>
                                    <td>{u.state}</td>
                                    <td>{u.segment}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {totalPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 12 }}>
                              <button
                                type="button" className="btn btn-ghost"
                                style={{ padding: '4px 10px', fontSize: 13 }}
                                disabled={userPage === 1}
                                onClick={() => setUserPage(p => p - 1)}
                              >← Prev</button>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                  key={p} type="button"
                                  className={`btn ${p === userPage ? 'btn-primary' : 'btn-ghost'}`}
                                  style={{ padding: '4px 10px', fontSize: 13, minWidth: 32 }}
                                  onClick={() => setUserPage(p)}
                                >{p}</button>
                              ))}
                              <button
                                type="button" className="btn btn-ghost"
                                style={{ padding: '4px 10px', fontSize: 13 }}
                                disabled={userPage === totalPages}
                                onClick={() => setUserPage(p => p + 1)}
                              >Next →</button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              {audienceTab === 'upload' && (
                <div style={{ marginTop: 16 }}>
                  <label className="upload-box">
                    <input type="file" style={{ display: 'none' }} accept=".csv,.xlsx" />
                    <div className="upload-icon">📋</div>
                    <div className="upload-label">Upload CSV / Excel list</div>
                    <div className="upload-hint">Overrides segment if provided</div>
                  </label>
                </div>
              )}
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
