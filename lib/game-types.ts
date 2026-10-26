export type PieceSculptType = 'crown' | 'horse' | 'alien' | 'human'

export interface PieceSculptMetadata {
  id: PieceSculptType
  index: number
  name: string
  shortLabel: string
  loreTitle: string
  horrorSoundTitle: string
  image: string
  description: string
}

export const SCULPTED_PIECES: PieceSculptMetadata[] = [
  {
    id: 'crown',
    index: 0,
    name: 'Sovereign Crown',
    shortLabel: 'CROWN',
    loreTitle: 'Imperial Diadem',
    horrorSoundTitle: 'Cursed Execution Bell',
    image: '/images/piece-crown.jpg',
    description:
      'Forged in 24k heirloom gold with crimson velvet, emeralds, sapphires, and rubies.',
  },
  {
    id: 'horse',
    index: 1,
    name: 'Royal Warhorse',
    shortLabel: 'HORSE',
    loreTitle: 'Cosmic Destrier',
    horrorSoundTitle: 'Phantom Nightmare Neigh',
    image: '/images/piece-horse.jpg',
    description:
      'Armored silver-and-gold filigree stallion bust set with blood-red cabochon garnets.',
  },
  {
    id: 'alien',
    index: 2,
    name: 'Void Alien Archon',
    shortLabel: 'ALIEN',
    loreTitle: 'Singularity Overseer',
    horrorSoundTitle: 'Abyssal Void Shriek',
    image: '/images/piece-alien.jpg',
    description:
      'Ancient cosmic bronze bust with horned filigree crest and bioluminescent cyan gems.',
  },
  {
    id: 'human',
    index: 3,
    name: 'High King Human',
    shortLabel: 'HUMAN',
    loreTitle: 'First Mortal Emperor',
    horrorSoundTitle: 'Soul Reaper War Cry',
    image: '/images/piece-human.jpg',
    description:
      'Weathered bronze and ornate gold-engraved portrait bust crowned with crimson rubies.',
  },
]

export type FactionId =
  | 'crimson'
  | 'emerald'
  | 'gold'
  | 'sapphire'
  | 'amethyst'
  | 'cyan'

export interface FactionConfig {
  id: FactionId
  name: string
  shortName: string
  colorName: string
  hinglishColorName: string
  primaryHex: string
  secondaryHex: string
  glowHex: string
  bgTint: string
  borderClass: string
  textClass: string
  badgeBg: string
}

export const FACTIONS: Record<FactionId, FactionConfig> = {
  crimson: {
    id: 'crimson',
    name: 'Red Imperium',
    shortName: 'RED',
    colorName: 'Red',
    hinglishColorName: 'Red',
    primaryHex: '#ef4444',
    secondaryHex: '#7f1d1d',
    glowHex: '#f87171',
    bgTint: 'rgba(239, 68, 68, 0.25)',
    borderClass: 'border-red-500/60',
    textClass: 'text-red-400',
    badgeBg: 'bg-red-950/80',
  },
  emerald: {
    id: 'emerald',
    name: 'Green Vanguard',
    shortName: 'GREEN',
    colorName: 'Green',
    hinglishColorName: 'Green',
    primaryHex: '#10b981',
    secondaryHex: '#064e3b',
    glowHex: '#34d399',
    bgTint: 'rgba(16, 185, 129, 0.25)',
    borderClass: 'border-emerald-500/60',
    textClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Blue Astral',
    shortName: 'BLUE',
    colorName: 'Blue',
    hinglishColorName: 'Blue',
    primaryHex: '#3b82f6',
    secondaryHex: '#1e3a8a',
    glowHex: '#60a5fa',
    bgTint: 'rgba(59, 130, 246, 0.25)',
    borderClass: 'border-blue-500/60',
    textClass: 'text-blue-400',
    badgeBg: 'bg-blue-950/80',
  },
  gold: {
    id: 'gold',
    name: 'Yellow Solar',
    shortName: 'YELLOW',
    colorName: 'Yellow',
    hinglishColorName: 'Yellow',
    primaryHex: '#eab308',
    secondaryHex: '#713f12',
    glowHex: '#facc15',
    bgTint: 'rgba(234, 179, 8, 0.25)',
    borderClass: 'border-amber-400/60',
    textClass: 'text-amber-300',
    badgeBg: 'bg-amber-950/80',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Purple Void',
    shortName: 'PURPLE',
    colorName: 'Purple',
    hinglishColorName: 'Purple',
    primaryHex: '#a855f7',
    secondaryHex: '#4c1d95',
    glowHex: '#c084fc',
    bgTint: 'rgba(168, 85, 247, 0.25)',
    borderClass: 'border-purple-500/60',
    textClass: 'text-purple-400',
    badgeBg: 'bg-purple-950/80',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyan Nebula',
    shortName: 'CYAN',
    colorName: 'Cyan',
    hinglishColorName: 'Cyan',
    primaryHex: '#06b6d4',
    secondaryHex: '#164e63',
    glowHex: '#22d3ee',
    bgTint: 'rgba(6, 182, 212, 0.25)',
    borderClass: 'border-cyan-500/60',
    textClass: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/80',
  },
}

