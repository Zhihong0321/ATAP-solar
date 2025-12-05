'use client';

import { useEffect, useState, useRef } from 'react';

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch('/api/stocks');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStocks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchStocks();
  }, []);

  // Add duplicate items for seamless looping
  const displayStocks = [...stocks, ...stocks];

  if (loading) return null;

  return (
    <section className="w-full border-y border-border/50 bg-white py-8 overflow-hidden">
      <div className="mb-6 text-center">
        <h3 className="font-serif text-xl font-bold text-text">
          Bursa Renewable Energy Watch
        </h3>
        <p className="text-sm text-subtle">Delayed 15 mins</p>
      </div>
      
      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden group">
        <div 
          className="flex gap-6 animate-scroll hover:[animation-play-state:paused] w-max px-4"
          ref={scrollerRef}
        >
          {displayStocks.map((stock, index) => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={`${stock.symbol}-${index}`}
                className="flex w-48 flex-col items-start justify-between rounded-xl border border-border/60 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-2 w-full">
                  <span className="block text-xs font-bold text-subtle uppercase tracking-wider">
                    {stock.symbol.replace('.KL', '')}
                  </span>
                  <h4 className="truncate text-lg font-bold text-text" title={stock.name}>
                    {stock.name}
                  </h4>
                </div>
                
                <div className="flex w-full items-end justify-between">
                  <span className="text-xl font-semibold text-text">
                    <span className="text-sm font-medium text-subtle mr-1">RM</span>
                    {stock.price?.toFixed(2)}
                  </span>
                  <div className={`flex flex-col items-end text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <span>
                      {isPositive ? '+' : ''}{stock.change?.toFixed(3)}
                    </span>
                    <span className="opacity-80">
                      ({isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
