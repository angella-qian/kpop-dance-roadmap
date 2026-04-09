import React, { useEffect, useMemo, useRef, useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { DANCES } from "../data/dances_from_csv.js";
import { getRoute, navigateTo } from "./router.js";

const html = htm.bind(React.createElement);

function uniq(values) {
  return Array.from(new Set(values)).filter(Boolean);
}

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

function themeFromDanceStyle(styleStr) {
  const s = String(styleStr || "").toLowerCase();
  if (s.includes("elegant")) return "elegant";
  if (s.includes("cute") || s.includes("soft")) return "cute";
  if (s.includes("girl crush") || s.includes("girl-crush") || s.includes("cool") || s.includes("power"))
    return "cool";
  return "cool";
}

function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

function skillMatches(skills, selectedSkill) {
  if (!selectedSkill) return true;
  return skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
}

function difficultyTagClass(difficulty) {
  const d = String(difficulty || "").toLowerCase();
  if (d === "easy") return "diff-easy";
  if (d === "easy+") return "diff-easyplus";
  if (d === "medium") return "diff-medium";
  if (d === "hard") return "diff-hard";
  return "diff-other";
}

function skillTagClass(skill) {
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

function styleTagClass(style) {
  const s = String(style || "").toLowerCase();
  if (s.includes("cute")) return "style-cute";
  if (s.includes("soft")) return "style-soft";
  if (s.includes("elegant")) return "style-elegant";
  if (s.includes("girl crush") || s.includes("girl-crush")) return "style-girlcrush";
  if (s.includes("cool")) return "style-cool";
  if (s.includes("powerful")) return "style-powerful";
  return "style-other";
}

function splitStyleLabels(styleValue) {
  return String(styleValue || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const STATUS_CYCLE = ["Not started", "In progress", "Done"];

function normalizeStatus(status) {
  return STATUS_CYCLE.includes(status) ? status : "Not started";
}

function statusTagClass(status) {
  const s = normalizeStatus(status).toLowerCase();
  if (s === "in progress") return "status-in-progress";
  if (s === "done") return "status-done";
  return "status-not-started";
}

function StarRating({ value = 0, onChange, compact = false }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value || 0;

  return html`<div
    className=${`starRating ${compact ? "compact" : ""}`}
    onMouseLeave=${() => setHovered(0)}
    onClick=${(event) => event.stopPropagation()}
  >
    ${[1, 2, 3, 4, 5].map(
      (n) => html`<button
        key=${n}
        type="button"
        className=${`star ${n <= active ? "isActive" : ""}`}
        onMouseEnter=${() => setHovered(n)}
        onClick=${() => onChange(n)}
        aria-label=${`Rate ${n} stars`}
      >
        ${n <= active ? "★" : "☆"}
      </button>`
    )}
  </div>`;
}

function MultiSelect({ label, options, values, onChange, placeholder = "Any", kind = "skill" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const selectedSet = useMemo(() => new Set(values), [values]);

  const toggle = (value) => {
    if (selectedSet.has(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const removeValue = (value, event) => {
    event.stopPropagation();
    onChange(values.filter((v) => v !== value));
  };

  return html`
    <div className=${`field multiSelectField ${open ? "isOpen" : ""}`} ref=${rootRef}>
      <label>${label}</label>
      <button
        type="button"
        className=${`multiSelectTrigger ${open ? "isOpen" : ""}`}
        onClick=${() => setOpen(!open)}
        aria-expanded=${open}
      >
        ${values.length === 0
          ? html`<span className="multiSelectPlaceholder">${placeholder}</span>`
          : html`<span className="multiSelectPills">
              ${values.map((value) => {
                const cls =
                  kind === "difficulty"
                    ? `tag difficulty ${difficultyTagClass(value)}`
                    : kind === "style"
                    ? `tag style ${styleTagClass(value)}`
                    : `tag skill ${skillTagClass(value)}`;
                return html`<span key=${value} className=${`${cls} multiSelectPill`}>
                  ${value}
                  <span
                    className="multiSelectPillRemove"
                    onClick=${(event) => removeValue(value, event)}
                    role="button"
                    aria-label=${`Remove ${value}`}
                  >
                    ×
                  </span>
                </span>`;
              })}
            </span>`}
        <span className="multiSelectChevron">${open ? "▴" : "▾"}</span>
      </button>

      <div className=${`multiSelectMenu ${open ? "isOpen" : ""}`}>
        ${options.map((option) => {
          const checked = selectedSet.has(option);
          return html`<button
            key=${option}
            type="button"
            className=${`multiSelectOption ${checked ? "isSelected" : ""}`}
            onClick=${() => toggle(option)}
          >
            <span className="multiSelectCheckbox">${checked ? "✓" : ""}</span>
            <span>${option}</span>
          </button>`;
        })}
      </div>
    </div>
  `;
}

function StatusSelect({ status, onSelect, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const current = normalizeStatus(status);

  return html`
    <div className=${`statusSelectField ${open ? "isOpen" : ""}`} ref=${rootRef}>
      <button
        type="button"
        className=${`tag status ${statusTagClass(current)} statusSelectTrigger`}
        onClick=${(event) => {
          event.stopPropagation();
          setOpen(!open);
        }}
        aria-expanded=${open}
        aria-label=${`Set status for ${label}`}
      >
        <span>${current}</span>
        <span className="statusSelectChevron">${open ? "▴" : "▾"}</span>
      </button>
      <div className=${`statusSelectMenu ${open ? "isOpen" : ""}`}>
        ${STATUS_CYCLE.map(
          (option) => html`<button
            key=${option}
            type="button"
            className=${`statusSelectOption ${current === option ? "isSelected" : ""}`}
            onClick=${(event) => {
              event.stopPropagation();
              onSelect(option);
              setOpen(false);
            }}
          >
            <span className="statusSelectCheck">${current === option ? "✓" : ""}</span>
            <span>${option}</span>
          </button>`
        )}
      </div>
    </div>
  `;
}

function ratingLabel(minRating) {
  if (minRating <= 0) return "Any";
  const filled = "★".repeat(minRating);
  const empty = "☆".repeat(5 - minRating);
  return `${filled}${empty}`;
}

function RatingFilterSelect({ minRating, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const options = [1, 2, 3, 4, 5];

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return html`
    <div className=${`field ratingFilterField ${open ? "isOpen" : ""}`} ref=${rootRef}>
      <label>Minimum rating</label>
      <button
        type="button"
        className=${`ratingFilterTrigger ${open ? "isOpen" : ""}`}
        onClick=${() => setOpen(!open)}
        aria-expanded=${open}
      >
        <span className=${`${minRating > 0 ? "ratingFilterStars" : "multiSelectPlaceholder"}`}>
          ${ratingLabel(minRating)}
        </span>
        <span className="ratingFilterChevron">${open ? "▴" : "▾"}</span>
      </button>
      <div className=${`ratingFilterMenu ${open ? "isOpen" : ""}`}>
        <button
          type="button"
          className=${`ratingFilterOption ${minRating === 0 ? "isSelected" : ""}`}
          onClick=${() => {
            onSelect(0);
            setOpen(false);
          }}
        >
          <span className="statusSelectCheck">${minRating === 0 ? "✓" : ""}</span>
          <span>Any</span>
        </button>
        ${options.map(
          (rating) => html`<button
            key=${rating}
            type="button"
            className=${`ratingFilterOption ${minRating === rating ? "isSelected" : ""}`}
            onClick=${() => {
              onSelect(rating);
              setOpen(false);
            }}
          >
            <span className="statusSelectCheck">${minRating === rating ? "✓" : ""}</span>
            <span className="ratingFilterStars">${ratingLabel(rating)}</span>
          </button>`
        )}
      </div>
    </div>
  `;
}

function TablePage({ themeMode, setThemeMode, ratings, onRate, statuses, onSetStatus }) {
  const groupOptions = useMemo(() => {
    const groups = uniq(DANCES.map((d) => d.group || d.artist));
    return groups.sort((a, b) => a.localeCompare(b));
  }, []);

  const difficultyOptions = useMemo(() => {
    const order = ["Easy", "Easy+", "Medium", "Hard", "Hard+", "Advanced", "Very Hard", "Extreme"];
    const values = uniq(DANCES.map((d) => d.difficulty).filter(Boolean));
    return values.sort((a, b) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      const aRank = ai === -1 ? 999 : ai;
      const bRank = bi === -1 ? 999 : bi;
      if (aRank !== bRank) return aRank - bRank;
      return String(a).localeCompare(String(b));
    });
  }, []);

  const styleOptions = useMemo(() => {
    const values = uniq(
      DANCES.flatMap((d) => splitStyleLabels(d.style)).filter(Boolean)
    );
    return values.sort((a, b) => String(a).localeCompare(String(b)));
  }, []);

  const skillOptions = useMemo(() => {
    const skills = [];
    DANCES.forEach((d) => {
      if (Array.isArray(d.skills)) skills.push(...d.skills);
    });
    const values = uniq(skills.filter(Boolean));
    return values.sort((a, b) => String(a).localeCompare(String(b)));
  }, []);
  const statusOptions = STATUS_CYCLE;

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [style, setStyle] = useState([]);
  const [group, setGroup] = useState([]);
  const [skill, setSkill] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const clearFilters = () => {
    setQ("");
    setDifficulty([]);
    setStyle([]);
    setGroup([]);
    setSkill([]);
    setStatusFilter([]);
    setMinRating(0);
  };

  const filtered = useMemo(() => {
    return DANCES.filter((d) => {
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
    });
  }, [q, difficulty, style, group, skill, statusFilter, statuses, ratings, minRating]);

  return html`
    <div className="container space-y-6">
      <div className="topbar">
        <div className="brand">
          <h1 className="text-3xl font-semibold tracking-tight">Kpop Dance Finder</h1>
          <p>
            Search dances by <b>difficulty</b>, <b>style</b>, <b>group</b>, and <b>skill focus</b>
            — a starter-friendly answer to “where do I begin?”
          </p>
        </div>
        <div style=${{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="field" style=${{ minWidth: "240px" }}>
            <label>Theme</label>
            <select value=${themeMode} onChange=${(e) => setThemeMode(e.target.value)}>
              <option value="cute">bubble pop</option>
              <option value="cool">girl crush</option>
              <option value="elegant">velvet</option>
            </select>
          </div>
        </div>
      </div>

      <div className="panel filtersPanel">
        <div className="controls">
          <div className="field">
            <label>Search (artist, song, style, skills)</label>
            <input
              type="text"
              value=${q}
              placeholder='Try "Control" or "TWICE"'
              onChange=${(e) => setQ(e.target.value)}
            />
          </div>
          <${MultiSelect}
            label="Difficulty"
            options=${difficultyOptions}
            values=${difficulty}
            onChange=${setDifficulty}
            placeholder="Any"
            kind="difficulty"
          />
          <${MultiSelect}
            label="Style / concept"
            options=${styleOptions}
            values=${style}
            onChange=${setStyle}
            placeholder="Any"
            kind="style"
          />
          <${MultiSelect}
            label="Group"
            options=${groupOptions}
            values=${group}
            onChange=${setGroup}
            placeholder="Any"
            kind="skill"
          />

          <${MultiSelect}
            label="Skill focus"
            options=${skillOptions}
            values=${skill}
            onChange=${setSkill}
            placeholder="Any"
            kind="skill"
          />
          <${MultiSelect}
            label="Status"
            options=${statusOptions}
            values=${statusFilter}
            onChange=${setStatusFilter}
            placeholder="Any"
            kind="skill"
          />
          <${RatingFilterSelect}
            minRating=${minRating}
            onSelect=${setMinRating}
          />
          <div className="field" style=${{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btnGhostSm" onClick=${clearFilters} aria-label="Clear filters">
              ↺ Clear
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        ${filtered.length === 0
          ? html`<div className="empty">
              No matches. Try clearing filters or searching by a skill tag like
              <span className="tag accent">${skillOptions[0] || "Control"}</span>.
            </div>`
          : html`<table>
              <thead>
                <tr>
                  <th style=${{ width: "32%" }}>Artist + song</th>
                  <th style=${{ width: "12%" }}>Difficulty</th>
                  <th style=${{ width: "18%" }}>Style</th>
                  <th style=${{ width: "22%" }}>Skill focus</th>
                  <th style=${{ width: "12%" }}>Status</th>
                  <th style=${{ width: "14%", textAlign: "left" }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(
                  (d) => {
                    const status = normalizeStatus(statuses[d.id]);
                    return html`<tr key=${d.id} onClick=${() => navigateTo(`/dance/${d.id}`)}>
                    <td>
                      <div className="font-semibold tracking-tight">${d.artist}</div>
                      <div className="muted text-[12px]">${d.song}</div>
                    </td>
                    <td>
                      <span className=${`tag difficulty ${difficultyTagClass(d.difficulty)}`}>
                        ${d.difficulty}
                      </span>
                    </td>
                    <td>
                      <div className="tagrow">
                        ${splitStyleLabels(d.style).map(
                          (styleLabel) =>
                            html`<span
                              key=${styleLabel}
                              className=${`tag style ${styleTagClass(styleLabel)}`}
                            >
                              ${styleLabel}
                            </span>`
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="tagrow">
                        ${d.skills.map(
                          (s) =>
                            html`<span key=${s} className=${`tag skill ${skillTagClass(s)}`}>${s}</span>`
                        )}
                      </div>
                    </td>
                    <td>
                      <${StatusSelect}
                        status=${status}
                        onSelect=${(next) => onSetStatus(d.id, next)}
                        label=${`${d.artist} ${d.song}`}
                      />
                    </td>
                    <td>
                      <${StarRating}
                        value=${Number(ratings[d.id] || 0)}
                        onChange=${(next) => onRate(d.id, next)}
                        compact=${true}
                      />
                    </td>
                  </tr>`;
                  }
                )}
              </tbody>
            </table>`}

        <div className="footerline">
          <div>
            Showing <b>${filtered.length}</b> of <b>${DANCES.length}</b>
          </div>
          <div></div>
      </div>
      </div>
    </div>
  `;
}

function DetailPage({ id, themeMode, setThemeMode, ratings, onRate }) {
  const dance = DANCES.find((d) => d.id === id);

  if (!dance) {
    return html`
      <div className="container space-y-6">
        <div className="topbar">
          <div className="brand">
            <h1>Kpop Dance Finder</h1>
            <p className="muted">That dance id wasn’t found.</p>
          </div>
          <button className="btn" onClick=${() => navigateTo("/")}>Back</button>
        </div>
        <div className="panel">
          <div className="empty">Try going back to the library.</div>
        </div>
      </div>
    `;
  }

  const params = [];
  if (dance.preview && typeof dance.preview.startSeconds === "number") {
    params.push(`start=${dance.preview.startSeconds}`);
  }
  params.push("rel=0");
  const embedSrc = `https://www.youtube-nocookie.com/embed/${dance.preview.youtubeId}?${params.join("&")}`;

  return html`
    <div className="container space-y-6">
      <div className="topbar">
        <div className="brand">
          <h1>Kpop Dance Finder</h1>
          <p className="muted">Preview the dance and jump to a tutorial.</p>
        </div>
        <div style=${{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn" onClick=${() => navigateTo("/")}>Back to table</button>
          <div className="field" style=${{ minWidth: "220px" }}>
            <label>Theme</label>
            <select value=${themeMode} onChange=${(e) => setThemeMode(e.target.value)}>
              <option value="cute">bubble pop</option>
              <option value="cool">girl crush</option>
              <option value="elegant">velvet</option>
            </select>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="detailGrid">
          <div className="card">
            <div className="iframeWrap">
              <iframe
                src=${embedSrc}
                title=${`${dance.artist} - ${dance.song} preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen=${true}
              ></iframe>
            </div>
            <div className="cardBody">
              <div className="detailHeader">
                <div className="detailTitle">
                  <h2>${dance.artist} — ${dance.song}</h2>
                  <div className="subtitle">
                    ${splitStyleLabels(dance.style).map(
                      (styleLabel) =>
                        html`<span
                          key=${styleLabel}
                          className=${`tag style ${styleTagClass(styleLabel)}`}
                        >
                          ${styleLabel}
                        </span>`
                    )}
                    <span className=${`tag difficulty ${difficultyTagClass(dance.difficulty)}`}>
                      ${dance.difficulty}
                    </span>
                    <${StarRating}
                      value=${Number(ratings[dance.id] || 0)}
                      onChange=${(next) => onRate(dance.id, next)}
                      compact=${true}
                    />
                  </div>
                </div>
                <a className="btn" href=${dance.tutorialUrl} target="_blank" rel="noreferrer">
                  Open tutorial on YouTube
                </a>
              </div>

              <div className="tagrow">
                ${dance.skills.map(
                  (s) => html`<span key=${s} className=${`tag skill ${skillTagClass(s)}`}>${s}</span>`
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="cardBody">
              <h3>Details</h3>
              <div className="kv">
                <div className="k">Artist</div>
                <div className="v">${dance.artist}</div>
                <div className="k">Song</div>
                <div className="v">${dance.song}</div>
                <div className="k">Group</div>
                <div className="v">${dance.group || dance.artist}</div>
                <div className="k">Difficulty</div>
                <div className="v">${dance.difficulty}</div>
                <div className="k">Style</div>
                <div className="v">${dance.style}</div>
                <div className="k">Skill focus</div>
                <div className="v">${dance.skills.join(", ")}</div>
              </div>
              <div style=${{ height: 10 }}></div>
              <div className="muted" style=${{ fontSize: 12, lineHeight: 1.4 }}>
                Next steps: we can add community ratings, user-submitted entries, and a “where to
                start” onboarding that recommends 3 dances based on your goals.
              </div>
            </div>
          </div>
      </div>
    </div>
    </div>
  `;
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

  const handleRate = (danceId, stars) => {
    setRatings((prev) => ({ ...prev, [danceId]: stars }));
  };
  const handleSetStatus = (danceId, status) => {
    setStatuses((prev) => ({ ...prev, [danceId]: normalizeStatus(status) }));
  };

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

  return html`
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <h1>Kpop Dance Finder</h1>
          <p className="muted">Page not found.</p>
        </div>
        <button className="btn" onClick=${() => navigateTo("/")}>Back</button>
      </div>
      <div className="panel">
        <div className="empty">That route doesn’t exist.</div>
      </div>
    </div>
  `;
}

