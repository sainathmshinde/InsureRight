import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { useAuth } from "../../context/AuthContext";
import { Field, Input, Select, Textarea } from "../../components/fields";
import {
  StatusBadge,
  CheckboxGroup,
  Toggle,
} from "../../components/ui";
import {
  ShieldCheckIcon,
  PaymentIcon,
  MemberIcon,
} from "../../icons";
import { PRODUCTS, PRODUCTS_BY_TYPE, POLICY_TYPE_ICON, PREMIUM_CHART, PRODUCT_DETAILS } from "../product/productData";
import { OPERATORS as KMD_AGENTS } from "../agent/agentData";
import { INITIAL_LEADS, CAMPAIGNS } from "../crm/crmData";
import { POLICY_MOCK } from "./PolicyList";
import { ASSOCIATIONS, ORGANISATIONS } from "../member/orgAssocData";

// ── Provider colour coding — shared between product cards & policy details ──
const TYPE_COLORS = {
  'Base Policy':        '#1d4ed8',
  'OPD':                '#15803d',
  'Payment Protection': '#b45309',
  'Age Band Premium':   '#7c3aed',
  'Super Top Up':       '#f57c82',
  'Top Up Policy':      '#4f46e5',
};
const fmtSI = v => v >= 100000 ? `₹${(v/100000).toFixed(0)}L` : v >= 1000 ? `₹${(v/1000).toFixed(0)}K` : `₹${v}`;

// ── Shared member data (same source of truth as MemberList) ────────────
const MEMBERS = [
  {
    id: 1,
    name: "Aarav Sharma",
    mobile: "9876543210",
    email: "aarav@gmail.com",
    dob: "1990-03-15",
    gender: "Male",
    kyc: "Verified",
    policies: 2,
    organisationId: 1003,
    associationId: 1007,
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
    organisationId: 1005,
    associationId: 1033,
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
    organisationId: 1006,
    associationId: 1023,
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
    organisationId: 1005,
    associationId: 1019,
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
    organisationId: 1003,
    associationId: 1025,
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
    organisationId: 1019,
    associationId: 1021,
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
    organisationId: 1012,
    associationId: 1058,
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
    organisationId: 1003,
    associationId: 1007,
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
    organisationId: 1013,
    associationId: 1027,
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
    organisationId: 1008,
    associationId: 1032,
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
    organisationId: 1015,
    associationId: 1008,
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
    organisationId: 1012,
    associationId: 1030,
    address: "4 T Nagar, Chennai",
  },
];


