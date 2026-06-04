import { useEffect, useRef, useState } from 'react';

// Suggested prompts (FR-1). Clicking a chip fills the field and submits in a
// single interaction (AC-2) so Petra never has to type.
const CHIPS = [
  'Soybean futures spiked 8% — assess our exposure',
  'Run a full portfolio cost review',
  'Which contracts are at risk this quarter?',
];

export default function ChatTrigger({ onSubmit }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Pre-focus the field on load (FR-1).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (value.trim()) onSubmit(value);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit(); // Empty field → nothing happens, silently (AC-3).
    }
  };

  return (
    <div className="chat">
      <header className="topbar">
        <span className="wordmark">NUTRECO</span>
      </header>

      <main className="chat-main">
        <h1 className="chat-title">What would you like to analyse?</h1>

        <div className="chat-input-row">
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            value={value}
            placeholder="Describe a market event or analysis…"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="send-btn" onClick={submit} aria-label="Send">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h14M12 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="chips">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              className="chip"
              onClick={() => {
                setValue(chip);
                onSubmit(chip); // pass directly; do not wait on state
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
