import { html, memo } from "../../lib.js";

export const Button = memo(function Button({
  variant = "",
  onClick,
  children,
  ariaLabel,
  href,
  target,
  rel,
}) {
  const cls = `btn ${variant}`.trim();
  if (href) {
    return html`<a className=${cls} href=${href} target=${target} rel=${rel}>${children}</a>`;
  }
  return html`<button type="button" className=${cls} onClick=${onClick} aria-label=${ariaLabel}>
    ${children}
  </button>`;
});

