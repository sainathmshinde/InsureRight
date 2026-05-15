import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  HealthIcon,
  MotorIcon,
  LifeIcon,
  ShieldCheckIcon,
  PaymentIcon,
  CustomerIcon,
} from "../../icons";
import { AGENTS as KMD_AGENTS } from "../agent/agentData";
import { INITIAL_LEADS } from "../crm/crmData";

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

// ── Product catalogue ──────────────────────────────────────────────────────
const PRODUCTS = {
  Health: [
    {
      id: 1,
      name: "Star Comprehensive Health",
      code: "SHI-HC-001",
      ic: "Star Health",
      premium: 10030,
      sumInsured: "5L–50L",
      waitingPeriod: 30,
      roomRent: "No Limit",
      highlights: [
        "541 day-care procedures",
        "No sub-limits on room rent",
        "AYUSH cover",
        "Global emergency",
      ],
      addOns: ["Critical Illness Rider", "OPD Cover"],
      logo: "⭐",
    },
    {
      id: 2,
      name: "HDFC ERGO Optima Secure",
      code: "HER-HS-002",
      ic: "HDFC ERGO",
      premium: 7316,
      sumInsured: "3L–25L",
      waitingPeriod: 30,
      roomRent: "Single AC Room",
      highlights: [
        "Direct claim settlement",
        "Organ donor cover",
        "Mental illness cover",
        "Int'l emergency",
      ],
      addOns: ["Personal Accident", "Maternity Cover"],
      logo: "🔷",
    },
    {
      id: 3,
      name: "ICICI Lombard Complete Health",
      code: "ICL-HC-003",
      ic: "ICICI Lombard",
      premium: 10738,
      sumInsured: "5L–1Cr",
      waitingPeriod: 30,
      roomRent: "2% Sum Insured",
      highlights: [
        "1 Cr super coverage",
        "Unlimited restore benefit",
        "Telemedicine included",
        "14,000+ hospitals",
      ],
      addOns: ["Critical Illness Rider", "Vision Cover"],
      logo: "💎",
    },
    {
      id: 4,
      name: "Bajaj Allianz Health Guard",
      code: "BAJ-HG-004",
      ic: "Bajaj Allianz",
      premium: 6490,
      sumInsured: "3L–10L",
      waitingPeriod: 30,
      roomRent: "1% Sum Insured",
      highlights: [
        "Family floater",
        "Daily hospital cash",
        "Cataract cover",
        "Ambulance cover",
      ],
      addOns: ["OPD Cover", "Dental Cover"],
      logo: "🔶",
    },
  ],
  Motor: [
    {
      id: 5,
      name: "Bajaj Allianz Comprehensive",
      code: "BAJ-MC-005",
      ic: "Bajaj Allianz",
      premium: 5664,
      sumInsured: "IDV based",
      waitingPeriod: 0,
      roomRent: "—",
      highlights: [
        "4,000+ network garages",
        "Cashless claims",
        "Zero depreciation",
        "24/7 roadside assist",
      ],
      addOns: ["Zero Depreciation", "Engine Protection"],
      logo: "🔶",
    },
    {
      id: 6,
      name: "New India Motor OD + TP",
      code: "NIA-MC-006",
      ic: "New India Assurance",
      premium: 4248,
      sumInsured: "IDV based",
      waitingPeriod: 0,
      roomRent: "—",
      highlights: [
        "Government insurer",
        "Wide acceptance",
        "3,500+ garages",
        "Quick survey",
      ],
      addOns: ["Personal Accident", "Consumables"],
      logo: "🇮🇳",
    },
    {
      id: 7,
      name: "ICICI Lombard Motor",
      code: "ICL-MC-007",
      ic: "ICICI Lombard",
      premium: 5192,
      sumInsured: "IDV based",
      waitingPeriod: 0,
      roomRent: "—",
      highlights: [
        "Digital claim filing",
        "Own damage cover",
        "Third-party liability",
        "Fast settlement",
      ],
      addOns: ["Zero Depreciation", "RTI Cover"],
      logo: "💎",
    },
  ],
  Life: [
    {
      id: 8,
      name: "LIC Jeevan Anand",
      code: "LIC-LA-008",
      ic: "LIC",
      premium: 14160,
      sumInsured: "10L–1Cr",
      waitingPeriod: 90,
      roomRent: "—",
      highlights: [
        "Whole life protection",
        "Bonus additions",
        "Loan facility",
        "Guaranteed returns",
      ],
      addOns: ["Accidental Death Rider", "Critical Illness Rider"],
      logo: "🇮🇳",
    },
    {
      id: 9,
      name: "HDFC Life Sanchay Plus",
      code: "HDFC-LSP-009",
      ic: "HDFC Life",
      premium: 21240,
      sumInsured: "25L–2Cr",
      waitingPeriod: 90,
      roomRent: "—",
      highlights: [
        "Guaranteed income",
        "Flexible payout",
        "Tax benefits 80C",
        "Death benefit",
      ],
      addOns: ["Waiver of Premium"],
      logo: "🔷",
    },
    {
      id: 10,
      name: "SBI Life Smart Shield",
      code: "SBI-LSS-010",
      ic: "SBI Life",
      premium: 11210,
      sumInsured: "10L–1Cr",
      waitingPeriod: 90,
      roomRent: "—",
      highlights: [
        "Pure term cover",
        "Low premium",
        "Online discount",
        "Return of premium",
      ],
      addOns: ["Critical Illness Rider", "Accidental Death Rider"],
      logo: "🏦",
    },
  ],
};

