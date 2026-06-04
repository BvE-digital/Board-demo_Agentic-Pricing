import { useMemo } from 'react';

// Sort ranks: Escalate rows float to the very top, then by exposure severity
// descending (FR-5). Sort is computed once on load; the table is not
// interactive, to avoid accidental state changes mid-presentation.
const EXPOSURE_RANK = { High: 0, Medium: 1, Low: 2, None: 3 };
const ACTION_RANK = { Escalate: 0, Reprice: 1, Monitor: 2, Maintain: 3 };

function sortKey(row) {
  const escalate = row.action === 'Escalate' ? 0 : 1;
  return escalate * 100 + EXPOSURE_RANK[row.exposure] * 10 + ACTION_RANK[row.action];
}

// Bottom band: the 50-line evidence table, fades in at Phase 5 (FR-5).
// The toolbar lets the presenter fold the navy "today's update" band and/or the
// agent summaries away, so the table can fill (more of) the screen.
export default function ResultsTable({
  rows,
  visible,
  orchCollapsed = false,
  agentsCollapsed = false,
  onToggleOrch,
  onToggleAgents,
}) {
  const sorted = useMemo(
    () => [...rows].sort((a, b) => sortKey(a) - sortKey(b)),
    [rows],
  );

  return (
    <section className={visible ? 'results visible' : 'results'}>
      <div className="results-toolbar">
        <span className="results-title">Portfolio · 50 ingredient lines</span>
        <div className="view-toggles">
          <button
            type="button"
            className={orchCollapsed ? 'view-toggle off' : 'view-toggle'}
            onClick={onToggleOrch}
            aria-pressed={!orchCollapsed}
          >
            {orchCollapsed ? '▸' : '▾'} Today’s update
          </button>
          <button
            type="button"
            className={agentsCollapsed ? 'view-toggle off' : 'view-toggle'}
            onClick={onToggleAgents}
            aria-pressed={!agentsCollapsed}
          >
            {agentsCollapsed ? '▸' : '▾'} Agent summaries
          </button>
        </div>
      </div>
      <div className="results-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Category</th>
              <th>Position</th>
              <th>Exposure</th>
              <th className="num">Cost Impact</th>
              <th>Action</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.name}
                className={row.action === 'Escalate' ? 'row-escalate' : ''}
              >
                <td className="cell-name">{row.name}</td>
                <td>{row.category}</td>
                <td>
                  <span
                    className={
                      row.position === 'IN_POSITION' ? 'chip-pos in' : 'chip-pos cost'
                    }
                  >
                    {row.position === 'IN_POSITION' ? 'IN POSITION' : 'COST PLUS'}
                  </span>
                </td>
                <td className={`exposure exp-${row.exposure.toLowerCase()}`}>
                  {row.exposure}
                </td>
                <td className="num">{row.costImpactPct}</td>
                <td className={`action act-${row.action.toLowerCase()}`}>{row.action}</td>
                <td className="cell-agent">{row.agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
