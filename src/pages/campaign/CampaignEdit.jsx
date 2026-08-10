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
import { fileToDataUrl, savePromoCampaign, getPromoCampaignById } from "./campaignStore";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useToast } from "../../context/ToastContext";

const BASE = {
  segment: "ALL", salesPersonId: "",
  ageMin: "", ageMax: "", state: "",
  selectedProducts: [], selectedAssociations: [], discountRules: "",
  offerType: "Percent", offerValue: "", channels: [], messageTemplate: "",
  whatsappTemplateId: "", campaignImage: null,
  callingIds: [], salesIds: [],
};

const MOCK_DATA = {
  1:  { ...BASE, name: "Campaign 1",                startDate: "2024-09-20", endDate: "2025-07-29", selectedProducts: [42, 48],     callingIds: [2],    salesIds: [1, 5] },
  5:  { ...BASE, name: "Campaign OPD and DIGIT PAYMENT PROTECTION", startDate: "2025-01-31", endDate: "2025-03-31", selectedProducts: [60, 61], callingIds: [4], salesIds: [1] },
  6:  { ...BASE, name: "BPP Campaign",               startDate: "2025-02-19", endDate: "2025-03-24", selectedProducts: [60, 61],     callingIds: [2, 9], salesIds: [8] },
  7:  { ...BASE, name: "Test Campaign",              startDate: "2025-08-03", endDate: "2025-08-29", selectedProducts: [3],          callingIds: [],     salesIds: [1] },
  8:  { ...BASE, name: "SBI_STP_Campaign",           startDate: "2025-09-18", endDate: "2026-03-10", selectedProducts: [42, 38],     callingIds: [4],    salesIds: [5] },
  11: { ...BASE, name: "BPP Campaign_2026-2027",     startDate: "2026-03-16", endDate: "2026-05-31", selectedProducts: [42, 38, 48], callingIds: [2, 9], salesIds: [8] },
  12: { ...BASE, name: "Standalone campaign",        startDate: "2026-02-28", endDate: "2026-04-29", selectedProducts: [38],         callingIds: [2],    salesIds: [1] },
  13: { ...BASE, name: "Test Campaign",              startDate: "2026-07-01", endDate: "2026-09-30", selectedProducts: [42, 48],     callingIds: [],     salesIds: [] },
};

const DEFAULT = {
  name: "", startDate: "", endDate: "",
  segment: "ALL", salesPersonId: "", ageMin: "", ageMax: "", state: "",
  selectedProducts: [], selectedAssociations: [],
  discountRules: "", offerType: "Flat", offerValue: "", channels: [],
  messageTemplate: "", whatsappTemplateId: "", campaignImage: null,
  callingIds: [], salesIds: [],
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
  const toast = useToast();
  // MOCK_DATA only covers the 7 seed campaigns — anything created through
  // Add Campaign gets a Date.now() id and lives in campaignStore (localStorage)
  // instead, so fall back there before giving up to a blank DEFAULT form.
  const stored = MOCK_DATA[id] ?? getPromoCampaignById(id);
  const saved = stored ? { ...BASE, ...stored } : DEFAULT;

  const [form, setForm] = useState(saved);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const fv = useFormValidation(form, {
    name: { required: true, label: "Campaign Name" },
    startDate: { required: true, label: "Start Date" },
    endDate: {
      required: true,
      label: "End Date",
      validate: (val) =>
        form.startDate && val && val < form.startDate
          ? "End date cannot be before start date"
          : "",
    },
    ...(form.channels.length > 0
      ? { messageTemplate: { required: "Message template is required when a channel is selected" } }
      : {}),
  });

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
    if (!fv.validateAll()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }
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
    toast.success("Campaign updated successfully.");
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
          <form onSubmit={handleSubmit} noValidate>
            <SectionBlock icon="📢" title="Campaign Information">
              <div className="form-grid-3">
                <Field label="Campaign Name" required error={fv.fieldProps("name").error}>
                  <Input placeholder="Campaign name" value={form.name} onChange={set("name")} required {...fv.fieldProps("name")} />
                </Field>
                <Field label="Start Date" required error={fv.fieldProps("startDate").error}>
                  <DateInput value={form.startDate} onChange={set("startDate")} required {...fv.fieldProps("startDate")} />
                </Field>
                <Field label="End Date" required error={fv.fieldProps("endDate").error}>
                  <DateInput
                    value={form.endDate}
                    onChange={set("endDate")}
                    min={form.startDate || undefined}
                    required
                    {...fv.fieldProps("endDate")}
                  />
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
                <Field label="Message Template" required={form.channels.length > 0} error={fv.fieldProps("messageTemplate").error}>
                  <Textarea
                    placeholder="Hi {member_name}, your health cover from {ic_name} is due for renewal…"
                    value={form.messageTemplate}
                    onChange={set("messageTemplate")}
                    style={{ minHeight: 100 }}
                    {...fv.fieldProps("messageTemplate")}
                  />
                </Field>
                <Field label="WhatsApp Template ID">
                  <Input placeholder="e.g. summer_health_v1" value={form.whatsappTemplateId} onChange={set("whatsappTemplateId")} disabled={!form.channels.includes("WhatsApp (Meta API)")} />
                </Field>
              </div>
            </SectionBlock>

            <PromoCreativeSection form={form} setForm={setForm} />

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
