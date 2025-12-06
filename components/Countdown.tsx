'use client';

import { useEffect, useState } from 'react';

const TARGET_DATE = '2025-12-31T12:00:00+08:00';

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(TARGET_DATE).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full px-4 py-6">
      <div className="w-full rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl border border-gray-700/50 relative overflow-hidden group">
        
        {/* Decorative Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-sm font-bold tracking-widest text-accent uppercase">
              Upcoming Release
            </h2>
            <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
              Solar ATAP Announcement
            </h3>
            <p className="text-sm text-gray-400 max-w-sm">
              Official government release of the new Solar ATAP guidelines.
            </p>
          </div>

          <div className="flex gap-3 md:gap-6">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
          <span className="font-mono text-2xl md:text-3xl font-bold tabular-nums tracking-tighter">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="mt-2 text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </span>
    </div>
  );
}
