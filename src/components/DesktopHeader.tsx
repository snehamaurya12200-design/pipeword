import React from 'react';
import { Star, FolderKanban } from 'lucide-react';
import { AppId } from '../types/os';
import { sound } from '../utils/audio';

interface DesktopHeaderProps {
  onOpenApp: (id: AppId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeAppId: AppId | null;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  onOpenApp,
  isMuted,
  onToggleMute,
  activeAppId
}) => {
  return (
    <header className="h-11 px-4 bg-[#090e24]/95 border-b border-[#232b55] flex items-center justify-between gap-4 select-none z-20 shrink-0">
      {/* Brand Zone */}
      <div 
        onClick={() => {
          sound.playClick();
          onOpenApp('pip-profile');
        }}
        className="flex items-center gap-2 cursor-pointer group whitespace-nowrap shrink-0"
        title="View Pip's Profile"
      >
        <div className="w-6 h-6 rounded bg-[#202952] border border-[#c9bcf6]/40 flex items-center justify-center text-xs text-[#fde047] shadow-sm">
          🌙
        </div>
        <span className="font-pixel text-xs text-[#fdfaf3] tracking-widest font-bold">
          PIP.EXE
        </span>
      </div>

      {/* Navigation Buttons */}
      <nav className="flex items-center gap-1.5 md:gap-2 text-xs text-[#c9bcf6] font-medium overflow-x-auto py-1">
        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('dream-engine');
          }}
          className={`px-3 py-1 rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeAppId === 'dream-engine'
              ? 'bg-[#253059] text-[#fdfaf3] border border-[#c9bcf6]/40'
              : 'hover:bg-[#151c3d] text-stone-200'
          }`}
        >
          Dream Engine
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('lullaby-lab');
          }}
          className={`px-3 py-1 rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeAppId === 'lullaby-lab'
              ? 'bg-[#253059] text-[#fdfaf3] border border-[#c9bcf6]/40'
              : 'hover:bg-[#151c3d] text-stone-200'
          }`}
        >
          Lullaby Lab
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('nightlight-studio');
          }}
          className={`px-3 py-1 rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeAppId === 'nightlight-studio'
              ? 'bg-[#253059] text-[#fdfaf3] border border-[#c9bcf6]/40'
              : 'hover:bg-[#151c3d] text-stone-200'
          }`}
        >
          Nightlight Studio
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('pip-story');
          }}
          className={`px-3 py-1 rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeAppId === 'pip-story'
              ? 'bg-[#253059] text-[#fdfaf3] border border-[#c9bcf6]/40'
              : 'hover:bg-[#151c3d] text-stone-200'
          }`}
        >
          Pip's Story
        </button>

        {/* Slumber Vault (Active Pink Pill as shown in reference) */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('slumber-vault');
          }}
          className={`px-3.5 py-1 rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer font-medium ${
            activeAppId === 'slumber-vault'
              ? 'bg-[#f49db2] hover:bg-[#ffadbf] text-[#2c1527] font-bold shadow-sm'
              : 'bg-[#253059] text-stone-200 hover:bg-[#344278]'
          }`}
        >
          Slumber Vault
        </button>
      </nav>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Chimes: ON pill button */}
        <button
          onClick={onToggleMute}
          className="px-3 py-1 rounded-full bg-[#fde5ec] hover:bg-[#fbd0de] text-[#2e1c28] border border-[#f4a6b8]/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          title={isMuted ? 'Turn chimes on' : 'Mute chimes'}
        >
          <Star className="w-3.5 h-3.5 text-[#f5a83b] fill-[#f5a83b]" />
          <span className="font-sans text-[11px] font-bold">
            {isMuted ? 'Chimes: OFF' : 'Chimes: ON'}
          </span>
        </button>

        {/* Official Asset Slot button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenApp('asset-inspector');
          }}
          className="hidden sm:flex px-3 py-1 rounded-md bg-[#131b38] hover:bg-[#1d274f] border border-[#c9bcf6]/35 text-[#fdfaf3] text-xs font-pixel items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          title="Inspect Official Hackathon Assets"
        >
          <FolderKanban className="w-3.5 h-3.5 text-[#c9bcf6]" />
          <span className="text-[11px]">Official Asset Slot</span>
        </button>
      </div>
    </header>
  );
};
