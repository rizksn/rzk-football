export function normalizeSegment(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export function buildAdpFormatKey(config: {
  leagueFormat: string;
  qb_setting: string;
  scoring: string;
  platform: string;
}): string {
  return [
    config.leagueFormat,
    config.qb_setting,
    config.scoring,
    config.platform
  ].map(normalizeSegment).join('_');
}
