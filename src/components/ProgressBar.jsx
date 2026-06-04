// Thin lime fill across the top of the orchestrator panel. Gives the audience a
// sense of time passing without showing numbers. Completes when all agents are
// done (FR-1, Phase 4). `progress` is a fraction 0..1.
export default function ProgressBar({ progress }) {
  return (
    <div className="progress-track" aria-hidden="true">
      <div className="progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
    </div>
  );
}
