import { useState } from 'react'
import { PageHeader } from '../../components/UI'
import { DownloadPolicyIcon } from '../../icons'
import { PAYMENT_STATUSES } from '../../constants/paymentStatus'

const CAMPAIGNS = [
  { id: 1,  name: 'Campaign 1' },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION' },
  { id: 6,  name: 'BPP Campaign' },
  { id: 7,  name: 'Test Campaign' },
  { id: 8,  name: 'SBI_STP_Campaign' },
  { id: 11, name: 'BPP Campaign_2026-2027' },
  { id: 12, name: 'Standalone campaign' },
]

const PAYMENT_TYPES = ['Cheque', 'NEFT', 'UPI', 'Gateway', 'Unknown']

// Mock records used to derive preview count and CSV rows
const MOCK_RECORDS = [
  { id: 'PAY-2026-001', member: 'Aarav Sharma',   policy: 'POL-2026-1001', product: 'Star Comprehensive Health',    campaignId: 11, campaignName: 'BPP Campaign_2026-2027',  method: 'Cheque',  amount: 18500, date: '2026-04-12', status: 'Pending payment',    reference: 'CHQ-004521'        },
  { id: 'PAY-2026-002', member: 'Priya Mehta',    policy: 'POL-2026-1002', product: 'HDFC ERGO Optima Secure',      campaignId: 11, campaignName: 'BPP Campaign_2026-2027',  method: 'NEFT',    amount: 24200, date: '2026-04-14', status: 'Pending payment',  reference: 'NEFT240412001823'  },
  { id: 'PAY-2026-003', member: 'Rohan Verma',    policy: 'POL-2026-1003', product: 'Bajaj Allianz Health Guard',   campaignId: 6,  campaignName: 'BPP Campaign',            method: 'Cheque',  amount: 12800, date: '2026-04-15', status: 'Payment Failed',   reference: 'CHQ-009832'        },
  { id: 'PAY-2026-004', member: 'Sneha Iyer',     policy: 'POL-2026-1004', product: 'Star Comprehensive Health',    campaignId: 8,  campaignName: 'SBI_STP_Campaign',        method: 'UPI',     amount: 52000, date: '2026-04-15', status: 'Payment received (completed)',  reference: 'UPI240415002711'   },
  { id: 'PAY-2026-005', member: 'Rahul Gupta',    policy: 'POL-2026-1005', product: 'Bajaj Allianz Comprehensive',  campaignId: 1,  campaignName: 'Campaign 1',              method: 'Gateway', amount: 9500,  date: '2026-04-16', status: 'Pending payment',  reference: 'GTW240416008842'   },
  { id: 'PAY-2026-006', member: 'Kavita Pillai',  policy: 'POL-2026-1006', product: 'HDFC ERGO Optima Secure',      campaignId: 11, campaignName: 'BPP Campaign_2026-2027',  method: 'Cheque',  amount: 31000, date: '2026-04-17', status: 'Payment Failed',   reference: 'CHQ-012203'        },
  { id: 'PAY-2026-007', member: 'Vikram Rao',     policy: 'POL-2026-1007', product: 'Star Comprehensive Health',    campaignId: 8,  campaignName: 'SBI_STP_Campaign',        method: 'NEFT',    amount: 16750, date: '2026-04-18', status: 'Payment Failed',     reference: 'NEFT240418003512'  },
  { id: 'PAY-2026-008', member: 'Divya Nair',     policy: 'POL-2026-1008', product: 'Bajaj Allianz Health Guard',   campaignId: 6,  campaignName: 'BPP Campaign',            method: 'Unknown', amount: 8200,  date: '2026-04-20', status: 'Pending payment',    reference: '—'                 },
  { id: 'PAY-2026-009', member: 'Arjun Singh',    policy: 'POL-2026-1009', product: 'HDFC ERGO Optima Secure',      campaignId: 1,  campaignName: 'Campaign 1',              method: 'Cheque',  amount: 44500, date: '2026-04-21', status: 'Pending payment',    reference: 'CHQ-019882'        },
  { id: 'PAY-2026-010', member: 'Meera Joshi',    policy: 'POL-2026-1010', product: 'Star Comprehensive Health',    campaignId: 12, campaignName: 'Standalone campaign',     method: 'Gateway', amount: 67000, date: '2026-04-22', status: 'Pending payment', reference: '—'                 },
]

