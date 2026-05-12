import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AGENTS } from '../agent/agentData'
import { CUSTOMER_MOCK } from '../customer/CustomerList'
import { POLICY_MOCK } from '../policy/PolicyList'
import { PRODUCT_MOCK } from '../product/ProductList'

export default function Dashboard() {
  const { user } = useAuth()
  if (user?.role === 'agent')    return <AgentDashboard user={user} />
  if (user?.role === 'customer') return <CustomerDashboard user={user} />
  return <BrokerDashboard user={user} />
}

/* ═══════════════════════════════════════════════════════
   BROKER DASHBOARD
═══════════════════════════════════════════════════════ */
const BROKER_QUICK = [
  { label: 'Add Agent',    path: '/agent/create',    icon: '👤', color: '#7c3aed' },
  { label: 'Add Customer', path: '/customer/create', icon: '🧑', color: '#0891b2' },
  { label: 'Buy Policy',   path: '/policy/buy',      icon: '📋', color: '#059669' },
  { label: 'Add Product',  path: '/product/create',  icon: '📦', color: '#d97706' },
  { label: 'New Campaign', path: '/campaign/create', icon: '📣', color: '#dc2626' },
]
const BROKER_ACTIVITY = [
  { time: '2 hrs ago',  icon: '👤', text: 'Agent Ravi Kulkarni onboarded' },
  { time: '5 hrs ago',  icon: '🧑', text: 'Customer Suresh Kumar KYC verified' },
  { time: 'Yesterday',  icon: '📋', text: 'Policy SHI/2025/008901 issued' },
  { time: 'Yesterday',  icon: '💰', text: 'Commission credited ₹12,400' },
  { time: '2 days ago', icon: '📦', text: 'Star Senior Health product added' },
  { time: '3 days ago', icon: '📋', text: 'Policy LIC/2025/004012 renewed' },
]

