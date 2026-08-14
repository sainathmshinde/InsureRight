import { createContext, useCallback, useContext, useState } from "react";
import { ToastContainer, ConfirmDialog } from "../components/ui/Toast";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null); // { message, resolve }

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // opts: { position?: one of TOAST_POSITIONS, duration?: ms (0 = sticky) }
  const show = useCallback(
    (message, opts = {}) => {
      const id = ++idCounter;
      const toast = {
        id,
        message,
        type: opts.type ?? "info",
        position: opts.position ?? "center-center",
        duration: opts.duration ?? 4000,
      };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration > 0) {
        setTimeout(() => dismiss(id), toast.duration);
      }
      return id;
    },
    [dismiss],
  );

  // Promise-based Yes/No confirmation, styled as the same center message-box
  // as the toasts above — replaces the browser's native window.confirm().
  const confirm = useCallback(
    (message, opts = {}) =>
      new Promise((resolve) => {
        setConfirmState({
          message,
          confirmLabel: opts.confirmLabel ?? "Delete",
          cancelLabel: opts.cancelLabel ?? "Cancel",
          resolve,
        });
      }),
    [],
  );

  const resolveConfirm = (result) => {
    confirmState?.resolve(result);
    setConfirmState(null);
  };

  const toast = {
    show,
    success: (message, opts) => show(message, { ...opts, type: "success" }),
    error: (message, opts) => show(message, { ...opts, type: "error" }),
    warning: (message, opts) => show(message, { ...opts, type: "warning" }),
    info: (message, opts) => show(message, { ...opts, type: "info" }),
    confirm,
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      {confirmState && (
        <ConfirmDialog
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          cancelLabel={confirmState.cancelLabel}
          onConfirm={() => resolveConfirm(true)}
          onCancel={() => resolveConfirm(false)}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
