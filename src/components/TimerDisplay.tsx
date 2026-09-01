import React from 'react';
import type { TimerStatus } from '../types';
import { formatTime } from '../utils/formatTime';

interface TimerDisplayProps {
  status: TimerStatus;
  remainingSeconds: number;
  totalDuration: number;
  progress: number;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  status,
  remainingSeconds,
  progress,
}) => {
  const formattedTime = formatTime(remainingSeconds);
  const isDone = status === 'DONE';
  const isResting = status === 'RESTING';
  const isPaused = status === 'PAUSED';

  return (
    <section
      className={`timer-display-card ${isDone ? 'timer-status-done' : ''} ${
        isResting ? 'timer-status-resting' : ''
      } ${isPaused ? 'timer-status-paused' : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Subtle industrial edge indicators */}
      <div className="corner-mark top-left" aria-hidden="true" />
      <div className="corner-mark top-right" aria-hidden="true" />
      <div className="corner-mark bottom-left" aria-hidden="true" />
      <div className="corner-mark bottom-right" aria-hidden="true" />

      {/* Main Digital Time Readout */}
      <div className="digits-wrapper">
        <time className="time-digits" dateTime={`PT${remainingSeconds}S`}>
          {formattedTime}
        </time>
      </div>

      {/* Industrial Status Indicator */}
      <div className="status-badge" data-status={status}>
        <span className="status-dot" aria-hidden="true" />
        <span className="status-label">{status}</span>
      </div>

      {/* Minimal hairline progress indicator */}
      <div className="progress-bar-track" aria-hidden="true">
        <div
          className="progress-bar-fill"
          style={{
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          }}
        />
      </div>
    </section>
  );
};
