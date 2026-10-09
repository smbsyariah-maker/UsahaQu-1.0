import React, { useState } from 'react';
import { ArrowLeft, Save, CheckCircle2, Store, User, MapPin, Phone, Mail, Sparkles, Layers } from 'lucide-react';
import { WorkshopProfile, BusinessType } from '../../types';
import { BUSINESS_TYPES } from '../../data/mockData';

interface BasicProfileViewProps {
  onBack: () => void;
  profile: WorkshopProfile;
  onSaveProfile: (updated: WorkshopProfile) => void;
  businessType?: BusinessType;
  onChangeBusinessType?: (type: BusinessType) => void;
}

export const BasicProfileView: React.FC<BasicProfileViewProps> = ({
  onBack,
  profile,
  onSaveProfile,
  businessType = 'bengkel',
  onChangeBusinessType
}) => {
  const [formData, setFormData] = useState<WorkshopProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const currentBusinessMeta = BUSINESS_TYPES.find(b => b.id === businessType) || BUSINESS_TYPES[0];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col">
      {/* Top Header Hijau Solid (Kompak & Bersih) */}
      <div className="bg-[#008952] text-white px-4 py-3 shadow-xs sticky top-0 z-30">
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
              <Store className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">Profil Usaha</h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isSaved && (
          <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-[#008952] rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#008952]" />
            <span>Profil usaha berhasil disimpan dan diperbarui!</span>
          </div>
        )}

        {/* Plugin Mode Selector Card */}
        {onChangeBusinessType && (
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-100 space-y-2.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-[#008952]" />
              <h4 className="text-xs font-bold text-slate-800">Model Usaha Aktif (Plugin)</h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {BUSINESS_TYPES.map((bt) => {
                const isSelected = businessType === bt.id;
                return (
                  <button
                    key={bt.id}
                    type="button"
                    onClick={() => onChangeBusinessType(bt.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 border-[#008952] text-[#008952] font-black shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 font-semibold hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-xs">{bt.name}</span>
                    <span className="text-[9.5px] opacity-75">{bt.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Card Profil Bengkel */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#008952] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Formulir Profil Usaha</h3>
              <p className="text-[11px] text-slate-400">Data resmi identitas outlet & kepemilikan</p>
            </div>
          </div>

          {/* 1. Nama Usaha / Bengkel / Resto */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <Store className="w-3.5 h-3.5 text-[#008952]" />
              Nama Usaha / Outlet *
            </label>
            <input
              type="text"
              required
              value={formData.workshopName}
              onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
              placeholder="Contoh: Usaha Qu Berkah Jaya"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>


          {/* 2. Alamat */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#008952]" />
              Alamat Lengkap *
            </label>
            <textarea
              rows={3}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Contoh: Jl. Otto Iskandardinata No. 128, Bandung"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 3. Nama Pemilik */}
          <div>
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-[#008952]" />
              Nama Pemilik *
            </label>
            <input
              type="text"
              required
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="Contoh: Bpk. Ahmad Fauzi Rachman, S.T."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 4. No HP & 5. Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5 text-[#008952]" />
                Nomor HP / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-[#008952]" />
                Alamat Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Contoh: kontak@bengkelqu-bandung.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#008952] hover:bg-emerald-700 active:scale-98 text-white font-bold py-3 rounded-2xl shadow-md shadow-emerald-700/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 stroke-[2.3]" />
              <span>Simpan Profil Bengkel</span>
            </button>
          </div>
        </form>

        {/* Preview Card Struk / Nota Letterhead */}
        <div className="bg-white rounded-2xl p-4 border border-dashed border-emerald-300 shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
            Pratinjau KOP Nota & Struk Kasir:
          </span>
          <div className="bg-slate-50 rounded-xl p-3 text-center space-y-0.5">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase">{formData.workshopName}</h4>
            <p className="text-[11px] text-slate-600">{formData.address}</p>
            <p className="text-[10px] text-slate-500">
              Pemilik: {formData.ownerName} • WA: {formData.phone} • {formData.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
