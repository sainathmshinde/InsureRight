export function Field({ label, required, children, className, style }) {
  return (
    <div className={`field${className ? ` ${className}` : ''}`} style={style}>
      {label && (
        <label className="field-label">
          {label}{required && <span className="req"> *</span>}
        </label>
      )}
      {children}
    </div>
  )
}
