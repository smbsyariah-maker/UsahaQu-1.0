import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Wrench,
  UtensilsCrossed,
  ScanBarcode,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  MenuModuleConfig, 
  ServiceQueue, 
  WorkshopProfile, 
  UserSession, 
  SubscriptionState,
  BusinessType,
  DiningTable,
  RetailProduct
} from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { DynamicLogoUQ } from '../common/DynamicLogoUQ';
import { BUSINESS_TYPES } from '../../data/mockData';

interface HomeDashboardProps {
  businessType?: BusinessType;
  onOpenPluginSwitcher?: () => void;
  modules: MenuModuleConfig[];
  onSelectModule: (module: MenuModuleConfig) => void;
  queues: ServiceQueue[];
  onOpenNewQueue: () => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
  onSelectQueueItem: (queue: ServiceQueue) => void;
  onQuickSearchPlat: (plate: string) => void;
  profile?: WorkshopProfile;
  userSession?: UserSession | null;
  onLogout?: () => void;
  subscription?: SubscriptionState;
  onOpenSubscription?: () => void;
  onSelectUniversalMenu?: (menuKey: 'setting' | 'basic' | 'core' | 'corporate') => void;
  // Resto Plugin props
  diningTables?: DiningTable[];
  onSelectDiningTable?: (table: DiningTable) => void;
  onOpenNewTableOrder?: () => void;
  onOpenDenahLayoutMeja?: () => void;
  // Retail Plugin props
  retailProducts?: RetailProduct[];
  onNavigateToPOSWithCart?: (cartItems?: any) => void;
  onNavigateToPOS?: () => void;
  onOpenKasirCepatRitel?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  businessType = 'bengkel',
  onOpenPluginSwitcher,
  modules,
  onSelectModule,
  queues,
  onOpenNewQueue,
  onOpenNotifications,
  unreadNotifsCount,
  onSelectQueueItem,
  onQuickSearchPlat,
  profile,
  userSession,
  onLogout,
  subscription,
  onOpenSubscription,
  onSelectUniversalMenu,
  diningTables = [],
  onSelectDiningTable,
  onOpenNewTableOrder,
  onOpenDenahLayoutMeja,
  retailProducts = [],
  onNavigateToPOSWithCart,
  onNavigateToPOS,
  onOpenKasirCepatRitel
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Active business config
  const currentBusinessMeta = BUSINESS_TYPES.find(b => b.id === businessType) || BUSINESS_TYPES[0];

  // Workshop quick stats
  const waitingCount = queues.filter((q) => q.status === 'menunggu').length;
  const inProgressCount = queues.filter((q) => q.status === 'proses').length;
  const completedCount = queues.filter((q) => q.status === 'selesai').length;

  // Resto quick stats
  const emptyTablesCount = diningTables.filter(t => t.status === 'kosong').length;
  const occupiedTablesCount = diningTables.filter(t => t.status === 'terisi').length;
  const billingTablesCount = diningTables.filter(t => t.status === 'billing').length;

