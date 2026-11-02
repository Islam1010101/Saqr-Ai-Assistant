/**
 * Purpose-drawn SVG silhouettes inspired by Emirati traditional life.
 * Decorative artwork only: no emoji, image assets, libraries or network requests.
 */
export type EmiratiHeritageMotif =
  | 'dallah' | 'palm' | 'dhow' | 'fort' | 'mabkhara'
  | 'falcon' | 'sadu' | 'ayala' | 'lantern' | 'jar';

export default function EmiratiHeritageIcon({ name }: { name: EmiratiHeritageMotif }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'dallah' && <>
        <path d="M29 16h13l-2 8c7 7 10 14 8 21-2 9-22 12-30 2-5-6-2-15 5-23l-2-8h8Z" />
        <path d="M23 16c0-4 5-7 10-7s8 3 8 7M29 9l4-5 4 5M18 35c-8 1-12-1-13-6 7 1 12-1 16-6M48 28c8-3 12 1 11 7s-6 9-12 8M23 50h20M22 39c6 4 14 4 21 0" />
      </>}
      {name === 'palm' && <>
        <path d="M30 25c0 14-2 24-5 34m7-34c-1 14 0 24 2 34M23 59h17" />
        <path d="M31 25C20 18 11 19 4 28c11-3 19-2 27-3Zm0 0C22 13 19 9 16 4c12 2 17 7 15 21Zm0 0c6-13 13-18 24-19-5 10-12 17-24 19Zm0 0c11-6 21-3 28 6-10-3-20-3-28-6Zm0 0c-7-5-15-3-21 3" />
        <path d="M33 28c-3 4-6 8-4 12m7-12c3 3 4 7 3 10" />
      </>}
      {name === 'dhow' && <>
        <path d="M33 9v34m-3-29c-8 8-13 18-17 27h17V14Zm6-2c3 10 9 18 14 25H36V12Z" />
        <path d="M6 44h53l-8 11c-10 5-25 6-39 0L6 44Zm8 6h38M5 59c5-3 10-3 15 0s10 3 15 0 10-3 15 0 9 3 13 0" />
      </>}
      {name === 'fort' && <>
        <path d="M8 55V18h11v7h26v-7h11v37H8ZM6 18v-7h7v4h6v-4h8v14M37 25V11h8v4h6v-4h7v7" />
        <path d="M26 55V42a6 6 0 0 1 12 0v13M13 33h8v9h-8zm30 0h8v9h-8zM18 25V18m28 7v-7M8 55h48" />
      </>}
      {name === 'mabkhara' && <>
        <path d="M18 30h28l-3 16H21l-3-16Zm0 0-5-7h38l-5 7M24 46l-3 10h22l-3-10M16 56h32" />
        <path d="M25 19c-6-5 7-8 0-14m8 15c-7-6 8-10 1-17m8 16c-6-5 8-8 2-14M17 35h30M25 35v7m14-7v7" />
      </>}
      {name === 'falcon' && <>
        <path d="M10 48c5-2 10-7 12-13l3-12 11-7 12 2-7 9 6 4-8 2-5 15c-3 8-12 11-22 9" />
        <path d="M25 26c7 2 14 2 18-2M20 35c10 2 15 7 17 16m-13-10c-7 5-13 6-19 6m30-20 3 1M27 57l-3 5m9-5 2 5" />
        <circle cx="36" cy="21" r="1.6" fill="currentColor" stroke="none" />
      </>}
      {name === 'sadu' && <>
        <path d="M8 14h48v36H8V14Zm8 0v36m32-36v36M8 23h48M8 41h48" />
        <path d="m32 19 12 13-12 13-12-13 12-13Zm0 8 5 5-5 5-5-5 5-5ZM12 28l4 4-4 4m40-8-4 4 4 4M8 8h48m-48 48h48" />
      </>}
      {name === 'ayala' && <>
        <path d="M15 23c0-5 8-8 17-8s17 3 17 8v24c0 5-8 8-17 8s-17-3-17-8V23Z" />
        <ellipse cx="32" cy="23" rx="17" ry="8" />
        <path d="M15 31c11 6 23 6 34 0M15 45c11 6 23 6 34 0m-28-18 22 21m0-21L21 48M11 9l12 10m30-10L41 19" />
      </>}
      {name === 'lantern' && <>
        <path d="M28 10V6a4 4 0 0 1 8 0v4m-12 0h16l4 9-3 33H23l-3-33 4-9Zm-4 9h24M26 52h12m-13-28h14l-2 22H27l-2-22Z" />
        <path d="M32 42c-6-5 4-9 0-16 8 6 7 11 0 16M22 56h20m-14 4h8" />
      </>}
      {name === 'jar' && <>
        <path d="M24 8h16v9c9 5 14 15 13 25-2 12-12 18-21 18s-19-6-21-18c-1-10 4-20 13-25V8Zm-1 9h18m-23 13c8 5 20 5 28 0m-33 16c11 4 27 4 38 0" />
        <path d="M15 24c-6-2-10 1-9 7s5 8 9 9m34-16c6-2 10 1 9 7s-5 8-9 9M25 10h14" />
      </>}
    </svg>
  );
}
