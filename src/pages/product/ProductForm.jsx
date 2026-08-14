import { useState } from "react";
import {
  Field,
  Input,
  Select,
  Textarea,
  UploadBox,
  SectionBlock,
} from "../../components/Field";
import { FormActions } from "../../components/UI";
import { DocumentViewerModal } from "../../components/fields/DocumentViewerModal";
import policyWordingsPdf from "../../assets/StarHealthAssureInsurancePolicy-Policy-wording.pdf";
import brochurePdf from "../../assets/Brochure_Star_Comprehensive_Insurance_Policy_V_15_Web_633bcfcaaf.pdf";
import { PREMIUM_CHART, AGE_BAND_LABELS, PRODUCTS } from "./productData";
import { formatDate } from "../../utils/date";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useToast } from "../../context/ToastContext";

const MOCK_DOC_META = {
  policyWordingsFile: { url: policyWordingsPdf, name: "StarHealthAssure_PolicyWordings_V2_2022.pdf", size: "2.4 MB", pages: 20 },
  brochureFile: { url: brochurePdf, name: "Brochure_StarComprehensive_V18_2025.pdf", size: "1.1 MB", pages: 13 },
};

const BASE_POLICIES = PRODUCTS.filter(p => p.policyType === "Base Policy");

const IC_LIST = [
  "Star Health Insurance",
  "HDFC ERGO",
  "HDFC ERGO General Insurance Company Limited",
  "ICICI Lombard",
  "Bajaj Allianz",
  "New India Assurance",
  "LIC",
  "HDFC Life",
  "SBI Life",
  "SBI General Insurance Company Limited",
  "Reliance General",
  "Tata AIG",
  "Go Digit General Insurance Limited",
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
  initialGst = "0",
  onSubmit,
  onCancel,
  submitLabel = "Save Product",
}) {
  const toast = useToast();
  const fv = useFormValidation(form, {
    productName: { required: true, label: "Product Name" },
    productCode: { required: true, label: "Product Code" },
    icName: { required: true, label: "Insurance Company (IC)" },
    category: { required: true, label: "Category" },
    policyType: { required: true, label: "Product Type" },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fv.validateAll()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success(productId ? "Product updated successfully." : "Product created successfully.");
    onSubmit(e);
  };

  const [activeToc, setActiveToc] = useState(null);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [policyToc, setPolicyToc] = useState(POLICY_TOC);
  const [editingTocId, setEditingTocId] = useState(null);
  const [tocDraft, setTocDraft] = useState({ title: '', content: '' });
  const [coveredMembers, setCoveredMembers] = useState(() => new Set(initialMembers?.length ? initialMembers : ["Self"]));
  const [handicapFlags, setHandicapFlags] = useState({});
  const [childCount, setChildCount] = useState(() =>
    (initialMembers ?? []).filter(m => /^Child \d+/.test(m)).length
  );
  const [childHandicaps, setChildHandicaps] = useState(() => {
    const children = (initialMembers ?? []).filter(m => /^Child \d+/.test(m));
    return children.map(m => m.includes("(Handicap)"));
  });
  // Sum Assured is the set of *distinct* sumInsured values in the chart —
  // a product priced by age band repeats each sumInsured once per band, so
  // grouping by value (not by raw row) keeps this list to the real tiers.
  const [sumInsuredList, setSumInsuredList] = useState(() => {
    const rows = PREMIUM_CHART[productId] ?? [];
    if (rows.length === 0) return [{ id: Date.now(), value: '' }];
    const uniqueSI = [...new Set(rows.map(r => r.sumInsured))];
    return uniqueSI.map((si, i) => ({ id: i + 1, value: String(si) }));
  });
  const [gst, setGst] = useState(initialGst);
  const [premiumMatrix, setPremiumMatrix] = useState(() => {
    const rows = PREMIUM_CHART[productId] ?? [];
    if (rows.length === 0) return {};
    const uniqueSI = [...new Set(rows.map(r => r.sumInsured))];
    const siIdFor = (si) => uniqueSI.indexOf(si) + 1;
    const hasBands = rows.some(r => r.ageBandId != null);
    // Historical PREMIUM_CHART rows predate the Threshold feature and carry no
    // threshold of their own — file them under threshold id 1, which is also
    // where `thresholds` defaults to, so they line up with currentGroupId.
    const hasThresholdInit = (form.policyType === "Top-up" && form.linkBasePolicy === "Yes") || form.policyType === "Super Top-up";
    const matrix = {};
    rows.forEach(r => {
      const bandId = hasBands ? r.ageBandId : 1;
      const groupKey = hasThresholdInit ? `1_${bandId}` : bandId;
      const siId = siIdFor(r.sumInsured);
      const band = matrix[groupKey] ?? (matrix[groupKey] = {});
      if (r.selfOnly != null)
        band['Self'] = { ...(band['Self'] ?? {}), [siId]: String(r.selfOnly) };
      if (r.selfSpouse != null)
        band['Self+Spouse'] = { ...(band['Self+Spouse'] ?? {}), [siId]: String(r.selfSpouse) };
      if (r.selfSpouse2Children != null)
        band['Self+Spouse+Child 1+Child 2'] = { ...(band['Self+Spouse+Child 1+Child 2'] ?? {}), [siId]: String(r.selfSpouse2Children) };
    });
    return matrix;
  });
  // Discount Configuration — value(s) only collected once a Discount Type is
  // chosen. Shape depends on discountLevel: a flat value for "Product", or one
  // entry per Sum Assured tier for "Sum Insured".
  const [siDiscounts, setSiDiscounts] = useState({});
  // "At Actual" discount type skips levels entirely — the admin types the final
  // discounted premium straight into the Premium Chart, one cell at a time.
  const [actualDiscountMatrix, setActualDiscountMatrix] = useState({});
  const [removedCombos, setRemovedCombos] = useState(new Set());
  // One row per distinct ageBandId in the chart. From/To come from
  // AGE_BAND_LABELS when the product defines them; otherwise they start
  // blank for the admin to fill in (the chart itself only stores the band id).
  const [ageBands, setAgeBands] = useState(() => {
    const rows = PREMIUM_CHART[productId] ?? [];
    const bandIds = [...new Set(rows.map(r => r.ageBandId).filter(v => v != null))];
    if (bandIds.length === 0) return [{ id: 1, from: '', to: '' }];
    const labels = AGE_BAND_LABELS[productId];
    return bandIds.map(bandId => ({
      id: bandId,
      from: labels?.[bandId]?.from ?? '',
      to: labels?.[bandId]?.to ?? '',
    }));
  });
  const [activeAgeBandId, setActiveAgeBandId] = useState(null);
  // Threshold — only used for a Top-up linked to a Base policy. Seeded from
  // the linked base's own Sum Assured values when one is selected; otherwise
  // starts as a single blank row, same as Sum Assured.
  const [thresholds, setThresholds] = useState(() => {
    if (!form.linkedBaseId) return [{ id: 1, value: '' }];
    const rows = PREMIUM_CHART[Number(form.linkedBaseId)] ?? [];
    const uniqueSI = [...new Set(rows.map(r => r.sumInsured))];
    return uniqueSI.length > 0
      ? uniqueSI.map((si, i) => ({ id: i + 1, value: String(si) }))
      : [{ id: 1, value: '' }];
  });
  const [activeThresholdId, setActiveThresholdId] = useState(null);

  const [docState, setDocState] = useState({
    policyWordingsFile: { status: "empty" },
    brochureFile: { status: "empty" },
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

  // All power-set combinations of selected members
  const allCombos = (() => {
    const n = selectedMembers.length;
    const result = [];
    for (let mask = 1; mask < (1 << n); mask++) {
      const combo = [];
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) combo.push(selectedMembers[i]);
      }
      result.push(combo.join('+'));
    }
    return result;
  })();
  const visibleCombos = allCombos.filter(c => !removedCombos.has(c));

  const currentAgeBandId = ageBands.some(b => b.id === activeAgeBandId) ? activeAgeBandId : ageBands[0]?.id;
  // Discount Configuration only applies to Base products — the Discount Type
  // select itself is the enabler; leaving it on the "Select" placeholder means
  // no discount is configured.
  const showDiscount = form.policyType === "Base" && !!form.discountType;
  const isLinkedTopup = form.policyType === "Top-up" && form.linkBasePolicy === "Yes";
  // Threshold applies to a Top-up linked to a Base policy, or to any Super Top-up.
  const hasThreshold = isLinkedTopup || form.policyType === "Super Top-up";
  const currentThresholdId = thresholds.some(t => t.id === activeThresholdId) ? activeThresholdId : thresholds[0]?.id;
  // Threshold and Age Band can both apply to the same product, so the premium
  // chart keys on a composite of whichever axes are active — each combination
  // of selected threshold + age band gets its own independent premium grid.
  const currentGroupId = hasThreshold ? `${currentThresholdId}_${currentAgeBandId}` : currentAgeBandId;

  const updateCellPremium = (ageBandId, label, siId, value) =>
    setPremiumMatrix(prev => ({
      ...prev,
      [ageBandId]: {
        ...(prev[ageBandId] ?? {}),
        [label]: { ...(prev[ageBandId]?.[label] ?? {}), [siId]: value },
      },
    }));

  // Derives the discounted rate for one premium cell from Discount Configuration —
  // the discount value looked up depends on discountLevel (flat / per-SI).
  // Not used for "At Actual", which is typed straight into the Premium Chart instead.
  const computeDiscountedRate = (rate, siId) => {
    if (!showDiscount || rate === '' || rate == null) return null;
    const discountVal = form.discountLevel === "Sum Insured" ? siDiscounts[siId] : form.discountValue;
    if (discountVal === '' || discountVal == null) return null;
    const rateNum = parseFloat(rate) || 0;
    const discNum = parseFloat(discountVal) || 0;
    if (form.discountType === "Fixed") return Math.max(0, rateNum - discNum).toFixed(2);
    return Math.max(0, rateNum - (rateNum * discNum) / 100).toFixed(2);
  };

  const updateCellActualDiscount = (ageBandId, label, siId, value) =>
    setActualDiscountMatrix(prev => ({
      ...prev,
      [ageBandId]: {
        ...(prev[ageBandId] ?? {}),
        [label]: { ...(prev[ageBandId]?.[label] ?? {}), [siId]: value },
      },
    }));

  const replaceDoc = (field) =>
    setDocState((prev) => ({ ...prev, [field]: { ...prev[field], status: "replacing" } }));

  const cancelReplace = (field) =>
    setDocState((prev) => ({ ...prev, [field]: { ...prev[field], status: "uploaded" } }));

  const startEditToc = (item) => {
    setEditingTocId(item.id);
    setTocDraft({ title: item.title, content: item.content });
  };
  const saveEditToc = () => {
    setPolicyToc(prev => prev.map(i => i.id === editingTocId ? { ...i, ...tocDraft } : i));
    setEditingTocId(null);
  };
  const cancelEditToc = () => setEditingTocId(null);

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mock = MOCK_DOC_META[field];
    setDocState((prev) => ({
      ...prev,
      [field]: {
        status: "uploaded",
        url: mock.url,
        meta: {
          name: mock.name,
          size: mock.size,
          pages: mock.pages,
          date: formatDate(new Date().toLocaleDateString("en-CA")),
        },
      },
    }));
    setFile(field)(e);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── 1. Basic Information ──────────────────── */}
      <SectionBlock icon="📦" title="Basic Information">
        <div className="form-grid-3">
          <Field label="Insurance Company (IC)" required error={fv.fieldProps("icName").error}>
            <Select value={form.icName} onChange={set("icName")} required {...fv.fieldProps("icName")}>
              <option value="">Select IC</option>
              {IC_LIST.map((ic) => (
                <option key={ic}>{ic}</option>
              ))}
            </Select>
          </Field>
          <Field label="Product Name" required error={fv.fieldProps("productName").error}>
            <Input
              placeholder="e.g. Star Comprehensive Health"
              value={form.productName}
              onChange={set("productName")}
              required
              {...fv.fieldProps("productName")}
            />
          </Field>
          <Field label="Product Code" required error={fv.fieldProps("productCode").error}>
            <Input
              placeholder="e.g. SHI-HC-001"
              value={form.productCode}
              onChange={set("productCode")}
              required
              {...fv.fieldProps("productCode")}
            />
          </Field>
          <Field label="Category" required error={fv.fieldProps("category").error}>
            <Select value={form.category} onChange={set("category")} required {...fv.fieldProps("category")}>
              <option value="">Select category</option>
              <option>Individual</option>
              <option>Family</option>
              <option>Group</option>
            </Select>
          </Field>
          <Field label="Product Description" style={{ gridColumn: '1 / -1' }}>
            <Textarea
              placeholder="Brief description of the product"
              value={form.productDescription}
              onChange={set("productDescription")}
              style={{ minHeight: 80 }}
            />
          </Field>
          <Field label="Product Type" required error={fv.fieldProps("policyType").error}>
            <Select value={form.policyType} onChange={set("policyType")} required {...fv.fieldProps("policyType")}>
              <option>Base</option>
              <option>Top-up</option>
              <option>Super Top-up</option>
              <option>Comprehensive</option>
            </Select>
          </Field>
          {form.policyType === "Top-up" && (
            <Field label="Do you want to link base Policy?">
              <Select
                value={form.linkBasePolicy || 'No'}
                onChange={e => {
                  set('linkBasePolicy')(e);
                  if (e.target.value === 'No') {
                    set('linkedBaseId')({ target: { value: '' } });
                    setThresholds([{ id: Date.now(), value: '' }]);
                  }
                }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </Select>
            </Field>
          )}
          {form.policyType === "Top-up" && form.linkBasePolicy === "Yes" && (
            <Field label="Select Base Policy" style={{ gridColumn: '1 / -1' }}>
              <Select
                value={form.linkedBaseId || ''}
                onChange={e => {
                  set('linkedBaseId')(e);
                  const baseId = Number(e.target.value);
                  const rows = PREMIUM_CHART[baseId] ?? [];
                  const uniqueSI = [...new Set(rows.map(r => r.sumInsured))];
                  setThresholds(
                    uniqueSI.length > 0
                      ? uniqueSI.map((si, i) => ({ id: i + 1, value: String(si) }))
                      : [{ id: Date.now(), value: '' }]
                  );
                }}
              >
                <option value="">Select base policy</option>
                {BASE_POLICIES.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                ))}
              </Select>
            </Field>
          )}
        </div>
      </SectionBlock>

      {/* ── Threshold (Top-up linked to a Base policy, or any Super Top-up) ── */}
      {hasThreshold && (
        <SectionBlock icon="🎯" title="Threshold">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {thresholds.map((th, i) => (
              <div key={th.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 22, textAlign: 'right' }}>#{i + 1}</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 500000"
                  value={th.value}
                  onChange={e => setThresholds(prev => prev.map(t => t.id === th.id ? { ...t, value: e.target.value } : t))}
                  style={{ maxWidth: 160, textAlign: 'right' }}
                />
                <button
                  type="button"
                  onClick={() => setThresholds(prev => prev.filter(t => t.id !== th.id))}
                  disabled={thresholds.length === 1}
                  style={{ background: 'none', border: 'none', cursor: thresholds.length === 1 ? 'not-allowed' : 'pointer', fontSize: 18, color: thresholds.length === 1 ? 'var(--border)' : 'var(--text-3)', lineHeight: 1, padding: '2px 4px' }}
                >×</button>
              </div>
            ))}
            <div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '5px 14px', marginTop: 4 }}
                onClick={() => setThresholds(prev => [...prev, { id: Date.now(), value: '' }])}
              >+ Add Threshold</button>
            </div>
          </div>
        </SectionBlock>
      )}

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
                style={{ maxWidth: 160, textAlign: 'right' }}
              />
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
              onClick={() => setSumInsuredList(prev => [...prev, { id: Date.now(), value: '' }])}
            >+ Add Sum Assured</button>
          </div>
        </div>
      </SectionBlock>

      {/* ── 4. Age Band ───────────────────────────── */}
      <SectionBlock icon="🎂" title="Age Band">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ageBands.map((ab, i) => (
            <div key={ab.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--text-3)', minWidth: 22, textAlign: 'right' }}>#{i + 1}</span>
              <Input
                type="number"
                min="0"
                placeholder="From"
                value={ab.from}
                onChange={e => setAgeBands(prev => prev.map(a => a.id === ab.id ? { ...a, from: e.target.value } : a))}
                style={{ maxWidth: 120 }}
              />
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>to</span>
              <Input
                type="number"
                min="0"
                placeholder="To"
                value={ab.to}
                onChange={e => setAgeBands(prev => prev.map(a => a.id === ab.id ? { ...a, to: e.target.value } : a))}
                style={{ maxWidth: 120 }}
              />
              <button
                type="button"
                onClick={() => setAgeBands(prev => prev.filter(a => a.id !== ab.id))}
                disabled={ageBands.length === 1}
                style={{ background: 'none', border: 'none', cursor: ageBands.length === 1 ? 'not-allowed' : 'pointer', fontSize: 18, color: ageBands.length === 1 ? 'var(--border)' : 'var(--text-3)', lineHeight: 1, padding: '2px 4px' }}
              >×</button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 13, padding: '5px 14px', marginTop: 4 }}
              onClick={() => setAgeBands(prev => [...prev, { id: Date.now(), from: '', to: '' }])}
            >+ Add Age Band</button>
          </div>
        </div>
      </SectionBlock>

      {/* ── 5. Family ─────────────────────── */}
      <SectionBlock icon="⚙️" title="Family">
        <Field label="Covered Family Members">
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
                      style={{ width: 18, height: 18, accentColor: "var(--brand)", cursor: "pointer" }}
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
                        background: childHandicaps[i] ? "var(--brand-light)" : "var(--surface-2)",
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

      {/* ── Discount Configuration (Base products only) ─────────────────── */}
      {form.policyType === "Base" && (
      <SectionBlock icon="🏷️" title="Discount Configuration">
        <div className="form-grid-3">
          <Field label="Discount Type">
            <Select value={form.discountType || ''} onChange={set('discountType')}>
              <option value="">Select</option>
              <option value="Percent">Percentage (%)</option>
              <option value="Fixed">Fixed Amount</option>
              <option value="At Actual">Premium Chart</option>
            </Select>
          </Field>
          {form.discountType && form.discountType !== "At Actual" && (
            <Field label="Discount Applicable On">
              <Select value={form.discountLevel || 'Product'} onChange={set('discountLevel')}>
                <option value="Product">Entire Product</option>
                <option value="Sum Insured">Sum Insured</option>
              </Select>
            </Field>
          )}
        </div>

        {form.discountType === "At Actual" && (
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 14, marginBottom: 0 }}>
            Enter the discounted premium directly in the Premium Chart below.
          </p>
        )}

        {form.discountType && form.discountType !== "At Actual" && form.discountLevel === "Product" && (
          <div style={{ marginTop: 18 }}>
            <Field label={`Discount Value${form.discountType === 'Percent' ? ' (%)' : ''}`}>
              <Input
                type="number"
                min="0"
                placeholder={form.discountType === 'Percent' ? 'e.g. 10' : 'e.g. 500'}
                value={form.discountValue || ''}
                onChange={set('discountValue')}
                style={{ maxWidth: 200 }}
              />
            </Field>
          </div>
        )}

        {form.discountType && form.discountType !== "At Actual" && form.discountLevel === "Sum Insured" && (
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sumInsuredList.filter(si => si.value).length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
                Add Sum Assured values in the Sum Assured section to configure a discount per tier.
              </p>
            ) : sumInsuredList.filter(si => si.value).map(si => (
              <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', minWidth: 120 }}>
                  ₹{Number(si.value).toLocaleString('en-IN')}
                </span>
                <Input
                  type="number"
                  min="0"
                  placeholder={form.discountType === 'Percent' ? 'e.g. 10' : 'e.g. 500'}
                  value={siDiscounts[si.id] ?? ''}
                  onChange={e => setSiDiscounts(prev => ({ ...prev, [si.id]: e.target.value }))}
                  style={{ maxWidth: 160, textAlign: 'right' }}
                />
              </div>
            ))}
          </div>
        )}

      </SectionBlock>
      )}

      {/* ── 4. Premium Chart ──────────────────── */}
      <SectionBlock icon="💰" title="Premium Chart">
        {selectedMembers.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            Select covered members in the Family section to build the premium table.
          </p>
        ) : sumInsuredList.every(s => !s.value) ? (
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
            Add Sum Assured values in the Sum Assured section to build the premium table.
          </p>
        ) : (
          <>
          {hasThreshold && thresholds.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Threshold</span>
                {thresholds.map((th, i) => {
                  const active = currentThresholdId === th.id;
                  const rangeLabel = th.value ? `₹${Number(th.value).toLocaleString('en-IN')}` : `Threshold ${i + 1}`;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setActiveThresholdId(th.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                        border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                        background: active ? 'var(--brand-light)' : '#fff',
                        color: active ? 'var(--brand)' : 'var(--text-2)',
                      }}
                    >{rangeLabel}</button>
                  );
                })}
              </div>
              {thresholds.length > 1 && (
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>ℹ️</span>
                  Click a different threshold above to switch and enter premiums for that threshold — each threshold's values are saved separately.
                </div>
              )}
            </div>
          )}
          {ageBands.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.4px' }}>Age Band</span>
                {ageBands.map((ab, i) => {
                  const active = currentAgeBandId === ab.id;
                  const rangeLabel = ab.from || ab.to ? `${ab.from || '0'}–${ab.to || '∞'}` : `Band ${i + 1}`;
                  return (
                    <button
                      key={ab.id}
                      type="button"
                      onClick={() => setActiveAgeBandId(ab.id)}
                      style={{
                        padding: '5px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                        border: `1.5px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                        background: active ? 'var(--brand-light)' : '#fff',
                        color: active ? 'var(--brand)' : 'var(--text-2)',
                      }}
                    >{rangeLabel}</button>
                  );
                })}
              </div>
              {ageBands.length > 1 && (
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span>ℹ️</span>
                  Click a different age band above to switch and enter premiums for that band — each band's values are saved separately.
                </div>
              )}
            </div>
          )}
          <div className="table-wrap" style={{ maxHeight: 450, overflowY: 'auto' }}>
            <table style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ minWidth: 200, background: 'var(--surface-2)' }}>Family Combination</th>
                  {sumInsuredList.map((si, i) => (
                    <th key={si.id} style={{ minWidth: showDiscount ? 260 : 150, textAlign: 'center' }}>
                      <div style={{ fontWeight: 700 }}>₹{si.value ? Number(si.value).toLocaleString('en-IN') : `SI ${i + 1}`}</div>
                      {showDiscount && (
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.3px' }}>Premium</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '.3px' }}>Discounted Premium</span>
                        </div>
                      )}
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
                      {sumInsuredList.map(si => {
                        const rate = premiumMatrix[currentGroupId]?.[label]?.[si.id] ?? '';
                        const isAtActual = form.discountType === "At Actual";
                        const discountedRate = isAtActual
                          ? (actualDiscountMatrix[currentGroupId]?.[label]?.[si.id] ?? '')
                          : computeDiscountedRate(rate, si.id);
                        return (
                          <td key={si.id}>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={rate}
                                onChange={e => updateCellPremium(currentGroupId, label, si.id, e.target.value)}
                                style={{ textAlign: 'right', flex: 1 }}
                              />
                              {showDiscount && (
                                isAtActual ? (
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={discountedRate}
                                    onChange={e => updateCellActualDiscount(currentGroupId, label, si.id, e.target.value)}
                                    style={{ textAlign: 'right', flex: 1 }}
                                  />
                                ) : (
                                  <Input
                                    type="text"
                                    readOnly
                                    value={discountedRate ?? '—'}
                                    style={{ textAlign: 'right', flex: 1, background: 'var(--surface-2)', color: 'var(--text-2)' }}
                                  />
                                )
                              )}
                            </div>
                          </td>
                        );
                      })}
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

      {/* ── Policy Details ─────────────────────── */}
      <SectionBlock icon="📋" title="Policy Info">
        <div style={{ marginBottom: 18 }}>
          <Field label="About this Policy">
            <Textarea
              placeholder="A brief overview of what this policy is and what it offers…"
              value={form.aboutPolicy}
              onChange={set("aboutPolicy")}
              style={{ minHeight: 100 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Who should Buy">
            <Textarea
              placeholder="e.g. Individuals and families looking for comprehensive health coverage…"
              value={form.whoShouldBuy}
              onChange={set("whoShouldBuy")}
              style={{ minHeight: 100 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Key Benefits">
            <Textarea
              placeholder="e.g. Cashless treatment at 10,000+ hospitals, No claim bonus, Lifetime renewability…"
              value={form.keyBenefits}
              onChange={set("keyBenefits")}
              style={{ minHeight: 100 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Eligibility Criteria">
            <Textarea
              placeholder="e.g. Persons between 18–65 years. Dependent children up to 25 years…"
              value={form.eligibilityCriteria}
              onChange={set("eligibilityCriteria")}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Waiting Periods">
            <Textarea
              placeholder="e.g. Pre-existing diseases covered after 36 months, Maternity after 2 years…"
              value={form.waitingPeriods}
              onChange={set("waitingPeriods")}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Copayment">
            <Textarea
              placeholder="e.g. 10% copay above age 60, 20% for non-network hospitals…"
              value={form.copayment}
              onChange={set("copayment")}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="Maternity Benefit(s)">
            <Textarea
              placeholder="e.g. Covered after 2 years waiting period, up to ₹50,000 for normal delivery…"
              value={form.maternityBenefits}
              onChange={set("maternityBenefits")}
            />
          </Field>
        </div>
      </SectionBlock>

      {/* ── 4. Coverage ───────────────────────────── */}
      <SectionBlock icon="🛡️" title="Coverage Info">
        <div style={{ marginBottom: 18 }}>
          <Field label="What's covered">
            <Textarea
              placeholder="Describe key coverage points, in-patient hospitalisation, pre & post hospitalisation, day care procedures…"
              value={form.coverageDetails}
              onChange={set("coverageDetails")}
              style={{ minHeight: 120 }}
            />
          </Field>
        </div>
        <div style={{ marginBottom: 18 }}>
          <Field label="What's not covered">
            <Textarea
              placeholder="e.g. Cosmetic surgery, self-inflicted injuries, war-related injuries…"
              value={form.exclusions}
              onChange={set("exclusions")}
              style={{ minHeight: 120 }}
            />
          </Field>
        </div>
      </SectionBlock>

      {/* ── Documents ─────────────────────────── */}
      <SectionBlock icon="📄" title="Documents">
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Top row — file cards side by side */}
          <div className="pf-doc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
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
                      <UploadBox label={doc.status === "replacing" ? `Upload new ${label}` : `Upload ${label}`} hint={hint} onChange={handleFileUpload(field)} />
                      {doc.status === "replacing" && (
                        <button type="button" className="btn btn-ghost" style={{ fontSize: 13, marginTop: 6 }} onClick={() => cancelReplace(field)}>
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </Field>
              );
            })}
          </div>

          {/* Table of Contents — below, full width */}
          <div style={{ border: "1px solid var(--border)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "11px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <span>📑</span>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>Table of Contents</span>
            </div>

            {/* Accordion */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {policyToc.map((item) => {
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
                              <button type="button" className="btn btn-primary btn-sm" onClick={saveEditToc}>Save</button>
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

      {/* ── GST ───────────────────────────────── */}
      <SectionBlock icon="🧾" title="GST on Premium">
        <Field label="GST %">
          <Select value={gst} onChange={e => setGst(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="0">0% GST</option>
            <option value="5">5% GST</option>
            <option value="12">12% GST</option>
            <option value="18">18% GST</option>
          </Select>
        </Field>
      </SectionBlock>

      <FormActions onCancel={onCancel} submitLabel={submitLabel} />
    </form>
  );
}
