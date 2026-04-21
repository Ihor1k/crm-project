import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { loadCampaigns, loadContentItems } from "../utils/crmStore.js";
import { escapeHtml } from "../utils/escapeHtml.js";

export function LaunchCalendarPage({ currentRoute = "/launch-calendar" } = {}) {
  const isDashboard = currentRoute === "/" || currentRoute === "/dashboard";
  const isCampaigns = currentRoute === "/campaigns";
  const isAudience = currentRoute === "/audience";
  const isContentLibrary = currentRoute === "/content-library";
  const isLaunchCalendar = currentRoute === "/launch-calendar";
  const isExperiments = currentRoute === "/experiments";
  const isReports = currentRoute === "/reports";
  const isSettings = currentRoute === "/settings";

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
            <h1>Launch Calendar</h1>
            <p>Calendar schedule overview</p>
          </div>
        </header>

        <section class="campaign-toolbar" aria-label="Launch Calendar controls">
          <div class="campaign-toolbar__left">
            <button type="button" class="ghost-btn" aria-label="Previous month" data-cal-prev>
              <span class="ghost-btn__icon" aria-hidden="true">${chevronLeftIcon()}</span>
            </button>
            <button type="button" class="ghost-btn" data-cal-today>
              <span class="calendar-icon" style="margin-top: 2px;"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M9.91699 0C10.0716 8.62331e-05 10.2198 0.0615791 10.3291 0.170898C10.4384 0.280218 10.4999 0.428416 10.5 0.583008V1.16699H11.083C11.8561 1.16792 12.5978 1.47491 13.1445 2.02148C13.6912 2.56819 13.999 3.30986 14 4.08301V11.083C13.9991 11.8563 13.6913 12.5978 13.1445 13.1445C12.5978 13.6913 11.8563 13.9991 11.083 14H2.91699C2.14373 13.9991 1.40225 13.6913 0.855469 13.1445C0.308688 12.5978 0.00092625 11.8563 0 11.083V4.08301C0.00101213 3.30986 0.308765 2.56819 0.855469 2.02148C1.40222 1.47491 2.14388 1.16792 2.91699 1.16699H3.5V0.583008C3.50009 0.428416 3.56158 0.280218 3.6709 0.170898C3.78022 0.0615789 3.92842 8.6107e-05 4.08301 0C4.23772 0 4.3867 0.0615022 4.49609 0.170898C4.60531 0.280202 4.66691 0.428492 4.66699 0.583008V1.16699H9.33301V0.583008C9.33309 0.428492 9.39469 0.280202 9.50391 0.170898C9.6133 0.0615022 9.76228 0 9.91699 0ZM1.16699 11.083C1.16699 11.5471 1.3515 11.9921 1.67969 12.3203C2.00788 12.6485 2.45286 12.833 2.91699 12.833H11.083C11.5471 12.833 11.9921 12.6485 12.3203 12.3203C12.6485 11.9921 12.833 11.5471 12.833 11.083V5.83301H1.16699V11.083ZM4.08301 7.875C4.56626 7.875 4.95801 8.26675 4.95801 8.75C4.95801 9.23325 4.56626 9.625 4.08301 9.625C3.59991 9.62482 3.20801 9.23314 3.20801 8.75C3.20801 8.26686 3.59991 7.87518 4.08301 7.875ZM7 7.875C7.48325 7.875 7.875 8.26675 7.875 8.75C7.875 9.23325 7.48325 9.625 7 9.625C6.51675 9.625 6.125 9.23325 6.125 8.75C6.125 8.26675 6.51675 7.875 7 7.875ZM9.91699 7.875C10.4001 7.87518 10.792 8.26686 10.792 8.75C10.792 9.23314 10.4001 9.62482 9.91699 9.625C9.43374 9.625 9.04199 9.23325 9.04199 8.75C9.04199 8.26675 9.43374 7.875 9.91699 7.875ZM2.91699 2.33301C2.45302 2.33301 2.00784 2.51772 1.67969 2.8457C1.35158 3.17382 1.16708 3.619 1.16699 4.08301V4.66699H12.833V4.08301C12.8329 3.619 12.6484 3.17382 12.3203 2.8457C11.9922 2.51772 11.547 2.33301 11.083 2.33301H2.91699Z" fill="#3A3A3A"/>
            </svg></span><div class="cal-month" data-cal-month aria-live="polite"></div>
            </button>
            <button type="button" class="ghost-btn" aria-label="Next month" data-cal-next>
              <span class="ghost-btn__icon" aria-hidden="true">${chevronRightIcon()}</span>
            </button>
            
            
          </div>

          <div class="campaign-toolbar__actions">
            <button type="button" class="ghost-btn" aria-label="Change calendar view">
              <span class="ghost-btn__icon" aria-hidden="true">${viewSwitchIcon()}</span>
            </button>
            <button type="button" class="ghost-btn">
              <span class="ghost-btn__icon" aria-hidden="true">${filterIcon()}</span>
              Filter
            </button>
          </div>
        </section>

        <section class="panel campaign-panel" aria-label="Launch calendar">
          <div class="cal" data-cal-root>
            <div class="cal__weekdays" aria-hidden="true">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div class="cal__grid" data-cal-grid></div>
          </div>
        </section>
      </section>
    </main>
  `;

  return {
    mount(target) {
      target.innerHTML = markup;

      const root = target.querySelector("[data-cal-root]");
      const grid = target.querySelector("[data-cal-grid]");
      const monthLabel = target.querySelector("[data-cal-month]");
      if (!root || !grid || !monthLabel) return;

      const state = { year: 0, month: 0 };
      const now = new Date();
      state.year = now.getFullYear();
      state.month = now.getMonth();

      const toDate = (iso) => {
        const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) return null;
        return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      };

      const monthCaption = (y, m) =>
        new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(y, m, 1));

      const startOfGrid = (y, m) => {
        const first = new Date(y, m, 1);
        const dow = (first.getDay() + 6) % 7; // Monday = 0
        const start = new Date(y, m, 1 - dow);
        return start;
      };

      const sameMonth = (d, y, m) => d.getFullYear() === y && d.getMonth() === m;

      const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

      const campaignEvents = () => {
        const campaigns = loadCampaigns();
        return campaigns
          .map((c) => ({
            kind: "campaign",
            id: c.id,
            title: c.campaignName || c.name || c.id,
            start: toDate(c.startDate) || toDate(c.createdDate) || null,
            end: toDate(c.endDate) || null,
            color: c.status === "Running" ? "green" : c.status === "Paused" ? "purple" : "beige",
          }))
          .filter((e) => e.start && e.end);
      };

      const contentEvents = (y, m) => {
        const items = loadContentItems();
        return items.slice(0, 8).map((it) => {
          // deterministic pseudo placement based on id
          const seed = Array.from(String(it.id)).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
          const day = clamp((seed % 27) + 1, 1, 28);
          const d = new Date(y, m, day);
          return {
            kind: "content",
            id: it.id,
            title: it.name,
            start: d,
            end: d,
            color: it.type === "Banner" ? "beige" : "gray",
          };
        });
      };

      const render = () => {
        monthLabel.textContent = monthCaption(state.year, state.month);
        const start = startOfGrid(state.year, state.month);
        const days = [];
        for (let i = 0; i < 42; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          days.push(d);
        }

        const events = [...campaignEvents(), ...contentEvents(state.year, state.month)];

        // group events by week index to render spanning bars within each week row
        const weeks = Array.from({ length: 6 }, () => []);
        events.forEach((e) => {
          const s = e.start;
          const eEnd = e.end;
          const gridStart = start;
          const gridEnd = new Date(start);
          gridEnd.setDate(start.getDate() + 41);
          if (eEnd < gridStart || s > gridEnd) return;

          const clampedStart = new Date(Math.max(s, gridStart));
          const clampedEnd = new Date(Math.min(eEnd, gridEnd));
          const startIndex = Math.floor((clampedStart - gridStart) / 86400000);
          const endIndex = Math.floor((clampedEnd - gridStart) / 86400000);
          const startWeek = Math.floor(startIndex / 7);
          const endWeek = Math.floor(endIndex / 7);
          for (let w = startWeek; w <= endWeek; w++) {
            const weekStartIdx = w * 7;
            const from = w === startWeek ? startIndex - weekStartIdx : 0;
            const to = w === endWeek ? endIndex - weekStartIdx : 6;
            weeks[w].push({ ...e, from, to });
          }
        });

        grid.innerHTML = "";
        for (let w = 0; w < 6; w++) {
          const weekDays = days.slice(w * 7, w * 7 + 7);
          const weekEl = document.createElement("div");
          weekEl.className = "cal-week";

          const cells = document.createElement("div");
          cells.className = "cal-week__cells";
          weekDays.forEach((d) => {
            const cell = document.createElement("div");
            cell.className = "cal-cell";
            if (!sameMonth(d, state.year, state.month)) cell.classList.add("is-out");
            if (dayKey(d) === dayKey(now)) cell.classList.add("is-today");
            cell.innerHTML = `<div class="cal-cell__num">${d.getDate()}</div>`;
            cells.appendChild(cell);
          });

          const bars = document.createElement("div");
          bars.className = "cal-week__bars";
          weeks[w].slice(0, 6).forEach((ev) => {
            const bar = document.createElement("div");
            bar.className = `cal-bar cal-bar--${ev.color}`;
            bar.style.gridColumn = `${ev.from + 1} / ${ev.to + 2}`;
            bar.innerHTML = `<span class="cal-bar__text">${escapeHtml(ev.title)}</span>`;
            bars.appendChild(bar);
          });

          weekEl.appendChild(cells);
          weekEl.appendChild(bars);
          grid.appendChild(weekEl);
        }
      };

      const onClick = (event) => {
        if (event.target.closest?.("[data-cal-prev]")) {
          state.month -= 1;
          if (state.month < 0) {
            state.month = 11;
            state.year -= 1;
          }
          render();
          return;
        }
        if (event.target.closest?.("[data-cal-next]")) {
          state.month += 1;
          if (state.month > 11) {
            state.month = 0;
            state.year += 1;
          }
          render();
          return;
        }
        if (event.target.closest?.("[data-cal-today]")) {
          state.year = now.getFullYear();
          state.month = now.getMonth();
          render();
          return;
        }
        if (event.target.closest?.("[data-export-btn]")) {
          event.preventDefault();
          // Export current visible campaign events for this month
          const events = campaignEvents()
            .filter((e) => e.start.getFullYear() === state.year && e.start.getMonth() === state.month)
            .map((e) => [e.title, dayKey(e.start), dayKey(e.end)]);
          const csv = [["Title", "Start", "End"], ...events]
            .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\r\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "launch-calendar.csv";
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }
      };

      target.addEventListener("click", onClick);
      render();

      this.unmount = () => {
        target.removeEventListener("click", onClick);
      };
    },
    // No global listeners to clean up, but keep the interface consistent.
    unmount() {},
  };
}

function chevronLeftIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="9" viewBox="0 0 5 9" fill="none">
  <path d="M4.01202 7.99796C4.0667 7.94373 4.11009 7.87922 4.13971 7.80813C4.16932 7.73705 4.18457 7.6608 4.18457 7.5838C4.18457 7.50679 4.16932 7.43054 4.13971 7.35946C4.11009 7.28837 4.0667 7.22386 4.01202 7.16963L1.34035 4.49796C1.28568 4.44373 1.24228 4.37922 1.21267 4.30813C1.18305 4.23705 1.16781 4.1608 1.16781 4.0838C1.16781 4.00679 1.18305 3.93054 1.21267 3.85946C1.24228 3.78837 1.28568 3.72386 1.34035 3.66963L4.01202 0.997962C4.0667 0.943734 4.11009 0.879217 4.13971 0.808132C4.16932 0.737048 4.18457 0.660803 4.18457 0.583796C4.18457 0.506789 4.16932 0.430544 4.13971 0.359459C4.11009 0.288375 4.0667 0.223857 4.01202 0.169629C3.90273 0.0609826 3.75488 0 3.60077 0C3.44666 0 3.29882 0.0609826 3.18952 0.169629L0.512021 2.84713C0.184303 3.17526 0.000227451 3.62004 0.000227451 4.0838C0.000227451 4.54755 0.184303 4.99234 0.512021 5.32046L3.18952 7.99796C3.29882 8.10661 3.44666 8.16759 3.60077 8.16759C3.75488 8.16759 3.90273 8.10661 4.01202 7.99796Z" fill="#8A8A8A"/>
</svg>`;
}

function chevronRightIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="9" viewBox="0 0 5 9" fill="none">
  <path d="M0.172549 0.169518C0.117874 0.223747 0.0744773 0.288263 0.0448622 0.359348C0.0152472 0.430432 0 0.506678 0 0.583684C0 0.660691 0.0152472 0.736936 0.0448622 0.808021C0.0744773 0.879106 0.117874 0.943622 0.172549 0.99785L2.84422 3.66952C2.89889 3.72375 2.94229 3.78826 2.9719 3.85935C3.00152 3.93043 3.01676 4.00668 3.01676 4.08368C3.01676 4.16069 3.00152 4.23694 2.9719 4.30802C2.94229 4.37911 2.89889 4.44362 2.84422 4.49785L0.172549 7.16952C0.117874 7.22375 0.0744773 7.28826 0.0448622 7.35935C0.0152472 7.43043 0 7.50668 0 7.58368C0 7.66069 0.0152472 7.73694 0.0448622 7.80802C0.0744773 7.87911 0.117874 7.94362 0.172549 7.99785C0.281844 8.1065 0.429691 8.16748 0.583799 8.16748C0.737907 8.16748 0.885754 8.1065 0.995049 7.99785L3.67255 5.32035C4.00027 4.99223 4.18434 4.54744 4.18434 4.08368C4.18434 3.61993 4.00027 3.17514 3.67255 2.84702L0.995049 0.169518C0.885754 0.0608721 0.737907 -0.00011158 0.583799 -0.00011158C0.429691 -0.00011158 0.281844 0.0608721 0.172549 0.169518Z" fill="#8A8A8A"/>
