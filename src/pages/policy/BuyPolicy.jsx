import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { PRODUCTS, PRODUCTS_BY_TYPE, POLICY_TYPE_ICON, PREMIUM_CHART } from "../product/productData";
import { AGENTS as KMD_AGENTS } from "../agent/agentData";
import { INITIAL_LEADS, CAMPAIGNS } from "../crm/crmData";

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
  "Select Customer",
  "Insurance Type",
  "Select Product",
  "Members",
  "Proposal",
  "Payment",
  "Policy Issued",
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
  const colors = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"];
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
  return (
    <div className="bp-cust-strip" style={{
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      background: "var(--surface)", border: "1.5px solid var(--brand-light)",
      borderRadius: "var(--r-md)", padding: "11px 16px", marginBottom: 20,
      boxShadow: "0 2px 8px rgba(124,58,237,.07)",
    }}>
      <Avatar name={customer.name} size={36} fontSize={13} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{customer.name}</span>
          <StatusBadge status={customer.kyc} />
        </div>
        <div className="bp-cust-detail" style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
          📱 {customer.mobile}
          <span className="bp-cust-email"> · ✉ {customer.email}</span>
        </div>
      </div>
      <div className="bp-cust-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 11.5, background: "var(--brand-light)", borderRadius: 99,
          padding: "3px 10px", color: "var(--brand)", fontWeight: 600, whiteSpace: "nowrap",
        }}>
          {customer.policies} {customer.policies === 1 ? "policy" : "policies"}
        </span>
        {canChange && (
          <button className="btn btn-ghost btn-sm" onClick={onChangeCustomer}>Change</button>
        )}
      </div>
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

  // Unified initial customer — self (customer role) OR broker-preselected OR none
  const initialCustomer = selfCustomer ?? preselectedCustomer;

  // Step state — skip Step 0 when customer already known
  const [step, setStep] = useState(initialCustomer ? 1 : 0);

  // Step 0 — customer selection (agent/broker only)
  const [custSearch, setCustSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);

  // Step 1 — insurance type
  const [insuranceType, setInsuranceType] = useState(null);

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

  // Step 2 — product selection
  const [cart, setCart] = useState([]);
  const [productSels, setProductSels] = useState({});  // per-product {sumInsured,ageBandId,coverage,premium}

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
    if (insuranceType === "Health") return allCampaignProducts;
    const byType = PRODUCTS_BY_TYPE[insuranceType] ?? [];
    if (!agentCampaignProductIds) return byType;
    return byType.filter(p => agentCampaignProductIds.has(p.id));
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
    setMembers((prev) =>
      prev.map((m) => (m.type === type ? { ...m, [field]: val } : m)),
    );

  // Finalize payment — generate one policy per cart item
  const submitPayment = () => {
    const rand = () => Math.floor(Math.random() * 900000 + 100000);
    setPolicyResults(cart.map(p => ({
      policyNo:   `KMD/2025/${rand()}`,
      proposalId: `PRO-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
      product:    p.name,
      provider:   p.provider,
      customer:   selectedCustomer?.name,
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
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              {/* Who is this policy for? */}
              <div >
              {isSalesAgent
                ? "Customers assigned to you from CRM campaigns"
                : "Search and select an existing customer, or add a new one"}
            </div>
            </div>
            
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-3)",
                fontSize: 16,
              }}
            >
              🔍
            </span>
            <input
              className="field-input"
              style={{ paddingLeft: 38 }}
              placeholder="Search by name, mobile or email…"
              value={custSearch}
              onChange={(e) => setCustSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Customer cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxHeight: 420,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {filteredCustomers.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "var(--text-3)",
                }}
              >
                No customers match your search
              </div>
            )}
            {filteredCustomers.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              const isRejected = c.kyc === "Rejected";
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCustomer(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    textAlign: "left",
                    borderRadius: "var(--r-md)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    border: `2px solid ${isSelected ? "var(--brand)" : "var(--border)"}`,
                    background: isSelected
                      ? "var(--brand-light)"
                      : isRejected
                        ? "#fff8f8"
                        : "var(--surface)",
                    boxShadow: isSelected
                      ? "0 2px 10px rgba(124,58,237,.15)"
                      : "var(--shadow-sm)",
                    transition: "all .13s",
                  }}
                >
                  {/* Avatar */}
                  <Avatar name={c.name} size={44} fontSize={16} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        marginBottom: 3,
                        color: "var(--text)",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                      📱 {c.mobile} · ✉ {c.email}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--text-3)",
                        marginTop: 2,
                      }}
                    >
                      DOB: {c.dob} · {c.gender}
                    </div>
                  </div>

                  {/* Right side */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 6,
                    }}
                  >
                    <StatusBadge status={c.kyc} />
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {c.policies} {c.policies === 1 ? "policy" : "policies"}
                    </span>
                  </div>

                  {/* Selection tick */}
                  {isSelected && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--brand)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginLeft: 4,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add new customer shortcut — hidden for sales agents */}
          {!isSalesAgent && (
            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginTop: 16,
                paddingTop: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>
                Customer not in the list?
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/customer/create")}
              >
                <CustomerIcon size={14} /> + Add New Customer
              </button>
            </div>
          )}

          {/* Continue CTA */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              disabled={!selectedCustomer}
              onClick={next}
              style={{ minWidth: 220 }}
            >
              Continue with{" "}
              {selectedCustomer ? selectedCustomer.name : "selected customer"} →
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1 — Insurance Type
      ══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          {selectedCustomer && <KYCWarning kyc={selectedCustomer.kyc} />}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              What type of insurance?
            </div>
            <div className="text-muted">
              Select the insurance type for {selectedCustomer?.name}
            </div>
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <button
              type="button"
              onClick={() => { setInsuranceType("Health"); next(); }}
              style={{
                width: "100%", padding: "32px 24px", borderRadius: 16,
                cursor: "pointer", fontFamily: "inherit",
                border: "2px solid var(--brand)", background: "var(--brand-light)",
                boxShadow: "0 4px 16px rgba(124,58,237,.12)", textAlign: "center",
                transition: "all .15s",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 14 }}>🏥</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--text)" }}>
                Health Insurance
              </div>
              <div style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6 }}>
                Base policy, top-up, OPD, payment protection &amp; more
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3 — Members
      ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="card">
          <div className="card-body">
            {false ? (
              <div>
                <div
                  style={{ fontWeight: 600, fontSize: 15, marginBottom: 20 }}
                >
                  Vehicle Details
                </div>
                <div className="form-grid">
                  <Field label="Make / Brand" required>
                    <Input
                      placeholder="e.g. Maruti Suzuki"
                      value={vehicle.make}
                      onChange={setV("make")}
                      required
                    />
                  </Field>
                  <Field label="Model" required>
                    <Input
                      placeholder="e.g. Swift Dzire"
                      value={vehicle.model}
                      onChange={setV("model")}
                      required
                    />
                  </Field>
                  <Field label="Variant">
                    <Input
                      placeholder="e.g. ZXI+"
                      value={vehicle.variant}
                      onChange={setV("variant")}
                    />
                  </Field>
                  <Field label="Fuel Type" required>
                    <Select
                      value={vehicle.fuelType}
                      onChange={setV("fuelType")}
                      required
                    >
                      <option value="">Select fuel type</option>
                      {["Petrol", "Diesel", "Electric", "CNG", "Hybrid"].map(
                        (x) => (
                          <option key={x}>{x}</option>
                        ),
                      )}
                    </Select>
                  </Field>
                  <Field label="Year of Manufacture" required>
                    <Input
                      placeholder="e.g. 2021"
                      value={vehicle.year}
                      onChange={setV("year")}
                      required
                    />
                  </Field>
                  <Field label="Registration Number" required>
                    <Input
                      placeholder="e.g. MH02AB1234"
                      value={vehicle.regNo}
                      onChange={setV("regNo")}
                      required
                      style={{ textTransform: "uppercase" }}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    Family Members to Cover
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      marginTop: 3,
                    }}
                  >
                    Premium is calculated based on age and number of insured
                    members
                  </div>
                </div>

                {/* Quick-add pills — only shows slots not yet added */}
                {(() => {
                  const addedTypes = members.map((m) => m.type);
                  const available = FAMILY_SLOTS.filter(
                    (s) => s.type !== "Self" && !addedTypes.includes(s.type),
                  );
                  if (available.length === 0) return null;
                  return (
                    <div style={{ marginBottom: 20 }}>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--text-3)",
                          marginBottom: 8,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: ".5px",
                        }}
                      >
                        + Add Member
                      </div>
                      <div
                        style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
                      >
                        {available.map((slot) => (
                          <button
                            key={slot.type}
                            type="button"
                            onClick={() => addMember(slot.type)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "7px 14px",
                              borderRadius: 99,
                              border: "1.5px dashed var(--brand)",
                              background: "var(--brand-light)",
                              color: "var(--brand)",
                              fontWeight: 600,
                              fontSize: 13,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "all .12s",
                            }}
                          >
                            <span>{slot.icon}</span> {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Member cards */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {members.map((m) => {
                    const slot = FAMILY_SLOTS.find((s) => s.type === m.type);
                    const isSelf = m.type === "Self";
                    const age = m.dob
                      ? Math.floor(
                          (new Date() - new Date(m.dob)) /
                            (365.25 * 24 * 3600 * 1000),
                        )
                      : null;
                    return (
                      <div
                        key={m.type}
                        style={{
                          border: `1.5px solid ${isSelf ? "var(--brand)" : "var(--border)"}`,
                          borderRadius: "var(--r-md)",
                          padding: "14px 18px",
                          background: isSelf
                            ? "var(--brand-light)"
                            : "var(--surface)",
                        }}
                      >
                        {/* Row header */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <span style={{ fontSize: 22 }}>{slot?.icon}</span>
                            <div>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: 14,
                                  color: isSelf
                                    ? "var(--brand)"
                                    : "var(--text)",
                                }}
                              >
                                {slot?.label}
                              </span>
                              {isSelf && (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--brand)",
                                    marginLeft: 8,
                                    fontWeight: 500,
                                  }}
                                >
                                  Primary Insured
                                </span>
                              )}
                              {age !== null && (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "var(--text-3)",
                                    marginLeft: 8,
                                  }}
                                >
                                  Age: {age} yrs
                                </span>
                              )}
                            </div>
                          </div>
                          {!isSelf && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => removeMember(m.type)}
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {/* Fields */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 1fr",
                            gap: 12,
                          }}
                        >
                          <Field label="Full Name" required>
                            <Input
                              placeholder="Full name"
                              value={m.name}
                              onChange={(e) =>
                                updateMember(m.type, "name", e.target.value)
                              }
                              disabled={isSelf}
                            />
                          </Field>
                          <Field label="Date of Birth" required>
                            <Input
                              type="date"
                              value={m.dob}
                              onChange={(e) =>
                                updateMember(m.type, "dob", e.target.value)
                              }
                              disabled={isSelf}
                            />
                          </Field>
                          <Field label="Gender" required>
                            <Select
                              value={m.gender}
                              onChange={(e) =>
                                updateMember(m.type, "gender", e.target.value)
                              }
                              disabled={isSelf}
                            >
                              <option value="">Select gender</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </Select>
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="actions-row">
              <button className="btn btn-primary" onClick={next}>
                Continue to Proposal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Select Product (from campaign assignments)
      ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Select Products</div>
            <div className="text-muted">
              Choose products and select a coverage option for each
            </div>
          </div>

          {availableProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📦</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No products available</div>
              <div style={{ fontSize: 13 }}>No products are assigned to your campaigns</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, alignItems: "start" }}>
              {availableProducts.map(p => {
                const inCart    = !!cart.find(x => x.id === p.id);
                const sel       = psel(p.id);
                const chartRows = PREMIUM_CHART[p.id] ?? [];
                const uniqueSIs = [...new Set(chartRows.map(r => r.sumInsured))];
                const hasAB     = chartRows.some(r => r.ageBandId != null);
                const rowBands  = hasAB
                  ? [...new Set(chartRows.filter(r => r.sumInsured === Number(sel.sumInsured)).map(r => String(r.ageBandId)))]
                  : [];
                const activeRow = matchRow(p.id, sel.sumInsured, sel.ageBandId);
                const covOpts   = coverageOpts(activeRow);
                const icon      = POLICY_TYPE_ICON[p.policyType] ?? "📋";

                return (
                  <div key={p.id} style={{
                    borderRadius: 14,
                    border: `2px solid ${inCart ? "var(--brand)" : "var(--border)"}`,
                    background: "#fff",
                    boxShadow: inCart ? "0 4px 18px rgba(124,58,237,.13)" : "0 1px 4px rgba(0,0,0,.06)",
                    overflow: "hidden",
                    transition: "border-color .15s, box-shadow .18s",
                  }}>

                    {/* ── Header ──────────────────────────────── */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "11px 13px",
                      background: inCart ? "rgba(124,58,237,.04)" : "var(--surface-2)",
                      borderBottom: `1px solid ${inCart ? "rgba(124,58,237,.15)" : "var(--border)"}`,
                    }}>
                      <input
                        type="checkbox"
                        checked={inCart}
                        onChange={() => toggleCart(p)}
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--brand)", flexShrink: 0 }}
                      />
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: inCart ? "var(--brand)" : "var(--surface)",
                        border: `1px solid ${inCart ? "var(--brand)" : "var(--border)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, transition: "all .15s",
                      }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 12.5, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.provider}
                        </div>
                      </div>
                    </div>

                    {/* ── Detail strip ────────────────────────── */}
                    <div style={{ padding: "7px 13px", background: "var(--brand-light)", borderBottom: "1px solid rgba(124,58,237,.15)", fontSize: 11.5 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 14px", color: "var(--text-2)" }}>
                        <span><span style={{ color: "var(--text-3)" }}>Code </span>
                          <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--brand)" }}>{p.code}</span></span>
                        <span><span style={{ color: "var(--text-3)" }}>Type </span><strong>{p.policyType}</strong></span>
                        <span style={{ color: "var(--green)", fontWeight: 600 }}>● Active</span>
                      </div>
                    </div>

                    {/* ── Body ────────────────────────────────── */}
                    <div style={{ padding: "11px 13px" }}>
                      {chartRows.length === 0 ? (
                        <div style={{ fontSize: 12, color: "var(--text-3)", padding: "6px 0", fontStyle: "italic" }}>
                          Contact for premium details
                        </div>
                      ) : (
                        <>
                          {/* Controls row: Sum Insured + Age Band */}
                          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: ".4px" }}>Sum Insured</div>
                              <select
                                className="field-select"
                                value={sel.sumInsured}
                                onChange={e => {
                                  const si    = e.target.value;
                                  const bands = hasAB ? [...new Set(chartRows.filter(r => r.sumInsured === Number(si)).map(r => String(r.ageBandId)))] : [];
                                  const band  = bands[0] ?? '';
                                  const row   = matchRow(p.id, si, band);
                                  const cov   = row?.selfOnly != null ? 'selfOnly' : '';
                                  setPsel(p.id, { sumInsured: si, ageBandId: band, coverage: cov, premium: row?.[cov] ?? null });
                                }}
                                style={{ width: "100%", fontSize: 12, padding: "5px 8px" }}
                              >
                                {uniqueSIs.map(si => (
                                  <option key={si} value={String(si)}>₹{si.toLocaleString("en-IN")}</option>
                                ))}
                              </select>
                            </div>
                            {hasAB && rowBands.length > 0 && (
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: ".4px" }}>Age Band</div>
                                <select
                                  className="field-select"
                                  value={sel.ageBandId}
                                  onChange={e => {
                                    const band = e.target.value;
                                    const row  = matchRow(p.id, sel.sumInsured, band);
                                    const cov  = sel.coverage && row?.[sel.coverage] != null ? sel.coverage : (row?.selfOnly != null ? 'selfOnly' : '');
                                    setPsel(p.id, { ageBandId: band, coverage: cov, premium: row?.[cov] ?? null });
                                  }}
                                  style={{ width: "100%", fontSize: 12, padding: "5px 8px" }}
                                >
                                  {rowBands.map(b => <option key={b} value={b}>Band {b}</option>)}
                                </select>
                              </div>
                            )}
                          </div>

                          {/* Coverage options — compact radio rows */}
                          {covOpts.length > 0 && (
                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
                              {covOpts.map(opt => {
                                const active = sel.coverage === opt.key;
                                return (
                                  <label key={opt.key} style={{
                                    display: "flex", alignItems: "center", gap: 9,
                                    padding: "6px 8px", borderRadius: 8, cursor: "pointer",
                                    background: active ? "rgba(124,58,237,.07)" : "transparent",
                                    border: `1px solid ${active ? "rgba(124,58,237,.2)" : "transparent"}`,
                                    transition: "all .12s",
                                  }}>
                                    <input
                                      type="radio"
                                      name={`cov-${p.id}`}
                                      checked={active}
                                      onChange={() => setPsel(p.id, { coverage: opt.key, premium: opt.value })}
                                      style={{ accentColor: "var(--brand)", flexShrink: 0, width: 14, height: 14 }}
                                    />
                                    <span style={{ flex: 1, fontSize: 12, color: active ? "var(--brand)" : "var(--text-2)", fontWeight: active ? 600 : 400 }}>
                                      {opt.label}
                                    </span>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: active ? "var(--brand)" : "var(--text)", letterSpacing: "-0.2px", flexShrink: 0 }}>
                                      ₹{opt.value.toLocaleString("en-IN")}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* ── Selected premium footer ──────────────── */}
                    {inCart && sel.premium != null && (
                      <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "7px 13px",
                        background: "rgba(124,58,237,.06)",
                        borderTop: "1px solid rgba(124,58,237,.15)",
                      }}>
                        <span style={{ fontSize: 11, color: "var(--brand)", fontWeight: 500 }}>Selected premium</span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--brand)" }}>
                          ₹{sel.premium.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Sticky footer bar ── */}
          <div style={{
            marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 16, padding: "12px 18px",
            background: cart.length > 0 ? "var(--brand-light)" : "var(--surface)",
            border: `1.5px solid ${cart.length > 0 ? "rgba(124,58,237,.2)" : "var(--border)"}`,
            borderRadius: 12, transition: "all .2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>Selected</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                  {cart.length} {cart.length === 1 ? "product" : "products"}
                </div>
              </div>
              {cart.length > 0 && (
                <>
                  <div style={{ width: 1, height: 32, background: "var(--border)" }} />
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>Total Premium</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--brand)" }}>
                      ₹{cart.reduce((s, x) => s + (x.premium ?? 0), 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button className="btn btn-primary" disabled={cart.length === 0} onClick={next} style={{ flexShrink: 0 }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4 — Proposal Form
      ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && cart.length > 0 && (
        <div>
          {/* Selected plans summary */}
          <div style={{
            background: "var(--brand-light)", borderRadius: "var(--r-md)",
            padding: "14px 18px", marginBottom: 24,
            border: "1.5px solid rgba(124,58,237,.25)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>
              Selected Plans
            </div>
            {cart.map((p, i) => (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0",
                borderBottom: i < cart.length - 1 ? "1px solid rgba(124,58,237,.12)" : "none",
                fontSize: 13,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{POLICY_TYPE_ICON[p.policyType] ?? "📋"}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                      {p.sumInsured ? `₹${Number(p.sumInsured).toLocaleString("en-IN")} SI` : ""}
                      {p.coverage ? ` · ${COV_LABEL[p.coverage] ?? p.coverage}` : ""}
                    </div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: "var(--brand)", flexShrink: 0, marginLeft: 12 }}>
                  {p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, marginTop: 2, borderTop: "1.5px solid rgba(124,58,237,.2)" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>Total Premium</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: "var(--brand)" }}>
                ₹{cart.reduce((s, x) => s + (x.premium ?? 0), 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {/* Policyholder details */}
              <div className="section-block">
                <div className="section-heading">👤 Policy Holder Details</div>
                <div
                  style={{
                    background: "var(--surface-2)",
                    borderRadius: "var(--r-sm)",
                    padding: "8px 12px",
                    marginBottom: 16,
                    fontSize: 12.5,
                    color: "var(--text-3)",
                  }}
                >
                  ℹ Auto-filled from customer record — edit only if needed
                </div>
                <div className="form-grid">
                  <Field label="Full Name" required>
                    <Input
                      value={proposal.customerName}
                      onChange={setP("customerName")}
                      required
                    />
                  </Field>
                  <Field label="Mobile" required>
                    <Input
                      type="tel"
                      value={proposal.mobile}
                      onChange={setP("mobile")}
                      required
                    />
                  </Field>
                  <Field label="Email">
                    <Input
                      type="email"
                      value={proposal.email}
                      onChange={setP("email")}
                    />
                  </Field>
                  <Field label="Address" required>
                    <Input
                      value={proposal.address}
                      onChange={setP("address")}
                      required
                    />
                  </Field>
                </div>
              </div>

              {/* Medical info — shown for health-related policy types */}
              {["Base Policy", "Top Up Policy", "OPD", "Age Band Premium", "Super Top Up"].includes(insuranceType) && (
                <div className="section-block">
                  <div className="section-heading">🏥 Medical Information</div>
                  <div className="form-grid">
                    <Field
                      label="Any pre-existing medical conditions?"
                      required
                    >
                      <Select
                        value={proposal.medicalHistory}
                        onChange={setP("medicalHistory")}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Select>
                    </Field>
                    {proposal.medicalHistory === "Yes" && (
                      <Field label="Describe conditions">
                        <Textarea
                          placeholder="e.g. Diabetes (Type 2), Hypertension…"
                          value={proposal.preExisting}
                          onChange={setP("preExisting")}
                        />
                      </Field>
                    )}
                  </div>
                </div>
              )}

              {/* Nominee */}
              <div className="section-block">
                <div className="section-heading">📝 Nominee Details</div>
                <div className="form-grid-3">
                  <Field label="Nominee Name" required>
                    <Input
                      placeholder="Full name"
                      value={proposal.nomineeName}
                      onChange={setP("nomineeName")}
                      required
                    />
                  </Field>
                  <Field label="Relation" required>
                    <Select
                      value={proposal.nomineeRelation}
                      onChange={handleNomineeRelation}
                      required
                    >
                      <option value="">Select relation</option>
                      {["Spouse", "Child", "Parent", "Sibling", "Other"].map(
                        (r) => (
                          <option key={r}>{r}</option>
                        ),
                      )}
                    </Select>
                  </Field>
                  <Field label="Share %" required>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={proposal.nomineeShare}
                      onChange={setP("nomineeShare")}
                      required
                    />
                  </Field>
                  <Field label="Nominee Age" required>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 35"
                      value={proposal.nomineeAge}
                      onChange={setP("nomineeAge")}
                      required
                    />
                  </Field>
                </div>
              </div>

              {/* Declaration */}
              <div className="section-block">
                <div className="section-heading">✅ Declaration</div>
                <label
                  style={{
                    display: "flex",
                    gap: 12,
                    cursor: "pointer",
                    alignItems: "flex-start",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={proposal.declaration}
                    onChange={(e) =>
                      setProposal((p) => ({
                        ...p,
                        declaration: e.target.checked,
                      }))
                    }
                    style={{ marginTop: 3, accentColor: "var(--brand)" }}
                  />
                  <span
                    style={{
                      fontSize: 13.5,
                      color: "var(--text-2)",
                      lineHeight: 1.65,
                    }}
                  >
                    I declare that all information provided is true and correct.
                    I understand that any misrepresentation may result in
                    rejection of claim or cancellation of policy. I consent to
                    sharing this data with the insurer for policy issuance.
                  </span>
                </label>
              </div>

              <div className="actions-row">
                <button type="button" className="btn btn-ghost" onClick={back}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!proposal.declaration}
                  onClick={next}
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5 — Payment
      ══════════════════════════════════════════════════════════════════ */}
      {step === 5 && cart.length > 0 && (
        <div className="payment-layout">
          {/* Order summary */}
          <div className="card payment-summary-card">
            <div className="card-header">
              <span className="card-title">Order Summary</span>
            </div>
            <div className="card-body">
              {/* Customer */}
              {selectedCustomer && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 12,
                  }}
                >
                  <Avatar
                    name={selectedCustomer.name}
                    size={32}
                    fontSize={12}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>
                      {selectedCustomer.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {selectedCustomer.mobile}
                    </div>
                  </div>
                </div>
              )}
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
                          <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{p.name}</div>
                          <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{p.provider} · <span style={{ fontFamily: "monospace" }}>{p.code}</span></div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", flexShrink: 0 }}>
                        {p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {p.sumInsured && (
                        <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 7px", color: "var(--text-2)", fontWeight: 500 }}>
                          SI: ₹{Number(p.sumInsured).toLocaleString("en-IN")}
                        </span>
                      )}
                      {p.coverage && (
                        <span style={{ fontSize: 11, background: "var(--brand-light)", border: "1px solid rgba(124,58,237,.2)", borderRadius: 5, padding: "2px 7px", color: "var(--brand)", fontWeight: 500 }}>
                          {COV_LABEL[p.coverage] ?? p.coverage}
                        </span>
                      )}
                      {p.ageBandId && (
                        <span style={{ fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 7px", color: "var(--text-2)", fontWeight: 500 }}>
                          Band {p.ageBandId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

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
                      background:
                        payMethod === m.key
                          ? "var(--brand-light)"
                          : "var(--surface)",
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
          STEP 6 — Policy Issued
      ══════════════════════════════════════════════════════════════════ */}
      {step === 6 && policyResults.length > 0 && (
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", padding: "40px 32px" }}>
              <div style={{ fontSize: 68, marginBottom: 18 }}>🎉</div>
              <div style={{ fontWeight: 700, fontSize: 22, color: "var(--green)", marginBottom: 8 }}>
                {policyResults.length > 1
                  ? `${policyResults.length} Policies Issued Successfully!`
                  : "Policy Issued Successfully!"}
              </div>
              <div style={{ color: "var(--text-3)", marginBottom: 28, lineHeight: 1.6 }}>
                Policies for <strong>{policyResults[0].customer}</strong> have been activated.
                Confirmations have been sent to the customer's registered email.
              </div>

              {/* One card per policy */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28, textAlign: "left" }}>
                {policyResults.map((r, i) => (
                  <div key={r.policyNo} style={{
                    background: "var(--surface-2)", borderRadius: "var(--r-md)",
                    padding: "18px 22px", border: "1px solid var(--border)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        Policy {i + 1} — {r.product}
                      </span>
                      <StatusBadge status="Issued" />
                    </div>
                    {[
                      ["Proposal ID",   r.proposalId],
                      ["Policy Number", r.policyNo],
                      ["Provider",      r.provider],
                    ].map(([k, v]) => (
                      <div key={k} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
                      }}>
                        <span style={{ color: "var(--text-2)", fontWeight: 500 }}>{k}</span>
                        <span style={{ fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{
                background: "var(--brand-light)", borderRadius: "var(--r-md)",
                padding: "12px 20px", marginBottom: 28,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {policyResults.length} {policyResults.length === 1 ? "Policy" : "Policies"} Issued
                </span>
                <span style={{ fontWeight: 600, fontSize: 13, color: "var(--amber)" }}>
                  Premium — Contact for details
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => navigate("/policy")}>
                  View All Policies
                </button>
                <button className="btn btn-primary" onClick={() => navigate("/policy")}>
                  ⬇ Download All Policies
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
