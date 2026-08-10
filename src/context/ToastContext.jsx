import { createContext, useCallback, useContext, useState } from "react";
import { ToastContainer } from "../components/ui/Toast";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

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
        position: opts.position ?? "top-right",
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

  const toast = {
    show,
    success: (message, opts) => show(message, { ...opts, type: "success" }),
    error: (message, opts) => show(message, { ...opts, type: "error" }),
    warning: (message, opts) => show(message, { ...opts, type: "warning" }),
    info: (message, opts) => show(message, { ...opts, type: "info" }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
