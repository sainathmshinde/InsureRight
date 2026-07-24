import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, SearchableSelect } from "../../components/Field";
import { GroupIcon } from "../../icons";
import {
  DESIG_LABEL, EMPLOYEES, EMP_MAP,
  getHierarchyRule, addHierarchyRule, updateHierarchyRule,
} from "./agentHierarchyData";

const empLabel = (emp) => emp ? `${emp.name} (${DESIG_LABEL[emp.designation] ?? emp.designation})` : "";

// Dropdown renders in a portal-like fixed layer — never clipped by card overflow
function MultiSelectDropdown({ options, selectedIds, onChange, disabled, placeholder }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const [dropStyle, setDropStyle] = useState({});
  const wrapRef   = useRef(null);
  const btnRef    = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 40);
  }, [open]);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    const recalc = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setDropStyle({ top: r.bottom + 4, left: r.left, width: r.width });
    };
    window.addEventListener("scroll",  recalc, true);
    window.addEventListener("resize",  recalc);
    return () => {
      window.removeEventListener("scroll",  recalc, true);
      window.removeEventListener("resize",  recalc);
    };
  }, [open]);

  const handleOpen = () => {
    if (disabled) return;
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropStyle({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setOpen(o => !o);
  };

  const close = () => { setOpen(false); setSearch(""); };
  const toggle = (id) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);

  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  let label = placeholder ?? "Select employees…";
  if (selectedIds.length === 1) label = empLabel(EMP_MAP[selectedIds[0]]) || "1 selected";
  else if (selectedIds.length > 1) label = `${selectedIds.length} employees selected`;

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 12px", borderRadius: 8, fontSize: 14, fontFamily: "inherit",
          border: `1.5px solid ${open ? "var(--brand)" : "var(--border)"}`,
          boxShadow: open ? "0 0 0 3px rgba(21,101,216,.12)" : "none",
          background: disabled ? "var(--bg-subtle,#f8fafc)" : "var(--bg-card,#fff)",
          color: selectedIds.length ? "var(--text-1)" : "var(--text-3)",
          cursor: disabled ? "not-allowed" : "pointer", textAlign: "left",
          transition: "border-color .15s, box-shadow .15s",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
        <span style={{
          fontSize: 11, color: "var(--text-3)", marginLeft: 8, flexShrink: 0,
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "none", transition: "transform .15s",
        }}>▼</span>
      </button>

      {/* Fixed-position panel — never clipped by card overflow */}
      {open && (
        <div style={{
          position: "fixed",
          top: dropStyle.top,
          left: dropStyle.left,
          width: dropStyle.width,
          zIndex: 9000,
          background: "var(--bg-card,#fff)",
          border: "1.5px solid var(--brand)",
          borderRadius: 10,
          boxShadow: "0 8px 28px rgba(0,0,0,.15)",
          overflow: "hidden",
          minWidth: 220,
        }}>
          <div style={{ padding: "10px 10px 8px", borderBottom: "1px solid var(--border)" }}>
            <input
              ref={searchRef}
              className="field-input"
              placeholder="Search employee…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", marginBottom: 6 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button" onClick={() => onChange(options.map(o => o.id))}
                style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Select All
              </button>
              <span style={{ color: "var(--border)" }}>·</span>
              <button type="button" onClick={() => onChange([])}
                style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Clear
              </button>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>
                {selectedIds.length}/{options.length}
              </span>
            </div>
          </div>

          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "14px 12px", fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
                No results for "{search}"
              </div>
            ) : filtered.map(emp => {
              const checked = selectedIds.includes(emp.id);
              return (
                <label key={emp.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", cursor: "pointer",
                  background: checked ? "var(--brand-light,#eff6ff)" : "transparent",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(emp.id)}
                    style={{ accentColor: "var(--brand)", width: 15, height: 15, flexShrink: 0, cursor: "pointer" }} />
                  <span style={{ fontSize: 14, fontWeight: checked ? 600 : 400 }}>{empLabel(emp)}</span>
                </label>
              );
            })}
          </div>

          <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <button type="button" className="btn btn-primary" style={{ padding: "5px 18px", fontSize: 13 }} onClick={close}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Selected chips below the trigger */}
      {selectedIds.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
          {selectedIds.map(id => {
            const emp = EMP_MAP[id];
            if (!emp) return null;
            return (
              <span key={id} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 8px 3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
                background: "var(--brand-light,#eff6ff)", color: "var(--brand)", border: "1.5px solid var(--brand)",
              }}>
                {empLabel(emp)}
                <button type="button" onClick={() => toggle(id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: 14, lineHeight: 1, padding: "0 1px", display: "flex", alignItems: "center" }}>
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

const EMPTY_FORM = { reportingEmpId: "", reporteeEmpIds: [] };

export default function AgentHierarchyForm() {
  const navigate   = useNavigate();
  const { ruleId } = useParams();
  const isEdit     = !!ruleId;
  const existing   = isEdit ? getHierarchyRule(Number(ruleId)) : null;

  const [form, setForm] = useState(() =>
    existing
      ? { reportingEmpId: existing.reportingEmpId, reporteeEmpIds: [...existing.reporteeEmpIds] }
      : EMPTY_FORM
  );

  const reporteeOptions = EMPLOYEES.filter(e => e.id !== form.reportingEmpId);

  const isValid = form.reportingEmpId && form.reporteeEmpIds.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    isEdit ? updateHierarchyRule(Number(ruleId), form) : addHierarchyRule(form);
    navigate("/agent/hierarchy");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <span className="page-bar" />
          <div>
            <div className="page-title">{isEdit ? "Edit Hierarchy" : "Add Hierarchy"}</div>
            <div className="page-subtitle">
              {isEdit
                ? "Update the reporting relationship between employees"
                : "Define who manages whom"}
            </div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate("/agent/hierarchy")}>
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Single card ─────────────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">

            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                background: "var(--brand-light,#eff6ff)", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <GroupIcon size={17} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                  Reporting Relationship
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 1 }}>
                  Choose who reports to whom
                </div>
              </div>
            </div>

            {/* Two-column field layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0 20px", alignItems: "start" }}>

              {/* ── Reporting side ── */}
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "var(--brand)", textTransform: "uppercase",
                  letterSpacing: ".7px", marginBottom: 14, paddingBottom: 8,
                  borderBottom: "2px solid var(--brand-light,#eff6ff)",
                }}>
                  Reporting (Manager)
                </div>

                <Field label="Select the Reporting Manager" required>
                  <SearchableSelect
                    value={form.reportingEmpId}
                    onChange={(val) => {
                      const empId = val ? Number(val) : "";
                      setForm(p => ({
                        ...p,
                        reportingEmpId: empId,
                        reporteeEmpIds: p.reporteeEmpIds.filter(id => id !== empId),
                      }));
                    }}
                    options={EMPLOYEES.map(e => ({ value: e.id, label: empLabel(e) }))}
                    placeholder="Select employee"
                    required
                  />
                </Field>

                {form.reportingEmpId && (
                  <div style={{
                    marginTop: 4, padding: "12px 14px", borderRadius: 10,
                    background: "var(--bg-subtle,#f8fafc)", border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "var(--brand-light,#eff6ff)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <GroupIcon size={18} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {empLabel(EMP_MAP[form.reportingEmpId])}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Arrow divider ── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 52, gap: 4 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--bg-subtle,#f1f5f9)", border: "1.5px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "var(--text-3)",
                }}>
                  →
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".5px" }}>
                  manages
                </div>
              </div>

              {/* ── Reportee side ── */}
              <div>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "#15803d", textTransform: "uppercase",
                  letterSpacing: ".7px", marginBottom: 14, paddingBottom: 8,
                  borderBottom: "2px solid #dcfce7",
                }}>
                  Reportee (Team)
                </div>

                <Field label={
                  form.reporteeEmpIds.length > 0
                    ? `Select Reportees (${form.reporteeEmpIds.length} selected)`
                    : "Select Reportees"
                } required>
                  <MultiSelectDropdown
                    options={reporteeOptions}
                    selectedIds={form.reporteeEmpIds}
                    onChange={ids => setForm(p => ({ ...p, reporteeEmpIds: ids }))}
                    disabled={!form.reportingEmpId}
                    placeholder={form.reportingEmpId ? "Select employees…" : "Select the reporting manager first"}
                  />
                </Field>
              </div>
            </div>

          </div>
        </div>

        <div className="actions-row">
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/agent/hierarchy")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            {isEdit ? "Save Changes" : "Add Hierarchy"}
          </button>
        </div>
      </form>
    </div>
  );
}
