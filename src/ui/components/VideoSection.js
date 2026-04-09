import { html, memo } from "../lib.js";

export const VideoSection = memo(function VideoSection({ embedSrc, title }) {
  return html`<div className="detailHeroCard">
    <div className="iframeWrap">
      <iframe
        src=${embedSrc}
        title=${title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen=${true}
      ></iframe>
    </div>
  </div>`;
});

