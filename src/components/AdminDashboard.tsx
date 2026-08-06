import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  Database, 
  Activity, 
  Eye, 
  Check, 
  X, 
  Loader2,
  PhoneCall,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Pendaftar, StatusPendaftaran, SystemLog } from '../types';
import { 
  getAllPendaftar, 
  updateStatus, 
  deletePendaftar, 
  getAdminSession, 
  clearAdminSession, 
  getLocalLogs,
  getApiConfig,
  submitRegistration
} from '../services/apiService';

interface AdminDashboardProps {
  onLogout: () => void;
  onOpenGasSetup: () => void;
  onOpenReceipt: (pendaftar: Pendaftar) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onOpenGasSetup,
  onOpenReceipt
}) => {
  const session = getAdminSession();
  const config = getApiConfig();

  const [applicants, setApplicants] = useState<Pendaftar[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applicants' | 'logs'>('applicants');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [programFilter, setProgramFilter] = useState<string>('ALL');

  // Edit Status Modal State
  const [editingItem, setEditingItem] = useState<Pendaftar | null>(null);
  const [editStatus, setEditStatus] = useState<StatusPendaftaran>('Diterima');
  const [editNotes, setEditNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Detail Modal State
  const [detailItem, setDetailItem] = useState<Pendaftar | null>(null);

  // Image / File Inspection Modal State
  const [imagePreviewModal, setImagePreviewModal] = useState<{ title: string; src: string; pendaftarNama?: string } | null>(null);

  // Last Refreshed Time
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));

  // Manual Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFormData, setNewFormData] = useState<Partial<Pendaftar>>({
    nama_anak: '',
    jenis_kelamin: 'Laki-laki',
    tanggal_lahir: '2021-05-15',
    nama_ortu: '',
    nomor_whatsapp: '',
    alamat_lengkap: 'Jl. Hertasning Makassar',
    program_pilihan: 'TK-A (Usia 4-5 Tahun)',
    gelombang: 'Gelombang 1 (Early Bird - Diskon 15%)',
  });

  const token = session?.token || 'TK4-SECRET-TOKEN-2026';

  const fetchData = async () => {
    setLoading(true);
    const res = await getAllPendaftar(token);
    if (res.success && res.data) {
      setApplicants(res.data);
    }
    setLogs(getLocalLogs());
    setLastRefreshed(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered applicants with safe null checks
  const filteredApplicants = applicants.filter(item => {
    if (!item) return false;
    const q = (searchQuery || '').toLowerCase();
    const namaAnak = (item.nama_anak || '').toLowerCase();
    const idPendaftaran = (item.id_pendaftaran || '').toLowerCase();
    const namaOrtu = (item.nama_ortu || '').toLowerCase();
    const noWa = item.nomor_whatsapp || '';
    const progPilihan = item.program_pilihan || '';

    const matchesSearch = 
      namaAnak.includes(q) ||
      idPendaftaran.includes(q) ||
      namaOrtu.includes(q) ||
      noWa.includes(q);

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesProgram = programFilter === 'ALL' || progPilihan.startsWith(programFilter);

    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Stats Counters
  const totalCount = applicants.length;
  const waitingCount = applicants.filter(a => a?.status === 'Menunggu Verifikasi').length;
  const acceptedCount = applicants.filter(a => a?.status === 'Diterima').length;
  const rejectedCount = applicants.filter(a => a?.status === 'Ditolak').length;
  const needDocsCount = applicants.filter(a => a?.status === 'Perlu Berkas').length;

  const handleOpenEdit = (item: Pendaftar) => {
    setEditingItem(item);
    setEditStatus(item.status);
    setEditNotes(item.catatan_admin || '');
  };

  const handleSaveStatus = async () => {
    if (!editingItem) return;
    setUpdating(true);
    const res = await updateStatus(token, editingItem.id_pendaftaran, editStatus, editNotes);
    setUpdating(false);
    if (res.success) {
      setEditingItem(null);
      fetchData();
    } else {
      alert(res.message || 'Gagal memperbarui status.');
    }
  };

  const handleDelete = async (id: string, nama: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data pendaftar "${nama}" (${id})?`)) {
      setLoading(true);
      const res = await deletePendaftar(token, id);
      if (res.success) {
        fetchData();
      } else {
        alert(res.message);
        setLoading(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (applicants.length === 0) {
      alert('Tidak ada data pendaftar untuk diekspor.');
      return;
    }

    const headers = [
      'ID Pendaftaran',
      'Waktu Submit',
      'Nama Anak',
      'Jenis Kelamin',
      'Tanggal Lahir',
      'Program Pilihan',
      'Nama Ortu',
      'Hubungan',
      'Pekerjaan Ortu',
      'No. WhatsApp',
      'Alamat Lengkap',
      'Status',
      'Catatan Admin'
    ];

    const rows = applicants.map(item => [
      `"${String(item.id_pendaftaran || '')}"`,
      `"${String(item.timestamp || '')}"`,
      `"${String(item.nama_anak || '')}"`,
      `"${String(item.jenis_kelamin || '')}"`,
      `"${String(item.tanggal_lahir || '')}"`,
      `"${String(item.program_pilihan || '')}"`,
      `"${String(item.nama_ortu || '')}"`,
      `"${String(item.hubungan_ortu || '')}"`,
      `"${String(item.pekerjaan_ortu || '-')}"`,
      `"${String(item.nomor_whatsapp || '')}"`,
      `"${String(item.alamat_lengkap || '').replace(/"/g, '""')}"`,
      `"${String(item.status || '')}"`,
      `"${String(item.catatan_admin || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PPDB_TK_Khalifah_4_Makassar_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormData.nama_anak || !newFormData.nama_ortu || !newFormData.nomor_whatsapp) {
      alert('Mohon isi nama anak, nama ortu, dan WhatsApp.');
      return;
    }
    setLoading(true);
    await submitRegistration(newFormData);
    setAddModalOpen(false);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">Dasbor Admin PPDB</h1>
                <span className="text-[10px] font-bold uppercase bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  TK Khalifah 4
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Log Masuk Sebagai: <strong className="text-orange-400">{session?.user?.name || 'Panitia Admin'}</strong>
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            <button
              onClick={onOpenGasSetup}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-orange-400" />
              <span>Config Backend ({config.useRealGas ? 'Live Apps Script' : 'Simulator Mode'})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-orange-500 hover:bg-orange-400 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-orange-500/20"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Ekspor CSV / Excel</span>
            </button>

            <button
              onClick={() => {
                clearAdminSession();
                onLogout();
              }}
              className="bg-rose-900/80 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Admin</span>
            </button>

          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Protected Backend & Deployment Settings Panel */}
        <div className="bg-white rounded-3xl p-6 border border-orange-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              <h3 className="font-black text-slate-900 text-base">Pengaturan Backend & Deployment (GAS)</h3>
              <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-950 px-2.5 py-0.5 rounded-full border border-orange-200">
                {config.useRealGas ? 'Live Google Apps Script' : 'Simulator Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Area khusus panitia untuk mengonfigurasi Webhook Web App, Google Sheets Database, Secret Token, dan Kode Deployment.
            </p>
          </div>
          <button
            onClick={onOpenGasSetup}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Database className="w-4 h-4 text-orange-400" />
            <span>Buka Konfigurasi Server GAS</span>
          </button>
        </div>

        {/* Analytics Summary Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
              <span>Total Pendaftar</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalCount}</p>
            <p className="text-[10px] text-slate-500">Seluruh Berkas Masuk</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-amber-600 text-xs font-semibold">
              <span>Menunggu Verifikasi</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{waitingCount}</p>
            <p className="text-[10px] text-amber-700">Dalam antrean</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-emerald-700 text-xs font-semibold">
              <span>Siswa Diterima</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{acceptedCount}</p>
            <p className="text-[10px] text-emerald-600">Lolos verifikasi</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-sky-700 text-xs font-semibold">
              <span>Perlu Berkas</span>
              <AlertTriangle className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-2xl font-black text-sky-700">{needDocsCount}</p>
            <p className="text-[10px] text-sky-600">Perlu klarifikasi</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center text-rose-600 text-xs font-semibold">
              <span>Belum Diterima</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-rose-600">{rejectedCount}</p>
            <p className="text-[10px] text-rose-600">Ditolak / Batal</p>
          </div>

        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-slate-300 pb-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('applicants')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'applicants'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              Data Pendaftar ({applicants.length})
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'logs'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              <span>System Logs Audit ({logs.length})</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mode On-Demand (Hemat Quota GAS)</span>
              <span className="text-slate-400 font-normal">| Update: {lastRefreshed}</span>
            </div>

            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Input Manual</span>
            </button>

            <button
              onClick={fetchData}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Refresh Data (Manual Sync - Hemat Kuota Apps Script)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-orange-500' : 'text-slate-600'}`} />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DATA PENDAFTAR TABLE */}
        {activeTab === 'applicants' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-4 p-6">
            
            {/* Search & Filter Toolbar */}
            <div className="grid md:grid-cols-12 gap-4">
              
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama anak, No. Reg (TK4-...), nama ortu, atau WA..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="ALL">Semua Status Kelulusan</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Perlu Berkas">Perlu Berkas</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={programFilter}
                  onChange={e => setProgramFilter(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="ALL">Semua Jenjang Kelas</option>
                  <option value="Playgroup">Playgroup / KB</option>
                  <option value="TK-A">TK-A (4-5 Tahun)</option>
                  <option value="TK-B">TK-B (5-6 Tahun)</option>
                </select>
              </div>

            </div>

            {/* Main Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">No. Reg / Waktu</th>
                    <th className="py-3.5 px-4">Nama Anak</th>
                    <th className="py-3.5 px-4">Jenjang</th>
                    <th className="py-3.5 px-4">Orang Tua / WA</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
                        <p>Memuat database pendaftar...</p>
                      </td>
                    </tr>
                  ) : filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada data pendaftar yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((item) => (
                      <tr key={item.id_pendaftaran} className="hover:bg-orange-50/30 transition-colors">
                        
                        {/* Reg ID & Time */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <div>{item.id_pendaftaran}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{item.timestamp}</div>
                        </td>

                        {/* Nama Anak & Gender & Berkas Badges */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.nama_anak}</div>
                          <div className="text-[10px] text-slate-500">
                            {item.jenis_kelamin} • Lahir: {item.tanggal_lahir}
                          </div>
                          {/* Status Berkas Lampiran Interactive */}
                          <div className="flex gap-1 mt-1 text-[9px] font-bold">
                            {item.berkas_akta && item.berkas_akta !== '-' ? (
                              <button
                                type="button"
                                onClick={() => setImagePreviewModal({ title: 'Akta Kelahiran', src: item.berkas_akta!, pendaftarNama: item.nama_anak })}
                                className="text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded border border-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5"
                                title="Klik untuk Periksa Gambar Akta"
                              >
                                <Eye className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Akta ✓</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Akta -</span>
                            )}

                            {item.berkas_kk && item.berkas_kk !== '-' ? (
                              <button
                                type="button"
                                onClick={() => setImagePreviewModal({ title: 'Kartu Keluarga (KK)', src: item.berkas_kk!, pendaftarNama: item.nama_anak })}
                                className="text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded border border-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5"
                                title="Klik untuk Periksa Gambar KK"
                              >
                                <Eye className="w-2.5 h-2.5 text-emerald-600" />
                                <span>KK ✓</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">KK -</span>
                            )}

                            {item.berkas_foto && item.berkas_foto !== '-' ? (
                              <button
                                type="button"
                                onClick={() => setImagePreviewModal({ title: 'Pas Foto 3x4', src: item.berkas_foto!, pendaftarNama: item.nama_anak })}
                                className="text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded border border-emerald-300 transition-colors cursor-pointer flex items-center gap-0.5"
                                title="Klik untuk Periksa Pas Foto"
                              >
                                <Eye className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Foto ✓</span>
                              </button>
                            ) : (
                              <span className="text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">Foto -</span>
                            )}
                          </div>
                        </td>

                        {/* Jenjang */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-orange-950 bg-orange-100 px-2 py-0.5 rounded">
                            {((item.program_pilihan || 'TK-A').split(' ')[0] || '')} {((item.program_pilihan || '').split(' ')[1] || '')}
                          </span>
                        </td>

                        {/* Ortu & WA */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{item.nama_ortu || '-'}</div>
                          <a
                            href={`https://wa.me/${String(item.nomor_whatsapp || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-orange-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <PhoneCall className="w-3 h-3 text-orange-500" />
                            {String(item.nomor_whatsapp || '-')}
                          </a>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                            item.status === 'Diterima'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : item.status === 'Perlu Berkas'
                              ? 'bg-sky-100 text-sky-800 border border-sky-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            
                            <button
                              onClick={() => setDetailItem(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              title="Lihat Detail Profil"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold"
                              title="Ubah Status & Catatan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onOpenReceipt(item)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
                              title="Cetak Struk"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(item.id_pendaftaran, item.nama_anak)}
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700"
                              title="Hapus Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: SYSTEM LOGS TABLE */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Jejak Audit Sistem (System_Logs)</h3>
                <p className="text-xs text-slate-500">Log perubahan status & aktivitas pendaftaran otomatis</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Waktu Log</th>
                    <th className="py-3 px-4">Aktor / Pengguna</th>
                    <th className="py-3 px-4">Jenis Aksi</th>
                    <th className="py-3 px-4">Target ID</th>
                    <th className="py-3 px-4">Detail Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">Belum ada riwayat audit log.</td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{log.actor}</td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {log.action_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-orange-600">{log.target_id}</td>
                        <td className="py-3 px-4 text-slate-600">{log.details || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* MODAL EDIT STATUS */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-orange-100">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Ubah Status Kelulusan</h3>
                <p className="text-xs text-orange-600 font-mono font-bold">{editingItem.id_pendaftaran} - {editingItem.nama_anak}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Pilih Status Baru:</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 font-bold text-xs bg-white text-slate-900"
                >
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi (Amber)</option>
                  <option value="Diterima">Diterima (Emerald Green)</option>
                  <option value="Perlu Berkas">Perlu Berkas (Sky Blue)</option>
                  <option value="Ditolak">Ditolak (Rose Red)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Catatan Admin untuk Ortu:</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Misal: Selamat! Berkas lengkap. Silakan hadir tanggal 10 Agustus untuk pengambilan seragam..."
                  className="w-full px-3 py-2.5 rounded-2xl border border-slate-300 font-medium text-xs text-slate-800"
                />
              </div>

            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={updating}
                className="px-5 py-2 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-200"
              >
                {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Simpan Perubahan</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DETAIL PROFIL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 space-y-5 shadow-2xl border border-orange-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Detail Lengkap Pendaftar</h3>
                <p className="text-xs text-orange-600 font-mono font-bold">{detailItem.id_pendaftaran}</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#FFF9F2] p-4 rounded-2xl border border-orange-100">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-slate-400">Nama Anak:</span> <p className="font-bold text-slate-900">{detailItem.nama_anak}</p></div>
                <div><span className="text-slate-400">Panggilan:</span> <p className="font-medium">{detailItem.panggilan_anak || '-'}</p></div>
                <div><span className="text-slate-400">Jenis Kelamin:</span> <p className="font-medium">{detailItem.jenis_kelamin}</p></div>
                <div><span className="text-slate-400">Tgl Lahir:</span> <p className="font-medium">{detailItem.tanggal_lahir}</p></div>
                <div><span className="text-slate-400">Nama Ortu:</span> <p className="font-semibold">{detailItem.nama_ortu} ({detailItem.hubungan_ortu})</p></div>
                <div><span className="text-slate-400">WhatsApp:</span> <p className="font-bold text-orange-600">{detailItem.nomor_whatsapp}</p></div>
                <div className="col-span-2"><span className="text-slate-400">Alamat:</span> <p className="font-medium">{detailItem.alamat_lengkap}, {detailItem.kecamatan_kota}</p></div>
                <div className="col-span-2"><span className="text-slate-400">Catatan Admin:</span> <p className="font-medium italic text-orange-600">"{detailItem.catatan_admin || 'Belum ada'}"</p></div>
              </div>

              {/* LAMPIRAN BERKAS PENERIMAAN */}
              <div className="pt-3 border-t border-orange-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-orange-500" />
                    Berkas Persyaratan Murid:
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Klik untuk membuka file</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Akta */}
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1.5 shadow-xs">
                    <p className="font-bold text-[10px] text-slate-700">Akta Kelahiran</p>
                    {(() => {
                      const f = detailItem.berkas_akta;
                      if (!f || f === '-' || f === '') return <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md block">Belum Unggah</span>;
                      return (
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setImagePreviewModal({ title: 'Akta Kelahiran', src: f, pendaftarNama: detailItem.nama_anak })}
                            className="inline-flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Periksa File</span>
                          </button>
                          {f.startsWith('http') && (
                            <a href={f} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 w-full px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] transition-colors">
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Google Drive</span>
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* KK */}
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1.5 shadow-xs">
                    <p className="font-bold text-[10px] text-slate-700">Kartu Keluarga (KK)</p>
                    {(() => {
                      const f = detailItem.berkas_kk;
                      if (!f || f === '-' || f === '') return <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md block">Belum Unggah</span>;
                      return (
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setImagePreviewModal({ title: 'Kartu Keluarga (KK)', src: f, pendaftarNama: detailItem.nama_anak })}
                            className="inline-flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Periksa File</span>
                          </button>
                          {f.startsWith('http') && (
                            <a href={f} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 w-full px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] transition-colors">
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Google Drive</span>
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Pas Foto */}
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 text-center space-y-1.5 shadow-xs">
                    <p className="font-bold text-[10px] text-slate-700">Pas Foto (3x4)</p>
                    {(() => {
                      const f = detailItem.berkas_foto;
                      if (!f || f === '-' || f === '') return <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md block">Belum Unggah</span>;
                      return (
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setImagePreviewModal({ title: 'Pas Foto 3x4', src: f, pendaftarNama: detailItem.nama_anak })}
                            className="inline-flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition-colors shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Periksa Foto</span>
                          </button>
                          {f.startsWith('http') && (
                            <a href={f} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 w-full px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[9px] transition-colors">
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>Google Drive</span>
                            </a>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDetailItem(null)}
                className="px-5 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MANUAL ADD PENDAFTAR */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-orange-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base">Input Pendaftaran Manual</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Nama Anak *</label>
                <input
                  type="text"
                  required
                  value={newFormData.nama_anak}
                  onChange={e => setNewFormData({ ...newFormData, nama_anak: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                  placeholder="Nama Lengkap Anak"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Nama Ortu *</label>
                <input
                  type="text"
                  required
                  value={newFormData.nama_ortu}
                  onChange={e => setNewFormData({ ...newFormData, nama_ortu: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                  placeholder="Nama Ortu"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">No. WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={newFormData.nomor_whatsapp}
                  onChange={e => setNewFormData({ ...newFormData, nomor_whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500"
                  placeholder="081245678901"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-md shadow-orange-200"
                >
                  Simpan Manual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PENGECEKAN GAMBAR & BERKAS LAMPIRAN */}
      {imagePreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] max-w-3xl w-full p-6 space-y-4 shadow-2xl border border-orange-200 max-h-[92vh] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full uppercase">
                    Pengecekan Berkas Lampiran
                  </span>
                  {imagePreviewModal.pendaftarNama && (
                    <span className="text-xs font-bold text-slate-700">
                      Anak: {imagePreviewModal.pendaftarNama}
                    </span>
                  )}
                </div>
                <h3 className="font-black text-slate-900 text-lg mt-0.5">{imagePreviewModal.title}</h3>
              </div>
              <button 
                onClick={() => setImagePreviewModal(null)} 
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Image or Embedded Drive File */}
            <div className="flex-1 overflow-hidden bg-slate-900 rounded-2xl p-2 flex flex-col items-center justify-center min-h-[350px] relative">
              {(() => {
                const src = imagePreviewModal.src;
                
                // Base64 or direct image extension
                if (src.startsWith('data:') || src.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)) {
                  return (
                    <img 
                      src={src} 
                      alt={imagePreviewModal.title}
                      className="max-h-[62vh] max-w-full object-contain rounded-xl shadow-lg"
                    />
                  );
                }

                // Check Google Drive Link
                const driveMatch = src.match(/\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
                if (driveMatch && driveMatch[1]) {
                  const fileId = driveMatch[1];
                  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                  return (
                    <div className="w-full h-full min-h-[380px] flex flex-col">
                      <iframe
                        src={embedUrl}
                        title={imagePreviewModal.title}
                        className="w-full h-[60vh] rounded-xl border-0 bg-slate-950"
                        allow="autoplay"
                      />
                    </div>
                  );
                }

                // Generic HTTP/HTTPS link fallback
                if (src.startsWith('http')) {
                  return (
                    <div className="w-full h-full min-h-[380px] flex flex-col">
                      <iframe
                        src={src}
                        title={imagePreviewModal.title}
                        className="w-full h-[60vh] rounded-xl border-0 bg-white"
                      />
                    </div>
                  );
                }

                return (
                  <div className="text-center text-slate-400 p-8 space-y-2">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs font-mono break-all max-w-md mx-auto">{src}</p>
                  </div>
                );
              })()}
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap justify-between items-center gap-2 pt-2">
              <div className="text-[11px] text-slate-500 font-medium">
                {imagePreviewModal.src.startsWith('data:') 
                  ? 'Format: Gambar Base64 Terkompresi' 
                  : imagePreviewModal.src.includes('drive.google.com') 
                  ? 'Tersimpan di Google Drive Cloud Storage'
                  : 'File URL Eksternal'}
              </div>

              <div className="flex items-center gap-2">
                {imagePreviewModal.src.startsWith('http') && (
                  <a
                    href={imagePreviewModal.src}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Google Drive (Tab Baru)</span>
                  </a>
                )}
                {imagePreviewModal.src.startsWith('data:') && (
                  <a
                    href={imagePreviewModal.src}
                    download={`Berkas_${imagePreviewModal.title.replace(/\s+/g, '_')}.jpg`}
                    className="px-4 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold text-xs transition-colors"
                  >
                    Unduh Gambar
                  </a>
                )}
                <button
                  onClick={() => setImagePreviewModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Selesai Periksa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
