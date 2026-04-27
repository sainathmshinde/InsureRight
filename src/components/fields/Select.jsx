export function Select({ children, ...props }) {
  return (
    <select className="field-select" {...props}>
      {children}
    </select>
  )
}
