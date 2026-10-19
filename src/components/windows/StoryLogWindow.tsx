import React from 'react';
import { WindowFrame, WindowTheme } from '../WindowFrame';
import { BookOpen, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface StoryLogWindowProps {
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
  onOpenStoryReader: () => void;
}

export const StoryLogWindow: React.FC<StoryLogWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 100, y: 30 },
  initialSize = { width: 400, height: 180 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onOpenStoryReader
}) => {
  return (
    <WindowFrame
      id="story-log"
      title="STORY.LOG — ORIGIN OF PIP"
      icon={<BookOpen className="w-3.5 h-3.5 text-[#c9bcf6]" />}
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
      <div 
        onClick={() => {
          sound.playClick();
          onOpenStoryReader();
        }}
        className="flex items-center gap-3.5 cursor-pointer group p-1"
        title="Click to read Pip's full illustrated story chapters"
      >
        {/* Left Thumbnail Illustration */}
        <div className="w-24 h-20 rounded-lg overflow-hidden border border-[#c9bcf6]/35 relative shrink-0 shadow-md group-hover:scale-105 transition-transform">
          <img 
            src="/assets/story_origin.png" 
            alt="Origin of Pip story illustration" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c3d] via-[#2f2757] to-[#121429] flex flex-col items-center justify-center p-1 text-center -z-10">
            <span className="text-xl">🌙</span>
            <span className="text-[8px] font-pixel text-[#fde047]">STORY</span>
          </div>
        </div>

        {/* Right Descriptive Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-pixel text-[11px] text-[#fdfaf3] tracking-wider group-hover:text-[#fde047] transition-colors truncate">
            STORY.LOG — ORIGIN OF PIP
          </h4>
          <p className="text-[10px] text-stone-300 font-serif-dream italic mt-1 leading-snug">
            The true story of the Junior Dream Engineer and the Midnight Nursery.
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#c9bcf6] font-pixel">
            <Sparkles className="w-3 h-3 text-[#f4a6b8]" />
            <span>Click to browse chapters ✦</span>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
