import React, { useState } from 'react';
import { Sparkles, Moon, FlaskConical, RotateCcw, Check, Heart, Feather, Compass, Award } from 'lucide-react';
import { DreamIngredient, GeneratedDream } from '../../types/os';
import { sound } from '../../utils/audio';

const INGREDIENTS: DreamIngredient[] = [
  {
    id: 'starlight-dust',
    name: 'Starlight Dust',
    category: 'glow',
    icon: '✨',
    color: '#fde047',
    description: 'Ground meteoric sparkles gathered from the northern constellation rim.',
    fluffinessBonus: 15,
    starlightLumens: 45,
    sweetness: 20,
    rarity: 'Common'
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    category: 'essence',
    icon: '🪻',
    color: '#b8a9e8',
    description: 'Distilled twilight vapor from Pip’s rooftop slumber garden.',
    fluffinessBonus: 25,
    starlightLumens: 10,
    sweetness: 40,
    rarity: 'Common'
  },
  {
    id: 'cloud-cotton',
    name: 'Cloud Cotton',
    category: 'element',
    icon: '☁️',
    color: '#fdfaf3',
    description: 'Carded cumulus fibers combed by gentle midnight breezes.',
    fluffinessBonus: 50,
    starlightLumens: 15,
    sweetness: 15,
    rarity: 'Common'
  },
  {
    id: 'clockwork-chime',
    name: 'Clockwork Chime',
    category: 'sound',
    icon: '🔔',
    color: '#f4a6b8',
    description: 'A tiny winding gear echoing the rhythmic tick of a nursery music box.',
    fluffinessBonus: 10,
    starlightLumens: 25,
    sweetness: 35,
    rarity: 'Rare'
  },
  {
    id: 'whispering-stars',
    name: 'Whispering Constellation',
    category: 'glow',
    icon: '🌟',
    color: '#ffd166',
    description: 'Secret stellar maps told in hushed bedtime murmurs.',
    fluffinessBonus: 20,
    starlightLumens: 50,
    sweetness: 25,
    rarity: 'Celestial'
  },
  {
    id: 'jellyfish-lantern',
    name: 'Jellyfish Lanterns',
    category: 'element',
    icon: '🪼',
    color: '#90e0ef',
    description: 'Deep tranquil bioluminescent orbs drifting through night sky rivers.',
    fluffinessBonus: 30,
    starlightLumens: 35,
    sweetness: 30,
    rarity: 'Rare'
  },
  {
    id: 'chamomile-honey',
    name: 'Chamomile Honey Dew',
    category: 'essence',
    icon: '🍯',
    color: '#f7c06d',
    description: 'Warming golden nectar that gently slows down fast thoughts.',
    fluffinessBonus: 35,
    starlightLumens: 20,
    sweetness: 50,
    rarity: 'Common'
  },
  {
    id: 'midnight-willow',
    name: 'Silver Willow Leaves',
    category: 'element',
    icon: '🍃',
    color: '#a7c957',
    description: 'Cool leaves from the ancient tree where Pip found his nightcap.',
    fluffinessBonus: 25,
    starlightLumens: 15,
    sweetness: 20,
    rarity: 'Celestial'
  }
];

