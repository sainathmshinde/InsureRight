import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEMO = [
  { role: "Broker", email: "broker@kmdastur.com", pass: "broker@123" },
  { role: "Agent", email: "pooja@kmdastur.com", pass: "agent@123" },
  { role: "Customer", email: "aarav@gmail.com", pass: "cust@123" },
];

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const r = login(form.email, form.password);
      setLoading(false);
      if (r.ok) {
        const dest = r.user.role === 'broker' ? '/broker-portal'
                   : r.user.role === 'agent'  ? '/agent-portal'
                   : '/customer-portal'
        navigate(dest, { replace: true })
      }
      else setError(r.error);
    }, 500);
  };

  const fillDemo = (email, pass) => {
    setForm({ email, password: pass });
    setError("");
  };

  return (
    <div style={S.page}>
      {/* ── Left card ── */}
      <div style={S.card}>
        <div style={S.brand}>
          <div style={S.logoBox}>KD</div>
          <div>
            <div style={S.brandName}>K.M. Dastur & Co.</div>
            <div style={S.brandSub}>
              Insurance Brokers Pvt. Ltd. · IRDAI CB-456/2008
            </div>
          </div>
        </div>

        <h2 style={S.title}>Welcome back</h2>
        <p style={S.sub}>Sign in to your portal</p>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleSubmit} style={S.form}>
          <div>
            <label style={S.lbl}>Email address</label>
            <input
              type="email"
              required
              autoFocus
              style={S.inp}
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={S.lbl}>Password</label>
            <input
              type={showPass ? "text" : "password"}
              required
              style={S.inp}
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
            />
            <button
              type="button"
              style={S.eyeBtn}
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            style={{ ...S.btn, opacity: loading ? 0.75 : 1 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        {/* Demo credentials */}
        <div style={S.demoBox}>
          <div style={S.demoHead}>Quick demo login</div>
          <div style={S.demoBtns}>
            {DEMO.map((d) => (
              <button
                key={d.role}
                type="button"
                style={S.demoBtn}
                onClick={() => fillDemo(d.email, d.pass)}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>

        <p style={S.regLink}>
          New broker?{" "}
          <Link to="/register" style={S.link}>
            Register your firm →
          </Link>
        </p>
      </div>

      {/* ── Right panel ── */}
      <div style={S.panel}>
        <div style={S.panelInner}>
          <div style={S.shield}>🛡️</div>
          <h3 style={S.panelTitle}>InsureRight Broker Portal</h3>
          <p style={S.panelText}>
            One platform to manage your agents, customers, policies and
            products.
          </p>
          <ul style={S.feats}>
            {[
              "✓  Onboard agents & POS agents",
              "✓  Manage customers & KYC",
              "✓  Issue & track policies",
              "✓  Product catalogue & pricing",
              "✓  Commission management",
              "✓  CRM & campaigns",
            ].map((f) => (
              <li key={f} style={S.feat}>
                {f}
              </li>
            ))}
          </ul>
          <div style={S.badge}>IRDAI Registered · CB-456/2008</div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: "100vh", display: "flex", background: "#f5f4f9" },
  card: {
    width: 460,
    flexShrink: 0,
    background: "#fff",
    padding: "52px 48px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 24px rgba(0,0,0,0.07)",
  },
  brand: { display: "flex", alignItems: "center", gap: 13, marginBottom: 40 },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 11,
    background: "#7c3aed",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    letterSpacing: 0.5,
  },
  brandName: { fontSize: 15, fontWeight: 700, color: "#1a1628" },
  brandSub: { fontSize: 11, color: "#9d94b8", marginTop: 2 },
  title: { fontSize: 24, fontWeight: 700, color: "#1a1628", margin: "0 0 4px" },
  sub: { fontSize: 13.5, color: "#9d94b8", margin: "0 0 28px" },
  err: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  lbl: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#1a1628",
    marginBottom: 6,
  },
  inp: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e2ddf0",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    color: "#1a1628",
    background: "#faf9fc",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    bottom: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: 1,
  },
  btn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "12px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: 4,
    transition: "opacity .15s",
    letterSpacing: 0.2,
  },
  demoBox: {
    marginTop: 24,
    padding: "13px 15px",
    background: "#f5f3ff",
    border: "1px solid #ede9fe",
    borderRadius: 9,
  },
  demoHead: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: ".6px",
    marginBottom: 8,
  },
  demoBtns: { display: "flex", gap: 8 },
  demoBtn: {
    padding: "5px 14px",
    background: "#ede9fe",
    color: "#7c3aed",
    border: "1px solid #c4b5fd",
    borderRadius: 6,
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
  },
  regLink: {
    fontSize: 13,
    color: "#5c5573",
    marginTop: 22,
    textAlign: "center",
  },
  link: { color: "#7c3aed", fontWeight: 600, textDecoration: "none" },
  // Right panel
  panel: {
    flex: 1,
    background: "linear-gradient(140deg,#7c3aed 0%,#4f1d96 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 56,
  },
  panelInner: { maxWidth: 420, color: "#fff" },
  shield: { fontSize: 56, marginBottom: 22, display: "block" },
  panelTitle: {
    fontSize: 28,
    fontWeight: 800,
    margin: "0 0 14px",
    color: "#fff",
    lineHeight: 1.2,
  },
  panelText: {
    fontSize: 15,
    color: "#c4b5fd",
    lineHeight: 1.75,
    margin: "0 0 30px",
  },
  feats: {
    listStyle: "none",
    padding: 0,
    margin: "0 0 28px",
    display: "flex",
    flexDirection: "column",
    gap: 11,
  },
  feat: { fontSize: 14, color: "#e9d5ff", letterSpacing: 0.1 },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#f3e8ff",
    padding: "5px 14px",
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
  },
};
