import React from 'react';
import { PipCharacter } from '../PipCharacter';
import { Sparkles, Heart, Award, Compass, Feather } from 'lucide-react';

interface PipProfileProps {
  customAssetUrl: string | null;
  onOpenAssetInspector: () => void;
}

export const PipProfile: React.FC<PipProfileProps> = ({
  customAssetUrl,
  onOpenAssetInspector
}) => {
  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Pip Hero Card */}
      <div className="bg-[#121933] border border-[#c9bcf6]/30 rounded-xl p-4 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="shrink-0">
          <PipCharacter
            size="md"
            showTagline={false}
            interactiveSpeech={false}
            onOpenAssetInspector={onOpenAssetInspector}
            customAssetUrl={customAssetUrl}
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="inline-block px-2 py-0.5 rounded bg-[#1c2448] text-[#fde047] font-pixel text-[10px] mb-1.5 border border-[#c9bcf6]/20">
            OFFICIAL NURSERY CREDENTIALS
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fdfaf3] tracking-wide">
            Pip
          </h2>
          <p className="text-xs text-[#c9bcf6] font-medium tracking-wide">
            Junior Dream Engineer · Midnight Nursery
          </p>
          <p className="text-sm font-serif-dream italic text-[#f4a6b8] mt-1.5">
            "I build the dreams you fall asleep inside."
          </p>

          <div className="mt-3 p-3 bg-[#0a0e1c] rounded-lg border border-[#c9bcf6]/20 text-xs text-stone-300 leading-relaxed font-serif-dream italic">
            "Oh! Hello there, sleepy traveler... *yawns softly* Welcome to my midnight computer! While everyone in the waking world is asleep, I sit up here among the moonbeams stitching together clouds, mixing lavender starlight, and winding up music boxes so you have wonderful dreams to wake up from."
          </div>
        </div>
      </div>

      {/* Pip's Dream Engineering Toolbelt */}
      <div className="space-y-2">
        <span className="font-pixel text-[10px] text-[#c9bcf6] uppercase tracking-wider block">
          Pip's Official Dream Engineering Toolbelt
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-lg bg-[#11172e] border border-[#c9bcf6]/20 flex items-start gap-3">
            <div className="text-xl shrink-0">🪡</div>
            <div>
              <span className="font-bold text-[#fdfaf3] block">Moonbeam Needle</span>
              <span className="text-stone-300 text-[11px]">
                Forged from crystallized crescent rays. Used to gently sew frayed dreams and patchwork clouds back together.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11172e] border border-[#c9bcf6]/20 flex items-start gap-3">
            <div className="text-xl shrink-0">🗝️</div>
            <div>
              <span className="font-bold text-[#fdfaf3] block">Brass Clockwork Key</span>
              <span className="text-stone-300 text-[11px]">
                Winds the soothing celesta chime cylinder in the Lullaby Lab so tired ears hear peaceful pentatonic bells.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11172e] border border-[#c9bcf6]/20 flex items-start gap-3">
            <div className="text-xl shrink-0">✨</div>
            <div>
              <span className="font-bold text-[#fdfaf3] block">Pocket Stardust Shaker</span>
              <span className="text-stone-300 text-[11px]">
                Gently seasoned onto heavy eyelids to induce cozy yawns and illuminate happy sleepscapes.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11172e] border border-[#c9bcf6]/20 flex items-start gap-3">
            <div className="text-xl shrink-0">🫖</div>
            <div>
              <span className="font-bold text-[#fdfaf3] block">Chamomile Dew Pipette</span>
              <span className="text-stone-300 text-[11px]">
                Two warm drops calm restless racing thoughts and dissolve anxious nightmare clouds into sweet morning mist.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Hackathon Context */}
      <div className="p-3 rounded-lg bg-[#16203f] border border-[#fde047]/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#fde047]" />
          <span className="text-[#fdfaf3] font-medium">haX.baby "Baby's First Website" Hackathon Entry</span>
        </div>
        <span className="text-[10px] font-mono-code text-[#c9bcf6]">
          PIP.EXE // COMPLIANT
        </span>
      </div>
    </div>
  );
};
