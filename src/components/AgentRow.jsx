import AgentPanel from './AgentPanel.jsx';
import { AGENT_ORDER, AGENTS } from '../data/agentScripts.js';

// Middle band: the four agent cards in a single horizontal row (FR-3, Phase 2).
// `collapsed` folds the whole band away post-run so the table can fill the screen.
export default function AgentRow({ agents, converged, collapsed = false }) {
  return (
    <section className={collapsed ? 'agent-row collapsed' : 'agent-row'}>
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
