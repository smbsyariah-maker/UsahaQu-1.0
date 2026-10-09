import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Users, 
  Clock, 
  Plus, 
  ChevronRight, 
  ShoppingBag, 
  Coffee, 
  CheckCircle2, 
  Receipt,
  Sparkles,
  Flame,
  X
} from 'lucide-react';
import { DiningTable, DiningTableStatus } from '../../types';

interface RestoTablesWidgetProps {
  tables: DiningTable[];
  onSelectTable: (table: DiningTable) => void;
  onOpenNewOrder: () => void;
  onNavigateToPOS?: () => void;
}

export const RestoTablesWidget: React.FC<RestoTablesWidgetProps> = ({
  tables,
  onSelectTable,
  onOpenNewOrder,
  onNavigateToPOS
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('Semua');
  const [activeOrderType, setActiveOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [modalTable, setModalTable] = useState<DiningTable | null>(null);

  const zones = ['Semua', 'Indoor (AC)', 'Outdoor', 'VIP', 'Lantai 2'];

  const filteredTables = selectedZone === 'Semua' 
    ? tables 
    : tables.filter(t => t.zone === selectedZone);

  // Status counters
  const emptyCount = tables.filter(t => t.status === 'kosong').length;
  const occupiedCount = tables.filter(t => t.status === 'terisi').length;
  const billingCount = tables.filter(t => t.status === 'billing').length;

  const getStatusBadge = (status: DiningTableStatus) => {
    switch (status) {
      case 'kosong':
        return { label: 'Kosong', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'terisi':
        return { label: 'Terisi', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'billing':
        return { label: 'Billing', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'reservasi':
        return { label: 'Reservasi', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: status, bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Manajemen Meja & Ruangan
            </h3>
            <p className="text-[11px] text-slate-500">Live order & kapasitas tamu resto</p>
          </div>
        </div>

        {/* Dine-In vs Takeaway Toggle */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveOrderType('dine-in')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
              activeOrderType === 'dine-in' 
                ? 'bg-white text-rose-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Dine In ({occupiedCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveOrderType('takeaway')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeOrderType === 'takeaway' 
                ? 'bg-white text-rose-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Bungkus</span>
          </button>
        </div>
      </div>

      {/* Zone Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        {zones.map((zone) => (
          <button
            key={zone}
            type="button"
            onClick={() => setSelectedZone(zone)}
            className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedZone === zone
                ? 'bg-[#008952] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Grid Meja */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {filteredTables.map((tbl) => {
          const badge = getStatusBadge(tbl.status);
          const isBusy = tbl.status === 'terisi' || tbl.status === 'billing';

          return (
            <div
              key={tbl.id}
              onClick={() => {
                setModalTable(tbl);
                onSelectTable(tbl);
              }}
              className={`bg-white rounded-2xl p-3 border shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.98] ${
                tbl.status === 'terisi'
                  ? 'border-amber-300 ring-2 ring-amber-400/10'
                  : tbl.status === 'billing'
                  ? 'border-blue-300 ring-2 ring-blue-400/10'
                  : tbl.status === 'reservasi'
                  ? 'border-purple-300'
                  : 'border-slate-100 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#008952] transition-colors">
                  {tbl.number}
                </span>
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Kapasitas {tbl.capacity} Org</span>
              </div>

              {isBusy && tbl.orderTotal ? (
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 space-y-1">
                  <div className="text-[11px] font-extrabold text-slate-800 truncate">
                    Rp {tbl.orderTotal.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{tbl.orderTime || 'Aktif'}</span>
                    <span>• {tbl.currentGuestName?.split(' ')[0]}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/50 rounded-xl py-2 px-1 text-center border border-emerald-100/50">
                  <span className="text-[10px] font-bold text-[#008952]">
                    Siap Digunakan
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Meja Modal / Sheet */}
      {modalTable && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-rose-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                <div>
                  <h4 className="font-bold text-base">{modalTable.name}</h4>
                  <p className="text-[11px] text-rose-100 font-medium">Zona: {modalTable.zone} • Kapasitas {modalTable.capacity} Orang</p>
                </div>
              </div>
              <button
                onClick={() => setModalTable(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Status Meja</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusBadge(modalTable.status).bg}`}>
                  {getStatusBadge(modalTable.status).label.toUpperCase()}
                </span>
              </div>

              {modalTable.items && modalTable.items.length > 0 ? (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Daftar Pesanan Tamu ({modalTable.currentGuestName})
                  </h5>
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    {modalTable.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                        <div>
                          <span className="font-bold text-slate-800">{item.qty}x</span>{' '}
                          <span className="text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-extrabold text-slate-900">
                          Rp {(item.qty * item.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 text-xs font-black text-slate-900 border-t border-slate-200">
                      <span>Total Tagihan Meja</span>
                      <span className="text-rose-600 text-sm">
                        Rp {modalTable.orderTotal?.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#008952] mx-auto" />
                  <p className="text-xs font-bold text-emerald-950">Meja ini sedang kosong</p>
                  <p className="text-[11px] text-emerald-800">Siap menerima tamu baru untuk Dine-in atau reservasi.</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setModalTable(null);
                  onOpenNewOrder();
                }}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
              >
                + Tambah Menu
              </button>
              {modalTable.status !== 'kosong' && onNavigateToPOS && (
                <button
                  onClick={() => {
                    setModalTable(null);
                    onNavigateToPOS();
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Cetak Bill / Kasir</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
