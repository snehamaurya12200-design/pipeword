import React, { useState } from 'react';
import { BookOpen, Sparkles, ChevronRight, ChevronLeft, Feather, Heart, Star, Compass } from 'lucide-react';
import { StoryChapter } from '../../types/os';
import { sound } from '../../utils/audio';

const CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: 'The Brass Music Box Under the Willow',
    subtitle: 'Where the ticking began',
    date: 'Slumber Cycle 01 · Moonfall',
    illustrationKey: 'music-box',
    narrative: [
      "Before Pip wore the starry nightcap, he was just a tiny, quiet creature who loved walking through the Silver Willow grove when everyone else was fast asleep.",
      "One night, nestled inside the hollow of a glowing willow root, Pip found an antique clockwork box. It didn't play waking music—when wound, it released soft, sparkling chime ripples that made the forest crickets yawn in gentle harmony."
    ],
    pipThought: "The gears smelled like dried lavender and brass. When I turned the key, my skull face felt warm for the very first time."
  },
  {
    id: 2,
    title: 'The First Spun Dream',
    subtitle: 'A blanket for a shivering kitten',
    date: 'Slumber Cycle 14 · Waxing Crescent',
    illustrationKey: 'first-dream',
    narrative: [
      "That same winter, a little barn kitten fell asleep out in the freezing snow, shivering from frightening shadows. Pip took three wisps of moonlit cloud, stirred in two drops of warm chamomile honey, and wound the brass music box.",
      "A soft bubble of warm lavender light enveloped the kitten. The kitten stopped shivering, purred softly in sleep, and dreamed of rolling in endless hills of sunlit dandelion fluff."
    ],
    pipThought: "Dreams aren't just thoughts you have at night. They're soft coats we sew to keep sleeping souls safe from cold nightmares."
  },
  {
    id: 3,
    title: 'Earning the Starry Nightcap',
    subtitle: 'Appointed Junior Dream Engineer',
    date: 'Slumber Cycle 42 · Full Blue Moon',
    illustrationKey: 'nightcap',
    narrative: [
      "Word of the kind little skeleton engineer reached the Midnight Nursery high above the cloud rim. The Elder Owls invited Pip up the spiral starlight stairs.",
      "In recognition of his gentle heart and clumsy enthusiasm, they presented him with the official Dream Engineer Nightcap—woven from midnight wool, dotted with three northern stars, and tied with a small pink ribbon so it wouldn't slip off his smooth round head."
    ],
    pipThought: "The owls said a real dream engineer must always remember: Never scary. Never spooky. Only warm glowing pinpricks of light."
  },
  {
    id: 4,
    title: 'Welcoming the Sleeper: You',
    subtitle: 'The Midnight Internet is now open',
    date: 'Present Cycle · Tonight',
    illustrationKey: 'nursery-welcome',
    narrative: [
      "Now, Pip runs the Midnight Internet from this tiny retro computer. Every evening, when the waking world closes its eyes, Pip sits at the keyboard calibrating moonlight, spinning clouds, and testing music-box bells.",
      "And tonight, the terminal chimed with a gentle chime: You stepped inside. Welcome to the workshop. Sleep well tonight—your dream is already in the oven."
    ],
    pipThought: "I'm so glad you stopped by my desk. If you ever feel restless tonight, wind my music box or turn on the firefly light!"
  }
];

