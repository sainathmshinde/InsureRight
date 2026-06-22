import { useState } from "react";
import {
  Field,
  Input,
  Select,
  Textarea,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { CheckboxGroup, FormActions } from "../../components/UI";
import { DocumentViewerModal } from "../../components/fields/DocumentViewerModal";
import policyWordingsPdf from "../../assets/StarHealthAssureInsurancePolicy-Policy-wording.pdf";
import brochurePdf from "../../assets/Brochure_Star_Comprehensive_Insurance_Policy_V_15_Web_633bcfcaaf.pdf";
import { PREMIUM_CHART } from "./productData";

const IC_LIST = [
  "Star Health Insurance",
  "HDFC ERGO",
  "ICICI Lombard",
  "Bajaj Allianz",
  "New India Assurance",
  "LIC",
  "HDFC Life",
  "SBI Life",
  "Reliance General",
  "Tata AIG",
];
const ADDONS = [
  "Critical Illness Rider",
  "Personal Accident Cover",
  "OPD Cover",
  "Maternity Cover",
  "Dental Cover",
  "Vision Cover",
  "Home Nursing",
  "Air Ambulance",
  "No Claim Bonus",
  "Global Cover",
];
const TENURES = ["1 Year", "2 Years", "3 Years", "5 Years"];
const STATES = [
  "All India",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "West Bengal",
  "Telangana",
  "Kerala",
];

const POLICY_TOC = [
  {
    id: "CIS",
    icon: "📋",
    title: "Customer Information Sheet",
    content:
      "Coverages A through AA summarised: in-patient hospitalisation, day care, consumables (List I), ambulance, pre/post-hospitalisation, domiciliary, organ donor, health check-up, home care, delivery, new born, compassionate travel, shared accommodation, AYUSH, 12 modern treatments, cumulative bonus, restoration, wellness programme, co-payment, optional deductible.",
  },
  {
    id: "DEF",
    icon: "📖",
    title: "A. Definitions",
    content:
      "Standard definitions: Accident, Ayurvedic, Complication, Day Care, Domiciliary. Specific definitions: Family = insured person + spouse + up to 3 children (16 days–17 years) + dependent parents and in-laws. Hospital: ≥10 in-patient beds; ICU with qualified nursing 24 hrs; registered under Clinical Establishments Act.",
  },
  {
    id: "COV-HOSP",
    icon: "🏥",
    title: "B. Coverage — Hospitalisation (1–9)",
    content:
      "1. In-patient hospitalisation. 2. Day care procedures. 3. Consumables — List I (68 items) covered. 4. Ambulance — road & air up to 10% SI per year. 5. Pre-hospitalisation — 60 days. 6. Post-hospitalisation — 180 days. 7. Room rent: 1% SI/day for ₹5L plans; any room for ₹10L+ plans. 8. ICU charges covered. 9. Minimum 24-hour admission (except day care).",
  },
  {
    id: "COV-SPECIAL",
    icon: "⭐",
    title: "B. Coverage — Special Benefits (10–22)",
    content:
      "10. Domiciliary hospitalisation. 11. Organ donor expenses. 12. Health check-up: ₹1,500–₹8,000 per year based on SI slab. 13. Home care treatment (10% SI, max ₹5L). 14. Delivery expenses — 24-month waiting period. 15. In Utero Fetal surgery. 16. New born baby covered from day 1 of birth. 17. Compassionate travel ₹10,000. 18. Shared accommodation bonus ₹1,000/day. 19–22. Additional benefits per policy schedule.",
  },
  {
    id: "COV-WELL",
    icon: "🌿",
    title: "B. Coverage — Wellness & Bonuses (23–31)",
    content:
      "23. AYUSH treatment at government/empanelled hospitals. 24. 12 modern treatments (robotic surgery, stem cell, oral chemo etc.). 25. Cumulative bonus — 25% per claim-free year, accumulates up to 100% SI. 26. Unlimited restoration — 100% SI reinstated for unrelated illnesses. 27. Wellness programme — up to 20% premium discount. 28. Co-payment — 10% applicable for entry age 61+. 29. Optional deductible. 30–31. Per endorsement.",
  },
  {
    id: "EXCL",
    icon: "🚫",
    title: "C. Exclusions",
    content:
      "PED waiting: 36 months (30 months with wellness credits). Specified disease waiting: 24 months. Initial waiting: 30 days (accidents exempt). Cosmetic/plastic surgery. Dental (unless accidental). Hazardous sports. Self-inflicted injury. Substance/alcohol abuse. Infertility & assisted reproduction. Obesity/weight-loss surgery. War, nuclear, bio-chemical hazard. Unproven treatments.",
  },
  {
    id: "COND",
    icon: "📝",
    title: "D. Conditions & Claims",
    content:
      "Cashless: pre-authorise 48 hrs prior (planned) or within 24 hrs (emergency) at network hospital. Reimbursement: submit documents within 15 days of discharge; penal interest 2% above bank rate if IC delays settlement. Cancellation pro-rata tables in schedule. Migration and portability per IRDAI. Moratorium: 8 years (no contestation after). Free look period: 15 days.",
  },
  {
    id: "SCH",
    icon: "📊",
    title: "Schedule of Benefits & List I",
    content:
      "Sum insured options: ₹5L, ₹7.5L, ₹10L, ₹15L, ₹25L, ₹50L, ₹1Cr, ₹1.5Cr, ₹2Cr. Sub-limits grid: room rent, ICU, ambulance, health check-up, home care, compassionate travel — mapped per SI slab. List I: 68 non-medical consumables covered under this policy (gloves, syringes, PPE kits, etc.).",
  },
];

const BROCHURE_TOC = [
  {
    id: "B-KEY",
    icon: "🔑",
    title: "Key Features",
    content:
      "Comprehensive health insurance for individual & family floater. Covers in-patient, day care, OPD, dental, ophthalmic. Accidental death & PTD lump-sum benefit included. Wellness benefits and loyalty discounts up to 10%. Available for ages 18–65 (children from 91 days).",
  },
  {
    id: "B-ENTRY",
    icon: "👤",
    title: "Entry Age & Sum Insured",
    content:
      "Adults: 18–65 years; lifetime renewal. Dependent children: 91 days–25 years. Sum insured: ₹5L to ₹1Cr (individual & family floater). Minimum 2 family members required for floater plan. No maximum entry age for renewal.",
  },
  {
    id: "B-DISC",
    icon: "🏷️",
    title: "Discounts",
    content:
      "Online purchase: 5%. Long-term policy — 2 years: 7.5%; 3 years: 10%. Loyalty renewal discount up to 10% based on claim-free years. Zone-based pricing: Zone I (metros) higher, Zone II (others) lower. Staff discount available for IC employees.",
  },
  {
    id: "B-CORE",
    icon: "🏥",
    title: "Core Coverages",
    content:
      "In-patient hospitalisation (room rent, ICU, surgeon, blood, medicines). Day care — all listed procedures. Pre-hospitalisation: 60 days. Post-hospitalisation: 180 days. Ambulance: road & air. Domiciliary hospitalisation. AYUSH at empanelled hospitals. Organ donor expenses covered.",
  },
  {
    id: "B-BONUS",
    icon: "📈",
    title: "Cumulative Bonus & Restoration",
    content:
      "Cumulative Bonus: 25% SI increase per claim-free year; accumulates up to 100% of base SI. Restoration: 100% SI reinstated once per policy year for unrelated illness. Cumulative bonus resets on a major claim at renewal.",
  },
  {
    id: "B-MAT",
    icon: "🍼",
    title: "Delivery & New Born",
    content:
      "Maternity cover (normal & caesarean delivery) after 24-month waiting period. New born baby covered from day 1 of birth for medical expenses up to 10% of SI. Vaccination of new born covered up to age 1. In Utero Fetal surgery covered under in-patient hospitalisation.",
  },
  {
    id: "B-OPD",
    icon: "👁️",
    title: "OPD / Dental / Ophthalmic",
    content:
      "OPD consultations: up to ₹500 per visit, max 10 visits per year. Dental (non-accidental): ₹5,000 per year after 2-year waiting period. Ophthalmic — spectacles/contacts: ₹2,500 per year after 2-year waiting period. All OPD sub-limits subject to SI slab.",
  },
  {
    id: "B-ACC",
    icon: "🛡️",
    title: "Accidental Death & PTD",
    content:
      "Accidental death benefit: 100% SI paid as lump sum to nominee. Permanent Total Disability (PTD): 100% SI. Permanent Partial Disability (PPD): % of SI per schedule. No waiting period for accident claims. Benefit available from policy inception date.",
  },
  {
    id: "B-WAIT",
    icon: "⏳",
    title: "Waiting Periods & Optional Cover",
    content:
      "Initial waiting: 30 days (accidents exempt). PED: 48 months (36 months with portability credit). Specified diseases: 24 months. Maternity: 24 months. Optional add-ons: Critical Illness, Personal Accident top-up, OPD booster, international cover (requires min ₹25L SI).",
  },
  {
    id: "B-EXCL",
    icon: "🚫",
    title: "Key Exclusions",
    content:
      "Cosmetic/plastic surgery. Routine dental. Infertility & assisted reproduction. Self-inflicted injury. Substance/alcohol abuse. Hazardous activities & adventure sports. War/nuclear events. Unproven treatments. Obesity/weight-loss surgery. STDs. Refractive error correction (LASIK below ₹7.5 dioptres unless covered by add-on).",
  },
];

const BASE_POLICIES = [
  { id: 1,  name: "Star Comprehensive Health",     code: "SHI-HC-001" },
  { id: 2,  name: "HDFC ERGO Optima Secure",       code: "HER-HS-002" },
  { id: 3,  name: "ICICI Lombard Complete Health", code: "ICL-HC-003" },
  { id: 6,  name: "LIC Jeevan Anand",              code: "LIC-LA-006" },
  { id: 7,  name: "HDFC Life Sanchay Plus",        code: "HDFC-LSP-007" },
  { id: 9,  name: "Star Senior Health",            code: "SHI-SH-009" },
  { id: 11, name: "Bajaj Allianz Health Guard",    code: "BAJ-HG-011" },
];

const COVERED_MEMBERS = [
  "Self",
  "Spouse",
  "Mother",
  "Father",
  "Mother in Law",
  "Father in Law",
];

const STANDARD_COMBINATIONS = [
  ['Self'],
  ['Self', 'Spouse'],
  ['Self', 'Child 1'],
  ['Self', 'Spouse', 'Child 1'],
  ['Self', 'Child 1', 'Child 2'],
  ['Self', 'Spouse', 'Child 1', 'Child 2'],
  ['Self', 'Mother'],
  ['Self', 'Father'],
  ['Self', 'Mother', 'Father'],
  ['Self', 'Spouse', 'Mother', 'Father'],
  ['Self', 'Spouse', 'Child 1', 'Mother', 'Father'],
  ['Self', 'Spouse', 'Child 1', 'Child 2', 'Mother', 'Father'],
  ['Self', 'Mother in Law'],
  ['Self', 'Father in Law'],
  ['Self', 'Mother in Law', 'Father in Law'],
  ['Self', 'Spouse', 'Mother in Law', 'Father in Law'],
  ['Self', 'Spouse', 'Child 1', 'Child 2', 'Mother in Law', 'Father in Law'],
];

function generateFamilyCombinations(selectedMembers) {
  const baseSelected = new Set(selectedMembers.map(m => m.replace(' (Handicap)', '')));
  const labelMap = {};
  selectedMembers.forEach(m => { labelMap[m.replace(' (Handicap)', '')] = m; });
  return STANDARD_COMBINATIONS
    .filter(combo => combo.every(m => baseSelected.has(m)))
    .map(combo => {
      const actualMembers = combo.map(m => labelMap[m] || m);
      return { key: actualMembers.join('+'), members: actualMembers };
    });
}

export default function ProductForm({
  form,
  set,
  setFile,
  setArr,
  setPremium,
  productId,
  initialMembers,
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
}) {
  const [activeToc, setActiveToc] = useState(null);
  const [activeTocDoc, setActiveTocDoc] = useState("policyWordings");
  const [viewingDoc, setViewingDoc] = useState(null);
  const [policyToc, setPolicyToc] = useState(POLICY_TOC);
  const [brochureToc, setBrochureToc] = useState(BROCHURE_TOC);
  const [editingTocId, setEditingTocId] = useState(null);
  const [tocDraft, setTocDraft] = useState({ title: '', content: '' });
  const [coveredMembers, setCoveredMembers] = useState(() => new Set(initialMembers?.length ? initialMembers : ["Self"]));
  const [handicapFlags, setHandicapFlags] = useState({});
  const [childCount, setChildCount] = useState(0);
  const [childHandicaps, setChildHandicaps] = useState([]);
  const [sumInsuredList, setSumInsuredList] = useState(() => {
    const rows = PREMIUM_CHART[productId] ?? [];
    if (rows.length === 0) return [{ id: Date.now(), value: '', gst: '0' }];
    return rows.map((r, i) => ({ id: i + 1, value: String(r.sumInsured), gst: '0' }));
  });
  const [premiumMatrix, setPremiumMatrix] = useState({});
  const [removedCombos, setRemovedCombos] = useState(new Set());
  const [docState, setDocState] = useState({
    policyWordingsFile: {
      status: "uploaded",
      url: policyWordingsPdf,
      meta: { name: "StarHealthAssure_PolicyWordings_V2_2022.pdf", size: "2.4 MB", pages: 20, date: "15 Mar 2025" },
    },
    brochureFile: {
      status: "uploaded",
      url: brochurePdf,
      meta: { name: "Brochure_StarComprehensive_V18_2025.pdf", size: "1.1 MB", pages: 13, date: "15 Mar 2025" },
    },
  });

  const toggleMember = (name) =>
    setCoveredMembers((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const toggleHandicap = (child) =>
    setHandicapFlags((prev) => ({ ...prev, [child]: !prev[child] }));

  const selectedMembers = [
    ...COVERED_MEMBERS.flatMap((m) => {
      if (!coveredMembers.has(m)) return [];
      return [m];
    }),
    ...Array.from({ length: childCount }, (_, i) =>
      childHandicaps[i] ? `Child ${i + 1} (Handicap)` : `Child ${i + 1}`
    ),
  ];

  // All power-set combinations with Self always first
  const nonSelfMembers = selectedMembers.filter(m => m !== 'Self');
  const allCombos = (() => {
    if (!selectedMembers.includes('Self')) return selectedMembers.map(m => m);
    const result = [];
    const n = nonSelfMembers.length;
    for (let mask = 0; mask < (1 << n); mask++) {
      const combo = ['Self'];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) combo.push(nonSelfMembers[i]);
      }
      result.push(combo.join('+'));
    }
    return result;
  })();
  const visibleCombos = allCombos.filter(c => !removedCombos.has(c));

  const updateCellPremium = (label, siId, value) =>
    setPremiumMatrix(prev => ({
      ...prev,
      [label]: { ...(prev[label] ?? {}), [siId]: value },
    }));

  const replaceDoc = (field) =>
    setDocState((prev) => ({ ...prev, [field]: { ...prev[field], status: "replacing" } }));

  const cancelReplace = (field) =>
    setDocState((prev) => ({ ...prev, [field]: { ...prev[field], status: "uploaded" } }));

  const startEditToc = (item) => {
    setEditingTocId(item.id);
    setTocDraft({ title: item.title, content: item.content });
  };
  const saveEditToc = (docKey) => {
    const setter = docKey === 'policyWordings' ? setPolicyToc : setBrochureToc;
    setter(prev => prev.map(i => i.id === editingTocId ? { ...i, ...tocDraft } : i));
    setEditingTocId(null);
  };
  const cancelEditToc = () => setEditingTocId(null);

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocState((prev) => ({
      ...prev,
      [field]: {
        status: "uploaded",
        file,
        meta: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          pages: "—",
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        },
      },
    }));
    setFile(field)(e);
  };

  return (
    <form onSubmit={onSubmit}>
      {/* ── 1. Basic Information ──────────────────── */}
      <SectionBlock icon="📦" title="Basic Information">
        <div className="form-grid">
          <Field label="Insurance Type" required style={{ gridColumn: '1 / -1' }}>
            <Select
              value={form.insuranceType}
              onChange={set("insuranceType")}
              required
            >
              <option value="">Select type</option>
              <option>Health</option>
              <option>Motor</option>
              <option>Life</option>
              <option>Travel</option>
              <option>Home</option>
              <option>Fire</option>
              <option>Marine</option>
            </Select>
          </Field>
          <Field label="Product Name" required>
            <Input
              placeholder="e.g. Star Comprehensive Health"
              value={form.productName}
              onChange={set("productName")}
              required
            />
          </Field>
          <Field label="Product Code" required>
            <Input
              placeholder="e.g. SHI-HC-001"
              value={form.productCode}
              onChange={set("productCode")}
              required
            />
          </Field>
          <Field label="Insurance Company (IC)" required>
            <Select value={form.icName} onChange={set("icName")} required>
              <option value="">Select IC</option>
              {IC_LIST.map((ic) => (
                <option key={ic}>{ic}</option>
              ))}
            </Select>
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={set("category")} required>
              <option value="">Select category</option>
              <option>Individual</option>
              <option>Family</option>
              <option>Group</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={set("status")}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </Field>
          <Field label="Policy Type" required>
            <Select value={form.policyType} onChange={set("policyType")} required>
              <option>Base</option>
              <option>Top-up</option>
              <option>Super Top-up</option>
              <option>Comprehensive</option>
            </Select>
          </Field>
          {(form.policyType === "Top-up" || form.policyType === "Super Top-up") && (
            <Field label="Link to Base Policy">
              <Select value={form.basePolicyId} onChange={set("basePolicyId")}>
                <option value="">Select base policy</option>
                {BASE_POLICIES.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </SectionBlock>

      {/* ── 2. Sum Assured ───────────────────────── */}
      <SectionBlock icon="💹" title="Sum Assured">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sumInsuredList.map((si, i) => (
            <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 22, textAlign: 'right' }}>#{i + 1}</span>
              <Input
                type="number"
                min="0"
                placeholder="e.g. 500000"
                value={si.value}
                onChange={e => setSumInsuredList(prev => prev.map(s => s.id === si.id ? { ...s, value: e.target.value } : s))}
                style={{ maxWidth: 160 }}
              />
              <Select
                value={si.gst}
                onChange={e => setSumInsuredList(prev => prev.map(s => s.id === si.id ? { ...s, gst: e.target.value } : s))}
                style={{ maxWidth: 110 }}
              >
                <option value="0">0% GST</option>
                <option value="5">5% GST</option>
                <option value="12">12% GST</option>
                <option value="18">18% GST</option>
              </Select>
              <button
                type="button"
                onClick={() => setSumInsuredList(prev => prev.filter(s => s.id !== si.id))}
                disabled={sumInsuredList.length === 1}
                style={{ background: 'none', border: 'none', cursor: sumInsuredList.length === 1 ? 'not-allowed' : 'pointer', fontSize: 18, color: sumInsuredList.length === 1 ? 'var(--border)' : 'var(--text-3)', lineHeight: 1, padding: '2px 4px' }}
              >×</button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 13, padding: '5px 14px', marginTop: 4 }}
              onClick={() => setSumInsuredList(prev => [...prev, { id: Date.now(), value: '', gst: '0' }])}
            >+ Add Sum Assured</button>
          </div>
        </div>
      </SectionBlock>

      {/* ── 3. Configuration ─────────────────────── */}
      <SectionBlock icon="⚙️" title="Configuration">
        <Field label="Covered Members">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px 24px",
              paddingTop: 6,
            }}
          >
            {COVERED_MEMBERS.map((member) => {
              const isChecked = coveredMembers.has(member);
              return (
                <div key={member} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleMember(member)}
                    />
                    {member}
                  </label>
                </div>
              );
            })}

            {/* Children — dynamic counter + per-child handicap */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14 }}>Children</span>
                <div style={{ display: "flex", alignItems: "center", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setChildCount(c => Math.max(0, c - 1));
                      setChildHandicaps(prev => prev.slice(0, -1));
                    }}
                    style={{ width: 30, height: 30, border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: "var(--text-2)", lineHeight: 1 }}
                  >−</button>
                  <span style={{ minWidth: 28, textAlign: "center", fontSize: 14, fontWeight: 600, color: childCount > 0 ? "var(--brand)" : "var(--text-3)" }}>{childCount}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setChildCount(c => c + 1);
                      setChildHandicaps(prev => [...prev, false]);
                    }}
                    style={{ width: 30, height: 30, border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: "var(--text-2)", lineHeight: 1 }}
                  >+</button>
                </div>
              </div>
              {childCount > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", paddingLeft: 4 }}>
                  {Array.from({ length: childCount }, (_, i) => (
                    <label
                      key={i}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        cursor: "pointer", fontSize: 13,
                        background: childHandicaps[i] ? "#ede9fe" : "var(--surface-2)",
                        color: childHandicaps[i] ? "var(--brand)" : "var(--text-3)",
                        border: `1px solid ${childHandicaps[i] ? "var(--brand)" : "var(--border)"}`,
                        borderRadius: 99, padding: "3px 10px", transition: "all .12s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!childHandicaps[i]}
                        onChange={() => setChildHandicaps(prev => prev.map((v, j) => j === i ? !v : v))}
                        style={{ accentColor: "var(--brand)", width: 12 }}
                      />
                      Child {i + 1} ♿ Handicap
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Field>
      </SectionBlock>

      {/* ── 4. Financial Details ──────────────────── */}
      <SectionBlock icon="💰" title="Financial Details">
        {selectedMembers.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            Select covered members in the Configuration section to build the premium table.
          </p>
        ) : sumInsuredList.every(s => !s.value) ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            Add Sum Assured values in the Sum Assured section to build the premium table.
          </p>
        ) : (
          <>
          <div className="table-wrap" style={{ maxHeight: 450, overflowY: 'auto' }}>
            <table style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 200, background: 'var(--surface-2)' }}>Family Combination</th>
                  {sumInsuredList.map((si, i) => (
                    <th key={si.id} style={{ minWidth: 150, textAlign: 'center' }}>
                      <div style={{ fontWeight: 700 }}>₹{si.value ? Number(si.value).toLocaleString('en-IN') : `SI ${i + 1}`}</div>
                      <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-3)', marginTop: 2 }}>GST {si.gst}%</div>
                    </th>
                  ))}
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {visibleCombos.map((label) => {
                  const isHandicap = label.includes('(Handicap)');
                  return (
                    <tr key={label}>
                      <td style={{ fontWeight: 500, background: 'var(--surface-2)', whiteSpace: 'nowrap', paddingRight: 12 }}>
                        {isHandicap && <span style={{ marginRight: 4 }}>♿</span>}{label}
                      </td>
                      {sumInsuredList.map(si => (
                        <td key={si.id}>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={premiumMatrix[label]?.[si.id] ?? ''}
                            onChange={e => updateCellPremium(label, si.id, e.target.value)}
                          />
                        </td>
                      ))}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          title="Remove row"
                          onClick={() => setRemovedCombos(prev => new Set([...prev, label]))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)', lineHeight: 1, padding: '2px 6px' }}
                        >×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {removedCombos.size > 0 && (
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '4px 12px', color: 'var(--brand)' }}
                onClick={() => setRemovedCombos(new Set())}
              >↺ Restore {removedCombos.size} removed row{removedCombos.size > 1 ? 's' : ''}</button>
            </div>
          )}
          </>
        )}
      </SectionBlock>

      {/* ── 3. Documents ─────────────────────────── */}
      <SectionBlock icon="📄" title="Documents">
        <div className="pf-doc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Left — file cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { field: "policyWordingsFile", label: "Policy Wordings Document", hint: "PDF only, max 20MB" },
              { field: "brochureFile", label: "Brochure / Sales Material", hint: "PDF, JPG or PNG" },
            ].map(({ field, label, hint }) => {
              const doc = docState[field];
              return (
                <Field key={field} label={label}>
                  {doc.status === "uploaded" ? (
                    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", padding: "12px 14px", background: "var(--surface-2)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>📄</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {doc.meta.name}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 3 }}>
                            {doc.meta.size} · {doc.meta.pages} pages · Uploaded {doc.meta.date}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: 13, padding: "4px 12px" }}
                          onClick={() => setViewingDoc(field)}
                        >
                          View
                        </button>
                        <button type="button" className="btn btn-ghost" style={{ fontSize: 13, padding: "4px 12px" }} onClick={() => replaceDoc(field)}>
                          Replace
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadBox label={`Upload new ${label}`} hint={hint} onChange={handleFileUpload(field)} />
                      <button type="button" className="btn btn-ghost" style={{ fontSize: 13, marginTop: 6 }} onClick={() => cancelReplace(field)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </Field>
              );
            })}
          </div>

          {/* Right — TOC panel */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "11px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📑</span>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>Table of Contents</span>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
              {[
                { key: "policyWordings", label: "Policy Wordings" },
                { key: "brochure", label: "Brochure" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { setActiveTocDoc(key); setActiveToc(null); }}
                  style={{
                    flex: 1, padding: "9px 12px", border: "none", cursor: "pointer",
                    background: activeTocDoc === key ? "white" : "var(--surface-2)",
                    borderBottom: activeTocDoc === key ? "2px solid var(--brand)" : "2px solid transparent",
                    color: activeTocDoc === key ? "var(--brand)" : "var(--text-3)",
                    fontWeight: activeTocDoc === key ? 600 : 400,
                    fontSize: 13.5, fontFamily: "inherit",
                    marginBottom: activeTocDoc === key ? -1 : 0,
                    transition: "all .12s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {(activeTocDoc === "policyWordings" ? policyToc : brochureToc).map((item) => {
                const isOpen    = activeToc === item.id;
                const isEditing = editingTocId === item.id;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => { if (!isEditing) setActiveToc(prev => prev === item.id ? null : item.id); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        width: "100%", padding: "10px 16px", textAlign: "left",
                        background: isOpen ? "var(--brand-light)" : "transparent",
                        border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer",
                        fontFamily: "inherit", transition: "background .12s",
                        color: isOpen ? "var(--brand)" : "var(--text)",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span>{item.icon}</span>
                        <span style={{ fontWeight: isOpen ? 600 : 400 }}>{item.title}</span>
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-3)", flexShrink: 0 }}>
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "12px 16px 14px", background: "var(--brand-light)", borderBottom: "1px solid var(--border)" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Title</div>
                              <input
                                type="text"
                                value={tocDraft.title}
                                onChange={e => setTocDraft(p => ({ ...p, title: e.target.value }))}
                                style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1.5px solid var(--border)", borderRadius: 6, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
                              />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", marginBottom: 4 }}>Content</div>
                              <textarea
                                value={tocDraft.content}
                                onChange={e => setTocDraft(p => ({ ...p, content: e.target.value }))}
                                rows={5}
                                style={{ width: "100%", padding: "7px 10px", fontSize: 13.5, border: "1.5px solid var(--border)", borderRadius: 6, fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.75 }}
                              />
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={cancelEditToc}>Cancel</button>
                              <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEditToc(activeTocDoc)}>Save</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75, marginBottom: 10 }}>
                              {item.content}
                            </div>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              onClick={e => { e.stopPropagation(); startEditToc(item); }}
                              style={{ fontSize: 13, padding: "4px 12px" }}
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {viewingDoc && (
          <DocumentViewerModal
            value={docState[viewingDoc]?.file || docState[viewingDoc]?.url}
            onClose={() => setViewingDoc(null)}
          />
        )}
      </SectionBlock>

      {/* ── 4. Coverage ───────────────────────────── */}
      <SectionBlock icon="🛡️" title="Coverage Details">
        <div style={{ marginBottom: 18 }}>
          <Field label="Coverage Highlights">
            <Textarea
              placeholder="Describe key coverage points, in-patient hospitalisation, pre & post hospitalisation, day care procedures…"
              value={form.coverageDetails}
              onChange={set("coverageDetails")}
              style={{ minHeight: 120 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Add-ons / Riders">
            <div style={{ paddingTop: 8 }}>
              <CheckboxGroup
                options={ADDONS}
                selected={form.addOns}
                onChange={setArr("addOns")}
              />
            </div>
          </Field>
        </div>
      </SectionBlock>

      {/* ── 5. Policy Details ─────────────────────── */}
      <SectionBlock icon="📋" title="Policy Details">
        <div style={{ marginBottom: 18 }}>
          <Field label="Tenure Options">
            <div style={{ paddingTop: 8 }}>
              <CheckboxGroup
                options={TENURES}
                selected={form.tenureOptions}
                onChange={setArr("tenureOptions")}
              />
            </div>
          </Field>
        </div>
        <div className="form-grid">
          <Field label="Waiting Period (days)" required>
            <Input
              type="number"
              min="0"
              placeholder="e.g. 30"
              value={form.waitingPeriod}
              onChange={set("waitingPeriod")}
              required
            />
          </Field>
          <Field label="Room Rent Limit">
            <Select value={form.roomRentLimit} onChange={set("roomRentLimit")}>
              <option value="">Select limit</option>
              <option>No Limit</option>
              <option>1% of Sum Insured per day</option>
              <option>2% of Sum Insured per day</option>
              <option>₹3,000 per day</option>
              <option>₹5,000 per day</option>
              <option>₹10,000 per day</option>
              <option>Single AC Room</option>
            </Select>
          </Field>
          <Field label="Waiting Period For Disease" className="col-span-2">
            <Textarea
              placeholder="e.g. Pre-existing diseases covered after 36 months, Maternity after 2 years…"
              value={form.diseaseRestrictions}
              onChange={set("diseaseRestrictions")}
            />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 6. Terms & Conditions ────────────────── */}
      <SectionBlock >
        <div className="form-grid">
          <Field label="Eligibility Criteria" required>
            <Textarea
              placeholder="e.g. Persons between 18–65 years. Dependent children up to 25 years…"
              value={form.eligibilityCriteria}
              onChange={set("eligibilityCriteria")}
              required
            />
          </Field>
          <Field label="Exclusions">
            <Textarea
              placeholder="e.g. Cosmetic surgery, self-inflicted injuries, war-related injuries…"
              value={form.exclusions}
              onChange={set("exclusions")}
            />
          </Field>
          <Field label="Min Age (years)">
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="18"
              value={form.ageMin}
              onChange={set("ageMin")}
            />
          </Field>
          <Field label="Max Age (years)">
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="65"
              value={form.ageMax}
              onChange={set("ageMax")}
            />
          </Field>
          <Field label="Geography">
            <Select value={form.geography} onChange={set("geography")}>
              <option value="">Select geography</option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Additional Notes">
            <Textarea
              placeholder="Any additional terms, conditions or notes…"
              value={form.notes}
              onChange={set("notes")}
            />
          </Field>
        </div>
      </SectionBlock>

      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}
