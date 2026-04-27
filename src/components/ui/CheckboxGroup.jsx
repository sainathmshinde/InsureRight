export function CheckboxGroup({ options, selected = [], onChange }) {
  const toggle = val => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val))
    else onChange([...selected, val])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button
            key={opt} type="button"
            onClick={() => toggle(opt)}
            style={{
              padding: '5px 14px', borderRadius: 99, fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: active ? 600 : 400,
              border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
              background: active ? 'var(--brand-light)' : 'transparent',
              color: active ? 'var(--brand)' : 'var(--text-2)',
              transition: 'all .13s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
