import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

// Auth pages
import SignIn  from "./pages/auth/SignIn";
import SignUp  from "./pages/auth/SignUp";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// Broker pages
import BrokerList   from "./pages/broker/BrokerList";
import BrokerCreate from "./pages/broker/BrokerCreate";
import BrokerEdit   from "./pages/broker/BrokerEdit";
import BrokerView   from "./pages/broker/BrokerView";

// IC pages
import ICList        from "./pages/ic/ICList";
import ICCreate      from "./pages/ic/ICCreate";
import ICEdit        from "./pages/ic/ICEdit";
import ICIntegration from "./pages/ic/ICIntegration";

// Agent pages
import AgentList       from "./pages/agent/AgentList";
import AgentCreate     from "./pages/agent/AgentCreate";
import AgentEdit       from "./pages/agent/AgentEdit";
import AgentProfile    from "./pages/agent/AgentProfile";
import AgentCommission from "./pages/agent/AgentCommission";

// Customer pages
import CustomerList    from "./pages/customer/CustomerList";
import CustomerCreate  from "./pages/customer/CustomerCreate";
import CustomerEdit    from "./pages/customer/CustomerEdit";
import CustomerProfile from "./pages/customer/CustomerProfile";
import Customer360     from "./pages/customer/Customer360";
import KYCReview      from "./pages/customer/KYCReview";

// Product pages
import ProductList   from "./pages/product/ProductList";
import ProductCreate from "./pages/product/ProductCreate";
import ProductEdit   from "./pages/product/ProductEdit";

// Campaign pages
import CampaignList   from "./pages/campaign/CampaignList";
import CampaignCreate from "./pages/campaign/CampaignCreate";
import CampaignEdit   from "./pages/campaign/CampaignEdit";

// Policy pages
import PolicyList from "./pages/policy/PolicyList";
import BuyPolicy  from "./pages/policy/BuyPolicy";

// Organisation pages
import OrganisationList from "./pages/organisation/OrganisationList";
import OrganisationEdit from "./pages/organisation/OrganisationEdit";
import { OrganisationProvider } from "./pages/organisation/OrganisationContext";

// Association pages
import AssociationList from "./pages/association/AssociationList";
import AssociationEdit from "./pages/association/AssociationEdit";
import { AssociationProvider } from "./pages/association/AssociationContext";

// CRM
import CrmPage from "./pages/crm/CrmPage";
import Reports        from "./pages/reports/Reports";
import Reconciliation from "./pages/reconciliation/Reconciliation";
import UpdatePayment   from "./pages/payment/UpdatePayment";
import ExtractPayments from "./pages/payment/ExtractPayments";
import AcceptCheque    from "./pages/payment/AcceptCheque";

// Portals
import BrokerPortal    from "./pages/portal/BrokerPortal";
import AgentPortal     from "./pages/portal/AgentPortal";
import CustomerPortal  from "./pages/portal/CustomerPortal";
import PolicyCatalogue from "./pages/portal/PolicyCatalogue";

function ProfileView() {
  const { user } = useAuth();
  if (user?.role === 'agent')    return <AgentProfile />;
  if (user?.role === 'customer') return <CustomerProfile />;
  return <BrokerView />;
}

function ProfileEdit() {
  const { user } = useAuth();
  if (user?.role === 'agent')    return <AgentEdit />;
  if (user?.role === 'customer') return <CustomerEdit />;
  return <BrokerEdit />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <OrganisationProvider>
      <AssociationProvider>
      <CustomerProvider>
        <Routes>
          {/* ── Public auth routes (no sidebar/topbar) ── */}
          <Route path="/login"    element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />

          {/* ── Protected routes (require login) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* ── PORTALS (role-specific home) ── */}
              <Route element={<RoleGuard roles={['broker']} />}>
                <Route path="broker-portal" element={<BrokerPortal />} />
              </Route>
              <Route element={<RoleGuard roles={['agent']} />}>
                <Route path="agent-portal" element={<AgentPortal />} />
              </Route>
              <Route element={<RoleGuard roles={['customer']} />}>
                <Route path="customer-portal" element={<CustomerPortal />} />
                <Route path="policy-catalogue" element={<PolicyCatalogue />} />
              </Route>

              {/* ── DASHBOARD (all roles) ── */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* ── PROFILE (role-aware) ── */}
              <Route path="profile">
                <Route index element={<ProfileView />} />
                <Route path="edit" element={<ProfileEdit />} />
              </Route>

              {/* ── POLICY (all roles, scoped in component) ── */}
              <Route path="policy">
                <Route index element={<PolicyList />} />
                <Route path="buy" element={<BuyPolicy />} />
              </Route>

              {/* ── CUSTOMER (broker + agent only) ── */}
              <Route element={<RoleGuard roles={['broker', 'agent']} />}>
                <Route path="customer">
                  <Route index element={<CustomerList />} />
                  <Route path="create" element={<CustomerCreate />} />
                  <Route path=":id/edit" element={<CustomerEdit />} />
                  <Route path=":id/360" element={<Customer360 />} />
                  <Route path=":id/kyc" element={<KYCReview />} />
                </Route>
                <Route path="crm">
                  <Route index element={<CrmPage />} />
                </Route>
              </Route>

              {/* ── AGENT commission (agent can see own commission) ── */}
              <Route element={<RoleGuard roles={['broker', 'agent']} />}>
                <Route path="agent/commission" element={<AgentCommission />} />
              </Route>

              {/* ── BROKER-ONLY routes ── */}
              <Route element={<RoleGuard roles={['broker']} />}>
                <Route path="agent">
                  <Route index element={<AgentList />} />
                  <Route path="create" element={<AgentCreate />} />
                  <Route path=":id/edit" element={<AgentEdit />} />
                </Route>

                <Route path="organisation">
                  <Route index element={<OrganisationList />} />
                  <Route path="create" element={<OrganisationEdit />} />
                  <Route path=":id/edit" element={<OrganisationEdit />} />
                </Route>

                <Route path="association">
                  <Route index element={<AssociationList />} />
                  <Route path="create" element={<AssociationEdit />} />
                  <Route path=":id/edit" element={<AssociationEdit />} />
                </Route>

                <Route path="product">
                  <Route index element={<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path=":id/edit" element={<ProductEdit />} />
                </Route>

                <Route path="campaign">
                  <Route index element={<CampaignList />} />
                  <Route path="create" element={<CampaignCreate />} />
                  <Route path=":id/edit" element={<CampaignEdit />} />
                </Route>

                <Route path="ic">
                  <Route index element={<ICList />} />
                  <Route path="create" element={<ICCreate />} />
                  <Route path=":id/edit" element={<ICEdit />} />
                  <Route path=":id/integration" element={<ICIntegration />} />
                </Route>

                <Route path="broker">
                  <Route index element={<BrokerList />} />
                  <Route path="create" element={<BrokerCreate />} />
                  <Route path=":id" element={<BrokerView />} />
                  <Route path=":id/edit" element={<BrokerEdit />} />
                </Route>

                <Route path="reports"         element={<Reports />} />
                <Route path="reconciliation" element={<Reconciliation />} />
                <Route path="update-payment"  element={<UpdatePayment />} />
                <Route path="accept-cheque"    element={<AcceptCheque />} />
                <Route path="extract-payments" element={<ExtractPayments />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CustomerProvider>
      </AssociationProvider>
      </OrganisationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
