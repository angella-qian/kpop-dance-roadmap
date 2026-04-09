# Kpop Dance Finder 💃

A web app to help you find beginner-friendly kpop dances based on difficulty, style, and skills.

## Features
- Filter by difficulty, style, group, and skill focus
- Track progress (not started / in progress / done)
- Rate dances
- Clean UI with multiple themes

## Why I built this
I kept getting asked: "where do I start with kpop dances?"
So I built this tool to make that easier.

## Tech
- React
- Local storage for state
- Custom UI system

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
- `src/data/dances_from_csv.js`

