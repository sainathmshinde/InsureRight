import { EmptyState } from './EmptyState'

/*
  Usage:
    const columns = [
      { key: 'id',     label: '#',    style: { color: 'var(--text-3)' } },
      { key: 'name',   label: 'Name', render: row => <b>{row.name}</b> },
      { key: 'status', label: 'Status', render: row => <StatusBadge status={row.status} /> },
    ]
    <Table columns={columns} rows={pg.slice} empty={<EmptyState icon="📋" title="None found" />} />
*/
export function Table({ columns, rows, empty, rowKey = 'id' }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ ...(col.width ? { width: col.width } : {}), ...col.headerStyle }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 0 }}>
                {empty ?? <EmptyState />}
              </td>
            </tr>
          )}
          {rows.map((row, i) => (
            <tr key={row[rowKey] ?? i}>
              {columns.map(col => (
                <td key={col.key} style={col.style}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
