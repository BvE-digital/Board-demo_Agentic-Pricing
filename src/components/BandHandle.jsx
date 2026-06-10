// Accordion handle shown at the bottom-centre of each band (FR layout).
// Expanded → a small chevron tab (click to fold the band in).
// Collapsed → a full-width bar with the band's label (click to fold it out).
function Chevron({ dir }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none' }}
    >
      <path
        d="M6 15l6-6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BandHandle({ collapsed, onToggle, label, onNavy = false }) {
  if (collapsed) {
    return (
      <button
        type="button"
        className={onNavy ? 'band-bar on-navy' : 'band-bar'}
        onClick={onToggle}
        aria-expanded={false}
        title={`Expand ${label}`}
      >
        <span className="band-bar-label">{label}</span>
        <Chevron dir="down" />
      </button>
    );
  }
  return (
    <button
      type="button"
      className={onNavy ? 'band-toggle on-navy' : 'band-toggle'}
      onClick={onToggle}
      aria-expanded
      aria-label={`Collapse ${label}`}
      title={`Collapse ${label}`}
    >
      <Chevron dir="up" />
    </button>
  );
}
