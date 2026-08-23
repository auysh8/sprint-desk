/**
 * theme/tokens.ts
 *
 * Master Design System Tokens for SprintDesk:
 * - Pure AMOLED Pitch Dark & Crisp White System (Zero Blue Tint)
 * - Reference-Inspired Solid Vibrant & Saturated Card Palette
 * - Tonal Ambient Surfaces
 * - Motion & Animation Curves (Framer Motion & CSS)
 * - Elevation Ambient Shadows
 */

export const ELEVATION_SURFACES = {
  // Level 0: App Canvas / Root Background (Pure AMOLED Black)
  surface0: '#000000',
  
  // Level 1: Primary Structural Layers (Sidebars, Top Navbar, Column Containers, Table Wrappers)
  surface1: '#0c0c0e',
  
  // Level 2: Elevated Component Cards (Task Cards, Chart Cards, Metric Cards, Inputs)
  surface2: '#161619',
  
  // Level 3: Interactive & Hover Surfaces (Dropdown Menus, Active Tabs, Card Hover States)
  surface3: '#222226',
  
  // Level 4: Floating Overlays (Modals, Task Drawer, Global Search, Toasts)
  surface4: '#2c2c32',
  
  // Level 5: Topmost Floating Elements (Tooltips, Active Drag Overlays)
  surface5: '#383840',
} as const;

/**
 * Reference-Inspired Solid Vibrant Card Palette (High-Contrast Text & Badges)
 */
export const SOLID_CARD_PALETTE = {
  mint: {
    bg: 'bg-[#50c878]',
    bgHex: '#50c878',
    text: 'text-[#04200f]',
    textMuted: 'text-[#093319]',
    badgeBg: 'bg-white text-[#04200f]',
    iconBg: 'bg-black/10 text-[#04200f]',
  },
  coral: {
    bg: 'bg-[#f37a6b]',
    bgHex: '#f37a6b',
    text: 'text-[#260509]',
    textMuted: 'text-[#420c13]',
    badgeBg: 'bg-white text-[#260509]',
    iconBg: 'bg-black/10 text-[#260509]',
  },
  amber: {
    bg: 'bg-[#f4d35e]',
    bgHex: '#f4d35e',
    text: 'text-[#261801]',
    textMuted: 'text-[#3d2703]',
    badgeBg: 'bg-white text-[#261801]',
    iconBg: 'bg-black/10 text-[#261801]',
  },
  violet: {
    bg: 'bg-[#8a5df5]',
    bgHex: '#8a5df5',
    text: 'text-white',
    textMuted: 'text-[#ece4fd]',
    badgeBg: 'bg-white/25 text-white',
    iconBg: 'bg-white/15 text-white',
  },
  sky: {
    bg: 'bg-[#38b6ff]',
    bgHex: '#38b6ff',
    text: 'text-white',
    textMuted: 'text-[#dff3fe]',
    badgeBg: 'bg-white/25 text-white',
    iconBg: 'bg-white/15 text-white',
  },
  obsidian: {
    bg: 'bg-[#141416]',
    bgHex: '#141416',
    text: 'text-white',
    textMuted: 'text-neutral-400',
    badgeBg: 'bg-[#222226] text-neutral-200',
    iconBg: 'bg-white/10 text-neutral-300',
  },
} as const;

export const TONAL_SURFACES = {
  // Rose / Pink (Backlog / To-Do)
  pink: {
    base: '#1a1014',
    hover: '#24141c',
    active: '#301824',
    text: '#f472b6',
    textMuted: '#fbcfe8',
    badge: '#ec489926',
  },
  // Warm Amber / Peach (In Progress)
  amber: {
    base: '#1c150c',
    hover: '#261c10',
    active: '#332414',
    text: '#fbbf24',
    textMuted: '#fde68a',
    badge: '#f59e0b26',
  },
  // Cool Sky / Cyan (In Review)
  sky: {
    base: '#0c1720',
    hover: '#10202c',
    active: '#142a3a',
    text: '#38bdf8',
    textMuted: '#bae6fd',
    badge: '#0ea5e926',
  },
  // Royal Violet / Purple (Completed / Done)
  purple: {
    base: '#140e20',
    hover: '#1c122c',
    active: '#24163a',
    text: '#c084fc',
    textMuted: '#e9d5ff',
    badge: '#a855f726',
  },
  // Emerald / Mint (Success / Velocity)
  emerald: {
    base: '#0c1a12',
    hover: '#102418',
    active: '#143020',
    text: '#34d399',
    textMuted: '#a7f3d0',
    badge: '#10b98126',
  },
} as const;

export const MOTION_CURVES = {
  snappy: {
    type: 'spring',
    stiffness: 480,
    damping: 32,
  },
  smooth: {
    type: 'spring',
    stiffness: 320,
    damping: 28,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
  m3Standard: {
    duration: 0.25,
    ease: [0.2, 0.0, 0, 1.0],
  },
  m3Decelerate: {
    duration: 0.3,
    ease: [0.0, 0.0, 0.2, 1.0],
  },
  m3Accelerate: {
    duration: 0.2,
    ease: [0.3, 0.0, 1.0, 1.0],
  },
} as const;

export const ELEVATION_SHADOWS = {
  sm: '0 2px 8px -2px rgba(0, 0, 0, 0.7)',
  md: '0 4px 16px -4px rgba(0, 0, 0, 0.85)',
  lg: '0 8px 24px -6px rgba(0, 0, 0, 0.92)',
  xl: '0 16px 40px -8px rgba(0, 0, 0, 0.98)',
} as const;
