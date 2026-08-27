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
// A curated "print ink" palette — inspired by all 6 series but tuned into one
// coherent family of inks/pigments rather than clashing neon per series.
export const ACCENT_COLORS = [
  { name: "Hanko Red", value: "#E63946" },        // Signature seal red
  { name: "Amber Ochre", value: "#D4831F" },      // Naruto
  { name: "Steel Blue", value: "#4A7C9E" },       // Naruto — Rasengan
  { name: "Titan Earth", value: "#8B6F47" },      // Attack on Titan
  { name: "Scout Green", value: "#5A8C69" },      // AoT Scouts
  { name: "Mist Teal", value: "#2A9D8F" },        // Demon Slayer
  { name: "Nichirin Pink", value: "#C97B93" },    // Demon Slayer
  { name: "Cursed Gold", value: "#C9A13B" },      // Jujutsu Kaisen
  { name: "Domain Ink", value: "#5B5570" },       // JJK — muted indigo
  { name: "Death Bone", value: "#CFC8B4" },       // Death Note — paper white
  { name: "Ryuk Crimson", value: "#B5232E" },     // Death Note
  { name: "Hollow Purple", value: "#7B2CBF" },    // JJK — Gojo Satoru
] as const;

// ── Background Images ──
// User-curated list of wallpaper/art URLs. The app rotates through these.
// Fallback gradient backgrounds are used if this list is empty or images fail to load.
export const BACKGROUND_IMAGES = [
  "https://i.pinimg.com/564x/0c/4c/67/0c4c6751800c152ee26e854383a864e6.jpg",
];

export const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #0a0a0d 0%, #1c1414 50%, #0a0a0d 100%)",
  "linear-gradient(135deg, #0a0a0d 0%, #1a1610 50%, #0a0a0d 100%)",
  "linear-gradient(135deg, #0d0a0a 0%, #201013 50%, #0a0a0d 100%)",
  "linear-gradient(135deg, #0a0d0c 0%, #101c1a 50%, #0a0a0d 100%)",
];

// ── Greeting Messages — one per village, rotated on each visit ──
export const GREETING_MESSAGES = [
  "Welcome back to the Vault",
  "Your scrolls await, Shinobi",
  "Domain Expansion: Infinite Archive",
  "Set Your Heart Ablaze",
  "Tatakae. Your links await",
  "Believe it! The vault is open",
  "Every link, written in ink",
  "The Vault remembers everything",
];

// ── Default Values ──
export const DEFAULT_PAGE_SIZE = 40;
export const DEFAULT_FOLDER_ICON = "Folder";
export const DEFAULT_ACCENT_COLOR = "#E63946"; // Hanko Red
