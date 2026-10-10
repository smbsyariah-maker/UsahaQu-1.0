import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Mail, 
  ArrowRight,
  User,
  Plus,
  Building2,
  Lock
} from 'lucide-react';
import { UserSession, UserRole, StaffMember, SubscriptionState, BusinessType } from '../../types';
import { DynamicLogoUQ } from '../common/DynamicLogoUQ';

export const DEFAULT_REGISTERED_STAFF: StaffMember[] = [
  {
    id: 'staff-owner',
    name: 'Bpk. Ahmad Fauzi (Pemilik)',
    email: 'smbsyariah@gmail.com',
    role: 'Owner',
    phone: '081234567890',
    status: 'Aktif'
  },
  {
    id: 'staff-spv',
    name: 'Rian Hidayat (SPV Toko)',
    email: 'rian.spv@gmail.com',
    role: 'Supervisor',
    phone: '081298765432',
    status: 'Aktif'
  },
  {
    id: 'staff-kasir',
    name: 'Dewi Lestari (Kasir Toko)',
    email: 'dewi.kasir@gmail.com',
    role: 'Kasir',
    phone: '081345678901',
    status: 'Aktif'
  },
  {
    id: 'staff-mekanik',
    name: 'Agus Santoso (Mekanik)',
    email: 'agus.mekanik@gmail.com',
    role: 'Mekanik',
    phone: '081456789012',
    status: 'Aktif'
  },
  {
    id: 'staff-pelayan',
    name: 'Siti Rahma (Pelayan Resto)',
    email: 'siti.pelayan@gmail.com',
    role: 'Pelayan',
    phone: '081567890123',
    status: 'Aktif'
  }
];

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultEmail?: string;
  subscription?: SubscriptionState;
  businessType?: BusinessType;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'smbsyariah@gmail.com',
  subscription,
  businessType = 'bengkel'
}) => {
  const [selectedEmail, setSelectedEmail] = useState(defaultEmail);
  const [isAutoLoginEnabled, setIsAutoLoginEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [autoLoginCountdown, setAutoLoginCountdown] = useState<number | null>(3);
  const [isPaused, setIsPaused] = useState(false);
  const [customInputEmail, setCustomInputEmail] = useState('');
  const [isAddingNewGoogleAccount, setIsAddingNewGoogleAccount] = useState(false);

  // Load registered staff from storage or default
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem('uq_registered_staff');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return DEFAULT_REGISTERED_STAFF;
  });

  // Current Account Object
  const currentAccount = staffList.find((s) => s.email.toLowerCase() === selectedEmail.toLowerCase()) || {
    id: 'guest',
    name: selectedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
    email: selectedEmail,
    role: 'Kasir' as UserRole,
    status: 'Aktif' as const
  };

  // Determine Role automatically according to Plan & Registered Gmail
  const determineUserRole = (email: string): UserRole => {
    const isBasicPlan = subscription?.planId === 'basic' || !subscription?.isTrialActive && subscription?.planId === 'free';
    
    // Paket Basic: Login Gmail langsung menjadi Pemilik/Admin Tunggal (Offline-first, tanpa karyawan)
    if (isBasicPlan) {
      return 'Owner';
    }

    // Paket Core & Corporate: Pemilik toko mendaftarkan alamat Gmail staf
    const matched = staffList.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      return matched.role;
    }

    // If matches owner email
    if (email.toLowerCase() === 'smbsyariah@gmail.com' || email.toLowerCase() === 'ahmad.fauzi.bengkel@gmail.com') {
      return 'Owner';
    }

    // Default to Staf Kasir if not recognized
    return 'Kasir';
  };

  // Auto Login Countdown
  useEffect(() => {
    if (!isAutoLoginEnabled || isPaused) return;
    if (autoLoginCountdown === null) return;

    if (autoLoginCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoLoginCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoLoginCountdown === 0) {
      handlePerformGoogleLogin();
    }
  }, [autoLoginCountdown, isAutoLoginEnabled, isPaused]);

  const handlePerformGoogleLogin = (emailToUse = selectedEmail) => {
    setIsLoading(true);
    setAutoLoginCountdown(null);

    const detectedRole = determineUserRole(emailToUse);
    const targetStaff = staffList.find((s) => s.email.toLowerCase() === emailToUse.toLowerCase());
    const displayName = targetStaff?.name || emailToUse.split('@')[0].toUpperCase();

    // 1-Click Google OAuth Auth Handshake
    setTimeout(() => {
      const session: UserSession = {
        name: displayName,
        email: emailToUse,
        role: detectedRole,
        autoLogin: isAutoLoginEnabled,
        loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
      setIsLoading(false);
      onLoginSuccess(session);
    }, 1000);
  };

  const handleSelectAccount = (email: string) => {
    setSelectedEmail(email);
    setShowAccountChooser(false);
    setAutoLoginCountdown(null);
    handlePerformGoogleLogin(email);
  };

  const handleAddNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputEmail.trim() || !customInputEmail.includes('@')) return;

    const newEmail = customInputEmail.trim().toLowerCase();
    setSelectedEmail(newEmail);
    setIsAddingNewGoogleAccount(false);
    setShowAccountChooser(false);
    handlePerformGoogleLogin(newEmail);
  };

  const resolvedRoleForCurrent = determineUserRole(selectedEmail);

  return (
    <div className="flex-1 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 flex flex-col justify-between p-6 select-none animate-in fade-in">
      {/* 1. TOP BRAND HEADER DENGAN DYNAMIC LOGO UQ */}
      <div className="pt-6 flex flex-col items-center text-center">
        <div className="mb-3">
          <DynamicLogoUQ businessType={businessType} size="xl" versionText="1.0" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Usaha Qu <span className="text-[#008952]">1.0</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1 max-w-[280px]">
          Aplikasi Kasir Universal Berbasis Modular Monolith
        </p>
      </div>

      {/* 2. MAIN AUTHENTICATION CARD (MURNI 1-CLICK GMAIL GOOGLE OAUTH) */}
      <div className="my-auto py-4 space-y-4 max-w-sm mx-auto w-full">
        {/* Auto Login Countdown Banner */}
        {isAutoLoginEnabled && autoLoginCountdown !== null && autoLoginCountdown > 0 && !isLoading && (
          <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3 flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold">
              <Sparkles className="w-4 h-4 text-[#008952] shrink-0" />
              <span>Masuk otomatis dalam {autoLoginCountdown} detik...</span>
            </div>
            <button
              onClick={() => {
                setIsPaused(true);
                setAutoLoginCountdown(null);
              }}
              className="text-[11px] font-bold text-[#008952] hover:underline cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        {/* Google One-Click Container Card */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_12px_35px_rgba(0,137,82,0.08)] border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              {/* Google G SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-xs font-bold text-slate-800">1-Click Google OAuth</span>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#008952] border border-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Terverifikasi
            </span>
          </div>

          {/* User Account Info Bar (Click to choose other Google Accounts) */}
          <div
            onClick={() => {
              setIsPaused(true);
              setAutoLoginCountdown(null);
              setShowAccountChooser(true);
            }}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#008952] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                {currentAccount.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 pr-1">
                <span className="font-bold text-slate-900 text-xs block truncate leading-tight group-hover:text-[#008952] transition-colors">
                  {currentAccount.name}
                </span>
                <span className="text-[11px] text-slate-500 font-mono block truncate mt-0.5">
                  {selectedEmail}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.2 rounded">
                    Peran: {resolvedRoleForCurrent}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    (Auto-Recognized)
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 pl-1 text-slate-400 group-hover:text-[#008952] flex items-center gap-0.5 text-xs font-bold">
              <span className="text-[10px] hidden sm:inline">Ganti</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Informasi Otomatisasi Hak Akses */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#008952] shrink-0 mt-0.5" />
            <p className="leading-snug">
              {subscription?.planId === 'basic' ? (
                <><strong>Paket Basic:</strong> Login Gmail otomatis sebagai <strong>Pemilik/Admin Tunggal</strong> (Offline-first).</>
              ) : (
                <><strong>Paket Core/Corporate:</strong> Hak akses dikenali otomatis sesuai pendaftaran Gmail oleh pemilik toko.</>
              )}
            </p>
          </div>

          {/* Tombol Utama: 1-Click Login via Gmail */}
          <button
            type="button"
            onClick={() => handlePerformGoogleLogin()}
            disabled={isLoading}
            className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Menghubungkan ke Google Identity...</span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-sm tracking-tight">Lanjutkan dengan Google</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Auto Login Setting Toggle */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAutoLoginEnabled}
              onChange={(e) => setIsAutoLoginEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[#008952] focus:ring-emerald-500 border-slate-300"
            />
            <span>Ingat akun & masuk otomatis</span>
          </label>
          <span className="text-[11px] text-slate-400">Google OAuth 2.0</span>
        </div>
      </div>

      {/* 3. FOOTER INFO */}
      <div className="text-center text-[11px] text-slate-400 pb-2">
        <span>© 2026 Usaha Qu 1.0 • Multi-Role Modular Cashier</span>
      </div>

      {/* MODAL PILIH / GANTI AKUN GOOGLE (GOOGLE ACCOUNT CHOOSER) */}
      {showAccountChooser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-bold text-sm text-slate-900">Pilih Akun Google</h3>
              </div>
              <button
                onClick={() => setShowAccountChooser(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
              <p className="text-xs text-slate-500 mb-2">
                Pilih akun Gmail staf atau pemilik untuk simulasi login instan:
              </p>

              {staffList.map((staff) => {
                const isCurrent = staff.email.toLowerCase() === selectedEmail.toLowerCase();
                const roleBadge = determineUserRole(staff.email);

                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleSelectAccount(staff.email)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-50 border-[#008952] text-slate-900 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#008952] text-white font-black text-xs flex items-center justify-center shrink-0">
                        {staff.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="font-bold text-xs text-slate-900 block truncate">{staff.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block truncate">{staff.email}</span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                          Peran: {roleBadge}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-1">
                      {isCurrent ? (
                        <CheckCircle2 className="w-5 h-5 text-[#008952]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Tambah Akun Google Lain */}
              {!isAddingNewGoogleAccount ? (
                <button
                  type="button"
                  onClick={() => setIsAddingNewGoogleAccount(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-[#008952] hover:bg-emerald-50/30 text-slate-600 hover:text-[#008952] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Gunakan Akun Google Lain...</span>
                </button>
              ) : (
                <form onSubmit={handleAddNewAccountSubmit} className="pt-2 space-y-2">
                  <label className="text-[11px] font-bold text-slate-600 block">
                    Masukkan Alamat Gmail:
                  </label>
                  <input
                    type="email"
                    required
                    value={customInputEmail}
                    onChange={(e) => setCustomInputEmail(e.target.value)}
                    placeholder="nama.staf@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewGoogleAccount(false)}
                      className="flex-1 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-xs font-bold bg-[#008952] text-white rounded-xl shadow-xs"
                    >
                      Masuk
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
