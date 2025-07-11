import type { DraftConfig } from './draft';

export type MockNavbarProps = {
  draftStarted: boolean;
  onStartDraft: () => void;
  onOpenSettings: () => void;
};

export type DraftSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  onConfirm: (config: DraftConfig) => void; 
  isPaidUser: boolean;
  isLoggedIn: boolean;
};