function applyFilters(records, campaign, paymentType, paymentStatus) {
  return records.filter(r => {
    if (campaign      && r.campaignId !== Number(campaign)) return false
    if (paymentType   && r.method     !== paymentType)      return false
    if (paymentStatus && r.status     !== paymentStatus)    return false
    return true
  })
}

function buildCSV(records) {
  const headers = [
    'Payment ID', 'Member Name', 'Product',
    'Campaign', 'Payment Method', 'Amount (INR)', 'Date', 'Status', 'Reference / Cheque No',
  ]
  const rows = records.map(r => [
    r.id, r.member, r.product,
    r.campaignName, r.method, r.amount, r.date, r.status, r.reference,
  ])
  return [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n')
}

function buildFilename(campaign, paymentType, paymentStatus) {
  const parts = ['payments_extract']
  if (campaign)      parts.push(CAMPAIGNS.find(c => c.id === Number(campaign))?.name.replace(/\s+/g, '_') ?? '')
  if (paymentType)   parts.push(paymentType === 'BankTransfer' ? 'NEFT_RTGS_IMPS' : paymentType)
  if (paymentStatus) parts.push(paymentStatus)
  parts.push(new Date().toISOString().slice(0, 10))
  return parts.join('_') + '.xlsx'
}

export default function ExtractPayments() {
  const [campaign,       setCampaign]       = useState('')
  const [paymentType,    setPaymentType]    = useState('')
  const [paymentStatus,  setPaymentStatus]  = useState('')
  const [downloading,    setDownloading]    = useState(false)
  const [lastDownloaded, setLastDownloaded] = useState(null)

  const preview = applyFilters(MOCK_RECORDS, campaign, paymentType, paymentStatus)

  const handleDownload = () => {
    const records = applyFilters(MOCK_RECORDS, campaign, paymentType, paymentStatus)
    setDownloading(true)

    // Simulate a brief server delay
    setTimeout(() => {
      const csv      = buildCSV(records)
      const blob     = new Blob([csv], { type: 'application/vnd.ms-excel' })
      const url      = URL.createObjectURL(blob)
      const a        = document.createElement('a')
      a.href         = url
      a.download     = buildFilename(campaign, paymentType, paymentStatus)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setLastDownloaded(buildFilename(campaign, paymentType, paymentStatus))
      setDownloading(false)
    }, 800)
  }

  return (
    <div>
      <PageHeader
        icon={<DownloadPolicyIcon />}
        title="Extract Member & Payments"
        subtitle="Filter and download offline payment data as an Excel file"
      />

      <div className="card">
        <div className="card-body">
        <div style={{ maxWidth: 480 }}>

          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Select Filters</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>
            Leave a filter blank to include all values for that field.
          </div>

          {/* Dropdowns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Campaign
              </label>
              <select
                className="field-select"
                value={campaign}
                onChange={e => setCampaign(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Payment Type
              </label>
              <select
                className="field-select"
                value={paymentType}
                onChange={e => setPaymentType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">All Types</option>
                {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' }}>
                Payment Status
              </label>
              <select
                className="field-select"
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">All Statuses</option>
                {PAYMENT_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={preview.length === 0 || downloading}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 28px', borderRadius: 10, border: 'none',
              background: preview.length === 0 ? '#e5e7eb' : 'linear-gradient(180deg,#1565d8 0%,#104ea6 100%)',
              color: preview.length === 0 ? '#9ca3af' : '#fff',
              fontWeight: 700, fontSize: 15, cursor: preview.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'opacity .15s', width: '100%', justifyContent: 'center',
              opacity: downloading ? .75 : 1,
            }}
          >
            {downloading ? (
              <>
                <span style={{ fontSize: 18 }}>⏳</span>
                Preparing file…
              </>
            ) : (
              <>
                <span style={{ fontSize: 18 }}>⬇</span>
                Download Excel
                {preview.length > 0 && (
                  <span style={{ fontSize: 13, fontWeight: 400, opacity: .85 }}>
                    ({preview.length} record{preview.length !== 1 ? 's' : ''})
                  </span>
                )}
              </>
            )}
          </button>

          {preview.length === 0 && (
            <div style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 10 }}>
              No records match the selected filters.
            </div>
          )}

          {/* Last download confirmation */}
          {lastDownloaded && !downloading && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 16 }}>✅</span>
              <div style={{ fontSize: 13, color: '#166534' }}>
                Downloaded <strong>{lastDownloaded}</strong>
              </div>
            </div>
          )}

        </div>
        </div>
      </div>
    </div>
  )
}
