// icons/index.jsx
// ─────────────────────────────────────────────────────────────────────────────
// All InsureRight icons as React SVG components.
// Usage:  import { HealthIcon, PolicyIcon } from './icons'
//         <HealthIcon size={24} color="#7c3aed" />
// ─────────────────────────────────────────────────────────────────────────────

const I = ({
  size = 20,
  color = "currentColor",
  children,
  viewBox = "0 0 24 24",
}) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

// ── MODULE ICONS ─────────────────────────────────────────────────────────────

export const BrokerIcon = (p) => (
  <I {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="10" y1="14" x2="14" y2="14" />
  </I>
);

export const InsuranceCompanyIcon = (p) => (
  <I {...p}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </I>
);

export const AgentIcon = (p) => (
  <I {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </I>
);

export const MemberIcon = (p) => (
  <I {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </I>
);

export const ProductIcon = (p) => (
  <I {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </I>
);

export const PolicyIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </I>
);

export const CampaignIcon = (p) => (
  <I {...p}>
    <path d="m3 11 18-5v12L3 13v-2z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </I>
);

export const DashboardIcon = (p) => (
  <I {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </I>
);

export const CRMIcon = (p) => (
  <I {...p}>
    <path d="M16 18a4 4 0 0 0-8 0" />
    <circle cx="12" cy="11" r="3" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="8" y1="2" x2="8" y2="4" />
    <line x1="16" y1="2" x2="16" y2="4" />
  </I>
);

export const IntegrationIcon = (p) => (
  <I {...p}>
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M6 21V9a9 9 0 0 0 9 9" />
  </I>
);

export const AdminIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  </I>
);

export const ReportIcon = (p) => (
  <I {...p}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </I>
);

// ── INSURANCE TYPE ICONS ──────────────────────────────────────────────────────

export const HealthIcon = (p) => (
  <I {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </I>
);

export const MotorIcon = (p) => (
  <I {...p}>
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </I>
);

export const LifeIcon = (p) => (
  <I {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </I>
);

export const TravelIcon = (p) => (
  <I {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12" />
    <path d="M5.46 5.11A19.5 19.5 0 0 1 12 2a19.79 19.79 0 0 1 8.63 3.07" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </I>
);

export const HomeInsuranceIcon = (p) => (
  <I {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
    <path d="M12 7h.01" />
  </I>
);

export const FireIcon = (p) => (
  <I {...p}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </I>
);

export const CropIcon = (p) => (
  <I {...p}>
    <path d="M12 22V12" />
    <path d="M2 17l10-5 10 5" />
    <path d="M2 12l10-5 10 5" />
    <path d="M2 7l10-5 10 5" />
  </I>
);

export const MarineIcon = (p) => (
  <I {...p}>
    <path d="M2 20h20" />
    <path d="M5 20V10l7-7 7 7v10" />
    <path d="M9 20v-6h6v6" />
  </I>
);

export const LiabilityIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </I>
);

export const GroupIcon = (p) => (
  <I {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </I>
);

// ── KYC & COMPLIANCE ICONS ────────────────────────────────────────────────────

export const KYCIcon = (p) => (
  <I {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="12" r="2" />
    <path d="M12 11h6M12 13h4" />
  </I>
);

export const AadhaarIcon = (p) => (
  <I {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="8.5" cy="12" r="2.5" />
    <path d="M14 9h4M14 12h4M14 15h2" />
    <path d="M6 19c0-1.4 1.1-2.5 2.5-2.5S11 17.6 11 19" />
  </I>
);

export const PANIcon = (p) => (
  <I {...p}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M7 15V9h2a2 2 0 0 1 0 4H7" />
    <path d="M13 9v6M13 9h3a1.5 1.5 0 0 1 0 3h-3m0 0h3a1.5 1.5 0 0 1 0 3h-3" />
  </I>
);

export const VerifiedIcon = (p) => (
  <I {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </I>
);

export const ShieldIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </I>
);

export const ShieldCheckIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </I>
);

export const ComplianceIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </I>
);

// ── PAYMENT & BANKING ICONS ───────────────────────────────────────────────────

export const PaymentIcon = (p) => (
  <I {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </I>
);

export const UPIIcon = (p) => (
  <I {...p}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </I>
);

export const BankIcon = (p) => (
  <I {...p}>
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </I>
);

export const WalletIcon = (p) => (
  <I {...p}>
    <path d="M20 12V22H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14v4" />
    <path d="M20 12a2 2 0 0 0-2-2h-2a2 2 0 0 0 0 4h2a2 2 0 0 0 2-2z" />
  </I>
);

export const ChequeIcon = (p) => (
  <I {...p}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <line x1="6" y1="10" x2="10" y2="10" />
    <line x1="6" y1="14" x2="18" y2="14" />
    <line x1="14" y1="10" x2="18" y2="10" />
  </I>
);

export const CommissionIcon = (p) => (
  <I {...p}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </I>
);

export const PremiumIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4l3 3" />
  </I>
);

export const SumInsuredIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </I>
);

// ── POLICY LIFECYCLE ICONS ────────────────────────────────────────────────────

export const ProposalIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <line x1="9" y1="15" x2="15" y2="15" />
  </I>
);

export const IssuanceIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <polyline points="9 15 11 17 15 13" />
  </I>
);

export const RenewalIcon = (p) => (
  <I {...p}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </I>
);

export const EndorsementIcon = (p) => (
  <I {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </I>
);

export const ClaimIcon = (p) => (
  <I {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </I>
);

export const DownloadPolicyIcon = (p) => (
  <I {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </I>
);

export const ExpiryIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </I>
);

export const WaitingPeriodIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 9 15" />
    <line x1="15" y1="6" x2="15" y2="9" />
  </I>
);

// ── COMMUNICATION ICONS ───────────────────────────────────────────────────────

export const SMSIcon = (p) => (
  <I {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="9.01" y2="10" />
    <line x1="12" y1="10" x2="12.01" y2="10" />
    <line x1="15" y1="10" x2="15.01" y2="10" />
  </I>
);

export const WhatsAppIcon = (p) => (
  <I {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </I>
);

export const EmailIcon = (p) => (
  <I {...p}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </I>
);

export const NotificationIcon = (p) => (
  <I {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </I>
);

export const CallIcon = (p) => (
  <I {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </I>
);

export const ReminderIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
    <path d="M7.5 17l1-1" />
  </I>
);

// ── GENERAL UI ICONS ──────────────────────────────────────────────────────────

export const SearchIcon = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </I>
);

export const FilterIcon = (p) => (
  <I {...p}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </I>
);

export const AddIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </I>
);

export const EditIcon = (p) => (
  <I {...p}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </I>
);

export const DeleteIcon = (p) => (
  <I {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </I>
);

export const ViewIcon = (p) => (
  <I {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </I>
);

export const CartIcon = (p) => (
  <I {...p}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </I>
);

export const UploadIcon = (p) => (
  <I {...p}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </I>
);

export const DocumentIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </I>
);

export const BackIcon = (p) => (
  <I {...p}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </I>
);

export const ChevronRightIcon = (p) => (
  <I {...p}>
    <polyline points="9 18 15 12 9 6" />
  </I>
);

export const ChevronDownIcon = (p) => (
  <I {...p}>
    <polyline points="6 9 12 15 18 9" />
  </I>
);

export const MenuIcon = (p) => (
  <I {...p}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </I>
);

export const CloseIcon = (p) => (
  <I {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </I>
);

export const CheckIcon = (p) => (
  <I {...p}>
    <polyline points="20 6 9 17 4 12" />
  </I>
);

export const InfoIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </I>
);

export const WarningIcon = (p) => (
  <I {...p}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </I>
);

export const LogoutIcon = (p) => (
  <I {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </I>
);

export const SettingsIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </I>
);

export const UserIcon = (p) => (
  <I {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </I>
);

export const LocationIcon = (p) => (
  <I {...p}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </I>
);

export const CalendarIcon = (p) => (
  <I {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </I>
);

export const APIIcon = (p) => (
  <I {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </I>
);

export const WebhookIcon = (p) => (
  <I {...p}>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.68-2.23 1.61a2.99 2.99 0 0 1-2.91 2.23H6" />
    <path d="M18 7A3 3 0 0 0 15 4a3 3 0 0 0-3 3 9 9 0 0 0 9 9" />
    <path d="M9 7a3 3 0 0 1 3-3 3 3 0 0 1 3 3 9 9 0 0 1-9 9" />
  </I>
);

export const RetryIcon = (p) => (
  <I {...p}>
    <path d="M21.5 2v6h-6" />
    <path d="M2.5 12a10 10 0 0 1 17.01-7.09L21.5 8" />
    <path d="M2.5 22v-6h6" />
    <path d="M21.5 12a10 10 0 0 1-17.01 7.09L2.5 16" />
  </I>
);

export const FamilyIcon = (p) => (
  <I {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </I>
);

export const NomineeIcon = (p) => (
  <I {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </I>
);

export const GSTIcon = (p) => (
  <I {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9.5 9a2.5 2.5 0 0 1 5 0v.5" />
    <path d="M7 14.5h10" />
  </I>
);

export const LicenseIcon = (p) => (
  <I {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <circle cx="12" cy="14" r="2" />
    <path d="M9 19h6" />
  </I>
);

export const AgreementIcon = (p) => (
  <I {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M8 13h8M8 17h5" />
    <polyline points="9 10 8 10 8 10" />
  </I>
);

export const StatusActiveIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-5" />
  </I>
);

export const StatusInactiveIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="8" x2="16" y2="16" />
    <line x1="16" y1="8" x2="8" y2="16" />
  </I>
);

export const TargetIcon = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </I>
);

export const FunnelIcon = (p) => (
  <I {...p}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </I>
);

export const TenantIcon = (p) => (
  <I {...p}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <rect x="9" y="14" width="6" height="8" />
  </I>
);

export const SubscriptionIcon = (p) => (
  <I {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M12 22V12M3.27 6.96L12 12l8.73-5.04" />
  </I>
);

export const FeatureToggleIcon = (p) => (
  <I {...p}>
    <rect x="1" y="5" width="22" height="14" rx="7" ry="7" />
    <circle cx="16" cy="12" r="3" />
  </I>
);

export const AnalyticsIcon = (p) => (
  <I {...p}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <path d="M3 20h18" />
  </I>
);

export const RefundIcon = (p) => (
  <I {...p}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <path d="M15 11h-4.5a1.5 1.5 0 0 0 0 3H13a1.5 1.5 0 0 1 0 3H9" />
  </I>
);
