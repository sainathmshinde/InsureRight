export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div className="page-title-row">
        <span className="page-bar" />
        <div>
          <div className="page-title">{title}</div>
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="page-actions">{children}</div>
    </div>
  )
}
