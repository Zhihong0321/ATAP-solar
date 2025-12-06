'use client';

import { useEffect, useState, useRef } from 'react';

// Get yesterday's date at the same time as now
const getYesterdayTime = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes(), now.getSeconds());
};

export function Countdown() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Update time every second for smooth animation
    const updateTime = () => {
      setCurrentTime(new Date());
      setIsAnimating(true);
      
      // Clear previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Stop animation after 500ms
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(() => setIsAnimating(false), 100);
      });
    };

    // Initial update
    updateTime();
    
    // Set up interval for continuous updates
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!mounted) return null;

  const yesterday = getYesterdayTime();
  const timeDiff = currentTime.getTime() - yesterday.getTime();
  
  // Calculate elapsed time from yesterday
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const formatTimeUnit = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  const formattedCurrentTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <section className="w-full px-4 py-6">
      <div className="w-full rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl border border-gray-700/50 relative overflow-hidden group">
        
        {/* Animated Glow Effect */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl transition-all duration-1000 ${isAnimating ? 'scale-110 opacity-40' : 'scale-100 opacity-20'} group-hover:bg-accent/30`} />
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-700 ${isAnimating ? 'opacity-75' : 'opacity-50'}`} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase">
              Real-time Counter
            </h2>
            <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
              Time Since Yesterday
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isAnimating ? 'animate-pulse' : ''}`}>
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0-3.5 3.5v5a3.5 3.5 0 0 0 3.5 3.5h3.5"/>
              </svg>
              <span>Current Time: {formattedCurrentTime}</span>
            </div>
          </div>

          <div className="flex gap-3 md:gap-6">
            <AnimatedTimeUnit value={days} label="Days" isAnimating={isAnimating} />
            <AnimatedTimeUnit value={hours} label="Hours" isAnimating={isAnimating} />
            <AnimatedTimeUnit value={minutes} label="Mins" isAnimating={isAnimating} />
            <AnimatedTimeUnit value={seconds} label="Secs" isAnimating={isAnimating} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedTimeUnit({ value, label, isAnimating }: { value: number; label: string; isAnimating: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative transition-all duration-300 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner transition-all duration-300 ${isAnimating ? 'bg-white/15 border-white/20' : ''}`}>
          <span className={`font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tighter transition-all duration-300 ${isAnimating ? 'text-white scale-110' : 'text-white'}`}>
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className={`mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-400 transition-all duration-300 ${isAnimating ? 'text-gray-300' : ''}`}>
        {label}
      </span>
    </div>
  );
}
