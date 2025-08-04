"use client";

import { toast } from "sonner";
import { buildAdpFormatKey } from "@/utils/adp";
import ADP_OPTIONS from "@/data/valid_adp_combinations.json";
import { DraftConfig } from "@/types/draft/config";

interface Props {
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  isPaidUser: boolean;
  isLoggedIn: boolean;
  onConfirm: () => void;
}

export default function AdpSettingsForm({
  draftConfig,
  setDraftConfig,
  isPaidUser,
  onConfirm,
  isLoggedIn,
}: Props) {
  const isLocked = !isPaidUser || !isLoggedIn;
  const { useAI, num_teams } = draftConfig;

  const getValidOptions = (
    field: keyof DraftConfig,
    current: DraftConfig
  ): string[] => {
    if (field === "leagueFormat") {
      return Array.from(new Set(ADP_OPTIONS.map((o) => o.leagueFormat)));
    }
    return Array.from(
      new Set(
        ADP_OPTIONS.filter((o) => o.leagueFormat === current.leagueFormat).map(
          (o) => o[field as keyof typeof o]
        )
      )
    );
  };

  const handleAdpChange = (
    field: "leagueFormat" | "qb_setting" | "scoring" | "platform",
    value: string
  ) => {
    if (!isPaidUser) {
      toast.error("🔒 Sign up to unlock all ADP formats and features!");
      // Do nothing else, block change
      return;
    }
    // Otherwise allow change:
    const updated = { ...draftConfig, [field]: value };
    let match = ADP_OPTIONS.find(
      (o) =>
        o.leagueFormat === updated.leagueFormat &&
        o.qb_setting === updated.qb_setting &&
        o.scoring === updated.scoring &&
        o.platform === updated.platform
    );
    if (!match) match = ADP_OPTIONS.find((o) => o[field] === value);
    if (match) {
      setDraftConfig({
        ...match,
        adpFormatKey: buildAdpFormatKey(match),
        useAI,
        num_teams,
      });
    }
  };

  const validFormats = getValidOptions("leagueFormat", draftConfig);
  const validQbSettings = getValidOptions("qb_setting", draftConfig);
  const validScoring = getValidOptions("scoring", draftConfig);
  const validPlatforms = getValidOptions("platform", draftConfig);

  const fields = [
    {
      label: "Format",
      field: "leagueFormat",
      value: draftConfig.leagueFormat,
      options: validFormats,
    },
    {
      label: "QB Setting",
      field: "qb_setting",
      value: draftConfig.qb_setting,
      options: validQbSettings,
    },
    {
      label: "Scoring",
      field: "scoring",
      value: draftConfig.scoring,
      options: validScoring,
    },
    {
      label: "Platform",
      field: "platform",
      value: draftConfig.platform,
      options: validPlatforms,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <div className={!isPaidUser ? "opacity-40" : ""}>
        {fields.map(({ label, field, value, options }) => (
          <label className="block text-sm text-white" key={field}>
            {label}
            <select
              className={`w-full mt-1 p-2 rounded bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLocked ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (isLocked) {
                  toast.error(
                    "🔒 Sign up to unlock all league formats and features!"
                  );
                }
              }}
              onChange={(e) => {
                if (!isLocked) {
                  handleAdpChange(field, e.target.value);
                }
              }}
              value={value}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        ))}

        <div className="pt-6 flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Below the Confirm button, or at bottom of modal content */}
      {!isPaidUser && (
        <p className="mt-4 text-sm text-red-400 font-semibold">
          Subscribe to unlock all league settings and premium features.{" "}
          <a
            href="/subscribe"
            className="no-underline text-blue-400 hover:text-blue-600"
          >
            Upgrade now &rarr;
          </a>
        </p>
      )}
    </div>
  );
}
