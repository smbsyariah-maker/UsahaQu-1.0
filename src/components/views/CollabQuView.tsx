import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Handshake, 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ChevronRight, 
  ChevronDown, 
  Package, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Check, 
  X, 
  Filter, 
  Percent, 
  Share2, 
  FileText, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles,
  Store,
  Clock,
  Printer
} from 'lucide-react';
import { ConsignmentSupplier, ConsignmentProduct, BusinessType, SubscriptionState } from '../../types';
import { DynamicLogoUQ } from '../common/DynamicLogoUQ';

interface CollabQuViewProps {
  onBack: () => void;
  suppliers: ConsignmentSupplier[];
  onAddSupplier: (supplier: Omit<ConsignmentSupplier, 'id'>) => void;
  onUpdateSupplier?: (id: string, updated: Partial<ConsignmentSupplier>) => void;
  products: ConsignmentProduct[];
  onAddProduct: (product: Omit<ConsignmentProduct, 'id'>) => void;
  onUpdateProductStock?: (id: string, delta: number, type: 'jual' | 'retur' | 'restok') => void;
  subscription?: SubscriptionState;
  initialTab?: 'toko' | 'stok' | 'laporan';
  onNavigateToReport?: () => void;
}

export const CollabQuView: React.FC<CollabQuViewProps> = ({
  onBack,
  suppliers: initialSuppliers,
  onAddSupplier,
  products: initialProducts,
  onAddProduct,
  onUpdateProductStock,
  initialTab = 'toko'
}) => {
  const [activeTab, setActiveTab] = useState<'toko' | 'stok' | 'laporan'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Suppliers & Products State
  const [suppliers, setSuppliers] = useState<ConsignmentSupplier[]>(initialSuppliers);
  const [products, setProducts] = useState<ConsignmentProduct[]>(initialProducts);
  const [expandedSupplierId, setExpandedSupplierId] = useState<string | null>(initialSuppliers[0]?.id || null);

  // Modals
  const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State: Toko Baru
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newMapsUrl, setNewMapsUrl] = useState('');

  // Form State: Tambah Stok
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [newProductName, setNewProductName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newConsumerPrice, setNewConsumerPrice] = useState<number>(20000);
  const [newSupplierNetPrice, setNewSupplierNetPrice] = useState<number>(16000);
  const [newInitialStock, setNewInitialStock] = useState<number>(20);
  const [newDueDate, setNewDueDate] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto calculate commission rate
  const calculatedCommissionPercent = newConsumerPrice > 0 
    ? Math.max(0, Math.round(((newConsumerPrice - newSupplierNetPrice) / newConsumerPrice) * 1000) / 10)
    : 0;
  const storeCommissionNominal = Math.max(0, newConsumerPrice - newSupplierNetPrice);

  // Handle submit Toko Baru
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim() || !newOwnerName.trim()) {
      showToast('Harap isi Nama Toko dan Nama Pemilik!');
      return;
    }

    const newSup: ConsignmentSupplier = {
      id: `supp-${Date.now()}`,
      storeName: newStoreName.trim(),
      ownerName: newOwnerName.trim(),
      phone: newPhone.trim() || '081234567890',
      address: newAddress.trim() || 'Alamat Toko',
      mapsUrl: newMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(newStoreName.trim())}`,
      joinedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Aktif',
      totalSoldUnits: 0,
      totalSoldRevenue: 0,
      totalReturnedUnits: 0,
      totalRestockedUnits: 0,
      activeItemCount: 0
    };

    setSuppliers([newSup, ...suppliers]);
    onAddSupplier(newSup);
    setIsAddSupplierModalOpen(false);
    setExpandedSupplierId(newSup.id);
    showToast(`Toko mitra "${newSup.storeName}" berhasil ditambahkan!`);

    // Reset
    setNewStoreName('');
    setNewOwnerName('');
    setNewPhone('');
    setNewAddress('');
    setNewMapsUrl('');
  };

  // Handle submit Tambah Stok
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !selectedSupplierId) {
      showToast('Harap pilih toko dan masukkan nama barang!');
      return;
    }

    const parentSupplier = suppliers.find((s) => s.id === selectedSupplierId);
    const supplierName = parentSupplier?.storeName || 'Mitra Penitip';

    const newProd: ConsignmentProduct = {
      id: `cprod-${Date.now()}`,
      supplierId: selectedSupplierId,
      supplierName,
      productName: newProductName.trim(),
      sku: newSku.trim().toUpperCase() || `CS-${Date.now().toString().slice(-4)}`,
      consumerPrice: Number(newConsumerPrice) || 0,
      supplierNetPrice: Number(newSupplierNetPrice) || 0,
      commissionRatePercent: calculatedCommissionPercent,
      initialStock: Number(newInitialStock) || 1,
      currentStock: Number(newInitialStock) || 1,
      soldStock: 0,
      returnedStock: 0,
      dueDate: newDueDate || undefined,
      status: 'Tersedia'
    };

    setProducts([newProd, ...products]);
    onAddProduct(newProd);

    // Update activeItemCount on supplier
    setSuppliers(suppliers.map(s => s.id === selectedSupplierId 
      ? { ...s, activeItemCount: s.activeItemCount + 1, totalRestockedUnits: s.totalRestockedUnits + newProd.initialStock } 
      : s
    ));

    setIsAddProductModalOpen(false);
    showToast(`Stok titipan "${newProd.productName}" berhasil ditambahkan!`);

    // Reset
    setNewProductName('');
    setNewSku('');
    setNewInitialStock(20);
    setNewDueDate('');
  };

  // Filtered Suppliers & Products
  const filteredSuppliers = suppliers.filter(s => 
    s.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Consolidated Financials for Laporan Konsinyasi
  const totalConsignmentGross = products.reduce((acc, p) => acc + (p.soldStock * p.consumerPrice), 0);
  const totalSupplierPayable = products.reduce((acc, p) => acc + (p.soldStock * p.supplierNetPrice), 0);
  const totalStoreCommission = totalConsignmentGross - totalSupplierPayable;
  const totalUnitsSold = products.reduce((acc, p) => acc + p.soldStock, 0);
  const totalUnitsReturned = products.reduce((acc, p) => acc + p.returnedStock, 0);
  const totalActiveStock = products.reduce((acc, p) => acc + p.currentStock, 0);

  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col font-sans select-none antialiased">
      {/* ========================================================
          1. HEADER ATAS COLLABQU DENGAN MASTER LOGO UQ UNGU
          ======================================================== */}
      <div className="bg-[#7c3aed] text-white px-4 py-2.5 shadow-xs sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              aria-label="Kembali"
              className="w-8 h-8 rounded-full bg-white/15 active:bg-white/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4.5 h-4.5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <DynamicLogoUQ businessType="collabqu" size="xs" />
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white leading-tight flex items-center gap-1.5">
                  Collab Qu
                  <span className="text-[9.5px] font-black bg-white/20 text-purple-100 px-1.5 py-0.2 rounded-md">
                    Titip Jual
                  </span>
                </h1>
                <p className="text-[10px] text-purple-200 leading-none">
                  Konsinyasi & Bagi Hasil Mandiri
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context Button */}
          {activeTab === 'toko' && (
            <button
              onClick={() => setIsAddSupplierModalOpen(true)}
              className="bg-white text-[#7c3aed] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Toko Baru</span>
            </button>
          )}

          {activeTab === 'stok' && (
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="bg-white text-[#7c3aed] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ Tambah Stok</span>
            </button>
          )}
        </div>

        {/* Minimal Underline Tab Navigation */}
        <div className="flex items-center gap-6 mt-3 border-b border-purple-400/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('toko')}
            className={`pb-2 transition-all cursor-pointer relative ${
              activeTab === 'toko' 
                ? 'text-white font-black' 
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <span>Data Toko (Penitip)</span>
            <span className="ml-1 text-[10px] opacity-80">({suppliers.length})</span>
            {activeTab === 'toko' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('stok')}
            className={`pb-2 transition-all cursor-pointer relative ${
              activeTab === 'stok' 
                ? 'text-white font-black' 
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <span>Stok Konsinyasi</span>
            <span className="ml-1 text-[10px] opacity-80">({products.length})</span>
            {activeTab === 'stok' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('laporan')}
            className={`pb-2 transition-all cursor-pointer relative ${
              activeTab === 'laporan' 
                ? 'text-white font-black' 
                : 'text-purple-200 hover:text-white'
            }`}
          >
            <span>Laporan Bagi Hasil</span>
            {activeTab === 'laporan' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-purple-900 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in fade-in sticky top-12 z-20 shadow-xs">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-purple-300 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Input Bar (Ultra-Minimalist) */}
      {activeTab !== 'laporan' && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'toko'
                ? 'Cari nama toko, pemilik, atau alamat...'
                : 'Cari barang, penitip, atau barcode...'
            }
            className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* ========================================================
          2. TAB 1: DATA TOKO (PENITIP / PEMASOK) - UNDERLINE STYLE
          ======================================================== */}
      {activeTab === 'toko' && (
        <div className="flex-1 overflow-y-auto">
          {filteredSuppliers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Store className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Belum ada data toko penitip yang cocok.</p>
              <button
                onClick={() => setIsAddSupplierModalOpen(true)}
                className="mt-3 text-[#7c3aed] font-bold underline"
              >
                + Tambah Toko Baru Sekarang
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredSuppliers.map((supp) => {
                const isExpanded = expandedSupplierId === supp.id;
                const suppProducts = products.filter(p => p.supplierId === supp.id);
                const soldRevenue = suppProducts.reduce((acc, p) => acc + (p.soldStock * p.consumerPrice), 0);
                const soldUnits = suppProducts.reduce((acc, p) => acc + p.soldStock, 0);
                const returnUnits = suppProducts.reduce((acc, p) => acc + p.returnedStock, 0);
                const restockUnits = suppProducts.reduce((acc, p) => acc + p.initialStock, 0);

                return (
                  <div key={supp.id} className="transition-colors">
                    {/* Baris Teks Bersih dengan Garis Pemisah Tipis (Underline Style) */}
                    <div
                      onClick={() => setExpandedSupplierId(isExpanded ? null : supp.id)}
                      className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:bg-slate-100 transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {supp.storeName}
                          </span>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100 shrink-0">
                            {suppProducts.length} Produk
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {supp.ownerName} • {supp.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">
                            Rp {soldRevenue.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {soldUnits} unit laku
                          </span>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#7c3aed]' : ''
                          }`} 
                        />
                      </div>
                    </div>

                    {/* Card Minimalis Detail Toko (Saat Diklik / Expanded View) */}
                    {isExpanded && (
                      <div className="px-4 py-3 bg-purple-50/30 border-b border-purple-100 space-y-3 animate-in fade-in">
                        {/* Info Utama: Alamat & Kontak */}
                        <div className="text-xs space-y-1.5 text-slate-700">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                            <span className="flex-1 text-[11px] leading-relaxed">
                              {supp.address}
                            </span>
                            {supp.mapsUrl && (
                              <a
                                href={supp.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5 shrink-0 bg-white px-1.5 py-0.5 rounded border border-purple-200 shadow-2xs"
                              >
                                <span>Pin Maps</span>
                                <ArrowUpRight className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-500">
                              Bergabung sejak: {supp.joinedDate}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://wa.me/${supp.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Phone className="w-2.5 h-2.5" />
                                <span>Chat WA</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Badge (Ringkasan Data: Terjual, Retur, Restok) */}
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="bg-white p-2 rounded-xl border border-purple-100 shadow-2xs">
                            <span className="text-[9.5px] font-bold uppercase text-slate-400 block tracking-tight">
                              Terjual
                            </span>
                            <span className="text-xs font-black text-emerald-700 block mt-0.5">
                              {soldUnits} Unit
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium block">
                              Rp {soldRevenue.toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-purple-100 shadow-2xs">
                            <span className="text-[9.5px] font-bold uppercase text-slate-400 block tracking-tight">
                              Retur
                            </span>
                            <span className="text-xs font-black text-rose-600 block mt-0.5">
                              {returnUnits} Unit
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium block">
                              Kembali ke Toko
                            </span>
                          </div>

                          <div className="bg-white p-2 rounded-xl border border-purple-100 shadow-2xs">
                            <span className="text-[9.5px] font-bold uppercase text-slate-400 block tracking-tight">
                              Restok
                            </span>
                            <span className="text-xs font-black text-purple-700 block mt-0.5">
                              +{restockUnits} Unit
                            </span>
                            <span className="text-[9px] text-slate-500 font-medium block">
                              Total Diterima
                            </span>
                          </div>
                        </div>

                        {/* List Produk Milik Toko Ini */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Barang Titipan Toko Ini:</span>
                            <button
                              onClick={() => {
                                setSelectedSupplierId(supp.id);
                                setIsAddProductModalOpen(true);
                              }}
                              className="text-purple-700 hover:underline flex items-center gap-0.5"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Barang</span>
                            </button>
                          </div>

                          {suppProducts.length === 0 ? (
                            <p className="text-[10px] text-slate-400 italic py-1">
                              Belum ada produk titipan yang didaftarkan.
                            </p>
                          ) : (
                            <div className="space-y-1">
                              {suppProducts.map(p => (
                                <div key={p.id} className="bg-white p-2 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                                  <div className="min-w-0 pr-2">
                                    <span className="font-bold text-slate-800 block truncate leading-tight">
                                      {p.productName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block font-mono">
                                      {p.sku} • Jual Rp {p.consumerPrice.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-black text-slate-900 block">
                                      Sisa {p.currentStock}
                                    </span>
                                    <span className="text-[9px] text-emerald-600 font-bold block">
                                      Laku {p.soldStock}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          3. TAB 2: STOK KONSINYASI - LIST STOK MINIMALIS
          ======================================================== */}
      {activeTab === 'stok' && (
        <div className="flex-1 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Belum ada produk titip jual yang cocok.</p>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="mt-3 text-[#7c3aed] font-bold underline"
              >
                + Tambah Stok Konsinyasi Sekarang
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                // Status badge styling
                const getStatusBadge = () => {
                  if (prod.status === 'Stok Menipis') {
                    return (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Stok Menipis
                      </span>
                    );
                  }
                  if (prod.status === 'Batas Retur') {
                    return (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Batas Retur
                      </span>
                    );
                  }
                  return (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Tersedia
                    </span>
                  );
                };

                return (
                  <div
                    key={prod.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    {/* Sisi Kiri: Nama Barang + Sub-text Nama Toko/Penitip (Warna Abu-abu) */}
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-900 leading-snug">
                          {prod.productName}
                        </span>
                        {getStatusBadge()}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {prod.supplierName} • <span className="font-mono text-slate-400">{prod.sku}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span>Jual: <strong className="text-slate-700">Rp {prod.consumerPrice.toLocaleString('id-ID')}</strong></span>
                        <span>•</span>
                        <span>Netto: <strong className="text-slate-700">Rp {prod.supplierNetPrice.toLocaleString('id-ID')}</strong></span>
                        <span>•</span>
                        <span className="text-purple-700 font-bold">Komisi {prod.commissionRatePercent}%</span>
                      </div>
                    </div>

                    {/* Sisi Kanan: Sisa Stok / Qty Terjual */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-slate-900">
                        Sisa {prod.currentStock} Unit
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        Terjual: {prod.soldStock}
                      </div>
                      {prod.dueDate && (
                        <div className="text-[9px] text-slate-400 mt-0.5 flex items-center justify-end gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>Jatuh Tempo: {prod.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          4. TAB 3: LAPORAN KONSINYASI & DANA BAGI HASIL
          ======================================================== */}
      {activeTab === 'laporan' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Header Card Ringkasan Terpisah dari Omset Sendiri */}
          <div className="bg-purple-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                Rekap Dana Konsinyasi (Titip Jual)
              </span>
              <span className="text-[10px] bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                Terpisah dari Omset Sendiri
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-purple-300 block">Total Omset Kotor Konsinyasi</span>
                <span className="text-lg font-black text-white">
                  Rp {totalConsignmentGross.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-purple-300 block mt-0.5">
                  Dari {totalUnitsSold} unit barang laku
                </span>
              </div>

              <div>
                <span className="text-[10px] text-purple-300 block">Komisi Bersih Usaha Qu</span>
                <span className="text-lg font-black text-emerald-300">
                  Rp {totalStoreCommission.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-emerald-200/80 block mt-0.5">
                  Profit tanpa modal beli
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-800/80 flex items-center justify-between text-xs">
              <span className="text-purple-200 font-medium">
                Hak Bersih Penitip (Wajib Disetor):
              </span>
              <span className="font-extrabold text-amber-300 text-sm">
                Rp {totalSupplierPayable.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Rincian Bagi Hasil per Toko Penitip */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800">
              Rincian Tagihan Penyetoran per Toko:
            </h3>

            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              {suppliers.map(supp => {
                const suppProducts = products.filter(p => p.supplierId === supp.id);
                const suppGross = suppProducts.reduce((acc, p) => acc + (p.soldStock * p.consumerPrice), 0);
                const suppNetPayable = suppProducts.reduce((acc, p) => acc + (p.soldStock * p.supplierNetPrice), 0);
                const suppStoreFee = suppGross - suppNetPayable;
                const suppSoldQty = suppProducts.reduce((acc, p) => acc + p.soldStock, 0);

                return (
                  <div key={supp.id} className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{supp.storeName}</h4>
                        <p className="text-[10px] text-slate-500">PIC: {supp.ownerName} ({supp.phone})</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {suppSoldQty} Unit Laku
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2 rounded-xl">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">Omset Laku</span>
                        <span className="font-bold text-slate-700">Rp {suppGross.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">Komisi Toko</span>
                        <span className="font-bold text-purple-700">Rp {suppStoreFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">Wajib Disetor</span>
                        <span className="font-black text-emerald-700">Rp {suppNetPayable.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          const waText = `Halo ${supp.ownerName} (${supp.storeName}), rekap titip jual konsinyasi di Usaha Qu periode ini:\n- Total laku: ${suppSoldQty} unit\n- Omset kotor: Rp ${suppGross.toLocaleString('id-ID')}\n- Komisi toko: Rp ${suppStoreFee.toLocaleString('id-ID')}\n- Dana bersih yang kami transfer: Rp ${suppNetPayable.toLocaleString('id-ID')}\nTerima kasih atas kerjasamanya!`;
                          window.open(`https://wa.me/${supp.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`, '_blank');
                        }}
                        className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>Kirim Rekap WA</span>
                      </button>

                      <button
                        onClick={() => showToast(`Slip setoran konsinyasi ${supp.storeName} dicetak.`)}
                        className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak Slip</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL: TAMBAH TOKO BARU (PENITIP)
          ======================================================== */}
      {isAddSupplierModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-slate-200">
            <div className="px-4 py-3 bg-[#7c3aed] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                <h3 className="text-xs font-bold">Tambah Toko Mitra Penitip</h3>
              </div>
              <button onClick={() => setIsAddSupplierModalOpen(false)} className="text-purple-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Toko / Merk *</label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Contoh: Toko Kue Berkah Ibu"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Pemilik / Kontak PIC *</label>
                <input
                  type="text"
                  required
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  placeholder="Contoh: Ibu Aminah"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">No. WhatsApp</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pasirkoja No. 45 Bandung"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Link Google Maps (Opsional)</label>
                <input
                  type="url"
                  value={newMapsUrl}
                  onChange={(e) => setNewMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#7c3aed]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#7c3aed] text-white font-bold hover:bg-purple-700 shadow-xs"
                >
                  Simpan Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL: TAMBAH STOK KONSINYASI (FLOATING FORM CARD)
          ======================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl border border-slate-200">
            <div className="px-4 py-3 bg-[#7c3aed] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <h3 className="text-xs font-bold">+ Tambah Stok Konsinyasi</h3>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-purple-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 space-y-3 text-xs">
              {/* 1. Dropdown Pilih Toko / Penitip */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">1. Pilih Toko / Penitip *</label>
                <select
                  required
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-[#7c3aed]"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.storeName} ({s.ownerName})</option>
                  ))}
                </select>
              </div>

              {/* 2. Nama Produk & Barcode / SKU */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">2. Nama Barang *</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Contoh: Kripik Singkong"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Barcode / SKU</label>
                  <input
                    type="text"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    placeholder="CS-001"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>

              {/* 3 & 4. Harga Jual ke Konsumen & Harga Netto Pemasok / Komisi */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">3. Harga Jual Konsumen</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={newConsumerPrice}
                    onChange={(e) => setNewConsumerPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">4. Netto Penitip</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={newSupplierNetPrice}
                    onChange={(e) => setNewSupplierNetPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>

              {/* Kalkulasi Komisi Real-time */}
              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center justify-between text-[11px]">
                <span className="text-purple-900 font-semibold">Komisi Toko Usaha Qu:</span>
                <span className="font-black text-purple-700">
                  Rp {storeCommissionNominal.toLocaleString('id-ID')} ({calculatedCommissionPercent}%)
                </span>
              </div>

              {/* 5. Qty Stok Masuk & 6. Batas Tanggal Retur */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">5. Qty Stok Masuk</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newInitialStock}
                    onChange={(e) => setNewInitialStock(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">6. Batas Retur (Opsional)</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#7c3aed] text-white font-bold hover:bg-purple-700 shadow-xs"
                >
                  Simpan Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
