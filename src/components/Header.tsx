import React from 'react';

interface HeaderProps {
  setsDone: number;
  onResetSets: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setsDone, onResetSets }) => {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-text">REST TIMER</span>
      </div>

      <div className="sets-counter-container">
        <div className="sets-counter-badge" aria-label={`Sets completed: ${setsDone}`}>
          <span className="sets-label">SETS DONE</span>
          <span className="sets-count">{setsDone}</span>
        </div>

        {setsDone > 0 && (
          <button
            type="button"
            className="reset-sets-btn"
            onClick={onResetSets}
            aria-label="Reset completed sets to zero"
            title="Reset Sets"
          >
            RESET
          </button>
        )}
      </div>
    </header>
  );
};
