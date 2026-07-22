export function Stepper({ steps, current }) {
  return (
    <>
      {/* ── Mobile: progress bar + step label ── */}
      <div className="stepper-mobile">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13.5, color: 'var(--text-3)' }}>
            Step {current + 1} of {steps.length}
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand)' }}>
            {steps[current]}
          </span>
        </div>
        <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, background: 'var(--grad-purple)',
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
                  background: done ? 'var(--green)' : active ? 'var(--grad-purple)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: done || active ? '#fff' : 'var(--text-2)',
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
                  width: 24, height: 24, borderRadius: '50%',
                  background: done ? 'var(--accent-green)' : '#fff',
                  border: `2px solid ${done ? 'var(--accent-green)' : active ? 'var(--brand)' : '#9ca3af'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .2s', flexShrink: 0,
                }}>
                  {done && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)' }} />}
                </div>
                <div style={{
                  fontSize: 12, marginTop: 8, fontWeight: 500,
                  color: active ? 'var(--brand)' : done ? '#333' : '#626262',
                  textAlign: 'center', whiteSpace: 'nowrap',
                }}>
                  {step}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  flex: 1, height: 1.5, margin: '0 4px', marginBottom: 20,
                  background: done ? 'var(--accent-green)' : '#dee1e5',
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
