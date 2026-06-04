# PRD: Agentic Commodity Intelligence Demo
**Nutreco — Board Showcase · Version 2.0**

---

## Overview

A fully pre-scripted, fool-proof browser demo that tells a visual story of a multi-agent system responding to a commodity market event in real time. Designed for a 15-minute board slot. Petra Volckaert (CDO) types a single prompt and presses Enter; everything that follows is pre-determined and cannot fail.

The visual story and the underlying computation do not need to align in real time. All data, agent outputs, and results are hardcoded. The animation layer creates the narrative: agents appear to work in parallel, intermediate steps are visible as they happen, and findings converge into a board-level recommendation. The audience experiences the logic, not just the outcome.

This is storytelling software, not a working prototype.

---

## Problem Statement

Nutreco's raw material pricing team manages thousands of ingredient lines simultaneously: some in position (bought low, good inventory cover), others on cost-plus. When a commodity market moves, the team has no unified view of which lines are exposed, which contracts need adjustment, and what guidance to push to sales. That coordination happens manually, across desks and systems, with meaningful lag.

The demo makes that gap visible in the first 60 seconds, then shows what it looks like when a multi-agent system closes it across 50 lines in under 30.

---

## Goals

- Petra triggers everything with one prompt and one keypress; nothing else is required from her
- The board watches a story unfold: market event → agents dispatched → work visible → findings surfaced → decision ready
- Intermediate steps are shown, not just inputs and outputs
- Visual and actual computation are decoupled; the animation tells the story, hardcoded data ensures it never fails
- No logins, no API keys in the UI, no live data connections, fully offline after load
- Hostable from GitHub with one command; deployable to GitHub Pages automatically

---

## Out of Scope

- Live commodity exchange data feeds
- ERP or pricing system integration
- User authentication
- Mobile layout (projector / large screen only)
- More than 50 ingredient lines in the demo dataset
- Real-time LLM calls during the demo (stretch goal only, post-board)

---

## Users

**Primary:** Petra Volckaert, CDO — types the trigger prompt, presses Enter, presents what follows.
**Secondary:** Board members — observe the story, read the outcome, ask questions.
**Tertiary:** Bas (Digital Strategy) — sets up, maintains, and resets if needed.

---

## Functional Requirements

### FR-1: Chat-Style Trigger Interface

The opening state of the demo is a minimal chat interface, not a dashboard. The screen shows:

- Nutreco wordmark top-left (navy, no decoration)
- A single centred prompt: *"What would you like to analyse?"*
- A chat input field with a send button (magenta)
- Three suggested prompt chips below the input (clickable, auto-fill the field):
  - *"Soybean futures spiked 8% — assess our exposure"*
  - *"Run a full portfolio cost review"*
  - *"Which contracts are at risk this quarter?"*

Petra clicks a chip or types her own prompt and presses Enter or the send button. That single action starts the simulation. Nothing else is required from her.

The chat field is pre-focused on page load. Pressing Enter on an empty field does nothing (no failure state visible to the audience).

The prompt chips exist so Petra does not need to type anything if she prefers not to. One tap is enough.

### FR-2: Hardcoded Dataset and Pre-Scripted Outputs

All data is hardcoded. Nothing is fetched, calculated, or generated at runtime.

The dataset (`/src/data/ingredients.json`) contains 50 synthetic but realistic ingredient lines. Each agent's findings, log lines, intermediate steps, and the final orchestrator summary are all stored in `/src/data/agentScripts.js` as pre-written strings. The simulation engine reads these files and plays them back on a timer.

This means the demo cannot produce an unexpected result, cannot time out, and cannot fail due to a network issue or API error. The only failure mode is a browser crash, which is outside scope.

Each ingredient line contains:

| Field | Example |
|---|---|
| Ingredient name | Soybean Meal 48 |
| Commodity category | Oilseeds |
| Position status | `IN_POSITION` or `COST_PLUS` |
| Inventory cover (days) | 45 |
| Current cost index | 112 |
| Estimated cost impact (%) | +6.1% |
| Contract exposure (MT) | 800 |
| Contract renewal (days) | 67 |
| Linked formulations | Trouw Broiler P3, Skretting Atlantic |
| Recommended action | Hold / Monitor / Reprice / Escalate |
| Agent responsible | Exposure / Position / Cost Guidance / Contract |

### FR-3: Storytelling View — Five Phases

The demo plays out in five sequential phases after the trigger. Each phase is visible on screen before the next begins. The audience always knows where they are in the story.

