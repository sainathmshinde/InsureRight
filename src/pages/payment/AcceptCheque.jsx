import { useState } from "react";
import { PageHeader, Button } from "../../components/UI";
import Pagination from "../../components/Pagination";
import usePagination from "../../components/usePagination";
import { ChequeIcon, UploadIcon, SearchIcon } from "../../icons";
import { PAYMENT_STATUS_SHORT_LABEL } from "../../constants/paymentStatus";

const CAMPAIGNS = [
  { id: 1, name: "Campaign 1" },
  { id: 5, name: "Campaign OPD and DIGIT PAYMENT PROTECTION" },
  { id: 6, name: "BPP Campaign" },
  { id: 7, name: "Test Campaign" },
  { id: 8, name: "SBI_STP_Campaign" },
  { id: 11, name: "BPP Campaign_2026-2027" },
  { id: 12, name: "Standalone campaign" },
];

const MOCK_CHEQUES = [
  {
    id: "CHQ-2026-001", proposalId: "PRO-2025-1001",
    memberName: "Aarav Sharma",
    mobileNo: "9876543210",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "HDFC Bank",
    branch: "Andheri Branch",
    chequeNo: "004521",
    chequeDate: "2026-04-10",
    amount: 18500,
    initiatedDate: "2026-04-12",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Aarav Sharma&bank=HDFC Bank&account=1234567890123&ifsc=HDFC0001234",
  },
  {
    id: "CHQ-2026-002", proposalId: "PRO-2025-1002",
    memberName: "Priya Mehta",
    mobileNo: "9823456789",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "ICICI Bank",
    branch: "Bandra Branch",
    chequeNo: "009832",
    chequeDate: "2026-04-13",
    amount: 24200,
    initiatedDate: "2026-04-14",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Priya Mehta&bank=ICICI Bank&account=9876543210456&ifsc=ICIC0005678",
  },
  {
    id: "CHQ-2026-003", proposalId: "PRO-2025-1003",
    memberName: "Rohan Verma",
    mobileNo: "9812345678",
    policyNo: null,
    product: "Bajaj Allianz Health Guard",
    bank: "SBI",
    branch: "Dadar Branch",
    chequeNo: "012203",
    chequeDate: "2026-04-14",
    amount: 12800,
    initiatedDate: "2026-04-15",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Rohan Verma&bank=SBI&account=3456789012345&ifsc=SBIN0003456",
  },
  {
    id: "CHQ-2026-004", proposalId: "PRO-2025-1004",
    memberName: "Sneha Iyer",
    mobileNo: "9801234567",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Axis Bank",
    branch: "Powai Branch",
    chequeNo: "019882",
    chequeDate: "2026-04-16",
    amount: 52000,
    initiatedDate: "2026-04-17",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Sneha Iyer&bank=Axis Bank&account=5678901234567&ifsc=UTIB0007890",
  },
  {
    id: "CHQ-2026-005", proposalId: "PRO-2025-1005",
    memberName: "Kavita Pillai",
    mobileNo: "9790123456",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "Bank of Baroda",
    branch: "Pune Branch",
    chequeNo: "023401",
    chequeDate: "2026-04-18",
    amount: 31000,
    initiatedDate: "2026-04-19",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Kavita Pillai&bank=Bank of Baroda&account=6789012345678&ifsc=BARB0PUNE01",
  },
  {
    id: "CHQ-2026-006", proposalId: "PRO-2025-1006",
    memberName: "Arjun Singh",
    mobileNo: "9712345678",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "Punjab National Bank",
    branch: "Ludhiana Branch",
    chequeNo: "031920",
    chequeDate: "2026-04-20",
    amount: 44500,
    initiatedDate: "2026-04-21",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Arjun Singh&bank=Punjab National Bank&account=7890123456789&ifsc=PUNB0123400",
  },
  {
    id: "CHQ-2026-007", proposalId: "PRO-2025-1007",
    memberName: "Meera Joshi",
    mobileNo: "9698765432",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Union Bank",
    branch: "Thane Branch",
    chequeNo: "045210",
    chequeDate: "2026-04-22",
    amount: 67000,
    initiatedDate: "2026-04-23",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Meera Joshi&bank=Union Bank&account=8901234567890&ifsc=UBIN0567890",
  },
  {
    id: "CHQ-2026-008", proposalId: "PRO-2025-1008",
    memberName: "Vikram Rao",
    mobileNo: "9687654321",
    policyNo: null,
    product: "Bajaj Allianz Comprehensive",
    bank: "Kotak Bank",
    branch: "Worli Branch",
    chequeNo: "056789",
    chequeDate: "2026-04-24",
    amount: 16750,
    initiatedDate: "2026-04-25",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Vikram Rao&bank=Kotak Bank&account=9012345678901&ifsc=KKBK0009012",
  },
  {
    id: "CHQ-2026-009", proposalId: "PRO-2025-1009",
    memberName: "Deepika Kulkarni",
    mobileNo: "9654321098",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Canara Bank",
    branch: "Vashi Branch",
    chequeNo: "067123",
    chequeDate: "2026-04-26",
    amount: 22000,
    initiatedDate: "2026-04-27",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Deepika Kulkarni&bank=Canara Bank&account=1122334455667&ifsc=CNRB0001122",
  },
  {
    id: "CHQ-2026-010", proposalId: "PRO-2025-1010",
    memberName: "Suresh Patil",
    mobileNo: "9643210987",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "Bank of India",
    branch: "Borivali Branch",
    chequeNo: "078456",
    chequeDate: "2026-04-28",
    amount: 35500,
    initiatedDate: "2026-04-29",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Suresh Patil&bank=Bank of India&account=2233445566778&ifsc=BKID0002233",
  },
  {
    id: "CHQ-2026-011", proposalId: "PRO-2025-1011",
    memberName: "Anjali Deshmukh",
    mobileNo: "9632109876",
    policyNo: null,
    product: "Bajaj Allianz Health Guard",
    bank: "Indian Bank",
    branch: "Goregaon Branch",
    chequeNo: "089012",
    chequeDate: "2026-04-30",
    amount: 19800,
    initiatedDate: "2026-05-01",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Anjali Deshmukh&bank=Indian Bank&account=3344556677889&ifsc=IDIB0003344",
  },
  {
    id: "CHQ-2026-012", proposalId: "PRO-2025-1012",
    memberName: "Rajesh Nair",
    mobileNo: "9621098765",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Federal Bank",
    branch: "Malad Branch",
    chequeNo: "090345",
    chequeDate: "2026-05-02",
    amount: 28700,
    initiatedDate: "2026-05-03",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Rajesh Nair&bank=Federal Bank&account=4455667788990&ifsc=FDRL0004455",
  },
  {
    id: "CHQ-2026-013", proposalId: "PRO-2025-1013",
    memberName: "Nandini Reddy",
    mobileNo: "9610987654",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "South Indian Bank",
    branch: "Kandivali Branch",
    chequeNo: "101678",
    chequeDate: "2026-05-04",
    amount: 41200,
    initiatedDate: "2026-05-05",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Nandini Reddy&bank=South Indian Bank&account=5566778899001&ifsc=SIBL0005566",
  },
  {
    id: "CHQ-2026-014", proposalId: "PRO-2025-1014",
    memberName: "Prakash Gupta",
    mobileNo: "9509876543",
    policyNo: null,
    product: "Bajaj Allianz Comprehensive",
    bank: "IDBI Bank",
    branch: "Churchgate Branch",
    chequeNo: "112901",
    chequeDate: "2026-05-06",
    amount: 15300,
    initiatedDate: "2026-05-07",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Prakash Gupta&bank=IDBI Bank&account=6677889900112&ifsc=IBKL0006677",
  },
  {
    id: "CHQ-2026-015", proposalId: "PRO-2025-1015",
    memberName: "Shalini Bose",
    mobileNo: "9498765432",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Yes Bank",
    branch: "Juhu Branch",
    chequeNo: "123234",
    chequeDate: "2026-05-08",
    amount: 57500,
    initiatedDate: "2026-05-09",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Shalini Bose&bank=Yes Bank&account=7788990011223&ifsc=YESB0007788",
  },
  {
    id: "CHQ-2026-016", proposalId: "PRO-2025-1016",
    memberName: "Manoj Tiwari",
    mobileNo: "9487654321",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "UCO Bank",
    branch: "Colaba Branch",
    chequeNo: "134567",
    chequeDate: "2026-05-10",
    amount: 23400,
    initiatedDate: "2026-05-11",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Manoj Tiwari&bank=UCO Bank&account=8899001122334&ifsc=UCBA0008899",
  },
  {
    id: "CHQ-2026-017", proposalId: "PRO-2025-1017",
    memberName: "Poornima Hegde",
    mobileNo: "9476543210",
    policyNo: null,
    product: "Bajaj Allianz Health Guard",
    bank: "Indian Overseas Bank",
    branch: "Santacruz Branch",
    chequeNo: "145890",
    chequeDate: "2026-05-12",
    amount: 33100,
    initiatedDate: "2026-05-13",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Poornima Hegde&bank=Indian Overseas Bank&account=9900112233445&ifsc=IOBA0009900",
  },
  {
    id: "CHQ-2026-018", proposalId: "PRO-2025-1018",
    memberName: "Aditya Bhatt",
    mobileNo: "9465432109",
    policyNo: null,
    product: "Star Comprehensive Health",
    bank: "Central Bank of India",
    branch: "Fort Branch",
    chequeNo: "156123",
    chequeDate: "2026-05-14",
    amount: 48600,
    initiatedDate: "2026-05-15",
    initiatedBy: "Ravi Kulkarni",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Aditya Bhatt&bank=Central Bank of India&account=1011121314151&ifsc=CBIN0010111",
  },
  {
    id: "CHQ-2026-019", proposalId: "PRO-2025-1019",
    memberName: "Lakshmi Menon",
    mobileNo: "9454321098",
    policyNo: null,
    product: "HDFC ERGO Optima Secure",
    bank: "Karur Vysya Bank",
    branch: "Mulund Branch",
    chequeNo: "167456",
    chequeDate: "2026-05-16",
    amount: 26900,
    initiatedDate: "2026-05-17",
    initiatedBy: "Amit Verma",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Lakshmi Menon&bank=Karur Vysya Bank&account=1213141516171&ifsc=KVBL0012131",
  },
  {
    id: "CHQ-2026-020", proposalId: "PRO-2025-1020",
    memberName: "Sameer Jain",
    mobileNo: "9443210987",
    policyNo: null,
    product: "Bajaj Allianz Comprehensive",
    bank: "Bandhan Bank",
    branch: "Vikhroli Branch",
    chequeNo: "178789",
    chequeDate: "2026-05-18",
    amount: 14200,
    initiatedDate: "2026-05-19",
    initiatedBy: "Pooja Desai",
    campaignId: 5,
    campaignName: "Campaign OPD and DIGIT PAYMENT PROTECTION",
    status: "Pending payment",
    chequePhotoUrl: "doc-viewer?type=cheque&name=Sameer Jain&bank=Bandhan Bank&account=1415161718192&ifsc=BDBL0014151",
  },
];