const STEPS = [
  "Select Customer",
  "Insurance Type",
  "Members",
  "Choose Plan",
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "var(--surface)",
        border: "1.5px solid var(--brand-light)",
        borderRadius: "var(--r-md)",
        padding: "11px 18px",
        marginBottom: 24,
        boxShadow: "0 2px 8px rgba(124,58,237,.07)",
      }}
    >
      <Avatar name={customer.name} size={38} fontSize={14} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{customer.name}</span>
          <StatusBadge status={customer.kyc} />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 1 }}>
          {customer.mobile} · {customer.email} · DOB: {customer.dob}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 12,
            background: "var(--brand-light)",
            borderRadius: 99,
            padding: "3px 10px",
            color: "var(--brand)",
            fontWeight: 500,
          }}
        >
          {customer.policies} existing{" "}
          {customer.policies === 1 ? "policy" : "policies"}
        </span>
        {canChange && (
          <button className="btn btn-ghost btn-sm" onClick={onChangeCustomer}>
            Change
          </button>
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

  // Base customer pool — sales agents see only their assigned customers
  const baseCustomers = salesAssignedCustomerIds
    ? CUSTOMERS.filter(c => salesAssignedCustomerIds.has(c.id))
    : CUSTOMERS;

  // For customer login: auto-find and lock in their own record
  const selfCustomer = isCustomer
    ? (CUSTOMERS.find((c) => c.email === user.email) ?? null)
    : null;

  // Step state — customers skip Step 0 (Select Customer)
  const [step, setStep] = useState(isCustomer ? 1 : 0);

  // Step 0 — customer selection (agent/broker only)
  const [custSearch, setCustSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(selfCustomer);

  // Step 1 — insurance type
  const [insuranceType, setInsuranceType] = useState(null);

  // Step 2 — members / vehicle — start with Self only; family added on demand
  const [members, setMembers] = useState(
    selfCustomer
      ? [{ type: "Self", name: selfCustomer.name, dob: selfCustomer.dob, gender: selfCustomer.gender }]
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

  // Step 3 — plan selection
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Step 4 — proposal — pre-fill from customer record
  const [proposal, setProposal] = useState({
    customerName: selfCustomer?.name ?? "",
    mobile: selfCustomer?.mobile ?? "",
    email: selfCustomer?.email ?? "",
    address: selfCustomer?.address ?? "",
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
  const [policyResult, setPolicyResult] = useState(null);

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
  // Customer can't go back to Step 0 (customer list); navigate to policy page instead
  const back = () => {
    if (isCustomer && step === 1) { navigate("/policy"); return; }
    setStep((s) => Math.max(s - 1, 0));
  };

  const products = PRODUCTS[insuranceType] ?? [];
  const compareProducts = products.filter((p) => compareIds.includes(p.id));

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

  // Toggle compare list (max 3)
  const toggleCompare = (id) =>
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );

  // Finalize payment
  const submitPayment = () => {
    const ic = selectedProduct?.ic?.slice(0, 3).toUpperCase();
    const rand = () => Math.floor(Math.random() * 900000 + 100000);
    setPolicyResult({
      policyNo: `${ic}/2025/${rand()}`,
      proposalId: `PRO-2025-${Math.floor(Math.random() * 9000 + 1000)}`,
      product: selectedProduct?.name,
      ic: selectedProduct?.ic,
      premium: selectedProduct?.premium,
      customer: selectedCustomer?.name,
    });
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
              Who is this policy for?
            </div>
            <div className="text-muted">
              {isSalesAgent
                ? "Customers assigned to you from CRM campaigns"
                : "Search and select an existing customer, or add a new one"}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: 20,
              maxWidth: 740,
              margin: "0 auto",
            }}
          >
            {[
              {
                type: "Health",
                icon: HealthIcon,
                color: "#2563eb",
                desc: "Medical expenses, hospitalisation, critical illness cover",
                available: true,
              },
              // { type: 'Motor',  icon: MotorIcon,  color: '#d97706', desc: 'Car, bike & commercial vehicle — Own Damage + Third Party',  available: false },
              // { type: 'Life',   icon: LifeIcon,   color: '#7c3aed', desc: 'Term, whole life & ULIP plans — secure your family\'s future', available: false },
            ].map(({ type, icon: Icon, color, desc, available }) => (
              <button
                key={type}
                type="button"
                disabled={!available}
                onClick={() => {
                  if (available) {
                    setInsuranceType(type);
                    next();
                  }
                }}
                style={{
                  padding: "32px 24px",
                  borderRadius: 14,
                  position: "relative",
                  cursor: available ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  opacity: available ? 1 : 0.55,
                  border: `2px solid ${insuranceType === type ? color : "var(--border)"}`,
                  background:
                    insuranceType === type ? color + "10" : "var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                  textAlign: "center",
                  transition: "all .15s",
                }}
              >
                {!available && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: ".4px",
                      textTransform: "uppercase",
                      background: "#f3f4f6",
                      color: "var(--text-3)",
                      padding: "2px 8px",
                      borderRadius: 99,
                    }}
                  >
                    Coming Soon
                  </span>
                )}
                <div
                  style={{
                    marginBottom: 14,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={42} color={color} />
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 8,
                    color: "var(--text)",
                  }}
                >
                  {type} Insurance
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "var(--text-3)",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Members / Vehicle
      ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="card">
          <div className="card-body">
            {insuranceType === "Motor" ? (
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
                View Available Plans →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3 — Choose Plan
      ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div>
          {/* Compare bar */}
          {compareIds.length > 0 && (
            <div
              style={{
                background: "var(--brand-light)",
                border: "1.5px solid var(--brand)",
                borderRadius: "var(--r-md)",
                padding: "12px 18px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "var(--brand)",
                  fontWeight: 500,
                  fontSize: 13.5,
                }}
              >
                {compareIds.length} plan{compareIds.length > 1 ? "s" : ""}{" "}
                selected for comparison
              </span>
              <div style={{ display: "flex", gap: 10 }}>
                {compareIds.length >= 2 && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowCompare(true)}
                  >
                    Compare {compareIds.length} Plans
                  </button>
                )}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCompareIds([])}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Comparison modal */}
          {showCompare && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.45)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <div
                style={{
                  background: "var(--surface)",
                  borderRadius: 16,
                  maxWidth: 920,
                  width: "100%",
                  maxHeight: "85vh",
                  overflow: "auto",
                  padding: 28,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 22,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 17 }}>
                    Plan Comparison
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowCompare(false)}
                  >
                    Close ×
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 160 }}>Feature</th>
                        {compareProducts.map((p) => (
                          <th key={p.id} style={{ minWidth: 200 }}>
                            {p.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Insurer", (p) => p.ic],
                        [
                          "Annual Premium",
                          (p) => (
                            <strong style={{ color: "var(--brand)" }}>
                              ₹{p.premium.toLocaleString()}
                            </strong>
                          ),
                        ],
                        ["Sum Insured", (p) => p.sumInsured],
                        ["Waiting Period", (p) => `${p.waitingPeriod} days`],
                        ["Room Rent", (p) => p.roomRent],
                        ["Available Add-ons", (p) => p.addOns.join(", ")],
                      ].map(([label, getter]) => (
                        <tr key={label}>
                          <td
                            style={{
                              fontWeight: 500,
                              color: "var(--text-2)",
                              fontSize: 13,
                            }}
                          >
                            {label}
                          </td>
                          {compareProducts.map((p) => (
                            <td key={p.id}>{getter(p)}</td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        {compareProducts.map((p) => (
                          <td key={p.id}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setSelectedProduct(p);
                                setShowCompare(false);
                                next();
                              }}
                            >
                              Select This Plan
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Product cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {products.map((p) => {
              const isSelected = selectedProduct?.id === p.id;
              const inCompare = compareIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    background: "var(--surface)",
                    border: `2px solid ${isSelected ? "var(--brand)" : "var(--border)"}`,
                    borderRadius: 14,
                    padding: 22,
                    boxShadow: isSelected
                      ? "0 4px 20px rgba(124,58,237,.15)"
                      : "var(--shadow-sm)",
                    transition: "all .15s",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 26, marginBottom: 6 }}>
                        {p.logo}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14.5,
                          marginBottom: 2,
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                        {p.ic}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          color: "var(--brand)",
                        }}
                      >
                        ₹{p.premium.toLocaleString()}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>
                        per year
                      </div>
                    </div>
                  </div>

                  {/* Key stats */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      padding: "12px 0",
                      margin: "0 0 14px",
                      borderTop: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {[
                      ["Sum Insured", p.sumInsured],
                      ["Waiting", `${p.waitingPeriod}d`],
                      ["Room Rent", p.roomRent],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div
                          style={{
                            fontSize: 10.5,
                            color: "var(--text-3)",
                            marginBottom: 2,
                            textTransform: "uppercase",
                            letterSpacing: ".4px",
                          }}
                        >
                          {k}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div style={{ marginBottom: 18 }}>
                    {p.highlights.map((h) => (
                      <div
                        key={h}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 7,
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            color: "var(--green)",
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          ✓
                        </span>
                        <span
                          style={{ fontSize: 12.5, color: "var(--text-2)" }}
                        >
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${inCompare ? "btn-secondary" : "btn-ghost"}`}
                      style={{ flex: 1 }}
                      onClick={() => toggleCompare(p.id)}
                    >
                      {inCompare ? "✓ Compare" : "⊕ Compare"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      onClick={() => {
                        setSelectedProduct(p);
                        next();
                      }}
                    >
                      Select →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 4 — Proposal Form
      ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && selectedProduct && (
        <div>
          {/* Selected plan pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--brand-light)",
              borderRadius: "var(--r-md)",
              padding: "13px 20px",
              marginBottom: 24,
            }}
          >
            <div>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>
                Selected plan:{" "}
              </span>
              <span
                style={{ fontWeight: 700, color: "var(--brand)", fontSize: 14 }}
              >
                {selectedProduct.name}
              </span>
              <span style={{ color: "var(--text-3)", fontSize: 13 }}>
                {" "}
                · {selectedProduct.ic}
              </span>
            </div>
            <div
              style={{ fontWeight: 700, fontSize: 18, color: "var(--brand)" }}
            >
              ₹{selectedProduct.premium.toLocaleString()}/yr
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

              {/* Medical info — Health only */}
              {insuranceType === "Health" && (
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
      {step === 5 && selectedProduct && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Order summary */}
          <div className="card" style={{ position: "sticky", top: 80 }}>
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
              {/* Product */}
              <div
                style={{
                  textAlign: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--border)",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 4 }}>
                  {selectedProduct.logo}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {selectedProduct.name}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}
                >
                  {selectedProduct.ic}
                </div>
              </div>
              {[
                ["Type", insuranceType],
                ["Sum Insured", selectedProduct.sumInsured],
                ["Policy Period", "1 Year"],
                [
                  "Base Premium",
                  `₹${Math.round(selectedProduct.premium / 1.18).toLocaleString()}`,
                ],
                [
                  "GST (18%)",
                  `₹${Math.round(selectedProduct.premium - selectedProduct.premium / 1.18).toLocaleString()}`,
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "7px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "var(--text-2)" }}>{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px 0 0",
                  fontSize: 17,
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span style={{ color: "var(--brand)" }}>
                  ₹{selectedProduct.premium.toLocaleString()}
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
                  <PaymentIcon size={16} /> Pay ₹
                  {selectedProduct.premium.toLocaleString()}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 6 — Policy Issued
      ══════════════════════════════════════════════════════════════════ */}
      {step === 6 && policyResult && (
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="card">
            <div
              className="card-body"
              style={{ textAlign: "center", padding: "48px 32px" }}
            >
              <div style={{ fontSize: 68, marginBottom: 18 }}>🎉</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  color: "var(--green)",
                  marginBottom: 8,
                }}
              >
                Policy Issued Successfully!
              </div>
              <div
                style={{
                  color: "var(--text-3)",
                  marginBottom: 32,
                  lineHeight: 1.6,
                }}
              >
                The policy for <strong>{policyResult.customer}</strong> has been
                activated. A confirmation has been sent to the customer's
                registered email.
              </div>

              {/* Policy details card */}
              <div
                style={{
                  background: "var(--surface-2)",
                  borderRadius: "var(--r-md)",
                  padding: 24,
                  marginBottom: 28,
                  textAlign: "left",
                }}
              >
                {[
                  ["Proposal ID", policyResult.proposalId],
                  ["Policy Number", policyResult.policyNo],
                  ["Customer", policyResult.customer],
                  ["Product", policyResult.product],
                  ["Insurer", policyResult.ic],
                  [
                    "Annual Premium",
                    `₹${policyResult.premium?.toLocaleString()}`,
                  ],
                  ["Status", null],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "9px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-2)",
                        fontWeight: 500,
                      }}
                    >
                      {k}
                    </span>
                    {k === "Status" ? (
                      <StatusBadge status="Issued" />
                    ) : (
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                        {v}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{ display: "flex", gap: 12, justifyContent: "center" }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/policy")}
                >
                  View All Policies
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/policy")}
                >
                  ⬇ Download Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
