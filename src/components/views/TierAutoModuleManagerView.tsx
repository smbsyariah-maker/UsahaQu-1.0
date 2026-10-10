import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Store, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Lock, 
  Check, 
  Save, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Layers, 
  Key, 
  X, 
  Smartphone, 
  UserCheck, 
  ChevronRight, 
  Info, 
  ShieldAlert,
  Zap,
  Plus
} from 'lucide-react';
import { 
  WorkshopProfile, 
  RolePermissionConfig, 
  BranchItem, 
  SubscriptionState, 
  BusinessType,
  StaffMember,
  UserRole
} from '../../types';
import { BUSINESS_TYPES } from '../../data/mockData';
import { DEFAULT_REGISTERED_STAFF } from '../auth/LoginScreen';

export type TierType = 'basic' | 'core' | 'corporate';
export type SubModuleTab = 'profil' | 'hak-akses' | 'cabang';

export interface TierAutoModuleManagerViewProps {
  currentTier: TierType;
  initialSubTab?: SubModuleTab;
  onBack: () => void;
  profile: WorkshopProfile;
  onSaveProfile: (updated: WorkshopProfile) => void;
  permissions: RolePermissionConfig[];
  onUpdatePermissions: (updated: RolePermissionConfig[]) => void;
  branches: BranchItem[];
  onSaveBranches: (updated: BranchItem[]) => void;
  businessType: BusinessType;
  onChangeBusinessType?: (type: BusinessType) => void;
  subscription: SubscriptionState;
  onOpenSubscriptionModal: () => void;
  onNavigateToDevices?: () => void;
  onSwitchTier?: (tier: TierType) => void;
}

