import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function AudiencePage({ currentRoute = "/audience" } = {}) {

  const isDashboard = currentRoute === "/" || currentRoute === "/dashboard";
const isCampaigns = currentRoute === "/campaigns";
const isAudience = currentRoute === "/audience";
  const rows = [
    row("New users", "Users who signed up in the last 30 days", "12 400"),
    row("Returning users", "Users with at least one previous session", "8 950"),
    row("Active users", "Users who interacted with the platform in the last 7 days", "4 234"),
    row("High-value users", "Users with the highest purchase or engagement value", "2 763"),
    row("Power users", "Highly engaged users with frequent activity", "948"),
    row("High-value users", "Users with the highest purchase or engagement value", "2 763"),
    row("Returning users", "Users with at least one previous session", "8 950"),
    row("New users", "Users who signed up in the last 30 days", "12 400"),
    row("Power users", "Highly engaged users with frequent activity", "948"),
    row("Returning users", "Users with at least one previous session", "8 950"),
    row("High-value users", "Users with the highest purchase or engagement value", "2 763"),
    row("Active users", "Users who interacted with the platform in the last 7 days", "4 234"),
  ];

  const markup = `
    <main class="dashboard-layout">
      <aside class="crm-sidebar">
        <div>
          <img class="crm-sidebar__logo" src="${brandAssets.sidebarLogo}" alt="Illus logo" />
          <section class="crm-sidebar__user">
            <div class="crm-sidebar__avatar"><img src="${brandAssets.avatar}" alt="User avatar" /></div>
            <div>
              <p class="crm-sidebar__name">Stephen Edwin</p>
              <p class="crm-sidebar__role">Marketer</p>
            </div>
          </section>

          <nav aria-label="Primary">
            <ul class="sidebar-nav">
            ${SidebarNavItem({
              label: "Dashboard",
              to: "/dashboard",
              icon: "dashboard",
              active: isDashboard,
            })}
            ${SidebarNavItem({
              label: "Campaign Manager",
              to: "/campaigns",
              icon: "campaign",
              active: isCampaigns,
            })}
            ${SidebarNavItem({
              label: "Audience",
              to: "/audience",
              icon: "audience",
              active: isAudience,
            })}
              ${SidebarNavItem({ label: "Content Library", icon: "library" })}
              ${SidebarNavItem({ label: "Launch Calendar", icon: "calendar" })}
              ${SidebarNavItem({ label: "Experiments", icon: "experiments" })}
              ${SidebarNavItem({ label: "Reports", icon: "reports" })}
            </ul>
          </nav>
        </div>

        <nav aria-label="Secondary">
          <ul class="sidebar-nav">
            ${SidebarNavItem({ label: "Help", icon: "help" })}
            ${SidebarNavItem({ label: "Settings", icon: "settings" })}
          </ul>
        </nav>
      </aside>

      <section class="dashboard-main">
        <header class="dashboard-header">
          <div>
            <h1>Audience</h1>
            <p>Predefined audience segments</p>
          </div>
        </header>

        <section class="campaign-toolbar" aria-label="Audience actions">
          <div class="campaign-search">
            <span class="campaign-search__icon" aria-hidden="true">${searchIcon()}</span>
            <input class="campaign-search__input" type="search" placeholder="Search" aria-label="Search audience" />
          </div>

          <div class="campaign-toolbar__actions">
            <button type="button" class="ghost-btn">
              <span class="ghost-btn__icon" aria-hidden="true">${filterIcon()}</span>
              Filter
            </button>
            <button type="button" class="ghost-btn">
              <span class="ghost-btn__icon" aria-hidden="true">${exportIcon()}</span>
              Export
            </button>
          </div>
        </section>

        <section class="panel campaign-panel" aria-label="Audience table">
          <div class="campaign-table-wrap audience-table-wrap">
            <table class="campaign-table campaign-table--manager audience-table">
              <thead>
                <tr>
                  <th>
                    <span class="table-head-label">
                      Segment Name
                      <span class="table-head-sort" aria-hidden="true">${sortIcon()}</span>
                    </span>
                  </th>
                  <th>Description</th>
                  <th>
                    <span class="table-head-label">
                      Estimated Audience Size
                      <span class="table-head-sort" aria-hidden="true">${sortIcon()}</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(renderRow).join("")}
              </tbody>
            </table>

            <div class="table-pagination" aria-label="Pagination">
              <div class="table-pagination__left">Total campaigns: <span class="bold">87</span></div>
              <div class="table-pagination__center">
                <span class="table-pagination__muted">Prev</span>
                <span class="table-pagination__page is-active">1</span>
                <span class="table-pagination__page">2</span>
                <span class="table-pagination__muted">…</span>
                <span class="table-pagination__page">7</span>
                <span class="table-pagination__muted">Next</span>
              </div>
              <div class="table-pagination__right">
                <span class="table-pagination__muted">Go to page</span>
                <span class="table-pagination__input" aria-hidden="true"></span>
                <span class="table-pagination__muted">›</span>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  `;

  return {
    mount(target) {
      target.innerHTML = markup;
    },
  };
}



