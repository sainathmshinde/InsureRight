import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const INS_MENU = {
  key: "insurance", label: "Insurance", wide: true,
  children: [
    { label: "🏥 Health",       path: "/insurance/health",       badge: "LIVE" },
    { label: "🚗 Car",          path: "/insurance/car" },
    { label: "🏍️ Two-Wheeler",  path: "/insurance/two-wheeler" },
    { label: "🛡️ Term Life",    path: "/insurance/term-life" },
    { label: "📈 Investment",   path: "/insurance/investment" },
    { label: "✈️ Travel",       path: "/insurance/travel" },
    { label: "🏠 Home",         path: "/insurance/home" },
    { label: "🏢 Business",     path: "/insurance/business" },
  ],
};

const BROKER_NAV = [
  { key: "broker-portal",      label: "Dashboard",    children: [{ label: "Overview",           path: "/broker-portal" }] },
  { key: "profile",            label: "My Profile",   children: [{ label: "View Profile",       path: "/profile" }, { label: "Edit Profile", path: "/profile/edit" }] },
  { key: "agent",              label: "Agents",       children: [{ label: "All Agents",         path: "/agent" }, { label: "Add Agent", path: "/agent/create" }, { label: "Commission", path: "/agent/commission" }] },
  { key: "customer",           label: "Customers",    children: [{ label: "All Customers",      path: "/customer" }, { label: "Add Customer", path: "/customer/create" }] },
  { key: "product",            label: "Products",     children: [{ label: "Product Catalogue",  path: "/product" }, { label: "Add Product", path: "/product/create" }] },
  { key: "policy",             label: "Policy",       children: [{ label: "Policy Issuance",    path: "/policy" }, { label: "Buy Policy", path: "/policy/buy" }] },
  { key: "campaign",           label: "Campaign",     children: [{ label: "All Campaigns",      path: "/campaign" }, { label: "Add Campaign", path: "/campaign/create" }] },
  { key: "crm",                label: "CRM",          children: [{ label: "CRM",                path: "/crm" }] },
  { key: "ic",                 label: "Insurers",     children: [{ label: "IC Master",          path: "/ic" }, { label: "Add IC", path: "/ic/create" }] },
  INS_MENU,
  { key: "insurance-partners", label: "Partners",     children: [{ label: "Insurance Partners", path: "/insurance-partners" }] },
];

const AGENT_NAV = [
  { key: "agent-portal",       label: "Dashboard",    children: [{ label: "Overview",           path: "/agent-portal" }] },
  { key: "profile",            label: "My Profile",   children: [{ label: "View Profile",       path: "/profile" }, { label: "Edit Profile", path: "/profile/edit" }] },
  { key: "customer",           label: "My Customers", children: [{ label: "All Customers",      path: "/customer" }, { label: "Add Customer", path: "/customer/create" }] },
  { key: "policy",             label: "Policy",       children: [{ label: "Policy Issuance", path: "/policy" }, { label: "Buy Policy", path: "/policy/buy" }, { label: "Policy Catalogue", path: "/policy-catalogue" }] },
  { key: "agent",              label: "Commission",   children: [{ label: "My Commission",      path: "/agent/commission" }] },
  INS_MENU,
  { key: "insurance-partners", label: "Partners",     children: [{ label: "Insurance Partners", path: "/insurance-partners" }] },
];

const CUSTOMER_NAV = [
  { key: "customer-portal",    label: "Dashboard",    children: [{ label: "Overview",           path: "/customer-portal" }] },
  { key: "profile",            label: "My Profile",   children: [{ label: "View Profile",       path: "/profile" }, { label: "Edit Profile", path: "/profile/edit" }] },
  { key: "policy",             label: "My Policies",  children: [{ label: "View Policies", path: "/policy" }, { label: "Policy Catalogue", path: "/policy-catalogue" }] },
  INS_MENU,
  { key: "insurance-partners", label: "Partners",     children: [{ label: "Insurance Partners", path: "/insurance-partners" }] },
];

const ROLE_COLOR = { broker: "#7c3aed", agent: "#0a7ea4", customer: "#2d7d46" };
const ROLE_LABEL = { broker: "Broker Portal", agent: "Agent Portal", customer: "Customer Portal" };

