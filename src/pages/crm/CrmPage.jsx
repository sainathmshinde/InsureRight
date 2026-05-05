import { useState } from 'react'
import { Field, Select } from '../../components/Field'
import { PageHeader } from '../../components/UI'
import { CRMIcon } from '../../icons'

const AGENTS = [
  { id: 1,  name: 'Ravi Kulkarni', posLicense: 'POS-2023-001', broker: 'Mehta Insurance' },
  { id: 2,  name: 'Pooja Desai',   posLicense: 'POS-2023-019', broker: 'Priya Brokers'   },
  { id: 4,  name: 'Kavita Sharma', posLicense: 'POS-2023-045', broker: 'Shah Financial'  },
  { id: 5,  name: 'Amit Verma',    posLicense: 'POS-2023-067', broker: 'Mehta Insurance' },
  { id: 6,  name: 'Sneha Patil',   posLicense: 'POS-2022-133', broker: 'Nair & Co.'      },
  { id: 8,  name: 'Priya Menon',   posLicense: 'POS-2023-088', broker: 'Shah Financial'  },
  { id: 9,  name: 'Kiran Reddy',   posLicense: 'POS-2023-099', broker: 'Rao & Partners'  },
  { id: 10, name: 'Neha Gupta',    posLicense: 'POS-2022-155', broker: 'Priya Brokers'   },
  { id: 11, name: 'Ajay Tiwari',   posLicense: 'POS-2023-120', broker: 'Mehta Insurance' },
]

const CAMPAIGNS = [
  { id: 1, name: 'Summer Health Drive 2025',   type: 'Promotional', assignedAgents: [1, 2, 5] },
  { id: 2, name: 'Renewal Reminder Q2',         type: 'Renewal',     assignedAgents: [1, 4, 8] },
  { id: 3, name: 'New Member Onboarding',       type: 'Onboarding',  assignedAgents: [2, 6, 9] },
  { id: 4, name: 'Motor Insurance Awareness',   type: 'Awareness',   assignedAgents: [1, 10]   },
  { id: 5, name: 'High Value Customer Loyalty', type: 'Incentive',   assignedAgents: [4, 5, 11]},
  { id: 6, name: 'Festival Season Offer',       type: 'Seasonal',    assignedAgents: [2, 8, 9] },
]

const EMPTY_CALLS = Array.from({ length: 5 }, (_, i) => ({
  callNo: i + 1, time: '', response: '', comment: '',
}))

const INITIAL_LEADS = [
  { id:1,  campaignId:1, name:'Aarav Sharma',   mobile:'9876543210', enrollmentStatus:'Enrolled',  enrollmentDate:'10/04/2025', purchaseStatus:'Purchased',      purchaseDate:'18/04/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:2,  campaignId:1, name:'Priya Mehta',    mobile:'9812345678', enrollmentStatus:'Enrolled',  enrollmentDate:'11/04/2025', purchaseStatus:'Interested',     purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:3,  campaignId:1, name:'Rohan Verma',    mobile:'9800112233', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:4,  campaignId:1, name:'Sneha Iyer',     mobile:'9898989898', enrollmentStatus:'Enrolled',  enrollmentDate:'12/04/2025', purchaseStatus:'Not Interested', purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:5,  campaignId:1, name:'Karan Patel',    mobile:'9090909090', enrollmentStatus:'Enrolled',  enrollmentDate:'13/04/2025', purchaseStatus:'Purchased',      purchaseDate:'20/04/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:6,  campaignId:2, name:'Divya Nair',     mobile:'9911223344', enrollmentStatus:'Enrolled',  enrollmentDate:'01/05/2025', purchaseStatus:'Purchased',      purchaseDate:'08/05/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:7,  campaignId:2, name:'Arjun Singh',    mobile:'9922334455', enrollmentStatus:'Enrolled',  enrollmentDate:'02/05/2025', purchaseStatus:'Interested',     purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:8,  campaignId:2, name:'Meera Joshi',    mobile:'9933445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:9,  campaignId:2, name:'Vikram Rao',     mobile:'9944556677', enrollmentStatus:'Enrolled',  enrollmentDate:'03/05/2025', purchaseStatus:'Purchased',      purchaseDate:'10/05/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:10, campaignId:2, name:'Anjali Desai',   mobile:'9955667788', enrollmentStatus:'Enrolled',  enrollmentDate:'04/05/2025', purchaseStatus:'Not Interested', purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:11, campaignId:3, name:'Rahul Gupta',    mobile:'9966778899', enrollmentStatus:'Enrolled',  enrollmentDate:'15/03/2025', purchaseStatus:'Purchased',      purchaseDate:'22/03/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:12, campaignId:3, name:'Pooja Reddy',    mobile:'9977889900', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:13, campaignId:4, name:'Suresh Kumar',   mobile:'9988001122', enrollmentStatus:'Enrolled',  enrollmentDate:'20/04/2025', purchaseStatus:'Interested',     purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:14, campaignId:4, name:'Kavita Pillai',  mobile:'9899112233', enrollmentStatus:'Enrolled',  enrollmentDate:'21/04/2025', purchaseStatus:'Purchased',      purchaseDate:'28/04/2025', calls: EMPTY_CALLS.map(c => ({...c})) },
  { id:15, campaignId:4, name:'Nikhil Bansal',  mobile:'9800223344', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           calls: EMPTY_CALLS.map(c => ({...c})) },
]

