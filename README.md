# Agentic Commodity Intelligence Demo

**Nutreco — Board Showcase · v2.0**

A fully pre-scripted, fool-proof browser demo that tells the visual story of a
multi-agent system responding to a commodity market event in real time. Built
for a 15-minute board slot: the presenter (Petra Volckaert, CDO) types a single
prompt — or taps one suggested chip — and presses Enter. Everything that follows
is pre-determined and cannot fail.

This is **storytelling software, not a working prototype.** All data, agent
outputs and results are hardcoded. The animation layer creates the narrative:
four agents appear to work in parallel, their intermediate steps surface as they
happen, and the findings converge into a board-level recommendation. There are
no logins, no API keys, no live data connections — it runs fully offline after
the page loads.

The story runs in five phases over ~33 seconds:

1. **Orchestrator** receives the prompt (typewriter) and dispatches four agents.
2. **Agents work in parallel** — staggered, each showing its live log feed.
3. **Findings surface** progressively as each agent completes (Exposure →
   Position → Cost Guidance → Contract).
4. **Convergence** — findings flow into the orchestrator, which types out a
   board-level summary.
5. **Results table** — all 50 ingredient lines fade in, escalations on top.

---

## Documentation

The full product requirements are in [`docs/PRD.md`](docs/PRD.md) — the v2.0
board-showcase spec this demo is built against.

## Prerequisites

- **Node 18+** and **npm**

## Run locally

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173**.

## Production build

```bash
npm run build      # outputs to /dist
npm run preview    # serve the built /dist locally to sanity-check
```

---

## GitHub Pages deployment

Pushing to **`main`** triggers `.github/workflows/deploy.yml`, which builds the
demo and deploys `/dist` to GitHub Pages automatically.

The public URL follows the pattern:

```
https://<org>.github.io/<repo>/
```

**One-time repository setup (admin):**

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Make the repository **public** so the CDO can open the URL on any laptop
   without a GitHub login (**Settings → General → Danger Zone → Change
   visibility → Public**).
3. Merge this branch into `main`. The Actions deploy runs and the URL goes live.

The build uses a relative base path, so it works on any Pages subpath without
further configuration.

---

## Adjusting the timing

All pacing lives in **`src/simulation/TIMING_CONFIG.js`** — and nowhere else
(AC-12). Edit those constants to speed up or slow down the demo; no component
changes are needed. The file documents a "short pace (~20s)" preset inline for
when the board slot runs tight.

## Editing the dataset

The 50 ingredient lines live in **`src/data/ingredients.json`**. Each line has:

| Field | Example |
|---|---|
| `name` | Soybean Meal 48 |
| `category` | Oilseeds |
| `position` | `IN_POSITION` or `COST_PLUS` |
| `inventoryCoverDays` | 45 |
| `costIndex` | 112 |
| `costImpactPct` | `+6.1%` |
| `contractExposureMT` | 800 |
| `contractRenewalDays` | 67 |
| `linkedFormulations` | `["Trouw Broiler P3", "Skretting Atlantic"]` |
| `exposure` | None / Low / Medium / High |
| `action` | Hold / Monitor / Reprice / Escalate |
| `agent` | Exposure / Position / Cost Guidance / Contract |

All agent log lines, intermediate findings, key findings and the orchestrator
summary are authored copy in **`src/data/agentScripts.js`**.

## Reset

A discreet **Reset** button sits bottom-right; it returns the demo to the
opening chat interface in under a second. Reloading the page does the same.

## Offline note

The demo works fully offline after the first load. Fonts (DM Sans, DM Mono) are
bundled into the build — there is no Google Fonts request at runtime.

---

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── simulation/
│   │   ├── runSimulation.js     # master timing orchestration
│   │   └── TIMING_CONFIG.js     # all timing constants
│   ├── components/
│   │   ├── ChatTrigger.jsx
│   │   ├── OrchestratorPanel.jsx
│   │   ├── AgentRow.jsx
│   │   ├── AgentPanel.jsx
│   │   ├── FindingCard.jsx
│   │   ├── ResultsTable.jsx
│   │   └── ProgressBar.jsx
│   ├── data/
│   │   ├── ingredients.json     # 50 synthetic ingredient lines
│   │   └── agentScripts.js      # log lines, intermediate + key findings
│   └── styles/
│       ├── tokens.css           # brand colours + base typography
│       └── app.css              # layout + components
└── .github/workflows/deploy.yml # push to main → GitHub Pages
```

All data is synthetic. No Nutreco credentials, API keys or real internal data
are present in this repository.