// ============================================================================
// 100% WORKING SPACE, PLANET, METEOR & SINGULARITY SKINS SYSTEM
// Every skin ID is strictly synchronized across all 3D models, boards & canvas
// ============================================================================

export type BoardSkinId =
  | 'eldergrove'
  | 'obsidian'
  | 'jade'
  | 'astral'
  | 'supernova'

export type PieceSkinId =
  | 'heirloom-gold'
  | 'dark-damascus'
  | 'solar-aurum'
  | 'sylvan-relic'
  | 'neutron-star'

export type DiceSkinId =
  | 'ruby-diamond'
  | 'singularity-void'
  | 'emerald-dragon'
  | 'celestial-ivory'
  | 'molten-meteor'

export type EnvironmentSkinId =
  | 'bioluminescent-forest'
  | 'eclipse-singularity'
  | 'blood-moon-altar'
  | 'deep-space-nebula'

export interface BoardSkinConfig {
  id: BoardSkinId
  name: string
  subtitle: string
  woodGradient: string
  stoneBorder: string
  tileBase: string
  tileBorder: string
  runeColor: string
  goldTrim: string
  costGold: number
}

export const BOARD_SKINS: Record<BoardSkinId, BoardSkinConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Event Horizon Monolith',
    subtitle: 'Black hole basalt, brushed platinum & violet gravitational runes',
    woodGradient:
      'linear-gradient(135deg, #0b0d18 0%, #05060b 50%, #121526 100%)',
    stoneBorder: 'linear-gradient(180deg, #1e1b2e 0%, #09080f 100%)',
    tileBase: 'rgba(13, 16, 28, 0.94)',
    tileBorder: 'rgba(168, 85, 247, 0.5)',
    runeColor: '#c084fc',
    goldTrim: '#e2e8f0',
    costGold: 0,
  },
  eldergrove: {
    id: 'eldergrove',
    name: 'Olympus Golden Altar',
    subtitle: 'Ancient carved cosmic walnut, 24k gold filigree & solar runes',
    woodGradient:
      'linear-gradient(135deg, #2b1a0e 0%, #160d06 50%, #24150b 100%)',
    stoneBorder: 'linear-gradient(180deg, #2c2519 0%, #120f0a 100%)',
    tileBase: 'rgba(32, 20, 11, 0.93)',
    tileBorder: 'rgba(212, 175, 55, 0.48)',
    runeColor: '#f59e0b',
    goldTrim: '#d4af37',
    costGold: 0,
  },
  astral: {
    id: 'astral',
    name: 'Andromeda Nebula Grid',
    subtitle: 'Deep space starfield marble, rose-gold constellations & quasar glow',
    woodGradient:
      'linear-gradient(135deg, #1b102e 0%, #090514 50%, #25133d 100%)',
    stoneBorder: 'linear-gradient(180deg, #2d1942 0%, #11081c 100%)',
    tileBase: 'rgba(24, 14, 42, 0.93)',
    tileBorder: 'rgba(244, 114, 182, 0.5)',
    runeColor: '#38bdf8',
    goldTrim: '#f472b6',
    costGold: 0,
  },
  jade: {
    id: 'jade',
    name: 'Quasar Emerald Sanctuary',
    subtitle: 'Bioluminescent cosmic jadeite, royal aurum & cyber-nebula runes',
    woodGradient:
      'linear-gradient(135deg, #072219 0%, #03110c 50%, #0b2d20 100%)',
    stoneBorder: 'linear-gradient(180deg, #112c22 0%, #06130e 100%)',
    tileBase: 'rgba(7, 28, 20, 0.93)',
    tileBorder: 'rgba(52, 211, 153, 0.5)',
    runeColor: '#34d399',
    goldTrim: '#facc15',
    costGold: 400,
  },
  supernova: {
    id: 'supernova',
    name: 'Crimson Supernova Citadel',
    subtitle: 'Molten star-core obsidian with solar flare conduits & blood gold',
    woodGradient:
      'linear-gradient(135deg, #2a0a0e 0%, #120305 50%, #330d12 100%)',
    stoneBorder: 'linear-gradient(180deg, #3b1117 0%, #170507 100%)',
    tileBase: 'rgba(38, 10, 14, 0.94)',
    tileBorder: 'rgba(248, 113, 113, 0.5)',
    runeColor: '#fde047',
    goldTrim: '#f97316',
    costGold: 600,
  },
}

