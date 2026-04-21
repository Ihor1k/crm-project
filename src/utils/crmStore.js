const CAMPAIGNS_KEY = "crm.campaigns.v1";
const CONTENT_KEY = "crm.content.v1";
const AUDIENCE_KEY = "crm.audience.v1";

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function loadList(key) {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(key);
  const data = raw ? safeJsonParse(raw, []) : [];
  return Array.isArray(data) ? data : [];
}

function saveList(key, list) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(list));
}

export function loadCampaigns() {
  return loadList(CAMPAIGNS_KEY);
}

export function saveCampaigns(campaigns) {
  saveList(CAMPAIGNS_KEY, campaigns);
}

export function upsertCampaign(campaign) {
  const list = loadCampaigns();
  const idx = list.findIndex((c) => c?.id === campaign?.id);
  if (idx >= 0) list[idx] = campaign;
  else list.unshift(campaign);
  saveCampaigns(list);
  return list;
}

export function loadContentItems() {
  return loadList(CONTENT_KEY);
}

export function saveContentItems(items) {
  saveList(CONTENT_KEY, items);
}

export function upsertContentItem(item) {
  const list = loadContentItems();
  const idx = list.findIndex((c) => c?.id === item?.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  saveContentItems(list);
  return list;
}

export function deleteContentItem(id) {
  const list = loadContentItems().filter((c) => c?.id !== id);
  saveContentItems(list);
  return list;
}

export function loadAudienceSegments() {
  return loadList(AUDIENCE_KEY);
}

export function saveAudienceSegments(items) {
  saveList(AUDIENCE_KEY, items);
}

export function upsertAudienceSegment(item) {
  const list = loadAudienceSegments();
  const idx = list.findIndex((c) => c?.id === item?.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  saveAudienceSegments(list);
  return list;
}

