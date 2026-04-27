export function Button({ variant = 'primary', size, icon, children, ...props }) {
  return (
    <button
      className={`btn btn-${variant}${size ? ` btn-${size}` : ''}`}
      {...props}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  )
}
