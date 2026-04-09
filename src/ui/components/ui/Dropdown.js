import { html, memo, useEffect, useRef, useState } from "../../lib.js";

export const Dropdown = memo(function Dropdown({
  className = "",
  triggerClassName = "",
  menuClassName = "",
  stopPropagation = false,
  trigger,
  children,
}) {
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

  return html`<div className=${`${className} ${open ? "isOpen" : ""}`.trim()} ref=${rootRef}>
    <button
      type="button"
      className=${`${triggerClassName} ${open ? "isOpen" : ""}`.trim()}
      onClick=${(event) => {
        if (stopPropagation) event.stopPropagation();
        setOpen(!open);
      }}
      aria-expanded=${open}
    >
      ${trigger(open)}
    </button>
    <div className=${`${menuClassName} ${open ? "isOpen" : ""}`.trim()}>
      ${children({ open, close: () => setOpen(false) })}
    </div>
  </div>`;
});

