import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  ShieldCheck, 
  Building2, 
  Settings, 
  Lock,
  CreditCard,
  BarChart3,
  Package,
  Megaphone,
  Users,
  Wrench,
  UtensilsCrossed,
  Clock,
  SlidersHorizontal
} from 'lucide-react';
import { BusinessType, SubscriptionState, UserSession } from '../../types';
import { ALL_NAVBAR_OPTIONS, DEFAULT_MANAGER_TABS } from '../modals/CustomNavbarModal';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  subscription?: SubscriptionState;
  businessType?: BusinessType;
  userSession?: UserSession | null;
  customTabIds?: string[];
  onOpenCustomizeNav?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  subscription,
  businessType = 'bengkel',
  userSession,
  customTabIds,
  onOpenCustomizeNav
}) => {
  const isCoreUnlocked = Boolean(
    subscription?.isTrialActive || 
    subscription?.planId === 'core' || 
    subscription?.planId === 'corporate'
  );

  const isCorporateUnlocked = Boolean(
    subscription?.isTrialActive || 
    subscription?.planId === 'corporate'
  );

  const userRole = userSession?.role || 'Owner';

  // 1. Role-based Automatic Simplified Navbars for Staf
  let activeTabsConfig: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isLocked?: boolean;
    badgeText?: string;
  }[] = [];

  if (userRole === 'Mekanik') {
    // Mode Khusus Mekanik: Hanya menu relevan operasional servis & part
    activeTabsConfig = [
      { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
      { id: 'servis', label: 'Servis', icon: Wrench },
      { id: 'sparepart', label: 'Stok Part', icon: Package },
      { id: 'riwayat', label: 'Pekerjaan', icon: Clock }
    ];
  } else if (userRole === 'Pelayan') {
    // Mode Khusus Pelayan / Waiter: Hanya menu denah meja & order
    activeTabsConfig = [
      { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
      { id: 'meja-order', label: 'Denah Meja', icon: UtensilsCrossed },
      { id: 'kasir', label: 'Kasir/Order', icon: CreditCard },
      { id: 'inventory', label: 'Daftar Menu', icon: Package }
    ];
  } else if (userRole === 'Kasir') {
    // Mode Khusus Kasir: Kasir kilat, riwayat transaksi & closing
    activeTabsConfig = [
      { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
      { id: 'kasir', label: 'Kasir Cepat', icon: CreditCard },
      { id: 'laporan', label: 'Rekap Kasir', icon: BarChart3 },
      { id: 'setting', label: 'Info Akun', icon: Settings }
    ];
  } else {
    // Mode Pemilik / Supervisor / Admin: Dynamic Custom Navbar
    const tabIdsToUse = (customTabIds && customTabIds.length >= 3) ? customTabIds : DEFAULT_MANAGER_TABS;

    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      dashboard: LayoutDashboard,
      kasir: CreditCard,
      laporan: BarChart3,
      stok: Package,
      marketing: Megaphone,
      pelanggan: Users,
      basic: Store,
      core: ShieldCheck,
      corporate: Building2,
      setting: Settings
    };

    activeTabsConfig = tabIdsToUse.map((tabId) => {
      const option = ALL_NAVBAR_OPTIONS.find((o) => o.id === tabId);
      const isLocked = (tabId === 'core' && !isCoreUnlocked) || (tabId === 'corporate' && !isCorporateUnlocked);
      const badgeText = tabId === 'core' && !isCoreUnlocked ? 'PRO' : tabId === 'corporate' && !isCorporateUnlocked ? 'CORP' : undefined;

      return {
        id: tabId,
        label: option?.label || tabId,
        icon: iconMap[tabId] || LayoutDashboard,
        isLocked,
        badgeText
      };
    });
  }

  const isManager = userRole === 'Owner' || userRole === 'Supervisor' || userRole === 'Admin';
  const gridColsClass = activeTabsConfig.length === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="relative w-full">
      {/* Floating Gear Button for Admin/Owner to Customize Navbar */}
      {isManager && onOpenCustomizeNav && (
        <button
          type="button"
          onClick={onOpenCustomizeNav}
          title="Atur Pintasan Menu Bawah"
          className="absolute -top-3.5 right-3 z-40 bg-white/95 text-slate-600 hover:text-[#008952] hover:bg-emerald-50 border border-slate-200 shadow-xs px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
        >
          <SlidersHorizontal className="w-2.5 h-2.5 text-[#008952]" />
          <span>Atur Menu Bawah</span>
        </button>
      )}

      <nav 
        aria-label="Navigasi Bawah Dinamis"
        className={`w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_14px_rgba(0,0,0,0.06)] px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),0.4rem)] grid ${gridColsClass} items-center select-none shrink-0 sticky bottom-0 z-30 pointer-events-auto`}
      >
        {activeTabsConfig.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 relative group cursor-pointer active:scale-95 ${
                isActive 
                  ? 'text-[#008952]' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                {/* Icon Container with active highlight */}
                <div
                  className={`p-1.5 rounded-xl transition-all flex items-center justify-center ${
                    isActive 
                      ? 'bg-emerald-100/80 text-[#008952] shadow-2xs' 
                      : 'group-hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <IconComponent className="w-[19px] h-[19px] stroke-[2.2]" />
                </div>

                {/* Lock Indicator & Badge for Core / Corporate */}
                {tab.isLocked && (
                  <div className="absolute -top-1 -right-2 flex items-center gap-0.5 bg-amber-500 text-white rounded-full px-1 py-0.2 shadow-2xs border border-white">
                    <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
                    {tab.badgeText && (
                      <span className="text-[7.5px] font-black leading-none">
                        {tab.badgeText}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] leading-tight tracking-tight mt-1 transition-all truncate max-w-full ${
                  isActive 
                    ? 'font-black text-[#008952]' 
                    : 'font-bold text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
