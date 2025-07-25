export type MockNavbarProps = {
  draftStarted: boolean;
  onStartDraft: () => void;
  onOpenSettings: () => void;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isTicking: boolean;
  setIsTicking: React.Dispatch<React.SetStateAction<boolean>>;
};
