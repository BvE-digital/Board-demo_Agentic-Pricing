import logoUrl from '../assets/nutreco-logo.webp';

// Nutreco brand logo. Vite inlines the asset as a base64 data URI at build time
// (assetsInlineLimit), so it stays fully offline and survives the single-file
// build. Full colour on white; reversed to solid white on the navy bar (onNavy).
export default function Logo({ onNavy = false }) {
  return (
    <span className={onNavy ? 'brand-logo on-navy' : 'brand-logo'}>
      <img src={logoUrl} alt="Nutreco" />
    </span>
  );
}
