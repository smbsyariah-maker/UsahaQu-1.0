export type ServiceStatus = 'menunggu' | 'proses' | 'selesai' | 'diambil';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  type: 'jasa' | 'part';
}

export interface ServiceQueue {
  id: string;
  queueNumber: string; // e.g. "BQ-01", "BQ-02"
  plateNumber: string; // e.g. "B 3829 TKR"
  customerName: string;
  customerPhone: string;
  vehicleModel: string; // e.g. "Honda Vario 160"
  vehicleType: 'Motor Matic' | 'Motor Bebek' | 'Motor Sport' | 'Mobil' | 'Lainnya';
  serviceCategory: 'Servis Ringan' | 'Servis Berkala' | 'Turun Mesin' | 'Ganti Oli & Filter' | 'Kelistrikan' | 'Custom';
  mechanicName: string;
  status: ServiceStatus;
  complaint: string;
  timeIn: string;
  date?: string;
  estimatedCompletion: string;
  items: ServiceItem[];
  progressPercent: number;
  totalCost: number;
  notes?: string;
}

export interface Sparepart {
  id: string;
  code: string;
  name: string;
  category: 'Oli & Pelumas' | 'Sistem Rem' | 'Transmisi / CVT' | 'Busi & Kelistrikan' | 'Ban & Velg' | 'Filter & Karburator' | 'Bodi & Aksesoris';
  brand: string;
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  unit: string; // e.g. "Botol", "Pcs", "Set"
  rackLocation: string;
  supplier?: string;
  barcode?: string;
}

export interface DamagedGood {
  id: string;
  sparepartId?: string;
  code: string;
  name: string;
  qty: number;
  unit: string;
  damageReason: string;
  reportedBy: string;
  date: string;
  timestamp: number;
  status: 'Diajukan' | 'Disetujui SPV' | 'Dimusnahkan' | 'Retur Suplier';
  notes?: string;
}

export interface ProcurementRecord {
  id: string;
  poNumber: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  qty: number;
  unit: string;
  buyPrice: number;
  totalCost: number;
  date: string;
  timestamp: number;
  receiver: string;
  type: 'Baru' | 'Restock';
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceNumber: string; // e.g. "INV-20261006-001"
  date: string;
  customerName: string;
  plateNumber: string;
  vehicleModel: string;
  mechanicName: string;
  items: ServiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer Bank' | 'Kartu Debit';
  cashPaid?: number;
  change?: number;
  status: 'Lunas' | 'Belum Lunas';
}

export interface Mechanic {
  id: string;
  name: string;
  role: string;
  phone: string;
  activeTasks: number;
  completedToday: number;
  rating: number;
  avatarBg: string;
}

export interface CustomerVehicle {
  id: string;
  name: string;
  phone: string;
  address?: string;
  // Scoped Data / Tagging Partisi Usaha
  customer_type?: 'bengkel' | 'resto' | 'ritel';
  // Bengkel specific
  plateNumber: string;
  vehicleBrand?: string; // e.g. "Honda", "Yamaha", "Suzuki"
  vehicleType?: string; // e.g. "Vario 160", "BeAT eSP", "NMAX 155"
  vehicleModel: string;
  year: string;
  lastServiceDate: string;
  // Resto specific
  favoriteTable?: string;
  dietaryNotes?: string;
  // Ritel specific
  memberCardNumber?: string;
  memberTier?: 'Silver' | 'Gold' | 'Platinum';
  // Common
  totalVisits: number;
  loyaltyPoints: number;
  notes: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'SMS' | 'Broadcast';
  targetAudience: string;
  targetBusinessScope?: 'semua' | 'bengkel' | 'resto' | 'ritel';
  messageContent: string;
  sentDate: string;
  recipientCount: number;
  status: 'Terkirim' | 'Terjadwal' | 'Draft';
  deliveredPercent: number;
}


export interface PromoVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'Persen' | 'Nominal';
  discountValue: number;
  minTransaction: number;
  validUntil: string;
  category: 'Semua' | 'Jasa Servis' | 'Sparepart' | 'Oli' | 'Menu Resto' | 'Produk Ritel' | string;
  quota: number;
  usedCount: number;
  isActive: boolean;
  notes?: string;
}

export interface SubMenuItemConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
  targetView: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'Operasional' | 'Bahan / Perlengkapan' | 'Konsumsi' | 'BBM / Transport' | 'Lainnya';
  amount: number;
  date: string;
  notes?: string;
  recordedBy?: string;
}

export interface PettyCashConfig {
  initialCapital: number;
  denominations: { [key: string]: number };
  updatedAt: string;
}

export interface ClosingRecord {
  id: string;
  date: string;
  shift: string;
  cashierName: string;
  initialCash: number;
  totalCashSales: number;
  totalNonCashSales: number;
  totalExpenses: number;
  totalUnpaidReceivables: number;
  expectedCashInDrawer: number;
  actualCashInDrawer: number;
  difference: number;
  notes?: string;
  status: 'Selesai' | 'Disetujui SPV';
}

export interface MenuModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badgeCount?: string | number;
  badgeColor?: string;
  description: string;
  subMenus: SubMenuItemConfig[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'service' | 'stock' | 'payment' | 'system';
}

export interface WorkshopProfile {
  workshopName: string;
  address: string;
  ownerName: string;
  phone: string;
  email: string;
}

export interface RolePermissionConfig {
  id: string;
  category: string;
  permissionName: string;
  spv: boolean;
  kasir: boolean;
  description: string;
}

