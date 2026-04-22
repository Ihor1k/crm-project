import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import {
  campaignDatePickerField,
  closeCampaignDatePickersIn,
  mountCampaignDatePickers,
} from "../components/campaignDatePicker.js";
import { escapeHtml, escapeHtmlAttr } from "../utils/escapeHtml.js";
import { loadCampaigns, saveCampaigns, upsertCampaign } from "../utils/crmStore.js";
import { createTablePagination, paginationBarHtml } from "../utils/tablePagination.js";
import { normalizeSearchQuery, rowMatchesSearch } from "../utils/searchFilter.js";

function campaignIsoToDisplayDmy(iso) {
  if (!iso) return "—";
  const parts = String(iso).split("-");
  if (parts.length !== 3) return "—";
  const [y, m, d] = parts;
  if (!y || !m || !d) return "—";
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

function campaignStoredToRow(c) {
  return row(
    c.campaignName || "-",
    c.id || "-",
    c.status || "Draft",
    c.geo || "—",
    c.conv || "—",
    campaignIsoToDisplayDmy(c.startDate),
    campaignIsoToDisplayDmy(c.endDate),
  );
}

export function CampaignPage({ currentRoute = "/campaigns" } = {}) {

  const isDashboard = currentRoute === "/" || currentRoute === "/dashboard";
  const isCampaigns = currentRoute === "/campaigns";
  const isAudience = currentRoute === "/audience";
  const isContentLibrary = currentRoute === "/content-library";
  const isLaunchCalendar = currentRoute === "/launch-calendar";
  const isExperiments = currentRoute === "/experiments";
  const isReports = currentRoute === "/reports";
  const isSettings = currentRoute === "/settings";
  const state = {
    openRowId: null,
    savedCampaign: null,
    overviewTab: "Summary",
  };
  let cleanup = null;

  const rows = [
    row("Spring Promotion", "CMP-10234", "Running", "EU", "3.8%", "02.04.2026", "12.08.2026"),
    row("Limited Time Offer", "CMP-14232", "Completed", "LATAM", "2.1%", "02.04.2026", "12.08.2026"),
    row("Weekend Deal", "CMP-1234", "Draft", "Global", "1.3%", "02.04.2026", "12.08.2026"),
    row("Flash Sale", "CMP-3225", "Scheduled", "LATAM", "12.8%", "02.04.2026", "12.08.2026"),
    row("Mega Discount Week", "CMP-6234", "Paused", "EU", "17.5%", "02.04.2026", "12.08.2026"),
    row("New Arrivals", "CMP-135", "Terminated", "Global", "2.8%", "02.04.2026", "12.08.2026"),
    row("Loyalty Reward Campaign", "CMP-1235", "Archived", "APAC", "9.6%", "02.04.2026", "12.08.2026"),
    row("Beta Access", "CMP-765", "Scheduled", "EU", "52.8%", "02.04.2026", "12.08.2026"),
    row("Lead Generation", "CMP-12034", "Draft", "Global", "3.8%", "02.04.2026", "12.08.2026"),
    row("Growth Boost Campaign", "CMP-10235", "Draft", "US", "1.8%", "02.04.2026", "12.08.2026"),
    row("Spring Promotion", "CMP-10234", "Running", "EU", "3.8%", "02.04.2026", "12.08.2026"),
    row("Limited Time Offer", "CMP-14232", "Completed", "LATAM", "2.1%", "02.04.2026", "12.08.2026"),
    row("Weekend Deal", "CMP-1234", "Draft", "Global", "1.3%", "02.04.2026", "12.08.2026"),
    row("Flash Sale", "CMP-3225", "Scheduled", "LATAM", "12.8%", "02.04.2026", "12.08.2026"),
    row("Mega Discount Week", "CMP-6234", "Paused", "EU", "17.5%", "02.04.2026", "12.08.2026"),
    row("New Arrivals", "CMP-135", "Terminated", "Global", "2.8%", "02.04.2026", "12.08.2026"),
    row("Loyalty Reward Campaign", "CMP-1235", "Archived", "APAC", "9.6%", "02.04.2026", "12.08.2026"),
    row("Beta Access", "CMP-765", "Scheduled", "EU", "52.8%", "02.04.2026", "12.08.2026"),
    row("Lead Generation", "CMP-12034", "Draft", "Global", "3.8%", "02.04.2026", "12.08.2026"),
    row("Growth Boost Campaign", "CMP-10235", "Draft", "US", "1.8%", "02.04.2026", "12.08.2026"),
    row("Spring Promotion", "CMP-10234", "Running", "EU", "3.8%", "02.04.2026", "12.08.2026"),
    row("Limited Time Offer", "CMP-14232", "Completed", "LATAM", "2.1%", "02.04.2026", "12.08.2026"),
    row("Weekend Deal", "CMP-1234", "Draft", "Global", "1.3%", "02.04.2026", "12.08.2026"),
    row("Flash Sale", "CMP-3225", "Scheduled", "LATAM", "12.8%", "02.04.2026", "12.08.2026"),
    row("Mega Discount Week", "CMP-6234", "Paused", "EU", "17.5%", "02.04.2026", "12.08.2026"),
    row("New Arrivals", "CMP-135", "Terminated", "Global", "2.8%", "02.04.2026", "12.08.2026"),
    row("Loyalty Reward Campaign", "CMP-1235", "Archived", "APAC", "9.6%", "02.04.2026", "12.08.2026"),
    row("Beta Access", "CMP-765", "Scheduled", "EU", "52.8%", "02.04.2026", "12.08.2026"),
    row("Lead Generation", "CMP-12034", "Draft", "Global", "3.8%", "02.04.2026", "12.08.2026"),
    row("Growth Boost Campaign", "CMP-10235", "Draft", "US", "1.8%", "02.04.2026", "12.08.2026"),
  ];

  const sortColumns = new Set(["Campaign Name", "ID", "Conversion rate", "Creation date", "End date"]);

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
            ${SidebarNavItem({
              label: "Content Library",
              to: "/content-library",
              icon: "library",
              active: isContentLibrary,
            })}
            ${SidebarNavItem({
              label: "Launch Calendar",
              to: "/launch-calendar",
              icon: "calendar",
              active: isLaunchCalendar,
            })}
            ${SidebarNavItem({
              label: "Experiments",
              to: "/experiments",
              icon: "experiments",
              active: isExperiments,
            })}
            ${SidebarNavItem({
              label: "Reports",
              to: "/reports",
              icon: "reports",
              active: isReports,
            })}
            </ul>
          </nav>
        </div>

        <nav aria-label="Secondary">
          <ul class="sidebar-nav">
            ${SidebarNavItem({ label: "Help", icon: "help" })}
            ${SidebarNavItem({ label: "Settings", to: "/settings", icon: "settings", active: isSettings })}
          </ul>
        </nav>
      </aside>

      <section class="dashboard-main">
        <header class="dashboard-header">
          <div>
            <h1>Campaign Manager</h1>
            <p>Manage your marketing campaigns</p>
          </div>
          <div class="campaign-header-right">
            <div class="campaign-search campaign-search--header">
              <span class="campaign-search__icon" aria-hidden="true">${searchIcon()}</span>
              <input
                class="campaign-search__input"
                type="search"
                placeholder="Search by ID or Campaign Name"
                aria-label="Search campaigns"
              />
            </div>
            <button type="button" class="dashboard-header__action" data-create-campaign-btn>+ Create Campaign</button>
          </div>
        </header>

        <section class="campaign-toolbar campaign-toolbar--filters" aria-label="Campaign filters">
          <div class="campaign-filters">
            <div class="filter-pill-wrap">
            <button type="button" class="filter-pill" data-pill="status" aria-haspopup="dialog" aria-expanded="false"><span class="filter-pill__icon">${filterIcon()}</span> Status <span class="filter-pill__caret"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M10.834 0C10.9439 4.17446e-05 11.0528 0.0221865 11.1543 0.0644531C11.2557 0.106758 11.3484 0.168052 11.4258 0.246094C11.581 0.402224 11.668 0.613844 11.668 0.833984C11.668 1.05412 11.581 1.26574 11.4258 1.42188L7.60059 5.24609C7.13191 5.71419 6.49637 5.97746 5.83398 5.97754C5.17148 5.97754 4.53613 5.71426 4.06738 5.24609L0.242188 1.42188C0.0869784 1.26574 0 1.05414 0 0.833984C3.728e-06 0.613835 0.0869817 0.402226 0.242188 0.246094C0.319596 0.168127 0.412251 0.106707 0.513672 0.0644531C0.61514 0.0222235 0.724077 0 0.833984 0C0.943887 4.17132e-05 1.05284 0.0221864 1.1543 0.0644531C1.25575 0.106758 1.34838 0.168052 1.42578 0.246094L5.24219 4.06348C5.31961 4.14147 5.41223 4.20286 5.51367 4.24512C5.61515 4.28736 5.72406 4.30957 5.83398 4.30957C5.94389 4.30953 6.05285 4.28738 6.1543 4.24512C6.25573 4.20281 6.34839 4.14151 6.42578 4.06348L10.2422 0.246094C10.3196 0.168126 10.4123 0.106707 10.5137 0.0644531C10.6151 0.0222235 10.7241 0 10.834 0Z" fill="#8A8A8A"/>
          </svg></span></button>
            <div class="crm-filter crm-filter--pill" data-pill-popover="status" aria-hidden="true">
              <div class="crm-filter__title">Status</div>
              <div class="crm-filter__checklist" data-status-checks>
                ${["Running","Paused","Draft","Scheduled","Completed","Archived","Terminated"]
                  .map(
                    (s) => `<label class="crm-filter__check"><input type="checkbox" value="${escapeHtml(
                      s,
                    )}" /> <span>${escapeHtml(s)}</span></label>`,
                  )
                  .join("")}
              </div>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-pill-reset="status">All</button>
                <button type="button" class="crm-filter__close" data-pill-close="status">Close</button>
              </div>
            </div>
            </div>

            <div class="filter-pill-wrap">
            <button type="button" class="filter-pill" data-pill="geo" aria-haspopup="dialog" aria-expanded="false"><span class="filter-pill__icon">${geoIcon()}</span> Geo <span class="filter-pill__caret"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M10.834 0C10.9439 4.17446e-05 11.0528 0.0221865 11.1543 0.0644531C11.2557 0.106758 11.3484 0.168052 11.4258 0.246094C11.581 0.402224 11.668 0.613844 11.668 0.833984C11.668 1.05412 11.581 1.26574 11.4258 1.42188L7.60059 5.24609C7.13191 5.71419 6.49637 5.97746 5.83398 5.97754C5.17148 5.97754 4.53613 5.71426 4.06738 5.24609L0.242188 1.42188C0.0869784 1.26574 0 1.05414 0 0.833984C3.728e-06 0.613835 0.0869817 0.402226 0.242188 0.246094C0.319596 0.168127 0.412251 0.106707 0.513672 0.0644531C0.61514 0.0222235 0.724077 0 0.833984 0C0.943887 4.17132e-05 1.05284 0.0221864 1.1543 0.0644531C1.25575 0.106758 1.34838 0.168052 1.42578 0.246094L5.24219 4.06348C5.31961 4.14147 5.41223 4.20286 5.51367 4.24512C5.61515 4.28736 5.72406 4.30957 5.83398 4.30957C5.94389 4.30953 6.05285 4.28738 6.1543 4.24512C6.25573 4.20281 6.34839 4.14151 6.42578 4.06348L10.2422 0.246094C10.3196 0.168126 10.4123 0.106707 10.5137 0.0644531C10.6151 0.0222235 10.7241 0 10.834 0Z" fill="#8A8A8A"/>
          </svg></span></button>
            <div class="crm-filter crm-filter--pill" data-pill-popover="geo" aria-hidden="true">
              <div class="crm-filter__title">Geo</div>
              <label class="crm-filter__field">
                <span class="crm-filter__label">Geo equals</span>
                <select class="crm-filter__input" data-geo-select>
                  <option value="">All</option>
                  ${["Global","EU","US","LATAM","APAC"].map((g)=>`<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join("")}
                </select>
              </label>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-pill-reset="geo">All</button>
                <button type="button" class="crm-filter__close" data-pill-close="geo">Close</button>
              </div>
            </div>
            </div>

            <div class="filter-pill-wrap">
            <button type="button" class="filter-pill" data-pill="activity" aria-haspopup="dialog" aria-expanded="false"><span class="filter-pill__icon">${activityIcon()}</span> Activity <span class="filter-pill__caret"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M10.834 0C10.9439 4.17446e-05 11.0528 0.0221865 11.1543 0.0644531C11.2557 0.106758 11.3484 0.168052 11.4258 0.246094C11.581 0.402224 11.668 0.613844 11.668 0.833984C11.668 1.05412 11.581 1.26574 11.4258 1.42188L7.60059 5.24609C7.13191 5.71419 6.49637 5.97746 5.83398 5.97754C5.17148 5.97754 4.53613 5.71426 4.06738 5.24609L0.242188 1.42188C0.0869784 1.26574 0 1.05414 0 0.833984C3.728e-06 0.613835 0.0869817 0.402226 0.242188 0.246094C0.319596 0.168127 0.412251 0.106707 0.513672 0.0644531C0.61514 0.0222235 0.724077 0 0.833984 0C0.943887 4.17132e-05 1.05284 0.0221864 1.1543 0.0644531C1.25575 0.106758 1.34838 0.168052 1.42578 0.246094L5.24219 4.06348C5.31961 4.14147 5.41223 4.20286 5.51367 4.24512C5.61515 4.28736 5.72406 4.30957 5.83398 4.30957C5.94389 4.30953 6.05285 4.28738 6.1543 4.24512C6.25573 4.20281 6.34839 4.14151 6.42578 4.06348L10.2422 0.246094C10.3196 0.168126 10.4123 0.106707 10.5137 0.0644531C10.6151 0.0222235 10.7241 0 10.834 0Z" fill="#8A8A8A"/>
          </svg></span></button>
            <div class="crm-filter crm-filter--pill" data-pill-popover="activity" aria-hidden="true">
              <div class="crm-filter__title">Activity</div>
              <label class="crm-filter__field">
                <span class="crm-filter__label">Updates</span>
                <select class="crm-filter__input" data-activity-select>
                  <option value="">All</option>
                  <option value="with">With updates</option>
                  <option value="none">No updates</option>
                </select>
              </label>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-pill-reset="activity">All</button>
                <button type="button" class="crm-filter__close" data-pill-close="activity">Close</button>
              </div>
            </div>
            </div>

            <div class="filter-pill-wrap">
            <button type="button" class="filter-pill" data-pill="period" aria-haspopup="dialog" aria-expanded="false"><span class="filter-pill__icon">${periodIcon()}</span> Period <span class="filter-pill__caret"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
            <path d="M10.834 0C10.9439 4.17446e-05 11.0528 0.0221865 11.1543 0.0644531C11.2557 0.106758 11.3484 0.168052 11.4258 0.246094C11.581 0.402224 11.668 0.613844 11.668 0.833984C11.668 1.05412 11.581 1.26574 11.4258 1.42188L7.60059 5.24609C7.13191 5.71419 6.49637 5.97746 5.83398 5.97754C5.17148 5.97754 4.53613 5.71426 4.06738 5.24609L0.242188 1.42188C0.0869784 1.26574 0 1.05414 0 0.833984C3.728e-06 0.613835 0.0869817 0.402226 0.242188 0.246094C0.319596 0.168127 0.412251 0.106707 0.513672 0.0644531C0.61514 0.0222235 0.724077 0 0.833984 0C0.943887 4.17132e-05 1.05284 0.0221864 1.1543 0.0644531C1.25575 0.106758 1.34838 0.168052 1.42578 0.246094L5.24219 4.06348C5.31961 4.14147 5.41223 4.20286 5.51367 4.24512C5.61515 4.28736 5.72406 4.30957 5.83398 4.30957C5.94389 4.30953 6.05285 4.28738 6.1543 4.24512C6.25573 4.20281 6.34839 4.14151 6.42578 4.06348L10.2422 0.246094C10.3196 0.168126 10.4123 0.106707 10.5137 0.0644531C10.6151 0.0222235 10.7241 0 10.834 0Z" fill="#8A8A8A"/>
          </svg></span></button>
            <div class="crm-filter crm-filter--pill" data-pill-popover="period" aria-hidden="true">
              <div class="crm-filter__title">Period</div>
              ${campaignDatePickerField({
                labelText: "From (start date)",
                placeholder: "Select Start Date",
                required: false,
                fieldKey: "periodFrom",
              })}
              ${campaignDatePickerField({
                labelText: "To (start date)",
                placeholder: "Select Start Date",
                required: false,
                fieldKey: "periodTo",
              })}
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-pill-reset="period">All</button>
                <button type="button" class="crm-filter__close" data-pill-close="period">Close</button>
              </div>
            </div>
            </div>
          </div>

          <div class="campaign-toolbar__actions">
            <button type="button" class="ghost-btn" data-filter-btn aria-haspopup="dialog" aria-expanded="false">
              <span class="ghost-btn__icon" aria-hidden="true">${filterIcon()}</span>
              Filter
            </button>
            <button type="button" class="ghost-btn" data-export-btn>
              <span class="ghost-btn__icon" aria-hidden="true">${exportIcon()}</span>
              Export
            </button>

            <div class="crm-filter" data-filter-popover aria-hidden="true">
              <div class="crm-filter__title">Filter</div>
              <label class="crm-filter__field">
                <span class="crm-filter__label">Campaign name starts with</span>
                <input class="crm-filter__input" type="text" inputmode="text" placeholder="e.g. S" maxlength="20" />
              </label>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-filter-reset>All</button>
                <button type="button" class="crm-filter__close" data-filter-close>Close</button>
              </div>
            </div>
          </div>
        </section>

        <section class="panel campaign-panel" aria-label="Campaign table">
          <div class="campaign-table-wrap campaign-page-scroll">
            <table class="campaign-table campaign-table--manager">
              <thead>
                <tr>
                  ${["Campaign Name", "ID", "Status", "Geo", "Conversion rate", "Creation date", "End date"]
                    .map(
                      (title) => `
                    <th>
                      <span class="table-head-label">
                        ${escapeHtml(title)}
                        ${sortColumns.has(title) ? `<span class="table-head-sort" aria-hidden="true">${sortIcon()}</span>` : ""}
                      </span>
                    </th>
                  `,
                    )
                    .join("")}
                  <th class="campaign-table__actions-head" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            ${paginationBarHtml("Total campaigns:")}
          </div>
        </section>

        <div class="crm-modal" data-create-campaign-modal aria-hidden="true">
          <div class="crm-modal__backdrop" data-modal-close></div>
          <div class="crm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="create-campaign-title">
            <div class="crm-modal__head">
              <div>
                <h2 class="crm-modal__title" id="create-campaign-title">Create Campaign</h2>
                <p class="crm-modal__subtitle">Configure campaign settings and parameters</p>
              </div>
              <button type="button" class="crm-modal__close" aria-label="Close" data-modal-close>×</button>
            </div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Basic Information & Channel Configuration</div>
              <div class="crm-form-grid">
                <label class="crm-field">
                  <span class="crm-field__label">Campaign Name <span class="crm-field__req">*</span></span>
                  <input class="crm-field__input" type="text" placeholder="Enter Campaign Name" data-field="campaignName" />
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">Channel <span class="crm-field__req">*</span></span>
                  <select class="crm-field__input" data-field="channel">
                    <option value="" selected disabled>Select Channel</option>
                    <option>Web</option>
                    <option>Email</option>
                    <option>Ads</option>
                    <option>Push</option>
                    <option>Social</option>
                    <option>In-app</option>
                  </select>
                </label>
                <label class="crm-field crm-field--full">
                  <span class="crm-field__label">Description</span>
                  <input class="crm-field__input" type="text" placeholder="Enter description" data-field="description" />
                </label>
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Geo Targeting & Audience</div>
              <div class="crm-form-grid">
                <label class="crm-field">
                  <span class="crm-field__label">Geo</span>
                  <select class="crm-field__input" data-field="geo">
                    <option value="" selected disabled>Select Geo</option>
                    <option>Global</option>
                    <option>EU</option>
                    <option>US</option>
                    <option>LATAM</option>
                    <option>APAC</option>
                  </select>
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">Audience Segment</span>
                  <select class="crm-field__input" data-field="audienceSegment">
                    <option value="" selected disabled>Select Segment</option>
                    <option>New Users</option>
                    <option>Returning Users</option>
                    <option>High Intent</option>
                    <option>Churn Risk</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Campaign Schedule</div>
              <div class="crm-form-grid">
                ${campaignDatePickerField({
                  labelText: "Start Date",
                  placeholder: "Select Start Date",
                  required: true,
                  fieldKey: "startDate",
                })}
                ${campaignDatePickerField({
                  labelText: "End Date",
                  placeholder: "Select End Date",
                  required: false,
                  fieldKey: "endDate",
                })}
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Linked Content</div>
              <div class="crm-form-grid">
                <label class="crm-field crm-field--full">
                  <span class="crm-field__label">Linked Content</span>
                  <select class="crm-field__input" data-field="linkedContent">
                    <option value="" selected disabled>Select Content</option>
                    <option>Homepage banner – Spring</option>
                    <option>Summer Engagement Boost</option>
                    <option>Welcome Message</option>
                    <option>Back-to-School Special</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-form-grid">
                <label class="crm-field">
                  <span class="crm-field__label">Content Type</span>
                  <input class="crm-field__input" type="text" placeholder="Banner" data-field="contentType" />
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">Purpose</span>
                  <select class="crm-field__input" data-field="purpose">
                    <option value="" selected disabled>Select Purpose</option>
                    <option>Retargeting</option>
                    <option>Awareness</option>
                    <option>Acquisition</option>
                    <option>Engagement</option>
                    <option>Retention</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="crm-modal__footer">
              <div class="crm-modal__actions">
                <button type="button" class="crm-btn crm-btn--link" data-modal-close>Cancel</button>
                <button type="button" class="crm-btn crm-btn--primary" data-save-campaign>Save Campaign</button>
              </div>
            </div>
          </div>
        </div>

        <div class="crm-modal" data-campaign-overview-modal aria-hidden="true">
          <div class="crm-modal__backdrop" data-overview-close></div>
          <div class="crm-modal__dialog crm-overview" role="dialog" aria-modal="true" aria-labelledby="campaign-overview-title">
            <div class="crm-modal__head">
              <div>
                <h2 class="crm-modal__title" id="campaign-overview-title" data-overview-title>Campaign</h2>
                <p class="crm-modal__subtitle">Campaign overview and configuration</p>
              </div>
              <button type="button" class="crm-modal__close" aria-label="Close" data-overview-close>×</button>
            </div>

            <div class="crm-overview__scroll">
              <div class="crm-modal__section">
                <div class="crm-tabs" role="tablist" aria-label="Campaign tabs">
                  <button type="button" class="crm-tab is-active" role="tab" aria-selected="true">Summary</button>
                  <button type="button" class="crm-tab" role="tab" aria-selected="false">Activity</button>
                  <button type="button" class="crm-tab" role="tab" aria-selected="false">Settings</button>
                </div>
              </div>

              <div class="crm-modal__section" data-overview-body></div>
            </div>

            <div class="crm-modal__footer crm-overview__footer">
              <div class="crm-overview__footer-actions">
                <button type="button" class="crm-btn crm-btn--link crm-overview__ghost" data-duplicate-campaign>Duplicate</button>
                <button type="button" class="crm-btn crm-btn--primary" data-edit-campaign>Edit Campaign</button>
              </div>
            </div>
          </div>
        </div>

        <div class="crm-popup" data-status-popup aria-hidden="true">
          <div class="crm-popup__backdrop" data-status-close></div>
          <div class="crm-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="status-popup-title">
            <button type="button" class="crm-popup__close" aria-label="Close" data-status-close>×</button>
            <h3 class="crm-popup__title" id="status-popup-title" data-status-title>Change Status</h3>
            <div class="crm-popup__options" role="radiogroup" aria-label="Status options">
              <label class="crm-popup__opt"><input type="radio" name="campaignStatus" value="Paused" /> <span class="crm-pill crm-pill--paused">Paused</span></label>
              <label class="crm-popup__opt"><input type="radio" name="campaignStatus" value="Terminated" /> <span class="crm-pill crm-pill--terminated">Terminated</span></label>
              <label class="crm-popup__opt"><input type="radio" name="campaignStatus" value="Archived" /> <span class="crm-pill crm-pill--archived">Archived</span></label>
            </div>
            <div class="crm-popup__actions">
              <button type="button" class="crm-btn crm-btn--outline" data-status-close>Cancel</button>
              <button type="button" class="crm-btn crm-btn--primary" data-status-save>Save</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  function mount(target) {
    // Seed localStorage once so Launch Calendar can use it.
    if (loadCampaigns().length === 0) {
      const parseDmy = (s) => {
        const m = String(s || "").trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
        if (!m) return "";
        const [, dd, mm, yyyy] = m;
        return `${yyyy}-${mm}-${dd}`;
      };
      const seeded = rows.map((r) => ({
        id: r.id,
        campaignName: r.name,
        status: r.status,
        geo: r.geo,
        conv: r.conv,
        channel: "",
        description: "",
        audienceSegment: "",
        startDate: parseDmy(r.created),
        endDate: parseDmy(r.end),
        linkedContent: "",
        contentType: "",
        purpose: "",
        history: [],
      }));
      saveCampaigns(seeded);
    }

    target.innerHTML = markup;

    const root = target.querySelector(".dashboard-layout");
    if (!root) return;

    const modal = root.querySelector("[data-create-campaign-modal]");
    const createBtn = root.querySelector("[data-create-campaign-btn]");
    const saveBtn = root.querySelector("[data-save-campaign]");
    const modalTitle = root.querySelector("#create-campaign-title");

    const overviewModal = root.querySelector("[data-campaign-overview-modal]");
    const overviewTitle = root.querySelector("[data-overview-title]");
    const overviewBody = root.querySelector("[data-overview-body]");

    const statusPopup = root.querySelector("[data-status-popup]");
    const statusTitle = root.querySelector("[data-status-title]");

    let lastFocusedEl = null;

    const filterBtn = root.querySelector("[data-filter-btn]");
    const filterPopover = root.querySelector("[data-filter-popover]");
    const filterInput = filterPopover?.querySelector(".crm-filter__input") ?? null;
    const filterReset = filterPopover?.querySelector("[data-filter-reset]") ?? null;

    let filterPrefix = "";
    let searchQuery = "";
    const searchInput = root.querySelector(".campaign-search__input");
    /** @type {Set<string>} */
    const statusFilters = new Set();
    let geoFilter = "";
    /** @type {"" | "with" | "none"} */
    let activityFilter = "";
    let periodFrom = "";
    let periodTo = "";

    const pillButtons = Array.from(root.querySelectorAll('[data-pill]'));
    const pillPopovers = Array.from(root.querySelectorAll('[data-pill-popover]'));
    /** @type {null | string} */
    let openPill = null;

    const setPillOpen = (pillKey, open) => {
      pillButtons.forEach((btn) => {
        if (btn.getAttribute("data-pill") !== pillKey) return;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      pillPopovers.forEach((pop) => {
        if (pop.getAttribute("data-pill-popover") !== pillKey) return;
        pop.classList.toggle("is-open", open);
        pop.setAttribute("aria-hidden", open ? "false" : "true");
      });
      openPill = open ? pillKey : null;
    };

    const closeAllPills = () => {
      if (!openPill) return;
      setPillOpen(openPill, false);
    };

    const refreshAfterPillChange = () => {
      refreshCampaignTable({ resetPage: true });
    };

    const getPeriodPickerIso = (fieldKey) => {
      return String(
        root.querySelector(`.crm-field[data-field="${cssEscape(fieldKey)}"] .crm-datepicker__value`)?.value ?? "",
      ).trim();
    };

    const setPeriodPickerIso = (fieldKey, nextIso) => {
      const field = root.querySelector(`.crm-field[data-field="${cssEscape(fieldKey)}"]`);
      if (!field) return;
      const hidden = field.querySelector(".crm-datepicker__value");
      const textEl = field.querySelector(".crm-datepicker__text");
      const placeholder = field.querySelector("[data-campaign-datepicker]")?.getAttribute("data-placeholder") || "";
      const iso = String(nextIso ?? "").trim();
      if (hidden) hidden.value = iso;
      if (textEl) {
        textEl.textContent = iso ? campaignIsoToDisplayDmy(iso) : placeholder;
        textEl.classList.toggle("has-value", Boolean(iso));
      }
    };
    /** @type {null | string} */
    let editingCampaignId = null;
    /** @type {null | ReturnType<typeof createTablePagination>} */
    let paginationApi = null;
    const refreshCampaignTable = (opts) => paginationApi?.refresh(opts);

    const getFilteredCampaignsStored = () => {
      const q = normalizeSearchQuery(searchQuery);
      return loadCampaigns().filter((c) => {
        const name = String(c?.campaignName ?? "").toLowerCase();
        if (filterPrefix && !name.startsWith(filterPrefix)) return false;
        if (statusFilters.size > 0 && !statusFilters.has(String(c?.status ?? ""))) return false;
        if (geoFilter && String(c?.geo ?? "") !== geoFilter) return false;
        if (activityFilter) {
          const has = Array.isArray(c?.history) && c.history.length > 0;
          if (activityFilter === "with" && !has) return false;
          if (activityFilter === "none" && has) return false;
        }
        const startIso = String(c?.startDate ?? "").trim();
        if (periodFrom && startIso && startIso < periodFrom) return false;
        if (periodTo && startIso && startIso > periodTo) return false;
        return rowMatchesSearch(q, [
          c.campaignName,
          c.id,
          c.status,
          c.geo,
          c.conv,
          c.channel,
          c.description,
          c.audienceSegment,
          c.linkedContent,
          c.contentType,
          c.purpose,
          campaignIsoToDisplayDmy(c.startDate),
          campaignIsoToDisplayDmy(c.endDate),
        ]);
      });
    };

    const setModalOpen = (open) => {
      if (!modal) return;
      if (!open) closeCampaignDatePickersIn(root);
      modal.classList.toggle("is-open", open);
      modal.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("has-modal", open);
      if (modalTitle) modalTitle.textContent = editingCampaignId ? "Edit Campaign" : "Create Campaign";
      if (open) {
        lastFocusedEl = document.activeElement;
        const firstField = modal.querySelector("input, select, button");
        if (firstField) firstField.focus();
      } else if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }
    };

    const setOverviewOpen = (open) => {
      if (!overviewModal) return;
      overviewModal.classList.toggle("is-open", open);
      overviewModal.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("has-modal", open);
    };

    const setStatusPopupOpen = (open) => {
      if (!statusPopup) return;
      statusPopup.classList.toggle("is-open", open);
      statusPopup.setAttribute("aria-hidden", open ? "false" : "true");
    };

    const getFieldValue = (key) => {
      const el = modal?.querySelector(`[data-field="${key}"]`);
      if (!el) return "";
      return String(el.value ?? "").trim();
    };

    const getDateValue = (key) => {
      const field = modal?.querySelector(`.crm-field[data-field="${key}"]`);
      const val = field?.querySelector?.(".crm-datepicker__value")?.value ?? "";
      return String(val).trim();
    };

    const setFieldValue = (key, nextValue) => {
      const el = modal?.querySelector(`[data-field="${key}"]`);
      if (!el) return;
      el.value = String(nextValue ?? "");
    };

    const setDateValue = (key, iso) => {
      const field = modal?.querySelector(`.crm-field[data-field="${key}"]`);
      if (!field) return;
      const hidden = field.querySelector(".crm-datepicker__value");
      const textEl = field.querySelector(".crm-datepicker__text");
      const placeholder = field.querySelector("[data-campaign-datepicker]")?.getAttribute("data-placeholder") || "";
      const nextIso = String(iso ?? "").trim();
      if (hidden) hidden.value = nextIso;
      if (textEl) {
        const display = nextIso ? campaignIsoToDisplayDmy(nextIso) : placeholder;
        textEl.textContent = display;
        textEl.classList.toggle("has-value", Boolean(nextIso));
      }
    };

    const resetCampaignForm = () => {
      clearFormErrors();
      setFieldValue("campaignName", "");
      setFieldValue("channel", "");
      setFieldValue("description", "");
      setFieldValue("geo", "");
      setFieldValue("audienceSegment", "");
      setDateValue("startDate", "");
      setDateValue("endDate", "");
      setFieldValue("linkedContent", "");
      setFieldValue("contentType", "");
      setFieldValue("purpose", "");
    };

    const fillCampaignForm = (c) => {
      resetCampaignForm();
      setFieldValue("campaignName", c?.campaignName ?? "");
      setFieldValue("channel", c?.channel ?? "");
      setFieldValue("description", c?.description ?? "");
      setFieldValue("geo", c?.geo ?? "");
      setFieldValue("audienceSegment", c?.audienceSegment ?? "");
      setDateValue("startDate", c?.startDate ?? "");
      setDateValue("endDate", c?.endDate ?? "");
      setFieldValue("linkedContent", c?.linkedContent ?? "");
      setFieldValue("contentType", c?.contentType ?? "");
      setFieldValue("purpose", c?.purpose ?? "");
    };

    const clearFormErrors = () => {
      modal?.querySelectorAll(".is-invalid")?.forEach((el) => el.classList.remove("is-invalid"));
    };

    const markInvalid = (el) => {
      if (!el) return;
      el.classList.add("is-invalid");
    };

    const validateCampaignForm = () => {
      clearFormErrors();
      /** @type {Array<HTMLElement>} */
      const invalidEls = [];

      const requiredFields = [
        "campaignName",
        "channel",
        "description",
        "geo",
        "audienceSegment",
        "contentType",
        "purpose",
      ];

      requiredFields.forEach((key) => {
        const el = modal?.querySelector(`[data-field="${key}"]`);
        const val = String(el?.value ?? "").trim();
        if (!val) {
          if (el) markInvalid(el);
          if (el) invalidEls.push(el);
        }
      });

      (["startDate", "endDate"]).forEach((key) => {
        const field = modal?.querySelector(`.crm-field[data-field="${key}"]`);
        const iso = String(field?.querySelector?.(".crm-datepicker__value")?.value ?? "").trim();
        if (!iso) {
          const trigger = field?.querySelector?.(".crm-datepicker__trigger");
          if (trigger) markInvalid(trigger);
          if (trigger) invalidEls.push(trigger);
        }
      });

      if (invalidEls.length > 0) {
        invalidEls[0].focus?.();
        return false;
      }
      return true;
    };

    const generateCampaignId = () => {
      const existing = new Set(loadCampaigns().map((c) => String(c?.id ?? "").trim()).filter(Boolean));

      for (let i = 0; i < 50; i++) {
        const digits = Math.floor(3 + Math.random() * 3); // 3..5
        const min = 10 ** (digits - 1);
        const max = 10 ** digits - 1;
        const n = Math.floor(min + Math.random() * (max - min + 1));
        const id = `CMP-${n}`;
        if (!existing.has(id)) return id;
      }

      return `CMP-${Math.floor(100 + Math.random() * 900)}`;
    };

    const csvEscape = (v) => {
      const s = String(v ?? "");
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const exportCampaignManagerCsv = () => {
      const table = root.querySelector("table.campaign-table--manager");
      if (!table) return;

      const headers = Array.from(table.querySelectorAll("thead th"))
        .slice(0, 7)
        .map((th) => th.textContent.trim() || "");

      const filtered = getFilteredCampaignsStored();
      const rows = filtered.map((c) => {
        const r = campaignStoredToRow(c);
        return [r.name, r.id, r.status, r.geo, r.conv, r.created, r.end];
      });

      const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaigns.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    const formatIsoToDisplay = (iso) => {
      if (!iso) return "";
      const [y, m, d] = iso.split("-").map((n) => Number(n));
      if (!y || !m || !d) return "";
      return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
    };

    const formatNow = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `Today, ${hh}:${mm}`;
    };

    const renderOverviewSummary = (c) => {
      if (!overviewBody || !state.savedCampaign) return;
      const linkedContentEmpty = !c.linkedContent;
      overviewTitle.textContent = c.campaignName || "Campaign";

      return `
        <div class="crm-overview__section">
          <div class="crm-overview__section-label">Campaign Summary</div>
          <div class="crm-overview__summary">
            <div class="crm-overview__grid">
              <div class="crm-overview__row"><span>Campaign Name:</span><b>${escapeHtml(c.campaignName || "-")}</b></div>
              <div class="crm-overview__row"><span>Status:</span><b data-overview-status>${escapeHtml(c.status || "Draft")}</b></div>
              <div class="crm-overview__row"><span>Channel:</span><b>${escapeHtml(c.channel || "-")}</b></div>
              <div class="crm-overview__row"><span>Start Date:</span><b>${escapeHtml(formatIsoToDisplay(c.startDate) || "-")}</b></div>
              <div class="crm-overview__row"><span>End Date:</span><b>${escapeHtml(formatIsoToDisplay(c.endDate) || "-")}</b></div>
              <div class="crm-overview__row"><span>Last Update:</span><b>just now</b></div>
            </div>
            <button type="button" class="crm-overview__change" data-change-status>
              ${changeStatusIcon()} Change Status
            </button>
          </div>
        </div>

        <div class="crm-overview__divider"></div>

        <div class="crm-overview__section">
          <div class="crm-overview__section-label">Description</div>
          <div class="crm-overview__text">${escapeHtml(c.description || "-")}</div>
        </div>

        <div class="crm-overview__divider"></div>

        <div class="crm-overview__section">
          <div class="crm-overview__section-label">Linked Content</div>
          ${
            linkedContentEmpty
              ? `<div class="crm-overview__muted">No content linked.</div>`
              : `
                <div class="crm-overview__linked">
                  <div class="crm-overview__row"><span>Content Name:</span><b>${escapeHtml(c.linkedContent)}</b></div>
                  <div class="crm-overview__row"><span>Content Type:</span><b>${escapeHtml(c.contentType || "-")}</b></div>
                  <div class="crm-overview__row"><span>Purpose:</span><b>${escapeHtml(c.purpose || "-")}</b></div>
                </div>
              `
          }
        </div>
      `;
    };

    const renderOverviewActivity = (c) => {
      const history = Array.isArray(c.history) ? c.history : [];
      const last = history[history.length - 1];
      return `
        <div class="crm-overview__section">
          <div class="crm-overview__section-label">Campaign Activity</div>

          <div class="crm-activity-card">
            <div class="crm-activity-card__head">
              <div class="crm-activity-card__title">Clicks Over Time</div>
              <div class="crm-activity-card__select">Daily <span class="crm-activity-card__caret">⌄</span></div>
            </div>
            <div class="crm-activity-card__meta">
              <span>Average number of clicks per day: <b>188</b></span>
            </div>
            <div class="crm-activity-legend" aria-hidden="true">
              <span><i class="crm-dot crm-dot--last"></i> last week</span>
              <span><i class="crm-dot crm-dot--this"></i> this week</span>
              <span><i class="crm-dot crm-dot--proj"></i> projected</span>
            </div>
            <div class="crm-activity-bars" aria-hidden="true">
              ${[
                ["Mon", 220, 280, 0],
                ["Tue", 280, 320, 0],
                ["Wed", 250, 360, 0],
                ["Thu", 320, 400, 0],
                ["Fri", 300, 0, 340],
                ["Sat", 190, 0, 280],
                ["Sun", 150, 0, 220],
              ]
                .map(
                  ([day, lastW, thisW, proj]) => `
                    <div class="crm-activity-bars__col">
                      <div class="crm-activity-bars__stack">
                        ${lastW ? `<div class="crm-bar crm-bar--last" style="height:${Math.round(lastW / 4)}px"></div>` : ""}
                        ${thisW ? `<div class="crm-bar crm-bar--this" style="height:${Math.round(thisW / 4)}px"></div>` : ""}
                        ${proj ? `<div class="crm-bar crm-bar--proj" style="height:${Math.round(proj / 4)}px"></div>` : ""}
                      </div>
                      <div class="crm-activity-bars__day">${escapeHtml(day)}</div>
                    </div>
                  `,
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="crm-overview__divider"></div>

        <div class="crm-overview__section">
          <div class="crm-overview__section-label">Campaign History</div>
          ${
            history.length === 0
              ? `<div class="crm-overview__muted">No history yet.</div>`
              : `<div class="crm-history">
                  ${history
                    .slice()
                    .reverse()
                    .map(
                      (h) => `
                        <div class="crm-history__item">
                          <div class="crm-history__time">${escapeHtml(h.time)}</div>
                          <div class="crm-history__text"><b>${escapeHtml(c.campaignName || "Campaign")}</b> ${escapeHtml(h.text)}</div>
                        </div>
                      `,
                    )
                    .join("")}
                </div>`
          }
        </div>
      `;
    };

    const renderOverviewSettings = (c) => `
      <div class="crm-overview__section">
        <div class="crm-overview__section-label">Campaign Settings</div>
        <div class="crm-overview__linked">
          <div class="crm-overview__row"><span>Audience:</span><b>${escapeHtml(c.audienceSegment || "-")}</b></div>
          <div class="crm-overview__row"><span>Schedule:</span><b>${escapeHtml(
            [formatIsoToDisplay(c.startDate), formatIsoToDisplay(c.endDate)].filter(Boolean).join(" - ") || "-",
          )}</b></div>
          <div class="crm-overview__row"><span>Campaign purpose:</span><b>${escapeHtml(c.purpose || "-")}</b></div>
        </div>
      </div>
    `;

    const setActiveTab = (tabName) => {
      state.overviewTab = tabName;
      const tabs = overviewModal?.querySelectorAll?.(".crm-tab") ?? [];
      tabs.forEach((btn) => {
        const isActive = btn.textContent.trim() === tabName;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    };

    const renderOverview = () => {
      if (!overviewBody || !state.savedCampaign) return;
      const c = state.savedCampaign;
      overviewTitle.textContent = c.campaignName || "Campaign";
      if (state.overviewTab === "Activity") overviewBody.innerHTML = renderOverviewActivity(c);
      else if (state.overviewTab === "Settings") overviewBody.innerHTML = renderOverviewSettings(c);
      else overviewBody.innerHTML = renderOverviewSummary(c);
    };

    const applyPrefixFilter = (prefixRaw) => {
      filterPrefix = String(prefixRaw ?? "").trim().toLowerCase();
      refreshCampaignTable({ resetPage: true });
    };

    paginationApi = createTablePagination({
      root,
      tableSelector: "table.campaign-table--manager",
      getItems: () => getFilteredCampaignsStored().map(campaignStoredToRow),
      renderItemHtml: (item) => renderRow(item),
      totalLabelText: "Total campaigns:",
    });
    refreshCampaignTable();

    const onSearchInput = () => {
      searchQuery = String(searchInput?.value ?? "");
      refreshCampaignTable({ resetPage: true });
    };
    searchInput?.addEventListener("input", onSearchInput);

    const setFilterOpen = (open) => {
      if (!filterBtn || !filterPopover) return;
      filterPopover.classList.toggle("is-open", open);
      filterPopover.setAttribute("aria-hidden", open ? "false" : "true");
      filterBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && filterInput) {
        filterInput.focus();
        filterInput.select?.();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape" && statusPopup?.classList?.contains("is-open")) {
        event.preventDefault();
        setStatusPopupOpen(false);
        return;
      }
      if (event.key === "Escape" && filterPopover?.classList?.contains("is-open")) {
        event.preventDefault();
        setFilterOpen(false);
        return;
      }
      if (event.key === "Escape" && openPill) {
        event.preventDefault();
        closeAllPills();
        return;
      }
      if (event.key !== "Escape") return;
      if (overviewModal?.classList?.contains("is-open")) {
        event.preventDefault();
        setOverviewOpen(false);
        return;
      }
      if (!modal || !modal.classList.contains("is-open")) return;
      event.preventDefault();
      editingCampaignId = null;
      setModalOpen(false);
    };

    const closeMenu = () => {
      state.openRowId = null;
      root.querySelectorAll("[data-row-menu]").forEach((menu) => menu.classList.remove("is-open"));
    };

    const openMenuFor = (rowId) => {
      closeMenu();
      state.openRowId = rowId;
      const menu = root.querySelector(`[data-row-menu="${cssEscape(rowId)}"]`);
      if (menu) menu.classList.add("is-open");
    };

    const onRootClick = (event) => {
      const exportBtn = event.target.closest?.("[data-export-btn]");
      if (exportBtn) {
        event.preventDefault();
        exportCampaignManagerCsv();
        return;
      }

      const pillBtn = event.target.closest?.("[data-pill]");
      if (pillBtn && root.contains(pillBtn)) {
        event.preventDefault();
        const key = pillBtn.getAttribute("data-pill");
        if (!key) return;
        if (openPill === key) setPillOpen(key, false);
        else {
          closeAllPills();
          setPillOpen(key, true);
        }
        return;
      }

      const pillClose = event.target.closest?.("[data-pill-close]");
      if (pillClose) {
        event.preventDefault();
        const key = pillClose.getAttribute("data-pill-close");
        if (key) setPillOpen(key, false);
        return;
      }

      const pillReset = event.target.closest?.("[data-pill-reset]");
      if (pillReset) {
        event.preventDefault();
        const key = pillReset.getAttribute("data-pill-reset");
        if (!key) return;
        if (key === "status") {
          statusFilters.clear();
          root.querySelectorAll('[data-pill-popover="status"] input[type="checkbox"]').forEach((el) => {
            el.checked = false;
          });
        } else if (key === "geo") {
          geoFilter = "";
          const sel = root.querySelector("[data-geo-select]");
          if (sel) sel.value = "";
        } else if (key === "activity") {
          activityFilter = "";
          const sel = root.querySelector("[data-activity-select]");
          if (sel) sel.value = "";
        } else if (key === "period") {
          periodFrom = "";
          periodTo = "";
          setPeriodPickerIso("periodFrom", "");
          setPeriodPickerIso("periodTo", "");
          closeCampaignDatePickersIn(root);
        }
        refreshAfterPillChange();
        setPillOpen(key, false);
        return;
      }

      const modalClose = event.target.closest?.("[data-modal-close]");
      if (modalClose && modal && modal.classList.contains("is-open")) {
        event.preventDefault();
        editingCampaignId = null;
        setModalOpen(false);
        return;
      }

      const overviewClose = event.target.closest?.("[data-overview-close]");
      if (overviewClose && overviewModal?.classList?.contains("is-open")) {
        event.preventDefault();
        setOverviewOpen(false);
        return;
      }

      const duplicateFromOverview = event.target.closest?.("[data-duplicate-campaign]");
      if (duplicateFromOverview && overviewModal?.classList?.contains("is-open")) {
        event.preventDefault();
        if (state.savedCampaign) {
          const newId = generateCampaignId();
          const dup = {
            ...state.savedCampaign,
            id: newId,
            campaignName: `${state.savedCampaign.campaignName || "Campaign"} (Copy)`,
            history: Array.isArray(state.savedCampaign.history) ? state.savedCampaign.history.slice() : [],
          };
          dup.history.push({ time: formatNow(), text: `was duplicated from ${state.savedCampaign.id}` });
          upsertCampaign(dup);
          refreshCampaignTable({ resetPage: true });
        }
        return;
      }

      const editFromOverview = event.target.closest?.("[data-edit-campaign]");
      if (editFromOverview && overviewModal?.classList?.contains("is-open")) {
        event.preventDefault();
        if (state.savedCampaign?.id) {
          editingCampaignId = String(state.savedCampaign.id);
          fillCampaignForm(state.savedCampaign);
          setOverviewOpen(false);
          setModalOpen(true);
        }
        return;
      }

      const statusClose = event.target.closest?.("[data-status-close]");
      if (statusClose && statusPopup?.classList?.contains("is-open")) {
        event.preventDefault();
        setStatusPopupOpen(false);
        return;
      }

      const statusSave = event.target.closest?.("[data-status-save]");
      if (statusSave) {
        event.preventDefault();
        const next = root.querySelector('input[name="campaignStatus"]:checked')?.value ?? "";
        if (state.savedCampaign && next) {
          state.savedCampaign.status = String(next);
          state.savedCampaign.history = Array.isArray(state.savedCampaign.history) ? state.savedCampaign.history : [];
          state.savedCampaign.history.push({
            time: formatNow(),
            text: `was ${String(next).toLowerCase()}`,
          });
          renderOverview();
          upsertCampaign(state.savedCampaign);
          refreshCampaignTable();
        }
        setStatusPopupOpen(false);
        return;
      }

      const filterClose = event.target.closest?.("[data-filter-close]");
      if (filterClose && filterPopover?.classList?.contains("is-open")) {
        event.preventDefault();
        setFilterOpen(false);
        return;
      }

      const filterResetClick = event.target.closest?.("[data-filter-reset]");
      if (filterResetClick) {
        event.preventDefault();
        if (filterInput) filterInput.value = "";
        applyPrefixFilter("");
        setFilterOpen(false);
        return;
      }

      const filterToggle = event.target.closest?.("[data-filter-btn]");
      if (filterToggle) {
        event.preventDefault();
        setFilterOpen(!filterPopover?.classList?.contains("is-open"));
        return;
      }

      const createCampaign = event.target.closest?.("[data-create-campaign-btn]");
      if (createCampaign) {
        event.preventDefault();
        editingCampaignId = null;
        resetCampaignForm();
        setModalOpen(true);
        return;
      }

      const saveCampaign = event.target.closest?.("[data-save-campaign]");
      if (saveCampaign) {
        event.preventDefault();
        if (!validateCampaignForm()) return;
        if (editingCampaignId) {
          const existing = loadCampaigns().find((c) => String(c?.id) === String(editingCampaignId));
          if (!existing) {
            editingCampaignId = null;
            setModalOpen(false);
            return;
          }

          const updated = {
            ...existing,
            campaignName: getFieldValue("campaignName"),
            channel: getFieldValue("channel"),
            description: getFieldValue("description"),
            geo: getFieldValue("geo"),
            audienceSegment: getFieldValue("audienceSegment"),
            startDate: getDateValue("startDate"),
            endDate: getDateValue("endDate"),
            linkedContent: getFieldValue("linkedContent"),
            contentType: getFieldValue("contentType"),
            purpose: getFieldValue("purpose"),
          };
          updated.history = Array.isArray(updated.history) ? updated.history : [];
          updated.history.push({ time: formatNow(), text: "was edited" });
          upsertCampaign(updated);
          state.savedCampaign = updated;
          refreshCampaignTable();
          renderOverview();
          editingCampaignId = null;
          setModalOpen(false);
          return;
        }

        const campaignName = getFieldValue("campaignName");
        const linkedContent = getFieldValue("linkedContent");
        const newId = generateCampaignId();
        state.savedCampaign = {
          campaignName,
          id: newId,
          channel: getFieldValue("channel"),
          description: getFieldValue("description"),
          geo: getFieldValue("geo"),
          conv: "—",
          audienceSegment: getFieldValue("audienceSegment"),
          startDate: getDateValue("startDate"),
          endDate: getDateValue("endDate"),
          linkedContent,
          contentType: getFieldValue("contentType"),
          purpose: getFieldValue("purpose"),
          status: "Draft",
          history: [],
        };

        upsertCampaign(state.savedCampaign);

        refreshCampaignTable({ resetPage: true });

        setModalOpen(false);
        setActiveTab("Summary");
        renderOverview();
        setOverviewOpen(true);
        return;
      }

      const tabBtn = event.target.closest?.(".crm-tab");
      if (tabBtn && overviewModal?.contains?.(tabBtn)) {
        event.preventDefault();
        setActiveTab(tabBtn.textContent.trim());
        renderOverview();
        return;
      }

      const changeStatus = event.target.closest?.("[data-change-status]");
      if (changeStatus) {
        event.preventDefault();
        const name = state.savedCampaign?.campaignName || "Campaign";
        if (statusTitle) statusTitle.textContent = `Change Status - ${name}`;
        const current = String(state.savedCampaign?.status || "Draft");
        const checked = root.querySelector(`input[name="campaignStatus"][value="${cssEscape(current)}"]`);
        if (checked) checked.checked = true;
        setStatusPopupOpen(true);
        return;
      }

      const dotsBtn = event.target.closest("[data-row-dots]");
      if (dotsBtn) {
        event.preventDefault();
        event.stopPropagation();
        const rowId = dotsBtn.getAttribute("data-row-dots");
        if (!rowId) return;
        if (state.openRowId === rowId) closeMenu();
        else openMenuFor(rowId);
        return;
      }

      const rowActionBtn = event.target.closest?.("[data-row-action][data-row-id]");
      if (rowActionBtn && root.contains(rowActionBtn)) {
        event.preventDefault();
        event.stopPropagation();
        const rowId = String(rowActionBtn.getAttribute("data-row-id") ?? "").trim();
        const action = String(rowActionBtn.getAttribute("data-row-action") ?? "").trim();
        if (!rowId || !action) return;

        const list = loadCampaigns();
        const idx = list.findIndex((c) => String(c?.id ?? "") === rowId);
        const current = idx >= 0 ? list[idx] : null;

        const setStatus = (nextStatus) => {
          if (!current) return;
          const updated = {
            ...current,
            status: nextStatus,
            history: Array.isArray(current.history) ? current.history.slice() : [],
          };
          updated.history.push({ time: formatNow(), text: `was ${String(nextStatus).toLowerCase()}` });
          upsertCampaign(updated);
          if (state.savedCampaign?.id === updated.id) state.savedCampaign = updated;
          refreshCampaignTable();
          renderOverview();
        };

        if (action === "activate") {
          setStatus("Running");
        } else if (action === "pause") {
          setStatus("Paused");
        } else if (action === "terminate-new") {
          setStatus("Terminated");
        } else if (action === "terminate") {
          if (current) {
            const next = list.filter((c) => String(c?.id ?? "") !== rowId);
            saveCampaigns(next);
            if (state.savedCampaign?.id === rowId) state.savedCampaign = null;
            refreshCampaignTable({ resetPage: true });
            setOverviewOpen(false);
          }
        } else if (action === "duplicate") {
          if (current) {
            const newId = generateCampaignId();
            const dup = {
              ...current,
              id: newId,
              campaignName: `${current.campaignName || "Campaign"} (Copy)`,
              history: Array.isArray(current.history) ? current.history.slice() : [],
            };
            dup.history.push({ time: formatNow(), text: `was duplicated from ${current.id}` });
            upsertCampaign(dup);
            refreshCampaignTable({ resetPage: true });
          }
        } else if (action === "edit") {
          if (current) {
            editingCampaignId = rowId;
            fillCampaignForm(current);
            setModalOpen(true);
          }
        }

        closeMenu();
        return;
      }

      if (event.target.closest(".row-menu")) return;

      closeMenu();
    };

    root.addEventListener("click", onRootClick);
    document.addEventListener("keydown", onKeyDown);

    const onFilterInput = () => {
      applyPrefixFilter(filterInput?.value ?? "");
    };
    filterInput?.addEventListener("input", onFilterInput);

    const onDocumentClickForFilter = (event) => {
      if (!target.contains(event.target)) return;
      if (event.target.closest?.("[data-filter-btn]")) return;
      if (event.target.closest?.("[data-filter-popover]")) return;
      setFilterOpen(false);
    };
    document.addEventListener("click", onDocumentClickForFilter, true);

    const onDocumentClickForPills = (event) => {
      if (!openPill) return;
      if (!target.contains(event.target)) return;
      if (event.target.closest?.("[data-pill]")) return;
      if (event.target.closest?.("[data-pill-popover]")) return;
      closeAllPills();
    };
    document.addEventListener("click", onDocumentClickForPills, true);

    const onPillChange = (event) => {
      const statusCb = event.target.closest?.('[data-pill-popover="status"] input[type="checkbox"]');
      if (statusCb) {
        const v = String(statusCb.value ?? "").trim();
        if (!v) return;
        if (statusCb.checked) statusFilters.add(v);
        else statusFilters.delete(v);
        refreshAfterPillChange();
        return;
      }

      const geoSel = event.target.closest?.("[data-geo-select]");
      if (geoSel) {
        geoFilter = String(geoSel.value ?? "").trim();
        refreshAfterPillChange();
        return;
      }

      const activitySel = event.target.closest?.("[data-activity-select]");
      if (activitySel) {
        activityFilter = String(activitySel.value ?? "").trim();
        refreshAfterPillChange();
        return;
      }

      const fromEl = event.target.closest?.("[data-period-from]");
      const toEl = event.target.closest?.("[data-period-to]");
      if (fromEl || toEl) {
        // handled by crm-datepicker click handler below
      }
    };
    root.addEventListener("input", onPillChange);
    root.addEventListener("change", onPillChange);

    const onPillDatepickerClick = (event) => {
      const dayBtn = event.target.closest?.(".crm-datepicker__day");
      if (!dayBtn || !root.contains(dayBtn)) return;
      const field = dayBtn.closest?.('.crm-field[data-field="periodFrom"], .crm-field[data-field="periodTo"]');
      if (!field) return;
      // allow datepicker to sync hidden values first
      queueMicrotask(() => {
        periodFrom = getPeriodPickerIso("periodFrom");
        periodTo = getPeriodPickerIso("periodTo");
        refreshAfterPillChange();
      });
    };
    root.addEventListener("click", onPillDatepickerClick);

    const onDocumentClickCapture = (event) => {
      if (!target.contains(event.target)) return;
      if (event.target.closest("[data-row-dots]")) return;
      if (event.target.closest(".row-menu")) return;
      closeMenu();
    };

    document.addEventListener(
      "click",
      onDocumentClickCapture,
      { capture: true },
    );

    const disposeDatePickers = mountCampaignDatePickers(root);

    cleanup = () => {
      searchInput?.removeEventListener("input", onSearchInput);
      paginationApi?.destroy();
      paginationApi = null;
      disposeDatePickers();
      root.removeEventListener("click", onRootClick);
      document.removeEventListener("keydown", onKeyDown);
      filterInput?.removeEventListener("input", onFilterInput);
      document.removeEventListener("click", onDocumentClickForFilter, true);
      document.removeEventListener("click", onDocumentClickForPills, true);
      root.removeEventListener("input", onPillChange);
      root.removeEventListener("change", onPillChange);
      root.removeEventListener("click", onPillDatepickerClick);
      document.documentElement.classList.remove("has-modal");
      document.removeEventListener("click", onDocumentClickCapture, { capture: true });
      cleanup = null;
    };
  }

  return {
    mount,
    unmount() {
      if (typeof cleanup === "function") cleanup();
    },
  };
}

function row(name, id, status, geo, conv, created, end) {
  return { name, id, status, geo, conv, created, end };
}

function renderRow(item) {
  const rowId = item.id;
  return `
    <tr data-campaign-name="${escapeHtmlAttr(item.name)}">
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.id)}</td>
      <td>${statusBadge(item.status)}</td>
      <td>${escapeHtml(item.geo)}</td>
      <td>${escapeHtml(item.conv)}</td>
      <td>${escapeHtml(item.created)}</td>
      <td>${escapeHtml(item.end)}</td>
      <td class="campaign-table__actions">
        <div class="row-actions">
          <button type="button" class="dots-btn" aria-label="Open actions" data-row-dots="${escapeHtml(rowId)}">
            ${dotsIcon()}
          </button>
          <div class="row-menu" data-row-menu="${escapeHtml(rowId)}" role="menu" aria-label="Row actions">
            <button type="button" role="menuitem" data-row-action="activate" data-row-id="${escapeHtmlAttr(
              rowId,
            )}"><span class="row-menu__icon">${menuActivateIcon()}</span>Activate</button>
            <button type="button" role="menuitem" data-row-action="pause" data-row-id="${escapeHtmlAttr(
              rowId,
            )}"><span class="row-menu__icon">${menuPauseIcon()}</span>Pause</button>
            <button type="button" role="menuitem" data-row-action="duplicate" data-row-id="${escapeHtmlAttr(
              rowId,
            )}"><span class="row-menu__icon">${menuDuplicateIcon()}</span>Duplicate</button>
            <button type="button" role="menuitem" data-row-action="edit" data-row-id="${escapeHtmlAttr(rowId)}">Edit</button>
            <button type="button" role="menuitem" class="is-danger" data-row-action="terminate" data-row-id="${escapeHtmlAttr(
              rowId,
            )}">Terminate</button>
            <button type="button" role="menuitem" class="is-danger" data-row-action="terminate-new" data-row-id="${escapeHtmlAttr(
              rowId,
            )}">Terminate New Entries</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function statusBadge(status) {
  const key = String(status).toLowerCase().replace(/\s+/g, "-");
  return `<span class="status-badge status-badge--${key}">${escapeHtml(status)}</span>`;
}

