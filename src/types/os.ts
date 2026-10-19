/**
 * PIP.EXE — Operating System & Dream Engine Types
 * haX.baby Hackathon Competition Edition
 */

export type AppId = 
  | 'pip-profile'
  | 'dream-engine'
  | 'lullaby-lab'
  | 'nightlight-studio'
  | 'pip-story'
  | 'dream-routes'
  | 'slumber-vault'
  | 'asset-inspector'
  | 'credits';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
}

export interface DreamIngredient {
  id: string;
  name: string;
  category: 'element' | 'essence' | 'sound' | 'glow';
  icon: string;
  color: string;
  description: string;
  fluffinessBonus: number;
  starlightLumens: number;
  sweetness: number;
  rarity: 'Common' | 'Rare' | 'Celestial';
}

export interface GeneratedDream {
  title: string;
  archetype: string;
  sleepinessScore: number;
  starlightLevel: number;
  fluffinessPercent: number;
  recipeNames: string[];
  fieldNotes: string;
  timestamp: string;
  palette: string[];
}

export type NightlightMode = 
  | 'moon-pearl'
  | 'amber-firefly'
  | 'aurora-borealis'
  | 'dusty-rose'
  | 'twilight-indigo';

export interface NightlightSettings {
  mode: NightlightMode;
  brightness: number; // 10 to 100
  projectorActive: boolean;
  selectedConstellation: string;
  sleepTimerMinutes: number | null; // null or remaining minutes
}

export interface LullabyNote {
  pitch: string; // e.g., 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6'
  freq: number;
  label: string;
}

export interface LullabyPreset {
  id: string;
  name: string;
  tempo: number;
  description: string;
  sequence: (number | null)[]; // indices into notes array or null for rest
}

export interface StoryChapter {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  illustrationKey: string;
  narrative: string[];
  pipThought: string;
}
