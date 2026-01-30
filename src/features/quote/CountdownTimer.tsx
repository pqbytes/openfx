interface CountdownTimerProps {
  seconds: number;
}

export function CountdownTimer({ seconds }: CountdownTimerProps) {
  // Visual urgency: red if < 10s
  const isUrgent = seconds < 10;
  
  return (
    <div className={`timer ${isUrgent ? 'timer-urgent' : ''}`} role="timer" aria-live="polite">
      Rate expires in: <strong>{seconds}s</strong>
    </div>
  );
}
