import React, { useState } from 'react';
import { 
  X, 
  Check, 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Package, 
  Megaphone, 
  Users, 
  Store, 
  ShieldCheck, 
  Building2, 
  Settings, 
  RotateCcw,
  Sparkles,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { SubscriptionState, BusinessType } from '../../types';

export interface NavTabOption {
  id: string;
  label: string;
  iconName: string;
  category: 'Utama' | 'Operasional' | 'Manajerial';
  description: string;
  requiredPlan?: 'core' | 'corporate';
}

export const ALL_NAVBAR_OPTIONS: NavTabOption[] = [
  { id: 'dashboard', label: 'Beranda', iconName: 'LayoutDashboard', category: 'Utama', description: 'Dashboard utama & ringkasan omset' },
  { id: 'kasir', label: 'Kasir', iconName: 'CreditCard', category: 'Operasional', description: 'Point of Sale & transaksi kilat' },
  { id: 'laporan', label: 'Laporan', iconName: 'BarChart3', category: 'Operasional', description: 'Rekap omzet, laba & audit kasir' },
  { id: 'stok', label: 'Stok', iconName: 'Package', category: 'Operasional', description: 'Katalog barang & persediaan gudang' },
  { id: 'marketing', label: 'Marketing', iconName: 'Megaphone', category: 'Operasional', description: 'Etalase online & broadcast WhatsApp' },
  { id: 'pelanggan', label: 'CRM', iconName: 'Users', category: 'Operasional', description: 'Database pelanggan & riwayat member' },
  { id: 'basic', label: 'Basic', iconName: 'Store', category: 'Manajerial', description: 'Profil resmi usaha & plugin model' },
  { id: 'core', label: 'Core', iconName: 'ShieldCheck', category: 'Manajerial', description: 'Profil outlet + Matriks hak akses', requiredPlan: 'core' },
  { id: 'corporate', label: 'Corporate', iconName: 'Building2', category: 'Manajerial', description: 'Profil + Hak Akses + 3 Cabang Cloud', requiredPlan: 'corporate' },
  { id: 'setting', label: 'Setting', iconName: 'Settings', category: 'Manajerial', description: 'Pengaturan tema, backup & lisensi' }
];

export const DEFAULT_MANAGER_TABS = ['dashboard', 'basic', 'core', 'corporate', 'setting'];

interface CustomNavbarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTabIds: string[];
  onSaveTabs: (tabs: string[]) => void;
  subscription?: SubscriptionState;
  businessType?: BusinessType;
}

export const CustomNavbarModal: React.FC<CustomNavbarModalProps> = ({
  isOpen,
  onClose,
  selectedTabIds,
  onSaveTabs,
  subscription,
  businessType = 'bengkel'
}) => {
  const [currentSelection, setCurrentSelection] = useState<string[]>(() => {
    return selectedTabIds && selectedTabIds.length === 5 ? selectedTabIds : DEFAULT_MANAGER_TABS;
  });

  if (!isOpen) return null;

  const handleToggleTab = (tabId: string) => {
    if (tabId === 'dashboard') {
      // Keep dashboard fixed
      return;
    }

    if (currentSelection.includes(tabId)) {
      if (currentSelection.length <= 3) {
        return; // minimum 3 tabs
      }
      setCurrentSelection(currentSelection.filter((id) => id !== tabId));
    } else {
      if (currentSelection.length >= 5) {
        // Replace last non-dashboard item
        const nonDashboard = currentSelection.filter((id) => id !== 'dashboard');
        const updated = ['dashboard', ...nonDashboard.slice(0, 3), tabId];
        setCurrentSelection(updated);
      } else {
        setCurrentSelection([...currentSelection, tabId]);
      }
    }
  };

  const handleResetDefault = () => {
    setCurrentSelection(DEFAULT_MANAGER_TABS);
  };

  const handleSave = () => {
    onSaveTabs(currentSelection);
    onClose();
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'Package': return <Package className="w-5 h-5" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Store': return <Store className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Building2': return <Building2 className="w-5 h-5" />;
      case 'Settings': return <Settings className="w-5 h-5" />;
      default: return <SlidersHorizontal className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#008952] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Kustomisasi Menu Bawah</h3>
              <p className="text-[11px] text-emerald-100">Pilih hingga 5 shortcut menu favorit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Tabs Preview Bar */}
        <div className="bg-slate-100/90 p-3 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Pratinjau Urutan ({currentSelection.length}/5 Menu Terpilih):
          </span>
          <div className="grid grid-cols-5 gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
            {currentSelection.map((id, index) => {
              const opt = ALL_NAVBAR_OPTIONS.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <div key={id} className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-emerald-50 text-[#008952] border border-emerald-200/60">
                  <span className="text-[9px] font-black opacity-60 mb-0.5">#{index + 1}</span>
                  {renderIcon(opt.iconName)}
                  <span className="text-[10px] font-bold mt-1 truncate max-w-full">{opt.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <p className="text-xs text-slate-500 mb-1">
            Klik untuk memilih atau mengganti shortcut tombol pada Bottom Navigation Bar:
          </p>

          <div className="grid grid-cols-1 gap-2">
            {ALL_NAVBAR_OPTIONS.map((opt) => {
              const isSelected = currentSelection.includes(opt.id);
              const isDashboard = opt.id === 'dashboard';

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleToggleTab(opt.id)}
                  disabled={isDashboard}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-[#008952] text-slate-900 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  } ${isDashboard ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#008952] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {renderIcon(opt.iconName)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                        {isDashboard && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-600 rounded">
                            Utama Tetap
                          </span>
                        )}
                        <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded">
                          {opt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{opt.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-[#008952] border-[#008952] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Terapkan ({currentSelection.length} Menu)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
