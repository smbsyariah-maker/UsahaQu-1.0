import { 
  MenuModuleConfig, 
  ServiceQueue, 
  Sparepart, 
  Transaction, 
  Mechanic, 
  CustomerVehicle, 
  NotificationItem, 
  DamagedGood, 
  ProcurementRecord,
  MarketingCampaign,
  PromoVoucher
} from '../types';

export const MENU_MODULES: MenuModuleConfig[] = [
  {
    id: 'servis',
    title: 'Servis',
    subtitle: 'Manajemen Bengkel',
    iconName: 'Wrench',
    badgeCount: '4 Aktif',
    badgeColor: 'bg-emerald-500',
    description: 'Penerimaan unit, antrian servis, pengerjaan teknisi, dan serah terima kendaraan.',
    subMenus: [
      {
        id: 'registrasi',
        title: 'Registrasi',
        subtitle: 'Input Pendaftaran Unit Baru',
        iconName: 'ClipboardEdit',
        badge: 'Form Baru',
        targetView: 'service-register'
      },
      {
        id: 'antrian',
        title: 'Antrian',
        subtitle: 'Daftar Menunggu Servis',
        iconName: 'ListOrdered',
        badge: 'Menunggu',
        targetView: 'service-queue'
      },
      {
        id: 'proses-service',
        title: 'Proses Service',
        subtitle: 'Pengerjaan & Pergantian Part',
        iconName: 'Cog',
        badge: 'Dikerjakan',
        targetView: 'service-progress'
      },
      {
        id: 'selesai-service',
        title: 'Selesai Service',
        subtitle: 'Unit Selesai & Cetak Nota / WA',
        iconName: 'CheckCircle2',
        badge: 'Selesai',
        targetView: 'service-completed'
      },
      {
        id: 'total-service',
        title: 'Total Service',
        subtitle: 'Rekap Semua Servis Hari Ini',
        iconName: 'Layers',
        badge: 'Harian',
        targetView: 'service-total'
      }
    ]
  },
  {
    id: 'kasir',
    title: 'Kasir',
    subtitle: 'POS & Pembayaran',
    iconName: 'Receipt',
    badgeCount: 'Rp 2.45 Jt',
    badgeColor: 'bg-emerald-600',
    description: 'Pencatatan transaksi pembayaran jasa dan suku cadang dengan cetak struk cetak nota.',
    subMenus: [
      {
        id: 'kasir',
        title: 'Kasir',
        subtitle: 'Pembayaran Servis & POS',
        iconName: 'CreditCard',
        badge: 'Bayar',
        targetView: 'pos-checkout'
      },
      {
        id: 'piutang',
        title: 'Piutang',
        subtitle: 'Tagihan Servis Belum Lunas',
        iconName: 'Clock',
        badge: 'Tempo',
        targetView: 'pos-receivable'
      },
      {
        id: 'riwayat-transaksi',
        title: 'Riwayat Transaksi',
        subtitle: 'Log Riwayat Semua Nota',
        iconName: 'FileText',
        badge: 'Riwayat',
        targetView: 'pos-history'
      },
      {
        id: 'petty-cash',
        title: 'Petty Cash',
        subtitle: 'Modal & Uang Kembalian',
        iconName: 'Coins',
        badge: 'Modal',
        targetView: 'pos-pettycash'
      },
      {
        id: 'kas-kecil',
        title: 'Kas Kecil',
        subtitle: 'Biaya Operasional Harian',
        iconName: 'Receipt',
        badge: 'Biaya',
        targetView: 'pos-expenses'
      },
      {
        id: 'closingan',
        title: 'Closingan',
        subtitle: 'Tutup Shift & Rekonsiliasi',
        iconName: 'Calculator',
        badge: 'Tutup Buku',
        targetView: 'pos-closing'
      }
    ]
  },
  {
    id: 'inventaris',
    title: 'Inventaris',
    subtitle: 'Suku Cadang & Stok',
    iconName: 'Package',
    badgeCount: '3 Kritis',
    badgeColor: 'bg-amber-500',
    description: 'Pusat tata kelola logistik masuk, katalog suku cadang, stok kritis, pelaporan barang rusak, dan log pengadaan.',
    subMenus: [
      {
        id: 'sparepart-datang',
        title: 'Sparepart Datang (Inbound)',
        subtitle: 'Sparepart Baru / Tambah Qty / Scan Masuk',
        iconName: 'PlusCircle',
        badge: 'Inbound',
        targetView: 'inv-inbound'
      },
      {
        id: 'katalog-sparepart',
        title: 'Katalog Sparepart (Master)',
        subtitle: 'Daftar Seluruh Suku Cadang & Ketersediaan',
        iconName: 'Boxes',
        targetView: 'inv-catalog'
      },
      {
        id: 'stok-kritis',
        title: 'Stok Kritis',
        subtitle: 'Monitoring Part di Bawah Batas Minimum',
        iconName: 'AlertTriangle',
        badge: 'Kritis',
        targetView: 'inv-critical'
      },
      {
        id: 'barang-rusak',
        title: 'Barang Rusak',
        subtitle: 'Form Pengajuan & Log Barang Rusak / Cacat',
        iconName: 'PackageX',
        targetView: 'inv-damaged'
      },
      {
        id: 'riwayat-pengadaan',
        title: 'Riwayat Pengadaan',
        subtitle: 'Log Pembelian & Penerimaan dari Suplier',
        iconName: 'Truck',
        targetView: 'inv-procurement'
      }
    ]
  },
  {
    id: 'pelanggan',
    title: 'Pelanggan',
    subtitle: 'Data Motor & Pemilik',
    iconName: 'Users',
    badgeCount: '128 Unit',
    badgeColor: 'bg-emerald-500',
    description: 'Pusat master identitas pelanggan, keterhubungan data kendaraan bermotor, dan riwayat servis per unit.',
    subMenus: [
      {
        id: 'daftar-pelanggan',
        title: 'Daftar Pelanggan (Master)',
        subtitle: 'Nama, Nomor Telepon/WhatsApp & Alamat',
        iconName: 'UserCheck',
        targetView: 'cust-master'
      },
      {
        id: 'kendaraan-pelanggan',
        title: 'Kendaraan Pelanggan',
        subtitle: 'Profil Kendaraan, Merk, Tipe & Plat Nomor',
        iconName: 'BellRing',
        targetView: 'cust-vehicles'
      },
      {
        id: 'riwayat-servis-pelanggan',
        title: 'Riwayat Servis Pelanggan',
        subtitle: 'Card Detail & Log Perawatan Tiap Kendaraan',
        iconName: 'Award',
        targetView: 'cust-history'
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    subtitle: 'Promosi & Diskon',
    iconName: 'Megaphone',
    badgeCount: '2 Promo',
    badgeColor: 'bg-emerald-500',
    description: 'Kampanye promosi bengkel, formulir pengiriman broadcast WhatsApp, manajemen voucher diskon, dan log pesan.',
    subMenus: [
      {
        id: 'etalase-online',
        title: 'Etalase Web & WA',
        subtitle: 'Katalog QR Cloud & Pesanan WhatsApp',
        iconName: 'Globe',
        badge: 'Cloud QR',
        targetView: 'mkt-etalase'
      },
      {
        id: 'broadcast-wa',
        title: 'Broadcast WhatsApp',
        subtitle: 'Form Draf & Kirim Pesan Promo / Reminder',
        iconName: 'Send',
        targetView: 'mkt-broadcast'
      },
      {
        id: 'promo-diskon',
        title: 'Promo & Diskon',
        subtitle: 'Kelola Voucher Diskon & Potongan Servis',
        iconName: 'Tag',
        badge: 'Aktif',
        targetView: 'mkt-promo'
      },
      {
        id: 'riwayat-pesan',
        title: 'Riwayat Pesan / Campaign',
        subtitle: 'Log Kampanye Pesan & Pengiriman Promosi',
        iconName: 'Star',
        targetView: 'mkt-history'
      }
    ]
  },
  {
    id: 'laporan',
    title: 'Laporan',
    subtitle: 'Omset & Performa',
    iconName: 'BarChart3',
    badgeCount: 'Hari Ini',
    badgeColor: 'bg-emerald-500',
    description: 'Laporan pendapatan arus kas harian/bulanan, audit volume servis kendaraan, dan pemantauan piutang serta kas kecil.',
    subMenus: [
      {
        id: 'laporan-pendapatan',
        title: 'Laporan Pendapatan (Omzet)',
        subtitle: 'Ringkasan Inflow Keuangan & Log Transaksi',
        iconName: 'TrendingUp',
        targetView: 'rep-revenue'
      },
      {
        id: 'laporan-servis',
        title: 'Laporan Servis',
        subtitle: 'Rekap Unit Selesai vs Aktif per Periode',
        iconName: 'UserCheck2',
        targetView: 'rep-service'
      },
      {
        id: 'laporan-piutang-keuangan',
        title: 'Laporan Piutang & Keuangan',
        subtitle: 'Rincian Tagihan Belum Lunas & Kas Kecil',
        iconName: 'PieChart',
        targetView: 'rep-finance'
      }
    ]
  },
  {
    id: 'basic',
    title: 'Basic',
    subtitle: 'Profil Usaha',
    iconName: 'Store',
    badgeCount: 'Profil',
    badgeColor: 'bg-emerald-500',
    description: 'Auto-Modul Basic: Pengaturan identitas resmi outlet, data pemilik, alamat operasional, dan kontak bisnis.',
    subMenus: [
      {
        id: 'basic-profile',
        title: 'Profil Usaha',
        subtitle: 'Nama Usaha, Alamat, Pemilik & Kontak',
        iconName: 'Store',
        badge: 'Profil',
        targetView: 'basic-profile'
      }
    ]
  },
  {
    id: 'core',
    title: 'Core',
    subtitle: 'Profil & Hak Akses',
    iconName: 'ShieldAlert',
    badgeCount: '2 Modul',
    badgeColor: 'bg-emerald-500',
    description: 'Auto-Modul Core: Profil usaha lengkap, hak akses otorisasi untuk Supervisor (SPV) & Kasir, serta slot tautkan 3 HP.',
    subMenus: [
      {
        id: 'core-profile',
        title: 'Profil Usaha',
        subtitle: 'Identitas Usaha & Model Plugin',
        iconName: 'Store',
        badge: 'Profil',
        targetView: 'core-profile'
      },
      {
        id: 'core-permissions',
        title: 'Hak Akses',
        subtitle: '(SPV & Kasir) Role & Permission',
        iconName: 'Key',
        badge: 'SPV & Kasir',
        targetView: 'core-permissions'
      },
      {
        id: 'core-devices',
        title: 'Tautkan HP (3 Slot)',
        subtitle: 'Pairing HP Kasir & Mekanik via QR',
        iconName: 'Smartphone',
        badge: '3 HP',
        targetView: 'core-devices'
      }
    ]
  },
  {
    id: 'corporate',
    title: 'Corporate',
    subtitle: 'Profil, Hak Akses & 3 Cabang',
    iconName: 'Building2',
    badgeCount: '3 Modul',
    badgeColor: 'bg-emerald-500',
    description: 'Auto-Modul Corporate: Profil pusat, hak akses SPV/kasir/admin, dan 3 form card outlet cabang serta slot 9 HP.',
    subMenus: [
      {
        id: 'corp-profile',
        title: 'Profil Usaha',
        subtitle: 'Identitas Kantor Pusat',
        iconName: 'Store',
        badge: 'Profil',
        targetView: 'corp-profile'
      },
      {
        id: 'corp-permissions',
        title: 'Hak Akses',
        subtitle: '(SPV & Kasir) Role & Permission',
        iconName: 'Key',
        badge: 'SPV & Kasir',
        targetView: 'corp-permissions'
      },
      {
        id: 'corp-branches',
        title: '3 Cabang',
        subtitle: '3 Form Card Manajemen Outlet',
        iconName: 'Building2',
        badge: '3 Outlet',
        targetView: 'corp-branches'
      },
      {
        id: 'corp-devices',
        title: 'Tautkan HP (9 Slot)',
        subtitle: 'Multi-Cabang (3 Outlet x 3 HP)',
        iconName: 'Smartphone',
        badge: '9 HP',
        targetView: 'corp-devices'
      }
    ]
  },
  {
    id: 'setting',
    title: 'Setting',
    subtitle: 'Tema, Backup & Sistem',
    iconName: 'Settings',
    badgeCount: 'Sistem',
    badgeColor: 'bg-emerald-500',
    description: 'Pengaturan tema tampilan, pencadangan data dengan opsi kustom, pemulihan data (restore), dan reset.',
    subMenus: [
      {
        id: 'setting-perangkat',
        title: 'Tautkan HP & Sinkron',
        subtitle: 'Hubungkan HP Karyawan (QR Code)',
        iconName: 'Smartphone',
        badge: 'Multi-HP',
        targetView: 'setting-perangkat'
      },
      {
        id: 'setting-tema',
        title: 'Tema',
        subtitle: 'Pilihan Nuansa Warna Aplikasi',
        iconName: 'Palette',
        targetView: 'setting-theme'
      },
      {
        id: 'setting-backup',
        title: 'Backup - Opsi',
        subtitle: 'Ekspor Cadangan Database (.JSON)',
        iconName: 'Database',
        targetView: 'setting-backup'
      },
      {
        id: 'setting-restore',
        title: 'Restore',
        subtitle: 'Pulihkan Data dari Berkas Cadangan',
        iconName: 'UploadCloud',
        targetView: 'setting-restore'
      },
      {
        id: 'setting-reset',
        title: 'Reset',
        subtitle: 'Hapus Bersih Total / Reset Data',
        iconName: 'RotateCcw',
        badge: 'Bersih',
        targetView: 'setting-reset'
      },
      {
        id: 'setting-aktivasi',
        title: 'Aktivasi PRO',
        subtitle: 'Serial Number Email bageurhendri@gmail.com',
        iconName: 'Key',
        badge: 'Lisensi',
        targetView: 'setting-aktivasi'
      },
      {
        id: 'setting-update',
        title: 'Update App',
        subtitle: 'Auto-Adapt Data Tanpa Uninstall',
        iconName: 'Sparkles',
        badge: 'v2.4.0',
        targetView: 'setting-update'
      }
    ]
  }
];

export const INITIAL_PROFILE = {
  workshopName: 'Bengkel Qu Motor Berkah Jaya',
  address: 'Jl. Otto Iskandardinata No. 128, Sukajadi, Kota Bandung, Jawa Barat 40161',
  ownerName: 'Bpk. Ahmad Fauzi Rachman, S.T.',
  phone: '0812-3456-7890',
  email: 'kontak@bengkelqu-bandung.com'
};

export const INITIAL_PERMISSIONS = [
  { id: 'perm-1', category: 'Kasir & POS', permissionName: 'Buka & Tutup Kasir Shift', spv: true, kasir: true, description: 'Memulai shift kasir dan input saldo awal' },
  { id: 'perm-2', category: 'Kasir & POS', permissionName: 'Transaksi Penjualan & Cetak Nota', spv: true, kasir: true, description: 'Menerima pembayaran tunai, QRIS, dan cetak faktur' },
  { id: 'perm-3', category: 'Kasir & POS', permissionName: 'Beri Diskon / Potongan Harga', spv: true, kasir: false, description: 'Otoritas input diskon manual' },
  { id: 'perm-4', category: 'Kasir & POS', permissionName: 'Void / Hapus Transaksi Selesai', spv: true, kasir: false, description: 'Membatalkan nota yang telah dicetak & lunas' },
  { id: 'perm-5', category: 'Servis & Antrian', permissionName: 'Input Tiket Antrian Servis', spv: true, kasir: true, description: 'Registrasi kendaraan baru masuk' },
  { id: 'perm-6', category: 'Servis & Antrian', permissionName: 'Tugaskan Mekanik & Ubah Status', spv: true, kasir: false, description: 'Menentukan teknisi pengerjaan dan verifikasi QC' },
  { id: 'perm-7', category: 'Inventaris & Stok', permissionName: 'Input Barang Masuk & Ubah Stok', spv: true, kasir: false, description: 'Update kuantitas dan harga beli suku cadang' },
  { id: 'perm-8', category: 'Inventaris & Stok', permissionName: 'Lihat Katalog & Stok Suku Cadang', spv: true, kasir: true, description: 'Cek ketersediaan part dan lokasi rak' },
  { id: 'perm-9', category: 'Keuangan & Laporan', permissionName: 'Akses Laporan Omset & Laba Rugi', spv: true, kasir: false, description: 'Melihat ringkasan margin dan pendapatan harian' },
  { id: 'perm-10', category: 'Keuangan & Laporan', permissionName: 'Hitung Komisi & Bagi Hasil Mekanik', spv: true, kasir: false, description: 'Perhitungan insentif teknisi' }
];

export const INITIAL_BRANCHES = [
  {
    id: 'br-1',
    branchName: 'Bengkel Qu - Cabang 1 (Pusat Otista)',
    address: 'Jl. Otto Iskandardinata No. 128, Sukajadi, Kota Bandung, Jawa Barat 40161',
    spvName: 'Bpk. Ahmad Fauzi (SPV Utama)',
    phone: '0812-3456-7890',
    email: 'cabang.pusat@bengkelqu.id',
    isActive: true
  },
  {
    id: 'br-2',
    branchName: 'Bengkel Qu - Cabang 2 (Dago Utara)',
    address: 'Jl. Ir. H. Juanda No. 342, Dago, Coblong, Kota Bandung, Jawa Barat 40135',
    spvName: 'Mas Rizky Kurniawan (SPV Dago)',
    phone: '0813-8899-7711',
    email: 'cabang.dago@bengkelqu.id',
    isActive: false
  },
  {
    id: 'br-3',
    branchName: 'Bengkel Qu - Cabang 3 (Buah Batu)',
    address: 'Jl. Buah Batu No. 215, Lengkong, Kota Bandung, Jawa Barat 40265',
    spvName: 'Mas Hendra Gunawan (SPV Buah Batu)',
    phone: '0817-2233-4455',
    email: 'cabang.buahbatu@bengkelqu.id',
    isActive: false
  }
];

export const INITIAL_QUEUES: ServiceQueue[] = [
  {
    id: 'q-1',
    queueNumber: 'BQ-01',
    plateNumber: 'D 4521 ABC',
    customerName: 'Ahmad Fauzi',
    customerPhone: '081234567890',
    vehicleModel: 'Honda Vario 160 (2023)',
    vehicleType: 'Motor Matic',
    serviceCategory: 'Servis Berkala',
    mechanicName: 'Mas Joko (Senior)',
    status: 'proses',
    complaint: 'Tarikan berat di tanjakan, getar saat rpm rendah, dan rem belakang kurang pakem.',
    timeIn: '08:15 WIB',
    estimatedCompletion: '10:00 WIB',
    progressPercent: 70,
    notes: 'Sudah bersihkan CVT, tinggal ganti oli gardan dan setel rem.',
    totalCost: 185000,
    items: [
      { id: 'i-1', name: 'Jasa Servis Lengkap Matic & CVT', price: 65000, qty: 1, type: 'jasa' },
      { id: 'i-2', name: 'AHM Oil SPX2 0.8L Full Synthetic', price: 68000, qty: 1, type: 'part' },
      { id: 'i-3', name: 'Oli Gardan Honda Matic 120ml', price: 18000, qty: 1, type: 'part' },
      { id: 'i-4', name: 'Kampas Rem Belakang Honda Genuine', price: 34000, qty: 1, type: 'part' }
    ]
  },
  {
    id: 'q-2',
    queueNumber: 'BQ-02',
    plateNumber: 'B 3190 TKL',
    customerName: 'Siti Rahmawati',
    customerPhone: '085712389901',
    vehicleModel: 'Yamaha NMAX 155 Connected',
    vehicleType: 'Motor Matic',
    serviceCategory: 'Ganti Oli & Filter',
    mechanicName: 'Mas Eko',
    status: 'selesai',
    complaint: 'Ganti oli mesin rutin dan cek lampu rem belakang yang mati.',
    timeIn: '08:45 WIB',
    estimatedCompletion: '09:30 WIB',
    progressPercent: 100,
    notes: 'Lampu bohlam rem putus, sudah diganti baru. Pengerjaan selesai.',
    totalCost: 125000,
    items: [
      { id: 'i-5', name: 'Yamalube Super Matic 1.0L', price: 78000, qty: 1, type: 'part' },
      { id: 'i-6', name: 'Bohlam Rem Belakang T10 Osram', price: 17000, qty: 1, type: 'part' },
      { id: 'i-7', name: 'Jasa Ganti Oli & Cek Ringan', price: 30000, qty: 1, type: 'jasa' }
    ]
  },
  {
    id: 'q-3',
    queueNumber: 'BQ-03',
    plateNumber: 'D 2819 KHG',
    customerName: 'Bambang Supriyanto',
    customerPhone: '081399881122',
    vehicleModel: 'Honda BeAT eSP FI (2020)',
    vehicleType: 'Motor Matic',
    serviceCategory: 'Servis Ringan',
    mechanicName: 'Mas Dani',
    status: 'selesai',
    complaint: 'Starter elektrik susah hidup di pagi hari, ganti busi.',
    timeIn: '08:00 WIB',
    estimatedCompletion: '08:50 WIB',
    progressPercent: 100,
    notes: 'Aki masih bagus 12.6V, busi kotor diganti baru NGK MR9C.',
    totalCost: 85000,
    items: [
      { id: 'i-8', name: 'Busi NGK MR9C-9N Original', price: 35000, qty: 1, type: 'part' },
      { id: 'i-9', name: 'Jasa Tune Up Injeksi & Reset ECU', price: 50000, qty: 1, type: 'jasa' }
    ]
  },
  {
    id: 'q-4',
    queueNumber: 'BQ-04',
    plateNumber: 'D 6044 VXZ',
    customerName: 'Kevin Wijaya',
    customerPhone: '082155667788',
    vehicleModel: 'Yamaha Aerox 155 VVA',
    vehicleType: 'Motor Matic',
    serviceCategory: 'Servis Ringan',
    mechanicName: 'Mas Joko (Senior)',
    status: 'menunggu',
    complaint: 'Bunyi decit di bagian ban depan saat rem ditekan.',
    timeIn: '09:10 WIB',
    estimatedCompletion: '10:30 WIB',
    progressPercent: 10,
    notes: 'Menunggu giliran pengerjaan Mas Joko.',
    totalCost: 75000,
    items: [
      { id: 'i-10', name: 'Jasa Servis Kaliper & Rem Depan', price: 35000, qty: 1, type: 'jasa' },
      { id: 'i-11', name: 'Kampas Rem Depan Daytona Pro', price: 40000, qty: 1, type: 'part' }
    ]
  },
  {
    id: 'q-5',
    queueNumber: 'BQ-05',
    plateNumber: 'B 5591 PQR',
    customerName: 'Rian Pratama',
    customerPhone: '081299008811',
    vehicleModel: 'Kawasaki KLX 150 BF',
    vehicleType: 'Motor Sport',
    serviceCategory: 'Turun Mesin',
    mechanicName: 'Mas Ryan (Spesialis Mesin)',
    status: 'menunggu',
    complaint: 'Asap putih tipis dari knalpot, oli cepat habis susut.',
    timeIn: '09:20 WIB',
    estimatedCompletion: '14:00 WIB',
    progressPercent: 0,
    notes: 'Periksa ring seher & sil klep bocor.',
    totalCost: 450000,
    items: [
      { id: 'i-12', name: 'Jasa Skir Klep & Ganti Ring Piston', price: 250000, qty: 1, type: 'jasa' },
      { id: 'i-13', name: 'Seal Klep & Paking Top Set Kawasaki', price: 110000, qty: 1, type: 'part' },
      { id: 'i-14', name: 'Motul 5100 10W-40 1L', price: 90000, qty: 1, type: 'part' }
    ]
  }
];

export const INITIAL_SPAREPARTS: Sparepart[] = [
  {
    id: 'p-1',
    code: 'OIL-AHM-01',
    name: 'AHM Oil MPX2 0.8L (Matic)',
    category: 'Oli & Pelumas',
    brand: 'Astra Honda Motor',
    stock: 2, // Low stock alert!
    minStock: 10,
    buyPrice: 46000,
    sellPrice: 56000,
    unit: 'Botol',
    rackLocation: 'Rak A-1'
  },
  {
    id: 'p-2',
    code: 'OIL-AHM-02',
    name: 'AHM Oil SPX2 0.8L Full Synthetic',
    category: 'Oli & Pelumas',
    brand: 'Astra Honda Motor',
    stock: 14,
    minStock: 8,
    buyPrice: 56000,
    sellPrice: 68000,
    unit: 'Botol',
    rackLocation: 'Rak A-1'
  },
  {
    id: 'p-3',
    code: 'OIL-YAM-01',
    name: 'Yamalube Super Matic 1.0L',
    category: 'Oli & Pelumas',
    brand: 'Yamaha Genuine',
    stock: 18,
    minStock: 8,
    buyPrice: 65000,
    sellPrice: 78000,
    unit: 'Botol',
    rackLocation: 'Rak A-2'
  },
  {
    id: 'p-4',
    code: 'OIL-SHELL-01',
    name: 'Shell Advance AX7 Matic 10W-40 0.8L',
    category: 'Oli & Pelumas',
    brand: 'Shell',
    stock: 1, // Low stock alert!
    minStock: 6,
    buyPrice: 51000,
    sellPrice: 62000,
    unit: 'Botol',
    rackLocation: 'Rak A-3'
  },
  {
    id: 'p-5',
    code: 'BS-NGK-01',
    name: 'Busi NGK CPR9EA-9 (Vario/Beat/Scoopy)',
    category: 'Busi & Kelistrikan',
    brand: 'NGK',
    stock: 24,
    minStock: 10,
    buyPrice: 20000,
    sellPrice: 30000,
    unit: 'Pcs',
    rackLocation: 'Rak B-1'
  },
  {
    id: 'p-6',
    code: 'BS-DEN-01',
    name: 'Busi Denso U24EPR9',
    category: 'Busi & Kelistrikan',
    brand: 'Denso',
    stock: 16,
    minStock: 8,
    buyPrice: 19000,
    sellPrice: 28000,
    unit: 'Pcs',
    rackLocation: 'Rak B-1'
  },
  {
    id: 'p-7',
    code: 'REM-HON-01',
    name: 'Kampas Rem Depan Vario/Beat KVB',
    category: 'Sistem Rem',
    brand: 'Honda Genuine Part',
    stock: 9,
    minStock: 5,
    buyPrice: 42000,
    sellPrice: 55000,
    unit: 'Set',
    rackLocation: 'Rak C-2'
  },
  {
    id: 'p-8',
    code: 'REM-DAY-01',
    name: 'Kampas Rem Belakang Tromol Daytona Gold',
    category: 'Sistem Rem',
    brand: 'Daytona Racing',
    stock: 2, // Low stock alert!
    minStock: 6,
    buyPrice: 58000,
    sellPrice: 75000,
    unit: 'Set',
    rackLocation: 'Rak C-2'
  },
  {
    id: 'p-9',
    code: 'CVT-VAN-01',
    name: 'V-Belt Kit + Roller Beat FI KZL',
    category: 'Transmisi / CVT',
    brand: 'Astra Aspira',
    stock: 7,
    minStock: 4,
    buyPrice: 110000,
    sellPrice: 145000,
    unit: 'Set',
    rackLocation: 'Rak D-1'
  },
  {
    id: 'p-10',
    code: 'FLT-HON-01',
    name: 'Filter Udara Vario 125 / 150 KZR',
    category: 'Filter & Karburator',
    brand: 'Honda Genuine Part',
    stock: 11,
    minStock: 5,
    buyPrice: 38000,
    sellPrice: 52000,
    unit: 'Pcs',
    rackLocation: 'Rak E-1'
  },
  {
    id: 'p-11',
    code: 'BAN-IRC-01',
    name: 'Ban Luar Tubeless IRC NR82 90/90-14',
    category: 'Ban & Velg',
    brand: 'IRC Tire',
    stock: 5,
    minStock: 3,
    buyPrice: 175000,
    sellPrice: 215000,
    unit: 'Pcs',
    rackLocation: 'Gudang Belakang'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    invoiceNumber: 'INV-20261006-001',
    date: '06 Okt 2026, 08:35 WIB',
    customerName: 'Bambang Supriyanto',
    plateNumber: 'D 2819 KHG',
    vehicleModel: 'Honda BeAT eSP FI',
    mechanicName: 'Mas Dani',
    items: [
      { id: 'tx-i-1', name: 'Busi NGK MR9C-9N Original', price: 35000, qty: 1, type: 'part' },
      { id: 'tx-i-2', name: 'Jasa Tune Up Injeksi & Reset ECU', price: 50000, qty: 1, type: 'jasa' }
    ],
    subtotal: 85000,
    discount: 5000,
    total: 80000,
    paymentMethod: 'QRIS',
    status: 'Lunas'
  },
  {
    id: 'tx-2',
    invoiceNumber: 'INV-20261006-002',
    date: '06 Okt 2026, 09:05 WIB',
    customerName: 'Hendri Kurnia',
    plateNumber: 'D 3341 XYZ',
    vehicleModel: 'Suzuki Satria F150',
    mechanicName: 'Mas Eko',
    items: [
      { id: 'tx-i-3', name: 'Oli Motul 3100 Silver 1L', price: 75000, qty: 1, type: 'part' },
      { id: 'tx-i-4', name: 'Filter Oli Suzuki Original', price: 25000, qty: 1, type: 'part' },
      { id: 'tx-i-5', name: 'Jasa Ganti Oli & Cek Rantai', price: 20000, qty: 1, type: 'jasa' }
    ],
    subtotal: 120000,
    discount: 0,
    total: 120000,
    paymentMethod: 'Tunai',
    cashPaid: 150000,
    change: 30000,
    status: 'Lunas'
  },
  {
    id: 'tx-3',
    invoiceNumber: 'INV-20261006-003',
    date: '06 Okt 2026, 09:22 WIB',
    customerName: 'Farhan Maulana',
    plateNumber: 'B 6620 GHT',
    vehicleModel: 'Yamaha Fazzio Hybrid',
    mechanicName: 'Mas Joko (Senior)',
    items: [
      { id: 'tx-i-6', name: 'Servis Berkala Fazzio + Injeksi', price: 65000, qty: 1, type: 'jasa' },
      { id: 'tx-i-7', name: 'Yamalube Blue Core 0.8L', price: 55000, qty: 1, type: 'part' },
      { id: 'tx-i-8', name: 'Pembersih CVT Cleaner', price: 25000, qty: 1, type: 'part' }
    ],
    subtotal: 145000,
    discount: 0,
    total: 145000,
    paymentMethod: 'Transfer Bank',
    status: 'Lunas'
  },
  {
    id: 'tx-4',
    invoiceNumber: 'INV-20261006-004',
    date: '06 Okt 2026, 11:15 WIB',
    customerName: 'Pak Wahyu Hidayat',
    plateNumber: 'D 5512 VXZ',
    vehicleModel: 'Honda PCX 160',
    mechanicName: 'Mas Joko (Senior)',
    items: [
      { id: 'tx-i-9', name: 'Jasa Servis CVT & Ganti Roller', price: 65000, qty: 1, type: 'jasa' },
      { id: 'tx-i-10', name: 'Vanbelt Honda PCX 160 Original', price: 135000, qty: 1, type: 'part' }
    ],
    subtotal: 200000,
    discount: 0,
    total: 200000,
    paymentMethod: 'Tunai',
    status: 'Belum Lunas'
  }
];

export const INITIAL_MECHANICS: Mechanic[] = [
  { id: 'm-1', name: 'Mas Joko', role: 'Mekanik Kepala / Senior', phone: '0812-1111-2222', activeTasks: 2, completedToday: 3, rating: 4.9, avatarBg: 'bg-emerald-600' },
  { id: 'm-2', name: 'Mas Dani', role: 'Mekanik CVT & Kelistrikan', phone: '0813-3333-4444', activeTasks: 1, completedToday: 2, rating: 4.8, avatarBg: 'bg-teal-600' },
  { id: 'm-3', name: 'Mas Eko', role: 'Mekanik Servis Ringan & Oli', phone: '0817-5555-6666', activeTasks: 1, completedToday: 4, rating: 4.9, avatarBg: 'bg-green-600' },
  { id: 'm-4', name: 'Mas Ryan', role: 'Spesialis Turun Mesin', phone: '0821-7777-8888', activeTasks: 1, completedToday: 1, rating: 4.9, avatarBg: 'bg-emerald-700' }
];

export const INITIAL_CUSTOMERS: CustomerVehicle[] = [
  // SCOPED: PELANGGAN BENGKEL (OTOMOTIF)
  {
    id: 'c-1',
    name: 'Ahmad Fauzi',
    phone: '081234567890',
    address: 'Jl. Gegerkalong Hilir No. 42, Sukasari, Bandung',
    customer_type: 'bengkel',
    plateNumber: 'D 4521 ABC',
    vehicleBrand: 'Honda',
    vehicleType: 'Vario 160 ABS',
    vehicleModel: 'Honda Vario 160 ABS (2023)',
    year: '2023',
    lastServiceDate: '06 Okt 2026',
    totalVisits: 6,
    loyaltyPoints: 120,
    notes: 'Selalu request oli SPX2 dan servis CVT rutin tiap 4.000 KM.'
  },
  {
    id: 'c-2',
    name: 'Siti Rahmawati',
    phone: '085712389901',
    address: 'Komplek Antapani Mas Blok C2 No. 11, Antapani, Bandung',
    customer_type: 'bengkel',
    plateNumber: 'B 3190 TKL',
    vehicleBrand: 'Yamaha',
    vehicleType: 'NMAX 155 Connected',
    vehicleModel: 'Yamaha NMAX 155 (2022)',
    year: '2022',
    lastServiceDate: '06 Okt 2026',
    totalVisits: 4,
    loyaltyPoints: 80,
    notes: 'Prioritaskan cek kampas rem dan lampu depan LED.'
  },
  {
    id: 'c-3',
    name: 'Bambang Supriyanto',
    phone: '081399881122',
    address: 'Jl. Cikutra Barat No. 89, Cibeunying Kidul, Bandung',
    customer_type: 'bengkel',
    plateNumber: 'D 2819 KHG',
    vehicleBrand: 'Honda',
    vehicleType: 'BeAT eSP CBS ISS',
    vehicleModel: 'Honda BeAT eSP FI (2020)',
    year: '2020',
    lastServiceDate: '06 Okt 2026',
    totalVisits: 8,
    loyaltyPoints: 160,
    notes: 'Member setia sejak 2021, sering ganti busi NGK.'
  },
  {
    id: 'c-4',
    name: 'Kevin Wijaya',
    phone: '082155667788',
    address: 'Jl. Surya Sumantri No. 102, Pasteur, Bandung',
    customer_type: 'bengkel',
    plateNumber: 'D 6044 VXZ',
    vehicleBrand: 'Yamaha',
    vehicleType: 'Aerox 155 CyberCity',
    vehicleModel: 'Yamaha Aerox 155 (2022)',
    year: '2022',
    lastServiceDate: '12 Sep 2026',
    totalVisits: 3,
    loyaltyPoints: 60,
    notes: 'Suka part racing aftermarket (Daytona Gold).'
  },
  {
    id: 'c-5',
    name: 'Dewi Lestari',
    phone: '081987654321',
    address: 'Jl. Buah Batu Raya No. 154, Bandung',
    customer_type: 'bengkel',
    plateNumber: 'D 5122 TUV',
    vehicleBrand: 'Honda',
    vehicleType: 'Scoopy Prestige Smartkey',
    vehicleModel: 'Honda Scoopy Prestige (2024)',
    year: '2024',
    lastServiceDate: '28 Sep 2026',
    totalVisits: 2,
    loyaltyPoints: 40,
    notes: 'Servis berkala gratis pertama dari dealer lewat.'
  },

  // SCOPED: TAMU RESTO / KULINER
  {
    id: 'c-res-1',
    name: 'Hendra Gunawan (Pak Hendra)',
    phone: '081298761100',
    address: 'Dago Atas Kav. 14, Coblong, Bandung',
    customer_type: 'resto',
    plateNumber: '-',
    vehicleModel: 'Tamu Dine-in (Meja 01)',
    year: '-',
    lastServiceDate: '08 Okt 2026',
    favoriteTable: 'Meja 01 (Depan Jendela)',
    dietaryNotes: 'Suka Nasi Goreng Spesial pedas sedang & Es Teh Jumbo',
    totalVisits: 12,
    loyaltyPoints: 240,
    notes: 'Pelanggan tetap makan siang kantor, sering bawa 2-3 rekan.'
  },
  {
    id: 'c-res-2',
    name: 'Ibu Ratna Kumalasari',
    phone: '081377889922',
    address: 'Jl. R.E. Martadinata No. 88, Riau, Bandung',
    customer_type: 'resto',
    plateNumber: '-',
    vehicleModel: 'Tamu Keluarga (Meja 02 / VIP)',
    year: '-',
    lastServiceDate: '07 Okt 2026',
    favoriteTable: 'Meja 02 (Keluarga) / VIP 01',
    dietaryNotes: 'Ayam Bakar Madu & Sop Iga kuah gurih tidak pedas',
    totalVisits: 8,
    loyaltyPoints: 180,
    notes: 'Reservasi rutin akhir pekan untuk keluarga besar.'
  },
  {
    id: 'c-res-3',
    name: 'Dimas Prasetyo',
    phone: '085811223344',
    address: 'Jl. Dipati Ukur No. 45, Lebakgede, Bandung',
    customer_type: 'resto',
    plateNumber: '-',
    vehicleModel: 'Tamu Santai (Meja 03)',
    year: '-',
    lastServiceDate: '08 Okt 2026',
    favoriteTable: 'Meja 03 (Sudut Santai)',
    dietaryNotes: 'Mie Goreng Seafood & Dimsum Kukus',
    totalVisits: 5,
    loyaltyPoints: 95,
    notes: 'Sering kerja remote / WFC sore hari.'
  },

  // SCOPED: MEMBER RITEL / MINIMARKET
  {
    id: 'c-rit-1',
    name: 'Ibu Hj. Maryam Hasan',
    phone: '081222334455',
    address: 'Jl. Cihampelas No. 201, Bandung',
    customer_type: 'ritel',
    plateNumber: '-',
    vehicleModel: 'Member Gold Belanja Sembako',
    year: '-',
    lastServiceDate: '07 Okt 2026',
    memberCardNumber: 'MEMBER-88210',
    memberTier: 'Gold',
    totalVisits: 19,
    loyaltyPoints: 380,
    notes: 'Belanja bulanan sembako, minyak 2L & beras premium.'
  },
  {
    id: 'c-rit-2',
    name: 'Rahmat Hidayat',
    phone: '087766554433',
    address: 'Jl. Pasirkaliki No. 78, Cicendo, Bandung',
    customer_type: 'ritel',
    plateNumber: '-',
    vehicleModel: 'Member Silver Harian',
    year: '-',
    lastServiceDate: '08 Okt 2026',
    memberCardNumber: 'MEMBER-77109',
    memberTier: 'Silver',
    totalVisits: 14,
    loyaltyPoints: 210,
    notes: 'Beli kopi instan renceng, sabun, dan kebutuhan harian.'
  }
];


export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp-1',
    title: 'Reminder Servis Berkala & Ganti Oli Rutin Oktober',
    channel: 'WhatsApp',
    targetAudience: 'Pelanggan servis > 2 bulan lalu (85 Kontak)',
    targetBusinessScope: 'bengkel',
    messageContent: 'Halo Sahabat Bengkel Qu! Mengingatkan motor kesayangan Anda sudah memasuki jadwal servis berkala & ganti oli rutin. Nikmati gratis cek rem & tekanan ban hari ini!',
    sentDate: '06 Okt 2026, 09:30 WIB',
    recipientCount: 85,
    status: 'Terkirim',
    deliveredPercent: 98
  },
  {
    id: 'cmp-2',
    title: 'Promo Paket Servis CVT + Tune Up Matic Diskon 20%',
    channel: 'WhatsApp',
    targetAudience: 'Pemilik Motor Matic (Vario, BeAT, NMAX, Aerox)',
    targetBusinessScope: 'bengkel',
    messageContent: 'Motor terasa berat dan getar di tarikan awal? Rawat CVT motormu di Bengkel Qu dengan potongan 20%! Tunjukkan pesan ini ke kasir.',
    sentDate: '01 Okt 2026, 10:15 WIB',
    recipientCount: 120,
    status: 'Terkirim',
    deliveredPercent: 96
  },
  {
    id: 'cmp-3',
    title: 'Pengumuman Kupon Hadiah Loyalitas Member Bengkel Qu',
    channel: 'Broadcast',
    targetAudience: 'Member dengan Poin > 100',
    targetBusinessScope: 'bengkel',
    messageContent: 'Terima kasih atas kesetiaan Anda! Tukarkan 100 Poin Loyalitas Anda dengan Gratis 1 Botol Oli Mesin MPX2/Yamalube di kasir Bengkel Qu.',
    sentDate: '25 Sep 2026, 14:00 WIB',
    recipientCount: 42,
    status: 'Terkirim',
    deliveredPercent: 100
  },
  {
    id: 'cmp-resto-1',
    title: 'Promo Paket Makan Siang Hemat Dine-in Resto Qu',
    channel: 'WhatsApp',
    targetAudience: 'Tamu Tetap Resto & Pelanggan Meja (Dine-in)',
    targetBusinessScope: 'resto',
    messageContent: 'Halo Kak! Nikmati Paket Makan Siang Hemat di Resto Qu: Nasi Goreng Spesial + Es Teh Jumbo hanya Rp 35.000 (hemat 20%). Meja dingin ber-AC siap menyambut Anda!',
    sentDate: '07 Okt 2026, 11:00 WIB',
    recipientCount: 64,
    status: 'Terkirim',
    deliveredPercent: 97
  },
  {
    id: 'cmp-ritel-1',
    title: 'Flash Sale Akhir Pekan Sembako & Minuman Ritel Qu',
    channel: 'WhatsApp',
    targetAudience: 'Member Belanja Minimarket & Toko',
    targetBusinessScope: 'ritel',
    messageContent: 'Promo Heboh Akhir Pekan Ritel Qu! Dapatkan Minyak Goreng 2L Rp 32.000 dan Beras Premium 5Kg Rp 69.000 khusus member terdaftar. Scan barcode kartu member di kasir!',
    sentDate: '05 Okt 2026, 08:30 WIB',
    recipientCount: 92,
    status: 'Terkirim',
    deliveredPercent: 99
  }
];


