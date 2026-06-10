import AgentPanel from './AgentPanel.jsx';
import BandHandle from './BandHandle.jsx';
import { AGENT_ORDER, AGENTS } from '../data/agentScripts.js';

// Middle band: the four agent cards in a single horizontal row (FR-3, Phase 2).
// `collapsed` folds the whole band away so another band can fill the screen.
export default function AgentRow({ agents, converged, collapsed = false, onToggle }) {
  if (collapsed) {
    return (
      <section className="agent-row collapsed">
        <BandHandle collapsed onToggle={onToggle} label="Agents" />
      </section>
    );
  }

  return (
    <section className="agent-row">
      <div className="agent-cards">
        {AGENT_ORDER.map((id) => (
          <AgentPanel
            key={id}
            agent={AGENTS[id]}
            state={agents[id]}
            converged={converged}
          />
        ))}
      </div>

      <BandHandle collapsed={false} onToggle={onToggle} label="Agents" />
    </section>
  );
}
