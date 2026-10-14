// Sites dispatch establishes visitor identity. Never accept a user ID from the client.
const propertyIds = new Set(["catalina-foothills-estate", "sabino-canyon-modern", "river-road-retreat", "gates-pass-hacienda"]);
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "Vary": "Cookie" } });
function identity(request) {
  const id = request.headers.get("oai-authenticated-user-id");
  if (!id) return null;
  const email = request.headers.get("oai-authenticated-user-email") || "";
  let name = request.headers.get("oai-authenticated-user-full-name") || "";
  if (request.headers.get("oai-authenticated-user-full-name-encoding") === "percent-encoded-utf-8") {
    try { name = decodeURIComponent(name); } catch { name = ""; }
  }
  return { id, email, name };
}
async function account(env, visitor) {
  const profile = await env.DB.prepare("SELECT name, area, alerts FROM realty_profiles WHERE user_id = ?").bind(visitor.id).first();
  const homes = await env.DB.prepare("SELECT property_id FROM realty_saved WHERE user_id = ? ORDER BY created_at DESC").bind(visitor.id).all();
  return { user: { email: visitor.email, name: profile?.name || visitor.name || visitor.email, area: profile?.area || "", alerts: Boolean(profile?.alerts) }, saved: homes.results.map(row => row.property_id).filter(id => propertyIds.has(id)) };
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Sites' hosted asset binding does not inherit Wrangler's SPA fallback.
    // Serve the application shell explicitly for each supported page URL.
    if (["/", "/index.html", "/our-perspective", "/our-perspective/", "/privacy-policy", "/privacy-policy/", "/terms-of-services", "/terms-of-services/"].includes(url.pathname) && ["GET", "HEAD"].includes(request.method)) {
      const assetUrl = new URL(request.url);
      assetUrl.pathname = "/index.html";
      const shell = await env.ASSETS.fetch(new Request(assetUrl, request));
      const response = new Response(shell.body, shell);
      response.headers.set("Cache-Control", "no-cache, must-revalidate");
      return response;
    }
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    const visitor = identity(request);
    if (!visitor) return json({ error: "Sign in to use your account." }, 401);
    if (!["GET", "HEAD"].includes(request.method) && request.headers.get("Origin") !== url.origin) return json({ error: "Invalid request origin." }, 403);
    if (!env.DB) return json({ error: "Account storage is unavailable." }, 503);
    try {
      if (url.pathname === "/api/account") {
        if (request.method === "GET") return json(await account(env, visitor));
        if (request.method === "PATCH") {
          if (!request.headers.get("Content-Type")?.includes("application/json")) return json({ error: "Expected JSON." }, 415);
          let input;
          try { const body = await request.text(); if (body.length > 2048) return json({ error: "Request too large." }, 413); input = JSON.parse(body); } catch { return json({ error: "Invalid account details." }, 400); }
          if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "Invalid account details." }, 400);
          if (("name" in input && (typeof input.name !== "string" || !input.name.trim() || input.name.length > 100)) || ("area" in input && (typeof input.area !== "string" || input.area.length > 120)) || ("alerts" in input && typeof input.alerts !== "boolean")) return json({ error: "Please check your account details." }, 400);
          const existing = await env.DB.prepare("SELECT name, area, alerts FROM realty_profiles WHERE user_id = ?").bind(visitor.id).first();
          await env.DB.prepare("INSERT INTO realty_profiles (user_id, name, area, alerts) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET name = excluded.name, area = excluded.area, alerts = excluded.alerts").bind(visitor.id, input.name?.trim() ?? existing?.name ?? visitor.name, input.area?.trim() ?? existing?.area ?? "", "alerts" in input ? Number(input.alerts) : existing?.alerts ?? 0).run();
          return json(await account(env, visitor));
        }
        return json({ error: "Method not allowed." }, 405);
      }
      if (url.pathname.startsWith("/api/saved/")) {
        const id = decodeURIComponent(url.pathname.slice("/api/saved/".length));
        if (!propertyIds.has(id)) return json({ error: "Property not found." }, 404);
        if (request.method === "PUT") {
          await env.DB.prepare("INSERT INTO realty_saved (user_id, property_id) VALUES (?, ?) ON CONFLICT(user_id, property_id) DO NOTHING").bind(visitor.id, id).run();
        } else if (request.method === "DELETE") {
          await env.DB.prepare("DELETE FROM realty_saved WHERE user_id = ? AND property_id = ?").bind(visitor.id, id).run();
        } else return json({ error: "Method not allowed." }, 405);
        return json({ success: true });
      }
      return json({ error: "Not found." }, 404);
    } catch { return json({ error: "Your account could not be updated. Please try again." }, 500); }
  },
};
