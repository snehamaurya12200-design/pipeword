import React, { useState } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight, Feather } from 'lucide-react';
import { sound } from '../../utils/audio';

interface StoryReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHAPTERS = [
  {
    id: 1,
    title: 'The Brass Music Box Under the Willow',
    subtitle: 'Where the ticking began',
    date: 'Slumber Cycle 01 · Moonfall',
    icon: '🎁',
    narrative: [
      "Before Pip wore the starry nightcap, he was just a tiny, quiet creature who loved walking through the Silver Willow grove when everyone else was fast asleep.",
      "One night, nestled inside the hollow of a glowing willow root, Pip found an antique clockwork box. It didn't play waking music—when wound, it released soft, sparkling chime ripples that made the forest crickets yawn in gentle harmony."
    ],
    thought: "The gears smelled like dried lavender and brass. When I turned the key, my skull face felt warm for the very first time."
  },
  {
    id: 2,
    title: 'The First Spun Dream',
    subtitle: 'A blanket for a shivering kitten',
    date: 'Slumber Cycle 14 · Waxing Crescent',
    icon: '☁️',
    narrative: [
      "That same winter, a little barn kitten fell asleep out in the freezing snow, shivering from frightening shadows. Pip took three wisps of moonlit cloud, stirred in two drops of warm chamomile honey, and wound the brass music box.",
      "A soft bubble of warm lavender light enveloped the kitten. The kitten stopped shivering, purred softly in sleep, and dreamed of rolling in endless hills of sunlit dandelion fluff."
    ],
    thought: "Dreams aren't just thoughts you have at night. They're soft coats we sew to keep sleeping souls safe from cold nightmares."
  },
  {
    id: 3,
    title: 'Earning the Starry Nightcap',
    subtitle: 'Appointed Junior Dream Engineer',
    date: 'Slumber Cycle 42 · Full Blue Moon',
    icon: '🎀',
    narrative: [
      "Word of the kind little skeleton engineer reached the Midnight Nursery high above the cloud rim. The Elder Owls invited Pip up the spiral starlight stairs.",
      "In recognition of his gentle heart and clumsy enthusiasm, they presented him with the official Dream Engineer Nightcap—woven from midnight wool, dotted with three northern stars, and tied with a small pink ribbon so it wouldn't slip off his smooth round head."
    ],
    thought: "The owls said a real dream engineer must always remember: Never scary. Never spooky. Only warm glowing pinpricks of light."
  },
  {
    id: 4,
    title: 'Welcoming the Sleeper: You',
    subtitle: 'The Midnight Internet is now open',
    date: 'Present Cycle · Tonight',
    icon: '🌙',
    narrative: [
      "Now, Pip runs the Midnight Internet from this tiny retro computer. Every evening, when the waking world closes its eyes, Pip sits at the keyboard calibrating moonlight, spinning clouds, and testing music-box bells.",
      "And tonight, the terminal chimed with a gentle chime: You stepped inside. Welcome to the workshop. Sleep well tonight—your dream is already in the oven."
    ],
    thought: "I'm so glad you stopped by my desk. If you ever feel restless tonight, wind my music box or turn on the firefly light!"
  }
];

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({ isOpen, onClose }) => {
  const [chapterIdx, setChapterIdx] = useState(0);

  if (!isOpen) return null;

  const current = CHAPTERS[chapterIdx];

  const next = () => {
    if (chapterIdx < CHAPTERS.length - 1) {
      sound.playClick();
      setChapterIdx(chapterIdx + 1);
    }
  };

  const prev = () => {
    if (chapterIdx > 0) {
      sound.playClick();
      setChapterIdx(chapterIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-[#0e152d] border-2 border-[#c9bcf6]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col retro-window">
        {/* Title Bar */}
        <div className="h-9 px-3 bg-[#1e274a] border-b border-[#c9bcf6]/30 flex items-center justify-between text-[#fdfaf3]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#fde047]" />
            <span className="font-pixel text-[11px] tracking-wider">
              STORY.LOG — CHAPTER {current.id} / 4
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-5 h-5 flex items-center justify-center rounded bg-[#f4a6b8] text-[#2c1424] hover:bg-[#ff9bb1] cursor-pointer"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

        {/* Story Body */}
        <div className="p-4 space-y-3.5 text-xs text-[#fdfaf3] overflow-y-auto max-h-[80vh]">
          {/* Chapter Header */}
          <div className="flex items-center justify-between border-b border-[#c9bcf6]/20 pb-2">
            <div>
              <span className="text-[10px] font-mono text-[#f4a6b8] block">{current.date}</span>
              <h3 className="font-serif-dream text-base font-bold text-[#fdfaf3]">
                {current.title}
              </h3>
              <p className="text-[11px] text-[#c9bcf6] italic">{current.subtitle}</p>
            </div>
            <span className="text-3xl shrink-0 p-2 bg-[#1b2347] rounded-xl border border-[#c9bcf6]/30">
              {current.icon}
            </span>
          </div>

          {/* Narrative Paragraphs */}
          <div className="space-y-2 text-stone-200 text-xs leading-relaxed font-sans">
            {current.narrative.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Pip Field Notes */}
          <div className="p-3 rounded-lg bg-[#182142] border-l-2 border-[#fde047] text-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-pixel text-[#fde047] mb-1">
              <Feather className="w-3 h-3" />
              <span>PIP'S JOURNAL ENTRY:</span>
            </div>
            <p className="font-serif-dream italic text-stone-300">
              "{current.thought}"
            </p>
          </div>

          {/* Chapter Controls */}
          <div className="pt-2 border-t border-[#c9bcf6]/20 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={chapterIdx === 0}
              className={`px-3 py-1 rounded text-xs flex items-center gap-1 ${
                chapterIdx === 0 ? 'opacity-40 cursor-not-allowed bg-[#182142]' : 'bg-[#253059] hover:bg-[#344278] cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev Chapter</span>
            </button>

            <span className="font-mono text-[10px] text-[#c9bcf6]">
              {chapterIdx + 1} of {CHAPTERS.length}
            </span>

            <button
              onClick={next}
              disabled={chapterIdx === CHAPTERS.length - 1}
              className={`px-3 py-1 rounded text-xs flex items-center gap-1 font-bold ${
                chapterIdx === CHAPTERS.length - 1 ? 'opacity-40 cursor-not-allowed bg-[#182142]' : 'bg-[#f4a6b8] text-[#2c1424] hover:bg-[#ff9bb1] cursor-pointer'
              }`}
            >
              <span>Next Chapter</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
