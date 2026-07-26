import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAssociations } from "../association/AssociationContext";

const ACTIVE_CAMPAIGNS = [
  { name: "BPP Campaign_2026-2027", operators: 3, leads: 21, status: "Active" },
  { name: "SBI_STP_Campaign", operators: 2, leads: 38, status: "Completed" },
  { name: "BPP Campaign", operators: 3, leads: 36, status: "Completed" },
];

const QUICK_ACTIONS = [
  {
    label: "Add Employee",
    path: "/agent/create",
    color: "#3b0764",
    bg: "#ede9fe",
  },
  {
    label: "Add Member",
    path: "/member/create",
    color: "#1e3a8a",
    bg: "#dbeafe",
  },
  {
    label: "Add Campaign",
    path: "/campaign/create",
    color: "#14532d",
    bg: "#dcfce7",
  },
  {
    label: "Add Product",
    path: "/product/create",
    color: "#78350f",
    bg: "#fef3c7",
  },
];

const CAMPAIGNS_LIST = [
  "Campaign 1",
  "Campaign OPD and DIGIT PAYMENT PROTECTION",
  "BPP Campaign",
  "Test Campaign",
  "SBI_STP_Campaign",
  "BPP Campaign_2026-2027",
  "Standalone campaign",
];

const CAMPAIGN_ID_MAP = {
  "Campaign 1": 1,
  "Campaign OPD and DIGIT PAYMENT PROTECTION": 5,
  "BPP Campaign": 6,
  "Test Campaign": 7,
  SBI_STP_Campaign: 8,
  "BPP Campaign_2026-2027": 11,
  "Standalone campaign": 12,
};

const ASSOCIATIONS_LIST = [
  "Mehta Insurance",
  "Priya Brokers",
  "Shah Financial",
  "AK Associates",
  "Nair & Co.",
  "Rao & Partners",
];

