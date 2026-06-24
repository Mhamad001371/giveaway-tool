import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useYoutubeComments } from './hooks/useYoutubeComments';
import { extractVideoId } from './utils/youtubeParser';
import { deduplicateAndShuffle } from './utils/shuffle';

import Header from './components/Header';
import VideoInput from './components/VideoInput';
import StatsDashboard from './components/StatsDashboard';
import SlotMachine from './components/SlotMachine';
import SpinningWheel from './components/SpinningWheel';
import WinnerCard from './components/WinnerCard';
import ParticleNoiseBackground from './components/ParticleNoiseBackground';
import confetti from 'canvas-confetti';

const API_KEY = 'AIzaSyB0uuvtdXT8E5-RH9yqHT0loPJ8fcxAHWM';

function App() {
  const [appState, setAppState] = useState('IDLE'); 
  const [visualizationMode, setVisualizationMode] = useState('SLOT_MACHINE');
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState(null);
  
  // Sequential Spin Logic
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [drawnWinners, setDrawnWinners] = useState([]);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);
  const [readyToRevealAll, setReadyToRevealAll] = useState(false);
  
  const { isFetching, error, fetchComments, totalFetched } = useYoutubeComments(API_KEY);

  const handleStart = async (url, winnersCount) => {
    setErrorMsg('');
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setErrorMsg('شێوازی لینکی یوتیوبەکە هەڵەیە.');
      return;
    }

    setAppState('FETCHING');
    const fetchedComments = await fetchComments(videoId);

    if (fetchedComments && fetchedComments.length > 0) {
      const processed = deduplicateAndShuffle(fetchedComments, winnersCount);
      setResults(processed);
      setAppState('READY');
    } else {
      setAppState('IDLE');
      setErrorMsg(error || 'هیچ کۆمێنتێک نەدۆزرایەوە یان کێشەیەک هەیە.');
    }
  };

  const handleRoll = (mode) => {
    setVisualizationMode(mode);
    setAppState('ROLLING');
    setCurrentWinnerIndex(0);
    setDrawnWinners([]);
    setShowWinnerPopup(false);
    setReadyToRevealAll(false);
  };

  const handleSpinComplete = () => {
    const newlyDrawnWinner = results.winners[currentWinnerIndex];
    setDrawnWinners(prev => [...prev, newlyDrawnWinner]);
    // Show the suspenseful overlay popup
    setShowWinnerPopup(true);
  };

  const handleDismissPopup = () => {
    setShowWinnerPopup(false);
    if (currentWinnerIndex + 1 < results.winners.length) {
      setCurrentWinnerIndex(prev => prev + 1);
    } else {
      setReadyToRevealAll(true);
    }
  };

  const handleRevealAll = () => {
    setAppState('FINISHED');
    fireFinalConfetti();
  };

  const fireFinalConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 100 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen text-slate-100 overflow-x-hidden selection:bg-[#ec4899]/30 relative z-10 font-sans" dir="rtl">
      
      {/* Premium Procedural Particle Noise Background */}
      <ParticleNoiseBackground />
      
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh] -mt-12">
        <AnimatePresence mode="wait">
          
          {(appState === 'IDLE' || appState === 'FETCHING') && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full md:-mt-8"
            >
              <VideoInput 
                onStart={handleStart} 
                isFetching={appState === 'FETCHING'} 
                error={errorMsg || error} 
              />
              
              {appState === 'FETCHING' && totalFetched > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center mt-6 text-[#06b6d4] font-light tracking-widest flex items-center justify-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-ping" />
                  شیکردنەوەی {totalFetched} کۆمێنت...
                </motion.div>
              )}
            </motion.div>
          )}

          {appState === 'READY' && results && (
            <motion.div 
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full"
            >
              <StatsDashboard 
                totalOriginal={results.totalOriginal} 
                totalUnique={results.totalUnique} 
                onRoll={handleRoll} 
              />
            </motion.div>
          )}

          {appState === 'ROLLING' && results && (
            <motion.div 
              key="rolling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {!readyToRevealAll && (
                <motion.h2 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center text-xl md:text-2xl font-light text-slate-400 mb-8 uppercase"
                >
                  {currentWinnerIndex < results.winners.length 
                    ? `هەڵبژاردنی براوەی ${currentWinnerIndex + 1} لە ${results.winners.length}` 
                    : 'هەموو براوەکان هەڵبژێردران'}
                </motion.h2>
              )}
              
              {/* Active Wheel or Slot Machine */}
              {!readyToRevealAll && currentWinnerIndex < results.winners.length && (
                <div className="flex flex-col items-center" dir="ltr">
                  {visualizationMode === 'WHEEL' ? (
                    <SpinningWheel 
                      key={`wheel-${currentWinnerIndex}`} 
                      pool={results.pool} 
                      winner={results.winners[currentWinnerIndex]} 
                      onComplete={handleSpinComplete} 
                    />
                  ) : (
                    <SlotMachine 
                      key={`slot-${currentWinnerIndex}`} 
                      pool={results.pool} 
                      winner={results.winners[currentWinnerIndex]} 
                      onComplete={handleSpinComplete} 
                    />
                  )}
                </div>
              )}

              {/* Suspenseful Winner Popup Modal */}
              <AnimatePresence>
                {showWinnerPopup && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md"
                  >
                    <div className="w-full max-w-2xl relative">
                       <WinnerCard winner={results.winners[currentWinnerIndex]} index={currentWinnerIndex} />
                       
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
                         className="mt-12 flex justify-center"
                       >
                         <button 
                           onClick={handleDismissPopup}
                           className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-light transition-all hover:scale-105"
                         >
                           {currentWinnerIndex + 1 < results.winners.length ? 'سوڕانەوەی داهاتوو' : 'کۆتایی'}
                         </button>
                       </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Final Transition Button */}
              {readyToRevealAll && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center mt-20 h-[50vh]">
                  <button
                    onClick={handleRevealAll}
                    className="px-12 py-6 bg-gradient-to-r from-[#ec4899] to-[#06b6d4] rounded-full text-white font-light text-lg md:text-2xl shadow-[0_0_50px_rgba(236,72,153,0.3)] hover:shadow-[0_0_80px_rgba(6,182,212,0.5)] transition-all duration-500 hover:scale-105"
                  >
                    پیشاندانی هەموو براوەکان
                  </button>
                </motion.div>
              )}

            </motion.div>
          )}

          {appState === 'FINISHED' && results && (
            <motion.div 
              key="finished"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-12 pb-20 pt-10"
            >
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] via-[#06b6d4] to-[#ec4899] bg-[length:200%_auto] animate-pulse">
                  براوەکانی پێشبڕکێ
                </h1>
                <p className="text-slate-400 mt-6 text-sm md:text-lg font-light uppercase">پیرۆزە</p>
              </div>

              <div className="space-y-8 w-full max-w-4xl mx-auto">
                {results.winners.map((winner, idx) => (
                  <WinnerCard key={`final-${idx}`} winner={winner} index={idx} />
                ))}
              </div>
              
              <div className="flex justify-center mt-24">
                <button
                  onClick={() => setAppState('IDLE')}
                  className="px-12 py-5 rounded-full border border-white/20 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-light uppercase"
                >
                  پێشبڕکێیەکی نوێ دەستپێبکە
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
