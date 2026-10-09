import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UtensilsCrossed, 
  Users, 
  Clock, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  Receipt,
  X,
  Filter,
  DollarSign
} from 'lucide-react';
import { DiningTable, FoodMenuItem } from '../../types';
import { INITIAL_FOOD_MENUS } from '../../data/mockData';

interface DenahLayoutMejaViewProps {
  onBack: () => void;
  tables: DiningTable[];
  onSelectTable?: (table: DiningTable) => void;
  onOpenNewOrder?: () => void;
  onNavigateToPOS?: (table?: DiningTable) => void;
  onUpdateTableStatus?: (tableId: string, status: DiningTable['status'], orderData?: Partial<DiningTable>) => void;
}

export const DenahLayoutMejaView: React.FC<DenahLayoutMejaViewProps> = ({
  onBack,
  tables,
  onSelectTable,
  onNavigateToPOS,
  onUpdateTableStatus
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'kosong' | 'terisi' | 'billing'>('Semua');
  const [activeTableDetail, setActiveTableDetail] = useState<DiningTable | null>(null);

  // New table order modal state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [modalTableNumber, setModalTableNumber] = useState('Meja 01');
  const [modalCustomerName, setModalCustomerName] = useState('');
  const [modalGuestCount, setModalGuestCount] = useState(2);
  const [modalSelectedItems, setModalSelectedItems] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);

  // Zone list
  const ZONES = ['Semua', 'Indoor (AC)', 'Outdoor', 'VIP', 'Lantai 2'];

  // Metrics
  const emptyCount = tables.filter((t) => t.status === 'kosong').length;
  const occupiedCount = tables.filter((t) => t.status === 'terisi').length;
  const billingCount = tables.filter((t) => t.status === 'billing').length;

  const filteredTables = tables.filter((t) => {
    if (selectedZone !== 'Semua' && t.zone !== selectedZone) return false;
    if (statusFilter !== 'Semua' && t.status !== statusFilter) return false;
    return true;
  });

  const handleOpenDetail = (tbl: DiningTable) => {
    setActiveTableDetail(tbl);
    if (onSelectTable) onSelectTable(tbl);
  };

  const handleCloseDetail = () => {
    setActiveTableDetail(null);
  };

  const handleBillRequest = (tbl: DiningTable) => {
    if (onUpdateTableStatus) {
      onUpdateTableStatus(tbl.id, 'billing');
    }
    setActiveTableDetail(null);
  };

  const handleCheckoutToPOS = (tbl: DiningTable) => {
    if (onNavigateToPOS) {
      onNavigateToPOS(tbl);
    }
  };

  const handleFreeTable = (tbl: DiningTable) => {
    if (onUpdateTableStatus) {
      onUpdateTableStatus(tbl.id, 'kosong', {
        currentGuestName: undefined,
        guestCount: undefined,
        orderTotal: undefined,
        orderTime: undefined,
        items: undefined
      });
    }
    setActiveTableDetail(null);
  };

  const handleAddItemToModalOrder = (item: FoodMenuItem) => {
    const existing = modalSelectedItems.find((i) => i.id === item.id);
    if (existing) {
      setModalSelectedItems(
        modalSelectedItems.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setModalSelectedItems([...modalSelectedItems, { id: item.id, name: item.name, price: item.price, qty: 1 }]);
    }
  };

  const handleRemoveItemFromModalOrder = (id: string) => {
    const existing = modalSelectedItems.find((i) => i.id === id);
    if (existing && existing.qty > 1) {
      setModalSelectedItems(
        modalSelectedItems.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
      );
    } else {
      setModalSelectedItems(modalSelectedItems.filter((i) => i.id !== id));
    }
  };

  const modalTotalCost = modalSelectedItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmitNewTableOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetTable = tables.find((t) => t.number === modalTableNumber);
    if (targetTable && onUpdateTableStatus) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
      onUpdateTableStatus(targetTable.id, 'terisi', {
        currentGuestName: modalCustomerName.trim() || 'Tamu Dine-in',
        guestCount: modalGuestCount,
        orderTime: timeStr,
        orderTotal: modalTotalCost,
        items: modalSelectedItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price }))
      });
    }

    // Reset Form
    setModalCustomerName('');
    setModalGuestCount(2);
    setModalSelectedItems([]);
    setIsNewOrderModalOpen(false);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* 1. COMPACT HEADER */}
      <div className="bg-[#e11d48] text-white px-4 py-2.5 shadow-sm sticky top-0 z-30">
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
                <UtensilsCrossed className="w-4 h-4 text-rose-200" />
                <span>Denah / Layout Meja</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-[#e11d48] text-xs font-black flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Buka Meja</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto w-full pb-24">
        
        {/* Floating Quick Summary Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => setStatusFilter(statusFilter === 'kosong' ? 'Semua' : 'kosong')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'kosong'
                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200/80 shadow-2xs hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-emerald-700">Meja Kosong</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xl font-black text-emerald-900">{emptyCount} <span className="text-xs font-semibold text-emerald-700">Meja</span></div>
            <span className="text-[9.5px] text-slate-500 block mt-0.5">Siap menerima tamu</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'terisi' ? 'Semua' : 'terisi')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'terisi'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200/80 shadow-2xs hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-amber-700">Terisi Makan</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="text-xl font-black text-amber-900">{occupiedCount} <span className="text-xs font-semibold text-amber-700">Meja</span></div>
            <span className="text-[9.5px] text-slate-500 block mt-0.5">Sedang bersantap</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'billing' ? 'Semua' : 'billing')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              statusFilter === 'billing'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200/80 shadow-2xs hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-blue-700">Minta Bill</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            </div>
            <div className="text-xl font-black text-blue-900">{billingCount} <span className="text-xs font-semibold text-blue-700">Meja</span></div>
            <span className="text-[9.5px] text-slate-500 block mt-0.5">Siap bayar di kasir</span>
          </button>
        </div>

        {/* Zone Filter Pills */}
        <div className="bg-white rounded-2xl p-2.5 shadow-2xs border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Filter className="w-3.5 h-3.5 text-rose-600" />
              Pilih Ruangan / Area Resto:
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {filteredTables.length} Meja Ditampilkan
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {ZONES.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-[#e11d48] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Centralized Table Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredTables.map((tbl) => {
            const isKosong = tbl.status === 'kosong';
            const isTerisi = tbl.status === 'terisi';

            return (
              <div
                key={tbl.id}
                onClick={() => handleOpenDetail(tbl)}
                className={`rounded-2xl p-3.5 border transition-all cursor-pointer relative shadow-2xs hover:shadow-md active:scale-98 flex flex-col justify-between min-h-[145px] ${
                  isKosong
                    ? 'bg-white border-slate-200/90 hover:border-emerald-400'
                    : isTerisi
                    ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                    : 'bg-blue-50/70 border-blue-300 hover:border-blue-400'
                }`}
              >
                <div>
                  {/* Top Bar: Table Number & Status Pill */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      {tbl.number}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isKosong
                          ? 'bg-emerald-100 text-emerald-800'
                          : isTerisi
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-blue-200 text-blue-900'
                      }`}
                    >
                      {isKosong ? 'Kosong' : isTerisi ? 'Terisi' : 'Billing'}
                    </span>
                  </div>

                  {/* Room & Capacity */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{tbl.capacity} Kursi</span>
                    <span>•</span>
                    <span className="truncate">{tbl.zone}</span>
                  </div>

                  {/* Occupied / Billing Info */}
                  {tbl.currentGuestName ? (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-800 truncate">
                        {tbl.currentGuestName}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {tbl.orderTime || 'Baru masuk'}
                        </span>
                        <span className="font-extrabold text-[#e11d48]">
                          Rp {(tbl.orderTotal || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 pt-2 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Siap Pakai</span>
                    </div>
                  )}
                </div>

                {/* Bottom Quick Action hint */}
                <div className="pt-2 text-right">
                  <span className="text-[10px] font-extrabold text-slate-500 hover:text-slate-800 flex items-center justify-end gap-0.5">
                    {isKosong ? 'Buka Meja' : 'Detail'} <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================================
            MODAL 1: DETAIL MEJA & ACTION SHEET
        ===================================================================== */}
        {activeTableDetail && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-sm">
                    {activeTableDetail.number.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {activeTableDetail.name} ({activeTableDetail.number})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeTableDetail.zone} • Kapasitas {activeTableDetail.capacity} Tamu
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetail}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status and Order Details */}
              {activeTableDetail.currentGuestName ? (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Nama Tamu:</span>
                      <strong className="text-slate-900 font-extrabold">{activeTableDetail.currentGuestName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Jumlah Tamu:</span>
                      <span className="font-bold text-slate-700">{activeTableDetail.guestCount || 2} Orang</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Waktu Masuk:</span>
                      <span className="font-bold text-slate-700">{activeTableDetail.orderTime || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <span className="text-slate-700 font-bold">Total Tagihan:</span>
                      <span className="font-black text-base text-[#e11d48]">
                        Rp {(activeTableDetail.orderTotal || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Order items list */}
                  {activeTableDetail.items && activeTableDetail.items.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Rincian Pesanan Menu ({activeTableDetail.items.length} Item)
                      </h4>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {activeTableDetail.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50">
                            <div>
                              <span className="font-extrabold text-slate-800">{it.qty}x</span>{' '}
                              <span className="font-medium text-slate-700">{it.name}</span>
                            </div>
                            <span className="font-bold text-slate-900">
                              Rp {(it.price * it.qty).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    {activeTableDetail.status === 'terisi' && (
                      <button
                        onClick={() => handleBillRequest(activeTableDetail)}
                        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-extrabold py-3 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Minta Bill Kasir</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCheckoutToPOS(activeTableDetail)}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-extrabold py-3 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Bayar di Kasir</span>
                    </button>

                    <button
                      onClick={() => handleFreeTable(activeTableDetail)}
                      className="col-span-2 text-center text-xs text-rose-600 hover:text-rose-800 font-bold py-1.5 cursor-pointer"
                    >
                      Kosongkan Meja Tanpa Bayar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-extrabold text-emerald-900">Meja Siap Digunakan</h4>
                    <p className="text-xs text-emerald-700">Meja ini sedang kosong dan siap menerima tamu makan.</p>
                  </div>

                  <button
                    onClick={() => {
                      setModalTableNumber(activeTableDetail.number);
                      setIsNewOrderModalOpen(true);
                      setActiveTableDetail(null);
                    }}
                    className="w-full bg-[#e11d48] hover:bg-rose-700 active:scale-95 text-white text-xs font-extrabold py-3.5 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buka Meja & Buat Pesanan Baru</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            MODAL 2: FORM BUKA MEJA & INPUT PESANAN BARU
        ===================================================================== */}
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Buka Meja Baru & Catat Pesanan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pilih nomor meja, tamu, dan pilih menu makanan/minuman
                  </p>
                </div>
                <button
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitNewTableOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Pilih Meja *
                    </label>
                    <select
                      value={modalTableNumber}
                      onChange={(e) => setModalTableNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-600"
                    >
                      {tables.map((t) => (
                        <option key={t.id} value={t.number}>
                          {t.number} - {t.zone} ({t.capacity} Kursi)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Jumlah Tamu (Pax)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={modalGuestCount}
                      onChange={(e) => setModalGuestCount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nama Tamu / Pemesan *
                  </label>
                  <input
                    type="text"
                    required
                    value={modalCustomerName}
                    onChange={(e) => setModalCustomerName(e.target.value)}
                    placeholder="Contoh: Pak Hendra / Ibu Maya"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-600"
                  />
                </div>

                {/* Quick Add Menu Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Pilih Menu Makanan / Minuman:
                    </label>
                    <span className="text-[10px] text-rose-600 font-bold">
                      {modalSelectedItems.length} Menu Dipilih
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 pb-1">
                    {INITIAL_FOOD_MENUS.map((menu) => (
                      <button
                        key={menu.id}
                        type="button"
                        onClick={() => handleAddItemToModalOrder(menu)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-rose-400 bg-white hover:bg-rose-50/50 text-left transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div className="font-extrabold text-xs text-slate-800 line-clamp-1">{menu.name}</div>
                        <div className="text-[10px] font-black text-rose-600 mt-1">
                          Rp {menu.price.toLocaleString('id-ID')}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Menu Items Summary */}
                {modalSelectedItems.length > 0 && (
                  <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 space-y-1.5">
                    <div className="text-xs font-bold text-slate-700">Daftar Menu yang Dipesan:</div>
                    <div className="space-y-1">
                      {modalSelectedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-600">x{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItemFromModalOrder(item.id)}
                              className="text-rose-600 hover:text-rose-800 text-[10px] font-bold cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-rose-200 flex items-center justify-between text-xs font-extrabold text-slate-900">
                      <span>Total Estimasi:</span>
                      <span className="text-rose-700 text-sm">Rp {modalTotalCost.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#e11d48] hover:bg-rose-700 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-xs text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Buka Meja ({modalTableNumber})</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
