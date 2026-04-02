import Navigo from "navigo";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CampaignPage } from "./pages/CampaignPage";

/**
 * Navigo root aligned with Vite base URL (e.g. "/" or "/repo-name").
 */
function navigoRootFromViteBase() {
  const base = import.meta.env.BASE_URL ?? "/";
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
  const router = new Navigo(root, { hash: false });

  const render = (pageFactory) => {
    const page = pageFactory();
    page.mount(appRoot);
    router.updatePageLinks();
  };

  router
    .on("/", () =>
      render(() =>
        LoginPage({
          onEnterDemo: () => router.navigate("dashboard"),
        }),
      ),
    )
    .on("/dashboard", () => render(() => DashboardPage()))
    .on("/campaigns", () => render(() => CampaignPage()))
    .notFound(() => {
      router.navigate("/");
    });

  return router;
}
