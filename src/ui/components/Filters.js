import { html, memo } from "../lib.js";
import { Button } from "./ui/Button.js";
import { Dropdown } from "./ui/Dropdown.js";
import { Tag } from "./ui/Tag.js";
import {
  difficultyTagClass,
  skillTagClass,
  styleTagClass,
  ratingLabel,
} from "../utils/dance.js";

const MultiSelect = memo(function MultiSelect({
  label,
  options,
  values,
  onChange,
  placeholder = "Any",
  kind = "skill",
}) {
  const selectedSet = new Set(values);

  const toggle = (value) => {
    if (selectedSet.has(value)) onChange(values.filter((v) => v !== value));
    else onChange([...values, value]);
  };

  const removeValue = (value, event) => {
    event.stopPropagation();
    onChange(values.filter((v) => v !== value));
  };

  return html`<div className="field multiSelectField">
    <label>${label}</label>
    <${Dropdown}
      className="multiSelectField"
      triggerClassName="multiSelectTrigger"
      menuClassName="multiSelectMenu"
      trigger=${(open) =>
        values.length === 0
          ? html`<span className="multiSelectPlaceholder">${placeholder}</span>
              <span className="multiSelectChevron">${open ? "▴" : "▾"}</span>`
          : html`<span className="multiSelectPills">
                ${values.map((value) => {
                  const cls =
                    kind === "difficulty"
                      ? `difficulty ${difficultyTagClass(value)}`
                      : kind === "style"
                      ? `style ${styleTagClass(value)}`
                      : `skill ${skillTagClass(value)}`;
                  return html`<${Tag} key=${value} className=${`${cls} multiSelectPill`}>
                    ${value}
                    <span
                      className="multiSelectPillRemove"
                      onClick=${(event) => removeValue(value, event)}
                      role="button"
                      aria-label=${`Remove ${value}`}
                    >
                      ×
                    </span>
                  </${Tag}>`;
                })}
              </span>
              <span className="multiSelectChevron">${open ? "▴" : "▾"}</span>`}
    >
      ${({ close: _close }) =>
        options.map((option) => {
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
    </${Dropdown}>
  </div>`;
});

const RatingFilterSelect = memo(function RatingFilterSelect({ minRating, onSelect }) {
  const options = [1, 2, 3, 4, 5];
  return html`<div className="field ratingFilterField">
    <label>Minimum rating</label>
    <${Dropdown}
      className="ratingFilterField"
      triggerClassName="ratingFilterTrigger"
      menuClassName="ratingFilterMenu"
      trigger=${(open) => html`<span className=${`${minRating > 0 ? "ratingFilterStars" : "multiSelectPlaceholder"}`}>
          ${ratingLabel(minRating)}
        </span>
        <span className="ratingFilterChevron">${open ? "▴" : "▾"}</span>`}
    >
      ${({ close }) => html`
        <button
          type="button"
          className=${`ratingFilterOption ${minRating === 0 ? "isSelected" : ""}`}
          onClick=${() => {
            onSelect(0);
            close();
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
              close();
            }}
          >
            <span className="statusSelectCheck">${minRating === rating ? "✓" : ""}</span>
            <span className="ratingFilterStars">${ratingLabel(rating)}</span>
          </button>`
        )}
      `}
    </${Dropdown}>
  </div>`;
});

export const Filters = memo(function Filters({
  q,
  onSearch,
  difficultyOptions,
  difficulty,
  setDifficulty,
  styleOptions,
  style,
  setStyle,
  groupOptions,
  group,
  setGroup,
  skillOptions,
  skill,
  setSkill,
  statusOptions,
  statusFilter,
  setStatusFilter,
  minRating,
  setMinRating,
  onClear,
}) {
  return html`<div className="panel filtersPanel">
    <div className="controls">
      <div className="field">
        <label>Search (artist, song, style, skills)</label>
        <input
          type="text"
          value=${q}
          placeholder='Try "Control" or "TWICE"'
          onChange=${(e) => onSearch(e.target.value)}
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
      <${RatingFilterSelect} minRating=${minRating} onSelect=${setMinRating} />
      <div className="field" style=${{ display: "flex", alignItems: "flex-end" }}>
        <${Button} variant="btnGhostSm" onClick=${onClear} ariaLabel="Clear filters">↺ Clear</${Button}>
      </div>
    </div>
  </div>`;
});

