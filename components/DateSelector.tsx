'use client';

import React, { useRef, useEffect } from 'react';

const DATES = [
  { label: '11/07', active: false },
  { label: '12/07', active: false },
  { label: '13/07', active: false },
  { label: '14/07', active: true, dot: 'red' },
  { label: '15/07', active: false },
  { label: 'Today', active: false, dot: 'blue' },
];

export default function DateSelector() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="w-full py-6">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar space-x-8 px-6 items-center"
      >
        {DATES.map((date, i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer group">
            <span className={`text-sm font-medium ${date.label === 'Today' ? 'text-text' : 'text-subtle group-hover:text-text transition-colors'}`}>
              {date.label}
            </span>
            <div className="h-1.5 w-1.5 flex items-center justify-center">
              {date.active && (
                <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-red-400 rounded-full" />
              )}
               {/* Small dots for style if needed, or just the active indicator */}
               {!date.active && date.dot === 'blue' && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
               {!date.active && date.dot === 'red' && <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </div>
          </div>
        ))}
        
        {/* Decorative line behind - simplified for now */}
      </div>
      <div className="relative h-px bg-gray-100 w-full mt-2 mx-6 max-w-[calc(100%-3rem)]">
          {/* Active indicator on the line could go here */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-1 bg-transparent">
             {/* Visual placeholder for the 'Today' indicator logic */}
          </div>
      </div>
      
      <div className="flex justify-center mt-4">
         <span className="text-accent font-serif italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Today
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
         </span>
      </div>
    </div>
  );
}
