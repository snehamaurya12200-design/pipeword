import React, { useState } from 'react';
import { WindowFrame } from '../WindowFrame';
import { Moon, Sparkles, Cloud, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface LightOption {
  id: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
  glowColor: string;
}

const LIGHTS: LightOption[] = [
  {
    id: 'moon-lamp',
    name: 'Moon Lamp',
    desc: 'Soft and cozy',
    icon: <Moon className="w-3.5 h-3.5 text-[#fde047]" />,
    glowColor: 'from-[#fef08a]/20 to-[#ca8a04]/10'
  },
  {
    id: 'star-lantern',
    name: 'Star Lantern',
    desc: 'Bright and cheerful',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />,
    glowColor: 'from-[#f59e0b]/25 to-[#d97706]/10'
  },
  {
    id: 'cloud-light',
    name: 'Cloud Light',
    desc: 'Gentle and calm',
    icon: <Cloud className="w-3.5 h-3.5 text-[#c9bcf6]" />,
    glowColor: 'from-[#c9bcf6]/25 to-[#93c5fd]/10'
  },
  {
    id: 'aurora-light',
    name: 'Aurora Light',
    desc: 'Magical and dreamy',
    icon: <Waves className="w-3.5 h-3.5 text-[#34d399]" />,
    glowColor: 'from-[#34d399]/25 to-[#60a5fa]/15'
  }
];

interface NightlightStudioWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPos?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onFocus: () => void;
}

export const NightlightStudioWindow: React.FC<NightlightStudioWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 100, y: 440 },
  initialSize = { width: 440, height: 230 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevLight = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : LIGHTS.length - 1));
  };

  const nextLight = () => {
    sound.playClick();
    setActiveIndex((prev) => (prev < LIGHTS.length - 1 ? prev + 1 : 0));
  };

  const selectLight = (idx: number) => {
    sound.playClick();
    setActiveIndex(idx);
  };

  const current = LIGHTS[activeIndex];

  return (
    <WindowFrame
      id="nightlight-studio"
      title="NIGHTLIGHT STUDIO"
      icon={<Moon className="w-3.5 h-3.5 text-[#fde047]" />}
      theme="blue"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      zIndex={zIndex}
      initialPos={initialPos}
      initialSize={initialSize}
      onClose={onClose}
      onMinimize={onMinimize}
      onToggleMaximize={onToggleMaximize}
      onFocus={onFocus}
    >
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Left List of 4 Light Modes */}
        <div className="sm:col-span-5 space-y-1.5">
          {LIGHTS.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => selectLight(idx)}
                className={`w-full p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#232d56] border-[#fde047]/80 shadow-[0_0_8px_rgba(253,224,71,0.2)]'
                    : 'bg-[#131a38] border-[#c9bcf6]/20 hover:bg-[#1a234b]'
                }`}
              >
                <div className="w-6 h-6 rounded-md bg-[#1e274c] border border-white/20 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <span className="font-medium text-[11px] text-[#fdfaf3] block leading-tight truncate">
                    {item.name}
                  </span>
                  <span className="text-[9px] text-stone-300 block leading-tight truncate">
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Starry Sky Viewport with Sleeping Moon */}
        <div className="sm:col-span-7 h-36 rounded-lg bg-[#070b1a] border border-[#c9bcf6]/30 relative overflow-hidden flex items-center justify-center p-2 shadow-inner">
          <div className={`absolute inset-0 bg-gradient-to-t ${current.glowColor} pointer-events-none transition-all duration-500`} />

          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img 
              src="/assets/pip_dream_lantern.png" 
              alt="Dream Nightlight Lantern" 
              className="max-h-28 object-contain drop-shadow-[0_4px_16px_rgba(253,224,71,0.5)] transition-transform duration-300 hover:scale-105"
            />
          </div>

          <button
            onClick={prevLight}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-[#fdfaf3] flex items-center justify-center z-20 cursor-pointer border border-white/20 transition-transform active:scale-95"
            title="Previous Light"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={nextLight}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 text-[#fdfaf3] flex items-center justify-center z-20 cursor-pointer border border-white/20 transition-transform active:scale-95"
            title="Next Light"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
