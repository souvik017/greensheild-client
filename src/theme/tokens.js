import { darken, lighten } from 'color2k';

const SEED_PRIMARY = '#10B981'; // Emerald
const SEED_PRIMARY_DARK = '#34D399'; // Bright emerald for dark mode
const SEED_SECONDARY = '#0E7490'; // Deep cyan-teal
const SEED_ACCENT = '#F5A623'; // Amber highlight

function generateRamp(base) {
  return {
    50: lighten(base, 0.52),
    100: lighten(base, 0.44),
    200: lighten(base, 0.34),
    300: lighten(base, 0.22),
    400: lighten(base, 0.1),
    500: base,
    600: darken(base, 0.08),
    700: darken(base, 0.16),
    800: darken(base, 0.24),
    900: darken(base, 0.32),
  };
}

const primaryRamp = generateRamp(SEED_PRIMARY);
const secondaryRamp = generateRamp(SEED_SECONDARY);
const accentRamp = generateRamp(SEED_ACCENT);

export const lightTokens = {
  '--color-primary-50': primaryRamp[50],
  '--color-primary-100': primaryRamp[100],
  '--color-primary-200': primaryRamp[200],
  '--color-primary-300': primaryRamp[300],
  '--color-primary-400': primaryRamp[400],
  '--color-primary-500': primaryRamp[500],
  '--color-primary-600': primaryRamp[600],
  '--color-primary-700': primaryRamp[700],
  '--color-primary-800': primaryRamp[800],
  '--color-primary-900': primaryRamp[900],
  '--color-secondary-50': secondaryRamp[50],
  '--color-secondary-100': secondaryRamp[100],
  '--color-secondary-200': secondaryRamp[200],
  '--color-secondary-300': secondaryRamp[300],
  '--color-secondary-400': secondaryRamp[400],
  '--color-secondary-500': secondaryRamp[500],
  '--color-secondary-600': secondaryRamp[600],
  '--color-secondary-700': secondaryRamp[700],
  '--color-secondary-800': secondaryRamp[800],
  '--color-secondary-900': secondaryRamp[900],
  '--color-accent-50': accentRamp[50],
  '--color-accent-100': accentRamp[100],
  '--color-accent-400': accentRamp[400],
  '--color-accent-500': accentRamp[500],
  '--color-accent-600': accentRamp[600],
  '--color-amber-50': accentRamp[50],
  '--color-amber-400': accentRamp[400],
  '--color-amber-500': accentRamp[500],
  '--color-amber-600': accentRamp[600],
  '--color-background': '#F6FAF8',
  '--color-surface': '#FFFFFF',
  '--color-surface-2': '#EFF5F2',
  '--color-text-primary': '#0B1210',
  '--color-text-secondary': '#3D4A46',
  '--color-text-muted': '#6B7A74',
  '--color-border': '#DDE8E3',
  '--color-success': '#10B981',
  '--color-warning': '#F5A623',
  '--color-danger': '#EF5350',
  '--color-info': '#0EA5E9',
  '--color-glow': 'rgba(16, 185, 129, 0.16)',
};

export const darkTokens = {
  ...lightTokens,
  '--color-primary-50': '#0E231B',
  '--color-primary-100': '#12301F',
  '--color-primary-200': '#164126',
  '--color-primary-300': '#1B5731',
  '--color-primary-400': '#1F6A39',
  '--color-primary-500': '#26A267',
  '--color-primary-600': '#34C98C',
  '--color-primary-700': '#5CD9A6',
  '--color-primary-800': '#8FE9C4',
  '--color-primary-900': '#C3F5E0',
  '--color-secondary-50': '#07121A',
  '--color-secondary-100': '#0A1C27',
  '--color-secondary-200': '#0E2834',
  '--color-secondary-300': '#123644',
  '--color-secondary-400': '#164A5C',
  '--color-secondary-500': '#1C6B82',
  '--color-secondary-600': '#2492AE',
  '--color-secondary-700': '#3FB2CE',
  '--color-secondary-800': '#7AD3E8',
  '--color-secondary-900': '#B8ECF7',
  '--color-accent-50': '#171407',
  '--color-accent-100': '#1D1908',
  '--color-accent-400': '#9C7A1D',
  '--color-accent-500': '#D9B42E',
  '--color-accent-600': '#F0D060',
  '--color-amber-50': '#171407',
  '--color-amber-400': '#9C7A1D',
  '--color-amber-500': '#D9B42E',
  '--color-amber-600': '#F0D060',
  '--color-background': '#05090C',
  '--color-surface': '#0A1216',
  '--color-surface-2': '#101C20',
  '--color-text-primary': '#EEF6F2',
  '--color-text-secondary': '#C3D3CB',
  '--color-text-muted': '#7F9589',
  '--color-border': '#1A2B2E',
  '--color-success': '#3BD79B',
  '--color-warning': '#E7C24C',
  '--color-danger': '#FF7278',
  '--color-info': '#4CC3F5',
  '--color-glow': 'rgba(52, 211, 153, 0.20)',
};

export function injectTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}