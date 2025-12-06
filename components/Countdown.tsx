'use client';

import { useEffect, useRef, useState } from 'react';

const TARGET_DATE = new Date('2025-12-31T12:00:00+08:00');
const DAY_MS = 24 * 60 * 60 * 1000;

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [displayDiff, setDisplayDiff] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isTicking, setIsTicking] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fastForwardRef = useRef(true);

  // Ease-out cubic for the fast-forward effect
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    setMounted(true);

    const now = new Date();
    setCurrentTime(now);

    const actualDiff = TARGET_DATE.getTime() - now.getTime();
    const startingDiff = Math.max(actualDiff + DAY_MS, 0);
    const endingDiff = Math.max(actualDiff, 0);
    setDisplayDiff(startingDiff);

    const startTimestamp = performance.now();
    const duration = 1400; // fast-forward duration in ms

    const animateToLive = (timestamp: number) => {
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = easeOut(progress);
      const currentDiff = startingDiff - (startingDiff - endingDiff) * eased;
      setDisplayDiff(currentDiff);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateToLive);
      } else {
        fastForwardRef.current = false;
        setIsFastForwarding(false);
        setDisplayDiff(endingDiff);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateToLive);

    intervalRef.current = setInterval(() => {
      const nowTick = new Date();
      setCurrentTime(nowTick);
      setIsTicking(true);
      setTimeout(() => setIsTicking(false), 120);

      if (!fastForwardRef.current) {
        const diff = Math.max(TARGET_DATE.getTime() - nowTick.getTime(), 0);
        setDisplayDiff(diff);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (!mounted || displayDiff === null || currentTime === null) return null;

  const safeDiff = Math.max(displayDiff, 0);
  const days = Math.floor(safeDiff / DAY_MS);
  const hours = Math.floor((safeDiff % DAY_MS) / (1000 * 60 * 60));
  const minutes = Math.floor((safeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((safeDiff % (1000 * 60)) / 1000);

  const formattedCurrentTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kuala_Lumpur'
  });

  return (
    <section className="w-full px-4 py-6">
      <div className="w-full rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl border border-gray-700/50 relative overflow-hidden group">
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl transition-all duration-1000 ${isTicking || isFastForwarding ? 'scale-110 opacity-40' : 'scale-100 opacity-20'} group-hover:bg-accent/30`} />
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-700 ${isTicking || isFastForwarding ? 'opacity-75' : 'opacity-50'}`} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-3">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-bold tracking-widest text-accent uppercase">
                Malaysia Solar ATAP
              </span>
              <span className={`text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 ${isFastForwarding ? 'animate-pulse' : ''}`}>
                Solar ATAP Announcement
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
              Countdown to Dec 31, 2025 • 12:00 PM (MYT)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-300 justify-center md:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isTicking ? 'animate-pulse' : ''}`}>
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0-3.5 3.5v5a3.5 3.5 0 0 0 3.5 3.5h3.5" />
              </svg>
              <span>Live time (MYT): {formattedCurrentTime}</span>
            </div>
            {isFastForwarding && (
              <div className="text-xs text-accent/80 flex items-center justify-center md:justify-start gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                Fast-forwarding from +1 day to live countdown
              </div>
            )}
          </div>

          <div className="flex gap-3 md:gap-6">
            <AnimatedTimeUnit value={days} label="Days" isActive={isTicking || isFastForwarding} />
            <AnimatedTimeUnit value={hours} label="Hours" isActive={isTicking || isFastForwarding} />
            <AnimatedTimeUnit value={minutes} label="Mins" isActive={isTicking || isFastForwarding} />
            <AnimatedTimeUnit value={seconds} label="Secs" isActive={isTicking || isFastForwarding} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AnimatedTimeUnit({ value, label, isActive }: { value: number; label: string; isActive: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative transition-all duration-300 ${isActive ? 'scale-105' : 'scale-100'}`}>
        <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner transition-all duration-300 ${isActive ? 'bg-white/15 border-white/20' : ''}`}>
          <span className={`font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tighter transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white'}`}>
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className={`mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-400 transition-all duration-300 ${isActive ? 'text-gray-300' : ''}`}>
        {label}
      </span>
    </div>
  );
}
