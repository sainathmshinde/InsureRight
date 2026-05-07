import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { ProductIcon } from '../../icons'

const MOCK = [
  { id: 1,  productName: 'Star Comprehensive Health',     productCode: 'SHI-HC-001', insuranceType: 'Health', icName: 'Star Health Insurance', category: 'Family',     basePremium: 8500,  sumInsured: '5L–50L', status: 'Active'   },
  { id: 2,  productName: 'HDFC ERGO Optima Secure',       productCode: 'HER-HS-002', insuranceType: 'Health', icName: 'HDFC ERGO',             category: 'Individual', basePremium: 6200,  sumInsured: '3L–25L', status: 'Active'   },
  { id: 3,  productName: 'ICICI Lombard Complete Health', productCode: 'ICL-HC-003', insuranceType: 'Health', icName: 'ICICI Lombard',         category: 'Family',     basePremium: 9100,  sumInsured: '5L–1Cr', status: 'Active'   },
  { id: 4,  productName: 'Bajaj Allianz Comprehensive Motor', productCode: 'BAJ-MC-004', insuranceType: 'Motor', icName: 'Bajaj Allianz',     category: 'Individual', basePremium: 4800,  sumInsured: 'IDV',    status: 'Active'   },
  { id: 5,  productName: 'New India Motor OD + TP',       productCode: 'NIA-MC-005', insuranceType: 'Motor', icName: 'New India Assurance',   category: 'Individual', basePremium: 3600,  sumInsured: 'IDV',    status: 'Active'   },
  { id: 6,  productName: 'LIC Jeevan Anand',              productCode: 'LIC-LA-006', insuranceType: 'Life',  icName: 'LIC',                   category: 'Individual', basePremium: 12000, sumInsured: '10L–1Cr',status: 'Active'   },
  { id: 7,  productName: 'HDFC Life Sanchay Plus',        productCode: 'HDFC-LSP-007',insuranceType: 'Life', icName: 'HDFC Life',             category: 'Individual', basePremium: 18000, sumInsured: '25L–2Cr',status: 'Active'   },
  { id: 8,  productName: 'SBI Life Smart Shield',         productCode: 'SBI-LSS-008',insuranceType: 'Life',  icName: 'SBI Life',              category: 'Individual', basePremium: 9500,  sumInsured: '10L–1Cr',status: 'Inactive' },
  { id: 9,  productName: 'Star Senior Health',            productCode: 'SHI-SH-009', insuranceType: 'Health', icName: 'Star Health Insurance', category: 'Individual', basePremium: 14000, sumInsured: '3L–15L', status: 'Active'   },
  { id: 10, productName: 'ICICI Lombard Two Wheeler',     productCode: 'ICL-TW-010', insuranceType: 'Motor', icName: 'ICICI Lombard',         category: 'Individual', basePremium: 1800,  sumInsured: 'IDV',    status: 'Active'   },
  { id: 11, productName: 'Bajaj Allianz Health Guard',    productCode: 'BAJ-HG-011', insuranceType: 'Health', icName: 'Bajaj Allianz',        category: 'Group',      basePremium: 5500,  sumInsured: '3L–10L', status: 'Active'   },
  { id: 12, productName: 'Reliance Motor OD',             productCode: 'RGI-MO-012', insuranceType: 'Motor', icName: 'Reliance General',      category: 'Individual', basePremium: 3200,  sumInsured: 'IDV',    status: 'Inactive' },
]

const TYPE_COLOR = { Health: 'blue', Motor: 'amber', Life: 'purple' }

export default function ProductList() {
  const navigate = useNavigate()
  const [search, setSearch]       = useState('')
  const [typeFilter, setType]     = useState('')
  const [statusFilter, setStatus] = useState('')

  const filtered = MOCK.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q) || p.icName.toLowerCase().includes(q)) &&
      (typeFilter   ? p.insuranceType === typeFilter   : true) &&
      (statusFilter ? p.status        === statusFilter : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'id',            label: '#',            style: { color: 'var(--text-3)' } },
    { key: 'productName',   label: 'Product Name', style: { fontWeight: 500 } },
    { key: 'productCode',   label: 'Code',
      render: row => <span className="badge badge-purple" style={{ fontFamily: 'monospace', fontSize: 11 }}>{row.productCode}</span> },
    { key: 'insuranceType', label: 'Type',
      render: row => <span className={`badge badge-${TYPE_COLOR[row.insuranceType] ?? 'blue'}`}>{row.insuranceType}</span> },
    { key: 'icName',        label: 'IC Name',      style: { color: 'var(--text-2)' } },
    { key: 'category',      label: 'Category',     render: row => <StatusBadge status={row.category} /> },
    { key: 'basePremium',   label: 'Base Premium', style: { fontWeight: 600 },
      render: row => `₹${row.basePremium.toLocaleString()}` },
    { key: 'sumInsured',    label: 'Sum Insured',  style: { fontSize: 13, color: 'var(--text-2)' } },
    { key: 'status',        label: 'Status',       render: row => <StatusBadge status={row.status} /> },
    { key: 'actions',       label: 'Actions',
      render: row => (
        <Button variant="secondary" size="sm" onClick={() => navigate(`/product/${row.id}/edit`)}>Edit</Button>
      )},
  ]

  return (
    <div>
      <PageHeader icon={<ProductIcon />} title="Product Catalogue" subtitle={`${MOCK.length} products available`}>
        <Button onClick={() => navigate('/product/create')}>+ Add Product</Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar">
            <input className="field-input filter-search" placeholder="Search by name, code or IC…"
              value={search} onChange={e => handle(setSearch)(e.target.value)} />
            <select className="field-select" style={{ width: 160 }} value={typeFilter} onChange={e => handle(setType)(e.target.value)}>
              <option value="">All Types</option>
              {['Health','Motor','Life','Travel','Home'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select className="field-select" style={{ width: 150 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            {(search || typeFilter || statusFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { handle(setSearch)(''); handle(setType)(''); handle(setStatus)('') }}>Clear</Button>
            )}
          </div>

          <Table
            columns={columns}
            rows={pg.slice}
            empty={<EmptyState icon="📦" title="No products found" subtitle="Add a new product to the catalogue" />}
          />

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}

export { MOCK as PRODUCT_MOCK }
