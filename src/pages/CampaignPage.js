import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml } from "../utils/escapeHtml.js";


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
          <button type="button" class="dashboard-header__action" data-create-campaign-btn>+ Create Campaign</button>
        </header>

        <section class="campaign-toolbar" aria-label="Campaign actions">
          <div class="campaign-search">
            <span class="campaign-search__icon" aria-hidden="true">${searchIcon()}</span>
            <input
              class="campaign-search__input"
              type="search"
              placeholder="Search by ID or Campaign Name"
              aria-label="Search campaigns"
            />
          </div>

          <div class="campaign-toolbar__actions">
            <button type="button" class="ghost-btn" data-filter-btn aria-haspopup="dialog" aria-expanded="false">
              <span class="ghost-btn__icon" aria-hidden="true">${filterIcon()}</span>
              Filter
            </button>
            <button type="button" class="ghost-btn">
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
              <tbody>
                ${rows.map(renderRow).join("")}
              </tbody>
            </table>
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
                  <input class="crm-field__input" type="text" placeholder="Enter Campaign Name" />
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">Channel <span class="crm-field__req">*</span></span>
                  <select class="crm-field__input">
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
                  <input class="crm-field__input" type="text" placeholder="Enter description" />
                </label>
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Geo Targeting & Audience</div>
              <div class="crm-form-grid">
                <label class="crm-field">
                  <span class="crm-field__label">Geo</span>
                  <select class="crm-field__input">
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
                  <select class="crm-field__input">
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
                <label class="crm-field">
                  <span class="crm-field__label">Start Date <span class="crm-field__req">*</span></span>
                  <input class="crm-field__input" type="date" />
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">End Date</span>
                  <input class="crm-field__input" type="date" />
                </label>
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Linked Content</div>
              <div class="crm-form-grid">
                <label class="crm-field crm-field--full">
                  <span class="crm-field__label">Linked Content</span>
                  <select class="crm-field__input">
                    <option value="" selected disabled>Select Content</option>
                    <option>Homepage banner – Spring</option>
                    <option>Summer Engagement Boost</option>
                    <option>Welcome Message</option>
                    <option>Back-to-School Special</option>
                  </select>
                </label>
              </div>
            </div>

            <div class="crm-modal__footer">
              <div class="crm-modal__actions">
                <button type="button" class="crm-btn crm-btn--link" data-modal-close>Cancel</button>
                <button type="button" class="crm-btn crm-btn--disabled" aria-disabled="true">Save Campaign</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  function mount(target) {
    target.innerHTML = markup;

    const root = target.querySelector(".dashboard-layout");
    if (!root) return;

    const modal = root.querySelector("[data-create-campaign-modal]");
    const createBtn = root.querySelector("[data-create-campaign-btn]");
    let lastFocusedEl = null;

    const filterBtn = root.querySelector("[data-filter-btn]");
    const filterPopover = root.querySelector("[data-filter-popover]");
    const filterInput = filterPopover?.querySelector(".crm-filter__input") ?? null;
    const filterReset = filterPopover?.querySelector("[data-filter-reset]") ?? null;

    const setModalOpen = (open) => {
      if (!modal) return;
      modal.classList.toggle("is-open", open);
      modal.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("has-modal", open);
      if (open) {
        lastFocusedEl = document.activeElement;
        const firstField = modal.querySelector("input, select, button");
        if (firstField) firstField.focus();
      } else if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }
    };

    const applyPrefixFilter = (prefixRaw) => {
      const prefix = String(prefixRaw ?? "").trim().toLowerCase();
      root.querySelectorAll("tbody tr[data-campaign-name]").forEach((tr) => {
        const name = String(tr.getAttribute("data-campaign-name") ?? "").toLowerCase();
        const show = prefix === "" ? true : name.startsWith(prefix);
        tr.toggleAttribute("hidden", !show);
      });
    };

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
      if (event.key === "Escape" && filterPopover?.classList?.contains("is-open")) {
        event.preventDefault();
        setFilterOpen(false);
        return;
      }
      if (event.key !== "Escape") return;
      if (!modal || !modal.classList.contains("is-open")) return;
      event.preventDefault();
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
      const modalClose = event.target.closest?.("[data-modal-close]");
      if (modalClose && modal && modal.classList.contains("is-open")) {
        event.preventDefault();
        setModalOpen(false);
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
        setModalOpen(true);
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

    cleanup = () => {
      root.removeEventListener("click", onRootClick);
      document.removeEventListener("keydown", onKeyDown);
      filterInput?.removeEventListener("input", onFilterInput);
      document.removeEventListener("click", onDocumentClickForFilter, true);
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
    <tr data-campaign-name="${escapeHtml(item.name)}">
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
            <button type="button" role="menuitem"><span class="row-menu__icon">${menuActivateIcon()}</span>Activate</button>
            <button type="button" role="menuitem"><span class="row-menu__icon">${menuPauseIcon()}</span>Pause</button>
            <button type="button" role="menuitem"><span class="row-menu__icon">${menuDuplicateIcon()}</span>Duplicate</button>
            <button type="button" role="menuitem" class="is-danger">Terminate</button>
            <button type="button" role="menuitem" class="is-danger">Terminate New Entries</button>
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