**Phase 1 — Orchestrator receives the prompt (0–3s)**

The chat interface transitions to the full demo view. The orchestrator panel (top, full width, navy background) displays:

- The submitted prompt, appearing character by character (typewriter effect, 40ms per character)
- After the prompt: *"Analysing request... dispatching agents."*
- Four agent cards light up in sequence (100ms apart), transitioning from grey/idle to active

A thin progress bar across the top of the orchestrator panel begins filling slowly. It completes only when all agents are done. This gives the audience a sense of time passing without numbers.

**Phase 2 — Agents work in parallel (3–28s)**

All four agent panels are visible simultaneously in a horizontal row (not a 2×2 grid). Each panel shows:

- Agent name and role (one line)
- Status indicator: pulsing lime dot while running
- A live log feed showing intermediate steps as they happen, one line at a time

Agents are staggered so they visibly overlap: none starts at exactly the same moment, none finishes together. The audience sees simultaneous activity across all four panels.

Critically, each agent shows its *work*, not just its conclusion. Log lines surface intermediate findings before the final result appears. Examples below under Agent Scripts.

When an agent completes, its dot turns navy, a timestamp appears, and a key finding card locks into place below the log feed. This card is a 2–3 line summary of what that agent found, styled to be readable from a projector.

**Phase 3 — Findings surface as agents complete (rolling, 8–28s)**

As each agent finishes (Exposure first, Contract last), its key finding card animates in. The board sees findings accumulate progressively, not all at once. This is the storytelling moment: each finding adds to the picture before the full view is revealed.

Finding cards use colour to signal severity:
- Lime background: protected / no action needed
- Amber background: monitor / review
- Magenta background: escalate / act now

**Phase 4 — Orchestrator convergence (28–33s)**

Once all four agents complete, the orchestrator panel transitions. The four key finding cards appear to *flow into* the orchestrator panel (CSS transform, 400ms). The orchestrator summary then renders sentence by sentence (typewriter effect).

The progress bar completes. A subtle sound cue (single soft tone, optional, off by default) signals completion.

**Phase 5 — Results table (33s onward)**

The full results table fades in below the agent row. All 50 ingredient lines are visible, sorted by exposure severity descending. Magenta-highlighted rows (Escalate) sit at the top automatically.

The table is the evidence layer. The board has already understood the story from Phases 1–4; the table gives them the detail to ask questions about.

### FR-4: Agent Panel — Intermediate Step Visibility

Each agent panel has three sections that fill sequentially during Phase 2:

1. **Log feed** — monospace lines showing the agent's process (what it is doing)
2. **Intermediate finding** — a mid-run data point that appears before the agent is done (e.g. "14 of 18 lines scanned — early indication: high exposure concentrated in oilseed category")
3. **Key finding card** — the locked conclusion, rendered when the agent completes

The intermediate finding is the key addition over v1.0. It shows the board that the agent is *thinking*, not just returning a result. It makes the parallel work feel real.

### FR-5: Results Table

Columns:

- Ingredient
- Category
- Position (`IN_POSITION` shown in lime chip, `COST_PLUS` in amber chip)
- Exposure (None / Low / Medium / High — colour-coded text, no badge)
- Cost impact (e.g. +6.1%)
- Action (Hold / Monitor / Reprice / Escalate)
- Agent

Sorting: High exposure and Escalate rows at the top on load. Table is not interactive (no click-to-sort) to avoid accidental state changes during the presentation.

### FR-6: Orchestrator Summary (pre-scripted)

> Soybean futures moved +8% this morning. The system assessed all 50 ingredient lines across four dimensions simultaneously. Thirty lines carry direct or indirect exposure. Twelve are protected by current inventory positions and need no action today. The remaining 18 cost-plus lines require updated cost guidance before the next pricing window opens. Four contracts are now priced below updated guidance and should reach procurement by end of week. No manual triage was needed. Total assessment time: 28 seconds.

### FR-7: Reset

A discreet reset button (bottom-right, low contrast, not prominent) returns the demo to the opening chat interface. Petra or Bas can trigger a second run if the board asks. Reset takes under 1 second and produces no visible loading state.

---

## Non-Functional Requirements

### NFR-1: Fool-proof operation
The demo must complete successfully from any state of the input field. If Petra presses Enter with the field empty, nothing happens silently. If she uses a chip, the field fills and submits in one tap. There is no error state visible to the audience under any normal usage.

