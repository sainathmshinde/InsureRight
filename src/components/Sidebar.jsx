import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AgentIcon,
  BrokerIcon,
  CampaignIcon,
  CustomerIcon,
  InsuranceCompanyIcon,
  ProductIcon,
  PolicyIcon,
} from "../icons";

const NAV = [
  {
    key: "broker",
    label: "Broker",
    icon: BrokerIcon,
    children: [
      { label: "All Brokers", path: "/broker" },
      { label: "Add Broker",  path: "/broker/create" },
    ],
  },
  {
    key: "ic",
    label: "Insurance Co.",
    icon: InsuranceCompanyIcon,
    children: [
      { label: "IC Master", path: "/ic" },
      { label: "Add IC",    path: "/ic/create" },
    ],
  },
  {
    key: "agent",
    label: "Agent / POS",
    icon: AgentIcon,
    children: [
      { label: "All Agents", path: "/agent" },
      { label: "Add Agent",  path: "/agent/create" },
      { label: "Commission", path: "/agent/commission" },
    ],
  },
  {
    key: "customer",
    label: "Customer",
    icon: CustomerIcon,
    children: [
      { label: "All Customers", path: "/customer" },
      { label: "Add Customer",  path: "/customer/create" },
    ],
  },
  {
    key: "product",
    label: "Products",
    icon: ProductIcon,
    children: [
      { label: "Product Catalogue", path: "/product" },
      { label: "Add Product",       path: "/product/create" },
    ],
  },
  {
    key: "campaign",
    label: "Campaign",
    icon: CampaignIcon,
    children: [
      { label: "All Campaigns", path: "/campaign" },
      { label: "Add Campaign",  path: "/campaign/create" },
    ],
  },
  {
    key: "policy",
    label: "Policy",
    icon: PolicyIcon,
    children: [
      { label: "Policy Issuance", path: "/policy" },
      { label: "Buy Policy",      path: "/policy/buy" },
    ],
  },
];

const EXPANDED_W  = 230;
const COLLAPSED_W = 62;

