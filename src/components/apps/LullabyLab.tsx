import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Music, Disc } from 'lucide-react';
import { sound, PENTATONIC_CHIMES } from '../../utils/audio';

const PRESETS = [
  {
    id: 'moonlit-cradle',
    name: 'Moonlit Cradle',
    tempo: 75,
    description: 'A quiet, rocking lullaby designed to settle busy thoughts.',
    // indices into PENTATONIC_CHIMES (0 to 7) for 16 steps
    steps: [0, null, 2, null, 4, null, 3, null, 2, null, 0, null, 1, 2, 0, null]
  },
  {
    id: 'pips-waltz',
    name: "Pip's Sleepy Waltz",
    tempo: 90,
    description: 'Playful chimes Pip hums while combing stardust into bedtime clouds.',
    steps: [0, 4, 3, 2, 4, 5, 4, 2, 0, 1, 2, 3, 2, 1, 0, null]
  },
  {
    id: 'starfall-melody',
    name: 'Starfall Melody',
    tempo: 60,
    description: 'Slow descending bells mimicking shooting stars over the nursery.',
    steps: [7, null, 6, null, 5, 4, 3, null, 4, 3, 2, null, 1, null, 0, null]
  }
];

export const LullabyLab: React.FC = () => {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(75);
  // Grid matrix: 8 rows (tines) x 16 steps
  const [grid, setGrid] = useState<boolean[][]>(() => {
    // initialize from activePreset
    const initialGrid = Array.from({ length: 8 }, () => Array(16).fill(false));
    PRESETS[0].steps.forEach((noteIdx, stepIdx) => {
      if (noteIdx !== null && noteIdx >= 0 && noteIdx < 8) {
        initialGrid[noteIdx][stepIdx] = true;
      }
    });
    return initialGrid;
  });

  const [lastPlayedTine, setLastPlayedTine] = useState<number | null>(null);

  const stepIntervalRef = useRef<number | null>(null);
  const currentStepRef = useRef<number>(0);
  currentStepRef.current = currentStep;

  // Load preset into grid
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
    if (isPlaying) {
      stopPlayback();
    }
  };

  const toggleCell = (row: number, col: number) => {
    sound.playClick();
    const updated = grid.map((r, rIdx) =>
      r.map((val, cIdx) => (rIdx === row && cIdx === col ? !val : val))
    );
    setGrid(updated);
    if (!grid[row][col]) {
      // preview note when enabled
      playTine(row);
    }
  };

  const playTine = (tineIndex: number) => {
    const chime = PENTATONIC_CHIMES[tineIndex];
    if (chime) {
      sound.playMusicBoxNote(chime.freq, 1.8, 0.3);
      setLastPlayedTine(tineIndex);
      setTimeout(() => setLastPlayedTine(null), 300);
    }
  };

  const startPlayback = () => {
    sound.playClick();
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    sound.playClick();
    setIsPlaying(false);
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    setCurrentStep(-1);
  };

  const clearGrid = () => {
    sound.playClick();
    setGrid(Array.from({ length: 8 }, () => Array(16).fill(false)));
    if (isPlaying) stopPlayback();
  };

  // Sequencer playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const msPerStep = (60 / tempo / 4) * 1000;

    stepIntervalRef.current = window.setInterval(() => {
      const nextStep = (currentStepRef.current + 1) % 16;
      setCurrentStep(nextStep);

      // check which notes are enabled on this step
      grid.forEach((row, rowIdx) => {
        if (row[nextStep]) {
          const chime = PENTATONIC_CHIMES[rowIdx];
          if (chime) {
            sound.playMusicBoxNote(chime.freq, 1.6, 0.28);
          }
        }
      });
    }, msPerStep);

    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
  }, [isPlaying, tempo, grid]);

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/pip_lullaby_box.png"
            alt="Lullaby Lab Music Box"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(244,166,184,0.4)] shrink-0"
          />
          <div>
            <h3 className="font-pixel text-xs text-[#f4a6b8] tracking-wider uppercase">
              LULLABY_LAB.WAV // BRASS MUSIC BOX SYNTHESIZER
            </h3>
            <p className="text-xs text-[#c9bcf6]">
              Real-time Web Audio chime box. Click tines to play or compose 16-step sleep loops.
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p)}
              className={`px-2.5 py-1 text-xs rounded border transition-all retro-button ${
                activePreset.id === p.id
                  ? 'bg-[#b8a9e8] text-[#090d1c] font-bold border-[#fdfaf3]'
                  : 'bg-[#1a2342] text-[#fdfaf3] border-[#c9bcf6]/30 hover:border-[#f4a6b8]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Music Box Brass Tines Keyboard */}
      <div className="bg-[#121832] border border-[#c9bcf6]/30 rounded-lg p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-pixel text-[10px] text-[#fde047] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Celestial Bell Tines (Click to Play Live)
          </span>
          <span className="text-[10px] text-stone-400 font-mono-code">
            Pentatonic Scale (Zero Discordant Notes)
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PENTATONIC_CHIMES.map((chime, idx) => {
            const isHit = lastPlayedTine === idx;
            return (
              <button
                key={chime.pitch}
                onClick={() => playTine(idx)}
                className={`h-20 rounded-lg flex flex-col items-center justify-between p-2 border transition-all relative overflow-hidden retro-button cursor-pointer ${
                  isHit
                    ? 'bg-[#fde047] text-[#090d1c] border-white scale-95 shadow-[0_0_15px_#fde047]'
                    : 'bg-gradient-to-b from-[#222d56] to-[#141b36] hover:from-[#2e3c70] border-[#c9bcf6]/30 text-[#fdfaf3]'
                }`}
              >
                <div className="w-1.5 h-6 bg-[#fde047]/60 rounded-full" />
                <div className="text-center">
                  <span className="font-pixel text-[11px] block">{chime.pitch}</span>
                  <span className="text-[9px] text-[#c9bcf6] block">{chime.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 16-Step Cylinder Sequencer Grid */}
      <div className="bg-[#101730] border border-[#c9bcf6]/30 rounded-lg p-3.5 shadow-xl flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-[#c9bcf6]/20 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className={`px-4 py-1.5 rounded-md font-pixel text-xs flex items-center gap-1.5 transition-all retro-button cursor-pointer ${
                isPlaying
                  ? 'bg-[#f4a6b8] hover:bg-[#ff8ea6] text-[#090d1c] font-bold'
                  : 'bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-bold'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>WIND & PLAY</span>
                </>
              )}
            </button>

            <button
              onClick={clearGrid}
              className="px-2.5 py-1.5 rounded bg-[#1c2445] hover:bg-[#283461] border border-[#c9bcf6]/30 text-xs text-stone-300 flex items-center gap-1 retro-button"
              title="Clear sequencer pegs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Tempo slider */}
          <div className="flex items-center gap-2 text-xs font-mono-code">
            <span className="text-[#c9bcf6]">TEMPO:</span>
            <input
              type="range"
              min="40"
              max="120"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="accent-[#f4a6b8] w-24 sm:w-32 cursor-pointer"
            />
            <span className="text-[#fde047] w-12 text-right">{tempo} BPM</span>
          </div>
        </div>

        {/* Matrix Grid: Rows represent chime pitches, Columns represent steps */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[480px]">
            {/* Step markers header */}
            <div className="flex items-center mb-1">
              <div className="w-16 shrink-0 text-[10px] text-[#c9bcf6] font-mono-code">NOTE</div>
              <div className="flex-1 grid grid-cols-16 gap-1">
                {Array.from({ length: 16 }).map((_, stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`text-center text-[9px] font-mono-code rounded ${
                      currentStep === stepIdx
                        ? 'text-[#fde047] font-bold bg-[#fde047]/20'
                        : 'text-stone-500'
                    }`}
                  >
                    {stepIdx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Note Rows */}
            {PENTATONIC_CHIMES.map((chime, rowIdx) => (
              <div key={chime.pitch} className="flex items-center my-1">
                <button
                  onClick={() => playTine(rowIdx)}
                  className="w-16 shrink-0 text-left text-[10px] font-pixel text-[#c9bcf6] hover:text-[#fde047] truncate"
                >
                  {chime.pitch}
                </button>
                <div className="flex-1 grid grid-cols-16 gap-1">
                  {grid[rowIdx].map((isActive, colIdx) => {
                    const isCurrent = currentStep === colIdx;
                    return (
                      <button
                        key={colIdx}
                        onClick={() => toggleCell(rowIdx, colIdx)}
                        className={`h-6 rounded border transition-all cursor-pointer ${
                          isActive
                            ? isCurrent
                              ? 'bg-[#fde047] border-white shadow-[0_0_8px_#fde047]'
                              : 'bg-[#b8a9e8] border-[#fdfaf3]/50'
                            : isCurrent
                            ? 'bg-[#1f294e] border-[#fde047]/40'
                            : 'bg-[#131b34] border-[#c9bcf6]/20 hover:border-[#c9bcf6]/60'
                        }`}
                        title={`${chime.pitch} at step ${colIdx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cylinder Note & Status */}
        <div className="mt-3 pt-2 border-t border-[#c9bcf6]/15 flex items-center justify-between text-xs text-stone-300">
          <div className="flex items-center gap-1.5 font-serif-dream italic text-[#c9bcf6]">
            <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Brass cylinder status: {isPlaying ? 'Revolving with chime pins engaged' : 'Wound and resting'}</span>
          </div>
          <span className="text-[10px] font-mono-code text-[#f4a6b8]">
            {activePreset.description}
          </span>
        </div>
      </div>
    </div>
  );
};
