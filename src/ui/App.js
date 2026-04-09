import { html, useCallback, useEffect, useMemo, useState } from "./lib.js";
import { DANCES } from "../data/dances_from_csv.js";
import { getRoute, navigateTo } from "./router.js";
import { Header } from "./components/Header.js";
import { Filters } from "./components/Filters.js";
import { DanceTable } from "./components/DanceTable.js";
import { VideoSection } from "./components/VideoSection.js";
import { DanceMeta } from "./components/DanceMeta.js";
import { DetailsPanel } from "./components/DetailsPanel.js";
import { Button } from "./components/ui/Button.js";
import {
  STATUS_CYCLE,
  SORT_ASC,
  SORT_DESC,
  SORT_NONE,
  difficultyRank,
  includesInsensitive,
  normalizeStatus,
  skillMatches,
  splitStyleLabels,
  themeFromDanceStyle,
  uniq,
} from "./utils/dance.js";

const THEME_DEFS = {
  cute: {
    mode: "light",
    bgTop: "#ffffff",
    bg: "#fff7fb",
    text: "#1e1028",
    muted: "#5f5674",
    faint: "#8c86a1",
    controlBg: "#fff0f5",
    controlBorder: "rgba(255,183,197,0.45)",
    controlText: "#1e1028",
    controlPlaceholder: "rgba(30,16,40,0.48)",
    controlInnerShadow: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(18,16,40,0.06)",
    panel: "rgba(255,255,255,0.94)",
    panel2: "rgba(255,255,255,0.86)",
    border: "rgba(30,16,40,0.06)",
    accent: "#ffb7c5", // strawberry milk
    accent2: "#bde0fe", // baby blue
    bg1: "rgba(255,198,211,0.38)", // #FFC6D3
    bg2: "rgba(189,224,254,0.30)", // #BDE0FE
    bg3: "rgba(231,198,255,0.22)", // #E7C6FF
  },
  cool: {
    mode: "dark",
    bgTop: "#070a13",
    bg: "#0b0b0f",
    text: "rgba(255,255,255,0.92)",
    muted: "rgba(255,255,255,0.72)",
    faint: "rgba(255,255,255,0.55)",
    controlBg: "rgba(16,16,28,0.82)",
    controlBorder: "rgba(255,255,255,0.16)",
    controlText: "rgba(255,255,255,0.94)",
    controlPlaceholder: "rgba(255,255,255,0.55)",
    controlInnerShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.30)",
    panel: "rgba(255,255,255,0.06)",
    panel2: "rgba(255,255,255,0.09)",
    border: "rgba(255,255,255,0.12)",
    accent: "#00f5d4", // icy blue
    accent2: "#ff006e", // neon pink
    bg1: "rgba(58,134,255,0.22)", // electric blue
    bg2: "rgba(199,125,255,0.20)", // neon violet
    bg3: "rgba(255,46,99,0.12)", // hot pink
  },
  elegant: {
    mode: "light",
    bgTop: "#fff8f0",
    bg: "#fff8f0",
    text: "#231a12",
    muted: "#6f6258",
    faint: "#9a8f86",
    controlBg: "#fff5e1",
    controlBorder: "rgba(212,175,55,0.22)",
    controlText: "#231a12",
    controlPlaceholder: "rgba(35,26,18,0.42)",
    controlInnerShadow: "inset 0 1px 0 rgba(255,255,255,0.90), inset 0 -1px 0 rgba(22,18,46,0.06)",
    panel: "rgba(255,255,255,0.92)",
    panel2: "rgba(255,255,255,0.86)",
    border: "rgba(35,26,18,0.08)",
    accent: "#d4af37", // gold
    accent2: "#d8a7b1", // dusty rose
    // Keep velvet almost flat: very subtle warmth, minimal gradients
    bg1: "rgba(253,235,208,0.20)", // champagne
    bg2: "rgba(245,230,211,0.14)", // beige
    bg3: "rgba(216,167,177,0.10)", // dusty rose
  },
};

function applyTheme(themeId) {
  const theme = THEME_DEFS[themeId] || THEME_DEFS.cool;
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);
  root.setAttribute("data-mode", theme.mode);
  root.style.setProperty("--bg-top", theme.bgTop);
  root.style.setProperty("--bg", theme.bg);
  root.style.setProperty("--text", theme.text);
  root.style.setProperty("--muted", theme.muted);
  root.style.setProperty("--faint", theme.faint);
  root.style.setProperty("--control-bg", theme.controlBg);
  root.style.setProperty("--control-border", theme.controlBorder);
  root.style.setProperty("--control-text", theme.controlText);
  root.style.setProperty("--control-placeholder", theme.controlPlaceholder);
  root.style.setProperty("--control-inner-shadow", theme.controlInnerShadow);
  root.style.setProperty("--panel", theme.panel);
  root.style.setProperty("--panel2", theme.panel2);
  root.style.setProperty("--border", theme.border);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent2", theme.accent2);
  root.style.setProperty("--bg1", theme.bg1);
  root.style.setProperty("--bg2", theme.bg2);
  root.style.setProperty("--bg3", theme.bg3);
}

