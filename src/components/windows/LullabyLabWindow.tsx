import React, { useState, useEffect, useRef } from 'react';
import { WindowFrame } from '../WindowFrame';
import { Music, Play, Pause } from 'lucide-react';
import { sound, PENTATONIC_CHIMES } from '../../utils/audio';

const PRESETS = [
  {
    id: 'moonlit-cradle',
    name: 'Moonlit Cradle',
    tempo: 75,
    steps: [0, null, 2, null, 4, null, 3, null, 2, null, 0, null, 1, 2, 0, null]
  },
  {
    id: 'pips-waltz',
    name: "Pip's Sleepy Waltz",
    tempo: 90,
    steps: [0, 4, 3, 2, 4, 5, 4, 2, 0, 1, 2, 3, 2, 1, 0, null]
  },
  {
    id: 'starlit-melody',
    name: 'Starlit Melody',
    tempo: 65,
    steps: [7, null, 6, null, 5, 4, 3, null, 4, 3, 2, null, 1, null, 0, null]
  }
];

interface LullabyLabWindowProps {
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
}

export const LullabyLabWindow: React.FC<LullabyLabWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 920, y: 30 },
  initialSize = { width: 440, height: 420 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus
}) => {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [tempo, setTempo] = useState<number>(75);
  const [lastPlayedIdx, setLastPlayedIdx] = useState<number | null>(null);

  const [grid, setGrid] = useState<boolean[][]>(() => {
    const initial = Array.from({ length: 8 }, () => Array(16).fill(false));
    PRESETS[0].steps.forEach((noteIdx, stepIdx) => {
      if (noteIdx !== null && noteIdx >= 0 && noteIdx < 8) {
        initial[noteIdx][stepIdx] = true;
      }
    });
    return initial;
  });

  const stepIntervalRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  currentStepRef.current = currentStep;

  const loadPreset = (preset: typeof PRESETS[0]) => {
    sound.playClick();
    setActivePreset(preset);
    setTempo(preset.tempo);
    const newGrid = Array.from({ length: 8 }, () => Array(16).fill(false));
    preset.steps.forEach((noteIdx, stepIdx) => {
      if (noteIdx !== null && noteIdx >= 0 && noteIdx < 8) {
        newGrid[noteIdx][stepIdx] = true;
      }
    });
    setGrid(newGrid);
  };

  const playChime = (idx: number) => {
    const chime = PENTATONIC_CHIMES[idx];
    if (chime) {
      sound.playMusicBoxNote(chime.freq, 1.6, 0.3);
      setLastPlayedIdx(idx);
      setTimeout(() => setLastPlayedIdx(null), 350);
    }
  };

  const toggleCell = (row: number, col: number) => {
    sound.playClick();
    const updated = grid.map((r, rIdx) =>
      r.map((val, cIdx) => (rIdx === row && cIdx === col ? !val : val))
    );
    setGrid(updated);
    if (!grid[row][col]) {
      playChime(row);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setGrid(Array.from({ length: 8 }, () => Array(16).fill(false)));
  };

  useEffect(() => {
    if (!isPlaying) {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      return;
    }

    const msPerStep = (60 / tempo / 4) * 1000;
    stepIntervalRef.current = window.setInterval(() => {
      const nextStep = (currentStepRef.current + 1) % 16;
      setCurrentStep(nextStep);

      grid.forEach((row, rowIdx) => {
        if (row[nextStep]) {
          const chime = PENTATONIC_CHIMES[rowIdx];
          if (chime) sound.playMusicBoxNote(chime.freq, 1.4, 0.25);
        }
      });
    }, msPerStep);

    return () => {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, [isPlaying, tempo, grid]);

  return (
    <WindowFrame
      id="lullaby-lab"
      title="LULLABY LAB.MP3 — MUSIC BOX CHIMES"
      icon={<Music className="w-3.5 h-3.5 text-[#f4a6b8]" />}
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
      <div className="space-y-2.5">
        {/* Top Synthesizer Banner Row */}
        <div className="p-2.5 rounded-lg bg-[#192247] border border-[#c9bcf6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/pip_lullaby_box.png"
              alt="Lullaby Lab Music Box"
              className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(244,166,184,0.4)] shrink-0"
            />
            <div>
              <h4 className="font-pixel text-[10px] text-[#f4a6b8] tracking-wider uppercase font-bold">
                LULLABY LAB.MP3 // BRASS MUSIC BOX SYNTHESIZER
              </h4>
              <p className="text-[10px] text-stone-300 font-sans leading-tight">
                Real-time WebAudio chime box. Click tines to play or compose 16-step sleep loops.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 flex-wrap">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                className={`px-2 py-0.5 rounded text-[9px] font-sans transition-colors cursor-pointer ${
                  activePreset.id === p.id
                    ? 'bg-[#b8a9e8] text-[#131b38] font-bold shadow-sm'
                    : 'bg-[#293466] text-[#fdfaf3] hover:bg-[#384687]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Celestial Bell Tines */}
        <div>
          <span className="font-pixel text-[9px] text-[#fde047] uppercase tracking-wider block mb-1 font-bold">
            CELESTIAL BELL TINES (CLICK TO PLAY LIVE)
          </span>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
            {PENTATONIC_CHIMES.map((chime, idx) => {
              const isHit = lastPlayedIdx === idx;
              return (
                <button
                  key={chime.pitch}
                  onClick={() => playChime(idx)}
                  className={`h-14 rounded-lg flex flex-col items-center justify-between p-1.5 border transition-all cursor-pointer ${
                    isHit
                      ? 'bg-[#fde047] text-[#090d1c] border-white scale-95 shadow-[0_0_12px_#fde047]'
                      : 'bg-gradient-to-b from-[#25305c] to-[#151c3d] hover:from-[#313f75] border-[#c9bcf6]/25 text-white'
                  }`}
                >
                  <span className="text-xs">
                    {idx === 0 ? '🌙' : idx === 1 ? '⭐' : idx === 2 ? '☁️' : idx === 3 ? '💤' : idx === 4 ? '🪻' : idx === 5 ? '✨' : idx === 6 ? '💎' : '🧸'}
                  </span>
                  <div className="text-center leading-none">
                    <span className="font-pixel text-[9px] block font-bold">{chime.pitch}</span>
                    <span className="text-[8px] text-[#c9bcf6] block mt-0.5">{chime.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center pt-1 border-t border-[#c9bcf6]/20">
          <div className="sm:col-span-4 flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-md bg-[#f4a6b8] hover:bg-[#ff9bb1] text-[#090d1c] flex items-center gap-1 font-bold font-pixel text-[9px] cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <span className="text-[10px] text-stone-300">Loop: 2 / 4</span>
            <button
              onClick={handleReset}
              className="text-[10px] text-[#c9bcf6] hover:text-[#f4a6b8] underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="sm:col-span-4 flex items-center justify-center">
            <div className="px-3 py-1 rounded bg-[#0b1026] border border-[#c9bcf6]/30 flex items-center gap-1.5 text-[9px] text-[#c9bcf6] font-mono">
              <span className="text-[#fde047]">●</span>
              <span>LIVE PREVIEW</span>
              <span className="text-[#f4a6b8]">Streaming</span>
            </div>
          </div>

          <div className="sm:col-span-4 flex items-center justify-end gap-2 text-xs font-mono">
            <span className="text-[9px] text-[#c9bcf6]">TEMPO:</span>
            <input
              type="range"
              min="50"
              max="120"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-20 accent-[#f4a6b8] cursor-pointer"
            />
            <span className="text-[10px] text-[#fde047] font-bold w-12 text-right">
              {tempo} BPM
            </span>
          </div>
        </div>

        {/* 16-Step Sequencer Matrix Grid */}
        <div className="p-2 rounded-lg bg-[#0c1228] border border-[#c9bcf6]/20 overflow-x-auto">
          <div className="min-w-[340px] space-y-1">
            {PENTATONIC_CHIMES.map((chime, rowIdx) => (
              <div key={chime.pitch} className="flex items-center gap-1">
                <span className="w-6 text-[8px] font-pixel text-[#c9bcf6]/80 shrink-0">
                  {chime.pitch}
                </span>
                <div className="flex-1 grid grid-cols-16 gap-1">
                  {grid[rowIdx].map((isActive, colIdx) => {
                    const isCurrent = currentStep === colIdx;
                    return (
                      <button
                        key={colIdx}
                        onClick={() => toggleCell(rowIdx, colIdx)}
                        className={`h-4 rounded-xs border transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#ffffff] border-white shadow-[0_0_6px_#ffffff]'
                            : isCurrent
                            ? 'bg-[#293563] border-[#fde047]/60'
                            : 'bg-[#161f42] border-[#c9bcf6]/20 hover:border-[#c9bcf6]/50'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
