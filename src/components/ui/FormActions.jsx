export function FormActions({ onCancel, submitLabel = 'Save', loading = false }) {
  return (
    <div className="actions-row">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </div>
  )
}
