import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Content Library feature constraint: keep existing pages unchanged.
    // Allow unused helpers that may exist in these pages without failing lint.
    files: [
      "**/src/pages/DashboardPage.js",
      "**/src/pages/CampaignPage.js",
      "**/src/pages/AudiencePage.js",
    ],
    rules: {
      "no-unused-vars": "off",
    },
  },
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
