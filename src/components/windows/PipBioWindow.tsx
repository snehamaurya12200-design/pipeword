import React from 'react';
import { WindowFrame } from '../WindowFrame';
import { PipCharacter } from '../PipCharacter';
import { Moon } from 'lucide-react';

interface PipBioWindowProps {
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
  onOpenAssetInspector: () => void;
  customAssetUrl?: string | null;
}

export const PipBioWindow: React.FC<PipBioWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 520, y: 30 },
  initialSize = { width: 440, height: 430 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onOpenAssetInspector,
  customAssetUrl
}) => {
  return (
    <WindowFrame
      id="pip-bio"
      title="PIP — JUNIOR DREAM ENGINEER"
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
      <div className="flex flex-col items-center text-center space-y-2">
        {/* Top Right Credentials Badge */}
        <div className="w-full flex justify-end">
          <span className="px-2.5 py-0.5 rounded-full bg-[#fde047]/20 border border-[#fde047]/60 text-[9px] font-pixel text-[#fde047] font-bold">
            OFFICIAL NURSERY CREDENTIALS
          </span>
        </div>

        {/* Identity Headings */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide text-[#fdfaf3]">
            Pip
          </h2>
          <p className="text-xs text-[#c9bcf6] font-medium tracking-wide">
            Junior Dream Engineer · Midnight Nursery
          </p>
          <p className="text-xs font-serif-dream italic text-stone-200 mt-1">
            "I build the dreams you fall asleep inside."
          </p>
        </div>

        {/* Character Illustration with the Lantern and Cloud */}
        <div className="my-1">
          <PipCharacter
            size="md"
            showBadge={true}
            onOpenAssetInspector={onOpenAssetInspector}
            customAssetUrl={customAssetUrl}
          />
        </div>

        {/* Pip's Quote Bubble Card */}
        <div className="p-3 bg-[#151c3c] border border-[#c9bcf6]/30 rounded-xl text-left text-xs shadow-md max-w-sm">
          <p className="font-serif-dream italic text-stone-200 text-[11px] leading-relaxed">
            "Oh! Hello there, sleepy traveler... *yawns softly* Welcome to my midnight computer! While everyone in the waiting world is asleep, I sit up here among the moonbeams, stitching together clouds, mixing lullabies and lights, and turning up music boxes so you have wonderful dreams to wake up from."
          </p>
        </div>
      </div>
    </WindowFrame>
  );
};
