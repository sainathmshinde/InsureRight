export function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      className={`field-textarea${error ? " field-input-error" : ""}${className ? ` ${className}` : ""}`}
      rows={3}
      aria-invalid={!!error}
      {...props}
    />
  )
}
