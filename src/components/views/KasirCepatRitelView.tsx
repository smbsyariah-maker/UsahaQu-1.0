import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ScanBarcode, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Volume2, 
  VolumeX, 
  Receipt,
  CreditCard,
  QrCode,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { RetailProduct, Transaction, ServiceItem } from '../../types';

interface KasirCepatRitelViewProps {
  onBack: () => void;
  products: RetailProduct[];
  onCompleteTransaction: (tx: Transaction) => void;
  onOpenReceipt: (tx: Transaction) => void;
}

export const KasirCepatRitelView: React.FC<KasirCepatRitelViewProps> = ({
  onBack,
  products,
  onCompleteTransaction,
  onOpenReceipt
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [cart, setCart] = useState<{ product: RetailProduct; qty: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Kartu Debit'>('Tunai');
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, audioCtx.currentTime); // High pitch A6 beep
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch {
      // AudioContext fallback
    }
  };

  const CATEGORIES = ['Semua', 'Sembako', 'Minuman', 'Makanan Ringan', 'Mie Instan', 'Perawatan & Mandi'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleAddToCart = (product: RetailProduct) => {
    if (product.stock <= 0) {
      showToast(`Stok ${product.name} habis!`);
      return;
    }
    playBeep();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: RetailProduct; qty: number }[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check exact barcode or SKU match
    const exactMatch = products.find(
      (p) =>
        p.barcode.toLowerCase() === searchQuery.trim().toLowerCase() ||
        p.sku.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (exactMatch) {
      handleAddToCart(exactMatch);
      showToast(`1x ${exactMatch.name} ditambahkan!`);
      setSearchQuery('');
    } else {
      // Check partial match
      const firstFound = filteredProducts[0];
      if (firstFound) {
        handleAddToCart(firstFound);
        showToast(`1x ${firstFound.name} ditambahkan!`);
        setSearchQuery('');
      } else {
        showToast('Barcode atau produk tidak ditemukan!');
      }
    }
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.sellPrice * item.qty, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const changeAmount = Math.max(0, cashGiven - subtotal);

  // Set default cash given when subtotal changes
  useEffect(() => {
    if (cashGiven < subtotal) {
      setCashGiven(subtotal);
    }
  }, [subtotal]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Keranjang kasir masih kosong!');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const txItems: ServiceItem[] = cart.map((item) => ({
      id: `it-${item.product.id}`,
      name: item.product.name,
      price: item.product.sellPrice,
      qty: item.qty,
      type: 'part'
    }));

    const newTx: Transaction = {
      id: `tx-ritel-${Date.now()}`,
      invoiceNumber: `RTL-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`,
      date: dateFormatted,
      customerName: 'Pelanggan Umum (Ritel Qu)',
      plateNumber: '-',
      vehicleModel: 'Transaksi Kasir Cepat',
      mechanicName: 'Kasir Toko',
      items: txItems,
      subtotal: subtotal,
      discount: 0,
      total: subtotal,
      paymentMethod: paymentMethod,
      cashPaid: paymentMethod === 'Tunai' ? cashGiven : subtotal,
      change: paymentMethod === 'Tunai' ? changeAmount : 0,
      status: 'Lunas'
    };

    onCompleteTransaction(newTx);
    onOpenReceipt(newTx);
    setCart([]);
    setSearchQuery('');
    showToast(`Transaksi ${newTx.invoiceNumber} berhasil diproses!`);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* 1. COMPACT FAST HEADER */}
      <div className="bg-[#2563eb] text-white px-4 py-2.5 shadow-sm sticky top-0 z-30">
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
              <h1 className="text-sm font-bold tracking-tight truncate leading-tight flex items-center gap-1.5">
                <ScanBarcode className="w-4 h-4 text-blue-200" />
                <span>Kasir Cepat</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Bip Aktif' : 'Bip Dimatikan'}
              className="w-8 h-8 rounded-xl bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors text-white cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-blue-200" />}
            </button>
            <div className="px-2.5 py-1 rounded-xl bg-white text-[#2563eb] text-xs font-black flex items-center gap-1 shadow-xs">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{totalItemsCount} Item</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="bg-blue-900 text-white text-xs font-semibold px-4 py-2.5 shadow-lg flex items-center justify-between gap-2 sticky top-[48px] z-20">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-[10px] text-blue-300 font-bold hover:underline shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Content: Split Grid for Mobile & Tablet */}
      <div className="p-3 sm:p-4 max-w-5xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-4 pb-28">
        
        {/* LEFT COLUMN: Fast Barcode Input & Product Catalog */}
        <div className="flex-1 space-y-3">
          
          {/* Quick Barcode / SKU Input */}
          <div className="bg-white rounded-2xl p-3 shadow-xs border border-blue-200/80">
            <form onSubmit={handleBarcodeSubmit} className="relative flex items-center">
              <ScanBarcode className="w-5 h-5 text-blue-600 absolute left-3.5 pointer-events-none stroke-[2.2]" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan Barcode / Ketik Nama SKU (Tekan Enter)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-24 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white text-[10.5px] font-extrabold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>+ Scan</span>
              </button>
            </form>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2563eb] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid (Fast 2-Column / 3-Column) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[55vh] lg:max-h-[70vh] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inCartItem = cart.find((i) => i.product.id === p.id);
              const isLowStock = p.stock <= p.minStock;

              return (
                <div
                  key={p.id}
                  onClick={() => handleAddToCart(p)}
                  className={`bg-white rounded-2xl p-3 border transition-all cursor-pointer shadow-2xs hover:shadow-md active:scale-97 flex flex-col justify-between relative group ${
                    inCartItem ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  {/* Cart count badge */}
                  {inCartItem && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#2563eb] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      {inCartItem.qty}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-slate-400 font-semibold truncate max-w-[80px]">
                        {p.barcode}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {p.stock} {p.unit}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-tight">
                      {p.name}
                    </h3>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-black text-sm text-[#2563eb]">
                      Rp {p.sellPrice.toLocaleString('id-ID')}
                    </span>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-[#2563eb] group-hover:text-white text-blue-600 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Cart & One-Tap Checkout */}
        <div className="w-full lg:w-84 bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black text-slate-900">Keranjang Kasir</h2>
              </div>
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCart([])}
                  className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Kosongkan
                </button>
              )}
            </div>

            {/* Cart item list */}
            {cart.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-400 mx-auto flex items-center justify-center">
                  <ScanBarcode className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500">Keranjang masih kosong</p>
                <p className="text-[10px] text-slate-400">Scan barcode atau klik produk di sebelah kiri</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-xs text-slate-800 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Rp {item.product.sellPrice.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-black text-xs text-slate-800 w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Controls */}
          {cart.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              {/* Payment Method Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Tunai')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentMethod === 'Tunai'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Tunai
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    QRIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Kartu Debit')}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                      paymentMethod === 'Kartu Debit'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Debit
                  </button>
                </div>
              </div>

              {/* Cash given shortcuts */}
              {paymentMethod === 'Tunai' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span>Uang Diterima:</span>
                    <span className="text-slate-800">Rp {cashGiven.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCashGiven(subtotal)}
                      className="py-1 px-1 rounded-lg bg-slate-100 hover:bg-blue-50 font-extrabold text-slate-700"
                    >
                      Uang Pas
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashGiven(20000)}
                      className="py-1 px-1 rounded-lg bg-slate-100 hover:bg-blue-50 font-extrabold text-slate-700"
                    >
                      20k
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashGiven(50000)}
                      className="py-1 px-1 rounded-lg bg-slate-100 hover:bg-blue-50 font-extrabold text-slate-700"
                    >
                      50k
                    </button>
                    <button
                      type="button"
                      onClick={() => setCashGiven(100000)}
                      className="py-1 px-1 rounded-lg bg-slate-100 hover:bg-blue-50 font-extrabold text-slate-700"
                    >
                      100k
                    </button>
                  </div>
                </div>
              )}

              {/* Subtotal & Kembalian */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Belanja:</span>
                  <span className="font-black text-base text-slate-900">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                {paymentMethod === 'Tunai' && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Kembalian:</span>
                    <span className="font-extrabold text-emerald-700">
                      Rp {changeAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>

              {/* Instant Pay & Print Receipt Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white font-black py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Bayar & Cetak Struk (Rp {subtotal.toLocaleString('id-ID')})</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
