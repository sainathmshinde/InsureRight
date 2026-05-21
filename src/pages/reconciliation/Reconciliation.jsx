import { useState, useRef } from 'react'
import { PageHeader } from '../../components/UI'
import { DocumentIcon } from '../../icons'
import { POLICY_MOCK } from '../policy/PolicyList'
import { ASSOCIATIONS } from '../customer/orgAssocData'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'

const CAMPAIGNS = [
  { id: 1,  name: 'Campaign 1' },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION' },
  { id: 6,  name: 'BPP Campaign' },
  { id: 7,  name: 'Test Campaign' },
  { id: 8,  name: 'SBI_STP_Campaign' },
  { id: 11, name: 'BPP Campaign_2026-2027' },
  { id: 12, name: 'Standalone campaign' },
]

const REJECT_REASONS = [
  'Amount mismatch',
  'Account number mismatch',
  'Cheque signature mismatch',
  'Cheque date expired',
  'UTR not found',
  'Duplicate entry',
  'Insufficient funds',
  'Customer details mismatch',
  'Other',
]

const LABEL = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '.5px',
}

const STATUS_META = {
  Initiated: { color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
  Rejected:  { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  Paid:      { color: '#15803d', bg: '#dcfce7', border: '#86efac' },
}

const STATUS_TABS = ['All', 'Initiated', 'Rejected']

const BASE_DATA = POLICY_MOCK
  .filter(p => p.paymentStatus === 'Initiated' || p.paymentStatus === 'Rejected')
  .map((p, i) => {
    let paymentType = p.paymentType
    if (paymentType !== 'NEFT' && paymentType !== 'Cheque') {
      paymentType = i % 2 === 0 ? 'NEFT' : 'Cheque'
    }
    return { ...p, paymentType, paymentMode: 'Offline' }
  })

function StatusPill({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.Initiated
  return (
    <span style={{
      padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
      background: m.bg, color: m.color, border: `1.5px solid ${m.border}`,
      display: 'inline-block', whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function fmt(v) { return v ? `₹${Number(v).toLocaleString('en-IN')}` : '—' }

function exportToExcel(rows) {
  const headers = [
    'ID', 'Proposal ID', 'Customer Name', 'Mobile', 'Product', 'IC Name',
    'Premium', 'Payment Mode', 'Pay Type', 'Campaign', 'Payment Status',
  ]
  const escape = v => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csvRows = [
    headers.join(','),
    ...rows.map(p => [
      p.id, p.proposalId, p.customerName, p.mobile, p.product, p.icName,
      p.premium, p.paymentMode, p.paymentType, p.campaignName, p.paymentStatus,
    ].map(escape).join(',')),
  ]
  // BOM for Excel UTF-8 compatibility
  const blob = new Blob(['﻿' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `reconciliation_${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Generate mock "uploaded" data from the records with realistic variations
function buildUploadedRows(records) {
  return records.map((r, i) => {
    const premiumDiff  = i % 6 === 0   // every 6th record has premium mismatch
    const nameDiff     = i % 11 === 0  // every 11th has name mismatch
    return {
      proposalId:   r.proposalId,
      customerName: nameDiff ? r.customerName.split(' ').reverse().join(' ') : r.customerName,
      premium:      premiumDiff ? r.premium + 500 : r.premium,
      paymentType:  r.paymentType,
      icName:       r.icName,
      uploadedStatus: 'Paid',  // IC says payment is received
    }
  })
}

export default function Reconciliation() {
  const fileRef = useRef()

  // mode: list | upload | review | done
  const [mode, setMode] = useState('list')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)

  // Live list data — starts from BASE_DATA, updated after reconciliation
  const [listData, setListData] = useState(BASE_DATA)

  // Top filter bar
  const [topCampaign, setTopCampaign] = useState('5')
  const [topAssoc,    setTopAssoc]    = useState('')
  const [campaignFilter, setCampaignFilter] = useState('5')

  // Table filters
  const [activeTab,    setActiveTab]    = useState('All')
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [payTypeFilter,setPayTypeFilter]= useState('')

  // Reconcile review state
  const [reconcileBase,   setReconcileBase]   = useState([])
  const [uploadedRows,    setUploadedRows]     = useState([])
  const [rowActions,      setRowActions]       = useState({})
  const [rowReasons,      setRowReasons]       = useState({})
  const [countAdj, setCountAdj] = useState({ acceptedInitiated: 0, acceptedRejected: 0, movedToRejected: 0 })

  const handleApply = () => setCampaignFilter(topCampaign)

  const filtered = listData.filter(p => {
    const matchTab      = activeTab === 'All' || p.paymentStatus === activeTab
    const matchCampaign = !campaignFilter || p.campaignId === Number(campaignFilter)
    const matchStatus   = !statusFilter   || p.paymentStatus === statusFilter
    const matchPayType  = !payTypeFilter  || p.paymentType   === payTypeFilter
    const q = search.toLowerCase()
    const matchSearch   = !search ||
      p.customerName.toLowerCase().includes(q) ||
      p.proposalId.toLowerCase().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    return matchTab && matchCampaign && matchStatus && matchPayType && matchSearch
  })

  const pg = usePagination(filtered, 10)
  const counts = {
    All:       462 - countAdj.acceptedInitiated - countAdj.acceptedRejected,
    Initiated: 82  - countAdj.acceptedInitiated - countAdj.movedToRejected,
    Rejected:  380 - countAdj.acceptedRejected  + countAdj.movedToRejected,
  }

  // ── start reconcile ────────────────────────────────────────────────────────
  const startReconcile = () => {
    setFile(null)
    setMode('upload')
  }

  const handleFile = f => { if (f) setFile(f) }

  const handleSubmitUpload = () => {
    const base    = filtered  // reconcile against currently filtered records
    const uploaded = buildUploadedRows(base)
    setReconcileBase(base)
    setUploadedRows(uploaded)
    setRowActions({})
    setRowReasons({})
    setMode('review')
  }

  const setAction = (id, action) =>
    setRowActions(prev => ({ ...prev, [id]: action }))

  const setReason = (id, reason) =>
    setRowReasons(prev => ({ ...prev, [id]: reason }))

  const handleFinalize = () => {
    const acceptedInitiated = reconcileBase.filter(r => rowActions[r.id] === 'accept' && r.paymentStatus === 'Initiated').length
    const acceptedRejected  = reconcileBase.filter(r => rowActions[r.id] === 'accept' && r.paymentStatus === 'Rejected').length
    const movedToRejected   = reconcileBase.filter(r => rowActions[r.id] === 'reject' && r.paymentStatus === 'Initiated').length

    setCountAdj(prev => ({
      acceptedInitiated: prev.acceptedInitiated + acceptedInitiated,
      acceptedRejected:  prev.acceptedRejected  + acceptedRejected,
      movedToRejected:   prev.movedToRejected   + movedToRejected,
    }))

    setListData(prev => prev.map(p => {
      const action = rowActions[p.id]
      if (action === 'accept') return { ...p, paymentStatus: 'Paid' }
      if (action === 'reject') return { ...p, paymentStatus: 'Rejected' }
      return p
    }).filter(p => p.paymentStatus !== 'Paid'))

    setMode('done')
  }

  const reviewCounts = {
    total:    reconcileBase.length,
    pending:  reconcileBase.filter(r => !rowActions[r.id]).length,
    accepted: Object.values(rowActions).filter(a => a === 'accept').length,
    rejected: Object.values(rowActions).filter(a => a === 'reject').length,
  }

  // ════════════════════════════════════════════════════════════════════════════
  // UPLOAD STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'upload') {
    return (
      <div>
        <PageHeader
          icon={<DocumentIcon />}
          title="Reconciliation — Upload"
          subtitle="Upload the IC / external data file to reconcile against filtered records"
        >
          <button className="btn btn-ghost" onClick={() => setMode('list')}>← Back</button>
        </PageHeader>

        <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Upload Payment Data File</div>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
              Upload the Excel or CSV file received from the insurance company. The data will be matched
              against the <strong>{filtered.length}</strong> records currently filtered on the reconciliation page.
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? 'var(--brand)' : file ? '#15803d' : 'var(--border)'}`,
                borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                padding: '44px 32px', transition: 'all .18s',
                background: dragging ? '#f5f3ff' : file ? '#f0fdf4' : 'var(--surface-2)',
              }}
            >
              <input
                ref={fileRef} type="file" accept=".csv,.xlsx,.xls"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#15803d' }}>{file.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>
                    Drag & drop your file here
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
                    or click to browse — CSV, XLSX, XLS supported
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setMode('list')}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={!file}
                onClick={handleSubmitUpload}
                style={{ opacity: file ? 1 : 0.5, cursor: file ? 'pointer' : 'not-allowed' }}
              >
                Submit & Compare →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // DONE STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'done') {
    return (
      <div>
        <PageHeader icon={<DocumentIcon />} title="Reconciliation Complete" subtitle="Summary of actions taken" />
        <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <div className="card-body" style={{ textAlign: 'center', padding: '44px 32px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Reconciliation Saved</div>
            <div style={{ fontSize: 13.5, color: 'var(--text-3)', marginBottom: 32 }}>
              {file?.name} · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
              {[
                { label: 'Total Records', value: reviewCounts.total,    bg: '#f5f3ff', color: '#7c3aed' },
                { label: 'Accepted (Paid)', value: reviewCounts.accepted, bg: '#dcfce7', color: '#15803d' },
                { label: 'Rejected',      value: reviewCounts.rejected, bg: '#fee2e2', color: '#dc2626' },
              ].map(k => (
                <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: '16px' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1628', marginTop: 4 }}>{k.label}</div>
                </div>
              ))}
            </div>
            {reviewCounts.pending > 0 && (
              <div style={{ background: '#fff3e0', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#a05c00' }}>
                ⚠️ {reviewCounts.pending} record(s) were not actioned.
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setMode('review')}>← Back to Review</button>
              <button className="btn btn-primary" onClick={() => { setMode('list'); setFile(null); setActiveTab('Rejected'); setStatusFilter('Rejected') }}>Done</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REVIEW STEP
  // ════════════════════════════════════════════════════════════════════════════
  if (mode === 'review') {
    const allActioned = reviewCounts.pending === 0

    return (
      <div>
        <PageHeader
          icon={<DocumentIcon />}
          title="Reconciliation Review"
          subtitle={`${file?.name} · ${reconcileBase.length} records matched`}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={() => setMode('upload')}>← Re-upload</button>
            <button className="btn btn-primary" onClick={handleFinalize}>
              Finalise →
            </button>
          </div>
        </PageHeader>

        {/* Review summary pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: `Total: ${reviewCounts.total}`,    bg: '#f5f3ff', color: '#7c3aed' },
            { label: `Pending: ${reviewCounts.pending}`, bg: '#fff3e0', color: '#92400e' },
            { label: `Accepted: ${reviewCounts.accepted}`, bg: '#dcfce7', color: '#15803d' },
            { label: `Rejected: ${reviewCounts.rejected}`, bg: '#fee2e2', color: '#dc2626' },
          ].map(p => (
            <span key={p.label} style={{
              padding: '5px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
              background: p.bg, color: p.color,
            }}>
              {p.label}
            </span>
          ))}
        </div>

        {/* Review table */}
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Proposal ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Pay Type</th>
                    <th style={{ textAlign: 'center' }}>Local Premium</th>
                    <th style={{ textAlign: 'center' }}>Uploaded Premium</th>
                    <th>System Status</th>
                    <th>IC Status</th>
                    <th style={{ minWidth: 230 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reconcileBase.map((rec, i) => {
                    const up     = uploadedRows[i]
                    const action = rowActions[rec.id]
                    const reason = rowReasons[rec.id] ?? ''
                    const premDiff = up && up.premium !== rec.premium
                    const nameDiff = up && up.customerName !== rec.customerName

                    return (
                      <tr key={rec.id} style={{
                        background: action === 'accept' ? '#f0fdf4' : action === 'reject' ? '#fff5f5' : '#fff',
                        borderLeft: `3px solid ${action === 'accept' ? '#16a34a' : action === 'reject' ? '#dc2626' : 'transparent'}`,
                      }}>
                        <td style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#7c3aed' }}>{rec.proposalId}</td>
                        <td style={{ fontWeight: 500 }}>
                          {nameDiff
                            ? <span title={`Uploaded: ${up.customerName}`} style={{ borderBottom: '1.5px dashed #f59e0b', cursor: 'help' }}>{rec.customerName}</span>
                            : rec.customerName}
                        </td>
                        <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-2)' }}>{rec.product}</td>
                        <td>{rec.paymentType}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{fmt(rec.premium)}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600, color: premDiff ? '#dc2626' : '#15803d' }}>
                          {up ? fmt(up.premium) : '—'}
                          {premDiff && <span title="Mismatch" style={{ marginLeft: 4 }}>⚠</span>}
                        </td>
                        <td><StatusPill status={rec.paymentStatus} /></td>
                        <td>
                          {up ? <StatusPill status={up.uploadedStatus} /> : '—'}
                        </td>
                        <td>
                          {action === 'accept' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: '#15803d' }}>✓ Accepted → Paid</span>
                              <button type="button" onClick={() => setAction(rec.id, null)}
                                style={{ fontSize: 11, color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 7px', cursor: 'pointer' }}>Undo</button>
                            </div>
                          )}
                          {action === 'reject' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#dc2626' }}>✕ Rejected</span>
                                <button type="button" onClick={() => setAction(rec.id, null)}
                                  style={{ fontSize: 11, color: '#64748b', background: 'none', border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 7px', cursor: 'pointer' }}>Undo</button>
                              </div>
                              {!reason && (
                                <select
                                  className="field-select"
                                  style={{ fontSize: 12, padding: '4px 8px' }}
                                  value={reason}
                                  onChange={e => setReason(rec.id, e.target.value)}
                                >
                                  <option value="">Select reason…</option>
                                  {REJECT_REASONS.map(r => <option key={r}>{r}</option>)}
                                </select>
                              )}
                              {reason && <span style={{ fontSize: 11.5, color: '#64748b' }}>{reason}</span>}
                            </div>
                          )}
                          {!action && (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => setAction(rec.id, 'accept')}
                                style={{
                                  padding: '5px 14px', borderRadius: 7, border: 'none',
                                  background: '#16a34a', color: '#fff', fontWeight: 700,
                                  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                                }}
                              >
                                ✓ Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => setAction(rec.id, 'reject')}
                                style={{
                                  padding: '5px 14px', borderRadius: 7,
                                  border: '1.5px solid #dc2626', background: '#fff',
                                  color: '#dc2626', fontWeight: 700,
                                  fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
                                }}
                              >
                                ✕ Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div style={{
          position: 'sticky', bottom: 0, background: '#fff',
          borderTop: '1px solid var(--border)', marginTop: 20,
          padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
            {reviewCounts.pending} record{reviewCounts.pending !== 1 ? 's' : ''} still pending
          </span>
          <button className="btn btn-primary" onClick={handleFinalize}>
            Finalise Reconciliation →
          </button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LIST (default)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div>
      <PageHeader
        icon={<DocumentIcon />}
        title="Reconciliation"
        subtitle="Review initiated and rejected payment records"
      />

      {/* Top filter bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px' }}>
              <label style={LABEL}>Campaign Name</label>
              <select className="field-select" style={{ marginTop: 5 }} value={topCampaign} onChange={e => setTopCampaign(e.target.value)}>
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: '1 1 260px' }}>
              <label style={LABEL}>Association</label>
              <select className="field-select" style={{ marginTop: 5 }} value={topAssoc} onChange={e => setTopAssoc(e.target.value)}>
                <option value="">All Associations</option>
                {ASSOCIATIONS.filter(a => a.isActive).map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <button
              type="button" onClick={handleApply}
              style={{
                padding: '10px 32px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 14, color: '#fff',
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                boxShadow: '0 2px 8px rgba(168,85,247,0.35)', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total',     count: counts.All,       color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Initiated', count: counts.Initiated, color: '#0369a1', bg: '#e0f2fe' },
          { label: 'Rejected',  count: counts.Rejected,  color: '#dc2626', bg: '#fee2e2' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1a1628', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">

          {/* Status tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {STATUS_TABS.map(t => (
              <button key={t} type="button" onClick={() => { setActiveTab(t); pg.reset() }}
                style={{
                  padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit', border: 'none',
                  background: activeTab === t ? '#a855f7' : '#f5f3ff',
                  color:      activeTab === t ? '#fff'    : '#a855f7',
                  transition: 'all .13s',
                }}>
                {t} <span style={{ fontSize: 11, opacity: .7 }}>({counts[t] ?? filtered.length})</span>
              </button>
            ))}
          </div>

          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={LABEL}>Search</label>
              <input className="field-input filter-search" placeholder="Customer, proposal, product, mobile…"
                value={search} onChange={e => { setSearch(e.target.value); pg.reset() }} style={{ width: 260 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={LABEL}>Status</label>
              <select className="field-select" style={{ width: 150 }} value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); pg.reset() }}>
                <option value="">All Status</option>
                <option value="Initiated">Initiated</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={LABEL}>Pay Type</label>
              <select className="field-select" style={{ width: 140 }} value={payTypeFilter}
                onChange={e => { setPayTypeFilter(e.target.value); pg.reset() }}>
                <option value="">All Types</option>
                <option value="NEFT">NEFT</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            {(statusFilter || payTypeFilter || search) && (
              <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end' }}
                onClick={() => { setStatusFilter(''); setPayTypeFilter(''); setSearch(''); pg.reset() }}>
                Clear
              </button>
            )}
            <div style={{ marginLeft: 'auto', alignSelf: 'flex-end', display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => exportToExcel(filtered)}
                style={{
                  padding: '9px 18px', borderRadius: 9, border: '2px solid #0ea5e9',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700,
                  fontSize: 13.5, color: '#0ea5e9', background: '#fff',
                  transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f9ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                ⬇ Export Excel
              </button>
              <button
                type="button"
                onClick={startReconcile}
                style={{
                  padding: '9px 22px', borderRadius: 9, border: '2px solid #a855f7',
                  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700,
                  fontSize: 13.5, color: '#a855f7', background: '#fff',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                Reconcile
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Proposal ID</th>
                  <th>Product</th>
                  <th>IC Name</th>
                  <th>Premium</th>
                  <th>Mode</th>
                  <th>Pay Type</th>
                  <th>Campaign</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pg.slice.length === 0 ? (
                  <tr><td colSpan={11} style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>No records found</td></tr>
                ) : pg.slice.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--text-3)' }}>{p.id}</td>
                    <td style={{ fontWeight: 500 }}>{p.customerName}</td>
                    <td style={{ color: '#64748b' }}>{p.mobile}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#7c3aed' }}>{p.proposalId}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.product}</td>
                    <td style={{ color: '#64748b' }}>{p.icName}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(p.premium)}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: '#fef3c7', color: '#92400e' }}>
                        {p.paymentMode}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{p.paymentType}</span></td>
                    <td style={{ fontSize: 11.5, color: 'var(--text-2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.campaignName}</td>
                    <td><StatusPill status={p.paymentStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />

        </div>
      </div>
    </div>
  )
}
