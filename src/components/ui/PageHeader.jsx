export function PageHeader({ icon, title, subtitle, children }) {
  return (
    <div className="page-header">
      <div className="page-title-row">
        <div className="page-icon">{icon}</div>
        <div>
          <div className="page-title">{title}</div>
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="page-actions">{children}</div>
    </div>
  )
}
