/**
 * @param {unknown} raw
 * @returns {string} trimmed lowercase string for matching
 */
export function normalizeSearchQuery(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase();
}

/**
 * True when query is empty, or any field contains the query (case-insensitive).
 * @param {string} queryNorm result of {@link normalizeSearchQuery}
 * @param {unknown[]} fields values to search (e.g. row columns)
 */
export function rowMatchesSearch(queryNorm, fields) {
  if (!queryNorm) return true;
  return fields.some((f) => String(f ?? "").toLowerCase().includes(queryNorm));
}
