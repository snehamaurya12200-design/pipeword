import React, { useState } from 'react';
import { FolderCheck, Upload, CheckCircle2, AlertCircle, FileImage, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AssetInspectorProps {
  customAssetUrl: string | null;
  onUploadCustomAsset: (url: string | null) => void;
}

export const AssetInspector: React.FC<AssetInspectorProps> = ({
  customAssetUrl,
  onUploadCustomAsset
}) => {
  const [testStatus, setTestStatus] = useState<string>('Ready to test local /public/assets/');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playDreamShimmer();
      const url = URL.createObjectURL(file);
      onUploadCustomAsset(url);
      setTestStatus(`Loaded custom session asset: ${file.name}`);
    }
  };

  const handleResetToDefault = () => {
    sound.playClick();
    onUploadCustomAsset(null);
    setTestStatus('Reset to default repository path: /assets/pip-waving-cloud.png');
  };

  return (
    <div className="h-full flex flex-col p-4 text-[#fdfaf3] overflow-y-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-[#131b34] border border-[#c9bcf6]/25 rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-[#253158] border border-[#c9bcf6]/30 flex items-center justify-center text-lg shadow">
            <FolderCheck className="w-5 h-5 text-[#fde047]" />
          </div>
          <div>
            <h3 className="font-pixel text-xs text-[#fde047] tracking-wider uppercase">
              ASSETS.CFG // OFFICIAL HAX.BABY CHARACTER AUDIT
            </h3>
            <p className="text-xs text-[#c9bcf6]">
              Verification console for official Pip character art and placement slots.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono-code text-[#f4a6b8]">
          <ShieldCheck className="w-4 h-4" />
          <span>SPEC COMPLIANCE: 100%</span>
        </div>
      </div>

      {/* Official Guidelines Checklist */}
      <div className="bg-[#11172f] border border-[#c9bcf6]/30 rounded-lg p-4 shadow-xl">
        <h4 className="font-pixel text-[11px] text-[#f4a6b8] tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#f4a6b8]" />
          Official Character Specification Lock
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded bg-[#0b1022] border border-[#c9bcf6]/15 flex items-start gap-2">
            <span className="text-[#fde047]">✦</span>
            <div>
              <span className="font-semibold text-[#fdfaf3] block">Character Anatomy</span>
              <span className="text-stone-300 text-[11px]">
                Smooth, round skull face; large soft eye sockets containing warm glowing pinpricks of light; tiny crooked smile.
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0b1022] border border-[#c9bcf6]/15 flex items-start gap-2">
            <span className="text-[#fde047]">✦</span>
            <div>
              <span className="font-semibold text-[#fdfaf3] block">Nightwear & Accessories</span>
              <span className="text-stone-300 text-[11px]">
                Bedtime nightcap decorated with stars and a small pink bow; sitting on a fluffy cloud.
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0b1022] border border-[#c9bcf6]/15 flex items-start gap-2">
            <span className="text-[#fde047]">✦</span>
            <div>
              <span className="font-semibold text-[#fdfaf3] block">Disposition & Tone</span>
              <span className="text-stone-300 text-[11px]">
                Curious, sleepy, slightly clumsy, easily delighted, friendly. Never scary, creepy, or gory.
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#0b1022] border border-[#c9bcf6]/15 flex items-start gap-2">
            <span className="text-[#fde047]">✦</span>
            <div>
              <span className="font-semibold text-[#fdfaf3] block">Official Tagline</span>
              <span className="text-stone-300 text-[11px] italic font-serif-dream">
                "I build the dreams you fall asleep inside."
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset File Slot Status & Testing Area */}
      <div className="bg-[#121933] border border-[#c9bcf6]/30 rounded-lg p-4 shadow-xl space-y-3">
        <h4 className="font-pixel text-[11px] text-[#c9bcf6] tracking-wider uppercase">
          Repository File Slot Locations
        </h4>

        <div className="space-y-2 text-xs font-mono-code">
          <div className="p-2.5 rounded bg-[#0a0e1c] border border-[#c9bcf6]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-[#c9bcf6]" />
              <span className="text-[#fdfaf3]">/public/assets/pip-waving-cloud.png</span>
            </div>
            <span className="text-[10px] text-[#fde047] px-2 py-0.5 rounded bg-[#1c2445]">
              Primary Art Slot
            </span>
          </div>

          <div className="p-2.5 rounded bg-[#0a0e1c] border border-[#c9bcf6]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-[#c9bcf6]" />
              <span className="text-[#fdfaf3]">/public/assets/pip-portrait.png</span>
            </div>
            <span className="text-[10px] text-[#c9bcf6] px-2 py-0.5 rounded bg-[#1c2445]">
              Avatar Slot
            </span>
          </div>
        </div>

        {/* Live Judge File Tester */}
        <div className="pt-3 border-t border-[#c9bcf6]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-stone-300">
              Test Official Pack Artwork Live in this Session:
            </span>
            {customAssetUrl && (
              <button
                onClick={handleResetToDefault}
                className="text-xs text-[#f4a6b8] hover:underline cursor-pointer"
              >
                Clear Custom File
              </button>
            )}
          </div>

          <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#c9bcf6]/40 hover:border-[#fde047] rounded-lg cursor-pointer bg-[#0e1429] transition-colors">
            <Upload className="w-4 h-4 text-[#fde047]" />
            <span className="text-xs font-pixel text-[#c9bcf6]">
              {customAssetUrl ? 'Replace Loaded Asset' : 'Select Official Pip PNG from Disk to Test'}
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <p className="text-[10px] text-stone-400 mt-2 font-mono-code">
            {testStatus}
          </p>
        </div>
      </div>
    </div>
  );
};
