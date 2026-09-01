import React, { useState, useRef, useEffect } from 'react';

interface CustomTimerProps {
  onStartCustom: (seconds: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
}

const QUICK_OPTIONS = [45, 75, 150, 240];

export const CustomTimer: React.FC<CustomTimerProps> = ({
  onStartCustom,
  isOpen,
  onToggleOpen,
  onClose,
}) => {
  const [customSeconds, setCustomSeconds] = useState<number>(45);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleAdjust = (delta: number) => {
    setCustomSeconds((prev) => Math.max(5, Math.min(3600, prev + delta)));
  };

  const handleSelectQuick = (seconds: number) => {
    setCustomSeconds(seconds);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customSeconds > 0) {
      onStartCustom(customSeconds);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) {
    return (
      <div className="custom-timer-trigger-wrapper">
        <button
          type="button"
          className="custom-trigger-button"
          onClick={onToggleOpen}
          aria-expanded={false}
          aria-controls="custom-duration-panel"
        >
          <span className="custom-trigger-icon">+</span>
          <span className="custom-trigger-text">CUSTOM DURATION</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="custom-duration-panel"
      className="custom-panel"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Custom rest timer configuration"
    >
      <div className="custom-panel-header">
        <span className="custom-panel-title">CUSTOM DURATION</span>
        <button
          type="button"
          className="custom-panel-close-btn"
          onClick={onClose}
          aria-label="Close custom timer panel"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="custom-form">
        <div className="custom-input-row">
          <button
            type="button"
            className="stepper-btn"
            onClick={() => handleAdjust(-15)}
            aria-label="Decrease by 15 seconds"
          >
            -15s
          </button>

          <div className="input-group">
            <input
              ref={inputRef}
              type="number"
              min={1}
              max={3600}
              step={1}
              value={customSeconds || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCustomSeconds(isNaN(val) ? 0 : Math.max(1, Math.min(3600, val)));
              }}
              className="custom-number-input"
              aria-label="Custom duration in seconds"
            />
            <span className="input-suffix">SEC</span>
          </div>

          <button
            type="button"
            className="stepper-btn"
            onClick={() => handleAdjust(15)}
            aria-label="Increase by 15 seconds"
          >
            +15s
          </button>
        </div>

        {/* Quick chip presets */}
        <div className="quick-chips-row" role="group" aria-label="Quick custom duration choices">
          {QUICK_OPTIONS.map((sec) => (
            <button
              key={sec}
              type="button"
              className={`quick-chip ${customSeconds === sec ? 'quick-chip-active' : ''}`}
              onClick={() => handleSelectQuick(sec)}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div className="custom-actions-row">
          <button
            type="button"
            className="custom-cancel-btn"
            onClick={onClose}
          >
            CANCEL
          </button>

          <button
            type="submit"
            className="custom-start-btn"
            disabled={!customSeconds || customSeconds <= 0}
          >
            START {customSeconds > 0 ? `${customSeconds}s` : ''} REST
          </button>
        </div>
      </form>
    </div>
  );
};