export default function TopNav() {
  const { user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const [openKey,  setOpenKey]  = useState(null); // which nav dropdown is open
  const [profOpen, setProfOpen] = useState(false);

  const closeTimer = useRef(null);
  const profRef    = useRef(null);

  const nav        = user?.role === "agent" ? AGENT_NAV : user?.role === "customer" ? CUSTOMER_NAV : BROKER_NAV;
  const roleColor  = ROLE_COLOR[user?.role] || "#7c3aed";
  const roleLabel  = ROLE_LABEL[user?.role] || "Portal";
  const initials   = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  // Close profile dropdown when clicking outside the profile ref
  useEffect(() => {
    const handler = e => {
      if (profRef.current && !profRef.current.contains(e.target)) {
        setProfOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Hover helpers — schedule close so moving between button → dropdown keeps it open
  const hoverOpen  = key => { clearTimeout(closeTimer.current); setOpenKey(key); };
  const hoverClose = ()  => { closeTimer.current = setTimeout(() => setOpenKey(null), 180); };
  const keepOpen   = ()  => clearTimeout(closeTimer.current);

  const goTo = path => { navigate(path); setOpenKey(null); };
  const handleLogout = () => { setProfOpen(false); logout(); navigate("/login"); };

  return (
    <>
      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .tn-navbtn:hover > .tn-label { color: ${roleColor} !important; }
        .tn-navbtn:hover > .tn-chev  { color: ${roleColor} !important; }
        .tn-dropbtn:hover { background: #f5f3ff !important; color: ${roleColor} !important; }
        .tn-profbtn:hover { background: #f5f3ff !important; }
        .tn-logout:hover  { background: #fef2f2 !important; color: #dc2626 !important; }
      `}</style>

      <header style={{
        height: 58, flexShrink: 0, background: "#fff",
        borderBottom: "1.5px solid #e8e4f0", zIndex: 200,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "stretch", height: "100%", padding: "0 24px", maxWidth: 1600, margin: "0 auto" }}>

          {/* ── Logo ── */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 20, marginRight: 4, borderRight: "1px solid #f0edf8", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#1a1628", letterSpacing: -0.3, fontFamily: "inherit" }}>
              Insure<span style={{ color: roleColor }}>Right</span>
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: roleColor + "18", color: roleColor, whiteSpace: "nowrap" }}>
              {roleLabel}
            </span>
          </button>

          {/* ── Nav items ── */}
          <nav style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 0 }}>
            {nav.map(item => {
              const isActive     = location.pathname.startsWith("/" + item.key);
              const isOpen       = openKey === item.key;
              const hasChildren  = item.children.length > 1;

              return (
                <div
                  key={item.key}
                  style={{ position: "relative", display: "flex", alignItems: "stretch" }}
                  onMouseEnter={() => hasChildren ? hoverOpen(item.key) : undefined}
                  onMouseLeave={() => hasChildren ? hoverClose() : undefined}
                >
                  {/* Nav button — always navigates to first child on click */}
                  <button
                    className="tn-navbtn"
                    onClick={() => goTo(item.children[0].path)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "0 12px", border: "none", background: "none",
                      cursor: "pointer", fontFamily: "inherit",
                      borderBottom: `2.5px solid ${isActive ? roleColor : "transparent"}`,
                    }}
                  >
                    <span className="tn-label" style={{
                      fontSize: 13, fontWeight: isActive ? 600 : 500,
                      color: isActive ? roleColor : "#1a1628",
                      whiteSpace: "nowrap", transition: "color .12s",
                    }}>
                      {item.label}
                    </span>
                    {hasChildren && (
                      <span className="tn-chev" style={{
                        fontSize: 9, marginTop: 1,
                        color: isActive ? roleColor : "#bbb",
                        transition: "transform .15s, color .12s",
                        display: "inline-block",
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}>▾</span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {isOpen && hasChildren && (
                    <div
                      onMouseEnter={keepOpen}
                      onMouseLeave={hoverClose}
                      style={{
                        position: "absolute", top: "calc(100% + 2px)", left: 0,
                        minWidth: item.wide ? 340 : 200, background: "#fff",
                        border: "1.5px solid #e8e4f0", borderRadius: 10,
                        boxShadow: "0 12px 32px rgba(100,80,160,.18), 0 2px 8px rgba(0,0,0,.08)",
                        zIndex: 9999, overflow: "hidden",
                        animation: "slideDown .15s ease",
                      }}
                    >
                      <div style={{
                        padding: "7px 14px 6px", fontSize: 10, fontWeight: 700,
                        color: roleColor, textTransform: "uppercase", letterSpacing: ".6px",
                        borderBottom: "1px solid #f0edf8", background: "#faf9fc",
                      }}>
                        {item.label}
                      </div>
                      <div style={item.wide ? { display: "grid", gridTemplateColumns: "1fr 1fr", padding: "6px" } : {}}>
                        {item.children.map(child => {
                          const childActive = location.pathname === child.path;
                          return (
                            <button
                              key={child.path}
                              className="tn-dropbtn"
                              onClick={() => goTo(child.path)}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                width: "100%", textAlign: "left",
                                padding: item.wide ? "9px 12px" : "10px 16px",
                                fontSize: 13.5, borderRadius: item.wide ? 7 : 0,
                                color: childActive ? roleColor : "#1a1628",
                                fontWeight: childActive ? 600 : 400,
                                background: childActive ? roleColor + "12" : "transparent",
                                border: "none",
                                borderBottom: item.wide ? "none" : "1px solid #f5f3ff",
                                cursor: "pointer", fontFamily: "inherit",
                                transition: "background .1s, color .1s",
                              }}
                            >
                              <span>{child.label}</span>
                              {child.badge && (
                                <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 99, background: "#2d7d46", color: "#fff", letterSpacing: ".3px", marginLeft: 6 }}>
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Right side ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 14, borderLeft: "1px solid #f0edf8", flexShrink: 0 }}>

            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#faf9fc", border: "1.5px solid #e8e4f0", borderRadius: 8, padding: "0 11px", height: 34, width: 160 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9d94b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Search…" style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, fontFamily: "inherit", width: "100%", color: "#1a1628" }} />
            </div>

            {/* Bell */}
            <button style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #e8e4f0", background: "#faf9fc", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5c5573" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span style={{ position: "absolute", top: 5, right: 5, width: 6, height: 6, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #fff" }} />
            </button>

            {/* Profile */}
            <div style={{ position: "relative" }} ref={profRef}>
              <button
                onClick={e => { e.stopPropagation(); setProfOpen(v => !v); }}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 4px", border: "1.5px solid #e8e4f0", borderRadius: 10, background: "#faf9fc", cursor: "pointer", fontFamily: "inherit" }}
              >
                <div style={{ width: 30, height: 30, borderRadius: 7, background: roleColor, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25, textAlign: "left" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1a1628", whiteSpace: "nowrap" }}>{user?.name?.split(" ")[0]}</span>
                  <span style={{ fontSize: 10.5, color: "#9d94b8" }}>{roleLabel.split(" ")[0]}</span>
                </div>
                <span style={{ fontSize: 10, color: "#9d94b8", display: "inline-block", transition: "transform .15s", transform: profOpen ? "rotate(180deg)" : "none" }}>▾</span>
              </button>

              {profOpen && (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 235, background: "#fff", border: "1.5px solid #e8e4f0", borderRadius: 12, boxShadow: "0 8px 28px rgba(100,80,160,.15), 0 2px 8px rgba(0,0,0,.06)", zIndex: 9999, overflow: "hidden", animation: "slideDown .14s ease" }}
                >
                  {/* User header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 16px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: roleColor, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1628" }}>{user?.name}</div>
                      <div style={{ fontSize: 11.5, color: "#9d94b8", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: "#f0edf8" }} />

                  {/* Profile links */}
                  {[
                    { icon: "👤", label: "View Profile",  path: "/profile"      },
                    { icon: "✏️", label: "Edit Profile",  path: "/profile/edit" },
                  ].map(it => (
                    <button
                      key={it.path}
                      className="tn-profbtn"
                      onClick={() => { navigate(it.path); setProfOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13.5, color: "#1a1628", fontFamily: "inherit", textAlign: "left", transition: "background .1s" }}
                    >
                      <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{it.icon}</span>
                      {it.label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: "#f0edf8" }} />

                  {/* Sign out */}
                  <button
                    className="tn-logout"
                    onClick={handleLogout}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13.5, color: "#dc2626", fontFamily: "inherit", textAlign: "left", transition: "background .1s, color .1s" }}
                  >
                    <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
}
