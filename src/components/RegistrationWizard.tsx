import React, { useState } from 'react';
import { 
  User, 
  Baby, 
  Users, 
  Phone, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  HeartHandshake,
  Check,
  ShieldCheck,
  FileCheck2,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Paperclip,
  CheckCircle2,
  Eye,
  X,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Pendaftar, ProgramPilihan, GelombangPendaftaran } from '../types';
import { submitRegistration } from '../services/apiService';

interface RegistrationWizardProps {
  onSuccess: (pendaftar: Pendaftar) => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Pendaftar>>({
    nama_anak: '',
    panggilan_anak: '',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: 'Makassar',
    tanggal_lahir: '',
    anak_ke: 1,
    jumlah_saudara: 1,
    nama_ortu: '',
    hubungan_ortu: 'Ayah',
    pekerjaan_ortu: '',
    nomor_whatsapp: '',
    email_ortu: '',
    alamat_lengkap: '',
    kecamatan_kota: 'Rappocini, Makassar',
    berkas_akta: '',
    berkas_kk: '',
    berkas_foto: '',
    program_pilihan: 'TK-A (Usia 4-5 Tahun)',
    gelombang: 'Gelombang 1 (Early Bird - Diskon 15%)',
  });

  const [agreed, setAgreed] = useState<boolean>(true);
  const [previewModal, setPreviewModal] = useState<{ title: string; src: string } | null>(null);

