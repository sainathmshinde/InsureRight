import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS, PREMIUM_CHART, POLICY_TYPE_ICON } from '../product/productData'

// ── Per policyType styling ────────────────────────────────────────────────────
const PTYPE_META = {
  'Base Policy':        { color: '#2563eb', bg: '#dbeafe', border: '#bfdbfe' },
  'Top Up Policy':      { color: '#0891b2', bg: '#e0f2fe', border: '#7dd3fc' },
  'Super Top Up':       { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  'OPD':                { color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
  'Age Band Premium':   { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  'Payment Protection': { color: '#d97706', bg: '#fef3c7', border: '#fcd34d' },
  'Other':              { color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
}

// ── Per-product highlights ─────────────────────────────────────────────────────
const HIGHLIGHTS = {
  3:  ['Flexible sum insured ₹1L – ₹10L', 'Self & spouse cover', 'Go Digit cashless network', 'No room-rent capping'],
  6:  ['In-patient hospitalisation', 'Day care procedures covered', 'Pre & post hospitalisation', 'Network hospital cashless'],
  7:  ['OPD consultations covered', 'Diagnostics & pharmacy bills', 'No hospitalisation required', 'Teleconsultation included'],
  8:  ['EMI & loan payment protection', 'Accident & disability cover', 'Income replacement benefit', 'Fast cashless settlement'],
  9:  ['Group health — MAGMA General', 'Self, spouse & 2 children', 'Age-band based premium', 'Maternity benefit included'],
  10: ['Super Top Up — MAGMA General', 'Covers post-threshold expenses', 'Self & spouse coverage', 'Age-band flexible pricing'],
  11: ['Group health — Oriental Insurance', 'BPP employee coverage', 'Pre-existing disease cover', 'Family floater option'],
  12: ['Super Top Up — Oriental Insurance', 'Standalone over-threshold cover', 'BPP group plan', 'Low-cost top-up premium'],
  38: ['Super Top Up above ₹3L threshold', 'SBI General Insurance', 'Self & spouse covered', 'Slab-based sum insured'],
  39: ['Super Top Up above ₹4L threshold', 'SBI General Insurance', 'Cost-effective enhancement', 'Self & spouse coverage'],
  40: ['Super Top Up above ₹5L threshold', 'SBI General Insurance', 'Enhanced post-threshold cover', 'Affordable premium slabs'],
  42: ['SBI base health policy', 'Comprehensive hospitalisation', 'Cashless at SBI network', 'Pre & post hospitalisation'],
  43: ['OPD cover 2025-26', 'Outpatient consultations', 'Pharmacy & diagnostics', 'SBI General Insurance'],
  44: ['Group health BPP 2026-27', 'SBI General Insurance', 'Self, spouse & 2 children', 'Age-band premium structure'],
  45: ['Super Top Up BPP 2026-27', 'SBI General Insurance', 'Family floater available', 'Flexible threshold levels'],
  46: ['Base hospitalisation cover', 'Cashless facility available', 'Wide network hospitals', 'Renewal guaranteed'],
  47: ['Basic health coverage', 'In-patient hospitalisation', 'SBI General Insurance', 'Cashless at network hospitals'],
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtSI = n => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(0)}Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)}L`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
}

function getChartMeta(productId) {
  const rows = PREMIUM_CHART[productId] ?? []
  if (!rows.length) return null
  const premiums = rows.map(r => r.selfOnly).filter(v => v != null && v > 1)
  const sis      = rows.map(r => r.sumInsured).filter(v => v > 1)
  if (!premiums.length) return null
  return {
    minPremium: Math.min(...premiums),
    siMin:      Math.min(...sis),
    siMax:      Math.max(...sis),
  }
}

const uniqueTypes = [...new Set(PRODUCTS.map(p => p.policyType))]

// ── Component ─────────────────────────────────────────────────────────────────
export default function PolicyCatalogue() {
  const navigate    = useNavigate()
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch]         = useState('')

  const visible = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    return (
      (!q || p.name.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) &&
      (!typeFilter || p.policyType === typeFilter)
    )
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 12, color: '#ddd6fe', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px' }}>
          KMD Insurance — Product Catalogue
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Choose Your Plan</div>
        <div style={{ fontSize: 13.5, color: '#ede9fe', lineHeight: 1.6 }}>
          Browse our complete range — Base policies, Top-Ups, OPD, Group Health &amp; more
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 20 }}>
          {[
            { label: 'Products', value: PRODUCTS.length },
            { label: 'Insurers', value: [...new Set(PRODUCTS.map(p => p.provider))].length },
            { label: 'Plan Types', value: uniqueTypes.length },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#c4b5fd' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + type filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by name, insurer or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 220, padding: '9px 14px', fontSize: 13,
            border: '1.5px solid var(--border)', borderRadius: 8, outline: 'none',
            fontFamily: 'inherit', background: '#fff',
          }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['', ...uniqueTypes].map(t => {
            const m       = PTYPE_META[t] ?? PTYPE_META.Other
            const active  = typeFilter === t
            const icon    = t ? (POLICY_TYPE_ICON[t] ?? '📋') : '🗂️'
            return (
              <button
                key={t || '__all'}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${active ? m.border : 'var(--border)'}`,
                  background: active ? m.bg : '#fff',
                  color: active ? m.color : 'var(--text-3)',
                  transition: 'all .13s',
                }}
              >
                {icon} {t || 'All Plans'}
              </button>
            )
          })}
        </div>
        <span style={{ fontSize: 12.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          {visible.length} plan{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards grid */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', fontSize: 14 }}>
          No plans match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
          {visible.map(p => {
            const m     = PTYPE_META[p.policyType] ?? PTYPE_META.Other
            const icon  = POLICY_TYPE_ICON[p.policyType] ?? '📋'
            const chart = getChartMeta(p.id)
            const hiArr = HIGHLIGHTS[p.id] ?? [`${p.policyType} coverage`, 'Cashless hospitalisation', 'Wide network access', 'Quick claim settlement']

            return (
              <div key={p.id} style={{
                background: '#fff',
                border: `1.5px solid ${m.border}`,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column',
                transition: 'box-shadow .15s',
              }}>

                {/* Header strip */}
                <div style={{
                  background: m.bg, padding: '12px 16px',
                  borderBottom: `1px solid ${m.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                      {p.policyType}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 600,
                    color: m.color, background: '#fff',
                    border: `1px solid ${m.border}`, borderRadius: 5,
                    padding: '2px 7px',
                  }}>{p.code}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Name & provider */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.provider}</div>
                  </div>

                  {/* Premium & SI tiles */}
                  <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <div style={{ flex: 1, padding: '9px 12px', borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                      <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 3, fontWeight: 500 }}>Premium from</div>
                      {chart ? (
                        <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>
                          ₹{chart.minPremium.toLocaleString('en-IN')}
                          <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)' }}>/yr</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)' }}>On request</div>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: '9px 12px', background: 'var(--surface-2)' }}>
                      <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 3, fontWeight: 500 }}>Sum Insured</div>
                      {chart ? (
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>
                          {fmtSI(chart.siMin)} – {fmtSI(chart.siMax)}
                        </div>
                      ) : (
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)' }}>—</div>
                      )}
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {hiArr.slice(0, 4).map(h => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: 'var(--text-2)' }}>
                        <span style={{ color: m.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy button */}
                <div style={{ padding: '12px 16px', borderTop: `1px solid ${m.border}`, background: m.bg }}>
                  <button
                    type="button"
                    onClick={() => navigate('/policy/buy', { state: { productId: p.id } })}
                    style={{
                      width: '100%', padding: '10px', borderRadius: 8, border: 'none',
                      background: m.color, color: '#fff', fontWeight: 700, fontSize: 13.5,
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
