import { useState } from "react";
import { ReportIcon, AgentIcon, CampaignIcon } from "../../icons";

const CALLING_AGENTS = [
  { id: 1, name: "Pooja Desai",   campaigns: 3, leadsAssigned: 38, converted: 27, convRate: 71, avgCallsPerLead: 2.4 },
  { id: 2, name: "Amit Tiwari",   campaigns: 2, leadsAssigned: 24, converted: 16, convRate: 67, avgCallsPerLead: 2.9 },
  { id: 3, name: "Sunita Rao",    campaigns: 3, leadsAssigned: 31, converted: 19, convRate: 61, avgCallsPerLead: 3.1 },
  { id: 4, name: "Rajiv Sharma",  campaigns: 1, leadsAssigned: 18, converted: 10, convRate: 56, avgCallsPerLead: 3.4 },
  { id: 5, name: "Meena Kapoor",  campaigns: 2, leadsAssigned: 22, converted: 15, convRate: 68, avgCallsPerLead: 2.6 },
];

const SALES_AGENTS = [
  { id: 1, name: "Ravi Kulkarni",  campaigns: 3, customers: 8,  policiesIssued: 5,  premiumCollected: 42500, avgPremium: 8500 },
  { id: 2, name: "Priya Nambiar",  campaigns: 2, customers: 11, policiesIssued: 9,  premiumCollected: 78300, avgPremium: 8700 },
  { id: 3, name: "Deepak Menon",   campaigns: 3, customers: 6,  policiesIssued: 4,  premiumCollected: 31200, avgPremium: 7800 },
  { id: 4, name: "Anjali Verma",   campaigns: 1, customers: 9,  policiesIssued: 7,  premiumCollected: 63000, avgPremium: 9000 },
  { id: 5, name: "Sanjay Iyer",    campaigns: 2, customers: 7,  policiesIssued: 5,  premiumCollected: 38500, avgPremium: 7700 },
];

const CAMPAIGNS = [
  {
    id: 1,  name: "Campaign 1",                                status: "Completed",
    callingAgents: ["Pooja Desai", "Amit Tiwari"],
    salesAgents:   ["Ravi Kulkarni", "Priya Nambiar"],
    leadsGenerated: 43, converted: 18, policiesSold: 12, premiumCollected: 102000,
  },
  {
    id: 5,  name: "Campaign OPD and DIGIT PAYMENT PROTECTION", status: "Closed",
    callingAgents: ["Sunita Rao"],
    salesAgents:   ["Anjali Verma"],
    leadsGenerated: 29, converted: 11, policiesSold: 8,  premiumCollected: 68400,
  },
  {
    id: 6,  name: "BPP Campaign",                              status: "Completed",
    callingAgents: ["Pooja Desai", "Rajiv Sharma"],
    salesAgents:   ["Deepak Menon"],
    leadsGenerated: 36, converted: 14, policiesSold: 9,  premiumCollected: 76500,
  },
  {
    id: 7,  name: "Test Campaign",                              status: "Completed",
    callingAgents: ["Amit Tiwari"],
    salesAgents:   ["Sanjay Iyer"],
    leadsGenerated: 12, converted: 4,  policiesSold: 3,  premiumCollected: 24000,
  },
  {
    id: 8,  name: "SBI_STP_Campaign",                          status: "Completed",
    callingAgents: ["Meena Kapoor", "Rajiv Sharma"],
    salesAgents:   ["Priya Nambiar"],
    leadsGenerated: 38, converted: 17, policiesSold: 13, premiumCollected: 110500,
  },
  {
    id: 11, name: "BPP Campaign_2026-2027",                    status: "Active",
    callingAgents: ["Pooja Desai", "Sunita Rao"],
    salesAgents:   ["Ravi Kulkarni", "Deepak Menon"],
    leadsGenerated: 21, converted: 8,  policiesSold: 5,  premiumCollected: 47500,
  },
  {
    id: 12, name: "Standalone campaign",                        status: "Completed",
    callingAgents: ["Amit Tiwari"],
    salesAgents:   ["Anjali Verma"],
    leadsGenerated: 18, converted: 7,  policiesSold: 5,  premiumCollected: 38000,
  },
];

