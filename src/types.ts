export type TimerStatus = 'READY' | 'RESTING' | 'PAUSED' | 'DONE';

export interface PresetOption {
  id: string;
  seconds: number;
  label: string;
}

export interface RestTimerState {
  status: TimerStatus;
  totalDuration: number;
  remainingSeconds: number;
  progress: number; // 0 (start) to 1 (done)
  setsDone: number;
  activePresetSeconds: number | null;
}
