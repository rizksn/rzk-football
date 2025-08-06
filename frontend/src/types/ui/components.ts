export type MockNavbarProps = {
  draftStarted: boolean;
  onStartDraft: () => void;
  onOpenSettings: () => void;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isTicking: boolean;
  onOpenKeeperModal: () => void;
  onPause: () => void;
  onResume: () => void;
  showPauseButton: boolean;
  showPlayButton: boolean;
  timerDisabled: boolean;
  setTimerDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};
