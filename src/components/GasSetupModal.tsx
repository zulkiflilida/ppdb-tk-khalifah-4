import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Save, 
  Code, 
  HelpCircle,
  Sparkles,
  Server
} from 'lucide-react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/gasCode';
import { getApiConfig, saveApiConfig } from '../services/apiService';

interface GasSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasSetupModal: React.FC<GasSetupModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getApiConfig();
  const [useRealGas, setUseRealGas] = useState(currentConfig.useRealGas);
  const [gasUrl, setGasUrl] = useState(currentConfig.gasUrl);
  const [adminToken, setAdminToken] = useState(currentConfig.adminToken);
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleSaveConfig = () => {
    saveApiConfig({
      useRealGas,
      gasUrl: gasUrl.trim(),
      adminToken: adminToken.trim() || 'TK4-SECRET-TOKEN-2026'
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-[32px] max-w-2xl w-full overflow-hidden shadow-2xl border border-orange-100 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black">Pengaturan Backend & Deployment</h3>
              <p className="text-xs text-slate-300">Arsitektur Zero-Cost: Google Sheets + Google Apps Script API</p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Mode Switcher Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-orange-500" />
                  Mode Eksekusi Backend Engine
                </h4>
                <p className="text-xs text-slate-500">Pilih antara Simulator Lokal atau Endpoint Google Apps Script Asli</p>
              </div>

              <button
                type="button"
                onClick={() => setUseRealGas(!useRealGas)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  useRealGas ? 'bg-orange-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    useRealGas ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="text-xs">
              {useRealGas ? (
                <span className="font-bold text-orange-950 bg-orange-100 px-2.5 py-1 rounded-md inline-block">
                  ✓ LIVE MODE: Data akan dikirim & dibaca secara riil ke Google Sheet via GAS Web App.
                </span>
              ) : (
                <span className="font-bold text-slate-800 bg-slate-200 px-2.5 py-1 rounded-md inline-block">
                  ⚡ SIMULATOR MODE: Menggunakan LocalStorage Engine & LockService Emulation (Siap diuji tanpa GAS).
                </span>
              )}
            </div>
          </div>

          {/* Form Real GAS URL Input */}
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                URL Aplikasi Web Google Apps Script (GAS Endpoint)
              </label>
              <input
                type="text"
                value={gasUrl}
                onChange={e => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-[11px] text-slate-500">
                Didapatkan setelah melakukan "Deploy as Web App" pada Google Sheet Anda.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Token Otorisasi Master Admin</label>
              <input
                type="text"
                value={adminToken}
                onChange={e => setAdminToken(e.target.value)}
                placeholder="TK4-SECRET-TOKEN-2026"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Step-by-Step Deployment Protocol */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-orange-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Panduan Setup Google Sheet & Apps Script (100% Bebas Biaya)
              </h4>

              <button
                onClick={handleCopyCode}
                className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'KODE COPIED!' : 'Salin Code.gs'}</span>
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <li>Buka <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-orange-400 underline font-bold">Google Sheets</a> baru. Ubah nama Sheet menjadi <strong>PPDB TK Khalifah 4 Makassar</strong>.</li>
              <li>Buka menu <strong>Ekstensi (Extensions) → Apps Script</strong>.</li>
              <li>Hapus semua kode bawaan, lalu <strong>Tempel (Paste)</strong> kode <code>Code.gs</code> yang disalin di atas. Klik ikon **Simpan** (Diskette).</li>
              <li className="bg-orange-950/60 p-2.5 rounded-xl border border-orange-500/40 text-orange-200 font-medium">
                <strong>PENTING (Folder Drive & Link Gambar):</strong> Pada dropdown fungsi di bagian atas Editor Apps Script, pilih fungsi <code className="text-orange-300 font-mono bg-black/40 px-1 py-0.5 rounded">inisialisasiFolderDanIzinDrive</code> lalu klik <strong>Jalankan (Run)</strong>. Berikan izin akses akun Google Drive saat diminta. Ini akan <strong>otomatis membuat folder PPDB_TK_Khalifah_4_Berkas</strong> dan mengaktifkan URL Google Drive resmi untuk gambar/berkas!
              </li>
              <li>Klik <strong>Deploy → Deployment Baru (New deployment)</strong>.</li>
              <li>Pilih jenis: <strong>Aplikasi Web (Web App)</strong>.</li>
              <li>Jalankan sebagai: <strong>Saya (Me)</strong>. Siapa yang memiliki akses: <strong>Siapa saja (Anyone)</strong>.</li>
              <li>Klik <strong>Deploy</strong>, izinkan akses akun Google, lalu salin <strong>URL Aplikasi Web</strong> ke kolom di atas.</li>
            </ol>

            {/* Toggle View Full Script Code */}
            <div className="pt-2">
              <button
                onClick={() => setShowCodePreview(!showCodePreview)}
                className="text-orange-400 hover:text-orange-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Code className="w-4 h-4" />
                <span>{showCodePreview ? 'Sembunyikan Kode Code.gs' : 'Tampilkan Kode Code.gs Lengkap'}</span>
              </button>

              {showCodePreview && (
                <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </div>
              )}
            </div>

          </div>

          {/* Save Action */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                <Check className="w-4 h-4 text-orange-500" />
                Pengaturan Konfigurasi Berhasil Disimpan!
              </span>
            ) : (
              <span className="text-xs text-slate-400">Tekan simpan untuk memperbarui engine</span>
            )}

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveConfig}
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-orange-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
