export function getRoute() {
  const hash = window.location.hash || "#/";
  const cleaned = hash.startsWith("#") ? hash.slice(1) : hash; // "/..."
  const path = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  const [pathname, queryString = ""] = path.split("?");
  const query = new URLSearchParams(queryString);

  // Supported:
  // - "/"
  // - "/dance/<id>"
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { name: "home", params: {}, query };
  if (parts[0] === "dance" && parts[1]) {
    return { name: "dance", params: { id: parts[1] }, query };
  }
  return { name: "notFound", params: {}, query };
}

export function navigateTo(path) {
  window.location.hash = path.startsWith("#") ? path : `#${path}`;
}