const STEPS = [
  "Member",
  "Product",
  "Members",
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

// ── Persistent "policy for" member strip ─────────────────────────────────
function MemberStrip({ member, onChangeMember, canChange = true }) {
  const kycColor = member.kyc === "Verified" ? "#4ade80" : member.kyc === "Pending" ? "#fbbf24" : "#f87171";
  return (
    <div className="bp-cust-strip" style={{
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
      background: "#fff",
      borderRadius: 6, padding: "24px", marginBottom: 20,
      boxShadow: "0 1px 4.5px rgba(193,197,212,.27)",
      border: "1px solid #dee1e5",
    }}>
      {/* Avatar */}
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(180deg, #1565d8 0%, #104ea6 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, fontWeight: 800, color: "#fff",
      }}>
        {member.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: 18, color: "#2f404a", letterSpacing: "-.18px" }}>{member.name}</span>
          <span style={{
            fontSize: 13, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: member.kyc === "Verified" ? "#dcfce7" : member.kyc === "Pending" ? "#fef3c7" : "#fee2e2",
            color: kycColor,
            border: `1px solid ${kycColor}55`,
          }}>
            {member.kyc === "Verified" ? "✓" : "●"} {member.kyc}
          </span>
        </div>
        <div className="bp-cust-detail" style={{ fontSize: 14, color: "#6d747a", marginTop: 6, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {member.mobile}
          </span>
          <span className="bp-cust-email" style={{ display: "flex", alignItems: "center", gap: 6, color: "#204ff7" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#204ff7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {member.email}
          </span>
        </div>
      </div>

      {/* Action */}
      {canChange && (
        <div className="bp-cust-actions" style={{ flexShrink: 0 }}>
          <button
            onClick={onChangeMember}
            style={{
              height: 34, padding: "0 16px", borderRadius: 8, cursor: "pointer",
              background: "linear-gradient(180deg,#1565d8 0%,#104ea6 100%)", border: "none",
              color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "inherit",
              transition: "opacity .15s",
              boxShadow: "0 2px 8px rgba(168,85,247,.30)",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Change Member
          </button>
        </div>
      )}
    </div>
  );
}

// ── KYC Warning ────────────────────────────────────────────────────────────
const PAY_LABEL = {
  fontSize: 13, fontWeight: 600, color: 'var(--text-3)',
  textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block',
};

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
            ? "This member's KYC has been rejected. Policy issuance may be declined by the insurer. Please update KYC before proceeding."
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
  const isMember = user?.role === "member";

  // Detect sales agent and find their assigned members from CRM leads
  const myAgentRecord = user?.role === "agent"
    ? KMD_AGENTS.find(a => a.name.toLowerCase().includes(user.name.split(" ")[0].toLowerCase()))
    : null;
  const isSalesAgent = myAgentRecord?.agentType === "sales";
  const myAgentId    = myAgentRecord?.id ?? null;

  const salesAssignedMemberIds = useMemo(() => {
    if (!isSalesAgent || !myAgentId) return null;
    return new Set(
      INITIAL_LEADS
        .filter(l => l.salesAssignedTo === myAgentId && l.memberId != null)
        .map(l => l.memberId)
    );
  }, [isSalesAgent, myAgentId]);

  // Products available from agent's campaign assignments
  const agentCampaignProductIds = useMemo(() => {
    if (!myAgentId || isMember) return null; // null = show all
    const myCampaigns = CAMPAIGNS.filter(c => c.assignedAgents.includes(myAgentId));
    return new Set(myCampaigns.flatMap(c => c.productIds ?? []));
  }, [myAgentId, isMember]);

  // Base member pool — sales operators see only their assigned members
  const baseMembers = salesAssignedMemberIds
    ? MEMBERS.filter(c => salesAssignedMemberIds.has(c.id))
    : MEMBERS;

  // For member login: auto-find and lock in their own record
  const selfMember = isMember
    ? (MEMBERS.find((c) => c.email === user.email) ?? null)
    : null;

  // Pre-select member when navigated from member list via ?memberId=X
  const [searchParams] = useSearchParams();
  const preselectedId = searchParams.get("memberId");
  const preselectedMember = (!isMember && preselectedId)
    ? (MEMBERS.find((c) => c.id === Number(preselectedId)) ?? null)
    : null;

  // Resume pending payment via ?proposalId=PRO-2025-XXXX
  const resumeProposalId = searchParams.get("proposalId");
  const resumePolicy = resumeProposalId
    ? (POLICY_MOCK.find(p => p.proposalId === resumeProposalId) ?? null)
    : null;
  const resumeMember = resumePolicy ? (() => {
    const found = MEMBERS.find(c => c.name === resumePolicy.memberName);
    return {
      id:      found?.id ?? resumePolicy.memberId,
      name:    resumePolicy.memberName,
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

  // Unified initial member — self (member role) OR broker-preselected OR resume OR none
  const initialMember = selfMember ?? preselectedMember ?? resumeMember;

  // Step state — jump to payment (4) when resuming a pending proposal
  const [step, setStep] = useState(resumePolicy ? 4 : initialMember ? 1 : 0);

  // Step 0 — member selection (agent/broker only)
  const [custSearch, setCustSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(initialMember);

  // Insurance type — defaulted to Health (type selection step is hidden)
  const [insuranceType, setInsuranceType] = useState(resumePolicy?.type ?? "Health");

  // Step 2 — members / vehicle — start with Self only; family added on demand
  const [members, setMembers] = useState(
    initialMember
      ? [{ type: "Self", name: initialMember.name, dob: initialMember.dob, gender: initialMember.gender }]
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

  // Step 2 — which product's details are expanded (accordion when >1 product)
  const [expandedProductId, setExpandedProductId] = useState(null);

  // Step 4 — proposal — pre-fill from member record
  const [proposal, setProposal] = useState({
    memberName: initialMember?.name ?? "",
    mobile: initialMember?.mobile ?? "",
    email: initialMember?.email ?? "",
    address: initialMember?.address ?? "",
    medicalHistory: "No",
    preExisting: "",
    nomineeName: "",
    nomineeRelation: "",
    nomineeShare: "100",
    nomineeAge: "",
    declaration: false,
  });

  // Step 5 — payment
  const [payMode,    setPayMode]    = useState("Online");
  const [payType,    setPayType]    = useState("Cheque");
  const [confirmed,  setConfirmed]  = useState(false);
  // Cheque form
  const [chequeNo,       setChequeNo]       = useState("");
  const [chequeBankName, setChequeBankName] = useState("");
  const [chequeMicr,     setChequeMicr]     = useState("");
  const [chequeIfsc,     setChequeIfsc]     = useState("");
  const [chequeDate,     setChequeDate]     = useState("");
  const [chequeLocation, setChequeLocation] = useState("");
  const [chequePhoto,    setChequePhoto]    = useState(null);
  // NEFT form
  const [neftBankName,   setNeftBankName]   = useState("");
  const [neftBranch,     setNeftBranch]     = useState("");
  const [neftAccName,    setNeftAccName]    = useState("");
  const [neftAccNo,      setNeftAccNo]      = useState("");
  const [neftIfsc,       setNeftIfsc]       = useState("");
  const [neftTxnNo,      setNeftTxnNo]      = useState("");
  const [neftDate,       setNeftDate]       = useState("");
  const [neftPhoto,      setNeftPhoto]      = useState(null);

  // Step 2 — nominees & terms (moved up from Proposal step)
  const [nominees, setNominees] = useState([{ id: 1, name: '', relation: '', age: '', share: '100' }]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const nomineesTotal = nominees.reduce((s, n) => s + (Number(n.share) || 0), 0);

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
    const family = selectedMember?.familyMembers ?? [];
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
    const family  = selectedMember?.familyMembers ?? [];
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
    if (step === 1) { navigate(isMember ? "/member-portal" : "/member"); return; }
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
          const saved = selectedMember?.familyMembers?.find(m => m.type === type);
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

  // Member search filter — sales operators already scoped to their assigned members
  const filteredMembers = useMemo(() => {
    const q = custSearch.trim().toLowerCase();
    if (!q) return baseMembers;
    return baseMembers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q),
    );
  }, [custSearch, baseMembers]);

  const custPg = usePagination(filteredMembers, 12);
  const handleCustSearch = (v) => { setCustSearch(v); custPg.reset(); };

  // When member is selected, pre-fill downstream state (including saved family members)
  const handleSelectMember = (c) => {
    setSelectedMember(c);
    setMembers([
      { type: "Self", name: c.name, dob: c.dob, gender: c.gender },
    ]);
    setProposal((p) => ({
      ...p,
      memberName: c.name,
      mobile: c.mobile,
      email: c.email,
      address: c.address,
    }));
  };

  const addMember = (type) => {
    const slot = FAMILY_SLOTS.find((s) => s.type === type);
    const saved = selectedMember?.familyMembers?.find((m) => m.type === type);
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
      const saved = selectedMember?.familyMembers?.find(m => m.type === type);
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
      member:    selectedMember?.name,
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
              {isMember ? "Compare plans and buy a policy for yourself" : "Select a member, compare plans and issue a policy"}
            </div>
          </div>
        </div>
        {step > 0 && step < STEPS.length - 1 && (
          <button className="btn btn-ghost" onClick={back}>
            ← Back
          </button>
        )}
      </div>

      {/* ── Persistent member strip (steps 1–6) ─────────────────────── */}
      {selectedMember && step > 0 && step < STEPS.length - 1 && (
        <MemberStrip
          member={selectedMember}
          onChangeMember={() => setStep(0)}
          canChange={false}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 0 — Select Member
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
                placeholder={isSalesAgent ? "Search your assigned members…" : "Search by name, mobile or email…"}
                value={custSearch}
                onChange={(e) => handleCustSearch(e.target.value)}
                autoFocus
              />
            </div>
            <span style={{ fontSize: 13.5, color: "var(--text-3)", whiteSpace: "nowrap", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 12px" }}>
              {filteredMembers.length} members
            </span>
            {!isSalesAgent && (
              <button className="btn btn-secondary btn-sm" style={{ whiteSpace: "nowrap", flexShrink: 0 }} onClick={() => navigate("/member/create")}>
                <MemberIcon size={14} /> + Add New
              </button>
            )}
          </div>

          {/* Member grid */}
          {filteredMembers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "56px 0", color: "var(--text-3)" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>No members found</div>
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
                const isSelected = selectedMember?.id === c.id;
                const isRejected = c.kyc === "Rejected";
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectMember(c)}
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
                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 500 }}>KYC:</span>
                          <StatusBadge status={c.kyc} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "var(--text-2)", whiteSpace: "nowrap" }}>📱 {c.mobile}</span>
                          <span style={{ fontSize: 13, color: "var(--text-3)" }}>·</span>
                          <span style={{ fontSize: 13, color: "var(--blue)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>✉ {c.email}</span>
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
            marginTop: 16, padding: "12px 24px",
            background: "#fff",
            border: "1px solid #dee1e5",
            borderRadius: 6, transition: "all .2s",
            boxShadow: "0 1px 4.5px rgba(193,197,212,.27)",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
          }}>
            <button disabled={!selectedMember} onClick={next} style={{
              minWidth: 260, height: 40, border: "none", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: selectedMember ? "pointer" : "not-allowed",
              fontFamily: "inherit", fontWeight: 600, fontSize: 16, letterSpacing: "-.16px",
              padding: "10px 18px 10px 24px",
              background: selectedMember ? "linear-gradient(180deg,#1565d8 0%,#104ea6 100%)" : "#e5e7eb",
              color: selectedMember ? "#fff" : "#9ca3af",
            }}>
              Continue with {selectedMember ? selectedMember.name : "selected member"}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2 — Members & Premium
      ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(180deg,#1565d8,#104ea6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Member Info &amp; Premium</div>
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
              {cart.map((p, idx) => {
                const sel       = psel(p.id);
                const chartRows = PREMIUM_CHART[p.id] ?? [];
                const uniqueSIs = [...new Set(chartRows.map(r => r.sumInsured))];
                const hasAB     = chartRows.some(r => r.ageBandId != null);
                const rowBands  = hasAB
                  ? [...new Set(chartRows.filter(r => r.sumInsured === Number(sel.sumInsured)).map(r => String(r.ageBandId)))]
                  : [];
                const activeRow   = matchRow(p.id, sel.sumInsured, sel.ageBandId);
                const covOpts     = coverageOpts(activeRow);
                const neededTypes = COV_MEMBERS[sel.coverage] ?? [];
                const hasMissingMembers = neededTypes.some(t => {
                  if (t === "Self") return false;
                  const m = members.find(x => x.type === t);
                  return !m?.name || !m?.dob;
                });
                const providerColor = TYPE_COLORS[p.policyType] ?? '#33b5e5';
                const isAccordion = cart.length > 1;
                const isOpen = !isAccordion || expandedProductId === p.id || (expandedProductId === null && p.id === cart[0]?.id);

                return (
                  <div key={p.id} style={{
                    borderTop: "1px solid #dee1e5", borderRight: "1px solid #dee1e5", borderBottom: "1px solid #dee1e5",
                    borderLeft: `4px solid ${providerColor}`,
                    borderRadius: 6, overflow: "hidden", background: "#fff",
                    boxShadow: isOpen ? "0 4px 14px rgba(36,48,74,.10)" : "0 1px 4.5px rgba(193,197,212,.27)",
                  }}>
                    {/* Product header — Figma product-card style */}
                    <div
                      onClick={() => isAccordion && setExpandedProductId(id => id === p.id ? null : p.id)}
                      style={{ background: isOpen ? `${providerColor}0d` : "#f5f7f9", padding: 16, cursor: isAccordion ? "pointer" : "default" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isAccordion && (
                          <span style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                            background: providerColor, color: "#fff", fontSize: 11, fontWeight: 700,
                          }}>{idx + 1}</span>
                        )}
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: providerColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.provider}</span>
                        <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8", flexShrink: 0 }}>{p.code}</span>
                        {isAccordion && (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }}>
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: "#24304a", letterSpacing: "-.18px", marginTop: 8 }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 24, marginTop: 12, paddingBottom: 4 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 4 }}>Sum Insured</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#24304a" }}>
                            {sel.sumInsured ? `₹${Number(sel.sumInsured).toLocaleString("en-IN")}` : uniqueSIs.length > 0 ? `${fmtSI(Math.min(...uniqueSIs))} – ${fmtSI(Math.max(...uniqueSIs))}` : "—"}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 4 }}>Premium</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#24304a" }}>
                            {sel.premium != null ? <>₹{sel.premium.toLocaleString("en-IN")} <span style={{ fontSize: 12, fontWeight: 400, color: "#6d747a" }}>/yr</span></> : "—"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                    <div style={{ padding: 16, borderTop: "1px solid #dee1e5", display: "flex", flexDirection: "column", gap: 20 }}>

                      {/* 1. Coverage */}
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#24304a", marginBottom: 14 }}>1. Coverage</div>

                        {chartRows.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 8 }}>Sum Insured</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {uniqueSIs.map(si => {
                                const active = String(si) === String(sel.sumInsured);
                                return (
                                  <button key={si} type="button"
                                    onClick={() => {
                                      const bands = hasAB ? [...new Set(chartRows.filter(r => r.sumInsured === si).map(r => String(r.ageBandId)))] : [];
                                      const band  = bands[0] ?? '';
                                      const row   = matchRow(p.id, String(si), band);
                                      const cov   = row?.selfOnly != null ? 'selfOnly' : '';
                                      setPsel(p.id, { sumInsured: String(si), ageBandId: band, coverage: cov, premium: row?.[cov] ?? null });
                                      if (cov) ensureMembersFor(cov);
                                    }}
                                    style={{
                                      padding: "7px 16px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                                      border: "1.5px solid #1565d8",
                                      background: active ? "#1565d8" : "#fff",
                                      color: active ? "#fff" : "#1565d8",
                                      cursor: "pointer", fontFamily: "inherit", transition: "all .12s",
                                    }}
                                  >
                                    ₹{si.toLocaleString("en-IN")}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {hasAB && rowBands.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 8 }}>Age Band</div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {rowBands.map(b => {
                                const active = b === sel.ageBandId;
                                return (
                                  <button key={b} type="button"
                                    onClick={() => {
                                      const row = matchRow(p.id, sel.sumInsured, b);
                                      const cov = sel.coverage && row?.[sel.coverage] != null ? sel.coverage : (row?.selfOnly != null ? 'selfOnly' : '');
                                      setPsel(p.id, { ageBandId: b, coverage: cov, premium: row?.[cov] ?? null });
                                      if (cov) ensureMembersFor(cov);
                                    }}
                                    style={{
                                      padding: "7px 16px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                                      border: "1.5px solid #1565d8",
                                      background: active ? "#1565d8" : "#fff",
                                      color: active ? "#fff" : "#1565d8",
                                      cursor: "pointer", fontFamily: "inherit", transition: "all .12s",
                                    }}
                                  >
                                    Band {b}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {covOpts.length > 0 && (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 8 }}>Coverage Type</div>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              {covOpts.map(opt => {
                                const active = sel.coverage === opt.key;
                                return (
                                  <button key={opt.key} type="button"
                                    onClick={() => { setPsel(p.id, { coverage: opt.key, premium: opt.value }); ensureMembersFor(opt.key); }}
                                    style={{
                                      minWidth: 130, padding: "12px 16px", borderRadius: 8, textAlign: "left",
                                      border: `1.5px solid ${active ? "#1565d8" : "#dee1e5"}`,
                                      background: "#fff", cursor: "pointer", fontFamily: "inherit",
                                      transition: "all .12s",
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                      <span style={{ fontSize: 13, fontWeight: 500, color: "#24304a" }}>{opt.label}</span>
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1565d8" }}>₹{opt.value.toLocaleString("en-IN")}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. Covered Family Members — driven by coverage selection */}
                      {neededTypes.length > 0 && (
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#24304a", marginBottom: 14 }}>2. Covered Family Members</div>
                          <div style={{ border: "1px solid #dee1e5", borderRadius: 8, overflow: "hidden" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 150px 130px", gap: 12, padding: "10px 14px", background: "#f5f7f9", borderBottom: "1px solid #dee1e5" }}>
                              {["Member", "Full Name", "Date of Birth", "Gender"].map(h => (
                                <div key={h} style={{ fontSize: 11.5, fontWeight: 600, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".5px" }}>{h}</div>
                              ))}
                            </div>
                            {neededTypes.map((type, i) => {
                              const m           = members.find(x => x.type === type);
                              const isSelf      = type === "Self";
                              const slot        = FAMILY_SLOTS.find(s => s.type === type);
                              const missingName = !isSelf && !m?.name;
                              const missingDob  = !isSelf && !m?.dob;
                              return (
                                <div key={type} style={{
                                  display: "grid",
                                  gridTemplateColumns: "160px 1fr 150px 130px",
                                  gap: 12, alignItems: "center",
                                  padding: "10px 14px", background: "#fff",
                                  borderBottom: i < neededTypes.length - 1 ? "1px solid #dee1e5" : "none",
                                }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 16 }}>{slot?.icon}</span>
                                    <div>
                                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#24304a", lineHeight: 1.2 }}>{isSelf ? "Primary Family Member" : slot?.label}</div>
                                    </div>
                                  </div>
                                  <input
                                    className="field-input"
                                    placeholder={missingName ? "Enter full name" : "Full name"}
                                    value={m?.name ?? ""}
                                    onChange={e => updateMember(type, "name", e.target.value)}
                                    disabled={isSelf}
                                    style={{ fontSize: 13.5, padding: "6px 9px", width: "100%", borderColor: missingName ? "#f59e0b" : undefined }}
                                  />
                                  <input
                                    type="date"
                                    className="field-input"
                                    value={m?.dob ?? ""}
                                    onChange={e => updateMember(type, "dob", e.target.value)}
                                    disabled={isSelf}
                                    style={{ fontSize: 13.5, padding: "6px 9px", width: "100%", borderColor: missingDob ? "#f59e0b" : undefined }}
                                  />
                                  {isSelf ? (
                                    <input className="field-input" value={m?.gender ?? ""} disabled
                                      style={{ fontSize: 13.5, padding: "6px 9px", width: "100%", background: "#f3f4f6", color: "var(--text-2)" }} />
                                  ) : (
                                    <select className="field-select" value={m?.gender ?? ""}
                                      onChange={e => updateMember(type, "gender", e.target.value)}
                                      style={{ fontSize: 13.5, padding: "6px 9px", width: "100%" }}>
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
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: "#92400e", fontWeight: 500, background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 6, padding: "6px 10px" }}>
                              ⚠ Please fill in the highlighted member details before continuing
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. Nominees */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#24304a" }}>3. Nominees</span>
                            <span style={{ fontSize: 13, color: "var(--text-3)", marginLeft: 8 }}>Total share must equal 100%</span>
                          </div>
                          {nominees.length < 4 && (
                            <button type="button" className="btn btn-secondary btn-sm" onClick={addNominee}>
                              + Add Nominee
                            </button>
                          )}
                        </div>

                        {/* Column headers */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 80px 90px 36px", gap: 8, marginBottom: 6, padding: "0 2px" }}>
                          {["Nominee Name", "Relationship", "Age", "Share %", ""].map(h => (
                            <div key={h} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".4px" }}>{h}</div>
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
                                    fontSize: 13.5, padding: "6px 9px", width: "100%",
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
                                style={{ fontSize: 13.5, padding: "6px 9px" }}>
                                <option value="">Relation</option>
                                {["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"].map(r => (
                                  <option key={r}>{r}</option>
                                ))}
                              </select>
                              <div style={{ position: "relative" }}>
                                <input type="number" className="field-input" placeholder="Age" value={n.age} min="1" max="100"
                                  onChange={e => updateNominee(n.id, "age", e.target.value)}
                                  style={{
                                    fontSize: 13.5, padding: "6px 9px", width: "100%",
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
                                  style={{ fontSize: 13.5, padding: "6px 28px 6px 9px" }} />
                                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "var(--text-3)", pointerEvents: "none" }}>%</span>
                              </div>
                              <button type="button" onClick={() => removeNominee(n.id)} disabled={nominees.length === 1}
                                style={{ width: 32, height: 32, borderRadius: 6, border: "1.5px solid var(--border)", background: nominees.length === 1 ? "var(--surface-2)" : "#fff0f0", color: nominees.length === 1 ? "var(--text-3)" : "var(--red)", cursor: nominees.length === 1 ? "not-allowed" : "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", transition: "all .12s" }}>
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Share % footer */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 10 }}>
                          <div style={{ fontSize: 13, color: "var(--text-3)" }}>Note: Total share must be equal to 100%</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: nomineesTotal === 100 ? "var(--green)" : nomineesTotal > 100 ? "var(--red)" : "#d97706" }}>
                              Total Share: {nomineesTotal}%
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: nomineesTotal === 100 ? "var(--green)" : nomineesTotal > 100 ? "var(--red)" : "#d97706" }} />
                            </span>
                            <button type="button" className="btn btn-sm" disabled={nomineesTotal !== 100}
                              style={{
                                background: nomineesTotal === 100 ? "linear-gradient(180deg,#1565d8 0%,#104ea6 100%)" : "#e5e7eb",
                                color: nomineesTotal === 100 ? "#fff" : "#9ca3af",
                                border: "none", cursor: nomineesTotal === 100 ? "pointer" : "not-allowed",
                              }}
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. Declaration */}
          {cart.length > 0 && (
            <div className="card">
              <div className="card-header">
                <span style={{ fontWeight: 700, fontSize: 15, color: "#24304a" }}>4. Declaration</span>
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
          )}

          {/* Sticky total + continue footer */}
          {(() => {
            const hasPremium = cart.some(x => psel(x.id).premium != null);
            return (
              <div style={{
                position: "sticky", bottom: 0, zIndex: 20, marginTop: 8,
                background: hasPremium
                  ? "linear-gradient(180deg, #1565d8 0%, #104ea6 100%)"
                  : "#fff",
                border: `2px solid ${hasPremium ? "transparent" : "var(--border)"}`,
                borderRadius: 12, padding: "12px 18px",
                boxShadow: hasPremium
                  ? "0 -4px 24px rgba(21,101,216,.30)"
                  : "0 -2px 12px rgba(0,0,0,.06)",
                display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                transition: "all .2s",
              }}>
                {hasPremium ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,.94)", fontWeight: 600, marginBottom: 2, textTransform: "uppercase", letterSpacing: ".4px" }}>
                      {cart.length} product{cart.length > 1 ? "s" : ""} · Total Premium
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>
                        ₹{cart.reduce((s, x) => s + (psel(x.id).premium ?? 0), 0).toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,.94)" }}>
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
                  disabled={cart.length === 0 || nomineesTotal !== 100 || !proposal.declaration || !termsAccepted}
                  onClick={() => setStep(3)}
                  title={
                    nomineesTotal !== 100
                      ? "Nominee share must total 100% before continuing"
                      : (!proposal.declaration || !termsAccepted)
                        ? "Please accept both declarations before continuing"
                        : undefined
                  }
                  style={{
                    flexShrink: 0, minWidth: 200,
                    ...(hasPremium ? {
                      background: "#fff", color: "#1565d8", fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(0,0,0,.12)",
                    } : {}),
                  }}
                >
                  Review and make payment
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
          {selectedMember && <KYCWarning kyc={selectedMember.kyc} />}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, background: "linear-gradient(180deg,#1565d8,#104ea6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Select Products</div>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
              {availableProducts.map(p => {
                const inCart      = !!cart.find(x => x.id === p.id);
                const chartRows   = PREMIUM_CHART[p.id] ?? [];
                const uniqueSIs   = [...new Set(chartRows.map(r => r.sumInsured))];
                const firstRow    = chartRows[0];
                const allPremiums = chartRows.flatMap(r => [r.selfOnly, r.selfSpouse, r.selfSpouse2Children].filter(Boolean));
                const minPremium  = allPremiums.length > 0 ? Math.min(...allPremiums) : null;
                const covKeys     = ['selfOnly','selfSpouse','selfSpouse2Children'].filter(k => firstRow?.[k] != null);
                const providerColor = TYPE_COLORS[p.policyType] ?? '#33b5e5';
                return (
                  <div key={p.id}
                    onClick={() => toggleCart(p)}
                    style={{
                      borderRadius: 6, overflow: "hidden", background: "#fff",
                      border: `${inCart ? "2px" : "1px"} solid ${inCart ? "#1565d8" : "#dee1e5"}`,
                      boxShadow: inCart ? "0 1px 11px rgba(63,151,233,.26)" : "0 1px 4.5px rgba(193,197,212,.27)",
                      transition: "all .15s", cursor: "pointer",
                      display: "flex", flexDirection: "column",
                    }}
                  >
                    {/* Header strip */}
                    <div style={{ background: "#f5f7f9", padding: "16px 16px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: providerColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.provider}</span>
                        <div
                          onClick={e => { e.stopPropagation(); toggleCart(p); }}
                          style={{
                            width: 24, height: 24, borderRadius: 6, flexShrink: 0, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: inCart ? "#1565d8" : "#fff",
                            border: `1.5px solid ${inCart ? "#1565d8" : "#9ca3af"}`,
                          }}
                        >
                          {inCart && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6, paddingBottom: 12 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6d747a" }}>{p.policyType}</span>
                        <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8" }}>· {p.code}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

                      {/* Product name */}
                      <div style={{ fontWeight: 600, fontSize: 18, color: "#24304a", letterSpacing: "-.18px" }}>{p.name}</div>

                      {/* Metrics */}
                      <div style={{ display: "flex", gap: 24 }}>
                        {uniqueSIs.length > 0 && (
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00c851" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              <span style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px" }}>Sum Insured</span>
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: "#24304a", letterSpacing: "-.18px" }}>
                              {fmtSI(Math.min(...uniqueSIs))}{uniqueSIs.length > 1 && ` – ${fmtSI(Math.max(...uniqueSIs))}`}
                            </div>
                          </div>
                        )}
                        {minPremium && (
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6d747a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1 .9-1.5 2-1.5s2.5.5 2.5 1.7c0 1.9-4.5 1.2-4.5 3.4 0 1.2 1.4 1.9 2.5 1.9s2-.6 2-1.6" /></svg>
                              <span style={{ fontSize: 12, fontWeight: 500, color: "#6d747a", textTransform: "uppercase", letterSpacing: ".6px" }}>Premium starts</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 18, fontWeight: 600, color: "#24304a", letterSpacing: "-.18px" }}>₹ {minPremium.toLocaleString("en-IN")}</span>
                              <span style={{ fontSize: 14, color: "#6d747a" }}>/yr</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Coverage chips */}
                      {covKeys.length > 0 && (
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {covKeys.includes('selfOnly')            && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self</span>}
                          {covKeys.includes('selfSpouse')          && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Self + Spouse</span>}
                          {covKeys.includes('selfSpouse2Children') && <span style={{ fontSize: 13, fontWeight: 500, background: "#fff", border: "1px solid #dee1e5", borderRadius: 20, padding: "3px 10px", color: "#6d747a" }}>Family</span>}
                        </div>
                      )}

                      {/* Footer */}
                      <div
                        style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, paddingTop: 4, marginTop: "auto" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          style={{ fontSize: 15, fontWeight: 600, border: "none", color: "#3b5bfd", background: "transparent", padding: 0, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}
                          onClick={e => { e.stopPropagation(); setViewingProduct(p); }}
                        >
                          View Info
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b5bfd" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky footer */}
          <div style={{
            position: "sticky", bottom: 0, zIndex: 20, marginTop: 20,
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            gap: 24, padding: "12px 24px",
            background: "#fff",
            border: "1px solid #dee1e5",
            borderRadius: 6, transition: "all .2s",
            boxShadow: "0 1px 4.5px rgba(193,197,212,.27)",
          }}>
            <div style={{ fontSize: 14, color: "#6d747a", fontWeight: 400 }}>
              {cart.length === 0
                ? "Select at least one product to continue"
                : <><strong style={{ color: "#24304a", fontWeight: 700 }}>{cart.length} product{cart.length > 1 ? "s" : ""}</strong> selected — choose premium details on next screen</>
              }
            </div>
            <button disabled={cart.length === 0} onClick={next} style={{
              flexShrink: 0, minWidth: 140, height: 40, border: "none", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              cursor: cart.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit", fontWeight: 600, fontSize: 16, letterSpacing: "-.16px",
              padding: "10px 18px 10px 24px",
              background: cart.length === 0 ? "#e5e7eb" : "linear-gradient(180deg,#1565d8 0%,#104ea6 100%)",
              color: cart.length === 0 ? "#9ca3af" : "#fff",
            }}>
              Continue
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Product Brochure Modal ───────────────────────────────────────── */}
      {viewingProduct && (() => {
        const p         = viewingProduct;
        const details   = PRODUCT_DETAILS[p.id];
        const chartRows = PREMIUM_CHART[p.id] ?? [];
        const inCart    = !!cart.find(x => x.id === p.id);
        const providerColor = TYPE_COLORS[p.policyType] ?? '#33b5e5';

        const sectionHead = (text) => (
          <div style={{ fontSize: 13, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: ".6px", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
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
              {/* ── Header strip ── */}
              <div style={{ background: "#f5f7f9", padding: "16px 16px 0", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: providerColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.provider}
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewingProduct(null)}
                    style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #cbd5e1", background: "#fff", cursor: "pointer", color: "#6d747a", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  >×</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 6, paddingBottom: 12 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#6d747a" }}>{p.policyType}</span>
                  <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#94a3b8" }}>· {p.code}</span>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Product name */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: 18, color: "#24304a", letterSpacing: "-.18px" }}>{p.name}</div>
                  {details?.tagline && (
                    <div style={{ fontSize: 13, fontStyle: "italic", color: "var(--text-2)", marginTop: 4, lineHeight: 1.5 }}>"{details.tagline}"</div>
                  )}
                </div>

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
                <div style={{ display: "flex", gap: 18, borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
                  <a href="#about-plan" style={{ fontSize: 13, fontWeight: 600, color: "#3b5bfd", textDecoration: "none" }}>About This Plan</a>
                  <a href="#whats-covered" style={{ fontSize: 13, fontWeight: 600, color: "#3b5bfd", textDecoration: "none" }}>What's Covered</a>
                  <a href="#premium-chart" style={{ fontSize: 13, fontWeight: 600, color: "#3b5bfd", textDecoration: "none" }}>Premium Chart</a>
                </div>

                {details ? (<>

                  {/* About */}
                  <div id="about-plan">
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
                  <div id="whats-covered" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {details.covered?.length > 0 && (
                      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>✅ What's Covered</div>
                        {details.covered.map((c, i) => (
                          <div key={i} style={{ fontSize: 13.5, color: "#166534", lineHeight: 1.6, paddingLeft: 8, borderLeft: "2px solid #86efac", marginBottom: 4 }}>{c}</div>
                        ))}
                      </div>
                    )}
                    {details.notCovered?.length > 0 && (
                      <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 8 }}>⚠ Not Covered</div>
                        {details.notCovered.map((c, i) => (
                          <div key={i} style={{ fontSize: 13.5, color: "#9a3412", lineHeight: 1.6, paddingLeft: 8, borderLeft: "2px solid #fdba74", marginBottom: 4 }}>{c}</div>
                        ))}
                      </div>
                    )}
                  </div>

                </>) : (
                  /* Fallback: basic info grid for products without PRODUCT_DETAILS */
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[["Code", p.code], ["Policy Type", p.policyType], ["Provider", p.provider], ["Status", "Active"]].map(([k, v]) => (
                      <div key={k} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 13, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", marginBottom: 3 }}>{k}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", fontFamily: k === "Code" ? "monospace" : "inherit" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Premium chart */}
                {chartRows.length > 0 && (
                  <div id="premium-chart">
                    {sectionHead("Premium Chart (Annual, incl. GST)")}
                    <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
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
                  <div style={{ background: "#fffbeb", border: "1px solid #f59e0b", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "#78350f", lineHeight: 1.7 }}>
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
          STEP 3 — Payment
      ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && cart.length > 0 && (
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
                <div style={{ fontSize: 13.5, color: '#78350f', marginTop: 2 }}>
                  Proposal <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{resumePolicy.proposalId}</span>
                  {' · '}{resumePolicy.memberName}{' · '}₹{resumePolicy.premium.toLocaleString()}
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
                          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{p.provider} · <span style={{ fontFamily: "monospace" }}>{p.code}</span></div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", flexShrink: 0 }}>
                        {p.premium != null ? `₹${p.premium.toLocaleString("en-IN")}` : "—"}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                      {p.sumInsured && (
                        <span style={{ fontSize: 13, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          SI: ₹{Number(p.sumInsured).toLocaleString("en-IN")}
                        </span>
                      )}
                      {p.coverage && (
                        <span style={{ fontSize: 13, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          {COV_LABEL[p.coverage] ?? p.coverage}
                        </span>
                      )}
                      {p.ageBandId && (
                        <span style={{ fontSize: 13, background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 5, padding: "2px 7px", color: "#374151", fontWeight: 500 }}>
                          Band {p.ageBandId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Insured Family Members */}
              {members.length > 0 && (
                <div style={{ margin: "4px 0 2px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "7px 12px", marginBottom: 6,
                    background: "var(--surface-2)", borderRadius: 8,
                    border: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: 13 }}>👥</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".6px" }}>
                      Insured Family Members
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "var(--brand-light)", borderRadius: 10, padding: "1px 8px" }}>
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
                          fontSize: 13, fontWeight: 800,
                        }}>
                          {(m.name || m.type).charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {m.name || <span style={{ color: "var(--text-3)", fontStyle: "italic", fontWeight: 400 }}>Name not entered</span>}
                          </div>
                          {m.dob && (
                            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 1 }}>DOB: {m.dob}</div>
                          )}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                            {m.type}
                          </div>
                          {m.gender && (
                            <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 1 }}>{m.gender}</div>
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
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--brand)", textTransform: "uppercase", letterSpacing: ".6px" }}>
                      Nominees
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: "var(--brand)", background: "var(--brand-light)", borderRadius: 10, padding: "1px 8px" }}>
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
                          fontSize: 13, fontWeight: 800,
                        }}>
                          {n.name ? n.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {n.name || <span style={{ color: "var(--text-3)", fontStyle: "italic", fontWeight: 400 }}>Name not entered</span>}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 1 }}>
                            {[n.relation, n.age ? `${n.age} yrs` : null].filter(Boolean).join(" · ") || "—"}
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{n.share || "0"}%</div>
                          <div style={{ fontSize: 13, color: "var(--text-3)" }}>share</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary rows */}
              {[
                ["Insurance Type", insuranceType],
                ["Organisation",   ORGANISATIONS.find(o => o.id === selectedMember?.organisationId)?.name ?? "—"],
                ["Association",    ASSOCIATIONS.find(a => a.id === selectedMember?.associationId)?.name ?? "—"],
                ["Policy Period",  "1 Year"],
                ["Plans",          `${cart.length} plan${cart.length > 1 ? "s" : ""}`],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", gap: 12,
                  padding: "7px 0", borderBottom: "1px solid var(--border)", fontSize: 13,
                }}>
                  <span style={{ color: "var(--text-2)", flexShrink: 0 }}>{k}</span>
                  <span
                    title={v}
                    style={{
                      fontWeight: 500, textAlign: "right", maxWidth: "60%",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}

              {/* Premium breakdown */}
              {cart.length > 1 && cart.map(p => (
                <div key={p.id} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "5px 0", fontSize: 13.5, color: "var(--text-2)",
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
              <span className="card-title">Payment</span>
            </div>
            <div className="card-body">
              {/* Payment Mode dropdown */}
              <div style={{ marginBottom: 20, maxWidth: 260 }}>
                <label style={PAY_LABEL}>Payment Mode</label>
                <select
                  className="field-select"
                  style={{ marginTop: 4 }}
                  value={payMode}
                  onChange={e => { setPayMode(e.target.value); setConfirmed(false); }}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              {/* ── ONLINE ── */}
              {payMode === "Online" && (
                <div style={{
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: "var(--r-md)", padding: "20px 22px",
                }}>
                  <div style={{ fontSize: 13.5, color: "var(--text-2)", marginBottom: 16, lineHeight: 1.6 }}>
                    Your payment will be processed securely online. Please confirm that all the policy details
                    shown above are correct before proceeding.
                  </div>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={e => setConfirmed(e.target.checked)}
                      style={{ marginTop: 2, accentColor: "var(--brand)", width: 16, height: 16 }}
                    />
                    <span style={{ fontSize: 13.5, color: "var(--text)" }}>
                      Check the box to confirm the displayed information.
                    </span>
                  </label>
                </div>
              )}

              {/* ── OFFLINE ── */}
              {payMode === "Offline" && (() => {
                const totalPremium = cart.reduce((s, x) => s + (x.premium ?? 0), 0);
                const memberAssoc = ASSOCIATIONS.find(a => a.id === selectedMember?.associationId);

                return (
                  <div>
                    {/* Cheque / NEFT tab bar */}
                    <div style={{
                      display: "flex", gap: 0, marginBottom: 20,
                      border: "1px solid var(--border)", borderRadius: "var(--r-md)",
                      overflow: "hidden", width: "fit-content",
                    }}>
                      {["Cheque", "NEFT"].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setPayType(t); setConfirmed(false); }}
                          style={{
                            padding: "9px 32px", border: "none", cursor: "pointer",
                            fontFamily: "inherit", fontSize: 13.5, fontWeight: 600,
                            background: payType === t
                              ? "linear-gradient(135deg, var(--brand) 0%, #a855f7 100%)"
                              : "var(--surface-2)",
                            color: payType === t ? "#fff" : "var(--text-2)",
                            transition: "all .15s",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* ── CHEQUE FORM ── */}
                    {payType === "Cheque" && (
                      <div>
                        <div className="form-grid-3">
                          <Field label="Cheque Number" required>
                            <Input placeholder="e.g. 001234" value={chequeNo} onChange={e => setChequeNo(e.target.value)} />
                          </Field>
                          <Field label="Amount">
                            <Input value={`₹${totalPremium.toLocaleString("en-IN")}`} readOnly style={{ background: "var(--surface-2)", color: "var(--text-2)" }} />
                          </Field>
                          <Field label="Bank Name (on cheque)" required>
                            <Input placeholder="e.g. State Bank of India" value={chequeBankName} onChange={e => setChequeBankName(e.target.value)} />
                          </Field>
                          <Field label="MICR Code">
                            <Input placeholder="9-digit MICR" maxLength={9} value={chequeMicr} onChange={e => setChequeMicr(e.target.value)} />
                          </Field>
                          <Field label="IFSC Code" required>
                            <Input placeholder="e.g. SBIN0001234" value={chequeIfsc} onChange={e => setChequeIfsc(e.target.value)} />
                          </Field>
                          <Field label="Date" required>
                            <Input type="date" value={chequeDate} onChange={e => setChequeDate(e.target.value)} />
                          </Field>
                          <Field label="Association Name">
                            <Input value={memberAssoc?.name ?? "—"} readOnly style={{ background: "var(--surface-2)", color: "var(--text-2)" }} />
                          </Field>
                          <Field label="Association Code">
                            <Input value={memberAssoc?.associationCode ?? "—"} readOnly style={{ background: "var(--surface-2)", color: "var(--text-2)" }} />
                          </Field>
                        </div>
                        <div style={{ marginTop: 4, marginBottom: 16 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>In Favour Of</div>
                          <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--text)" }}>KMD Insurance Brokers Pvt. Ltd.</div>
                        </div>
                        <div className="form-grid-3">
                          <Field label="Cheque Deposit Location">
                            <Input placeholder="Branch / location" value={chequeLocation} onChange={e => setChequeLocation(e.target.value)} />
                          </Field>
                          <Field label="Cheque Photo">
                            <input
                              type="file" accept="image/*"
                              onChange={e => setChequePhoto(e.target.files[0])}
                              style={{ fontSize: 13, color: "var(--text-2)", paddingTop: 6 }}
                            />
                            {chequePhoto && <div style={{ fontSize: 13, color: "var(--success)", marginTop: 4 }}>✓ {chequePhoto.name}</div>}
                          </Field>
                        </div>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 8 }}>
                          <input
                            type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                            style={{ marginTop: 2, accentColor: "var(--brand)", width: 16, height: 16 }}
                          />
                          <span style={{ fontSize: 13.5, color: "var(--text)" }}>
                            Check the box to confirm the displayed information.
                          </span>
                        </label>
                      </div>
                    )}

                    {/* ── NEFT FORM ── */}
                    {payType === "NEFT" && (
                      <div>
                        {/* Bank info card */}
                        <div style={{
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          borderRadius: "var(--r-md)", padding: "16px 20px", marginBottom: 20,
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px",
                        }}>
                          {[
                            ["Bank Name",       "Kotak Mahindra Bank"],
                            ["Branch Name",     "Fort Mumbai"],
                            ["Account Number",  "6849894510"],
                            ["IFSC Code",       "KKBK0000957"],
                          ].map(([k, v]) => (
                            <div key={k}>
                              <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 2 }}>{k}</div>
                              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="form-grid-3">
                          <Field label="Bank Name" required>
                            <Input placeholder="Your bank name" value={neftBankName} onChange={e => setNeftBankName(e.target.value)} />
                          </Field>
                          <Field label="Branch Name" required>
                            <Input placeholder="Branch" value={neftBranch} onChange={e => setNeftBranch(e.target.value)} />
                          </Field>
                          <Field label="Account Name" required>
                            <Input placeholder="Account holder name" value={neftAccName} onChange={e => setNeftAccName(e.target.value)} />
                          </Field>
                          <Field label="Account Number" required>
                            <Input placeholder="Account number" value={neftAccNo} onChange={e => setNeftAccNo(e.target.value)} />
                          </Field>
                          <Field label="IFSC Code" required>
                            <Input placeholder="e.g. KKBK0000957" value={neftIfsc} onChange={e => setNeftIfsc(e.target.value)} />
                          </Field>
                          <Field label="Transaction Number" required>
                            <Input placeholder="UTR / Txn reference" value={neftTxnNo} onChange={e => setNeftTxnNo(e.target.value)} />
                          </Field>
                          <Field label="Date" required>
                            <Input type="date" value={neftDate} onChange={e => setNeftDate(e.target.value)} />
                          </Field>
                          <Field label="Amount">
                            <Input value={`₹${totalPremium.toLocaleString("en-IN")}`} readOnly style={{ background: "var(--surface-2)", color: "var(--text-2)" }} />
                          </Field>
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <Field label="Payment Photo">
                            <input
                              type="file" accept="image/*"
                              onChange={e => setNeftPhoto(e.target.files[0])}
                              style={{ fontSize: 13, color: "var(--text-2)", paddingTop: 6 }}
                            />
                            {neftPhoto && <div style={{ fontSize: 13, color: "var(--success)", marginTop: 4 }}>✓ {neftPhoto.name}</div>}
                          </Field>
                        </div>
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 16 }}>
                          <input
                            type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                            style={{ marginTop: 2, accentColor: "var(--brand)", width: 16, height: 16 }}
                          />
                          <span style={{ fontSize: 13.5, color: "var(--text)" }}>
                            Check the box to confirm the displayed information.
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="actions-row" style={{ marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={back}>
                  ← Back To Edit
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitPayment}
                  disabled={!confirmed}
                  style={{ minWidth: 200, opacity: confirmed ? 1 : 0.5, cursor: confirmed ? "pointer" : "not-allowed" }}
                >
                  <PaymentIcon size={16} /> Submit
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 5 — Payment Received
      ══════════════════════════════════════════════════════════════════ */}
      {step === 4 && policyResults.length > 0 && (
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", padding: "52px 32px 44px" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
              <div style={{ fontWeight: 800, fontSize: 22, background: "linear-gradient(180deg,#1565d8,#104ea6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 10 }}>
                Payment Received Successfully
              </div>
              <div style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.7, marginBottom: 32 }}>
                Payment for <strong style={{ color: "var(--text)" }}>{policyResults[0].member}</strong> has been confirmed.
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

