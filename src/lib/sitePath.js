// Support both root hosting and GitHub Pages project URLs.
export function sitePath(path) {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}

export function appPath(pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const relative = base && (pathname === base || pathname.startsWith(base + "/"))
    ? pathname.slice(base.length) : pathname;
  return relative.replace(/\/$/, "") || "/";
}
