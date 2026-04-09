import { html, memo } from "../lib.js";
import { DanceRow } from "./DanceRow.js";

export const DanceTable = memo(function DanceTable({
  rows,
  statuses,
  ratings,
  onNavigate,
  onSetStatus,
  onRate,
  onSort,
  sortIcon,
}) {
  return html`<table>
    <thead>
      <tr>
        <th style=${{ width: "32%" }}>
          <button className="sortHeaderBtn" onClick=${() => onSort("artist")}>
            <span>Artist + song</span><span className="sortIcon">${sortIcon("artist")}</span>
          </button>
        </th>
        <th style=${{ width: "12%" }}>
          <button className="sortHeaderBtn" onClick=${() => onSort("difficulty")}>
            <span>Difficulty</span><span className="sortIcon">${sortIcon("difficulty")}</span>
          </button>
        </th>
        <th style=${{ width: "18%" }}>Style</th>
        <th style=${{ width: "22%" }}>Skill focus</th>
        <th style=${{ width: "12%" }}>Status</th>
        <th style=${{ width: "14%" }}>
          <button className="sortHeaderBtn" onClick=${() => onSort("rating")}>
            <span>Rating</span><span className="sortIcon">${sortIcon("rating")}</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(
        (d) =>
          html`<${DanceRow}
            key=${d.id}
            dance=${d}
            status=${statuses[d.id]}
            rating=${Number(ratings[d.id] || 0)}
            onNavigate=${onNavigate}
            onSetStatus=${onSetStatus}
            onRate=${onRate}
          />`
      )}
    </tbody>
  </table>`;
});

