import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PRODUCTS = [
  { id: 1,  name: 'Star Comprehensive Health',       code: 'SHI-HC-001',   type: 'Health', ic: 'Star Health Insurance', category: 'Family',     premium: 8500,  sumInsured: '₹5L – ₹50L',  highlights: ['In-patient hospitalisation','Day care procedures','Pre & post hospitalisation 60/180 days','Ambulance cover — road & air'] },
  { id: 2,  name: 'HDFC ERGO Optima Secure',         code: 'HER-HS-002',   type: 'Health', ic: 'HDFC ERGO',             category: 'Individual', premium: 6200,  sumInsured: '₹3L – ₹25L',  highlights: ['No room-rent sub-limit','Unlimited restoration of SI','NCB up to 50%','Cashless at 10,000+ hospitals'] },
  { id: 3,  name: 'ICICI Lombard Complete Health',   code: 'ICL-HC-003',   type: 'Health', ic: 'ICICI Lombard',         category: 'Family',     premium: 9100,  sumInsured: '₹5L – ₹1Cr',  highlights: ['OPD cover included','Maternity & new-born cover','AYUSH treatment covered','Global cover option'] },
  { id: 4,  name: 'Bajaj Allianz Comprehensive Motor', code: 'BAJ-MC-004', type: 'Motor',  ic: 'Bajaj Allianz',         category: 'Individual', premium: 4800,  sumInsured: 'IDV-based',    highlights: ['Zero depreciation cover','Engine protect add-on','24×7 roadside assistance','Cashless at 4,000+ garages'] },
  { id: 5,  name: 'New India Motor OD + TP',         code: 'NIA-MC-005',   type: 'Motor',  ic: 'New India Assurance',   category: 'Individual', premium: 3600,  sumInsured: 'IDV-based',    highlights: ['Own damage + third party','Personal accident cover ₹15L','NCB retention on claim-free year','Pan-India cashless garages'] },
  { id: 6,  name: 'LIC Jeevan Anand',               code: 'LIC-LA-006',   type: 'Life',   ic: 'LIC',                   category: 'Individual', premium: 12000, sumInsured: '₹10L – ₹1Cr', highlights: ['Whole-life + endowment plan','Death + maturity benefit','Guaranteed bonus every year','Loan facility against policy'] },
  { id: 7,  name: 'HDFC Life Sanchay Plus',          code: 'HDFC-LSP-007', type: 'Life',   ic: 'HDFC Life',             category: 'Individual', premium: 18000, sumInsured: '₹25L – ₹2Cr', highlights: ['Guaranteed returns','Flexible payout options','Income or lump-sum benefit','Tax benefit under 80C & 10(10D)'] },
  { id: 9,  name: 'Star Senior Health',              code: 'SHI-SH-009',   type: 'Health', ic: 'Star Health Insurance', category: 'Individual', premium: 14000, sumInsured: '₹3L – ₹15L',  highlights: ['Entry age up to 75 years','No pre-policy health check-up','Day-care & domiciliary covered','Cashless at Star network hospitals'] },
  { id: 10, name: 'ICICI Lombard Two Wheeler',       code: 'ICL-TW-010',   type: 'Motor',  ic: 'ICICI Lombard',         category: 'Individual', premium: 1800,  sumInsured: 'IDV-based',    highlights: ['Comprehensive two-wheeler plan','Zero depreciation available','Personal accident ₹15L','Instant policy issuance'] },
  { id: 11, name: 'Bajaj Allianz Health Guard',      code: 'BAJ-HG-011',   type: 'Health', ic: 'Bajaj Allianz',         category: 'Group',      premium: 5500,  sumInsured: '₹3L – ₹10L',  highlights: ['Group health for employees','Maternity benefit included','Pre-existing diseases covered','Floater & individual options'] },
]

const TYPE_META = {
  Health: { icon: '🏥', color: '#2d7d46', bg: '#e6f4ea', border: '#a8d5b5' },
  Motor:  { icon: '🚗', color: '#0a7ea4', bg: '#e0f4fb', border: '#7ecae0' },
  Life:   { icon: '🛡️', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
}

export default function PolicyCatalogue() {
  const navigate     = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch]         = useState('')

  const visible = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.ic.toLowerCase().includes(q)
    const matchType   = !typeFilter || p.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#2d7d46 0%,#14532d 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#bbf7d0', marginBottom: 6, fontWeight: 500 }}>Insurance Catalogue</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Buy a Policy</div>
        <div style={{ fontSize: 13.5, color: '#dcfce7' }}>Browse plans curated for you — Health, Motor and Life insurance</div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by plan or insurer…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 220, padding: '9px 14px', fontSize: 13,
            border: '1.5px solid #e8e4f0', borderRadius: 8, outline: 'none',
            fontFamily: 'inherit', background: '#fff',
          }}
        />
        {['', 'Health', 'Motor', 'Life'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit', border: '1.5px solid',
              borderColor: typeFilter === t ? (t ? TYPE_META[t]?.color : '#7c3aed') : '#e8e4f0',
              background:  typeFilter === t ? (t ? TYPE_META[t]?.bg    : '#f5f3ff') : '#fff',
              color:       typeFilter === t ? (t ? TYPE_META[t]?.color : '#7c3aed') : '#5c5573',
            }}
          >
            {t ? `${TYPE_META[t].icon} ${t}` : 'All Plans'}
          </button>
        ))}
        <span style={{ fontSize: 13, color: '#9d94b8' }}>{visible.length} plan{visible.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Cards grid */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#9d94b8', fontSize: 14 }}>
          No plans match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18 }}>
          {visible.map(p => {
            const m = TYPE_META[p.type]
            return (
              <div key={p.id} style={{
                background: '#fff', border: `1.5px solid ${m.border}`,
                borderRadius: 14, overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column',
              }}>

                {/* Card header strip */}
                <div style={{ background: m.bg, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${m.border}` }}>
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>{p.type}</span>
                    <span style={{ fontSize: 11, color: '#9d94b8', marginLeft: 8 }}>· {p.category}</span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1628', lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: '#9d94b8' }}>{p.ic} &nbsp;·&nbsp; <span style={{ fontFamily: 'monospace' }}>{p.code}</span></div>
                  </div>

                  {/* Premium & SI */}
                  <div style={{ display: 'flex', gap: 0, background: '#faf9fc', borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e4f0' }}>
                    <div style={{ flex: 1, padding: '10px 14px', borderRight: '1px solid #e8e4f0' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Premium from</div>
                      <div style={{ fontSize: 17, fontWeight: 800, color: m.color }}>₹{p.premium.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 400, color: '#9d94b8' }}>/yr</span></div>
                    </div>
                    <div style={{ flex: 1, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 3 }}>Sum Insured</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1628' }}>{p.sumInsured}</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {p.highlights.map(h => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: '#3d3555' }}>
                        <span style={{ color: m.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy button */}
                <div style={{ padding: '14px 18px', borderTop: '1px solid #f0edf8' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/policy/buy', { state: { productId: p.id, productName: p.name } })}
                    style={{
                      width: '100%', padding: '11px', borderRadius: 8, border: 'none',
                      background: m.color, color: '#fff', fontWeight: 700, fontSize: 14,
                      cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.2,
                      transition: 'opacity .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Buy Now →
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
