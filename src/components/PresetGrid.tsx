import React from 'react';
import type { PresetOption, TimerStatus } from '../types';

interface PresetGridProps {
  onSelectPreset: (seconds: number) => void;
  activePresetSeconds: number | null;
  status: TimerStatus;
}

const PRESETS: PresetOption[] = [
  { id: 'preset-60', seconds: 60, label: '60 SEC' },
  { id: 'preset-90', seconds: 90, label: '90 SEC' },
  { id: 'preset-120', seconds: 120, label: '120 SEC' },
  { id: 'preset-180', seconds: 180, label: '180 SEC' },
];

export const PresetGrid: React.FC<PresetGridProps> = ({
  onSelectPreset,
  activePresetSeconds,
  status,
}) => {
  const isRunningOrPaused = status === 'RESTING' || status === 'PAUSED';

  return (
    <div className="presets-container">
      <div className="preset-grid" role="group" aria-label="Rest duration presets">
        {PRESETS.map((preset) => {
          const isActive = isRunningOrPaused && activePresetSeconds === preset.seconds;

          return (
            <button
              key={preset.id}
              type="button"
              className={`preset-button ${isActive ? 'preset-active' : ''}`}
              onClick={() => onSelectPreset(preset.seconds)}
              aria-pressed={isActive}
              aria-label={`Start ${preset.label} rest timer`}
            >
              <span className="preset-num">{preset.seconds}</span>
              <span className="preset-unit">SEC</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
