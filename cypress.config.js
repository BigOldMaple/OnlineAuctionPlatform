import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // or whatever your app's local server URL is
    specPattern: "cypress/e2e/**/*.{cy.js,spec.js}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
