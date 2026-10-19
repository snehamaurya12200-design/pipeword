import React from 'react';
import { Star, ArrowLeft, ArrowRight, RotateCw, Moon, Volume2, VolumeX, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface BrowserChromeProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onRefresh?: () => void;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  isMuted,
  onToggleMute,
  onRefresh
}) => {
  return (
    <div className="h-10 px-3 bg-[#f7edf7] border-b border-[#e5d0e8] flex items-center justify-between gap-3 select-none shrink-0 z-30">
      {/* Left Navigation Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          className="w-6 h-6 rounded-full bg-[#fce5f0] border border-[#f4a6b8]/40 flex items-center justify-center text-[#e08398] hover:bg-[#fad4e6] transition-colors"
          title="Bookmarks / Favorites"
        >
          <Star className="w-3.5 h-3.5 fill-[#f4a6b8] text-[#f4a6b8]" />
        </button>

        <button 
          className="w-6 h-6 rounded-full bg-[#eee2f5] border border-[#c9bcf6]/40 flex items-center justify-center text-[#7e69b5] hover:bg-[#e6d3f2] transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-3 h-3 stroke-[2.5]" />
        </button>

        <button 
          className="w-6 h-6 rounded-full bg-[#eee2f5] border border-[#c9bcf6]/40 flex items-center justify-center text-[#7e69b5] hover:bg-[#e6d3f2] transition-colors"
          title="Forward"
        >
          <ArrowRight className="w-3 h-3 stroke-[2.5]" />
        </button>

        <button 
          onClick={onRefresh}
          className="w-6 h-6 rounded-full bg-[#eee2f5] border border-[#c9bcf6]/40 flex items-center justify-center text-[#7e69b5] hover:bg-[#e6d3f2] transition-colors"
          title="Reload Page"
        >
          <RotateCw className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* Center URL Address Bar */}
      <div className="flex-1 max-w-2xl h-7 px-3 bg-[#ffffff] border border-[#ddcced] rounded-full flex items-center justify-between text-xs text-[#5a4d7d] shadow-inner">
        <div className="flex items-center gap-2 truncate">
          <Star className="w-3 h-3 text-[#f5bf42] fill-[#f5bf42] shrink-0" />
          <span className="font-medium tracking-wide truncate">
            pip.exe <span className="text-[#a599c2]">—</span> the midnight internet
          </span>
        </div>

        {/* Right URL Icons */}
        <div className="flex items-center gap-2 text-[#9f91c4] shrink-0">
          <span title="Midnight Security"><Moon className="w-3.5 h-3.5 text-[#735fb2]" /></span>
          <span title="Bookmarked"><Star className="w-3.5 h-3.5 text-[#f5bf42] fill-[#f5bf42]" /></span>
          <button 
            onClick={onToggleMute}
            className="hover:text-[#5a4d7d] transition-colors cursor-pointer"
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[#f4a6b8]" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#f4a6b8]" />
            )}
          </button>
        </div>
      </div>

      {/* Right spacer for balance */}
      <div className="w-6 hidden sm:block" />
    </div>
  );
};
