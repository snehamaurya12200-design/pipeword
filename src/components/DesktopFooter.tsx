import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Wifi, BatteryCharging, Star, CloudSun } from 'lucide-react';
import { AppId } from '../types/os';
import { sound } from '../utils/audio';

interface DesktopFooterProps {
  onToggleWindow: (id: AppId) => void;
  onOpenCredits: () => void;
  onReboot?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeAppId: AppId | null;
}

interface TaskbarTab {
  id: AppId;
  label: string;
  icon: string;
}

const TABS: TaskbarTab[] = [
  { id: 'pip-profile', label: 'Pip · ...', icon: '🌙' },
  { id: 'dream-engine', label: 'Dream...', icon: '🧪' },
  { id: 'lullaby-lab', label: 'Lullaby...', icon: '🔔' },
  { id: 'nightlight-studio', label: 'Nightli...', icon: '💡' },
  { id: 'pip-story', label: 'Story...', icon: '📖' },
  { id: 'dream-routes', label: 'Routes...', icon: '📍' },
  { id: 'slumber-vault', label: 'Vault...', icon: '🗝️' }
];

export const DesktopFooter: React.FC<DesktopFooterProps> = ({
  onToggleWindow,
  onOpenCredits,
  onReboot,
  isMuted,
  onToggleMute,
  activeAppId
}) => {
  const [timeStr, setTimeStr] = useState('10:48 PM');
  const [dateStr, setDateStr] = useState('18 Oct 2026');
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openAppFromStart = (id: AppId) => {
    sound.playClick();
    onToggleWindow(id);
    setIsStartOpen(false);
  };

  return (
    <>
      {/* 2000s Start / Sleep Menu Popup */}
      {isStartOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-11 left-3 w-64 bg-[#0e152d] border-2 border-[#c9bcf6]/40 rounded-t-xl rounded-br-xl shadow-2xl z-40 overflow-hidden retro-window animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex">
            <div className="w-8 bg-gradient-to-t from-[#1b1535] via-[#2d224d] to-[#45376d] border-r border-[#c9bcf6]/20 flex items-end justify-center pb-4">
              <span className="font-pixel text-[9px] text-[#f4a6b8] -rotate-90 whitespace-nowrap tracking-widest font-bold">
                MIDNIGHT_OS
              </span>
            </div>

            <div className="flex-1 p-2 space-y-1 text-xs text-[#fdfaf3]">
              <div className="px-2 py-1.5 border-b border-[#c9bcf6]/20 mb-1">
                <span className="font-pixel text-[11px] text-[#fde047] block font-bold">Pip's Terminal</span>
                <span className="text-[10px] text-[#c9bcf6] font-mono">Junior Dream Engineer</span>
              </div>

              <button
                onClick={() => openAppFromStart('pip-profile')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>🌙</span>
                <span>Pip's Credentials</span>
              </button>

              <button
                onClick={() => openAppFromStart('dream-engine')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>🧪</span>
                <span>Dream Engine</span>
              </button>

              <button
                onClick={() => openAppFromStart('lullaby-lab')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>🔔</span>
                <span>Lullaby Lab</span>
              </button>

              <button
                onClick={() => openAppFromStart('nightlight-studio')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>💡</span>
                <span>Nightlight Studio</span>
              </button>

              <button
                onClick={() => openAppFromStart('pip-story')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>📖</span>
                <span>Pip's Story</span>
              </button>

              <button
                onClick={() => openAppFromStart('dream-routes')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>📍</span>
                <span>Dream Routes Map</span>
              </button>

              <button
                onClick={() => openAppFromStart('slumber-vault')}
                className="w-full px-2 py-1 text-xs text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 cursor-pointer"
              >
                <span>🗝️</span>
                <span>The Slumber Vault</span>
              </button>

              <div className="pt-1 mt-1 border-t border-[#c9bcf6]/20 space-y-0.5">
                <button
                  onClick={() => openAppFromStart('asset-inspector')}
                  className="w-full px-2 py-1 text-[11px] text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 text-[#f4a6b8] cursor-pointer"
                >
                  <span>📁</span>
                  <span>Official Character Assets</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenCredits();
                    setIsStartOpen(false);
                  }}
                  className="w-full px-2 py-1 text-[11px] text-left rounded hover:bg-[#1f2a4e] flex items-center gap-2 text-[#c9bcf6] cursor-pointer"
                >
                  <span>🏆</span>
                  <span>Hackathon Credits</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onReboot?.();
                    setIsStartOpen(false);
                  }}
                  className="w-full px-2 py-1 text-[11px] text-left rounded hover:bg-[#3d1928] flex items-center gap-2 text-rose-300 cursor-pointer"
                >
                  <span>↻</span>
                  <span>Restart / Boot Screen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="h-10 px-3 bg-gradient-to-r from-[#f8edf8] via-[#f2e6f4] to-[#f8edf8] border-t border-[#e3d0e8] flex items-center justify-between gap-3 select-none shrink-0 z-30 text-[#422e49]">
        {/* Left: Start Button + Weather Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsStartOpen(!isStartOpen);
            }}
            className={`h-7 px-3 rounded-full font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm ${
              isStartOpen ? 'bg-[#e07d93] text-white' : 'bg-[#f4a6b8] hover:bg-[#ff9bb1] text-[#2c1424]'
            }`}
          >
            <span className="text-xs">⭐</span>
            <span className="font-sans font-bold">Start</span>
          </button>

        {/* Weather Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/70 border border-[#dfcce6] text-[11px] font-sans text-[#5c4063]">
          <CloudSun className="w-3.5 h-3.5 text-[#e0933d]" />
          <span>28°C</span>
          <span className="text-[10px] text-[#8f7496]">Partly cloudy</span>
        </div>
      </div>

      {/* Center: Open Window Tabs */}
      <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto py-1">
        {TABS.map((tab, idx) => {
          const isActive = activeAppId === tab.id;
          return (
            <button
              key={`${tab.id}-${idx}`}
              onClick={() => {
                sound.playClick();
                onToggleWindow(tab.id);
              }}
              className={`h-7 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2c1424] border-[#f4a6b8] shadow-sm font-semibold'
                  : 'bg-white/50 border-[#dfcce6] hover:bg-white/80 text-[#5c4063]'
              }`}
            >
              <span className="text-xs">{tab.icon}</span>
              <span className="text-[11px] font-sans">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: System Tray & Clock */}
      <div className="flex items-center gap-2.5 shrink-0 text-xs">
        {/* System Icons */}
        <div className="flex items-center gap-2 text-[#73587a]">
          <button
            onClick={onToggleMute}
            className="hover:text-[#2c1424] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#f4a6b8]" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span title="Connected to Midnight Nursery"><Wifi className="w-3.5 h-3.5" /></span>
          <span title="Lunar Battery: 100%"><BatteryCharging className="w-3.5 h-3.5 text-[#3bb074]" /></span>
          <button
            onClick={onOpenCredits}
            className="hover:text-[#e0933d] transition-colors cursor-pointer"
            title="Credits"
          >
            <Star className="w-3.5 h-3.5 text-[#e0933d] fill-[#e0933d]" />
          </button>
        </div>

        {/* Digital Clock with Time & Date */}
        <div className="flex flex-col items-end font-mono leading-tight pl-1 border-l border-[#dfcce6]">
          <span className="text-[11px] font-bold text-[#35253d] tabular-nums">
            {timeStr}
          </span>
          <span className="text-[9px] text-[#876a91] tracking-tight">
            {dateStr}
          </span>
        </div>
      </div>
    </footer>
    </>
  );
};
