import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { setAdminSession } from '../services/apiService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('admintk4');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Username dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Fast local verification or default token setup
    await new Promise(r => setTimeout(r, 400));

    if (username === 'admintk4' && (password === 'bismillah123' || password === 'admin123')) {
      const defaultToken = 'TK4-SECRET-TOKEN-2026';
      setAdminSession(defaultToken, { username: 'admintk4', name: 'Panitia PPDB TK Khalifah 4' });
      setLoading(false);
      onLoginSuccess();
      onClose();
    } else {
      setLoading(false);
      setErrorMsg('Username atau password admin tidak cocok! (Default: admintk4 / bismillah123)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-[32px] max-w-md w-full overflow-hidden shadow-2xl border border-orange-100 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black">Dasbor Login Admin</h3>
            <p className="text-xs text-slate-300">Area Terisolasi Staf Panitia PPDB TK Khalifah 4</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-orange-200 text-xs text-orange-950 space-y-1">
            <p className="font-bold text-orange-900">🔐 Kredensial Default Demo Admin:</p>
            <p>Username: <code className="font-mono bg-orange-100 px-1.5 py-0.5 rounded text-orange-950 font-bold">CHAT ADMIN DI UNTUK TESTING</code></p>
            <p>Password: <code className="font-mono bg-orange-100 px-1.5 py-0.5 rounded text-orange-950 font-bold">bismillah123 </code></p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Username Admin</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Memverifikasi Otorisasi...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" />
                <span>Masuk Ke Dasbor Admin</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
