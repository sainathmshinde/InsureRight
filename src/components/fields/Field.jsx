export function Field({ label, required, error, children, className, style }) {
  return (
    <div className={`field${className ? ` ${className}` : ''}`} style={style}>
      {label && (
        <label className="field-label">
          {label}{required && <span className="req"> *</span>}
        </label>
      )}
      {children}
      {error && <div className="field-error-text">{error}</div>}
    </div>
  )
}
