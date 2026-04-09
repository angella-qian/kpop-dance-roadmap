import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import htm from "https://esm.sh/htm@3.1.1";
import { DANCES } from "../data/dances_from_csv.js";
import { getRoute, navigateTo } from "./router.js";

const html = htm.bind(React.createElement);

function uniq(values) {
  return Array.from(new Set(values)).filter(Boolean);
}

function includesInsensitive(haystack, needle) {
  if (!needle) return true;
  return String(haystack).toLowerCase().includes(String(needle).toLowerCase());
}

function formatRating(r) {
  if (typeof r !== "number") return "—";
  return `${r.toFixed(1)} / 5`;
}

function skillMatches(skills, selectedSkill) {
  if (!selectedSkill) return true;
  return skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
}

function TablePage() {
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
    const values = uniq(DANCES.map((d) => d.style).filter(Boolean));
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

  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [style, setStyle] = useState("");
  const [group, setGroup] = useState("");
  const [skill, setSkill] = useState("");

  const filtered = useMemo(() => {
    return DANCES.filter((d) => {
      const anyText =
        includesInsensitive(d.artist, q) ||
        includesInsensitive(d.song, q) ||
        includesInsensitive(d.group, q) ||
        includesInsensitive(d.style, q) ||
        d.skills.some((s) => includesInsensitive(s, q));

      if (!anyText) return false;
      if (difficulty && d.difficulty !== difficulty) return false;
      if (style && d.style !== style) return false;
      if (group && (d.group || d.artist) !== group) return false;
      if (!skillMatches(d.skills, skill)) return false;
      return true;
    });
  }, [q, difficulty, style, group, skill]);

  return html`
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <h1>Kpop Dance Finder</h1>
          <p>
            Search dances by <b>difficulty</b>, <b>style</b>, <b>group</b>, and <b>skill focus</b>
            — a starter-friendly answer to “where do I begin?”
          </p>
        </div>
        <div className="pill">
          <span>Rated (from your export)</span>
          <b>${DANCES.length} dances</b>
        </div>
      </div>

      <div className="panel">
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
          <div className="field">
            <label>Difficulty</label>
            <select value=${difficulty} onChange=${(e) => setDifficulty(e.target.value)}>
              <option value="">Any</option>
              ${difficultyOptions.map((d) => html`<option key=${d} value=${d}>${d}</option>`)}
            </select>
          </div>
          <div className="field">
            <label>Style / concept</label>
            <select value=${style} onChange=${(e) => setStyle(e.target.value)}>
              <option value="">Any</option>
              ${styleOptions.map((s) => html`<option key=${s} value=${s}>${s}</option>`)}
            </select>
          </div>
          <div className="field">
            <label>Group</label>
            <select value=${group} onChange=${(e) => setGroup(e.target.value)}>
              <option value="">Any</option>
              ${groupOptions.map((g) => html`<option key=${g} value=${g}>${g}</option>`)}
            </select>
          </div>

          <div className="field" style=${{ gridColumn: "1 / -1" }}>
            <label>Skill focus</label>
            <select value=${skill} onChange=${(e) => setSkill(e.target.value)}>
              <option value="">Any</option>
              ${skillOptions.map((t) => html`<option key=${t} value=${t}>${t}</option>`)}
            </select>
          </div>
        </div>

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
                  <th>Skill focus</th>
                  <th style=${{ width: "14%" }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(
                  (d) => html`<tr key=${d.id} onClick=${() => navigateTo(`/dance/${d.id}`)}>
                    <td>
                      <div style=${{ fontWeight: 650 }}>${d.artist}</div>
                      <div className="muted">${d.song}</div>
                    </td>
                    <td>
                      <span className=${`tag ${d.difficulty === "Beginner" ? "accent" : ""}`}>
                        ${d.difficulty}
                      </span>
                    </td>
                    <td><span className="tag blue">${d.style}</span></td>
                    <td>
                      <div className="tagrow">
                        ${d.skills.map((s) => html`<span key=${s} className="tag">${s}</span>`)}
                      </div>
                    </td>
                    <td>${formatRating(d.communityRating)}</td>
                  </tr>`
                )}
              </tbody>
            </table>`}

        <div className="footerline">
          <div>
            Showing <b>${filtered.length}</b> of <b>${DANCES.length}</b>
          </div>
          <button
            className="btn"
            onClick=${() => {
              setQ("");
              setDifficulty("");
              setStyle("");
              setGroup("");
              setSkill("");
            }}
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  `;
}

function DetailPage({ id }) {
  const dance = DANCES.find((d) => d.id === id);

  if (!dance) {
    return html`
      <div className="container">
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

  const embedSrc = `https://www.youtube-nocookie.com/embed/${dance.preview.youtubeId}?rel=0`;

  return html`
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <h1>Kpop Dance Finder</h1>
          <p className="muted">Preview the dance and jump to a tutorial.</p>
        </div>
        <button className="btn" onClick=${() => navigateTo("/")}>Back to table</button>
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
                    <span className="tag blue">${dance.style}</span>
                    <span className="tag accent">${dance.difficulty}</span>
                    <span className="tag">${formatRating(dance.communityRating)}</span>
                  </div>
                </div>
                <a className="btn" href=${dance.tutorialUrl} target="_blank" rel="noreferrer">
                  Open tutorial on YouTube
                </a>
              </div>

              <div className="tagrow">
                ${dance.skills.map((s) => html`<span key=${s} className="tag">${s}</span>`)}
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

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route.name === "dance") return html`<${DetailPage} id=${route.params.id} />`;
  if (route.name === "home") return html`<${TablePage} />`;

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

