// ── Anime-Motif Icon Set ──
// Mapped to Lucide icon names — these evoke anime aesthetics without using copyrighted logos
export const FOLDER_ICONS = [
  { name: "Leaf", icon: "Leaf" },           // Naruto — leaf village
  { name: "Flame", icon: "Flame" },         // Fire style / Demon Slayer
  { name: "Eye", icon: "Eye" },             // Sharingan / Death Note
  { name: "Sword", icon: "Sword" },         // Demon Slayer katana
  { name: "Skull", icon: "Skull" },         // Attack on Titan / cursed
  { name: "Shield", icon: "Shield" },       // Scouting regiment
  { name: "Zap", icon: "Zap" },            // Lightning / chakra
  { name: "Wind", icon: "Wind" },           // Wind style
  { name: "Waves", icon: "Waves" },         // Water breathing
  { name: "Moon", icon: "Moon" },           // Moon breathing
  { name: "Sun", icon: "Sun" },            // Sun breathing
  { name: "Star", icon: "Star" },           // General
  { name: "Crown", icon: "Crown" },         // King of curses
  { name: "Target", icon: "Target" },       // Domain expansion
  { name: "Hexagon", icon: "Hexagon" },     // Cursed energy
  { name: "BookOpen", icon: "BookOpen" },   // Death Note
  { name: "Compass", icon: "Compass" },     // Adventure
  { name: "Code", icon: "Code" },           // Dev resources
  { name: "Globe", icon: "Globe" },         // Web / general
  { name: "Folder", icon: "Folder" },       // Default
] as const;

// ── Anime-Fusion Accent Color Palette ──
// Curated colors blending tones from all 6 series
export const ACCENT_COLORS = [
  { name: "Chakra Orange", value: "#F97316" },    // Naruto
  { name: "Rasengan Blue", value: "#3B82F6" },     // Naruto
  { name: "Sharingan Red", value: "#EF4444" },     // Naruto / AoT
  { name: "Titan Earth", value: "#A16207" },       // Attack on Titan
  { name: "Scout Green", value: "#22C55E" },       // AoT Scouts
  { name: "Slayer Teal", value: "#14B8A6" },       // Demon Slayer
  { name: "Nichirin Pink", value: "#EC4899" },     // Demon Slayer
  { name: "Cursed Purple", value: "#A855F7" },     // Jujutsu Kaisen
  { name: "Domain Indigo", value: "#6366F1" },     // JJK
  { name: "Death White", value: "#E2E8F0" },       // Death Note
  { name: "Ryuk Crimson", value: "#DC2626" },      // Death Note
  { name: "Sukuna Gold", value: "#EAB308" },       // JJK
] as const;

// ── Background Images ──
// User-curated list of wallpaper/art URLs. The app rotates through these.
// Fallback gradient backgrounds are used if this list is empty or images fail to load.
export const BACKGROUND_IMAGES = [
  "https://i.pinimg.com/564x/0c/4c/67/0c4c6751800c152ee26e854383a864e6.jpg",
];

export const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 50%, #2d1b69 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
];

// ── Greeting Messages ──
export const GREETING_MESSAGES = [
  "Welcome back to the Vault",
  "Your resources await, Shinobi",
  "The Vault remembers everything",
  "Ready to explore your collection?",
  "All your links, one sacred place",
];

// ── Default Values ──
export const DEFAULT_PAGE_SIZE = 40;
export const DEFAULT_FOLDER_ICON = "Folder";
export const DEFAULT_ACCENT_COLOR = "#A855F7"; // Cursed Purple
