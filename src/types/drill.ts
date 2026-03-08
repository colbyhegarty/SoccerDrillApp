// Types matching Lovable's drill structure

export interface Position {
  x: number;
  y: number;
}

export interface DrillPlayer {
  id: string;
  role: 'attacker' | 'defender' | 'goalkeeper' | 'neutral';
  position: Position;
}

export interface DrillCone {
  position: Position;
  color?: string;
}

export interface DrillBall {
  position: Position;
}

export interface DrillGoal {
  position: Position;
  rotation?: number;
  size?: 'full' | 'small';
}

export interface DrillMiniGoal {
  position: Position;
  rotation?: number;
}

export interface ConeLine {
  from_cone: number;
  to_cone: number;
}

export interface DrillAction {
  type: 'PASS' | 'RUN' | 'DRIBBLE' | 'SHOT';
  from_player?: string;
  to_player?: string;
  player?: string;
  to_position?: Position;
}

export interface AnimationKeyframe {
  id: string;
  label: string;
  duration: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  positions: {
    [entityId: string]: Position;
  };
}

export interface DrillJsonData {
  field?: {
    type: 'FULL' | 'HALF';
    show_markings?: boolean;
    markings?: boolean;
    goals?: number;
    attacking_direction?: 'NORTH' | 'SOUTH';
  };
  players?: DrillPlayer[];
  cones?: DrillCone[];
  balls?: DrillBall[];
  goals?: DrillGoal[];
  mini_goals?: DrillMiniGoal[];
  actions?: DrillAction[];
  cone_lines?: ConeLine[];
}

export interface Drill {
  id: string;
  name: string;
  category: string;
  description?: string;
  player_count?: number;
  player_count_display?: string;
  duration?: number;
  age_group?: string;
  difficulty?: string;
  svg_url?: string;
  diagram_json?: DrillJsonData;
  has_animation?: boolean;
  animation_json?: {
    duration: number;
    keyframes: AnimationKeyframe[];
  };
  setup?: string;
  instructions?: string;
  coaching_points?: string;
  variations?: string;
}

// Helper functions
export function getCategoryColor(category?: string): { bg: string; text: string } {
  const normalized = category?.toLowerCase().trim() || '';
  
  const categoryMap: Record<string, { bg: string; text: string }> = {
    passing: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    shooting: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    dribbling: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    defending: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    possession: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    fitness: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    warmup: { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
    'warm-up': { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' },
  };
  
  return categoryMap[normalized] || { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' };
}

export function getDifficultyColor(difficulty?: string): { bg: string; text: string } {
  const normalized = difficulty?.toLowerCase().trim() || '';
  
  switch (normalized) {
    case 'easy':
      return { bg: 'rgba(74, 157, 110, 0.15)', text: '#4a9d6e' };
    case 'medium':
      return { bg: 'rgba(212, 166, 65, 0.15)', text: '#d4a641' };
    case 'hard':
    case 'difficult':
      return { bg: 'rgba(220, 38, 38, 0.15)', text: '#dc2626' };
    default:
      return { bg: 'rgba(139, 145, 158, 0.15)', text: '#8b919e' };
  }
}
