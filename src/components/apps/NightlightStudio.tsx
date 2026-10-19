import React, { useState, useEffect } from 'react';
import { Lightbulb, Moon, Sparkles, Sun, Timer, Eye } from 'lucide-react';
import { NightlightMode, NightlightSettings } from '../../types/os';
import { sound } from '../../utils/audio';

interface NightlightStudioProps {
  settings: NightlightSettings;
  onUpdateSettings: (settings: NightlightSettings) => void;
}

const MODES: { id: NightlightMode; name: string; color: string; hex: string; desc: string }[] = [
  {
    id: 'moon-pearl',
    name: 'Moon Pearl',
    color: 'from-[#fdfaf3]/30 to-[#c9bcf6]/20',
    hex: '#fdfaf3',
    desc: 'Pure soft lunar luminescence for peaceful drifting off.'
  },
  {
    id: 'amber-firefly',
    name: 'Amber Firefly',
    color: 'from-[#fde047]/35 to-[#f7c06d]/25',
    hex: '#f7c06d',
    desc: 'Cozy warm lantern glow mimicking fireflies caught in sugar glass.'
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    color: 'from-[#70e000]/20 to-[#48cae4]/25',
    hex: '#48cae4',
    desc: 'Gentle green-cyan northern ripples floating across cloud ceilings.'
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    color: 'from-[#f4a6b8]/35 to-[#b8a9e8]/20',
    hex: '#f4a6b8',
    desc: 'Soft strawberry-milk glow, comforting and sleepy.'
  },
  {
    id: 'twilight-indigo',
    name: 'Twilight Indigo',
    color: 'from-[#1e295d]/60 to-[#0a0f24]',
    hex: '#2e3a75',
    desc: 'Deep velvety midnight shade for total darkness with a tiny pilot light.'
  }
];

const CONSTELLATIONS = [
  {
    id: 'sleepy-bear',
    name: 'The Sleepy Bear',
    stars: [
      { x: 30, y: 40 },
      { x: 45, y: 35 },
      { x: 60, y: 45 },
      { x: 75, y: 55 },
      { x: 55, y: 70 },
      { x: 35, y: 65 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]]
  },
  {
    id: 'cloud-kitten',
    name: 'The Cloud Kitten',
    stars: [
      { x: 25, y: 30 },
      { x: 40, y: 25 },
      { x: 50, y: 40 },
      { x: 70, y: 45 },
      { x: 65, y: 70 },
      { x: 35, y: 65 },
      { x: 20, y: 50 }
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [2, 5]]
  },
  {
    id: 'dream-sailboat',
    name: 'The Starlight Sailboat',
    stars: [
      { x: 50, y: 20 },
      { x: 50, y: 60 },
      { x: 75, y: 55 },
      { x: 80, y: 75 },
      { x: 20, y: 75 },
      { x: 35, y: 60 }
    ],
    lines: [[0, 1], [0, 2], [1, 2], [4, 3], [4, 5], [3, 2]]
  }
];