export const DreamEngine: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['starlight-dust', 'cloud-cotton']);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [currentDream, setCurrentDream] = useState<GeneratedDream | null>(null);
  const [savedDreams, setSavedDreams] = useState<GeneratedDream[]>([
    {
      title: "The Whispering Star-Cradle",
      archetype: "Deep Slumber · Level 3",
      sleepinessScore: 94,
      starlightLevel: 65,
      fluffinessPercent: 88,
      recipeNames: ["Starlight Dust", "Cloud Cotton", "Lavender Mist"],
      fieldNotes: "Tested on a sleepy dormouse. Fallen asleep within 12 seconds. Pip approves.",
      timestamp: "11:42 PM",
      palette: ["#0d1326", "#b8a9e8", "#f4a6b8", "#fde047"]
    }
  ]);

  const toggleIngredient = (id: string) => {
    sound.playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 4) {
        // limit to 4 max
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSynthesize = () => {
    if (selectedIds.length === 0) return;
    setIsSynthesizing(true);
    sound.playDreamShimmer();

    setTimeout(() => {
      const selected = INGREDIENTS.filter((item) => selectedIds.includes(item.id));
      const totalFluff = Math.min(100, selected.reduce((acc, curr) => acc + curr.fluffinessBonus, 20));
      const totalLumens = Math.min(100, selected.reduce((acc, curr) => acc + curr.starlightLumens, 15));
      const totalSweet = Math.min(100, selected.reduce((acc, curr) => acc + curr.sweetness, 25));
      const sleepiness = Math.min(99, Math.round((totalFluff * 0.4) + (totalSweet * 0.4) + (totalLumens * 0.2)));

      // Generate poetic title based on ingredients
      const lead = selected[0]?.name.split(' ')[0] || 'Midnight';
      const tail = selected[1]?.name.split(' ')[1] || 'Cradle';
      const archetypeNames = [
        "Celestial Slumber Voyage",
        "Soft Cloud Wanderer",
        "Lavender Tea Reverie",
        "Starlight Garden Patrol"
      ];

      const newDream: GeneratedDream = {
        title: `The ${lead} ${tail} Dream`,
        archetype: archetypeNames[Math.floor(Math.random() * archetypeNames.length)],
        sleepinessScore: sleepiness,
        starlightLevel: totalLumens,
        fluffinessPercent: totalFluff,
        recipeNames: selected.map((s) => s.name),
        fieldNotes: `Synthesized with ${selected.length} midnight ingredients. Ideal for resting tired minds and wandering imaginations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        palette: ['#0d1326', '#1a2347', selected[0]?.color || '#b8a9e8', '#fde047']
      };

      setCurrentDream(newDream);
      setSavedDreams((prev) => [newDream, ...prev.slice(0, 4)]);
      setIsSynthesizing(false);
    }, 1100);
  };

  const clearSelection = () => {
    sound.playClick();
    setSelectedIds([]);
  };

  const selectedItems = INGREDIENTS.filter((i) => selectedIds.includes(i.id));

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner & Pip's Instruction */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-[#253158] border border-[#c9bcf6]/30 flex items-center justify-center text-lg shadow">
            🧪
          </div>
          <div>
            <h3 className="font-pixel text-xs text-[#fde047] tracking-wider uppercase">
              DREAM_ENGINE.EXE // RECIPE SYNTHESIZER
            </h3>
            <p className="text-xs text-[#c9bcf6]">
              Select up to 4 dream ingredients into Pip's copper mixing flask.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code text-stone-300">
          <span>Crucible:</span>
          <span className="px-2 py-0.5 rounded bg-[#0d1326] border border-[#c9bcf6]/20 text-[#f4a6b8] font-bold">
            {selectedIds.length} / 4 items
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-[11px] text-[#c9bcf6] hover:text-[#f4a6b8] underline ml-1 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Ingredients Catalog & Dream Laboratory Flask */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ingredients Selection Pane (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c9bcf6] font-pixel text-[10px]">
              Available Dream Ingredients
            </span>
            <span className="text-[11px] text-stone-400">Click to add/remove</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INGREDIENTS.map((ing) => {
              const isSelected = selectedIds.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`p-2.5 text-left rounded-lg border transition-all flex items-start gap-2.5 relative retro-button ${
                    isSelected
                      ? 'bg-[#222d54] border-[#fde047] ring-1 ring-[#fde047]/50 shadow-md'
                      : 'bg-[#11172e] border-[#c9bcf6]/20 hover:bg-[#1a2342] hover:border-[#c9bcf6]/40'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{ing.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-medium text-xs text-[#fdfaf3] truncate">
                        {ing.name}
                      </span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#fde047] shrink-0" />
                      ) : (
                        <span className="text-[9px] text-[#c9bcf6]/70 uppercase font-mono-code">
                          {ing.rarity}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-300 line-clamp-2 mt-0.5">
                      {ing.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-[#c9bcf6]">
                      <span>+{ing.fluffinessBonus}% fluff</span>
                      <span>·</span>
                      <span>+{ing.starlightLumens} lm</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dream Flask & Live Preview Pane (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="bg-[#121931] border border-[#c9bcf6]/30 rounded-lg p-3.5 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#c9bcf6]/20 pb-2 mb-3">
                <span className="font-pixel text-[11px] text-[#f4a6b8] tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Crucible Preview
                </span>
                <span className="text-[10px] font-mono-code text-[#c9bcf6]">
                  {selectedIds.length === 0 ? 'Empty Flask' : 'Simmering'}
                </span>
              </div>

              {/* Dynamic Dream Canvas Box */}
              <div className="h-44 rounded-lg bg-[#0a0e1c] border border-[#c9bcf6]/25 relative overflow-hidden flex items-center justify-center p-3">
                {/* Visual rendering based on selected ingredients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#131b34]/80 to-[#0a0e1c] pointer-events-none" />

                {/* Starlight sparkles */}
                {selectedIds.includes('starlight-dust') && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-3 left-6 text-[#fde047] animate-ping text-xs">✦</div>
                    <div className="absolute top-12 right-8 text-[#fde047] animate-pulse text-sm">✦</div>
                    <div className="absolute bottom-6 left-12 text-[#fde047] animate-bounce text-xs">✦</div>
                  </div>
                )}

                {/* Lavender Mist */}
                {selectedIds.includes('lavender-mist') && (
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#7c62b5]/30 to-transparent blur-md pointer-events-none" />
                )}

                {/* Cloud Cotton */}
                {selectedIds.includes('cloud-cotton') && (
                  <div className="absolute -bottom-4 -left-6 -right-6 flex justify-around opacity-80 pointer-events-none">
                    <div className="w-24 h-14 bg-white/20 rounded-full blur-md" />
                    <div className="w-32 h-18 bg-white/25 rounded-full blur-md -mt-2" />
                    <div className="w-20 h-12 bg-white/20 rounded-full blur-md" />
                  </div>
                )}

                {/* Jellyfish Lantern */}
                {selectedIds.includes('jellyfish-lantern') && (
                  <div className="absolute top-6 right-12 w-8 h-8 rounded-full bg-[#90e0ef]/40 border border-[#90e0ef] blur-sm animate-pulse" />
                )}

                {/* Center Flask / Dream Icon */}
                <div className="relative z-10 text-center">
                  {selectedIds.length === 0 ? (
                    <div className="text-stone-400 text-xs flex flex-col items-center gap-1.5">
                      <Moon className="w-7 h-7 text-[#c9bcf6]/50" />
                      <span>Pick dream ingredients to begin simmering.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center -space-x-2 mb-2">
                        {selectedItems.map((item) => (
                          <div
                            key={item.id}
                            style={{ backgroundColor: item.color }}
                            className="w-8 h-8 rounded-full border-2 border-[#0a0e1c] flex items-center justify-center text-sm shadow-md animate-bounce"
                            title={item.name}
                          >
                            {item.icon}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs font-serif-dream text-[#fdfaf3] font-medium max-w-xs">
                        {selectedItems.map((s) => s.name).join(' + ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Synthesize Action Button */}
            <div className="mt-3">
              <button
                disabled={selectedIds.length === 0 || isSynthesizing}
                onClick={handleSynthesize}
                className={`w-full py-2.5 px-4 rounded-md font-pixel text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 retro-button ${
                  selectedIds.length === 0 || isSynthesizing
                    ? 'bg-[#1b223d] text-stone-500 border border-[#c9bcf6]/10 cursor-not-allowed'
                    : 'bg-[#9e8ad8] hover:bg-[#b8a9e8] text-[#090d1c] font-bold border border-[#fdfaf3]/40 shadow-lg cursor-pointer'
                }`}
              >
                {isSynthesizing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-[#090d1c]" />
                    <span>SIMMERING MOONBEAMS...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#090d1c]" />
                    <span>SYNTHESIZE DREAM</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Dream Showcase Card */}
      {currentDream && (
        <div className="bg-[#141d3a] border-2 border-[#fde047]/60 rounded-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-[#fde047] text-[#090d1c] font-pixel text-[9px] font-bold rounded-bl-lg">
            OFFICIAL DREAM CERTIFICATE
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#c9bcf6]/20 pb-3">
            <div>
              <span className="text-[10px] font-mono-code text-[#f4a6b8] uppercase tracking-wider">
                {currentDream.archetype}
              </span>
              <h4 className="text-lg font-serif-dream font-semibold text-[#fdfaf3]">
                {currentDream.title}
              </h4>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono-code">
              <div className="text-center">
                <span className="block text-[9px] text-[#c9bcf6]">SLEEPINESS</span>
                <span className="text-sm font-bold text-[#fde047]">{currentDream.sleepinessScore}%</span>
              </div>
              <div className="text-center">
                <span className="block text-[9px] text-[#c9bcf6]">FLUFFINESS</span>
                <span className="text-sm font-bold text-[#fdfaf3]">{currentDream.fluffinessPercent}%</span>
              </div>
              <div className="text-center">
                <span className="block text-[9px] text-[#c9bcf6]">STARLIGHT</span>
                <span className="text-sm font-bold text-[#c9bcf6]">{currentDream.starlightLevel} lm</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex-1">
              <p className="text-stone-300 italic font-serif-dream text-xs">
                "{currentDream.fieldNotes}"
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 items-center text-[10px]">
                <span className="text-[#c9bcf6]">Recipe:</span>
                {currentDream.recipeNames.map((name, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#090d1c] border border-[#c9bcf6]/30 rounded text-[#fdfaf3]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#c9bcf6]/70 shrink-0 font-mono-code">
              Certified by Pip · {currentDream.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* History of Saved Nursery Dreams */}
      <div className="mt-4 pt-3 border-t border-[#c9bcf6]/15">
        <h4 className="font-pixel text-[10px] text-[#c9bcf6] tracking-wider uppercase mb-2">
          Archived Midnight Nursery Formulations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {savedDreams.map((d, index) => (
            <div
              key={index}
              className="p-2.5 rounded bg-[#0d142a] border border-[#c9bcf6]/15 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-medium text-[#fdfaf3] block truncate">
                  {d.title}
                </span>
                <span className="text-[10px] text-stone-400">
                  {d.recipeNames.slice(0, 2).join(', ')} · Sleepiness: {d.sleepinessScore}%
                </span>
              </div>
              <span className="text-[10px] font-mono-code text-[#fde047] shrink-0">
                {d.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
