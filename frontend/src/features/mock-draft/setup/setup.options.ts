import ADP_OPTIONS_JSON from "@/data/valid_adp_combinations.json";

import type {
  DraftSetupFormat,
  DraftSetupLeagueState,
  DraftSetupQbType,
  DraftSetupScoring,
  DraftSetupPlatform,
} from "./setup.types";

export type AdpOptionRecord = {
  leagueFormat: DraftSetupFormat;
  qb_setting: DraftSetupQbType;
  scoring: DraftSetupScoring;
  platform: DraftSetupPlatform;
};

export const ADP_OPTION_RECORDS: AdpOptionRecord[] =
  ADP_OPTIONS_JSON as AdpOptionRecord[];

function getUniqueValues<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export function getFormatOptions(): DraftSetupFormat[] {
  return getUniqueValues(
    ADP_OPTION_RECORDS.map((option) => option.leagueFormat),
  );
}

export function getQbTypeOptions(format: DraftSetupFormat): DraftSetupQbType[] {
  return getUniqueValues(
    ADP_OPTION_RECORDS.filter((option) => option.leagueFormat === format).map(
      (option) => option.qb_setting,
    ),
  );
}

export function getScoringOptions(
  format: DraftSetupFormat,
  qbType: DraftSetupQbType,
): DraftSetupScoring[] {
  return getUniqueValues(
    ADP_OPTION_RECORDS.filter(
      (option) =>
        option.leagueFormat === format && option.qb_setting === qbType,
    ).map((option) => option.scoring),
  );
}

export function getPlatformOptions(
  format: DraftSetupFormat,
  qbType: DraftSetupQbType,
  scoring: DraftSetupScoring,
): DraftSetupPlatform[] {
  return getUniqueValues(
    ADP_OPTION_RECORDS.filter(
      (option) =>
        option.leagueFormat === format &&
        option.qb_setting === qbType &&
        option.scoring === scoring,
    ).map((option) => option.platform),
  );
}

export function normalizeLeagueSelection(
  league: DraftSetupLeagueState,
): DraftSetupLeagueState {
  const formatOptions = getFormatOptions();
  const format = formatOptions.includes(league.format)
    ? league.format
    : formatOptions[0];

  const qbTypeOptions = getQbTypeOptions(format);
  const qbType = qbTypeOptions.includes(league.qbType)
    ? league.qbType
    : qbTypeOptions[0];

  const scoringOptions = getScoringOptions(format, qbType);
  const scoring = scoringOptions.includes(league.scoring)
    ? league.scoring
    : scoringOptions[0];

  const platformOptions = getPlatformOptions(format, qbType, scoring);
  const platform = platformOptions.includes(league.platform)
    ? league.platform
    : platformOptions[0];

  return {
    format,
    qbType,
    scoring,
    platform,
  };
}
