import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, X, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

export type WindowTheme = 'blue' | 'pink' | 'purple' | 'cream';

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  theme?: WindowTheme;
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
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title,
  icon,
  theme = 'blue',
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 80, y: 30 },
  initialSize = { width: 440, height: 380 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  children
}) => {
  const [pos, setPos] = useState(initialPos);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Update initial pos when changed
  useEffect(() => {
    setPos(initialPos);
  }, [initialPos.x, initialPos.y]);

  if (!isOpen || isMinimized) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest('button')) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: pos.x,
      posY: pos.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = moveEvent.clientX - dragStart.current.x;
      const dy = moveEvent.clientY - dragStart.current.y;

      const newX = Math.max(10, Math.min(window.innerWidth - 120, dragStart.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, dragStart.current.posY + dy));

      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const themeStyles = {
    blue: {
      header: 'bg-gradient-to-r from-[#212952] via-[#2f3a6e] to-[#212952] text-[#fdfaf3] border-b border-[#c9bcf6]/35',
      title: 'text-[#fdfaf3]',
      body: 'bg-[#101734] text-[#fdfaf3]',
      footer: 'bg-[#0c122a] border-t border-[#c9bcf6]/20 text-[#c9bcf6]/80'
    },
    pink: {
      header: 'bg-gradient-to-r from-[#fbdbe7] via-[#fce4ee] to-[#fbdbe7] text-[#3e2437] border-b border-[#f4a6b8]/50',
      title: 'text-[#3e2437]',
      body: 'bg-[#fffdf8] text-[#2e1d2c]',
      footer: 'bg-[#fff5f8] border-t border-[#f4a6b8]/25 text-[#a37c95]'
    },
    purple: {
      header: 'bg-gradient-to-r from-[#c7b9f5] via-[#d6cbf9] to-[#c7b9f5] text-[#2b1f47] border-b border-[#b8a9e8]/50',
      title: 'text-[#2b1f47]',
      body: 'bg-[#ffffff] text-[#2b1f47]',
      footer: 'bg-[#f8f5ff] border-t border-[#b8a9e8]/30 text-[#736399]'
    },
    cream: {
      header: 'bg-gradient-to-r from-[#fdf6ea] via-[#fffbf2] to-[#fdf6ea] text-[#382b1c] border-b border-[#e2d5c5]',
      title: 'text-[#382b1c]',
      body: 'bg-[#fffdfa] text-[#382b1c]',
      footer: 'bg-[#fcf7ee] border-t border-[#e2d5c5]/40 text-[#8c7860]'
    }
  }[theme];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      onClick={onFocus}
      style={{
        zIndex,
        ...(isMaximized
          ? {
              left: 4,
              top: 4,
              width: 'calc(100% - 8px)',
              height: 'calc(100% - 8px)',
              position: 'absolute'
            }
          : isMobile
          ? {
              left: '8px',
              top: '16px',
              width: 'calc(100% - 16px)',
              maxWidth: 'calc(100vw - 16px)',
              maxHeight: 'calc(100vh - 120px)',
              position: 'absolute'
            }
          : {
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${initialSize.width}px`,
              maxWidth: 'calc(100vw - 24px)',
              maxHeight: 'calc(100vh - 120px)',
              position: 'absolute'
            })
      }}
      className={`rounded-xl border-2 border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col retro-window transition-shadow duration-150 ${themeStyles.body}`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-8 px-3 flex items-center justify-between select-none cursor-grab active:cursor-grabbing shrink-0 ${themeStyles.header}`}
      >
        <div className="flex items-center gap-2 overflow-hidden mr-2">
          {icon && <span className="text-xs shrink-0">{icon}</span>}
          <span className={`font-pixel text-[10px] tracking-wider truncate font-bold ${themeStyles.title}`}>
            {title}
          </span>
        </div>

        {/* Window Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onMinimize();
            }}
            className="w-5 h-5 rounded flex items-center justify-center bg-black/10 hover:bg-black/20 text-current transition-colors cursor-pointer retro-button"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onToggleMaximize();
            }}
            className="hidden sm:flex w-5 h-5 rounded items-center justify-center bg-black/10 hover:bg-black/20 text-current transition-colors cursor-pointer retro-button"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <RotateCcw className="w-2 h-2" /> : <Square className="w-2 h-2" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onClose();
            }}
            className="w-5 h-5 rounded flex items-center justify-center bg-[#f4a6b8] hover:bg-[#ff94aa] text-white shadow-sm transition-colors cursor-pointer retro-button"
            title="Close"
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-auto p-3">
        {children}
      </div>

      {/* Footer Status Bar */}
      <div className={`h-5 px-3 flex items-center justify-between text-[9px] font-mono select-none shrink-0 ${themeStyles.footer}`}>
        <span className="tracking-wider">MIDNIGHT_OS // PIP_WORKSPACE</span>
        <span className="flex items-center gap-1 font-semibold text-[#f5bf42]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f5bf42] inline-block animate-pulse" />
          ONLINE
        </span>
      </div>
    </div>
  );
};
