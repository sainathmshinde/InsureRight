import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, Button, EmptyState, RowActionButton } from '../../components/UI'
import { GroupIcon, UploadIcon, SearchIcon, EditIcon, DeleteIcon } from '../../icons'
import { useAssociations } from './AssociationContext'
import { ORGANISATIONS } from '../member/orgAssocData'
import { useToast } from '../../context/ToastContext'

export default function AssociationList() {
  const navigate = useNavigate()
  const toast = useToast()
  const { associations, deleteAssociation } = useAssociations()
  const [search, setSearch]     = useState('')
  const [orgFilter, setOrgFilter] = useState('')

  const handleDelete = async a => {
    if (await toast.confirm(`Delete association "${a.name}"? This cannot be undone.`)) {
      deleteAssociation(a.id)
    }
  }

  const getCity = a => a.city ?? a.branches?.[0]?.city ?? ''

  const filtered = associations.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.associationCode ?? '').toLowerCase().includes(search.toLowerCase()) ||
      getCity(a).toLowerCase().includes(search.toLowerCase())
    const orgIds      = a.organisationIds?.length ? a.organisationIds : (a.orgId ? [a.orgId] : [])
    const matchOrg    = orgFilter ? orgIds.includes(Number(orgFilter)) : true
    return matchSearch && matchOrg
  })

  const pg     = usePagination(filtered, 15)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'name', label: 'Association Name', style: { fontWeight: 500, minWidth: 220 } },
    { key: 'orgId', label: 'Organisation',
      render: row => {
        const ids = row.organisationIds?.length ? row.organisationIds : (row.orgId ? [row.orgId] : [])
        const names = ids.map(oid => ORGANISATIONS.find(o => o.id === oid)?.name).filter(Boolean)
        if (names.length === 0) return <span style={{ color: 'var(--text-3)' }}>—</span>
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 260 }}>
            {names.slice(0, 2).map(n => <span key={n} className="chip">{n}</span>)}
            {names.length > 2 && (
              <span className="chip" title={names.slice(2).join(', ')}>+{names.length - 2} more</span>
            )}
          </div>
        )
      }
    },
    { key: 'associationCode', label: 'Code',
      render: row => row.associationCode
        ? <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--brand)' }}>{row.associationCode}</span>
        : <span style={{ color: 'var(--text-3)' }}>—</span>
    },
    { key: 'city',     label: 'City',   style: { fontSize: 13, color: 'var(--text-2)' },
      render: row => getCity(row) || <span style={{ color: 'var(--text-3)' }}>—</span>
    },
    { key: 'actions', label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          <RowActionButton title="Edit" icon={EditIcon} onClick={() => navigate(`/association/${row.id}/edit`)} />
          <RowActionButton title="Delete" icon={DeleteIcon} variant="delete" onClick={() => handleDelete(row)} />
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        icon={<GroupIcon />}
        title="Associations"
        subtitle="View and manage all associations and their linked organisations"
      >
        <Button variant="ghost" icon={<UploadIcon size={16} />} onClick={() => {}}>
          Export
        </Button>
        <Button onClick={() => navigate('/association/create')}>+ Add Association</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginBottom: 18, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 220px' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Search</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input className="field-input filter-search" style={{ width: '100%', paddingLeft: 34 }} placeholder="Search by name, code or city…"
                  value={search} onChange={e => handle(setSearch)(e.target.value)} />
              </div>
            </div>
            <div style={{ flex: '0 0 200px' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Organisation</label>
              <select className="field-select" style={{ width: '100%' }} value={orgFilter} onChange={e => handle(setOrgFilter)(e.target.value)}>
                <option value="">All Organisations</option>
                {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            {(search || orgFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setOrgFilter)('') }}>Clear</Button>
              </div>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            stickyHeader
            empty={<EmptyState icon="🤝" title="No associations found" subtitle="Try adjusting your filters" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