function cssEscape(v) {
  return String(v).replace(/"/g, '\\"');
}

function dotsIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`;
}

function searchIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/></svg>`;
}

function filterIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
  <path d="M10.5563 0C10.9944 0.000513872 11.423 0.128005 11.7907 0.366211C12.1583 0.604429 12.4501 0.943185 12.6296 1.34277C12.809 1.74248 12.8687 2.18603 12.8024 2.61914C12.7361 3.05214 12.5462 3.45646 12.2555 3.78418L8.16472 8.38867V13.417C8.16464 13.5716 8.10315 13.7198 7.99383 13.8291C7.88446 13.9384 7.73634 14 7.58172 14C7.45571 14 7.33299 13.9593 7.23211 13.8838L4.89812 12.1338C4.82568 12.0795 4.76675 12.0087 4.72625 11.9277C4.6858 11.8468 4.66478 11.7574 4.66472 11.667V8.38867L0.571951 3.78418C0.28137 3.45632 0.0921444 3.05125 0.026053 2.61816C-0.0400383 2.18499 0.0202267 1.74146 0.199881 1.3418C0.379551 0.942318 0.671035 0.603263 1.03875 0.365234C1.4065 0.127221 1.83507 0.000316821 2.27312 0H10.5563ZM2.27312 1.16699C2.05997 1.16736 1.85145 1.22886 1.67254 1.34473C1.49356 1.46065 1.35183 1.62585 1.26433 1.82031C1.17686 2.01475 1.14743 2.2306 1.17937 2.44141C1.21136 2.652 1.30303 2.84912 1.44402 3.00879L5.68426 7.7793C5.779 7.88607 5.83176 8.02424 5.83172 8.16699V11.375L6.99871 12.25V8.16699C6.99883 8.02417 7.05122 7.88599 7.14617 7.7793L11.3854 3.00977C11.5268 2.84998 11.619 2.65233 11.6511 2.44141C11.6831 2.2305 11.6536 2.01486 11.5661 1.82031C11.4786 1.6258 11.3369 1.46066 11.1579 1.34473C10.9788 1.22878 10.7697 1.16722 10.5563 1.16699H2.27312Z" fill="#3A3A3A"/>
