import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base ('./') so the build works on any GitHub Pages subpath
// (e.g. https://<org>.github.io/<repo>/) without hardcoding the repo name.
// assetsInlineLimit is raised so bundled fonts are inlined as base64,
// guaranteeing the demo runs fully offline after first load (NFR-4).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100_000_000,
  },
});
