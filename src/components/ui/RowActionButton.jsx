// Small square icon button used in table/card "Actions" columns — matches the
// style established on the Members page: a white square whose border matches
// its icon color — #6D747A for View/Edit/Buy/etc., red for Delete.
export function RowActionButton({ icon: Icon, onClick, title, variant = 'default', disabled = false }) {
  const isDelete = variant === 'delete'
  const accent = isDelete ? '#dc2626' : '#6D747A'
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${accent}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: '#fff',
        boxShadow: 'none',
        flexShrink: 0,
      }}
    >
      <Icon size={14} color={accent} />
    </button>
  )
}
