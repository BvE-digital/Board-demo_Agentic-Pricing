import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar.jsx';
import { TIMING } from '../simulation/TIMING_CONFIG.js';
import { AGENT_ORDER, AGENTS } from '../data/agentScripts.js';

// Top band (navy). Phase 1: types the prompt and shows the dispatch line.
// Phase 4: the agent findings flow in and the summary types out word by word.
export default function OrchestratorPanel({
  prompt,
  dispatching,
  progress,
  converged,
  agents,
  summary,
  summaryWordCount,
}) {
  const [typed, setTyped] = useState('');

  // Prompt typewriter (Phase 1) — character by character.
  useEffect(() => {
    setTyped('');
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setTyped(prompt.slice(0, i));
      if (i >= prompt.length) clearInterval(t);
    }, TIMING.promptTypewriterDelay);
    return () => clearInterval(t);
  }, [prompt]);

  const promptDone = typed.length >= prompt.length;
  const summaryText = summary.split(' ').slice(0, summaryWordCount).join(' ');
  const summaryDone = summaryWordCount >= summary.split(' ').length;

  return (
    <section className="orchestrator">
      <ProgressBar progress={progress} />

      <div className="orch-inner">
        <div className="orch-head">
          <span className="wordmark wordmark-on-navy">NUTRECO</span>
          <span className="orch-tag">ORCHESTRATOR</span>
        </div>

        {!converged ? (
          <div className="orch-body">
            <p className="orch-prompt">
              <span className="orch-quote">“</span>
              {typed}
              {!promptDone && <span className="caret" />}
              <span className="orch-quote">”</span>
            </p>
            {promptDone && dispatching && (
              <p className="orch-status">Analysing request… dispatching agents.</p>
            )}
          </div>
        ) : (
          <div className="orch-body converged">
            <div className="converge-cards">
              {AGENT_ORDER.map((id) =>
                agents[id].finding ? (
                  <span
                    key={id}
                    className={`converge-pill sev-${agents[id].finding.severity}`}
                  >
                    {AGENTS[id].shortName}
                  </span>
                ) : null,
              )}
            </div>
            <p className="orch-summary">
              {summaryText}
              {!summaryDone && <span className="caret" />}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
