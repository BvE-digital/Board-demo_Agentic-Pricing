// =============================================================================
// runSimulation.js — master timing orchestration.
//
// Schedules the entire five-phase story off a single set of timers, all derived
// from TIMING_CONFIG.js. It owns no state: it calls back into the handlers that
// App provides, and returns a cleanup function that cancels every pending timer
// (used by Reset, FR-7, and on unmount).
// =============================================================================

import { TIMING } from './TIMING_CONFIG.js';
import { AGENT_ORDER, AGENTS, ORCHESTRATOR_SUMMARY } from '../data/agentScripts.js';

// Small head-start before the first agent lights up, so the orchestrator prompt
// and dispatch line read first. All four agents still activate within ~1s
// (AC-4), staggered by TIMING.agentActivationStagger.
const ACTIVATION_BASE = 300;

// The last agent to finish defines when convergence begins.
const LAST_COMPLETION = Math.max(...Object.values(TIMING.agentCompletionTimes));

/**
 * @param {object} handlers
 *   onDispatch()                       — orchestrator shows "dispatching agents"
 *   onActivate(id)                     — agent card goes from idle → running
 *   onLog(id, line)                    — append one log line to an agent
 *   onIntermediate(id, text)           — show an agent's mid-run finding
 *   onComplete(id, finding, timestamp) — lock an agent's key finding card
 *   onProgress(fraction 0..1)          — orchestrator progress bar fill
 *   onConverge()                       — all agents done; begin convergence
 *   onSummaryWord(count)               — number of summary words revealed so far
 *   onTable()                          — fade in the results table
 * @returns {() => void} cleanup
 */
export function runSimulation(handlers) {
  const timers = [];
  const at = (ms, fn) => timers.push(setTimeout(fn, Math.max(0, ms)));

  // --- Progress bar: linear fill across the full agent run (Phase 1–4). ------
  const progressEnd = LAST_COMPLETION + TIMING.convergenceDelay;
  const tick = 50;
  let elapsed = 0;
  const progressInterval = setInterval(() => {
    elapsed += tick;
    handlers.onProgress(Math.min(1, elapsed / progressEnd));
    if (elapsed >= progressEnd) clearInterval(progressInterval);
  }, tick);

  // --- Phase 1: dispatch. ----------------------------------------------------
  at(0, () => handlers.onDispatch());

  // --- Phase 2 & 3: each agent activates, logs, surfaces an intermediate
  //     finding, then locks its key finding. ---------------------------------
  AGENT_ORDER.forEach((id, idx) => {
    const agent = AGENTS[id];
    const activationStart = ACTIVATION_BASE + idx * TIMING.agentActivationStagger;
    const completionTime = TIMING.agentCompletionTimes[id];

    at(activationStart, () => handlers.onActivate(id));

    // Log lines are spread evenly across the agent's run so the feed stays
    // alive right up to completion, regardless of how long the agent runs.
    const tail = 600; // breathing room between last log and the locked finding
    const span = Math.max(1, completionTime - activationStart - tail);
    const step = span / agent.logLines.length;
    agent.logLines.forEach((line, i) => {
      at(activationStart + step * (i + 1), () => handlers.onLog(id, line));
    });

    at(activationStart + TIMING.intermediateDelay, () =>
      handlers.onIntermediate(id, agent.intermediate),
    );

    at(completionTime, () =>
      handlers.onComplete(id, agent.finding, formatTimestamp(completionTime)),
    );
  });

  // --- Phase 4: convergence + orchestrator summary, word by word. ------------
  const summaryStart = LAST_COMPLETION + TIMING.convergenceDelay;
  at(LAST_COMPLETION, () => handlers.onConverge());

  const words = ORCHESTRATOR_SUMMARY.split(' ');
  words.forEach((_, i) => {
    at(summaryStart + i * TIMING.summaryWordDelay, () => handlers.onSummaryWord(i + 1));
  });

  // --- Phase 5: results table. -----------------------------------------------
  const summaryEnd = summaryStart + words.length * TIMING.summaryWordDelay;
  at(summaryEnd + TIMING.tableDelay, () => handlers.onTable());

  return () => {
    timers.forEach(clearTimeout);
    clearInterval(progressInterval);
  };
}

// Formats an elapsed time in ms as mm:ss for the "Done · 00:09" agent label.
function formatTimestamp(ms) {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
