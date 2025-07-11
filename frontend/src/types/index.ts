/**
 * Shared Player type for fantasy draft simulator.
 */
export type Player = {
  player_id: string;  // from backend, the unique ID
  full_name: string;  // backend's full name field
  position: string;
  team: string;
  adp: number;
  scoring: string;
  platform: string;
  type: string;
  rank?: number;
  // Optional draft engine fields if you want
  ecr?: number;
  stdDev?: number;
  tier?: number;
  lastYearFinish?: number;
  isAlpha?: boolean;
  upsideScore?: number;
  score?: number;
  adjustedScore?: number;
  team_index?: number;
};

export type RosterState = {
  qb: number;
  rb: number;
  wr: number;
  te: number;
  flex: number;
  k: number;
  def: number;
  bn: number;
};