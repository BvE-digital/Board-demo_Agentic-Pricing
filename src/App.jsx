import { useCallback, useRef, useState } from 'react';
import ChatTrigger from './components/ChatTrigger.jsx';
import OrchestratorPanel from './components/OrchestratorPanel.jsx';
import AgentRow from './components/AgentRow.jsx';
import ResultsTable from './components/ResultsTable.jsx';
import { runSimulation } from './simulation/runSimulation.js';
import { AGENT_ORDER, ORCHESTRATOR_SUMMARY } from './data/agentScripts.js';
import ingredients from './data/ingredients.json';

// Fresh, fully-idle agent state. Used on first load and on every Reset.
const makeInitialAgents = () =>
  AGENT_ORDER.reduce((acc, id) => {
    acc[id] = { status: 'idle', logs: [], intermediate: null, finding: null, doneAt: null };
    return acc;
  }, {});

export default function App() {
  const [view, setView] = useState('chat'); // 'chat' | 'demo'
  const [prompt, setPrompt] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [agents, setAgents] = useState(makeInitialAgents);
  const [progress, setProgress] = useState(0);
  const [converged, setConverged] = useState(false);
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const cleanupRef = useRef(null);

  const patchAgent = (id, patch) =>
    setAgents((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const start = useCallback((submittedPrompt) => {
    const text = (submittedPrompt || '').trim();
    if (!text) return; // Fool-proof: empty submit does nothing (NFR-1, AC-3).

    setPrompt(text);
    setView('demo');

    cleanupRef.current = runSimulation({
      onDispatch: () => setDispatching(true),
      onActivate: (id) => patchAgent(id, { status: 'running' }),
      onLog: (id, line) =>
        setAgents((prev) => ({
          ...prev,
          [id]: { ...prev[id], logs: [...prev[id].logs, line] },
        })),
      onIntermediate: (id, intermediate) => patchAgent(id, { intermediate }),
      onComplete: (id, finding, doneAt) =>
        patchAgent(id, { status: 'complete', finding, doneAt }),
      onProgress: setProgress,
      onConverge: () => setConverged(true),
      onSummaryWord: setSummaryWordCount,
      onTable: () => setShowTable(true),
    });
  }, []);

  const reset = useCallback(() => {
    if (cleanupRef.current) cleanupRef.current();
    cleanupRef.current = null;
    setView('chat');
    setPrompt('');
    setDispatching(false);
    setAgents(makeInitialAgents());
    setProgress(0);
    setConverged(false);
    setSummaryWordCount(0);
    setShowTable(false);
  }, []);

  if (view === 'chat') {
    return <ChatTrigger onSubmit={start} />;
  }

  return (
    <div className="demo">
      <OrchestratorPanel
        prompt={prompt}
        dispatching={dispatching}
        progress={progress}
        converged={converged}
        agents={agents}
        summary={ORCHESTRATOR_SUMMARY}
        summaryWordCount={summaryWordCount}
      />
      <AgentRow agents={agents} converged={converged} />
      <ResultsTable rows={ingredients} visible={showTable} />
      <button className="reset" onClick={reset} aria-label="Reset demo">
        Reset
      </button>
    </div>
  );
}
