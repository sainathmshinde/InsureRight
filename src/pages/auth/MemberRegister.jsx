import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import kmdLogo from "../../assets/kmd-logo.svg";
import { ORGANISATIONS, ASSOCIATIONS } from "../member/orgAssocData";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useToast } from "../../context/ToastContext";

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
          value={d}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 52, height: 44, textAlign: "center", fontSize: 14, fontWeight: 600,
            border: `1.5px solid ${d ? "#2563eb" : "#dbe4f3"}`,
            borderRadius: 8, outline: "none", fontFamily: "inherit",
            color: "#0f172a", background: d ? "#eff6ff" : "#f8fafc",
            boxSizing: "border-box", transition: "border-color .15s, background .15s",
          }}
        />
      ))}
    </div>
  );
}

// ── hexagon-mesh background pattern (tiles seamlessly) ─────────────────────────
const HEX_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='34.64' height='60' viewBox='0 0 34.64 60'><g fill='none' stroke='white' stroke-opacity='0.10'><path d='M0 -5 L17.32 5 L17.32 25 L0 35 L-17.32 25 L-17.32 5 Z'/><path d='M34.64 -5 L51.96 5 L51.96 25 L34.64 35 L17.32 25 L17.32 5 Z'/><path d='M17.32 25 L34.64 35 L34.64 55 L17.32 65 L0 55 L0 35 Z'/><path d='M-17.32 25 L0 35 L0 55 L-17.32 65 L-34.64 55 L-34.64 35 Z'/><path d='M51.96 25 L69.28 35 L69.28 55 L51.96 65 L34.64 55 L34.64 35 Z'/></g></svg>`;
const HEX_BG = `url("data:image/svg+xml,${encodeURIComponent(HEX_SVG)}")`;

const INIT = { firstName: "", lastName: "", email: "", mobile: "", organisationId: "", associationId: "" };

export default function MemberRegister() {
  const { registerMember } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(INIT);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp]     = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const mobileVerified = otpSent && otp.length === 4;

  const fv = useFormValidation(form, {
    firstName: { required: "First name is required" },
    lastName: { required: "Last name is required" },
    email: {
      validate: (value) =>
        value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email" : "",
    },
    mobile: {
      required: "Enter a valid 10-digit mobile number",
      validate: (value) => {
        if (!/^[6-9]\d{9}$/.test(value)) return "Enter a valid 10-digit mobile number";
        if (!mobileVerified) return "Please verify your mobile number with OTP";
        return "";
      },
    },
  });

  const handleGetOtp = () => {
    fv.fieldProps("mobile").onBlur();
    if (!/^[6-9]\d{9}$/.test(form.mobile)) return;
    setOtpSent(true);
    setOtp("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fv.validateAll()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const r = registerMember({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        email: form.email,
        mobile: form.mobile,
        organisationId: form.organisationId,
        associationId: form.associationId,
      });
      setLoading(false);
      if (r.ok) {
        toast.success("Registration successful — welcome!");
        navigate("/member-portal", { replace: true });
      } else {
        toast.error(r.error || "Registration failed. Please try again.");
      }
    }, 600);
  };

  return (
    <div className="login-page" style={S.page}>
      <div style={S.gridOverlay} />

      <div className="login-card" style={S.card}>

        <div style={S.brand}>
          <img src={kmdLogo} alt="KMD" style={S.logoImg} />
          <div style={S.brandName}>KMD Company</div>
        </div>

        <h1 style={S.title}>Register</h1>
        <p style={S.sub}>Enter your information to create an account</p>

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={S.lbl}>First Name <span style={S.req}>*</span></label>
              <input style={S.inp} placeholder="Enter First Name" value={form.firstName} onChange={set("firstName")} onBlur={fv.fieldProps("firstName").onBlur} />
              {fv.fieldProps("firstName").error && <div style={S.err}>{fv.fieldProps("firstName").error}</div>}
            </div>
            <div>
              <label style={S.lbl}>Last Name <span style={S.req}>*</span></label>
              <input style={S.inp} placeholder="Enter Last Name" value={form.lastName} onChange={set("lastName")} onBlur={fv.fieldProps("lastName").onBlur} />
              {fv.fieldProps("lastName").error && <div style={S.err}>{fv.fieldProps("lastName").error}</div>}
            </div>
          </div>

          <div>
            <label style={S.lbl}>Email</label>
            <input type="email" style={S.inp} placeholder="Enter Email" value={form.email} onChange={set("email")} onBlur={fv.fieldProps("email").onBlur} />
            {fv.fieldProps("email").error && <div style={S.err}>{fv.fieldProps("email").error}</div>}
          </div>

          <div>
            <label style={S.lbl}>Mobile Number <span style={S.req}>*</span></label>
            <input
              type="tel" maxLength={10}
              readOnly={otpSent}
              style={{ ...S.inp, ...(otpSent ? { background: "#f1f5f9" } : {}) }}
              placeholder="Enter Mobile Number"
              value={form.mobile}
              onChange={e => setForm(p => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
              onBlur={fv.fieldProps("mobile").onBlur}
            />
            {fv.fieldProps("mobile").error && <div style={S.err}>{fv.fieldProps("mobile").error}</div>}

            {otpSent && !mobileVerified && (
              <div style={{ marginTop: 12 }}>
                <OtpInput value={otp} onChange={setOtp} />
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>
                  OTP sent to +91-{form.mobile} ·{" "}
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0, fontFamily: "inherit" }}
                  >
                    Change number
                  </button>
                </div>
              </div>
            )}
            {mobileVerified && (
              <div style={S.verifiedBadge}>✓ Mobile number verified</div>
            )}
          </div>

          {mobileVerified && (
            <>
              <div>
                <label style={S.lbl}>Organisation</label>
                <select
                  style={S.select}
                  value={form.organisationId}
                  onChange={e => setForm(p => ({ ...p, organisationId: e.target.value, associationId: "" }))}
                >
                  <option value="">Select organisation</option>
                  {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Association</label>
                <select
                  style={S.select}
                  value={form.associationId}
                  onChange={set("associationId")}
                  disabled={!form.organisationId}
                >
                  <option value="">{form.organisationId ? "Select association" : "Select organisation first"}</option>
                  {ASSOCIATIONS.filter(a => a.orgId === Number(form.organisationId)).map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {!mobileVerified && (
            <button
              type="button"
              style={{ ...S.otpBtn, opacity: form.mobile.length < 10 ? 0.5 : 1 }}
              disabled={form.mobile.length < 10}
              onClick={handleGetOtp}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          )}

          <button
            type="submit"
            style={{ ...S.btn, opacity: (loading || !mobileVerified) ? 0.55 : 1 }}
            disabled={loading || !mobileVerified}
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p style={S.regLink}>
          Already have an account? <Link to="/login" style={S.regLinkA}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #3b74f0 0%, #1e40af 55%, #0b1b42 100%)",
    padding: "24px 16px", position: "relative", overflow: "hidden",
  },
  gridOverlay: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: HEX_BG,
    backgroundSize: "36px 62px",
  },
  card: {
    width: 440, maxWidth: "100%", padding: "40px 36px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    borderRadius: 20, boxShadow: "0 30px 70px rgba(8,20,55,0.45)",
    display: "flex", flexDirection: "column",
    position: "relative", zIndex: 1,
    maxHeight: "92vh", overflowY: "auto",
  },
  brand: { display: "flex", alignItems: "center", gap: 12, marginBottom: 26 },
  logoImg: { width: 42, height: 42, flexShrink: 0, borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  brandName: { fontSize: 17, fontWeight: 700, color: "#0f172a" },
  title: { fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" },
  sub: { fontSize: 13.5, color: "#475569", margin: "0 0 22px" },
  lbl: { display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6, letterSpacing: ".1px" },
  req: { color: "#dc2626" },
  inp: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #dbe4f3",
    borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#0f172a", background: "#f8fafc", boxSizing: "border-box",
    transition: "border-color .15s",
  },
  select: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #dbe4f3",
    borderRadius: 10, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#0f172a", background: "#f8fafc", boxSizing: "border-box",
    cursor: "pointer",
  },
  verifiedBadge: {
    marginTop: 8, background: "#d1fae5", border: "1px solid #6ee7b7", color: "#065f46",
    borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 500,
  },
  err: { fontSize: 12, color: "#dc2626", marginTop: 5 },
  otpBtn: {
    background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 10,
    padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", letterSpacing: 0.2,
    boxShadow: "0 6px 18px rgba(29,78,216,0.35)",
  },
  btn: {
    background: "#1d4ed8", color: "#fff", border: "none", borderRadius: 10,
    padding: "13px", fontSize: 14.5, fontWeight: 700, cursor: "pointer",
    fontFamily: "inherit", transition: "opacity .15s", letterSpacing: 0.2,
    boxShadow: "0 6px 18px rgba(29,78,216,0.35)",
  },
  regLink: { fontSize: 13, color: "#334155", marginTop: 22, textAlign: "center" },
  regLinkA: { color: "#1d4ed8", fontWeight: 700, textDecoration: "none" },
};
