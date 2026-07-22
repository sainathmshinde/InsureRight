import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, Button, EmptyState } from '../../components/UI'
import { BankIcon, UploadIcon, SearchIcon } from '../../icons'
import { useOrganisations } from './OrganisationContext'

export default function OrganisationList() {
  const navigate = useNavigate()
  const { organisations } = useOrganisations()
  const [search, setSearch]       = useState('')

  const filtered = organisations.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  )
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'name',        label: 'Name',        style: { fontWeight: 500 } },
    { key: 'description', label: 'Description', style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'actions', label: 'Actions',
      render: row => (
        <button type="button" onClick={() => navigate(`/organisation/${row.id}/edit`)} title="Edit" style={{ background: 'linear-gradient(180deg,#1565d8,#104ea6)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '5px 6px', color: '#fff', display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(21,101,216,.30)' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        icon={<BankIcon />}
        title="Organisations"
        subtitle="View and manage all organisations linked to your brokerage"
      >
        <Button variant="ghost" icon={<UploadIcon size={16} />} onClick={() => {}}>
          Export
        </Button>
        <Button onClick={() => navigate('/organisation/create')}>+ Add Organisation</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Organisation Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input className="field-input filter-search" style={{ width: '100%', paddingLeft: 34 }} placeholder="Search by name…"
                  value={search} onChange={e => handle(setSearch)(e.target.value)} />
              </div>
            </div>
            {search && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => handle(setSearch)('')}>Clear</Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            stickyHeader
            empty={<EmptyState icon="🏦" title="No organisations found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
