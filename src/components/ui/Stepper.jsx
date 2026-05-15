export function Stepper({ steps, current }) {
  return (
    <>
      {/* ── Mobile: progress bar + step label ── */}
      <div className="stepper-mobile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
            Step {current + 1} of {steps.length}
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand)' }}>
            {steps[current]}
          </span>
        </div>
        <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, background: 'var(--brand)',
            width: `${((current + 1) / steps.length) * 100}%`,
            transition: 'width .3s ease',
          }} />
        </div>
        {/* Dot row */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          {steps.map((_, i) => {
            const done = i < current; const active = i === current
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'var(--green)' : active ? 'var(--brand)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: done || active ? '#fff' : 'var(--text-3)',
                }}>
                  {done ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: done ? 'var(--green)' : 'var(--border)', margin: '0 3px' }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: full step labels ── */}
      <div className="stepper-desktop" style={{ display: 'flex', alignItems: 'center', marginBottom: 32, padding: '0 4px', overflowX: 'auto' }}>
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
    </>
  )
}