function TablePage({ themeMode, setThemeMode, ratings, onRate, statuses, onSetStatus }) {
  const difficultyOrder = useMemo(
    () => ["Easy", "Easy+", "Medium", "Hard", "Hard+", "Advanced", "Very Hard", "Extreme"],
    []
  );
  const groupOptions = useMemo(() => uniq(DANCES.map((d) => d.group || d.artist)).sort((a, b) => a.localeCompare(b)), []);
  const difficultyOptions = useMemo(
    () => uniq(DANCES.map((d) => d.difficulty).filter(Boolean)).sort((a, b) => {
      const ai = difficultyOrder.indexOf(a);
      const bi = difficultyOrder.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || String(a).localeCompare(String(b));
    }),
    [difficultyOrder]
  );
  const styleOptions = useMemo(
    () => uniq(DANCES.flatMap((d) => splitStyleLabels(d.style)).filter(Boolean)).sort((a, b) => String(a).localeCompare(String(b))),
    []
  );
  const subtitleNode = useMemo(
    () =>
      html`<span>
        Search dances by <b>difficulty</b>, <b>style</b>, <b>group</b>, and <b>skill focus</b>
        — a starter-friendly answer to “where do I begin?”
      </span>`,
    []
  );
  const skillOptions = useMemo(() => {
    const skills = [];
    DANCES.forEach((d) => Array.isArray(d.skills) && skills.push(...d.skills));
    return uniq(skills.filter(Boolean)).sort((a, b) => String(a).localeCompare(String(b)));
  }, []);

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [style, setStyle] = useState([]);
  const [group, setGroup] = useState([]);
  const [skill, setSkill] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(SORT_NONE);

  const onSearch = useCallback((v) => setQ(v), []);
  const clearFilters = useCallback(() => {
    setQ("");
    setDifficulty([]);
    setStyle([]);
    setGroup([]);
    setSkill([]);
    setStatusFilter([]);
    setMinRating(0);
  }, []);

  const filtered = useMemo(
    () =>
      DANCES.filter((d) => {
        const anyText =
          includesInsensitive(d.artist, q) ||
          includesInsensitive(d.song, q) ||
          includesInsensitive(d.group, q) ||
          includesInsensitive(d.style, q) ||
          d.skills.some((s) => includesInsensitive(s, q));
        if (!anyText) return false;
        if (difficulty.length > 0 && !difficulty.includes(d.difficulty)) return false;
        if (style.length > 0 && !style.some((s) => splitStyleLabels(d.style).includes(s))) return false;
        if (group.length > 0 && !group.includes(d.group || d.artist)) return false;
        if (skill.length > 0 && !skill.some((s) => skillMatches(d.skills, s))) return false;
        const danceStatus = normalizeStatus(statuses[d.id]);
        if (statusFilter.length > 0 && !statusFilter.includes(danceStatus)) return false;
        const danceRating = Number(ratings[d.id] || 0);
        if (minRating > 0 && danceRating < minRating) return false;
        return true;
      }),
    [q, difficulty, style, group, skill, statusFilter, statuses, ratings, minRating]
  );

  const sortedRows = useMemo(() => {
    if (!sortKey || sortDir === SORT_NONE) return filtered;
    const rows = [...filtered];
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "artist") cmp = String(a.artist || "").localeCompare(String(b.artist || ""));
      else if (sortKey === "difficulty") cmp = difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
      else if (sortKey === "rating") cmp = Number(ratings[a.id] || 0) - Number(ratings[b.id] || 0);
      return sortDir === SORT_ASC ? cmp : -cmp;
    });
    return rows;
  }, [filtered, sortKey, sortDir, ratings]);

  const onSort = useCallback(
    (key) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir(SORT_ASC);
        return;
      }
      if (sortDir === SORT_ASC) return setSortDir(SORT_DESC);
      if (sortDir === SORT_DESC) {
        setSortKey(null);
        return setSortDir(SORT_NONE);
      }
      setSortDir(SORT_ASC);
    },
    [sortDir, sortKey]
  );
  const sortIcon = useCallback(
    (key) => (sortKey !== key || sortDir === SORT_NONE ? "↕" : sortDir === SORT_ASC ? "▲" : "▼"),
    [sortDir, sortKey]
  );
  const onNavigate = useCallback((id) => navigateTo(`/dance/${id}`), []);

  return html`<div className="container space-y-6">
    <${Header}
      title="Kpop Dance Finder"
      subtitleNode=${subtitleNode}
      themeMode=${themeMode}
      setThemeMode=${setThemeMode}
    />
    <${Filters}
      q=${q}
      onSearch=${onSearch}
      difficultyOptions=${difficultyOptions}
      difficulty=${difficulty}
      setDifficulty=${setDifficulty}
      styleOptions=${styleOptions}
      style=${style}
      setStyle=${setStyle}
      groupOptions=${groupOptions}
      group=${group}
      setGroup=${setGroup}
      skillOptions=${skillOptions}
      skill=${skill}
      setSkill=${setSkill}
      statusOptions=${STATUS_CYCLE}
      statusFilter=${statusFilter}
      setStatusFilter=${setStatusFilter}
      minRating=${minRating}
      setMinRating=${setMinRating}
      onClear=${clearFilters}
    />
    <div className="panel">
      ${sortedRows.length === 0
        ? html`<div className="empty">No matches, try clearing filters.</div>`
        : html`<${DanceTable}
            rows=${sortedRows}
            statuses=${statuses}
            ratings=${ratings}
            onNavigate=${onNavigate}
            onSetStatus=${onSetStatus}
            onRate=${onRate}
            onSort=${onSort}
            sortIcon=${sortIcon}
          />`}
      <div className="footerline"><div>Showing <b>${sortedRows.length}</b> of <b>${DANCES.length}</b></div><div></div></div>
    </div>
  </div>`;
}

