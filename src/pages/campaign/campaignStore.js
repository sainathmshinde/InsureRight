import defaultCampaignImage from "../../assets/campaign-sbi-base-promo.svg";

// Client-side persistence for campaign promo cards — the app has no backend,
// so localStorage is what lets a campaign created here survive navigating to
// the member dashboard or Buy Policy. Separate from crmData.js's CAMPAIGNS
// mock, which drives unrelated agent-assignment product filtering.
const STORAGE_KEY = "insureright_promo_campaigns";

// Seeded on first load so the dashboard has a live example to show — matches
// "Campaign 1" in CampaignEdit.jsx's MOCK_DATA (same id, same product pair),
// so editing that campaign through the UI naturally overrides this seed.
const DEFAULT_CAMPAIGNS = [
  {
    id: 1,
    name: "Campaign 1",
    selectedProducts: [42, 48], // SBI Base Policy + SBI Arogya Plus — Top Up Health Plan
    offerType: "Percent",
    offerValue: "15",
    campaignImage: defaultCampaignImage,
    isActive: true,
    startDate: "2026-07-01",
    endDate: "2026-08-31",
  },
];

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getPromoCampaigns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
    return DEFAULT_CAMPAIGNS;
  } catch {
    return DEFAULT_CAMPAIGNS;
  }
}

export function savePromoCampaign(campaign) {
  const all = getPromoCampaigns();
  const idx = all.findIndex((c) => c.id === campaign.id);
  if (idx >= 0) all[idx] = campaign;
  else all.push(campaign);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return campaign;
}

// Pass the viewing member's associationId to also honour "By Corporate"
// targeting — a campaign scoped to specific associations (selectedAssociations)
// only shows to members of those associations; a campaign with no association
// targeting (segment "ALL" etc.) shows to everyone, as before.
export function getActivePromoCampaigns(associationId) {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" — lexicographically comparable
  return getPromoCampaigns().filter(
    (c) =>
      c.isActive &&
      c.campaignImage &&
      c.selectedProducts?.length &&
      (!c.startDate || c.startDate <= today) &&
      (!c.endDate || c.endDate >= today) &&
      (!c.selectedAssociations?.length ||
        (associationId != null && c.selectedAssociations.includes(associationId))),
  );
}

export function getPromoCampaignById(id) {
  return getPromoCampaigns().find((c) => String(c.id) === String(id)) ?? null;
}

export function deletePromoCampaign(id) {
  const all = getPromoCampaigns().filter((c) => String(c.id) !== String(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
