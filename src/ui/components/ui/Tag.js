import { html, memo } from "../../lib.js";

export const Tag = memo(function Tag({
  className = "",
  children,
  as = "span",
  onClick,
  ariaLabel,
}) {
  if (as === "button") {
    return html`<button type="button" className=${`tag ${className}`} onClick=${onClick} aria-label=${ariaLabel}>
      ${children}
    </button>`;
  }
  return html`<span className=${`tag ${className}`}>${children}</span>`;
});

