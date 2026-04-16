import Navigo from "navigo";
import { LoginPage } from "./pages/LoginPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { CampaignPage } from "./pages/CampaignPage.js";
import { AudiencePage } from "./pages/AudiencePage.js";
import { ContentLibraryPage } from "./pages/ContentLibraryPage.js";
import { LaunchCalendarPage } from "./pages/LaunchCalendarPage.js";
import { ExperimentsPage } from "./pages/ExperimentsPage.js";
import { ReportsPage } from "./pages/ReportsPage.js";
import { SettingsPage } from "./pages/SettingsPage.js";

/**
 * Navigo root aligned with Vite base URL (e.g. "/" or "/repo-name").
 */
function navigoRootFromViteBase() {
  const base = import.meta.env.BASE_URL ?? "/";
  // When Vite base is relative (e.g. "./" for GitHub Pages),
  // Navigo's root should remain "/" (it's not a filesystem path).
  if (base.startsWith(".")) {
    return "/";
  }
  if (base === "/" || base === "") {
    return "/";
  }
  return base.replace(/\/+$/, "") || "/";
}

export function createRouter(appRoot) {
  if (!appRoot) {
    throw new Error("createRouter: app root element is required");
  }

  const root = navigoRootFromViteBase();
  const router = new Navigo(root, { hash: true });
  let currentPage = null;
  let transitionToken = 0;

  const TRANSITION_MS = 160;

  const waitForFadeOut = (token) =>
    new Promise((resolve) => {
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      const onEnd = (event) => {
        // Only resolve for the app root's opacity transition.
        if (transitionToken !== token) return;
        if (event.target !== appRoot) return;
        if (event.propertyName !== "opacity") return;
        appRoot.removeEventListener("transitionend", onEnd);
        finish();
      };

      appRoot.addEventListener("transitionend", onEnd);
      // Fallback in case transitionend doesn't fire.
      window.setTimeout(() => {
        appRoot.removeEventListener("transitionend", onEnd);
        finish();
      }, TRANSITION_MS + 50);
    });

  const render = async (pageFactory) => {
    const token = ++transitionToken;

    // Fade out current view
    appRoot.classList.add("route-enter");
    await waitForFadeOut(token);
    if (transitionToken !== token) return;

    // Swap page while hidden
    if (currentPage && typeof currentPage.unmount === "function") {
      currentPage.unmount();
    }
    currentPage = pageFactory();
    currentPage.mount(appRoot);
    router.updatePageLinks();

    // Fade in
    requestAnimationFrame(() => {
      if (transitionToken !== token) return;
      appRoot.classList.remove("route-enter");
    });
  };

  router
    .on("/", () =>
      render(() =>
        LoginPage({
          onEnterDemo: () => router.navigate("/dashboard"),
        }),
      ),
    )
    .on("/dashboard", () =>
    render(() =>
    DashboardPage({ currentRoute: "/dashboard" }),
  ),
)
.on("/campaigns", () =>
  render(() =>
    CampaignPage({ currentRoute: "/campaigns" }),
  ),
)
.on("/audience", () =>
  render(() =>
    AudiencePage({ currentRoute: "/audience" }),
  ),
)
.on("/content-library", () =>
  render(() =>
    ContentLibraryPage({ currentRoute: "/content-library" }),
  ),
)
.on("/launch-calendar", () =>
  render(() =>
    LaunchCalendarPage({ currentRoute: "/launch-calendar" }),
  ),
)
.on("/experiments", () =>
  render(() =>
    ExperimentsPage({ currentRoute: "/experiments" }),
  ),
)
  .on("/reports", () =>
    render(() =>
      ReportsPage({ currentRoute: "/reports" }),
    ),
  )
  .on("/settings", () =>
    render(() =>
      SettingsPage({ currentRoute: "/settings" }),
    ),
  )
    .notFound(() => {
      router.navigate("/");
    });

  return router;
}
