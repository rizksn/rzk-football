'use client';

import { Dialog } from '@headlessui/react';
import { useState, useEffect } from 'react';
import { buildAdpFormatKey } from '@/utils/adp';
import type { DraftConfig } from '@/types/draft/config';
import { DraftRosterSettings } from '@/types/draft/config';
import ADP_OPTIONS from '@/data/valid_adp_combinations.json';

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
  const [activeTab, setActiveTab] = useState<'adp' | 'roster'>('adp');
  const isSuperflex = draftConfig.qb_setting === 'superflex';

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

  const getValidOptions = (field: keyof DraftConfig, current: DraftConfig): string[] => {
    if (field === 'leagueFormat') {
      return Array.from(new Set(ADP_OPTIONS.map((o) => o.leagueFormat)));
    }
    return Array.from(
      new Set(
        ADP_OPTIONS.filter((o) => o.leagueFormat === current.leagueFormat)
          .map((o) => o[field as keyof typeof o])
      )
    );
  };

  const handleAdpChange = (
    field: 'leagueFormat' | 'qb_setting' | 'scoring' | 'platform',
    value: string
  ) => {
    const updated = { ...draftConfig, [field]: value };
    let match = ADP_OPTIONS.find(
      o => o.leagueFormat === updated.leagueFormat &&
        o.qb_setting === updated.qb_setting &&
        o.scoring === updated.scoring &&
        o.platform === updated.platform
    );
    if (!match) match = ADP_OPTIONS.find(o => o[field] === value);
    if (match) {
      setDraftConfig({
        ...match,
        adpFormatKey: buildAdpFormatKey(match),
        useAI: draftConfig.useAI,
      });
    }
  };

  const handleConfirm = () => {
    onConfirm(draftConfig, rosterSettings);
    onClose();
  };

  const validFormats = getValidOptions('leagueFormat', draftConfig);
  const validQbSettings = getValidOptions('qb_setting', draftConfig);
  const validScoring = getValidOptions('scoring', draftConfig);
  const validPlatforms = getValidOptions('platform', draftConfig);

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <Dialog.Panel className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        <div className="grid grid-cols-[120px_1fr] min-h-[420px]">

          {/* Sidebar Tabs */}
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white hover:bg-slate-800 transition ${activeTab === 'adp' ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}
              onClick={() => setActiveTab('adp')}
            >
              ADP
            </button>
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white hover:bg-slate-800 transition ${activeTab === 'roster' ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}
              onClick={() => setActiveTab('roster')}
            >
              Roster
            </button>
          </div>

          {/* Content Panel */}
          <div className="p-6 overflow-y-auto">
            {activeTab === 'adp' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4 text-white">Select ADP Source</h2>

                <fieldset disabled={!isPaidUser} className={!isPaidUser ? 'opacity-40 pointer-events-none' : ''}>
                  <div className="space-y-4">
                    {[{
                      label: 'Format', value: draftConfig.leagueFormat, options: validFormats, field: 'leagueFormat'
                    }, {
                      label: 'QB Setting', value: draftConfig.qb_setting, options: validQbSettings, field: 'qb_setting'
                    }, {
                      label: 'Scoring', value: draftConfig.scoring, options: validScoring, field: 'scoring'
                    }, {
                      label: 'Platform', value: draftConfig.platform, options: validPlatforms, field: 'platform'
                    }].map(({ label, value, options, field }) => (
                      <label className="block text-sm text-white" key={field}>
                        {label}
                        <select
                          className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={value}
                          onChange={(e) => handleAdpChange(field as any, e.target.value)}
                        >
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleConfirm}
                      className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition"
                    >
                      Confirm
                    </button>
                  </div>
                </fieldset>

                {!isPaidUser && (
                  <div className="text-sm text-white/60 mt-4">
                    Subscribe to unlock draft settings.{' '}
                    <button onClick={() => window.location.href = '/subscribe'} className="text-blue-400 underline">
                      Upgrade now →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'roster' && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-white">Roster Configuration</h2>
                <div className="space-y-4">
                  {Object.entries(rosterSettings.positions).map(([position, config]) => (
                    <div key={position} className="flex items-center justify-between">
                      <label className="font-medium text-white">{position}</label>
                      <input
                        type="number"
                        min={0}
                        value={config.count}
                        disabled={config.locked}
                        onChange={(e) => {
                          const count = parseInt(e.target.value);
                          const updated = {
                            ...rosterSettings,
                            positions: {
                              ...rosterSettings.positions,
                              [position]: { ...config, count },
                            },
                          };
                          setRosterSettings(updated);
                        }}
                        className="w-16 px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 disabled:opacity-50"
                      />
                    </div>
                  ))}

                  <div className="pt-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-medium text-white">Bench Spots</label>
                      <input
                        type="number"
                        min={0}
                        value={rosterSettings.benchCount}
                        onChange={(e) => setRosterSettings({
                          ...rosterSettings,
                          benchCount: parseInt(e.target.value)
                        })}
                        className="w-16 px-2 py-1 bg-slate-800 text-white rounded border border-slate-600"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleConfirm}
                      className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