export default function Sidebar() {
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [openKey, setOpenKey] = useState(
    () => NAV.find((n) => location.pathname.startsWith("/" + n.key))?.key ?? null
  );
  const [hoveredKey, setHoveredKey] = useState(null);
  const leaveTimer = useRef(null);

  // close flyout on route change
  useEffect(() => { setHoveredKey(null); }, [location.pathname]);

  const toggle = () => {
    setCollapsed((c) => !c);
    setHoveredKey(null);
  };

  const handleParentClick = (key) => {
    if (collapsed) return;
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const onEnter = (key) => {
    if (!collapsed) return;
    clearTimeout(leaveTimer.current);
    setHoveredKey(key);
  };

  const onLeave = () => {
    if (!collapsed) return;
    leaveTimer.current = setTimeout(() => setHoveredKey(null), 150);
  };

  const keepOpen = () => {
    if (!collapsed) return;
    clearTimeout(leaveTimer.current);
  };

  return (
    <>
      {/* CSS animation keyframe */}
      <style>{`
        @keyframes flyIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .sidebar-child-link:hover {
          background: #f5f3ff !important;
          color: #7c3aed !important;
        }
        .flyout-item:hover {
          background: #f5f3ff !important;
          color: #7c3aed !important;
        }
        .toggle-btn:hover { background: #ede9fe !important; }
        .nav-btn:not(.active-nav):hover {
          background: #f5f3ff !important;
        }
      `}</style>

      <aside
        style={{
          ...S.aside,
          width: collapsed ? COLLAPSED_W : EXPANDED_W,
        }}
      >
        {/* ── Logo + toggle ─────────────────── */}
        <div style={{
          ...S.logoRow,
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "0 0" : "0 16px 0 18px",
        }}>
          {!collapsed && (
            <span style={S.logoText}>
              Insure<span style={S.accent}>Right</span>
            </span>
          )}
          <button className="toggle-btn" style={S.toggleBtn} onClick={toggle} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <IconExpand /> : <IconCollapse />}
          </button>
        </div>

        {/* ── Nav ───────────────────────────── */}
        <nav style={{ ...S.nav, alignItems: collapsed ? "center" : "stretch" }}>
          {NAV.map((item) => {
            const Icon         = item.icon;
            const moduleActive = location.pathname.startsWith("/" + item.key);
            const isOpen       = !collapsed && openKey === item.key;
            const flyOpen      = collapsed  && hoveredKey === item.key;

            return (
              <div
                key={item.key}
                style={{ position: "relative", width: "100%" }}
                onMouseEnter={() => onEnter(item.key)}
                onMouseLeave={onLeave}
              >
                {/* Parent button */}
                <button
                  className={`nav-btn${moduleActive ? " active-nav" : ""}`}
                  style={{
                    ...S.navBtn,
                    ...(collapsed ? S.navBtnCollapsed : {}),
                    ...(moduleActive ? S.navBtnActive : {}),
                  }}
                  onClick={() => handleParentClick(item.key)}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={S.iconWrap}>
                    <Icon size={19} color={moduleActive ? "#fff" : "#7c3aed"} />
                  </span>

                  {!collapsed && (
                    <>
                      <span style={S.label}>{item.label}</span>
                      <span style={{
                        ...S.chevron,
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        color: moduleActive ? "rgba(255,255,255,0.7)" : "#a78bfa",
                      }}>›</span>
                    </>
                  )}

                  {/* tiny active pip in collapsed mode */}
                  {collapsed && moduleActive && <span style={S.pip} />}
                </button>

                {/* ── Inline sub-menu (expanded mode) ── */}
                {isOpen && (
                  <div style={S.children}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={child.path === "/" + item.key}
                        className="sidebar-child-link"
                        style={({ isActive }) => ({
                          ...S.child,
                          ...(isActive ? S.childActive : {}),
                        })}
                      >
                        <span style={{
                          ...S.dot,
                          background: location.pathname === child.path ? "#7c3aed" : "#c4b8e8",
                        }} />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* ── Flyout panel (collapsed mode) ── */}
                {flyOpen && (
                  <div
                    style={S.flyout}
                    onMouseEnter={keepOpen}
                    onMouseLeave={onLeave}
                  >
                    <div style={S.flyoutHead}>
                      <Icon size={14} color="#7c3aed" />
                      <span>{item.label}</span>
                    </div>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={child.path === "/" + item.key}
                        className="flyout-item"
                        style={({ isActive }) => ({
                          ...S.flyoutItem,
                          ...(isActive ? S.flyoutItemActive : {}),
                        })}
                        onClick={() => setHoveredKey(null)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

/* ── Inline SVG icons for the toggle button ──────────────────────────── */
function IconCollapse() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3"  y1="6"  x2="21" y2="6"/>
      <line x1="3"  y1="12" x2="14" y2="12"/>
      <line x1="3"  y1="18" x2="21" y2="18"/>
      <polyline points="17 9 21 12 17 15"/>
    </svg>
  );
}
function IconExpand() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3"  y1="6"  x2="21" y2="6"/>
      <line x1="3"  y1="12" x2="14" y2="12"/>
      <line x1="3"  y1="18" x2="21" y2="18"/>
      <polyline points="21 9 17 12 21 15"/>
    </svg>
  );
}

/* ── Style objects ───────────────────────────────────────────────────── */
const S = {
  aside: {
    minHeight: "100vh",
    background: "#fff",
    borderRight: "1.5px solid #e8e4f0",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflowY: "auto",
    overflowX: "visible",
    scrollbarWidth: "none",
    transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
    position: "relative",
    zIndex: 20,
  },

  logoRow: {
    height: "var(--topbar-h, 58px)",
    display: "flex",
    alignItems: "center",
    borderBottom: "1.5px solid #e8e4f0",
    flexShrink: 0,
    gap: 8,
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    color: "#1a1628",
    letterSpacing: -0.3,
    whiteSpace: "nowrap",
  },
  accent: { color: "#7c3aed" },

  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    border: "1.5px solid #e8e4f0",
    background: "#faf9fc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background .15s",
  },

  nav: {
    padding: "10px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
  },

  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 10px",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    color: "#1a1628",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "background .13s, color .13s",
    fontFamily: "inherit",
    position: "relative",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  navBtnCollapsed: {
    width: 44,
    height: 44,
    padding: 0,
    justifyContent: "center",
    gap: 0,
    borderRadius: 10,
  },
  navBtnActive: {
    background: "#7c3aed",
    color: "#fff",
  },

  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 22,
    height: 22,
  },
  label: { flex: 1, fontSize: 13.5 },
  chevron: {
    fontSize: 17,
    display: "inline-block",
    transition: "transform .2s",
    lineHeight: 1,
  },
  pip: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#fff",
    opacity: 0.9,
  },

  /* inline children */
  children: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    padding: "2px 0 4px 10px",
    overflow: "hidden",
  },
  child: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 6,
    fontSize: 13,
    color: "#5c5573",
    textDecoration: "none",
    transition: "background .12s, color .12s",
  },
  childActive: {
    background: "#ede9fe",
    color: "#7c3aed",
    fontWeight: 600,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background .15s",
  },

  /* flyout */
  flyout: {
    position: "absolute",
    left: "calc(100% + 10px)",
    top: 0,
    minWidth: 196,
    background: "#fff",
    border: "1.5px solid #e8e4f0",
    borderRadius: 12,
    boxShadow: "0 8px 28px rgba(100,80,160,.14), 0 2px 8px rgba(0,0,0,.06)",
    zIndex: 300,
    overflow: "hidden",
    animation: "flyIn .15s ease",
  },
  flyoutHead: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 14px 9px",
    fontSize: 11.5,
    fontWeight: 700,
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: ".6px",
    borderBottom: "1px solid #e8e4f0",
    background: "#faf9fc",
  },
  flyoutItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    fontSize: 13.5,
    color: "#1a1628",
    textDecoration: "none",
    transition: "background .1s, color .1s",
    cursor: "pointer",
    fontFamily: "inherit",
    borderBottom: "1px solid #f0edf8",
  },
  flyoutItemActive: {
    background: "#ede9fe",
    color: "#7c3aed",
    fontWeight: 600,
  },
};
