import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration = 60, onTimeUp, isRunning = true, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold font-mono ${
          isCritical ? 'text-red-600 dark:text-red-400' :
          isWarning ? 'text-yellow-600 dark:text-yellow-400' :
          'text-gray-600 dark:text-gray-400'
        }`}>
          {timeLeft}s
        </span>
        <div className={`w-2 h-2 rounded-full ${
          isCritical ? 'bg-red-500 animate-pulse' :
          isWarning ? 'bg-yellow-500' :
          'bg-green-500'
        }`} />
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 linear ${
            isCritical ? 'bg-red-500' :
            isWarning ? 'bg-yellow-500' :
            'bg-indigo-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
