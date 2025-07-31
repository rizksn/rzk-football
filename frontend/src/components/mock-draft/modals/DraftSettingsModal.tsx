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
}: DraftSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"adp" | "roster">("adp");
  const isSuperflex = draftConfig.qb_setting === "superflex";

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
    setRosterSettings(updated);
  }, [rosterSettings.benchCount, draftConfig.qb_setting]);

  const handleConfirm = () => {
    if (!isPaidUser) {
      toast.error("🔒 Sign up to unlock all ADP formats and features!");
      return;
    }
    onConfirm(draftConfig, rosterSettings);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <Dialog.Panel className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="grid grid-cols-[120px_1fr] min-h-[420px]">
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white hover:bg-slate-800 transition ${
                activeTab === "adp"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab("adp")}
            >
              ADP
            </button>
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white hover:bg-slate-800 transition ${
                activeTab === "roster"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab("roster")}
            >
              Roster
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {activeTab === "adp" && (
              <AdpSettingsForm
                draftConfig={draftConfig}
                setDraftConfig={setDraftConfig}
                isPaidUser={isPaidUser}
                isLoggedIn={isLoggedIn}
                onConfirm={handleConfirm}
              />
            )}

            {activeTab === "roster" && (
              <RosterSettingsForm
                rosterSettings={rosterSettings}
                setRosterSettings={setRosterSettings}
                isPaidUser={isPaidUser}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