export const INITIAL_VOUCHERS: PromoVoucher[] = [
  {
    id: 'vch-1',
    code: 'BENGKELQU10',
    title: 'Diskon Jasa Servis Ringan & Berkala 10%',
    discountType: 'Persen',
    discountValue: 10,
    minTransaction: 80000,
    validUntil: '31 Okt 2026',
    category: 'Jasa Servis',
    quota: 50,
    usedCount: 22,
    isActive: true,
    notes: 'Berlaku untuk semua jenis motor matic dan bebek.'
  },
  {
    id: 'vch-2',
    code: 'OLIBERKAH5',
    title: 'Potongan Langsung Oli Mesin Rp 5.000',
    discountType: 'Nominal',
    discountValue: 5000,
    minTransaction: 50000,
    validUntil: '15 Nov 2026',
    category: 'Oli',
    quota: 100,
    usedCount: 48,
    isActive: true,
    notes: 'Khusus varian oli full synthetic SPX2 dan Yamalube Super Matic.'
  },
  {
    id: 'vch-3',
    code: 'CVTTUNEUP15',
    title: 'Diskon Paket Tune Up + CVT 15%',
    discountType: 'Persen',
    discountValue: 15,
    minTransaction: 100000,
    validUntil: '30 Nov 2026',
    category: 'Jasa Servis',
    quota: 30,
    usedCount: 14,
    isActive: true,
    notes: 'Termasuk pembersihan throttle body dan roller CVT.'
  }
];

