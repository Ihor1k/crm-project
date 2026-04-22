import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml, escapeHtmlAttr } from "../utils/escapeHtml.js";
import { loadAudienceSegments, saveAudienceSegments, upsertAudienceSegment } from "../utils/crmStore.js";
import { createTablePagination, paginationBarHtml } from "../utils/tablePagination.js";
import { normalizeSearchQuery, rowMatchesSearch } from "../utils/searchFilter.js";

export function AudiencePage({ currentRoute = "/audience" } = {}) {

  const isDashboard = currentRoute === "/" || currentRoute === "/dashboard";
  const isCampaigns = currentRoute === "/campaigns";
  const isAudience = currentRoute === "/audience";
  const isContentLibrary = currentRoute === "/content-library";
  const isLaunchCalendar = currentRoute === "/launch-calendar";
  const isExperiments = currentRoute === "/experiments";
  const isReports = currentRoute === "/reports";
  const isSettings = currentRoute === "/settings";
  const defaultRows = [
    row("New Users", "Users who signed up in the last 30 days", "12 400"),
    row("Returning Users", "Users with at least one previous session", "8 950"),
    row("Active Users", "Users who interacted with the platform in the last 7 days", "4 234"),
    row("High-value Users", "Users with the highest purchase or engagement value", "2 763"),
    row("Power Users", "Highly engaged users with frequent activity", "948"),
    row("Churn-risk Users", "Users whose activity dropped significantly in the last 14 days", "1 382"),
    row("Newsletter Subscribers", "Users subscribed to marketing emails", "6 210"),
    row("Recent Purchasers", "Users who made a purchase in the last 30 days", "1 905"),
    row("Cart Abandoners", "Users who added items to cart but didn’t complete checkout", "2 118"),
  ];

  const seededSegments = () =>
    defaultRows.map((r, idx) => ({
      id: `SEG-${String(idx + 1).padStart(3, "0")}`,
      name: r.name,
      description: r.description,
      size: r.size,
      definition: "This segment represents a predefined group of users used for campaign targeting.",
      updatedAt: Date.now(),
    }));

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
            <button type="button" class="ghost-btn" data-filter-btn aria-haspopup="dialog" aria-expanded="false">
              <span class="ghost-btn__icon" aria-hidden="true">${filterIcon()}</span>
              Filter
            </button>
            <div class="crm-filter" data-filter-popover aria-hidden="true">
              <div class="crm-filter__title">Filter</div>
              <label class="crm-filter__field">
                <span class="crm-filter__label">Segment name starts with</span>
                <input class="crm-filter__input" type="text" inputmode="text" placeholder="e.g. N" maxlength="20" />
              </label>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-filter-reset>All</button>
                <button type="button" class="crm-filter__close" data-filter-close>Close</button>
              </div>
            </div>
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
              <tbody></tbody>
            </table>

            ${paginationBarHtml("Total campaigns:")}
          </div>
        </section>

        <div class="crm-modal" data-segment-modal aria-hidden="true">
          <div class="crm-modal__backdrop" data-segment-close></div>
          <div class="crm-modal__dialog crm-overview" role="dialog" aria-modal="true" aria-labelledby="segment-title">
            <div class="crm-modal__head">
              <div>
                <h2 class="crm-modal__title" id="segment-title" data-seg-title>Segment</h2>
                <p class="crm-modal__subtitle">Audience segment details</p>
              </div>
              <button type="button" class="crm-modal__close" aria-label="Close" data-segment-close>×</button>
            </div>

            <div class="crm-overview__scroll">
              <div class="crm-modal__section">
                <div class="crm-modal__section-label">Segment Details</div>
                <div class="crm-form-grid">
                  <label class="crm-field">
                    <span class="crm-field__label">Segment Name <span class="crm-field__req">*</span></span>
                    <input class="crm-field__input" type="text" data-seg-name />
                  </label>
                  <label class="crm-field">
                    <span class="crm-field__label">Estimated audience size <span class="crm-field__req">*</span></span>
                    <input class="crm-field__input" type="text" inputmode="numeric" data-seg-size />
                  </label>
                  <label class="crm-field crm-field--full">
                    <span class="crm-field__label">Description</span>
                    <input class="crm-field__input" type="text" data-seg-desc />
                  </label>
                </div>
              </div>

              <div class="crm-modal__divider"></div>

              <div class="crm-modal__section">
                <div class="crm-modal__section-label">Segment Definition</div>
                <div class="crm-overview__text" data-seg-def></div>
                <div class="crm-hint">
                  <div class="crm-hint__title">Usage hint:</div>
                  <div class="crm-hint__text">This segment can be selected during campaign setup.</div>
                </div>
              </div>
            </div>

            <div class="crm-modal__footer crm-overview__footer">
              <div class="crm-overview__footer-actions">
                <button type="button" class="crm-btn crm-btn--primary" data-seg-edit>Edit</button>
                <button type="button" class="crm-btn crm-btn--primary" data-seg-save hidden>Save</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  let cleanup = null;

  return {
    mount(target) {
      target.innerHTML = markup;

      const root = target.querySelector(".dashboard-layout");
      if (!root) return;

      const mergeAudienceSegments = () => {
        const stored = loadAudienceSegments();
        const seed = seededSegments();

        if (!stored.length) {
          saveAudienceSegments(seed);
          return seed;
        }

        const byId = new Map(stored.map((s) => [s?.id, s]));
        let changed = false;
        for (const seg of seed) {
          if (!byId.has(seg.id)) {
            byId.set(seg.id, seg);
            changed = true;
          }
        }

        const merged = Array.from(byId.values()).sort((a, b) => {
          const ai = Number(String(a?.id ?? "").replace(/\D+/g, "")) || 0;
          const bi = Number(String(b?.id ?? "").replace(/\D+/g, "")) || 0;
          return ai - bi;
        });

        if (changed) saveAudienceSegments(merged);
        return merged;
      };

      let searchQuery = "";
      const searchInput = root.querySelector(".campaign-search__input");
      let filterPrefix = "";
      const filterBtn = root.querySelector("[data-filter-btn]");
      const filterPopover = root.querySelector("[data-filter-popover]");
      const filterInput = filterPopover?.querySelector(".crm-filter__input") ?? null;

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

      const applyPrefixFilter = (prefixRaw) => {
        filterPrefix = String(prefixRaw ?? "").trim().toLowerCase();
        refreshAudienceTable({ resetPage: true });
      };

      /** @type {null | ReturnType<typeof createTablePagination>} */
      let paginationApi = null;
      const refreshAudienceTable = (opts) => paginationApi?.refresh(opts);

      paginationApi = createTablePagination({
        root,
        tableSelector: "table.audience-table",
        getItems: () => {
          const q = normalizeSearchQuery(searchQuery);
          return mergeAudienceSegments().filter((seg) => {
            const nameNorm = String(seg.name ?? "").toLowerCase();
            if (filterPrefix && !nameNorm.startsWith(filterPrefix)) return false;
            return rowMatchesSearch(q, [seg.name, seg.description, seg.size, seg.id]);
          });
        },
        renderItemHtml: (item) => renderRow(item),
        totalLabelText: "Total campaigns:",
      });
      refreshAudienceTable();

      const onSearchInput = () => {
        searchQuery = String(searchInput?.value ?? "");
        refreshAudienceTable({ resetPage: true });
      };
      searchInput?.addEventListener("input", onSearchInput);

      const onFilterInput = () => {
        applyPrefixFilter(filterInput?.value ?? "");
      };
      filterInput?.addEventListener("input", onFilterInput);

      const modal = root.querySelector("[data-segment-modal]");
      const titleEl = root.querySelector("[data-seg-title]");
      const nameEl = root.querySelector("[data-seg-name]");
      const sizeEl = root.querySelector("[data-seg-size]");
      const descEl = root.querySelector("[data-seg-desc]");
      const defEl = root.querySelector("[data-seg-def]");
      const editBtn = root.querySelector("[data-seg-edit]");
      const saveBtn = root.querySelector("[data-seg-save]");

      /** @type {null | {id:string,name:string,description:string,size:string,definition:string,updatedAt:number}} */
      let current = null;
      let editing = false;

      const setModalOpen = (open) => {
        if (!modal) return;
        modal.classList.toggle("is-open", open);
        modal.setAttribute("aria-hidden", open ? "false" : "true");
        document.documentElement.classList.toggle("has-modal", open);
        if (!open) setEditing(false);
      };

      const setEditing = (on) => {
        editing = on;
        const ro = !editing;
        if (nameEl) nameEl.readOnly = ro;
        if (sizeEl) sizeEl.readOnly = ro;
        if (descEl) descEl.readOnly = ro;
        if (editBtn) editBtn.hidden = editing;
        if (saveBtn) saveBtn.hidden = !editing;
      };

      const fill = (seg) => {
        current = seg;
        if (titleEl) titleEl.textContent = seg.name;
        if (nameEl) nameEl.value = seg.name || "";
        if (sizeEl) sizeEl.value = seg.size || "";
        if (descEl) descEl.value = seg.description || "";
        if (defEl) defEl.textContent = seg.definition || "";
      };

      const clearErrors = () => {
        root.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
      };

      const validate = () => {
        clearErrors();
        let ok = true;
        if (!String(nameEl?.value ?? "").trim()) {
          nameEl?.classList.add("is-invalid");
          ok = false;
        }
        if (!String(sizeEl?.value ?? "").trim()) {
          sizeEl?.classList.add("is-invalid");
          ok = false;
        }
        return ok;
      };

      const onClick = (event) => {
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

        const close = event.target.closest?.("[data-segment-close]");
        if (close && modal?.classList.contains("is-open")) {
          event.preventDefault();
          setModalOpen(false);
          return;
        }

        const row = event.target.closest?.("tr[data-seg-id]");
        if (row && root.contains(row)) {
          const id = row.getAttribute("data-seg-id");
          const segs = loadAudienceSegments();
          const seg = segs.find((s) => s.id === id);
          if (seg) {
            fill(seg);
            setEditing(false);
            setModalOpen(true);
          }
          return;
        }

        const edit = event.target.closest?.("[data-seg-edit]");
        if (edit) {
          event.preventDefault();
          setEditing(true);
          nameEl?.focus?.();
          return;
        }

        const save = event.target.closest?.("[data-seg-save]");
        if (save) {
          event.preventDefault();
          if (!current) return;
          if (!validate()) return;
          const updated = {
            ...current,
            name: String(nameEl?.value ?? "").trim(),
            size: String(sizeEl?.value ?? "").trim(),
            description: String(descEl?.value ?? "").trim(),
            updatedAt: Date.now(),
          };
          upsertAudienceSegment(updated);
          fill(updated);
          refreshAudienceTable();
          setEditing(false);
        }
      };

      const onKeyDown = (event) => {
        if (event.key !== "Escape") return;
        if (modal?.classList.contains("is-open")) {
          event.preventDefault();
          setModalOpen(false);
          return;
        }
        if (filterPopover?.classList.contains("is-open")) {
          event.preventDefault();
          setFilterOpen(false);
        }
      };

      const onDocumentClickForFilter = (event) => {
        if (!root.contains(event.target)) return;
        if (event.target.closest?.("[data-filter-btn]")) return;
        if (event.target.closest?.("[data-filter-popover]")) return;
        setFilterOpen(false);
      };

      root.addEventListener("click", onClick);
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("click", onDocumentClickForFilter, true);
      setEditing(false);

      cleanup = () => {
        searchInput?.removeEventListener("input", onSearchInput);
        filterInput?.removeEventListener("input", onFilterInput);
        paginationApi?.destroy();
        paginationApi = null;
        root.removeEventListener("click", onClick);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("click", onDocumentClickForFilter, true);
        document.documentElement.classList.remove("has-modal");
      };
    },
    unmount() {
      if (typeof cleanup === "function") cleanup();
      cleanup = null;
    },
  };
}



function row(name, description, size) {
  return { name, description, size };
}

function renderRow(item) {
  const id = item.id ?? `SEG-${Math.floor(100 + Math.random() * 90000)}`;
  return `
    <tr data-seg-id="${escapeHtmlAttr(id)}" style="cursor:pointer;">
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