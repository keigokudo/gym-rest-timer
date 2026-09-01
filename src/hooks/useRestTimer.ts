import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerStatus } from '../types';

interface UseRestTimerOptions {
  initialDuration?: number; // default 90 seconds
  completionDurationMs?: number; // 2500ms
}

export function useRestTimer({
  initialDuration = 90,
  completionDurationMs = 2500,
}: UseRestTimerOptions = {}) {
  const [status, setStatus] = useState<TimerStatus>('READY');
  const [totalDuration, setTotalDuration] = useState<number>(initialDuration);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialDuration);
  const [setsDone, setSetsDone] = useState<number>(0);
  const [activePresetSeconds, setActivePresetSeconds] = useState<number | null>(null);

  // References for drift-free timestamp tracking
  const targetEndTimeRef = useRef<number | null>(null);
  const pausedRemainingMsRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Safe haptic feedback (silent, tactile only)
  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic errors on unsupported environments
      }
    }
  }, []);

  // Screen Wake Lock to prevent phone screen from sleeping during rest
  const requestWakeLock = useCallback(async () => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (!wakeLockRef.current) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {
        // WakeLock may fail if battery saver is on or permission denied
      }
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch {
        // Ignore wake lock release error
      }
    }
  }, []);

  // Clear any existing completion timer
  const clearCompletionTimer = useCallback(() => {
    if (completionTimeoutRef.current !== null) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  // Start a new timer for a given duration in seconds
  const startTimer = useCallback(
    (seconds: number, presetIdSeconds?: number) => {
      clearCompletionTimer();
      const validSeconds = Math.max(1, Math.round(seconds));

      setTotalDuration(validSeconds);
      setRemainingSeconds(validSeconds);
      setStatus('RESTING');
      setActivePresetSeconds(presetIdSeconds ?? (validSeconds === 60 || validSeconds === 90 || validSeconds === 120 || validSeconds === 180 ? validSeconds : null));

      // Increment sets done on every new rest timer start
      setSetsDone((prev) => prev + 1);

      // Set target end timestamp (current time + duration in ms)
      targetEndTimeRef.current = Date.now() + validSeconds * 1000;
      pausedRemainingMsRef.current = null;

      // Haptic bump on start
      triggerHaptic(25);

      // Keep screen awake while resting
      requestWakeLock();
    },
    [clearCompletionTimer, triggerHaptic, requestWakeLock]
  );

  // Pause the running timer
  const pauseTimer = useCallback(() => {
    if (status !== 'RESTING' || !targetEndTimeRef.current) return;

    const remainingMs = Math.max(0, targetEndTimeRef.current - Date.now());
    pausedRemainingMsRef.current = remainingMs;
    targetEndTimeRef.current = null;
    setRemainingSeconds(Math.ceil(remainingMs / 1000));
    setStatus('PAUSED');

    triggerHaptic(20);
    releaseWakeLock();
  }, [status, triggerHaptic, releaseWakeLock]);

  // Resume the paused timer
  const resumeTimer = useCallback(() => {
    if (status !== 'PAUSED') return;

    const remainingMs = pausedRemainingMsRef.current ?? remainingSeconds * 1000;
    if (remainingMs <= 0) return;

    targetEndTimeRef.current = Date.now() + remainingMs;
    pausedRemainingMsRef.current = null;
    setStatus('RESTING');

    triggerHaptic(20);
    requestWakeLock();
  }, [status, remainingSeconds, triggerHaptic, requestWakeLock]);

  // Toggle Pause / Resume
  const togglePauseResume = useCallback(() => {
    if (status === 'RESTING') {
      pauseTimer();
    } else if (status === 'PAUSED') {
      resumeTimer();
    }
  }, [status, pauseTimer, resumeTimer]);

  // Reset the timer back to ready
  const resetTimer = useCallback(() => {
    clearCompletionTimer();
    targetEndTimeRef.current = null;
    pausedRemainingMsRef.current = null;
    setStatus('READY');
    setRemainingSeconds(totalDuration);
    triggerHaptic(15);
    releaseWakeLock();
  }, [clearCompletionTimer, totalDuration, triggerHaptic, releaseWakeLock]);

  // Reset set counter
  const resetSets = useCallback(() => {
    setSetsDone(0);
    triggerHaptic(15);
  }, [triggerHaptic]);

  // Handle countdown loop and completion
  useEffect(() => {
    if (status !== 'RESTING') return;

    const updateTimer = () => {
      if (!targetEndTimeRef.current) return;

      const now = Date.now();
      const diffMs = targetEndTimeRef.current - now;

      if (diffMs <= 0) {
        // Timer reached zero!
        targetEndTimeRef.current = null;
        pausedRemainingMsRef.current = null;
        setRemainingSeconds(0);
        setStatus('DONE');
        releaseWakeLock();

        // Subtle tactile feedback on completion (no audio)
        triggerHaptic([70, 60, 100]);

        // Auto transition back to READY after completionDurationMs (approx 2.5s)
        completionTimeoutRef.current = window.setTimeout(() => {
          setStatus('READY');
          setRemainingSeconds(totalDuration);
          completionTimeoutRef.current = null;
        }, completionDurationMs);
      } else {
        const ceilSeconds = Math.ceil(diffMs / 1000);
        setRemainingSeconds(ceilSeconds);
      }
    };

    // Run initial update immediately
    updateTimer();

    // High frequency interval (100ms) to ensure instant, accurate UI tick without drift
    const intervalId = window.setInterval(updateTimer, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status, totalDuration, completionDurationMs, triggerHaptic, releaseWakeLock]);

  // Handle document visibility change (if user leaves browser / switches apps and returns)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'RESTING' && targetEndTimeRef.current) {
        const now = Date.now();
        const diffMs = targetEndTimeRef.current - now;
        if (diffMs <= 0) {
          setRemainingSeconds(0);
          setStatus('DONE');
          releaseWakeLock();
          triggerHaptic([70, 60, 100]);

          clearCompletionTimer();
          completionTimeoutRef.current = window.setTimeout(() => {
            setStatus('READY');
            setRemainingSeconds(totalDuration);
            completionTimeoutRef.current = null;
          }, completionDurationMs);
        } else {
          setRemainingSeconds(Math.ceil(diffMs / 1000));
          requestWakeLock();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, totalDuration, completionDurationMs, clearCompletionTimer, triggerHaptic, releaseWakeLock, requestWakeLock]);

  // Clean up wake lock and timeouts on unmount
  useEffect(() => {
    return () => {
      clearCompletionTimer();
      releaseWakeLock();
    };
  }, [clearCompletionTimer, releaseWakeLock]);

  // Calculate progress (0 = fresh start, 1 = completed)
  const progress =
    totalDuration > 0
      ? status === 'DONE'
        ? 1
        : status === 'READY'
        ? 0
        : Math.min(1, Math.max(0, (totalDuration - remainingSeconds) / totalDuration))
      : 0;

  return {
    status,
    totalDuration,
    remainingSeconds,
    progress,
    setsDone,
    activePresetSeconds,
    startTimer,
    pauseTimer,
    resumeTimer,
    togglePauseResume,
    resetTimer,
    resetSets,
  };
}
