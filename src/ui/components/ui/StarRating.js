import { html, memo, useState } from "../../lib.js";

export const StarRating = memo(function StarRating({ value = 0, onChange, compact = false }) {
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
});

