import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, Gift } from 'lucide-react';

const YoutubeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className || "w-5 h-5"}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function VideoInput({ onStart, isFetching, error }) {
  const [url, setUrl] = useState('');
  const [winners, setWinners] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url && winners > 0) {
      onStart(url, parseInt(winners, 10));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-[#020617]/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(6,182,212,0.15)] ring-1 ring-white/5">
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-gradient-to-br from-[#ec4899]/20 to-[#06b6d4]/20 rounded-full border border-white/10 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
          <Gift className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-light text-center text-white mb-8">
        هەڵبژاردنی <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] to-[#06b6d4]">براوەکان</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="relative group">
            <YoutubeIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ec4899] w-5 h-5 transition-transform group-focus-within:scale-110" />
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="لینکی ڤیدیۆی یوتیوب لێرە دابنێ..."
              className="w-full bg-[#020617]/50 border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-all font-light"
              dir="rtl"
              disabled={isFetching}
            />
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-900/50 flex items-start gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-2 px-2 font-light">ژمارەی براوەکان</label>
          <div className="relative group">
            <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-[#06b6d4] w-5 h-5 transition-transform group-focus-within:scale-110" />
            <input
              type="number"
              min="1"
              max="100"
              required
              value={winners}
              onChange={(e) => setWinners(e.target.value)}
              className="w-full bg-[#020617]/50 border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-all font-light"
              dir="rtl"
              disabled={isFetching}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isFetching || !url}
          className="w-full py-4 mt-4 bg-gradient-to-r from-[#ec4899] to-[#06b6d4] rounded-xl text-white font-light text-lg transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02]"
        >
          {isFetching ? 'لە وەرگرتندایە...' : 'وەرگرتنی کۆمێنتەکان'}
        </button>
      </form>
    </div>
  );
}
