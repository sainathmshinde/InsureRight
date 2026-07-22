import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kmdLogo from "../../assets/kmd-logo.svg";

const DEMO = [
  { role: "Broker",        email: "sainath@kmdastur.com", pass: "broker@123", mobile: "9000000001" },
  { role: "Calling Employee", email: "pooja@kmdastur.com",  pass: "operator@123",  mobile: "9000000002" },
  { role: "Sales Employee",   email: "ravi@kmdastur.com",   pass: "sales@123",  mobile: "9000000003" },
  { role: "Member",      email: "aarav@gmail.com",     pass: "cust@123",   mobile: "9876543210" },
];

const MOBILE_CREDS = Object.fromEntries(
  DEMO.map(d => [d.mobile, { email: d.email, pass: d.pass }])
);

// ── hexagon-mesh background pattern (tiles seamlessly) ─────────────────────────
const HEX_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='34.64' height='60' viewBox='0 0 34.64 60'><g fill='none' stroke='white' stroke-opacity='0.10'><path d='M0 -5 L17.32 5 L17.32 25 L0 35 L-17.32 25 L-17.32 5 Z'/><path d='M34.64 -5 L51.96 5 L51.96 25 L34.64 35 L17.32 25 L17.32 5 Z'/><path d='M17.32 25 L34.64 35 L34.64 55 L17.32 65 L0 55 L0 35 Z'/><path d='M-17.32 25 L0 35 L0 55 L-17.32 65 L-34.64 55 L-34.64 35 Z'/><path d='M51.96 25 L69.28 35 L69.28 55 L51.96 65 L34.64 55 L34.64 35 Z'/></g></svg>`;
const HEX_BG = `url("data:image/svg+xml,${encodeURIComponent(HEX_SVG)}")`;

const CHEVRON_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236d747a' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>`;
const CHEVRON_BG = `url("data:image/svg+xml,${CHEVRON_SVG}")`;

// ── eye / eye-off icons (password visibility toggle) ───────────────────────────
function IconEye({ size = 20, color = "#737373" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.70104 12.5094C4.59728 12.3554 4.5454 12.2784 4.51636 12.1596C4.49455 12.0704 4.49455 11.9296 4.51636 11.8404C4.5454 11.7216 4.59728 11.6446 4.70104 11.4906C5.55845 10.2177 8.11063 7 12 7C15.8894 7 18.4415 10.2177 19.299 11.4906C19.4027 11.6446 19.4546 11.7216 19.4836 11.8404C19.5055 11.9296 19.5055 12.0704 19.4836 12.1596C19.4546 12.2784 19.4027 12.3554 19.299 12.5094C18.4415 13.7823 15.8894 17 12 17C8.11063 17 5.55846 13.7823 4.70104 12.5094Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.1429C13.2623 14.1429 14.2856 13.1835 14.2856 12C14.2856 10.8165 13.2623 9.85714 12 9.85714C10.7377 9.85714 9.71438 10.8165 9.71438 12C9.71438 13.1835 10.7377 14.1429 12 14.1429Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEyeOff({ size = 20, color = "#737373" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.70104 12.5094C4.59728 12.3554 4.5454 12.2784 4.51636 12.1596C4.49455 12.0704 4.49455 11.9296 4.51636 11.8404C4.5454 11.7216 4.59728 11.6446 4.70104 11.4906C5.55845 10.2177 8.11063 7 12 7C15.8894 7 18.4415 10.2177 19.299 11.4906C19.4027 11.6446 19.4546 11.7216 19.4836 11.8404C19.5055 11.9296 19.5055 12.0704 19.4836 12.1596C19.4546 12.2784 19.4027 12.3554 19.299 12.5094C18.4415 13.7823 15.8894 17 12 17C8.11063 17 5.55846 13.7823 4.70104 12.5094Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.1429C13.2623 14.1429 14.2856 13.1835 14.2856 12C14.2856 10.8165 13.2623 9.85714 12 9.85714C10.7377 9.85714 9.71438 10.8165 9.71438 12C9.71438 13.1835 10.7377 14.1429 12 14.1429Z" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="4" y1="20" x2="20" y2="4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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
            border: `1.5px solid ${d ? "#1565d8" : "#dee1e5"}`,
            borderRadius: 6, outline: "none", fontFamily: "inherit",
            color: "#24304a", background: d ? "#eaf2ff" : "#f8fafc",
            boxSizing: "border-box", transition: "border-color .15s, background .15s",
          }}
        />
      ))}
    </div>
  );
}