### NFR-2: Performance
The full simulation runs in 30–35 seconds. Timing is controlled by a single constants file. All values are adjustable without touching component logic. If the presentation runs short, timing constants can be tightened to 20 seconds in under 2 minutes by Bas.

### NFR-3: Deployment
Static build, no server required. `npm run build` produces a `/dist` folder. GitHub Actions deploys to GitHub Pages on every push to `main`. The demo is accessible at a public URL Petra can open on any Nutreco laptop in Chrome or Edge.

### NFR-4: Offline operation
The demo works fully offline after the initial page load. Google Fonts are the only external dependency; they should be bundled at build time (Vite font inlining or equivalent).

### NFR-5: Browser support
Chrome and Edge, latest two versions. No Safari requirement.

### NFR-6: Projector readiness
Minimum font size 14px body, 16px for key finding cards. Colour contrast ratios meet WCAG AA for all text on coloured backgrounds. The layout reads clearly at 1920×1080 projected at distance.

---

## Design Specification

### Colour palette

| Token | Hex | Use |
|---|---|---|
| `--brand-navy` | `#07427C` | Orchestrator panel background, page header, primary structural colour |
| `--brand-lime` | `#BECD34` | Running agent indicator (pulse), IN_POSITION chip, progress bar fill |
| `--brand-magenta` | `#C70C6F` | Send button, Escalate rows, high-exposure findings, convergence flash |
| `--brand-blue-mid` | `#6A8CCB` | Agent panel headers, secondary labels, mid-severity states |
| `--surface` | `#F4F5F7` | Page background |
| `--surface-card` | `#FFFFFF` | Agent panels, table background |
| `--surface-navy-light` | `#E8EEF5` | Orchestrator inner surfaces |
| `--border` | `#DDE1E7` | All card and table borders |
| `--text-primary` | `#0F172A` | All body text |
| `--text-muted` | `#64748B` | Log lines, timestamps, secondary labels |
| `--text-on-navy` | `#FFFFFF` | Text on navy backgrounds |
| `--finding-protected` | `#F0F7E6` | Key finding card: no action needed (lime-tinted) |
| `--finding-monitor` | `#FFF8E6` | Key finding card: monitor (amber-tinted) |
| `--finding-escalate` | `#FBE8F0` | Key finding card: escalate (magenta-tinted) |

### Typography

Font: **DM Sans** (bundled at build). Monospace log lines: **DM Mono**.

| Element | Size | Weight |
|---|---|---|
| Orchestrator prompt | 17px | 500 |
| Orchestrator summary | 15px | 400 / line-height 1.7 |
| Agent panel title | 13px | 600 / uppercase / 0.5px tracking |
| Log lines | 12px | 400 / DM Mono |
| Key finding card | 15px | 500 |
| Intermediate finding | 13px | 400 / italic |
| Table body | 14px | 400 |
| Table header | 12px | 600 / uppercase |

### Layout

Single viewport. No scroll during the presentation.

**Opening state:** full-screen centred chat interface. Navy header bar 56px. Centred content column 640px max-width.

**Demo state (post-trigger):** three horizontal bands.

- Band 1 (18% viewport height): Orchestrator panel, navy background, full width
- Band 2 (42% viewport height): Four agent panels in a horizontal row, equal width, white cards
- Band 3 (40% viewport height): Results table, fades in at Phase 5

No sidebars. No navigation. Card border-radius: 6px. Borders: 1px solid `--border`. Shadows: `0 1px 4px rgba(0,0,0,0.07)` only.

### Animation rules

| Element | Animation | Duration |
|---|---|---|
| Prompt typewriter | Character-by-character | 40ms/char |
| Agent card activation | Opacity 0→1, translateY 6px→0 | 200ms ease |
| Log line appearance | Opacity 0→1 | 150ms |
| Intermediate finding | Opacity 0→1, slight left indent | 200ms |
| Key finding card lock | Border colour flash (lime/amber/magenta) then settle | 300ms |
| Finding → orchestrator flow | CSS transform scale+translate toward orchestrator | 400ms |
| Summary typewriter | Word-by-word | 60ms/word |
| Results table fade-in | Opacity 0→1 | 300ms |
| Progress bar fill | Linear, duration matches total sim time | — |

No bounce. No parallax. No transform on hover. All easing: `ease` or `ease-out`.

### Agent panel states

| State | Dot colour | Dot behaviour | Label |
|---|---|---|---|
| Idle | `#CBD5E1` | Static | Waiting |
| Running | `--brand-lime` | Pulse (opacity, 1.2s loop) | Running |
| Complete | `--brand-navy` | Static | Done · [timestamp] |

