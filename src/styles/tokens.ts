// Typed mirror of tokens.css for the few places that need a value in script.
// Keep both files in step; tokens.css is the one the pages read.
export const tokens = {
  color: {
    bg: '#121212',
    surface: '#171717',
    surfaceRaised: '#1f1f1f',
    line: '#262626',
    lineStrong: '#404040',
    outline: '#525252',
    controlBorder: '#737373',
    ink: '#fafafa',
    text: '#d4d4d4',
    textMuted: '#a3a3a3',
    textFaint: '#8a8a8a',
    accent: '#ffffff',
    onAccent: '#121212',
    frameAccent: '#9cc2f7',
    lensAccent: '#ff9548',
  },
  size: {
    container: 1200,
    measure: 760,
    touchTarget: 44,
    lens: 200,
  },
} as const;
