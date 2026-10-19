import React from 'react';

export const DesktopWallpaper: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* 1. Deep Midnight Twilight Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #090e24 0%, #151a3d 25%, #2a204e 50%, #442a5c 75%, #593566 100%)'
        }}
      />

      {/* 2. Soft Pastel Glowing Cloud Formations across bottom and sides */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          background: 'radial-gradient(ellipse at 85% 75%, rgba(244, 166, 184, 0.45) 0%, rgba(254, 215, 170, 0.3) 30%, transparent 70%), radial-gradient(ellipse at 20% 85%, rgba(184, 169, 232, 0.4) 0%, rgba(244, 166, 184, 0.25) 35%, transparent 70%)'
        }}
      />

      {/* 3. Glowing Golden Crescent Moon in Top Right Corner */}
      <div className="absolute top-4 right-6 w-24 h-20 drop-shadow-[0_0_25px_rgba(253,224,71,0.5)]">
        <img
          src="/assets/sleeping_moon.png"
          alt="Midnight crescent moon"
          className="w-full h-full object-contain [image-rendering:pixelated]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* 4. Scattered Twinkling Constellations & 4-Point Stars */}
      <div className="absolute inset-0">
        {/* Star 1 */}
        <div className="absolute top-12 left-1/4 text-[#fde047] text-sm animate-pulse">✦</div>
        {/* Star 2 */}
        <div className="absolute top-28 left-1/2 text-[#ffffff] text-xs">✦</div>
        {/* Star 3 */}
        <div className="absolute top-20 right-1/3 text-[#f4a6b8] text-sm animate-ping" style={{ animationDuration: '3s' }}>✦</div>
        {/* Star 4 */}
        <div className="absolute top-44 right-1/5 text-[#fde047] text-xs">✦</div>
        {/* Star 5 */}
        <div className="absolute bottom-36 left-1/3 text-[#c9bcf6] text-sm animate-pulse">✦</div>
        {/* Star 6 */}
        <div className="absolute bottom-28 right-1/4 text-[#fef08a] text-xs">✦</div>
        {/* Star 7 */}
        <div className="absolute top-36 left-1/6 text-[#ffffff] text-xs opacity-75">✦</div>
        {/* Star 8 */}
        <div className="absolute bottom-48 right-1/3 text-[#f4a6b8] text-xs">✦</div>

        {/* Tiny golden stardust points */}
        <div className="absolute top-16 left-1/3 w-1 h-1 rounded-full bg-[#fde047] opacity-80" />
        <div className="absolute top-24 left-2/3 w-1 h-1 rounded-full bg-[#ffffff] opacity-70" />
        <div className="absolute top-40 right-12 w-1.5 h-1.5 rounded-full bg-[#fde047] opacity-90 animate-pulse" />
        <div className="absolute bottom-40 left-12 w-1 h-1 rounded-full bg-[#ffffff] opacity-60" />
        <div className="absolute bottom-32 left-1/2 w-1.5 h-1.5 rounded-full bg-[#f4a6b8] opacity-80" />
        <div className="absolute top-8 left-3/4 w-1 h-1 rounded-full bg-[#fde047] opacity-75" />
      </div>
    </div>
  );
};
