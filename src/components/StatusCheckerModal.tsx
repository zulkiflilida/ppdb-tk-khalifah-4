import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  GraduationCap, 
  FileText,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Pendaftar, StatusPendaftaran } from '../types';
import { checkStatus } from '../services/apiService';

interface StatusCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPendaftarForReceipt?: (pendaftar: Pendaftar) => void;
}

export const StatusCheckerModal: React.FC<StatusCheckerModalProps> = ({
  isOpen,
  onClose,
  onSelectPendaftarForReceipt
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Pendaftar | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setHasSearched(true);

    try {
      const res = await checkStatus(query);
      setLoading(false);
      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res.message || 'Data pendaftaran tidak ditemukan. Pastikan nomor ID atau WA sudah benar.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    }
  };

  const getStatusBadge = (status: StatusPendaftaran) => {
    switch (status) {
      case 'Diterima':
        return (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-emerald-950">SELAMAT! ANANDA DITERIMA</h4>
            <p className="text-xs text-emerald-800">
              Selamat bergabung menjadi bagian dari Keluarga Besar TK Khalifah 4 Makassar.
            </p>
          </div>
        );
      case 'Ditolak':
        return (
          <div className="bg-rose-50 border border-rose-200 text-rose-950 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto shadow-md">
              <XCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-rose-950">BELUM DAPAT DITERIMA</h4>
            <p className="text-xs text-rose-800">
              Mohon maaf, kuota untuk jenjang kelas ini telah terpenuhi atau belum memenuhi batasan kriteria kualifikasi usia.
            </p>
          </div>
        );
      case 'Perlu Berkas':
        return (
          <div className="bg-sky-50 border border-sky-200 text-sky-950 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-sky-950">PERLU KELENGKAPAN BERKAS</h4>
            <p className="text-xs text-sky-800">
              Ada beberapa berkas pendaftaran fisik yang perlu diklarifikasi atau disusulkan.
            </p>
          </div>
        );
      default:
        return (
          <div className="bg-orange-50 border border-orange-200 text-orange-950 rounded-2xl p-4 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
              <Clock className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-black text-orange-950">MENUNGGU VERIFIKASI</h4>
            <p className="text-xs text-orange-800">
              Pendaftaran Ananda telah masuk dalam antrean verifikasi administrasi Panitia PPDB TK Khalifah 4 Makassar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-orange-100 my-8">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black">Cek Status Kelulusan PPDB</h3>
              <p className="text-xs text-slate-300">Masukkan ID Pendaftaran (ex: TK4-2608-001) atau Nomor WA</p>
            </div>
          </div>
        </div>

        {/* Body Form & Results */}
        <div className="p-6 space-y-6">
          
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="TK4-2608-001 atau 081245678901"
                className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Search className="w-4 h-4 text-white" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              *Tips: Jika lupa No. Pendaftaran, Anda dapat mencari menggunakan nomor WhatsApp yang digunakan saat mengisi form.
            </p>
          </form>

          {/* Search Output Result */}
          {loading && (
            <div className="py-8 text-center space-y-2 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" />
              <p className="text-xs font-medium">Mencari data di database Google Sheet...</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center space-y-1">
              <p className="font-bold">{errorMsg}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Status Badge */}
              {getStatusBadge(result.status)}

              {/* Summary Details */}
              <div className="bg-[#FFF9F2] rounded-2xl p-4 border border-orange-100 text-xs space-y-2">
                <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
                  <span className="text-slate-500">No. Pendaftaran:</span>
                  <span className="font-mono font-bold text-slate-900">{result.id_pendaftaran}</span>
                </div>
                <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
                  <span className="text-slate-500">Nama Anak:</span>
                  <span className="font-bold text-slate-900">{result.nama_anak}</span>
                </div>
                <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
                  <span className="text-slate-500">Jenjang Pilihan:</span>
                  <span className="font-semibold text-orange-600">{result.program_pilihan}</span>
                </div>
                <div className="flex justify-between border-b border-orange-200/60 pb-1.5">
                  <span className="text-slate-500">Nama Orang Tua:</span>
                  <span className="font-medium text-slate-800">{result.nama_ortu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Submit:</span>
                  <span className="font-medium text-slate-600">{result.timestamp}</span>
                </div>
              </div>

              {/* Admin Note Section */}
              {result.catatan_admin && (
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs space-y-1">
                  <span className="font-bold text-orange-900 uppercase tracking-wider text-[10px]">
                    Catatan Resmi Panitia Admin:
                  </span>
                  <p className="text-slate-700 italic leading-relaxed">
                    "{result.catatan_admin}"
                  </p>
                </div>
              )}

              {/* Next Action Buttons */}
              <div className="pt-2 space-y-2">
                {onSelectPendaftarForReceipt && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectPendaftarForReceipt(result);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-200"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Buka / Cetak Struk Pendaftaran Resmi</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/6281245678901?text=Halo%20Admin,%20saya%20mengecek%20status%20PPDB%20No:%20${result.id_pendaftaran}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 px-4 rounded-2xl text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-orange-500" />
                  <span>Hubungi Hotline WA Admin Sekolah</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
