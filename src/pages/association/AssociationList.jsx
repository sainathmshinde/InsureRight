import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, Button, EmptyState } from '../../components/UI'
import { GroupIcon } from '../../icons'
import { useAssociations } from './AssociationContext'
import { ORGANISATIONS } from '../customer/orgAssocData'

export default function AssociationList() {
  const navigate = useNavigate()
  const { associations } = useAssociations()
  const [search, setSearch]     = useState('')
  const [orgFilter, setOrgFilter] = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = associations.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.associationCode ?? '').toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase())
    const matchOrg    = orgFilter ? a.orgId === Number(orgFilter) : true
    const matchStatus = statusFilter === '' ? true : statusFilter === 'Active' ? a.isActive : !a.isActive
    return matchSearch && matchOrg && matchStatus
  })

  const pg     = usePagination(filtered, 15)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',   label: 'ID',   style: { fontFamily: 'monospace', color: 'var(--text-3)', fontSize: 12 } },
    { key: 'name', label: 'Association Name', style: { fontWeight: 500, minWidth: 220 } },
    { key: 'orgId', label: 'Organisation',
      render: row => {
        const org = ORGANISATIONS.find(o => o.id === row.orgId)
        return <span style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{org?.name ?? '—'}</span>
      }
    },
    { key: 'associationCode', label: 'Code',
      render: row => row.associationCode
        ? <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--brand)' }}>{row.associationCode}</span>
        : <span style={{ color: 'var(--text-3)' }}>—</span>
    },
    { key: 'city',     label: 'City',   style: { fontSize: 13, color: 'var(--text-2)' } },
    { key: 'isActive', label: 'Status',
      render: row => (
        <span className={`badge ${row.isActive ? 'badge-green' : 'badge-red'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { key: 'actions', label: 'Actions',
      render: row => (
        <button type="button" onClick={() => navigate(`/association/${row.id}/edit`)} title="Edit" style={{ background: 'linear-gradient(135deg,#fb7185,#a855f7)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '5px 6px', color: '#fff', display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(168,85,247,.30)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
      )
    },
  ]

  return (
    <div>
      <PageHeader icon={<GroupIcon />} title="Associations">
        <Button onClick={() => navigate('/association/create')}>+ Add Association</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <input className="field-input filter-search" style={{ width: '100%' }} placeholder="Search by name, code or city…"
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Organisation</label>
              <select className="field-select" style={{ width: '100%' }} value={orgFilter} onChange={e => handle(setOrgFilter)(e.target.value)}>
                <option value="">All Organisations</option>
                {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div style={{ flex: '0 0 150px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Status</label>
              <select className="field-select" style={{ width: '100%' }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            {(search || orgFilter || statusFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setOrgFilter)(''); handle(setStatus)('') }}>Clear</Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="🤝" title="No associations found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
