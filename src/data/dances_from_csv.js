// Dances parsed from your Notion CSV export (embedded as CSV text).
// This keeps the prototype "no build step" friendly.

const CSV_TEXT = `Dance (artist + song),Difficulty,Skills to practice,Concept,Preview,Tutorial,Done,How did it feel?
aespa - Rich Man,Easy,"Control, Isolation","Cool, Girl crush",https://youtu.be/tekQV42oxlU?si=j97Es0AyOapDUYbB&t=71,https://youtu.be/qLmIZX-UrXc?si=Z4dv-qgwO4qaZDFZ,Done,⭐⭐⭐⭐
JISOO - Earthquake,Easy,"Control, Musicality",Elegant,https://youtu.be/Z33suvklkx0?si=XJrxOuThj23-LY3Y&t=62,https://youtu.be/UTjZ-tx1SlI?si=0UEyToXNJbqJweYu,Done,⭐⭐⭐
JISOO - FLOWER,Easy,"Control, Isolation",Elegant,https://youtu.be/4XZz3WXRw0A?si=Ix_vAmYpFbtiwXTk&t=57,https://youtu.be/yIPE-pfLQs0?si=_5nKa5Fi7rVC1A8J,In progress,
FIFTY FIFTY - Cupid,Easy,"Control, Musicality","Cute, Soft",https://youtu.be/QwaQkmmtST8?si=N1XjrAKDNO4tQGOs&t=45,https://youtu.be/WOe1as6dVN4?si=1_KtLQx8GuduTXB9,Not started,
NewJeans - Super Shy,Easy,"Extension, Groove","Cute, Soft",https://youtu.be/wU2siJ2c5TA?si=dIWHbGqaI6RauNFF&t=62,https://youtu.be/ChXfwacbkwI?si=Glh5TJel_ifKIT1_,Not started,
NewJeans - OMG,Easy,"Control, Groove","Cool, Soft",https://youtu.be/_Xs1ZCMfa2Y?si=d8OfGokGmcgJ_JtK&t=44,https://youtu.be/1BP64ShcOQo?si=PSZc-omgybr8goiM,Not started,
KATSEYE - Milkshake (GAP),Easy,"Groove, Musicality",Cute,https://youtu.be/IwzF26o0AuU?si=4v4WkEiINMYOGzmJ,https://youtu.be/gLbgJO1xSzg?si=mWwIR3rJq2gKsCys,Not started,
KATSEYE - Internet Girl,Easy,"Confidence, Groove",Cute,https://youtu.be/NQg31ogu_b0?si=Nz2CrZNij1Tkdwne,https://youtu.be/jVn3d9O9OMA?si=wMm8OmelnJVtHeCD,Not started,
TWICE - TT,Easy,"Confidence, Groove",Cute,https://youtu.be/9uypQGzzhns?si=dZyYg4qHcXXzz7Qi&t=58,https://youtu.be/AjgaHhdmjI0?si=X4mxDdhbqTE11UN1,Not started,
TWICE- What is Love?,Easy,"Confidence, Musicality",Cute,https://youtu.be/WhHEQ-W3x5Y?si=rWwUD7An9WVD6XW5&t=46,https://youtu.be/GVmE_dKZNgI?si=7O-OiB1eROCec8nh,Not started,
Red Velvet - Power Up,Easy,"Groove, Stamina",Cute,https://youtu.be/EyLf7XuwpFw?si=--Rfmz85h2qCEKkk&t=42,https://youtu.be/Fj9-LzFOUJg?si=wzFDIDyGm9I1nnI7,Not started,
IVE - Love Dive,Easy,"Control, Extension","Cool, Elegant",https://youtu.be/Bo2aD_I7-1U?si=cnBatKLNXQPArHFJ&t=37,https://youtu.be/JkIY2Oq9HJw?si=H3kPY3Izvx27M_2y,Not started,
LE SSERAFIM - SPAGHETTI,Easy,"Confidence, Footwork",Cute,https://youtu.be/OsPt0BY1_Wk?si=y_NQlf6lMt4h8H28&t=36,https://youtu.be/IbYjh_3HEgg?si=N6qA3QyJvypS2VBr,Not started,
SOMI - DUMB DUMB,Easy+,"Confidence, Musicality",Cute,https://youtu.be/O9f63cImJm8?si=NqD4bgNxTsDXakZU&t=41,https://youtu.be/uDmV0WI1KkU?si=UGqvT6WEcMV9Etma,Not started,
I-DLE - Queencard,Easy+,"Confidence, Groove","Cute, Girl crush",https://youtu.be/pKCaXYYwGjw?si=XWd0dExsAp0glEUc&t=49,https://youtu.be/nOhY6NOehVE?si=ihSHaHyfYxi0GNwv,Not started,
I-DLE - LATATA,Easy+,"Control, Groove",Girl crush,https://youtu.be/Fhk4Qzj_QpM?si=9DCWXl4py6a5zpFh&t=41,https://youtu.be/Gvls_zpafZo?si=98n7PoZTHOUcchbH,Not started,
Red Velvet - RUSSIAN ROULETTE,Easy+,"Control, Musicality",Cute,https://youtu.be/vvcklHTrvo4?si=K7cl_uduZvBvHZnq&t=49,https://youtu.be/VvbyWLJHTZs?si=UlbiZPz7dZmVzd_I,Not started,
TWICE - Dance the Night Away,Easy+,"Groove, Stamina",Cute,https://youtu.be/mr5bu2cxdzU?si=-CnEz5mvjAfTY6YR&t=78,https://youtu.be/j21VzhmpwAQ?si=JiwzRgYKN7o6-wH-,Not started,
XG - LEFT RIGHT,Easy+,"Control, Groove",Cool,https://youtu.be/RB1i1MLYeQ4?si=aPf-hARTs75LMmnn&t=51,https://youtu.be/gkG7JRirbtg?si=YYRayargxdCKfWM9,Not started,
LE SSERAFIM - FEARLESS,Easy+,"Confidence, Control",Cool,https://youtu.be/Cm_yIF0erqY?si=-HeqPWpk-fCrrXgk&t=44,https://youtu.be/mZYFTra4k9A?si=f5ncc_HQnpdelnKI,Not started,
IVE - I AM,Easy+,"Control, Extension","Elegant, Powerful",https://youtu.be/0ZzQjfQCkQs?si=cVl3Quqjac00CXRD&t=52,https://youtu.be/QzN5XMp_-Sc?si=CbYVKPs_354o1hFk,Not started,
aespa - Next Level,Easy+,"Control, Musicality","Cool, Girl crush",https://youtu.be/IMpXNQ-MLT4?si=r52MFTJIbLViKWW2&t=39,https://youtu.be/UCuaBrWaOYM?si=5yn8lMLI8o2w6yUm,Not started,
BLACKPINK - AS IF IT’S YOUR LAST,Easy+,"Extension, Stamina","Cute, Girl crush",https://youtu.be/hKUJmA9O6iA?si=Pj4H1tbpDwUByVvN&t=60,https://youtu.be/ZARds0FcBn4?si=u1z0vOYb7GCvu299,Not started,
Red Velvet - Bad Boy,Medium,"Control, Groove","Cool, Elegant",https://youtu.be/5pZ596zb7lQ?si=1ae5pxnLIJPIFcRl,https://youtu.be/ZM4PjMapdLE?si=88g8TENYgIA-X4ZM,Not started,
BLACKPINK - Lovesick Girls,Medium,"Footwork, Stamina","Girl crush, Soft",https://youtu.be/YxksUfnuEbI?si=5k5ibYG9SFNXW8JD&t=51,https://youtu.be/MYbCU3qipy0?si=900xqhOvHUz4k7zT,Not started,
BLACKPINK - DDU-DU DDU-DU,Medium,"Control, Musicality",Girl crush,https://youtu.be/jOJbXvjZ-cQ?si=ZyJXXsGpt9PqDqsT&t=77,https://youtu.be/js9InLDV2X8?si=ioiIVMS5ZeLQam3v,Not started,
BLACKPINK - How You Like That,Medium,"Confidence, Stamina","Girl crush, Powerful",https://youtu.be/32si5cfrCNc?si=fuRO0QvHVO_Hf7mE&t=38,https://youtu.be/_1HI4q53u7E?si=aMJes7Idf0lfOAKt,Not started,
BLACKPINK - Kill This Love,Medium,"Extension, Footwork","Girl crush, Powerful",https://youtu.be/MOwaUlXZxkI?si=zd8ntPJKnLnxUjip&t=72,https://youtu.be/U7s07c4PBPo?si=m_MGh09YLrrN1cLG,Not started,
XG - SHOOTING STAR,Medium,"Groove, Musicality",Cool,https://youtu.be/NNooo5vox8o?si=XbpDVwg3LUFVxuhB&t=54,https://youtu.be/aZaQVfcn5TI?si=QwHOOw2RTBmMA-il,Not started,
ILLIT - NOT CUTE ANYMORE,Medium,"Groove, Isolation","Cool, Cute",https://youtu.be/-tgJECVba9c?si=yD4Y3MrZwfeJtFe2,https://youtu.be/QlViqlJkaEg?si=veVCStH-39wjnmR7,Not started,
EVERGLOW - Bon Bon Chocolat,Medium,"Control, Isolation",Girl crush,https://youtu.be/DicPG8z6wMM?si=wfR4oF5V42I9dRza&t=47,https://youtu.be/ui5IJebTff0?si=7-1ot81rP56Xe8op,Not started,
EVERGLOW - Adios,Medium,"Confidence, Stamina","Girl crush, Powerful",https://youtu.be/-iIXA8QEovY?si=3_Zh7Or9je67ng3X&t=58,https://youtu.be/wnHPtqp5TsQ?si=UJHJepxn35k5mUeu,Not started,
EVERGLOW - DUN DUN,Medium,"Control, Stamina","Girl crush, Powerful",https://youtu.be/ghUjmkl1U8Q?si=OV8K7z3j7kfA_GEM&t=50,https://youtu.be/gx_86VGD2XE?si=Y4jYSrgp5TJ7eUTO,Not started,
`;

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  // Simple CSV parser for the format exported by Notion.
  // Handles:
  // - commas inside quoted fields
  // - double-quote escaping ("" -> ")
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }

    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (c === "\n") {
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
      continue;
    }

    if (c === "\r") continue; // tolerate CRLF

    field += c;
  }

  // Flush trailing field (in case file doesn't end with newline)
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function slug(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitArtistSong(danceField) {
  const ds = String(danceField || "").trim();
  // Prefer the explicit separator " - " so artist names with hyphens
  // (e.g. "I-DLE") are preserved.
  const explicitSep = ds.indexOf(" - ");
  if (explicitSep !== -1) {
    return [ds.slice(0, explicitSep).trim(), ds.slice(explicitSep + 3).trim()];
  }

  // Fallback for compact forms like "TWICE- What is Love?"
  const compactSep = ds.indexOf("- ");
  if (compactSep !== -1) {
    return [ds.slice(0, compactSep).trim(), ds.slice(compactSep + 2).trim()];
  }

  return [ds, ""];
}

function splitSkills(skillsField) {
  const s = String(skillsField || "").trim();
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function extractYoutubeInfo(url) {
  if (!url) return null;
  const u = String(url).trim();
  let id = null;
  let startSeconds = null;

  try {
    const parsed = new URL(u);
    const host = (parsed.hostname || "").toLowerCase();
    if (host === "youtu.be") {
      const idPath = parsed.pathname.replace(/^\/+/, "");
      id = idPath.split("/")[0] || null;
    }
    if (!id && host.endsWith("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) id = v;
      // Handle /embed/<id>
      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (!id && embedIdx !== -1 && parts[embedIdx + 1]) id = parts[embedIdx + 1];
    }

    // Parse t parameter, which might be like 71 or 71s
    const tRaw = (parsed.searchParams && parsed.searchParams.get("t")) || null;
    if (tRaw) {
      const match = String(tRaw).match(/^(\d+)/);
      if (match) startSeconds = Number(match[1]);
    }
  } catch (_) {
    // fall through
  }

  // Fallback for ID (best-effort) if URL parsing failed
  if (!id) {
    const m = u.match(/v=([A-Za-z0-9_-]{6,})/);
    if (m) id = m[1];
  }

  return { youtubeId: id, startSeconds };
}

function parseStarRating(starField) {
  const s = String(starField || "").trim();
  if (!s) return null;
  const count = s.split("⭐").length - 1;
  return count > 0 ? count : null;
}

function parseDancesFromCsv(csvText) {
  const rows = parseCSV(csvText);
  const headers = (rows[0] || []).map((h) => h.replace(/^\uFEFF/, "").trim());

  const idx = (name) => headers.indexOf(name);
  const iDance = idx("Dance (artist + song)");
  const iDifficulty = idx("Difficulty");
  const iSkills = idx("Skills to practice");
  const iConcept = idx("Concept");
  const iPreview = idx("Preview");
  const iTutorial = idx("Tutorial");
  const iFeel = idx("How did it feel?");

  const out = [];
  const usedIds = new Set();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const danceField = row[iDance];
    if (!danceField) continue;

    const [artist, song] = splitArtistSong(danceField);
    const baseId = slug(`${artist}-${song}`) || "dance";
    let id = baseId;
    let n = 2;
    while (usedIds.has(id)) {
      id = `${baseId}-${n}`;
      n++;
    }
    usedIds.add(id);

    const previewUrl = row[iPreview] || "";
    const tutorialUrl = row[iTutorial] || "";

    const previewInfo = extractYoutubeInfo(previewUrl);

    out.push({
      id,
      artist,
      group: artist,
      song,
      difficulty: (row[iDifficulty] || "").trim() || null,
      style: (row[iConcept] || "").trim(),
      skills: splitSkills(row[iSkills] || ""),
      preview: {
        youtubeId: previewInfo ? previewInfo.youtubeId : null,
        startSeconds: previewInfo ? previewInfo.startSeconds : null,
      },
      tutorialUrl: tutorialUrl,
      communityRating: parseStarRating(row[iFeel] || ""),
      // Stored for future “where to start” features.
      progressStatus: (row[6] || "").trim() || null,
    });
  }

  return out;
}

export const DANCES = parseDancesFromCsv(CSV_TEXT);

// Keep the module tree tidy if the app wants to show counts etc.
export const ALL_GROUPS = uniq(DANCES.map((d) => d.group));

