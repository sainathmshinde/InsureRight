import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { IC_LIST } from '../../data/icData'

const STATS = [
  { label: 'Active Policies',  value: '2',    sub: 'Health & Motor',       color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Total Coverage',   value: '₹15L', sub: 'Combined sum insured',  color: '#2d7d46', bg: '#e6f4ea' },
  { label: 'Renewal Due',      value: '1',    sub: 'Within 30 days',       color: '#a05c00', bg: '#fff3e0' },
  { label: 'Claims Filed',     value: '0',    sub: 'No claims this year',   color: '#0a7ea4', bg: '#e0f4fb' },
]

const MY_POLICIES = [
  {
    id: 'POL-2025-001',
    product: 'Star Comprehensive Health',
    ic: 'Star Health Insurance',
    type: 'Health',
    sumInsured: '₹10,00,000',
    premium: '₹8,500 / yr',
    startDate: '18/04/2025',
    endDate: '10/04/2026',
    status: 'Active',
  },
  {
    id: 'POL-2025-002',
    product: 'Bajaj Allianz Comprehensive Motor',
    ic: 'Bajaj Allianz',
    type: 'Motor',
    sumInsured: 'IDV-based',
    premium: '₹4,800 / yr',
    startDate: '01/05/2025',
    endDate: '30/04/2026',
    status: 'Renewal Due',
  },
]

const COVERAGE_HIGHLIGHTS = [
  { icon: '🏥', label: 'In-patient Hospitalisation', detail: 'Covered up to ₹10L' },
  { icon: '💉', label: 'Day Care Procedures',         detail: '541 procedures covered' },
  { icon: '🚑', label: 'Ambulance Cover',             detail: 'Road & Air up to ₹50,000' },
  { icon: '📅', label: 'Pre & Post Hospitalisation', detail: '60 days pre / 180 days post' },
]

const FAMILY_MEMBERS = [
  { relation: 'Spouse',   name: 'Priya Sharma',  dob: '22/07/1992', gender: 'Female', covered: true  },
  { relation: 'Son',      name: 'Aryan Sharma',  dob: '10/02/2016', gender: 'Male',   covered: true  },
  { relation: 'Daughter', name: 'Aanya Sharma',  dob: '05/09/2019', gender: 'Female', covered: true  },
]

const RELATION_META = {
  Spouse:   { icon: '👩', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  Son:      { icon: '👦', color: '#0a7ea4', bg: '#e0f4fb', border: '#7ecae0' },
  Daughter: { icon: '👧', color: '#c2185b', bg: '#fce4ec', border: '#f48fb1' },
}

export default function CustomerPortal() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg,#2d7d46 0%,#14532d 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#bbf7d0', marginBottom: 6, fontWeight: 500 }}>Customer Portal</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back, {user?.name} 👋</div>
        <div style={{ fontSize: 13.5, color: '#dcfce7' }}>Your insurance is managed by K.M. Dastur & Co.</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 12, padding: '20px 22px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1628', marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: '#9d94b8', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* My Policies */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>My Policies</div>
            <button type="button" className="btn btn-primary" style={{ fontSize: 13, padding: '6px 16px' }} onClick={() => navigate('/policy/buy')}>
              + Buy New Policy
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {MY_POLICIES.map(p => (
              <div key={p.id} style={{ border: '1px solid #e8e4f0', borderRadius: 12, padding: '16px 20px', background: p.status === 'Renewal Due' ? '#fffbeb' : '#faf9fc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.product}</div>
                    <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 2 }}>{p.ic} &nbsp;·&nbsp; {p.id}</div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600,
                    background: p.status === 'Active' ? '#e6f4ea' : '#fff3e0',
                    color:      p.status === 'Active' ? '#2d7d46' : '#a05c00',
                  }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, fontSize: 12.5 }}>
                  {[
                    { l: 'Type',         v: p.type        },
                    { l: 'Sum Insured',  v: p.sumInsured  },
                    { l: 'Premium',      v: p.premium     },
                    { l: 'Valid Until',  v: p.endDate     },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div style={{ color: '#9d94b8', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontWeight: 600, color: '#1a1628' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {p.status === 'Renewal Due' && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12.5, color: '#a05c00', fontWeight: 500 }}>⚠️ Expires on {p.endDate} — renew now to stay covered</span>
                    <button type="button" className="btn btn-primary" style={{ fontSize: 12, padding: '5px 14px' }} onClick={() => navigate('/policy/buy')}>Renew</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="card">
        <div className="card-body">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Family Members</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {FAMILY_MEMBERS.map(m => {
              const meta = RELATION_META[m.relation]
              return (
                <div key={m.relation} style={{ border: `1.5px solid ${meta.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ background: meta.bg, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${meta.border}` }}>
                    <span style={{ fontSize: 26 }}>{meta.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>{m.relation}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1628', marginTop: 1 }}>{m.name}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: m.covered ? '#e6f4ea' : '#fce8e6', color: m.covered ? '#2d7d46' : '#c0392b' }}>
                      {m.covered ? 'Covered' : 'Not Covered'}
                    </span>
                  </div>
                  <div style={{ padding: '12px 16px', display: 'flex', gap: 20, fontSize: 12.5 }}>
                    <div>
                      <div style={{ color: '#9d94b8', marginBottom: 2 }}>Date of Birth</div>
                      <div style={{ fontWeight: 600, color: '#1a1628' }}>{m.dob}</div>
                    </div>
                    <div>
                      <div style={{ color: '#9d94b8', marginBottom: 2 }}>Gender</div>
                      <div style={{ fontWeight: 600, color: '#1a1628' }}>{m.gender}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Coverage highlights */}
      <div className="card">
        <div className="card-body">
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Health Coverage Highlights</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {COVERAGE_HIGHLIGHTS.map(c => (
              <div key={c.label} style={{ padding: '14px 16px', border: '1px solid #e8e4f0', borderRadius: 10, background: '#faf9fc' }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1628', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: '#9d94b8' }}>{c.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Insurers */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Backed by Trusted Insurers</div>
              <div style={{ fontSize: 12.5, color: '#9d94b8', marginTop: 3 }}>K.M. Dastur & Co. works with India's top IRDAI-regulated insurance companies</div>
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 12.5, padding: '6px 14px' }}
              onClick={() => navigate('/insurance-partners')}
            >
              View All Partners →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {IC_LIST.map(ic => (
              <button
                key={ic.id}
                type="button"
                onClick={() => navigate('/insurance-partners')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '14px 12px', borderRadius: 12,
                  border: `1.5px solid ${ic.border}`,
                  background: ic.bg,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'box-shadow .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: 28 }}>{ic.logo}</span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: ic.color, lineHeight: 1.2 }}>{ic.shortName}</div>
                  <div style={{ fontSize: 11, color: '#9d94b8', marginTop: 4 }}>{ic.claimRatio}% claims</div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {ic.types.map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, background: 'rgba(255,255,255,0.7)', color: ic.color, fontWeight: 600, border: `1px solid ${ic.border}` }}>{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