export const TierAutoModuleManagerView: React.FC<TierAutoModuleManagerViewProps> = ({
  currentTier,
  initialSubTab = 'profil',
  onBack,
  profile,
  onSaveProfile,
  permissions,
  onUpdatePermissions,
  branches,
  onSaveBranches,
  businessType = 'bengkel',
  onChangeBusinessType,
  subscription,
  onOpenSubscriptionModal,
  onNavigateToDevices,
  onSwitchTier
}) => {
  const [activeTier, setActiveTier] = useState<TierType>(currentTier);
  const [activeSubTab, setActiveSubTab] = useState<SubModuleTab>(() => {
    if (currentTier === 'basic') return 'profil';
    if (initialSubTab) return initialSubTab;
    if (currentTier === 'core') return 'hak-akses';
    return 'cabang';
  });

  // State Profil Usaha
  const [profileForm, setProfileForm] = useState<WorkshopProfile>(profile);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // State Hak Akses
  const [permItems, setPermItems] = useState<RolePermissionConfig[]>(permissions);
  const [isPermSaved, setIsPermSaved] = useState(false);

  // State 3 Cabang
  const [branchList, setBranchList] = useState<BranchItem[]>(branches);
  const [savedBranchIndex, setSavedBranchIndex] = useState<number | null>(null);
  const [isGlobalBranchSaved, setIsGlobalBranchSaved] = useState(false);

  // Sync when currentTier changes
  useEffect(() => {
    setActiveTier(currentTier);
    if (currentTier === 'basic') {
      setActiveSubTab('profil');
    } else if (currentTier === 'core' && activeSubTab === 'cabang') {
      setActiveSubTab('hak-akses');
    }
  }, [currentTier]);

  const currentBusinessMeta = BUSINESS_TYPES.find(b => b.id === businessType) || BUSINESS_TYPES[0];

  const isCoreUnlocked = Boolean(
    subscription.isTrialActive || 
    subscription.planId === 'core' || 
    subscription.planId === 'corporate'
  );

  const isCorporateUnlocked = Boolean(
    subscription.isTrialActive || 
    subscription.planId === 'corporate'
  );

  // Definition of Auto Modules available for each tier
  const getAvailableTabs = (tier: TierType): { id: SubModuleTab; label: string; icon: any; desc: string }[] => {
    switch (tier) {
      case 'basic':
        return [
          { id: 'profil', label: 'Profil Usaha', icon: Store, desc: 'Identitas & Model Usaha' }
        ];
      case 'core':
        return [
          { id: 'profil', label: 'Profil Usaha', icon: Store, desc: 'Identitas & Model Usaha' },
          { id: 'hak-akses', label: 'Hak Akses', icon: ShieldCheck, desc: 'SPV vs Kasir & 3 HP' }
        ];
      case 'corporate':
        return [
          { id: 'profil', label: 'Profil Usaha', icon: Store, desc: 'Identitas Pusat' },
          { id: 'hak-akses', label: 'Hak Akses', icon: ShieldCheck, desc: 'Otoritas Multi-Role' },
          { id: 'cabang', label: '3 Cabang', icon: Building2, desc: '3 Outlet & 9 HP Slot' }
        ];
    }
  };

  const availableTabs = getAvailableTabs(activeTier);

  // Handle tier switch from header tabs
  const handleSelectTier = (tier: TierType) => {
    if (tier === 'core' && !isCoreUnlocked) {
      onOpenSubscriptionModal();
      return;
    }
    if (tier === 'corporate' && !isCorporateUnlocked) {
      onOpenSubscriptionModal();
      return;
    }
    setActiveTier(tier);
    if (onSwitchTier) {
      onSwitchTier(tier);
    }
    // Set fallback active subtab if current not available
    const newAvail = getAvailableTabs(tier);
    if (!newAvail.some(t => t.id === activeSubTab)) {
      setActiveSubTab(newAvail[newAvail.length - 1].id);
    }
  };

  // Handlers for Profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profileForm);
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2500);
  };

  // Handlers for Permissions
  const handleTogglePerm = (id: string, role: 'spv' | 'kasir') => {
    const updated = permItems.map(p => {
      if (p.id === id) {
        return { ...p, [role]: !p[role] };
      }
      return p;
    });
    setPermItems(updated);
  };

  const handleSavePerms = () => {
    onUpdatePermissions(permItems);
    setIsPermSaved(true);
    setTimeout(() => setIsPermSaved(false), 2000);
  };

  // Handlers for Staff Management
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem('uq_registered_staff');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return DEFAULT_REGISTERED_STAFF;
  });
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Kasir');
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail.trim() || !newStaffName.trim()) return;
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim().toLowerCase(),
      role: newStaffRole,
      status: 'Aktif'
    };
    const updated = [...staffList, newStaff];
    setStaffList(updated);
    localStorage.setItem('uq_registered_staff', JSON.stringify(updated));
    setNewStaffName('');
    setNewStaffEmail('');
    setIsAddingStaff(false);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffList.filter((s) => s.id !== id);
    setStaffList(updated);
    localStorage.setItem('uq_registered_staff', JSON.stringify(updated));
  };

  // Handlers for 3 Branches
  const handleBranchFieldChange = (index: number, field: keyof BranchItem, value: any) => {
    const updated = [...branchList];
    updated[index] = { ...updated[index], [field]: value };
    setBranchList(updated);
  };

  const handleSetActiveBranch = (index: number) => {
    const updated = branchList.map((b, i) => ({
      ...b,
      isActive: i === index
    }));
    setBranchList(updated);
    onSaveBranches(updated);
  };

  const handleSaveBranchCard = (index: number, e: React.FormEvent) => {
    e.preventDefault();
    onSaveBranches(branchList);
    setSavedBranchIndex(index);
    setTimeout(() => setSavedBranchIndex(null), 2000);
  };

  const handleSaveAllBranches = () => {
    onSaveBranches(branchList);
    setIsGlobalBranchSaved(true);
    setTimeout(() => setIsGlobalBranchSaved(false), 2000);
  };

  const spvCount = permItems.filter(p => p.spv).length;
  const kasirCount = permItems.filter(p => p.kasir).length;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* ========================================================
          TOP HEADER HIJAU SOLID (Perkecil & Bersihkan)
          ======================================================== */}
      <div className="bg-[#008952] text-white px-4 py-2.5 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-8 h-8 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                {activeTier === 'basic' && <Store className="w-4 h-4" />}
                {activeTier === 'core' && <ShieldCheck className="w-4 h-4" />}
                {activeTier === 'corporate' && <Building2 className="w-4 h-4" />}
              </div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                {activeTier === 'basic' && 'Basic'}
                {activeTier === 'core' && 'Core'}
                {activeTier === 'corporate' && 'Corporate'}
              </h1>
            </div>
          </div>

          {/* Quick Tier Pill Switcher */}
          <div className="bg-black/20 p-0.5 rounded-xl flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => handleSelectTier('basic')}
              className={`py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeTier === 'basic'
                  ? 'bg-white text-[#008952] shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => handleSelectTier('core')}
              className={`py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                activeTier === 'core'
                  ? 'bg-white text-[#008952] shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <span>Core</span>
              {!isCoreUnlocked && <Lock className="w-2.5 h-2.5 text-amber-300" />}
            </button>
            <button
              type="button"
              onClick={() => handleSelectTier('corporate')}
              className={`py-1 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center gap-0.5 cursor-pointer ${
                activeTier === 'corporate'
                  ? 'bg-white text-[#008952] shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <span>Corp</span>
              {!isCorporateUnlocked && <Lock className="w-2.5 h-2.5 text-amber-300" />}
            </button>
          </div>
        </div>

        {/* ========================================================
            AUTO-MODUL TAB SWITCHER BAR (Hanya Ikon & Nama Tab)
            ======================================================== */}
        <div className="mt-2 flex items-center gap-1 bg-white/15 p-1 rounded-xl">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#008952] shadow-xs'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MAIN BODY CONTENT
          ======================================================== */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">

        {/* ========================================================
            TAB 1: MODUL PROFIL USAHA (Basic / Core / Corporate)
            ======================================================== */}
        {activeSubTab === 'profil' && (
          <div className="space-y-4">
            {isProfileSaved && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#008952]" />
                <span>Profil usaha berhasil disimpan dan diperbarui!</span>
              </div>
            )}

            {/* Plugin Mode Selector Card */}
            {onChangeBusinessType && (
              <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Layers className="w-4 h-4 text-[#008952]" />
                  <h4 className="text-xs font-bold text-slate-800">Model Usaha Aktif (Plugin Switcher)</h4>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BUSINESS_TYPES.map((bt) => {
                    const isSelected = businessType === bt.id;
                    return (
                      <button
                        key={bt.id}
                        type="button"
                        onClick={() => onChangeBusinessType(bt.id)}
                        className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-[#008952] text-[#008952] font-black shadow-xs ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs">{bt.name}</span>
                        <span className="text-[9.5px] opacity-75">{bt.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form Profil Usaha */}
            <form onSubmit={handleProfileSubmit} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#008952] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Formulir Profil Usaha</h3>
                    <p className="text-[11px] text-slate-400">Data resmi identitas outlet & kepemilikan</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 stroke-[2.3]" />
                  <span>Simpan</span>
                </button>
              </div>

              {/* 1. Nama Usaha / Bengkel / Resto */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Store className="w-3.5 h-3.5 text-[#008952]" />
                  Nama Usaha / Outlet *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.workshopName}
                  onChange={(e) => setProfileForm({ ...profileForm, workshopName: e.target.value })}
                  placeholder={`Contoh: ${currentBusinessMeta.name} Berkah Jaya`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* 2. Alamat */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#008952]" />
                  Alamat Lengkap *
                </label>
                <textarea
                  rows={2}
                  required
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Contoh: Jl. Otto Iskandardinata No. 128, Bandung"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* 3. Nama Pemilik */}
              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-[#008952]" />
                  Nama Pemilik / Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.ownerName}
                  onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                  placeholder="Contoh: Bpk. Ahmad Fauzi Rachman, S.T."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* 4. No HP & 5. Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#008952]" />
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#008952]" />
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="Contoh: kontak@usahaqu.id"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Tombol Simpan Bawah */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-2xl shadow-md shadow-emerald-700/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.3]" />
                  <span>Simpan Profil Usaha</span>
                </button>
              </div>
            </form>

            {/* Pratinjau KOP Struk Kasir */}
            <div className="bg-white rounded-2xl p-4 border border-dashed border-emerald-300 shadow-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Pratinjau KOP Nota & Struk Kasir:
              </span>
              <div className="bg-slate-50 rounded-xl p-3 text-center space-y-0.5">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase">{profileForm.workshopName}</h4>
                <p className="text-[11px] text-slate-600">{profileForm.address}</p>
                <p className="text-[10px] text-slate-500">
                  Pemilik: {profileForm.ownerName} • WA: {profileForm.phone} • {profileForm.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MODUL HAK AKSES (Core & Corporate)
            ======================================================== */}
        {activeSubTab === 'hak-akses' && (
          <div className="space-y-4">
            {isPermSaved && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
                <Check className="w-4 h-4" />
                <span>Matriks hak akses SPV & Kasir berhasil disimpan!</span>
              </div>
            )}

            {/* Quick Role Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-semibold block">
                    Supervisor (SPV)
                  </span>
                  <span className="text-sm font-extrabold text-[#008952]">{spvCount} Otoritas Aktif</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-200/50 flex items-center justify-center text-[#008952]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-700 uppercase tracking-wider font-semibold block">
                    Staf Kasir
                  </span>
                  <span className="text-sm font-extrabold text-blue-800">{kasirCount} Otoritas Aktif</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-200/50 flex items-center justify-center text-blue-600">
                  <Key className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Slot HP Shortcut */}
            {onNavigateToDevices && (
              <button
                type="button"
                onClick={onNavigateToDevices}
                className="w-full bg-white hover:bg-emerald-50/50 border border-emerald-200 text-slate-800 rounded-2xl py-2.5 px-3.5 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#008952]" />
                  <span>
                    Kelola Slot HP Karyawan ({activeTier === 'corporate' ? '9 HP Multi-Cabang' : '3 HP Core'})
                  </span>
                </span>
                <span className="bg-[#008952] text-white px-2.5 py-1 rounded-lg text-[10px]">
                  Tautkan HP →
                </span>
              </button>
            )}

            {/* Matrix Header & Save Action */}
            <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-xs">Daftar Otoritas Modul:</span>
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-600 pr-1">
                  <span className="w-12 text-center text-[#008952]">SPV</span>
                  <span className="w-12 text-center text-blue-600">Kasir</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {permItems.map((perm) => (
                  <div
                    key={perm.id}
                    className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 pr-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200 uppercase">
                          {perm.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs mt-1 leading-snug">
                        {perm.permissionName}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                        {perm.description}
                      </p>
                    </div>

                    {/* Role Switches */}
                    <div className="flex items-center gap-4 shrink-0">
                      {/* SPV Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(perm.id, 'spv')}
                        className={`w-12 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          perm.spv
                            ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/30'
                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                        }`}
                        title="Toggle Izin SPV"
                      >
                        {perm.spv ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                      </button>

                      {/* Kasir Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePerm(perm.id, 'kasir')}
                        className={`w-12 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          perm.kasir
                            ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/30'
                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300'
                        }`}
                        title="Toggle Izin Kasir"
                      >
                        {perm.kasir ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol Simpan Hak Akses */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSavePerms}
                  className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-2xl shadow-md shadow-emerald-700/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.3]" />
                  <span>Simpan Konfigurasi Hak Akses</span>
                </button>
              </div>
            </div>

            {/* Pendaftaran Gmail Staf & Otomasi Peran Google OAuth */}
            <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">Daftar Gmail Staf (Auto-Role Google OAuth)</h3>
                    <p className="text-[10px] text-slate-500">Saat staf login via Gmail, peran otomatis terkunci</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingStaff(!isAddingStaff)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008952] font-bold text-[11px] border border-emerald-200 cursor-pointer flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Daftarkan Staf</span>
                </button>
              </div>

              {/* Form Tambah Staf Baru */}
              {isAddingStaff && (
                <form onSubmit={handleAddStaff} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="Nama Lengkap Staf..."
                      className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-medium"
                    />
                    <input
                      type="email"
                      required
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="alamat.staf@gmail.com..."
                      className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <span>Peran:</span>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
                      >
                        <option value="Supervisor">Supervisor (SPV)</option>
                        <option value="Kasir">Kasir</option>
                        <option value="Mekanik">Mekanik</option>
                        <option value="Pelayan">Pelayan</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsAddingStaff(false)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-bold bg-[#008952] text-white rounded-lg shadow-xs cursor-pointer"
                      >
                        Simpan Staf
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* List of Registered Staff */}
              <div className="space-y-1.5">
                {staffList.map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-black text-xs flex items-center justify-center shrink-0">
                        {st.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-slate-900 block truncate">{st.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">{st.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {st.role}
                      </span>
                      {st.role !== 'Owner' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(st.id)}
                          className="w-6 h-6 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus Staf"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: MODUL 3 CABANG (Khusus Corporate)
            ======================================================== */}
        {activeSubTab === 'cabang' && (
          <div className="space-y-4">
            {isGlobalBranchSaved && (
              <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#008952]" />
                <span>Seluruh data 3 cabang berhasil disimpan ke sistem!</span>
              </div>
            )}

            {/* Action Bar Simpan Semua & Slot 9 HP */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">
                3 Form Card Outlet Cabang:
              </span>
              <button
                type="button"
                onClick={handleSaveAllBranches}
                className="bg-[#008952] hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 stroke-[2.3]" />
                <span>Simpan Semua Cabang</span>
              </button>
            </div>

            {onNavigateToDevices && (
              <button
                type="button"
                onClick={onNavigateToDevices}
                className="w-full bg-white hover:bg-emerald-50/50 border border-emerald-200 text-slate-800 rounded-2xl py-2.5 px-3.5 text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-98"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#008952]" />
                  <span>Kelola Slot 9 HP Multi-Cabang (3 Outlet x 3 HP)</span>
                </span>
                <span className="bg-[#008952] text-white px-2.5 py-1 rounded-lg text-[10px]">
                  Tautkan HP →
                </span>
              </button>
            )}

            {/* 3 Form Cards */}
            <div className="space-y-4">
              {branchList.map((branch, idx) => (
                <form
                  key={branch.id}
                  onSubmit={(e) => handleSaveBranchCard(idx, e)}
                  className={`bg-white rounded-3xl p-4 shadow-xs border transition-all space-y-3.5 ${
                    branch.isActive
                      ? 'border-[#008952] ring-2 ring-emerald-500/20'
                      : 'border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  {/* Header Form Card */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center font-black text-xs">
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          Cabang {idx + 1}: {branch.branchName}
                        </h3>
                        <span className="text-[10px] text-slate-400">ID Outlet: #{branch.id}</span>
                      </div>
                    </div>

                    {branch.isActive ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#008952] border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Cabang Aktif</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetActiveBranch(idx)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-[#008952] text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Pilih Cabang Ini
                      </button>
                    )}
                  </div>

                  {savedBranchIndex === idx && (
                    <div className="p-2 bg-emerald-50 text-[#008952] rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Data Cabang {idx + 1} berhasil disimpan!</span>
                    </div>
                  )}

                  {/* 1. Nama Cabang */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                      <Building2 className="w-3 h-3 text-[#008952]" />
                      Nama Cabang *
                    </label>
                    <input
                      type="text"
                      required
                      value={branch.branchName}
                      onChange={(e) => handleBranchFieldChange(idx, 'branchName', e.target.value)}
                      placeholder="Nama Cabang"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* 2. Alamat */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-[#008952]" />
                      Alamat Cabang *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={branch.address}
                      onChange={(e) => handleBranchFieldChange(idx, 'address', e.target.value)}
                      placeholder="Alamat Cabang"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* 3. SPV */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                      <UserCheck className="w-3 h-3 text-[#008952]" />
                      Supervisor (SPV) *
                    </label>
                    <input
                      type="text"
                      required
                      value={branch.spvName}
                      onChange={(e) => handleBranchFieldChange(idx, 'spvName', e.target.value)}
                      placeholder="Nama SPV Penanggung Jawab"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* 4. No HP & 5. Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                        <Phone className="w-3 h-3 text-[#008952]" />
                        No HP Cabang *
                      </label>
                      <input
                        type="tel"
                        required
                        value={branch.phone}
                        onChange={(e) => handleBranchFieldChange(idx, 'phone', e.target.value)}
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3 text-[#008952]" />
                        Email Cabang *
                      </label>
                      <input
                        type="email"
                        required
                        value={branch.email}
                        onChange={(e) => handleBranchFieldChange(idx, 'email', e.target.value)}
                        placeholder="cabang@usahaqu.id"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  {/* Tombol Simpan Form Card */}
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="submit"
                      className="bg-[#008952] hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Cabang {idx + 1}</span>
                    </button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
