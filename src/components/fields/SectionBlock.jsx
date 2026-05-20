export function SectionBlock({ icon, title, children }) {
  return (
    <div className="section-block">
      <div className="section-heading">
        {icon && <span className="section-icon">{icon}</span>}
        <span>{title}</span>
      </div>
      <div className="section-body">
        {children}
      </div>
    </div>
  )
}
