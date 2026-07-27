import { useState, useEffect } from "react";
import {
  Field,
  Input,
  Select,
  SearchableSelect,
  Textarea,
  SectionBlock,
} from "../../components/Field";
import { Tabs } from "../../components/ui/Tabs";
import { SearchIcon } from "../../icons";
import {
  PRODUCTS,
  POLICY_TYPE_ICON,
  PREMIUM_CHART,
  PRODUCT_DETAILS,
  getProductLinks,
} from "../product/productData";
import { ASSOCIATIONS } from "../member/orgAssocData";
import policyWordingsPdf from "../../assets/StarHealthAssureInsurancePolicy-Policy-wording.pdf";
import brochurePdf from "../../assets/Brochure_Star_Comprehensive_Insurance_Policy_V_15_Web_633bcfcaaf.pdf";

export const TYPE_COLORS = {
  "Base Policy":        "#1d4ed8",
  "OPD":                "#15803d",
  "Payment Protection": "#b45309",
  "Age Band Premium":   "#7c3aed",
  "Super Top Up":       "#f57c82",
  "Top Up Policy":      "#4f46e5",
};

export const PTYPE_META = {
  "Base Policy": { color: "#2563eb", bg: "#dbeafe", border: "#bfdbfe" },
  "Top Up Policy": { color: "#0891b2", bg: "#e0f2fe", border: "#7dd3fc" },
  "Super Top Up": { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  OPD: { color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  "Age Band Premium": { color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" },
  "Payment Protection": { color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  Other: { color: "#6b7280", bg: "#f3f4f6", border: "#d1d5db" },
};

export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir",
];

export const MOCK_USERS = [
  { id: 1,  name: "Aarav Sharma",   age: 34, gender: "Male",   marital: "Married",  segment: "Active Policyholders",   type: "Member", state: "Maharashtra" },
  { id: 2,  name: "Priya Mehta",    age: 28, gender: "Female", marital: "Single",   segment: "New Registrations",       type: "Member", state: "Gujarat" },
  { id: 3,  name: "Rohan Verma",    age: 52, gender: "Male",   marital: "Married",  segment: "Renewal Due (30 days)",   type: "Member", state: "Delhi" },
  { id: 4,  name: "Sneha Iyer",     age: 41, gender: "Female", marital: "Divorced", segment: "High Value Members",    type: "Member", state: "Karnataka" },
  { id: 5,  name: "Karan Patel",    age: 23, gender: "Male",   marital: "Single",   segment: "New Registrations",       type: "Member", state: "Gujarat" },
  { id: 6,  name: "Divya Nair",     age: 37, gender: "Female", marital: "Married",  segment: "Active Policyholders",    type: "Member", state: "Kerala" },
  { id: 7,  name: "Arjun Singh",    age: 60, gender: "Male",   marital: "Widowed",  segment: "Renewal Due (30 days)",   type: "Member", state: "Punjab" },
  { id: 8,  name: "Meera Joshi",    age: 45, gender: "Female", marital: "Married",  segment: "Lapsed Members",        type: "Member", state: "Rajasthan" },
  { id: 9,  name: "Vikram Rao",     age: 31, gender: "Male",   marital: "Single",   segment: "Active Policyholders",    type: "Member", state: "Telangana" },
  { id: 10, name: "Anjali Desai",   age: 29, gender: "Female", marital: "Married",  segment: "New Registrations",       type: "Member", state: "Maharashtra" },
  { id: 11, name: "Rahul Gupta",    age: 48, gender: "Male",   marital: "Married",  segment: "High Value Members",    type: "Member", state: "Uttar Pradesh" },
  { id: 12, name: "Pooja Reddy",    age: 33, gender: "Female", marital: "Single",   segment: "Active Policyholders",    type: "Member", state: "Telangana" },
  { id: 13, name: "Suresh Kumar",   age: 55, gender: "Male",   marital: "Married",  segment: "Renewal Due (30 days)",   type: "Member", state: "Tamil Nadu" },
  { id: 14, name: "Kavita Pillai",  age: 26, gender: "Female", marital: "Single",   segment: "New Registrations",       type: "Member", state: "Kerala" },
  { id: 15, name: "Nikhil Bansal",  age: 39, gender: "Male",   marital: "Divorced", segment: "Lapsed Members",        type: "Member", state: "Delhi" },
  { id: 16, name: "Swati Tiwari",   age: 44, gender: "Female", marital: "Married",  segment: "Active Policyholders",    type: "Member", state: "Madhya Pradesh" },
  { id: 17, name: "Amit Saxena",    age: 57, gender: "Male",   marital: "Married",  segment: "High Value Members",    type: "Member", state: "Uttar Pradesh" },
  { id: 18, name: "Ritu Bhatia",    age: 22, gender: "Female", marital: "Single",   segment: "New Registrations",       type: "Member", state: "Haryana" },
  { id: 19, name: "Deepak Mishra",  age: 36, gender: "Male",   marital: "Married",  segment: "Active Policyholders",    type: "Member", state: "Bihar" },
  { id: 20, name: "Nisha Chauhan",  age: 50, gender: "Female", marital: "Widowed",  segment: "Lapsed Members",        type: "Member", state: "Rajasthan" },
  { id: 21, name: "Rajesh Agarwal", age: 43, gender: "Male",   marital: "Married",  segment: "Renewal Due (30 days)",   type: "Employee",    state: "Maharashtra" },
  { id: 22, name: "Sunita Yadav",   age: 30, gender: "Female", marital: "Single",   segment: "Active Policyholders",    type: "Employee",    state: "Uttar Pradesh" },
  { id: 23, name: "Manoj Tomar",    age: 47, gender: "Male",   marital: "Married",  segment: "High Value Members",    type: "Employee",    state: "Delhi" },
  { id: 24, name: "Geeta Rawat",    age: 35, gender: "Female", marital: "Divorced", segment: "Active Policyholders",    type: "Employee",    state: "Uttarakhand" },
  { id: 25, name: "Sanjay Kapoor",  age: 53, gender: "Male",   marital: "Married",  segment: "Renewal Due (30 days)",   type: "Employee",    state: "Punjab" },
  { id: 26, name: "Lakshmi Menon",  age: 27, gender: "Female", marital: "Single",   segment: "New Registrations",       type: "Employee",    state: "Tamil Nadu" },
  { id: 27, name: "Vivek Pandey",   age: 40, gender: "Male",   marital: "Married",  segment: "Lapsed Members",        type: "Employee",    state: "Madhya Pradesh" },
  { id: 28, name: "Anita Soni",     age: 32, gender: "Female", marital: "Married",  segment: "Active Policyholders",    type: "Employee",    state: "Gujarat" },
  { id: 29, name: "Harish Dubey",   age: 58, gender: "Male",   marital: "Widowed",  segment: "High Value Members",    type: "Employee",    state: "Karnataka" },
  { id: 30, name: "Rekha Malhotra", age: 24, gender: "Female", marital: "Single",   segment: "New Registrations",       type: "Employee",    state: "West Bengal" },
];

export const PAGE_SIZE = 10;

export const OPERATORS = [
  { id: 1,  name: "Ravi Kulkarni", posLicense: "POS-2023-001", broker: "K.M. Dastur & Co.", agentType: "sales" },
  { id: 2,  name: "Pooja Desai",   posLicense: "POS-2023-019", broker: "K.M. Dastur & Co.", agentType: "calling" },
  { id: 4,  name: "Kavita Sharma", posLicense: "POS-2023-045", broker: "Shah Financial",     agentType: "calling" },
  { id: 5,  name: "Amit Verma",    posLicense: "POS-2023-067", broker: "K.M. Dastur & Co.", agentType: "sales" },
  { id: 6,  name: "Sneha Patil",   posLicense: "POS-2022-133", broker: "Nair & Co.",         agentType: "calling" },
  { id: 8,  name: "Priya Menon",   posLicense: "POS-2023-088", broker: "Shah Financial",     agentType: "sales" },
  { id: 9,  name: "Kiran Reddy",   posLicense: "POS-2023-099", broker: "Rao & Partners",     agentType: "calling" },
  { id: 10, name: "Neha Gupta",    posLicense: "POS-2022-155", broker: "Priya Brokers",      agentType: "sales" },
  { id: 11, name: "Ajay Tiwari",   posLicense: "POS-2023-120", broker: "K.M. Dastur & Co.", agentType: "calling" },
];

export const CALLING_AGENTS = OPERATORS.filter((a) => a.agentType === "calling");
export const SALES_AGENTS   = OPERATORS.filter((a) => a.agentType === "sales");

export const POLICY_TYPES_LIST = [...new Set(PRODUCTS.map(p => p.policyType))];

export const fmtSI = v => v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`;

export function getChartData(id) {
  const rows   = PREMIUM_CHART[id] ?? [];
  const sis    = [...new Set(rows.map(r => r.sumInsured))];
  const allP   = rows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean));
  const minP   = allP.length > 0 ? Math.min(...allP) : null;
  const maxP   = allP.length > 0 ? Math.max(...allP) : null;
  const covKeys = ['selfOnly', 'selfSpouse', 'selfSpouse2Children'].filter(k => rows[0]?.[k] != null);
  return { sis, minP, maxP, covKeys };
}

// Orders a product list so that each base policy is immediately followed by
// its linked top-up(s), keeping bundled pairs visually adjacent in tables.
export function orderWithLinkedBelow(products) {
  const placed = new Set();
  const ordered = [];
  products.forEach(p => {
    if (placed.has(p.id) || p.linkedBaseId) return;
    ordered.push(p);
    placed.add(p.id);
    products
      .filter(x => x.linkedBaseId === p.id)
      .forEach(t => {
        if (!placed.has(t.id)) {
          ordered.push(t);
          placed.add(t.id);
        }
      });
  });
  products.forEach(p => {
    if (!placed.has(p.id)) {
      ordered.push(p);
      placed.add(p.id);
    }
  });
  return ordered;
}

export function applyDiscount(premium, offerType, offerValue) {
  if (!offerValue || !premium) return null;
  const v = Number(offerValue);
  if (!v) return null;
  return offerType === 'Percent' ? Math.round(premium * (1 - v / 100)) : Math.max(0, premium - v);
}

// Adds a linked top-up automatically whenever its base policy is selected, so
// the bundle shows up together in the picker table and the campaign cards.
export function toggleProductWithLinks(prev, id) {
  if (prev.includes(id)) {
    return prev.filter((x) => x !== id);
  }
  const { topups } = getProductLinks(id);
  const linkedIds = topups.map((t) => t.id).filter((tid) => !prev.includes(tid));
  return [...prev, id, ...linkedIds];
}

export function ProductDetailModal({ product, onClose }) {
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

          {/* ── Linked base policy banner ── */}
          {linkedBase && (
            <div style={{ background: "#eff6ff",
              border: "1.5px solid #bfdbfe", borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>🔗</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1565d8", marginBottom: 3 }}>
                  Linked to Base Policy
                </div>
                <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>
                  This top-up is linked with <strong>{linkedBase.name}</strong> ({linkedBase.code} · {linkedBase.provider}).
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

export function ProductPickerModal({ selected, onToggle, onClose }) {
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const hasFilter = search || typeFilter;

  // With a large real-world catalogue, listing everything on open would be too
  // slow — so an empty search shows only the already-selected products, and
  // typing loads matches from the full catalogue instead.
  const filtered = search
    ? orderWithLinkedBelow(PRODUCTS.filter(p => {
        if (typeFilter && p.policyType !== typeFilter) return false;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.provider.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
        );
      }))
    : orderWithLinkedBelow(PRODUCTS.filter(p => selected.includes(p.id) && (!typeFilter || p.policyType === typeFilter)));

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onMouseDown={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: "var(--bg-card,#fff)", borderRadius: 14, width: "min(1180px,100%)",
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
              {search
                ? "No products match your filters."
                : "🔍 No products selected yet. Search by name, provider or code to add products."}
            </div>
          ) : (
            <div className="table-wrap" style={{ margin: 0, borderRadius: 0, border: "none" }}>
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Policy Name</th>
                    <th>IC</th>
                    <th>Policy Type</th>
                    <th>SI</th>
                    <th>Premium</th>
                    <th>Linked Policy Code</th>
                    <th>Linked Policy Name</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const added = selected.includes(p.id);
                    const color = TYPE_COLORS[p.policyType] ?? "#33b5e5";
                    const icon  = POLICY_TYPE_ICON[p.policyType] ?? "📋";
                    const { sis, minP, maxP } = getChartData(p.id);
                    const { topups } = getProductLinks(p.id);
                    const siRange = sis.length > 0
                      ? `${fmtSI(Math.min(...sis))}${sis.length > 1 ? ` – ${fmtSI(Math.max(...sis))}` : ""}`
                      : "—";
                    const premiumRange = minP
                      ? `₹${minP.toLocaleString("en-IN")}${maxP && maxP !== minP ? ` – ₹${maxP.toLocaleString("en-IN")}` : ""}/yr`
                      : "—";
                    return (
                      <tr key={p.id} style={{ background: added ? "var(--brand-light,#eff6ff)" : undefined }}>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: 11.5, color: "var(--text-3)",
                            background: "var(--bg-subtle,#f8fafc)", border: "1px solid var(--border)",
                            borderRadius: 4, padding: "2px 7px" }}>
                            {p.code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text-1)" }}>{p.name}</td>
                        <td style={{ fontSize: 13, color: "var(--text-2)" }}>{p.provider}</td>
                        <td>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
                            background: `${color}18`, color, border: `1.5px solid ${color}40` }}>
                            <span>{icon}</span> {p.policyType}
                          </span>
                        </td>
                        <td style={{ fontSize: 13, color: "var(--text-2)", whiteSpace: "nowrap" }}>{siRange}</td>
                        <td style={{ fontSize: 13, color: "var(--text-2)", whiteSpace: "nowrap" }}>{premiumRange}</td>
                        <td style={{ fontSize: 13, color: "var(--text-2)" }}>
                          {topups.map(t => t.code).join(", ") || "—"}
                        </td>
                        <td style={{ fontSize: 13, color: "var(--text-2)" }}>
                          {topups.map(t => t.name).join(", ") || "—"}
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

// Selected-product cards ("BuyPolicy" style), the "+ Add Product" trigger, and
// the picker/detail modals — a single drop-in section shared by Create & Edit
// so both behave identically.
export function ProductMappingSection({ form, toggleProduct }) {
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  return (
    <SectionBlock icon="📦" title="Product Mapping">
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
            {orderWithLinkedBelow(
              form.selectedProducts.map(sid => PRODUCTS.find(x => x.id === sid)).filter(Boolean)
            ).map(p => {
              const id = p.id;
              const providerColor = TYPE_COLORS[p.policyType] ?? "#33b5e5";
              const { sis, minP, covKeys } = getChartData(p.id);
              const { linkedBase, topups } = getProductLinks(p.id);
              // The campaign offer discounts the base policy's premium only,
              // and only once its linked top-up is bought alongside it —
              // a linked top-up's own premium is never discounted by it.
              const bundlePurchased = topups.some((t) => form.selectedProducts.includes(t.id));
              const discountEligible = !linkedBase && (topups.length === 0 || bundlePurchased);
              const discountedMinP = discountEligible ? applyDiscount(minP, form.offerType, form.offerValue) : null;
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
                    <div style={{ fontWeight: 600, fontSize: 18, color: "#24304a", letterSpacing: "-.18px" }}>
                      {p.name}
                    </div>

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
                          {linkedBase && form.offerValue && (
                            <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 4 }}>
                              {form.selectedProducts.includes(linkedBase.id)
                                ? <>Campaign offer applies to {linkedBase.name}'s premium</>
                                : <>Add {linkedBase.name} to this campaign for the offer to apply</>}
                            </div>
                          )}
                          {!linkedBase && topups.length > 0 && !bundlePurchased && form.offerValue && (
                            <div style={{ fontSize: 10.5, color: "var(--text-3)", marginTop: 4 }}>
                              Add a linked top-up to unlock this offer on this premium
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {covKeys.length > 0 && (
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {covKeys.includes("selfOnly") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self</span>}
                        {covKeys.includes("selfSpouse") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self + Spouse</span>}
                        {covKeys.includes("selfSpouse2Children") && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Family</span>}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, marginTop: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
                        <button type="button" onClick={() => setViewingProduct(p)}
                          style={{ fontSize: 13, fontWeight: 700, color: "#1565d8", border: "none",
                            background: "transparent", padding: 0, cursor: "pointer", fontFamily: "inherit",
                            display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                          View Info
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
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

                    {linkedBase && p.bundleDiscount && form.selectedProducts.includes(linkedBase.id) && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8,
                        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
                        padding: "8px 10px", marginTop: 2 }}>
                        <span style={{ fontSize: 15, flexShrink: 0 }}>🏷️</span>
                        <span style={{ fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                          Buying this along with <strong>{linkedBase.name}</strong> gets{" "}
                          <strong>
                            {p.bundleDiscount.type === "Percent" ? `${p.bundleDiscount.value}%` : `₹${p.bundleDiscount.value}`}
                          </strong>{" "}
                          off <strong>{linkedBase.name}'s premium</strong>.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      {showProductPicker && (
        <ProductPickerModal
          selected={form.selectedProducts}
          onToggle={toggleProduct}
          onClose={() => setShowProductPicker(false)}
        />
      )}
      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}
    </SectionBlock>
  );
}

export function CampaignDiscountSection({ form, set }) {
  return (
    <SectionBlock icon="💸" title="Campaign Discount">
      <div className="form-grid-3">
        <Field label="Discount">
          <Select value={form.offerType} onChange={set("offerType")}>
            <option value="Flat">Flat (₹)</option>
            <option value="Percent">Percentage (%)</option>
          </Select>
        </Field>
        <Field label={`Discount Value ${form.offerType === "Flat" ? "(₹)" : "(%)"}`}>
          <Input
            type="number"
            min="0"
            placeholder={form.offerType === "Flat" ? "e.g. 500" : "e.g. 10"}
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
  );
}

// Audience segment filtering, member list, and export — fully self-contained
// given only `form`/`setForm`, so Create and Edit share identical behavior.
export function AudienceSection({ form, setForm }) {
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const [audienceTab, setAudienceTab] = useState("filter");
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
  const allAssocSelected = ASSOCIATIONS.length > 0 && ASSOCIATIONS.every((a) => form.selectedAssociations.includes(a.id));
  const toggleAllAssoc = () =>
    setForm((prev) => ({
      ...prev,
      selectedAssociations: allAssocSelected ? [] : ASSOCIATIONS.map((a) => a.id),
    }));

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [tableVisible, setTableVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const handleFilterUsers = () => {
    // "ALL" means every user, regardless of any other field's leftover value —
    // the per-segment dropdowns are hidden once ALL is selected (see below).
    const results = form.segment === "ALL" ? MOCK_USERS : MOCK_USERS.filter((u) => {
      if (form.segment === "By Sales Person" && form.salesPersonId) {
        const userSalesId = SALES_AGENTS[(u.id - 1) % SALES_AGENTS.length].id;
        if (userSalesId !== Number(form.salesPersonId)) return false;
      }
      if (form.segment === "By Age") {
        const min = form.ageMin ? Number(form.ageMin) : 0;
        const max = form.ageMax ? Number(form.ageMax) : 999;
        if (u.age < min || u.age > max) return false;
      }
      if (form.segment === "By Location" && form.state) {
        if (u.state !== form.state) return false;
      }
      if (form.segment === "By Corporate" && form.selectedAssociations.length > 0) {
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

  const handleExportUsers = () => {
    const rows = selectedUserIds.size > 0
      ? filteredUsers.filter((u) => selectedUserIds.has(u.id))
      : filteredUsers;
    if (rows.length === 0) return;
    const headers = ["Name", "Type", "Age", "State", "Segment"];
    const csvLines = [headers.join(",")].concat(
      rows.map((u) =>
        [u.name, u.type, u.age, u.state, u.segment]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    );
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-audience-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const pagedUsers = filteredUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);
  const allPageSelected = pagedUsers.length > 0 && pagedUsers.every((u) => selectedUserIds.has(u.id));
  const somePageSelected = pagedUsers.some((u) => selectedUserIds.has(u.id)) && !allPageSelected;

  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedUserIds.has(u.id));

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
  const selectAllFiltered = () => setSelectedUserIds(new Set(filteredUsers.map((u) => u.id)));
  const clearAllSelected = () => setSelectedUserIds(new Set());

  return (
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
          <Field label="Select Segment">
            <Select value={form.segment} onChange={set("segment")}>
              <option value="By Sales Person">By Sales Person</option>
              <option value="By Age">By Age</option>
              <option value="By Location">By Location</option>
              <option value="By Corporate">By Corporate</option>
              <option value="ALL">ALL</option>
            </Select>
          </Field>

          {form.segment === "By Sales Person" && (
            <Field label="Sales Person">
              <SearchableSelect
                value={form.salesPersonId}
                onChange={(val) => setForm((p) => ({ ...p, salesPersonId: val }))}
                options={SALES_AGENTS.map((a) => ({ value: a.id, label: a.name }))}
                placeholder="All sales persons"
              />
            </Field>
          )}

          {form.segment === "By Age" && (
            <Field label="Age Range">
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Input type="number" min="0" max="120" placeholder="Min" value={form.ageMin} onChange={set("ageMin")} style={{ width: "50%" }} />
                <span style={{ color: "var(--text-3)", flexShrink: 0 }}>to</span>
                <Input type="number" min="0" max="120" placeholder="Max" value={form.ageMax} onChange={set("ageMax")} style={{ width: "50%" }} />
              </div>
            </Field>
          )}

          {form.segment === "By Location" && (
            <Field label="State">
              <SearchableSelect
                value={form.state}
                onChange={(val) => setForm((p) => ({ ...p, state: val }))}
                options={INDIA_STATES.map((s) => ({ value: s, label: s }))}
                placeholder="All States"
              />
            </Field>
          )}

          {form.segment === "By Corporate" && (
            <Field label="Corporate / Association" className="col-span-3">
              <div>
                {form.selectedAssociations.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {form.selectedAssociations.map((id) => {
                      const assoc = ASSOCIATIONS.find((a) => a.id === id);
                      return (
                        <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--brand-light)", color: "var(--brand)", border: "1px solid var(--brand-mid)", borderRadius: 20, padding: "3px 10px 3px 12px", fontSize: 13.5, fontWeight: 500 }}>
                          {assoc?.name ?? id}
                          <button type="button" onClick={() => toggleAssoc(id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div style={{ position: "relative" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "8px 12px", background: "var(--surface)", cursor: "text" }}
                    onClick={() => setAssocOpen(true)}
                  >
                    <input
                      type="text"
                      placeholder={form.selectedAssociations.length === 0 ? "All Associations" : "Add more…"}
                      value={assocSearch}
                      onChange={(e) => { setAssocSearch(e.target.value); setAssocOpen(true); }}
                      onFocus={() => setAssocOpen(true)}
                      style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, fontFamily: "inherit" }}
                    />
                    <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                      {form.selectedAssociations.length > 0 ? `${form.selectedAssociations.length} selected` : ""}
                    </span>
                    <span style={{ color: "var(--text-3)", fontSize: 13 }}>{assocOpen ? "▲" : "▼"}</span>
                  </div>
                  {assocOpen && (
                    <>
                      <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => { setAssocOpen(false); setAssocSearch(""); }} />
                      <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 11, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "0 4px 16px rgba(0,0,0,.1)", maxHeight: 200, overflowY: "auto" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--brand)", background: allAssocSelected ? "var(--brand-light)" : "transparent", borderBottom: "1px solid var(--border)" }}>
                          <input type="checkbox" checked={allAssocSelected} onChange={toggleAllAssoc} />
                          Select All Associations
                        </label>
                        {filteredAssoc.length === 0 ? (
                          <div style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-3)" }}>No associations found.</div>
                        ) : (
                          filteredAssoc.map((a) => (
                            <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", cursor: "pointer", fontSize: 13, background: form.selectedAssociations.includes(a.id) ? "var(--brand-light)" : "transparent", borderBottom: "1px solid var(--border)" }}>
                              <input type="checkbox" checked={form.selectedAssociations.includes(a.id)} onChange={() => toggleAssoc(a.id)} />
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
          )}
        </div>
      )}

      {audienceTab === "filter" && (
        <div style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-primary" onClick={handleFilterUsers}>Filter</button>

          {tableVisible && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                  </span>
                  {selectedUserIds.size > 0 && (
                    <span style={{ fontSize: 13, color: "var(--brand-mid)", fontWeight: 600 }}>
                      {selectedUserIds.size} selected
                    </span>
                  )}
                  {totalPages > 1 && (
                    <button
                      type="button"
                      onClick={allFilteredSelected ? clearAllSelected : selectAllFiltered}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontWeight: 600, fontSize: 13, padding: 0, textDecoration: "underline" }}
                    >
                      {allFilteredSelected ? "Clear selection" : `Select all ${filteredUsers.length} users`}
                    </button>
                  )}
                </div>
                <button type="button" className="btn btn-ghost" style={{ fontSize: 13 }} onClick={handleExportUsers}>
                  ⬇ Export {selectedUserIds.size > 0 ? "Selected" : "All"}
                </button>
              </div>

              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-3)", fontSize: 14 }}>
                  No users match the selected filters.
                </div>
              ) : (
                <>
                  {totalPages > 1 && allPageSelected && !allFilteredSelected && (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "8px 0", fontSize: 13, background: "var(--brand-light)", borderRadius: "var(--r-sm)", marginBottom: 8 }}>
                      <span>All {pagedUsers.length} users on this page are selected.</span>
                      <button type="button" onClick={selectAllFiltered} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontWeight: 600, fontSize: 13, padding: 0, textDecoration: "underline" }}>
                        Select all {filteredUsers.length} users matching this filter
                      </button>
                    </div>
                  )}
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: 36 }}>
                            <input
                              type="checkbox"
                              checked={allPageSelected}
                              ref={(el) => { if (el) el.indeterminate = somePageSelected; }}
                              onChange={togglePageAll}
                            />
                          </th>
                          <th>#</th>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Age</th>
                          <th>State</th>
                          <th>Segment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagedUsers.map((u, i) => (
                          <tr
                            key={u.id}
                            style={{ background: selectedUserIds.has(u.id) ? "var(--brand-light)" : undefined, cursor: "pointer" }}
                            onClick={() => toggleUser(u.id)}
                          >
                            <td onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedUserIds.has(u.id)} onChange={() => toggleUser(u.id)} />
                            </td>
                            <td>{(userPage - 1) * PAGE_SIZE + i + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.type}</td>
                            <td>{u.age}</td>
                            <td>{u.state}</td>
                            <td>{u.segment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 12 }}>
                      <button type="button" className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 13 }} disabled={userPage === 1} onClick={() => setUserPage((p) => p - 1)}>← Prev</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} type="button" className={`btn ${p === userPage ? "btn-primary" : "btn-ghost"}`} style={{ padding: "4px 10px", fontSize: 13, minWidth: 32 }} onClick={() => setUserPage(p)}>{p}</button>
                      ))}
                      <button type="button" className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 13 }} disabled={userPage === totalPages} onClick={() => setUserPage((p) => p + 1)}>Next →</button>
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
            <input type="file" style={{ display: "none" }} accept=".csv,.xlsx" />
            <div className="upload-icon">📋</div>
            <div className="upload-label">Upload CSV / Excel list</div>
            <div className="upload-hint">Overrides segment if provided</div>
          </label>
        </div>
      )}
    </SectionBlock>
  );
}

// Promotional image upload + live WhatsApp/Email creative preview. Reused
// verbatim inside the final CampaignPreviewModal so the image can be
// uploaded/changed at the review stage too.
export function PromoCreativeSection({ form, setForm, bare = false, readOnly = false }) {
  const [campaignImagePreview, setCampaignImagePreview] = useState(null);

  useEffect(() => {
    if (form.campaignImage instanceof File) {
      const url = URL.createObjectURL(form.campaignImage);
      setCampaignImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setCampaignImagePreview(null);
  }, [form.campaignImage]);

  const body = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <Field label="Promotional Image" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 220, height: 140, borderRadius: 10, overflow: "hidden", flexShrink: 0,
            background: "var(--brand-light)",
            border: campaignImagePreview ? "1px solid var(--border)" : "2px dashed var(--brand)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {campaignImagePreview
              ? <img src={campaignImagePreview} alt="Campaign creative" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 32 }}>🖼️</span>}
          </div>
          {readOnly ? (
            !campaignImagePreview && (
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>No image uploaded</div>
            )
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ cursor: "pointer", display: "inline-block" }}>
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={(e) => setForm((p) => ({ ...p, campaignImage: e.target.files[0] ?? null }))} />
                  <span className="btn btn-secondary" style={{ pointerEvents: "none" }}>
                    {campaignImagePreview ? "🔄 Change Image" : "📷 Upload Image"}
                  </span>
                </label>
                {form.campaignImage && (
                  <button type="button" className="btn btn-ghost"
                    onClick={() => setForm((p) => ({ ...p, campaignImage: null }))}>
                    Remove
                  </button>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                JPG or PNG · Shown on the WhatsApp &amp; Email previews below
              </div>
            </>
          )}
        </div>
      </Field>

      {(form.channels.includes("WhatsApp (Meta API)") || form.channels.includes("Email")) ? (
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
          {form.channels.includes("WhatsApp (Meta API)") && (
            <div style={{ width: 300 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".4px", textAlign: "center" }}>
                📱 WhatsApp Preview
              </div>
              <div style={{ background: "#e5ddd5", borderRadius: 12, padding: 14 }}>
                <div style={{ background: "#dcf8c6", borderRadius: "10px 10px 10px 0", padding: 10, boxShadow: "0 1px 2px rgba(0,0,0,.1)" }}>
                  {campaignImagePreview && (
                    <img src={campaignImagePreview} alt="" style={{ width: "100%", borderRadius: 6, marginBottom: 8, display: "block" }} />
                  )}
                  <div style={{ fontSize: 13.5, color: "#111b21", whiteSpace: "pre-wrap", lineHeight: 1.4 }}>
                    {form.messageTemplate || "Your WhatsApp message will appear here…"}
                  </div>
                  <div style={{ fontSize: 10.5, color: "#667781", textAlign: "right", marginTop: 4 }}>
                    {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} ✓✓
                  </div>
                </div>
              </div>
            </div>
          )}
          {form.channels.includes("Email") && (
            <div style={{ width: 340 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".4px", textAlign: "center" }}>
                ✉️ Email Preview
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                {campaignImagePreview ? (
                  <img src={campaignImagePreview} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ height: 100, background: "#f5f7f9", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 12 }}>
                    No image uploaded
                  </div>
                )}
                <div style={{ padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "var(--text-1)" }}>
                    {form.name || "Campaign Subject"}
                  </div>
                  <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    {form.messageTemplate || "Your email content will appear here…"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: "var(--text-3)", textAlign: "center" }}>
          Select WhatsApp or Email under Communication Channels to preview the promotional creative here.
        </div>
      )}
    </div>
  );

  if (bare) return body;

  return (
    <SectionBlock icon="🖼️" title="Promotional Creative & Preview">
      {body}
    </SectionBlock>
  );
}

// Assign Employees — Calling/Sales employee pickers, controlled by the parent
// so the current assignment is available for the final preview/submit payload.
export function AssignEmployeesSection({ assignedCalling, assignedSales, toggleCalling, toggleSales }) {
  const [callingSearch, setCallingSearch] = useState("");
  const [callingOpen, setCallingOpen] = useState(false);
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

  return (
    <SectionBlock icon="👤" title="Assign Employees">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Calling Employees */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ background: "#e0f2fe", color: "#0369a1", borderRadius: 6, padding: "2px 9px", fontSize: 13 }}>📞 Calling Employees</span>
          </div>
          {assignedCalling.size > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {CALLING_AGENTS.filter((a) => assignedCalling.has(a.id)).map((a) => (
                <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 20, padding: "4px 10px 4px 12px", fontSize: 13, fontWeight: 500 }}>
                  {a.name}
                  <button type="button" onClick={() => toggleCalling(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#0369a1", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "8px 12px", background: "var(--surface)", cursor: "text" }} onClick={() => setCallingOpen(true)}>
              <input type="text" placeholder="Search calling employees…" value={callingSearch} onChange={(e) => { setCallingSearch(e.target.value); setCallingOpen(true); }} onFocus={() => setCallingOpen(true)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13 }} />
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>{assignedCalling.size > 0 ? `${assignedCalling.size} selected` : ""}</span>
              <span style={{ color: "var(--text-3)", fontSize: 13 }}>{callingOpen ? "▲" : "▼"}</span>
            </div>
            {callingOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => { setCallingOpen(false); setCallingSearch(""); }} />
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 11, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "0 4px 16px rgba(0,0,0,.1)", maxHeight: 220, overflowY: "auto" }}>
                  {filteredCalling.length === 0 ? (
                    <div style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-3)" }}>No employees found.</div>
                  ) : (
                    filteredCalling.map((a) => (
                      <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", fontSize: 13, background: assignedCalling.has(a.id) ? "#e0f2fe" : "transparent", borderBottom: "1px solid var(--border)" }}>
                        <input type="checkbox" checked={assignedCalling.has(a.id)} onChange={() => toggleCalling(a.id)} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{a.name}</div>
                          <div style={{ fontSize: 13, color: "var(--text-3)" }}>{a.broker} · {a.posLicense}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sales Employees */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ background: "var(--brand-light)", color: "var(--brand)", borderRadius: 6, padding: "2px 9px", fontSize: 13 }}>💼 Sales Employees</span>
          </div>
          {assignedSales.size > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
              {SALES_AGENTS.filter((a) => assignedSales.has(a.id)).map((a) => (
                <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--brand-light)", color: "var(--brand)", border: "1px solid var(--brand-mid)", borderRadius: 20, padding: "4px 10px 4px 12px", fontSize: 13, fontWeight: 500 }}>
                  {a.name}
                  <button type="button" onClick={() => toggleSales(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brand)", fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "8px 12px", background: "var(--surface)", cursor: "text" }} onClick={() => setSalesOpen(true)}>
              <input type="text" placeholder="Search sales employees…" value={salesSearch} onChange={(e) => { setSalesSearch(e.target.value); setSalesOpen(true); }} onFocus={() => setSalesOpen(true)} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13 }} />
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>{assignedSales.size > 0 ? `${assignedSales.size} selected` : ""}</span>
              <span style={{ color: "var(--text-3)", fontSize: 13 }}>{salesOpen ? "▲" : "▼"}</span>
            </div>
            {salesOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => { setSalesOpen(false); setSalesSearch(""); }} />
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 11, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "0 4px 16px rgba(0,0,0,.1)", maxHeight: 220, overflowY: "auto" }}>
                  {filteredSales.length === 0 ? (
                    <div style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-3)" }}>No employees found.</div>
                  ) : (
                    filteredSales.map((a) => (
                      <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", fontSize: 13, background: assignedSales.has(a.id) ? "var(--brand-light)" : "transparent", borderBottom: "1px solid var(--border)" }}>
                        <input type="checkbox" checked={assignedSales.has(a.id)} onChange={() => toggleSales(a.id)} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{a.name}</div>
                          <div style={{ fontSize: 13, color: "var(--text-3)" }}>{a.broker} · {a.posLicense}</div>
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
  );
}

function summarizeAudience(form) {
  switch (form.segment) {
    case "By Sales Person": {
      const agent = SALES_AGENTS.find((a) => String(a.id) === String(form.salesPersonId));
      return agent ? `Sales person: ${agent.name}` : "All sales persons";
    }
    case "By Age":
      return form.ageMin || form.ageMax ? `Age ${form.ageMin || "0"}–${form.ageMax || "∞"}` : "Any age";
    case "By Location":
      return form.state || "All states";
    case "By Corporate":
      return form.selectedAssociations.length > 0
        ? `${form.selectedAssociations.length} association${form.selectedAssociations.length !== 1 ? "s" : ""} selected`
        : "All associations";
    default:
      return "All members and employees";
  }
}

// Final review step shown before the campaign is actually created/updated.
// Lets the user re-check everything — including uploading/changing the
// promotional image — before confirming.
export function CampaignPreviewModal({
  form,
  setForm,
  assignedCalling,
  assignedSales,
  onBack,
  onConfirm,
  confirmLabel,
}) {
  const products = orderWithLinkedBelow(
    form.selectedProducts.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  );
  const callingNames = CALLING_AGENTS.filter((a) => assignedCalling.has(a.id)).map((a) => a.name);
  const salesNames = SALES_AGENTS.filter((a) => assignedSales.has(a.id)).map((a) => a.name);

  const row = (label, value) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
      <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-1)", textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 3000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "var(--bg-card,#fff)", borderRadius: 16, width: "min(860px,100%)",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,.3)", overflow: "hidden" }}>

        <div style={{ padding: "20px 26px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "var(--text-1)" }}>Preview Campaign</div>
          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
            Review everything before it goes live — you can still go back and edit.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 26px", display: "flex", flexDirection: "column", gap: 22 }}>

          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-1)" }}>{form.name || "Untitled Campaign"}</div>
            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>
              {form.startDate || "—"} → {form.endDate || "—"}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".4px" }}>
              Products ({products.length})
            </div>
            {products.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>No products added.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {products.map((p) => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, padding: "6px 10px", background: "var(--bg-subtle,#f8fafc)", borderRadius: 8 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{p.name}</span>
                    <span style={{ color: "var(--text-3)", fontFamily: "monospace", fontSize: 11.5 }}>{p.code} · {p.policyType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".4px" }}>
              Details
            </div>
            {row("Discount", form.offerValue ? `${form.offerType === "Percent" ? `${form.offerValue}%` : `₹${form.offerValue}`} off base policy premium` : "No campaign discount")}
            {row("Audience", summarizeAudience(form))}
            {row("Channels", form.channels.length > 0 ? form.channels.join(", ") : "None selected")}
            {row("Calling employees", callingNames.length > 0 ? callingNames.join(", ") : "None assigned")}
            {row("Sales employees", salesNames.length > 0 ? salesNames.join(", ") : "None assigned")}
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".4px" }}>
              Promotional Creative
            </div>
            <PromoCreativeSection form={form} setForm={setForm} bare readOnly />
          </div>
        </div>

        <div style={{ padding: "16px 26px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <button type="button" className="btn btn-ghost" onClick={onBack}>← Back to Edit</button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>Confirm &amp; {confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
