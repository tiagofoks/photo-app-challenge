import { useState, useRef, useEffect, useCallback } from "react";

interface UseCaptureCountdownOptions {
  onCountdownComplete: () => void;
  initialCount?: number;
}

interface UseCaptureCountdownReturn {
  countdown: number | null;
  startCountdown: () => void;
  isCounting: boolean;
}

const useCaptureCountdown = ({
  onCountdownComplete,
  initialCount = 3,
}: UseCaptureCountdownOptions): UseCaptureCountdownReturn => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    if (isCounting) return;

    setIsCounting(true);
    setCountdown(initialCount);

    let currentCount = initialCount;
    timerRef.current = setInterval(() => {
      currentCount--;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setCountdown(null);
        setIsCounting(false);
        onCountdownComplete();
      }
    }, 1000);
  }, [initialCount, isCounting, onCountdownComplete]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { countdown, startCountdown, isCounting };
};

export default useCaptureCountdown;