export interface PieceSkinConfig {
  id: PieceSkinId
  name: string
  subtitle: string
  imageFilter: string
  rimGradient: string
  pedestalGlow: string
  metalPalette: {
    dark: string
    mid: string
    light: string
    highlight: string
    rim: string
  }
  costGold: number
}

export const PIECE_SKINS: Record<PieceSkinId, PieceSkinConfig> = {
  'heirloom-gold': {
    id: 'heirloom-gold',
    name: 'Olympus 24K Heirloom Gold',
    subtitle: 'Imperial sun-forged gold with ruby velvet & starlight cabochons',
    imageFilter: 'contrast(1.08) saturate(1.15)',
    rimGradient: 'linear-gradient(135deg, #fef08a, #b45309, #fde047)',
    pedestalGlow: 'rgba(245, 158, 11, 0.6)',
    metalPalette: {
      dark: '#3b2306',
      mid: '#9a6b1f',
      light: '#eab308',
      highlight: '#fef08a',
      rim: '#ca8a04',
    },
    costGold: 0,
  },
  'dark-damascus': {
    id: 'dark-damascus',
    name: 'Dark Matter Void Titanium',
    subtitle: 'Event-horizon black damascus steel with violet singularity fire',
    imageFilter:
      'contrast(1.25) saturate(1.3) hue-rotate(255deg) brightness(0.95)',
    rimGradient: 'linear-gradient(135deg, #e9d5ff, #6b21a8, #c084fc)',
    pedestalGlow: 'rgba(168, 85, 247, 0.7)',
    metalPalette: {
      dark: '#140929',
      mid: '#4c1d95',
      light: '#a855f7',
      highlight: '#f3e8ff',
      rim: '#7e22ce',
    },
    costGold: 0,
  },
  'solar-aurum': {
    id: 'solar-aurum',
    name: 'Supernova Blazing Chrome',
    subtitle: 'Molten solar flare rose-gold infused with crimson starlight',
    imageFilter: 'contrast(1.18) saturate(1.45) sepia(0.25) brightness(1.12)',
    rimGradient: 'linear-gradient(135deg, #ffffff, #f97316, #fef08a)',
    pedestalGlow: 'rgba(249, 115, 22, 0.75)',
    metalPalette: {
      dark: '#431407',
      mid: '#c2410c',
      light: '#fb923c',
      highlight: '#fff7ed',
      rim: '#ea580c',
    },
    costGold: 0,
  },
  'sylvan-relic': {
    id: 'sylvan-relic',
    name: 'Nebula Emerald Pulsar',
    subtitle: 'Cosmic jade bronze charged with bioluminescent cyan plasma',
    imageFilter: 'contrast(1.15) saturate(1.35) hue-rotate(115deg)',
    rimGradient: 'linear-gradient(135deg, #a7f3d0, #047857, #22d3ee)',
    pedestalGlow: 'rgba(16, 185, 129, 0.7)',
    metalPalette: {
      dark: '#042f2e',
      mid: '#0d9488',
      light: '#2dd4bf',
      highlight: '#ccfbf1',
      rim: '#14b8a6',
    },
    costGold: 400,
  },
  'neutron-star': {
    id: 'neutron-star',
    name: 'Neutron Star Platinum',
    subtitle: 'Hyper-dense celestial white-dwarf silver with astral blue core',
    imageFilter: 'contrast(1.2) saturate(1.2) hue-rotate(195deg) brightness(1.1)',
    rimGradient: 'linear-gradient(135deg, #ffffff, #38bdf8, #94a3b8)',
    pedestalGlow: 'rgba(56, 189, 248, 0.75)',
    metalPalette: {
      dark: '#0f172a',
      mid: '#334155',
      light: '#38bdf8',
      highlight: '#f8fafc',
      rim: '#0284c7',
    },
    costGold: 550,
  },
}

