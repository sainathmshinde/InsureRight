import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const INS_TYPES = [
  { icon: "🏥", label: "Health",       sub: "Medical cover",      color: "#2d7d46", bg: "rgba(255,255,255,0.14)" },
  { icon: "🚗", label: "Car",          sub: "Comprehensive",      color: "#0a7ea4", bg: "rgba(255,255,255,0.14)" },
  { icon: "🏍️", label: "Two-Wheeler",  sub: "Bike & scooter",     color: "#f97316", bg: "rgba(255,255,255,0.14)" },
  { icon: "🛡️", label: "Term Life",    sub: "Pure protection",    color: "#a855f7", bg: "rgba(255,255,255,0.14)" },
  { icon: "📈", label: "Investment",   sub: "ULIP & savings",     color: "#60a5fa", bg: "rgba(255,255,255,0.14)" },
  { icon: "✈️", label: "Travel",       sub: "Domestic & intl",    color: "#34d399", bg: "rgba(255,255,255,0.14)" },
  { icon: "🏠", label: "Home",         sub: "Structure & contents",color: "#fbbf24", bg: "rgba(255,255,255,0.14)" },
  { icon: "🏢", label: "Business",     sub: "SME & commercial",   color: "#e2e8f0", bg: "rgba(255,255,255,0.14)" },
];

const DEMO_ROLES = [
  { role: "Broker",   icon: "🏛️", email: "broker@kmdastur.com", pass: "broker@123", color: "#7c3aed", desc: "Full portal access" },
  { role: "Agent",    icon: "👤", email: "pooja@kmdastur.com",  pass: "agent@123",  color: "#0a7ea4", desc: "Agent portal" },
  { role: "Customer", icon: "🧑", email: "aarav@gmail.com",     pass: "cust@123",   color: "#2d7d46", desc: "Customer portal" },
];

const IC_PARTNERS = [
  { logo: "⭐", name: "Star Health",    claim: "90%" },
  { logo: "🏦", name: "HDFC ERGO",      claim: "91%" },
  { logo: "🛡️", name: "ICICI Lombard", claim: "88%" },
  { logo: "🔵", name: "Bajaj Allianz",  claim: "93%" },
  { logo: "🏢", name: "LIC",            claim: "98%" },
  { logo: "💙", name: "HDFC Life",      claim: "99%" },
];

