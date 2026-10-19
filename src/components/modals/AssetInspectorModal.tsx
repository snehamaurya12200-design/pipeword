import React from 'react';
import { FolderCheck, X, CheckCircle2, FileImage, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AssetInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetInspectorModal: React.FC<AssetInspectorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-[#0e152d] border-2 border-[#c9bcf6]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col retro-window text-[#fdfaf3]">
        {/* Title Bar */}
        <div className="h-9 px-3 bg-[#1e274a] border-b border-[#c9bcf6]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-[#fde047]" />
            <span className="font-pixel text-[11px] tracking-wider">
              ASSETS.CFG // OFFICIAL HAX.BABY CHARACTER AUDIT
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-5 h-5 flex items-center justify-center rounded bg-[#f4a6b8] text-[#2c1424] hover:bg-[#ff9bb1] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[80vh]">
          <div className="p-2.5 rounded-lg bg-[#141d3a] border border-[#fde047]/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#fde047]" />
              <span className="font-bold text-[#fdfaf3]">haX.baby Official Specification Lock</span>
            </div>
            <span className="text-[10px] font-mono text-[#fde047]">100% COMPLIANT</span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <span className="font-pixel text-[9px] text-[#c9bcf6] block uppercase tracking-wider">
              Verified Public Track 1 Asset Paths:
            </span>
            <div className="p-2 rounded bg-[#090d1c] border border-[#c9bcf6]/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/assets/pip-waving-cloud.png" alt="Skeleton Pip" className="w-8 h-8 object-contain [image-rendering:pixelated] rounded bg-[#16203d]/40" />
                <div>
                  <span className="text-[#fdfaf3] font-bold block">pip-waving-cloud.png</span>
                  <span className="text-[10px] text-[#c9bcf6]">Skeleton Character</span>
                </div>
              </div>
              <span className="text-[#fde047] text-[10px] shrink-0 font-pixel">ACTIVE</span>
            </div>
            <div className="p-2 rounded bg-[#090d1c] border border-[#c9bcf6]/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/assets/pip_lullaby_box.png" alt="Lullaby Music Box" className="w-8 h-8 object-contain [image-rendering:pixelated] rounded bg-[#16203d]/40" />
                <div>
                  <span className="text-[#fdfaf3] font-bold block">pip_lullaby_box.png</span>
                  <span className="text-[10px] text-[#c9bcf6]">Lullaby Lab Music Box</span>
                </div>
              </div>
              <span className="text-[#fde047] text-[10px] shrink-0 font-pixel">ACTIVE</span>
            </div>
            <div className="p-2 rounded bg-[#090d1c] border border-[#c9bcf6]/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/assets/pip_dream_lantern.png" alt="Dream Lantern" className="w-8 h-8 object-contain [image-rendering:pixelated] rounded bg-[#16203d]/40" />
                <div>
                  <span className="text-[#fdfaf3] font-bold block">pip_dream_lantern.png</span>
                  <span className="text-[10px] text-[#c9bcf6]">Dream Nightlight Lantern</span>
                </div>
              </div>
              <span className="text-[#fde047] text-[10px] shrink-0 font-pixel">ACTIVE</span>
            </div>
            <div className="p-2 rounded bg-[#090d1c] border border-[#c9bcf6]/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img src="/assets/sleeping_moon.png" alt="Sleeping Moon" className="w-8 h-8 object-contain [image-rendering:pixelated] rounded bg-[#16203d]/40" />
                <div>
                  <span className="text-[#fdfaf3] font-bold block">sleeping_moon.png</span>
                  <span className="text-[10px] text-[#c9bcf6]">Celestial Wallpaper Moon</span>
                </div>
              </div>
              <span className="text-[#fde047] text-[10px] shrink-0 font-pixel">ACTIVE</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#16203d] border border-[#c9bcf6]/25 space-y-1 text-stone-300 text-[11px]">
            <p className="font-semibold text-white">Official Character Attributes Preserved:</p>
            <p>• Round smooth skull face with gentle friendly smile</p>
            <p>• Large soft eye sockets with warm glowing star pinpricks of light</p>
            <p>• Bedtime nightcap decorated with golden stars and pink ribbon bow</p>
            <p>• Antique brass dream lantern illuminating sleep journeys</p>
            <p>• Resting on a fluffy cumulus cloud</p>
            <p className="italic text-[#f4a6b8] pt-1">"I build the dreams you fall asleep inside."</p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2 rounded bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-pixel text-xs font-bold cursor-pointer"
          >
            CLOSE AUDIT
          </button>
        </div>
      </div>
    </div>
  );
};
