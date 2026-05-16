/**
 * CinematicOverlay
 * - Film grain: fixed full-screen noise tile that shifts frames for realism
 * - Edge vignette: radial dark shadow at screen edges
 * Both are very subtle and pointer-events:none so they never block interaction.
 */

const GRAIN = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter>` +
  `<rect width='256' height='256' filter='url(#n)'/></svg>`
);

export default function CinematicOverlay() {
  return (
    <>
      {/* Film grain — shifts position each animation frame via CSS */}
      <div
        aria-hidden="true"
        className="cinematic-grain"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,${GRAIN}")`,
          backgroundSize: '256px 256px',
          opacity: 0.055,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9989,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
}
