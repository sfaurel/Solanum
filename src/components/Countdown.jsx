import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function TimerComponent({ durationMinutes = 1, paused, onUpdate, className = '' }) {
  const [remainingTime, setRemainingTime] = useState(durationMinutes * 60);
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);
  const initialRun = useRef(true);

  useEffect(() => {
    if (initialRun.current && !paused) {
      endTimeRef.current = Date.now() + remainingTime * 1000;
      initialRun.current = false;
    }

    if (!paused) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + remainingTime * 1000;
      }

      intervalRef.current = setInterval(() => {
        const diff = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
        setRemainingTime(diff);
        onUpdate && onUpdate({
          minutesLeft: Math.ceil(diff / 60),
          endTime: new Date(endTimeRef.current)
        });

        if (diff === 0) {
          clearInterval(intervalRef.current);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (endTimeRef.current) {
        const diff = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
        setRemainingTime(diff);
        onUpdate && onUpdate({
          minutesLeft: Math.ceil(diff / 60),
          endTime: new Date(Date.now() + diff * 1000)
        });
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [paused]);

  return (
    <p className={className}>{formatTime(remainingTime)}</p>
  );
}
