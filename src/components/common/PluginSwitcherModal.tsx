import React from 'react';
import { X, Check, Wrench, UtensilsCrossed, ScanBarcode, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { BusinessType } from '../../types';
import { BUSINESS_TYPES } from '../../data/mockData';

interface PluginSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBusinessType: BusinessType;
  onSelectBusinessType: (type: BusinessType) => void;
}

export const PluginSwitcherModal: React.FC<PluginSwitcherModalProps> = ({
  isOpen,
  onClose,
  activeBusinessType,
  onSelectBusinessType
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Modal */}
        <div className="bg-[#008952] text-white px-5 pt-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Modular Plugin Switcher</h3>
              <p className="text-[11px] text-emerald-100 font-medium">Usaha Qu 1.0 • Partisi Modul Universal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Description */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#008952] shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-emerald-950 font-medium leading-relaxed">
              Pilih model operasional usaha Anda. Tampilan dashboard, alur POS kasir, dan penamaan antrian/meja/rak akan menyesuaikan otomatis tanpa kehilangan data.
            </p>
          </div>

          <div className="space-y-2.5">
            {BUSINESS_TYPES.map((bt) => {
              const isSelected = activeBusinessType === bt.id;
              
              const renderIcon = () => {
                if (bt.id === 'bengkel') return <Wrench className="w-6 h-6 stroke-[2.2]" />;
                if (bt.id === 'resto') return <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />;
                return <ScanBarcode className="w-6 h-6 stroke-[2.2]" />;
              };

              return (
                <div
                  key={bt.id}
                  onClick={() => {
                    onSelectBusinessType(bt.id);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#008952] bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected 
                          ? 'bg-[#008952] text-white' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-[#008952]'
                      }`}
                    >
                      {renderIcon()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#008952] transition-colors">
                          {bt.name}
                        </h4>
                        <span 
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            isSelected 
                              ? 'bg-[#008952] text-white' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {bt.badgeLabel}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                        {bt.tagline}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {bt.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#008952] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-emerald-400 transition-colors" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#008952]" />
              Satu Aplikasi untuk Semua Jenis Usaha
            </span>
            <span className="font-bold text-slate-700">Versi 1.0 Modular</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm"
          >
            Tutup & Terapkan Mode Ini
          </button>
        </div>
      </div>
    </div>
  );
};
