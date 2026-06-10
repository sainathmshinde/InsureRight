import { useState } from 'react'
import { Field, Select } from '../../components/Field'
import { PageHeader } from '../../components/UI'
import { CRMIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { AGENTS as KMD_AGENTS } from '../agent/agentData'
import { CAMPAIGNS, INITIAL_LEADS } from './crmData'

const SALES_AGENTS       = KMD_AGENTS.filter(a => a.agentType === 'sales')
const ENROLLMENT_STATUSES = ['Enrolled', 'Pending']
const PURCHASE_STATUSES   = ['Purchased', 'Interested', 'Not Interested', 'Pending']
const CALL_RESPONSES      = ['', 'Connected', 'No Answer', 'Busy', 'Call Back Later', 'Wrong Number', 'Not Reachable']

function enrollBg(s)  { return s === 'Enrolled'    ? '#e6f4ea' : '#fff3e0' }
function enrollClr(s) { return s === 'Enrolled'    ? '#2d7d46' : '#a05c00' }
function purchBg(s)   { return s === 'Purchased' ? '#e6f4ea' : s === 'Interested' ? '#fff3e0' : s === 'Not Interested' ? '#fce8e6' : '#f1f3f4' }
function purchClr(s)  { return s === 'Purchased' ? '#2d7d46' : s === 'Interested' ? '#a05c00' : s === 'Not Interested' ? '#c0392b' : '#5f6368' }

function SectionTitle({ children }) {
  return <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>{children}</div>
}

function Badge({ bg, color, children }) {
  return <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: bg, color }}>{children}</span>
}

