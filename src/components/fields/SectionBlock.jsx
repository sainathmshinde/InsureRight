export function SectionBlock({ title, children }) {
  return (
    <div className="section-block">
      {title && (
        <div className="section-heading">
          <span className="section-bar" />
          <span>{title}</span>
        </div>
      )}
      <div className="section-body">
        {children}
      </div>
    </div>
  )
}
