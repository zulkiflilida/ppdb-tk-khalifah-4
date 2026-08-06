import React from 'react';
import { 
  Heart, 
  Coins, 
  BookOpenCheck, 
  Smile, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  HelpCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface SchoolProfileProps {
  onScrollToForm: () => void;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({ onScrollToForm }) => {
  return (
    <section id="profil-program" className="py-16 bg-[#FFF9F2] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 1: Core Pillar Programs */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100 px-3.5 py-1 rounded-full">
              Keunggulan Utama
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mengapa Orang Tua Memilih TK Khalifah 4 Makassar?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Kami memadukan pendidikan karakter tauhid, hafalan Al-Qur'an dasar, dan simulasi entrepreneurship sejak usia dini dalam suasana belajar yang menyenangkan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-[32px] p-6 border-b-4 border-orange-400 border-x border-t border-orange-100 shadow-sm hover:shadow-md transition-all group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-200 transition-transform group-hover:scale-105">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tauhid & Adab Islam</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembiasaan sholat dhuha berjamaah, doa harian, adab makan-minum, serta kecintaan kepada Rasulullah SAW sejak dini.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-[32px] p-6 border-b-4 border-green-400 border-x border-t border-green-100 shadow-sm hover:shadow-md transition-all group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center font-bold shadow-md shadow-green-100 transition-transform group-hover:scale-105">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Entrepreneur Cilik</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Praktek Market Day sederhana, menabung, melatih keberanian berkomunikasi, kepemimpinan, dan kreativitas mengolah karya.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-[32px] p-6 border-b-4 border-blue-400 border-x border-t border-blue-100 shadow-sm hover:shadow-md transition-all group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-100 transition-transform group-hover:scale-105">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tahfidz Juz 'Amma</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Target hafalan 15+ surat pendek, 20+ doa harian, dan hadits-hadits pilihan dengan metode tilawati yang mudah dipahami anak.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-[32px] p-6 border-b-4 border-amber-400 border-x border-t border-amber-100 shadow-sm hover:shadow-md transition-all group space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-100 transition-transform group-hover:scale-105">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fun Learning & Calistung</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pembelajaran eksploratif tanpa tekanan, kesiapan membaca, menulis, berhitung (calistung) melalui permainan edukatif.
              </p>
            </div>

          </div>
        </div>

        {/* Section 2: Admission Steps */}
        <div id="alur-syarat" className="bg-slate-900 text-white rounded-[32px] p-8 sm:p-12 shadow-md space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              Tahapan Mudah
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Alur Pendaftaran Peserta Didik Baru
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Proses registrasi berlangsung transparan, cepat, dan dapat dipantau langsung secara online.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 relative">
              <span className="w-9 h-9 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-orange-500/30">
                1
              </span>
              <h3 className="font-bold text-base text-white">Isi Formulir Online</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lengkapi data diri calon siswa & orang tua melalui form pendaftaran online di website ini.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 relative">
              <span className="w-9 h-9 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-orange-500/30">
                2
              </span>
              <h3 className="font-bold text-base text-white">Dapatkan No. Registrasi</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simpan Struk Pendaftaran & Nomor Registrasi unik (misal: TK4-2608-001) untuk verifikasi.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 relative">
              <span className="w-9 h-9 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-orange-500/30">
                3
              </span>
              <h3 className="font-bold text-base text-white">Observasi & Berkas</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hadir bersama Ananda untuk silaturahmi, pengenalan sekolah, dan penyerahan fotokopi Akte/KK.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3 relative">
              <span className="w-9 h-9 rounded-2xl bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-orange-500/30">
                4
              </span>
              <h3 className="font-bold text-base text-white">Pengumuman & Re-Registrasi</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cek status kelulusan di portal ini dan selesaikan daftar ulang untuk pengambilan seragam.
              </p>
            </div>

          </div>
        </div>

        {/* Section 3: Requirements & Investment Info */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Card Requirements */}
          <div className="bg-white rounded-[32px] p-8 border-b-4 border-orange-400 border-x border-t border-orange-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Persyaratan Berkas</h3>
                <p className="text-xs text-slate-500">Syarat kelengkapan administrasi fisik</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Fotokopi Akta Kelahiran Anak (2 Lembar)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Fotokopi Kartu Keluarga / KK (2 Lembar)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Fotokopi KTP Orang Tua / Wali (Ayah & Ibu)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Pas Foto Anak Ukuran 3x4 Warna (4 Lembar)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <span>Mengisi Formulir Pendaftaran Online / Cetak Struk</span>
              </li>
            </ul>
          </div>

          {/* Card Gelombang & Investment */}
          <div className="bg-white rounded-[32px] p-8 border-b-4 border-green-400 border-x border-t border-green-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Jadwal & Gelombang PPDB</h3>
                <p className="text-xs text-slate-500">Dapatkan potongan khusus pendaftaran awal</p>
              </div>
            </div>

            <div className="space-y-3">
              
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full">
                    Gelombang 1 (Early Bird)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Agustus - Oktober 2026</h4>
                  <p className="text-xs text-orange-700 font-medium">Diskon Uang Pangkal 15% + Bonus Seragam Olahraga</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                    Gelombang 2 (Reguler)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">November 2026 - Februari 2027</h4>
                  <p className="text-xs text-slate-500">Biaya Normal</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                    Gelombang 3 (Susulan)
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Maret - Mei 2027</h4>
                  <p className="text-xs text-slate-500">Terbuka jika kuota kelas masih tersedia</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Section 4: Contact & Location in Makassar */}
        <div className="bg-slate-900 text-white rounded-[32px] p-8 sm:p-10 shadow-md">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Lokasi Gedung Sekolah</span>
              <h3 className="text-xl font-black">TK Khalifah 4 Makassar</h3>
              <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                Jl. Hertasning Raya / Panakkukang (Samping Kompleks IDI), Kota Makassar, Sulawesi Selatan 90222
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <span>WhatsApp Panitia: 0812-4567-8901 / 0852-9988-7766</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400" />
                <span>Email: ppdb@tkkhalifah4makassar.sch.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>Jam Layanan: Senin - Sabtu (08.00 - 15.00 WITA)</span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <button
                onClick={onScrollToForm}
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-orange-200 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Daftar Anak Sekarang</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
