import React from 'react';
import { Wrench, Cog, UtensilsCrossed, ChefHat, Store, ScanBarcode, Handshake, ShoppingBag } from 'lucide-react';
import { BusinessType } from '../../types';

interface DynamicLogoUQProps {
  businessType?: BusinessType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  versionText?: string;
  className?: string;
}

export const DynamicLogoUQ: React.FC<DynamicLogoUQProps> = ({
  businessType = 'bengkel',
  size = 'md',
  showText = false,
  versionText = '1.0',
  className = ''
}) => {
  // Dimension tokens
  const sizeMap = {
    xs: { box: 'w-7 h-7 rounded-lg', icon: 'w-3.5 h-3.5', text: 'text-xs', sub: 'text-[9px]', uq: 'text-[9px]' },
    sm: { box: 'w-9 h-9 rounded-xl', icon: 'w-4.5 h-4.5', text: 'text-sm', sub: 'text-[10px]', uq: 'text-[11px]' },
    md: { box: 'w-11 h-11 rounded-2xl', icon: 'w-5.5 h-5.5', text: 'text-base', sub: 'text-xs', uq: 'text-xs' },
    lg: { box: 'w-16 h-16 rounded-2xl', icon: 'w-8 h-8', text: 'text-xl', sub: 'text-sm', uq: 'text-sm' },
    xl: { box: 'w-20 h-20 rounded-3xl', icon: 'w-10 h-10', text: 'text-2xl', sub: 'text-base', uq: 'text-base' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Dynamic Theme Config per Business Type
  const theme = {
    bengkel: {
      gradient: 'from-[#008952] via-[#006f42] to-[#0f291e]',
      border: 'border-emerald-300/30',
      shadow: 'shadow-[0_8px_20px_rgba(0,137,82,0.28)]',
      glow: 'bg-emerald-400/20',
      badgeBg: 'bg-emerald-950/70 text-emerald-200 border-emerald-500/30',
      subtitle: 'Bengkel Qu',
      label: 'Servis & Sparepart',
      MainIcon: Wrench,
      SubIcon: Cog
    },
    resto: {
      gradient: 'from-[#008952] via-[#047857] to-[#c2410c]',
      border: 'border-amber-300/30',
      shadow: 'shadow-[0_8px_20px_rgba(194,65,12,0.25)]',
      glow: 'bg-orange-400/20',
      badgeBg: 'bg-stone-950/70 text-orange-200 border-orange-500/30',
      subtitle: 'Resto Qu',
      label: 'Kuliner & Meja Dine-in',
      MainIcon: UtensilsCrossed,
      SubIcon: ChefHat
    },
    ritel: {
      gradient: 'from-[#008952] via-[#0d9488] to-[#1d4ed8]',
      border: 'border-cyan-300/30',
      shadow: 'shadow-[0_8px_20px_rgba(29,78,216,0.25)]',
      glow: 'bg-cyan-400/20',
      badgeBg: 'bg-slate-950/70 text-cyan-200 border-cyan-500/30',
      subtitle: 'Ritel Qu',
      label: 'Kasir Cepat & Barcode',
      MainIcon: Store,
      SubIcon: ScanBarcode
    },
    collabqu: {
      gradient: 'from-[#7c3aed] via-[#6366f1] to-[#312e81]',
      border: 'border-purple-300/30',
      shadow: 'shadow-[0_8px_20px_rgba(124,58,237,0.28)]',
      glow: 'bg-purple-400/25',
      badgeBg: 'bg-purple-950/70 text-purple-200 border-purple-500/30',
      subtitle: 'Collab Qu',
      label: 'Titip Jual & Konsinyasi',
      MainIcon: Handshake,
      SubIcon: ShoppingBag
    }
  }[businessType] || {
    gradient: 'from-[#008952] to-[#006039]',
    border: 'border-emerald-300/30',
    shadow: 'shadow-[0_8px_20px_rgba(0,137,82,0.25)]',
    glow: 'bg-emerald-400/20',
    badgeBg: 'bg-emerald-950/70 text-emerald-200 border-emerald-500/30',
    subtitle: 'Usaha Qu',
    label: 'POS Universal',
    MainIcon: Store,
    SubIcon: Cog
  };

  const { MainIcon, SubIcon } = theme;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Geometric Modern Emblem UQ */}
      <div className="relative shrink-0 select-none group">
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute -inset-0.5 rounded-3xl ${theme.glow} blur-xs opacity-75 group-hover:opacity-100 transition-opacity`}
        />

        {/* Master Badge Container */}
        <div
          className={`relative ${currentSize.box} bg-gradient-to-br ${theme.gradient} border ${theme.border} ${theme.shadow} flex items-center justify-center text-white overflow-hidden transition-transform duration-300 active:scale-95`}
        >
          {/* Subtle Diagonal Gloss Reflection */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/15 rotate-45 pointer-events-none transform -translate-x-full group-hover:translate-x-24 transition-transform duration-700" />

          {/* Sub-Icon Watermark Backdrop */}
          <div className="absolute -bottom-1 -right-1 text-white/15 pointer-events-none">
            <SubIcon className="w-6 h-6 stroke-[1.8]" />
          </div>

          {/* Master Center Icon */}
          <div className="relative z-10 flex items-center justify-center drop-shadow-sm">
            <MainIcon className={`${currentSize.icon} stroke-[2.3] text-white`} />
          </div>

          {/* Monogram UQ Micro Watermark at Top Left */}
          <span
            className={`absolute top-0.5 left-1 font-black text-white/30 tracking-tighter ${currentSize.uq} pointer-events-none leading-none`}
          >
            UQ
          </span>
        </div>

        {/* Floating Mini Version Badge for larger sizes */}
        {versionText && (size === 'lg' || size === 'xl') && (
          <div className="absolute -bottom-1.5 -right-1.5 bg-white text-[#008952] font-black text-[10px] px-2 py-0.5 rounded-full shadow-md border border-emerald-200">
            v{versionText}
          </div>
        )}
      </div>

      {/* Typography Label (Optional) */}
      {showText && (
        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-slate-900 tracking-tight leading-tight ${currentSize.text}`}>
              Usaha Qu
            </span>
            {versionText && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-[#008952]">
                {versionText}
              </span>
            )}
          </div>
          <span className={`font-semibold text-slate-500 leading-tight truncate ${currentSize.sub}`}>
            {theme.subtitle} • {theme.label}
          </span>
        </div>
      )}
    </div>
  );
};
