export function Input({ required, error, className = "", ...props }) {
  return (
    <input
      className={`field-input${error ? " field-input-error" : ""}${className ? ` ${className}` : ""}`}
      required={required}
      aria-invalid={!!error}
      {...props}
    />
  )
}
