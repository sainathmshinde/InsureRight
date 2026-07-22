import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import kmdLogo from "../assets/kmd-logo.svg";
import {
  DashboardIcon,
  UserIcon,
  AgentIcon,
  MemberIcon,
  ProductIcon,
  PolicyIcon,
  CampaignIcon,
  CRMIcon,
  InsuranceCompanyIcon,
  LogoutIcon,
  ReportIcon,
  DocumentIcon,
  BankIcon,
  GroupIcon,
} from "../icons";
import { useAuth } from "../context/AuthContext";

const BROKER_NAV = [
  {
    key: "broker-portal",
    label: "Dashboard",
    icon: DashboardIcon,
    children: [{ label: "Overview", path: "/broker-portal" }],
  },
  {
    key: "product",
    label: "Products",
    icon: ProductIcon,
    children: [
      { label: "Product Catalogue", path: "/product" },
      { label: "Add Product", path: "/product/create" },
    ],
  },
  {
    key: "organisation",
    label: "Organisations",
    icon: BankIcon,
    children: [
      { label: "All Organisations", path: "/organisation" },
      { label: "Add Organisation", path: "/organisation/create" },
    ],
  },
  {
    key: "association",
    label: "Associations",
    icon: GroupIcon,
    children: [
      { label: "All Associations", path: "/association" },
      { label: "Add Association", path: "/association/create" },
    ],
  },
  {
    key: "member",
    label: "Members",
    icon: MemberIcon,
    children: [
      { label: "All Members", path: "/member" },
      { label: "Add Member", path: "/member/create" },
    ],
  },
  {
    key: "agent",
    label: "Operators",
    icon: AgentIcon,
    children: [
      { label: "All Operators", path: "/agent" },
      { label: "Add Operator", path: "/agent/create" },
    ],
  },
  {
    key: "campaign",
    label: "Campaign",
    icon: CampaignIcon,
    children: [
      { label: "All Campaigns", path: "/campaign" },
      { label: "Add Campaign", path: "/campaign/create" },
    ],
  },
  {
    key: "reconciliation",
    label: "Reconciliation",
    icon: DocumentIcon,
    children: [
      { label: "Receive Cheque", path: "/accept-cheque" },
      { label: "Update Payment", path: "/update-payment" },
      { label: "Reconcile Data", path: "/reconciliation" },
      { label: "Refund", path: "/refund" },
    ],
  },
  {
    key: "policy",
    label: "Policy Issuance",
    icon: PolicyIcon,
    children: [{ label: "Policies", path: "/policy" }],
  },
  {
    key: "crm",
    label: "CRM",
    icon: CRMIcon,
    children: [{ label: "CRM", path: "/crm" }],
  },
  {
    key: "reports",
    label: "Reports",
    icon: ReportIcon,
    children: [{ label: "All Reports", path: "/reports" }],
  },
  {
    key: "ic",
    label: "Insurance Co.",
    icon: InsuranceCompanyIcon,
    children: [
      { label: "IC Master", path: "/ic" },
      { label: "Add IC", path: "/ic/create" },
    ],
  },
];

const AGENT_NAV = [
  {
    key: "agent-portal",
    label: "Dashboard",
    icon: DashboardIcon,
    children: [{ label: "Overview", path: "/agent-portal" }],
  },
  {
    key: "profile",
    label: "My Profile",
    icon: UserIcon,
    children: [
      { label: "View Profile", path: "/profile" },
      { label: "Edit Profile", path: "/profile/edit" },
    ],
  },
  {
    key: "member",
    label: "My Members",
    icon: MemberIcon,
    children: [
      { label: "All Members", path: "/member" },
      { label: "Add Member", path: "/member/create" },
    ],
  },
  {
    key: "policy",
    label: "Policy",
    icon: PolicyIcon,
    children: [{ label: "Policy Issuance", path: "/policy" }],
  },
  {
    key: "crm",
    label: "CRM",
    icon: CRMIcon,
    children: [{ label: "CRM", path: "/crm" }],
  },
];

const MEMBER_NAV = [
  {
    key: "member-portal",
    label: "Dashboard",
    icon: DashboardIcon,
    children: [{ label: "Overview", path: "/member-portal" }],
  },
  {
    key: "profile",
    label: "My Profile",
    icon: UserIcon,
    children: [
      { label: "View Profile", path: "/profile" },
      { label: "Edit Profile", path: "/profile/edit" },
    ],
  },
  {
    key: "policy",
    label: "My Policies",
    icon: PolicyIcon,
    children: [{ label: "View Policies", path: "/policy" }],
  },
  {
    key: "policy-catalogue",
    label: "Buy Insurance",
    icon: ProductIcon,
    children: [{ label: "Buy Insurance Policy", path: "/policy/buy" }],
  },
];

