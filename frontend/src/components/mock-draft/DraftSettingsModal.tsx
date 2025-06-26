'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import ADP_OPTIONS from '@/data/valid_adp_combinations.json';

interface DraftConfig {
  adpFormatKey: string;
  leagueFormat: string;
  qb_setting: string;
  scoring: string;
  platform: string;
  useAI: boolean;
}

interface DraftSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  onConfirm: (config: DraftConfig) => void; 
  isPaidUser: boolean;
  isLoggedIn: boolean;
}

function buildAdpFormatKey(config: DraftConfig) {
  return `${config.leagueFormat}_${config.qb_setting}_${config.scoring}_${config.platform}`;
}

export default function DraftSettingsModal({
  isOpen,
  onClose,
  draftConfig,
  setDraftConfig,
  onConfirm,
  isPaidUser,
}: DraftSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'adp' | 'roster'>('adp');

  const handleAdpChange = (field: keyof DraftConfig, value: string) => {
    const newDraftConfig = {
      ...draftConfig,
      [field]: value,
    };

    const adpFormatKey = buildAdpFormatKey(newDraftConfig);

    const isValid = ADP_OPTIONS.some(
      o =>
        o.format === newDraftConfig.leagueFormat &&
        o.qb_setting === newDraftConfig.qb_setting &&
        o.scoring === newDraftConfig.scoring &&
        o.platform === newDraftConfig.platform
    );

    if (isValid) {
      setDraftConfig({
        ...newDraftConfig,
        adpFormatKey,
      });
    } else {
      console.warn('⚠️ No matching ADP format key found');
    }
  };


  const handleConfirm = () => {
    onConfirm(draftConfig);  
    onClose();               
  };

  const validFormats = Array.from(new Set(ADP_OPTIONS.map(o => o.format)));
  const validQbSettings = Array.from(
    new Set(
      ADP_OPTIONS
        .filter(o => o.format === draftConfig.leagueFormat)
        .map(o => o.qb_setting)
    )
  );
  const validScoring = Array.from(
    new Set(
      ADP_OPTIONS
        .filter(o =>
          o.format === draftConfig.leagueFormat &&
          o.qb_setting === draftConfig.qb_setting
        )
        .map(o => o.scoring)
    )
  );
  const validPlatforms = Array.from(
    new Set(
      ADP_OPTIONS
        .filter(o =>
          o.format === draftConfig.leagueFormat &&
          o.qb_setting === draftConfig.qb_setting &&
          o.scoring === draftConfig.scoring
        )
        .map(o => o.platform)
    )
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-slate-900 text-white max-w-4xl w-full rounded-xl shadow-xl flex">
          {/* Tabs */}
          <div className="w-48 border-r border-white/10 flex flex-col">
            <button
              onClick={() => setActiveTab('adp')}
              title="Adjust ADP format"
              className={`py-3 px-4 text-left ${activeTab === 'adp' ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
            >
              ADP Format
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              title="Adjust roster settings"
              className={`py-3 px-4 text-left ${activeTab === 'roster' ? 'bg-slate-800' : 'hover:bg-slate-800/50'}`}
            >
              Roster Settings
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'adp' && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold mb-2">Select ADP Source</h2>

                <fieldset disabled={!isPaidUser} className={!isPaidUser ? 'opacity-40 pointer-events-none' : ''}>
                  <div className="space-y-2">
                    {/* Dropdowns */}
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

                  {/* ✅ Confirm Button */}
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
                <h2 className="text-lg font-bold mb-2">Roster Settings</h2>
                <p className="text-sm text-white/60">Coming soon.</p>
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}