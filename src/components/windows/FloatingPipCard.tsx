import React from 'react';
import { PipCharacter } from '../PipCharacter';
import { sound } from '../../utils/audio';

interface FloatingPipCardProps {
  onSpinDream: () => void;
  onPlayLullaby: () => void;
  onOpenAssetInspector: () => void;
  customAssetUrl?: string | null;
}

export const FloatingPipCard: React.FC<FloatingPipCardProps> = ({
  onSpinDream,
  onPlayLullaby,
  onOpenAssetInspector,
  customAssetUrl
}) => {
  return (
    <div className="w-full max-w-[210px] rounded-xl bg-[#111636] border border-[#a28cd4]/50 shadow-2xl overflow-hidden flex flex-col items-center p-2.5 text-center text-[#fdfaf3] select-none">
      {/* Top Header Strip */}
      <div 
        onClick={onOpenAssetInspector}
        className="w-full py-0.5 px-2 bg-[#211a3d] rounded border border-[#a28cd4]/40 flex items-center justify-center gap-1 text-[8px] font-mono text-[#d6c9f2] cursor-pointer hover:border-[#f4a6b8] transition-colors mb-1.5"
        title="Official Asset Path Slot"
      >
        <span>📁</span>
        <span className="truncate">assets/pip-waving-cloud.png</span>
      </div>

      {/* Pip Character Art */}
      <div className="my-1">
        <PipCharacter
          size="sm"
          showBadge={false}
          onOpenAssetInspector={onOpenAssetInspector}
          customAssetUrl={customAssetUrl}
        />
      </div>

      {/* Name and Tagline */}
      <div className="mt-1">
        <h3 className="font-pixel text-[11px] font-bold text-[#fdfaf3] flex items-center justify-center gap-1">
          <span>Pip</span>
          <span className="text-[#fde047]">✦</span>
        </h3>
        <p className="text-[8px] text-[#c9bcf6] font-medium leading-tight mt-0.5">
          Junior Dream Engineer at the Midnight Nursery
        </p>
        <p className="text-[8px] font-serif-dream italic text-stone-300 mt-1 leading-snug">
          "I build the dreams you fall asleep inside."
        </p>
      </div>

      {/* Two Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-[#c9bcf6]/20">
        <button
          onClick={() => {
            sound.playClick();
            onSpinDream();
          }}
          className="py-1 px-1 rounded bg-[#fefaf3] hover:bg-[#fff0db] text-[#3d2716] font-pixel text-[8px] font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
        >
          SPIN A DREAM
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onPlayLullaby();
          }}
          className="py-1 px-1 rounded bg-[#b8a9e8] hover:bg-[#caaae8] text-[#1e153b] font-pixel text-[8px] font-bold transition-transform active:scale-95 cursor-pointer shadow-sm"
        >
          PLAY LULLABY
        </button>
      </div>
    </div>
  );
};