const EXPANDED_W = 230;
const COLLAPSED_W = 62;

export default function Sidebar({ mobileOpen = false, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const activeNav =
    user?.role === "agent"
      ? AGENT_NAV
      : user?.role === "member"
        ? MEMBER_NAV
        : BROKER_NAV;

  // Precise match against each item's own child routes — avoids "policy" matching
  // "/policy-catalogue" etc, and correctly handles items whose children don't share
  // the parent's key prefix (e.g. Reconciliation's Receive Cheque / Update Payment / Refund).
  const matchesNav = (pathname, item) =>
    item.children.some(
      (c) => pathname === c.path || pathname.startsWith(c.path + "/"),
    );

  const [collapsed, setCollapsed] = useState(false);
  const [openKey, setOpenKey] = useState(
    () =>
      activeNav.find((n) => matchesNav(location.pathname, n))?.key ??
      activeNav[0]?.key,
  );
  const [hoveredKey, setHoveredKey] = useState(null);
  const leaveTimer = useRef(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    // Auto-expand the matching section and close mobile drawer on route change
    const match = activeNav.find((n) => matchesNav(location.pathname, n));
    if (match) setOpenKey(match.key);
    setHoveredKey(null);
    if (onMobileClose) onMobileClose();
  }, [location.pathname]);

  const toggle = () => {
    setCollapsed((c) => !c);
    setHoveredKey(null);
  };
  const handleParentClick = (key) => {
    if (collapsed) return;
    setOpenKey((p) => (p === key ? null : key));
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials =
    user?.avatar ||
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    "U";

  return (
    <>
      <style>{`
        @keyframes flyIn { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        .sb-child:hover  { background:#eef5ff !important; color:#1565d8 !important; }
        .sb-fly:hover    { background:#eef5ff !important; color:#1565d8 !important; }
        .sb-toggle:hover { background:#e7f0fc !important; }
        .sb-nav:not(.sb-active):hover { background:#eef5ff !important; }
        .sb-logout:hover { background:#fef2f2 !important; color:#dc2626 !important; }
      `}</style>

      <aside
        className={`sidebar-root${mobileOpen ? " mobile-open" : ""}`}
        style={{ ...S.aside, width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      >
        {/* â”€â”€ Logo â”€â”€ */}
        <div
          style={{
            ...S.logoRow,
            justifyContent: collapsed ? "center" : "space-between",
            padding: collapsed ? 0 : "0 16px 0 18px",
          }}
        >
          {!collapsed && (
            <img
              src={kmdLogo}
              alt="KMD"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
          )}
          {/* Desktop collapse toggle; on mobile show a close Ã— instead */}
          {mobileOpen ? (
            <button
              className="sb-toggle"
              style={S.toggleBtn}
              onClick={onMobileClose}
              title="Close"
            >
              <CloseIcon />
            </button>
          ) : (
            <button
              className="sb-toggle"
              style={S.toggleBtn}
              onClick={toggle}
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed ? <IconExpand /> : <IconCollapse />}
            </button>
          )}
        </div>

        {/* â”€â”€ Nav â”€â”€ */}
        <nav style={{ ...S.nav, alignItems: collapsed ? "center" : "stretch" }}>
          {activeNav.map((item) => {
            const Icon = item.icon;
            const moduleActive = matchesNav(location.pathname, item);
            const isOpen = !collapsed && openKey === item.key;
            const flyOpen = collapsed && hoveredKey === item.key;

            return (
              <div
                key={item.key}
                style={{ position: "relative", width: "100%" }}
                onMouseEnter={() => onEnter(item.key)}
                onMouseLeave={onLeave}
              >
                <button
                  className={`sb-nav${moduleActive ? " sb-active" : ""}`}
                  style={{
                    ...S.navBtn,
                    ...(collapsed ? S.navBtnCollapsed : {}),
                    ...(moduleActive ? S.navBtnActive : {}),
                  }}
                  onClick={() => handleParentClick(item.key)}
                  title={collapsed ? item.label : undefined}
                >
                  <span style={S.iconWrap}>
                    <Icon size={19} color={moduleActive ? "#fff" : "#374151"} />
                  </span>
                  {!collapsed && (
                    <>
                      <span style={S.label}>{item.label}</span>
                      <span
                        style={{
                          ...S.chevron,
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                          color: moduleActive
                            ? "rgba(255,255,255,0.7)"
                            : "var(--brand-mid)",
                        }}
                      >
                        <ChevronRight />
                      </span>
                    </>
                  )}
                  {collapsed && moduleActive && <span style={S.pip} />}
                </button>

                {/* Inline sub-menu */}
                {isOpen && (
                  <div style={S.children}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={child.path === "/" + item.key}
                        className="sb-child"
                        style={({ isActive }) => ({
                          ...S.child,
                          ...(isActive ? S.childActive : {}),
                        })}
                      >
                        <span
                          style={{
                            ...S.dot,
                            background:
                              location.pathname === child.path
                                ? "var(--brand)"
                                : "var(--brand-mid)",
                          }}
                        />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* Flyout (collapsed) */}
                {flyOpen && (
                  <div
                    style={S.flyout}
                    onMouseEnter={keepOpen}
                    onMouseLeave={onLeave}
                  >
                    <div style={S.flyoutHead}>
                      <Icon size={13} color="#374151" />
                      <span>{item.label}</span>
                    </div>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={child.path === "/" + item.key}
                        className="sb-fly"
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

        {/* â”€â”€ Logout button â”€â”€ */}
        <div style={S.logoutWrap}>
          <button
            className="sb-logout"
            style={{
              ...S.logoutBtn,
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onClick={handleLogout}
            title="Sign Out"
          >
            <LogoutIcon size={17} color="#dc2626" />
            {!collapsed && (
              <span style={{ marginLeft: 9, fontSize: 14, fontWeight: 500 }}>
                Sign Out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

function ChevronRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#374151"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconCollapse() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#374151"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="14" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <polyline points="17 9 21 12 17 15" />
    </svg>
  );
}
function IconExpand() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#374151"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="14" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <polyline points="21 9 17 12 21 15" />
    </svg>
  );
}

const S = {
  aside: {
    minHeight: "100vh",
    background: "#fff",
    borderRight: "1.5px solid #dee1e5",
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
    height: "var(--topbar-h,58px)",
    display: "flex",
    alignItems: "center",
    borderBottom: "1.5px solid #dee1e5",
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
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 7,
    border: "1.5px solid #dee1e5",
    background: "#f5f6fa",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background .15s",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderBottom: "1px solid #eef1f5",
    background: "#f5f6fa",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "var(--grad-purple)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1628",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: { fontSize: 11, color: "#64748b", textTransform: "capitalize" },
  nav: {
    padding: "8px 8px",
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
    fontSize: 15,
    fontWeight: 500,
    color: "#1a1628",
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    transition: "background .13s,color .13s",
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
    background: "var(--grad-purple)",
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
  label: { flex: 1, fontSize: 15 },
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
    fontSize: 14,
    color: "#5c5573",
    textDecoration: "none",
    transition: "background .12s,color .12s",
  },
  childActive: { background: "var(--brand-light)", color: "var(--brand)", fontWeight: 600 },
  dot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background .15s",
  },
  flyout: {
    position: "absolute",
    left: "calc(100% + 10px)",
    top: 0,
    minWidth: 196,
    background: "#fff",
    border: "1.5px solid #dee1e5",
    borderRadius: 12,
    boxShadow: "0 8px 28px rgba(21,101,216,.14),0 2px 8px rgba(0,0,0,.06)",
    zIndex: 300,
    overflow: "hidden",
    animation: "flyIn .15s ease",
  },
  flyoutHead: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 14px 9px",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--brand)",
    textTransform: "uppercase",
    letterSpacing: ".6px",
    borderBottom: "1px solid #dee1e5",
    background: "#f5f6fa",
  },
  flyoutItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    fontSize: 15,
    color: "#1a1628",
    textDecoration: "none",
    transition: "background .1s,color .1s",
    cursor: "pointer",
    fontFamily: "inherit",
    borderBottom: "1px solid #eef1f5",
  },
  flyoutItemActive: {
    background: "var(--brand-light)",
    color: "var(--brand)",
    fontWeight: 600,
  },
  logoutWrap: { borderTop: "1.5px solid #dee1e5", padding: "10px 10px" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "none",
    background: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background .12s,color .12s",
    color: "#dc2626",
  },
};
