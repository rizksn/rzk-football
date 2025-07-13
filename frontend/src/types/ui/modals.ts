import type { DraftConfig } from '../draft/config';

export type DraftSettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  onConfirm: (config: DraftConfig) => void; 
  isPaidUser: boolean;
  isLoggedIn: boolean;
};