  // Retail quick stats
  const totalStockItems = retailProducts.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = retailProducts.filter(p => p.stock <= p.minStock).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onQuickSearchPlat(searchQuery.trim());
    }
  };

  const getSearchPlaceholder = () => {
    if (businessType === 'resto') return 'Cari No Meja atau Menu (cth: Meja 02, Nasi Goreng)...';
    if (businessType === 'ritel') return 'Scan / Cari Barcode SKU (cth: 8999908123456)...';
    return 'Cari Plat Nomor (contoh: D 4521 ABC)...';
  };

  const getBusinessAvatarText = () => {
    if (businessType === 'resto') return 'RQ';
    if (businessType === 'ritel') return 'UQ';
    return 'BQ';
  };

  return (
    <div className="flex-1 bg-slate-50 pb-6 flex flex-col">
      {/* ========================================================
          ZONA 1: HEADER ATAS (Bersih, Lega & Ringkas)
          ======================================================== */}
      <header className="bg-[#008952] text-white px-4 pt-3 pb-3 relative overflow-hidden rounded-b-2xl shadow-sm shrink-0">
        <div className="relative z-10 flex items-center justify-between gap-3">
          {/* Master Logo UQ & Business Identity */}
          <div className="flex items-center gap-2.5 min-w-0">
            <DynamicLogoUQ businessType={businessType} size="sm" />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm font-extrabold tracking-tight truncate leading-tight text-white">
                  {profile?.workshopName || currentBusinessMeta.name}
                </h2>

                {/* Switcher Badge */}
                <button
                  onClick={onOpenPluginSwitcher}
                  title="Ganti Mode Bisnis"
                  className="bg-white/20 hover:bg-white/30 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer border border-white/20 shrink-0"
                >
                  {businessType === 'resto' && <UtensilsCrossed className="w-2.5 h-2.5" />}
                  {businessType === 'ritel' && <ScanBarcode className="w-2.5 h-2.5" />}
                  {businessType === 'bengkel' && <Wrench className="w-2.5 h-2.5" />}
                  <span>{currentBusinessMeta.shortName}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-emerald-100/90 mt-0.5">
                <span className="truncate max-w-[200px]">
                  {profile?.address ? profile.address.split(',')[0] : currentBusinessMeta.tagline}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Badge Status Masa Trial Ringkas & Rapi */}
          <div className="shrink-0 flex items-center">
            {subscription && (
              <button
                type="button"
                onClick={onOpenSubscription}
                className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[11px] font-bold border border-white/25 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                title="Kelola Lisensi & Langganan"
              >
                {subscription.isTrialActive ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-200 fill-amber-300" />
                    <span>Trial {subscription.trialDaysRemaining} Hari Aktif</span>
                  </>
                ) : subscription.isSubscribed ? (
                  <span>PRO Aktif</span>
                ) : (
                  <span>Mode Free</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          ZONA 2: DASHBOARD UTAMA (Grid Modul Adaptif & Summary)
          ======================================================== */}
      <div className="flex-1 space-y-4">
        {/* 1. Floating Summary Card (Adapts to Active Business Type) */}
        <div className="px-4 -mt-4 relative z-20">
          <div className="bg-white rounded-2xl p-4 shadow-[0_6px_20px_rgba(0,0,0,0.06)] border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#008952]" />
                  Omset Hari Ini (Kas & QRIS)
                </span>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  Rp 2.450.000
                </div>
              </div>

              {/* Action Button Adapting to Business Type */}
              {businessType === 'bengkel' && (
                <button
                  onClick={onOpenNewQueue}
                  className="bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Antrian</span>
                </button>
              )}

              {businessType === 'resto' && (
                <button
                  onClick={onOpenDenahLayoutMeja || onOpenNewTableOrder || onOpenNewQueue}
                  className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-rose-700/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Buka Meja</span>
                </button>
              )}

              {businessType === 'ritel' && (
                <button
                  onClick={onOpenKasirCepatRitel || onNavigateToPOS || onOpenNewQueue}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm shadow-blue-700/20 transition-all cursor-pointer"
                >
                  <ScanBarcode className="w-4 h-4 stroke-[2.5]" />
                  <span>+ Kasir Cepat</span>
                </button>
              )}
            </div>

            {/* Quick Metrics per Mode */}
            {businessType === 'bengkel' && (
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="bg-amber-50/70 rounded-xl p-2 border border-amber-100/60">
                  <span className="text-[10px] font-semibold text-amber-700 block">Menunggu</span>
                  <span className="text-base font-extrabold text-amber-800">{waitingCount} Unit</span>
                </div>
                <div className="bg-blue-50/70 rounded-xl p-2 border border-blue-100/60">
                  <span className="text-[10px] font-semibold text-blue-700 block">Dikerjakan</span>
                  <span className="text-base font-extrabold text-blue-800">{inProgressCount} Unit</span>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100/60">
                  <span className="text-[10px] font-semibold text-[#008952] block">Selesai</span>
                  <span className="text-base font-extrabold text-emerald-800">{completedCount} Unit</span>
                </div>
              </div>
            )}

            {businessType === 'resto' && (
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100/60">
                  <span className="text-[10px] font-semibold text-emerald-700 block">Meja Kosong</span>
                  <span className="text-base font-extrabold text-emerald-800">{emptyTablesCount} Meja</span>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-2 border border-amber-100/60">
                  <span className="text-[10px] font-semibold text-amber-700 block">Terisi Tamu</span>
                  <span className="text-base font-extrabold text-amber-800">{occupiedTablesCount} Meja</span>
                </div>
                <div className="bg-blue-50/70 rounded-xl p-2 border border-blue-100/60">
                  <span className="text-[10px] font-semibold text-blue-700 block">Minta Bill</span>
                  <span className="text-base font-extrabold text-blue-800">{billingTablesCount} Meja</span>
                </div>
              </div>
            )}

            {businessType === 'ritel' && (
              <div className="grid grid-cols-3 gap-2 pt-3 text-center">
                <div className="bg-blue-50/70 rounded-xl p-2 border border-blue-100/60">
                  <span className="text-[10px] font-semibold text-blue-700 block">Total Produk</span>
                  <span className="text-base font-extrabold text-blue-800">{retailProducts.length} SKU</span>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-100/60">
                  <span className="text-[10px] font-semibold text-emerald-700 block">Stok Display</span>
                  <span className="text-base font-extrabold text-emerald-800">{totalStockItems} Pcs</span>
                </div>
                <div className="bg-rose-50/70 rounded-xl p-2 border border-rose-100/60">
                  <span className="text-[10px] font-semibold text-rose-700 block">Stok Menipis</span>
                  <span className="text-base font-extrabold text-rose-800">{lowStockCount} Item</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Grid Modul Adaptif (Ikon Kotak Bersudut Tumpul Rounded-2xl + Nama Menu) */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight">
              Menu Utama {currentBusinessMeta.name}
            </h3>
            <button
              onClick={onOpenPluginSwitcher}
              className="text-[10px] font-bold text-[#008952] bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-[#008952]" />
              <span>Ganti Mode</span>
            </button>
          </div>

          {/* Grid 3 Kolom */}
          <div className="grid grid-cols-3 gap-2.5">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  // Direct shortcut for Resto table layout or Retail fast POS if clicked
                  if (businessType === 'resto' && mod.id === 'meja-order' && onOpenDenahLayoutMeja) {
                    onOpenDenahLayoutMeja();
                  } else if (businessType === 'ritel' && mod.id === 'kasir-scan' && onOpenKasirCepatRitel) {
                    onOpenKasirCepatRitel();
                  } else {
                    onSelectModule(mod);
                  }
                }}
                className="bg-white rounded-2xl p-3 shadow-xs hover:shadow-md border border-slate-100 hover:border-emerald-200 transition-all duration-200 group active:scale-95 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                {/* Ikon Hijau Kotak Bersudut Tumpul ala Flutter M3 */}
                <div className="w-13 h-13 rounded-2xl bg-[#008952] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform mb-2">
                  <IconRenderer name={mod.iconName} className="w-6 h-6 text-white stroke-[2.2]" />
                </div>

                {/* Nama Menu */}
                <span className="font-bold text-slate-800 text-xs tracking-tight group-hover:text-[#008952] transition-colors leading-tight">
                  {mod.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            ZONA 3: AKTIVITAS OPERASIONAL KHUSUS SESUAI MODE
            (Tampilan bersih, rapi, dan terpusat tanpa tombol berlebihan)
            ======================================================== */}
        <div className="px-4 pt-1">
          {/* Mode 1: BENGKEL -> Antrian Motor & Progres Servis Real-time */}
          {businessType === 'bengkel' && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Antrian Motor Saat Ini
                  </h3>
                </div>
                <button
                  onClick={() => onSelectModule(modules[0])}
                  className="text-[11px] font-bold text-[#008952] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Lihat Semua Antrian <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {queues.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectQueueItem(item)}
                    className="bg-white rounded-xl p-3 shadow-xs border border-slate-100 hover:border-emerald-200 cursor-pointer transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#008952] text-white">
                          {item.queueNumber}
                        </span>
                        <span className="font-bold text-xs text-slate-800">{item.plateNumber}</span>
                        <span className="text-[11px] text-slate-500 truncate max-w-[120px]">
                          ({item.vehicleModel})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          item.status === 'proses'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.status === 'selesai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-600 line-clamp-1">
                      Keluhan: <span className="font-medium text-slate-800">{item.complaint}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.status === 'selesai'
                              ? 'bg-emerald-500'
                              : item.status === 'proses'
                              ? 'bg-blue-500'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {item.progressPercent}%
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 ml-1">
                        Mekanik: {item.mechanicName.split(' ')[1] || item.mechanicName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: RESTO -> Ringkasan Denah & Akses Terpusat (Tanpa tumpukan tombol meja berlebihan) */}
          {businessType === 'resto' && (
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                    <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Denah / Layout Meja Terpusat
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Pusat monitoring & pemesanan {diningTables.length} meja makan
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenDenahLayoutMeja || onOpenNewTableOrder}
                  className="bg-[#e11d48] hover:bg-rose-700 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Buka Denah Meja</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Progress Occupancy Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Status Keterisian Meja ({occupiedTablesCount + billingTablesCount}/{diningTables.length})</span>
                  <span className="text-[#e11d48] font-black">
                    {Math.round(((occupiedTablesCount + billingTablesCount) / Math.max(1, diningTables.length)) * 100)}% Terisi
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(emptyTablesCount / diningTables.length) * 100}%` }} className="bg-emerald-500 h-full" title="Kosong" />
                  <div style={{ width: `${(occupiedTablesCount / diningTables.length) * 100}%` }} className="bg-amber-500 h-full" title="Terisi" />
                  <div style={{ width: `${(billingTablesCount / diningTables.length) * 100}%` }} className="bg-blue-500 h-full" title="Billing" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> {emptyTablesCount} Meja Kosong</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {occupiedTablesCount} Terisi Tamu</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> {billingTablesCount} Minta Bill</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
