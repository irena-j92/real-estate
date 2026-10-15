import { cpSync, mkdirSync, writeFileSync } from "node:fs";
for (const page of ["our-perspective", "privacy-policy", "terms-of-services"]) {
  mkdirSync(`dist/client/${page}`, { recursive: true });
  cpSync("dist/client/index.html", `dist/client/${page}/index.html`);
}
writeFileSync("dist/client/.nojekyll", "");
