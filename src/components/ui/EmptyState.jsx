export function EmptyState({ icon = '📭', title = 'No records found', subtitle }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
      {subtitle && <div className="text-muted">{subtitle}</div>}
    </div>
  )
}
