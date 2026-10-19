import React, { useState } from 'react';
import { WindowFrame } from '../WindowFrame';
import { Lock, Send, Sparkles, Pin } from 'lucide-react';
import { sound } from '../../utils/audio';

interface BedtimeWhisper {
  sender: string;
  message: string;
  stamp: string;
}

interface SlumberVaultWindowProps {
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

export const SlumberVaultWindow: React.FC<SlumberVaultWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 100, y: 220 },
  initialSize = { width: 440, height: 420 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus
}) => {
  const [whispers, setWhispers] = useState<BedtimeWhisper[]>([
    { sender: 'Sleepy Hedgehog', message: 'Soft strawberries with no prickles.', stamp: '🍓' },
    { sender: 'Midnight Sailor', message: 'Fair winds across the celestial sea.', stamp: '⛵' },
    { sender: 'Barn Owl', message: 'Thank you for the warm nightlight.', stamp: '⭐' }
  ]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('⭐');
  const [justWhispered, setJustWhispered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sound.playDreamShimmer();
    setWhispers([
      { sender: name.trim() || 'Starlight Wanderer', message: message.trim(), stamp: selectedStamp },
      ...whispers
    ]);
    setName('');
    setMessage('');
    setJustWhispered(true);
    setTimeout(() => setJustWhispered(false), 2500);
  };

  return (
    <WindowFrame
      id="slumber-vault"
      title="SECRET.DAT — THE SLUMBER VAULT"
      icon={<Lock className="w-3.5 h-3.5 text-[#e08398]" />}
      theme="pink"
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
      <div className="space-y-3">
        {/* Top Banner Row */}
        <div className="p-2.5 rounded-lg bg-[#fff0f5] border border-[#f4a6b8]/40 flex items-center justify-between gap-2.5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f4a6b8] flex items-center justify-center text-white shrink-0 shadow">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-pixel text-[10px] text-[#e06d88] tracking-wider uppercase font-bold">
                SECRET VAULT.DAT // THE SLUMBER ARCHIVE
              </h4>
              <p className="text-[10px] text-[#6b4760] font-sans leading-tight">
                A hidden corner of Pip's midnight heart drive holding secret sticky notes and bedtime whispers.
              </p>
            </div>
          </div>

          <div className="px-2 py-1 bg-[#fff8e7] border border-[#e8c568] rounded text-center shrink-0 shadow-sm">
            <span className="block text-[8px] font-pixel text-[#8a6a1f] uppercase leading-none">VAULT KEY:</span>
            <span className="block text-[9px] font-pixel text-[#d97706] font-bold mt-0.5">GRANTED</span>
          </div>
        </div>

        {/* Section: Pip's Sticky Notes */}
        <div>
          <span className="font-pixel text-[9px] text-[#854d73] uppercase tracking-wider block mb-1.5 font-bold">
            PIP'S DESK STICKY NOTES (DO NOT DELETE!)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Note 1: Pink */}
            <div className="p-2 rounded-lg bg-[#ffe8ee] border border-[#f4a6b8]/50 shadow-sm flex flex-col justify-between">
              <span className="font-pixel text-[9px] text-[#d64d73] font-bold block mb-1">
                NOTE #01 · LOOKS
              </span>
              <p className="text-[10px] text-[#4d2d3e] font-serif-dream italic leading-snug">
                "If you ever lose a fuzzy spark under your bed, don't worry. Dust bunnies are there as winter hammocks."
              </p>
            </div>

            {/* Note 2: Purple */}
            <div className="p-2 rounded-lg bg-[#f0eaff] border border-[#b8a9e8]/50 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[9px] text-[#6d51b8] font-bold">
                  NOTE #02 · THE MOON
                </span>
                <Pin className="w-2.5 h-2.5 text-[#6d51b8] rotate-45" />
              </div>
              <p className="text-[10px] text-[#332252] font-serif-dream italic leading-snug">
                "The moon isn't made of cheese; it's actually composed of billions of pressed starlight cloud wishes."
              </p>
            </div>

            {/* Note 3: Cyan */}
            <div className="p-2 rounded-lg bg-[#e2f9fa] border border-[#7ed8df]/60 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[9px] text-[#1c7885] font-bold">
                  NOTE #03 · SLEEPY HACK
                </span>
                <Sparkles className="w-2.5 h-2.5 text-[#f59e0b]" />
              </div>
              <p className="text-[10px] text-[#16444c] font-serif-dream italic leading-snug">
                "One slow sip of lukewarm chamomile water right before checking the bowl of presents dream lineage."
              </p>
            </div>
          </div>
        </div>

        {/* Section: Guestbook Form */}
        <div className="pt-2 border-t border-[#f4a6b8]/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-pixel text-[9px] text-[#854d73] tracking-wide font-bold flex items-center gap-1">
              <span className="text-[#f59e0b]">★</span>
              LEAVE A BEDTIME WHISPER IN PIP'S GUESTBOOK
            </span>
            <span className="text-[9px] font-mono text-[#a37c95]">
              {whispers.length} bedtime notes collected
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="e.g. Starlight Wanderer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-7 px-2.5 rounded bg-white border border-[#e5c2d6] text-[11px] text-[#382033] outline-none focus:border-[#f4a6b8] shadow-inner"
                />
              </div>
              <div className="sm:col-span-8">
                <input
                  type="text"
                  required
                  placeholder="Whisper something comforting into the night..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-7 px-2.5 rounded bg-white border border-[#e5c2d6] text-[11px] text-[#382033] outline-none focus:border-[#f4a6b8] shadow-inner"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="font-mono text-[#854d73] text-[9px]">Dream Stamp:</span>
                {['⭐', '🌙', '☁️', '💖', '🎀'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStamp(st)}
                    className={`w-6 h-6 rounded text-xs flex items-center justify-center border transition-transform cursor-pointer ${
                      selectedStamp === st
                        ? 'bg-[#fad5e2] border-[#f4a6b8] scale-110 shadow-sm'
                        : 'bg-white border-[#e5c2d6] hover:bg-[#fff0f5]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="h-7 px-3 rounded-md bg-[#f4a6b8] hover:bg-[#f28da5] text-[#2c1424] font-pixel text-[9px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
              >
                <Send className="w-2.5 h-2.5" />
                <span>{justWhispered ? 'WHISPER SENT!' : 'WHISPER TO VAULT'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </WindowFrame>
  );
};