export interface DiceSkinConfig {
  id: DiceSkinId
  name: string
  planetTheme: 'saturn' | 'black-hole' | 'meteor' | 'neptune' | 'terra-emerald'
  subtitle: string
  frameGradient: string
  coreBg: string
  pipColor: string
  pipGlow: string
  ringAccent: string
  costGold: number
}

export const DICE_SKINS: Record<DiceSkinId, DiceSkinConfig> = {
  'ruby-diamond': {
    id: 'ruby-diamond',
    name: 'Saturn Golden Ring',
    planetTheme: 'saturn',
    subtitle: 'Celestial Saturn sphere encircled by golden orbital rings & star pips',
    frameGradient:
      'linear-gradient(135deg, #fef08a 0%, #d97706 50%, #78350f 100%)',
    coreBg: 'radial-gradient(circle at 35% 35%, #b45309 0%, #451a03 65%, #1c0a00 100%)',
    pipColor: '#ffffff',
    pipGlow: '#fde047',
    ringAccent: '#fef08a',
    costGold: 0,
  },
  'singularity-void': {
    id: 'singularity-void',
    name: 'Pulsar Black Hole Core',
    planetTheme: 'black-hole',
    subtitle: 'Gravitational dark-matter orb with violet quasar horizon pips',
    frameGradient:
      'linear-gradient(135deg, #e9d5ff 0%, #6b21a8 50%, #1e1b4b 100%)',
    coreBg: 'radial-gradient(circle at 40% 40%, #4c1d95 0%, #1e0936 60%, #05020a 100%)',
    pipColor: '#f3e8ff',
    pipGlow: '#c084fc',
    ringAccent: '#a855f7',
    costGold: 0,
  },
  'molten-meteor': {
    id: 'molten-meteor',
    name: 'Molten Asteroid Meteor',
    planetTheme: 'meteor',
    subtitle: 'Cracked volcanic meteorite iron with glowing magma fissures',
    frameGradient:
      'linear-gradient(135deg, #fca5a5 0%, #b91c1c 48%, #1f2937 100%)',
    coreBg: 'radial-gradient(circle at 35% 35%, #991b1b 0%, #450a0a 65%, #110303 100%)',
    pipColor: '#fef08a',
    pipGlow: '#f97316',
    ringAccent: '#ef4444',
    costGold: 0,
  },
  'celestial-ivory': {
    id: 'celestial-ivory',
    name: 'Neptune Cryo-Planet',
    planetTheme: 'neptune',
    subtitle: 'Supersonic azure ice-giant vortex with frozen diamond star pips',
    frameGradient:
      'linear-gradient(135deg, #e0f2fe 0%, #0284c7 52%, #0f172a 100%)',
    coreBg: 'radial-gradient(circle at 35% 35%, #0369a1 0%, #0c4a6e 60%, #041326 100%)',
    pipColor: '#ffffff',
    pipGlow: '#38bdf8',
    ringAccent: '#38bdf8',
    costGold: 350,
  },
  'emerald-dragon': {
    id: 'emerald-dragon',
    name: 'Kepler Super-Earth',
    planetTheme: 'terra-emerald',
    subtitle: 'Bioluminescent exoplanet crust with aurora emerald pips',
    frameGradient:
      'linear-gradient(135deg, #a7f3d0 0%, #059669 52%, #022c22 100%)',
    coreBg: 'radial-gradient(circle at 35% 35%, #047857 0%, #064e3b 65%, #021712 100%)',
    pipColor: '#fef08a',
    pipGlow: '#34d399',
    ringAccent: '#10b981',
    costGold: 450,
  },
}

