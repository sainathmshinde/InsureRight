import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ORGANISATIONS, ASSOCIATIONS } from "../customer/orgAssocData";
import kmdLogo from "../../assets/kmd-logo.svg";

const DEMO = [
  { role: "Broker",        email: "sainath@kmdastur.com", pass: "broker@123", mobile: "9000000001" },
  { role: "Calling Operator", email: "pooja@kmdastur.com",  pass: "agent@123",  mobile: "9000000002" },
  { role: "Sales Operator",   email: "ravi@kmdastur.com",   pass: "sales@123",  mobile: "9000000003" },
  { role: "Customer",      email: "aarav@gmail.com",     pass: "cust@123",   mobile: "9876543210" },
];

const MOBILE_CREDS = Object.fromEntries(
  DEMO.map(d => [d.mobile, { email: d.email, pass: d.pass }])
);

// ── 4-box OTP input ───────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 4 }, (_, i) => value[i] || "");

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = char;
    onChange(next.join(""));
    if (char && i < 3) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits]; next[i] = ""; onChange(next.join(""));
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    onChange(text.padEnd(4, "").slice(0, 4));
    refs.current[Math.min(text.length, 3)]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={i === 0}
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 52, height: 44, textAlign: "center", fontSize: 14, fontWeight: 600,
            border: `1.5px solid ${d ? "#a855f7" : "#e2ddf0"}`,
            borderRadius: 8, outline: "none", fontFamily: "inherit",
            color: "#1a1628", background: d ? "#f5f3ff" : "#faf9fc",
            boxSizing: "border-box", transition: "border-color .15s, background .15s",
          }}
        />
      ))}
    </div>
  );
}

