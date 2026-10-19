import React from 'react';
import { Award, Heart, Shield, Code, Sparkles, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e152c] border-2 border-[#c9bcf6]/40 rounded-xl overflow-hidden shadow-2xl retro-window">
        {/* Header */}
        <div className="h-9 px-3 bg-[#1e274a] border-b border-[#c9bcf6]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#fde047]" />
            <span className="font-pixel text-[11px] text-[#fdfaf3] tracking-wider">
              CREDITS.TXT // HACKATHON ATTRIBUTIONS
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-5 h-5 flex items-center justify-center rounded bg-[#632238] text-[#f4a6b8] hover:bg-[#852c4b] text-xs retro-button"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-[#fdfaf3]">
          <div>
            <h3 className="font-pixel text-xs text-[#fde047] uppercase tracking-wider">
              haX.baby "Baby's First Website" Hackathon
            </h3>
            <p className="text-[#c9bcf6] text-[11px] mt-0.5">
              Project: PIP.EXE — The Midnight Internet
            </p>
          </div>

          <div className="p-3 bg-[#080c18] border border-[#c9bcf6]/20 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[#f4a6b8] font-bold">Character:</span>
              <span className="text-stone-300">
                Official hackathon character "Pip", Junior Dream Engineer at the Midnight Nursery. Official tagline: <em>"I build the dreams you fall asleep inside."</em>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#c9bcf6] font-bold">Asset Slots:</span>
              <span className="text-stone-300">
                Configured for official PNG asset files in <code>/public/assets/pip-waving-cloud.png</code> and <code>/public/assets/pip-portrait.png</code>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#fde047] font-bold">Audio Engine:</span>
              <span className="text-stone-300">
                Real-time harmonic pentatonic bell synthesizer created with browser Web Audio API. Zero external audio clips.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#c9bcf6]/75 font-serif-dream italic pt-1">
            <span>Built with care for sleeping creatures everywhere.</span>
            <span>✦ ✦ ✦</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2 rounded bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-pixel text-xs font-bold retro-button cursor-pointer"
          >
            CLOSE CREDITS
          </button>
        </div>
      </div>
    </div>
  );
};
