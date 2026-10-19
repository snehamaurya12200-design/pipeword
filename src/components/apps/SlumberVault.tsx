import React, { useState } from 'react';
import { Lock, Key, Sparkles, Send, Heart, Star, Moon, Cloud } from 'lucide-react';
import { sound } from '../../utils/audio';

interface BedtimeWhisper {
  id: string;
  sender: string;
  message: string;
  stamp: string;
  time: string;
}

const INITIAL_WHISPERS: BedtimeWhisper[] = [
  {
    id: 'w1',
    sender: 'Sleepy Hedgehog',
    message: 'Please make my dream have an endless patch of soft strawberries without any prickles.',
    stamp: '🍓',
    time: '11:15 PM'
  },
  {
    id: 'w2',
    sender: 'Midnight Sailor',
    message: 'Fair winds and calm tide across the celestial sea tonight.',
    stamp: '⛵',
    time: '11:32 PM'
  },
  {
    id: 'w3',
    sender: 'Little Barn Owl',
    message: 'Thank you for the warm nightlight, Pip. It kept the storm thunder away.',
    stamp: '🦉',
    time: '11:58 PM'
  }
];

export const SlumberVault: React.FC = () => {
  const [whispers, setWhispers] = useState<BedtimeWhisper[]>(INITIAL_WHISPERS);
  const [inputSender, setInputSender] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [selectedStamp, setSelectedStamp] = useState('⭐');
  const [isUnlocked, setIsUnlocked] = useState(true);

  const handleSendWhisper = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    sound.playDreamShimmer();
    const newWhisper: BedtimeWhisper = {
      id: Date.now().toString(),
      sender: inputSender.trim() || 'Anonymous Sleeper',
      message: inputMsg.trim(),
      stamp: selectedStamp,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setWhispers([newWhisper, ...whispers]);
    setInputMsg('');
    setInputSender('');
  };

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-[#372346] border border-[#c9bcf6]/30 flex items-center justify-center text-lg shadow">
            <Lock className="w-5 h-5 text-[#f4a6b8]" />
          </div>
          <div>
            <h3 className="font-pixel text-xs text-[#f4a6b8] tracking-wider uppercase">
              SECRET_VAULT.DAT // THE SLUMBER ARCHIVE
            </h3>
            <p className="text-xs text-[#c9bcf6]">
              A hidden corner of Pip's midnight hard drive holding secret sticky notes and bedtime whispers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#fde047]">
          <span>VAULT KEY: GRANTED</span>
          <span>✦</span>
        </div>
      </div>

      {/* Pip's Secret Sticky Notes Board */}
      <div className="space-y-2">
        <span className="font-pixel text-[10px] text-[#c9bcf6] uppercase tracking-wider block">
          Pip's Desk Sticky Notes (Do Not Delete!)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 rounded-lg bg-[#2b2438] border border-[#f4a6b8]/40 shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="text-[10px] font-pixel text-[#f4a6b8] mb-1">
              NOTE #01 · SOCKS
            </div>
            <p className="text-xs font-serif-dream italic text-stone-200">
              "If you ever lose a fuzzy sock under your bed, don't worry. Dust bunnies use them as winter hammocks."
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#1f2842] border border-[#fde047]/40 shadow-md transform rotate-1 hover:rotate-0 transition-transform">
            <div className="text-[10px] font-pixel text-[#fde047] mb-1">
              NOTE #02 · THE MOON
            </div>
            <p className="text-xs font-serif-dream italic text-stone-200">
              "The moon isn't made of cheese! It's actually composed of billions of pressed dandelion clock wishes."
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#1a2d3d] border border-[#90e0ef]/40 shadow-md transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="text-[10px] font-pixel text-[#90e0ef] mb-1">
              NOTE #03 · SLEEPY HACK
            </div>
            <p className="text-xs font-serif-dream italic text-stone-200">
              "One slow sip of lukewarm chamomile water right before clicking the lamp off prevents dream hiccups."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Guestbook: Leave a Bedtime Whisper */}
      <div className="bg-[#11172f] border border-[#c9bcf6]/30 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#c9bcf6]/20 pb-2 mb-3">
          <span className="font-pixel text-[11px] text-[#fde047] tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Leave a Bedtime Whisper in Pip's Guestbook
          </span>
          <span className="text-[10px] font-mono-code text-[#c9bcf6]">
            {whispers.length} bedtime notes collected
          </span>
        </div>

        <form onSubmit={handleSendWhisper} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-pixel text-[#c9bcf6] mb-1">
                Your Name / Sleepy Alias
              </label>
              <input
                type="text"
                placeholder="e.g. Starlight Wanderer"
                value={inputSender}
                onChange={(e) => setInputSender(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-[#090d1c] border border-[#c9bcf6]/30 text-xs text-[#fdfaf3] focus:border-[#fde047] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-pixel text-[#c9bcf6] mb-1">
                Your Bedtime Wish or Dream Request
              </label>
              <input
                type="text"
                required
                placeholder="Whisper something comforting into the night..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-[#090d1c] border border-[#c9bcf6]/30 text-xs text-[#fdfaf3] focus:border-[#fde047] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#c9bcf6] font-mono-code">Dream Stamp:</span>
              {['⭐', '🌙', '☁️', '🎀', '🧸', '🪻'].map((stamp) => (
                <button
                  type="button"
                  key={stamp}
                  onClick={() => setSelectedStamp(stamp)}
                  className={`w-7 h-7 rounded text-sm flex items-center justify-center border transition-all ${
                    selectedStamp === stamp
                      ? 'bg-[#c9bcf6] border-white scale-110 shadow-sm'
                      : 'bg-[#182142] border-[#c9bcf6]/20 hover:border-[#f4a6b8]'
                  }`}
                >
                  {stamp}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-bold font-pixel text-xs flex items-center gap-1.5 retro-button cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Whisper to Vault</span>
            </button>
          </div>
        </form>

        {/* List of Bedtime Whispers */}
        <div className="mt-4 pt-3 border-t border-[#c9bcf6]/15 space-y-2 max-h-48 overflow-y-auto">
          {whispers.map((w) => (
            <div
              key={w.id}
              className="p-2.5 rounded bg-[#0c1226] border border-[#c9bcf6]/15 flex items-start gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#1e274c] border border-[#c9bcf6]/30 flex items-center justify-center text-sm shrink-0">
                {w.stamp}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#fdfaf3]">{w.sender}</span>
                  <span className="text-[9px] font-mono-code text-[#c9bcf6]">{w.time}</span>
                </div>
                <p className="text-xs text-stone-300 font-serif-dream italic mt-0.5">
                  "{w.message}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
