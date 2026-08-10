import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { PageHeader, Button, EmptyState, RowActionButton } from '../../components/UI'
import { ProductIcon, ChevronRightIcon, EditIcon, DeleteIcon } from '../../icons'
import { PRODUCTS, POLICY_TYPES, PREMIUM_CHART, POLICY_TYPE_ICON, getProductLinks } from './productData'
import { ProductDetailModal } from '../campaign/campaignShared'

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
  const [rows, setRows] = useState(PRODUCTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setType] = useState('')
  const [viewProduct, setViewProduct] = useState(null)

  const handleDelete = p => {
    if (window.confirm(`Delete product "${p.name}"? This cannot be undone.`)) {
      setRows(prev => prev.filter(r => r.id !== p.id))
    }
  }

  const filtered = rows.filter(p => {
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
  const uniqueTypes = [...new Set(rows.map(p => p.policyType))]

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
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <input className="field-input filter-search" style={{ width: '100%' }} placeholder="Search by name, code or provider…"
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Policy Type</label>
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
                const { linkedBase, topups } = getProductLinks(p.id)

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
                        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: tc.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.provider}
                        </span>
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 6, paddingBottom: 12 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#6d747a' }}>{p.policyType}</span>
                        <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#94a3b8' }}>· {p.code}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: '#15803d' }}>● Active</span>
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
                              <span style={{ fontSize: 12, fontWeight: 500, color: '#6d747a', textTransform: 'uppercase', letterSpacing: '.6px' }}>Starts From</span>
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

                      {/* Base ↔ top-up linkage */}
                      {linkedBase && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6d747a' }}>🔗 Linked to:</span>
                          <span style={{ fontSize: 11.5, fontWeight: 700, background: '#eff6ff', color: '#1565d8', border: '1px solid #bfdbfe', borderRadius: 99, padding: '2px 8px' }}>
                            {linkedBase.name}
                          </span>
                        </div>
                      )}
                      {topups.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#6d747a' }}>
                            🔗 {topups.length} Top-up{topups.length !== 1 ? 's' : ''} linked
                          </span>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {topups.map(t => (
                              <span key={t.id} style={{ fontSize: 11, fontWeight: 600, background: '#eff6ff', color: '#1565d8', border: '1px solid #bfdbfe', borderRadius: 99, padding: '2px 8px' }}>
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, paddingTop: 4, marginTop: 'auto' }}>
                        <button
                          type="button"
                          onClick={() => setViewProduct(p)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 14, fontWeight: 600, color: 'var(--brand)' }}
                        >
                          View Info
                          <ChevronRightIcon size={16} color="var(--brand)" />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RowActionButton title="Edit Product" icon={EditIcon} onClick={() => navigate(`/product/${p.id}/edit`)} />
                          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(p)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>

      {viewProduct && (
        <ProductDetailModal product={viewProduct} onClose={() => setViewProduct(null)} />
      )}
    </div>
  )
}

export { PRODUCTS as PRODUCT_MOCK }
