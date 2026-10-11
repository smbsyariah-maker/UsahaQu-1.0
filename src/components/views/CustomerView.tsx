import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  Phone, 
  Car, 
  Calendar, 
  Plus, 
  Check, 
  MapPin, 
  Wrench, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Eye,
  Filter,
  UtensilsCrossed,
  ScanBarcode,
  Sparkles,
  Tag
} from 'lucide-react';
import { CustomerVehicle, ServiceQueue, Transaction, BusinessType } from '../../types';

interface CustomerViewProps {
  initialTab?: string;
  customers: CustomerVehicle[];
  queues: ServiceQueue[];
  transactions: Transaction[];
  onBack: () => void;
  onAddNewCustomer: (cust: CustomerVehicle) => void;
  onSelectCustomerToService?: (cust: CustomerVehicle) => void;
  businessType?: BusinessType;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  initialTab = 'daftar-pelanggan',
  customers,
  queues,
  transactions,
  onBack,
  onAddNewCustomer,
  onSelectCustomerToService,
  businessType = 'bengkel'
}) => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab === 'database-pelanggan' || initialTab === 'database') return 'daftar-pelanggan';
    if (initialTab === 'reminder-servis' || initialTab === 'reminder') return 'kendaraan-pelanggan';
    if (initialTab === 'member-poin' || initialTab === 'loyalty') return 'riwayat-servis-pelanggan';
    return initialTab || 'daftar-pelanggan';
  });

  // Scoped Data Filter: 'aktif' | 'semua' | 'bengkel' | 'resto' | 'ritel'
  const [scopeFilter, setScopeFilter] = useState<'aktif' | 'semua' | 'bengkel' | 'resto' | 'ritel'>('aktif');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerIdForDetail, setSelectedCustomerIdForDetail] = useState<string>(
    customers[0]?.id || ''
  );
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for adding new customer with Scoped Data
  const [newCustScope, setNewCustScope] = useState<'bengkel' | 'resto' | 'ritel'>(
    businessType === 'collabqu' ? 'ritel' : businessType
  );
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  // Bengkel fields
  const [newCustPlate, setNewCustPlate] = useState('');
  const [newCustBrand, setNewCustBrand] = useState('Honda');
  const [newCustType, setNewCustType] = useState('');
  const [newCustYear, setNewCustYear] = useState('2023');
  // Resto fields
  const [newCustTable, setNewCustTable] = useState('Meja 01');
  const [newCustDietary, setNewCustDietary] = useState('');
  // Ritel fields
  const [newCustMemberCard, setNewCustMemberCard] = useState('');
  const [newCustMemberTier, setNewCustMemberTier] = useState<'Silver' | 'Gold' | 'Platinum'>('Silver');
  const [newCustNotes, setNewCustNotes] = useState('');


  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'database-pelanggan' || initialTab === 'database') setActiveTab('daftar-pelanggan');
      else if (initialTab === 'reminder-servis' || initialTab === 'reminder') setActiveTab('kendaraan-pelanggan');
      else if (initialTab === 'member-poin' || initialTab === 'loyalty') setActiveTab('riwayat-servis-pelanggan');
      else setActiveTab(initialTab);
    }
  }, [initialTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'daftar-pelanggan':
        return {
          title: 'Daftar Pelanggan (Master)',
          subtitle: 'Nama Lengkap, Nomor WhatsApp & Alamat Domisili'
        };
      case 'kendaraan-pelanggan':
        return {
          title: 'Kendaraan Pelanggan',
          subtitle: 'Katalog Profil Kendaraan, Merk, Tipe & Plat Nomor'
        };
      case 'riwayat-servis-pelanggan':
        return {
          title: 'Riwayat Servis Pelanggan',
          subtitle: 'Card Rincian Perawatan & Log Riwayat Servis Berkala'
        };
      default:
        return {
          title: 'Pelanggan',
          subtitle: 'Manajemen Data Pemilik & Kendaraan'
        };
    }
  };

  const headerMeta = getHeaderMeta();

  // Filtered customers with Scoped Partition logic
  const filteredCustomers = customers.filter((c) => {
    // 1. Business Scope Filter
    const cType = c.customer_type || 'bengkel';
    if (scopeFilter === 'aktif' && cType !== businessType) {
      return false;
    }
    if (scopeFilter !== 'aktif' && scopeFilter !== 'semua' && cType !== scopeFilter) {
      return false;
    }

    // 2. Query Search Filter
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      (c.plateNumber && c.plateNumber.toLowerCase().includes(q)) ||
      (c.vehicleModel && c.vehicleModel.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.address && c.address.toLowerCase().includes(q)) ||
      (c.favoriteTable && c.favoriteTable.toLowerCase().includes(q)) ||
      (c.memberCardNumber && c.memberCardNumber.toLowerCase().includes(q))
    );
  });

  // Selected customer for Riwayat Servis
  const activeSelectedCust = 
    customers.find((c) => c.id === selectedCustomerIdForDetail) || 
    customers[0] || 
    null;

  // Find transaction history & queue records for this customer
  const customerTransactions = activeSelectedCust
    ? transactions.filter(
        (t) =>
          t.plateNumber.toLowerCase() === activeSelectedCust.plateNumber.toLowerCase() ||
          t.customerName.toLowerCase() === activeSelectedCust.name.toLowerCase()
      )
    : [];

  const customerQueues = activeSelectedCust
    ? queues.filter(
        (q) =>
          q.plateNumber.toLowerCase() === activeSelectedCust.plateNumber.toLowerCase() ||
          q.customerName.toLowerCase() === activeSelectedCust.name.toLowerCase()
      )
    : [];

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) {
      showToast('Harap isi nama pelanggan!');
      return;
    }

    if (newCustScope === 'bengkel' && !newCustPlate.trim()) {
      showToast('Harap isi plat nomor kendaraan untuk pelanggan bengkel!');
      return;
    }

    const newCust: CustomerVehicle = {
      id: `c-${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim() || '081234567890',
      address: newCustAddress.trim() || 'Kota Bandung, Jawa Barat',
      customer_type: newCustScope,
      // Bengkel specific
      plateNumber: newCustScope === 'bengkel' ? newCustPlate.trim().toUpperCase() : '-',
      vehicleBrand: newCustScope === 'bengkel' ? newCustBrand : undefined,
      vehicleType: newCustScope === 'bengkel' ? newCustType.trim() || 'Matic' : undefined,
      vehicleModel: newCustScope === 'bengkel'
        ? `${newCustBrand} ${newCustType.trim() || 'Motor'} (${newCustYear})`
        : newCustScope === 'resto'
        ? `Tamu ${newCustTable}`
        : `Member ${newCustMemberTier}`,
      year: newCustScope === 'bengkel' ? newCustYear || '2023' : '-',
      lastServiceDate: todayStr,
      // Resto specific
      favoriteTable: newCustScope === 'resto' ? newCustTable : undefined,
      dietaryNotes: newCustScope === 'resto' ? newCustDietary : undefined,
      // Ritel specific
      memberCardNumber: newCustScope === 'ritel' 
        ? (newCustMemberCard.trim() || `MBR-${Math.floor(10000 + Math.random() * 90000)}`) 
        : undefined,
      memberTier: newCustScope === 'ritel' ? newCustMemberTier : undefined,
      totalVisits: 0,
      loyaltyPoints: newCustScope === 'ritel' ? 50 : 10,
      notes: newCustNotes.trim() || `Registrasi pelanggan baru [${newCustScope.toUpperCase()}]`
    };

    onAddNewCustomer(newCust);
    setSelectedCustomerIdForDetail(newCust.id);
    setIsAddCustomerModalOpen(false);
    showToast(`Pelanggan baru ${newCust.name} (${newCustScope.toUpperCase()}) berhasil didaftarkan!`);

    // Reset Form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustPlate('');
    setNewCustType('');
    setNewCustDietary('');
    setNewCustMemberCard('');
    setNewCustNotes('');
  };


  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-screen">
      {/* =========================================================================
          1. COMPACT SUB-MENU HEADER
          - Shrunk compact header
          - Dynamically matches active sub-menu
          - Hiding unnecessary quick filter buttons
      ========================================================================= */}
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
            <button
              onClick={() => setIsAddCustomerModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white text-[#008952] text-[11px] font-extrabold flex items-center gap-1 shadow-xs active:scale-95 transition-transform cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Pelanggan</span>
            </button>
            <div className="hidden sm:flex px-2 py-1 rounded-lg bg-emerald-800/40 text-[10px] font-bold text-white items-center gap-1">
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

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-4xl mx-auto w-full pb-20">

        {/* Global Search Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, nomor WhatsApp, plat nomor, meja, atau kartu member..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008952] font-medium"
            />
          </div>
        </div>

        {/* Scoped Data Filter: Partisi & Isolasi Data Pelanggan */}
        <div className="bg-white rounded-2xl p-2.5 shadow-xs border border-slate-200/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] px-1 font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Filter className="w-3.5 h-3.5 text-[#008952]" />
              Filter Partisi Data Usaha:
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {filteredCustomers.length} Pelanggan
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
            <button
              type="button"
              onClick={() => setScopeFilter('aktif')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10.5px] transition-all cursor-pointer flex items-center gap-1 ${
                scopeFilter === 'aktif'
                  ? 'bg-[#008952] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Sesuai Mode ({businessType.toUpperCase()})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('semua')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10.5px] transition-all cursor-pointer ${
                scopeFilter === 'semua'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('bengkel')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10.5px] transition-all cursor-pointer flex items-center gap-1 ${
                scopeFilter === 'bengkel'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Wrench className="w-3 h-3" />
              <span>Bengkel ({customers.filter(c => (c.customer_type || 'bengkel') === 'bengkel').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('resto')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10.5px] transition-all cursor-pointer flex items-center gap-1 ${
                scopeFilter === 'resto'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <UtensilsCrossed className="w-3 h-3" />
              <span>Resto ({customers.filter(c => c.customer_type === 'resto').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setScopeFilter('ritel')}
              className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap text-[10.5px] transition-all cursor-pointer flex items-center gap-1 ${
                scopeFilter === 'ritel'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              <ScanBarcode className="w-3 h-3" />
              <span>Ritel ({customers.filter(c => c.customer_type === 'ritel').length})</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            SUB-MENU A: DAFTAR PELANGGAN (MASTER CUSTOMER)
            - Minimalist underlined list view displaying customer names, phone/WhatsApp, and addresses
        ===================================================================== */}
        {activeTab === 'daftar-pelanggan' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Master Database Pelanggan ({filteredCustomers.length} Terdaftar)
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Partisi Terisolasi
              </span>
            </div>

            {/* Minimalist Underlined List View */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada data pelanggan yang cocok dengan partisi ini
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                            {cust.name}
                          </h3>

                          {/* Scoped Badge */}
                          {cust.customer_type === 'resto' ? (
                            <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                              <UtensilsCrossed className="w-2.5 h-2.5" />
                              <span>{cust.favoriteTable || 'Tamu Resto'}</span>
                            </span>
                          ) : cust.customer_type === 'ritel' ? (
                            <span className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                              <ScanBarcode className="w-2.5 h-2.5" />
                              <span>{cust.memberCardNumber || 'Member'} • {cust.memberTier || 'Silver'}</span>
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                              <Wrench className="w-2.5 h-2.5" />
                              <span>{cust.plateNumber}</span>
                            </span>
                          )}
                        </div>

                        {/* Detail Per Kategori Usaha */}
                        {cust.customer_type === 'resto' && cust.dietaryNotes && (
                          <p className="text-[11px] text-rose-700 font-medium">
                            🍴 Selera: {cust.dietaryNotes}
                          </p>
                        )}
                        {cust.customer_type === 'ritel' && (
                          <p className="text-[11px] text-blue-700 font-medium">
                            🪙 Poin Belanja: {cust.loyaltyPoints} Poin • {cust.vehicleModel}
                          </p>
                        )}
                        {(!cust.customer_type || cust.customer_type === 'bengkel') && (
                          <p className="text-[11px] text-emerald-800 font-medium">
                            🏍️ Unit: {cust.vehicleModel}
                          </p>
                        )}

                        {/* Phone / WhatsApp & Address */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                          <a
                            href={`https://wa.me/${cust.phone.replace(/^0/, '62')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-emerald-700 hover:underline font-bold"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{cust.phone} (WhatsApp)</span>
                          </a>

                          <div className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="truncate">{cust.address || 'Alamat belum dilengkapi'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedCustomerIdForDetail(cust.id);
                            setActiveTab('riwayat-servis-pelanggan');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {/* =====================================================================
            SUB-MENU B: KENDARAAN PELANGGAN
            - Minimalist underlined list view linking customer profiles to vehicle data
            - (Brand, Type, License Plate / Plat Nomor)
        ===================================================================== */}
        {activeTab === 'kendaraan-pelanggan' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Katalog Kendaraan Pelanggan ({filteredCustomers.length} Unit Terhubung)
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Link Profil Pemilik & Detail Plat Motor
              </span>
            </div>

            {/* Minimalist Underlined List View */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada kendaraan ditemukan
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          {/* Plat Nomor */}
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white tracking-wider shadow-2xs">
                            {cust.plateNumber}
                          </span>
                          {/* Brand & Type */}
                          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                            {cust.vehicleBrand || 'Honda'} {cust.vehicleType || cust.vehicleModel}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            ({cust.year})
                          </span>
                        </div>

                        {/* Customer Link Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-500 pt-0.5">
                          <span>
                            Pemilik: <strong className="text-slate-800">{cust.name}</strong>
                          </span>
                          <span>• WhatsApp: <strong className="text-emerald-700">{cust.phone}</strong></span>
                          <span>• Kunjungan: <strong className="text-slate-800">{cust.totalVisits}x</strong></span>
                          <span>• Servis Terakhir: <strong className="text-slate-700">{cust.lastServiceDate}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => {
                            setSelectedCustomerIdForDetail(cust.id);
                            setActiveTab('riwayat-servis-pelanggan');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#008952] hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Riwayat Motor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            SUB-MENU C: RIWAYAT SERVIS PELANGGAN
            - Detailed medium-to-large card view and minimalist underlined log tracking historical maintenance records
        ===================================================================== */}
        {activeTab === 'riwayat-servis-pelanggan' && (
          <div className="space-y-5">
            {/* Customer Selector Dropdown / Pills if user wants to switch */}
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 flex items-center gap-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                Pilih Kendaraan:
              </label>
              <select
                value={selectedCustomerIdForDetail}
                onChange={(e) => setSelectedCustomerIdForDetail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#008952]"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.plateNumber} - {c.name} ({c.vehicleModel})
                  </option>
                ))}
              </select>
            </div>

            {activeSelectedCust && (
              <>
                {/* 1. DETAILED MEDIUM-TO-LARGE CARD VIEW */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-slate-900 text-white tracking-wider">
                          {activeSelectedCust.plateNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                          {activeSelectedCust.vehicleBrand || 'Honda'}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {activeSelectedCust.vehicleModel}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tahun Perakitan: <strong>{activeSelectedCust.year}</strong> • Total Servis di Bengkel Qu: <strong>{activeSelectedCust.totalVisits} Kali</strong>
                      </p>
                    </div>

                    <div className="text-left sm:text-right bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        Poin Loyalitas
                      </span>
                      <span className="text-base font-black text-[#008952]">
                        {activeSelectedCust.loyaltyPoints} Poin
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">
                        Status Member Aktif
                      </span>
                    </div>
                  </div>

                  {/* Customer Profile Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Nama Pemilik
                      </span>
                      <p className="font-extrabold text-slate-900 text-xs">
                        {activeSelectedCust.name}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Kontak WhatsApp
                      </span>
                      <p className="font-extrabold text-emerald-700 text-xs">
                        {activeSelectedCust.phone}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Alamat Domisili
                      </span>
                      <p className="font-extrabold text-slate-800 text-xs truncate">
                        {activeSelectedCust.address || 'Bandung'}
                      </p>
                    </div>
                  </div>

                  {/* Notes / Special Preferences */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs">
                    <span className="font-bold text-amber-950 block mb-0.5">
                      Catatan Teknisi / Preferensi Kendaraan:
                    </span>
                    <p className="text-amber-900">
                      {activeSelectedCust.notes || 'Tidak ada catatan teknis khusus.'}
                    </p>
                  </div>
                </div>

                {/* 2. MINIMALIST UNDERLINED LOG TRACKING HISTORICAL MAINTENANCE */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Log Riwayat Servis & Nota Transaksi Unit Ini
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Minimalist Underlined Log
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
                    {customerTransactions.length === 0 && customerQueues.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                        <Wrench className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-600">Belum ada riwayat transaksi tersimpan untuk unit ini</p>
                        <p className="text-[11px] text-slate-400">
                          Riwayat servis akan otomatis masuk setiap kali unit menyelesaikan servis dan dibayar di kasir.
                        </p>
                      </div>
                    ) : (
                      <>
                        {customerTransactions.map((tx) => (
                          <div key={tx.id} className="p-4 hover:bg-slate-50/70 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                                    {tx.invoiceNumber}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {tx.date}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                    Lunas ({tx.paymentMethod})
                                  </span>
                                </div>

                                <div className="text-xs text-slate-800 font-medium pt-1">
                                  <span className="font-bold text-slate-900">Pekerjaan & Suku Cadang:</span>
                                  <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                                    {tx.items.map((it, idx) => (
                                      <li key={idx}>
                                        {it.name} ({it.qty}x) - Rp {(it.price * it.qty).toLocaleString('id-ID')}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <p className="text-[11px] text-slate-500 pt-1">
                                  Mekanik: <strong className="text-slate-700">{tx.mechanicName}</strong>
                                </p>
                              </div>

                              <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <span className="text-[10px] text-slate-400 block font-medium">Total Biaya</span>
                                <span className="text-sm font-black text-[#008952] font-mono">
                                  Rp {tx.total.toLocaleString('id-ID')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* MODAL: REGISTRASI PELANGGAN BARU */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">
                Registrasi Pelanggan & Kendaraan Baru
              </h3>
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              {/* Partisi Kategori Pelanggan */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Partisi Kategori Usaha Pelanggan *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCustScope('bengkel')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newCustScope === 'bengkel'
                        ? 'bg-emerald-50 border-[#008952] text-[#008952] shadow-2xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Bengkel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCustScope('resto')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newCustScope === 'resto'
                        ? 'bg-rose-50 border-rose-600 text-rose-700 shadow-2xs ring-2 ring-rose-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Resto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCustScope('ritel')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      newCustScope === 'ritel'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <ScanBarcode className="w-3.5 h-3.5" />
                    <span>Ritel</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Nama Pelanggan / Member *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Contoh: Rian Hidayat"
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1 px-0 text-slate-800 font-bold text-xs"
                  />
                </div>

                <div className="group">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    No. WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1 px-0 text-slate-800 font-bold text-xs"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Alamat Domisili
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pasirkaliki No. 78, Bandung"
                  className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1 px-0 text-slate-800 font-medium text-xs"
                />
              </div>

              {/* Dynamic Scoped Fields: BENGKEL */}
              {newCustScope === 'bengkel' && (
                <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 space-y-3">
                  <div className="text-[11px] font-black text-emerald-900 flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Data Kendaraan Bengkel</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Plat Nomor *
                      </label>
                      <input
                        type="text"
                        required={newCustScope === 'bengkel'}
                        value={newCustPlate}
                        onChange={(e) => setNewCustPlate(e.target.value)}
                        placeholder="D 1234 XYZ"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold text-xs uppercase focus:outline-hidden focus:border-[#008952]"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Merk Motor
                      </label>
                      <select
                        value={newCustBrand}
                        onChange={(e) => setNewCustBrand(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium text-xs focus:outline-hidden focus:border-[#008952]"
                      >
                        <option value="Honda">Honda</option>
                        <option value="Yamaha">Yamaha</option>
                        <option value="Suzuki">Suzuki</option>
                        <option value="Kawasaki">Kawasaki</option>
                        <option value="Vespa">Vespa</option>
                        <option value="Mobil">Mobil</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Tipe Model
                      </label>
                      <input
                        type="text"
                        value={newCustType}
                        onChange={(e) => setNewCustType(e.target.value)}
                        placeholder="Vario 160"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium text-xs focus:outline-hidden focus:border-[#008952]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Scoped Fields: RESTO */}
              {newCustScope === 'resto' && (
                <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100 space-y-3">
                  <div className="text-[11px] font-black text-rose-900 flex items-center gap-1">
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Preferensi Meja & Selera Tamu Resto</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Meja Favorit / Langganan
                      </label>
                      <input
                        type="text"
                        value={newCustTable}
                        onChange={(e) => setNewCustTable(e.target.value)}
                        placeholder="Meja 01, Meja 02, atau VIP"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold text-xs focus:outline-hidden focus:border-rose-500"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Catatan Selera / Pantangan Alergi
                      </label>
                      <input
                        type="text"
                        value={newCustDietary}
                        onChange={(e) => setNewCustDietary(e.target.value)}
                        placeholder="Cth: Tidak pedas, alergi udang"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium text-xs focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Scoped Fields: RITEL */}
              {newCustScope === 'ritel' && (
                <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 space-y-3">
                  <div className="text-[11px] font-black text-blue-900 flex items-center gap-1">
                    <ScanBarcode className="w-3.5 h-3.5" />
                    <span>Kartu Member & Poin Belanja Ritel</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        No. Kartu Member (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newCustMemberCard}
                        onChange={(e) => setNewCustMemberCard(e.target.value)}
                        placeholder="Cth: MBR-99120 (kosongkan = otomatis)"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-bold text-xs focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Tier / Golongan Member
                      </label>
                      <select
                        value={newCustMemberTier}
                        onChange={(e) => setNewCustMemberTier(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium text-xs focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="Silver">Member Silver (Standar)</option>
                        <option value="Gold">Member Gold (Diskon 5%)</option>
                        <option value="Platinum">Member Platinum (Prioritas)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Catatan khusus pelanggan..."
                  className="w-full bg-transparent border-0 border-b border-slate-300 focus:border-[#008952] focus:ring-0 rounded-none py-1 px-0 text-slate-800 font-medium text-xs"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#008952] hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Simpan Pelanggan [{newCustScope.toUpperCase()}]
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
