// ══════════════════════════════════════════════════════════════════
// FREE DRILL ACCESS CONFIG
// ══════════════════════════════════════════════════════════════════
//
// This file controls which drills are available to free-tier users.
// All other drills will appear in the library with a blurred diagram
// and a lock overlay. Tapping a locked drill shows the paywall.
//
// HOW TO UPDATE:
// 1. Add or remove drill IDs in the FREE_DRILL_IDS set below.
// 2. That's it — the app reads this at runtime.
//
// You can find drill IDs in your Supabase dashboard or by inspecting
// the drill detail response in the app's console logs.
//
// TIP: Choose a diverse mix across categories so free users get a
// taste of everything — passing, shooting, possession, warm-up, etc.
// ══════════════════════════════════════════════════════════════════

/**
 * Set of drill IDs that free users can fully access.
 * All drills NOT in this set will be locked (blurred + lock icon).
 *
 * When you add drills to your Supabase library, grab the IDs and
 * add them here to make them available to free users.
 */
export const FREE_DRILL_IDS: Set<string> = new Set([
  // ── 1V1 ──
  '1v1-dribble-attack-with-shot', // 1v1 Attacking Dribble to Goal
  '1v1-competition', // 1v1 Competitive Challenge
  '1v1-diamond-shooting-drill', // 1v1 Diamond Finishing Exercise

  // ── 2V2 ──
  '2v2-with-target-players-to-small-goals', // 2v2 Attack with Targets
  '2v2-dribbling-to-beat-the-defender', // 2v2 Attacking Dribble Challenge
  '2v2-challenge', // 2v2 Competition

  // ── ATTACKING ──
  '2v1-dribbling-with-opposition', // 2v1 Attacking Dribble Against Defender
  '3v1-attacking-the-goal', // 3v1 to Goal
  '2v1-receiving-while-facing-the-defender', // 2v1 Receiving Facing the Defender

  // ── CROSSING ──
  'crossing-finishing-shooting-drill', // Cross Delivery and Goal Scoring Exercise
  'cross-finish-under-pressure', // Cross and Finish with Defensive Pressure
  'combination-crossing-drill', // Crossing Combination Exercise

  // ── DEFENDING ──
  'teaching-1st-defender-without-opposition', // 1st Defender Fundamentals
  '2v1-defensive-recovery-race', // 2v1 Defensive Recovery Race
  'defensive-clearances-up-and-out', // Defensive Clearances- High and Wide

  // ── DRIBBLING ──
  'dribbling-at-the-cone', // Cone Dribbling Challenge
  'simple-obstacle-course', // Basic Agility Circuit
  'body-parts-warm-up-game', // Body Parts Activation Exercise

  // ── FINISHING ──
  'pass-receiving', // Pass Receiving
  'forward-warmup', // Forward Warmup
  'give-and-go-shooting-warmup', // Give and Go Shooting Warmup

  // ── FITNESS ──
  '5050-lap-runs', // 50/50 Lap Runs
  'back-to-front-laps', // Back-to-Front Laps
  'fartlek-run-drills', // Fartlek Run Drills

  // ── GAME ──
  '11v7-full-team-positional-possession', // 11v7 Full-Team Positional Possession
  '2v2-to-full-size-goals', // 2v2 to Full-Size Goals
  '11v5-positional-rondo', // 11v5 Positional Possession

  // ── GOALKEEPER ──
  '3-cone-drill', // 3 Cone Drill
  'bounce-reaction-drill', // Bounce Reaction Drill
  'distribution', // Distribution

  // ── PASSING ──
  'soccer-ball-smash', // Ball Strike Challenge
  'circle-passing-combination-drill', // Circular Passing Combination Exercise
  'check-in-passing-warm-up', // Check-To Passing Warm-Up

  // ── POSSESSION ──
  '2v1-attacking-rondo', // 2v1 Supporting Rondo
  '2v1-and-1v1-possession-game', // 2v1 to 1v1 Possession Exercise
  '3v1-rondo', // 3v1 Possession

  // ── REACTION ──
  'headcatch-game', // Header/Catch Challenge

  // ── RECEIVING ──
  'trapping-with-passive-opposition', // Ball Control Under Light Pressure
  'trapping-and-control-with-no-opposition', // Ball Control and Receiving Without Pressure
  'check-away-and-receive-under-pressure', // Check Away and Receive Under Pressure

  // ── SHOOTING ──
  'diagonal-soccer-shooting-drill', // 1-2 Finishing Exercise
  'shooting-agility-drill', // Agility Shooting Exercise
  'combination-shooting-finishing-drill', // Combination Shooting and Finishing Exercise

  // ── SMALL-SIDED ──
  '2v1-with-keepers', // 2v1 with Goalkeepers
  '3v3-4-goal-small-sided-game-funino', // 3v3 Small-Sided to Four Goals
  '4v4-soccer-to-a-small-gate', // 4v4 Attack to Gates

  // ── TRANSITION ──
  '1v1-to-4v1', // 1v1 to 4v1

  // ── TURNING ──
  'back-to-goal-receiving-and-turn', // Back-to-Goal Receiving and Turn

  // ── WARM-UP ──
  'across-field-warm-up', // Cross-Field Warm-Up Exercise
]);

/**
 * Check if a drill is available to free users.
 *
 * If FREE_DRILL_IDS is empty, ALL drills are locked for free users
 * (except the app still shows them blurred in the library).
 *
 * If you want all drills unlocked during development, set this
 * to always return true (or use the dev toggle).
 */
export function isDrillFree(drillId: string): boolean {
  // During early development with no IDs populated yet,
  // you may want to uncomment this line to unlock everything:
  // return true;

  return FREE_DRILL_IDS.has(drillId);
}

/**
 * Returns the number of free drills configured.
 * Useful for marketing copy: "X free drills included!"
 */
export function getFreeDrillCount(): number {
  return FREE_DRILL_IDS.size;
}