</svg>`;
}

function exportIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.71777 0C7.80802 0 8.83372 0.425122 9.60547 1.19629L11.6377 3.22949C12.4089 4.00065 12.834 5.02481 12.834 6.11621V11.083C12.834 12.6912 11.5261 13.9998 9.91797 14H4.08398C2.47589 13.9998 1.16797 12.6911 1.16797 11.083V2.91699C1.16797 1.30885 2.47589 0.000181475 4.08398 0H6.71777ZM4.08398 1.16699C3.1193 1.16717 2.33398 1.95227 2.33398 2.91699V11.084C2.33402 12.0487 3.11933 12.8338 4.08398 12.834H9.91797C10.8826 12.8338 11.6679 12.0487 11.668 11.084V6.11621C11.668 6.02114 11.663 5.92633 11.6543 5.83301H8.75098C7.78615 5.833 7.00098 5.04784 7.00098 4.08301V1.17969C6.90766 1.17094 6.81284 1.16699 6.71777 1.16699H4.08398ZM7.00098 7.00098C7.32356 7.00098 7.58398 7.26198 7.58398 7.58398V10.1494L8.33887 9.39551C8.56695 9.16742 8.935 9.16742 9.16309 9.39551C9.39116 9.62301 9.39117 9.99165 9.16309 10.2197L8.22266 11.1611C7.88607 11.4977 7.44314 11.667 7.00098 11.667C6.55881 11.667 6.11588 11.4977 5.7793 11.1611L4.83887 10.2197C4.61079 9.99165 4.6108 9.62301 4.83887 9.39551C5.06695 9.16742 5.435 9.16742 5.66309 9.39551L6.41797 10.1494V7.58398C6.41797 7.26199 6.6784 7.00098 7.00098 7.00098ZM8.16699 4.08398C8.16703 4.40524 8.42821 4.66677 8.75 4.66699H11.2822C11.1551 4.44554 10.9988 4.23945 10.8135 4.05469L10.8125 4.05371L8.78027 2.02051C8.59478 1.83502 8.38865 1.67794 8.16699 1.55078V4.08398Z" fill="#3A3A3A"/>
</svg>`;
}

