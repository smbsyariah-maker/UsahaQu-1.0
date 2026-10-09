import React from 'react';
import { 
  LayoutDashboard, 
  Store, 
  ShieldCheck, 
  Building2, 
  Settings, 
  Lock
} from 'lucide-react';
import { BusinessType, SubscriptionState } from '../../types';

interface BottomNavBarProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  subscription?: SubscriptionState;
  businessType?: BusinessType;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  subscription,
  businessType = 'bengkel'
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

  // Permanent Managerial Bottom Navigation Bar:
  // Beranda, Basic, Core, Corporate, Setting
  const tabs = [
    {
      id: 'dashboard',
      label: 'Beranda',
      icon: LayoutDashboard,
      isLocked: false
    },
    {
      id: 'basic',
      label: 'Basic',
      icon: Store,
      isLocked: false
    },
    {
      id: 'core',
      label: 'Core',
      icon: ShieldCheck,
      isLocked: !isCoreUnlocked,
      badgeText: !isCoreUnlocked ? 'PRO' : undefined
    },
    {
      id: 'corporate',
      label: 'Corporate',
      icon: Building2,
      isLocked: !isCorporateUnlocked,
      badgeText: !isCorporateUnlocked ? 'CORP' : undefined
    },
    {
      id: 'setting',
      label: 'Setting',
      icon: Settings,
      isLocked: false
    }
  ];

  return (
    <nav 
      aria-label="Navigasi Manajerial Bawah Permanen"
      className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-2px_14px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom,0px),0.4rem)] grid grid-cols-5 items-center select-none shrink-0 sticky bottom-0 z-50 pointer-events-auto"
    >
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 relative group cursor-pointer active:scale-95 ${
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
              className={`text-[10px] leading-tight tracking-tight mt-1 transition-all ${
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
  );
};
