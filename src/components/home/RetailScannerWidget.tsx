import React, { useState } from 'react';
import { 
  ScanBarcode, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package, 
  Boxes, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Volume2
} from 'lucide-react';
import { RetailProduct } from '../../types';

interface RetailScannerWidgetProps {
  products: RetailProduct[];
  onNavigateToPOS: (scannedCartItems?: { product: RetailProduct; qty: number }[]) => void;
  onOpenAddProduct?: () => void;
}

export const RetailScannerWidget: React.FC<RetailScannerWidgetProps> = ({
  products,
  onNavigateToPOS,
  onOpenAddProduct
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedAisle, setSelectedAisle] = useState<string>('Semua');
  const [cart, setCart] = useState<{ product: RetailProduct; qty: number }[]>([]);
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);

  const aisles = ['Semua', 'Lorong A (Sembako)', 'Lorong B (Snack & Minum)', 'Lorong C (Rumah Tangga)'];

  // Play simple synth beep when barcode scanned
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // AudioContext not available or blocked
    }
  };

  const handleScanOrSubmit = (codeToScan?: string) => {
    const targetCode = (codeToScan || barcodeInput).trim();
    if (!targetCode) return;

    playBeep();

    // Search by barcode, SKU, or name
    const found = products.find(
      p => p.barcode === targetCode || 
           p.sku.toLowerCase() === targetCode.toLowerCase() ||
           p.name.toLowerCase().includes(targetCode.toLowerCase())
    );

    if (found) {
      setCart(prev => {
        const existingIdx = prev.findIndex(item => item.product.id === found.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx].qty += 1;
          return updated;
        } else {
          return [{ product: found, qty: 1 }, ...prev];
        }
      });

      setScanMessage({
        text: `✓ Berhasil scan: ${found.name} (Rp ${found.sellPrice.toLocaleString('id-ID')})`,
        success: true
      });
      setBarcodeInput('');
    } else {
      setScanMessage({
        text: `Barcode / SKU "${targetCode}" tidak ditemukan di database rak.`,
        success: false
      });
    }

    setTimeout(() => {
      setScanMessage(null);
    }, 3000);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: RetailProduct; qty: number }[];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.sellPrice * item.qty, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredProducts = selectedAisle === 'Semua'
    ? products
    : products.filter(p => p.rackAisle.includes(selectedAisle.split(' ')[1])); // e.g. Lorong A

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <ScanBarcode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Quick Barcode Scanner POS
            </h3>
            <p className="text-[11px] text-slate-500">Scan SKU / Barcode produk minimarket</p>
          </div>
        </div>

        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Laser Cepat</span>
        </span>
      </div>

      {/* Barcode Input & Scanner Box */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <ScanBarcode className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleScanOrSubmit();
                }
              }}
              placeholder="Scan atau ketik Barcode (cth: 8999908123456)..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs font-semibold rounded-xl pl-9 pr-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="button"
            onClick={() => handleScanOrSubmit()}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span>Scan</span>
          </button>
        </div>

        {/* Scan Feedback Banner */}
        {scanMessage && (
          <div
            className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in ${
              scanMessage.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {scanMessage.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span className="truncate">{scanMessage.text}</span>
          </div>
        )}

        {/* Quick Sample Barcode Chips */}
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mb-1.5">
            <span>Uji Coba Scan Cepat (Simulasi Barcode Produk):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {products.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleScanOrSubmit(p.barcode)}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/80 rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ScanBarcode className="w-3 h-3 text-blue-500" />
                <span>{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Keranjang Cepat Belanja (Fast Cart POS) */}
      {cart.length > 0 && (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3 shadow-xs space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="font-extrabold text-xs text-blue-950">
                Keranjang Kasir ({cartItemCount} Barang)
              </span>
            </div>
            <button
              onClick={() => setCart([])}
              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Kosongkan
            </button>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-2 border border-blue-100 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800 text-[11px] truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Rp {item.product.sellPrice.toLocaleString('id-ID')} / {item.product.unit} • {item.product.rackAisle}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateCartQty(item.product.id, -1)}
                    className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black text-xs text-slate-800">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.product.id, 1)}
                    className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="text-right shrink-0 min-w-[70px]">
                  <span className="font-extrabold text-blue-700 text-xs">
                    Rp {(item.qty * item.product.sellPrice).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 block">Total Tagihan Kasir</span>
              <span className="text-sm font-black text-slate-900">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={() => onNavigateToPOS(cart)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Bayar di Kasir POS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Katalog Barang & Penataan Rak Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-blue-600" />
            Display Barang & Lokasi Rak
          </span>
          <span className="text-[10px] text-slate-500">{filteredProducts.length} Produk Siap Jual</span>
        </div>

        {/* Filter Lorong */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {aisles.map((aisle) => (
            <button
              key={aisle}
              type="button"
              onClick={() => setSelectedAisle(aisle)}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap text-[10px] transition-all cursor-pointer ${
                selectedAisle === aisle
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {aisle}
            </button>
          ))}
        </div>

        {/* List Produk Cepat */}
        <div className="space-y-1.5">
          {filteredProducts.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl p-2.5 border border-slate-100 shadow-2xs hover:border-blue-200 transition-all flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xs text-slate-800 truncate">{p.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                    {p.sku}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-blue-600">{p.rackAisle}</span>
                  <span>• Stok: <strong className="text-slate-700">{p.stock} {p.unit}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black text-xs text-slate-900">
                  Rp {p.sellPrice.toLocaleString('id-ID')}
                </span>
                <button
                  onClick={() => handleScanOrSubmit(p.barcode)}
                  title="Tambah ke Kasir"
                  className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
