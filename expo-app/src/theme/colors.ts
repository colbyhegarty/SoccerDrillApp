// Theme colors matching Lovable's dark mode
export const colors = {
  // Core backgrounds
  background: '#151823',      // hsl(215, 28%, 10%)
  card: '#1e2433',            // hsl(215, 25%, 14%)
  cardHover: '#252a3a',
  
  // Text
  foreground: '#e8eaed',      // hsl(210, 15%, 92%)
  mutedForeground: '#8b919e', // hsl(210, 10%, 58%)
  
  // Primary (green)
  primary: '#4a9d6e',         // hsl(152, 45%, 42%)
  primaryForeground: '#ffffff',
  primaryLight: 'rgba(74, 157, 110, 0.1)',
  
  // Accent (gold/yellow for "Animated" badge)
  accent: '#d4a641',          // hsl(43, 85%, 50%)
  accentForeground: '#151823',
  
  // Border
  border: '#2a3142',          // hsl(215, 18%, 24%)
  
  // Destructive
  destructive: '#dc2626',
  
  // Category colors (matching Lovable getCategoryColor)
  categoryColors: {
    passing: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    shooting: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    dribbling: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    defending: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    possession: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    fitness: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    warmup: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    default: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
  },
  
  // Difficulty colors
  difficultyColors: {
    easy: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    medium: { bg: 'rgba(212, 166, 65, 0.15)', text: '#d4a641' },
    hard: { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626' },
    default: { bg: 'rgba(139, 145, 158, 0.15)', text: '#8b919e' },
  },
  
  // Field colors
  fieldLight: '#6fbf4a',
  fieldDark: '#63b043',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 11,
    fontWeight: '500' as const,
  },
};
