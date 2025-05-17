/**
 * Shared Player type for fantasy draft simulator.
 */
export type Player = {
  id: string; 
  name: string;
  position: string;
  team: string;
  adp: number;

  // Optional draft engine inputs
  ecr?: number;
  stdDev?: number;
  tier?: number;
  lastYearFinish?: number;
  isAlpha?: boolean;
  upsideScore?: number;

  // Draft engine output fields
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

export type ECRPlayerData = {
  name: string;
  team: string;
  position: string;
  tier: number;
  best: number;
  worst: number;
  avg: number;
  stdDev: number;
};

export type MockNavbarProps = {
  draftStarted: boolean;
  onStartDraft: () => void;
};