export const INITIAL_DAMAGED_GOODS: DamagedGood[] = [
  {
    id: 'dmg-1',
    sparepartId: 'p-1',
    code: 'OIL-AHM-01',
    name: 'AHM Oil MPX2 0.8L (Matic)',
    qty: 1,
    unit: 'Botol',
    damageReason: 'Segel tutup botol bocor rembes saat pengiriman dari distributor',
    reportedBy: 'Mas Dani (Mekanik)',
    date: '06 Okt 2026, 14:15 WIB',
    timestamp: Date.now() - 86400000,
    status: 'Diajukan',
    notes: 'Disimpan di rak retur suplier'
  },
  {
    id: 'dmg-2',
    sparepartId: 'p-5',
    code: 'BS-NGK-01',
    name: 'Busi NGK CPR9EA-9 (Vario/Beat/Scoopy)',
    qty: 2,
    unit: 'Pcs',
    damageReason: 'Keramik busi retak / elektroda bengkok dari kotak kemasan',
    reportedBy: 'Mas Eko (Mekanik)',
    date: '05 Okt 2026, 11:20 WIB',
    timestamp: Date.now() - 172800000,
    status: 'Disetujui SPV',
    notes: 'Menunggu klaim garansi toko agen'
  }
];

export const INITIAL_PROCUREMENTS: ProcurementRecord[] = [
  {
    id: 'po-1',
    poNumber: 'PO-20261006-001',
    code: 'OIL-YAM-01',
    name: 'Yamalube Super Matic 1.0L',
    category: 'Oli & Pelumas',
    supplier: 'PT Yamaha Motor Distributor Jabar',
    qty: 24,
    unit: 'Botol',
    buyPrice: 65000,
    totalCost: 1560000,
    date: '06 Okt 2026, 10:15 WIB',
    timestamp: Date.now() - 3600000 * 20,
    receiver: 'Budi Santoso (Admin Gudang)',
    type: 'Restock',
    notes: 'Faktur lunas tempo 14 hari, barang diterima lengkap dan segel utuh'
  },
  {
    id: 'po-2',
    poNumber: 'PO-20261005-002',
    code: 'CVT-VAN-01',
    name: 'V-Belt Kit + Roller Beat FI KZL',
    category: 'Transmisi / CVT',
    supplier: 'Astra Otoparts Bandung',
    qty: 10,
    unit: 'Set',
    buyPrice: 110000,
    totalCost: 1100000,
    date: '05 Okt 2026, 15:30 WIB',
    timestamp: Date.now() - 3600000 * 45,
    receiver: 'Bpk. Ahmad Fauzi (SPV)',
    type: 'Restock',
    notes: 'Pengadaan berkala stok fast moving CVT'
  },
  {
    id: 'po-3',
    poNumber: 'PO-20261004-001',
    code: 'BAN-IRC-01',
    name: 'Ban Luar Tubeless IRC NR82 90/90-14',
    category: 'Ban & Velg',
    supplier: 'Gajah Tunggal Banindo',
    qty: 8,
    unit: 'Pcs',
    buyPrice: 175000,
    totalCost: 1400000,
    date: '04 Okt 2026, 13:00 WIB',
    timestamp: Date.now() - 3600000 * 70,
    receiver: 'Mas Eko (Mekanik)',
    type: 'Restock',
    notes: 'Restock ban tubeless matic harian'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Stok Suku Cadang Kritis!',
    message: 'AHM Oil MPX2 0.8L sisa 2 botol & Daytona Gold sisa 2 set. Segera order ke suplier.',
    time: '10 menit lalu',
    read: false,
    type: 'stock'
  },
  {
    id: 'notif-2',
    title: 'Servis Selesai Siap Bayar',
    message: 'Honda BeAT (D 2819 KHG) a/n Bambang selesai dikerjakan Mas Dani.',
    time: '25 menit lalu',
    read: false,
    type: 'service'
  },
  {
    id: 'notif-3',
    title: 'Pembayaran QRIS Berhasil',
    message: 'Transaksi #INV-20261006-001 Rp 80.000 via QRIS BCA telah terverifikasi.',
    time: '40 menit lalu',
    read: true,
    type: 'payment'
  }
];

