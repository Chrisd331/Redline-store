// Inline SVG icon sprite ported from the prototype — no external icon assets.
// Rendered once in the account layout; every screen references icons via
// <svg className="icon"><use href="#i-home" /></svg>.
export default function IconSprite() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <symbol id="i-home" viewBox="0 0 24 24">
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </symbol>
      <symbol id="i-dumbbell" viewBox="0 0 24 24">
        <path d="M6.5 6.5v11M3.5 8.5v7M17.5 6.5v11M20.5 8.5v7M6.5 12h11" />
      </symbol>
      <symbol id="i-utensils" viewBox="0 0 24 24">
        <path d="M6 3v7M3.5 3v5a2.5 2.5 0 0 0 5 0V3M6 10v11M15 3v8a3 3 0 0 0 3 3h1V3M18 14v7" />
      </symbol>
      <symbol id="i-moon" viewBox="0 0 24 24">
        <path d="M20.5 14.5A8 8 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
      </symbol>
      <symbol id="i-chart" viewBox="0 0 24 24">
        <path d="M4 19V10M10 19V5M16 19v-7M22 19H2" />
      </symbol>
      <symbol id="i-bell" viewBox="0 0 24 24">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </symbol>
      <symbol id="i-bolt" viewBox="0 0 24 24">
        <path d="m13 2-8 12h7l-1 8 8-12h-7Z" />
      </symbol>
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6" />
      </symbol>
      <symbol id="i-drop" viewBox="0 0 24 24">
        <path d="M12 2s6 6.5 6 12a6 6 0 0 1-12 0c0-5.5 6-12 6-12Z" />
      </symbol>
      <symbol id="i-foot" viewBox="0 0 24 24">
        <path d="M12.5 5.5c1.8 2.2 1.9 4.3.7 6.1-1.3 1.8-1 3.5.8 4.5 2.5 1.4 4.6.9 5.8-.7 1.4-1.9.8-4.6-1.3-7.7M8.3 18.9c-1.9-.2-3.1-1.4-3.4-3.1-.3-1.9.8-3.5 2.5-4.1 1.5-.6 2.1-2.1 1.4-3.8-.7-1.8-2.3-2.7-3.9-2.2" />
      </symbol>
      <symbol id="i-chevron" viewBox="0 0 24 24">
        <path d="m9 18 6-6-6-6" />
      </symbol>
      <symbol id="i-calendar" viewBox="0 0 24 24">
        <path d="M6 2v4M18 2v4M3 9h18M4 4h16a1 1 0 0 1 1 1v15H3V5a1 1 0 0 1 1-1Z" />
      </symbol>
      <symbol id="i-clock" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </symbol>
      <symbol id="i-flame" viewBox="0 0 24 24">
        <path d="M12 22c4 0 7-3 7-7 0-4.5-3-7-5-10-1 3-3 4-4 6-1-2-1-4 0-7-3 2-5 6-5 10 0 4.5 3 8 7 8Z" />
        <path d="M9.5 17c0 1.5 1 3 2.5 3s2.5-1.2 2.5-2.7c0-1.7-1.2-2.7-2-3.8-.4 1.2-1.5 2-2 3-.5-.7-.7-1.4-.5-2.3-.4.6-.5 1.7-.5 2.8Z" />
      </symbol>
      <symbol id="i-repeat" viewBox="0 0 24 24">
        <path d="m17 1 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
      </symbol>
      <symbol id="i-camera" viewBox="0 0 24 24">
        <path d="M3 7h4l2-3h6l2 3h4v13H3Z" />
        <circle cx="12" cy="13" r="4" />
      </symbol>
      <symbol id="i-plus" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </symbol>
      <symbol id="i-trending" viewBox="0 0 24 24">
        <path d="m3 17 6-6 4 4 7-8M15 7h5v5" />
      </symbol>
      <symbol id="i-ruler" viewBox="0 0 24 24">
        <path d="m4 18 14-14 3 3L7 21l-3-3Z" />
        <path d="m14 8 2 2M11 11l2 2M8 14l2 2" />
      </symbol>
      <symbol id="i-info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </symbol>
    </svg>
  );
}
