import { html, memo } from "../lib.js";
import { Tag } from "./ui/Tag.js";
import { Button } from "./ui/Button.js";
import { StarRating } from "./ui/StarRating.js";
import { difficultyTagClass, skillTagClass, splitStyleLabels, styleTagClass } from "../utils/dance.js";

export const DanceMeta = memo(function DanceMeta({ dance, rating, onRate }) {
  return html`<div className="detailHeroBody">
    <div className="detailHeader">
      <div className="detailTitle">
        <h2>${dance.artist} — ${dance.song}</h2>
        <div className="subtitle detailMetaTags">
          ${splitStyleLabels(dance.style).map(
            (styleLabel) =>
              html`<${Tag} key=${styleLabel} className=${`style ${styleTagClass(styleLabel)}`}>${styleLabel}</${Tag}>`
          )}
          <${Tag} className=${`difficulty ${difficultyTagClass(dance.difficulty)}`}>${dance.difficulty}</${Tag}>
        </div>
      </div>
      <${Button} variant="btnPrimary" href=${dance.tutorialUrl} target="_blank" rel="noreferrer">
        <span className="ytIcon">▶</span>
        <span>Open tutorial on YouTube</span>
      </${Button}>
    </div>

    <div className="tagrow detailMetaTags">
      ${dance.skills.map((s) => html`<${Tag} key=${s} className=${`skill ${skillTagClass(s)}`}>${s}</${Tag}>`)}
    </div>

    <div style=${{ height: 10 }}></div>
    <${StarRating} value=${rating} onChange=${(next) => onRate(dance.id, next)} compact=${false} />
  </div>`;
});

