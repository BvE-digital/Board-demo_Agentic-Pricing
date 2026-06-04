import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The build produces a SINGLE self-contained dist/index.html with all JS, CSS
// and fonts inlined. That file:
//   • opens by double-clicking (file://) — no Node, no server (run-via-index.html)
//   • runs fully offline (NFR-4)
//   • still deploys to GitHub Pages unchanged
//
// base './' keeps asset URLs relative (harmless once everything is inlined, and
// correct for any GitHub Pages subpath). assetsInlineLimit is raised so the
// bundled fonts inline as base64 rather than emitting separate files.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100_000_000,
  },
});