export default function CrmPage() {
  const { user } = useAuth()
  const isAgent   = user?.role === 'agent'
  const isBroker  = user?.role === 'broker'

  const myAgentRecord  = isAgent ? KMD_AGENTS.find(a => a.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())) : null
  const myAgentId      = myAgentRecord?.id ?? null
  const myAgentType    = myAgentRecord?.agentType ?? null
  const isCallingAgent = isAgent && myAgentType === 'calling'
  const isSalesAgent   = isAgent && myAgentType === 'sales'

  const defaultAgentId = isAgent ? (myAgentId ?? KMD_AGENTS[0].id) : KMD_AGENTS[0].id

  const [selectedAgentId, setSelectedAgentId]       = useState(defaultAgentId)
  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const [leads, setLeads]                           = useState(INITIAL_LEADS)
  const [draft, setDraft]                           = useState(null)
  const [salesAssignId, setSalesAssignId]           = useState('')

  // Campaigns visible in the dropdown
  const availCampaigns = isCallingAgent
    ? CAMPAIGNS.filter(c => c.assignedAgents.includes(myAgentId))
    : CAMPAIGNS.filter(c => c.assignedAgents.includes(selectedAgentId))

  const handleAgentChange = e => {
    setSelectedAgentId(Number(e.target.value))
    setSelectedCampaignId('')
  }

  // Bucket: unclaimed leads in selected campaign (calling agent picks from here)
  const bucketLeads = selectedCampaignId
    ? leads.filter(l => l.campaignId === Number(selectedCampaignId) && !l.claimedBy)
    : []

  // Calling agent's own claimed leads
  const myClaimedLeads = isCallingAgent
    ? leads.filter(l => l.claimedBy === myAgentId)
    : []

  // Campaigns where this sales agent has at least one lead assigned
  const salesAgentCampaigns = isSalesAgent
    ? CAMPAIGNS.filter(c => leads.some(l => l.campaignId === c.id && l.salesAssignedTo === myAgentId))
    : []

  // Sales agent's assigned leads, optionally filtered by selected campaign
  const mySalesLeads = isSalesAgent
    ? leads.filter(l =>
        l.salesAssignedTo === myAgentId &&
        (selectedCampaignId ? l.campaignId === Number(selectedCampaignId) : true)
      )
    : []

  // Broker: all leads for selected campaign
  const brokerLeads = isBroker && selectedCampaignId
    ? leads.filter(l => l.campaignId === Number(selectedCampaignId))
    : []

  const claimLead = leadId =>
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, claimedBy: myAgentId } : l))

  const openAction = lead => {
    setDraft(JSON.parse(JSON.stringify(lead)))
    setSalesAssignId('')
  }

  const closeModal = () => { setDraft(null); setSalesAssignId('') }

  const saveDraft = () => {
    setLeads(prev => prev.map(l => l.id === draft.id ? draft : l))
    closeModal()
  }

  const assignToSales = () => {
    if (!salesAssignId) return
    setLeads(prev => prev.map(l =>
      l.id === draft.id ? { ...l, ...draft, salesAssignedTo: Number(salesAssignId) } : l
    ))
    closeModal()
  }

  const setDraftField  = (f, v)        => setDraft(prev => ({ ...prev, [f]: v }))
  const setCallField   = (no, f, v)    => setDraft(prev => ({ ...prev, calls: prev.calls.map(c => c.callNo === no ? { ...c, [f]: v } : c) }))

  const campaignName = id => CAMPAIGNS.find(c => c.id === id)?.name ?? '—'

  // ── Shared lead renderer — cards on mobile, table on desktop ─────────────
  const LeadTable = ({ rows, showCampaign = false, showClaim = false, showAssignedTo = false }) => (
    <>
      {/* ── Mobile cards ── */}
      <div className="crm-lead-cards">
        {rows.map(lead => (
          <div key={lead.id} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--surface)', overflow: 'hidden' }}>
            {/* Card header */}
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{lead.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-3)', marginTop: 2 }}>📱 {lead.mobile}</div>
                {showCampaign && <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>📢 {campaignName(lead.campaignId)}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                <Badge bg={enrollBg(lead.enrollmentStatus)} color={enrollClr(lead.enrollmentStatus)}>{lead.enrollmentStatus}</Badge>
                <Badge bg={purchBg(lead.purchaseStatus)}  color={purchClr(lead.purchaseStatus)}>{lead.purchaseStatus}</Badge>
              </div>
            </div>
            {/* Card body */}
            <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Enrollment Date</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{lead.enrollmentDate || '—'}</div>
                </div>
                {showAssignedTo && (
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>Sales Operator</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{KMD_AGENTS.find(a => a.id === lead.salesAssignedTo)?.name ?? '—'}</div>
                  </div>
                )}
              </div>
              {showClaim ? (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => claimLead(lead.id)}>Claim</button>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openAction(lead)}>Action →</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="crm-table-wrap">
        <table style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Mobile</th>
              {showCampaign   && <th>Campaign</th>}
              <th>Enrollment</th>
              <th>Enrollment Date</th>
              <th>Purchase Status</th>
              {showAssignedTo && <th>Sales Operator</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead, i) => (
              <tr key={lead.id}>
                <td>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{lead.name}</td>
                <td>{lead.mobile}</td>
                {showCampaign   && <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{campaignName(lead.campaignId)}</td>}
                <td><Badge bg={enrollBg(lead.enrollmentStatus)} color={enrollClr(lead.enrollmentStatus)}>{lead.enrollmentStatus}</Badge></td>
                <td>{lead.enrollmentDate || '—'}</td>
                <td><Badge bg={purchBg(lead.purchaseStatus)} color={purchClr(lead.purchaseStatus)}>{lead.purchaseStatus}</Badge></td>
                {showAssignedTo && <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{KMD_AGENTS.find(a => a.id === lead.salesAssignedTo)?.name ?? '—'}</td>}
                <td>
                  {showClaim ? (
                    <button type="button" className="btn btn-primary btn-sm" style={{ fontSize: 12 }} onClick={() => claimLead(lead.id)}>Claim</button>
                  ) : (
                    <button type="button" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => openAction(lead)}>Action</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  const SummaryChips = ({ rows }) => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      {[
        { label: 'Total',        value: rows.length,                                                              color: 'var(--text-2)', bg: 'var(--surface-2)' },
        { label: 'Enrolled',     value: rows.filter(l => l.enrollmentStatus === 'Enrolled').length,  color: '#0a7ea4',       bg: '#e0f4fb'          },
        { label: 'Purchased',    value: rows.filter(l => l.purchaseStatus === 'Purchased').length,   color: '#2d7d46',       bg: '#e6f4ea'          },
        { label: 'Interested',   value: rows.filter(l => l.purchaseStatus === 'Interested').length,  color: '#a05c00',       bg: '#fff3e0'          },
      ].map(s => (
        <div key={s.label} style={{ padding: '7px 16px', borderRadius: 8, background: s.bg, color: s.color, fontSize: 13, fontWeight: 600 }}>
          {s.value} <span style={{ fontWeight: 400, marginLeft: 4 }}>{s.label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader icon={<CRMIcon />} title="CRM" subtitle="K.M. Dastur & Co. — Campaign lead tracking & agent performance" />

      {/* ══════════════════════════════════════════════════════════════════════
          CALLING AGENT VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {isCallingAgent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Agent info + Campaign selector */}
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '12px 16px', background: '#e0f4fb', borderRadius: 10, border: '1px solid #7ecae0' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0a7ea4', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>CA</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: '#0a7ea4', fontWeight: 500 }}>Calling Operator · {myAgentRecord?.posLicense}</div>
                </div>
              </div>
              <div className="form-grid">
                <Field label="Select Campaign">
                  <Select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)}>
                    <option value="">{availCampaigns.length === 0 ? 'No campaigns assigned' : 'Select a campaign'}</option>
                    {availCampaigns.map(c => <option key={c.id} value={c.id}>{c.name}{c.type ? ` · ${c.type}` : ''}</option>)}
                  </Select>
                </Field>
              </div>
            </div>
          </div>

          {/* Campaign Bucket */}
          <div className="card">
            <div className="card-body">
              <SectionTitle>📦 Campaign Bucket {selectedCampaignId ? `— ${campaignName(Number(selectedCampaignId))}` : ''}</SectionTitle>
              {!selectedCampaignId ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 13.5 }}>Select a campaign to view available leads.</div>
              ) : bucketLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 13.5 }}>No unclaimed leads in this campaign bucket.</div>
              ) : (
                <>
                  <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-3)' }}>
                    {bucketLeads.length} lead{bucketLeads.length !== 1 ? 's' : ''} available — claim one to start calling
                  </div>
                  <LeadTable rows={bucketLeads} showClaim />
                </>
              )}
            </div>
          </div>

          {/* My Claimed Leads */}
          <div className="card">
            <div className="card-body">
              <SectionTitle>📞 My Leads</SectionTitle>
              {myClaimedLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-3)', fontSize: 13.5 }}>You haven't claimed any leads yet. Pick from the bucket above.</div>
              ) : (
                <>
                  <SummaryChips rows={myClaimedLeads} />
                  <LeadTable rows={myClaimedLeads} showCampaign showAssignedTo />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SALES AGENT VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {isSalesAgent && (
        <div className="card">
          <div className="card-body">

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '12px 16px', background: '#e6f4ea', borderRadius: 10, border: '1px solid #a8d5b5' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#2d7d46', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>SA</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: '#2d7d46', fontWeight: 500 }}>Sales Operator · {myAgentRecord?.posLicense}</div>
              </div>
            </div>

            {salesAgentCampaigns.length > 0 && (
              <div className="form-grid" style={{ marginBottom: 20 }}>
                <Field label="Filter by Campaign">
                  <Select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)}>
                    <option value="">All Campaigns</option>
                    {salesAgentCampaigns.map(c => (
                      <option key={c.id} value={c.id}>{c.name}{c.type ? ` · ${c.type}` : ''}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            )}

            <SectionTitle>🎯 My Assigned Leads{selectedCampaignId ? ` — ${campaignName(Number(selectedCampaignId))}` : ''}</SectionTitle>
            {mySalesLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13.5 }}>
                {selectedCampaignId ? 'No leads in this campaign.' : 'No leads assigned to you yet.'}
              </div>
            ) : (
              <>
                <SummaryChips rows={mySalesLeads} />
                <LeadTable rows={mySalesLeads} showCampaign />
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          BROKER VIEW
      ══════════════════════════════════════════════════════════════════════ */}
      {isBroker && (
        <div className="card">
          <div className="card-body">
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <Field label="Operator">
                <Select value={selectedAgentId} onChange={handleAgentChange}>
                  {KMD_AGENTS.map(a => (
                    <option key={a.id} value={a.id}>{a.name} · {a.agentType === 'calling' ? 'Calling' : 'Sales'}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Campaign">
                <Select value={selectedCampaignId} onChange={e => setSelectedCampaignId(e.target.value)} disabled={availCampaigns.length === 0}>
                  <option value="">{availCampaigns.length === 0 ? 'No campaigns assigned' : 'Select a campaign'}</option>
                  {availCampaigns.map(c => <option key={c.id} value={c.id}>{c.name}{c.type ? ` · ${c.type}` : ''}</option>)}
                </Select>
              </Field>
            </div>
            {!selectedCampaignId ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 14 }}>Select a campaign to view leads.</div>
            ) : brokerLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-3)', fontSize: 14 }}>No leads found.</div>
            ) : (
              <>
                <SummaryChips rows={brokerLeads} />
                <LeadTable rows={brokerLeads} showAssignedTo />
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ACTION DRAWER
      ══════════════════════════════════════════════════════════════════════ */}
      {draft && (
        <>
          <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 100 }} />
          <div className="crm-drawer">
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{draft.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                  📱 {draft.mobile} · 📢 {campaignName(draft.campaignId)}
                </div>
              </div>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-3)', lineHeight: 1 }}>×</button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Status Update */}
              <section>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: 'var(--text-2)' }}>Status Update</div>
                <div className="crm-drawer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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

              {/* Assign to Sales Agent */}
              {isCallingAgent && draft.purchaseStatus === 'Interested' && (
                <section style={{ background: '#e6f4ea', border: '1px solid #a8d5b5', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: '#2d7d46' }}>🎯 Assign to Sales Operator</div>
                  <div className="crm-assign-row" style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <Field label="Select Sales Operator">
                        <Select value={salesAssignId} onChange={e => setSalesAssignId(e.target.value)}>
                          <option value="">Select operator</option>
                          {SALES_AGENTS.map(a => <option key={a.id} value={a.id}>{a.name} ({a.posLicense})</option>)}
                        </Select>
                      </Field>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" disabled={!salesAssignId}
                      onClick={assignToSales} style={{ marginBottom: 2, whiteSpace: 'nowrap' }}>
                      Assign →
                    </button>
                  </div>
                  {draft.salesAssignedTo && (
                    <div style={{ fontSize: 12, color: '#2d7d46', marginTop: 8 }}>
                      Currently assigned to: <strong>{KMD_AGENTS.find(a => a.id === draft.salesAssignedTo)?.name ?? '—'}</strong>
                    </div>
                  )}
                </section>
              )}

              {/* Call Logs */}
              <section>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12, color: 'var(--text-2)' }}>Call Log</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {draft.calls.map(call => (
                    <div key={call.callNo} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 16px', background: 'var(--surface-2)' }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10, color: 'var(--brand)' }}>Call {call.callNo}</div>
                      <div className="crm-drawer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <Field label="Date & Time">
                          <input type="datetime-local" value={call.time}
                            onChange={e => setCallField(call.callNo, 'time', e.target.value)}
                            style={{ width: '100%', padding: '7px 10px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', color: 'var(--text)', boxSizing: 'border-box' }}
                          />
                        </Field>
                        <Field label="Response">
                          <Select value={call.response} onChange={e => setCallField(call.callNo, 'response', e.target.value)}>
                            {CALL_RESPONSES.map(r => <option key={r} value={r}>{r || 'Select response'}</option>)}
                          </Select>
                        </Field>
                      </div>
                      <Field label="Comment">
                        <textarea value={call.comment} onChange={e => setCallField(call.callNo, 'comment', e.target.value)}
                          placeholder="Add a comment…" rows={2}
                          style={{ width: '100%', padding: '7px 10px', fontSize: 13, resize: 'vertical', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', boxSizing: 'border-box' }}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
              <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={saveDraft}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
