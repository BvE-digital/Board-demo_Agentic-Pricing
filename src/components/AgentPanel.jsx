import FindingCard from './FindingCard.jsx';

const STATUS_LABEL = {
  idle: 'Waiting',
  running: 'Running',
  complete: 'Done',
};

// One agent card. Three sections fill in sequence during Phase 2 (FR-4):
// log feed → intermediate finding → locked key finding card.
export default function AgentPanel({ agent, state, converged }) {
  const { status, logs, intermediate, finding, doneAt } = state;

  return (
    <div className={`agent-panel ${status}`}>
      <div className="agent-head">
        <div className="agent-id">
          <div className="agent-name">{agent.name}</div>
          <div className="agent-role">{agent.role}</div>
        </div>
        <div className="agent-status">
          <span className={`dot dot-${status}`} />
          <span className="status-label">
            {STATUS_LABEL[status]}
            {status === 'complete' && doneAt ? ` · ${doneAt}` : ''}
          </span>
        </div>
      </div>

      <div className="agent-log">
        {logs.map((line, i) => (
          <div key={i} className="log-line">
            {line}
          </div>
        ))}
      </div>

      {/* Intermediate finding shows mid-run, then the key finding replaces it. */}
      {intermediate && status !== 'complete' && (
        <div className="intermediate">{intermediate}</div>
      )}

      {finding && (
        <div className={converged ? 'finding-slot flowing' : 'finding-slot'}>
          <FindingCard finding={finding} />
        </div>
      )}
    </div>
  );
}
