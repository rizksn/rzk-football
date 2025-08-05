"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/config";
import type { DraftConfig } from "@/types/draft/config";
import type { DraftPick } from "@/components/mock-draft/MockDraft";
import type { User } from "firebase/auth";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

type KeeperSetMeta = {
  id: string;
  name: string;
  format_key: string;
  num_teams: number;
  created_at: string;
};

type KeeperModalProps = {
  isOpen: boolean;
  onClose: () => void;
  draftPlan: DraftPick[];
  draftConfig: DraftConfig;
  numTeams: number;
  user: User | null;
  isPaidUser: boolean;
  onLoadKeeperSet: (params: {
    draftPlan: DraftPick[];
    adpFormatKey: string;
    keeperSetId: string;
    onSaveKeeperSet?: (keeperSetId: string) => void;
  }) => void;
  onSaveKeeperSet?: (keeperSetId: string) => void;
};

export default function KeeperModal({
  isOpen,
  onClose,
  draftPlan,
  draftConfig,
  numTeams,
  user,
  isPaidUser,
  onLoadKeeperSet,
  onSaveKeeperSet,
}: KeeperModalProps) {
  const [tab, setTab] = useState<"save" | "load">("save");
  const [keeperName, setKeeperName] = useState("");
  const [saving, setSaving] = useState(false);

  const [loading, setLoading] = useState(false);
  const [keeperSets, setKeeperSets] = useState<KeeperSetMeta[]>([]);
  const [selectedKeeperId, setSelectedKeeperId] = useState<string | null>(null);

  const notifyPremiumRequired = () => {
    toast.error("🔒 Premium required to use this feature. Please upgrade.");
  };

  const fetchKeeperSets = async () => {
    if (!user) {
      console.warn("No user – cannot fetch keeper sets.");
      return;
    }

    try {
      setLoading(true);

      const token = await user.getIdToken();
      const url = `${API_BASE_URL}/api/keepers/load`;

      const res = await fetchWithAuth(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch keepers");

      setKeeperSets(data.keeper_sets || []);
    } catch (err) {
      toast.error("❌ Failed to load keeper sets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeepers = async () => {
    if (!user || !keeperName.trim()) return;
    if (!isPaidUser) {
      notifyPremiumRequired();
      return;
    }

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

      const res = await fetchWithAuth(`${API_BASE_URL}/api/keepers/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");

      toast.success("✅ Keepers saved!");
      if (onSaveKeeperSet) {
        onSaveKeeperSet(data.id);
        onSaveKeeperSet(data.id);
      }
      onClose();
    } catch (err) {
      toast.error("❌ Failed to save keepers");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSelectedKeeper = async () => {
    if (!selectedKeeperId || !user) return;
    if (!isPaidUser) {
      notifyPremiumRequired();
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/keepers/${selectedKeeperId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch keeper");

      onLoadKeeperSet({
        draftPlan: data.draft_plan,
        adpFormatKey: data.format_key,
        keeperSetId: data.id,
      });

      toast.success(`✅ Loaded keeper set: ${data.name}`);
      onClose();
    } catch (err) {
      toast.error("❌ Failed to load keeper set");
      console.error(err);
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
          {tab === "save" ? "Save Keepers" : "Load Keepers"}
        </Dialog.Title>

        <div className="grid grid-cols-[120px_1fr] min-h-[300px]">
          {/* Left nav */}
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                tab === "save"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setTab("save")}
            >
              Save
            </button>
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                tab === "load"
                  ? "bg-slate-800 border-l-4 border-blue-500"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => {
                setTab("load");
                if (!isPaidUser) {
                  notifyPremiumRequired();
                  return;
                }
                if (user) fetchKeeperSets();
              }}
            >
              Load
            </button>
          </div>

          {/* Right content */}
          <div className="p-6 overflow-y-auto max-h-[500px]">
            {tab === "save" ? (
              <>
                <label className="text-sm text-gray-300 block mb-1">
                  Keeper Set Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home League"
                  value={keeperName}
                  onChange={(e) => setKeeperName(e.target.value)}
                  onFocus={() => {
                    if (!isPaidUser) {
                      notifyPremiumRequired();
                      (document.activeElement as HTMLElement)?.blur();
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-700 rounded-md mb-6"
                />

                <button
                  onClick={() => {
                    if (!isPaidUser) {
                      notifyPremiumRequired();
                      return;
                    }
                    handleSaveKeepers();
                  }}
                  disabled={saving || !keeperName.trim()}
                  className={`w-full bg-accent text-white font-semibold py-2 rounded-lg hover:opacity-90 transition ${
                    saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? "Saving..." : "Save Keepers"}
                </button>
              </>
            ) : (
              <>
                {loading ? (
                  <p className="text-gray-400">Loading keeper sets...</p>
                ) : keeperSets.length === 0 ? (
                  !isPaidUser ? (
                    <p className="text-red-400 font-semibold">
                      Upgrade to save and load keeper sets.{" "}
                      <a
                        href="/subscribe"
                        className="no-underline text-blue-400 hover:text-blue-600"
                      >
                        Upgrade now &rarr;
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-400">No saved keeper sets found.</p>
                  )
                ) : (
                  <ul className="space-y-3">
                    {keeperSets.map((keeper) => (
                      <li
                        key={keeper.id}
                        onClick={() => setSelectedKeeperId(keeper.id)}
                        className={`p-3 border rounded-md cursor-pointer ${
                          keeper.id === selectedKeeperId
                            ? "border-accent bg-slate-800"
                            : "border-slate-600 hover:bg-slate-800"
                        }`}
                      >
                        <div className="text-white font-semibold">
                          {keeper.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {keeper.format_key} • {keeper.num_teams} teams
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => {
                    if (!isPaidUser) {
                      notifyPremiumRequired();
                      return;
                    }
                    handleLoadSelectedKeeper();
                  }}
                  disabled={!selectedKeeperId}
                  className="mt-6 w-full bg-accent text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                >
                  Load Keeper Set
                </button>
              </>
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
