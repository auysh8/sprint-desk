/**
 * theme/tokens.ts
 *
 * Single Master Design System Tokens for SprintDesk:
 * - Material Design 3 Expressive Elevation Surfaces (Borderless)
 * - Tonal Ambient Surfaces
 * - Motion & Animation Curves (Framer Motion & CSS)
 * - Elevation Ambient Shadows
 */

export const ELEVATION_SURFACES = {
  // Level 0: App Canvas / Root Background
  surface0: '#0e0f14',
  
  // Level 1: Primary Structural Layers (Sidebars, Top Navbar, Column Containers, Table Wrappers)
  surface1: '#15161f',
  
  // Level 2: Elevated Component Cards (Task Cards, Chart Cards, Metric Cards, Inputs)
  surface2: '#1d1e2a',
  
  // Level 3: Interactive & Hover Surfaces (Dropdown Menus, Active Tabs, Card Hover States)
  surface3: '#252736',
  
  // Level 4: Floating Overlays (Modals, Task Drawer, Global Search, Toasts)
  surface4: '#2d3042',
  
  // Level 5: Topmost Floating Elements (Tooltips, Active Drag Overlays)
  surface5: '#36394f',
} as const;

export const TONAL_SURFACES = {
  // Rose / Pink (Backlog / To-Do)
  pink: {
    base: '#22151f',
    hover: '#2c1a27',
    active: '#381f32',
    text: '#f472b6',
    textMuted: '#fbcfe8',
    badge: '#ec489926',
  },
  // Warm Amber / Peach (In Progress)
  amber: {
    base: '#251b12',
    hover: '#302216',
    active: '#3d2b1c',
    text: '#fbbf24',
    textMuted: '#fde68a',
    badge: '#f59e0b26',
  },
  // Cool Sky / Cyan (In Review)
  sky: {
    base: '#111f2c',
    hover: '#162838',
    active: '#1c3347',
    text: '#38bdf8',
    textMuted: '#bae6fd',
    badge: '#0ea5e926',
  },
  // Royal Violet / Purple (Completed / Done)
  purple: {
    base: '#1c142b',
    hover: '#241a37',
    active: '#2e2047',
    text: '#c084fc',
    textMuted: '#e9d5ff',
    badge: '#a855f726',
  },
  // Emerald / Mint (Success / Velocity)
  emerald: {
    base: '#112219',
    hover: '#162c20',
    active: '#1c3829',
    text: '#34d399',
    textMuted: '#a7f3d0',
    badge: '#10b98126',
  },
} as const;

export const MOTION_CURVES = {
  // Snappy spring for quick responsive feedback (Buttons, Toggles, Small Badges)
  snappy: {
    type: 'spring',
    stiffness: 480,
    damping: 32,
  },
  // Smooth spring for cards, drawers, and modal entries
  smooth: {
    type: 'spring',
    stiffness: 320,
    damping: 28,
  },
  // Bouncy spring for playful pills, counters, and celebration states
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
  // Material 3 Standard Easing Transitions
  m3Standard: {
    duration: 0.25,
    ease: [0.2, 0.0, 0, 1.0],
  },
  // Material 3 Deceleration Easing (for elements entering viewport)
  m3Decelerate: {
    duration: 0.3,
    ease: [0.0, 0.0, 0.2, 1.0],
  },
  // Material 3 Acceleration Easing (for elements exiting viewport)
  m3Accelerate: {
    duration: 0.2,
    ease: [0.3, 0.0, 1.0, 1.0],
  },
} as const;

export const ELEVATION_SHADOWS = {
  sm: '0 2px 8px -2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 16px -4px rgba(0, 0, 0, 0.6)',
  lg: '0 8px 24px -6px rgba(0, 0, 0, 0.7)',
  xl: '0 16px 40px -8px rgba(0, 0, 0, 0.85)',
} as const;