function row(name, description, size) {
  return { name, description, size };
}

function renderRow(item) {
  return `
    <tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.description)}</td>
      <td>${escapeHtml(item.size)}</td>
    </tr>
  `;
}

function searchIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/></svg>`;
}

function filterIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
  <path d="M10.5563 0C10.9944 0.000513872 11.423 0.128005 11.7907 0.366211C12.1583 0.604429 12.4501 0.943185 12.6296 1.34277C12.809 1.74248 12.8687 2.18603 12.8024 2.61914C12.7361 3.05214 12.5462 3.45646 12.2555 3.78418L8.16472 8.38867V13.417C8.16464 13.5716 8.10315 13.7198 7.99383 13.8291C7.88446 13.9384 7.73634 14 7.58172 14C7.45571 14 7.33299 13.9593 7.23211 13.8838L4.89812 12.1338C4.82568 12.0795 4.76675 12.0087 4.72625 11.9277C4.6858 11.8468 4.66478 11.7574 4.66472 11.667V8.38867L0.571951 3.78418C0.28137 3.45632 0.0921444 3.05125 0.026053 2.61816C-0.0400383 2.18499 0.0202267 1.74146 0.199881 1.3418C0.379551 0.942318 0.671035 0.603263 1.03875 0.365234C1.4065 0.127221 1.83507 0.000316821 2.27312 0H10.5563Z" fill="#3A3A3A"/>
  </svg>`;
}

function exportIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.71777 0C7.80802 0 8.83372 0.425122 9.60547 1.19629L11.6377 3.22949C12.4089 4.00065 12.834 5.02481 12.834 6.11621V11.083C12.834 12.6912 11.5261 13.9998 9.91797 14H4.08398C2.47589 13.9998 1.16797 12.6911 1.16797 11.083V2.91699C1.16797 1.30885 2.47589 0.000181475 4.08398 0H6.71777Z" fill="#3A3A3A"/>
  </svg>`;
}

function sortIcon() {
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="M7 10l5-5 5 5H7zm10 4l-5 5-5-5h10z"/></svg>`;
}

function getCurrentRoute() {
  const hash = window.location?.hash ?? "";

  if (hash.startsWith("#/")) return stripBase(hash.slice(1));

  if (hash.startsWith("#") && hash.length > 1) {
    const h = hash.slice(1);
    const path = h.startsWith("/") ? h : `/${h}`;
    return stripBase(path);
  }

  return stripBase(window.location?.pathname ?? "/");
}

function stripBase(path) {
  const base = import.meta.env.BASE_URL ?? "/";

  if (typeof path !== "string" || !path.startsWith("/")) return path;
  if (base === "/" || base === "") return path;

  const baseNoSlash = String(base).replace(/\/+$/, "");
  if (!baseNoSlash || baseNoSlash === "/") return path;
  if (!path.startsWith(baseNoSlash)) return path;

  const rest = path.slice(baseNoSlash.length);
  return rest === "" ? "/" : rest;
}