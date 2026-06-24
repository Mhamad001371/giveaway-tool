import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SpinningWheel({ pool, winner, onComplete }) {
  const [items, setItems] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

  const pointerNameRef = React.useRef(null);

  useEffect(() => {
    if (!pool || pool.length === 0 || !winner) return;
    setItems(pool);
    const winIdx = pool.findIndex(item => item.id === winner.id);
    setWinnerIndex(winIdx >= 0 ? winIdx : 0);
  }, [pool, winner]);

  if (items.length === 0) return null;

  const sliceAngle = 360 / items.length;
  const gradientStops = items.map((item, i) => {
    // Clean, minimalist dark slices to let the neon borders shine
    const color = i % 2 === 0 ? '#0f172a' : '#1e293b';
    return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
  }).join(', ');

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;
    setIsSpinning(true);
  };

  const handleAnimationComplete = () => {
    if (!isSpinning) return;
    setIsSpinning(false);
    setHasSpun(true);
    // Ensure final text exactly matches the winner
    if (pointerNameRef.current) {
      pointerNameRef.current.textContent = winner.authorName;
    }
    if (onComplete) onComplete();
  };

  const handleUpdate = (latest) => {
    if (typeof latest.rotate !== 'number') return;
    
    let normalizedRot = latest.rotate % 360;
    if (normalizedRot < 0) normalizedRot += 360;
    
    // The wheel rotated clockwise by `normalizedRot`.
    // The slice currently at the top pointer (0 deg) was originally at `360 - normalizedRot`.
    const topAngle = (360 - normalizedRot) % 360;
    const activeIndex = Math.floor(topAngle / sliceAngle) % items.length;
    
    if (pointerNameRef.current && items[activeIndex]) {
      pointerNameRef.current.textContent = items[activeIndex].authorName;
    }
  };

  // Only apply rotation if spinning or has spun
  const targetRotation = isSpinning || hasSpun ? (360 * 15 - (winnerIndex * sliceAngle + sliceAngle / 2)) : 0;

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-2">
      <div className="relative w-[85vw] h-[85vw] max-w-[600px] max-h-[600px] mx-auto p-4 md:p-8">
        
        {/* Dynamic Name Display above the Pointer */}
        <div className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-[500px] flex items-center justify-center z-40">
          <div className="bg-[#020617]/80 backdrop-blur-md border border-[#06b6d4]/50 rounded-full px-8 py-3 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <span 
              ref={pointerNameRef}
              className="text-white font-bold text-sm md:text-xl tracking-widest truncate max-w-[300px] md:max-w-[400px] inline-block text-center drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            >
              {hasSpun ? winner.authorName : 'ئامادەیە بۆ خولاندنەوە'}
            </span>
          </div>
        </div>

        {/* The Pointer (Minimalist Neon Cyan Arrow) */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-[#06b6d4] z-20 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        
        {/* Wheel Container */}
        <div className="w-full h-full rounded-full border border-white/10 shadow-[0_0_60px_rgba(236,72,153,0.15)] overflow-hidden relative ring-1 ring-white/5">
          
          <motion.div
            className="w-full h-full rounded-full relative"
            style={{ background: `conic-gradient(${gradientStops})` }}
            initial={{ rotate: 0 }}
            animate={{ rotate: targetRotation }}
            onUpdate={handleUpdate}
            transition={{
              duration: 9, 
              ease: [0.15, 0.85, 0.1, 1], 
              onComplete: handleAnimationComplete,
            }}
          >
            {/* Draw thin geometric dividing lines instead of solid borders for maximum elegance */}
            <div className="absolute inset-0 rounded-full shadow-inner border-[4px] border-[#ec4899]/30 pointer-events-none z-10" />
            
            {/* We no longer render names inside the slices to keep the geometric design flawlessly clean */}
          </motion.div>
        </div>

        {/* Center SPIN Button */}
        <button 
          onClick={handleSpin}
          disabled={isSpinning || hasSpun}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-[#020617]/50 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] z-30 flex items-center justify-center cursor-pointer hover:border-white/30 hover:bg-[#020617]/80 hover:shadow-[0_0_40px_rgba(236,72,153,0.2)] transition-all duration-500 disabled:opacity-0 disabled:scale-90 disabled:pointer-events-none group"
        >
          <span className="text-white/80 font-light text-sm md:text-base group-hover:text-white transition-colors duration-300">
            خولاندنەوە
          </span>
        </button>
      </div>
    </div>
  );
}