  const updateField = (field: keyof Pendaftar, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const compressFileOrImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1000;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.5));
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = () => resolve((event.target?.result as string) || '');
        img.src = (event.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (field: 'berkas_akta' | 'berkas_kk' | 'berkas_foto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran berkas maksimal 5 MB.');
      return;
    }

    try {
      const compressedDataUrl = await compressFileOrImage(file);
      updateField(field, compressedDataUrl);
    } catch (err) {
      setErrorMsg('Gagal memproses file. Silakan pilih file lain.');
    }
  };

  // Age calculation helper
  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let ageYears = today.getFullYear() - dob.getFullYear();
    let ageMonths = today.getMonth() - dob.getMonth();
    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }
    return { years: ageYears, months: ageMonths };
  };

  // Validation Logic
  const validateStep1 = (): boolean => {
    if (!formData.nama_anak || formData.nama_anak.trim().length < 3) {
      setErrorMsg('Nama lengkap calon siswa wajib diisi (minimal 3 karakter).');
      return false;
    }
    if (!formData.tanggal_lahir) {
      setErrorMsg('Tanggal lahir calon siswa wajib diisi.');
      return false;
    }
    const age = calculateAge(formData.tanggal_lahir);
    if (age && age.years < 2) {
      setErrorMsg('Usia minimal calon siswa untuk pendaftaran adalah 2 tahun.');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.nama_ortu || formData.nama_ortu.trim().length < 3) {
      setErrorMsg('Nama orang tua/wali wajib diisi.');
      return false;
    }
    if (!formData.nomor_whatsapp) {
      setErrorMsg('Nomor WhatsApp wajib diisi untuk konfirmasi registrasi.');
      return false;
    }
    const cleanWa = formData.nomor_whatsapp.replace(/[^0-9]/g, '');
    if (cleanWa.length < 9 || cleanWa.length > 15) {
      setErrorMsg('Format nomor WhatsApp tidak valid (harus 9-15 digit, misal: 081245678901).');
      return false;
    }
    if (!formData.alamat_lengkap || formData.alamat_lengkap.trim().length < 5) {
      setErrorMsg('Alamat tempat tinggal wajib diisi dengan lengkap.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg('Anda wajib menyetujui syarat & ketentuan pendaftaran.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await submitRegistration(formData);
      setLoading(false);

      if (res.success && res.data) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onSuccess(res.data);
      } else {
        setErrorMsg(res.message || 'Terjadi kesalahan saat menyimpan pendaftaran.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Koneksi gagal. Silakan coba beberapa saat lagi.');
    }
  };

  const ageInfo = calculateAge(formData.tanggal_lahir);

  return (
    <section id="form-pendaftaran" className="py-12 bg-[#FFF9F2] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white uppercase tracking-wider shadow-md shadow-orange-200">
            <Sparkles className="w-3.5 h-3.5" />
            Formulir Resmi PPDB 2026/2027
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pendaftaran Calon Siswa Baru
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Isi formulir berikut dengan teliti. Pengisian dan upload berkas hanya membutuhkan waktu 2-3 menit.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-[32px] border border-orange-100 shadow-md overflow-hidden">
          
          {/* Step Progress Indicator Bar */}
          <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800">
            <div className="flex items-center justify-between max-w-2xl mx-auto relative">
              
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
              ></div>

              {/* Step 1 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                  step >= 1 ? 'bg-orange-500 text-white ring-4 ring-slate-900 shadow-md shadow-orange-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step > 1 ? <Check className="w-5 h-5 stroke-[3]" /> : '1'}
                </div>
                <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Data Anak</span>
              </div>

              {/* Step 2 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                  step >= 2 ? 'bg-orange-500 text-white ring-4 ring-slate-900 shadow-md shadow-orange-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {step > 2 ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                </div>
                <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Ortu & Berkas</span>
              </div>

              {/* Step 3 Circle */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                  step === 3 ? 'bg-orange-500 text-white ring-4 ring-slate-900 shadow-md shadow-orange-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  3
                </div>
                <span className="text-[11px] font-semibold text-slate-300 hidden sm:inline">Konfirmasi</span>
              </div>

            </div>
          </div>

          {/* Form Content Body */}
          <div className="p-6 sm:p-10">
            
            {/* Error Notification Alert */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-rose-900">Perhatian:</h3>
                  <p>{errorMsg}</p>
                </div>
              </div>
            )}

            {/* STEP 1: DATA CALON SISWA */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Baby className="w-5 h-5 text-orange-500" />
                    Langkah 1: Identitas Calon Peserta Didik
                  </h3>
                  <p className="text-xs text-slate-500">Isi identitas lengkap calon siswa sesuai dokumen resmi / Akta Kelahiran.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  
                  {/* Nama Lengkap Anak */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Nama Lengkap Anak <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama_anak}
                      onChange={e => updateField('nama_anak', e.target.value)}
                      placeholder="Contoh: Andi Muhammad Fathan Al-Fatih"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Nama Panggilan & Jenis Kelamin */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nama Panggilan</label>
                    <input
                      type="text"
                      value={formData.panggilan_anak}
                      onChange={e => updateField('panggilan_anak', e.target.value)}
                      placeholder="Contoh: Fathan"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Jenis Kelamin <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 pt-0.5">
                      <button
                        type="button"
                        onClick={() => updateField('jenis_kelamin', 'Laki-laki')}
                        className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          formData.jenis_kelamin === 'Laki-laki'
                            ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold ring-2 ring-orange-400/20'
                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        👦 Laki-laki
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('jenis_kelamin', 'Perempuan')}
                        className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          formData.jenis_kelamin === 'Perempuan'
                            ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        👧 Perempuan
                      </button>
                    </div>
                  </div>

                  {/* Tempat & Tanggal Lahir */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Tempat Lahir</label>
                    <input
                      type="text"
                      value={formData.tempat_lahir}
                      onChange={e => updateField('tempat_lahir', e.target.value)}
                      placeholder="Contoh: Makassar"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Tanggal Lahir <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_lahir}
                      onChange={e => updateField('tanggal_lahir', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                      required
                    />
                    {ageInfo && (
                      <p className="text-xs text-orange-600 font-semibold pt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Usia saat ini: {ageInfo.years} Tahun {ageInfo.months} Bulan
                      </p>
                    )}
                  </div>

                  {/* Program Pilihan */}
                  <div className="space-y-1.5 md:col-span-2 pt-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Pilihan Jenjang Kelas <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {(['Playgroup / KB (Usia 3-4 Tahun)', 'TK-A (Usia 4-5 Tahun)', 'TK-B (Usia 5-6 Tahun)'] as ProgramPilihan[]).map(prog => (
                        <div
                          key={prog}
                          onClick={() => updateField('program_pilihan', prog)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            formData.program_pilihan === prog
                              ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold ring-2 ring-orange-400/20 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-xs font-bold">{prog.split(' ')[0]} {prog.split(' ')[1]}</p>
                          <p className="text-[11px] text-slate-500 mt-1">{prog.substring(prog.indexOf('('))}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: DATA ORANG TUA / WALI & UNGGAH BERKAS */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Langkah 2: Data Orang Tua & Unggah Berkas Persyaratan
                  </h3>
                  <p className="text-xs text-slate-500">Lengkapi kontak orang tua dan lampirkan berkas fisik calon murid TK (PDF/Gambar).</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  
                  {/* Nama Ortu & Hubungan */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Nama Orang Tua / Wali <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nama_ortu}
                      onChange={e => updateField('nama_ortu', e.target.value)}
                      placeholder="Contoh: Andi Ahmad Fauzi, S.T."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Hubungan Keluarga</label>
                    <select
                      value={formData.hubungan_ortu}
                      onChange={e => updateField('hubungan_ortu', e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all bg-white"
                    >
                      <option value="Ayah">Ayah Kandung</option>
                      <option value="Ibu">Ibu Kandung</option>
                      <option value="Wali">Wali / Keluarga</option>
                    </select>
                  </div>

                  {/* Pekerjaan Ortu */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Pekerjaan Ortu / Wali</label>
                    <input
                      type="text"
                      value={formData.pekerjaan_ortu}
                      onChange={e => updateField('pekerjaan_ortu', e.target.value)}
                      placeholder="Contoh: Wiraswasta / Karyawan / PNS"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={formData.nomor_whatsapp}
                        onChange={e => updateField('nomor_whatsapp', e.target.value)}
                        placeholder="081245678901"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Opsional) */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">
                      Email <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email_ortu}
                      onChange={e => updateField('email_ortu', e.target.value)}
                      placeholder="contoh@gmail.com"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                    />
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      Alamat Tempat Tinggal Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.alamat_lengkap}
                      onChange={e => updateField('alamat_lengkap', e.target.value)}
                      placeholder="Contoh: Jl. Hertasning Raya No. 45, Kompleks IDI"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Kecamatan & Kota</label>
                    <input
                      type="text"
                      value={formData.kecamatan_kota}
                      onChange={e => updateField('kecamatan_kota', e.target.value)}
                      placeholder="Contoh: Rappocini, Makassar"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium transition-all"
                    />
                  </div>

                </div>

                {/* UNGGAH BERKAS PENERIMAAN MURID TK */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Upload className="w-4 h-4 text-orange-500" />
                        Unggah Berkas Syarat Penerimaan Murid TK
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Upload foto/scan dokumen pendukung (Format PDF/JPG/PNG, Max 5 MB per file).
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    
                    {/* 1. AKTA KELAHIRAN */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-orange-500" /> Akta Kelahiran
                          </span>
                          {formData.berkas_akta ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Opsional</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">Scan / Foto jelas Akta Kelahiran Anak</p>
                      </div>

                      {formData.berkas_akta ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                            {formData.berkas_akta.startsWith('data:image') && (
                              <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                                <img src={formData.berkas_akta} alt="Akta Kelahiran" className="h-full object-contain" />
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewModal({ title: 'Akta Kelahiran', src: formData.berkas_akta! })}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Periksa File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateField('berkas_akta', '')}
                                className="text-rose-500 hover:text-rose-700 shrink-0 p-1 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                title="Hapus berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center py-2 px-3 bg-white border border-dashed border-orange-300 rounded-xl hover:bg-orange-50 transition-colors text-xs font-bold text-orange-600">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleFileUpload('berkas_akta', e)}
                            className="hidden"
                          />
                          <span>+ Pilih / Upload File</span>
                        </label>
                      )}
                    </div>

                    {/* 2. KARTU KELUARGA */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-orange-500" /> Kartu Keluarga (KK)
                          </span>
                          {formData.berkas_kk ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Opsional</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">Scan / Foto Kartu Keluarga orang tua</p>
                      </div>

                      {formData.berkas_kk ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                            {formData.berkas_kk.startsWith('data:image') && (
                              <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                                <img src={formData.berkas_kk} alt="Kartu Keluarga" className="h-full object-contain" />
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewModal({ title: 'Kartu Keluarga (KK)', src: formData.berkas_kk! })}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Periksa File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateField('berkas_kk', '')}
                                className="text-rose-500 hover:text-rose-700 shrink-0 p-1 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                title="Hapus berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center py-2 px-3 bg-white border border-dashed border-orange-300 rounded-xl hover:bg-orange-50 transition-colors text-xs font-bold text-orange-600">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleFileUpload('berkas_kk', e)}
                            className="hidden"
                          />
                          <span>+ Pilih / Upload File</span>
                        </label>
                      )}
                    </div>

                    {/* 3. PAS FOTO CALON SISWA */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-orange-500" /> Pas Foto Anak (3x4)
                          </span>
                          {formData.berkas_foto ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terunggah
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-semibold">Opsional</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">Foto terbaru calon murid TK</p>
                      </div>

                      {formData.berkas_foto ? (
                        <div className="space-y-2">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2">
                            {formData.berkas_foto.startsWith('data:image') && (
                              <div className="w-full h-24 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                                <img src={formData.berkas_foto} alt="Pas Foto Anak" className="h-full object-contain" />
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewModal({ title: 'Pas Foto Anak', src: formData.berkas_foto! })}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Periksa Foto</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateField('berkas_foto', '')}
                                className="text-rose-500 hover:text-rose-700 shrink-0 p-1 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                                title="Hapus berkas"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block text-center py-2 px-3 bg-white border border-dashed border-orange-300 rounded-xl hover:bg-orange-50 transition-colors text-xs font-bold text-orange-600">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload('berkas_foto', e)}
                            className="hidden"
                          />
                          <span>+ Pilih / Upload Foto</span>
                        </label>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: KONFIRMASI DATA & SUBMIT */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-orange-500" />
                    Langkah 3: Konfirmasi & Kirim Pendaftaran
                  </h3>
                  <p className="text-xs text-slate-500">Periksa kembali ringkasan data calon siswa sebelum menekan tombol kirim.</p>
                </div>

                {/* Summary Box */}
                <div className="bg-[#FFF9F2] rounded-2xl p-6 border border-orange-100 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Nama Calon Siswa:</span>
                      <p className="font-bold text-sm text-slate-900">{formData.nama_anak}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Jenis Kelamin:</span>
                      <p className="font-semibold text-slate-800">{formData.jenis_kelamin}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Tanggal Lahir:</span>
                      <p className="font-semibold text-slate-800">
                        {formData.tanggal_lahir} ({ageInfo ? `${ageInfo.years} Thn ${ageInfo.months} Bln` : '-'})
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Jenjang Kelas:</span>
                      <p className="font-bold text-orange-600">{formData.program_pilihan}</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">Nama Ortu / Wali:</span>
                      <p className="font-semibold text-slate-800">{formData.nama_ortu} ({formData.hubungan_ortu})</p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-medium">WhatsApp Aktif:</span>
                      <p className="font-bold text-orange-600">{formData.nomor_whatsapp}</p>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-slate-400 font-medium">Alamat:</span>
                      <p className="font-medium text-slate-700">{formData.alamat_lengkap}, {formData.kecamatan_kota}</p>
                    </div>

                    {/* Status Berkas */}
                    <div className="md:col-span-2 pt-2 border-t border-orange-200/60">
                      <span className="text-slate-500 font-bold block mb-1.5">Lampiran Berkas Persyaratan (Klik untuk Cek/Pratinjau):</span>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {formData.berkas_akta ? (
                          <button
                            type="button"
                            onClick={() => setPreviewModal({ title: 'Akta Kelahiran', src: formData.berkas_akta! })}
                            className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Akta Kelahiran (Lihat File)</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg border bg-slate-100 border-slate-200 text-slate-500 font-semibold">
                            Akta: - Belum
                          </span>
                        )}

                        {formData.berkas_kk ? (
                          <button
                            type="button"
                            onClick={() => setPreviewModal({ title: 'Kartu Keluarga (KK)', src: formData.berkas_kk! })}
                            className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Kartu Keluarga (Lihat File)</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg border bg-slate-100 border-slate-200 text-slate-500 font-semibold">
                            KK: - Belum
                          </span>
                        )}

                        {formData.berkas_foto ? (
                          <button
                            type="button"
                            onClick={() => setPreviewModal({ title: 'Pas Foto Anak', src: formData.berkas_foto! })}
                            className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pas Foto (Lihat Foto)</span>
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg border bg-slate-100 border-slate-200 text-slate-500 font-semibold">
                            Pas Foto: - Belum
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gelombang Selection */}
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    Gelombang Pendaftaran Dituju:
                  </span>
                  <p className="font-bold text-sm text-slate-900">{formData.gelombang}</p>
                  <p className="text-orange-800 font-medium">
                    *Mendapatkan potongan khusus 15% untuk biaya pangkal sesuai kebijakan Early Bird PPDB 2026/2027.
                  </p>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="agreed" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
                    Saya menyatakan bahwa data yang saya isikan di atas adalah benar dan dapat dipertanggungjawabkan. Saya bersedia mengikuti aturan & proses verifikasi administrasi PPDB TK Khalifah 4 Makassar.
                  </label>
                </div>

                {/* Submit Action Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-orange-200 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Memproses Pendaftaran...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Kirim Pendaftaran Sekarang</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

            {/* Navigation Next/Back for Steps 1 & 2 */}
            {step < 3 && (
              <div className="pt-8 flex items-center justify-between border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-orange-500 hover:bg-orange-400 text-white px-7 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-orange-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Langkah Berikutnya</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
      {/* MODAL PRATINJAU BERKAS UNTUK ORANG TUA */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-orange-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  Pengecekan Berkas: {previewModal.title}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewModal(null)} 
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Image or PDF preview */}
            <div className="flex-1 overflow-auto bg-slate-900 rounded-2xl p-3 flex items-center justify-center min-h-[300px]">
              {previewModal.src.startsWith('data:image') || previewModal.src.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ? (
                <img 
                  src={previewModal.src} 
                  alt={previewModal.title}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
                />
              ) : previewModal.src.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewModal.src}
                  title={previewModal.title}
                  className="w-full h-[60vh] rounded-xl border-0 bg-white"
                />
              ) : previewModal.src.startsWith('http') ? (
                <iframe
                  src={previewModal.src.includes('drive.google.com') && previewModal.src.match(/\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/)
                    ? `https://drive.google.com/file/d/${previewModal.src.match(/\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/)![1]}/preview`
                    : previewModal.src
                  }
                  title={previewModal.title}
                  className="w-full h-[60vh] rounded-xl border-0 bg-white"
                />
              ) : (
                <div className="text-center text-slate-300 p-8 space-y-2">
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-xs font-mono break-all">{previewModal.src}</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">Pastikan tulisan & foto pada berkas terlihat jelas.</span>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Selesai Periksa
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