export const QUICK_SERVICE_PACKAGES = [
  { id: 'p-std', name: 'Tune Up + Ganti Oli Matic', price: 95000, timeEst: '30 Menit' },
  { id: 'p-cvt', name: 'Servis CVT Lengkap + Greasing', price: 65000, timeEst: '45 Menit' },
  { id: 'p-inj', name: 'Pembersihan Injektor & Throttle Body', price: 75000, timeEst: '40 Menit' },
  { id: 'p-rem', name: 'Kuras Minyak Rem Depan & Belakang', price: 40000, timeEst: '20 Menit' }
];

// ==========================================
// MODULAR PLUGIN DEFINITIONS (USAHA QU 1.0)
// ==========================================
import { BusinessTypeMeta, DiningTable, FoodMenuItem, RetailProduct, ConsignmentSupplier, ConsignmentProduct } from '../types';

export const BUSINESS_TYPES: BusinessTypeMeta[] = [
  {
    id: 'bengkel',
    name: 'Bengkel Qu',
    shortName: 'Bengkel',
    tagline: 'Otomotif, Servis & Suku Cadang',
    iconName: 'Wrench',
    primaryColor: '#008952',
    badgeLabel: 'Mode Otomotif',
    description: 'Manajemen servis motor/mobil, antrian stall, teknisi/mekanik, dan suku cadang.'
  },
  {
    id: 'resto',
    name: 'Resto Qu',
    shortName: 'Resto & Cafe',
    tagline: 'Kuliner, Meja & Kitchen POS',
    iconName: 'UtensilsCrossed',
    primaryColor: '#e11d48',
    badgeLabel: 'Mode Resto & Kafe',
    description: 'Manajemen meja (Dine-in / Takeaway), open order, dapur (kitchen display), dan kasir kuliner.'
  },
  {
    id: 'ritel',
    name: 'Ritel Qu',
    shortName: 'Toko & Minimarket',
    tagline: 'Scan Barcode, Rak & Kasir Cepat',
    iconName: 'ScanBarcode',
    primaryColor: '#2563eb',
    badgeLabel: 'Mode Ritel & Toko',
    description: 'Kasir kilat scan barcode, penataan rak & lorong barang, serta manajemen grosir/eceran.'
  },
  {
    id: 'collabqu',
    name: 'Collab Qu',
    shortName: 'Titip Jual',
    tagline: 'Konsinyasi, Bagi Hasil & Toko Penitip',
    iconName: 'Handshake',
    primaryColor: '#7c3aed',
    badgeLabel: 'Mode Konsinyasi',
    description: 'Manajemen barang titip jual, pencatatan toko pemasok, komisi otomatis, dan settlement bagi hasil.'
  }
];

