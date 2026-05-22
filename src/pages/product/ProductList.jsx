import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, Button, EmptyState } from '../../components/UI'
import { ProductIcon } from '../../icons'
import { PRODUCTS, POLICY_TYPES, POLICY_TYPE_COLOR } from './productData'

export default function ProductList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')

  const filtered = PRODUCTS.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.name.toLowerCase().includes(q) ||
       p.code.toLowerCase().includes(q) ||
       p.provider.toLowerCase().includes(q)) &&
      (typeFilter ? p.policyType === typeFilter : true)
    )
  })

  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const uniqueTypes = [...new Set(PRODUCTS.map(p => p.policyType))]

  const columns = [
    { key: 'id',          label: '#',           style: { color: 'var(--text-3)', width: 40 } },
    { key: 'name',        label: 'Product Name', style: { fontWeight: 500 } },
    { key: 'code',        label: 'Code',
      render: row => <span className="badge badge-purple" style={{ fontFamily: 'monospace', fontSize: 11 }}>{row.code}</span> },
    { key: 'policyType',  label: 'Type',
      render: row => <span className={`badge badge-${POLICY_TYPE_COLOR[row.policyType] ?? 'blue'}`}>{row.policyType}</span> },
    { key: 'provider',    label: 'Provider',     style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'status',      label: 'Status',
      render: row => <span className="badge badge-green">Active</span> },
    { key: 'actions',     label: 'Actions',
      render: row => (
        <button type="button" onClick={() => navigate(`/product/${row.id}/edit`)} title="Edit" style={{ background: 'linear-gradient(135deg,#fb7185,#a855f7)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '5px 6px', color: '#fff', display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(168,85,247,.30)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Product Catalogue" >
        <Button onClick={() => navigate('/product/create')}>+ Add Product</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
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

          {/* Mobile cards */}
          <div className="prod-cards">
            {pg.slice.length === 0 ? (
              <EmptyState icon="📦" title="No products found" subtitle="Try adjusting your filters" />
            ) : pg.slice.map(p => (
              <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '13px 14px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{p.name}</span>
                  <span className="badge badge-green">Active</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span className={`badge badge-${POLICY_TYPE_COLOR[p.policyType] ?? 'blue'}`}>{p.policyType}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8 }}>{p.provider}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                  <span className="badge badge-purple" style={{ fontFamily: 'monospace', fontSize: 11 }}>{p.code}</span>
                  <Button variant="secondary" size="sm" onClick={() => navigate(`/product/${p.id}/edit`)}>Edit</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="prod-table-wrap">
            <Table
              columns={columns}
              rows={pg.slice}
              empty={<EmptyState icon="📦" title="No products found" subtitle="Try adjusting your filters" />}
            />
          </div>

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}

export { PRODUCTS as PRODUCT_MOCK }
