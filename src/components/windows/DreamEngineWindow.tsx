import React, { useState } from 'react';
import { WindowFrame } from '../WindowFrame';
import { Moon, Sparkles, Heart, FlaskConical, Wand2 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface IngredientCard {
  id: string;
  name: string;
  desc: string;
  fluff: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const INGREDIENTS: IngredientCard[] = [
  {
    id: 'moonlight',
    name: 'Moonlight',
    desc: 'Calms the mind',
    fluff: '+25% fluff',
    icon: <Moon className="w-4 h-4 text-[#7dd3fc]" />,
    bgGradient: 'from-[#172554] to-[#1e3a8a]'
  },
  {
    id: 'stardust',
    name: 'Stardust',
    desc: 'Adds a little sparkle',
    fluff: '+20% fluff',
    icon: <Sparkles className="w-4 h-4 text-[#fde047]" />,
    bgGradient: 'from-[#2e1065] to-[#3b0764]'
  },
  {
    id: 'happy-memory',
    name: 'Happy Memory',
    desc: 'Brings warmth',
    fluff: '+30% fluff',
    icon: <Heart className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />,
    bgGradient: 'from-[#422006] to-[#713f12]'
  }
];

interface DreamEngineWindowProps {
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

export const DreamEngineWindow: React.FC<DreamEngineWindowProps> = ({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  initialPos = { x: 520, y: 350 },
  initialSize = { width: 500, height: 260 },
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['moonlight', 'stardust', 'happy-memory']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDreamTitle, setGeneratedDreamTitle] = useState<string | null>(null);

  const toggleIngredient = (id: string) => {
    sound.playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleGenerate = () => {
    sound.playDreamShimmer();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDreamTitle("The Whispering Cloud-Cradle Dream");
    }, 900);
  };

  return (
    <WindowFrame
      id="dream-engine"
      title="DREAM ENGINE"
      icon={<FlaskConical className="w-3.5 h-3.5 text-[#f4a6b8]" />}
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
        {/* Top Header Row with Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffeef4] border border-[#f4a6b8]/40 flex items-center justify-center text-sm shadow-sm shrink-0">
              🧪
            </div>
            <div>
              <h4 className="font-pixel text-[11px] text-[#4d2d42] font-bold">
                Create your own dream
              </h4>
              <p className="text-[10px] text-[#7d5671] leading-tight">
                Mix 3 magical ingredients and see what kind of dream you get!
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-3.5 py-1.5 rounded-lg bg-[#f4a6b8] hover:bg-[#f28da5] text-[#2c1424] font-pixel text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Wand2 className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Spinning...' : 'Generate Dream'}</span>
          </button>
        </div>

        {/* 3 Ingredients + Dream Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch">
          <div className="sm:col-span-7 grid grid-cols-3 gap-2">
            {INGREDIENTS.map((ing) => {
              const isSelected = selectedIds.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-2 rounded-lg bg-gradient-to-b ${ing.bgGradient} text-white flex flex-col justify-between text-left transition-transform hover:scale-102 border cursor-pointer ${
                    isSelected ? 'border-[#fde047] ring-1 ring-[#fde047]' : 'border-white/20'
                  }`}
                >
                  <div>
                    <div className="mb-1">{ing.icon}</div>
                    <span className="font-semibold text-[10px] block leading-tight truncate">
                      {ing.name}
                    </span>
                    <span className="text-[8px] text-stone-300 block leading-tight mt-0.5 line-clamp-2">
                      {ing.desc}
                    </span>
                  </div>

                  <div className="mt-2 pt-1 border-t border-white/20 flex items-center justify-between text-[8px] text-[#fde047] font-mono">
                    <span>{ing.fluff}</span>
                    <span className="text-xs">☁️</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="sm:col-span-5 h-28 rounded-lg bg-[#0a0f26] border border-[#c9bcf6]/30 relative overflow-hidden flex flex-col items-center justify-center p-2 text-center shadow-inner">
            <span className="text-[9px] font-pixel text-[#c9bcf6] mb-1">
              {generatedDreamTitle || 'Your dream will appear here...'}
            </span>

            <div className="relative w-full h-full flex items-center justify-center">
              <div className="flex items-center gap-1">
                <span className="text-2xl animate-pulse">🌙</span>
                <span className="text-xl -ml-2 text-white/80">☁️</span>
              </div>
              <div className="absolute top-1 right-3 text-[#fde047] text-[10px] animate-ping">✦</div>
              <div className="absolute bottom-1 left-3 text-[#f4a6b8] text-[8px]">✦</div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};
