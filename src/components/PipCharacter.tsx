import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface PipCharacterProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showTagline?: boolean;
  interactiveSpeech?: boolean;
  onOpenAssetInspector?: () => void;
  customAssetUrl?: string | null;
}

export const PipCharacter: React.FC<PipCharacterProps> = ({
  size = 'md',
  showBadge = true,
  onOpenAssetInspector,
  customAssetUrl
}) => {
  const [isLanternGlow, setIsLanternGlow] = useState(false);

  const handleInteract = () => {
    sound.playClick();
    setIsLanternGlow(true);
    setTimeout(() => setIsLanternGlow(false), 800);
  };

  const dim = {
    sm: 'w-28 h-28',
    md: 'w-44 h-44',
    lg: 'w-56 h-56'
  }[size];

  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col items-center select-none text-center">
      <div 
        onClick={handleInteract}
        className={`relative ${dim} flex items-center justify-center cursor-pointer group transition-transform duration-300 hover:scale-105`}
        title="Pip - Junior Dream Engineer (Click to illuminate lantern!)"
      >
        {/* Soft magical star sparkles around Pip */}
        <div className="absolute top-2 right-4 text-[#fde047] text-xs animate-pulse">✦</div>
        <div className="absolute top-10 left-3 text-[#f4a6b8] text-xs animate-bounce">✦</div>
        <div className="absolute bottom-10 right-2 text-[#c9bcf6] text-xs animate-ping">✦</div>

        {/* 1. Official Supplied Character PNG with Pixel-Art Crispness */}
        {!imgError ? (
          <img
            src={customAssetUrl || "/assets/pip-waving-cloud.png"}
            alt="Pip - Junior Dream Engineer (Official Character)"
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-fidelity Vector Fallback matching the official character specifications */
          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
          >
          <defs>
            {/* Shading Gradients */}
            <radialGradient id="pipSkullGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fdfaf3" />
              <stop offset="100%" stopColor="#e2d8cd" />
            </radialGradient>

            <linearGradient id="cloudBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f3edf9" />
              <stop offset="100%" stopColor="#d5c8ed" />
            </linearGradient>

            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#352e59" />
              <stop offset="60%" stopColor="#252044" />
              <stop offset="100%" stopColor="#181430" />
            </linearGradient>

            <radialGradient id="lanternLightGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="90%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>

            <filter id="lanternGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Fluffy Lavender/Cream Cumulus Cloud Base */}
          <g>
            <ellipse cx="100" cy="160" rx="72" ry="24" fill="url(#cloudBaseGrad)" />
            <circle cx="56" cy="154" r="22" fill="url(#cloudBaseGrad)" />
            <circle cx="94" cy="148" r="26" fill="url(#cloudBaseGrad)" />
            <circle cx="134" cy="150" r="24" fill="url(#cloudBaseGrad)" />
            <circle cx="156" cy="158" r="18" fill="url(#cloudBaseGrad)" />

            {/* Cloud highlight puffs */}
            <ellipse cx="94" cy="146" rx="18" ry="8" fill="#ffffff" opacity="0.6" />
            <ellipse cx="58" cy="152" rx="14" ry="6" fill="#ffffff" opacity="0.5" />
            <ellipse cx="136" cy="148" rx="14" ry="7" fill="#ffffff" opacity="0.5" />
          </g>

          {/* 2. Cozy Navy Pajama Suit */}
          <path 
            d="M 80 125 C 75 142, 80 152, 100 152 C 120 152, 125 142, 120 125 Z" 
            fill="#232746" 
          />
          {/* Dusty Pink Collar */}
          <path 
            d="M 82 125 C 80 134, 120 134, 118 125 Z" 
            fill="#f4a6b8" 
          />

          {/* 3. Smooth Round Cute Skull Head */}
          <ellipse 
            cx="100" 
            cy="88" 
            rx="42" 
            ry="40" 
            fill="url(#pipSkullGrad)" 
          />

          {/* Soft round cheek blush */}
          <ellipse cx="76" cy="98" rx="12" ry="8" fill="#f4a6b8" opacity="0.32" />
          <ellipse cx="124" cy="98" rx="12" ry="8" fill="#f4a6b8" opacity="0.32" />

          {/* Large soft dark eye sockets */}
          <ellipse cx="83" cy="85" rx="11" ry="12" fill="#151b34" />
          <ellipse cx="117" cy="85" rx="11" ry="12" fill="#151b34" />

          {/* Warm glowing pinpricks of star light inside eyes */}
          <circle cx="84" cy="84" r="3.2" fill="#fde047" />
          <circle cx="85.2" cy="83" r="1.2" fill="#ffffff" />
          <circle cx="118" cy="84" r="3.2" fill="#fde047" />
          <circle cx="119.2" cy="83" r="1.2" fill="#ffffff" />

          {/* Tiny cute nose cavity */}
          <ellipse cx="100" cy="94" rx="2" ry="2.8" fill="#2e2b3c" opacity="0.75" />

          {/* Tiny crooked friendly smile */}
          <path 
            d="M 91 103 Q 97 109, 109 105 Q 112 104, 114 102" 
            fill="none" 
            stroke="#2c2440" 
            strokeWidth="2.4" 
            strokeLinecap="round" 
          />

          {/* 4. Bedtime Nightcap */}
          {/* Cone drooping to the right */}
          <path 
            d="M 62 76 C 58 45, 112 18, 142 32 C 162 42, 172 70, 168 96 C 167 100, 159 100, 160 94 C 163 74, 154 52, 136 42 C 114 30, 78 48, 70 76 Z" 
            fill="url(#capGrad)" 
          />
          {/* Pink Brim Band */}
          <path 
            d="M 60 76 C 75 66, 125 66, 140 76 C 136 84, 64 84, 60 76 Z" 
            fill="#f4a6b8" 
          />

          {/* Stars decorated on nightcap */}
          <path d="M 108 38 L 110 42 L 114 43 L 111 46 L 112 50 L 108 47 L 104 50 L 105 46 L 102 43 L 106 42 Z" fill="#fde047" />
          <path d="M 132 46 L 133.5 49 L 137 50 L 134.5 52 L 135.5 55 L 132 53 L 128.5 55 L 129.5 52 L 127 50 L 130.5 49 Z" fill="#fde047" opacity="0.9" />
          <circle cx="152" cy="65" r="2.2" fill="#fde047" />
          <circle cx="86" cy="56" r="1.8" fill="#fde047" />

          {/* Small Pink Bow on Nightcap */}
          <g transform="translate(160, 92) scale(0.75)">
            <ellipse cx="-7" cy="0" rx="7" ry="5" fill="#f4a6b8" stroke="#d4798e" strokeWidth="1" />
            <ellipse cx="7" cy="0" rx="7" ry="5" fill="#f4a6b8" stroke="#d4798e" strokeWidth="1" />
            <circle cx="0" cy="0" r="3.5" fill="#e08398" />
            <path d="M -3 3 L -7 12 L -2 10 Z" fill="#f4a6b8" />
            <path d="M 3 3 L 7 12 L 2 10 Z" fill="#f4a6b8" />
          </g>

          {/* 5. Left Arm holding the Antique Golden Lantern */}
          {/* Left arm reaching down */}
          <path 
            d="M 76 125 C 68 128, 62 135, 60 142" 
            fill="none" 
            stroke="#232746" 
            strokeWidth="9" 
            strokeLinecap="round" 
          />
          {/* Pink cuff */}
          <circle cx="60" cy="142" r="5" fill="#f4a6b8" />
          {/* Little bone hand */}
          <circle cx="58" cy="144" r="4.5" fill="#fdfaf3" />

          {/* The Lantern */}
          <g transform="translate(48, 136)" className={isLanternGlow ? 'scale-110' : ''}>
            {/* Hanging chain / handle */}
            <path d="M 10 8 C 10 2, 10 2, 10 12" stroke="#b48c36" strokeWidth="1.8" fill="none" />
            {/* Lantern top cap */}
            <path d="M 5 12 L 15 12 L 13 16 L 7 16 Z" fill="#916c20" />
            {/* Lantern glass frame */}
            <rect x="5" y="16" width="10" height="15" rx="1.5" fill="#5c4514" />
            {/* Glowing amber light inside */}
            <rect x="6.5" y="17.5" width="7" height="12" rx="1" fill="url(#lanternLightGrad)" filter="url(#lanternGlowFilter)" />
            {/* Bottom rim */}
            <rect x="4" y="31" width="12" height="3" rx="1" fill="#916c20" />
          </g>

          {/* Right resting hand */}
          <ellipse cx="128" cy="134" rx="5" ry="6" fill="#fdfaf3" />
        </svg>
        )}
      </div>

      {/* Official Asset Path pill as shown in reference image */}
      {showBadge && (
        <div 
          onClick={onOpenAssetInspector}
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#20193e] border border-[#a28cd4]/50 text-[10px] text-[#d6c9f2] font-mono shadow-sm cursor-pointer hover:border-[#f4a6b8] transition-colors"
          title="Official Supplied Asset Path"
        >
          <span className="text-xs">📁</span>
          <span>assets/pip-waving-cloud.png</span>
        </div>
      )}
    </div>
  );
};
