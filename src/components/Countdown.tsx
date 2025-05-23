import { useEffect, useRef, useState } from "react";
import { Temporal } from "temporal-polyfill";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function Countdown({
  durationMinutes = 1,
  paused,
  onUpdate,
  className = '',
  onFinish,
}: {
  durationMinutes?: number;
  paused: boolean;
  onUpdate?: (data: { minutesLeft: number; endTime: Temporal.Instant }) => void;
  className?: string;
  onFinish?: () => void;
}) {
  const [remainingTime, setRemainingTime] = useState(durationMinutes * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<Temporal.Instant | null>(null);
  const initialRun = useRef(true);

  useEffect(() => {


    if (!paused) {
      endTimeRef.current = Temporal.Now.instant().add({ seconds: remainingTime });


      intervalRef.current = setInterval(() => {
        const now = Temporal.Now.instant();
        const diff = endTimeRef.current!.since(now, { smallestUnit: "second" });
        const secondsLeft = Math.max(0, diff.seconds);

        setRemainingTime(secondsLeft);
        onUpdate?.({
          minutesLeft: Math.ceil(secondsLeft / 60),
          endTime: endTimeRef.current!
        });

        if (secondsLeft === 0) {
          clearInterval(intervalRef.current!);
          onFinish?.();
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);

      if (endTimeRef.current) {
        const now = Temporal.Now.instant();
        const diff = endTimeRef.current.since(now, { smallestUnit: "second" });
        const secondsLeft = Math.max(0, diff.seconds);
        setRemainingTime(secondsLeft);

        onUpdate?.({
          minutesLeft: Math.ceil(secondsLeft / 60),
          endTime: Temporal.Now.instant().add({ seconds: secondsLeft })
        });
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  return <p className={className}>{formatTime(remainingTime)}</p>;
}
