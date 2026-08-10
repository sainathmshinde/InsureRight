export function Select({ children, error, className = "", ...props }) {
  return (
    <select
      className={`field-select${error ? " field-input-error" : ""}${className ? ` ${className}` : ""}`}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </select>
  )
}
