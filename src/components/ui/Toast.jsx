// Reusable toast notification — presentational only; see
// src/context/ToastContext.jsx for the provider/hook that drives this.
export const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const TOAST_META = {
  success: { icon: "✓", color: "var(--green)", bg: "var(--green-bg)" },
  error: { icon: "✕", color: "var(--red)", bg: "var(--red-bg)" },
  warning: { icon: "⚠", color: "var(--amber)", bg: "var(--amber-bg)" },
  info: { icon: "ℹ", color: "var(--blue)", bg: "var(--blue-bg)" },
};

export function Toast({ type = "info", message, onClose }) {
  const meta = TOAST_META[type] ?? TOAST_META.info;
  return (
    <div className="toast" role="status">
      <span className="toast-icon" style={{ background: meta.bg, color: meta.color }}>
        {meta.icon}
      </span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  const byPosition = TOAST_POSITIONS.reduce((acc, pos) => {
    acc[pos] = toasts.filter((t) => t.position === pos);
    return acc;
  }, {});

  return (
    <>
      {TOAST_POSITIONS.filter((pos) => byPosition[pos].length > 0).map((pos) => (
        <div key={pos} className={`toast-stack toast-stack-${pos}`}>
          {byPosition[pos].map((t) => (
            <Toast key={t.id} type={t.type} message={t.message} onClose={() => onDismiss(t.id)} />
          ))}
        </div>
      ))}
    </>
  );
}
