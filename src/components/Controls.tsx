import React from 'react';
import type { TimerStatus } from '../types';

interface ControlsProps {
  status: TimerStatus;
  onTogglePauseResume: () => void;
  onResetTimer: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  onTogglePauseResume,
  onResetTimer,
}) => {
  const isResting = status === 'RESTING';
  const isPaused = status === 'PAUSED';
  const isDone = status === 'DONE';
  const isIdle = status === 'READY';

  const canPauseOrResume = isResting || isPaused;
  const canReset = isResting || isPaused || isDone;

  return (
    <div className="secondary-controls" role="group" aria-label="Timer controls">
      <button
        type="button"
        className={`control-btn pause-resume-btn ${isPaused ? 'btn-resume-active' : ''}`}
        onClick={onTogglePauseResume}
        disabled={!canPauseOrResume}
        aria-label={isPaused ? 'Resume rest timer' : 'Pause rest timer'}
      >
        <span className="control-icon" aria-hidden="true">
          {isPaused ? '▶' : '❚❚'}
        </span>
        <span className="control-text">
          {isPaused ? 'RESUME' : 'PAUSE'}
        </span>
      </button>

      <button
        type="button"
        className="control-btn reset-timer-btn"
        onClick={onResetTimer}
        disabled={!canReset && isIdle}
        aria-label="Reset rest timer"
      >
        <span className="control-icon" aria-hidden="true">
          ↺
        </span>
        <span className="control-text">RESET TIMER</span>
      </button>
    </div>
  );
};