// ── Sign-up view ──────────────────────────────────────────────────────────────
function SignUpView({ onBack }) {
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [mobile,      setMobile]      = useState("");
  const [otpSent,     setOtpSent]     = useState(false);
  const [otp,         setOtp]         = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError,    setOtpError]    = useState("");
  const [orgId,       setOrgId]       = useState("");
  const [assocId,     setAssocId]     = useState("");
  const [agreed,      setAgreed]      = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const filteredAssocs = ASSOCIATIONS.filter(a => a.orgId === Number(orgId));

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtp("");
    setOtpError("");
  };

  const handleVerifyOtp = () => {
    if (otp === "1111") {
      setOtpVerified(true);
      setOtpError("");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpError("");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Signup:", { firstName, lastName, email, mobile, orgId, assocId });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 24 }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h2 style={{ ...S.title, textAlign: "center" }}>Registration Successful!</h2>
        <p style={{ fontSize: 13.5, color: "#64748b", textAlign: "center" }}>
          Your account has been created. You can now sign in.
        </p>
        <button type="button" style={S.btn} onClick={onBack}>Go to Sign In →</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={S.title}>Create Account</h2>
        <p style={S.sub}>Sign up to access your portal</p>
      </div>

      {/* Name row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <label style={S.lbl}>First Name</label>
          <input style={S.inp} placeholder="First name" value={firstName}
            onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div>
          <label style={S.lbl}>Last Name</label>
          <input style={S.inp} placeholder="Last name" value={lastName}
            onChange={e => setLastName(e.target.value)} required />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={S.lbl}>Email</label>
        <input type="email" style={S.inp} placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)} required />
      </div>

      {/* Mobile + Send OTP */}
      <div>
        <label style={S.lbl}>Mobile Number</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="tel" maxLength={10}
            style={{ ...S.inp, flex: 1, ...(otpSent ? { background: "#f3f0fa", color: "#7c3aed", fontWeight: 600 } : {}) }}
            placeholder="10-digit mobile number"
            value={mobile}
            readOnly={otpSent}
            onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
          {!otpVerified && (
            <button
              type="button"
              style={{ ...S.btn, marginTop: 0, padding: "10px 14px", fontSize: 13, whiteSpace: "nowrap", opacity: mobile.length < 10 ? 0.5 : 1 }}
              disabled={mobile.length < 10}
              onClick={handleSendOtp}
            >
              {otpSent ? "Resend" : "Send OTP"}
            </button>
          )}
        </div>
      </div>

      {/* OTP input — shown after Send OTP */}
      {otpSent && !otpVerified && (
        <div>
          <label style={S.lbl}>Enter OTP</label>
          <OtpInput value={otp} onChange={v => { setOtp(v); setOtpError(""); }} />
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
            OTP sent to +91-{mobile}
          </div>

          {/* Verify + Resend — shown once all 4 digits entered */}
          {otp.length === 4 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="button"
                style={{ ...S.btn, flex: 1, marginTop: 0 }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
              <button
                type="button"
                style={{ ...S.btn, flex: 1, marginTop: 0, background: "transparent", color: "#a855f7", border: "1.5px solid #a855f7" }}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
          )}

          {otpError && (
            <div style={{ ...S.err, marginTop: 8, marginBottom: 0 }}>{otpError}</div>
          )}
        </div>
      )}

      {/* After OTP verified */}
      {otpVerified && (
        <>
          <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", color: "#065f46", borderRadius: 8, padding: "10px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            ✓&nbsp; Mobile number verified successfully
          </div>

          {/* Organisation */}
          <div>
            <label style={S.lbl}>Organisation Name</label>
            <select
              style={S.sel}
              value={orgId}
              onChange={e => { setOrgId(e.target.value); setAssocId(""); }}
            >
              <option value="">Select organisation</option>
              {ORGANISATIONS.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Association */}
          <div>
            <label style={S.lbl}>Association Name</label>
            <select
              style={{ ...S.sel, opacity: !orgId ? 0.6 : 1 }}
              value={assocId}
              onChange={e => setAssocId(e.target.value)}
              disabled={!orgId}
            >
              <option value="">{orgId ? "Select association" : "Select organisation first"}</option>
              {filteredAssocs.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Declaration */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "#1a1628", lineHeight: 1.5 }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#7c3aed", width: 15, height: 15, flexShrink: 0, cursor: "pointer" }}
            />
            I agree to the declarations
          </label>

          {/* Sign Up button */}
          <button
            type="submit"
            style={{ ...S.btn, opacity: (!agreed) ? 0.5 : 1 }}
            disabled={!agreed}
          >
            Sign Up →
          </button>
        </>
      )}

      <p style={{ ...S.regLink, marginTop: 6 }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: 0 }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

// ── Sign-in page ──────────────────────────────────────────────────────────────
export default function SignIn() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [view,      setView]     = useState("signin"); // "signin" | "signup"
  const [loginMode, setLoginMode] = useState("mobile");

  const [mobile,  setMobile]  = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp,     setOtp]     = useState("");

  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [showPass,   setShowPass]   = useState(false);

  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (mode) => {
    setLoginMode(mode);
    setError("");
    setOtpSent(false);
    setOtp("");
  };

  const handleGetOtp = () => {
    if (mobile.length < 10) { setError("Enter a valid 10-digit mobile number."); return; }
    setError("");
    setOtpSent(true);
  };

  const handleOtpLogin = (e) => {
    e.preventDefault();
    if (otp.length < 4) { setError("Enter the OTP."); return; }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const creds = MOBILE_CREDS[mobile];
      if (!creds) {
        setLoading(false);
        setError("Mobile number not registered. Try a demo number or use Username login.");
        return;
      }
      const r = login(creds.email, creds.pass);
      setLoading(false);
      if (r.ok) {
        navigate(
          r.user.role === "broker" ? "/broker-portal" :
          r.user.role === "agent"  ? "/agent-portal"  : "/customer-portal",
          { replace: true }
        );
      } else setError(r.error);
    }, 500);
  };

  const handleUsernameLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const r = login(identifier, password);
      setLoading(false);
      if (r.ok) {
        navigate(
          r.user.role === "broker" ? "/broker-portal" :
          r.user.role === "agent"  ? "/agent-portal"  : "/customer-portal",
          { replace: true }
        );
      } else setError(r.error);
    }, 500);
  };

  const fillDemo = (d) => {
    switchMode("username");
    setIdentifier(d.email);
    setPassword(d.pass);
  };

  return (
    <div className="login-page" style={S.page}>
      <div style={S.wrapper}>

      {/* ── Left card ── */}
      <div className="login-card" style={S.card}>

        {/* Brand — always visible */}
        <div style={S.brand}>
          <img src={kmdLogo} alt="KMD" style={S.logoImg} />
          <div>
            <div style={S.brandName}>K.M. Dastur & Co.</div>
            <div style={{ fontSize: 13, color: "#a855f7", fontWeight: 600, marginTop: 2 }}>Insurance Brokers · IRDAI Registered</div>
          </div>
        </div>

        {view === "signup" ? (
          <SignUpView onBack={() => setView("signin")} />
        ) : (
          <>
            <h2 style={{ ...S.title, background:"linear-gradient(135deg,#fb7185,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Welcome back</h2>
            <p style={S.sub}>Sign in to access your portal</p>

            {/* Mode toggle */}
            <div style={S.toggle}>
              {[
                { key: "mobile",   label: "📱 Mobile Number" },
                { key: "username", label: "👤 Username" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchMode(key)}
                  style={{
                    ...S.toggleBtn,
                    background: loginMode === key ? "linear-gradient(135deg,#fb7185 0%,#a855f7 100%)" : "transparent",
                    color:      loginMode === key ? "#fff"    : "#a855f7",
                    fontWeight: loginMode === key ? 600       : 400,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {error && <div style={S.err}>{error}</div>}

            {/* Mobile OTP flow */}
            {loginMode === "mobile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={S.lbl}>Mobile Number</label>
                  <input
                    type="tel" maxLength={10} autoFocus={!otpSent}
                    readOnly={otpSent}
                    style={{ ...S.inp, ...(otpSent ? { background: "#f3f0fa", color: "#7c3aed", fontWeight: 600, cursor: "default" } : {}) }}
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={e => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  />
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    style={{ ...S.btn, opacity: mobile.length < 10 ? 0.5 : 1 }}
                    disabled={mobile.length < 10}
                    onClick={handleGetOtp}
                  >
                    Get OTP →
                  </button>
                ) : (
                  <form onSubmit={handleOtpLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={S.lbl}>Enter OTP</label>
                      <OtpInput value={otp} onChange={v => { setOtp(v); setError(""); }} />
                      <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                        OTP sent to +91-{mobile} ·{" "}
                        <button
                          type="button"
                          onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                          style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}
                        >
                          Change number
                        </button>
                      </div>
                    </div>
                    <button type="submit" style={{ ...S.btn, opacity: (loading || otp.length < 4) ? 0.75 : 1 }} disabled={loading || otp.length < 4}>
                      {loading ? "Verifying…" : "Login →"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Username flow */}
            {loginMode === "username" && (
              <form onSubmit={handleUsernameLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={S.lbl}>Username / Email</label>
                  <input
                    type="text" required autoFocus
                    style={S.inp} placeholder="Email or username"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setError(""); }}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <label style={S.lbl}>Password</label>
                  <input
                    type={showPass ? "text" : "password"} required
                    style={S.inp} placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                  />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPass(v => !v)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                <button type="submit" style={{ ...S.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>
            )}

            <p style={S.regLink}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: 0 }}
              >
                Sign up
              </button>
            </p>

            {/* Demo credentials */}
            <div style={{ ...S.demoBox, marginTop: "auto" }}>
              <div style={S.demoHead}>Quick demo login</div>
              <div style={S.demoBtns}>
                {DEMO.map(d => (
                  <button key={d.role} type="button" style={S.demoBtn} onClick={() => fillDemo(d)}>
                    {d.role}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Right panel ── */}
      <div className="login-panel" style={S.panel}>
        <div style={S.panelInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <img src={kmdLogo} alt="KMD" style={S.shield} />
            <h3 style={S.panelTitle}>K.M. Dastur Reinsurance Broker</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={S.infoCard}>
                <div style={S.panelSection}>Quality Policy</div>
                <p style={S.panelText}>K.M. Dastur is committed to satisfy &amp; delight customers by meeting requirements through timely, error free and courteous services and to continually improve the effectiveness of its processes. This is achieved through statutory compliances.</p>
            </div>
            <div style={S.infoCard}>
                <div style={S.panelSection}>Our Vision</div>
                <p style={S.panelText}>KMD will be recognized as the best professional services company in the insurance industry worldwide.</p>
            </div>
            <div style={S.infoCard}>
                <div style={S.panelSection}>Our Mission</div>
                <p style={S.panelText}>To render professional services of the highest order and be recognized as a professional company that consistently exceeds the expectations of our clients and our people through commitment to learning, integrity and hard work.</p>
            </div>
          </div>
        </div>
      </div>

      </div>{/* wrapper */}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #fde8ef 0%, #faf4ff 50%, #ede9fe 100%)",
    padding: "24px 16px",
  },
  wrapper: {
    display: "flex", width: "100%", maxWidth: 880,
    borderRadius: 24, background: "#fff",
    boxShadow: "0 24px 64px rgba(168,85,247,0.18), 0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  card: {
    width: 430, flexShrink: 0, padding: "44px 40px",
    background: "#fff",
    display: "flex", flexDirection: "column",
    overflowY: "auto", maxHeight: "92vh",
    boxShadow: "4px 0 20px rgba(168,85,247,0.08)",
    position: "relative", zIndex: 2,
  },
  brand: { display: "flex", alignItems: "center", gap: 13, marginBottom: 28, paddingBottom: 22, borderBottom: "1.5px solid #f3e8ff" },
  logoImg: { width: 46, height: 46, flexShrink: 0, borderRadius: "50%", boxShadow: "0 2px 10px rgba(168,85,247,0.20)" },
  brandName: { fontSize: 15, fontWeight: 700, color: "#1a1628" },
  brandSub:  { fontSize: 13, color: "#64748b", marginTop: 2 },
  title: { fontSize: 26, fontWeight: 800, color: "#1a1628", margin: "0 0 6px" },
  sub:   { fontSize: 13, color: "#64748b", margin: "0 0 18px" },
  toggle: {
    display: "flex", background: "#f3f0fa", borderRadius: 9,
    padding: 4, gap: 4, marginBottom: 22,
  },
  toggleBtn: {
    flex: 1, padding: "9px 12px", border: "none", borderRadius: 7,
    cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all .15s",
  },
  err: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 4,
  },
  lbl: { display: "block", fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 13, fontWeight: 600, color: "#4a4566", marginBottom: 6, letterSpacing: ".1px" },
  inp: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e4f3",
    borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#1a1628", background: "#faf9fc", boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(168,85,247,0.06)", transition: "border-color .15s",
  },
  sel: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e8e4f3",
    borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#1a1628", background: "#faf9fc", boxSizing: "border-box",
    boxShadow: "0 1px 4px rgba(168,85,247,0.06)", cursor: "pointer",
  },
  eyeBtn: {
    position: "absolute", right: 12, bottom: 10, background: "none",
    border: "none", cursor: "pointer", fontSize: 15, lineHeight: 1,
  },
  btn: {
    background: "linear-gradient(135deg,#fb7185 0%,#a855f7 100%)", color: "#fff", border: "none", borderRadius: 10,
    padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", marginTop: 4, transition: "opacity .15s, filter .15s", letterSpacing: 0.2,
    boxShadow: "0 4px 14px rgba(168,85,247,0.35)",
  },
  demoBox: { padding: "13px 15px", background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: 10 },
  demoHead: { fontSize: 13, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 8 },
  demoBtns: { display: "flex", gap: 8, flexWrap: "wrap" },
  demoBtn: {
    padding: "5px 14px", background: "#ede9fe", color: "#7c3aed",
    border: "1px solid #c4b5fd", borderRadius: 6, fontSize: 13.5,
    cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
  },
  regLink: { fontSize: 13, color: "#5c5573", marginTop: 18, textAlign: "center" },
  panel: {
    flex: 1, background: "linear-gradient(150deg, #fdf2f8 0%, #f5f0ff 100%)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 44,
    borderRadius: "18px", margin: "10px", marginLeft: "-18px",
    boxShadow: "0 4px 20px rgba(168,85,247,0.10)", position: "relative", zIndex: 1,
  },
  panelInner: { maxWidth: 400 },
  shield: { width: 50, height: 50, flexShrink: 0, borderRadius: "50%", opacity: 0.85 },
  panelTitle:   { fontSize: 18, fontWeight: 800, margin: 0, color: "#4c1d6e", lineHeight: 1.2 },
  panelSection: { fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#a855f7", marginBottom: 4 },
  panelText:    { fontSize: 13.5, color: "#6b4e8a", lineHeight: 1.7, margin: 0, fontWeight: 500 },
  infoCard: {
    background: "rgba(255,255,255,0.65)",
    borderRadius: 10, padding: "11px 14px",
    borderLeft: "3px solid #d8b4fe",
  },
  badge: {
    display: "inline-block", background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.28)", color: "#fff",
    padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
  },
};
