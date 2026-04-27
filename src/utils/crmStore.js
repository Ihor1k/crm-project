/**
 * API-backed store (shared across all users).
 *
 * - Keeps a small in-memory cache so existing table/pagination code can stay synchronous.
 * - Persists all writes through the backend `/api/*` endpoints.
 * - Emits update events so pages can refresh when server data arrives.
 */

/** @typedef {"campaigns" | "content" | "audience"} StoreType */

/** @type {Record<StoreType, any[]>} */
const cache = {
  campaigns: [],
  content: [],
  audience: [],
};

/** @type {Record<StoreType, boolean>} */
const loaded = { campaigns: false, content: false, audience: false };

/** @type {Record<StoreType, Set<() => void>>} */
const listeners = {
  campaigns: new Set(),
  content: new Set(),
  audience: new Set(),
};

function notify(type) {
  listeners[type].forEach((fn) => {
    try {
      fn();
    } catch {
      // ignore
    }
  });
}

async function apiJson(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${txt ? `: ${txt}` : ""}`);
  }
  if (res.status === 204) return null;
  return await res.json();
}

/**
 * Subscribe to store updates.
 * @param {StoreType} type
 * @param {() => void} cb
 * @returns {() => void} unsubscribe
 */
export function subscribeStore(type, cb) {
  listeners[type].add(cb);
  return () => listeners[type].delete(cb);
}

async function refreshType(type) {
  const url =
    type === "campaigns"
      ? "/api/campaigns"
      : type === "content"
        ? "/api/content"
        : "/api/audience";
  const data = await apiJson(url);
  cache[type] = Array.isArray(data) ? data : [];
  loaded[type] = true;
  notify(type);
  return cache[type];
}

/**
 * Ensure initial load for a store type (non-blocking safe).
 * @param {StoreType} type
 */
export function ensureStoreLoaded(type) {
  if (loaded[type]) return;
  refreshType(type).catch(() => {
    // leave cache as-is; pages will continue showing cached list
  });
}

// Campaigns
export function loadCampaigns() {
  ensureStoreLoaded("campaigns");
  return cache.campaigns;
}

export function saveCampaigns(campaigns) {
  cache.campaigns = Array.isArray(campaigns) ? campaigns : [];
  loaded.campaigns = true;
  notify("campaigns");
  // best effort: upsert each item
  const list = cache.campaigns.slice();
  Promise.all(
    list.map((c) =>
      apiJson("/api/campaigns", { method: "POST", body: JSON.stringify(c) }).catch(() => null),
    ),
  ).catch(() => null);
}

export function upsertCampaign(campaign) {
  const id = String(campaign?.id ?? "").trim();
  if (!id) return cache.campaigns;
  const list = cache.campaigns.slice();
  const idx = list.findIndex((c) => String(c?.id ?? "") === id);
  if (idx >= 0) list[idx] = campaign;
  else list.unshift(campaign);
  cache.campaigns = list;
  loaded.campaigns = true;
  notify("campaigns");
  apiJson(`/api/campaigns/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(campaign),
  }).catch(() => null);
  return cache.campaigns;
}

export function deleteCampaign(id) {
  const key = String(id ?? "").trim();
  cache.campaigns = cache.campaigns.filter((c) => String(c?.id ?? "") !== key);
  notify("campaigns");
  apiJson(`/api/campaigns/${encodeURIComponent(key)}`, { method: "DELETE" }).catch(() => null);
  return cache.campaigns;
}

// Content
export function loadContentItems() {
  ensureStoreLoaded("content");
  return cache.content;
}

export function saveContentItems(items) {
  cache.content = Array.isArray(items) ? items : [];
  loaded.content = true;
  notify("content");
  const list = cache.content.slice();
  Promise.all(
    list.map((it) =>
      apiJson("/api/content", { method: "POST", body: JSON.stringify(it) }).catch(() => null),
    ),
  ).catch(() => null);
}

export function upsertContentItem(item) {
  const id = String(item?.id ?? "").trim();
  if (!id) return cache.content;
  const list = cache.content.slice();
  const idx = list.findIndex((c) => String(c?.id ?? "") === id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  cache.content = list;
  loaded.content = true;
  notify("content");
  apiJson(`/api/content/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(item) }).catch(
    () => null,
  );
  return cache.content;
}

export function deleteContentItem(id) {
  const key = String(id ?? "").trim();
  cache.content = cache.content.filter((c) => String(c?.id ?? "") !== key);
  notify("content");
  apiJson(`/api/content/${encodeURIComponent(key)}`, { method: "DELETE" }).catch(() => null);
  return cache.content;
}

// Audience
export function loadAudienceSegments() {
  ensureStoreLoaded("audience");
  return cache.audience;
}

export function saveAudienceSegments(items) {
  cache.audience = Array.isArray(items) ? items : [];
  loaded.audience = true;
  notify("audience");
  const list = cache.audience.slice();
  Promise.all(
    list.map((it) =>
      apiJson("/api/audience", { method: "POST", body: JSON.stringify(it) }).catch(() => null),
    ),
  ).catch(() => null);
}

export function upsertAudienceSegment(item) {
  const id = String(item?.id ?? "").trim();
  if (!id) return cache.audience;
  const list = cache.audience.slice();
  const idx = list.findIndex((c) => String(c?.id ?? "") === id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  cache.audience = list;
  loaded.audience = true;
  notify("audience");
  apiJson(`/api/audience/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(item) }).catch(
    () => null,
  );
  return cache.audience;
}

export function deleteAudienceSegment(id) {
  const key = String(id ?? "").trim();
  cache.audience = cache.audience.filter((c) => String(c?.id ?? "") !== key);
  notify("audience");
  apiJson(`/api/audience/${encodeURIComponent(key)}`, { method: "DELETE" }).catch(() => null);
  return cache.audience;
}

