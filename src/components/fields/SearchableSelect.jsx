import { useState, useRef, useEffect } from "react";

// Single-select dropdown with a search box — for fields backed by a long list
// (employees, states, …) where scrolling a plain <select> is slow.
export function SearchableSelect({ value, onChange, options, placeholder = "Select…", disabled = false, required, error, onBlur, onFocus }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropStyle, setDropStyle] = useState({});
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 40);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const recalc = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setDropStyle({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    recalc();
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc, true);
      window.removeEventListener("resize", recalc);
    };
  }, [open]);

  const handleOpen = () => {
    if (disabled) return;
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropStyle({ top: r.bottom + 4, left: r.left, width: r.width });
      onFocus?.();
    } else if (open) {
      onBlur?.();
    }
    setOpen((o) => !o);
  };

  const selectValue = (val) => {
    onChange(val);
    setOpen(false);
    setSearch("");
    onBlur?.();
  };

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        className={`field-input${error && !open ? " field-input-error" : ""}`}
        aria-invalid={!!error}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", cursor: disabled ? "not-allowed" : "pointer", textAlign: "left",
          color: selected ? "var(--text-1)" : "var(--text-3)",
          fontFamily: "inherit", fontSize: 15,
          borderColor: open ? "var(--brand)" : undefined,
          boxShadow: open ? "0 0 0 3px var(--focus-ring)" : undefined,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {selected ? selected.label : placeholder}
        </span>
        <span style={{
          fontSize: 11, color: "var(--text-3)", marginLeft: 8, flexShrink: 0,
          display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s",
        }}>▼</span>
      </button>

      {/* hidden input so `required` still participates in native form validation */}
      {required && (
        <input tabIndex={-1} aria-hidden style={{ position: "absolute", opacity: 0, height: 0, width: "100%", pointerEvents: "none" }}
          value={value ?? ""} required onChange={() => {}} />
      )}

      {open && (
        <div style={{
          position: "fixed",
          top: dropStyle.top, left: dropStyle.left, width: dropStyle.width,
          zIndex: 9000, background: "var(--bg-card,#fff)", border: "1.5px solid var(--brand)",
          borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,.15)", overflow: "hidden", minWidth: 200,
        }}>
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid var(--border)" }}>
            <input
              ref={searchRef}
              className="field-input"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {!required && value && (
              <div
                onClick={() => selectValue("")}
                style={{ padding: "9px 12px", cursor: "pointer", fontSize: 13, color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}
              >
                Clear selection
              </div>
            )}
            {filtered.length === 0 ? (
              <div style={{ padding: "14px 12px", fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
                No results for "{search}"
              </div>
            ) : filtered.map((o) => {
              const active = String(o.value) === String(value);
              return (
                <div
                  key={o.value}
                  onClick={() => selectValue(o.value)}
                  style={{
                    padding: "9px 12px", cursor: "pointer", fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    background: active ? "var(--brand-light,#eff6ff)" : "transparent",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {o.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