const TABS = [
  { key: "calling",  label: "Calling Agent Performance", short: "Calling",   icon: "📞" },
  { key: "sales",    label: "Sales Agent Performance",   short: "Sales",     icon: "💼" },
  { key: "campaign", label: "Campaign-wise Report",      short: "Campaigns", icon: "📣" },
];

const STATUS_STYLE = {
  Active:    { background: "#e6f4ea", color: "#2d7d46" },
  Completed: { background: "#f1f3f4", color: "#5f6368" },
};

const TYPE_STYLE = {
  Promotional: { background: "#ede9fe", color: "#7c3aed" },
  Renewal:     { background: "#fff3e0", color: "#a05c00" },
  Onboarding:  { background: "#e0f4fb", color: "#0a7ea4" },
  Awareness:   { background: "#e6f4ea", color: "#2d7d46" },
  Seasonal:    { background: "#fce7f3", color: "#9d174d" },
};

function ConvBar({ pct }) {
  const color = pct >= 70 ? "#2d7d46" : pct >= 55 ? "#a05c00" : "#c0392b";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#e8e4f0", borderRadius: 99 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

export default function Reports() {
  const [tab, setTab] = useState("calling");

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><ReportIcon /></div>
          <div>
            <div className="page-title">Reports</div>
            <div className="page-subtitle">Agent performance and campaign analytics</div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="rp-tabs" style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: "9px 20px", borderRadius: 8, border: "1.5px solid",
              borderColor: tab === t.key ? "var(--brand)" : "var(--border)",
              background: tab === t.key ? "var(--brand)" : "#fff",
              color: tab === t.key ? "#fff" : "var(--text-2)",
              fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
            }}
          >
            <span>{t.icon}</span>
            <span className="rp-tab-long">{t.label}</span>
            <span className="rp-tab-short">{t.short}</span>
          </button>
        ))}
      </div>

      {/* ── Calling Agent Performance ── */}
      {tab === "calling" && (
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <AgentIcon style={{ width: 20, color: "var(--brand)" }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Calling Agent Performance</span>
            </div>

            {/* Summary KPIs */}
            <div className="rp-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Calling Agents", value: CALLING_AGENTS.length,                              color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Total Leads Assigned", value: CALLING_AGENTS.reduce((s,a)=>s+a.leadsAssigned,0), color: "#0a7ea4", bg: "#e0f4fb" },
                { label: "Total Converted",      value: CALLING_AGENTS.reduce((s,a)=>s+a.converted,0),     color: "#2d7d46", bg: "#e6f4ea" },
                { label: "Avg Conversion Rate",  value: Math.round(CALLING_AGENTS.reduce((s,a)=>s+a.convRate,0)/CALLING_AGENTS.length) + "%", color: "#a05c00", bg: "#fff3e0" },
              ].map(k => (
                <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 13, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#1a1628", marginTop: 4, fontWeight: 500 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="rp-calling-cards">
              {CALLING_AGENTS.map(a => (
                <div key={a.id} style={{ padding: "12px 14px", border: "1px solid #e8e4f0", borderRadius: 10, background: "#faf9fc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                    <span style={{ fontSize: 13, color: "var(--text-3)" }}>{a.campaigns} campaign{a.campaigns !== 1 ? "s" : ""}</span>
                  </div>
                  <ConvBar pct={a.convRate} />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10, fontSize: 12 }}>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Leads</div><div style={{ fontWeight: 700 }}>{a.leadsAssigned}</div></div>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Converted</div><div style={{ fontWeight: 700, color: "#2d7d46" }}>{a.converted}</div></div>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Calls/Lead</div><div style={{ fontWeight: 700 }}>{a.avgCallsPerLead}</div></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="rp-tbl-wrap table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Agent Name</th>
                    <th>Campaigns</th>
                    <th>Leads Assigned</th>
                    <th>Converted</th>
                    <th>Conversion Rate</th>
                    <th>Avg Calls / Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {CALLING_AGENTS.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color: "var(--text-3)" }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td>{a.campaigns}</td>
                      <td>{a.leadsAssigned}</td>
                      <td style={{ fontWeight: 600, color: "#2d7d46" }}>{a.converted}</td>
                      <td style={{ minWidth: 160 }}><ConvBar pct={a.convRate} /></td>
                      <td>{a.avgCallsPerLead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Sales Agent Performance ── */}
      {tab === "sales" && (
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <AgentIcon style={{ width: 20, color: "var(--brand)" }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Sales Agent Performance</span>
            </div>

            {/* Summary KPIs */}
            <div className="rp-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Sales Agents",     value: SALES_AGENTS.length,                                                                                     color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Total Customers",        value: SALES_AGENTS.reduce((s,a)=>s+a.customers,0),                                                             color: "#0a7ea4", bg: "#e0f4fb" },
                { label: "Policies Issued",        value: SALES_AGENTS.reduce((s,a)=>s+a.policiesIssued,0),                                                        color: "#2d7d46", bg: "#e6f4ea" },
                { label: "Total Premium (₹)",      value: "₹" + SALES_AGENTS.reduce((s,a)=>s+a.premiumCollected,0).toLocaleString("en-IN"),                        color: "#a05c00", bg: "#fff3e0" },
              ].map(k => (
                <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 13, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#1a1628", marginTop: 4, fontWeight: 500 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="rp-sales-cards">
              {SALES_AGENTS.map(a => (
                <div key={a.id} style={{ padding: "12px 14px", border: "1px solid #e8e4f0", borderRadius: 10, background: "#faf9fc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
                    <span style={{ fontSize: 13, color: "var(--text-3)" }}>{a.campaigns} campaign{a.campaigns !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, fontSize: 12 }}>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Customers</div><div style={{ fontWeight: 700 }}>{a.customers}</div></div>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Policies</div><div style={{ fontWeight: 700, color: "#2d7d46" }}>{a.policiesIssued}</div></div>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Premium</div><div style={{ fontWeight: 700, color: "#a05c00" }}>₹{a.premiumCollected.toLocaleString("en-IN")}</div></div>
                    <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Avg Premium</div><div style={{ fontWeight: 700 }}>₹{a.avgPremium.toLocaleString("en-IN")}</div></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="rp-tbl-wrap table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Agent Name</th>
                    <th>Campaigns</th>
                    <th>Customers</th>
                    <th>Policies Issued</th>
                    <th>Premium Collected (₹)</th>
                    <th>Avg Premium (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {SALES_AGENTS.map((a, i) => (
                    <tr key={a.id}>
                      <td style={{ color: "var(--text-3)" }}>{i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{a.name}</td>
                      <td>{a.campaigns}</td>
                      <td>{a.customers}</td>
                      <td style={{ fontWeight: 600, color: "#2d7d46" }}>{a.policiesIssued}</td>
                      <td style={{ fontWeight: 700, color: "#a05c00" }}>₹{a.premiumCollected.toLocaleString("en-IN")}</td>
                      <td style={{ color: "var(--text-2)" }}>₹{a.avgPremium.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Campaign-wise Report ── */}
      {tab === "campaign" && (
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <CampaignIcon style={{ width: 20, color: "var(--brand)" }} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Campaign-wise Report</span>
            </div>

            {/* Summary KPIs */}
            <div className="rp-kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
              {[
                { label: "Total Campaigns",      value: CAMPAIGNS.length,                                                                                  color: "#7c3aed", bg: "#f5f3ff" },
                { label: "Total Leads",          value: CAMPAIGNS.reduce((s,c)=>s+c.leadsGenerated,0),                                                    color: "#0a7ea4", bg: "#e0f4fb" },
                { label: "Policies Sold",        value: CAMPAIGNS.reduce((s,c)=>s+c.policiesSold,0),                                                      color: "#2d7d46", bg: "#e6f4ea" },
                { label: "Total Premium (₹)",   value: "₹" + CAMPAIGNS.reduce((s,c)=>s+c.premiumCollected,0).toLocaleString("en-IN"),                     color: "#a05c00", bg: "#fff3e0" },
              ].map(k => (
                <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: "16px 18px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: 13, fontFamily: '"Plus Jakarta Sans", sans-serif', color: "#1a1628", marginTop: 4, fontWeight: 500 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="rp-campaign-cards">
              {CAMPAIGNS.map(c => {
                const convPct = Math.round((c.converted / c.leadsGenerated) * 100);
                return (
                  <div key={c.id} style={{ padding: "12px 14px", border: "1px solid #e8e4f0", borderRadius: 10, background: "#faf9fc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</span>
                      <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 13, fontWeight: 600, flexShrink: 0, ...(STATUS_STYLE[c.status] ?? {}) }}>{c.status}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 13, fontWeight: 600, ...(TYPE_STYLE[c.type] ?? {}) }}>{c.type}</span>
                    </div>
                    <ConvBar pct={convPct} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginTop: 10, fontSize: 12 }}>
                      <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Leads</div><div style={{ fontWeight: 700 }}>{c.leadsGenerated}</div></div>
                      <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Converted</div><div style={{ fontWeight: 700, color: "#0a7ea4" }}>{c.converted}</div></div>
                      <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Policies Sold</div><div style={{ fontWeight: 700, color: "#2d7d46" }}>{c.policiesSold}</div></div>
                      <div><div style={{ color: "var(--text-3)", marginBottom: 2 }}>Premium</div><div style={{ fontWeight: 700, color: "#a05c00" }}>₹{c.premiumCollected.toLocaleString("en-IN")}</div></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="rp-tbl-wrap table-wrap">
              <table style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Campaign Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Calling Agents</th>
                    <th>Sales Agents</th>
                    <th>Leads</th>
                    <th>Converted</th>
                    <th>Policies Sold</th>
                    <th>Premium (₹)</th>
                    <th>Conv %</th>
                  </tr>
                </thead>
                <tbody>
                  {CAMPAIGNS.map((c, i) => {
                    const convPct = Math.round((c.converted / c.leadsGenerated) * 100);
                    return (
                      <tr key={c.id}>
                        <td style={{ color: "var(--text-3)" }}>{i + 1}</td>
                        <td style={{ fontWeight: 600, maxWidth: 180 }}>{c.name}</td>
                        <td>
                          <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 13, fontWeight: 600, ...(TYPE_STYLE[c.type] ?? {}) }}>
                            {c.type}
                          </span>
                        </td>
                        <td>
                          <span style={{ padding: "2px 9px", borderRadius: 99, fontSize: 13, fontWeight: 600, ...(STATUS_STYLE[c.status] ?? {}) }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-2)", fontSize: 12 }}>{c.callingAgents.join(", ")}</td>
                        <td style={{ color: "var(--text-2)", fontSize: 12 }}>{c.salesAgents.join(", ")}</td>
                        <td>{c.leadsGenerated}</td>
                        <td style={{ fontWeight: 600, color: "#0a7ea4" }}>{c.converted}</td>
                        <td style={{ fontWeight: 600, color: "#2d7d46" }}>{c.policiesSold}</td>
                        <td style={{ fontWeight: 700, color: "#a05c00" }}>₹{c.premiumCollected.toLocaleString("en-IN")}</td>
                        <td style={{ minWidth: 120 }}><ConvBar pct={convPct} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
