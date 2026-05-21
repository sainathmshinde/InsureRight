import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { useAuth } from "../../context/AuthContext";
import { Field, Input, Select, Textarea } from "../../components/fields";
import {
  Stepper,
  Button,
  StatusBadge,
  CheckboxGroup,
  Toggle,
} from "../../components/ui";
import {
  ShieldCheckIcon,
  PaymentIcon,
  CustomerIcon,
} from "../../icons";
import { PRODUCTS, PRODUCTS_BY_TYPE, POLICY_TYPE_ICON, PREMIUM_CHART, PRODUCT_DETAILS } from "../product/productData";
import { AGENTS as KMD_AGENTS } from "../agent/agentData";
import { INITIAL_LEADS, CAMPAIGNS } from "../crm/crmData";
import { POLICY_MOCK } from "./PolicyList";

// ── Shared customer data (same source of truth as CustomerList) ────────────
const CUSTOMERS = [
  {
    id: 1,
    name: "Aarav Sharma",
    mobile: "9876543210",
    email: "aarav@gmail.com",
    dob: "1990-03-15",
    gender: "Male",
    kyc: "Verified",
    policies: 2,
    address: "14, Green Valley Apartments, Andheri West, Mumbai",
    familyMembers: [
      { type: "Spouse",  name: "Priya Sharma", dob: "1992-07-22", gender: "Female" },
      { type: "Child 1", name: "Aryan Sharma", dob: "2016-02-10", gender: "Male"   },
      { type: "Child 2", name: "Aanya Sharma", dob: "2019-09-05", gender: "Female" },
    ],
  },
  {
    id: 2,
    name: "Rohit Sharma",
    mobile: "9812000000",
    email: "rohit@gmail.com",
    dob: "1990-11-20",
    gender: "Male",
    kyc: "Pending",
    policies: 0,
    address: "45 MG Road, Pune",
  },
  {
    id: 3,
    name: "Divya Nair",
    mobile: "9911223344",
    email: "divya@gmail.com",
    dob: "1978-06-05",
    gender: "Female",
    kyc: "Verified",
    policies: 3,
    address: "7/B Koramangala, Bangalore",
    familyMembers: [
      { type: "Spouse",  name: "Sandeep Nair", dob: "1975-04-10", gender: "Male"   },
      { type: "Child 1", name: "Rohan Nair",   dob: "2005-08-15", gender: "Male"   },
      { type: "Child 2", name: "Ankita Nair",  dob: "2008-11-20", gender: "Female" },
    ],
  },
  {
    id: 4,
    name: "Vijay Patil",
    mobile: "9011223344",
    email: "vijay@gmail.com",
    dob: "1995-09-30",
    gender: "Male",
    kyc: "Rejected",
    policies: 0,
    address: "23 Shivaji Nagar, Nashik",
  },
  {
    id: 5,
    name: "Suresh Kumar",
    mobile: "9988001122",
    email: "suresh@gmail.com",
    dob: "1985-03-20",
    gender: "Male",
    kyc: "Verified",
    policies: 1,
    address: "101 Deccan, Pune",
    familyMembers: [
      { type: "Spouse",  name: "Meena Kumar", dob: "1987-06-12", gender: "Female" },
      { type: "Child 1", name: "Aryan Kumar", dob: "2014-03-05", gender: "Male"   },
    ],
  },
  {
    id: 6,
    name: "Vikram Rao",
    mobile: "9944556677",
    email: "vikram@gmail.com",
    dob: "1975-08-20",
    gender: "Male",
    kyc: "Verified",
    policies: 2,
    address: "B-5 Sector 18, Noida",
    familyMembers: [
      { type: "Spouse",  name: "Sunita Rao",  dob: "1978-02-14", gender: "Female" },
      { type: "Child 1", name: "Karthik Rao", dob: "2003-07-19", gender: "Male"   },
      { type: "Child 2", name: "Preethi Rao", dob: "2007-01-08", gender: "Female" },
    ],
  },
  {
    id: 7,
    name: "Kavita Pillai",
    mobile: "9899112233",
    email: "kavita@gmail.com",
    dob: "1993-12-01",
    gender: "Female",
    kyc: "Verified",
    policies: 1,
    address: "56 Jubilee Hills, Hyderabad",
    familyMembers: [
      { type: "Spouse", name: "Arun Pillai", dob: "1990-05-22", gender: "Male" },
    ],
  },
  {
    id: 8,
    name: "Arjun Singh",
    mobile: "9922334455",
    email: "arjun@gmail.com",
    dob: "1987-03-22",
    gender: "Male",
    kyc: "Verified",
    policies: 0,
    address: "8 Andheri West, Mumbai",
    familyMembers: [
      { type: "Spouse",  name: "Neha Singh", dob: "1989-09-30", gender: "Female" },
      { type: "Child 1", name: "Dev Singh",  dob: "2015-12-10", gender: "Male"   },
    ],
  },
  {
    id: 9,
    name: "Priya Mehta",
    mobile: "9812345678",
    email: "priya@gmail.com",
    dob: "1992-07-10",
    gender: "Female",
    kyc: "Verified",
    policies: 1,
    address: "33 Fort Kochi, Kerala",
    familyMembers: [
      { type: "Spouse",  name: "Raj Mehta",  dob: "1989-03-25", gender: "Male"   },
      { type: "Child 1", name: "Sara Mehta", dob: "2019-06-18", gender: "Female" },
    ],
  },
  {
    id: 10,
    name: "Rahul Gupta",
    mobile: "9966778899",
    email: "rahul@gmail.com",
    dob: "1980-01-05",
    gender: "Male",
    kyc: "Verified",
    policies: 1,
    address: "C-9 Civil Lines, Delhi",
    familyMembers: [
      { type: "Spouse",  name: "Pooja Gupta",     dob: "1983-11-28", gender: "Female" },
      { type: "Child 1", name: "Siddharth Gupta", dob: "2008-04-15", gender: "Male"   },
      { type: "Child 2", name: "Ananya Gupta",    dob: "2012-09-03", gender: "Female" },
    ],
  },
  {
    id: 11,
    name: "Ritu Singh",
    mobile: "9833221100",
    email: "ritu@gmail.com",
    dob: "1996-05-18",
    gender: "Female",
    kyc: "Pending",
    policies: 0,
    address: "12 Raja Park, Jaipur",
  },
  {
    id: 12,
    name: "Ajay Iyer",
    mobile: "9822110099",
    email: "ajay@gmail.com",
    dob: "1983-10-30",
    gender: "Male",
    kyc: "Rejected",
    policies: 0,
    address: "4 T Nagar, Chennai",
  },
];


const STEPS = [
  "Customer",
  "Product",
  "Members",
  "Proposal",
  "Payment",
  "Policy",
];

const FAMILY_SLOTS = [
  { type: "Self", icon: "👤", label: "Self", genderDefault: null },
  { type: "Spouse", icon: "💑", label: "Spouse", genderDefault: null },
  { type: "Child 1", icon: "👦", label: "Child 1", genderDefault: null },
  { type: "Child 2", icon: "👧", label: "Child 2", genderDefault: null },
  { type: "Father", icon: "👨", label: "Father", genderDefault: "Male" },
  { type: "Mother", icon: "👩", label: "Mother", genderDefault: "Female" },
  { type: "FIL", icon: "👴", label: "Father-in-Law", genderDefault: "Male" },
  { type: "MIL", icon: "👵", label: "Mother-in-Law", genderDefault: "Female" },
  {
    type: "Handicap Child",
    icon: "♿",
    label: "Handicap Child",
    genderDefault: null,
  },
];