---

## Repository Structure

```
nutreco-agent-demo/
├── README.md
├── package.json
├── vite.config.js
├── index.html
├── /src
│   ├── main.jsx
│   ├── App.jsx
│   ├── simulation/
│   │   ├── runSimulation.js       # Master timing orchestration
│   │   └── TIMING_CONFIG.js       # All timing constants in one place
│   ├── components/
│   │   ├── ChatTrigger.jsx        # Opening chat interface
│   │   ├── OrchestratorPanel.jsx  # Top band: prompt + summary
│   │   ├── AgentRow.jsx           # Horizontal row of four agents
│   │   ├── AgentPanel.jsx         # Individual agent card
│   │   ├── FindingCard.jsx        # Locked conclusion per agent
│   │   ├── ResultsTable.jsx       # 50-line ingredient table
│   │   └── ProgressBar.jsx        # Top-of-orchestrator fill bar
│   ├── data/
│   │   ├── ingredients.json       # 50 synthetic ingredient lines
│   │   └── agentScripts.js        # All log lines, intermediate findings, key findings
│   └── styles/
│       └── tokens.css             # CSS custom properties (brand colours, typography)
└── .github/
    └── workflows/
        └── deploy.yml             # Push to main → GitHub Pages
```

---

## Simulation Timing (TIMING_CONFIG.js)

All durations in milliseconds. Adjustable without touching any component.

```js
export const TIMING = {
  promptTypewriterDelay: 40,        // ms per character
  agentActivationStagger: 120,      // ms between each agent lighting up
  logLineInterval: 900,             // ms between log line appearances
  intermediateDelay: 4500,          // ms after agent starts before intermediate finding shows
  agentCompletionTimes: {
    exposure: 9000,
    position: 14000,
    costGuidance: 21000,
    contract: 27000,
  },
  convergenceDelay: 1500,           // ms after last agent before orchestrator summary starts
  summaryWordDelay: 60,             // ms per word in orchestrator summary
  tableDelay: 500,                  // ms after summary before results table fades in
};
```

---

## Agent Scripts

### Exposure Agent

**Log lines:**
```
Connecting to commodity index feed...
Loading 50 ingredient lines from portfolio registry...
Scanning for soybean linkage — direct and indirect...
Oilseed category: 18 lines flagged as directly linked
Grain co-products: cross-referencing CBOT correlation data...
12 grain-linked lines added to exposure set
Running price impact model at +8% futures delta...
Applying FOB adjustment factors by origin region...
Exposure scoring complete.
```

**Intermediate finding (shown at ~4.5s):**
*"Early read: 26 of 50 lines show price sensitivity above threshold — oilseed category dominant"*

**Key finding card:**
30 lines carry exposure to this futures movement. 18 direct (oilseed), 12 indirect (grain co-products). 20 lines unaffected.

---

### Position Agent

**Log lines:**
```
Pulling current inventory positions for 30 exposed lines...
Checking stock cover in days against standard threshold (30d)...
18 direct-linked lines assessed...
12 lines: IN_POSITION — average cover 38 days
6 lines: COST_PLUS with no forward cover
Cross-checking against open purchase orders...
No additional cover identified for COST_PLUS lines.
Position assessment complete.
```

**Intermediate finding (shown at ~4.5s):**
*"First pass: majority of direct-linked lines appear covered — COST_PLUS exposure concentrated in amino acids and specialty oilseeds"*

**Key finding card:**
12 of 18 direct-linked lines are IN_POSITION and protected. 6 cost-plus lines are fully exposed to spot movement. No additional cover available.

---

### Cost Guidance Agent

**Log lines:**
```
Loading current RMMC benchmarks for 18 cost-plus lines...
Applying +8% futures delta to base cost model...
Adjusting for freight index (FOB Rotterdam, current week)...
Recalculating expected landed cost per line...
Average guidance adjustment: +4.2% across affected lines
3 lines exceed contract ceiling post-adjustment...
Flagging for escalation — ceiling breach confirmed.
Updated cost guidance prepared for sales distribution.
```

**Intermediate finding (shown at ~4.5s):**
*"Preliminary: cost guidance will move +3.8–5.1% across most cost-plus lines — 3 lines approaching contract ceiling"*

**Key finding card:**
18 cost-plus lines require updated guidance. Average increase: +4.2%. 3 lines breach contract ceiling and need escalation before the next pricing window.

