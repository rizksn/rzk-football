"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { buildAdpFormatKey } from "@/utils/adp";
import type { DraftConfig } from "@/types/draft/config";
import { DraftRosterSettings } from "@/types/draft/config";
import ADP_OPTIONS from "@/data/valid_adp_combinations.json";

import AdpSettingsForm from "./AdpSettingsForm";
import RosterSettingsForm from "./RosterSettingsForm";

interface DraftSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  onConfirm: (config: DraftConfig, roster: DraftRosterSettings) => void;
  isPaidUser: boolean;
  isLoggedIn: boolean;
  rosterSettings: DraftRosterSettings;
  setRosterSettings: (settings: DraftRosterSettings) => void;
  updateConfigWithTotalRounds: (
    config: DraftConfig,
    settings: DraftRosterSettings
  ) => void;
}

export default function DraftSettingsModal({
  isOpen,
  onClose,
  draftConfig,
  setDraftConfig,
  onConfirm,
  isPaidUser,
  isLoggedIn,
  rosterSettings,
  setRosterSettings,
  updateConfigWithTotalRounds,
}: DraftSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"adp" | "roster">("adp");
  const isSuperflex = draftConfig.qb_setting === "superflex";

  const [localDraftConfig, setLocalDraftConfig] = useState<DraftConfig>(
    JSON.parse(JSON.stringify(draftConfig))
  );

  const [localRosterSettings, setLocalRosterSettings] =
    useState<DraftRosterSettings>(JSON.parse(JSON.stringify(rosterSettings)));

  useEffect(() => {
    const updated = { ...rosterSettings };
    updated.positions.QB = { ...updated.positions.QB, count: 1, locked: true };
    updated.positions.SF = isSuperflex
      ? { ...updated.positions.SF, count: 1, locked: true }
      : { ...updated.positions.SF, count: 0, locked: true };
    const totalStartingSpots = Object.values(updated.positions).reduce(
      (sum, slot) => sum + (slot?.count || 0),
      0
    );
    updated.totalRounds = totalStartingSpots + updated.benchCount;
    setLocalRosterSettings(updated);
  }, [draftConfig.qb_setting]);

  const handleConfirmAdpSettings = () => {
    if (!isPaidUser) {
      toast.error("🔒 Sign up to unlock all ADP formats and features!");
      return;
    }
    onConfirm(localDraftConfig, rosterSettings);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setLocalDraftConfig(JSON.parse(JSON.stringify(draftConfig)));
      setLocalRosterSettings(JSON.parse(JSON.stringify(rosterSettings)));
    }
  }, [isOpen]);

  const handleConfirmRosterSettings = async () => {
    const sanitizeRosterForApi = (
      settings: DraftRosterSettings
    ): DraftRosterSettings => {
      return {
        ...settings,
        positions: Object.fromEntries(
          Object.entries(settings.positions).map(([pos, val]) => [
            pos,
            {
              count: val.count ?? 0,
              locked: val.locked ?? false,
            },
          ])
        ),
      };
    };

    try {
      const cleanedRoster = sanitizeRosterForApi(localRosterSettings);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/league-settings/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config: localDraftConfig,
            roster: cleanedRoster,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save roster settings");

      console.log("✅ Roster settings saved");

      setRosterSettings(cleanedRoster);
      toast.success("✅ Roster settings updated!");
      onConfirm(localDraftConfig, cleanedRoster);
      onClose();
    } catch (err) {
      console.error("❌ Error saving roster settings", err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <Dialog.Panel className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6">
        <Dialog.Title className="text-xl font-bold text-white mb-6">
          {activeTab === "adp" ? "League Format Settings" : "Roster Settings"}
        </Dialog.Title>

        <div className="grid grid-cols-[120px_1fr] min-h-[300px]">
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                activeTab === "adp"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("adp")}
            >
              League
            </button>
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                activeTab === "roster"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("roster")}
            >
              Roster
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[500px]">
            {activeTab === "adp" && (
              <AdpSettingsForm
                draftConfig={localDraftConfig}
                setDraftConfig={setLocalDraftConfig}
                isPaidUser={isPaidUser}
                isLoggedIn={isLoggedIn}
                onConfirm={handleConfirmAdpSettings}
              />
            )}

            {activeTab === "roster" && (
              <RosterSettingsForm
                rosterSettings={localRosterSettings}
                setRosterSettings={setLocalRosterSettings}
                draftConfig={localDraftConfig}
                setDraftConfig={setLocalDraftConfig}
                isPaidUser={isPaidUser}
                onConfirm={handleConfirmRosterSettings}
              />
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
