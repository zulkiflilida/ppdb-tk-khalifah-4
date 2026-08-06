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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-200">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-black text-xl tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  TK KHALIFAH 4
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                  Makassar
                </span>
              </div>
              <p className={`text-xs font-medium ${scrolled ? 'text-orange-600' : 'text-slate-400'}`}>
                Membentuk Anak Sholeh & Entrepreneur Cilik
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onOpenCheckStatus}
              className="p-2 rounded-2xl bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-2xl ${scrolled ? 'text-slate-800' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                if (showingAdminDashboard) onToggleAdminView();
                onScrollToInfo();
              }}
              className="text-left py-2 font-medium text-slate-300 hover:text-white"
            >
              Profil & Program Unggulan
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                if (showingAdminDashboard) onToggleAdminView();
                onScrollToForm();
              }}
              className="text-left py-2 font-medium text-slate-300 hover:text-white"
            >
              Alur & Syarat Pendaftaran
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckStatus();
              }}
              className="text-left py-2 font-medium text-orange-400 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Cek Status Pendaftaran & Kelulusan
            </button>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (showingAdminDashboard) onToggleAdminView();
                  onScrollToForm();
                }}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-black text-center shadow-lg shadow-orange-200"
              >
                Formulir Pendaftaran
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onToggleAdminView();
                  }}
                  className="w-full bg-slate-800 text-white py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  {showingAdminDashboard ? 'Kembali ke Portal Wali' : 'Buka Dasbor Admin'}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="w-full text-center py-2 text-xs text-slate-400 flex items-center justify-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  Login Panitia / Admin Sekolah
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
