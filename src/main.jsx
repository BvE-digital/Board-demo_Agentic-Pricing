import React from 'react';
import { createRoot } from 'react-dom/client';

// Fonts are bundled locally (no Google Fonts request) so the demo works fully
// offline after first load (NFR-4). Vite inlines them at build time.
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-mono/latin-400.css';

import './styles/tokens.css';
import './styles/app.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
