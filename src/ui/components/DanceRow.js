import { html, memo } from "../lib.js";
import { Dropdown } from "./ui/Dropdown.js";
import { Tag } from "./ui/Tag.js";
import { StarRating } from "./ui/StarRating.js";
import {
  STATUS_CYCLE,
  difficultyTagClass,
  normalizeStatus,
  skillTagClass,
  splitStyleLabels,
  statusTagClass,
  styleTagClass,
} from "../utils/dance.js";

const StatusSelect = memo(function StatusSelect({ status, onSelect, label }) {
  const current = normalizeStatus(status);
  return html`<div className="statusSelectField">
    <${Dropdown}
      className="statusSelectField"
      triggerClassName=${`tag status ${statusTagClass(current)} statusSelectTrigger`}
      menuClassName="statusSelectMenu"
      stopPropagation=${true}
      trigger=${(open) => html`<span>${current}</span>
        <span className="statusSelectChevron">${open ? "▴" : "▾"}</span>`}
    >
      ${({ close }) =>
        STATUS_CYCLE.map(
          (option) => html`<button
            key=${option}
            type="button"
            className=${`statusSelectOption ${current === option ? "isSelected" : ""}`}
            onClick=${(event) => {
              event.stopPropagation();
              onSelect(option);
              close();
            }}
            aria-label=${`Set status for ${label}`}
          >
            <span className="statusSelectCheck">${current === option ? "✓" : ""}</span>
            <span>${option}</span>
          </button>`
        )}
    </${Dropdown}>
  </div>`;
});

export const DanceRow = memo(function DanceRow({
  dance,
  status,
  rating,
  onNavigate,
  onSetStatus,
  onRate,
}) {
  return html`<tr onClick=${() => onNavigate(dance.id)}>
    <td>
      <div className="font-semibold tracking-tight">${dance.artist}</div>
      <div className="muted text-[12px]">${dance.song}</div>
    </td>
    <td><${Tag} className=${`difficulty ${difficultyTagClass(dance.difficulty)}`}>${dance.difficulty}</${Tag}></td>
    <td>
      <div className="tagrow">
        ${splitStyleLabels(dance.style).map(
          (styleLabel) =>
            html`<${Tag} key=${styleLabel} className=${`style ${styleTagClass(styleLabel)}`}>${styleLabel}</${Tag}>`
        )}
      </div>
    </td>
    <td>
      <div className="tagrow">
        ${dance.skills.map(
          (s) => html`<${Tag} key=${s} className=${`skill ${skillTagClass(s)}`}>${s}</${Tag}>`
        )}
      </div>
    </td>
    <td>
      <${StatusSelect}
        status=${status}
        onSelect=${(next) => onSetStatus(dance.id, next)}
        label=${`${dance.artist} ${dance.song}`}
      />
    </td>
    <td>
      <${StarRating} value=${rating} onChange=${(next) => onRate(dance.id, next)} compact=${true} />
    </td>
  </tr>`;
});