export const RESTO_MODULES: MenuModuleConfig[] = [
  {
    id: 'meja-order',
    title: 'Denah / Layout Meja',
    subtitle: 'Dine-In & Takeaway',
    iconName: 'UtensilsCrossed',
    badgeCount: '8 Meja',
    badgeColor: 'bg-rose-500',
    description: 'Tata letak meja, pembagian ruangan, pemesanan meja dan status tagihan tamu terpusat.',
    subMenus: [
      {
        id: 'denah-meja',
        title: 'Denah & Status Meja',
        subtitle: 'Monitoring Meja Terisi & Kosong',
        iconName: 'LayoutGrid',
        badge: 'Live',
        targetView: 'resto-tables'
      },
      {
        id: 'order-baru',
        title: 'Pemesanan Baru (Dine-in)',
        subtitle: 'Input Pesanan Makanan & Minuman',
        iconName: 'ClipboardList',
        badge: 'Order',
        targetView: 'resto-order'
      },
      {
        id: 'takeaway',
        title: 'Pesanan Bungkus (Takeaway)',
        subtitle: 'Pemesanan Cepat Bawa Pulang / Ojol',
        iconName: 'ShoppingBag',
        targetView: 'resto-takeaway'
      },
      {
        id: 'kitchen-display',
        title: 'Kitchen Display (Dapur)',
        subtitle: 'Layar Antrian Masak Koki & Barista',
        iconName: 'Flame',
        badge: 'Dapur',
        targetView: 'resto-kitchen'
      }
    ]
  },
  {
    id: 'kasir',
    title: 'Kasir Resto',
    subtitle: 'Billing & Struk Meja',
    iconName: 'Receipt',
    badgeCount: 'Rp 1.82 Jt',
    badgeColor: 'bg-emerald-600',
    description: 'Pembayaran kasir resto, split bill, cetak struk kasir dan kas kecil.',
    subMenus: [
      {
        id: 'kasir',
        title: 'Kasir POS',
        subtitle: 'Pembayaran Meja & Cetak Struk',
        iconName: 'CreditCard',
        badge: 'Bayar',
        targetView: 'pos-checkout'
      },
      {
        id: 'riwayat-transaksi',
        title: 'Riwayat Transaksi',
        subtitle: 'Log Nota Penjualan Resto',
        iconName: 'FileText',
        targetView: 'pos-history'
      },
      {
        id: 'petty-cash',
        title: 'Petty Cash',
        subtitle: 'Modal Awal Kasir Resto',
        iconName: 'Coins',
        targetView: 'pos-pettycash'
      },
      {
        id: 'kas-kecil',
        title: 'Kas Kecil / Belanja Dapur',
        subtitle: 'Biaya Bahan Mentah & Operasional',
        iconName: 'Receipt',
        targetView: 'pos-expenses'
      },
      {
        id: 'closingan',
        title: 'Closingan Kasir',
        subtitle: 'Tutup Shift Kasir & Rekap Harian',
        iconName: 'Calculator',
        targetView: 'pos-closing'
      }
    ]
  },
  {
    id: 'menu-resto',
    title: 'Menu & Dapur',
    subtitle: 'Katalog Menu Makanan',
    iconName: 'BookOpen',
    badgeCount: '32 Menu',
    badgeColor: 'bg-amber-500',
    description: 'Katalog resep, harga menu makanan/minuman, dan kontrol ketersediaan porsi.',
    subMenus: [
      {
        id: 'katalog-menu',
        title: 'Katalog Menu & Resep',
        subtitle: 'Daftar Menu Makanan, Minuman, Snack',
        iconName: 'ListOrdered',
        targetView: 'resto-menu-catalog'
      },
      {
        id: 'stok-bahan',
        title: 'Bahan Baku & Dapur',
        subtitle: 'Stok Beras, Minyak, Daging & Bumbu',
        iconName: 'Package',
        badge: 'Bahan',
        targetView: 'inv-catalog'
      },
      {
        id: 'stok-kritis',
        title: 'Bahan Kritis Dapur',
        subtitle: 'Bahan Hampir Habis',
        iconName: 'AlertTriangle',
        targetView: 'inv-critical'
      }
    ]
  },
  {
    id: 'pelanggan',
    title: 'Pelanggan',
    subtitle: 'Member & Loyalitas',
    iconName: 'Users',
    badgeCount: 'Member VIP',
    badgeColor: 'bg-blue-500',
    description: 'Data kontak pelanggan resto, poin loyalitas makan, dan preferensi meja.',
    subMenus: [
      {
        id: 'daftar-pelanggan',
        title: 'Daftar Tamu / Member',
        subtitle: 'Nama, Telepon & Riwayat Makan',
        iconName: 'UserCheck',
        targetView: 'cust-master'
      },
      {
        id: 'reservasi-tamu',
        title: 'Reservasi Tempat',
        subtitle: 'Jadwal Booking Meja & Acara',
        iconName: 'Calendar',
        targetView: 'cust-vehicles'
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    subtitle: 'Promo & Diskon Menu',
    iconName: 'Megaphone',
    badgeCount: '3 Promo',
    badgeColor: 'bg-rose-500',
    description: 'Voucher promo makan, paket hemat makan siang, dan broadcast WhatsApp event kuliner.',
    subMenus: [
      {
        id: 'etalase-online',
        title: 'Etalase Menu QR & WA',
        subtitle: 'Katalog Meja & Pesan WhatsApp',
        iconName: 'Globe',
        badge: 'Cloud QR',
        targetView: 'mkt-etalase'
      },
      {
        id: 'broadcast-wa',
        title: 'Broadcast Promo WA',
        subtitle: 'Kirim Info Menu Baru & Diskon',
        iconName: 'Send',
        targetView: 'mkt-broadcast'
      },
      {
        id: 'promo-diskon',
        title: 'Voucher Makan & Paket Hemat',
        subtitle: 'Kelola Kupon Diskon Resto',
        iconName: 'Tag',
        targetView: 'mkt-promo'
      }
    ]
  },
  {
    id: 'laporan',
    title: 'Laporan',
    subtitle: 'Omset & Menu Terlaris',
    iconName: 'BarChart3',
    badgeCount: 'Resto KPI',
    badgeColor: 'bg-emerald-500',
    description: 'Laporan penjualan kuliner per shift, menu paling laku, dan laba kotor harian.',
    subMenus: [
      {
        id: 'laporan-pendapatan',
        title: 'Laporan Pendapatan Resto',
        subtitle: 'Arus Kas Tunai, QRIS & Nontunai',
        iconName: 'TrendingUp',
        targetView: 'rep-revenue'
      },
      {
        id: 'laporan-menu',
        title: 'Laporan Menu Terlaris',
        subtitle: 'Ranking Top Menu Makanan & Minuman',
        iconName: 'Award',
        targetView: 'rep-service'
      }
    ]
  }
];

export const RITEL_MODULES: MenuModuleConfig[] = [
  {
    id: 'kasir-scan',
    title: 'Kasir Cepat',
    subtitle: 'Scan Barcode POS',
    iconName: 'ScanBarcode',
    badgeCount: 'Fast POS',
    badgeColor: 'bg-blue-600',
    description: 'Pusat kasir minimarket/toko kilat scan barcode SKU barang dan cetak struk belanja.',
    subMenus: [
      {
        id: 'kasir',
        title: 'Kasir Scan Barcode',
        subtitle: 'Penjualan Kilat dengan Barcode Scanner',
        iconName: 'ScanLine',
        badge: 'Cepat',
        targetView: 'pos-checkout'
      },
      {
        id: 'riwayat-transaksi',
        title: 'Riwayat Struk Belanja',
        subtitle: 'Semua Nota Kasir Ritel',
        iconName: 'FileText',
        targetView: 'pos-history'
      },
      {
        id: 'petty-cash',
        title: 'Modal Kasir (Petty Cash)',
        subtitle: 'Pecahan Uang Kembalian Laci',
        iconName: 'Coins',
        targetView: 'pos-pettycash'
      },
      {
        id: 'kas-kecil',
        title: 'Kas Kecil Ritel',
        subtitle: 'Biaya Kantong Plastik & Operasional',
        iconName: 'Receipt',
        targetView: 'pos-expenses'
      },
      {
        id: 'closingan',
        title: 'Closingan Kasir Ritel',
        subtitle: 'Rekonsiliasi Laci Kasir & Selisih',
        iconName: 'Calculator',
        targetView: 'pos-closing'
      }
    ]
  },
  {
    id: 'katalog-rak',
    title: 'Katalog & Rak',
    subtitle: 'Lorong & Penataan Toko',
    iconName: 'Boxes',
    badgeCount: '6 Lorong',
    badgeColor: 'bg-indigo-600',
    description: 'Master data barang dagangan, harga ecer/grosir, dan pemetaan posisi rak/lorong toko.',
    subMenus: [
      {
        id: 'katalog-sparepart',
        title: 'Master Produk & Barcode',
        subtitle: 'Daftar Seluruh Barang & SKU',
        iconName: 'Barcode',
        targetView: 'inv-catalog'
      },
      {
        id: 'denah-rak',
        title: 'Peta Rak & Lorong',
        subtitle: 'Lokasi Display Rak A, B, C & Gondola',
        iconName: 'LayoutGrid',
        targetView: 'ritel-racks'
      },
      {
        id: 'stok-kritis',
        title: 'Stok Menipis (Hampir Habis)',
        subtitle: 'Barang di Bawah Batas Minimum Display',
        iconName: 'AlertTriangle',
        badge: 'Re-order',
        targetView: 'inv-critical'
      }
    ]
  },
  {
    id: 'stok-gudang',
    title: 'Gudang & Stok',
    subtitle: 'Inbound & Opname',
    iconName: 'Package',
    badgeCount: 'Inbound',
    badgeColor: 'bg-emerald-600',
    description: 'Penerimaan barang dari supplier, retur barang rusak/kadaluarsa, dan stock opname toko.',
    subMenus: [
      {
        id: 'sparepart-datang',
        title: 'Barang Masuk (Inbound)',
        subtitle: 'Penerimaan Kiriman dari Distributor',
        iconName: 'PlusCircle',
        targetView: 'inv-inbound'
      },
      {
        id: 'barang-rusak',
        title: 'Barang Rusak & Kadaluarsa',
        subtitle: 'Pencatatan Produk Cacat / Expired',
        iconName: 'PackageX',
        targetView: 'inv-damaged'
      },
      {
        id: 'riwayat-pengadaan',
        title: 'Riwayat Order Distributor',
        subtitle: 'Log Pembelian Suplier',
        iconName: 'Truck',
        targetView: 'inv-procurement'
      }
    ]
  },
  {
    id: 'pelanggan',
    title: 'Pelanggan',
    subtitle: 'Member & CRM Toko',
    iconName: 'Users',
    badgeCount: 'Poin',
    badgeColor: 'bg-amber-600',
    description: 'Data member pelanggan setia, riwayat transaksi belanja, dan pengumpulan poin belanja.',
    subMenus: [
      {
        id: 'daftar-pelanggan',
        title: 'Master Member Pelanggan',
        subtitle: 'Nomor WhatsApp & Alamat Member',
        iconName: 'UserCheck',
        targetView: 'cust-master'
      },
      {
        id: 'poin-member',
        title: 'Poin Belanja & Hadiah',
        subtitle: 'Tukar Poin Belanja Jadi Diskon',
        iconName: 'Award',
        targetView: 'cust-vehicles'
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing',
    subtitle: 'Diskon & Flash Sale',
    iconName: 'Megaphone',
    badgeCount: 'Flash Sale',
    badgeColor: 'bg-rose-600',
    description: 'Manajemen kupon voucher diskon belanja, promo bundle, dan broadcast WhatsApp.',
    subMenus: [
      {
        id: 'etalase-online',
        title: 'Etalase Toko Web & WA',
        subtitle: 'Katalog Produk QR & Pesan WhatsApp',
        iconName: 'Globe',
        badge: 'Cloud QR',
        targetView: 'mkt-etalase'
      },
      {
        id: 'broadcast-wa',
        title: 'Broadcast Promo Pelanggan',
        subtitle: 'Kirim Info Diskon Mingguan via WA',
        iconName: 'Send',
        targetView: 'mkt-broadcast'
      },
      {
        id: 'promo-diskon',
        title: 'Voucher & Diskon Rak',
        subtitle: 'Kelola Promo Belanja Toko',
        iconName: 'Tag',
        targetView: 'mkt-promo'
      }
    ]
  },
  {
    id: 'laporan',
    title: 'Laporan',
    subtitle: 'Omset & Profit Toko',
    iconName: 'BarChart3',
    badgeCount: 'Harian',
    badgeColor: 'bg-blue-600',
    description: 'Laporan omset harian kasir, margin keuntungan barang, dan perputaran persediaan.',
    subMenus: [
      {
        id: 'laporan-pendapatan',
        title: 'Laporan Penjualan Toko',
        subtitle: 'Rekap Total Kas, QRIS & Debit',
        iconName: 'TrendingUp',
        targetView: 'rep-revenue'
      },
      {
        id: 'laporan-servis',
        title: 'Produk Paling Laris',
        subtitle: 'Ranking Volume Penjualan Barang',
        iconName: 'Star',
        targetView: 'rep-service'
      }
    ]
  }
];

export const COLLABQU_MODULES: MenuModuleConfig[] = [
  {
    id: 'collab-toko',
    title: 'Data Toko (Penitip)',
    subtitle: 'Mitra & Pemasok Konsinyasi',
    iconName: 'Store',
    badgeCount: '3 Toko',
    badgeColor: 'bg-purple-600',
    description: 'Daftar toko pemasok, nama pemilik/kontak WhatsApp, alamat, dan pin Google Maps.',
    subMenus: [
      {
        id: 'toko-list',
        title: 'Master Toko Penitip',
        subtitle: 'Data Mitra & Kontak WhatsApp',
        iconName: 'Store',
        badge: 'Mitra',
        targetView: 'collabqu'
      },
      {
        id: 'toko-baru',
        title: '+ Toko Baru',
        subtitle: 'Pendaftaran Penitip Konsinyasi',
        iconName: 'PlusCircle',
        badge: 'Form',
        targetView: 'collabqu'
      }
    ]
  },
  {
    id: 'collab-stok',
    title: 'Stok Konsinyasi',
    subtitle: 'Barang Masuk & Sisa Stok',
    iconName: 'Package',
    badgeCount: '4 Item',
    badgeColor: 'bg-purple-600',
    description: 'Pencatatan barang titip jual, harga konsumen, harga netto penitip, dan batas tanggal retur.',
    subMenus: [
      {
        id: 'stok-list',
        title: 'Daftar Barang Titip',
        subtitle: 'Sisa Stok & Status Retur',
        iconName: 'Package',
        targetView: 'collabqu'
      },
      {
        id: 'stok-tambah',
        title: '+ Tambah Stok Titip',
        subtitle: 'Input Barang Titip Jual Baru',
        iconName: 'PlusCircle',
        targetView: 'collabqu'
      }
    ]
  },
  {
    id: 'collab-laporan',
    title: 'Laporan Konsinyasi',
    subtitle: 'Bagi Hasil & Settlement',
    iconName: 'BarChart3',
    badgeCount: 'Rekap',
    badgeColor: 'bg-purple-600',
    description: 'Rekap omset barang titipan, hak bersih yang wajib disetor ke penitip, dan profit komisi toko.',
    subMenus: [
      {
        id: 'laporan-bagi-hasil',
        title: 'Rekap Dana Bagi Hasil',
        subtitle: 'Hak Penitip & Profit Toko',
        iconName: 'DollarSign',
        targetView: 'collabqu'
      },
      {
        id: 'slip-penyetoran',
        title: 'Slip & WhatsApp Penitip',
        subtitle: 'Kirim Laporan via WhatsApp',
        iconName: 'Share2',
        targetView: 'collabqu'
      }
    ]
  },
  {
    id: 'setting',
    title: 'Setting',
    subtitle: 'Pengaturan Tampilan & Sistem',
    iconName: 'Settings',
    badgeCount: 'Sistem',
    badgeColor: 'bg-purple-600',
    description: 'Pengaturan tema tampilan 6 variasi, backup data, dan manajemen penyimpanan modular.',
    subMenus: [
      {
        id: 'setting-tema',
        title: 'Pengaturan Tampilan',
        subtitle: '6 Variasi Tema (Outdoor, OLED, dll)',
        iconName: 'Palette',
        targetView: 'setting-theme'
      },
      {
        id: 'setting-storage',
        title: 'Penyimpanan & Cleaner',
        subtitle: 'Bersihkan Sampah & Indikator Monolith',
        iconName: 'HardDrive',
        targetView: 'setting-storage'
      }
    ]
  }
];

export const INITIAL_DINING_TABLES: DiningTable[] = [
  {
    id: 'tbl-1',
    number: 'Meja 01',
    name: 'Meja 01 (Depan Jendela)',
    capacity: 2,
    zone: 'Indoor (AC)',
    status: 'terisi',
    currentGuestName: 'Pak Hendra (2 Org)',
    guestCount: 2,
    orderTotal: 84000,
    orderTime: '12:15 WIB',
    orderType: 'Dine In',
    items: [
      { name: 'Nasi Goreng Spesial', qty: 2, price: 32000 },
      { name: 'Es Teh Manis Jumbo', qty: 2, price: 10000 }
    ]
  },
  {
    id: 'tbl-2',
    number: 'Meja 02',
    name: 'Meja 02 (Keluarga)',
    capacity: 4,
    zone: 'Indoor (AC)',
    status: 'terisi',
    currentGuestName: 'Ibu Ratna & Rekan',
    guestCount: 4,
    orderTotal: 175000,
    orderTime: '12:28 WIB',
    orderType: 'Dine In',
    items: [
      { name: 'Ayam Bakar Madu Komplit', qty: 3, price: 35000 },
      { name: 'Sop Iga Sapi Kuah Segar', qty: 1, price: 45000 },
      { name: 'Jus Alpukat Kocok', qty: 2, price: 18000 }
    ]
  },
  {
    id: 'tbl-3',
    number: 'Meja 03',
    name: 'Meja 03 (Sudut Santai)',
    capacity: 4,
    zone: 'Indoor (AC)',
    status: 'billing',
    currentGuestName: 'Mas Dimas',
    guestCount: 3,
    orderTotal: 112000,
    orderTime: '11:50 WIB',
    orderType: 'Dine In',
    items: [
      { name: 'Mie Goreng Seafood', qty: 2, price: 36000 },
      { name: 'Dimsum Ayam Kukus (4 pcs)', qty: 2, price: 20000 }
    ]
  },
  {
    id: 'tbl-4',
    number: 'Meja 04',
    name: 'Meja 04',
    capacity: 2,
    zone: 'Indoor (AC)',
    status: 'kosong'
  },
  {
    id: 'tbl-5',
    number: 'Meja 05',
    name: 'Meja 05 (Outdoor Garden)',
    capacity: 4,
    zone: 'Outdoor',
    status: 'terisi',
    currentGuestName: 'Komunitas Gowes',
    guestCount: 4,
    orderTotal: 96000,
    orderTime: '12:40 WIB',
    orderType: 'Dine In',
    items: [
      { name: 'Kopi Susu Gula Aren', qty: 4, price: 18000 },
      { name: 'Kentang Goreng Keju', qty: 2, price: 15000 }
    ]
  },
  {
    id: 'tbl-6',
    number: 'Meja 06',
    name: 'Meja 06 (Outdoor)',
    capacity: 4,
    zone: 'Outdoor',
    status: 'kosong'
  },
  {
    id: 'tbl-7',
    number: 'Meja 07',
    name: 'Meja 07 (Balkon Atas)',
    capacity: 6,
    zone: 'Lantai 2',
    status: 'kosong'
  },
  {
    id: 'tbl-8',
    number: 'VIP 01',
    name: 'Ruang VIP Bintang',
    capacity: 10,
    zone: 'VIP',
    status: 'reservasi',
    currentGuestName: 'Rapat PT Nusantara (14:00 WIB)',
    guestCount: 8,
    orderType: 'Dine In'
  }
];

export const INITIAL_FOOD_MENUS: FoodMenuItem[] = [
  { id: 'm-1', code: 'MK-01', name: 'Nasi Goreng Spesial Telur Ceplok', category: 'Makanan Utama', price: 32000, costPrice: 16000, isAvailable: true, stock: 45, isFavorite: true },
  { id: 'm-2', code: 'MK-02', name: 'Ayam Bakar Madu Sambal Terasi', category: 'Makanan Utama', price: 35000, costPrice: 19000, isAvailable: true, stock: 30, isFavorite: true },
  { id: 'm-3', code: 'MK-03', name: 'Sop Iga Sapi Kuah Rempah', category: 'Makanan Utama', price: 45000, costPrice: 28000, isAvailable: true, stock: 20 },
  { id: 'm-4', code: 'MN-01', name: 'Es Teh Manis Melati Jumbo', category: 'Minuman', price: 8000, costPrice: 2500, isAvailable: true, stock: 120, isFavorite: true },
  { id: 'm-5', code: 'MN-02', name: 'Kopi Susu Gula Aren Asli', category: 'Minuman', price: 18000, costPrice: 7000, isAvailable: true, stock: 80, isFavorite: true },
  { id: 'm-6', code: 'SN-01', name: 'Dimsum Ayam Udang Kukus (4 pcs)', category: 'Snack & Dimsum', price: 20000, costPrice: 9500, isAvailable: true, stock: 50 },
  { id: 'm-7', code: 'SN-02', name: 'Pisang Bakar Coklat Keju', category: 'Snack & Dimsum', price: 16000, costPrice: 7000, isAvailable: true, stock: 40 }
];

export const INITIAL_RETAIL_PRODUCTS: RetailProduct[] = [
  { id: 'ret-1', barcode: '8999908123456', sku: 'SEM-001', name: 'Beras Premium Ramos 5 Kg', category: 'Sembako & Pangan', rackAisle: 'Lorong A - Rak 1', stock: 24, minStock: 5, buyPrice: 68000, sellPrice: 76000, unit: 'Karung', brand: 'Ramos Setra' },
  { id: 'ret-2', barcode: '8998866200112', sku: 'SEM-002', name: 'Minyak Goreng Sawit 2 Liter', category: 'Sembako & Pangan', rackAisle: 'Lorong A - Rak 2', stock: 38, minStock: 10, buyPrice: 32000, sellPrice: 36000, unit: 'Pouch', brand: 'SunCo' },
  { id: 'ret-3', barcode: '8991002105151', sku: 'MUM-001', name: 'Kopi Instan Mix 10 Sachet', category: 'Minuman & Snack', rackAisle: 'Lorong B - Rak 1', stock: 65, minStock: 15, buyPrice: 12500, sellPrice: 15000, unit: 'Pack', brand: 'Kapal Api' },
  { id: 'ret-4', barcode: '8992753210103', sku: 'SNK-001', name: 'Biskuit Gandum Coklat 150g', category: 'Minuman & Snack', rackAisle: 'Lorong B - Rak 3', stock: 42, minStock: 12, buyPrice: 8500, sellPrice: 10500, unit: 'Bks', brand: 'Roma' },
  { id: 'ret-5', barcode: '8993189240019', sku: 'RUM-001', name: 'Sabun Cuci Piring Jeruk Nipis 750ml', category: 'Perlengkapan Rumah', rackAisle: 'Lorong C - Rak 1', stock: 18, minStock: 8, buyPrice: 12000, sellPrice: 14500, unit: 'Btl', brand: 'Sunlight' },
  { id: 'ret-6', barcode: '8994511002341', sku: 'DIR-001', name: 'Sampo Anti Ketombe Menthol 160ml', category: 'Perawatan Diri', rackAisle: 'Lorong C - Rak 2', stock: 15, minStock: 6, buyPrice: 21000, sellPrice: 25000, unit: 'Btl', brand: 'Clear' }
];

export const INITIAL_CONSIGNMENT_SUPPLIERS: ConsignmentSupplier[] = [
  {
    id: 'supp-1',
    storeName: 'Toko Kue Berkah Ibu',
    ownerName: 'Ibu Aminah',
    phone: '081288991122',
    address: 'Jl. Terusan Pasirkoja No. 45, Bandung',
    mapsUrl: 'https://maps.google.com/?q=-6.9248,107.5982',
    joinedDate: '15 Sep 2026',
    status: 'Aktif',
    totalSoldUnits: 68,
    totalSoldRevenue: 1020000,
    totalReturnedUnits: 4,
    totalRestockedUnits: 120,
    activeItemCount: 2
  },
  {
    id: 'supp-2',
    storeName: 'Kripik Pedas Mak Icih',
    ownerName: 'Kang Asep Sudrajat',
    phone: '081399887766',
    address: 'Gg. Harapan II No. 12, Cimahi',
    mapsUrl: 'https://maps.google.com/?q=-6.8722,107.5430',
    joinedDate: '28 Sep 2026',
    status: 'Aktif',
    totalSoldUnits: 45,
    totalSoldRevenue: 900000,
    totalReturnedUnits: 2,
    totalRestockedUnits: 80,
    activeItemCount: 1
  },
  {
    id: 'supp-3',
    storeName: 'Aksesoris Otomotif Racing',
    ownerName: 'Mas Bayu Pratama',
    phone: '085711223344',
    address: 'Sentra Variasi Otista No. 102, Bandung',
    mapsUrl: 'https://maps.google.com/?q=-6.9280,107.6045',
    joinedDate: '02 Okt 2026',
    status: 'Aktif',
    totalSoldUnits: 18,
    totalSoldRevenue: 1350000,
    totalReturnedUnits: 1,
    totalRestockedUnits: 30,
    activeItemCount: 1
  }
];

export const INITIAL_CONSIGNMENT_PRODUCTS: ConsignmentProduct[] = [
  {
    id: 'cprod-1',
    supplierId: 'supp-1',
    supplierName: 'Toko Kue Berkah Ibu',
    productName: 'Brownies Kukus Lumer Mini',
    sku: 'CS-BRW-01',
    consumerPrice: 18000,
    supplierNetPrice: 14500,
    commissionRatePercent: 19.4,
    initialStock: 60,
    currentStock: 22,
    soldStock: 36,
    returnedStock: 2,
    dueDate: '2026-10-25',
    status: 'Tersedia',
    category: 'Kue & Camilan'
  },
  {
    id: 'cprod-2',
    supplierId: 'supp-2',
    supplierName: 'Kripik Pedas Mak Icih',
    productName: 'Kripik Singkong Balado Daun Jeruk',
    sku: 'CS-KRP-02',
    consumerPrice: 20000,
    supplierNetPrice: 16000,
    commissionRatePercent: 20.0,
    initialStock: 53,
    currentStock: 8,
    soldStock: 45,
    returnedStock: 0,
    dueDate: '2026-10-30',
    status: 'Stok Menipis',
    category: 'Snack Kering'
  },
  {
    id: 'cprod-3',
    supplierId: 'supp-3',
    supplierName: 'Aksesoris Otomotif Racing',
    productName: 'Phone Holder Motor Aluminium CNC',
    sku: 'CS-ACC-03',
    consumerPrice: 75000,
    supplierNetPrice: 60000,
    commissionRatePercent: 20.0,
    initialStock: 30,
    currentStock: 11,
    soldStock: 18,
    returnedStock: 1,
    dueDate: '2026-11-10',
    status: 'Tersedia',
    category: 'Aksesoris'
  },
  {
    id: 'cprod-4',
    supplierId: 'supp-1',
    supplierName: 'Toko Kue Berkah Ibu',
    productName: 'Roti Sisir Butter Keju',
    sku: 'CS-RTI-04',
    consumerPrice: 15000,
    supplierNetPrice: 12000,
    commissionRatePercent: 20.0,
    initialStock: 37,
    currentStock: 3,
    soldStock: 32,
    returnedStock: 2,
    dueDate: '2026-10-12',
    status: 'Batas Retur',
    category: 'Roti'
  }
];

