// Reusable toast notification — presentational only; see
// src/context/ToastContext.jsx for the provider/hook that drives this.
export const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "center-center",
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

export function Toast({ type = "info", message, onClose, variant = "bar" }) {
  const meta = TOAST_META[type] ?? TOAST_META.info;

  if (variant === "box") {
    return (
      <div className="toast-box" role="status">
        <button type="button" className="toast-box-close" onClick={onClose} aria-label="Dismiss">
          ×
        </button>
        <span className="toast-box-icon" style={{ background: meta.bg, color: meta.color }}>
          {meta.icon}
        </span>
        <div className="toast-box-message">{message}</div>
        <button type="button" className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    );
  }

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

// Yes/No confirmation — same backdrop + message-box shell as a center toast,
// but with two action buttons instead of auto-dismiss.
export function ConfirmDialog({ message, confirmLabel = "Delete", cancelLabel = "Cancel", onConfirm, onCancel }) {
  const meta = TOAST_META.warning;
  return (
    <>
      <div className="toast-backdrop" />
      <div className="toast-stack toast-stack-center-center">
        <div className="toast-box" role="alertdialog">
          <span className="toast-box-icon" style={{ background: meta.bg, color: meta.color }}>
            {meta.icon}
          </span>
          <div className="toast-box-message">{message}</div>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>
              {cancelLabel}
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  const byPosition = TOAST_POSITIONS.reduce((acc, pos) => {
    acc[pos] = toasts.filter((t) => t.position === pos);
    return acc;
  }, {});

  return (
    <>
      {TOAST_POSITIONS.filter((pos) => byPosition[pos].length > 0).map((pos) => {
        const isCenter = pos === "center-center";
        return (
          <div key={pos}>
            {isCenter && <div className="toast-backdrop" />}
            <div className={`toast-stack toast-stack-${pos}`}>
              {byPosition[pos].map((t) => (
                <Toast
                  key={t.id}
                  type={t.type}
                  message={t.message}
                  variant={isCenter ? "box" : "bar"}
                  onClose={() => onDismiss(t.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
