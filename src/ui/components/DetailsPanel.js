import { html, memo } from "../lib.js";

export const DetailsPanel = memo(function DetailsPanel({ dance }) {
  return html`<div className="card detailsSecondary">
    <div className="cardBody">
      <h3>Details</h3>
      <div className="kv">
        <div className="k">Artist</div><div className="v">${dance.artist}</div>
        <div className="k">Song</div><div className="v">${dance.song}</div>
        <div className="k">Group</div><div className="v">${dance.group || dance.artist}</div>
        <div className="k">Difficulty</div><div className="v">${dance.difficulty}</div>
        <div className="k">Style</div><div className="v">${dance.style}</div>
        <div className="k">Skill focus</div><div className="v">${dance.skills.join(", ")}</div>
      </div>
    </div>
  </div>`;
});

