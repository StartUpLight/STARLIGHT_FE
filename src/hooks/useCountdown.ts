import { useState, useEffect } from 'react';

const calculateTimeLeft = (targetDate: string) => {
  if (typeof window === 'undefined') {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff > 0) {
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
};

export const useCountdown = (targetDate: string) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(targetDate));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};
