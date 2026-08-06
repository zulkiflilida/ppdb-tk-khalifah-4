import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  MessageSquare, 
  Calendar, 
  User, 
  Phone, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Pendaftar } from '../types';

interface RegistrationReceiptModalProps {
  pendaftar: Pendaftar | null;
  onClose: () => void;
}

export const RegistrationReceiptModal: React.FC<RegistrationReceiptModalProps> = ({ pendaftar, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!pendaftar) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(pendaftar.id_pendaftaran);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const waText = encodeURIComponent(
    `Assalamu'alaikum Admin TK Khalifah 4 Makassar,\n\nSaya telah mendaftarkan anak saya:\n- Nama Anak: ${pendaftar.nama_anak}\n- No. Registrasi: ${pendaftar.id_pendaftaran}\n- Program: ${pendaftar.program_pilihan}\n- Nama Ortu: ${pendaftar.nama_ortu}\n- No. WA: ${pendaftar.nomor_whatsapp}\n\nMohon informasi langkah verifikasi berkas selanjutnya. Terima kasih!`
  );

  const waUrl = `https://wa.me/6281245678901?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      
      {/* Printable Receipt Frame */}
      <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-orange-100 my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black">TK KHALIFAH 4 MAKASSAR</h2>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">
              Struk Pendaftaran Resmi PPDB
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Success Banner */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-950 border border-orange-200">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <span>Registrasi Berhasil Disimpan</span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Simpan Nomor Registrasi di bawah ini untuk mengecek status pendaftaran & kelulusan Ananda.
            </p>
          </div>

          {/* Registration ID Box */}
          <div className="bg-[#FFF9F2] border-2 border-dashed border-orange-300 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800">
              Nomor Registrasi PPDB
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider font-mono">
                {pendaftar.id_pendaftaran}
              </span>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white transition-colors cursor-pointer shadow-xs"
                title="Salin Nomor Registrasi"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <p className="text-[11px] text-orange-600 font-bold">✓ Berhasil disalin!</p>}
          </div>

          {/* Details Table */}
          <div className="bg-[#FFF9F2] rounded-2xl p-4 border border-orange-100 text-xs space-y-2.5">
            <div className="flex justify-between border-b border-orange-200/60 pb-2">
              <span className="text-slate-500">Nama Calon Siswa:</span>
              <span className="font-bold text-slate-900">{pendaftar.nama_anak}</span>
            </div>

            <div className="flex justify-between border-b border-orange-200/60 pb-2">
              <span className="text-slate-500">Jenjang Pilihan:</span>
              <span className="font-semibold text-orange-600">{pendaftar.program_pilihan}</span>
            </div>

            <div className="flex justify-between border-b border-orange-200/60 pb-2">
              <span className="text-slate-500">Nama Orang Tua:</span>
              <span className="font-semibold text-slate-800">{pendaftar.nama_ortu}</span>
            </div>

            <div className="flex justify-between border-b border-orange-200/60 pb-2">
              <span className="text-slate-500">Nomor WhatsApp:</span>
              <span className="font-semibold text-slate-800">{pendaftar.nomor_whatsapp}</span>
            </div>

            <div className="flex justify-between border-b border-orange-200/60 pb-2">
              <span className="text-slate-500">Waktu Registrasi:</span>
              <span className="font-medium text-slate-600">{pendaftar.timestamp}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Status Awal:</span>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {pendaftar.status}
              </span>
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-xs text-orange-950 space-y-1.5">
            <h4 className="font-bold flex items-center gap-1.5 text-orange-900">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Langkah Selanjutnya:
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-orange-900 font-medium">
              <li>Konfirmasikan pendaftaran Anda ke WA Admin Sekolah.</li>
              <li>Bawa fotokopi Akte Kelahiran & Kartu Keluarga saat jadwal observasi.</li>
              <li>Pantau status kelulusan berkala di portal ini dengan Nomor Registrasi.</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Konfirmasi Ke WhatsApp Admin Sekolah</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk</span>
              </button>

              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Tutup Window
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