// ── Avatar helper ──────────────────────────────────────────────────────────
function Avatar({ name, size = 40, fontSize = 16 }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
    : "?";
  const colors = ["#a855f7", "#2563eb", "#059669", "#d97706", "#dc2626"];
  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "20",
        border: `2px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize,
        color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Persistent "policy for" customer strip ─────────────────────────────────
function CustomerStrip({ customer, onChangeCustomer, canChange = true }) {
  const kycColor = customer.kyc === "Verified" ? "#4ade80" : customer.kyc === "Pending" ? "#fbbf24" : "#f87171";
  return (
    <div className="bp-cust-strip" style={{
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
      background: "#fff",
      borderRadius: "var(--r-lg)", padding: "13px 18px", marginBottom: 20,
      boxShadow: "0 1px 4px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.05)",
      border: "1px solid var(--border)",
    }}>
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #fb7185 0%, #a855f7 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 800, color: "#fff",
      }}>
        {customer.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: "#1e293b" }}>{customer.name}</span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: customer.kyc === "Verified" ? "#dcfce7" : customer.kyc === "Pending" ? "#fef3c7" : "#fee2e2",
            color: kycColor,
            border: `1px solid ${kycColor}55`,
          }}>
            {customer.kyc === "Verified" ? "✓" : "●"} {customer.kyc}
          </span>
        </div>
        <div className="bp-cust-detail" style={{ fontSize: 12, color: "#64748b", marginTop: 3, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span>📱 {customer.mobile}</span>
          <span className="bp-cust-email">✉ {customer.email}</span>
        </div>
      </div>

      {/* Action */}
      {canChange && (
        <div className="bp-cust-actions" style={{ flexShrink: 0 }}>
          <button
            onClick={onChangeCustomer}
            style={{
              height: 34, padding: "0 16px", borderRadius: 8, cursor: "pointer",
              background: "linear-gradient(135deg,#fb7185 0%,#a855f7 100%)", border: "none",
              color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              transition: "opacity .15s",
              boxShadow: "0 2px 8px rgba(168,85,247,.30)",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Change Customer
          </button>
        </div>
      )}
    </div>
  );
}

// ── KYC Warning ────────────────────────────────────────────────────────────
function KYCWarning({ kyc }) {
  if (kyc === "Verified") return null;
  const isRejected = kyc === "Rejected";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: isRejected ? "var(--red-bg)" : "var(--amber-bg)",
        border: `1px solid ${isRejected ? "var(--red)" : "var(--amber)"}`,
        borderRadius: "var(--r-md)",
        padding: "12px 16px",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 16 }}>{isRejected ? "🚫" : "⚠️"}</span>
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 13.5,
            color: isRejected ? "var(--red)" : "var(--amber)",
            marginBottom: 3,
          }}
        >
          KYC {kyc}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-2)" }}>
          {isRejected
            ? "This customer's KYC has been rejected. Policy issuance may be declined by the insurer. Please update KYC before proceeding."
            : "KYC verification is pending. The insurer may require completion before activating the policy."}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function BuyPolicy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  // Detect sales agent and find their assigned customers from CRM leads
  const myAgentRecord = user?.role === "agent"
    ? KMD_AGENTS.find(a => a.name.toLowerCase().includes(user.name.split(" ")[0].toLowerCase()))
    : null;
  const isSalesAgent = myAgentRecord?.agentType === "sales";
  const myAgentId    = myAgentRecord?.id ?? null;

  const salesAssignedCustomerIds = useMemo(() => {
    if (!isSalesAgent || !myAgentId) return null;
    return new Set(
      INITIAL_LEADS
        .filter(l => l.salesAssignedTo === myAgentId && l.customerId != null)
        .map(l => l.customerId)
    );
  }, [isSalesAgent, myAgentId]);

  // Products available from agent's campaign assignments
  const agentCampaignProductIds = useMemo(() => {
    if (!myAgentId || isCustomer) return null; // null = show all
    const myCampaigns = CAMPAIGNS.filter(c => c.assignedAgents.includes(myAgentId));
    return new Set(myCampaigns.flatMap(c => c.productIds ?? []));
  }, [myAgentId, isCustomer]);

  // Base customer pool — sales agents see only their assigned customers
  const baseCustomers = salesAssignedCustomerIds
    ? CUSTOMERS.filter(c => salesAssignedCustomerIds.has(c.id))
    : CUSTOMERS;

  // For customer login: auto-find and lock in their own record
  const selfCustomer = isCustomer
    ? (CUSTOMERS.find((c) => c.email === user.email) ?? null)
    : null;

  // Pre-select customer when navigated from customer list via ?customerId=X
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("customerId");
  const preselectedCustomer = (!isCustomer && preselectedId)
    ? (CUSTOMERS.find((c) => c.id === Number(preselectedId)) ?? null)
    : null;

  // Resume pending payment via ?proposalId=PRO-2025-XXXX
  const resumeProposalId = searchParams.get("proposalId");
  const resumePolicy = resumeProposalId
    ? (POLICY_MOCK.find(p => p.proposalId === resumeProposalId) ?? null)
    : null;
  const resumeCustomer = resumePolicy ? (() => {
    const found = CUSTOMERS.find(c => c.name === resumePolicy.customerName);
    return {
      id:      found?.id ?? resumePolicy.customerId,
      name:    resumePolicy.customerName,
      mobile:  resumePolicy.mobile.replace(' ', ''),
      email:   found?.email ?? '',
      address: found?.address ?? '',
      kyc:     found?.kyc ?? 'Verified',
      familyMembers: found?.familyMembers ?? [],
    };
  })() : null;
  const resumeCart = resumePolicy ? [{
    id:         resumePolicy.id,
    name:       resumePolicy.product,
    provider:   resumePolicy.icName,
    policyType: resumePolicy.type,
    code:       resumePolicy.proposalId,
    premium:    resumePolicy.premium,
    sumInsured: resumePolicy.sumInsured ?? '',
    coverage:   '',
    ageBandId:  '',
  }] : null;

  // Unified initial customer — self (customer role) OR broker-preselected OR resume OR none
  const initialCustomer = selfCustomer ?? preselectedCustomer ?? resumeCustomer;

  // Step state — jump to payment (4) when resuming a pending proposal
  const [step, setStep] = useState(resumePolicy ? 4 : initialCustomer ? 1 : 0);

  // Step 0 — customer selection (agent/broker only)
  const [custSearch, setCustSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);

  // Insurance type — defaulted to Health (type selection step is hidden)
  const [insuranceType, setInsuranceType] = useState(resumePolicy?.type ?? "Health");

  // Step 2 — members / vehicle — start with Self only; family added on demand
  const [members, setMembers] = useState(
    initialCustomer
      ? [{ type: "Self", name: initialCustomer.name, dob: initialCustomer.dob, gender: initialCustomer.gender }]
      : [],
  );
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    regNo: "",
    variant: "",
    fuelType: "",
  });

  // Step 1 — product selection
  const [cart, setCart] = useState(resumeCart ?? []);
  const [productSels, setProductSels] = useState({});  // per-product {sumInsured,ageBandId,coverage,premium}
  const [viewingProduct, setViewingProduct] = useState(null); // product detail modal

  // Step 4 — proposal — pre-fill from customer record
  const [proposal, setProposal] = useState({
    customerName: initialCustomer?.name ?? "",
    mobile: initialCustomer?.mobile ?? "",
    email: initialCustomer?.email ?? "",
    address: initialCustomer?.address ?? "",
    medicalHistory: "No",
    preExisting: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeShare: "100",
    nomineeAge: "",
    declaration: false,
  });

  // Step 5 — payment
  const [payMethod, setPayMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");

  // Step 3 — nominees & terms
  const [nominees, setNominees] = useState([{ id: 1, name: '', relation: '', age: '', share: '100' }]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 6 — result
  const [policyResults, setPolicyResults] = useState([]);

  // Helpers
  const setP = (f) => (e) =>
    setProposal((p) => ({ ...p, [f]: e.target.value }));

  const calcAge = (dob) => {
    if (!dob) return "";
    return String(Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000)));
  };

  const RELATION_TO_SLOT = {
    Spouse: ["Spouse"],
    Child:  ["Child 1", "Child 2"],
    Parent: ["Father", "Mother"],
  };

  const handleNomineeRelation = (e) => {
    const relation = e.target.value;
    const slotTypes = RELATION_TO_SLOT[relation] ?? [];
    const family = selectedCustomer?.familyMembers ?? [];
    const match = slotTypes.reduce((found, t) => found ?? family.find(m => m.type === t), null);
    setProposal((p) => ({
      ...p,
      nomineeRelation: relation,
      nomineeName:     match ? match.name        : p.nomineeName,
      nomineeAge:      match ? calcAge(match.dob) : p.nomineeAge,
    }));
  };
  const setV = (f) => (e) => setVehicle((v) => ({ ...v, [f]: e.target.value }));
  // Nominee helpers
  const addNominee = () => {
    setNominees(prev => {
      const n    = prev.length + 1;
      const base = Math.floor(100 / n);
      const rem  = 100 - base * n;
      return [
        ...prev.map((x, i) => ({ ...x, share: String(base + (i === 0 ? rem : 0)) })),
        { id: Date.now(), name: '', relation: '', age: '', share: String(base) },
      ];
    });
  };
  const removeNominee = (id) => {
    setNominees(prev => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter(n => n.id !== id);
      const total    = filtered.reduce((s, n) => s + (Number(n.share) || 0), 0);
      const diff     = 100 - total;
      return diff !== 0
        ? filtered.map((n, i) => i === 0 ? { ...n, share: String((Number(n.share) || 0) + diff) } : n)
        : filtered;
    });
  };
  const updateNominee = (id, field, val) =>
    setNominees(prev => prev.map(n => n.id === id ? { ...n, [field]: val } : n));

  const [nomineeAutoFilled, setNomineeAutoFilled] = useState({});

  const updateNomineeRelation = (id, relation) => {
    const family  = selectedCustomer?.familyMembers ?? [];
    const allData = [...members, ...family];
    let autoName = '';
    let autoAge  = '';

    if (relation === 'Spouse') {
      const m = allData.find(m => m.type === 'Spouse');
      if (m) { autoName = m.name; autoAge = calcAge(m.dob); }
    } else if (relation === 'Son') {
      const m = allData.find(m => (m.type === 'Child 1' || m.type === 'Child 2') && m.gender === 'Male')
             ?? allData.find(m => m.type === 'Child 1' || m.type === 'Child 2');
      if (m) { autoName = m.name; autoAge = calcAge(m.dob); }
    } else if (relation === 'Daughter') {
      const m = allData.find(m => (m.type === 'Child 1' || m.type === 'Child 2') && m.gender === 'Female')
             ?? allData.find(m => m.type === 'Child 1' || m.type === 'Child 2');
      if (m) { autoName = m.name; autoAge = calcAge(m.dob); }
    }

    setNominees(prev => prev.map(n => n.id === id ? {
      ...n, relation,
      ...(autoName ? { name: autoName } : {}),
      ...(autoAge  ? { age:  autoAge  } : {}),
    } : n));

    if (autoName || autoAge) {
      setNomineeAutoFilled(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setNomineeAutoFilled(prev => ({ ...prev, [id]: false })), 1500);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (isCustomer && step === 1)        { navigate("/policy");   return; }
    if (preselectedCustomer && step === 1) { navigate("/customer"); return; }
    setStep((s) => Math.max(s - 1, 0));
  };

  // ── Premium-selection helpers ────────────────────────────────────────────
  const defaultSel = (pid) => {
    const rows = PREMIUM_CHART[pid] ?? [];
    if (!rows.length) return { sumInsured: '', ageBandId: '', coverage: '', premium: null };
    const r = rows[0];
    return {
      sumInsured: String(r.sumInsured),
      ageBandId:  r.ageBandId != null ? String(r.ageBandId) : '',
      coverage:   r.selfOnly != null ? 'selfOnly' : '',
      premium:    r.selfOnly ?? null,
    };
  };
  const psel    = (pid) => productSels[pid] ?? defaultSel(pid);
  const setPsel = (pid, patch) => {
    const updated = { ...psel(pid), ...patch };
    setProductSels(prev => ({ ...prev, [pid]: updated }));
    setCart(prev => prev.map(x => x.id === pid ? { ...x, ...updated } : x));
  };
  const matchRow = (pid, si, band) => {
    const rows = PREMIUM_CHART[pid] ?? [];
    const siN  = Number(si);
    return rows.find(r => r.sumInsured === siN && (band ? String(r.ageBandId) === band : r.ageBandId == null))
        ?? rows.find(r => r.sumInsured === siN)
        ?? null;
  };
  const COV_LABEL = {
    selfOnly:            'Self',
    selfSpouse:          'Self + Spouse',
    selfSpouse2Children: 'Self + Spouse + 2 Children',
  };

  const COV_MEMBERS = {
    selfOnly:            ['Self'],
    selfSpouse:          ['Self', 'Spouse'],
    selfSpouse2Children: ['Self', 'Spouse', 'Child 1', 'Child 2'],
  };

  const ensureMembersFor = (coverage) => {
    const needed = COV_MEMBERS[coverage] ?? ['Self'];
    setMembers(prev => {
      const existing = new Set(prev.map(m => m.type));
      const additions = needed
        .filter(t => !existing.has(t))
        .map(type => {
          const slot  = FAMILY_SLOTS.find(s => s.type === type);
          const saved = selectedCustomer?.familyMembers?.find(m => m.type === type);
          return { type, name: saved?.name ?? '', dob: saved?.dob ?? '', gender: saved?.gender ?? slot?.genderDefault ?? '' };
        });
      return additions.length ? [...prev, ...additions] : prev;
    });
  };

  const coverageOpts = (row) => [
    row?.selfOnly            != null && { key: 'selfOnly',            label: 'Self',                       value: row.selfOnly },
    row?.selfSpouse          != null && { key: 'selfSpouse',          label: 'Self + Spouse',               value: row.selfSpouse },
    row?.selfSpouse2Children != null && { key: 'selfSpouse2Children', label: 'Self + Spouse + 2 Children',  value: row.selfSpouse2Children },
  ].filter(Boolean);

  const toggleCart = (p) =>
    setCart(prev => prev.find(x => x.id === p.id)
      ? prev.filter(x => x.id !== p.id)
      : [...prev, { ...p, ...psel(p.id) }]);

  const availableProducts = useMemo(() => {
    if (!insuranceType) return [];
    const allCampaignProducts = agentCampaignProductIds
      ? PRODUCTS.filter(p => agentCampaignProductIds.has(p.id))
      : PRODUCTS;
    const pool = insuranceType === "Health"
      ? allCampaignProducts
      : (agentCampaignProductIds
          ? (PRODUCTS_BY_TYPE[insuranceType] ?? []).filter(p => agentCampaignProductIds.has(p.id))
          : (PRODUCTS_BY_TYPE[insuranceType] ?? []));
    const score = p =>
      (PRODUCT_DETAILS[p.id] ? 1 : 0) + ((PREMIUM_CHART[p.id]?.length ?? 0) > 0 ? 1 : 0);
    return [...pool].sort((a, b) => score(b) - score(a));
  }, [insuranceType, agentCampaignProductIds]);

  // Customer search filter — sales agents already scoped to their assigned customers
  const filteredCustomers = useMemo(() => {
    const q = custSearch.trim().toLowerCase();
    if (!q) return baseCustomers;
    return baseCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [custSearch, baseCustomers]);

  const custPg = usePagination(filteredCustomers, 12);
  const handleCustSearch = (v) => { setCustSearch(v); custPg.reset(); };

  // When customer is selected, pre-fill downstream state (including saved family members)
  const handleSelectCustomer = (c) => {
    setSelectedCustomer(c);
    setMembers([
      { type: "Self", name: c.name, dob: c.dob, gender: c.gender },
    ]);
    setProposal((p) => ({
      ...p,
      customerName: c.name,
      mobile: c.mobile,
      email: c.email,
      address: c.address,
    }));
  };

  const addMember = (type) => {
    const slot = FAMILY_SLOTS.find((s) => s.type === type);
    const saved = selectedCustomer?.familyMembers?.find((m) => m.type === type);
    setMembers((prev) => [
      ...prev,
      {
        type,
        name:   saved?.name   ?? "",
        dob:    saved?.dob    ?? "",
        gender: saved?.gender ?? slot?.genderDefault ?? "",
      },
    ]);
  };
  const removeMember = (type) =>
    setMembers((prev) => prev.filter((m) => m.type !== type));
  const updateMember = (type, field, val) =>
    setMembers(prev => {
      if (prev.find(m => m.type === type)) {
        return prev.map(m => m.type === type ? { ...m, [field]: val } : m);
      }
      const slot = FAMILY_SLOTS.find(s => s.type === type);
      const saved = selectedCustomer?.familyMembers?.find(m => m.type === type);
      return [...prev, { type, name: saved?.name ?? '', dob: saved?.dob ?? '', gender: saved?.gender ?? slot?.genderDefault ?? '', [field]: val }];
    });

  // Finalize payment — generate one proposal per cart item (policy pending issuance)
  const submitPayment = () => {
    const rand4 = () => Math.floor(Math.random() * 9000 + 1000);
    const rand6 = () => Math.floor(Math.random() * 900000 + 100000);
    setPolicyResults(cart.map(p => ({
      referenceNo: `REF-${rand6()}`,
      proposalId:  `PRO-2025-${rand4()}`,
      product:     p.name,
      provider:    p.provider,
      customer:    selectedCustomer?.name,
      premium:     p.premium,
    })));
    next();
  };

  return (
    <div>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">
            <ShieldCheckIcon />
          </div>
          <div>
            <div className="page-title">Buy Insurance Policy</div>
            <div className="page-subtitle">
              {isCustomer ? "Compare plans and buy a policy for yourself" : "Select a customer, compare plans and issue a policy"}
            </div>
          </div>
        </div>
        {step > 0 && step < STEPS.length - 1 && (
          <button className="btn btn-ghost" onClick={back}>
            ← Back
          </button>
        )}
      </div>

      {/* ── Stepper ─────────────────────────────────────────────────────── */}
      <Stepper steps={STEPS} current={step} />

      {/* ── Persistent customer strip (steps 1–6) ─────────────────────── */}
      {selectedCustomer && step > 0 && step < STEPS.length - 1 && (
        <CustomerStrip
          customer={selectedCustomer}
          onChangeCustomer={() => setStep(0)}
          canChange={!isCustomer}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 0 — Select Customer
      ══════════════════════════════════════════════════════════════════ */}
      {step === 0 && (
        <div>
          {/* Search + count + add */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
              <input
                className="field-input"
                style={{ paddingLeft: 34 }}
                placeholder={isSalesAgent ? "Search your assigned customers…" : "Search by name, mobile or email…"}
                value={custSearch}
                onChange={(e) => handleCustSearch(e.target.value)}
                autoFocus
              />
            </div>
            <span style={{ fontSize: 12.5, color: "var(--text-3)", whiteSpace: "nowrap", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 12px" }}>
              {filteredCustomers.length} customers
            </span>
            {!isSalesAgent && (
              <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => navigate("/customer/create")}>
                <CustomerIcon size={14} /> + Add New
              </button>
            )}
          </div>

          {/* Customer grid */}
          {filteredCustomers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 0", color: "var(--text-3)" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No customers found</div>
              <div style={{ fontSize: 13 }}>Try a different name, mobile or email</div>
            </div>
          ) : (
            <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 8,
            }}>
              {custPg.slice.map((c) => {
                const isSelected = selectedCustomer?.id === c.id;
                const isRejected = c.kyc === "Rejected";
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCustomer(c)}
                    style={{
                      textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                      borderRadius: 14, overflow: "hidden",
                      border: `2px solid ${isSelected ? "var(--brand)" : isRejected ? "#fecdd3" : "var(--border)"}`,
                      background: isSelected ? "#f5f3ff" : isRejected ? "#fff8f8" : "#fff",
                      boxShadow: isSelected ? "0 4px 16px rgba(168,85,247,.18)" : "0 1px 4px rgba(0,0,0,.06)",
                      transition: "all .14s",
                      padding: 0,
                    }}
                  >
                    <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 11 }}>
                      <Avatar name={c.name} size={38} fontSize={13} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.name}
                          </div>
                          {isSelected && (
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>KYC:</span>
                          <StatusBadge status={c.kyc} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: "var(--text-2)", whiteSpace: "nowrap" }}>📱 {c.mobile}</span>
                          <span style={{ fontSize: 11, color: "var(--text-3)" }}>·</span>
                          <span style={{ fontSize: 12, color: "var(--blue)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>✉ {c.email}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {custPg.total > 12 && (
              <Pagination total={custPg.total} page={custPg.page} perPage={custPg.perPage} onPage={custPg.onPage} onPerPage={custPg.onPerPage} />
            )}
            </>
          )}

          {/* Sticky continue bar */}
          <div style={{
            position: "sticky", bottom: 0, zIndex: 20,
            marginTop: 16, padding: "13px 18px",
            background: selectedCustomer
              ? "linear-gradient(135deg, #fb7185 0%, #a855f7 100%)"
              : "#fff",
            border: `1.5px solid ${selectedCustomer ? "transparent" : "var(--border)"}`,
            borderRadius: 12, transition: "all .2s",
            boxShadow: selectedCustomer
              ? "0 -4px 24px rgba(168,85,247,.30)"
              : "0 -2px 12px rgba(0,0,0,.06)",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
          }}>
            <Button disabled={!selectedCustomer} onClick={next} style={{
              minWidth: 260,
              ...(selectedCustomer ? {
                background: "#fff", color: "#a855f7",
                boxShadow: "0 2px 8px rgba(0,0,0,.12)",
              } : {}),
            }}>
              Continue with {selectedCustomer ? selectedCustomer.name : "selected customer"} →
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Members & Premium
      ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#fb7185,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Member Details &amp; Premium</div>
            <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 3, fontWeight: 500 }}>
              Select coverage type for each product — member details will appear based on your selection
            </div>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📦</div>
              <div style={{ fontWeight: 600 }}>No products selected</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Go back and select at least one product</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {cart.map(p => {
                const sel       = psel(p.id);
                const chartRows = PREMIUM_CHART[p.id] ?? [];
                const uniqueSIs = [...new Set(chartRows.map(r => r.sumInsured))];
                const hasAB     = chartRows.some(r => r.ageBandId != null);
                const rowBands  = hasAB
                  ? [...new Set(chartRows.filter(r => r.sumInsured === Number(sel.sumInsured)).map(r => String(r.ageBandId)))]
                  : [];
                const activeRow   = matchRow(p.id, sel.sumInsured, sel.ageBandId);
                const covOpts     = coverageOpts(activeRow);
                const icon        = POLICY_TYPE_ICON[p.policyType] ?? "📋";
                const neededTypes = COV_MEMBERS[sel.coverage] ?? [];
                const hasMissingMembers = neededTypes.some(t => {
                  if (t === "Self") return false;
                  const m = members.find(x => x.type === t);
                  return !m?.name || !m?.dob;
                });

                return (
                  <div key={p.id} style={{ border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
                    {/* Product header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: "#fff", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 13.5, color: "#7c3aed", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{p.provider} · <span style={{ fontFamily: "monospace" }}>{p.code}</span></div>
                      </div>
                    </div>

                    <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

                      {/* SI + Age Band */}
                      {chartRows.length > 0 && (
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <div style={{ minWidth: 160 }}>
                            <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 5 }}>Sum Insured</div>
                            <select className="field-select" value={sel.sumInsured}
                              onChange={e => {
                                const si    = e.target.value;
                                const bands = hasAB ? [...new Set(chartRows.filter(r => r.sumInsured === Number(si)).map(r => String(r.ageBandId)))] : [];
                                const band  = bands[0] ?? '';
                                const row   = matchRow(p.id, si, band);
                                const cov   = row?.selfOnly != null ? 'selfOnly' : '';
                                setPsel(p.id, { sumInsured: si, ageBandId: band, coverage: cov, premium: row?.[cov] ?? null });
                                if (cov) ensureMembersFor(cov);
                              }}
                              style={{ fontSize: 13, padding: "6px 10px", width: "100%" }}>
                              {uniqueSIs.map(si => <option key={si} value={String(si)}>₹{si.toLocaleString("en-IN")}</option>)}
                            </select>
                          </div>
                          {hasAB && rowBands.length > 0 && (
                            <div style={{ minWidth: 130 }}>
                              <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 5 }}>Age Band</div>
                              <select className="field-select" value={sel.ageBandId}
                                onChange={e => {
                                  const band = e.target.value;
                                  const row  = matchRow(p.id, sel.sumInsured, band);
                                  const cov  = sel.coverage && row?.[sel.coverage] != null ? sel.coverage : (row?.selfOnly != null ? 'selfOnly' : '');
                                  setPsel(p.id, { ageBandId: band, coverage: cov, premium: row?.[cov] ?? null });
                                  if (cov) ensureMembersFor(cov);
                                }}
                                style={{ fontSize: 13, padding: "6px 10px", width: "100%" }}>
                                {rowBands.map(b => <option key={b} value={b}>Band {b}</option>)}
                              </select>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Coverage options */}
                      {covOpts.length > 0 && (
                        <div>
                          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 7 }}>Coverage Type</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {covOpts.map(opt => {
                              const active = sel.coverage === opt.key;
                              return (
                                <label key={opt.key} style={{
                                  display: "flex", alignItems: "center", gap: 10,
                                  padding: "10px 14px", borderRadius: 9, cursor: "pointer",
                                  background: "#fff",
                                  border: `1.5px solid ${active ? "var(--brand)" : "var(--border)"}`,
                                  borderLeft: `4px solid ${active ? "var(--brand)" : "var(--border)"}`,
                                  transition: "all .15s",
                                }}>
                                  <input type="radio" name={`cov2-${p.id}`} checked={active}
                                    onChange={() => {
                                      setPsel(p.id, { coverage: opt.key, premium: opt.value });
                                      ensureMembersFor(opt.key);
                                    }}
                                    style={{ accentColor: "var(--brand)", width: 15, height: 15, flexShrink: 0 }} />
                                  <span style={{ flex: 1, fontSize: 13.5, color: "var(--text)", fontWeight: active ? 700 : 400 }}>{opt.label}</span>
                                  <span style={{ fontWeight: 800, fontSize: 15, color: active ? "var(--brand-dark)" : "var(--text)", flexShrink: 0 }}>₹{opt.value.toLocaleString("en-IN")}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Insured Members — driven by coverage selection */}
                      {neededTypes.length > 0 && (
                        <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>
                            Insured Members
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {neededTypes.map(type => {
                              const m           = members.find(x => x.type === type);
                              const isSelf      = type === "Self";
                              const slot        = FAMILY_SLOTS.find(s => s.type === type);
                              const missingName = !isSelf && !m?.name;
                              const missingDob  = !isSelf && !m?.dob;
                              const age         = m?.dob ? Math.floor((Date.now() - new Date(m.dob)) / (365.25 * 24 * 3600 * 1000)) : null;
                              return (
                                <div key={type} style={{
                                  display: "grid",
                                  gridTemplateColumns: "110px 1fr 150px 110px",
                                  gap: 8, alignItems: "center",
                                  padding: "10px 12px", borderRadius: 9, background: "#fff",
                                  border: `1.5px solid ${(missingName || missingDob) ? "#f59e0b" : "var(--border)"}`,
                                  transition: "border-color .2s",
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 17 }}>{slot?.icon}</span>
                                    <div>
                                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>{slot?.label}</div>
                                      {isSelf && <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600 }}>Primary</div>}
                                      {age !== null && <div style={{ fontSize: 10.5, color: "var(--text-3)" }}>{age} yrs</div>}
                                    </div>
                                  </div>
                                  <input
                                    className="field-input"
                                    placeholder={missingName ? "Enter full name" : "Full name"}
                                    value={m?.name ?? ""}
                                    onChange={e => updateMember(type, "name", e.target.value)}
                                    disabled={isSelf}
                                    style={{ fontSize: 12.5, padding: "6px 9px", width: "100%", borderColor: missingName ? "#f59e0b" : undefined }}
                                  />
                                  <input
                                    type="date"
                                    className="field-input"
                                    value={m?.dob ?? ""}
                                    onChange={e => updateMember(type, "dob", e.target.value)}
                                    disabled={isSelf}
                                    style={{ fontSize: 12.5, padding: "6px 9px", width: "100%", borderColor: missingDob ? "#f59e0b" : undefined }}
                                  />
                                  {isSelf ? (
                                    <input className="field-input" value={m?.gender ?? ""} disabled
                                      style={{ fontSize: 12.5, padding: "6px 9px", width: "100%", background: "#f3f4f6", color: "var(--text-2)" }} />
                                  ) : (
                                    <select className="field-select" value={m?.gender ?? ""}
                                      onChange={e => updateMember(type, "gender", e.target.value)}
                                      style={{ fontSize: 12.5, padding: "6px 9px", width: "100%" }}>
                                      <option value="">Gender</option>
                                      <option>Male</option>
                                      <option>Female</option>
                                      <option>Other</option>
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {hasMissingMembers && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 12, color: "#92400e", fontWeight: 500, background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 6, padding: "6px 10px" }}>
                              ⚠ Please fill in the highlighted member details before continuing
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Premium footer */}
                    {sel.premium != null && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
                        <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>Annual Premium</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--brand)" }}>₹{sel.premium.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky total + continue footer */}
          {(() => {
            const hasPremium = cart.some(x => psel(x.id).premium != null);
            return (
              <div style={{
                position: "sticky", bottom: 0, zIndex: 20, marginTop: 8,
                background: hasPremium
                  ? "linear-gradient(135deg, #fb7185 0%, #a855f7 100%)"
                  : "#fff",
                border: `2px solid ${hasPremium ? "transparent" : "var(--border)"}`,
                borderRadius: 12, padding: "12px 18px",
                boxShadow: hasPremium
                  ? "0 -4px 24px rgba(168,85,247,.30)"
                  : "0 -2px 12px rgba(0,0,0,.06)",
                display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                transition: "all .2s",
              }}>
                {hasPremium ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.94)", fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".4px" }}>
                      {cart.length} product{cart.length > 1 ? "s" : ""} · Total Premium
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                        ₹{cart.reduce((s, x) => s + (psel(x.id).premium ?? 0), 0).toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.94)" }}>
                        {cart.map(x => `${x.name.split(" ")[0]}: ₹${(psel(x.id).premium ?? 0).toLocaleString("en-IN")}`).join("  +  ")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, fontSize: 13, color: "var(--text-3)" }}>
                    Select coverage for each product to see total premium
                  </div>
                )}
                <button
                  className="btn btn-primary"
                  disabled={cart.length === 0}
                  onClick={next}
                  style={{
                    flexShrink: 0, minWidth: 200,
                    ...(hasPremium ? {
                      background: "#fff", color: "#a855f7", fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                    } : {}),
                  }}
                >
                  Continue to Proposal →
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1 — Select Products
      ══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          {selectedCustomer && <KYCWarning kyc={selectedCustomer.kyc} />}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(135deg,#fb7185,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Select Products</div>
              <div style={{ fontSize: 13.5, color: "var(--text-2)", marginTop: 3, fontWeight: 500 }}>Click a card to select, then view full details before continuing</div>
            </div>
            {cart.length > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--brand-dark)", borderRadius: 20, padding: "4px 14px" }}>
                {cart.length} selected
              </span>
            )}
          </div>

          {availableProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No products available</div>
              <div style={{ fontSize: 13 }}>No products are assigned to your campaigns</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {availableProducts.map(p => {
                const inCart    = !!cart.find(x => x.id === p.id);
                const chartRows = PREMIUM_CHART[p.id] ?? [];
                const uniqueSIs = [...new Set(chartRows.map(r => r.sumInsured))];
                const firstRow  = chartRows[0];
                const covKeys   = ['selfOnly','selfSpouse','selfSpouse2Children'].filter(k => firstRow?.[k] != null);
                const icon      = POLICY_TYPE_ICON[p.policyType] ?? "📋";
                return (
                  <div key={p.id} style={{
                    borderRadius: 12, overflow: "hidden", background: "#fff",
                    border: `1.5px solid ${inCart ? "var(--brand)" : "var(--border)"}`,
                    boxShadow: inCart ? "0 2px 12px rgba(168,85,247,.10)" : "0 1px 4px rgba(0,0,0,.05)",
                    transition: "border-color .15s, box-shadow .15s",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleCart(p)}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 14px", borderBottom: "1px solid var(--border)", background: "#fff" }}>
                      <input type="checkbox" checked={inCart}
                        onChange={() => toggleCart(p)}
                        onClick={e => e.stopPropagation()}
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--brand)", flexShrink: 0 }} />
                      <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "#7c3aed", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-.1px" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{p.provider}</div>
                      </div>
                      {inCart && <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✓</div>}
                    </div>

                    {/* Detail strip */}
                    <div style={{ padding: "6px 14px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", fontSize: 11.5 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px", color: "var(--text-2)" }}>
                        <span><span style={{ color: "var(--text-3)" }}>Code </span><span style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text)" }}>{p.code}</span></span>
                        <span><span style={{ color: "var(--text-3)" }}>Type </span><strong style={{ color: "var(--text)" }}>{p.policyType}</strong></span>
                        <span style={{ color: "var(--green)", fontWeight: 600 }}>● Active</span>
                      </div>
                    </div>

                    {/* Key info */}
                    <div style={{ padding: "12px 14px" }}>
                      {uniqueSIs.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <span style={{ fontSize: 11.5, color: "var(--text-3)" }}>Sum Insured:</span>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>
                            ₹{Math.min(...uniqueSIs).toLocaleString("en-IN")}
                            {uniqueSIs.length > 1 && ` – ₹${Math.max(...uniqueSIs).toLocaleString("en-IN")}`}
                          </span>
                        </div>
                      )}
                      {covKeys.length > 0 && (
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {covKeys.includes('selfOnly') && <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text-2)" }}>Self</span>}
                          {covKeys.includes('selfSpouse') && <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text-2)" }}>Self + Spouse</span>}
                          {covKeys.includes('selfSpouse2Children') && <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text-2)" }}>Family</span>}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "9px 14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                      <button
                        className="btn btn-sm"
                        style={{ fontSize: 12, border: "1.5px solid #a855f7", color: "#7c3aed", background: "#faf5ff", fontWeight: 600 }}
                        onClick={e => { e.stopPropagation(); setViewingProduct(p); }}
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky footer */}
          <div style={{
            position: "sticky", bottom: 0, zIndex: 20, marginTop: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "14px 20px",
            background: cart.length > 0
              ? "linear-gradient(135deg, #fb7185 0%, #a855f7 100%)"
              : "#fff",
            border: `2px solid ${cart.length > 0 ? "transparent" : "var(--border)"}`,
            borderRadius: 12, transition: "all .2s",
            boxShadow: cart.length > 0
              ? "0 -4px 24px rgba(168,85,247,.30)"
              : "0 -2px 12px rgba(0,0,0,.06)",
          }}>
            <div style={{ fontSize: 13.5, color: cart.length > 0 ? "#fff" : "var(--text-3)", fontWeight: 500 }}>
              {cart.length === 0
                ? "Select at least one product to continue"
                : <><strong style={{ color: "#fff", fontWeight: 800 }}>{cart.length} product{cart.length > 1 ? "s" : ""}</strong> selected — choose premium details on next screen</>
              }
            </div>
            <button className="btn btn-primary" disabled={cart.length === 0} onClick={next} style={{
              flexShrink: 0, minWidth: 140,
              ...(cart.length > 0 ? {
                background: "#fff", color: "#a855f7", fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,.12)",
              } : {}),
            }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Product Brochure Modal ───────────────────────────────────────── */}
      {viewingProduct && (() => {
        const p         = viewingProduct;
        const details   = PRODUCT_DETAILS[p.id];
        const chartRows = PREMIUM_CHART[p.id] ?? [];
        const icon      = POLICY_TYPE_ICON[p.policyType] ?? "📋";
        const inCart    = !!cart.find(x => x.id === p.id);

        const sectionHead = (text) => (
          <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span>{text}</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
        );

        return (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
            onClick={() => setViewingProduct(null)}
          >
            <div
              style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 640, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,.25)" }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Hero header ── */}
              <div style={{ background: "linear-gradient(135deg, #fb7185 0%, #a855f7 100%)", padding: "22px 24px 20px", color: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.94)", marginBottom: details ? 8 : 0 }}>{p.provider} &nbsp;·&nbsp; <span style={{ fontFamily: "monospace", background: "rgba(255,255,255,.15)", borderRadius: 4, padding: "1px 6px" }}>{p.code}</span></div>
                    {details?.tagline && (
                      <div style={{ fontSize: 13, fontStyle: "italic", opacity: .92, lineHeight: 1.5 }}>"{details.tagline}"</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingProduct(null)}
                    style={{ width: 30, height: 30, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,.4)", background: "rgba(255,255,255,.15)", cursor: "pointer", color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >×</button>
                </div>

                {/* Highlight chips */}
                {details?.highlights && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {details.highlights.map(h => (
                      <div key={h.label} style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", borderRadius: 8, padding: "6px 12px", backdropFilter: "blur(4px)" }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,.82)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 1 }}>{h.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{h.icon} {h.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                {details ? (<>

                  {/* About */}
                  <div>
                    {sectionHead("About This Plan")}
                    <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.75 }}>{details.description}</p>
                  </div>

                  {/* Who should buy */}
                  {details.target?.length > 0 && (
                    <div>
                      {sectionHead("Who Should Buy")}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {details.target.map((t, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-2)" }}>
                            <span style={{ color: "#a855f7", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>→</span>
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key benefits */}
                  {details.benefits?.length > 0 && (
                    <div>
                      {sectionHead("Key Benefits")}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 14px" }}>
                        {details.benefits.map((b, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13, color: "var(--text-2)" }}>
                            <span style={{ color: "#16a34a", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                            <span style={{ lineHeight: 1.5 }}>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Covered / Not covered */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {details.covered?.length > 0 && (
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>✅ What's Covered</div>
                        {details.covered.map((c, i) => (
                          <div key={i} style={{ fontSize: 12.5, color: "#166534", lineHeight: 1.6, paddingLeft: 8, borderLeft: "2px solid #86efac", marginBottom: 4 }}>{c}</div>
                        ))}
                      </div>
                    )}
                    {details.notCovered?.length > 0 && (
                      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#c2410c", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>⚠ Not Covered</div>
                        {details.notCovered.map((c, i) => (
                          <div key={i} style={{ fontSize: 12.5, color: "#9a3412", lineHeight: 1.6, paddingLeft: 8, borderLeft: "2px solid #fdba74", marginBottom: 4 }}>{c}</div>
                        ))}
                      </div>
                    )}
                  </div>

                </>) : (
                  /* Fallback: basic info grid for products without PRODUCT_DETAILS */
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Code", p.code], ["Policy Type", p.policyType], ["Provider", p.provider], ["Status", "Active"]].map(([k, v]) => (
                      <div key={k} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: k === "Code" ? "monospace" : "inherit" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Premium chart */}
                {chartRows.length > 0 && (
                  <div>
                    {sectionHead("Premium Chart (Annual, incl. GST)")}
                    <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                        <thead>
                          <tr style={{ background: "var(--surface-2)", borderBottom: "1.5px solid var(--border)" }}>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "var(--text-3)", whiteSpace: "nowrap" }}>Sum Insured</th>
                            {chartRows[0]?.ageBandId != null && <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "var(--text-3)" }}>Age Band</th>}
                            {chartRows[0]?.selfOnly != null && <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "var(--text-3)" }}>Self</th>}
                            {chartRows.some(r => r.selfSpouse != null) && <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "var(--text-3)" }}>Self + Spouse</th>}
                            {chartRows.some(r => r.selfSpouse2Children != null) && <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "var(--text-3)" }}>Family</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {chartRows.map((r, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "#fff" : "var(--surface-2)" }}>
                              <td style={{ padding: "8px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>₹{r.sumInsured.toLocaleString("en-IN")}</td>
                              {r.ageBandId != null && <td style={{ padding: "8px 12px", color: "var(--text-2)" }}>Band {r.ageBandId}</td>}
                              {chartRows[0]?.selfOnly != null && <td style={{ padding: "8px 12px", textAlign: "right" }}>{r.selfOnly != null ? `₹${r.selfOnly.toLocaleString("en-IN")}` : "—"}</td>}
                              {chartRows.some(x => x.selfSpouse != null) && <td style={{ padding: "8px 12px", textAlign: "right" }}>{r.selfSpouse != null ? `₹${r.selfSpouse.toLocaleString("en-IN")}` : "—"}</td>}
                              {chartRows.some(x => x.selfSpouse2Children != null) && <td style={{ padding: "8px 12px", textAlign: "right" }}>{r.selfSpouse2Children != null ? `₹${r.selfSpouse2Children.toLocaleString("en-IN")}` : "—"}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Declaration */}
                {p.disclaimer && (
                  <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#78350f", lineHeight: 1.7 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠ Declaration</div>
                    {p.disclaimer}
                  </div>
                )}
              </div>

              {/* ── Sticky CTA footer ── */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid var(--border)", background: "#fff", flexShrink: 0, display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
                <button
                  className="btn btn-ghost"
                  style={{ height: 44, fontSize: 14, fontWeight: 600, minWidth: 110, justifyContent: "center" }}
                  onClick={() => setViewingProduct(null)}
                >
                  Close
                </button>
                <button
                  className={`btn ${inCart ? "btn-ghost" : "btn-primary"}`}
                  style={{ height: 44, fontSize: 14, fontWeight: 600, minWidth: 200, justifyContent: "center" }}
                  onClick={() => { toggleCart(p); setViewingProduct(null); }}
                >
                  {inCart ? "✓ Selected — Remove from Cart" : "＋ Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3 — Proposal Form
      ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && cart.length > 0 && (() => {
        const nomineesTotal = nominees.reduce((s, n) => s + (Number(n.share) || 0), 0);
        const canProceed = proposal.declaration && termsAccepted && nomineesTotal === 100;
        return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Selected Plans Summary */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1.5px solid #e5e7eb", borderLeft: "4px solid var(--brand)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>
              Selected Plans
            </div>
            {cart.map((p, i) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < cart.length - 1 ? "1px solid #f3f4f6" : "none", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{POLICY_TYPE_ICON[p.policyType] ?? "📋"}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "#7c3aed", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                      {p.sumInsured ? `₹${Number(p.sumInsured).toLocaleString("en-IN")} SI` : ""}
                      {p.coverage ? ` · ${COV_LABEL[p.coverage] ?? p.coverage}` : ""}
                    </div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: "#111827", flexShrink: 0, marginLeft: 12 }}>
                  {p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 2, borderTop: "1.5px solid #e5e7eb" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Total Premium</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                ₹{cart.reduce((s, x) => s + (x.premium ?? 0), 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Covered Family Members */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14 }}>👨‍👩‍👧 Covered Members</span>
              <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 8 }}>{members.length} member{members.length > 1 ? "s" : ""} covered under this policy</span>
            </div>
            <div className="card-body" style={{ padding: "12px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {members.map(m => {
                  const slot  = FAMILY_SLOTS.find(s => s.type === m.type);
                  const isSelf = m.type === "Self";
                  const age   = m.dob ? Math.floor((Date.now() - new Date(m.dob)) / (365.25 * 24 * 3600 * 1000)) : null;
                  return (
                    <div key={m.type} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                      borderRadius: 9,
                      background: "#fff",
                      border: "1.5px solid #e5e7eb",
                    }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{slot?.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{slot?.label}</span>
                          {isSelf && <span style={{ fontSize: 10.5, color: "#fff", fontWeight: 700, background: "linear-gradient(135deg,#fb7185,#a855f7)", borderRadius: 4, padding: "1px 7px" }}>Primary</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                          {m.name || "—"}{age != null ? ` · ${age} yrs` : ""}{m.gender ? ` · ${m.gender}` : ""}
                        </div>
                      </div>
                      {m.dob && (
                        <div style={{ fontSize: 11.5, color: "var(--text-3)", flexShrink: 0 }}>
                          {new Date(m.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nominee Details */}
          <div className="card">
            <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: 14 }}>📝 Nominee Details</span>
                <span style={{ fontSize: 12, color: "var(--text-3)", marginLeft: 8 }}>Total share must equal 100%</span>
              </div>
              {nominees.length < 4 && (
                <button type="button" className="btn btn-secondary btn-sm" onClick={addNominee}>
                  + Add Nominee
                </button>
              )}
            </div>
            <div className="card-body">
              {/* Column headers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 80px 90px 36px", gap: 8, marginBottom: 6, padding: "0 2px" }}>
                {["Full Name", "Relation", "Age", "Share %", ""].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".4px" }}>{h}</div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {nominees.map((n) => (
                  <div key={n.id} style={{
                    display: "grid", gridTemplateColumns: "1fr 140px 80px 90px 36px",
                    gap: 8, alignItems: "center",
                    padding: "10px 10px", borderRadius: 9,
                    background: "var(--surface-2)", border: "1.5px solid var(--border)",
                  }}>
                    <div style={{ position: "relative" }}>
                      <input className="field-input" placeholder="Full name" value={n.name}
                        onChange={e => updateNominee(n.id, "name", e.target.value)}
                        style={{
                          fontSize: 12.5, padding: "6px 9px", width: "100%",
                          transition: "border-color .4s, box-shadow .4s",
                          ...(nomineeAutoFilled[n.id] && n.name ? {
                            borderColor: "#16a34a",
                            boxShadow: "0 0 0 3px rgba(22,163,74,.15)",
                          } : {}),
                        }} />
                      {nomineeAutoFilled[n.id] && n.name && (
                        <span style={{
                          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                          fontSize: 10, color: "#16a34a", fontWeight: 700, pointerEvents: "none",
                          animation: "fadeIn .2s ease",
                        }}>✓ auto</span>
                      )}
                    </div>
                    <select className="field-select" value={n.relation}
                      onChange={e => updateNomineeRelation(n.id, e.target.value)}
                      style={{ fontSize: 12.5, padding: "6px 9px" }}>
                      <option value="">Relation</option>
                      {["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"].map(r => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <div style={{ position: "relative" }}>
                      <input type="number" className="field-input" placeholder="Age" value={n.age} min="1" max="100"
                        onChange={e => updateNominee(n.id, "age", e.target.value)}
                        style={{
                          fontSize: 12.5, padding: "6px 9px", width: "100%",
                          transition: "border-color .4s, box-shadow .4s",
                          ...(nomineeAutoFilled[n.id] && n.age ? {
                            borderColor: "#16a34a",
                            boxShadow: "0 0 0 3px rgba(22,163,74,.15)",
                          } : {}),
                        }} />
                      {nomineeAutoFilled[n.id] && n.age && (
                        <span style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: "#16a34a", fontWeight: 700, pointerEvents: "none" }}>✓</span>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type="number" className="field-input" placeholder="%" value={n.share} min="1" max="100"
                        onChange={e => updateNominee(n.id, "share", e.target.value)}
                        style={{ fontSize: 12.5, padding: "6px 28px 6px 9px" }} />
                      <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-3)", pointerEvents: "none" }}>%</span>
                    </div>
                    <button type="button" onClick={() => removeNominee(n.id)} disabled={nominees.length === 1}
                      style={{ width: 32, height: 32, borderRadius: 6, border: "1.5px solid var(--border)", background: nominees.length === 1 ? "var(--surface-2)" : "#fff0f0", color: nominees.length === 1 ? "var(--text-3)" : "var(--red)", cursor: nominees.length === 1 ? "not-allowed" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", transition: "all .12s" }}>
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Share % progress bar */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 500 }}>Total Share Allocated</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: nomineesTotal === 100 ? "var(--green)" : nomineesTotal > 100 ? "var(--red)" : "#d97706" }}>
                    {nomineesTotal}%&nbsp;
                    {nomineesTotal === 100 ? "✓ Complete" : nomineesTotal > 100 ? `— ${nomineesTotal - 100}% over` : `— ${100 - nomineesTotal}% remaining`}
                  </span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 4, transition: "width .3s ease, background-color .2s",
                    width: `${Math.min(nomineesTotal, 100)}%`,
                    background: nomineesTotal === 100 ? "var(--green)" : nomineesTotal > 100 ? "var(--red)" : "var(--brand)",
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Declaration & Terms */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontWeight: 700, fontSize: 14 }}>📜 Declaration &amp; Acceptance</span>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                padding: "13px 14px", borderRadius: 10,
                background: proposal.declaration ? "#f5f3ff" : "#fff",
                border: `1.5px solid ${proposal.declaration ? "var(--brand)" : "var(--border)"}`,
                transition: "all .15s",
              }}>
                <input type="checkbox" checked={proposal.declaration}
                  onChange={e => setProposal(p => ({ ...p, declaration: e.target.checked }))}
                  style={{ marginTop: 2, accentColor: "var(--brand)", width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.7 }}>
                  I declare that all information provided is true and correct. I understand that any misrepresentation may result in rejection of claim or cancellation of policy. I consent to sharing this data with the insurer for policy issuance.
                </span>
              </label>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
                padding: "13px 14px", borderRadius: 10,
                background: termsAccepted ? "#f5f3ff" : "#fff",
                border: `1.5px solid ${termsAccepted ? "var(--brand)" : "var(--border)"}`,
                transition: "all .15s",
              }}>
                <input type="checkbox" checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "var(--brand)", width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.7 }}>
                  I have read and agree to the{" "}
                  <span style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>Terms &amp; Conditions</span>
                  {" "}and{" "}
                  <span style={{ color: "var(--brand)", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>.
                  I authorise KM Dastur &amp; Co. to process my application and share necessary details with the insurance company.
                </span>
              </label>
            </div>
          </div>

          <div className="actions-row">
            <button type="button" className="btn btn-ghost" onClick={back}>← Back</button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canProceed}
              onClick={next}
              style={{ minWidth: 220 }}
            >
              {nomineesTotal !== 100
                ? `Nominees: ${nomineesTotal}% / 100%`
                : !proposal.declaration || !termsAccepted
                ? "Accept all declarations to proceed"
                : "Proceed to Payment →"}
            </button>
          </div>
        </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4 — Payment
      ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && cart.length > 0 && (
        <div className="payment-layout">
          {/* Resume banner */}
          {resumePolicy && (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#fef3c7', border: '1.5px solid #f59e0b',
              borderRadius: 'var(--r-md)', padding: '12px 18px', marginBottom: 4,
            }}>
              <span style={{ fontSize: 20 }}>⏳</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: '#92400e' }}>Resuming Pending Payment</div>
                <div style={{ fontSize: 12.5, color: '#78350f', marginTop: 2 }}>
                  Proposal <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{resumePolicy.proposalId}</span>
                  {' · '}{resumePolicy.customerName}{' · '}₹{resumePolicy.premium.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Order summary */}
          <div className="card payment-summary-card">
            <div className="card-header">
              <span className="card-title">Order Summary</span>
            </div>
            <div className="card-body">
              {/* Products in cart */}
              <div style={{ marginBottom: 4 }}>
                {cart.map((p, i) => (
                  <div key={p.id} style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 0 }}>
                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{POLICY_TYPE_ICON[p.policyType] ?? "📋"}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3, color: "#7c3aed" }}>{p.name}</div>
                          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{p.provider} · <span style={{ fontFamily: "monospace" }}>{p.code}</span></div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", flexShrink: 0 }}>
                        {p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {p.sumInsured && (
                        <span style={{ fontSize: 11, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          SI: ₹{Number(p.sumInsured).toLocaleString("en-IN")}
                        </span>
                      )}
                      {p.coverage && (
                        <span style={{ fontSize: 11, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          {COV_LABEL[p.coverage] ?? p.coverage}
                        </span>
                      )}
                      {p.ageBandId && (
                        <span style={{ fontSize: 11, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          Band {p.ageBandId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Insured Members */}
              {members.length > 0 && (
                <div style={{ margin: "4px 0 2px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 12px", marginBottom: 6,
                    background: "var(--surface-2)", borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: 13 }}>👥</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".6px" }}>
                      Insured Members
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "var(--brand)", background: "var(--brand-light)", borderRadius: 10, padding: "1px 8px" }}>
                      {members.length}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
                    {members.map((m, i) => (
                      <div key={m.type} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 10px", borderRadius: 8,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: "#1e293b", color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800,
                        }}>
                          {(m.name || m.type).charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {m.name || <span style={{ color: "var(--text-3)", fontStyle: "italic", fontWeight: 400 }}>Name not entered</span>}
                          </div>
                          {m.dob && (
                            <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 1 }}>DOB: {m.dob}</div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            {m.type}
                          </div>
                          {m.gender && (
                            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{m.gender}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nominees */}
              {nominees.length > 0 && (
                <div style={{ margin: "2px 0 6px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 12px", marginBottom: 6,
                    background: "var(--surface-2)", borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: 13 }}>📋</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".6px" }}>
                      Nominees
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "var(--brand)", background: "var(--brand-light)", borderRadius: 10, padding: "1px 8px" }}>
                      {nominees.length}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 10 }}>
                    {nominees.map((n, i) => (
                      <div key={n.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 10px", borderRadius: 8,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                          background: n.name ? "#1e293b" : "#f3f4f6",
                          color: n.name ? "#fff" : "var(--text-3)",
                          border: n.name ? "none" : "1px solid #e5e7eb",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800,
                        }}>
                          {n.name ? n.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {n.name || <span style={{ color: "var(--text-3)", fontStyle: "italic", fontWeight: 400 }}>Name not entered</span>}
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 1 }}>
                            {[n.relation, n.age ? `${n.age} yrs` : null].filter(Boolean).join(" · ") || "—"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{n.share || "0"}%</div>
                          <div style={{ fontSize: 11, color: "var(--text-3)" }}>share</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary rows */}
              {[
                ["Insurance Type", insuranceType],
                ["Policy Period",  "1 Year"],
                ["Plans",          `${cart.length} plan${cart.length > 1 ? "s" : ""}`],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "7px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
                }}>
                  <span style={{ color: "var(--text-2)" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}

              {/* Premium breakdown */}
              {cart.length > 1 && cart.map(p => (
                <div key={p.id} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "5px 0", fontSize: 12.5, color: "var(--text-2)",
                }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "60%" }}>{p.name}</span>
                  <span>{p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}</span>
                </div>
              ))}

              {/* Total */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0 0", marginTop: 4, borderTop: "2px solid var(--border)",
              }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Total Premium</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--brand)" }}>
                  ₹{cart.reduce((s, x) => s + (x.premium ?? 0), 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Choose Payment Method</span>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    key: "UPI",
                    label: "📱 UPI",
                    desc: "GPay, PhonePe, Paytm, BHIM",
                  },
                  {
                    key: "NEFT",
                    label: "🏦 NEFT / RTGS",
                    desc: "Bank transfer",
                  },
                  {
                    key: "Card",
                    label: "💳 Debit / Credit",
                    desc: "Visa, Mastercard, RuPay",
                  },
                  {
                    key: "Wallet",
                    label: "👛 Wallet",
                    desc: "Paytm, Amazon Pay",
                  },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPayMethod(m.key)}
                    style={{
                      padding: "14px 18px",
                      borderRadius: "var(--r-md)",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      minWidth: 150,
                      border: `2px solid ${payMethod === m.key ? "var(--brand)" : "var(--border)"}`,
                      background: payMethod === m.key ? "#f5f3ff" : "#fff",
                      transition: "all .13s",
                    }}
                  >
                    <div
                      style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}
                    >
                      {m.label}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {m.desc}
                    </div>
                  </button>
                ))}
              </div>

              {payMethod === "UPI" && (
                <Field label="UPI ID" required>
                  <Input
                    placeholder="yourname@okaxis / 9876543210@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </Field>
              )}
              {payMethod === "NEFT" && (
                <div
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    padding: 18,
                    borderRadius: "var(--r-md)",
                    lineHeight: 2.1,
                    fontSize: 13.5,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>
                    Bank Transfer Details
                  </div>
                  {[
                    ["Bank", "HDFC Bank"],
                    ["Account Name", "InsureRight Platform Pvt Ltd"],
                    ["Account No.", "50200012345678"],
                    ["IFSC", "HDFC0001234"],
                    ["Branch", "Bandra, Mumbai"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span
                        style={{
                          color: "var(--text-3)",
                          width: 120,
                          display: "inline-block",
                        }}
                      >
                        {k}:
                      </span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12.5,
                      color: "var(--amber)",
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    <span>⚠</span> Policy will be issued within 2 hours of
                    payment confirmation
                  </div>
                </div>
              )}
              {payMethod === "Card" && (
                <div className="form-grid">
                  <Field label="Card Number">
                    <Input placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                  </Field>
                  <Field label="Cardholder Name">
                    <Input placeholder="Name as on card" />
                  </Field>
                  <Field label="Expiry (MM/YY)">
                    <Input placeholder="MM/YY" maxLength={5} />
                  </Field>
                  <Field label="CVV">
                    <Input type="password" placeholder="CVV" maxLength={4} />
                  </Field>
                </div>
              )}
              {payMethod === "Wallet" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {["Paytm Wallet", "PhonePe", "Amazon Pay", "MobiKwik"].map(
                    (w) => (
                      <button
                        key={w}
                        type="button"
                        className="btn btn-ghost btn-sm"
                      >
                        {w}
                      </button>
                    ),
                  )}
                </div>
              )}

              <div className="actions-row">
                <button type="button" className="btn btn-ghost" onClick={back}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitPayment}
                  style={{ minWidth: 200 }}
                >
                  <PaymentIcon size={16} /> Confirm & Issue Policy
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5 — Payment Received
      ══════════════════════════════════════════════════════════════════ */}
      {step === 5 && policyResults.length > 0 && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", padding: "52px 32px 44px" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 22, background: "linear-gradient(135deg,#fb7185,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 10 }}>
                Payment Received Successfully
              </div>
              <div style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.7, marginBottom: 32 }}>
                Payment for <strong style={{ color: "var(--text)" }}>{policyResults[0].customer}</strong> has been confirmed.
                Your policy will be issued shortly.
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-ghost" onClick={() => navigate("/policy")}>
                  View All Policies
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/policy")}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

