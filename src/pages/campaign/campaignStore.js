// Client-side persistence for campaign promo cards — the app has no backend,
// so localStorage is what lets a campaign created here survive navigating to
// the member dashboard or Buy Policy. Separate from crmData.js's CAMPAIGNS
// mock, which drives unrelated agent-assignment product filtering.
const STORAGE_KEY = "insureright_promo_campaigns";

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
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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

export function getActivePromoCampaigns() {
  return getPromoCampaigns().filter(
    (c) => c.isActive && c.campaignImage && c.selectedProducts?.length,
  );
}

export function getPromoCampaignById(id) {
  return getPromoCampaigns().find((c) => String(c.id) === String(id)) ?? null;
}