const CURRENT_USER_ID = 1

const ENROLLMENT_STATUSES  = ['Enrolled', 'Pending']
const PURCHASE_STATUSES    = ['Purchased', 'Interested', 'Not Interested', 'Pending']
const CALL_RESPONSES       = ['', 'Connected', 'No Answer', 'Busy', 'Call Back Later', 'Wrong Number', 'Not Reachable']

function enrollBg(s)  { return s === 'Enrolled' ? '#e6f4ea' : '#fff3e0' }
function enrollClr(s) { return s === 'Enrolled' ? '#2d7d46' : '#a05c00' }
function purchBg(s)   { return s === 'Purchased' ? '#e6f4ea' : s === 'Interested' ? '#fff3e0' : s === 'Not Interested' ? '#fce8e6' : '#f1f3f4' }
function purchClr(s)  { return s === 'Purchased' ? '#2d7d46' : s === 'Interested' ? '#a05c00' : s === 'Not Interested' ? '#c0392b' : '#5f6368' }

export default function CrmPage() {
  const [selectedAgentId, setSelectedAgentId]     = useState(CURRENT_USER_ID)
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [leads, setLeads]                         = useState(INITIAL_LEADS)
  const [activeLead, setActiveLead]               = useState(null)
  const [draft, setDraft]                         = useState(null)

  const agentCampaigns = CAMPAIGNS.filter(c => c.assignedAgents.includes(selectedAgentId))

  const handleAgentChange = e => {
    setSelectedAgentId(Number(e.target.value))
    setSelectedCampaignId('')
  }

  const visibleLeads = selectedCampaignId
    ? leads.filter(l => l.campaignId === Number(selectedCampaignId))
    : []

  const openAction = lead => {
    setActiveLead(lead.id)
    setDraft(JSON.parse(JSON.stringify(lead)))
  }

  const closeModal = () => { setActiveLead(null); setDraft(null) }

  const saveDraft = () => {
    setLeads(prev => prev.map(l => l.id === draft.id ? draft : l))
    closeModal()
  }

  const setDraftField = (field, value) =>
    setDraft(prev => ({ ...prev, [field]: value }))

  const setCallField = (callNo, field, value) =>
    setDraft(prev => ({
      ...prev,
      calls: prev.calls.map(c => c.callNo === callNo ? { ...c, [field]: value } : c),
    }))

  return (
    <div>
      <PageHeader icon={<CRMIcon />} title="CRM" subtitle="Campaign lead tracking & agent performance" />

      <div className="card">
        <div className="card-body">

          {/* ── Filters ── */}
          <div className="form-grid" style={{ marginBottom: 24 }}>
            <Field label="Agent">
              <Select value={selectedAgentId} onChange={handleAgentChange}>
                {AGENTS.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}{a.id === CURRENT_USER_ID ? ' (You)' : ''} — {a.broker}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Campaign">
              <Select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                disabled={agentCampaigns.length === 0}
              >
                <option value="">{agentCampaigns.length === 0 ? 'No campaigns assigned' : 'Select a campaign'}</option>
                {agentCampaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                ))}
              </Select>
            </Field>
          </div>

          {/* ── Empty states ── */}
          {!selectedCampaignId ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 14 }}>
              Select a campaign to view assigned leads.
            </div>
          ) : visibleLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 14 }}>
              No leads found for this campaign.
            </div>
          ) : (
            <>
              {/* ── Summary chips ── */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Total Leads', value: visibleLeads.length,                                                                   color: 'var(--text-2)', bg: 'var(--surface-2)' },
                  { label: 'Enrolled',    value: visibleLeads.filter(l => l.enrollmentStatus === 'Enrolled').length,  color: '#0a7ea4',       bg: '#e0f4fb'          },
                  { label: 'Purchased',   value: visibleLeads.filter(l => l.purchaseStatus   === 'Purchased').length,  color: '#2d7d46',       bg: '#e6f4ea'          },
                  { label: 'Interested',  value: visibleLeads.filter(l => l.purchaseStatus   === 'Interested').length, color: '#a05c00',       bg: '#fff3e0'          },
                ].map(s => (
                  <div key={s.label} style={{ padding: '8px 18px', borderRadius: 8, background: s.bg, color: s.color, fontSize: 13, fontWeight: 600 }}>
                    {s.value} <span style={{ fontWeight: 400, marginLeft: 4 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* ── Table ── */}
              <div className="table-wrap">
                <table style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Enrollment Status</th>
                      <th>Enrollment Date</th>
                      <th>Purchase Status</th>
                      <th>Purchase Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLeads.map((lead, i) => (
                      <tr key={lead.id}>
                        <td>{i + 1}</td>
                        <td>{lead.name}</td>
                        <td>{lead.mobile}</td>
                        <td>
                          <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: enrollBg(lead.enrollmentStatus), color: enrollClr(lead.enrollmentStatus) }}>
                            {lead.enrollmentStatus}
                          </span>
                        </td>
                        <td>{lead.enrollmentDate || '—'}</td>
                        <td>
                          <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: purchBg(lead.purchaseStatus), color: purchClr(lead.purchaseStatus) }}>
                            {lead.purchaseStatus}
                          </span>
                        </td>
                        <td>{lead.purchaseDate || '—'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ fontSize: 12, padding: '4px 12px' }}
                            onClick={() => openAction(lead)}
                          >
                            Action
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Action Modal ── */}
      {draft && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeModal}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100 }}
          />

          {/* Modal panel */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 520,
            background: 'var(--surface)', boxShadow: '-4px 0 24px rgba(0,0,0,.15)',
            zIndex: 101, display: 'flex', flexDirection: 'column', overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid var(--border)',
              position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{draft.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{draft.mobile}</div>
              </div>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-3)', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ── Status Update ── */}
              <section>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: 'var(--text-2)' }}>Status Update</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Field label="Enrollment Status">
                    <Select value={draft.enrollmentStatus} onChange={e => setDraftField('enrollmentStatus', e.target.value)}>
                      {ENROLLMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field label="Purchase Status">
                    <Select value={draft.purchaseStatus} onChange={e => setDraftField('purchaseStatus', e.target.value)}>
                      {PURCHASE_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </Select>
                  </Field>
                </div>
              </section>

              {/* ── Call Logs ── */}
              <section>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: 'var(--text-2)' }}>Call Log</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {draft.calls.map(call => (
                    <div key={call.callNo} style={{
                      border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                      padding: '14px 16px', background: 'var(--surface-2)',
                    }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--brand)' }}>
                        Call {call.callNo}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <Field label="Date & Time">
                          <input
                            type="datetime-local"
                            value={call.time}
                            onChange={e => setCallField(call.callNo, 'time', e.target.value)}
                            style={{
                              width: '100%', padding: '7px 10px', fontSize: 13,
                              border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                              background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box',
                            }}
                          />
                        </Field>
                        <Field label="Response">
                          <Select value={call.response} onChange={e => setCallField(call.callNo, 'response', e.target.value)}>
                            {CALL_RESPONSES.map(r => <option key={r} value={r}>{r || 'Select response'}</option>)}
                          </Select>
                        </Field>
                      </div>
                      <Field label="Comment">
                        <textarea
                          value={call.comment}
                          onChange={e => setCallField(call.callNo, 'comment', e.target.value)}
                          placeholder="Add a comment…"
                          rows={2}
                          style={{
                            width: '100%', padding: '7px 10px', fontSize: 13, resize: 'vertical',
                            border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                            background: 'var(--surface)', color: 'var(--text)',
                            fontFamily: 'inherit', boxSizing: 'border-box',
                          }}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid var(--border)',
              position: 'sticky', bottom: 0, background: 'var(--surface)',
              display: 'flex', gap: 10, justifyContent: 'flex-end',
            }}>
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={saveDraft}>Save</button>
            </div>
          </div>
        </>
      )}

    </div>
  )
}
