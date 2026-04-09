import { html, memo } from "../lib.js";
import { Button } from "./ui/Button.js";

export const Header = memo(function Header({
  title,
  subtitle,
  subtitleNode,
  themeMode,
  setThemeMode,
  showBack = false,
  onBack,
}) {
  return html`<div className="topbar">
    <div className="brand">
      <h1 className="text-3xl font-semibold tracking-tight">${title}</h1>
      <p className="muted">${subtitleNode || subtitle}</p>
    </div>
    <div style=${{ display: "flex", alignItems: "center", gap: "12px" }}>
      ${showBack ? html`<${Button} onClick=${onBack}>Back to table</${Button}>` : null}
      <div className="field" style=${{ minWidth: "220px" }}>
        <label>Theme</label>
        <select value=${themeMode} onChange=${(e) => setThemeMode(e.target.value)}>
          <option value="cute">bubble pop</option>
          <option value="cool">girl crush</option>
          <option value="elegant">velvet</option>
        </select>
      </div>
    </div>
  </div>`;
});

