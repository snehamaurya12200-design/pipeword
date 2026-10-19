import React from 'react';
import { Monitor, Music2, Lamp, MapPin, FileText, KeyRound, Folder } from 'lucide-react';
import { AppId } from '../types/os';
import { sound } from '../utils/audio';

interface DesktopIconsProps {
  onOpenApp: (id: AppId) => void;
  activeAppId: AppId | null;
}

interface DesktopShortcut {
  id: AppId;
  name: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const SHORTCUTS: DesktopShortcut[] = [
  {
    id: 'dream-engine',
    name: 'Dream Engine.exe',
    icon: <Monitor className="w-6 h-6 text-[#2b1f47]" />,
    bgGradient: 'from-[#b29de8] to-[#8d75cf]'
  },
  {
    id: 'lullaby-lab',
    name: 'Lullaby Lab.mp3',
    icon: <Music2 className="w-6 h-6 text-[#4a1824]" />,
    bgGradient: 'from-[#fbaab4] to-[#f47f91]'
  },
  {
    id: 'nightlight-studio',
    name: 'Nightlight.app',
    icon: <Lamp className="w-6 h-6 text-[#423118]" />,
    bgGradient: 'from-[#fef3c7] to-[#fde047]'
  },
  {
    id: 'dream-routes',
    name: 'Dream Routes.map',
    icon: <MapPin className="w-6 h-6 text-[#14325c]" />,
    bgGradient: 'from-[#93c5fd] to-[#60a5fa]'
  },
  {
    id: 'pip-story',
    name: "Pip's Story.txt",
    icon: <FileText className="w-6 h-6 text-[#4a2e1d]" />,
    bgGradient: 'from-[#fed7aa] to-[#fca5a5]'
  },
  {
    id: 'slumber-vault',
    name: 'Secret.exe',
    icon: <KeyRound className="w-6 h-6 text-[#422c07]" />,
    bgGradient: 'from-[#fef08a] to-[#eab308]'
  },
  {
    id: 'asset-inspector',
    name: 'Assets',
    icon: <Folder className="w-6 h-6 text-[#453112]" />,
    bgGradient: 'from-[#fed7aa] to-[#f59e0b]'
  }
];

export const DesktopIcons: React.FC<DesktopIconsProps> = ({
  onOpenApp,
  activeAppId
}) => {
  return (
    <aside className="w-20 md:w-24 flex flex-col items-center gap-3 py-2 px-1 z-20 select-none shrink-0">
      {SHORTCUTS.map((item, index) => {
        const isSelected = activeAppId === item.id;
        return (
          <button
            key={`${item.name}-${index}`}
            onClick={() => {
              sound.playClick();
              onOpenApp(item.id);
            }}
            className={`flex flex-col items-center justify-center p-1 rounded-lg text-center w-full group transition-transform hover:scale-105 cursor-pointer ${
              isSelected ? 'bg-white/10 ring-1 ring-white/30' : ''
            }`}
          >
            {/* Retro Rounded App Tile */}
            <div 
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.bgGradient} border-2 border-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              {item.icon}
            </div>

            {/* Label below icon */}
            <span className="font-pixel text-[9px] text-[#ffffff] mt-1 tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 max-w-[80px]">
              {item.name}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
