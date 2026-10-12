import { cpSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
mkdirSync("dist/server", { recursive: true });
mkdirSync("dist/.openai", { recursive: true });
cpSync("server/index.js", "dist/server/index.js");
cpSync(".openai/hosting.json", "dist/.openai/hosting.json");
const manifest = JSON.parse(readFileSync(".openai/hosting.json", "utf8"));
writeFileSync("dist/server/wrangler.json", JSON.stringify({ name: "sunter-realty", main: "index.js", compatibility_date: "2026-10-01", assets: { directory: "../client", binding: "ASSETS", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] }, d1_databases: [{ binding: manifest.d1, database_name: "site-creator-d1", database_id: "00000000-0000-0000-0000-000000000000" }] }, null, 2));
