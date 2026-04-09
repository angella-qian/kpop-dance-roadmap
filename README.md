# Kpop Dance Finder (starter)

A tiny React prototype for a searchable dance library:
- Filter by **difficulty**, **style/concept**, **group**, and **skill focus**
- Click a row to open a detail page with a **YouTube preview embed** and a **tutorial link**

## Run it (no Node required)

Because this uses ES modules in the browser, you should serve it with a local web server (opening the file directly may be blocked by the browser).

From the `kpop-dance-finder/` folder:

```bash
python3 -m http.server 5173
```

Then open:
- `http://localhost:5173/`

## Where to edit data

Hardcoded dataset lives in:
- `src/data/dances.js`