export default function SignIn() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const r = login(form.email, form.password);
      setLoading(false);
      if (r.ok) {
        const dest = r.user.role === "broker" ? "/broker-portal" : r.user.role === "agent" ? "/agent-portal" : "/customer-portal";
        navigate(dest, { replace: true });
      } else setError(r.error);
    }, 500);
  };

  const fillDemo = (email, pass) => { setForm({ email, password: pass }); setError(""); };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .si-type-card:hover { background: rgba(255,255,255,0.22) !important; transform: translateY(-2px); }
        .si-demo-btn:hover  { opacity: 0.85; }
        .si-submit:hover    { opacity: 0.88; }
        .si-inp:focus       { border-color: #7c3aed !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* ── Left hero panel ── */}
        <div style={{ flex: 1, background: "linear-gradient(145deg,#1e0a3c 0%,#3b0764 40%,#1e3a5f 100%)", overflowY: "auto", display: "flex", flexDirection: "column", padding: "40px 48px", position: "relative" }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, animation: "fadeUp .5s ease both" }}>
            <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>IR</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>Insure<span style={{ color: "#a78bfa" }}>Right</span></div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>K.M. Dastur & Co. · IRDAI CB-456/2008</div>
            </div>
            <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: 99, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
              IRDAI Licensed
            </div>
          </div>

          {/* Headline */}
          <div style={{ animation: "fadeUp .5s .1s ease both" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>India's Trusted Platform</div>
            <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Compare & Buy<br />Insurance Plans
            </h1>
            <p style={{ margin: "0 0 36px", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 420 }}>
              One platform to manage brokers, agents, customers, policies and products — end to end.
            </p>
          </div>

          {/* Insurance type grid */}
          <div style={{ marginBottom: 40, animation: "fadeUp .5s .2s ease both" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Available Insurance Types</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {INS_TYPES.map(t => (
                <div key={t.label} className="si-type-card" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 10px", textAlign: "center", cursor: "default", transition: "all .2s" }}>
                  <div style={{ fontSize: 24, marginBottom: 7 }}>{t.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{t.label}</div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 20, marginBottom: 36, animation: "fadeUp .5s .3s ease both" }}>
            {[
              { v: "7+",    l: "IC Partners" },
              { v: "95%+",  l: "Avg Claims" },
              { v: "IRDAI", l: "Licensed" },
              { v: "100%",  l: "Digital" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* IC partner logos */}
          <div style={{ animation: "fadeUp .5s .4s ease both" }}>
            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Our Insurance Partners</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {IC_PARTNERS.map(ic => (
                <div key={ic.name} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <span style={{ fontSize: 14 }}>{ic.logo}</span>
                  <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{ic.name}</span>
                  <span style={{ fontSize: 10.5, color: "#6ee7b7", fontWeight: 700 }}>{ic.claim}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right login form ── */}
        <div style={{ width: 440, flexShrink: 0, background: "#fff", overflowY: "auto", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>

          {/* Form header */}
          <div style={{ marginBottom: 32, animation: "fadeUp .4s ease both" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              InsureRight Portal
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 800, color: "#1a1628" }}>Welcome back</h2>
            <p style={{ margin: 0, fontSize: 14, color: "#9d94b8" }}>Sign in to your portal to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp .4s .1s ease both" }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#5c5573", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".3px" }}>Email Address</label>
              <input
                type="email" required autoFocus
                placeholder="you@example.com"
                value={form.email} onChange={set("email")}
                className="si-inp"
                style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e2ddf0", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "inherit", color: "#1a1628", background: "#faf9fc", boxSizing: "border-box", transition: "border-color .15s, box-shadow .15s" }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#5c5573", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".3px" }}>Password</label>
              <input
                type={showPass ? "text" : "password"} required
                placeholder="••••••••"
                value={form.password} onChange={set("password")}
                className="si-inp"
                style={{ width: "100%", padding: "11px 44px 11px 14px", border: "1.5px solid #e2ddf0", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "inherit", color: "#1a1628", background: "#faf9fc", boxSizing: "border-box", transition: "border-color .15s, box-shadow .15s" }}
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: 12, bottom: 11, background: "none", border: "none", cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            <button type="submit" className="si-submit" disabled={loading}
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 4, transition: "opacity .15s", letterSpacing: 0.2, opacity: loading ? 0.75 : 1 }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", animation: "fadeUp .4s .2s ease both" }}>
            <div style={{ flex: 1, height: 1, background: "#f0edf8" }} />
            <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>QUICK DEMO LOGIN</span>
            <div style={{ flex: 1, height: 1, background: "#f0edf8" }} />
          </div>

          {/* Demo role cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9, animation: "fadeUp .4s .25s ease both" }}>
            {DEMO_ROLES.map(d => (
              <button key={d.role} type="button" className="si-demo-btn" onClick={() => fillDemo(d.email, d.pass)}
                style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 16px", border: "1.5px solid #e8e4f0", borderRadius: 10, background: "#faf9fc", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "opacity .15s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: d.color + "18", border: "1.5px solid " + d.color + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {d.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1628" }}>{d.role} Login</div>
                  <div style={{ fontSize: 11.5, color: "#9d94b8", marginTop: 1 }}>{d.email}</div>
                </div>
                <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: d.color + "15", color: d.color, fontWeight: 600, whiteSpace: "nowrap" }}>{d.desc}</span>
              </button>
            ))}
          </div>

          {/* Register link */}
          <p style={{ fontSize: 13, color: "#9d94b8", textAlign: "center", marginTop: 28, animation: "fadeUp .4s .3s ease both" }}>
            New broker?{" "}
            <Link to="/register" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>Register your firm →</Link>
          </p>

        </div>
      </div>
    </>
  );
}