function fmtPremium(v) {
  if (!v) return null;
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

// Mock MIS datasets keyed by campaign name; default = all campaigns combined
const MIS_DATA = {
  "": {
    engagedMember: 30692,
    nonEngagedMember: 3186,
    policyPurchased: 21090,
    policyPending: 9602,
    onlinePurchased: 18042,
    offlinePurchased: 3048,
    rtgsInitiated: 221,
    chequeInitiated: 124,
    rtgsPurchased: 2128,
    chequePurchased: 920,
    paymentPending: 8657,
    paymentRejected: 945,
    // Premium amounts (INR) — avg ₹18,500 per policy
    engagedPremium: 567802000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 390165000,
    policyPendingPremium: 177637000,
    onlinePremium: 333777000,
    offlinePremium: 56388000,
    rtgsInitiatedAmt: 4088500,
    chequeInitiatedAmt: 2294000,
    rtgsPurchasedAmt: 39368000,
    chequePurchasedAmt: 17020000,
    paymentPendingAmt: 160154500,
    paymentRejectedAmt: 17482500,
  },
  "BPP Campaign_2026-2027": {
    engagedMember: 12400,
    nonEngagedMember: 1100,
    policyPurchased: 8800,
    policyPending: 3600,
    onlinePurchased: 7200,
    offlinePurchased: 1600,
    rtgsInitiated: 98,
    chequeInitiated: 62,
    rtgsPurchased: 980,
    chequePurchased: 420,
    paymentPending: 3100,
    paymentRejected: 320,
    engagedPremium: 229400000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 162800000,
    policyPendingPremium: 66600000,
    onlinePremium: 133200000,
    offlinePremium: 29600000,
    rtgsInitiatedAmt: 1813000,
    chequeInitiatedAmt: 1147000,
    rtgsPurchasedAmt: 18130000,
    chequePurchasedAmt: 7770000,
    paymentPendingAmt: 57350000,
    paymentRejectedAmt: 5920000,
  },
  SBI_STP_Campaign: {
    engagedMember: 9800,
    nonEngagedMember: 980,
    policyPurchased: 6900,
    policyPending: 2900,
    onlinePurchased: 5800,
    offlinePurchased: 1100,
    rtgsInitiated: 72,
    chequeInitiated: 41,
    rtgsPurchased: 710,
    chequePurchased: 290,
    paymentPending: 2400,
    paymentRejected: 280,
    engagedPremium: 181300000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 127650000,
    policyPendingPremium: 53650000,
    onlinePremium: 107300000,
    offlinePremium: 20350000,
    rtgsInitiatedAmt: 1332000,
    chequeInitiatedAmt: 758500,
    rtgsPurchasedAmt: 13135000,
    chequePurchasedAmt: 5365000,
    paymentPendingAmt: 44400000,
    paymentRejectedAmt: 5180000,
  },
  "BPP Campaign": {
    engagedMember: 5200,
    nonEngagedMember: 620,
    policyPurchased: 3600,
    policyPending: 1600,
    onlinePurchased: 2900,
    offlinePurchased: 700,
    rtgsInitiated: 38,
    chequeInitiated: 18,
    rtgsPurchased: 430,
    chequePurchased: 170,
    paymentPending: 1300,
    paymentRejected: 190,
    engagedPremium: 96200000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 66600000,
    policyPendingPremium: 29600000,
    onlinePremium: 53650000,
    offlinePremium: 12950000,
    rtgsInitiatedAmt: 703000,
    chequeInitiatedAmt: 333000,
    rtgsPurchasedAmt: 7955000,
    chequePurchasedAmt: 3145000,
    paymentPendingAmt: 24050000,
    paymentRejectedAmt: 3515000,
  },
  "Campaign OPD and DIGIT PAYMENT PROTECTION": {
    engagedMember: 7840,
    nonEngagedMember: 960,
    policyPurchased: 5200,
    policyPending: 2640,
    onlinePurchased: 4100,
    offlinePurchased: 1100,
    rtgsInitiated: 54,
    chequeInitiated: 28,
    rtgsPurchased: 680,
    chequePurchased: 310,
    paymentPending: 2100,
    paymentRejected: 380,
    engagedPremium: 144940000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 96200000,
    policyPendingPremium: 48840000,
    onlinePremium: 75850000,
    offlinePremium: 20350000,
    rtgsInitiatedAmt: 999000,
    chequeInitiatedAmt: 518000,
    rtgsPurchasedAmt: 12580000,
    chequePurchasedAmt: 5735000,
    paymentPendingAmt: 38850000,
    paymentRejectedAmt: 7030000,
  },
  "Campaign 1": {
    engagedMember: 2100,
    nonEngagedMember: 310,
    policyPurchased: 1400,
    policyPending: 700,
    onlinePurchased: 1100,
    offlinePurchased: 300,
    rtgsInitiated: 8,
    chequeInitiated: 3,
    rtgsPurchased: 180,
    chequePurchased: 80,
    paymentPending: 560,
    paymentRejected: 90,
    engagedPremium: 38850000,
    nonEngagedPremium: 0,
    policyPurchasedPremium: 25900000,
    policyPendingPremium: 12950000,
    onlinePremium: 20350000,
    offlinePremium: 5550000,
    rtgsInitiatedAmt: 148000,
    chequeInitiatedAmt: 55500,
    rtgsPurchasedAmt: 3330000,
    chequePurchasedAmt: 1480000,
    paymentPendingAmt: 10360000,
    paymentRejectedAmt: 1665000,
  },
};

// ── MIS sub-components ─────────────────────────────────────────────────────────
function DonutChart({ title, segments, note, style, hidePercent }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const r = 38;
  const circumference = 2 * Math.PI * r;
  let cum = 0;
  const arcs = segments.map((seg) => {
    const pct = total > 0 ? seg.value / total : 0;
    const dash = pct * circumference;
    const dashOffset = circumference - cum;
    cum += dash;
    return { ...seg, dash, dashOffset, pct };
  });
  return (
    <div
      style={{
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #dee1e5",
        padding: 16,
        ...style,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 16,
          color: "#24304a",
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 100 100"
          style={{ flexShrink: 0 }}
        >
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={arc.color}
              strokeWidth="18"
              strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
              strokeDashoffset={arc.dashOffset}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50px 50px",
              }}
            />
          ))}
          <text
            x="50"
            y="46"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#24304a"
          >
            {total.toLocaleString("en-IN")}
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontSize="8"
            fill="#6d747a"
          >
            Total
          </text>
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
            minWidth: 0,
          }}
        >
          {arcs.map((arc, i) => {
            const premiumStr =
              arc.premium != null ? fmtPremium(arc.premium) : null;
            const clickable = !!arc.onClick;
            return (
              <div
                key={i}
                onClick={arc.onClick}
                style={{
                  display: "flex",
                  gap: 8,
                  cursor: clickable ? "pointer" : "default",
                  borderRadius: 6,
                  padding: clickable ? "3px 4px" : 0,
                  transition: "background .15s",
                }}
                onMouseEnter={(e) => {
                  if (clickable)
                    e.currentTarget.style.background = `${arc.color}12`;
                }}
                onMouseLeave={(e) => {
                  if (clickable)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: arc.color,
                    flexShrink: 0,
                    marginTop: 3,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ color: "#6d747a", fontWeight: 500 }}>
                      {arc.label}
                      {clickable && (
                        <span style={{ color: arc.color, marginLeft: 3 }}>↗</span>
                      )}
                    </span>
                    {!hidePercent && (
                      <span style={{ color: "#24304a", fontWeight: 600, flexShrink: 0 }}>
                        {Math.round(arc.pct * 100)}%
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#6d747a", fontWeight: 500, marginTop: 2 }}>
                    {arc.value.toLocaleString("en-IN")}
                  </div>
                  {premiumStr && (
                    <div style={{ fontSize: 13, color: "#6d747a", marginTop: 1 }}>
                      {premiumStr}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      {note && (
        <div
          style={{
            fontSize: 15,
            color: "#64748b",
            marginTop: 10,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}


// ── Main component ─────────────────────────────────────────────────────────────
export default function BrokerPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { associations = [] } = useAssociations() ?? {};

  const [campaignFilter, setCampaignFilter] = useState(
    "Campaign OPD and DIGIT PAYMENT PROTECTION",
  );
  const [assocFilter, setAssocFilter] = useState("");
  const [mis, setMis] = useState(
    MIS_DATA["Campaign OPD and DIGIT PAYMENT PROTECTION"] ?? MIS_DATA[""],
  );

  const handleMisSubmit = () => {
    const data = MIS_DATA[campaignFilter] ?? MIS_DATA[""];
    setMis(data);
  };

  const goToPolicyPurchased = () => {
    const params = new URLSearchParams();
    const id = CAMPAIGN_ID_MAP[campaignFilter];
    if (id) params.set("campaignId", id);
    params.set("payment", "Payment received (completed)");
    navigate(`/policy?${params.toString()}`);
  };

  const goToPaymentPending = () => {
    const params = new URLSearchParams();
    const id = CAMPAIGN_ID_MAP[campaignFilter];
    if (id) params.set("campaignId", id);
    params.set("payment", "Pending payment");
    navigate(`/policy?${params.toString()}`);
  };

  const goToPolicyPending = () => {
    const params = new URLSearchParams();
    const id = CAMPAIGN_ID_MAP[campaignFilter];
    if (id) params.set("campaignId", id);
    params.set("status", "Pending");
    navigate(`/policy?${params.toString()}`);
  };

  const goToEngaged = () => {
    const params = new URLSearchParams();
    const id = CAMPAIGN_ID_MAP[campaignFilter];
    if (id) params.set("campaignId", id);
    params.set("engaged", "true");
    navigate(`/member?${params.toString()}`);
  };

  const goToNonEngaged = () => {
    const params = new URLSearchParams();
    const id = CAMPAIGN_ID_MAP[campaignFilter];
    if (id) params.set("campaignId", id);
    params.set("engaged", "false");
    navigate(`/member?${params.toString()}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── MIS Section ── */}
      <div className="card">
        <div className="card-body">
          {/* MIS header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 4,
                height: 22,
                borderRadius: 99,
                background: "linear-gradient(180deg,#1565d8,#104ea6)",
              }}
            />
            <div style={{ fontWeight: 800, fontSize: 22, color: "#1e293b" }}>
              Campaign MIS
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-end",
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: ".4px",
                }}
              >
                Campaign Name
              </label>
              <select
                className="field-select"
                style={{ width: "100%" }}
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
              >
                <option value="">All Campaigns</option>
                {CAMPAIGNS_LIST.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 5,
                  textTransform: "uppercase",
                  letterSpacing: ".4px",
                }}
              >
                Association
              </label>
              <select
                className="field-select"
                style={{ width: "100%" }}
                value={assocFilter}
                onChange={(e) => setAssocFilter(e.target.value)}
              >
                <option value="">All Associations</option>
                {associations
                  .filter((a) => a.isActive)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleMisSubmit}
              style={{
                padding: "10px 30px",
                borderRadius: 9,
                background: "#1565d8",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                fontSize: 13.5,
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(21,101,216,.30)",
              }}
            >
              Apply
            </button>
          </div>

          {/* Stats + Quick Actions row */}
          {(() => {
            const paymentInitiated = mis.policyPurchased + mis.paymentPending + mis.paymentRejected;
            const paymentNotInitiated = Math.max(0, mis.engagedMember - paymentInitiated);
            return (
              <div
                className="bd-stats-row"
                style={{ display: "flex", gap: 12, alignItems: "stretch", marginBottom: 12 }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gridAutoRows: "1fr",
                    gap: 12,
                  }}
                >
                  <DonutChart
                    title="Total Members"
                    segments={[
                      {
                        label: "Member Engaged",
                        value: mis.engagedMember,
                        color: "#1565D8",
                        onClick: goToEngaged,
                      },
                      {
                        label: "Member Not Engaged",
                        value: mis.nonEngagedMember,
                        color: "#FFBB33",
                        onClick: goToNonEngaged,
                      },
                    ]}
                    note="Number of Members"
                    hidePercent
                    style={{
                      gridColumn: "1 / 3",
                      gridRow: "1 / 3",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  />
                  <DonutChart
                    title="Engaged members"
                    segments={[
                      {
                        label: "Payment Initiated",
                        value: paymentInitiated,
                        color: "#F57C00",
                        onClick: goToPaymentPending,
                      },
                      {
                        label: "Payment Not Initiated",
                        value: paymentNotInitiated,
                        color: "#1565D8",
                      },
                    ]}
                    note="Number of Members"
                    hidePercent
                    style={{
                      gridColumn: "3 / 5",
                      gridRow: "1 / 3",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: 210,
                    flexShrink: 0,
                    background: "#fff",
                    border: "1px solid #dee1e5",
                    borderRadius: 8,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#24304a",
                      textTransform: "uppercase",
                    }}
                  >
                    Quick Actions
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {QUICK_ACTIONS.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => navigate(a.path)}
                        style={{
                          background: "#fff",
                          border: "1px solid #dee1e5",
                          borderRadius: 6,
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          textAlign: "left",
                          color: "#1565d8",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1565d8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          <div
            className="bd-stats-row"
            style={{ display: "flex", gap: 12, alignItems: "stretch", marginBottom: 12 }}
          >
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gridAutoRows: "1fr",
                gap: 12,
              }}
            >
              <DonutChart
                title="Purchased Policies"
                segments={[
                  {
                    label: "Payment Cleared",
                    value: mis.policyPurchased,
                    color: "#33B5E5",
                    onClick: goToPolicyPurchased,
                  },
                  {
                    label: "Payment Not Cleared",
                    value: mis.policyPending,
                    color: "#1565D8",
                    onClick: goToPolicyPending,
                  },
                ]}
                note="Number of Policies"
                hidePercent
                style={{
                  gridColumn: "1 / 3",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              />
              <DonutChart
                title="Payments"
                segments={[
                  {
                    label: "Payment Cleared",
                    value: mis.policyPurchasedPremium,
                    color: "#33B5E5",
                    onClick: goToPolicyPurchased,
                  },
                  {
                    label: "Payment Not Cleared",
                    value: mis.policyPendingPremium,
                    color: "#1565D8",
                    onClick: goToPolicyPending,
                  },
                ]}
                note="Amount"
                hidePercent
                style={{
                  gridColumn: "3 / 5",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              />
            </div>
            <div style={{ width: 210, flexShrink: 0 }} />
          </div>

        </div>
      </div>

    </div>
  );
}
