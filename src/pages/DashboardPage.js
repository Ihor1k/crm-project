import { SidebarNavItem } from "../components/SidebarNavItem.js";
import { StatCard } from "../components/StatCard.js";
import { brandAssets } from "../assets/brand.js";
import { escapeHtml } from "../utils/escapeHtml.js";

const statIcons = {
  megaphone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M17 0C17.2652 0 17.5195 0.105433 17.707 0.292969C17.8946 0.480505 18 0.734784 18 1V19C18 19.2652 17.8946 19.5195 17.707 19.707C17.5195 19.8946 17.2652 20 17 20C16.7348 20 16.4805 19.8946 16.293 19.707C16.1054 19.5195 16 19.2652 16 19C16 16.051 13.417 15 11 15H8.55859L10.7588 19.7998C10.9619 20.2537 11.0489 20.7513 11.0107 21.2471C10.9725 21.7428 10.8103 22.2213 10.54 22.6387C10.2697 23.056 9.89964 23.4 9.46289 23.6377C9.02609 23.8754 8.53635 23.9997 8.03906 24C7.41402 23.9998 6.80242 23.8181 6.27832 23.4775C5.75429 23.137 5.33996 22.6521 5.08594 22.0811L1.51367 14.1094C1.04367 13.7385 0.663504 13.2658 0.401367 12.7275C0.139264 12.1893 0.00218401 11.5987 0 11V9C0 7.93913 0.42173 6.92202 1.17188 6.17188C1.92202 5.42173 2.93913 5 4 5H11C13.417 5 16 3.949 16 1C16 0.734784 16.1054 0.480505 16.293 0.292969C16.4805 0.105433 16.7348 5.05126e-07 17 0ZM4.10547 15L6.91309 21.2656C7.00953 21.4838 7.16733 21.6695 7.36719 21.7998C7.56707 21.9301 7.80046 21.9998 8.03906 22C8.20264 21.9999 8.36407 21.9589 8.50781 21.8809C8.65142 21.8028 8.7732 21.6898 8.8623 21.5527C8.95138 21.4157 9.00449 21.2586 9.01758 21.0957C9.03063 20.9326 9.00276 20.7687 8.93652 20.6191L6.35938 15H4.10547ZM20.6885 13.0557C20.9401 12.9718 21.2149 12.9919 21.4521 13.1104L23.4521 14.1104C23.6882 14.2288 23.8682 14.4361 23.9521 14.6865C24.0359 14.9369 24.0174 15.2106 23.9004 15.4473V15.4521C23.8417 15.5697 23.7603 15.6746 23.6611 15.7607C23.562 15.8468 23.4468 15.9125 23.3223 15.9541C23.1976 15.9957 23.0656 16.0122 22.9346 16.0029C22.8035 15.9936 22.6751 15.9591 22.5576 15.9004L20.5576 14.9004C20.3204 14.7819 20.1397 14.5737 20.0557 14.3223C19.9716 14.0706 19.9918 13.795 20.1104 13.5576C20.2289 13.3205 20.437 13.1396 20.6885 13.0557ZM16 5.40527C14.5706 6.50423 12.8017 7.06829 11 7H4C3.46957 7 2.96101 7.21086 2.58594 7.58594C2.21086 7.96101 2 8.46957 2 9V11C2 11.5304 2.21086 12.039 2.58594 12.4141C2.96101 12.7891 3.46957 13 4 13H11C12.8023 12.9331 14.5713 13.4989 16 14.5996V5.40527ZM23 9C23.2652 9 23.5195 9.10543 23.707 9.29297C23.8946 9.4805 24 9.73478 24 10C24 10.2652 23.8946 10.5195 23.707 10.707C23.5195 10.8946 23.2652 11 23 11H21C20.7348 11 20.4805 10.8946 20.293 10.707C20.1054 10.5195 20 10.2652 20 10C20 9.73478 20.1054 9.4805 20.293 9.29297C20.4805 9.10543 20.7348 9 21 9H23ZM22.5576 4.11035C22.795 3.9918 23.0706 3.97165 23.3223 4.05566C23.5737 4.13971 23.7819 4.32042 23.9004 4.55762C24.0189 4.79499 24.0381 5.07059 23.9541 5.32227C23.87 5.57377 23.6894 5.7819 23.4521 5.90039L21.4521 6.90039C21.3346 6.95914 21.2062 6.99365 21.0752 7.00293C20.9443 7.01217 20.8129 6.99561 20.6885 6.9541C20.5638 6.9125 20.4478 6.8469 20.3486 6.76074C20.2496 6.67468 20.169 6.56954 20.1104 6.45215C20.0516 6.33463 20.0161 6.20626 20.0068 6.0752C19.9976 5.94435 20.0142 5.81292 20.0557 5.68848C20.0973 5.56385 20.1629 5.44784 20.249 5.34863C20.3351 5.24959 20.4403 5.16898 20.5576 5.11035L22.5576 4.11035Z" fill="#1B1B1B"/>
</svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20.9999 0C21.265 7.32162e-05 21.5194 0.105498 21.7069 0.292969C21.8943 0.480492 21.9999 0.734849 21.9999 1V4C21.9999 4.79558 21.6835 5.5585 21.1209 6.12109C20.5584 6.68364 19.7954 6.99993 18.9999 7H15.9999C15.7347 7 15.4803 6.89448 15.2928 6.70703C15.1053 6.51949 14.9999 6.26522 14.9999 6C14.9999 5.73478 15.1053 5.48051 15.2928 5.29297C15.4803 5.10552 15.7347 5 15.9999 5H18.9999C19.0335 4.99499 19.0667 4.98746 19.0995 4.97852C17.4644 3.32554 15.3058 2.29177 12.993 2.05371C10.6799 1.81569 8.3554 2.38824 6.41782 3.67383C4.48041 4.95933 3.04972 6.87806 2.36997 9.10156C1.69031 11.3251 1.80374 13.7162 2.69126 15.8652C3.57897 18.0144 5.1863 19.7889 7.23716 20.8848C9.28792 21.9805 11.6555 22.3305 13.9354 21.874C16.2154 21.4175 18.2663 20.1828 19.7372 18.3818C21.2079 16.5809 22.008 14.3252 21.9999 12C21.9999 11.7348 22.1053 11.4805 22.2928 11.293C22.4803 11.1055 22.7347 11 22.9999 11C23.265 11.0001 23.5194 11.1055 23.7069 11.293C23.8943 11.4805 23.9999 11.7348 23.9999 12C24.0014 14.7463 23.0601 17.41 21.3338 19.5459C19.6074 21.6818 17.2001 23.1609 14.5145 23.7354C11.8289 24.3098 9.02711 23.9449 6.57798 22.7021C4.129 21.4594 2.18058 19.4138 1.05845 16.9072C-0.0636425 14.4007 -0.291363 11.5851 0.412938 8.93066C1.11733 6.27623 2.7113 3.94371 4.92856 2.32324C7.14593 0.702764 9.85249 -0.10772 12.5956 0.0273438C15.3386 0.162437 17.9524 1.23499 19.9999 3.06543V1C19.9999 0.734784 20.1053 0.480505 20.2928 0.292969C20.4803 0.105519 20.7347 0 20.9999 0ZM11.9999 6C12.2651 6 12.5193 6.10543 12.7069 6.29297C12.8944 6.48051 12.9999 6.73478 12.9999 7V11.5859L15.7069 14.293C15.889 14.4815 15.9894 14.734 15.9872 14.9961C15.9849 15.2583 15.8796 15.5089 15.6942 15.6943C15.5088 15.8797 15.2581 15.985 14.9959 15.9873C14.7339 15.9895 14.4813 15.8891 14.2928 15.707L11.2928 12.707C11.1053 12.5195 10.9999 12.2652 10.9999 12V7C10.9999 6.73478 11.1053 6.48051 11.2928 6.29297C11.4804 6.10543 11.7346 6 11.9999 6Z" fill="#1B1B1B"/>
</svg>`,
  document: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M5 10C5.552 10 6 10.448 6 11V22H12V17C12 16.448 12.448 16 13 16C13.552 16 14 16.448 14 17V18H16V17C16 16.448 16.448 16 17 16C17.552 16 18 16.448 18 17V19.5C18 21.981 15.981 24 13.5 24H4.5C2.019 24 0 21.981 0 19.5V14.5C0 12.019 2.019 10 4.5 10H5ZM2.05469 20C2.25469 20.978 3.022 21.7512 4 21.9502V20H2.05469ZM14 20V21.9492C14.978 21.7502 15.7502 20.978 15.9492 20H14ZM2 16V18H4V16H2ZM4 12.0498C3.023 12.2498 2.25469 13.023 2.05469 14H4V12.0498ZM19 0C21.757 0 24 2.243 24 5V9C24 11.757 21.757 14 19 14H13C10.243 14 8 11.757 8 9V5C8 2.243 10.243 0 13 0H19ZM19.5928 8.47461C18.8128 9.25561 17.5427 9.25461 16.7637 8.47461L16.2891 7.99512L11.8828 11.7793C12.2288 11.9193 12.605 12 13 12H19L19.001 11.999C20.655 11.999 22.001 10.653 22.001 8.99902V6.06738L19.5928 8.47461ZM13 2C11.346 2 10 3.346 10 5H9.99902V9.00098C9.99902 9.52283 10.145 10.0057 10.3799 10.4336L15.001 6.47266C15.81 5.79679 16.9701 5.84899 17.7061 6.58594L18.1807 7.06641L21.6377 3.60156C21.1336 2.65382 20.1468 2 19 2H13ZM12.5 3C13.328 3 14 3.672 14 4.5C14 5.328 13.328 6 12.5 6C11.672 6 11 5.328 11 4.5C11 3.672 11.672 3 12.5 3Z" fill="#1B1B1B"/>
</svg>`,
  flask: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 0C12.5178 0 12.9375 0.419733 12.9375 0.9375V20.25H21.1875C21.7052 20.25 22.125 19.8302 22.125 19.3125V4.6875C22.125 4.16975 21.7052 3.75 21.1875 3.75H15.75C15.2322 3.75 14.8125 3.33027 14.8125 2.8125C14.8125 2.29473 15.2322 1.875 15.75 1.875H21.1875C22.7408 1.875 24 3.13422 24 4.6875V19.3125C24 20.8658 22.7408 22.125 21.1875 22.125H12.9375V23.0625C12.9375 23.5803 12.5178 24 12 24C11.4822 24 11.0625 23.5803 11.0625 23.0625V22.125H2.8125C1.25922 22.125 0 20.8658 0 19.3125V4.6875C0 3.13422 1.25922 1.875 2.8125 1.875H11.0625V0.9375C11.0625 0.419733 11.4822 0 12 0ZM2.8125 3.75C2.29475 3.75 1.875 4.16975 1.875 4.6875V19.3125C1.875 19.8302 2.29475 20.25 2.8125 20.25H11.0625V3.75H2.8125ZM18.6494 13.2119C19.0155 12.8458 19.6095 12.8458 19.9756 13.2119C20.3417 13.578 20.3417 14.172 19.9756 14.5381L18.7637 15.75L19.9756 16.9619C20.3417 17.328 20.3417 17.922 19.9756 18.2881C19.6095 18.6542 19.0155 18.6542 18.6494 18.2881L17.4375 17.0762L16.2256 18.2881C15.8595 18.6542 15.2655 18.6542 14.8994 18.2881C14.5333 17.922 14.5333 17.328 14.8994 16.9619L16.1113 15.75L14.8994 14.5381C14.5333 14.172 14.5333 13.578 14.8994 13.2119C15.2655 12.8458 15.8595 12.8458 16.2256 13.2119L17.4375 14.4238L18.6494 13.2119ZM7.6875 13.3125C7.99816 12.8983 8.58579 12.8143 9 13.125C9.41421 13.4357 9.49816 14.0233 9.1875 14.4375L6.375 18.1875C6.18009 18.4474 5.86455 18.5877 5.54102 18.5586C5.21741 18.5294 4.93144 18.3346 4.78613 18.0439L3.84863 16.1689C3.61738 15.7059 3.80558 15.1426 4.26855 14.9111C4.73159 14.6799 5.29488 14.8681 5.52637 15.3311L5.78516 15.8486L7.6875 13.3125ZM7.77441 5.71191C8.14053 5.3458 8.73447 5.3458 9.10059 5.71191C9.4667 6.07803 9.4667 6.67197 9.10059 7.03809L7.88867 8.25L9.10059 9.46191C9.4667 9.82803 9.4667 10.422 9.10059 10.7881C8.73447 11.1542 8.14053 11.1542 7.77441 10.7881L6.5625 9.57617L5.35059 10.7881C4.98447 11.1542 4.39053 11.1542 4.02441 10.7881C3.6583 10.422 3.6583 9.82803 4.02441 9.46191L5.23633 8.25L4.02441 7.03809C3.6583 6.67197 3.6583 6.07803 4.02441 5.71191C4.39053 5.3458 4.98447 5.3458 5.35059 5.71191L6.5625 6.92383L7.77441 5.71191ZM18.6494 5.71191C19.0155 5.3458 19.6095 5.3458 19.9756 5.71191C20.3417 6.07803 20.3417 6.67197 19.9756 7.03809L18.7637 8.25L19.9756 9.46191C20.3417 9.82803 20.3417 10.422 19.9756 10.7881C19.6095 11.1542 19.0155 11.1542 18.6494 10.7881L17.4375 9.57617L16.2256 10.7881C15.8595 11.1542 15.2655 11.1542 14.8994 10.7881C14.5333 10.422 14.5333 9.82803 14.8994 9.46191L16.1113 8.25L14.8994 7.03809C14.5333 6.67197 14.5333 6.07803 14.8994 5.71191C15.2655 5.3458 15.8595 5.3458 16.2256 5.71191L17.4375 6.92383L18.6494 5.71191Z" fill="#1B1B1B"/>
</svg>`,
};

export function DashboardPage() {
  const currentRoute = getCurrentRoute();
  const isDashboard = currentRoute.startsWith("/dashboard");
  const isCampaigns = currentRoute.startsWith("/campaigns");

  const stats = [
    { value: 32, label: "Currently Running Campaigns", icon: statIcons.megaphone },
    { value: 6, label: "Scheduled Launches", icon: statIcons.clock },
    { value: 123, label: "Available Content Assets", icon: statIcons.document },
    { value: 4, label: "Running Experiments", icon: statIcons.flask },
  ];

  const recentActivity = [
    { time: "Today, 10:32", name: "CreativeCampaignName", text: "was updated" },
    { time: "Today, 10:32", name: "ContentName", text: "was added" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 10:32", name: "CreativeCampaign", text: "launching was scheduled" },
    { time: "Today, 9:20", name: "Weekly report", text: "was generated" },
  ];

  const campaigns = [
    ["Spring Promotion", "Web", "121", "01.02.2026", "12.02.2026"],
    ["March Boost Promo", "Email", "23", "01.03.2026", "30.03.2026"],
    ["New Season Launch", "Web", "325", "01.03.2026", "15.04.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
    ["Flash Promo Week", "Ads", "86", "01.03.2026", "17.03.2026"],
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
              ${SidebarNavItem({ label: "Dashboard", to: "/dashboard", icon: "dashboard", active: isDashboard })}
              ${SidebarNavItem({ label: "Campaign Manager", to: "/campaigns", icon: "campaign", active: isCampaigns })}
              ${SidebarNavItem({ label: "Audience", icon: "audience" })}
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
            <h1>Dashboard</h1>
            <p>Overview of current marketing activity</p>
          </div>
          <button type="button" class="dashboard-header__action">+ Create Campaign</button>
        </header>

        <section class="stats-grid" aria-label="Stats">
          ${stats
            .map((item) =>
              StatCard({
                icon: item.icon,
                value: item.value,
                label: item.label,
              }),
            )
            .join("")}
        </section>

        <section class="dashboard-grid-top">
          <article class="panel">
            <header class="panel__head">
              <h2>Campaign Activity</h2>
              <span>6M</span>
            </header>
            <p class="panel__sub">Leads</p>
            <div class="chart-placeholder chart-placeholder--line">
              <img src="${brandAssets.dashboardGrafik}" alt="Campaign activity chart" />
            </div>
          </article>
          <article class="panel">
            <header class="panel__head">
              <h2>Content Distribution</h2>
              <span>1W</span>
            </header>
            <p class="panel__sub">Lead Contribution by Channel</p>
            <div class="chart-placeholder chart-placeholder--donut">
              <img src="${brandAssets.dashboardDonut}" alt="Content distribution chart" />
            </div>
          </article>
        </section>

        <section class="dashboard-grid-bottom">
          <article class="panel panel-activity">
            <header class="panel__head">
              <h2>Recent Activity</h2>
            </header>
            <ul class="activity-list">
              ${recentActivity
                .map(
                  (item) => `
                <li class="activity-item">
                  <p class="activity-item__time">${escapeHtml(item.time)}</p>
                  <p class="activity-item__text"><span class="bold">${item.name}</span> ${escapeHtml(item.text)}</p>
                </li>
              `,
                )
                .join("")}
            </ul>
          </article>

          <article class="panel panel-campaign">
            <header class="panel__head">
              <h2>Active Campaigns</h2>
            </header>
            <div class="campaign-table-wrap">
              <table class="campaign-table">
                <thead>
                  <tr>
                    <th>Campaign Name</th>
                    <th>Channel</th>
                    <th>Leads</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${campaigns
                    .map(
                      (row) => `
                    <tr>
                      <td>${escapeHtml(row[0])}</td>
                      <td>${escapeHtml(row[1])}</td>
                      <td>${escapeHtml(row[2])}</td>
                      <td>${escapeHtml(row[3])}</td>
                      <td>${escapeHtml(row[4])}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </article>
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

function getCurrentRoute() {
  const hash = window.location?.hash ?? "";
  if (hash.startsWith("#/")) {
    return hash.slice(1);
  }
  return window.location?.pathname ?? "/";
}
