import { useCallback, useEffect, useRef, useState } from 'react';

export function useCountdown(initialSeconds: number, onExpire?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(initialSeconds);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setSeconds(initialSeconds);
  }, [initialSeconds, stop]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { seconds, start, stop, reset, restart, isActive: seconds > 0 };
}