export const PipsStory: React.FC = () => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const chapter = CHAPTERS[currentChapterIndex];

  const nextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      sound.playClick();
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      sound.playClick();
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const goToChapter = (idx: number) => {
    sound.playClick();
    setCurrentChapterIndex(idx);
  };

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-[#253059] border border-[#c9bcf6]/30 flex items-center justify-center text-lg shadow">
            <BookOpen className="w-5 h-5 text-[#c9bcf6]" />
          </div>
          <div>
            <h3 className="font-pixel text-xs text-[#c9bcf6] tracking-wider uppercase">
              STORY.DOC // PIP'S DREAM JOURNAL
            </h3>
            <p className="text-xs text-stone-300">
              The true origin of the Junior Dream Engineer and the Midnight Nursery.
            </p>
          </div>
        </div>

        {/* Chapter Stepper Buttons */}
        <div className="flex items-center gap-1">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => goToChapter(idx)}
              className={`w-7 h-7 rounded text-xs font-pixel transition-all retro-button ${
                idx === currentChapterIndex
                  ? 'bg-[#f4a6b8] text-[#090d1c] font-bold border-white'
                  : 'bg-[#182142] text-stone-300 border border-[#c9bcf6]/25 hover:border-[#f4a6b8]'
              }`}
              title={`Chapter ${idx + 1}: ${ch.title}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
        {/* Left Column: Visual Scene Illustration (5 cols) */}
        <div className="md:col-span-5 bg-[#0f162e] border border-[#c9bcf6]/30 rounded-lg p-3 flex flex-col justify-between shadow-xl">
          <div className="h-64 sm:h-72 rounded-lg bg-[#090d1c] border border-[#c9bcf6]/20 relative overflow-hidden flex items-center justify-center p-3">
            {/* Chapter Specific Atmospheric Graphic */}
            {currentChapterIndex === 0 && (
              <div className="relative text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#fde047]/10 border border-[#fde047]/30 flex items-center justify-center text-4xl shadow-[0_0_20px_#fde047]/20">
                  🎁
                </div>
                <div className="mt-3 text-xs font-pixel text-[#fde047]">
                  The Brass Music Box
                </div>
                <p className="text-[11px] text-[#c9bcf6] mt-1 font-serif-dream italic">
                  Found ticking at the roots of the Silver Willow
                </p>
              </div>
            )}

            {currentChapterIndex === 1 && (
              <div className="relative text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#b8a9e8]/15 border border-[#b8a9e8]/30 flex items-center justify-center text-4xl shadow-[0_0_20px_#b8a9e8]/30">
                  ☁️✨
                </div>
                <div className="mt-3 text-xs font-pixel text-[#b8a9e8]">
                  The First Spun Cloud
                </div>
                <p className="text-[11px] text-[#f4a6b8] mt-1 font-serif-dream italic">
                  Lavender steam & moonbeam threads
                </p>
              </div>
            )}

            {currentChapterIndex === 2 && (
              <div className="relative text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#f4a6b8]/15 border border-[#f4a6b8]/30 flex items-center justify-center text-4xl shadow-[0_0_20px_#f4a6b8]/30">
                  🎀🌙
                </div>
                <div className="mt-3 text-xs font-pixel text-[#f4a6b8]">
                  The Starry Nightcap
                </div>
                <p className="text-[11px] text-[#fde047] mt-1 font-serif-dream italic">
                  Conferred by the Elder Moon Owls
                </p>
              </div>
            )}

            {currentChapterIndex === 3 && (
              <div className="relative text-center w-full h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#c9bcf6]/20 border border-[#c9bcf6]/40 flex items-center justify-center text-4xl shadow-[0_0_25px_#c9bcf6]/40">
                  🖥️💤
                </div>
                <div className="mt-3 text-xs font-pixel text-[#fdfaf3]">
                  The Midnight Internet
                </div>
                <p className="text-[11px] text-[#c9bcf6] mt-1 font-serif-dream italic">
                  "I build the dreams you fall asleep inside."
                </p>
              </div>
            )}

            {/* Drifting star dots */}
            <div className="absolute top-2 left-2 text-[#fde047] text-xs">✦</div>
            <div className="absolute top-4 right-3 text-[#f4a6b8] text-xs">✦</div>
            <div className="absolute bottom-2 right-4 text-[#c9bcf6] text-xs">✦</div>
          </div>

          <div className="mt-3 text-center text-[10px] font-mono-code text-stone-400">
            Chapter {currentChapterIndex + 1} of 4 · Archival Log
          </div>
        </div>

        {/* Right Column: Narrative & Pip's Field Notes (7 cols) */}
        <div className="md:col-span-7 bg-[#111832] border border-[#c9bcf6]/30 rounded-lg p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="border-b border-[#c9bcf6]/20 pb-2 mb-3">
              <span className="text-[10px] font-mono-code text-[#f4a6b8] uppercase tracking-wider">
                {chapter.date}
              </span>
              <h3 className="text-base sm:text-lg font-serif-dream font-semibold text-[#fdfaf3]">
                {chapter.title}
              </h3>
              <p className="text-xs text-[#c9bcf6] italic mt-0.5">
                {chapter.subtitle}
              </p>
            </div>

            {/* Prose */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
              {chapter.narrative.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Pip's Field Note Box */}
            <div className="mt-4 p-3 bg-[#182142] border-l-2 border-[#fde047] rounded-r-lg text-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-pixel text-[#fde047] mb-1">
                <Feather className="w-3 h-3" />
                <span>PIP'S JOURNAL ENTRY:</span>
              </div>
              <p className="font-serif-dream italic text-stone-300">
                "{chapter.pipThought}"
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 pt-3 border-t border-[#c9bcf6]/20 flex items-center justify-between">
            <button
              onClick={prevChapter}
              disabled={currentChapterIndex === 0}
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-all retro-button ${
                currentChapterIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-[#182142] text-stone-500'
                  : 'bg-[#1e274c] text-[#fdfaf3] border border-[#c9bcf6]/30 hover:border-[#f4a6b8] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={nextChapter}
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              className={`px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-all retro-button ${
                currentChapterIndex === CHAPTERS.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-[#182142] text-stone-500'
                  : 'bg-[#9e8ad8] text-[#090d1c] font-bold border border-white hover:bg-[#b8a9e8] cursor-pointer'
              }`}
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
