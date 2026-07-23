import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  Select,
  Textarea,
  SectionBlock,
} from "../../components/Field";
import {
  PageHeader,
  FormActions,
  Toggle,
  CheckboxGroup,
} from "../../components/UI";
import { Tabs } from "../../components/ui/Tabs";
import { CampaignIcon, SearchIcon } from "../../icons";
import { PRODUCTS, POLICY_TYPE_ICON, PREMIUM_CHART, PRODUCT_DETAILS } from "../product/productData";
import { ASSOCIATIONS } from "../member/orgAssocData";
import policyWordingsPdf from "../../assets/StarHealthAssureInsurancePolicy-Policy-wording.pdf";
import brochurePdf from "../../assets/Brochure_Star_Comprehensive_Insurance_Policy_V_15_Web_633bcfcaaf.pdf";

const TYPE_COLORS = {
  "Base Policy":        "#1d4ed8",
  "OPD":                "#15803d",
  "Payment Protection": "#b45309",
  "Age Band Premium":   "#7c3aed",
  "Super Top Up":       "#f57c82",
  "Top Up Policy":      "#4f46e5",
};

const PTYPE_META = {
  "Base Policy": { color: "#2563eb", bg: "#dbeafe", border: "#bfdbfe" },
  "Top Up Policy": { color: "#0891b2", bg: "#e0f2fe", border: "#7dd3fc" },
  "Super Top Up": { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  OPD: { color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  "Age Band Premium": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  "Payment Protection": { color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  Other: { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" },
};

const fmtSI = v => v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;

function getChartData(id) {
  const rows   = PREMIUM_CHART[id] ?? [];
  const sis    = [...new Set(rows.map(r => r.sumInsured))];
  const allP   = rows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean));
  const minP   = allP.length > 0 ? Math.min(...allP) : null;
  const covKeys = ['selfOnly', 'selfSpouse', 'selfSpouse2Children'].filter(k => rows[0]?.[k] != null);
  return { sis, minP, covKeys };
}

function applyDiscount(premium, offerType, offerValue) {
  if (!offerValue || !premium) return null;
  const v = Number(offerValue);
  if (!v) return null;
  return offerType === 'Percent' ? Math.round(premium * (1 - v / 100)) : Math.max(0, premium - v);
}

const LINKED_TYPES = {
  'Base Policy':        ['Super Top Up', 'Top Up Policy', 'OPD', 'Payment Protection'],
  'Super Top Up':       ['Base Policy', 'Age Band Premium'],
  'Top Up Policy':      ['Base Policy', 'Age Band Premium'],
  'OPD':                ['Base Policy', 'Age Band Premium'],
  'Payment Protection': ['Base Policy', 'Age Band Premium'],
  'Age Band Premium':   ['Super Top Up', 'Top Up Policy', 'OPD', 'Payment Protection'],
};

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
];

const MOCK_USERS = [
  {
    id: 1,
    name: "Aarav Sharma",
    age: 34,
    gender: "Male",
    marital: "Married",
    segment: "Active Policyholders",
    type: "Member",
    state: "Maharashtra",
  },
  {
    id: 2,
    name: "Priya Mehta",
    age: 28,
    gender: "Female",
    marital: "Single",
    segment: "New Registrations",
    type: "Member",
    state: "Gujarat",
  },
  {
    id: 3,
    name: "Rohan Verma",
    age: 52,
    gender: "Male",
    marital: "Married",
    segment: "Renewal Due (30 days)",
    type: "Member",
    state: "Delhi",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    age: 41,
    gender: "Female",
    marital: "Divorced",
    segment: "High Value Members",
    type: "Member",
    state: "Karnataka",
  },
  {
    id: 5,
    name: "Karan Patel",
    age: 23,
    gender: "Male",
    marital: "Single",
    segment: "New Registrations",
    type: "Member",
    state: "Gujarat",
  },
  {
    id: 6,
    name: "Divya Nair",
    age: 37,
    gender: "Female",
    marital: "Married",
    segment: "Active Policyholders",
    type: "Member",
    state: "Kerala",
  },
  {
    id: 7,
    name: "Arjun Singh",
    age: 60,
    gender: "Male",
    marital: "Widowed",
    segment: "Renewal Due (30 days)",
    type: "Member",
    state: "Punjab",
  },
  {
    id: 8,
    name: "Meera Joshi",
    age: 45,
    gender: "Female",
    marital: "Married",
    segment: "Lapsed Members",
    type: "Member",
    state: "Rajasthan",
  },
  {
    id: 9,
    name: "Vikram Rao",
    age: 31,
    gender: "Male",
    marital: "Single",
    segment: "Active Policyholders",
    type: "Member",
    state: "Telangana",
  },
  {
    id: 10,
    name: "Anjali Desai",
    age: 29,
    gender: "Female",
    marital: "Married",
    segment: "New Registrations",
    type: "Member",
    state: "Maharashtra",
  },
  {
    id: 11,
    name: "Rahul Gupta",
    age: 48,
    gender: "Male",
    marital: "Married",
    segment: "High Value Members",
    type: "Member",
    state: "Uttar Pradesh",
  },
  {
    id: 12,
    name: "Pooja Reddy",
    age: 33,
    gender: "Female",
    marital: "Single",
    segment: "Active Policyholders",
    type: "Member",
    state: "Telangana",
  },
  {
    id: 13,
    name: "Suresh Kumar",
    age: 55,
    gender: "Male",
    marital: "Married",
    segment: "Renewal Due (30 days)",
    type: "Member",
    state: "Tamil Nadu",
  },
  {
    id: 14,
    name: "Kavita Pillai",
    age: 26,
    gender: "Female",
    marital: "Single",
    segment: "New Registrations",
    type: "Member",
    state: "Kerala",
  },
  {
    id: 15,
    name: "Nikhil Bansal",
    age: 39,
    gender: "Male",
    marital: "Divorced",
    segment: "Lapsed Members",
    type: "Member",
    state: "Delhi",
  },
  {
    id: 16,
    name: "Swati Tiwari",
    age: 44,
    gender: "Female",
    marital: "Married",
    segment: "Active Policyholders",
    type: "Member",
    state: "Madhya Pradesh",
  },
  {
    id: 17,
    name: "Amit Saxena",
    age: 57,
    gender: "Male",
    marital: "Married",
    segment: "High Value Members",
    type: "Member",
    state: "Uttar Pradesh",
  },
  {
    id: 18,
    name: "Ritu Bhatia",
    age: 22,
    gender: "Female",
    marital: "Single",
    segment: "New Registrations",
    type: "Member",
    state: "Haryana",
  },
  {
    id: 19,
    name: "Deepak Mishra",
    age: 36,
    gender: "Male",
    marital: "Married",
    segment: "Active Policyholders",
    type: "Member",
    state: "Bihar",
  },
  {
    id: 20,
    name: "Nisha Chauhan",
    age: 50,
    gender: "Female",
    marital: "Widowed",
    segment: "Lapsed Members",
    type: "Member",
    state: "Rajasthan",
  },
  {
    id: 21,
    name: "Rajesh Agarwal",
    age: 43,
    gender: "Male",
    marital: "Married",
    segment: "Renewal Due (30 days)",
    type: "Employee",
    state: "Maharashtra",
  },
  {
    id: 22,
    name: "Sunita Yadav",
    age: 30,
    gender: "Female",
    marital: "Single",
    segment: "Active Policyholders",
    type: "Employee",
    state: "Uttar Pradesh",
  },
  {
    id: 23,
    name: "Manoj Tomar",
    age: 47,
    gender: "Male",
    marital: "Married",
    segment: "High Value Members",
    type: "Employee",
    state: "Delhi",
  },
  {
    id: 24,
    name: "Geeta Rawat",
    age: 35,
    gender: "Female",
    marital: "Divorced",
    segment: "Active Policyholders",
    type: "Employee",
    state: "Uttarakhand",
  },
  {
    id: 25,
    name: "Sanjay Kapoor",
    age: 53,
    gender: "Male",
    marital: "Married",
    segment: "Renewal Due (30 days)",
    type: "Employee",
    state: "Punjab",
  },
  {
    id: 26,
    name: "Lakshmi Menon",
    age: 27,
    gender: "Female",
    marital: "Single",
    segment: "New Registrations",
    type: "Employee",
    state: "Tamil Nadu",
  },
  {
    id: 27,
    name: "Vivek Pandey",
    age: 40,
    gender: "Male",
    marital: "Married",
    segment: "Lapsed Members",
    type: "Employee",
    state: "Madhya Pradesh",
  },
  {
    id: 28,
    name: "Anita Soni",
    age: 32,
    gender: "Female",
    marital: "Married",
    segment: "Active Policyholders",
    type: "Employee",
    state: "Gujarat",
  },
  {
    id: 29,
    name: "Harish Dubey",
    age: 58,
    gender: "Male",
    marital: "Widowed",
    segment: "High Value Members",
    type: "Employee",
    state: "Karnataka",
  },
  {
    id: 30,
    name: "Rekha Malhotra",
    age: 24,
    gender: "Female",
    marital: "Single",
    segment: "New Registrations",
    type: "Employee",
    state: "West Bengal",
  },
];

const PAGE_SIZE = 10;

const POLICY_TYPES_LIST = [...new Set(PRODUCTS.map(p => p.policyType))];

function ProductDetailModal({ product, onClose }) {
  const details       = PRODUCT_DETAILS[product.id];
  const providerColor = TYPE_COLORS[product.policyType] ?? "#33b5e5";
  const linkedBase    = product.linkedBaseId ? PRODUCTS.find(p => p.id === product.linkedBaseId) : null;

  const sectionHead = (text) => (
    <div style={{ fontSize: 16, fontWeight: 700, color: "#24304a", marginBottom: 10, textAlign: "left" }}>
      {text}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 640,
        maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,.25)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header strip */}
        <div style={{ background: "#f5f7f9", padding: "16px 16px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: providerColor,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {product.provider}
            </span>
            <button type="button" onClick={onClose}
              style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #cbd5e1",
                background: "#fff", cursor: "pointer", color: "#6d747a", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              ×
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6, paddingBottom: 12 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6d747a" }}>{product.policyType}</span>
            <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8" }}>· {product.code}</span>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Name + tagline */}
          <div>
            <div style={{ fontWeight: 600, fontSize: 18, color: "#24304a", letterSpacing: "-.18px" }}>{product.name}</div>
            {details?.tagline && (
              <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--text-2)", marginTop: 4, lineHeight: 1.5 }}>
                "{details.tagline}"
              </div>
            )}
          </div>

          {/* ── Bundle offer banner ── */}
          {linkedBase && product.bundleDiscount && (
            <div style={{ background: "linear-gradient(135deg,#eff6ff 0%,#f0fdf4 100%)",
              border: "1.5px solid #bfdbfe", borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>🏷️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1565d8", marginBottom: 3 }}>
                  Bundle Offer — {product.bundleDiscount.type === "Percent"
                    ? `${product.bundleDiscount.value}% off`
                    : `₹${product.bundleDiscount.value} off`}
                </div>
                <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>
                  Add <strong>{linkedBase.name}</strong> ({linkedBase.code} · {linkedBase.provider}) to the same campaign alongside this product to unlock the bundle discount on the top-up premium.
                </div>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center", minWidth: 54 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#15803d", lineHeight: 1 }}>
                  {product.bundleDiscount.type === "Percent"
                    ? `${product.bundleDiscount.value}%`
                    : `₹${product.bundleDiscount.value}`}
                </div>
                <div style={{ fontSize: 10.5, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".4px", marginTop: 2 }}>
                  {product.bundleDiscount.type === "Percent" ? "discount" : "flat off"}
                </div>
              </div>
            </div>
          )}

          {/* Highlight chips */}
          {details?.highlights && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {details.highlights.map(h => (
                <div key={h.label} style={{ background: "#f5f7f9", border: "1px solid #dee1e5", borderRadius: 8, padding: "6px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 1 }}>{h.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#24304a" }}>{h.icon} {h.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Jump nav */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", rowGap: 8, columnGap: 10, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
            {[
              ["#d-about", "About this Policy"],
              ["#d-who-should-buy", "Who Should Buy"],
              ["#d-key-benefits", "Key Benefits"],
              ["#d-eligibility-criteria", "Eligibility Criteria"],
              ["#d-waiting-periods", "Waiting Periods"],
              ["#d-copayment", "Copayment"],
              ["#d-maternity-benefits", "Maternity Benefit(s)"],
              ["#d-covered", "What's Covered"],
              ["#d-not-covered", "What's Not Covered"],
              ["#d-policy-documents", "Policy Documents"],
            ].map(([href, label], i) => (
              <div key={href} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {i > 0 && <span style={{ color: "var(--border)" }}>|</span>}
                <a href={href} style={{ fontSize: 13, fontWeight: 600, color: "#3b5bfd", textDecoration: "none" }}>{label}</a>
              </div>
            ))}
          </div>

          {details ? (<>
            <div id="d-about">
              {sectionHead("About this Policy")}
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.description}</p>
            </div>

            {details.target?.length > 0 && (
              <div id="d-who-should-buy">
                {sectionHead("Who Should Buy")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.target.join(', ')}</p>
              </div>
            )}

            {details.benefits?.length > 0 && (
              <div id="d-key-benefits">
                {sectionHead("Key Benefits")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.benefits.join(', ')}</p>
              </div>
            )}

            {details.eligibilityCriteria && (
              <div id="d-eligibility-criteria">
                {sectionHead("Eligibility Criteria")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.eligibilityCriteria}</p>
              </div>
            )}

            {details.waitingPeriods && (
              <div id="d-waiting-periods">
                {sectionHead("Waiting Periods")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.waitingPeriods}</p>
              </div>
            )}

            {details.copayment && (
              <div id="d-copayment">
                {sectionHead("Copayment")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.copayment}</p>
              </div>
            )}

            {details.maternityBenefits && (
              <div id="d-maternity-benefits">
                {sectionHead("Maternity Benefit(s)")}
                <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.maternityBenefits}</p>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {details.covered?.length > 0 && (
                <div id="d-covered" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                  {sectionHead("What's Covered")}
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.covered.join(', ')}</p>
                </div>
              )}
              {details.notCovered?.length > 0 && (
                <div id="d-not-covered" style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                  {sectionHead("What's Not Covered")}
                  <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.notCovered.join(', ')}</p>
                </div>
              )}
            </div>
          </>) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["Code", product.code], ["Policy Type", product.policyType], ["Provider", product.provider], ["Status", "Active"]].map(([k, v]) => (
                <div key={k} style={{ background: "var(--surface-2,#f8fafc)", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: k === "Code" ? "monospace" : "inherit" }}>{v}</div>
                </div>
              ))}
            </div>
          )}

          {/* Policy Documents */}
          <div id="d-policy-documents">
            {sectionHead("Policy Documents")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Policy Wordings", href: policyWordingsPdf, filename: `${product.code}_Policy_Wordings.pdf` },
                { label: "Brochure", href: brochurePdf, filename: `${product.code}_Brochure.pdf` },
              ].map(doc => (
                <a
                  key={doc.label}
                  href={doc.href}
                  download={doc.filename}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", textDecoration: "none",
                    border: "1px solid var(--border)", borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#24304a" }}>{doc.label}</span>
                  <span style={{
                    width: 36, height: 36, borderRadius: "50%", background: "#dcfce7",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" />
                      <path d="M6 11l6 6 6-6" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {product.disclaimer && (
            <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#78350f", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠ Declaration</div>
              {product.disclaimer}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", background: "#fff",
          flexShrink: 0, display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost"
            style={{ height: 44, fontSize: 14, fontWeight: 600, minWidth: 110, justifyContent: "center" }}
            onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductPickerModal({ selected, onToggle, onClose, offerType, offerValue }) {
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = PRODUCTS.filter(p => {
    if (typeFilter && p.policyType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const hasFilter = search || typeFilter;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-card,#fff)", borderRadius: 14, width: "min(900px,100%)",
        maxHeight: "88vh", display: "flex", flexDirection: "column",
        boxShadow: "0 24px 60px rgba(0,0,0,.22)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: "var(--text-1)" }}>Select Products</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
              {selected.length > 0
                ? <span style={{ color: "var(--brand)", fontWeight: 600 }}>{selected.length} product{selected.length !== 1 ? "s" : ""} selected</span>
                : "Choose products to promote in this campaign"}
            </div>
          </div>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24,
              color: "var(--text-3)", lineHeight: 1, padding: "2px 6px", borderRadius: 6 }}>
            ×
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", gap: 10, alignItems: "center", flexShrink: 0, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              display: "flex", pointerEvents: "none" }}>
              <SearchIcon size={14} color="var(--text-3)" />
            </span>
            <input
              className="field-input"
              placeholder="Search by name, provider or code…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 32, width: "100%" }}
              autoFocus
            />
          </div>
          <select className="field-select" style={{ width: 180 }} value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Policy Types</option>
            {POLICY_TYPES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {hasFilter && (
            <button type="button" className="btn btn-ghost" style={{ fontSize: 13, whiteSpace: "nowrap" }}
              onClick={() => { setSearch(""); setTypeFilter(""); }}>
              Clear
            </button>
          )}
          {hasFilter && (
            <span style={{ fontSize: 13, color: "var(--text-3)", whiteSpace: "nowrap" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-3)", fontSize: 14 }}>
              No products match your filters.
            </div>
          ) : (
            <div className="table-wrap" style={{ margin: 0, borderRadius: 0, border: "none" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Product Name</th>
                    <th>Provider</th>
                    <th>Policy Type</th>
                    <th>Code</th>
                    <th style={{ textAlign: "right" }}>Premium Starts</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const added = selected.includes(p.id);
                    const color = TYPE_COLORS[p.policyType] ?? "#33b5e5";
                    const icon  = POLICY_TYPE_ICON[p.policyType] ?? "📋";
                    const { minP } = getChartData(p.id);
                    const discountedP = applyDiscount(minP, offerType, offerValue);
                    const pairedNames = selected
                      .filter(sid => sid !== p.id)
                      .map(sid => PRODUCTS.find(x => x.id === sid))
                      .filter(Boolean)
                      .filter(op => LINKED_TYPES[p.policyType]?.includes(op.policyType))
                      .map(op => op.name.length > 24 ? op.name.slice(0, 22) + "…" : op.name);
                    return (
                      <tr key={p.id} style={{ background: added ? "var(--brand-light,#eff6ff)" : undefined }}>
                        <td style={{ color: "var(--text-3)", fontWeight: 500 }}>{i + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-1)" }}>{p.name}</div>
                          {pairedNames.length > 0 && (
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
                              {pairedNames.map(n => (
                                <span key={n} style={{ fontSize: 10.5, fontWeight: 600, background: "#eff6ff",
                                  color: "#1565d8", border: "1px solid #bfdbfe", borderRadius: 99, padding: "1px 7px" }}>
                                  🔗 {n}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: 13, color: "var(--text-2)" }}>{p.provider}</td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                            background: `${color}18`, color, border: `1.5px solid ${color}40` }}>
                            <span>{icon}</span> {p.policyType}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: 11.5, color: "var(--text-3)",
                            background: "var(--bg-subtle,#f8fafc)", border: "1px solid var(--border)",
                            borderRadius: 4, padding: "2px 7px" }}>
                            {p.code}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          {minP ? (
                            discountedP != null ? (
                              <div style={{ lineHeight: 1.5 }}>
                                <span style={{ fontSize: 11.5, color: "#94a3b8", textDecoration: "line-through", display: "block" }}>
                                  ₹{minP.toLocaleString("en-IN")}/yr
                                </span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>
                                  ₹{discountedP.toLocaleString("en-IN")}/yr
                                </span>
                                {" "}
                                <span style={{ fontSize: 10, fontWeight: 600, background: "#dcfce7",
                                  color: "#15803d", borderRadius: 99, padding: "1px 6px" }}>
                                  {offerType === "Percent" ? `${offerValue}% off` : `₹${offerValue} off`}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>
                                ₹{minP.toLocaleString("en-IN")}/yr
                              </span>
                            )
                          ) : <span style={{ color: "var(--text-3)" }}>—</span>}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => onToggle(p.id)}
                            style={{
                              fontSize: 12, padding: "5px 16px", borderRadius: 7,
                              border: "none", cursor: "pointer", fontWeight: 600,
                              fontFamily: "inherit", whiteSpace: "nowrap",
                              background: added ? "#dcfce7" : "linear-gradient(180deg,#1565d8,#104ea6)",
                              color: added ? "#15803d" : "#fff",
                              boxShadow: added ? "none" : "0 2px 6px rgba(21,101,216,.25)",
                            }}
                          >
                            {added ? "✓ Added" : "+ Add"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>
            {selected.length} product{selected.length !== 1 ? "s" : ""} selected for this campaign
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const OPERATORS = [
  {
    id: 1,
    name: "Ravi Kulkarni",
    posLicense: "POS-2023-001",
    broker: "K.M. Dastur & Co.",
    agentType: "sales",
  },
  {
    id: 2,
    name: "Pooja Desai",
    posLicense: "POS-2023-019",
    broker: "K.M. Dastur & Co.",
    agentType: "calling",
  },
  {
    id: 4,
    name: "Kavita Sharma",
    posLicense: "POS-2023-045",
    broker: "Shah Financial",
    agentType: "calling",
  },
  {
    id: 5,
    name: "Amit Verma",
    posLicense: "POS-2023-067",
    broker: "K.M. Dastur & Co.",
    agentType: "sales",
  },
  {
    id: 6,
    name: "Sneha Patil",
    posLicense: "POS-2022-133",
    broker: "Nair & Co.",
    agentType: "calling",
  },
  {
    id: 8,
    name: "Priya Menon",
    posLicense: "POS-2023-088",
    broker: "Shah Financial",
    agentType: "sales",
  },
  {
    id: 9,
    name: "Kiran Reddy",
    posLicense: "POS-2023-099",
    broker: "Rao & Partners",
    agentType: "calling",
  },
  {
    id: 10,
    name: "Neha Gupta",
    posLicense: "POS-2022-155",
    broker: "Priya Brokers",
    agentType: "sales",
  },
  {
    id: 11,
    name: "Ajay Tiwari",
    posLicense: "POS-2023-120",
    broker: "K.M. Dastur & Co.",
    agentType: "calling",
  },
];

const CALLING_AGENTS = OPERATORS.filter((a) => a.agentType === "calling");
const SALES_AGENTS = OPERATORS.filter((a) => a.agentType === "sales");

const INITIAL = {
  name: "",
  policyType: "",
  startDate: "",
  endDate: "",
  targetType: "Member",
  segment: "",
  ageMin: "",
  ageMax: "",
  gender: "",
  maritalStatus: "",
  state: "",
  selectedProducts: [],
  selectedAssociations: [],
  discountRules: "",
  offerType: "Flat",
  offerValue: "",
  channels: [],
  messageTemplate: "",
  whatsappTemplateId: "",
  clickTracking: false,
  conversionTracking: false,
  // Health config
  hSumInsuredMin: "",
  hSumInsuredMax: "",
  hWaitingPeriod: "30",
  hPreExistingWaiting: "24",
  hRoomRent: "",
  hDayCare: false,
  hRestoration: false,
  hAyush: false,
  // Motor config
  mVehicleType: "",
  mIdvMin: "",
  mIdvMax: "",
  mZeroDepreciation: false,
  mEngineProtection: false,
  mNcbPct: "",
  // Life config
  lPolicyTerm: "",
  lPaymentTerm: "",
  lDeathBenefitType: "",
  lLoan: false,
  lReturnOfPremium: false,
  // Financial
  premiumMin: "",
  premiumMax: "",
  commissionPct: "",
  targetPremiumVolume: "",
  gstRate: "18",
};

const toInputDate = (v) => {
  if (!v) return "";
  const [dd, mm, yyyy] = v.split("/");
  return `${yyyy}-${mm}-${dd}`;
};
const fromInputDate = (v) => {
  if (!v) return "";
  const [yyyy, mm, dd] = v.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [audienceTab, setAudienceTab] = useState("filter");
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setDate = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: fromInputDate(e.target.value) }));
  const setBool = (f) => (val) => setForm((p) => ({ ...p, [f]: val }));

  const [showProductPicker, setShowProductPicker] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  const [assocSearch, setAssocSearch] = useState("");
  const [assocOpen, setAssocOpen] = useState(false);

  const filteredAssoc = ASSOCIATIONS.filter((a) =>
    a.name.toLowerCase().includes(assocSearch.toLowerCase()),
  );

  const toggleAssoc = (id) =>
    setForm((prev) => ({
      ...prev,
      selectedAssociations: prev.selectedAssociations.includes(id)
        ? prev.selectedAssociations.filter((x) => x !== id)
        : [...prev.selectedAssociations, id],
    }));

  const [assignedCalling, setAssignedCalling] = useState(new Set());
  const [callingSearch, setCallingSearch] = useState("");
  const [callingOpen, setCallingOpen] = useState(false);

  const [assignedSales, setAssignedSales] = useState(new Set());
  const [salesSearch, setSalesSearch] = useState("");
  const [salesOpen, setSalesOpen] = useState(false);

  const filteredCalling = CALLING_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(callingSearch.toLowerCase()) ||
      a.broker.toLowerCase().includes(callingSearch.toLowerCase()) ||
      a.posLicense.toLowerCase().includes(callingSearch.toLowerCase()),
  );

  const filteredSales = SALES_AGENTS.filter(
    (a) =>
      a.name.toLowerCase().includes(salesSearch.toLowerCase()) ||
      a.broker.toLowerCase().includes(salesSearch.toLowerCase()) ||
      a.posLicense.toLowerCase().includes(salesSearch.toLowerCase()),
  );

  const toggleCalling = (id) =>
    setAssignedCalling((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleSales = (id) =>
    setAssignedSales((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [tableVisible, setTableVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const handleFilterUsers = () => {
    const min = form.ageMin ? Number(form.ageMin) : 0;
    const max = form.ageMax ? Number(form.ageMax) : 999;
    const results = MOCK_USERS.filter((u) => {
      if (u.type !== form.targetType) return false;
      if (form.segment && u.segment !== form.segment) return false;
      if (u.age < min || u.age > max) return false;
      if (form.gender && u.gender !== form.gender) return false;
      if (form.maritalStatus && u.marital !== form.maritalStatus) return false;
      if (form.state && u.state !== form.state) return false;
      if (form.selectedAssociations.length > 0) {
        const userAssocId = ASSOCIATIONS[(u.id - 1) % ASSOCIATIONS.length].id;
        if (!form.selectedAssociations.includes(userAssocId)) return false;
      }
      return true;
    });
    setFilteredUsers(results);
    setUserPage(1);
    setTableVisible(true);
    setSelectedUserIds(new Set());
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice(
    (userPage - 1) * PAGE_SIZE,
    userPage * PAGE_SIZE,
  );

  const allPageSelected =
    pagedUsers.length > 0 && pagedUsers.every((u) => selectedUserIds.has(u.id));
  const somePageSelected =
    pagedUsers.some((u) => selectedUserIds.has(u.id)) && !allPageSelected;

  const toggleUser = (id) =>
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const togglePageAll = () => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pagedUsers.forEach((u) => next.delete(u.id));
      else pagedUsers.forEach((u) => next.add(u.id));
      return next;
    });
  };

  const toggleProduct = (id) =>
    setForm((prev) => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(id)
        ? prev.selectedProducts.filter((x) => x !== id)
        : [...prev.selectedProducts, id],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create Campaign:", form);
    navigate("/campaign");
  };

  return (
    <div>
      <PageHeader
        icon={<CampaignIcon />}
        title="Add Campaign"
        subtitle="Set up a new marketing campaign"
      >
        <button className="btn btn-ghost" onClick={() => navigate("/campaign")}>
          ← Back
        </button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* ── 1. Campaign Info ──────────────────────── */}
            <SectionBlock icon="📢" title="Campaign Information">
              <div className="form-grid-3">
                <Field label="Campaign Name" required>
                  <Input
                    placeholder="e.g. Summer Health Drive 2025"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </Field>
                <Field label="Start Date" required>
                  <Input
                    type="date"
                    value={toInputDate(form.startDate)}
                    onChange={setDate("startDate")}
                    required
                  />
                </Field>
                <Field label="End Date" required>
                  <Input
                    type="date"
                    value={toInputDate(form.endDate)}
                    onChange={setDate("endDate")}
                    required
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* ── 2. Product Mapping ────────────────────── */}
            <SectionBlock icon="📦" title="Product Mapping">
              {/* ── Selected product cards (BuyPolicy style) ── */}
              {form.selectedProducts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>
                      {form.selectedProducts.length} product{form.selectedProducts.length !== 1 ? "s" : ""} added
                    </span>
                    <button type="button" className="btn btn-primary"
                      style={{ fontSize: 13 }} onClick={() => setShowProductPicker(true)}>
                      + Add More Products
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                    {form.selectedProducts.map(id => {
                      const p = PRODUCTS.find(x => x.id === id);
                      if (!p) return null;
                      const providerColor = TYPE_COLORS[p.policyType] ?? "#33b5e5";
                      const { sis, minP, covKeys } = getChartData(p.id);
                      const discountedMinP = applyDiscount(minP, form.offerType, form.offerValue);
                      const linkedNames = form.selectedProducts
                        .filter(sid => sid !== id)
                        .map(sid => PRODUCTS.find(x => x.id === sid))
                        .filter(Boolean)
                        .filter(op => LINKED_TYPES[p.policyType]?.includes(op.policyType))
                        .map(op => op.name.length > 28 ? op.name.slice(0, 26) + "…" : op.name);
                      return (
                        <div key={id} style={{
                          borderRadius: 6, overflow: "hidden", background: "#fff",
                          border: "2px solid #1565d8",
                          boxShadow: "0 1px 11px rgba(63,151,233,.26)",
                          transition: "all .15s",
                          display: "flex", flexDirection: "column",
                        }}>
                          {/* Header strip — exact BuyPolicy style */}
                          <div style={{ background: "#f5f7f9", padding: "16px 16px 0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: providerColor,
                                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {p.provider}
                              </span>
                              {/* × remove button in place of BuyPolicy's checkbox */}
                              <div onClick={() => toggleProduct(id)}
                                style={{
                                  width: 24, height: 24, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  background: "#1565d8", border: "1.5px solid #1565d8",
                                }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6, paddingBottom: 12 }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6d747a" }}>{p.policyType}</span>
                              <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8" }}>· {p.code}</span>
                            </div>
                          </div>

                          {/* Body — exact BuyPolicy style */}
                          <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Product name */}
                            <div style={{ fontWeight: 600, fontSize: 18, color: "#24304a", letterSpacing: "-.18px" }}>
                              {p.name}
                            </div>

                            {/* Metrics */}
                            <div style={{ display: "flex", gap: 24 }}>
                              {sis.length > 0 && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00c851" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px" }}>Sum Insured</span>
                                  </div>
                                  <div style={{ fontSize: 18, fontWeight: 600, color: "#24304a", letterSpacing: "-.18px" }}>
                                    {fmtSI(Math.min(...sis))}{sis.length > 1 && ` – ${fmtSI(Math.max(...sis))}`}
                                  </div>
                                </div>
                              )}
                              {minP && (
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1 .9-1.5 2-1.5s2.5.5 2.5 1.7c0 1.9-4.5 1.2-4.5 3.4 0 1.2 1.4 1.9 2.5 1.9s2-.6 2-1.6" /></svg>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px" }}>Premium starts</span>
                                  </div>
                                  {discountedMinP != null ? (
                                    <div>
                                      <span style={{ fontSize: 13, color: "#94a3b8", textDecoration: "line-through" }}>
                                        ₹ {minP.toLocaleString("en-IN")} /yr
                                      </span>
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                                        <span style={{ fontSize: 18, fontWeight: 600, color: "#15803d", letterSpacing: "-.18px" }}>
                                          ₹ {discountedMinP.toLocaleString("en-IN")}
                                        </span>
                                        <span style={{ fontSize: 14, color: "#6d747a" }}>/yr</span>
                                        <span style={{ fontSize: 10.5, fontWeight: 700, background: "#dcfce7",
                                          color: "#15803d", border: "1px solid #86efac", borderRadius: 99, padding: "2px 8px" }}>
                                          {form.offerType === "Percent" ? `${form.offerValue}% off` : `₹${form.offerValue} off`}
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                      <span style={{ fontSize: 18, fontWeight: 600, color: "#24304a", letterSpacing: "-.18px" }}>₹ {minP.toLocaleString("en-IN")}</span>
                                      <span style={{ fontSize: 14, color: "#6d747a" }}>/yr</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Coverage chips — exact BuyPolicy style */}
                            {covKeys.length > 0 && (
                              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {covKeys.includes("selfOnly") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self</span>}
                                {covKeys.includes("selfSpouse") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self + Spouse</span>}
                                {covKeys.includes("selfSpouse2Children") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Family</span>}
                              </div>
                            )}

                            {/* Footer row — View Info + bundle badge (left) | Remove (right) */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, marginTop: "auto" }}>
                              {/* Left side: View Info link + linked-product badges + bundle discount badge */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
                                <button type="button" onClick={() => setViewingProduct(p)}
                                  style={{ fontSize: 13, fontWeight: 700, color: "#1565d8", border: "none",
                                    background: "transparent", padding: 0, cursor: "pointer", fontFamily: "inherit",
                                    display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                                  View Info
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                                </button>
                                {p.bundleDiscount && (
                                  <span style={{ fontSize: 10.5, fontWeight: 700, background: "#f0fdf4",
                                    color: "#15803d", border: "1px solid #bbf7d0", borderRadius: 99, padding: "2px 8px", flexShrink: 0 }}>
                                    🏷️ {p.bundleDiscount.type === "Percent" ? `${p.bundleDiscount.value}% bundle` : `₹${p.bundleDiscount.value} off`}
                                  </span>
                                )}
                                {linkedNames.length > 0 && (
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 11, color: "#6d747a" }}>🔗</span>
                                    {linkedNames.map(n => (
                                      <span key={n} style={{ fontSize: 11, fontWeight: 600, background: "#eff6ff",
                                        color: "#1565d8", border: "1px solid #bfdbfe", borderRadius: 99, padding: "2px 8px" }}>
                                        {n}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button type="button" onClick={() => toggleProduct(id)}
                                style={{ fontSize: 13, fontWeight: 600, border: "none", color: "#ef4444",
                                  background: "transparent", padding: 0, cursor: "pointer", fontFamily: "inherit",
                                  display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                                Remove
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Empty state ── */}
              {form.selectedProducts.length === 0 && (
                <div style={{ textAlign: "center", padding: "36px 0", marginBottom: 16,
                  border: "1.5px dashed var(--border)", borderRadius: 10,
                  background: "var(--bg-subtle,#f8fafc)" }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📦</div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)", marginBottom: 4 }}>
                    No products added yet
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 18 }}>
                    Browse and add products to promote in this campaign
                  </div>
                  <button type="button" className="btn btn-primary"
                    onClick={() => setShowProductPicker(true)}>
                    + Add Product
                  </button>
                </div>
              )}
              <div className="form-grid-3" style={{ marginTop: 18 }}>
                <Field label="Discount">
                  <Select value={form.offerType} onChange={set("offerType")}>
                    <option value="Flat">Flat (₹)</option>
                    <option value="Percent">Percentage (%)</option>
                  </Select>
                </Field>
                <Field
                  label={`Discount Value ${form.offerType === "Flat" ? "(₹)" : "(%)"}`}
                >
                  <Input
                    type="number"
                    min="0"
                    placeholder={
                      form.offerType === "Flat" ? "e.g. 500" : "e.g. 10"
                    }
                    value={form.offerValue}
                    onChange={set("offerValue")}
                  />
                </Field>
                <Field label="Discount Rules" className="col-span-3">
                  <Textarea
                    placeholder="Describe applicable discount conditions…"
                    value={form.discountRules}
                    onChange={set("discountRules")}
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* ── 3. Audience ───────────────────────────── */}
            <SectionBlock icon="🎯" title="Audience">
              <Tabs
                tabs={[
                  { key: "filter", label: "Filter for User" },
                  { key: "upload", label: "Upload Member List" },
                ]}
                active={audienceTab}
                onChange={setAudienceTab}
              />
              {audienceTab === "filter" && (
                <div className="form-grid-3" style={{ marginTop: 16 }}>
                  <Field label="Target Type" required>
                    <Select
                      value={form.targetType}
                      onChange={set("targetType")}
                      required
                    >
                      <option>Member</option>
                      <option>Employee</option>
                    </Select>
                  </Field>
                  <Field label="Select Segment">
                    <Select value={form.segment} onChange={set("segment")}>
                      <option value="">All {form.targetType}s</option>
                      <option>Active Policyholders</option>
                      <option>Renewal Due (30 days)</option>
                      <option>Lapsed Members</option>
                      <option>New Registrations</option>
                      <option>High Value Members</option>
                      <option>Corporate</option>
                    </Select>
                  </Field>
                  <Field label="Age Range">
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="Min"
                        value={form.ageMin}
                        onChange={set("ageMin")}
                        style={{ width: "50%" }}
                      />
                      <span style={{ color: "var(--text-3)", flexShrink: 0 }}>
                        to
                      </span>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="Max"
                        value={form.ageMax}
                        onChange={set("ageMax")}
                        style={{ width: "50%" }}
                      />
                    </div>
                  </Field>
                  <Field label="Gender">
                    <Select value={form.gender} onChange={set("gender")}>
                      <option value="">All</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Marital Status">
                    <Select
                      value={form.maritalStatus}
                      onChange={set("maritalStatus")}
                    >
                      <option value="">All</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </Select>
                  </Field>
                  <Field label="State">
                    <Select value={form.state} onChange={set("state")}>
                      <option value="">All States</option>
                      {INDIA_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Association" className="col-span-3">
                    <div>
                      {form.selectedAssociations.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 6,
                            marginBottom: 8,
                          }}
                        >
                          {form.selectedAssociations.map((id) => {
                            const assoc = ASSOCIATIONS.find((a) => a.id === id);
                            return (
                              <span
                                key={id}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  background: "var(--brand-light)",
                                  color: "var(--brand)",
                                  border: "1px solid var(--brand-mid)",
                                  borderRadius: 20,
                                  padding: "3px 10px 3px 12px",
                                  fontSize: 13.5,
                                  fontWeight: 500,
                                }}
                              >
                                {assoc?.name ?? id}
                                <button
                                  type="button"
                                  onClick={() => toggleAssoc(id)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--brand)",
                                    fontSize: 14,
                                    lineHeight: 1,
                                    padding: 0,
                                  }}
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ position: "relative" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "1px solid var(--border)",
                            borderRadius: "var(--r-md)",
                            padding: "8px 12px",
                            background: "var(--surface)",
                            cursor: "text",
                          }}
                          onClick={() => setAssocOpen(true)}
                        >
                          <input
                            type="text"
                            placeholder={
                              form.selectedAssociations.length === 0
                                ? "All Associations"
                                : "Add more…"
                            }
                            value={assocSearch}
                            onChange={(e) => {
                              setAssocSearch(e.target.value);
                              setAssocOpen(true);
                            }}
                            onFocus={() => setAssocOpen(true)}
                            style={{
                              flex: 1,
                              border: "none",
                              outline: "none",
                              background: "transparent",
                              fontSize: 13,
                              fontFamily: "inherit",
                            }}
                          />
                          <span
                            style={{ fontSize: 13, color: "var(--text-3)" }}
                          >
                            {form.selectedAssociations.length > 0
                              ? `${form.selectedAssociations.length} selected`
                              : ""}
                          </span>
                          <span
                            style={{ color: "var(--text-3)", fontSize: 13 }}
                          >
                            {assocOpen ? "▲" : "▼"}
                          </span>
                        </div>
                        {assocOpen && (
                          <>
                            <div
                              style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 10,
                              }}
                              onClick={() => {
                                setAssocOpen(false);
                                setAssocSearch("");
                              }}
                            />
                            <div
                              style={{
                                position: "absolute",
                                top: "calc(100% + 4px)",
                                left: 0,
                                right: 0,
                                zIndex: 11,
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--r-md)",
                                boxShadow: "0 4px 16px rgba(0,0,0,.1)",
                                maxHeight: 200,
                                overflowY: "auto",
                              }}
                            >
                              {filteredAssoc.length === 0 ? (
                                <div
                                  style={{
                                    padding: "12px 16px",
                                    fontSize: 13,
                                    color: "var(--text-3)",
                                  }}
                                >
                                  No associations found.
                                </div>
                              ) : (
                                filteredAssoc.map((a) => (
                                  <label
                                    key={a.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      padding: "9px 16px",
                                      cursor: "pointer",
                                      fontSize: 13,
                                      background:
                                        form.selectedAssociations.includes(a.id)
                                          ? "var(--brand-light)"
                                          : "transparent",
                                      borderBottom: "1px solid var(--border)",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={form.selectedAssociations.includes(
                                        a.id,
                                      )}
                                      onChange={() => toggleAssoc(a.id)}
                                    />
                                    {a.name}
                                  </label>
                                ))
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Field>
                </div>
              )}

              {audienceTab === "filter" && (
                <div style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleFilterUsers}
                  >
                    Filter
                  </button>

                  {tableVisible && (
                    <div style={{ marginTop: 16 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                          {filteredUsers.length} user
                          {filteredUsers.length !== 1 ? "s" : ""} found
                        </span>
                        {selectedUserIds.size > 0 && (
                          <span
                            style={{
                              fontSize: 13,
                              color: "var(--brand-mid)",
                              fontWeight: 600,
                            }}
                          >
                            {selectedUserIds.size} selected
                          </span>
                        )}
                      </div>

                      {filteredUsers.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "32px 0",
                            color: "var(--text-3)",
                            fontSize: 14,
                          }}
                        >
                          No users match the selected filters.
                        </div>
                      ) : (
                        <>
                          <div className="table-wrap">
                            <table>
                              <thead>
                                <tr>
                                  <th style={{ width: 36 }}>
                                    <input
                                      type="checkbox"
                                      checked={allPageSelected}
                                      ref={(el) => {
                                        if (el)
                                          el.indeterminate = somePageSelected;
                                      }}
                                      onChange={togglePageAll}
                                    />
                                  </th>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Type</th>
                                  <th>Age</th>
                                  <th>Gender</th>
                                  <th>Marital Status</th>
                                  <th>State</th>
                                  <th>Segment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pagedUsers.map((u, i) => (
                                  <tr
                                    key={u.id}
                                    style={{
                                      background: selectedUserIds.has(u.id)
                                        ? "var(--brand-light)"
                                        : undefined,
                                      cursor: "pointer",
                                    }}
                                    onClick={() => toggleUser(u.id)}
                                  >
                                    <td onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        checked={selectedUserIds.has(u.id)}
                                        onChange={() => toggleUser(u.id)}
                                      />
                                    </td>
                                    <td>
                                      {(userPage - 1) * PAGE_SIZE + i + 1}
                                    </td>
                                    <td>{u.name}</td>
                                    <td>{u.type}</td>
                                    <td>{u.age}</td>
                                    <td>{u.gender}</td>
                                    <td>{u.marital}</td>
                                    <td>{u.state}</td>
                                    <td>{u.segment}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {totalPages > 1 && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 12,
                              }}
                            >
                              <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ padding: "4px 10px", fontSize: 13 }}
                                disabled={userPage === 1}
                                onClick={() => setUserPage((p) => p - 1)}
                              >
                                ← Prev
                              </button>
                              {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1,
                              ).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  className={`btn ${p === userPage ? "btn-primary" : "btn-ghost"}`}
                                  style={{
                                    padding: "4px 10px",
                                    fontSize: 13,
                                    minWidth: 32,
                                  }}
                                  onClick={() => setUserPage(p)}
                                >
                                  {p}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="btn btn-ghost"
                                style={{ padding: "4px 10px", fontSize: 13 }}
                                disabled={userPage === totalPages}
                                onClick={() => setUserPage((p) => p + 1)}
                              >
                                Next →
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
              {audienceTab === "upload" && (
                <div style={{ marginTop: 16 }}>
                  <label className="upload-box">
                    <input
                      type="file"
                      style={{ display: "none" }}
                      accept=".csv,.xlsx"
                    />
                    <div className="upload-icon">📋</div>
                    <div className="upload-label">Upload CSV / Excel list</div>
                    <div className="upload-hint">
                      Overrides segment if provided
                    </div>
                  </label>
                </div>
              )}
            </SectionBlock>

            {/* ── 4. Channels ──────────────────────────── */}
            <SectionBlock icon="📡" title="Communication Channels">
              <Field label="Active Channels">
                <div style={{ paddingTop: 6 }}>
                  <CheckboxGroup
                    options={[
                      "SMS",
                      "WhatsApp (Meta API)",
                      "Email",
                      "App Notification",
                    ]}
                    selected={form.channels}
                    onChange={(v) => setForm((p) => ({ ...p, channels: v }))}
                  />
                </div>
              </Field>
            </SectionBlock>

            {/* ── 5. Content ───────────────────────────── */}
            <SectionBlock icon="✍️" title="Message Content">
              <div className="form-grid-3">
                <Field
                  label="Message Template"
                  required={form.channels.length > 0}
                >
                  <Textarea
                    placeholder="Hi {member_name}, your health cover from {ic_name} is due for renewal…"
                    value={form.messageTemplate}
                    onChange={set("messageTemplate")}
                    style={{ minHeight: 100 }}
                  />
                </Field>
                <Field label="WhatsApp Template ID">
                  <Input
                    placeholder="e.g. summer_health_v1"
                    value={form.whatsappTemplateId}
                    onChange={set("whatsappTemplateId")}
                    disabled={!form.channels.includes("WhatsApp (Meta API)")}
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* ── 6. Assign Employees ─────────────────────── */}
            <SectionBlock icon="👤" title="Assign Employees">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {/* ── Calling Employees ── */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-2)",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <span
                      style={{
                        background: "#e0f2fe",
                        color: "#0369a1",
                        borderRadius: 6,
                        padding: "2px 9px",
                        fontSize: 13,
                      }}
                    >
                      📞 Calling Employees
                    </span>
                  </div>

                  {assignedCalling.size > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      {CALLING_AGENTS.filter((a) =>
                        assignedCalling.has(a.id),
                      ).map((a) => (
                        <span
                          key={a.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: "#e0f2fe",
                            color: "#0369a1",
                            border: "1px solid #bae6fd",
                            borderRadius: 20,
                            padding: "4px 10px 4px 12px",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {a.name}
                          <button
                            type="button"
                            onClick={() => toggleCalling(a.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#0369a1",
                              fontSize: 15,
                              lineHeight: 1,
                              padding: 0,
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        padding: "8px 12px",
                        background: "var(--surface)",
                        cursor: "text",
                      }}
                      onClick={() => setCallingOpen(true)}
                    >
                      <input
                        type="text"
                        placeholder="Search calling employees…"
                        value={callingSearch}
                        onChange={(e) => {
                          setCallingSearch(e.target.value);
                          setCallingOpen(true);
                        }}
                        onFocus={() => setCallingOpen(true)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          fontSize: 13,
                        }}
                      />
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                        {assignedCalling.size > 0
                          ? `${assignedCalling.size} selected`
                          : ""}
                      </span>
                      <span style={{ color: "var(--text-3)", fontSize: 13 }}>
                        {callingOpen ? "▲" : "▼"}
                      </span>
                    </div>
                    {callingOpen && (
                      <>
                        <div
                          style={{ position: "fixed", inset: 0, zIndex: 10 }}
                          onClick={() => {
                            setCallingOpen(false);
                            setCallingSearch("");
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            zIndex: 11,
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--r-md)",
                            boxShadow: "0 4px 16px rgba(0,0,0,.1)",
                            maxHeight: 220,
                            overflowY: "auto",
                          }}
                        >
                          {filteredCalling.length === 0 ? (
                            <div
                              style={{
                                padding: "14px 16px",
                                fontSize: 13,
                                color: "var(--text-3)",
                              }}
                            >
                              No employees found.
                            </div>
                          ) : (
                            filteredCalling.map((a) => (
                              <label
                                key={a.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 16px",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  background: assignedCalling.has(a.id)
                                    ? "#e0f2fe"
                                    : "transparent",
                                  borderBottom: "1px solid var(--border)",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={assignedCalling.has(a.id)}
                                  onChange={() => toggleCalling(a.id)}
                                />
                                <div>
                                  <div style={{ fontWeight: 500 }}>
                                    {a.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: "var(--text-3)",
                                    }}
                                  >
                                    {a.broker} · {a.posLicense}
                                  </div>
                                </div>
                              </label>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Sales Employees ── */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-2)",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <span
                      style={{
                        background: "var(--brand-light)",
                        color: "var(--brand)",
                        borderRadius: 6,
                        padding: "2px 9px",
                        fontSize: 13,
                      }}
                    >
                      💼 Sales Employees
                    </span>
                  </div>

                  {assignedSales.size > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      {SALES_AGENTS.filter((a) => assignedSales.has(a.id)).map(
                        (a) => (
                          <span
                            key={a.id}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              background: "var(--brand-light)",
                              color: "var(--brand)",
                              border: "1px solid var(--brand-mid)",
                              borderRadius: 20,
                              padding: "4px 10px 4px 12px",
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            {a.name}
                            <button
                              type="button"
                              onClick={() => toggleSales(a.id)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--brand)",
                                fontSize: 15,
                                lineHeight: 1,
                                padding: 0,
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ),
                      )}
                    </div>
                  )}

                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r-md)",
                        padding: "8px 12px",
                        background: "var(--surface)",
                        cursor: "text",
                      }}
                      onClick={() => setSalesOpen(true)}
                    >
                      <input
                        type="text"
                        placeholder="Search sales employees…"
                        value={salesSearch}
                        onChange={(e) => {
                          setSalesSearch(e.target.value);
                          setSalesOpen(true);
                        }}
                        onFocus={() => setSalesOpen(true)}
                        style={{
                          flex: 1,
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          fontSize: 13,
                        }}
                      />
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                        {assignedSales.size > 0
                          ? `${assignedSales.size} selected`
                          : ""}
                      </span>
                      <span style={{ color: "var(--text-3)", fontSize: 13 }}>
                        {salesOpen ? "▲" : "▼"}
                      </span>
                    </div>
                    {salesOpen && (
                      <>
                        <div
                          style={{ position: "fixed", inset: 0, zIndex: 10 }}
                          onClick={() => {
                            setSalesOpen(false);
                            setSalesSearch("");
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            right: 0,
                            zIndex: 11,
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--r-md)",
                            boxShadow: "0 4px 16px rgba(0,0,0,.1)",
                            maxHeight: 220,
                            overflowY: "auto",
                          }}
                        >
                          {filteredSales.length === 0 ? (
                            <div
                              style={{
                                padding: "14px 16px",
                                fontSize: 13,
                                color: "var(--text-3)",
                              }}
                            >
                              No employees found.
                            </div>
                          ) : (
                            filteredSales.map((a) => (
                              <label
                                key={a.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 10,
                                  padding: "10px 16px",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  background: assignedSales.has(a.id)
                                    ? "var(--brand-light)"
                                    : "transparent",
                                  borderBottom: "1px solid var(--border)",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={assignedSales.has(a.id)}
                                  onChange={() => toggleSales(a.id)}
                                />
                                <div>
                                  <div style={{ fontWeight: 500 }}>
                                    {a.name}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: 13,
                                      color: "var(--text-3)",
                                    }}
                                  >
                                    {a.broker} · {a.posLicense}
                                  </div>
                                </div>
                              </label>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SectionBlock>

            {/* ── 7. Tracking ──────────────────────────── */}
            <SectionBlock icon="📊" title="Tracking">
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Toggle
                  checked={form.clickTracking}
                  onChange={setBool("clickTracking")}
                  label="Enable Click Tracking (UTM / link tracking)"
                />
                <Toggle
                  checked={form.conversionTracking}
                  onChange={setBool("conversionTracking")}
                  label="Enable Conversion Tracking (policy issued after campaign click)"
                />
              </div>
            </SectionBlock>

            <FormActions
              onCancel={() => navigate("/campaign")}
              submitLabel="Create Campaign"
            />
          </form>
        </div>
      </div>

      {showProductPicker && (
        <ProductPickerModal
          selected={form.selectedProducts}
          onToggle={toggleProduct}
          onClose={() => setShowProductPicker(false)}
          offerType={form.offerType}
          offerValue={form.offerValue}
        />
      )}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </div>
  );
}
