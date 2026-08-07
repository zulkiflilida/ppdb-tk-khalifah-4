import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Lock, 
  Settings, 
  Menu, 
  X, 
  CheckCircle2, 
  ShieldCheck,
  PhoneCall,
  Database
} from 'lucide-react';
import { getApiConfig, getAdminSession } from '../services/apiService';

interface NavbarProps {
  onOpenCheckStatus: () => void;
  onOpenAdminLogin: () => void;
  onScrollToForm: () => void;
  onScrollToInfo: () => void;
  isAdminLoggedIn: boolean;
  onToggleAdminView: () => void;
  showingAdminDashboard: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCheckStatus,
  onOpenAdminLogin,
  onScrollToForm,
  onScrollToInfo,
  isAdminLoggedIn,
  onToggleAdminView,
  showingAdminDashboard
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100' 
        : 'bg-slate-900 text-white'
    }`}>
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              PPDB TA 2026/2027 Telah Dibuka! (Gelombang 1 - Early Bird)
            </span>
            <span className="text-slate-700">|</span>
            <span>📍 Jl. Hertasning Raya / Panakkukang, Makassar</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="https://wa.me/6281245678901?text=Halo%20Admin%20TK%20Khalifah%204%20Makassar,%20saya%20ingin%20bertanya%20seputar%20PPDB" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-orange-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <PhoneCall className="w-3 h-3 text-orange-400" />
              Hotline WA: 0812-4567-8901
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200/50 shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-base sm:text-xl tracking-tight leading-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  TK KHALIFAH 4
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                  Makassar
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs font-medium line-clamp-1 ${scrolled ? 'text-orange-600' : 'text-slate-300'}`}>
                Tauhid & Entrepreneurship Cilik
              </p>
            </div>
          </div>

          {/* Desktop Links & Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => {
                if (showingAdminDashboard) onToggleAdminView();
                onScrollToInfo();
              }}
              className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
                scrolled ? 'text-slate-700 hover:text-orange-600' : 'text-slate-300'
              }`}
            >
              Profil & Program
            </button>
            
            <button 
              onClick={() => {
                if (showingAdminDashboard) onToggleAdminView();
                onScrollToForm();
              }}
              className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
                scrolled ? 'text-slate-700 hover:text-orange-600' : 'text-slate-300'
              }`}
            >
              Alur & Syarat
            </button>

            {/* Cek Status Button */}
            <button
              onClick={onOpenCheckStatus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shadow-xs ${
                scrolled
                  ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                  : 'bg-slate-800 text-orange-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Search className="w-4 h-4 text-orange-500" />
              <span>Cek Status Kelulusan</span>
            </button>

            {/* Main Action: Daftar PPDB */}
            <button
              onClick={() => {
                if (showingAdminDashboard) onToggleAdminView();
                onScrollToForm();
              }}
              className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all transform hover:-translate-y-0.5"
            >
              Daftar Sekarang
            </button>

            {/* Admin Access Toggle / Login */}
            {isAdminLoggedIn ? (
              <button
                onClick={onToggleAdminView}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold transition-all ${
                  showingAdminDashboard
                    ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                    : scrolled ? 'bg-slate-900 text-white' : 'bg-slate-800 text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{showingAdminDashboard ? 'Portal Wali' : 'Dasbor Admin'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold transition-colors ${
                  scrolled ? 'text-slate-500 hover:text-orange-600' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer ${
                scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-slate-800'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-orange-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 backdrop-blur-xl text-white border-t border-slate-800 px-4 py-5 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="max-w-md mx-auto space-y-3">
            
            <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                PPDB TA 2026/2027 Gelombang 1
              </span>
              <a 
                href="https://wa.me/6281245678901?text=Halo%20Admin%20TK%20Khalifah%204%20Makassar,%20saya%20ingin%20bertanya%20seputar%20PPDB"
                target="_blank"
                rel="noreferrer"
                className="text-orange-400 font-bold hover:underline text-[11px]"
              >
                WA Admin
              </a>
            </div>

            <div className="flex flex-col gap-1 pt-1">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (showingAdminDashboard) onToggleAdminView();
                  onScrollToInfo();
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-2"
              >
                <span>✨ Profil & Program Unggulan</span>
              </button>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (showingAdminDashboard) onToggleAdminView();
                  onScrollToForm();
                }}
                className="text-left px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-200 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-2"
              >
                <span>📋 Alur & Syarat Pendaftaran</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCheckStatus();
                }}
                className="text-left px-3 py-2.5 rounded-xl font-bold text-sm text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-orange-400" />
                <span>Cek Status Pendaftaran</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (showingAdminDashboard) onToggleAdminView();
                  onScrollToForm();
                }}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white py-3.5 rounded-2xl font-black text-sm text-center shadow-lg shadow-orange-500/20 active:scale-98 transition-all"
              >
                Isi Formulir Pendaftaran Online
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleAdminView();
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span>{showingAdminDashboard ? 'Kembali ke Portal Wali' : 'Buka Dasbor Admin'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="w-full text-center py-2.5 text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Login Portal Admin / Panitia</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
