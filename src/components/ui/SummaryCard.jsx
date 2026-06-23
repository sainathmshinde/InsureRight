export function SummaryCard({ icon, label, value, color = 'var(--brand)' }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)', padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 16,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 'var(--r-md)',
        background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 22, color }}>{icon}</span>
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  )
}

export function InfoRow({ label, value, badge }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
      {badge
        ? badge
        : <span style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 500 }}>{value ?? '—'}</span>
      }
    </div>
  )
}
