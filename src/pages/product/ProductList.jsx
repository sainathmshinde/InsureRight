import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { PageHeader, Button, EmptyState } from '../../components/UI'
import { ProductIcon } from '../../icons'
import { PRODUCTS, POLICY_TYPES, PREMIUM_CHART, POLICY_TYPE_ICON } from './productData'

const TYPE_COLORS = {
  'Base Policy':        { color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
  'OPD':                { color: '#15803d', bg: '#dcfce7', border: '#86efac' },
  'Payment Protection': { color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  'Age Band Premium':   { color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  'Super Top Up':       { color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
  'Top Up Policy':      { color: '#4f46e5', bg: '#eef2ff', border: '#a5b4fc' },
}

function fmtSI(v) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`
  if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}K`
  return `₹${v}`
}

export default function ProductList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setType] = useState('')

  const filtered = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.name.toLowerCase().includes(q) ||
       p.code.toLowerCase().includes(q) ||
       p.provider.toLowerCase().includes(q)) &&
      (typeFilter ? p.policyType === typeFilter : true)
    )
  })

  const pg = usePagination(filtered, 12)
  const handle = setter => v => { setter(v); pg.reset() }
  const uniqueTypes = [...new Set(PRODUCTS.map(p => p.policyType))]

  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Product Catalogue">
        <Button onClick={() => navigate('/product/create')}>+ Add Product</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          {/* Filters */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <input className="field-input filter-search" style={{ width: '100%' }} placeholder="Search by name, code or provider…"
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Policy Type</label>
              <select className="field-select" style={{ width: '100%' }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
                <option value="">All Types</option>
                {uniqueTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {(search || typeFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setType)('') }}>Clear</Button>
              </div>
            )}
          </div>

          {/* Card grid */}
          {pg.slice.length === 0 ? (
            <EmptyState icon="📦" title="No products found" subtitle="Try adjusting your filters" />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
              {pg.slice.map(p => {
                const tc          = TYPE_COLORS[p.policyType] ?? { color: '#64748b', bg: '#f1f5f9', border: '#cbd5e1' }
                const icon        = POLICY_TYPE_ICON[p.policyType] ?? '📋'
                const chartRows   = PREMIUM_CHART[p.id] ?? []
                const uniqueSIs   = [...new Set(chartRows.map(r => r.sumInsured))]
                const firstRow    = chartRows[0]
                const allPremiums = chartRows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean))
                const minPremium  = allPremiums.length > 0 ? Math.min(...allPremiums) : null
                const covKeys     = ['selfOnly', 'selfSpouse', 'selfSpouse2Children'].filter(k => firstRow?.[k] != null)

                return (
                  <div key={p.id} style={{
                    borderRadius: 14, overflow: 'hidden', background: '#fff',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 1px 6px rgba(0,0,0,.06)',
                    display: 'flex', flexDirection: 'column',
                    transition: 'box-shadow .15s',
                  }}>
                    {/* Top accent */}
                    <div style={{ height: 4, background: `linear-gradient(90deg,${tc.color},${tc.color}88)` }} />

                    {/* Body */}
                    <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

                      {/* Provider + type row */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: tc.bg, border: `1.5px solid ${tc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: tc.color, letterSpacing: '.2px', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.provider}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, borderRadius: 4, padding: '1px 7px' }}>{p.policyType}</span>
                            <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#94a3b8' }}>{p.code}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803d' }}>● Active</span>
                          </div>
                        </div>
                      </div>

                      {/* Product name */}
                      <div style={{ fontWeight: 800, fontSize: 14, color: '#1e293b', lineHeight: 1.4, letterSpacing: '-.1px' }}>{p.name}</div>

                      {/* Metrics */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {uniqueSIs.length > 0 && (
                          <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Sum Insured</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                              {fmtSI(Math.min(...uniqueSIs))}{uniqueSIs.length > 1 && ` – ${fmtSI(Math.max(...uniqueSIs))}`}
                            </div>
                          </div>
                        )}
                        {minPremium ? (
                          <div style={{ flex: 1, background: tc.bg, borderRadius: 8, padding: '8px 10px', border: `1px solid ${tc.border}` }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: tc.color, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3, opacity: .8 }}>Starts From</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: tc.color }}>₹{minPremium.toLocaleString('en-IN')}<span style={{ fontSize: 10, fontWeight: 600 }}>/yr</span></div>
                          </div>
                        ) : (
                          <div style={{ flex: 1, background: '#f8fafc', borderRadius: 8, padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 }}>Premium</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8' }}>On request</div>
                          </div>
                        )}
                      </div>

                      {/* Coverage chips */}
                      {covKeys.length > 0 && (
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {covKeys.includes('selfOnly')            && <span style={{ fontSize: 11, fontWeight: 600, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '3px 10px', color: '#475569' }}>👤 Self</span>}
                          {covKeys.includes('selfSpouse')          && <span style={{ fontSize: 11, fontWeight: 600, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '3px 10px', color: '#475569' }}>👫 Self + Spouse</span>}
                          {covKeys.includes('selfSpouse2Children') && <span style={{ fontSize: 11, fontWeight: 600, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '3px 10px', color: '#475569' }}>👨‍👩‍👧 Family</span>}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '10px 16px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/product/${p.id}/edit`)}
                        style={{
                          padding: '6px 18px', borderRadius: 7, border: `1.5px solid ${tc.color}`,
                          background: '#fff', color: tc.color, fontWeight: 700, fontSize: 12.5,
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = tc.bg }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        Edit Product
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}

export { PRODUCTS as PRODUCT_MOCK }
