import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SlotMachine({ pool, winner, onComplete }) {
  const [items, setItems] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  useEffect(() => {
    if (!pool || pool.length === 0 || !winner) return;
    // Build a large scrolling list
    const listLength = 60; // Increased for a longer spin effect
    const scrollItems = [];
    for (let i = 0; i < listLength - 1; i++) {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      scrollItems.push({ ...randomItem, uniqueKey: `${randomItem.id}-${i}` });
    }
    // The exact winner must be the final item
    scrollItems.push({ ...winner, uniqueKey: `${winner.id}-winner` });
    setItems(scrollItems);
  }, [pool, winner]);

  if (items.length === 0) return null;

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
  };

  const handleAnimationComplete = () => {
    if (!isSpinning) return;
    setIsSpinning(false);
    setHasSpun(true);
    if (onComplete) onComplete();
  };

  const itemHeight = 100; // pixels per item
  const visibleHeight = 280; // Total height of the slot box
  // We want the final item to stop exactly in the vertical center.
  // Center of box = visibleHeight / 2 = 140.
  // We want the center of the final item (index: items.length - 1) to align with 140.
  // Target Y = -( (items.length - 1) * itemHeight ) + (visibleHeight / 2 - itemHeight / 2)
  const targetY = isSpinning || hasSpun 
    ? -( (items.length - 1) * itemHeight ) + (visibleHeight / 2 - itemHeight / 2) 
    : (visibleHeight / 2 - itemHeight / 2); // Initial state: first item is centered

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 px-4">
      
      {/* Sleek, Premium Glassmorphism Frame */}
      <div 
        className="w-full max-w-2xl mx-auto rounded-3xl bg-[#020617]/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden relative ring-1 ring-white/5"
        style={{ height: visibleHeight }}
      >
        
        {/* Top & Bottom Fade Overlays (Creates the rolling cylinder illusion) */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020617] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent z-20 pointer-events-none" />
        
        {/* The Targeting Reticle (Center Highlight Box) */}
        <div className="absolute top-1/2 left-0 right-0 h-[100px] -translate-y-1/2 z-10 pointer-events-none flex justify-between items-center px-4">
           {/* Left/Right glowing brackets */}
           <div className="w-4 h-[60px] border-l-4 border-t-4 border-b-4 border-[#06b6d4] rounded-l-xl opacity-80 drop-shadow-[0_0_10px_#06b6d4]" />
           <div className="w-4 h-[60px] border-r-4 border-t-4 border-b-4 border-[#ec4899] rounded-r-xl opacity-80 drop-shadow-[0_0_10px_#ec4899]" />
           
           {/* Horizontal subtle guide lines */}
           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent" />
           <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ec4899]/50 to-transparent" />
           
           {/* Background subtle highlight */}
           <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-[-1]" />
        </div>
        
        {/* The Scrolling Strip */}
        <motion.div
          initial={{ y: (visibleHeight / 2 - itemHeight / 2) }}
          animate={{ y: targetY }}
          transition={{ 
            duration: 8, // Longer, dramatic spin
            ease: [0.15, 0.95, 0.1, 1], // Custom slow-down curve
            onComplete: handleAnimationComplete 
          }}
          className="flex flex-col relative z-0 w-full"
        >
          {items.map((item, i) => {
            // Determine if it's the winner to apply special glow when stopped
            const isWinnerItem = (i === items.length - 1);
            
            return (
              <div 
                key={item.uniqueKey} 
                className="flex items-center justify-center gap-6 px-8 w-full"
                style={{ height: itemHeight }}
              >
                <img 
                  src={item.authorProfileImageUrl} 
                  alt="avatar"
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 transition-all duration-700 ${isWinnerItem && hasSpun ? 'border-[#06b6d4] shadow-[0_0_20px_#06b6d4]' : 'border-white/20'}`}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=?'; }}
                />
                <span 
                  className={`text-xl md:text-3xl font-light truncate max-w-[200px] md:max-w-[400px] transition-all duration-700 ${isWinnerItem && hasSpun ? 'text-white font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'text-white/70'}`}
                >
                  {item.authorName}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <div className="mt-12 h-20 flex items-center justify-center">
        {!isSpinning && !hasSpun && (
          <button 
            onClick={handleSpin}
            className="px-12 py-4 bg-[#020617]/50 backdrop-blur-md border border-white/10 rounded-full text-white/80 font-light tracking-[0.2em] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:bg-[#020617]/80 hover:text-white hover:border-[#06b6d4]/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-105"
          >
            دەستپێکردن
          </button>
        )}
      </div>

    </div>
  );
}
