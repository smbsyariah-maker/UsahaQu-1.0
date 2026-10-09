import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

interface SubMenuHeaderProps {
  title: string;
  subtitle?: string;
  infoLabel?: string;
  onBack: () => void;
  iconGraphic?: React.ReactNode;
  iconName?: string;
}

export const SubMenuHeader: React.FC<SubMenuHeaderProps> = ({
  title,
  onBack,
  iconName
}) => {
  return (
    <div className="bg-[#008952] text-white px-4 py-3 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Kembali"
          className="w-9 h-9 rounded-full bg-white/15 active:bg-white/30 hover:bg-white/20 flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          {iconName && (
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <IconRenderer name={iconName} className="w-4.5 h-4.5 text-white stroke-[2.3]" />
            </div>
          )}
          <h1 className="text-base font-bold text-white tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};