function fmt(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function DetailRow({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: ".4px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: "#1a1628", fontWeight: 500 }}>
        {value || "—"}
      </div>
    </div>
  );
}

function ChequePreview({ cheque }) {
  const initials = cheque.memberName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const today = new Date(cheque.chequeDate).toLocaleDateString("en-IN");

  return (
    <div style={{ width: "100%", maxWidth: 480, fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          background: "#fffef8",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
          border: "1px solid #c8c0a0",
        }}
      >
        {/* Bank header */}
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "3px solid #003580",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fff",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "#003580",
                letterSpacing: 0.5,
              }}
            >
              {cheque.bank}
            </div>
            <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>
              {cheque.branch}
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: 10, color: "#666" }}>
            <div
              style={{
                fontFamily: "Courier New",
                fontSize: 13,
                fontWeight: 700,
                color: "#333",
              }}
            >
              {cheque.chequeNo}
            </div>
            <div>Cheque No.</div>
          </div>
        </div>

        {/* Date row */}
        <div
          style={{
            padding: "6px 16px",
            display: "flex",
            justifyContent: "flex-end",
            background: "#f8f6ee",
            borderBottom: "1px solid #e0d8b8",
          }}
        >
          <div style={{ display: "flex", gap: 4, fontSize: 10 }}>
            <span style={{ color: "#555" }}>Date:</span>
            {today.split("/").map((part, i) => (
              <span
                key={i}
                style={{
                  border: "1px solid #aaa",
                  padding: "1px 6px",
                  minWidth: 22,
                  textAlign: "center",
                  fontFamily: "Courier New",
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                {part}
              </span>
            ))}
          </div>
        </div>

        {/* Cheque body */}
        <div
          style={{
            padding: "12px 16px",
            position: "relative",
            background: "#fffef8",
          }}
        >
          <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-end" }}>
            <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>Pay to :</span>
            <span
              style={{
                flex: 1,
                borderBottom: "1.5px solid #333",
                paddingBottom: 2,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {cheque.memberName}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "flex-end" }}>
              <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>
                Rupees (in words) :
              </span>
              <span
                style={{
                  flex: 1,
                  borderBottom: "1.5px solid #333",
                  paddingBottom: 2,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {fmt(cheque.amount)}
              </span>
            </div>
            <div
              style={{
                border: "2px solid #333",
                padding: "4px 10px",
                fontFamily: "Courier New",
                fontSize: 13,
                fontWeight: 900,
                minWidth: 80,
                textAlign: "center",
                background: "#fff",
              }}
            >
              {fmt(cheque.amount)}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#7a5c38",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {initials}
              </div>
              <div
                style={{
                  width: 130,
                  borderTop: "1px solid #555",
                  paddingTop: 3,
                  fontSize: 9,
                  color: "#666",
                }}
              >
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>

        {/* MICR band */}
        <div
          style={{
            background: "#f0ece0",
            borderTop: "2px dashed #c0b880",
            padding: "6px 16px",
            fontFamily: "Courier New, monospace",
            fontSize: 12,
            color: "#222",
            letterSpacing: 1,
            textAlign: "center",
          }}
        >
          &#x2446;{cheque.chequeNo}&#x2446; &nbsp;&nbsp; {cheque.bank}
        </div>
      </div>
    </div>
  );
}

function ChequeDetailModal({ cheque, onClose, onAccept, onReject }) {
  const [phase, setPhase] = useState("view");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showChequePhoto, setShowChequePhoto] = useState(false);

  const REJECT_REASONS = [
    "Cheque signature mismatch",
    "Cheque date expired",
    "Insufficient funds",
    "Account number mismatch",
    "Amount mismatch",
    "Cheque image not clear",
    "Duplicate payment",
    "Other",
  ];

  const confirmAccept = () => {
    onAccept(cheque.id);
    setPhase("received");
  };

  const confirmReject = () => {
    if (!reason) return;
    onReject(cheque.id, reason, notes);
    setPhase("rejected");
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          zIndex: 1000,
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 1001,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 24px 60px rgba(0,0,0,.22)",
          width: "92%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 26px 18px",
            borderBottom: "1.5px solid #f0edf8",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                letterSpacing: ".5px",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Cheque Payment Info
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1628" }}>
              {cheque.proposalId}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {cheque.memberName}{cheque.policyNo ? ` · ${cheque.policyNo}` : ""}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                padding: "3px 12px",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                background: "#e0f2fe",
                color: "#0369a1",
                border: "1.5px solid #7dd3fc",
              }}
            >
              {phase === "accepted"
                ? "Payment received (completed)"
                : phase === "rejected"
                  ? "Payment Failed"
                  : cheque.status}
            </span>
            <button
              onClick={onClose}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: "1.5px solid #e8e4f0",
                background: "#faf9fc",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
        </div>

        <div style={{ padding: "20px 26px" }}>
          {/* Amount banner */}
          <div
            style={{
              background: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "#7c3aed",
                  fontWeight: 600,
                  letterSpacing: ".4px",
                  textTransform: "uppercase",
                }}
              >
                Cheque Amount
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#a855f7",
                  marginTop: 2,
                }}
              >
                {fmt(cheque.amount)}
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#f5f3ff",
                color: "#7c3aed",
                border: "1.5px solid #ddd6fe",
                borderRadius: 10,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span style={{ fontSize: 16 }}>&#x1F3E6;</span> Cheque
            </div>
          </div>

          {/* Details grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px 24px",
              marginBottom: 20,
            }}
          >
            <DetailRow label="Member Name" value={cheque.memberName} />
            <DetailRow label="Mobile Number" value={cheque.mobileNo} />
            <DetailRow label="Policy Number" value={cheque.policyNo} />
            <DetailRow label="Product" value={cheque.product} />
            <DetailRow label="Campaign" value={cheque.campaignName} />
            <DetailRow label="Bank" value={cheque.bank} />
            <DetailRow label="Branch" value={cheque.branch} />
            <DetailRow label="Cheque Number" value={cheque.chequeNo} />
            <DetailRow label="Cheque Date" value={cheque.chequeDate} />
            <DetailRow label="Date Initiated" value={cheque.initiatedDate} />
            <DetailRow label="Initiated By" value={cheque.initiatedBy} />
          </div>

          {/* Cheque Photo — inline toggle */}
          <div style={{ marginBottom: 18 }}>
            <button
              type="button"
              onClick={() => setShowChequePhoto((v) => !v)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 9,
                background: showChequePhoto ? "#ede9fe" : "#f5f3ff",
                color: "#7c3aed",
                border: "1.5px solid #ddd6fe",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .13s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ede9fe";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = showChequePhoto
                  ? "#ede9fe"
                  : "#f5f3ff";
              }}
            >
              <span style={{ fontSize: 16 }}>&#x1F4F7;</span>
              {showChequePhoto ? "Hide Cheque Photo" : "View Cheque Photo"}
            </button>

            {showChequePhoto && (
              <div
                style={{
                  marginTop: 12,
                  border: "1.5px solid #e8e4f0",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#faf9fc",
                }}
              >
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #e8e4f0",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#7c3aed",
                    textTransform: "uppercase",
                    letterSpacing: ".4px",
                    background: "#f5f3ff",
                  }}
                >
                  Cheque Image &mdash; {cheque.bank} / {cheque.chequeNo}
                </div>
                <div
                  style={{
                    padding: 16,
                    display: "flex",
                    justifyContent: "center",
                    background: "#e8e8e8",
                    minHeight: 180,
                  }}
                >
                  <ChequePreview cheque={cheque} />
                </div>
              </div>
            )}
          </div>

          {/* Success states */}
          {phase === "received" && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 26 }}>&#x2705;</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#15803d",
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Cheque Received
                </div>
                <div style={{ fontSize: 13, color: "#166534" }}>
                  Cheque payment of <strong>{fmt(cheque.amount)}</strong> from{" "}
                  <strong>{cheque.memberName}</strong> (Cheque No:{" "}
                  {cheque.chequeNo}) has been verified and received. Policy{" "}
                  <strong>{cheque.policyNo}</strong> will now be activated.
                </div>
              </div>
            </div>
          )}

          {phase === "rejected" && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fca5a5",
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 26 }}>&#x274C;</span>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#dc2626",
                    fontSize: 15,
                    marginBottom: 4,
                  }}
                >
                  Cheque Rejected
                </div>
                <div style={{ fontSize: 13, color: "#7f1d1d" }}>
                  Cheque payment of <strong>{fmt(cheque.amount)}</strong> has
                  been rejected. Reason: <strong>{reason}</strong>. The member
                  will be notified to re-submit the payment.
                </div>
              </div>
            </div>
          )}

          {/* Reject form */}
          {phase === "reject-form" && (
            <div
              style={{
                background: "#fef9f0",
                border: "1.5px solid #fcd34d",
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "#92400e",
                  fontSize: 14,
                  marginBottom: 14,
                }}
              >
                Reject Cheque Payment
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Reason for Rejection *
                </label>
                <select
                  className="field-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="">Select a reason&hellip;</option>
                  {REJECT_REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#64748b",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Additional Notes (optional)
                </label>
                <textarea
                  className="field-input"
                  placeholder="Add any additional details&hellip;"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 72,
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={confirmReject}
                  disabled={!reason}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 8,
                    background: !reason ? "#e5e7eb" : "#dc2626",
                    color: !reason ? "#9ca3af" : "#fff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: 13.5,
                    cursor: !reason ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setPhase("view")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {phase === "view" && (
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button
                type="button"
                onClick={confirmAccept}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 9,
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "opacity .13s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                &#x2713; Receive Cheque
              </button>
              <button
                type="button"
                onClick={() => setPhase("reject-form")}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 9,
                  background: "#fff",
                  color: "#dc2626",
                  border: "2px solid #dc2626",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all .13s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                &#x2715; Reject Cheque
              </button>
            </div>
          )}

          {(phase === "received" || phase === "rejected") && (
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>

    </>
  );
}

const TOP_LABEL = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: ".5px",
};

export default function AcceptCheque() {
  const [cheques, setCheques] = useState(MOCK_CHEQUES);
  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("5");
  const [selected, setSelected] = useState(null);

  const filtered = cheques.filter((c) => {
    if (c.status !== "Pending payment" && c.status !== "Payment received (completed)" && c.status !== "Payment Failed") return false;
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      c.memberName.toLowerCase().includes(q) ||
      c.mobileNo.includes(q);
    const matchCampaign =
      campaignFilter === "" || c.campaignId === Number(campaignFilter);
    return matchQ && matchCampaign;
  });

  const pg = usePagination(filtered, 10);

  const handleAccept = (id) => {
    setCheques((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "Payment received (completed)", policyNo: c.policyNo ?? `POL-${id.replace("CHQ-", "")}` }
          : c,
      ),
    );
  };

  const handleReject = (id, reason) => {
    setCheques((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Payment Failed", rejectionReason: reason } : c,
      ),
    );
  };

  const openCheque = cheques.find((c) => c.id === selected?.id) ?? null;

  return (
    <div>
      <PageHeader
        icon={<ChequeIcon />}
        title="Receive Cheque"
        subtitle="Review cheques members have submitted offline, verify the details, and accept or reject each one"
      >
        <Button variant="ghost" icon={<UploadIcon size={16} />} onClick={() => {}}>
          Export
        </Button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              marginBottom: 14,
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1 1 260px" }}>
              <label style={TOP_LABEL}>Search by Name or Mobile</label>
              <div style={{ position: "relative", marginTop: 5 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", display: "flex", pointerEvents: "none" }}>
                  <SearchIcon size={15} color="var(--text-3)" />
                </span>
                <input
                  className="field-input filter-search"
                  placeholder="Search by member name or mobile number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", paddingLeft: 34 }}
                />
              </div>
            </div>
            <div style={{ flex: "0 0 260px" }}>
              <label style={TOP_LABEL}>Campaign</label>
              <select
                className="field-select"
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                style={{ width: "100%", marginTop: 5 }}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {(search || campaignFilter) && (
              <div style={{ paddingBottom: 1 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: 12, padding: "5px 12px", flexShrink: 0 }}
                  onClick={() => {
                    setSearch("");
                    setCampaignFilter("");
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="table-wrap" style={{ maxHeight: 500, overflowY: "auto" }}>
            <table style={{ fontSize: 13, borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Order ID</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Member</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Mobile No.</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Cheque No.</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Bank</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Amount</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Submitted Date</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Payment Status</th>
                  <th style={{ position: "sticky", top: 0, zIndex: 2, background: "var(--surface-2)", borderBottom: "2px solid var(--border)" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pg.slice.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        textAlign: "center",
                        padding: "32px 0",
                        color: "#64748b",
                      }}
                    >
                      No cheque payments found
                    </td>
                  </tr>
                ) : (
                  pg.slice.map((c) => (
                    <tr key={c.id}>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          color: "#7c3aed",
                        }}
                      >
                        {c.proposalId}
                      </td>
                      <td style={{ fontWeight: 500 }}>{c.memberName}</td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {c.mobileNo}
                      </td>
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {c.chequeNo}
                      </td>
                      <td>{c.bank}</td>
                      <td style={{ fontWeight: 600 }}>{fmt(c.amount)}</td>
                      <td style={{ color: "#64748b" }}>{c.initiatedDate}</td>
                      <td>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              c.status === "Payment received (completed)"
                                ? "#dcfce7"
                                : c.status === "Payment Failed"
                                  ? "#fee2e2"
                                  : "#e0f2fe",
                            color:
                              c.status === "Payment received (completed)"
                                ? "#15803d"
                                : c.status === "Payment Failed"
                                  ? "#dc2626"
                                  : "#0369a1",
                            border: `1.5px solid ${
                              c.status === "Payment received (completed)"
                                ? "#86efac"
                                : c.status === "Payment Failed"
                                  ? "#fca5a5"
                                  : "#7dd3fc"
                            }`,
                          }}
                        >
                          {PAYMENT_STATUS_SHORT_LABEL[c.status] ?? c.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelected(c)}
                          style={{
                            padding: "5px 14px",
                            borderRadius: 7,
                            border: "1.5px solid #ddd6fe",
                            background: "#f5f3ff",
                            color: "#7c3aed",
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all .13s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#ede9fe";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#f5f3ff";
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            total={pg.total}
            page={pg.page}
            perPage={pg.perPage}
            onPage={pg.onPage}
            onPerPage={pg.onPerPage}
          />
        </div>
      </div>

      {selected && openCheque && (
        <ChequeDetailModal
          cheque={openCheque}
          onClose={() => setSelected(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
