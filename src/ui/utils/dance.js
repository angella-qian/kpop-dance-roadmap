export const STATUS_CYCLE = ["Not started", "In progress", "Done"];
export const SORT_NONE = "none";
export const SORT_ASC = "asc";
export const SORT_DESC = "desc";

export function uniq(values) {
  return Array.from(new Set(values)).filter(Boolean);
}

export function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

export function skillMatches(skills, selectedSkill) {
  if (!selectedSkill) return true;
  return skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
}

export function difficultyTagClass(difficulty) {
  const d = String(difficulty || "").toLowerCase();
  if (d === "easy") return "diff-easy";
  if (d === "easy+") return "diff-easyplus";
  if (d === "medium") return "diff-medium";
  if (d === "hard") return "diff-hard";
  return "diff-other";
}

export function skillTagClass(skill) {
  const s = String(skill || "").trim().toLowerCase();
  const key = s.replace(/\s+/g, "-");
  switch (key) {
    case "control":
    case "isolation":
    case "musicality":
    case "groove":
    case "confidence":
    case "footwork":
    case "extension":
    case "stamina":
      return `skill-${key}`;
    default:
      return "skill-other";
  }
}

export function styleTagClass(style) {
  const s = String(style || "").toLowerCase();
  if (s.includes("cute")) return "style-cute";
  if (s.includes("soft")) return "style-soft";
  if (s.includes("elegant")) return "style-elegant";
  if (s.includes("girl crush") || s.includes("girl-crush")) return "style-girlcrush";
  if (s.includes("cool")) return "style-cool";
  if (s.includes("powerful")) return "style-powerful";
  return "style-other";
}

export function splitStyleLabels(styleValue) {
  return String(styleValue || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeStatus(status) {
  return STATUS_CYCLE.includes(status) ? status : "Not started";
}

export function statusTagClass(status) {
  const s = normalizeStatus(status).toLowerCase();
  if (s === "in progress") return "status-in-progress";
  if (s === "done") return "status-done";
  return "status-not-started";
}

export function ratingLabel(minRating) {
  if (minRating <= 0) return "Any";
  const filled = "★".repeat(minRating);
  const empty = "☆".repeat(5 - minRating);
  return `${filled}${empty}`;
}

export function difficultyRank(value) {
  const order = ["easy", "easy+", "medium", "hard", "hard+", "advanced", "very hard", "extreme"];
  const idx = order.indexOf(String(value || "").toLowerCase());
  return idx === -1 ? 999 : idx;
}

export function themeFromDanceStyle(styleStr) {
  const s = String(styleStr || "").toLowerCase();
  if (s.includes("elegant")) return "elegant";
  if (s.includes("cute") || s.includes("soft")) return "cute";
  if (s.includes("girl crush") || s.includes("girl-crush") || s.includes("cool") || s.includes("power"))
    return "cool";
  return "cool";
}

