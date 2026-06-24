import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WinnerCard({ winner, index }) {
  useEffect(() => {
    // Fire celebratory confetti when card mounts
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.15
      }}
      className="bg-[#020617]/80 backdrop-blur-xl border border-[#06b6d4]/40 rounded-3xl p-8 max-w-2xl w-full mx-auto shadow-[0_0_80px_rgba(6,182,212,0.25)] relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#06b6d4] via-[#7c3aed] to-[#ec4899]" />
      
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#06b6d4]/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex items-start gap-6 relative z-10">
        <div className="relative shrink-0">
          <img 
            src={winner.authorProfileImageUrl} 
            alt={winner.authorName}
            className="w-24 h-24 rounded-full border-4 border-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/96?text=?'; }}
          />
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.15 + 0.5, type: 'spring' }}
            className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#06b6d4] to-[#ec4899] text-white p-2 rounded-full shadow-lg"
          >
            <Trophy className="w-5 h-5" />
          </motion.div>
        </div>
        
        <div className="flex-1 min-w-0 pt-2">
          <h2 className="text-3xl font-bold text-white mb-1 truncate drop-shadow-md">{winner.authorName}</h2>
          <p className="text-[#06b6d4] text-sm font-light mb-4">براوەی ژمارە {index + 1}</p>
          
          <div className="bg-[#020617]/50 rounded-xl p-4 border border-white/10 relative shadow-inner">
            <MessageSquare className="absolute top-4 left-4 w-4 h-4 text-white/20" />
            <p className="text-slate-300 pl-8 break-words text-sm leading-relaxed font-light">{winner.textOriginal}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
