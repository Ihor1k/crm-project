import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml, escapeHtmlAttr } from "../utils/escapeHtml.js";
import contentLibraryImg1 from "../images/content-library-1.png";
import contentLibraryImg2 from "../images/content-library-2.png";
import contentLibraryImg3 from "../images/content-library-3.png";
import contentLibraryImg4 from "../images/content-library-4.png";


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
          <button type="button" class="dashboard-header__action">+ Create Content</button>
        </header>

        <section class="campaign-toolbar" aria-label="Content Library actions">
          <div class="campaign-search">
            <span class="campaign-search__icon" aria-hidden="true">${searchIcon()}</span>
            <input class="campaign-search__input" type="search" placeholder="Search" aria-label="Search content" />
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

  function mount(target) {
    target.innerHTML = markup;
    const root = target.querySelector(".dashboard-layout");
    if (!root) return;

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

    const openMenuFor = (rowId) => {
      closeMenu();
      state.openRowId = rowId;
      const menu = root.querySelector(`[data-row-menu="${cssEscape(rowId)}"]`);
      if (menu) menu.classList.add("is-open");
    };

    const onRootClick = (event) => {
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
    document.addEventListener("click", onDocumentClickCapture, true);

    cleanup = () => {
      root.removeEventListener("click", onRootClick);
      root.removeEventListener("mouseover", onThumbMouseOver);
      root.removeEventListener("mousemove", onThumbMouseMove);
      root.removeEventListener("mouseout", onThumbMouseOut);
      document.removeEventListener("click", onDocumentClickCapture, true);
      preview.remove();
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
    <tr>
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
            <button type="button" role="menuitem"><span class="row-menu__icon">${editIcon()}</span>Edit</button>
            <button type="button" role="menuitem" class="is-danger"><span class="row-menu__icon">${trashIcon()}</span>Delete</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}

function cssEscape(v) {
  return String(v).replace(/"/g, '\\"');
}

function thumbSvg() {
  return contentLibraryImg;
}

function dotsIcon() {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`;
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
  return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
  <path d="M10.5563 0C10.9944 0.000513872 11.423 0.128005 11.7907 0.366211C12.1583 0.604429 12.4501 0.943185 12.6296 1.34277C12.809 1.74248 12.8687 2.18603 12.8024 2.61914C12.7361 3.05214 12.5462 3.45646 12.2555 3.78418L8.16472 8.38867V13.417C8.16464 13.5716 8.10315 13.7198 7.99383 13.8291C7.88446 13.9384 7.73634 14 7.58172 14C7.45571 14 7.33299 13.9593 7.23211 13.8838L4.89812 12.1338C4.82568 12.0795 4.76675 12.0087 4.72625 11.9277C4.6858 11.8468 4.66478 11.7574 4.66472 11.667V8.38867L0.571951 3.78418C0.28137 3.45632 0.0921444 3.05125 0.026053 2.61816C-0.0400383 2.18499 0.0202267 1.74146 0.199881 1.3418C0.379551 0.942318 0.671035 0.603263 1.03875 0.365234C1.4065 0.127221 1.83507 0.000316821 2.27312 0H10.5563Z" fill="#3A3A3A"/>
  </svg>`;
}

function exportIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.71777 0C7.80802 0 8.83372 0.425122 9.60547 1.19629L11.6377 3.22949C12.4089 4.00065 12.834 5.02481 12.834 6.11621V11.083C12.834 12.6912 11.5261 13.9998 9.91797 14H4.08398C2.47589 13.9998 1.16797 12.6911 1.16797 11.083V2.91699C1.16797 1.30885 2.47589 0.000181475 4.08398 0H6.71777ZM4.08398 1.16699C3.1193 1.16717 2.33398 1.95227 2.33398 2.91699V11.084C2.33402 12.0487 3.11933 12.8338 4.08398 12.834H9.91797C10.8826 12.8338 11.6679 12.0487 11.668 11.084V6.11621C11.668 6.02114 11.663 5.92633 11.6543 5.83301H8.75098C7.78615 5.833 7.00098 5.04784 7.00098 4.08301V1.17969C6.90766 1.17094 6.81284 1.16699 6.71777 1.16699H4.08398ZM7.00098 7.00098C7.32356 7.00098 7.58398 7.26198 7.58398 7.58398V10.1494L8.33887 9.39551C8.56695 9.16742 8.935 9.16742 9.16309 9.39551C9.39116 9.62301 9.39117 9.99165 9.16309 10.2197L8.22266 11.1611C7.88607 11.4977 7.44314 11.667 7.00098 11.667C6.55881 11.667 6.11588 11.4977 5.7793 11.1611L4.83887 10.2197C4.61079 9.99165 4.6108 9.62301 4.83887 9.39551C5.06695 9.16742 5.435 9.16742 5.66309 9.39551L6.41797 10.1494V7.58398C6.41797 7.26199 6.6784 7.00098 7.00098 7.00098Z" fill="#3A3A3A"/>
  </svg>`;
}