// ── Sign-in page ──────────────────────────────────────────────────────────────
export default function SignIn() {
  const { login, loginByMobile } = useAuth();
  const navigate  = useNavigate();

  const [loginMode, setLoginMode] = useState("mobile"); // "mobile" | "userid"

  const [countryCode, setCountryCode] = useState("+91");
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

  const quickLogin = (demo) => {
    setLoginMode("userid");
    setIdentifier(demo.email);
    setPassword(demo.pass);
    setError("");
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
      const r = creds ? login(creds.email, creds.pass) : loginByMobile(mobile);
      setLoading(false);
      if (r.ok) {
        navigate(
          r.user.role === "broker" ? "/broker-portal" :
          r.user.role === "agent"  ? "/agent-portal"  : "/member-portal",
          { replace: true }
        );
      } else setError("Mobile number not registered. Try a demo number, register, or use User ID login.");
    }, 500);
  };

  const handleUseridLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      const r = login(identifier, password);
      setLoading(false);
      if (r.ok) {
        navigate(
          r.user.role === "broker" ? "/broker-portal" :
          r.user.role === "agent"  ? "/agent-portal"  : "/member-portal",
          { replace: true }
        );
      } else setError(r.error);
    }, 500);
  };

  return (
    <div className="login-page" style={S.page}>
      <div style={S.glowOverlay} />
      <div style={S.gridOverlay} />

      <div className="login-card" style={S.card}>

        {/* Brand */}
        <div style={S.brand}>
          <img src={kmdLogo} alt="KMD" style={S.logoImg} />
          <div style={S.brandName}>K M Dastur</div>
        </div>

        <h1 style={S.title}>Login</h1>

        {/* Mode toggle */}
        <div style={S.toggle}>
          {[
            { key: "mobile", label: "Mobile No" },
            { key: "userid", label: "User ID" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => switchMode(key)}
              style={{
                ...S.toggleBtn,
                backgroundImage: loginMode === key ? "linear-gradient(180deg, #1565d8 0%, #104ea6 100%)" : "none",
                color:      loginMode === key ? "#fff"    : "#1565d8",
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
              <label style={S.lbl}>Mobile No</label>
              <div style={{ ...S.phoneRow, ...(otpSent ? { background: "#f0f6ff" } : {}) }}>
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  disabled={otpSent}
                  style={S.countrySel}
                >
                  <option value="+91">+91</option>
                </select>
                <input
                  type="tel" maxLength={10} autoFocus={!otpSent}
                  readOnly={otpSent}
                  style={S.phoneInput}
                  placeholder="98123 45678"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                style={{ ...S.btn, opacity: mobile.length < 10 ? 0.5 : 1 }}
                disabled={mobile.length < 10}
                onClick={handleGetOtp}
              >
                Get OTP
              </button>
            ) : (
              <form onSubmit={handleOtpLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={S.lbl}>Enter OTP</label>
                  <OtpInput value={otp} onChange={v => { setOtp(v); setError(""); }} />
                  <div style={{ fontSize: 13, color: "#6d747a", marginTop: 8 }}>
                    OTP sent to {countryCode}-{mobile} ·{" "}
                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                      style={{ background: "none", border: "none", color: "#006aff", cursor: "pointer", fontSize: 13, padding: 0, fontFamily: "inherit" }}
                    >
                      Change number
                    </button>
                  </div>
                </div>
                <button type="submit" style={{ ...S.btn, opacity: (loading || otp.length < 4) ? 0.75 : 1 }} disabled={loading || otp.length < 4}>
                  {loading ? "Verifying…" : "Login"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* User ID flow */}
        {loginMode === "userid" && (
          <form onSubmit={handleUseridLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={S.lbl}>User ID</label>
              <input
                type="text" required autoFocus
                style={S.inp} placeholder="Enter User ID"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setError(""); }}
              />
            </div>
            <div>
              <div style={{ position: "relative" }}>
                <label style={S.lbl}>Password</label>
                <input
                  type={showPass ? "text" : "password"} required
                  style={S.inp} placeholder="Enter Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                />
                <button type="button" style={S.eyeBtn} onClick={() => setShowPass(v => !v)}>
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <div style={S.forgotRow}>Forgot password</div>
            </div>
            <button type="submit" style={{ ...S.btn, opacity: loading ? 0.75 : 1 }} disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>
        )}

        <p style={S.regLink}>
          Don't have an account? <Link to="/register" style={S.regLinkA}>Register</Link>
        </p>

        {/* Quick login (demo) */}
        <div style={{ ...S.quickLoginWrap, marginTop: 20, marginBottom: 0 }}>
          <span style={S.quickLoginLbl}>Quick Login (Demo)</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {DEMO.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => quickLogin(d)}
                style={S.quickLoginBtn}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #1565d8 0%, #104ea6 100%)",
    padding: "24px 16px", position: "relative", overflow: "hidden",
  },
  glowOverlay: {
    position: "absolute", inset: 0, pointerEvents: "none",
    background:
      "radial-gradient(60% 50% at 25% 15%, rgba(255,255,255,0.16), transparent 60%), " +
      "radial-gradient(55% 45% at 85% 85%, rgba(8,40,90,0.35), transparent 70%)",
  },
  gridOverlay: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: HEX_BG,
    backgroundSize: "36px 62px",
  },
  card: {
    width: 460, maxWidth: "100%", padding: "40px 44px",
    background: "linear-gradient(180deg, #ffffff 0%, #eeeeee 6%, #ffffff 32%, #ffffff 68%, #f4f4f4 91%, #d7d7d7 105%)",
    borderRadius: 16, boxShadow: "0 2px 30px rgba(7,49,103,0.34)",
    display: "flex", flexDirection: "column",
    position: "relative", zIndex: 1,
  },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 32 },
  logoImg: { width: 44, height: 44, flexShrink: 0, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  brandName: { fontSize: 22, fontWeight: 600, color: "#24304a", letterSpacing: -0.3 },
  title: {
    fontSize: 28, fontWeight: 700, letterSpacing: -0.6, margin: "0 0 22px",
    backgroundImage: "linear-gradient(180deg, #1565d8 0%, #104ea6 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
  },
  toggle: {
    display: "flex", background: "transparent", border: "1.5px solid #dee1e5",
    borderRadius: 8, padding: 4, gap: 6, marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, padding: "10px 16px", border: "none", borderRadius: 7,
    cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all .15s",
  },
  quickLoginWrap: { marginBottom: 20 },
  quickLoginLbl: {
    display: "block", fontSize: 12, fontWeight: 600, color: "#6d747a",
    textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 8,
  },
  quickLoginBtn: {
    padding: "6px 12px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
    border: "1.5px solid #dee1e5", background: "#fff", color: "#1565d8",
    cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
  },
  err: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 4,
  },
  lbl: { display: "block", fontSize: 14, fontWeight: 500, color: "#24304a", marginBottom: 8 },
  inp: {
    width: "100%", height: 40, padding: "0 12px", border: "1.5px solid #dee1e5",
    borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#24304a", background: "#fff", boxSizing: "border-box",
    transition: "border-color .15s",
  },
  phoneRow: {
    display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #dee1e5",
    borderRadius: 6, background: "#fff", height: 40, padding: "0 12px",
    boxSizing: "border-box", transition: "background .15s",
  },
  countrySel: {
    border: "none", background: "transparent", outline: "none", fontFamily: "inherit",
    fontSize: 14, color: "#1f2937", cursor: "pointer", appearance: "none",
    padding: "0 20px 0 0", backgroundImage: CHEVRON_BG, backgroundRepeat: "no-repeat",
    backgroundPosition: "right center", backgroundSize: "16px 16px",
  },
  phoneInput: {
    flex: 1, border: "none", outline: "none", fontFamily: "inherit",
    fontSize: 14, color: "#24304a", background: "transparent", padding: 0,
    minWidth: 0,
  },
  eyeBtn: {
    position: "absolute", right: 12, bottom: 10, background: "none",
    border: "none", cursor: "pointer", padding: 0, display: "flex", lineHeight: 1,
  },
  forgotRow: {
    display: "flex", justifyContent: "flex-end", marginTop: 8,
    fontSize: 14, color: "#006aff",
  },
  btn: {
    backgroundImage: "linear-gradient(180deg, #1565d8 0%, #104ea6 100%)", color: "#fff",
    border: "none", borderRadius: 8, height: 40, fontSize: 16, fontWeight: 600,
    letterSpacing: -0.16, cursor: "pointer", fontFamily: "inherit",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "opacity .15s, filter .15s",
    boxShadow: "0 4px 14px rgba(21,101,216,0.28)",
  },
  regLink: { fontSize: 14, color: "#6d747a", marginTop: 24, textAlign: "center" },
  regLinkA: { color: "#006aff", fontWeight: 600, textDecoration: "none" },
};
