export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative', width: 40, height: 22,
          background: checked ? 'var(--brand)' : 'var(--border)',
          borderRadius: 99, transition: 'background .15s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: 3,
          left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left .15s',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        }} />
      </div>
      {label && <span style={{ fontSize: 13.5, color: 'var(--text-2)' }}>{label}</span>}
    </label>
  )
}