export interface BranchItem {
  id: string;
  branchName: string;
  address: string;
  spvName: string;
  phone: string;
  email: string;
  isActive?: boolean;
}

export type UserRole = 'Owner' | 'Supervisor' | 'Kasir' | 'Admin' | 'Mekanik' | 'Pelayan';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  branchId?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface UserSession {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  autoLogin: boolean;
  loginTime: string;
}

export type SubscriptionPlanId = 'trial' | 'free' | 'basic' | 'core' | 'corporate';

export type ProTierOption = 'basic' | 'core' | 'corporate';

export type ProDurationOption = 1 | 3 | 6 | 12;

export interface SubscriptionState {
  planId: SubscriptionPlanId;
  planName: string;
  dailyRate: number; // 0 for free/trial, 1000 for basic, 2000 for core, 3000 for corporate
  trialStartDate: number;
  trialDurationDays: number;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  subscriptionExpiryDate?: number;
  isSubscribed: boolean;
  deviceId?: string;
  activeSerialKey?: string;
  subscriptionDurationMonths?: ProDurationOption;
  activatedAt?: number;
}

export type DeviceSlotRole = 'Owner' | 'Supervisor' | 'Kasir' | 'Mekanik';

export interface DeviceSlotInfo {
  slotNumber: number; // 1..3 for Core, 1..9 for Enterprise
  deviceId: string;
  deviceName: string;
  role: DeviceSlotRole;
  branchId?: string;
  branchName?: string;
  status: 'active' | 'empty' | 'revoked';
  isCurrentDevice: boolean;
  lastSyncTime: string;
}

export interface DevicePairingToken {
  workshopId: string;
  workshopName: string;
  licenseKey?: string;
  tier: 'core' | 'corporate';
  slotNumber: number;
  role: DeviceSlotRole;
  branchId?: string;
  branchName?: string;
  createdAt: number;
  pairingCode: string; // 6 digit quick code
}

// ==========================================
// MODULAR PLUGIN ARCHITECTURE (USAHA QU 1.0)
// ==========================================
export type BusinessType = 'bengkel' | 'resto' | 'ritel' | 'collabqu';

export interface BusinessTypeMeta {
  id: BusinessType;
  name: string;
  shortName: string;
  tagline: string;
  iconName: string;
  primaryColor: string;
  badgeLabel: string;
  description: string;
}

// RESTO / F&B PLUGIN MODELS
export type DiningTableStatus = 'kosong' | 'terisi' | 'billing' | 'reservasi';

export interface DiningTable {
  id: string;
  number: string; // e.g. "Meja 01"
  name: string;
  capacity: number;
  zone: 'Indoor (AC)' | 'Outdoor' | 'VIP' | 'Lantai 2';
  status: DiningTableStatus;
  currentGuestName?: string;
  guestCount?: number;
  orderTotal?: number;
  orderTime?: string;
  orderType?: 'Dine In' | 'Takeaway';
  items?: { name: string; qty: number; price: number; notes?: string }[];
}

export interface FoodMenuItem {
  id: string;
  code: string;
  name: string;
  category: 'Makanan Utama' | 'Minuman' | 'Snack & Dimsum' | 'Paket Hemat';
  price: number;
  costPrice: number;
  isAvailable: boolean;
  stock?: number;
  isFavorite?: boolean;
  description?: string;
}

// RITEL / TOKO PLUGIN MODELS
export interface RetailProduct {
  id: string;
  barcode: string;
  sku: string;
  name: string;
  category: 'Sembako & Pangan' | 'Minuman & Snack' | 'Perlengkapan Rumah' | 'ATK & Elektronik' | 'Perawatan Diri';
  rackAisle: string; // e.g. "Lorong A - Rak 1"
  stock: number;
  minStock: number;
  buyPrice: number;
  sellPrice: number;
  unit: string; // e.g. "Pcs", "Kg", "Dus", "Btl"
  brand: string;
}

// ==========================================
// COLLABQU (KONSINYASI & TITIP JUAL) MODELS
// ==========================================
export interface ConsignmentSupplier {
  id: string;
  storeName: string; // Nama Toko / Merk Penitip
  ownerName: string; // Nama Pemilik / Kontak PIC
  phone: string; // WhatsApp
  address: string;
  mapsUrl?: string; // Link Pin Google Maps
  joinedDate: string;
  status: 'Aktif' | 'Nonaktif';
  totalSoldUnits: number;
  totalSoldRevenue: number;
  totalReturnedUnits: number;
  totalRestockedUnits: number;
  activeItemCount: number;
}

export type ConsignmentStockStatus = 'Tersedia' | 'Stok Menipis' | 'Batas Retur' | 'Habis';

export interface ConsignmentProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  productName: string;
  sku: string; // Barcode / SKU
  consumerPrice: number; // Harga Jual ke Konsumen
  supplierNetPrice: number; // Harga Netto Pemasok / Tagihan Penitip
  commissionRatePercent: number; // % Komisi Toko
  initialStock: number;
  currentStock: number;
  soldStock: number;
  returnedStock: number;
  dueDate?: string; // Batas Tanggal Retur / Penagihan (Opsional)
  status: ConsignmentStockStatus;
  category?: string;
  notes?: string;
}

export interface ConsignmentSettlement {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  totalSoldUnits: number;
  grossSales: number;
  netSupplierPayable: number;
  storeCommissionRevenue: number;
  status: 'Lunas' | 'Menunggu Transfer';
}



