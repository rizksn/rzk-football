import type {
  DraftSetupLeagueState,
  DraftSetupMetadataState,
  DraftSetupRosterState,
  DraftSetupState,
} from "../../setup/setup.types";

export interface DraftSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  setup: DraftSetupState;
  updateMetadata: (patch: Partial<DraftSetupMetadataState>) => void;
  updateLeague: (patch: Partial<DraftSetupLeagueState>) => void;
  updateRoster: (patch: Partial<DraftSetupRosterState>) => void;
  isPaidUser: boolean;
  isLoggedIn: boolean;
}

export type ActiveTab = "league" | "roster" | "metadata";
