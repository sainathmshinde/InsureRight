import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Toggle,
  CheckboxGroup,
} from "../../components/UI";
import { CampaignIcon } from "../../icons";
import {
  ProductMappingSection,
  CampaignDiscountSection,
  AudienceSection,
  PromoCreativeSection,
  AssignEmployeesSection,
  CampaignPreviewModal,
  toggleProductWithLinks,
} from "./campaignShared";
import { fileToDataUrl, savePromoCampaign } from "./campaignStore";

const BASE = {
  segment: "ALL", salesPersonId: "",
  ageMin: "", ageMax: "", state: "",
  selectedProducts: [], selectedAssociations: [], discountRules: "",
  offerType: "Percent", offerValue: "", channels: [], messageTemplate: "",
  whatsappTemplateId: "", campaignImage: null, clickTracking: false, conversionTracking: false,
  callingIds: [], salesIds: [],
};

const MOCK_DATA = {
  1:  { ...BASE, name: "Campaign 1",                startDate: "2024-09-20", endDate: "2025-07-29", selectedProducts: [42, 48],     callingIds: [2],    salesIds: [1, 5] },
  5:  { ...BASE, name: "Campaign OPD and DIGIT PAYMENT PROTECTION", startDate: "2025-01-31", endDate: "2025-03-31", selectedProducts: [6, 49], callingIds: [4], salesIds: [1] },
  6:  { ...BASE, name: "BPP Campaign",               startDate: "2025-02-19", endDate: "2025-03-24", selectedProducts: [60, 61],     callingIds: [2, 9], salesIds: [8] },
  7:  { ...BASE, name: "Test Campaign",              startDate: "2025-08-03", endDate: "2025-08-29", selectedProducts: [3],          callingIds: [],     salesIds: [1] },
  8:  { ...BASE, name: "SBI_STP_Campaign",           startDate: "2025-09-18", endDate: "2026-03-10", selectedProducts: [42, 38],     callingIds: [4],    salesIds: [5] },
  11: { ...BASE, name: "BPP Campaign_2026-2027",     startDate: "2026-03-16", endDate: "2026-05-31", selectedProducts: [42, 38, 48], callingIds: [2, 9], salesIds: [8] },
  12: { ...BASE, name: "Standalone campaign",        startDate: "2026-02-28", endDate: "2026-04-29", selectedProducts: [38],         callingIds: [2],    salesIds: [1] },
};

const DEFAULT = {
  name: "", startDate: "", endDate: "",
  segment: "ALL", salesPersonId: "", ageMin: "", ageMax: "", state: "",
  selectedProducts: [], selectedAssociations: [],
  discountRules: "", offerType: "Flat", offerValue: "", channels: [],
  messageTemplate: "", whatsappTemplateId: "", campaignImage: null, clickTracking: false,
  conversionTracking: false, callingIds: [], salesIds: [],
};

export default function CampaignEdit() {
  const { id } = useParams();
  // Force a fresh mount when navigating between two campaigns' edit pages —
  // otherwise React Router reuses this component and the form keeps the
  // previous campaign's state since only the :id param changed.
  return <CampaignEditForm key={id} id={id} />;
}

function CampaignEditForm({ id }) {
  const navigate = useNavigate();
  const saved = MOCK_DATA[id] ?? DEFAULT;

  const [form, setForm] = useState(saved);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setBool = (f) => (val) => setForm((p) => ({ ...p, [f]: val }));

  const dateError =
    form.startDate && form.endDate && form.endDate < form.startDate
      ? "End date cannot be before start date"
      : "";

  const [assignedCalling, setAssignedCalling] = useState(new Set(saved.callingIds));
  const [assignedSales, setAssignedSales] = useState(new Set(saved.salesIds));
  const toggleCalling = (aid) =>
    setAssignedCalling((prev) => {
      const n = new Set(prev);
      n.has(aid) ? n.delete(aid) : n.add(aid);
      return n;
    });
  const toggleSales = (aid) =>
    setAssignedSales((prev) => {
      const n = new Set(prev);
      n.has(aid) ? n.delete(aid) : n.add(aid);
      return n;
    });

  const toggleProduct = (pid) =>
    setForm((prev) => ({
      ...prev,
      selectedProducts: toggleProductWithLinks(prev.selectedProducts, pid),
    }));

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateError) return;
    setPreviewOpen(true);
  };

  const handleConfirmUpdate = async () => {
    console.log("Update Campaign:", id, form, {
      assignedCalling: [...assignedCalling],
      assignedSales: [...assignedSales],
    });
    const campaignImage =
      form.campaignImage instanceof File
        ? await fileToDataUrl(form.campaignImage)
        : null;
    savePromoCampaign({
      id: Number(id),
      name: form.name,
      selectedProducts: form.selectedProducts,
      offerType: form.offerType,
      offerValue: form.offerValue,
      campaignImage,
      isActive: true,
      startDate: form.startDate,
      endDate: form.endDate,
      segment: form.segment,
      selectedAssociations: form.selectedAssociations,
    });
    navigate("/campaign");
  };

  return (
    <div>
      <PageHeader
        icon={<CampaignIcon />}
        title="Edit Campaign"
        subtitle="Update campaign settings and content"
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
                  <Input placeholder="Campaign name" value={form.name} onChange={set("name")} required />
                </Field>
                <Field label="Start Date" required>
                  <DateInput value={form.startDate} onChange={set("startDate")} required />
                </Field>
                <Field label="End Date" required>
                  <DateInput
                    value={form.endDate}
                    onChange={set("endDate")}
                    min={form.startDate || undefined}
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
                    options={["SMS", "WhatsApp (Meta API)", "Email", "App Notification"]}
                    selected={form.channels}
                    onChange={(v) => setForm((p) => ({ ...p, channels: v }))}
                  />
                </div>
              </Field>
            </SectionBlock>

            <SectionBlock icon="✍️" title="Message Content">
              <div className="form-grid-3">
                <Field label="Message Template" required={form.channels.length > 0}>
                  <Textarea
                    placeholder="Hi {member_name}, your health cover from {ic_name} is due for renewal…"
                    value={form.messageTemplate}
                    onChange={set("messageTemplate")}
                    style={{ minHeight: 100 }}
                  />
                </Field>
                <Field label="WhatsApp Template ID">
                  <Input placeholder="e.g. summer_health_v1" value={form.whatsappTemplateId} onChange={set("whatsappTemplateId")} disabled={!form.channels.includes("WhatsApp (Meta API)")} />
                </Field>
              </div>
            </SectionBlock>

            <PromoCreativeSection form={form} setForm={setForm} />

            <AssignEmployeesSection
              assignedCalling={assignedCalling}
              assignedSales={assignedSales}
              toggleCalling={toggleCalling}
              toggleSales={toggleSales}
            />

            <SectionBlock icon="📊" title="Tracking">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Toggle checked={form.clickTracking} onChange={setBool("clickTracking")} label="Enable Click Tracking (UTM / link tracking)" />
                <Toggle checked={form.conversionTracking} onChange={setBool("conversionTracking")} label="Enable Conversion Tracking (policy issued after campaign click)" />
              </div>
            </SectionBlock>

            <FormActions onCancel={() => navigate("/campaign")} submitLabel="Preview Campaign" />
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
          onConfirm={handleConfirmUpdate}
          confirmLabel="Update Campaign"
        />
      )}
    </div>
  );
}
