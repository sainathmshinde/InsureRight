export function Stepper({ steps, current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, padding: '0 4px', overflowX: 'auto' }}>
      {steps.map((step, i) => {
        const done   = i < current
        const active = i === current
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? 'var(--green)' : active ? 'var(--brand)' : 'var(--surface-2)',
                border: `2px solid ${done ? 'var(--green)' : active ? 'var(--brand)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13,
                color: done || active ? '#fff' : 'var(--text-3)',
                transition: 'all .2s', flexShrink: 0,
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{
                fontSize: 11, marginTop: 6, fontWeight: active ? 600 : 400,
                color: active ? 'var(--brand)' : done ? 'var(--text-2)' : 'var(--text-3)',
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>
                {step}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: '0 4px', marginBottom: 20,
                background: done ? 'var(--green)' : 'var(--border)',
                transition: 'background .2s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
