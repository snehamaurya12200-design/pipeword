import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Moon, ArrowRight, FastForward } from 'lucide-react';
import { sound } from '../utils/audio';

interface BootScreenProps {
  onEnter: () => void;
}

const BOOT_LOGS = [
  "MIDNIGHT NURSERY SYSTEMS BIOS v2.04",
  "Checking celestial memory sectors... [OK]",
  "Calibrating moonlight... 100% luminous",
  "Tuning lullaby music-box frequencies... 440Hz / 523Hz",
  "Waking up Pip... *yawn detected*",
  "Dream engine ready."
];

export const BootScreen: React.FC<BootScreenProps> = ({ onEnter }) => {
  const [logIndex, setLogIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (logIndex < BOOT_LOGS.length - 1) {
      const timer = setTimeout(() => {
        setLogIndex((prev) => prev + 1);
        setProgress((prev) => Math.min(100, prev + 18));
      }, 420);
      return () => clearTimeout(timer);
    } else {
      setProgress(100);
      setIsReady(true);
    }
  }, [logIndex]);

  const handleSkip = () => {
    sound.playBootChime();
    onEnter();
  };

  const handleEnter = () => {
    sound.playBootChime();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080c18] text-[#fdfaf3] flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Background Starlight Field */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/5 text-[#fde047] text-xs animate-pulse">✦</div>
        <div className="absolute top-1/3 right-1/4 text-[#f4a6b8] text-sm animate-ping">✦</div>
        <div className="absolute bottom-1/4 left-1/3 text-[#c9bcf6] text-xs animate-pulse">✦</div>
        <div className="absolute top-12 left-1/2 text-[#fde047] text-xs">✦</div>
        <div className="absolute bottom-12 right-1/3 text-[#fdfaf3] text-sm animate-bounce">✦</div>
      </div>

      {/* Retro Startup Console Box */}
      <div className="w-full max-w-lg bg-[#0e152c] border-2 border-[#c9bcf6]/35 rounded-xl shadow-[0_0_50px_rgba(184,169,232,0.15)] overflow-hidden retro-window">
        {/* Header bar */}
        <div className="h-8 px-3 bg-[#1c264a] border-b border-[#c9bcf6]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-[#fde047]" />
            <span className="font-pixel text-[11px] text-[#fdfaf3] tracking-wider">
              MIDNIGHT_OS_BOOT.EXE
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-[10px] font-pixel text-[#c9bcf6] hover:text-[#f4a6b8] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3 h-3" />
          </button>
        </div>

        {/* Startup Body */}
        <div className="p-6 space-y-5">
          {/* Logo & Subtitle */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1e2a52] border border-[#c9bcf6]/40 mb-2 shadow-inner">
              <span className="text-2xl">🌙</span>
            </div>
            <h1 className="font-pixel text-sm sm:text-base text-[#fde047] tracking-widest uppercase">
              MIDNIGHT NURSERY SYSTEMS
            </h1>
            <p className="text-xs text-[#c9bcf6] font-mono-code">
              PIP.EXE — The Midnight Internet (haX.baby Hackathon)
            </p>
          </div>

          {/* Scrolling Boot Console Log */}
          <div className="h-36 bg-[#080c1a] border border-[#c9bcf6]/20 rounded-lg p-3 font-mono-code text-xs space-y-1.5 overflow-hidden retro-inset shadow-inner">
            {BOOT_LOGS.slice(0, logIndex + 1).map((log, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 ${
                  idx === logIndex ? 'text-[#fde047]' : 'text-stone-300'
                }`}
              >
                <span className="text-[#c9bcf6]/60">&gt;</span>
                <span className="truncate">{log}</span>
                {idx === logIndex && !isReady && (
                  <span className="inline-block w-2 h-3 bg-[#fde047] animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono-code text-[#c9bcf6]">
              <span>CALIBRATING MOONLIGHT:</span>
              <span className="text-[#fde047]">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-[#080c1a] border border-[#c9bcf6]/30 rounded-full overflow-hidden p-0.5">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#9e8ad8] via-[#f4a6b8] to-[#fde047] rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col items-center">
            <button
              onClick={handleEnter}
              className={`w-full py-3 px-6 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg retro-button ${
                isReady
                  ? 'bg-[#fde047] hover:bg-[#fff085] text-[#090d1c] font-bold border-2 border-white ring-2 ring-[#fde047]/40 scale-102'
                  : 'bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-bold border border-white/60'
              }`}
            >
              <span>{isReady ? 'ENTER PIP’S MIDNIGHT DESKTOP' : 'ENTER SYSTEM NOW'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-[#c9bcf6]/75 mt-2 font-serif-dream italic text-center">
              "I build the dreams you fall asleep inside."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