function DetailPage({ id, themeMode, setThemeMode, ratings, onRate }) {
  const dance = DANCES.find((d) => d.id === id);
  if (!dance) {
    return html`<div className="container space-y-6">
      <${Header}
        title="Kpop Dance Finder"
        subtitle="That dance id wasn’t found."
        themeMode=${themeMode}
        setThemeMode=${setThemeMode}
      />
      <div className="panel"><div className="empty">Try going back to the library.</div></div>
    </div>`;
  }

  const params = [];
  if (dance.preview && typeof dance.preview.startSeconds === "number") params.push(`start=${dance.preview.startSeconds}`);
  params.push("rel=0");
  const embedSrc = `https://www.youtube-nocookie.com/embed/${dance.preview.youtubeId}?${params.join("&")}`;

  return html`<div className="container space-y-6">
    <${Header}
      title="Kpop Dance Finder"
      subtitle="Preview the dance and jump to a tutorial."
      themeMode=${themeMode}
      setThemeMode=${setThemeMode}
      showBack=${true}
      onBack=${() => navigateTo("/")}
    />
    <div className="panel">
      <div className="detailStack">
        <div className="detailTopGrid">
          <div>
            <${VideoSection} embedSrc=${embedSrc} title=${`${dance.artist} - ${dance.song} preview`} />
            <${DanceMeta}
              dance=${dance}
              rating=${Number(ratings[dance.id] || 0)}
              onRate=${onRate}
            />
          </div>
          <${DetailsPanel} dance=${dance} />
        </div>
      </div>
    </div>
  </div>`;
}

export function App() {
  const [route, setRoute] = useState(getRoute());
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const stored = localStorage.getItem("themeMode");
      return stored && stored !== "auto" ? stored : "cute";
    } catch (_) {
      return "cute";
    }
  });
  const [ratings, setRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("danceRatings");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  });
  const [statuses, setStatuses] = useState(() => {
    try {
      const raw = localStorage.getItem("danceStatuses");
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  });

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const resolvedThemeId = themeMode;

  useEffect(() => {
    applyTheme(resolvedThemeId);
    try {
      localStorage.setItem("themeMode", themeMode);
    } catch (_) {
      // ignore
    }
  }, [resolvedThemeId, themeMode]);

  useEffect(() => {
    try {
      localStorage.setItem("danceRatings", JSON.stringify(ratings));
    } catch (_) {
      // ignore
    }
  }, [ratings]);
  useEffect(() => {
    try {
      localStorage.setItem("danceStatuses", JSON.stringify(statuses));
    } catch (_) {
      // ignore
    }
  }, [statuses]);

  const handleRate = useCallback((danceId, stars) => {
    setRatings((prev) => ({ ...prev, [danceId]: stars }));
  }, []);
  const handleSetStatus = useCallback((danceId, status) => {
    setStatuses((prev) => ({ ...prev, [danceId]: normalizeStatus(status) }));
  }, []);

  if (route.name === "home")
    return html`<${TablePage}
      themeMode=${themeMode}
      setThemeMode=${setThemeMode}
      ratings=${ratings}
      onRate=${handleRate}
      statuses=${statuses}
      onSetStatus=${handleSetStatus}
    />`;
  if (route.name === "dance")
    return html`<${DetailPage}
      id=${route.params.id}
      themeMode=${themeMode}
      setThemeMode=${setThemeMode}
      ratings=${ratings}
      onRate=${handleRate}
    />`;

  return html`<div className="container">
    <div className="topbar">
      <div className="brand"><h1>Kpop Dance Finder</h1><p className="muted">Page not found.</p></div>
      <${Button} onClick=${() => navigateTo("/")}>Back</${Button}>
    </div>
    <div className="panel"><div className="empty">That route doesn’t exist.</div></div>
  </div>`;
}