export const NightlightStudio: React.FC<NightlightStudioProps> = ({
  settings,
  onUpdateSettings
}) => {
  const [selectedConstellation, setSelectedConstellation] = useState(CONSTELLATIONS[0]);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);

  // Sleep Timer countdown
  useEffect(() => {
    if (settings.sleepTimerMinutes === null) {
      setTimerRemaining(null);
      return;
    }
    setTimerRemaining(settings.sleepTimerMinutes * 60);
  }, [settings.sleepTimerMinutes]);

  useEffect(() => {
    if (timerRemaining === null || timerRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          // Timer finished: dim brightness to 10%
          onUpdateSettings({ ...settings, brightness: 10, sleepTimerMinutes: null });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRemaining, settings, onUpdateSettings]);

  const setMode = (mode: NightlightMode) => {
    sound.playClick();
    onUpdateSettings({ ...settings, mode });
  };

  const setBrightness = (b: number) => {
    onUpdateSettings({ ...settings, brightness: b });
  };

  const toggleProjector = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, projectorActive: !settings.projectorActive });
  };

  const setSleepTimer = (mins: number | null) => {
    sound.playClick();
    onUpdateSettings({ ...settings, sleepTimerMinutes: mins });
  };

  const currentModeObj = MODES.find((m) => m.id === settings.mode) || MODES[0];

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/pip_dream_lantern.png"
            alt="Dream Nightlight Lantern"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(253,224,71,0.5)] shrink-0"
          />
          <div>
            <h3 className="font-pixel text-xs text-[#fde047] tracking-wider uppercase">
              NIGHTLIGHT_STUDIO.SYS // SPECTRAL ILLUMINATOR
            </h3>
            <p className="text-xs text-[#c9bcf6]">
              Tune ambient bedtime wavelengths and project ceiling constellations.
            </p>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-3 text-xs font-mono-code">
          <span className="text-stone-300">Glow:</span>
          <span className="px-2 py-0.5 rounded bg-[#090d1c] border border-[#c9bcf6]/30 text-[#fde047] font-bold">
            {settings.brightness}% Lumens
          </span>
          {timerRemaining !== null && (
            <span className="text-[#f4a6b8] flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" />
              {Math.floor(timerRemaining / 60)}:{(timerRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Spectrum Selector & Brightness (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Spectrum Swatches */}
          <div className="bg-[#11172f] border border-[#c9bcf6]/25 rounded-lg p-3.5 shadow-xl">
            <span className="font-pixel text-[10px] text-[#c9bcf6] uppercase tracking-wider block mb-2.5">
              Dream Lighting Spectra
            </span>
            <div className="space-y-2">
              {MODES.map((mode) => {
                const isActive = settings.mode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setMode(mode.id)}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all retro-button cursor-pointer ${
                      isActive
                        ? 'bg-[#222d56] border-[#fde047] shadow-[0_0_12px_rgba(253,224,71,0.2)]'
                        : 'bg-[#151c38] border-[#c9bcf6]/20 hover:bg-[#1e274c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: mode.hex }}
                        className="w-5 h-5 rounded-full border border-white/50 shadow-inner shrink-0"
                      />
                      <div>
                        <span className="text-xs font-medium text-[#fdfaf3] block">
                          {mode.name}
                        </span>
                        <span className="text-[10px] text-stone-300">
                          {mode.desc}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-pixel text-[#fde047] shrink-0 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimmer & Sleep Timer */}
          <div className="bg-[#11172f] border border-[#c9bcf6]/25 rounded-lg p-3.5 shadow-xl space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-pixel text-[10px] text-[#c9bcf6]">
                  Luminance Intensity
                </span>
                <span className="font-mono-code text-[#fde047]">{settings.brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-[#fde047] cursor-pointer"
              />
            </div>

            {/* Sleep Timer Preset Buttons */}
            <div className="pt-2 border-t border-[#c9bcf6]/15 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] font-pixel text-[#c9bcf6] flex items-center gap-1">
                <Timer className="w-3 h-3 text-[#f4a6b8]" />
                Auto-Dim Sleep Timer:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Off', val: null },
                  { label: '5m', val: 5 },
                  { label: '15m', val: 15 },
                  { label: '30m', val: 30 }
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSleepTimer(t.val)}
                    className={`px-2 py-0.5 text-xs rounded border transition-colors retro-button ${
                      settings.sleepTimerMinutes === t.val
                        ? 'bg-[#f4a6b8] text-[#090d1c] font-bold border-white'
                        : 'bg-[#182142] text-[#fdfaf3] border-[#c9bcf6]/25 hover:border-[#f4a6b8]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Constellation Ceiling Projector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="bg-[#121933] border border-[#c9bcf6]/30 rounded-lg p-3.5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#c9bcf6]/20 pb-2 mb-3">
                <span className="font-pixel text-[11px] text-[#c9bcf6] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#fde047]" />
                  Ceiling Projector
                </span>
                <button
                  onClick={toggleProjector}
                  className={`px-2 py-0.5 rounded text-[10px] font-pixel transition-all retro-button ${
                    settings.projectorActive
                      ? 'bg-[#fde047] text-[#090d1c] font-bold'
                      : 'bg-[#1e274c] text-stone-400 border border-[#c9bcf6]/20'
                  }`}
                >
                  {settings.projectorActive ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Ceiling Projector Screen Viewport */}
              <div
                style={{
                  backgroundColor: '#070b16',
                  boxShadow: `inset 0 0 ${settings.brightness}px ${currentModeObj.hex}44`
                }}
                className="h-52 rounded-lg border border-[#c9bcf6]/30 relative overflow-hidden flex items-center justify-center p-2"
              >
                {/* Ambient glow circle */}
                <div
                  style={{
                    backgroundColor: currentModeObj.hex,
                    opacity: settings.brightness / 140
                  }}
                  className="absolute inset-4 rounded-full blur-2xl pointer-events-none transition-all duration-300"
                />

                {settings.projectorActive ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                    {/* Constellation connection lines */}
                    {selectedConstellation.lines.map(([fromIdx, toIdx], lineIdx) => {
                      const p1 = selectedConstellation.stars[fromIdx];
                      const p2 = selectedConstellation.stars[toIdx];
                      return (
                        <line
                          key={lineIdx}
                          x1={p1.x}
                          y1={p1.y}
                          x2={p2.x}
                          y2={p2.y}
                          stroke="#c9bcf6"
                          strokeWidth="0.8"
                          strokeDasharray="2,2"
                          opacity="0.6"
                        />
                      );
                    })}

                    {/* Constellation Stars */}
                    {selectedConstellation.stars.map((s, starIdx) => (
                      <g key={starIdx}>
                        <circle cx={s.x} cy={s.y} r="2.2" fill="#fde047" />
                        <circle cx={s.x} cy={s.y} r="4.5" fill="#fde047" opacity="0.3" className="animate-ping" />
                      </g>
                    ))}
                  </svg>
                ) : (
                  <div className="text-center text-xs text-stone-400 relative z-10">
                    <Moon className="w-8 h-8 mx-auto mb-1 text-[#c9bcf6]/40" />
                    <span>Projector is currently off. Click ON above to beam stars.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Constellation selector buttons */}
            <div className="mt-3">
              <span className="text-[10px] font-pixel text-[#c9bcf6] block mb-1.5">
                Target Constellation:
              </span>
              <div className="grid grid-cols-3 gap-1">
                {CONSTELLATIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedConstellation(c);
                    }}
                    className={`p-1.5 rounded text-[10px] text-center truncate border transition-all retro-button ${
                      selectedConstellation.id === c.id
                        ? 'bg-[#c9bcf6] text-[#090d1c] font-bold border-white'
                        : 'bg-[#151c38] text-stone-300 border-[#c9bcf6]/20 hover:border-[#fde047]'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
