import { escapeHtml } from "../utils/escapeHtml";

export function StatCard({ icon, value, label }) {
  return `
    <article class="stat-card">
      <div class="stat-card__icon" aria-hidden="true">${icon}</div>
      <div>
        <p class="stat-card__value">${escapeHtml(String(value))}</p>
        <p class="stat-card__label">${escapeHtml(label)}</p>
      </div>
    </article>
  `;
}