function geoIcon() {
  return `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 22s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/></svg>`;
}

function activityIcon() {
  return `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 12a8 8 0 1 0 16 0"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 4v8l5 3"/></svg>`;
}

function periodIcon() {
  return `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M7 3v3M17 3v3M4 9h16"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>`;
}

function sortIcon() {
  return `<svg viewBox="0 0 24 24" focusable="false"><path d="M7 10l5-5 5 5H7zm10 4l-5 5-5-5h10z"/></svg>`;
}

function menuActivateIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clip-path="url(#clip0_291_30411)">
    <path d="M12.2963 7.5915L8.40225 5.45925C7.8975 5.175 7.2975 5.18025 6.79875 5.472C6.2985 5.7645 6.00075 6.28425 6.00075 6.86325V11.1375C6.00075 11.7165 6.2985 12.2362 6.79875 12.5287C7.05375 12.678 7.33425 12.7515 7.614 12.7515C7.8825 12.7515 8.151 12.6833 8.39475 12.546L12.3038 10.4055C12.819 10.116 13.1257 9.591 13.1257 9.00075C13.1257 8.4105 12.819 7.8855 12.297 7.59225L12.2963 7.5915ZM11.5755 9.09375L7.6665 11.235C7.65225 11.2425 7.60875 11.2665 7.55625 11.2343C7.50075 11.202 7.50075 11.154 7.50075 11.1383V6.864C7.50075 6.84825 7.50075 6.80025 7.55625 6.768C7.5765 6.756 7.59525 6.75225 7.61175 6.75225C7.63875 6.75225 7.6605 6.76425 7.674 6.77175L11.568 8.90475C11.5822 8.913 11.625 8.937 11.625 9.00225C11.625 9.0675 11.5815 9.0915 11.5755 9.096V9.09375ZM9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM9 16.5C4.8645 16.5 1.5 13.1355 1.5 9C1.5 4.8645 4.8645 1.5 9 1.5C13.1355 1.5 16.5 4.8645 16.5 9C16.5 13.1355 13.1355 16.5 9 16.5Z" fill="#1B1B1B"/>
  </g>
  <defs>
    <clipPath id="clip0_291_30411">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>`;
}

function menuPauseIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clip-path="url(#clip0_340_29634)">
    <path d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM9 16.5C4.8645 16.5 1.5 13.1355 1.5 9C1.5 4.8645 4.8645 1.5 9 1.5C13.1355 1.5 16.5 4.8645 16.5 9C16.5 13.1355 13.1355 16.5 9 16.5ZM6.75 6H8.25V12H6.75V6ZM9.75 6H11.25V12H9.75V6Z" fill="#1B1B1B"/>
  </g>
  <defs>
    <clipPath id="clip0_340_29634">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>`;
}

function menuDuplicateIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <g clip-path="url(#clip0_291_30414)">
    <path d="M14.25 0H9.75C7.68225 0 6 1.68225 6 3.75V8.25C6 10.3177 7.68225 12 9.75 12H14.25C16.3177 12 18 10.3177 18 8.25V3.75C18 1.68225 16.3177 0 14.25 0ZM16.5 8.25C16.5 9.4905 15.4905 10.5 14.25 10.5H9.75C8.5095 10.5 7.5 9.4905 7.5 8.25V3.75C7.5 2.5095 8.5095 1.5 9.75 1.5H14.25C15.4905 1.5 16.5 2.5095 16.5 3.75V8.25ZM12 14.25C12 16.3177 10.3177 18 8.25 18H3.75C1.68225 18 0 16.3177 0 14.25V9.75C0 7.68225 1.68225 6 3.75 6C4.16475 6 4.5 6.336 4.5 6.75C4.5 7.164 4.16475 7.5 3.75 7.5C2.5095 7.5 1.5 8.5095 1.5 9.75V14.25C1.5 15.4905 2.5095 16.5 3.75 16.5H8.25C9.4905 16.5 10.5 15.4905 10.5 14.25C10.5 13.836 10.8352 13.5 11.25 13.5C11.6648 13.5 12 13.836 12 14.25Z" fill="#1B1B1B"/>
  </g>
  <defs>
    <clipPath id="clip0_291_30414">
      <rect width="18" height="18" fill="white"/>
    </clipPath>
  </defs>
</svg>`;
}

function changeStatusIcon() {
  return `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
    <path fill="none" stroke="currentColor" stroke-width="1.6" d="M20 6v6h-6M4 18v-6h6"/>
    <path fill="none" stroke="currentColor" stroke-width="1.6" d="M20 12a8 8 0 0 0-14.2-4.9L4 9M4 12a8 8 0 0 0 14.2 4.9L20 15"/>
  </svg>`;
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