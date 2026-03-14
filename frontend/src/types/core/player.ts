export type Player = {
  player_id: string;
  full_name: string;
  position: string;
  team: string;
  adp: number;
  scoring: string;
  platform: string;
  type: string;
  rank: number;
  tier?: number;
  lastYearFinish?: number;
  isAlpha?: boolean;
  upsideScore?: number;
  score?: number;
  adjustedScore?: number;
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
