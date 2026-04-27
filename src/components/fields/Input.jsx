export function Input({ required, ...props }) {
  return <input className="field-input" required={required} {...props} />
}
