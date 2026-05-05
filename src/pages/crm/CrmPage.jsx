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

function calls(filled) {
  return Array.from({ length: 5 }, (_, i) => {
    const f = filled[i] || {}
    return { callNo: i + 1, time: f.t || '', response: f.r || '', comment: f.c || '' }
  })
}

const INITIAL_LEADS = [
  { id:1,  campaignId:1, name:'Aarav Sharma',   mobile:'9876543210', enrollmentStatus:'Enrolled',  enrollmentDate:'10/04/2025', purchaseStatus:'Purchased',      purchaseDate:'18/04/2025',
    calls: calls([
      { t:'2025-04-08T10:30', r:'Connected',       c:'Introduced Summer Health Drive benefits. Customer showed keen interest in the plan.' },
      { t:'2025-04-10T14:00', r:'Connected',       c:'Explained premium slabs and sum insured options. Customer requested policy document.' },
      { t:'2025-04-15T11:30', r:'Connected',       c:'Shared policy document via WhatsApp. Customer reviewed and agreed to proceed.' },
      { t:'2025-04-17T16:00', r:'Connected',       c:'Confirmed purchase. Shared payment link. Payment received and policy issued.' },
    ]) },

  { id:2,  campaignId:1, name:'Priya Mehta',    mobile:'9812345678', enrollmentStatus:'Enrolled',  enrollmentDate:'11/04/2025', purchaseStatus:'Interested',     purchaseDate:'',
    calls: calls([
      { t:'2025-04-09T09:30', r:'Connected',       c:'Introduced campaign. Customer is interested but wants time to compare plans.' },
      { t:'2025-04-11T15:00', r:'Connected',       c:'Sent brochure on WhatsApp. Customer comparing with existing policy.' },
      { t:'2025-04-14T11:00', r:'Call Back Later', c:'Customer asked to call back after the weekend.' },
    ]) },

  { id:3,  campaignId:1, name:'Rohan Verma',    mobile:'9800112233', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',
    calls: calls([
      { t:'2025-04-10T10:00', r:'No Answer',       c:'No response. Will retry tomorrow.' },
      { t:'2025-04-11T12:30', r:'Busy',            c:'Line busy. Retry scheduled.' },
    ]) },

  { id:4,  campaignId:1, name:'Sneha Iyer',     mobile:'9898989898', enrollmentStatus:'Enrolled',  enrollmentDate:'12/04/2025', purchaseStatus:'Not Interested', purchaseDate:'',
    calls: calls([
      { t:'2025-04-10T09:00', r:'Connected',       c:'Introduced plan. Customer said she already has adequate coverage.' },
      { t:'2025-04-12T14:30', r:'Connected',       c:'Followed up with better offer. Customer firmly not interested in switching.' },
      { t:'2025-04-15T10:00', r:'Connected',       c:'Final follow-up. Customer declined and requested no further calls.' },
    ]) },

  { id:5,  campaignId:1, name:'Karan Patel',    mobile:'9090909090', enrollmentStatus:'Enrolled',  enrollmentDate:'13/04/2025', purchaseStatus:'Purchased',      purchaseDate:'20/04/2025',
    calls: calls([
      { t:'2025-04-11T11:00', r:'Connected',       c:'First call. Explained campaign offer and family floater benefits.' },
      { t:'2025-04-13T15:30', r:'Connected',       c:'Customer enrolled. Discussed sum insured options for family of 4.' },
      { t:'2025-04-18T10:00', r:'Connected',       c:'Customer finalised ₹10L family floater plan. Payment link shared.' },
      { t:'2025-04-20T09:30', r:'Connected',       c:'Payment confirmed. Policy document shared. Customer satisfied.' },
    ]) },

  { id:6,  campaignId:2, name:'Divya Nair',     mobile:'9911223344', enrollmentStatus:'Enrolled',  enrollmentDate:'01/05/2025', purchaseStatus:'Purchased',      purchaseDate:'08/05/2025',
    calls: calls([
      { t:'2025-04-29T10:00', r:'Connected',       c:'Introduced Renewal Reminder campaign. Customer has existing policy due in May.' },
      { t:'2025-05-01T14:30', r:'Connected',       c:'Customer confirmed renewal. Shared revised premium with loyalty discount.' },
      { t:'2025-05-06T11:00', r:'Connected',       c:'Customer agreed to renew with enhanced SI. Sent payment link.' },
      { t:'2025-05-08T09:00', r:'Connected',       c:'Payment received. Renewal policy issued. Customer confirmed receipt.' },
    ]) },

  { id:7,  campaignId:2, name:'Arjun Singh',    mobile:'9922334455', enrollmentStatus:'Enrolled',  enrollmentDate:'02/05/2025', purchaseStatus:'Interested',     purchaseDate:'',
    calls: calls([
      { t:'2025-04-30T09:30', r:'Connected',       c:'Renewal reminder call. Customer acknowledged renewal is due.' },
      { t:'2025-05-02T16:00', r:'Connected',       c:'Customer interested in upgrading SI at renewal. Requested quote.' },
      { t:'2025-05-06T14:00', r:'Call Back Later', c:'Customer travelling. Requested callback next week after return.' },
    ]) },

  { id:8,  campaignId:2, name:'Meera Joshi',    mobile:'9933445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',
    calls: calls([
      { t:'2025-05-01T10:30', r:'No Answer',       c:'No response on first attempt.' },
      { t:'2025-05-02T13:00', r:'Not Reachable',   c:'Number not reachable. Will retry in 2 days.' },
    ]) },

  { id:9,  campaignId:2, name:'Vikram Rao',     mobile:'9944556677', enrollmentStatus:'Enrolled',  enrollmentDate:'03/05/2025', purchaseStatus:'Purchased',      purchaseDate:'10/05/2025',
    calls: calls([
      { t:'2025-05-01T11:00', r:'Connected',       c:'Renewal call. Customer happy with existing policy and keen to renew.' },
      { t:'2025-05-03T15:00', r:'Connected',       c:'Shared renewal quote. Customer asked for NCB details and confirmed.' },
      { t:'2025-05-09T10:30', r:'Connected',       c:'Customer paid renewal premium. Policy renewed with 25% cumulative bonus.' },
    ]) },

  { id:10, campaignId:2, name:'Anjali Desai',   mobile:'9955667788', enrollmentStatus:'Enrolled',  enrollmentDate:'04/05/2025', purchaseStatus:'Not Interested', purchaseDate:'',
    calls: calls([
      { t:'2025-05-02T09:00', r:'Connected',       c:'Renewal reminder. Customer mentioned she switched to a different IC last month.' },
      { t:'2025-05-04T14:00', r:'Connected',       c:'Offered retention discount. Customer declined and confirmed switching.' },
    ]) },

  { id:11, campaignId:3, name:'Rahul Gupta',    mobile:'9966778899', enrollmentStatus:'Enrolled',  enrollmentDate:'15/03/2025', purchaseStatus:'Purchased',      purchaseDate:'22/03/2025',
    calls: calls([
      { t:'2025-03-13T10:00', r:'Connected',       c:'Onboarding call. New customer referred by existing policyholder.' },
      { t:'2025-03-15T14:30', r:'Connected',       c:'Completed KYC and health declaration. Customer enrolled.' },
      { t:'2025-03-20T11:00', r:'Connected',       c:'Customer selected ₹5L individual plan. Payment link sent.' },
      { t:'2025-03-22T09:30', r:'Connected',       c:'Payment received. Policy document emailed. Welcome call done.' },
    ]) },

  { id:12, campaignId:3, name:'Pooja Reddy',    mobile:'9977889900', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',
    calls: calls([
      { t:'2025-03-14T10:30', r:'Busy',            c:'Line busy during first attempt.' },
      { t:'2025-03-16T12:00', r:'No Answer',       c:'No answer. SMS sent with campaign details.' },
    ]) },

  { id:13, campaignId:4, name:'Suresh Kumar',   mobile:'9988001122', enrollmentStatus:'Enrolled',  enrollmentDate:'20/04/2025', purchaseStatus:'Interested',     purchaseDate:'',
    calls: calls([
      { t:'2025-04-18T09:30', r:'Connected',       c:'Introduced Motor Insurance Awareness campaign. Customer owns two vehicles.' },
      { t:'2025-04-20T15:00', r:'Connected',       c:'Shared comprehensive motor plan details. Customer interested in comparing.' },
      { t:'2025-04-24T11:30', r:'Call Back Later', c:'Customer said he will decide after getting competitor quotes. Callback in 5 days.' },
    ]) },

  { id:14, campaignId:4, name:'Kavita Pillai',  mobile:'9899112233', enrollmentStatus:'Enrolled',  enrollmentDate:'21/04/2025', purchaseStatus:'Purchased',      purchaseDate:'28/04/2025',
    calls: calls([
      { t:'2025-04-19T10:00', r:'Connected',       c:'Motor awareness call. Customer vehicle insurance expires next month.' },
      { t:'2025-04-21T14:00', r:'Connected',       c:'Customer enrolled. Explained zero-dep and engine protect add-ons.' },
      { t:'2025-04-25T11:00', r:'Connected',       c:'Customer selected comprehensive plan with zero-dep. Payment link sent.' },
      { t:'2025-04-28T09:00', r:'Connected',       c:'Payment done. Policy certificate emailed. RC-linked policy confirmed.' },
    ]) },

  { id:15, campaignId:4, name:'Nikhil Bansal',  mobile:'9800223344', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',
    calls: calls([
      { t:'2025-04-20T10:00', r:'Wrong Number',    c:'Number appears to be incorrect. Need to verify contact details.' },
    ]) },
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