---

### Contract Agent

**Log lines:**
```
Scanning active contracts linked to 30 exposed lines...
Filtering for renewal dates within 90 days...
9 contracts identified within renewal window...
Comparing current contract price to updated cost guidance...
4 contracts now priced below updated cost floor...
Assessing renegotiation urgency by volume and margin...
Escalation priority assigned: 2 high, 2 medium.
Contract risk report prepared.
```

**Intermediate finding (shown at ~4.5s):**
*"Early flag: at least 4 contracts appear to be below the updated cost floor — volume-weighted impact being calculated"*

**Key finding card:**
9 contracts renew within 90 days. 4 are now underwater relative to updated guidance. 2 require immediate procurement review; 2 can wait until next cycle.

---

## Orchestrator Summary (pre-scripted, Phase 4)

> Soybean futures moved +8% this morning. The system assessed all 50 ingredient lines across four dimensions simultaneously. Thirty lines carry direct or indirect exposure. Twelve are protected by current inventory positions and require no action today. The remaining 18 cost-plus lines need updated cost guidance before the next pricing window opens. Four contracts are now priced below updated guidance and should reach procurement before end of week. No manual triage was required. Total time: 28 seconds.

---

## Synthetic Dataset Notes

50 ingredients spanning realistic Nutreco categories:

- 18 lines: soy-linked, oilseed category (directly exposed)
- 12 lines: grain co-products (indirectly exposed via correlation)
- 8 lines: marine ingredients, fishmeal, fish oil (not exposed)
- 12 lines: micro-ingredients — vitamins, amino acids, minerals (not exposed)

Of the 30 exposed lines: 12 are `IN_POSITION` (protected, lime chip), 18 are `COST_PLUS` (at risk, amber chip). Of those 18: 3 breach contract ceiling (magenta row), 4 have underwater contracts (magenta row). Some rows overlap these categories intentionally.

Category distribution should feel real to a Nutreco audience: include names like Soybean Meal 48, Rapeseed Meal, Corn DDGS, Lysine HCl, Methionine, Vitamin E, Fish Meal 65, Monocalcium Phosphate.

---

## README Requirements

1. What the demo is and the board presentation context
2. Prerequisites: Node 18+, npm
3. Local run: `npm install && npm run dev` → opens at `localhost:5173`
4. Production build: `npm run build` → `/dist`
5. GitHub Pages: push to `main`, Actions deploys automatically. URL format: `https://[org].github.io/nutreco-agent-demo`
6. How to adjust timing: edit `TIMING_CONFIG.js`, all values documented inline
7. How to edit dataset: `ingredients.json` — field names documented in this PRD
8. Reset instructions: the reset button bottom-right, or reload the page
9. Offline note: works offline after first load; fonts are bundled

---

## Acceptance Criteria

| # | Criterion |
|---|---|
| AC-1 | Demo loads in Chrome with no console errors, opening state is the chat interface |
| AC-2 | Clicking a prompt chip fills the field and submits in one interaction |
| AC-3 | Pressing Enter on empty field produces no visible error |
| AC-4 | All four agent panels are visible and active within 1s of trigger |
| AC-5 | Each agent displays intermediate finding before its key finding card locks |
| AC-6 | Agents complete in order: Exposure → Position → Cost Guidance → Contract, with visible overlap |
| AC-7 | Orchestrator summary renders word by word after convergence |
| AC-8 | Results table shows all 50 lines, magenta rows at top, visible without scrolling for top 10 |
| AC-9 | Reset returns to opening chat interface in under 1s |
| AC-10 | GitHub Pages deployment serves demo at public URL, offline after load |
| AC-11 | No Nutreco credentials, API keys, or real internal data in the repository |
| AC-12 | Timing can be adjusted end-to-end by editing TIMING_CONFIG.js only |

---

## Open Questions

| # | Question | Owner | Due |
|---|---|---|---|
| OQ-1 | Should the orchestrator summary be live LLM-generated post-board as a v2? | Bas | Post-presentation |
| OQ-2 | Does Petra want a rehearsal run with Bas present before the board slot? | Petra / Bas | 48h before presentation |
| OQ-3 | Should results table rows be downloadable as CSV (nice-to-have for board follow-up)? | Bas | Nice to have |
| OQ-4 | Optional sound cue on convergence — on or off by default? | Bas | Before build |

---

*Version 2.0 — revised for storytelling-first board showcase.*
*Author: Digital Strategy & Ventures — Nutreco*
