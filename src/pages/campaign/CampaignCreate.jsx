import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Field,
  Input,
  DateInput,
  Textarea,
  SectionBlock,
} from "../../components/Field";
import {
  PageHeader,
  FormActions,
  CheckboxGroup,
} from "../../components/UI";
import { CampaignIcon } from "../../icons";
import {
  ProductMappingSection,
  CampaignDiscountSection,
  AudienceSection,
  PromoCreativeSection,
  CampaignPreviewModal,
  toggleProductWithLinks,
} from "./campaignShared";
import { fileToDataUrl, savePromoCampaign } from "./campaignStore";

const INITIAL = {
  name: "",
  policyType: "",
  startDate: "",
  endDate: "",
  segment: "ALL",
  salesPersonId: "",
  ageMin: "",
  ageMax: "",
  state: "",
  selectedProducts: [],
  selectedAssociations: [],
  discountRules: "",
  offerType: "Flat",
  offerValue: "",
  channels: [],
  messageTemplate: "",
  whatsappTemplateId: "",
  campaignImage: null,
  clickTracking: false,
  conversionTracking: false,
  // Health config
  hSumInsuredMin: "",
  hSumInsuredMax: "",
  hWaitingPeriod: "30",
  hPreExistingWaiting: "24",
  hRoomRent: "",
  hDayCare: false,
  hRestoration: false,
  hAyush: false,
  // Motor config
  mVehicleType: "",
  mIdvMin: "",
  mIdvMax: "",
  mZeroDepreciation: false,
  mEngineProtection: false,
  mNcbPct: "",
  // Life config
  lPolicyTerm: "",
  lPaymentTerm: "",
  lDeathBenefitType: "",
  lLoan: false,
  lReturnOfPremium: false,
  // Financial
  premiumMin: "",
  premiumMax: "",
  commissionPct: "",
  targetPremiumVolume: "",
  gstRate: "18",
};

const toInputDate = (v) => {
  if (!v) return "";
  const [dd, mm, yyyy] = v.split("/");
  return `${yyyy}-${mm}-${dd}`;
};
const fromInputDate = (v) => {
  if (!v) return "";
  const [yyyy, mm, dd] = v.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setDate = (f) => (e) =>
    setForm((p) => ({ ...p, [f]: fromInputDate(e.target.value) }));

  const startDateISO = toInputDate(form.startDate);
  const endDateISO = toInputDate(form.endDate);
  const dateError =
    startDateISO && endDateISO && endDateISO < startDateISO
      ? "End date cannot be before start date"
      : "";

  const [assignedCalling, setAssignedCalling] = useState(new Set());
  const [assignedSales, setAssignedSales] = useState(new Set());
  const toggleCalling = (id) =>
    setAssignedCalling((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleSales = (id) =>
    setAssignedSales((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const toggleProduct = (id) =>
    setForm((prev) => ({
      ...prev,
      selectedProducts: toggleProductWithLinks(prev.selectedProducts, id),
    }));

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateError) return;
    setPreviewOpen(true);
  };

  const handleConfirmCreate = async () => {
    console.log("Create Campaign:", form, {
      assignedCalling: [...assignedCalling],
      assignedSales: [...assignedSales],
    });
    const campaignImage =
      form.campaignImage instanceof File
        ? await fileToDataUrl(form.campaignImage)
        : null;
    savePromoCampaign({
      id: Date.now(),
      name: form.name,
      selectedProducts: form.selectedProducts,
      offerType: form.offerType,
      offerValue: form.offerValue,
      campaignImage,
      isActive: true,
      startDate: startDateISO,
      endDate: endDateISO,
      segment: form.segment,
      selectedAssociations: form.selectedAssociations,
    });
    navigate("/campaign");
  };

  return (
    <div>
      <PageHeader
        icon={<CampaignIcon />}
        title="Add Campaign"
        subtitle="Set up a new marketing campaign"
      >
        <button className="btn btn-ghost" onClick={() => navigate("/campaign")}>
          ← Back
        </button>
      </PageHeader>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon="📢" title="Campaign Information">
              <div className="form-grid-3">
                <Field label="Campaign Name" required>
                  <Input
                    placeholder="e.g. Summer Health Drive 2025"
                    value={form.name}
                    onChange={set("name")}
                    required
                  />
                </Field>
                <Field label="Start Date" required>
                  <DateInput
                    value={startDateISO}
                    onChange={setDate("startDate")}
                    required
                  />
                </Field>
                <Field label="End Date" required>
                  <DateInput
                    value={endDateISO}
                    onChange={setDate("endDate")}
                    min={startDateISO || undefined}
                    required
                  />
                  {dateError && <div className="field-error-text">{dateError}</div>}
                </Field>
              </div>
            </SectionBlock>

            <ProductMappingSection form={form} toggleProduct={toggleProduct} />

            <CampaignDiscountSection form={form} set={set} />

            <AudienceSection form={form} setForm={setForm} />

            <SectionBlock icon="📡" title="Communication Channels">
              <Field label="Active Channels">
                <div style={{ paddingTop: 6 }}>
                  <CheckboxGroup
                    options={[
                      "SMS",
                      "WhatsApp (Meta API)",
                      "Email",
                      "App Notification",
                    ]}
                    selected={form.channels}
                    onChange={(v) => setForm((p) => ({ ...p, channels: v }))}
                  />
                </div>
              </Field>
            </SectionBlock>

            <SectionBlock icon="✍️" title="Message Content">
              <div className="form-grid-3">
                <Field
                  label="Message Template"
                  required={form.channels.length > 0}
                >
                  <Textarea
                    placeholder="Hi {member_name}, your health cover from {ic_name} is due for renewal…"
                    value={form.messageTemplate}
                    onChange={set("messageTemplate")}
                    style={{ minHeight: 100 }}
                  />
                </Field>
                <Field label="WhatsApp Template ID">
                  <Input
                    placeholder="e.g. summer_health_v1"
                    value={form.whatsappTemplateId}
                    onChange={set("whatsappTemplateId")}
                    disabled={!form.channels.includes("WhatsApp (Meta API)")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <PromoCreativeSection form={form} setForm={setForm} />

            <FormActions
              onCancel={() => navigate("/campaign")}
              submitLabel="Preview Campaign"
            />
          </form>
        </div>
      </div>

      {previewOpen && (
        <CampaignPreviewModal
          form={form}
          setForm={setForm}
          assignedCalling={assignedCalling}
          assignedSales={assignedSales}
          onBack={() => setPreviewOpen(false)}
          onConfirm={handleConfirmCreate}
          confirmLabel="Create Campaign"
        />
      )}
    </div>
  );
}
