import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  QrCode, 
  Share2, 
  Copy, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Lock, 
  Download, 
  RefreshCw, 
  MessageCircle, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Store, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Building2,
  Wrench,
  UtensilsCrossed,
  ScanBarcode
} from 'lucide-react';
import QRCode from 'qrcode';
import { 
  BusinessType, 
  SubscriptionState, 
  WorkshopProfile, 
  Sparepart, 
  RetailProduct 
} from '../../types';
import { DynamicLogoUQ } from '../common/DynamicLogoUQ';
import { INITIAL_SPAREPARTS, INITIAL_RETAIL_PRODUCTS } from '../../data/mockData';

interface EtalaseOnlineViewProps {
  onBack: () => void;
  businessType?: BusinessType;
  subscription?: SubscriptionState;
  profile?: WorkshopProfile;
  onOpenSubscriptionModal?: () => void;
}

export const EtalaseOnlineView: React.FC<EtalaseOnlineViewProps> = ({
  onBack,
  businessType = 'bengkel',
  subscription,
  profile,
  onOpenSubscriptionModal
}) => {
  const isCloudUnlocked = Boolean(
    subscription?.isTrialActive || 
    subscription?.planId === 'core' || 
    subscription?.planId === 'corporate'
  );

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja (Real-time)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart for Live Preview Simulator
  const [simulatorCart, setSimulatorCart] = useState<{ [id: string]: number }>({});
  const [customerNote, setCustomerNote] = useState('');
  const [customerName, setCustomerName] = useState('');

  const outletSlug = (profile?.workshopName || 'usaha-qu')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  const webCatalogUrl = `https://usahaqu.id/katalog/${outletSlug}`;
  const ownerWhatsApp = profile?.phone || '081234567890';

  // Sample catalog items based on business type
  const catalogItems = businessType === 'resto' ? [
    { id: 'm1', name: 'Nasi Goreng Spesial Chef', category: 'Makanan', price: 28000, desc: 'Nasi goreng bumbu rempah dengan telur mata sapi & ayam suwir' },
    { id: 'm2', name: 'Ayam Bakar Madu Pedas Manis', category: 'Makanan', price: 32000, desc: 'Paha/dada ayam bumbu madu bakar gurih + sambal lalapan' },
    { id: 'm3', name: 'Mie Goreng Seafood Spesial', category: 'Makanan', price: 30000, desc: 'Mie kenyal dengan udang, cumi, bakso ikan & sayuran' },
    { id: 'm4', name: 'Es Teh Manis Jasmine', category: 'Minuman', price: 6000, desc: 'Teh melati wangi dingin segar' },
    { id: 'm5', name: 'Jus Alpukat Kocok', category: 'Minuman', price: 15000, desc: 'Alpukat mentega asli kental dengan susu cokelat' }
  ] : businessType === 'ritel' ? [
    { id: 'r1', name: 'Minyak Goreng Sania 2 Liter', category: 'Sembako', price: 34000, desc: 'Minyak goreng kelapa sawit premium 2x penyaringan' },
    { id: 'r2', name: 'Beras Premium Ramos 5 Kg', category: 'Sembako', price: 69000, desc: 'Beras pulen bersih kualitas super' },
    { id: 'r3', name: 'Gula Pasir Gulaku 1 Kg', category: 'Sembako', price: 17500, desc: 'Gula pasir kristal tebu murni' },
    { id: 'r4', name: 'Teh Celup Sariwangi Isi 25', category: 'Minuman', price: 7500, desc: 'Teh celup asli khas nusantara' },
    { id: 'r5', name: 'Kopi Kapal Api Special Mix', category: 'Minuman', price: 15000, desc: 'Kopi bubuk instan gula renteng isi 10 sachet' }
  ] : [
    { id: 'b1', name: 'Paket Servis CVT + Bersih Injeksi', category: 'Jasa Servis', price: 85000, desc: 'Pembersihan pulley, roller, v-belt & reset scanner OBD' },
    { id: 'b2', name: 'Oli Mesin AHM MPX2 Matic 0.8L', category: 'Oli & Pelumas', price: 54000, desc: 'Oli resmi motor matic Honda 100% original' },
    { id: 'b3', name: 'Oli Yamalube Matic Silver 0.8L', category: 'Oli & Pelumas', price: 52000, desc: 'Oli resmi motor matic Yamaha original' },
    { id: 'b4', name: 'Kampas Rem Depan Cakram Honda', category: 'Sparepart', price: 45000, desc: 'Kampas rem cakram awet pakem presisi' },
    { id: 'b5', name: 'Vanbelt V-Belt Kit BeAT FI', category: 'Sparepart', price: 125000, desc: 'Set V-Belt + Roller original Honda' }
  ];

  // Generate QR Code on load
  useEffect(() => {
    QRCode.toDataURL(webCatalogUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#008952',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err));
  }, [webCatalogUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(webCatalogUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast('Tautan Etalase Web berhasil disalin!');
  };

  const handleSyncToCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
      showToast(`${catalogItems.length} Produk & Harga berhasil disinkronkan ke Cloud Server!`);
    }, 1200);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setSimulatorCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  // Calculate cart total
  const cartTotalItems = Object.values(simulatorCart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = Object.entries(simulatorCart).reduce((sum, [id, qty]) => {
    const item = catalogItems.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Send Order via WhatsApp Direct URL
  const handleSendOrderWhatsApp = () => {
    if (cartTotalItems === 0) {
      showToast('Pilih minimal 1 produk pada simulator!');
      return;
    }

    const itemLines = Object.entries(simulatorCart).map(([id, qty]) => {
      const item = catalogItems.find((i) => i.id === id);
      if (!item) return '';
      return `• ${qty}x ${item.name} (Rp ${(item.price * qty).toLocaleString('id-ID')})`;
    }).filter(Boolean).join('\n');

    const cleanPhone = ownerWhatsApp.replace(/[^0-9]/g, '');
    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const message = 
`Halo *${profile?.workshopName || 'Usaha Qu'}*,
Saya ingin memesan dari Etalase Online:

📋 *Daftar Pesanan:*
${itemLines}

💰 *Total Pembayaran:* Rp ${cartTotalPrice.toLocaleString('id-ID')}
${customerName.trim() ? `👤 *Nama Pemesan:* ${customerName.trim()}\n` : ''}${customerNote.trim() ? `📝 *Catatan:* ${customerNote.trim()}\n` : ''}
Mohon konfirmasi ketersediaan dan metode pengambilannya ya Kak. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    
    // Open WhatsApp
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp untuk mengirim pesanan (0% Potongan Komisi)!');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* 1. COMPACT HEADER */}
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
                <Globe className="w-4 h-4" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Etalase Online & WA
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isCloudUnlocked ? 'bg-white text-[#008952]' : 'bg-white/20 text-emerald-100'
            }`}>
              {isCloudUnlocked ? 'Cloud QR Aktif' : 'Basic Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 shadow-lg flex items-center justify-between sticky top-[48px] z-20">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[10px] text-emerald-300 font-bold hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <div className="flex-1 p-4 space-y-4 max-w-3xl mx-auto w-full pb-20">
        {/* Banner Mode Lisensi (Basic vs Core/Corporate) */}
        {!isCloudUnlocked ? (
          <div className="bg-amber-50 border border-amber-300 rounded-3xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-amber-950">
                    Paket Basic: Murni Offline-First
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.2 rounded-full">
                    Tanpa Server Cloud
                  </span>
                </div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Katalog produk disimpan lokal di perangkat Anda. Pemesanan dilakukan secara langsung via format WhatsApp manual ke pelanggan tanpa perlu biaya server bulanan.
                </p>
              </div>
            </div>

            {onOpenSubscriptionModal && (
              <div className="pt-2 border-t border-amber-200/70 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-900">
                  Ingin Etalase Web QR Code instan & sinkronisasi otomatis?
                </span>
                <button
                  type="button"
                  onClick={onOpenSubscriptionModal}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>Upgrade ke Core</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#008952] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-emerald-950">
                      Cloud Server Sync Aktif • 0% Komisi
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full">
                      Online Real-time
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Etalase Web QR Code Anda siap dibagikan ke pengunjung. Pesanan dari web langsung masuk ke WhatsApp pemilik toko tanpa potongan sepeserpun!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncToCloud}
                disabled={isSyncing}
                className="shrink-0 bg-white text-[#008952] font-black text-xs px-3 py-2 rounded-xl border border-emerald-300 shadow-xs hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer disabled:opacity-75 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sinkron...' : 'Sync Cloud'}</span>
              </button>
            </div>

            <div className="text-[10px] font-semibold text-emerald-700 flex items-center justify-between pt-1 border-t border-emerald-200/60">
              <span>Status: Terhubung ke Cloud Server Ringan</span>
              <span>Terakhir Sync: {lastSyncTime}</span>
            </div>
          </div>
        )}

        {/* SECTION ETALASE WEB & QR CODE DISPLAY */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#008952] flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">QR Code & Link Etalase Toko</h3>
                <p className="text-[11px] text-slate-500">Pajang QR di meja/kasir agar pelanggan langsung scan</p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-[#008952] bg-emerald-50 px-2.5 py-1 rounded-xl">
              WhatsApp: {ownerWhatsApp}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Left: QR Code Card */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              {qrCodeUrl ? (
                <div className="relative p-2 bg-white rounded-2xl shadow-xs border border-slate-200 mb-2">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code Etalase Online" 
                    className="w-44 h-44 object-contain rounded-xl"
                  />
                  {/* Watermark in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md border border-emerald-200 flex items-center justify-center">
                      <DynamicLogoUQ businessType={businessType} size="xs" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-44 h-44 bg-slate-200 rounded-xl animate-pulse mb-2" />
              )}

              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Scan untuk Buka Katalog Menu
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {webCatalogUrl}
              </span>
            </div>

            {/* Right: Quick Action Buttons & Info */}
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tautan Web Etalase Publik:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webCatalogUrl}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono text-slate-700 truncate select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-xl bg-[#008952] hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = qrCodeUrl;
                    a.download = `QR-Etalase-${outletSlug}.png`;
                    a.click();
                    showToast('QR Code berhasil diunduh untuk dicetak!');
                  }}
                  className="w-full p-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-[#008952]" />
                  <span>Unduh Gambar QR Code Stand Meja</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendOrderWhatsApp}
                  className="w-full p-2.5 rounded-2xl bg-[#008952] hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Tes Kirim Pesanan via WhatsApp (0% Fee)</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#008952] shrink-0" />
                <span>Pelanggan memesan mandiri, notifikasi instan masuk ke WhatsApp outlet!</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION SIMULATOR WEB ETALASE PENGUNJUNG (LIVE TESTER) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#008952]" />
                <span>Simulator Tampilan Pengunjung Toko</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Uji coba memilih produk dan membuat pesanan instan via WhatsApp
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-[#008952] bg-emerald-50 px-2 py-1 rounded-xl">
              <span>{cartTotalItems} Item Terpilih</span>
            </div>
          </div>

          {/* Product Items List */}
          <div className="space-y-2.5">
            {catalogItems.map((item) => {
              const qty = simulatorCart[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    qty > 0 
                      ? 'bg-emerald-50/50 border-[#008952]' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                    <span className="text-xs font-extrabold text-[#008952] mt-1 block">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 bg-white border border-emerald-200 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-[#008952]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-[#008952] text-white flex items-center justify-center cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.id, 1)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#008952] text-xs font-bold border border-slate-200 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pilih</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Simulator Form */}
          {cartTotalItems > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Total Estimasi Pesanan:</span>
                <span className="text-sm font-extrabold text-[#008952]">
                  Rp {cartTotalPrice.toLocaleString('id-ID')} ({cartTotalItems} item)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nama Pemesan (opsional)..."
                  className="bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                />
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Catatan pesanan / meja / plat nomor..."
                  className="bg-white border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
                />
              </div>

              <button
                type="button"
                onClick={handleSendOrderWhatsApp}
                className="w-full py-3 rounded-2xl bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan Format Rapi ke WhatsApp Pemilik Toko</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
