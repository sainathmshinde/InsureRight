import { PageHeader } from "../../components/UI";
import { TOAST_POSITIONS } from "../../components/ui/Toast";
import { useToast } from "../../context/ToastContext";

const TYPES = [
  { type: "success", label: "Success", color: "var(--green)", bg: "var(--green-bg)", sample: "Campaign created successfully." },
  { type: "error",   label: "Error",   color: "var(--red)",   bg: "var(--red-bg)",   sample: "Please fix the highlighted fields." },
  { type: "warning", label: "Warning", color: "var(--amber)", bg: "var(--amber-bg)", sample: "This campaign ends in 2 days." },
  { type: "info",    label: "Info",    color: "var(--blue)",  bg: "var(--blue-bg)",  sample: "Your changes are saved as a draft." },
];

const POSITION_LABEL = {
  "top-left": "Top Left",
  "top-center": "Top Center",
  "top-right": "Top Right",
  "bottom-left": "Bottom Left",
  "bottom-center": "Bottom Center",
  "bottom-right": "Bottom Right",
};

export default function ToastDemo() {
  const toast = useToast();

  const fire = (type, position) =>
    toast.show(TYPES.find((t) => t.type === type).sample, { type, position });

  return (
    <div>
      <PageHeader
        title="Toast Notifications"
        subtitle="Every toast type at every position — click any cell to fire it"
      />

      <div className="card">
        <div className="card-body">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 12.5, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".4px" }}>
                    Position
                  </th>
                  {TYPES.map((t) => (
                    <th key={t.type} style={{ textAlign: "left", padding: "10px 12px", fontSize: 12.5, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".4px" }}>
                      {t.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOAST_POSITIONS.map((pos) => (
                  <tr key={pos} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 12px", fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>
                      {POSITION_LABEL[pos]}
                    </td>
                    {TYPES.map((t) => (
                      <td key={t.type} style={{ padding: "10px 12px" }}>
                        <button
                          type="button"
                          onClick={() => fire(t.type, pos)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 14px", borderRadius: "var(--r-sm)",
                            border: `1.5px solid ${t.color}`, background: t.bg, color: t.color,
                            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          {t.label}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
              Usage
            </div>
            <pre style={{
              background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-md)",
              padding: "14px 16px", fontSize: 12.5, overflowX: "auto", color: "var(--text-2)",
            }}>
{`import { useToast } from "../../context/ToastContext";

const toast = useToast();
toast.success("Campaign created successfully.");
toast.error("Please fix the highlighted fields.");
toast.warning("This campaign ends in 2 days.", { position: "bottom-right" });
toast.info("Your changes are saved as a draft.", { duration: 6000 });`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
