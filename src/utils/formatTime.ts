/**
 * Formats a duration in seconds into MM:SS format with leading zeros.
 * Example: 90 -> "01:30", 0 -> "00:00"
 */
export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${mm}:${ss}`;
}
