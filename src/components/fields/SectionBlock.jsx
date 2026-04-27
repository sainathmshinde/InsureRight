export function SectionBlock({ icon, title, children }) {
  return (
    <div className="section-block">
      <div className="section-heading">
        {icon && <span className="section-icon">{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  )
}
