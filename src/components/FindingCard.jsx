// The locked conclusion for an agent (FR-4). Background colour signals severity
// (FR-3): protected = lime, monitor = amber, escalate = magenta. On lock, the
// border flashes the severity colour then settles (see .finding-card in app.css).
export default function FindingCard({ finding }) {
  return (
    <div className={`finding-card sev-${finding.severity}`}>
      {finding.text}
    </div>
  );
}