export interface EnvironmentSkinConfig {
  id: EnvironmentSkinId
  name: string
  subtitle: string
  sporeColor1: string
  sporeColor2: string
  fogTint: string
  accentHex: string
  hasMeteors: boolean
  hasPlanets: boolean
  costGold: number
}

export const ENVIRONMENT_SKINS: Record<
  EnvironmentSkinId,
  EnvironmentSkinConfig
> = {
  'eclipse-singularity': {
    id: 'eclipse-singularity',
    name: 'Singularity Horizon',
    subtitle: 'Deep space accretion radiation, orbiting moons & shooting meteors',
    sporeColor1: '#c084fc',
    sporeColor2: '#38bdf8',
    fogTint: 'rgba(18, 8, 38, 0.52)',
    accentHex: '#a855f7',
    hasMeteors: true,
    hasPlanets: true,
    costGold: 0,
  },
  'bioluminescent-forest': {
    id: 'bioluminescent-forest',
    name: 'Mysterious Eldergrove',
    subtitle: 'Ancient cosmic forest beneath a glowing galaxy & golden fireflies',
    sporeColor1: '#f59e0b',
    sporeColor2: '#10b981',
    fogTint: 'rgba(6, 24, 18, 0.45)',
    accentHex: '#d4af37',
    hasMeteors: true,
    hasPlanets: false,
    costGold: 0,
  },
  'deep-space-nebula': {
    id: 'deep-space-nebula',
    name: 'Andromeda Star Cradle',
    subtitle: 'Hyperspace cyan-magenta nebula clouds, exoplanets & comet trails',
    sporeColor1: '#22d3ee',
    sporeColor2: '#f472b6',
    fogTint: 'rgba(8, 18, 42, 0.55)',
    accentHex: '#38bdf8',
    hasMeteors: true,
    hasPlanets: true,
    costGold: 0,
  },
  'blood-moon-altar': {
    id: 'blood-moon-altar',
    name: 'Supernova Blood Eclipse',
    subtitle: 'Crimson stellar storm with meteor showers & molten embers',
    sporeColor1: '#ef4444',
    sporeColor2: '#f59e0b',
    fogTint: 'rgba(36, 6, 10, 0.52)',
    accentHex: '#ef4444',
    hasMeteors: true,
    hasPlanets: true,
    costGold: 450,
  },
}

export type CommentaryLanguage = 'en' | 'hinglish'

export interface CommentaryPopupData {
  id: number
  title: string
  text: string
  accentHex: string
  eventType: 'capture' | 'ring' | 'spawn' | 'stalk' | 'move' | 'roll'
}

export interface EliminationEvent {
  id: number
  x: number
  y: number
  killerFaction: FactionId
  killerSculpt: PieceSculptType
  victimFaction: FactionId
  victimSculpt: PieceSculptType
}

export interface PieceInstance {
  id: string
  playerIndex: number
  faction: FactionId
  sculptIndex: number // 0 = crown, 1 = horse, 2 = alien, 3 = human
  sculptType: PieceSculptType
  stepsMoved: number // -1 = in Base, 0..trackMax = on track, 999 = Ascended
  isFinished: boolean
  justFinishedAt?: number
}

export interface PlayerState {
  index: number
  name: string
  faction: FactionId
  isAI: boolean
  avatarSculpt: PieceSculptType
  pieces: PieceInstance[]
  finishedCount: number
  capturesCount: number
  rank?: number
}

export type PlayerCountOption = 2 | 4 | 6
export type MatchMode = 'ai' | 'pass-and-play' | 'quick-blitz' | 'online-arena'
