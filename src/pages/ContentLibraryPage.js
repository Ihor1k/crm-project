import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml, escapeHtmlAttr } from "../utils/escapeHtml.js";
import { deleteContentItem, loadContentItems, saveContentItems, upsertContentItem } from "../utils/crmStore.js";
import { createTablePagination, paginationBarHtml } from "../utils/tablePagination.js";
import { normalizeSearchQuery, rowMatchesSearch } from "../utils/searchFilter.js";
import contentLibraryImg1 from "../images/content-library-1.png";
import contentLibraryImg2 from "../images/content-library-2.png";
import contentLibraryImg3 from "../images/content-library-3.png";
import contentLibraryImg4 from "../images/content-library-4.png";
import modalImg from "../images/modal-img.png"


export function ContentLibraryPage({ currentRoute = "/content-library" } = {}) {
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
    savedContent: null,
  };

  let cleanup = null;

  const rows = [
    row("Homepage banner – Spring", "Banner", "Active", contentLibraryImg1),
    row("Summer Engagement Boost", "Card", "Active", contentLibraryImg2),
    row("Welcome Message", "Text", "Active", contentLibraryImg3),
    row("Back-to-School Special", "Text", "Inactive", contentLibraryImg4),
    row("Spring Growth Campaign", "Banner", "Active", contentLibraryImg1),
    row("Beta Access Promotion", "Banner", "Inactive", contentLibraryImg2),
    row("Re-Engagement Campaign 2025", "Email", "Inactive", contentLibraryImg3),
    row("Black Friday Lead Surge", "Email", "Active", contentLibraryImg4),
    row("Homepage banner – Spring", "Banner", "Active", contentLibraryImg1),
    row("Summer Engagement Boost", "Card", "Active", contentLibraryImg2),
    row("Welcome Message", "Text", "Active", contentLibraryImg3),
    row("Back-to-School Special", "Text", "Inactive", contentLibraryImg4),
    row("Spring Growth Campaign", "Banner", "Active", contentLibraryImg1),
    row("Beta Access Promotion", "Banner", "Inactive", contentLibraryImg2),
    row("Re-Engagement Campaign 2025", "Email", "Inactive", contentLibraryImg3),
    row("Black Friday Lead Surge", "Email", "Active", contentLibraryImg4),
    row("Homepage banner – Spring", "Banner", "Active", contentLibraryImg1),
    row("Summer Engagement Boost", "Card", "Active", contentLibraryImg2),
    row("Welcome Message", "Text", "Active", contentLibraryImg3),
    row("Back-to-School Special", "Text", "Inactive", contentLibraryImg4),
    row("Spring Growth Campaign", "Banner", "Active", contentLibraryImg1),
    row("Beta Access Promotion", "Banner", "Inactive", contentLibraryImg2),
    row("Re-Engagement Campaign 2025", "Email", "Inactive", contentLibraryImg3),
    row("Black Friday Lead Surge", "Email", "Active", contentLibraryImg4),
  ].map((r, idx) => ({ ...r, id: `CL-${String(idx + 1).padStart(3, "0")}` }));

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
            <h1>Content Library</h1>
            <p>Manage reusable content items</p>
          </div>
          <button type="button" class="dashboard-header__action" data-create-content-btn>+ Create Content</button>
        </header>

        <section class="campaign-toolbar" aria-label="Content Library actions">
          <div class="campaign-search">
            <span class="campaign-search__icon" aria-hidden="true">${searchIcon()}</span>
            <input class="campaign-search__input" type="search" placeholder="Search" aria-label="Search content" />
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
                <span class="crm-filter__label">Content name starts with</span>
                <input class="crm-filter__input" type="text" inputmode="text" placeholder="e.g. H" maxlength="20" />
              </label>
              <div class="crm-filter__actions">
                <button type="button" class="crm-filter__reset" data-filter-reset>All</button>
                <button type="button" class="crm-filter__close" data-filter-close>Close</button>
              </div>
            </div>
          </div>
        </section>

        <section class="panel campaign-panel" aria-label="Content table">
          <div class="audience-table-wrap">
            <table class="campaign-table campaign-table--manager">
              <thead>
                <tr>
                  <th>Thumbnail Preview</th>
                  <th>Content Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th class="campaign-table__actions-head" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            ${paginationBarHtml("Total campaigns:")}
          </div>
        </section>

        <div class="crm-modal" data-create-content-modal aria-hidden="true">
          <div class="crm-modal__backdrop" data-modal-close></div>
          <div class="crm-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="create-content-title">
            <div class="crm-modal__head">
              <div>
                <h2 class="crm-modal__title" id="create-content-title">Create Content</h2>
                <p class="crm-modal__subtitle">Configure content settings and basic attributes</p>
              </div>
              <button type="button" class="crm-modal__close" aria-label="Close" data-modal-close>×</button>
            </div>

            <div class="crm-modal__section">
              <div class="crm-modal__section-label">Basic Information</div>
              <div class="crm-form-grid">
                <label class="crm-field">
                  <span class="crm-field__label">Content Name <span class="crm-field__req">*</span></span>
                  <input class="crm-field__input" type="text" placeholder="Enter Content Name" data-field="contentName" />
                </label>
                <label class="crm-field">
                  <span class="crm-field__label">Type <span class="crm-field__req">*</span></span>
                  <select class="crm-field__input" data-field="contentType">
                    <option value="" selected disabled>Select Type</option>
                    <option>Banner</option>
                    <option>Card</option>
                    <option>Text</option>
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
              <div class="crm-modal__section-label">Media</div>
              <div class="crm-upload">
                <div class="crm-upload__label">
                  Image <span class="crm-upload__info" title="JPG/PNG only" aria-label="JPG/PNG only">i</span>
                </div>
                <div class="crm-upload__drop">
                  <div class="crm-upload__icon" aria-hidden="true" data-upload-empty><img src="${modalImg}" alt="" /></div>
                  <div class="crm-upload__thumb" data-image-thumb hidden>
                    <img class="crm-upload__thumb-img" data-image-preview alt="Uploaded preview" />
                    <button type="button" class="crm-upload__thumb-del" data-image-delete aria-label="Delete image">${trashSmallIcon()}</button>
                  </div>
                  <div class="crm-upload__text" data-upload-text>
                    <div><span class="crm-upload__muted">Drop image here or</span> <button type="button" class="crm-upload__link" data-upload-file-btn>upload file</button></div>
                    <div class="crm-upload__hint">Accepted: JPG/PNG</div>
                  </div>
                  <input type="file" accept="image/png,image/jpeg" hidden data-image-file-input />
                </div>
                <div class="crm-upload__or">or</div>
                <input class="crm-field__input" type="url" placeholder="Paste image URL" data-image-url-input />
              </div>
            </div>

            <div class="crm-modal__divider"></div>

            <div class="crm-modal__footer">
              <div class="crm-modal__status">
                <div class="crm-modal__section-label" style="margin:0;">Status</div>
                <div class="crm-modal__status-row">
                  <div class="crm-modal__status-text">Active</div>
                  <label class="crm-switch">
                    <input class="crm-switch__input" type="checkbox" data-field="active" />
                    <span class="crm-switch__track" aria-hidden="true"></span>
                  </label>
                </div>
              </div>
              <div class="crm-modal__actions">
                <button type="button" class="crm-btn crm-btn--link" data-modal-close>Cancel</button>
                <button type="button" class="crm-btn crm-btn--primary" data-save-content>Save Content</button>
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

    // Seed localStorage once so Launch Calendar can use it.
    if (loadContentItems().length === 0) {
      const seeded = rows.map((r, idx) => ({
        id: `CL-${String(idx + 1).padStart(3, "0")}`,
        name: r.name,
        type: r.type,
        status: r.status,
        thumb: r.thumb,
        description: "",
        updatedAt: Date.now(),
      }));
      saveContentItems(seeded);
    }

    // Thumbnail hover preview (larger image near cursor)
    const preview = document.createElement("div");
    preview.setAttribute("aria-hidden", "true");
    preview.style.position = "fixed";
    preview.style.left = "0";
    preview.style.top = "0";
    preview.style.transform = "translate(0px, 0px)";
    preview.style.pointerEvents = "none";
    preview.style.zIndex = "9999";
    preview.style.background = "rgba(255,255,255,0.98)";
    preview.style.border = "1px solid rgba(0,0,0,0.08)";
    preview.style.borderRadius = "10px";
    // preview.style.boxShadow = "0 16px 50px rgba(0,0,0,0.18)";
    preview.style.padding = "2px";
    preview.style.opacity = "0";
    preview.style.transition = "opacity 120ms ease, transform 120ms ease";
    preview.innerHTML = `
      <img
        data-preview-img
        alt=""
        style="display:block;width:320px;max-width:45vw;height:auto;border-radius:10px;"
      />
    `;
    const previewImg = preview.querySelector("[data-preview-img]");
    document.body.appendChild(preview);

    const hidePreview = () => {
      preview.style.opacity = "0";
      preview.style.transform = "translate(0px, 0px)";
      if (previewImg) previewImg.removeAttribute("src");
    };

    const movePreview = (clientX, clientY) => {
      const offset = 18;
      const maxX = window.innerWidth - 20;
      const maxY = window.innerHeight - 20;
      const boxW = Math.min(320 + 20, Math.floor(window.innerWidth * 0.45) + 20);
      const boxH = Math.floor((boxW - 20) * 0.6) + 20;

      let x = clientX + offset;
      let y = clientY + offset;
      if (x + boxW > maxX) x = Math.max(20, clientX - offset - boxW);
      if (y + boxH > maxY) y = Math.max(20, clientY - offset - boxH);

      preview.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onThumbMouseOver = (event) => {
      const img = event.target?.closest?.("img[data-thumb-preview]");
      if (!img || !root.contains(img) || !previewImg) return;
      previewImg.src = img.getAttribute("data-thumb-preview") || img.getAttribute("src") || "";
      preview.style.opacity = "1";
      movePreview(event.clientX, event.clientY);
    };

    const onThumbMouseMove = (event) => {
      if (preview.style.opacity !== "1") return;
      movePreview(event.clientX, event.clientY);
    };

    const onThumbMouseOut = (event) => {
      const img = event.target?.closest?.("img[data-thumb-preview]");
      if (!img) return;
      hidePreview();
    };

    const closeMenu = () => {
      state.openRowId = null;
      root.querySelectorAll("[data-row-menu]").forEach((menu) => menu.classList.remove("is-open"));
    };

    const modal = root.querySelector("[data-create-content-modal]");
    let lastFocusedEl = null;

    const fileInput = root.querySelector("[data-image-file-input]");
    const urlInput = root.querySelector("[data-image-url-input]");
    const thumbWrap = root.querySelector("[data-image-thumb]");
    const emptyIcon = root.querySelector("[data-upload-empty]");
    const uploadText = root.querySelector("[data-upload-text]");
    const previewImgEl = root.querySelector("[data-image-preview]");
    let imageSrc = "";
    let editingRowId = null;

    const contentStore = new Map();
    root.querySelectorAll("button[data-row-dots]").forEach((btn) => {
      const id = btn.getAttribute("data-row-dots");
      const tr = btn.closest("tr");
      if (!id || !tr) return;
      const img = tr.querySelector('img[data-thumb-preview]');
      const nameCell = tr.children?.[1];
      const typeCell = tr.children?.[2];
      const statusBadge = tr.querySelector(".status-badge");
      contentStore.set(id, {
        id,
        name: nameCell ? nameCell.textContent.trim() : "",
        type: typeCell ? typeCell.textContent.trim() : "",
        status: statusBadge ? statusBadge.textContent.trim() : "Inactive",
        thumb: img ? img.getAttribute("data-thumb-preview") || img.getAttribute("src") || "" : "",
        description: "",
      });
    });

    const filterBtn = root.querySelector("[data-filter-btn]");
    const filterPopover = root.querySelector("[data-filter-popover]");
    const filterInput = filterPopover?.querySelector(".crm-filter__input") ?? null;

    let filterPrefix = "";
    let searchQuery = "";
    const searchInput = root.querySelector(".campaign-search__input");
    /** @type {null | ReturnType<typeof createTablePagination>} */
    let paginationApi = null;
    const refreshContentTable = (opts) => paginationApi?.refresh(opts);

    const getFilteredContentItems = () => {
      const q = normalizeSearchQuery(searchQuery);
      return loadContentItems().filter((it) => {
        const n = String(it?.name ?? "").toLowerCase();
        if (filterPrefix && !n.startsWith(filterPrefix)) return false;
        return rowMatchesSearch(q, [it.name, it.type, it.status, it.id, it.description]);
      });
    };

    const applyPrefixFilter = (prefixRaw) => {
      filterPrefix = String(prefixRaw ?? "").trim().toLowerCase();
      refreshContentTable({ resetPage: true });
    };

    paginationApi = createTablePagination({
      root,
      tableSelector: "table.campaign-table--manager",
      getItems: () => getFilteredContentItems(),
      renderItemHtml: (item) => renderRow(item),
      totalLabelText: "Total campaigns:",
    });
    refreshContentTable();

    const onSearchInput = () => {
      searchQuery = String(searchInput?.value ?? "");
      refreshContentTable({ resetPage: true });
    };
    searchInput?.addEventListener("input", onSearchInput);

    const setModalOpen = (open) => {
      if (!modal) return;
      modal.classList.toggle("is-open", open);
      modal.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("has-modal", open);
      if (!open) clearFormErrors();
      if (open) {
        lastFocusedEl = document.activeElement;
        const firstField = modal.querySelector("input, select, button");
        if (firstField) firstField.focus();
      } else if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }
    };

    const clearFormErrors = () => {
      modal?.querySelectorAll(".is-invalid")?.forEach((el) => el.classList.remove("is-invalid"));
    };

    const markInvalid = (el) => {
      if (!el) return;
      el.classList.add("is-invalid");
    };

    const setImage = (nextSrc) => {
      imageSrc = String(nextSrc || "").trim();
      const has = Boolean(imageSrc);
      if (thumbWrap) thumbWrap.hidden = !has;
      if (emptyIcon) emptyIcon.style.display = has ? "none" : "";
      if (uploadText) uploadText.style.display = has ? "none" : "";
      if (previewImgEl) {
        if (has) previewImgEl.src = imageSrc;
        else previewImgEl.removeAttribute("src");
      }
    };

    const resetImage = () => {
      if (fileInput) fileInput.value = "";
      if (urlInput) urlInput.value = "";
      setImage("");
    };

    const getFieldValue = (key) => {
      const el = modal?.querySelector(`[data-field="${key}"]`);
      if (!el) return "";
      if (el.type === "checkbox") return el.checked ? "true" : "false";
      return String(el.value ?? "").trim();
    };

    const validateContentForm = () => {
      clearFormErrors();
      /** @type {Array<HTMLElement>} */
      const invalidEls = [];

      ["contentName", "contentType", "description"].forEach((key) => {
        const el = modal?.querySelector(`[data-field="${key}"]`);
        const val = String(el?.value ?? "").trim();
        if (!val) {
          if (el) markInvalid(el);
          if (el) invalidEls.push(el);
        }
      });

      if (!imageSrc) {
        if (urlInput) markInvalid(urlInput);
        if (urlInput) invalidEls.push(urlInput);
      }

      if (invalidEls.length > 0) {
        invalidEls[0].focus?.();
        return false;
      }
      return true;
    };

    const generateContentId = () => `CL-${Math.floor(100 + Math.random() * 90000)}`;

    const appendContentRow = () => {
      refreshContentTable({ resetPage: true });
    };

    const csvEscape = (v) => {
      const s = String(v ?? "");
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const exportContentLibraryCsv = () => {
      const headers = ["Content Name", "Type", "Status"];
      const rows = getFilteredContentItems().map((it) => [it.name, it.type, it.status]);

      const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "content-library.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    const updateContentRow = () => {
      refreshContentTable();
    };

    const resetForm = () => {
      editingRowId = null;
      modal?.querySelector('[data-field="contentName"]')?.setAttribute("value", "");
      const nameInput = modal?.querySelector('[data-field="contentName"]');
      const typeSelect = modal?.querySelector('[data-field="contentType"]');
      const descInput = modal?.querySelector('[data-field="description"]');
      const activeInput = modal?.querySelector('[data-field="active"]');
      if (nameInput) nameInput.value = "";
      if (typeSelect) typeSelect.value = "";
      if (descInput) descInput.value = "";
      if (activeInput) activeInput.checked = false;
      resetImage();
      const title = modal?.querySelector("#create-content-title");
      if (title) title.textContent = "Create Content";
      const saveBtn = modal?.querySelector("[data-save-content]");
      if (saveBtn) saveBtn.textContent = "Save Content";
    };

    const fillFormForEdit = (item) => {
      const nameInput = modal?.querySelector('[data-field="contentName"]');
      const typeSelect = modal?.querySelector('[data-field="contentType"]');
      const descInput = modal?.querySelector('[data-field="description"]');
      const activeInput = modal?.querySelector('[data-field="active"]');
      if (nameInput) nameInput.value = item.name || "";
      if (typeSelect) typeSelect.value = item.type || "";
      if (descInput) descInput.value = item.description || "";
      if (activeInput) activeInput.checked = String(item.status).toLowerCase() === "active";
      setImage(item.thumb || "");
      if (urlInput) urlInput.value = item.thumb || "";
      const title = modal?.querySelector("#create-content-title");
      if (title) title.textContent = "Edit Content";
      const saveBtn = modal?.querySelector("[data-save-content]");
      if (saveBtn) saveBtn.textContent = "Save";
    };

    const onFileChosen = () => {
      const file = fileInput?.files?.[0];
      if (!file) return;
      if (!/^image\/(png|jpeg)$/.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        setImage(result);
        if (urlInput) urlInput.value = "";
      };
      reader.readAsDataURL(file);
    };

    const onUrlInput = () => {
      const url = String(urlInput?.value ?? "").trim();
      if (!url) {
        if (!fileInput?.files?.length) setImage("");
        return;
      }
      setImage(url);
      if (fileInput) fileInput.value = "";
    };

    const onDrop = (event) => {
      if (!modal || !modal.classList.contains("is-open")) return;
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (!file) return;
      if (!/^image\/(png|jpeg)$/.test(file.type)) return;
      if (fileInput) fileInput.files = event.dataTransfer.files;
      onFileChosen();
    };

    const onDragOver = (event) => {
      if (!modal || !modal.classList.contains("is-open")) return;
      event.preventDefault();
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
        exportContentLibraryCsv();
        return;
      }

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

      const createContent = event.target.closest?.("[data-create-content-btn]");
      if (createContent) {
        event.preventDefault();
        resetForm();
        setModalOpen(true);
        return;
      }

      const editBtn = event.target.closest?.("[data-row-edit]");
      if (editBtn) {
        event.preventDefault();
        const rowId = editBtn.getAttribute("data-row-edit");
        if (!rowId) return;
        const item = contentStore.get(rowId);
        if (!item) return;
        editingRowId = rowId;
        fillFormForEdit(item);
        setModalOpen(true);
        closeMenu();
        return;
      }

      const deleteRowBtn = event.target.closest?.("[data-row-delete]");
      if (deleteRowBtn) {
        event.preventDefault();
        const rowId = deleteRowBtn.getAttribute("data-row-delete");
        if (!rowId) return;
        contentStore.delete(rowId);
        deleteContentItem(rowId);
        refreshContentTable();
        closeMenu();
        return;
      }

      const uploadBtn = event.target.closest?.("[data-upload-file-btn]");
      if (uploadBtn) {
        event.preventDefault();
        fileInput?.click?.();
        return;
      }

      const del = event.target.closest?.("[data-image-delete]");
      if (del) {
        event.preventDefault();
        resetImage();
        return;
      }

      const save = event.target.closest?.("[data-save-content]");
      if (save) {
        event.preventDefault();
        if (!validateContentForm()) return;

        const active = getFieldValue("active") === "true";
        const id = editingRowId || generateContentId();
        const newItem = {
          id,
          name: getFieldValue("contentName"),
          type: getFieldValue("contentType"),
          status: active ? "Active" : "Inactive",
          thumb: imageSrc,
          description: getFieldValue("description"),
        };
        state.savedContent = newItem;
        contentStore.set(id, newItem);
        upsertContentItem({ ...newItem, updatedAt: Date.now() });
        if (editingRowId) updateContentRow();
        else appendContentRow();
        setModalOpen(false);
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

    const onDocumentClickCapture = (event) => {
      if (!target.contains(event.target)) return;
      if (event.target.closest("[data-row-dots]")) return;
      if (event.target.closest(".row-menu")) return;
      closeMenu();
    };

    root.addEventListener("click", onRootClick);
    root.addEventListener("mouseover", onThumbMouseOver);
    root.addEventListener("mousemove", onThumbMouseMove);
    root.addEventListener("mouseout", onThumbMouseOut);
    root.addEventListener("drop", onDrop);
    root.addEventListener("dragover", onDragOver);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocumentClickCapture, true);

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
    fileInput?.addEventListener("change", onFileChosen);
    urlInput?.addEventListener("input", onUrlInput);

    cleanup = () => {
      searchInput?.removeEventListener("input", onSearchInput);
      paginationApi?.destroy();
      paginationApi = null;
      root.removeEventListener("click", onRootClick);
      root.removeEventListener("mouseover", onThumbMouseOver);
      root.removeEventListener("mousemove", onThumbMouseMove);
      root.removeEventListener("mouseout", onThumbMouseOut);
      root.removeEventListener("drop", onDrop);
      root.removeEventListener("dragover", onDragOver);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocumentClickCapture, true);
      filterInput?.removeEventListener("input", onFilterInput);
      document.removeEventListener("click", onDocumentClickForFilter, true);
      fileInput?.removeEventListener("change", onFileChosen);
      urlInput?.removeEventListener("input", onUrlInput);
      preview.remove();
      document.documentElement.classList.remove("has-modal");
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

function row(name, type, status, thumb) {
  return { name, type, status, thumb };
}

function renderRow(item) {
  const statusKey = item.status.toLowerCase() === "active" ? "running" : "archived";
  return `
    <tr data-content-name="${escapeHtmlAttr(item.name)}">
      <td>
        <img
          src="${escapeHtmlAttr(item.thumb)}"
          data-thumb-preview="${escapeHtmlAttr(item.thumb)}"
          alt="${escapeHtmlAttr(item.name)} preview"
          width="56"
          height="32"
          style="border-radius:10px;cursor:zoom-in;"
        />
      </td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.type)}</td>
      <td><span class="status-badge status-badge--${statusKey}">${escapeHtml(item.status)}</span></td>
      <td class="campaign-table__actions">
        <div class="row-actions">
          <button type="button" class="dots-btn" aria-label="Open actions" data-row-dots="${escapeHtmlAttr(item.id)}">
            ${dotsIcon()}
          </button>
          <div class="row-menu" data-row-menu="${escapeHtmlAttr(item.id)}" role="menu" aria-label="Row actions">
            <button type="button" role="menuitem" data-row-edit="${escapeHtmlAttr(item.id)}"><span class="row-menu__icon">${editIcon()}</span>Edit</button>
            <button type="button" role="menuitem" class="is-danger" data-row-delete="${escapeHtmlAttr(item.id)}"><span class="row-menu__icon">${trashIcon()}</span>Delete</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function cssEscape(v) {
  return String(v).replace(/"/g, '\\"');
}

function dotsIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`;
}

function trashSmallIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z"/></svg>`;
}

function editIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Zm15.71-9.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 2.75 2.75 1.99-1.66Z"/></svg>`;
}

function trashIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 7h12l-1 14H7L6 7Zm3-3h6l1 2H8l1-2Z"/></svg>`;
}

function searchIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 2a8 8 0 1 0 4.9 14.3l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/></svg>`;
}

function filterIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M11.1413 0C11.5794 0.000513872 12.008 0.128005 12.3757 0.366211C12.7433 0.604429 13.0351 0.943185 13.2145 1.34277C13.394 1.74248 13.4536 2.18603 13.3874 2.61914C13.3211 3.05214 13.1312 3.45646 12.8405 3.78418L8.74969 8.38867V13.417C8.7496 13.5716 8.68811 13.7198 8.57879 13.8291C8.46942 13.9384 8.3213 14 8.16668 14C8.04067 14 7.91795 13.9593 7.81707 13.8838L5.48308 12.1338C5.41064 12.0795 5.35171 12.0087 5.31121 11.9277C5.27076 11.8468 5.24974 11.7574 5.24969 11.667V8.38867L1.15691 3.78418C0.866331 3.45632 0.677105 3.05125 0.611014 2.61816C0.544923 2.18499 0.605188 1.74146 0.784842 1.3418C0.964512 0.942318 1.256 0.603263 1.62371 0.365234C1.99146 0.127221 2.42003 0.000316821 2.85808 0H11.1413ZM2.85808 1.16699C2.64493 1.16736 2.43641 1.22886 2.2575 1.34473C2.07852 1.46065 1.9368 1.62585 1.8493 1.82031C1.76182 2.01475 1.73239 2.2306 1.76433 2.44141C1.79632 2.652 1.88799 2.84912 2.02898 3.00879L6.26922 7.7793C6.36396 7.88607 6.41672 8.02424 6.41668 8.16699V11.375L7.58367 12.25V8.16699C7.58379 8.02417 7.63618 7.88599 7.73113 7.7793L11.9704 3.00977C12.1118 2.84998 12.204 2.65233 12.236 2.44141C12.268 2.2305 12.2386 2.01486 12.1511 1.82031C12.0635 1.6258 11.9219 1.46066 11.7428 1.34473C11.5638 1.22878 11.3546 1.16722 11.1413 1.16699H2.85808Z" fill="#3A3A3A"/>
</svg>`;
}

function exportIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.71777 0C7.80802 0 8.83372 0.425122 9.60547 1.19629L11.6377 3.22949C12.4089 4.00065 12.834 5.02481 12.834 6.11621V11.083C12.834 12.6912 11.5261 13.9998 9.91797 14H4.08398C2.47589 13.9998 1.16797 12.6911 1.16797 11.083V2.91699C1.16797 1.30885 2.47589 0.000181475 4.08398 0H6.71777ZM4.08398 1.16699C3.1193 1.16717 2.33398 1.95227 2.33398 2.91699V11.084C2.33402 12.0487 3.11933 12.8338 4.08398 12.834H9.91797C10.8826 12.8338 11.6679 12.0487 11.668 11.084V6.11621C11.668 6.02114 11.663 5.92633 11.6543 5.83301H8.75098C7.78615 5.833 7.00098 5.04784 7.00098 4.08301V1.17969C6.90766 1.17094 6.81284 1.16699 6.71777 1.16699H4.08398ZM7.00098 7.00098C7.32356 7.00098 7.58398 7.26198 7.58398 7.58398V10.1494L8.33887 9.39551C8.56695 9.16742 8.935 9.16742 9.16309 9.39551C9.39116 9.62301 9.39117 9.99165 9.16309 10.2197L8.22266 11.1611C7.88607 11.4977 7.44314 11.667 7.00098 11.667C6.55881 11.667 6.11588 11.4977 5.7793 11.1611L4.83887 10.2197C4.61079 9.99165 4.6108 9.62301 4.83887 9.39551C5.06695 9.16742 5.435 9.16742 5.66309 9.39551L6.41797 10.1494V7.58398C6.41797 7.26199 6.6784 7.00098 7.00098 7.00098Z" fill="#3A3A3A"/>
  </svg>`;
}