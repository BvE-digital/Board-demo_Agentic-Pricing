import AgentPanel from './AgentPanel.jsx';
import { AGENT_ORDER, AGENTS } from '../data/agentScripts.js';

// Middle band: the four agent cards in a single horizontal row (FR-3, Phase 2).
export default function AgentRow({ agents, converged }) {
  return (
    <section className="agent-row">
      {AGENT_ORDER.map((id) => (
        <AgentPanel
          key={id}
          agent={AGENTS[id]}
          state={agents[id]}
          converged={converged}
        />
      ))}
    </section>
  );
}
