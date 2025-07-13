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

    // Lock QB to 1
    updated.positions.QB = { ...updated.positions.QB, count: 1, locked: true };

    // Set SF slot based on QB setting
    if (isSuperflex) {
      updated.positions.SF = { ...updated.positions.SF, count: 1, locked: true };
    } else {
      updated.positions.SF = { ...updated.positions.SF, count: 0, locked: true };
    }

    // Auto-update totalRounds
    const totalStartingSpots = Object.values(updated.positions).reduce((sum, slot) => sum + (slot?.count || 0), 0);
    updated.totalRounds = totalStartingSpots + updated.benchCount;

    setRosterSettings(updated);
  }, [rosterSettings.benchCount, draftConfig.qb_setting]);

  const getValidOptions = (field: keyof DraftConfig, current: DraftConfig): string[] => {
    if (field === 'leagueFormat') {
      return Array.from(new Set(ADP_OPTIONS.map((o) => o.leagueFormat)));
    }

    return Array.from(
      new Set(
        ADP_OPTIONS
          .filter((o) => o.leagueFormat === current.leagueFormat)
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
      o =>
        o.leagueFormat === updated.leagueFormat &&
        o.qb_setting === updated.qb_setting &&
        o.scoring === updated.scoring &&
        o.platform === updated.platform
    );

    if (!match) {
      match = ADP_OPTIONS.find(o => o[field] === value);
    }

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
      <Dialog.Panel className="relative w-full max-w-xl bg-slate-900 rounded-lg shadow-xl overflow-hidden">
        <div className="flex border-b border-slate-700">
          <button
            className={`flex-1 px-4 py-2 ${activeTab === 'adp' ? 'bg-slate-800' : 'bg-slate-900'} text-white`}
            onClick={() => setActiveTab('adp')}
          >
            ADP
          </button>
          <button
            className={`flex-1 px-4 py-2 ${activeTab === 'roster' ? 'bg-slate-800' : 'bg-slate-900'} text-white`}
            onClick={() => setActiveTab('roster')}
          >
            Roster
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'adp' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold mb-2">Select ADP Source</h2>

              <fieldset disabled={!isPaidUser} className={!isPaidUser ? 'opacity-40 pointer-events-none' : ''}>
                <div className="space-y-2">
                  <label className="block text-sm">
                    Format
                    <select
                      className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700"
                      value={draftConfig.leagueFormat}
                      onChange={e => handleAdpChange('leagueFormat', e.target.value)}
                    >
                      {validFormats.map(format => (
                        <option key={format} value={format}>{format.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    QB Setting
                    <select
                      className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700"
                      value={draftConfig.qb_setting}
                      onChange={e => handleAdpChange('qb_setting', e.target.value)}
                    >
                      {validQbSettings.map(setting => (
                        <option key={setting} value={setting}>{setting.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    Scoring
                    <select
                      className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700"
                      value={draftConfig.scoring}
                      onChange={e => handleAdpChange('scoring', e.target.value)}
                    >
                      {validScoring.map(scoring => (
                        <option key={scoring} value={scoring}>{scoring.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm">
                    Platform
                    <select
                      className="w-full mt-1 p-2 rounded bg-slate-800 border border-slate-700"
                      value={draftConfig.platform}
                      onChange={e => handleAdpChange('platform', e.target.value)}
                    >
                      {validPlatforms.map(platform => (
                        <option key={platform} value={platform}>{platform.toUpperCase()}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {isPaidUser && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleConfirm}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Confirm
                    </button>
                  </div>
                )}
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
              <h2 className="text-lg font-bold mb-4">Roster Configuration</h2>

              <div className="space-y-4">
                {Object.entries(rosterSettings.positions).map(([position, config]) => (
                  <div key={position} className="flex items-center justify-between">
                    <label className="font-medium">{position}</label>
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
                      className="w-16 px-2 py-1 bg-slate-800 rounded border border-slate-600 disabled:opacity-50"
                    />
                  </div>
                ))}

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Bench Spots</label>
                    <input
                      type="number"
                      min={0}
                      value={rosterSettings.benchCount}
                      onChange={(e) =>
                        setRosterSettings({ ...rosterSettings, benchCount: parseInt(e.target.value) })
                      }
                      className="w-16 px-2 py-1 bg-slate-800 rounded border border-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleConfirm}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
