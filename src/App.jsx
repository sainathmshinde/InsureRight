import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Broker pages
import BrokerList from "./pages/broker/BrokerList";
import BrokerCreate from "./pages/broker/BrokerCreate";
import BrokerEdit from "./pages/broker/BrokerEdit";
import BrokerView from "./pages/broker/BrokerView";

// IC pages
import ICList from "./pages/ic/ICList";
import ICCreate from "./pages/ic/ICCreate";
import ICEdit from "./pages/ic/ICEdit";
import ICIntegration from "./pages/ic/ICIntegration";

// Agent pages
import AgentList from "./pages/agent/AgentList";
import AgentCreate from "./pages/agent/AgentCreate";
import AgentEdit from "./pages/agent/AgentEdit";
import AgentCommission from "./pages/agent/AgentCommission";

// Customer pages
import CustomerList from "./pages/customer/CustomerList";
import CustomerCreate from "./pages/customer/CustomerCreate";
import CustomerEdit from "./pages/customer/CustomerEdit";
import Customer360 from "./pages/customer/Customer360";

// Campaign pages
import CampaignList from "./pages/campaign/CampaignList";
import CampaignCreate from "./pages/campaign/CampaignCreate";
import CampaignEdit from "./pages/campaign/CampaignEdit";

// Product pages
import ProductList from "./pages/product/ProductList";
import ProductCreate from "./pages/product/ProductCreate";
import ProductEdit from "./pages/product/ProductEdit";

// Policy pages
import PolicyList from "./pages/policy/PolicyList";
import BuyPolicy from "./pages/policy/BuyPolicy";

// CRM pages
import CrmPage from "./pages/crm/CrmPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages share the Layout (Sidebar + Topbar) */}
        <Route path="/" element={<Layout />}>
          {/* Default redirect */}
          <Route index element={<Navigate to="/broker" replace />} />

          {/* ── BROKER ── */}
          <Route path="broker">
            <Route index element={<BrokerList />} />
            <Route path="create" element={<BrokerCreate />} />
            <Route path=":id" element={<BrokerView />} />
            <Route path=":id/edit" element={<BrokerEdit />} />
          </Route>

          {/* ── INSURANCE COMPANY ── */}
          <Route path="ic">
            <Route index element={<ICList />} />
            <Route path="create" element={<ICCreate />} />
            <Route path=":id/edit" element={<ICEdit />} />
            <Route path=":id/integration" element={<ICIntegration />} />
          </Route>

          {/* ── AGENT ── */}
          <Route path="agent">
            <Route index element={<AgentList />} />
            <Route path="create" element={<AgentCreate />} />
            <Route path=":id/edit" element={<AgentEdit />} />
            <Route path="commission" element={<AgentCommission />} />
          </Route>

          {/* ── CUSTOMER ── */}
          <Route path="customer">
            <Route index element={<CustomerList />} />
            <Route path="create" element={<CustomerCreate />} />
            <Route path=":id/edit" element={<CustomerEdit />} />
            <Route path=":id/360" element={<Customer360 />} />
          </Route>

          {/* ── PRODUCT ── */}
          <Route path="product">
            <Route index element={<ProductList />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path=":id/edit" element={<ProductEdit />} />
          </Route>

          {/* ── CAMPAIGN ── */}
          <Route path="campaign">
            <Route index element={<CampaignList />} />
            <Route path="create" element={<CampaignCreate />} />
            <Route path=":id/edit" element={<CampaignEdit />} />
          </Route>

          {/* ── CRM ── */}
          <Route path="crm">
            <Route index element={<CrmPage />} />
          </Route>

          {/* ── POLICY ── */}
          <Route path="policy">
            <Route index element={<PolicyList />} />
            <Route path="buy" element={<BuyPolicy />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/broker" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