function BrokerDashboard({ user }) {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const totalAgents    = AGENTS.length
  const activeAgents   = AGENTS.filter(a => a.status === 'Active').length
  const totalCustomers = CUSTOMER_MOCK.length
  const verifiedKyc    = CUSTOMER_MOCK.filter(c => c.kyc === 'Verified').length
  const activePolicies = POLICY_MOCK.filter(p => p.status === 'Active').length
  const pendingPayment = POLICY_MOCK.filter(p => p.paymentStatus === 'Pending').length
  const totalProducts  = PRODUCT_MOCK.length
  const activeProducts = PRODUCT_MOCK.filter(p => p.status === 'Active').length

  const brokerStats = [
    { label: 'Total Agents',    value: totalAgents,    sub: `${activeAgents} active`,         color: '#7c3aed', bg: '#f5f3ff', icon: '👤' },
    { label: 'Total Customers', value: totalCustomers, sub: `${verifiedKyc} KYC verified`,    color: '#0891b2', bg: '#ecfeff', icon: '🧑‍🤝‍🧑' },
    { label: 'Active Policies', value: activePolicies, sub: `${pendingPayment} pending payment`, color: '#059669', bg: '#f0fdf4', icon: '📋' },
    { label: 'Products Listed', value: totalProducts,  sub: `${activeProducts} active`,       color: '#d97706', bg: '#fffbeb', icon: '📦' },
  ]

  return (
    <div style={S.page}>
      <div style={S.banner}>
        <div>
          <div style={S.greetTxt}>{greet}, {user?.name?.split(' ')[0]} 👋</div>
          <div style={S.companytxt}>{user?.company}</div>
          <div style={S.irdaiTxt}>IRDAI Reg. {user?.irdaiNo} · {user?.city}, {user?.state}</div>
        </div>
        <div style={S.todayBox}>
          <div style={S.todayLbl}>Today</div>
          <div style={S.todayDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={S.statsGrid}>
        {brokerStats.map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={S.statLabel}>{s.label}</div>
                <div style={{ ...S.statValue, color: s.color }}>{s.value}</div>
              </div>
              <div style={{ ...S.statIcon, background: s.color + '22', color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ ...S.statSub, color: s.color + 'cc' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.row}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>
          <div style={S.quickGrid}>
            {BROKER_QUICK.map(q => (
              <button key={q.label} style={S.quickBtn} onClick={() => navigate(q.path)}>
                <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                <span style={S.quickLabel}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ ...S.card, flex: 1 }}>
          <div style={S.cardTitle}>Recent Activity</div>
          {BROKER_ACTIVITY.map((a, i) => (
            <div key={i} style={S.actRow}>
              <span style={S.actIcon}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={S.actText}>{a.text}</div>
                <div style={S.actTime}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   AGENT DASHBOARD
═══════════════════════════════════════════════════════ */
const AGENT_QUICK = [
  { label: 'Add Customer',  path: '/customer/create',  icon: '🧑', color: '#0891b2' },
  { label: 'Buy Policy',    path: '/policy/buy',       icon: '📋', color: '#059669' },
  { label: 'Commission',    path: '/agent/commission', icon: '💰', color: '#d97706' },
  { label: 'All Customers', path: '/customer',         icon: '👥', color: '#7c3aed' },
]

function AgentDashboard({ user }) {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const myCustomers      = CUSTOMER_MOCK.filter(c => c.agentId === user.id)
  const myPolicies       = POLICY_MOCK.filter(p => p.agentId === user.id)
  const myActivePolicies = myPolicies.filter(p => p.status === 'Active').length
  const myPendingPay     = myPolicies.filter(p => p.paymentStatus === 'Pending').length

  const agentStats = [
    { label: 'My Customers',       value: myCustomers.length,  sub: `${myCustomers.filter(c => c.kyc === 'Verified').length} KYC verified`, color: '#7c3aed', bg: '#f5f3ff', icon: '🧑‍🤝‍🧑' },
    { label: 'Policies Issued',    value: myActivePolicies,    sub: `${myPendingPay} pending payment`,   color: '#059669', bg: '#f0fdf4', icon: '📋' },
    { label: 'Commission (Month)', value: '₹15,200',           sub: '↑ 12% vs last month',              color: '#d97706', bg: '#fffbeb', icon: '💰' },
    { label: 'YTD Commission',     value: '₹1,24,500',         sub: 'Target: ₹2,00,000',               color: '#0891b2', bg: '#ecfeff', icon: '📈' },
  ]

  return (
    <div style={S.page}>
      <div style={{ ...S.banner, background: 'linear-gradient(120deg,#0891b2 0%,#0e7490 100%)' }}>
        <div>
          <div style={S.greetTxt}>{greet}, {user?.name?.split(' ')[0]} 👋</div>
          <div style={S.companytxt}>Agent · {user?.company}</div>
          <div style={S.irdaiTxt}>Reporting to K.M. Dastur & Co. Insurance Brokers</div>
        </div>
        <div style={S.todayBox}>
          <div style={S.todayLbl}>Today</div>
          <div style={S.todayDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={S.statsGrid}>
        {agentStats.map(s => (
          <div key={s.label} style={{ ...S.statCard, background: s.bg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={S.statLabel}>{s.label}</div>
                <div style={{ ...S.statValue, color: s.color, fontSize: typeof s.value === 'string' && s.value.startsWith('₹') ? 22 : 30 }}>{s.value}</div>
              </div>
              <div style={{ ...S.statIcon, background: s.color + '22', color: s.color }}>{s.icon}</div>
            </div>
            <div style={{ ...S.statSub, color: s.color + 'cc' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={S.row}>
        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>
          <div style={S.quickGrid}>
            {AGENT_QUICK.map(q => (
              <button key={q.label} style={S.quickBtn} onClick={() => navigate(q.path)}>
                <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                <span style={S.quickLabel}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...S.card, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.cardTitle}>My Customers</div>
            <button style={S.linkBtn} onClick={() => navigate('/customer')}>View all →</button>
          </div>
          {myCustomers.slice(0, 5).map((c, i) => (
            <div key={i} style={S.actRow}>
              <div style={{ ...S.initCircle, background: '#0891b222', color: '#0891b2' }}>
                {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.actText}>{c.name}</div>
                <div style={S.actTime}>{c.mobile} · {c.email}</div>
              </div>
              <span style={{ ...S.badge, background: c.kyc === 'Verified' ? '#dcfce7' : c.kyc === 'Pending' ? '#fef9c3' : '#fee2e2', color: c.kyc === 'Verified' ? '#166534' : c.kyc === 'Pending' ? '#854d0e' : '#991b1b' }}>
                {c.kyc}
              </span>
            </div>
          ))}
          {myCustomers.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <button style={S.linkBtn} onClick={() => navigate('/customer')}>+{myCustomers.length - 5} more →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CUSTOMER DASHBOARD
═══════════════════════════════════════════════════════ */
const CUST_QUICK = [
  { label: 'View Policies',  path: '/policy',       icon: '📋', color: '#059669' },
  { label: 'Update Profile', path: '/profile/edit', icon: '✏️', color: '#0891b2' },
]

function fmtDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m)-1]} ${y}`
}

function CustomerDashboard({ user }) {
  const navigate = useNavigate()

  const myPolicies    = POLICY_MOCK.filter(p => p.customerId === user.id)
  const activePols    = myPolicies.filter(p => p.status === 'Active')
  const nextRenewal   = activePols.sort((a, b) => a.endDate.localeCompare(b.endDate))[0]
  const completion    = 70

  return (
    <div style={S.page}>
      <div style={{ ...S.banner, background: 'linear-gradient(120deg,#059669 0%,#047857 100%)' }}>
        <div>
          <div style={S.greetTxt}>Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div style={S.companytxt}>Customer · K.M. Dastur & Co.</div>
          <div style={S.irdaiTxt}>{user?.email}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={S.todayBox}>
            <div style={S.todayLbl}>Next Renewal</div>
            <div style={S.todayDate}>{nextRenewal ? fmtDate(nextRenewal.endDate) : 'No active policy'}</div>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={S.cardTitle}>Profile Completion</div>
            <div style={{ fontSize: 12.5, color: '#9d94b8' }}>Complete your profile for faster policy issuance</div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: completion >= 80 ? '#059669' : '#d97706' }}>{completion}%</div>
        </div>
        <div style={S.progressTrack}>
          <div style={{ ...S.progressBar, width: `${completion}%`, background: completion >= 80 ? '#059669' : '#d97706' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { label: '✓ Personal Details', done: true  },
            { label: '✓ KYC (PAN)',        done: true  },
            { label: '✗ Aadhaar Verified', done: false },
            { label: '✗ Bank Details',     done: false },
          ].map(i => (
            <span key={i.label} style={{ fontSize: 12, color: i.done ? '#059669' : '#9d94b8', fontWeight: i.done ? 600 : 400 }}>{i.label}</span>
          ))}
        </div>
      </div>

      <div style={S.row}>
        <div style={{ ...S.card, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={S.cardTitle}>My Policies</div>
            <button style={S.linkBtn} onClick={() => navigate('/policy')}>View all →</button>
          </div>
          {myPolicies.length === 0 && (
            <div style={{ textAlign: 'center', color: '#9d94b8', padding: '24px 0', fontSize: 13 }}>
              No policies yet.
            </div>
          )}
          {myPolicies.map((p, i) => (
            <div key={i} style={{ padding: '14px', border: '1px solid #f0edf8', borderRadius: 10, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: '#1a1628' }}>{p.product}</div>
                <span style={{ ...S.badge, background: p.status === 'Active' ? '#dcfce7' : p.status === 'Pending' ? '#fef9c3' : '#fee2e2', color: p.status === 'Active' ? '#166534' : p.status === 'Pending' ? '#854d0e' : '#991b1b' }}>{p.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {[['Sum Insured', p.sumInsured], ['Premium', `₹${p.premium.toLocaleString()}/yr`], ['Renews', fmtDate(p.endDate)]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10.5, color: '#9d94b8', textTransform: 'uppercase', letterSpacing: '.3px' }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1628', marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 11.5, color: '#9d94b8' }}>Insurer: {p.icName}</div>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardTitle}>Quick Actions</div>
          <div style={S.quickGrid}>
            {CUST_QUICK.map(q => (
              <button key={q.label} style={S.quickBtn} onClick={() => navigate(q.path)}>
                <span style={{ ...S.quickIcon, background: q.color + '18', color: q.color }}>{q.icon}</span>
                <span style={S.quickLabel}>{q.label}</span>
              </button>
            ))}
          </div>
          {nextRenewal && (
            <div style={{ marginTop: 16, padding: '12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 4 }}>⚠ Renewal Due</div>
              <div style={{ fontSize: 12, color: '#78350f' }}>{nextRenewal.product} renews on {fmtDate(nextRenewal.endDate)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Shared styles ── */
const S = {
  page:        { display: 'flex', flexDirection: 'column', gap: 20 },
  banner:      { background: 'linear-gradient(120deg,#7c3aed 0%,#4f1d96 100%)', borderRadius: 14, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetTxt:    { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 },
  companytxt:  { fontSize: 13.5, color: '#ddd6fe', marginBottom: 2 },
  irdaiTxt:    { fontSize: 11.5, color: '#a78bfa' },
  todayBox:    { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 16px', textAlign: 'center', flexShrink: 0 },
  todayLbl:    { fontSize: 10, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '.8px' },
  todayDate:   { fontSize: 13, fontWeight: 600, color: '#fff', marginTop: 3 },
  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  statCard:    { borderRadius: 12, padding: '16px 18px', border: '1px solid rgba(0,0,0,0.04)' },
  statLabel:   { fontSize: 11.5, color: '#6b7280', fontWeight: 500, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.3px' },
  statValue:   { fontSize: 30, fontWeight: 800, lineHeight: 1 },
  statSub:     { fontSize: 11.5, marginTop: 8, fontWeight: 500 },
  statIcon:    { width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 },
  row:         { display: 'flex', gap: 16, alignItems: 'flex-start' },
  card:        { background: '#fff', borderRadius: 12, padding: '18px 20px', border: '1px solid #f0edf8' },
  cardTitle:   { fontSize: 13.5, fontWeight: 700, color: '#1a1628', marginBottom: 14 },
  quickGrid:   { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 190 },
  quickBtn:    { display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 8, border: '1px solid #f0edf8', background: '#faf9fc', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  quickIcon:   { width: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  quickLabel:  { fontSize: 13, fontWeight: 500, color: '#1a1628' },
  actRow:      { display: 'flex', alignItems: 'flex-start', gap: 11, padding: '9px 0', borderBottom: '1px solid #f5f3ff' },
  actIcon:     { fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 },
  actText:     { fontSize: 13, color: '#1a1628', fontWeight: 500 },
  actTime:     { fontSize: 11.5, color: '#9d94b8', marginTop: 2 },
  initCircle:  { width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  badge:       { padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, flexShrink: 0 },
  linkBtn:     { background: 'none', border: 'none', color: '#7c3aed', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0 },
  progressTrack: { height: 6, background: '#f0edf8', borderRadius: 99, overflow: 'hidden' },
  progressBar:   { height: '100%', borderRadius: 99, transition: 'width .4s ease' },
}
