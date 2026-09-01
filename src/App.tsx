import { useState, useEffect } from "react";
import { useRestTimer } from "./hooks/useRestTimer";
import { Header } from "./components/Header";
import { TimerDisplay } from "./components/TimerDisplay";
import { PresetGrid } from "./components/PresetGrid";
import { CustomTimer } from "./components/CustomTimer";
import { Controls } from "./components/Controls";
import "./App.css";

export default function App() {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const {
    status,
    totalDuration,
    remainingSeconds,
    progress,
    setsDone,
    activePresetSeconds,
    startTimer,
    togglePauseResume,
    resetTimer,
    resetSets,
  } = useRestTimer({
    initialDuration: 90,
    completionDurationMs: 2500,
  });

  // Handle keyboard shortcuts on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePauseResume();
          break;
        case "1":
          startTimer(60);
          break;
        case "2":
          startTimer(90);
          break;
        case "3":
          startTimer(120);
          break;
        case "4":
          startTimer(180);
          break;
        case "r":
        case "R":
          resetTimer();
          break;
        case "c":
        case "C":
          setIsCustomOpen((prev) => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePauseResume, startTimer, resetTimer]);

  const handleSelectPreset = (seconds: number) => {
    startTimer(seconds);
    setIsCustomOpen(false);
  };

  const handleStartCustom = (seconds: number) => {
    startTimer(seconds);
  };

  return (
    <div className={`app-root status-${status.toLowerCase()}`}>
      <div className="app-shell">
        {/* Top Header Bar */}
        <Header setsDone={setsDone} onResetSets={resetSets} />

        {/* Responsive Content Grid */}
        <main className="app-main-layout">
          {/* Left Column (Desktop) / Central Hero (Mobile) */}
          <section className="timer-column" aria-label="Timer Display Section">
            <TimerDisplay
              status={status}
              remainingSeconds={remainingSeconds}
              totalDuration={totalDuration}
              progress={progress}
            />

            {/* Desktop Set Counter Display in Left Column */}
            <div className="desktop-sets-summary" aria-hidden="true">
              <span className="summary-label">SETS COMPLETED</span>
              <span className="summary-value">{setsDone}</span>
            </div>
          </section>

          {/* Right Column (Desktop) / Action Deck (Mobile) */}
          <section
            className="controls-column"
            aria-label="Timer Controls and Presets"
          >
            {/* 2x2 Preset Buttons Grid */}
            <PresetGrid
              onSelectPreset={handleSelectPreset}
              activePresetSeconds={activePresetSeconds}
              status={status}
            />

            {/* Custom Timer Input Deck */}
            <CustomTimer
              isOpen={isCustomOpen}
              onToggleOpen={() => setIsCustomOpen((prev) => !prev)}
              onClose={() => setIsCustomOpen(false)}
              onStartCustom={handleStartCustom}
            />

            {/* Secondary Controls (Pause/Resume, Reset Timer) */}
            <Controls
              status={status}
              onTogglePauseResume={togglePauseResume}
              onResetTimer={resetTimer}
            />
          </section>
        </main>

        {/* Footer / Subtle Precision Status */}
        <footer className="app-footer">
          <span className="footer-system-mark">REST TIMER</span>
        </footer>
      </div>
    </div>
  );
}
