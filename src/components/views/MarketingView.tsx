import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Tag, 
  Star, 
  Check, 
  Copy, 
  Sparkles, 
  Users, 
  Percent, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Share2, 
  Trash2, 
  FileText,
  Filter,
  ShieldCheck,
  Wrench,
  UtensilsCrossed,
  ScanBarcode,
  Layers,
  AlertCircle,
  Globe
} from 'lucide-react';
import { MarketingCampaign, PromoVoucher, CustomerVehicle, BusinessType, SubscriptionState, WorkshopProfile } from '../../types';
import { EtalaseOnlineView } from './EtalaseOnlineView';

interface MarketingViewProps {
  initialTab?: string;
  customers: CustomerVehicle[];
  campaigns: MarketingCampaign[];
  vouchers: PromoVoucher[];
  onBack: () => void;
  onSendCampaign: (newCampaign: MarketingCampaign) => void;
  onAddVoucher: (newVoucher: PromoVoucher) => void;
  onToggleVoucherActive: (id: string) => void;
  businessType?: BusinessType;
  subscription?: SubscriptionState;
  profile?: WorkshopProfile;
  onOpenSubscriptionModal?: () => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  initialTab = 'etalase-online',
  customers,
  campaigns,
  vouchers,
  onBack,
  onSendCampaign,
  onAddVoucher,
  onToggleVoucherActive,
  businessType = 'bengkel',
  subscription,
  profile,
  onOpenSubscriptionModal
}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab === 'etalase-online' || initialTab === 'mkt-etalase') return 'etalase-online';
    if (initialTab === 'voucher-diskon' || initialTab === 'voucher') return 'promo-diskon';
    if (initialTab === 'ulasan-google' || initialTab === 'reviews') return 'riwayat-pesan';
    return initialTab || 'etalase-online';
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Business Scope Filter for Marketing Broadcast (Bengkel / Resto / Ritel / Semua)
  const [targetScope, setTargetScope] = useState<'bengkel' | 'resto' | 'ritel' | 'semua'>(
    businessType === 'collabqu' ? 'ritel' : (businessType || 'bengkel')
  );

  // Sub-Menu A Form State (Broadcast WhatsApp)
  const [draftTitle, setDraftTitle] = useState('Promo Servis Berkala & Ganti Oli Rutin');
  const [draftTarget, setDraftTarget] = useState('Semua Pelanggan Bengkel');
  const [draftMessage, setDraftMessage] = useState(
    `🛵 PROMO KHUSUS BENGKEL QU! 🛵\n\nHalo Sahabat Bengkel Qu!\nSudah waktunya ganti oli atau servis rutin motormu? Dapatkan DISKON 15% untuk Paket Ganti Oli + Servis CVT minggu ini!\n\n✅ Oli Dijamin 100% Asli\n✅ Free Cek Rem & Tekanan Ban\n✅ Mekanik Profesional\n\nTunjukkan pesan ini ke kasir Bengkel Qu saat pengerjaan. Kami siap melayani!`
  );

  // Sub-Menu B Form State (Promo & Diskon)
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherTitle, setNewVoucherTitle] = useState('');
  const [newVoucherType, setNewVoucherType] = useState<'Persen' | 'Nominal'>('Persen');
  const [newVoucherValue, setNewVoucherValue] = useState<number>(10);
  const [newVoucherMinTx, setNewVoucherMinTx] = useState<number>(75000);
  const [newVoucherValidUntil, setNewVoucherValidUntil] = useState('30 Nov 2026');
  const [newVoucherCategory, setNewVoucherCategory] = useState<string>('Jasa Servis');
  const [newVoucherQuota, setNewVoucherQuota] = useState<number>(50);
  const [isAddVoucherFormOpen, setIsAddVoucherFormOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'voucher-diskon' || initialTab === 'voucher') setActiveTab('promo-diskon');
      else if (initialTab === 'ulasan-google' || initialTab === 'reviews') setActiveTab('riwayat-pesan');
      else setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Synchronize target scope if active businessType changes
  useEffect(() => {
    if (businessType) {
      const mappedScope: 'bengkel' | 'resto' | 'ritel' | 'semua' = 
        businessType === 'collabqu' ? 'ritel' : businessType;
      setTargetScope(mappedScope);
      applyDefaultTemplate(mappedScope);
    }
  }, [businessType]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Calculate Customer Partitions
  const bengkelCustomers = customers.filter(c => (c.customer_type || 'bengkel') === 'bengkel');
  const restoCustomers = customers.filter(c => c.customer_type === 'resto');
  const ritelCustomers = customers.filter(c => c.customer_type === 'ritel');

  const getScopedCustomers = () => {
    if (targetScope === 'resto') return restoCustomers;
    if (targetScope === 'ritel') return ritelCustomers;
    if (targetScope === 'bengkel') return bengkelCustomers;
    return customers;
  };

  const currentScopedCustomers = getScopedCustomers();

  // Preset Templates based on Target Scope
  const getPresetTemplates = () => {
    if (targetScope === 'resto') {
      return [
        {
          label: 'Diskon Menu Baru 20%',
          title: 'Promo Peluncuran Menu Baru Resto Qu Diskon 20%',
          target: 'Semua Tamu Resto / Kuliner',
          text: `🍽️ PROMO SPESIAL RESTO QU 🍽️\nHalo Sahabat Kuliner!\nCobain Menu Baru Spesial Chef Resto Qu dengan DISKON 20% khusus minggu ini!\n\n✨ Pilihan Menu Gurih & Lezat\n✨ Meja Ber-AC Nyaman & Higienis\n✨ Pelayanan Ramah & Cepat\n\nTunjukkan pesan ini ke kasir saat memesan makanan!`
        },
        {
          label: 'Paket Makan Siang Hemat',
          title: 'Paket Lunch Hemat Dine-in Resto Qu',
          target: 'Pelanggan Makan Siang Hemat (Lunch Hour)',
          text: `🍛 PAKET LUNCH HEMAT DINE-IN 🍛\nHalo Kak! Istirahat siang enaknya makan di Resto Qu. Dapatkan Paket Nasi + Lauk Spesial + Es Teh Jumbo hanya Rp 35.000.\nTersedia meja Dine-in nyaman & bebas antri!`
        },
        {
          label: 'Promo Meja Weekend Keluarga',
          title: 'Booking Meja Keluarga Weekend Free Snack',
          target: 'Tamu Reservasi Meja Keluarga & VIP',
          text: `🎉 AKHIR PEKAN SERU BERSAMA KELUARGA 🎉\nReservasi Meja Keluarga / VIP di Resto Qu untuk akhir pekan ini dan dapatkan GRATIS 1 Porsi Camilan Spesial!\nHubungi kami segera untuk reservasi tempat favorit Anda.`
        }
      ];
    }

    if (targetScope === 'ritel') {
      return [
        {
          label: 'Flash Sale Sembako Murah',
          title: 'Flash Sale Akhir Pekan Minyak & Beras Murah',
          target: 'Semua Member Ritel & Toko',
          text: `🛒 FLASH SALE AKHIR PEKAN RITEL QU 🛒\nHalo Sahabat Belanja!\nMinyak Goreng 2L cuma Rp 32.000 & Beras Premium 5Kg Rp 69.000 akhir pekan ini!\nStok terbatas, yuk belanja sekarang di Ritel Qu terdekat sebelum kehabisan!`
        },
        {
          label: 'Tebus Murah Belanja Rp 50rb',
          title: 'Promo Tebus Murah Belanja Min. Rp 50.000',
          target: 'Member Belanja Sembako Mingguan',
          text: `🛍️ TEBUS MURAH RITEL QU 🛍️\nBelanja minimal Rp 50.000 berhak tebus murah Gula Pasir 1Kg atau Teh Celup hanya Rp 5.000!\nTunjukkan kartu member Anda saat scan barcode di kasir.`
        },
        {
          label: 'Dobel Poin Member Belanja',
          title: 'Gebyar Poin Member Dobel Poin Akhir Pekan',
          target: 'Member VIP Tier Gold & Platinum',
          text: `⭐ DOBEL POIN MEMBER RITEL QU ⭐\nKhusus akhir pekan ini, setiap pembelanjaan dengan Kartu Member Ritel Qu mendapatkan 2X POIN LOYALITAS!\nKumpulkan poin dan tukarkan dengan voucher belanja tunai!`
        }
      ];
    }

    if (targetScope === 'semua') {
      return [
        {
          label: 'Promo Spesial Usaha Qu',
          title: 'Kupon Diskon Pelanggan Setia Usaha Qu',
          target: 'Semua Pelanggan Terdaftar Lintas Usaha',
          text: `✨ KUPON SPESIAL USAHA QU ✨\nHalo Sahabat Setia!\nTerima kasih telah menjadi bagian dari keluarga besar kami. Dapatkan diskon 10% untuk transaksi Anda berikutnya di semua unit layanan kami!`
        }
      ];
    }

    // Default: Bengkel
    return [
      {
        label: 'Promo Oli & CVT 15%',
        title: 'Diskon Paket Servis CVT + Oli Mesin 15%',
        target: 'Pemilik Motor Matic (Vario, BeAT, NMAX, Aerox - Promo CVT)',
        text: `🛵 PROMO BENGKEL QU 🛵\nHalo Sahabat Bengkel Qu!\nNikmati potongan 15% untuk paket ganti oli MPX/SPX/Yamalube + servis CVT.\nTarikan motor enteng kembali, siap gas tanpa kendala!`
      },
      {
        label: 'Reminder Servis Berkala',
        title: 'Reminder Servis Berkala & Ganti Oli Rutin',
        target: 'Pelanggan Servis Lebih Dari 2 Bulan (Reminder Rutin)',
        text: `🔧 JADWAL SERVIS BERKALA MOTOR ANDA 🔧\nHalo Kak! Motor Anda sudah waktunya servis berkala dan cek kesehatan aki di Bengkel Qu.\nYuk mampir hari ini, kami buka sampai jam 17:00 WIB.`
      },
      {
        label: 'Cek Aki & Kelistrikan Gratis',
        title: 'Gratis Pemeriksaan Aki & Tekanan Angin Digital',
        target: 'Semua Pelanggan Bengkel',
        text: `⚡ PROMO MUSIM HUJAN: CEK AKI GRATIS! ⚡\nBengkel Qu menyediakan pengecekan tegangan aki & scanner injeksi gratis untuk motor Anda agar tidak mogok di jalan!`
      }
    ];
  };

  const applyDefaultTemplate = (scope: 'bengkel' | 'resto' | 'ritel' | 'semua') => {
    if (scope === 'resto') {
      setDraftTitle('Promo Menu Baru & Diskon Meja Dine-in 20%');
      setDraftTarget('Semua Tamu Resto / Kuliner');
      setDraftMessage(
        `🍽️ PROMO SPESIAL RESTO QU 🍽️\n\nHalo Sahabat Kuliner!\nCobain Menu Baru Spesial Chef Resto Qu dengan DISKON 20% khusus minggu ini!\n\n✨ Pilihan Menu Gurih & Lezat\n✨ Meja Ber-AC Nyaman & Higienis\n✨ Pelayanan Ramah & Cepat\n\nTunjukkan pesan ini ke kasir saat memesan makanan!`
      );
      setNewVoucherCategory('Menu Resto');
    } else if (scope === 'ritel') {
      setDraftTitle('Flash Sale Akhir Pekan Minyak & Beras Murah');
      setDraftTarget('Semua Member Ritel & Toko');
      setDraftMessage(
        `🛒 FLASH SALE AKHIR PEKAN RITEL QU 🛒\n\nHalo Sahabat Belanja!\nMinyak Goreng 2L cuma Rp 32.000 & Beras Premium 5Kg Rp 69.000 akhir pekan ini!\nStok terbatas, yuk belanja sekarang di Ritel Qu terdekat sebelum kehabisan!`
      );
      setNewVoucherCategory('Produk Ritel');
    } else if (scope === 'semua') {
      setDraftTitle('Kupon Diskon Pelanggan Setia Usaha Qu');
      setDraftTarget('Semua Pelanggan Terdaftar Lintas Usaha');
      setDraftMessage(
        `✨ KUPON SPESIAL USAHA QU ✨\n\nHalo Sahabat Setia!\nTerima kasih telah menjadi bagian dari keluarga besar kami. Dapatkan diskon 10% untuk transaksi Anda berikutnya!`
      );
      setNewVoucherCategory('Semua');
    } else {
      setDraftTitle('Promo Servis Berkala & Ganti Oli Rutin');
      setDraftTarget('Semua Pelanggan Bengkel');
      setDraftMessage(
        `🛵 PROMO KHUSUS BENGKEL QU! 🛵\n\nHalo Sahabat Bengkel Qu!\nSudah waktunya ganti oli atau servis rutin motormu? Dapatkan DISKON 15% untuk Paket Ganti Oli + Servis CVT minggu ini!\n\n✅ Oli Dijamin 100% Asli\n✅ Free Cek Rem & Tekanan Ban\n✅ Mekanik Profesional\n\nTunjukkan pesan ini ke kasir Bengkel Qu saat pengerjaan. Kami siap melayani!`
      );
      setNewVoucherCategory('Jasa Servis');
    }
  };

  const handleSelectScope = (scope: 'bengkel' | 'resto' | 'ritel' | 'semua') => {
    setTargetScope(scope);
    applyDefaultTemplate(scope);
    showToast(`Filter target sasaran diubah ke kategori [${scope.toUpperCase()}].`);
  };

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'broadcast-wa':
        return {
          title: 'Broadcast WhatsApp',
          subtitle: 'Form Draf & Kirim Siaran Promo / Reminder Sesuai Kategori Usaha'
        };
      case 'promo-diskon':
        return {
          title: 'Promo & Diskon',
          subtitle: 'Kelola Voucher Diskon & Kupon Kasir Adaptif'
        };
      case 'riwayat-pesan':
        return {
          title: 'Riwayat Pesan / Campaign',
          subtitle: 'Log Kampanye Pesan & Pengiriman Promosi Terpartisi'
        };
      default:
        return {
          title: 'Marketing',
          subtitle: 'Promosi & Komunikasi Pelanggan'
        };
    }
  };

  const headerMeta = getHeaderMeta();
  const presetTemplates = getPresetTemplates();

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftMessage.trim()) {
      showToast('Harap isi judul kampanye dan pesan promosi!');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const recipientCount = currentScopedCustomers.length;

    const newCmp: MarketingCampaign = {
      id: `cmp-${Date.now()}`,
      title: draftTitle.trim(),
      channel: 'WhatsApp',
      targetAudience: `${draftTarget} (${recipientCount} Kontak [${targetScope.toUpperCase()}])`,
      targetBusinessScope: targetScope,
      messageContent: draftMessage.trim(),
      sentDate: dateFormatted,
      recipientCount: Math.max(1, recipientCount),
      status: 'Terkirim',
      deliveredPercent: 100
    };

    onSendCampaign(newCmp);
    showToast(`Pesan broadcast berhasil dikirimkan ke ${recipientCount} kontak pelanggan [${targetScope.toUpperCase()}]!`);
    setActiveTab('riwayat-pesan');
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherCode.trim() || !newVoucherTitle.trim()) {
      showToast('Harap isi kode voucher dan judul promo!');
      return;
    }

    const newVch: PromoVoucher = {
      id: `vch-${Date.now()}`,
      code: newVoucherCode.trim().toUpperCase(),
      title: newVoucherTitle.trim(),
      discountType: newVoucherType,
      discountValue: Number(newVoucherValue) || 10,
      minTransaction: Number(newVoucherMinTx) || 0,
      validUntil: newVoucherValidUntil.trim() || '31 Des 2026',
      category: newVoucherCategory,
      quota: Number(newVoucherQuota) || 50,
      usedCount: 0,
      isActive: true,
      notes: `Voucher diskon ${newVoucherCategory} [${targetScope.toUpperCase()}]`
    };

    onAddVoucher(newVch);
    setIsAddVoucherFormOpen(false);
    showToast(`Voucher ${newVch.code} berhasil dibuat dan diaktifkan di kasir!`);

    // Reset Form
    setNewVoucherCode('');
    setNewVoucherTitle('');
    setNewVoucherValue(10);
    setNewVoucherMinTx(75000);
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
    showToast('Teks berhasil disalin ke clipboard!');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* 1. COMPACT SUB-MENU HEADER */}
      <div className="bg-[#008952] text-white px-4 py-2.5 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-8 h-8 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight truncate leading-tight">
                {headerMeta.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2 py-1 rounded-lg bg-emerald-800/40 text-[10px] font-bold text-white flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-200" />
              <span>{todayStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 shadow-lg flex items-center justify-between gap-2 sticky top-[48px] z-20">
          <div className="flex items-center gap-2 min-w-0">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[10px] text-emerald-300 font-bold hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 sticky top-[48px] z-10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab('etalase-online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'etalase-online'
                ? 'bg-[#008952] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Etalase Web & WA</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast-wa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'broadcast-wa'
                ? 'bg-[#008952] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('promo-diskon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'promo-diskon'
                ? 'bg-[#008952] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Promo & Voucher Diskon</span>
          </button>

          <button
            onClick={() => setActiveTab('riwayat-pesan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'riwayat-pesan'
                ? 'bg-[#008952] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Riwayat Campaign ({campaigns.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto w-full pb-20">
        {/* =====================================================================
            SUB-MENU ETALASE ONLINE & PESANAN WHATSAPP
        ===================================================================== */}
        {activeTab === 'etalase-online' && (
          <EtalaseOnlineView
            onBack={onBack}
            businessType={businessType}
            subscription={subscription}
            profile={profile}
            onOpenSubscriptionModal={onOpenSubscriptionModal}
          />
        )}

        {/* =====================================================================
            SUB-MENU A: BROADCAST WHATSAPP (DENGAN PARTISI ISOLASI KATEGORI USAHA)
        ===================================================================== */}
        {activeTab === 'broadcast-wa' && (
          <div className="space-y-4">
            
            {/* PARTISI KATEGORI USAHA / TARGET SCOPE SELECTOR */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center font-bold">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Partisi Target Kategori Usaha (Isolasi Data)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Pesan hanya akan dikirim ke segmen pelanggan yang Anda pilih.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#008952] text-[10px] font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Anti-Salah Sasaran</span>
                </div>
              </div>

              {/* Scope Selector Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* Bengkel */}
                <button
                  type="button"
                  onClick={() => handleSelectScope('bengkel')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetScope === 'bengkel'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                      <Wrench className="w-3.5 h-3.5 text-[#008952]" />
                      <span>Bengkel</span>
                    </div>
                    {targetScope === 'bengkel' && (
                      <span className="w-2 h-2 rounded-full bg-[#008952]" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {bengkelCustomers.length} Kontak Motor/Mobil
                  </span>
                </button>

                {/* Resto */}
                <button
                  type="button"
                  onClick={() => handleSelectScope('resto')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetScope === 'resto'
                      ? 'bg-rose-50/80 border-rose-600 ring-2 ring-rose-500/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-rose-600" />
                      <span>Resto & Kafe</span>
                    </div>
                    {targetScope === 'resto' && (
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {restoCustomers.length} Tamu Meja/Dine-in
                  </span>
                </button>

                {/* Ritel */}
                <button
                  type="button"
                  onClick={() => handleSelectScope('ritel')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetScope === 'ritel'
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                      <ScanBarcode className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ritel & Toko</span>
                    </div>
                    {targetScope === 'ritel' && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {ritelCustomers.length} Member Kartu/Poin
                  </span>
                </button>

                {/* Semua Usaha */}
                <button
                  type="button"
                  onClick={() => handleSelectScope('semua')}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetScope === 'semua'
                      ? 'bg-slate-100 border-slate-700 ring-2 ring-slate-400/30'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                      <Layers className="w-3.5 h-3.5 text-slate-700" />
                      <span>Semua Usaha</span>
                    </div>
                    {targetScope === 'semua' && (
                      <span className="w-2 h-2 rounded-full bg-slate-800" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {customers.length} Kontak Gabungan
                  </span>
                </button>
              </div>

              {/* Data Isolation Guarantee Notice */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#008952] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Isolasi Data Terjamin: </strong>
                  {targetScope === 'bengkel' && 'Pesan promosi hanya akan dikirim ke pelanggan dengan data kendaraan/plat nomor. Tamu resto atau member ritel tidak akan terganggu.'}
                  {targetScope === 'resto' && 'Pesan promosi hanya akan dikirim ke tamu resto & meja makan. Pelanggan bengkel otomotif tidak akan menerima promo ini.'}
                  {targetScope === 'ritel' && 'Pesan promosi hanya akan dikirim ke pemegang kartu member belanja. Data servis motor tidak akan tercampur.'}
                  {targetScope === 'semua' && 'Pesan promosi umum akan disiarkan ke seluruh kontak pelanggan lintas divisi usaha.'}
                </div>
              </div>
            </div>

            {/* FORM CARD BROADCAST WA */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Formulir Draf Siaran Broadcast WhatsApp [{targetScope.toUpperCase()}]
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kirim pesan promosi, kupon diskon, atau pengingat langsung ke nomor WhatsApp pelanggan.
                  </p>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
              </div>

              {/* Template Presets Adaptif Sesuai Kategori Usaha */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pilih Contoh Template Cepat ({targetScope.toUpperCase()}):
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Klik untuk mengisi otomatis
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setDraftTitle(tmpl.title);
                        setDraftMessage(tmpl.text);
                        setDraftTarget(tmpl.target);
                        showToast(`Template "${tmpl.label}" dimuat ke formulir.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                {/* Judul Kampanye */}
                <div className="group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nama Kampanye / Subjek Pesan *
                  </label>
                  <input
                    type="text"
                    required
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Contoh: Promo Ganti Oli + Servis CVT Diskon 15%"
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-900 font-bold text-xs focus:outline-none"
                  />
                </div>

                {/* Target Sasaran Pelanggan (Scoped to active category) */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Target Sasaran Pelanggan ({targetScope.toUpperCase()}) *
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {currentScopedCustomers.length} Kontak Terfilter
                    </span>
                  </div>

                  <select
                    value={draftTarget}
                    onChange={(e) => setDraftTarget(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-medium text-xs focus:outline-none"
                  >
                    {targetScope === 'bengkel' && (
                      <>
                        <option value="Semua Pelanggan Bengkel">
                          Semua Pelanggan Bengkel ({bengkelCustomers.length} Kontak Terdaftar)
                        </option>
                        <option value="Pelanggan Servis Lebih Dari 2 Bulan">
                          Pelanggan Servis Lebih Dari 2 Bulan (Reminder Berkala)
                        </option>
                        <option value="Pemilik Motor Matic (Vario, BeAT, NMAX, Aerox)">
                          Pemilik Motor Matic (Khusus Promo Oli & CVT)
                        </option>
                        <option value="Member Loyalitas Bengkel">
                          Member Loyalitas Bengkel (Poin Reward)
                        </option>
                      </>
                    )}

                    {targetScope === 'resto' && (
                      <>
                        <option value="Semua Tamu Resto / Kuliner">
                          Semua Tamu Resto / Kuliner ({restoCustomers.length} Kontak Terdaftar)
                        </option>
                        <option value="Tamu Langganan Meja Dine-in">
                          Tamu Langganan Meja Dine-in (Makan di Tempat)
                        </option>
                        <option value="Pelanggan Makan Siang Hemat (Lunch Hour)">
                          Pelanggan Makan Siang Hemat (Lunch Hour)
                        </option>
                        <option value="Tamu Reservasi Meja Keluarga & VIP">
                          Tamu Reservasi Meja Keluarga & VIP
                        </option>
                      </>
                    )}

                    {targetScope === 'ritel' && (
                      <>
                        <option value="Semua Member Ritel & Toko">
                          Semua Member Ritel & Toko ({ritelCustomers.length} Kontak Terdaftar)
                        </option>
                        <option value="Member VIP Tier Gold & Platinum">
                          Member VIP Tier Gold & Platinum (Diskon Eksklusif)
                        </option>
                        <option value="Member Belanja Sembako Mingguan">
                          Member Belanja Sembako & Kebutuhan Rumah Mingguan
                        </option>
                        <option value="Member Poin Belanja Tertinggi">
                          Member Poin Belanja Tertinggi (Top Spender)
                        </option>
                      </>
                    )}

                    {targetScope === 'semua' && (
                      <>
                        <option value="Semua Pelanggan Terdaftar Lintas Usaha">
                          Semua Pelanggan Terdaftar Lintas Usaha ({customers.length} Kontak)
                        </option>
                        <option value="Pelanggan Aktif Dalam 30 Hari Terakhir">
                          Pelanggan Aktif Bertransaksi Dalam 30 Hari Terakhir
                        </option>
                      </>
                    )}
                  </select>
                </div>

                {/* Scoped Customer Target Preview */}
                <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#008952]" />
                      Sampel Kontak Penerima Broadcast ({targetScope.toUpperCase()}):
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Total: {currentScopedCustomers.length} Penerima
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {currentScopedCustomers.slice(0, 6).map((c) => (
                      <div
                        key={c.id}
                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-medium text-slate-700 flex items-center gap-1 shadow-2xs"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          (c.customer_type || 'bengkel') === 'bengkel' ? 'bg-[#008952]' :
                          c.customer_type === 'resto' ? 'bg-rose-500' : 'bg-blue-500'
                        }`} />
                        <span className="font-bold">{c.name}</span>
                        {c.plateNumber && c.plateNumber !== '-' && (
                          <span className="text-slate-400">({c.plateNumber})</span>
                        )}
                        {c.favoriteTable && (
                          <span className="text-rose-600">({c.favoriteTable.split(' ')[0]} {c.favoriteTable.split(' ')[1] || ''})</span>
                        )}
                        {c.memberCardNumber && (
                          <span className="text-blue-600">({c.memberCardNumber})</span>
                        )}
                      </div>
                    ))}
                    {currentScopedCustomers.length > 6 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-200 text-slate-600 text-[10px] font-bold">
                        +{currentScopedCustomers.length - 6} lainnya
                      </span>
                    )}
                  </div>
                </div>

                {/* Pesan WhatsApp */}
                <div className="group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Isi Pesan WhatsApp *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    placeholder="Ketik draf pesan siaran promosi Anda di sini..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#008952] font-mono leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span>Gunakan tanda bintang *tebal* atau _miring_ untuk format teks WhatsApp.</span>
                    <span>{draftMessage.length} Karakter</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-extrabold py-3.5 rounded-2xl shadow-xs text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Broadcast ke {currentScopedCustomers.length} Kontak [{targetScope.toUpperCase()}]</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =====================================================================
            SUB-MENU B: PROMO & DISKON (VOUCHER KASIR)
        ===================================================================== */}
        {activeTab === 'promo-diskon' && (
          <div className="space-y-4">
            {/* Header Action & Stats */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Manajemen Voucher & Promo Aktif ({vouchers.filter((v) => v.isActive).length} Aktif)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Voucher otomatis terbaca saat proses pembayaran di menu Kasir POS.
                </p>
              </div>

              <button
                onClick={() => setIsAddVoucherFormOpen(!isAddVoucherFormOpen)}
                className="px-3 py-1.5 rounded-xl bg-[#008952] text-white text-xs font-bold flex items-center gap-1 shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddVoucherFormOpen ? 'Tutup Form' : '+ Tambah Promo'}</span>
              </button>
            </div>

            {/* FORM CARD (COLLAPSIBLE / EXPANDED) */}
            {isAddVoucherFormOpen && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-emerald-200/80 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Input Voucher Promo & Diskon Baru
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Minimalist Underlined Form
                  </span>
                </div>

                <form onSubmit={handleCreateVoucher} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Kode Kupon / Voucher (KAPITAL) *
                      </label>
                      <input
                        type="text"
                        required
                        value={newVoucherCode}
                        onChange={(e) => setNewVoucherCode(e.target.value)}
                        placeholder="Contoh: DISKON15 / OLIHEMAT"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-900 font-black text-xs uppercase"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Judul Promosi *
                      </label>
                      <input
                        type="text"
                        required
                        value={newVoucherTitle}
                        onChange={(e) => setNewVoucherTitle(e.target.value)}
                        placeholder="Contoh: Diskon Servis Rutin 15%"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Tipe Potongan
                      </label>
                      <select
                        value={newVoucherType}
                        onChange={(e) => setNewVoucherType(e.target.value as any)}
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-bold text-xs"
                      >
                        <option value="Persen">Persentase (%)</option>
                        <option value="Nominal">Nominal Rupiah (Rp)</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Nilai Potongan *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newVoucherValue}
                        onChange={(e) => setNewVoucherValue(Number(e.target.value))}
                        placeholder="10 atau 20000"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-bold text-xs"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Min. Transaksi (Rp)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newVoucherMinTx}
                        onChange={(e) => setNewVoucherMinTx(Number(e.target.value))}
                        placeholder="75000"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Kategori Voucher
                      </label>
                      <select
                        value={newVoucherCategory}
                        onChange={(e) => setNewVoucherCategory(e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-medium text-xs"
                      >
                        <option value="Semua">Semua Kategori</option>
                        <option value="Jasa Servis">Jasa Servis (Bengkel)</option>
                        <option value="Sparepart">Suku Cadang (Bengkel)</option>
                        <option value="Oli">Oli & Pelumas (Bengkel)</option>
                        <option value="Menu Resto">Menu Makanan & Minuman (Resto)</option>
                        <option value="Produk Ritel">Produk Toko & Sembako (Ritel)</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Kuota Kupon
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newVoucherQuota}
                        onChange={(e) => setNewVoucherQuota(Number(e.target.value))}
                        placeholder="50"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-medium text-xs"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Berlaku Sampai
                      </label>
                      <input
                        type="text"
                        value={newVoucherValidUntil}
                        onChange={(e) => setNewVoucherValidUntil(e.target.value)}
                        placeholder="31 Des 2026"
                        className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1.5 px-0 text-slate-800 font-medium text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddVoucherFormOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#008952] hover:bg-emerald-700 text-white text-xs font-extrabold shadow-2xs transition-colors cursor-pointer"
                    >
                      Simpan & Aktifkan Voucher
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DAFTAR VOUCHER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vouchers.map((v) => (
                <div
                  key={v.id}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-2xs space-y-3 ${
                    v.isActive ? 'border-slate-200/90' : 'border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 tracking-wider">
                          {v.code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {v.category}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">
                        {v.title}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-[#008952]">
                        {v.discountType === 'Persen' ? `${v.discountValue}%` : `Rp ${v.discountValue.toLocaleString('id-ID')}`}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        Min. Rp {v.minTransaction.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Berlaku s/d: <strong className="text-slate-800">{v.validUntil}</strong></span>
                    <span>Terpakai: <strong className="text-slate-800">{v.usedCount} / {v.quota}</strong></span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {v.isActive ? '● Status Aktif' : '○ Nonaktif'}
                    </span>

                    <button
                      onClick={() => {
                        onToggleVoucherActive(v.id);
                        showToast(`Status voucher ${v.code} telah diubah.`);
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
                    >
                      {v.isActive ? 'Nonaktifkan' : 'Aktifkan Kembali'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =====================================================================
            SUB-MENU C: RIWAYAT PESAN / CAMPAIGN (TERPARTISI KATEGORI USAHA)
        ===================================================================== */}
        {activeTab === 'riwayat-pesan' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Riwayat Kampanye & Siaran Pesan ({campaigns.length} Riwayat)
                </h2>
                <p className="text-[11px] text-slate-500">
                  Log kronologis seluruh pengiriman pesan siaran promosi terpartisi per kategori.
                </p>
              </div>
            </div>

            {/* List View with Business Scope Badges */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada kampanye pesan yang dikirim
                </div>
              ) : (
                campaigns.map((cmp, idx) => {
                  const scope = cmp.targetBusinessScope || 'bengkel';
                  return (
                    <div key={cmp.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                              {cmp.channel}
                            </span>

                            {/* Business Scope Badge */}
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              scope === 'bengkel' ? 'bg-emerald-100 text-emerald-800' :
                              scope === 'resto' ? 'bg-rose-100 text-rose-800' :
                              scope === 'ritel' ? 'bg-blue-100 text-blue-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              [{scope}]
                            </span>

                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {cmp.sentDate}
                            </span>

                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              {cmp.deliveredPercent}% Terkirim
                            </span>
                          </div>

                          <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                            {cmp.title}
                          </h4>

                          <p className="text-xs text-slate-600 line-clamp-2 italic font-mono bg-slate-50 p-2 rounded-xl border border-slate-100">
                            "{cmp.messageContent}"
                          </p>

                          <div className="text-[11px] text-slate-500 pt-0.5">
                            Sasaran: <strong className="text-slate-700">{cmp.targetAudience}</strong>
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black">
                            {cmp.recipientCount} Kontak
                          </span>
                          <div className="mt-1">
                            <button
                              onClick={() => handleCopyText(cmp.messageContent, idx)}
                              className="text-[11px] text-emerald-700 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>{copiedIndex === idx ? 'Tersalin!' : 'Salin Pesan'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
