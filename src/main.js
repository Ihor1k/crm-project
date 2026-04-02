import { createRouter } from "./router.js";

const app = document.getElementById("app");

if (!app) {
  console.error('CRM app: missing root element with id "app".');
} else {
  const router = createRouter(app);
  router.resolve();
}
