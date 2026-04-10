import Navigo from "navigo";
import { LoginPage } from "./pages/LoginPage.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { CampaignPage } from "./pages/CampaignPage.js";
import { AudiencePage } from "./pages/AudiencePage.js";

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

  const render = (pageFactory) => {
    if (currentPage && typeof currentPage.unmount === "function") {
      currentPage.unmount();
    }

    appRoot.classList.add("route-enter");
    currentPage = pageFactory();
    currentPage.mount(appRoot);
    router.updatePageLinks();

    requestAnimationFrame(() => {
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
    .notFound(() => {
      router.navigate("/");
    });

  return router;
}