</svg>`;
}

function viewSwitchIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
  <path d="M10.5 11.083C10.8208 11.083 11.083 11.3462 11.083 11.667C11.0828 11.9877 10.8207 12.25 10.5 12.25H0.583008C0.262431 12.2498 0.000177608 11.9876 0 11.667C0 11.3463 0.262322 11.0832 0.583008 11.083H10.5ZM13.417 6.41699C13.7377 6.41717 14 6.67928 14 7C14 7.32072 13.7377 7.58283 13.417 7.58301H3.5C3.17917 7.58301 2.91699 7.32083 2.91699 7C2.91699 6.67917 3.17917 6.41699 3.5 6.41699H13.417ZM10.5 1.75C10.8207 1.75 11.0828 2.01232 11.083 2.33301C11.083 2.65384 10.8208 2.91699 10.5 2.91699H0.583008C0.262322 2.91681 0 2.65373 0 2.33301C0.000177413 2.01243 0.262431 1.75018 0.583008 1.75H10.5Z" fill="#3A3A3A"/>
</svg>`;
}

function filterIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M11.1413 0C11.5794 0.000513872 12.008 0.128005 12.3757 0.366211C12.7433 0.604429 13.0351 0.943185 13.2145 1.34277C13.394 1.74248 13.4536 2.18603 13.3874 2.61914C13.3211 3.05214 13.1312 3.45646 12.8405 3.78418L8.74969 8.38867V13.417C8.7496 13.5716 8.68811 13.7198 8.57879 13.8291C8.46942 13.9384 8.3213 14 8.16668 14C8.04067 14 7.91795 13.9593 7.81707 13.8838L5.48308 12.1338C5.41064 12.0795 5.35171 12.0087 5.31121 11.9277C5.27076 11.8468 5.24974 11.7574 5.24969 11.667V8.38867L1.15691 3.78418C0.866331 3.45632 0.677105 3.05125 0.611014 2.61816C0.544923 2.18499 0.605188 1.74146 0.784842 1.3418C0.964512 0.942318 1.256 0.603263 1.62371 0.365234C1.99146 0.127221 2.42003 0.000316821 2.85808 0H11.1413ZM2.85808 1.16699C2.64493 1.16736 2.43641 1.22886 2.2575 1.34473C2.07852 1.46065 1.9368 1.62585 1.8493 1.82031C1.76182 2.01475 1.73239 2.2306 1.76433 2.44141C1.79632 2.652 1.88799 2.84912 2.02898 3.00879L6.26922 7.7793C6.36396 7.88607 6.41672 8.02424 6.41668 8.16699V11.375L7.58367 12.25V8.16699C7.58379 8.02417 7.63618 7.88599 7.73113 7.7793L11.9704 3.00977C12.1118 2.84998 12.204 2.65233 12.236 2.44141C12.268 2.2305 12.2386 2.01486 12.1511 1.82031C12.0635 1.6258 11.9219 1.46066 11.7428 1.34473C11.5638 1.22878 11.3546 1.16722 11.1413 1.16699H2.85808Z" fill="#3A3A3A"/>
</svg>`;
}

function exportIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M6.7168 0C7.80705 0 8.83274 0.425122 9.60449 1.19629L11.6367 3.22949C12.4079 4.00065 12.833 5.02481 12.833 6.11621V11.083C12.833 12.6912 11.5251 13.9998 9.91699 14H4.08301C2.47491 13.9998 1.16699 12.6911 1.16699 11.083V2.91699C1.16699 1.30885 2.47491 0.000181475 4.08301 0H6.7168ZM4.08301 1.16699C3.11833 1.16717 2.33301 1.95227 2.33301 2.91699V11.084C2.33304 12.0487 3.11835 12.8338 4.08301 12.834H9.91699C10.8817 12.8338 11.667 12.0487 11.667 11.084V6.11621C11.667 6.02114 11.6621 5.92633 11.6533 5.83301H8.75C7.78517 5.833 7 5.04784 7 4.08301V1.17969C6.90668 1.17094 6.81186 1.16699 6.7168 1.16699H4.08301ZM7 7.00098C7.32258 7.00098 7.58301 7.26198 7.58301 7.58398V10.1494L8.33789 9.39551C8.56597 9.16742 8.93403 9.16742 9.16211 9.39551C9.39018 9.62301 9.39019 9.99165 9.16211 10.2197L8.22168 11.1611C7.8851 11.4977 7.44217 11.667 7 11.667C6.55784 11.667 6.1149 11.4977 5.77832 11.1611L4.83789 10.2197C4.60981 9.99165 4.60983 9.62301 4.83789 9.39551C5.06597 9.16742 5.43403 9.16742 5.66211 9.39551L6.41699 10.1494V7.58398C6.41699 7.26199 6.67742 7.00098 7 7.00098ZM8.16602 4.08398C8.16605 4.40524 8.42723 4.66677 8.74902 4.66699H11.2812C11.1542 4.44554 10.9978 4.23945 10.8125 4.05469L10.8115 4.05371L8.7793 2.02051C8.5938 1.83502 8.38767 1.67794 8.16602 1.55078V4.08398Z" fill="#3A3A3A"/>
</svg>`;
}

