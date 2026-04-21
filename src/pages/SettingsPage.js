import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml, escapeHtmlAttr } from "../utils/escapeHtml.js";

export function SettingsPage({ currentRoute = "/settings" } = {}) {
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
              ${SidebarNavItem({ label: "Dashboard", to: "/dashboard", icon: "dashboard", active: isDashboard })}
              ${SidebarNavItem({ label: "Campaign Manager", to: "/campaigns", icon: "campaign", active: isCampaigns })}
              ${SidebarNavItem({ label: "Audience", to: "/audience", icon: "audience", active: isAudience })}
              ${SidebarNavItem({ label: "Content Library", to: "/content-library", icon: "library", active: isContentLibrary })}
              ${SidebarNavItem({ label: "Launch Calendar", to: "/launch-calendar", icon: "calendar", active: isLaunchCalendar })}
              ${SidebarNavItem({ label: "Experiments", to: "/experiments", icon: "experiments", active: isExperiments })}
              ${SidebarNavItem({ label: "Reports", to: "/reports", icon: "reports", active: isReports })}
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

      <section class="dashboard-main" style="display:flex;flex-direction:column;min-height:100%;">
        <header class="dashboard-header">
          <div>
            <h1>Settings</h1>
            <p>Workspace configuration</p>
          </div>
        </header>

        <section
          class="panel campaign-panel"
          aria-label="Workspace settings"
          style="padding:28px 32px 24px;display:flex;flex-direction:column;gap:32px;min-height:calc(100vh - 180px);"
        >
          <div
            style="display:grid;grid-template-columns:minmax(180px, 240px) minmax(280px, 1fr);column-gap:48px;row-gap:18px;align-items:start;max-width:760px;"
          >
            <div>
              <p class="settings-text">WORKSPACE INFORMATION</p>
            </div>

            <div style="display:flex;flex-direction:column;gap:18px;">
              ${renderTextField({
                id: "workspace-name",
                label: "Workspace Name",
                value: "Modulor Radar Demo",
              })}
              ${renderSelectField({
                id: "data-retention",
                label: "Data retention",
                value: "Demo data only (no real data stored)",
                options: [
                  "Demo data only (no real data stored)",
                  "Keep data for 30 days",
                  "Keep data indefinitely",
                ],
              })}
              ${renderSelectField({
                id: "timezone",
                label: "Timezone",
                value: "UTC +2",
                options: ["UTC +0", "UTC +1", "UTC +2", "UTC +3"],
              })}
              ${renderSelectField({
                id: "currency",
                label: "Currency",
                value: "EUR",
                options: ["EUR", "USD", "GBP"],
              })}
            </div>
          </div>

          <div style="margin-top:auto;display:flex;justify-content:flex-end;">
            <button type="button" class="dashboard-header__action" style="min-width:104px;" data-settings-save>Save</button>
          </div>
        </section>
      </section>
    </main>
  `;

  const STORAGE_KEY = "crm.settings.v1";

  return {
    mount(target) {
      target.innerHTML = markup;

      const root = target.querySelector(".dashboard-layout");
      if (!root) return;

      const fields = {
        workspaceName: root.querySelector("#workspace-name"),
        dataRetention: root.querySelector("#data-retention"),
        timezone: root.querySelector("#timezone"),
        currency: root.querySelector("#currency"),
      };

      const load = () => {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return;
          const data = JSON.parse(raw);
          if (data?.workspaceName && fields.workspaceName) fields.workspaceName.value = String(data.workspaceName);
          if (data?.dataRetention && fields.dataRetention) fields.dataRetention.value = String(data.dataRetention);
          if (data?.timezone && fields.timezone) fields.timezone.value = String(data.timezone);
          if (data?.currency && fields.currency) fields.currency.value = String(data.currency);
        } catch {
          // ignore bad localStorage data
        }
      };

      const save = () => {
        const data = {
          workspaceName: String(fields.workspaceName?.value ?? "").trim(),
          dataRetention: String(fields.dataRetention?.value ?? "").trim(),
          timezone: String(fields.timezone?.value ?? "").trim(),
          currency: String(fields.currency?.value ?? "").trim(),
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      };

      const onClick = (event) => {
        const btn = event.target.closest?.("[data-settings-save]");
        if (!btn) return;
        event.preventDefault();
        save();
      };

      load();
      root.addEventListener("click", onClick);

      this.unmount = () => {
        root.removeEventListener("click", onClick);
      };
    },
    unmount() {},
  };
}

function renderTextField({ id, label, value }) {
  return `
    <label for="${escapeHtmlAttr(id)}" style="display:flex;flex-direction:column;gap:8px;">
      <span class="settings-input">${escapeHtml(label)} <span class="input-field__label-required" aria-hidden="true">*</span></span>
      <input class="settings-option"
        id="${escapeHtmlAttr(id)}"
        type="text"
        value="${escapeHtmlAttr(value)}"
        style="width:100%;height:40px;border:1px solid #ececec;border-radius:12px;padding:0 14px;background:#fff;outline:none;"
      />
    </label>
  `;
}

function renderSelectField({ id, label, value, options }) {
  return `
    <label for="${escapeHtmlAttr(id)}" style="display:flex;flex-direction:column;gap:8px;">
      <span class="settings-input">${escapeHtml(label)} <span class="input-field__label-required" aria-hidden="true">*</span></span>
      <select class="settings-option"
        id="${escapeHtmlAttr(id)}"
        style="width:100%;height:40px;border:1px solid #ececec;border-radius:12px;padding:0 14px;background:#fff;outline:none;"
      >
        ${options
          .map((option) => {
            const selected = option === value ? ' selected="selected"' : "";
            return `<option value="${escapeHtmlAttr(option)}"${selected}>${escapeHtml(option)}</option>`;
          })
          .join("")}
      </select>
    </label>
  `;
}

