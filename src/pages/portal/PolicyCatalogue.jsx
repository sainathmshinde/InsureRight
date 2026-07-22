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

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtSI = n => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(0)}Cr`
  if (n >= 100000)   return `₹${(n / 100000).toFixed(0)}L`
  if (n >= 1000)     return `₹${(n / 1000).toFixed(0)}K`
  return `₹${n}`
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
      <div style={{ background: 'linear-gradient(180deg,#1565d8 0%,#104ea6 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#ddd6fe', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px' }}>
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
              <div style={{ fontSize: 13, color: '#c4b5fd' }}>{label}</div>
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
                  padding: '7px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
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
        <span style={{ fontSize: 13.5, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
          {visible.length} plan{visible.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards grid */}
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-3)', fontSize: 14 }}>
          No plans match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {visible.map(p => {
            const m           = PTYPE_META[p.policyType] ?? PTYPE_META.Other
            const chartRows   = PREMIUM_CHART[p.id] ?? []
            const uniqueSIs   = [...new Set(chartRows.map(r => r.sumInsured))]
            const firstRow    = chartRows[0]
            const allPremiums = chartRows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean))
            const minPremium  = allPremiums.length > 0 ? Math.min(...allPremiums) : null
            const covKeys     = ['selfOnly', 'selfSpouse', 'selfSpouse2Children'].filter(k => firstRow?.[k] != null)

            return (
              <div key={p.id} style={{
                borderRadius: 6, overflow: 'hidden', background: '#fff',
                border: '1px solid #dee1e5',
                boxShadow: '0 1px 4.5px rgba(193,197,212,.27)',
                display: 'flex', flexDirection: 'column',
              }}>

                {/* Header strip */}
                <div style={{ background: '#f5f7f9', padding: '16px 16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: m.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.provider}
                    </span>
                    <div style={{ width: 24, height: 24, borderRadius: 6, border: '1.5px solid #cbd5e1', background: '#fff', flexShrink: 0 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6, paddingBottom: 12 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6d747a' }}>{p.policyType}</span>
                    <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#94a3b8' }}>· {p.code}</span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

                  {/* Product name */}
                  <div style={{ fontWeight: 600, fontSize: 18, color: '#24304a', letterSpacing: '-.18px' }}>{p.name}</div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: 24 }}>
                    {uniqueSIs.length > 0 && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00c851" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#6d747a', textTransform: 'uppercase', letterSpacing: '.6px' }}>Sum Insured</span>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#24304a', letterSpacing: '-.18px' }}>
                          {fmtSI(Math.min(...uniqueSIs))}{uniqueSIs.length > 1 && ` – ${fmtSI(Math.max(...uniqueSIs))}`}
                        </div>
                      </div>
                    )}
                    {minPremium && (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1 .9-1.5 2-1.5s2.5.5 2.5 1.7c0 1.9-4.5 1.2-4.5 3.4 0 1.2 1.4 1.9 2.5 1.9s2-.6 2-1.6" /></svg>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#6d747a', textTransform: 'uppercase', letterSpacing: '.6px' }}>Premium starts</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 18, fontWeight: 600, color: '#24304a', letterSpacing: '-.18px' }}>₹ {minPremium.toLocaleString('en-IN')}</span>
                          <span style={{ fontSize: 14, color: '#6d747a' }}>/yr</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coverage chips */}
                  {covKeys.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {covKeys.includes('selfOnly')            && <span style={{ fontSize: 13, fontWeight: 500, background: '#fff', border: '1px solid #dee1e5', borderRadius: 20, padding: '3px 10px', color: '#6d747a' }}>Self</span>}
                      {covKeys.includes('selfSpouse')          && <span style={{ fontSize: 13, fontWeight: 500, background: '#fff', border: '1px solid #dee1e5', borderRadius: 20, padding: '3px 10px', color: '#6d747a' }}>Self + Spouse</span>}
                      {covKeys.includes('selfSpouse2Children') && <span style={{ fontSize: 13, fontWeight: 500, background: '#fff', border: '1px solid #dee1e5', borderRadius: 20, padding: '3px 10px', color: '#6d747a' }}>Family</span>}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, paddingTop: 4, marginTop: 'auto' }}>
                    <button
                      type="button"
                      onClick={() => navigate('/policy/buy', { state: { productId: p.id } })}
                      style={{ fontSize: 15, fontWeight: 600, border: 'none', color: '#3b5bfd', background: 'transparent', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      View Info
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b5bfd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
