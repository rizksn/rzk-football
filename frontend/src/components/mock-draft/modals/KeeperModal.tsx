"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/config";
import type { DraftConfig } from "@/types/draft/config";
import type { DraftPick } from "@/components/mock-draft/MockDraft";
import type { User } from "firebase/auth";

type KeeperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  draftPlan: DraftPick[];
  draftConfig: DraftConfig;
  numTeams: number;
  user: User | null;
};

export default function KeeperModal({
  isOpen,
  onClose,
  draftPlan,
  draftConfig,
  numTeams,
  user,
}: KeeperModalProps) {
  const [keeperName, setKeeperName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveKeepers = async () => {
    if (!user || !keeperName.trim()) return;
    setSaving(true);

    try {
      const token = await user.getIdToken();

      const payload = {
        user_id: user.uid,
        name: keeperName.trim(),
        format_key: draftConfig.adpFormatKey,
        num_teams: numTeams,
        draft_plan: draftPlan,
      };

      const res = await fetch(`${API_BASE_URL}/api/keepers/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");

      toast.success("✅ Keepers saved!");
      onClose();
    } catch (err) {
      toast.error("❌ Failed to save keepers");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Panel */}
      <Dialog.Panel className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6">
        <Dialog.Title className="text-xl font-bold text-white mb-6">
          Save Keepers
        </Dialog.Title>

        <div className="grid grid-cols-[120px_1fr] min-h-[300px]">
          {/* Left nav (you can add load or export tabs later) */}
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className="px-4 py-3 text-left text-sm font-semibold text-white bg-slate-800 border-l-4 border-blue-500"
              disabled
            >
              Save
            </button>
          </div>

          {/* Right content */}
          <div className="p-6">
            <label className="text-sm text-gray-300 block mb-1">
              Keeper Set Name
            </label>
            <input
              type="text"
              placeholder="e.g. Home League"
              value={keeperName}
              onChange={(e) => setKeeperName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md mb-6"
            />

            <button
              onClick={handleSaveKeepers}
              disabled={saving || !keeperName.trim()}
              className={`w-full bg-accent text-white font-semibold py-2 rounded-lg hover:opacity-90 transition ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saving ? "Saving..." : "Save Keepers"}
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
