import React, { useState } from 'react';
import { WindowFrame } from '../WindowFrame';
import { MapPin, Navigation } from 'lucide-react';
import { sound } from '../../utils/audio';

interface DreamRoutesWindowProps {
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

export const DreamRoutesWindow: React.FC<DreamRoutesWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 520, y: 550 },
  initialSize = { width: 500, height: 180 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus
}) => {
  const [activeDistrict, setActiveDistrict] = useState('Cloud District 07');

  const districts = ['Cloud District 07', 'Lavender Meadow 04', 'Starlight Harbour 09'];

  const cycleRoute = () => {
    sound.playClick();
    const nextIdx = (districts.indexOf(activeDistrict) + 1) % districts.length;
    setActiveDistrict(districts[nextIdx]);
  };

  return (
    <WindowFrame
      id="dream-routes"
      title="DREAM ROUTES.MAP"
      icon={<MapPin className="w-3.5 h-3.5 text-[#735fb2]" />}
      theme="purple"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left / Center Map Graphic */}
        <div className="flex-1 h-20 w-full rounded-lg overflow-hidden border border-[#b8a9e8]/40 relative shadow-inner bg-[#141838]">
          <img 
            src="/assets/dream_routes.png" 
            alt="Dream routes celestial cloud map" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Vector Map Overlay */}
          <div className="absolute inset-0 flex items-center justify-around px-4 pointer-events-none">
            <div className="flex flex-col items-center">
              <span className="text-base">🏰</span>
              <span className="text-[7px] font-pixel text-white bg-black/40 px-1 rounded">D-01</span>
            </div>
            <span className="text-[#fde047] text-xs">····✦····</span>
            <div className="flex flex-col items-center scale-110">
              <span className="text-lg">☁️</span>
              <span className="text-[7px] font-pixel text-[#fde047] bg-black/60 px-1 rounded font-bold">D-07</span>
            </div>
            <span className="text-[#fde047] text-xs">····✦····</span>
            <div className="flex flex-col items-center">
              <span className="text-base">⛵</span>
              <span className="text-[7px] font-pixel text-white bg-black/40 px-1 rounded">D-09</span>
            </div>
          </div>
        </div>

        {/* Right Info Box & View Route Button */}
        <div className="w-full sm:w-44 text-right sm:text-left flex flex-row sm:flex-col items-center sm:items-start justify-between shrink-0 pl-1">
          <div>
            <span className="text-[9px] font-mono text-[#786196] block leading-tight">
              Next stop:
            </span>
            <span className="font-pixel text-[11px] font-bold text-[#352554] block leading-tight mt-0.5">
              {activeDistrict}
            </span>
          </div>

          <button
            onClick={cycleRoute}
            className="mt-1.5 px-3 py-1 rounded bg-[#fff0f5] hover:bg-[#ffe2ed] border border-[#f4a6b8]/60 text-[10px] font-pixel text-[#3a1d33] font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
          >
            <Navigation className="w-2.5 h-2.5" />
            <span>View Route</span>
          </button>
        </div>
      </div>
    </WindowFrame>
  );
};
