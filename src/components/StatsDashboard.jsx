import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UserCheck, Trophy, PieChart } from 'lucide-react';

export default function StatsDashboard({ totalOriginal, totalUnique, onRoll }) {
  const [mode, setMode] = useState('SLOT_MACHINE');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-[#020617]/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.15)] ring-1 ring-white/5"
    >
      <div className="grid grid-cols-2 gap-6 mb-12">
        <motion.div variants={item} className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#06b6d4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageCircle className="w-8 h-8 text-[#06b6d4] mb-3 opacity-80" />
          <span className="text-3xl md:text-4xl font-bold text-white mb-1">{totalOriginal}</span>
          <span className="text-slate-400 text-sm font-light text-center">کۆی گشتی کۆمێنتەکان</span>
        </motion.div>
        
        <motion.div variants={item} className="bg-[#020617]/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ec4899]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <UserCheck className="w-8 h-8 text-[#ec4899] mb-3 opacity-80" />
          <span className="text-3xl md:text-4xl font-bold text-white mb-1">{totalUnique}</span>
          <span className="text-slate-400 text-sm font-light text-center">لادانی کۆمێنتە دووبارەکان</span>
        </motion.div>
      </div>

      <motion.div variants={item} className="mb-10">
        <h3 className="text-center text-slate-300 font-light mb-6">شێوازی پیشاندان</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('SLOT_MACHINE')}
            className={`py-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${
              mode === 'SLOT_MACHINE' 
                ? 'bg-[#06b6d4]/10 border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.3)] text-[#06b6d4]' 
                : 'bg-[#020617]/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <Trophy className="w-6 h-6" />
            <span className="font-light text-sm">ئامێری سلۆت</span>
          </button>
          
          <button
            onClick={() => setMode('WHEEL')}
            className={`py-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${
              mode === 'WHEEL' 
                ? 'bg-[#ec4899]/10 border-[#ec4899] shadow-[0_0_20px_rgba(236,72,153,0.3)] text-[#ec4899]' 
                : 'bg-[#020617]/50 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
          >
            <PieChart className="w-6 h-6" />
            <span className="font-light text-sm">چەرخی بەخت</span>
          </button>
        </div>
      </motion.div>

      <motion.button
        variants={item}
        onClick={() => onRoll(mode)}
        className="w-full py-5 bg-gradient-to-r from-[#ec4899] to-[#06b6d4] rounded-xl text-white font-light text-xl transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] hover:scale-[1.02]"
      >
        دەستپێکردن
      </motion.button>
    </motion.div>
  );
}
