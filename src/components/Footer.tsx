import React from 'react';
import { GraduationCap, Heart, MapPin, Phone, Mail, Clock, ArrowUp, Lock, Database } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onOpenAdminLogin }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">TK KHALIFAH 4</h3>
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Makassar</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pendidikan Anak Usia Dini Berbasis Tauhid & Entrepreneurship sejak dini. Membentuk generasi pembuka pintu kebaikan dan pebisnis muslim sholeh masa depan.
            </p>

            <div className="text-xs text-orange-300 font-semibold italic">
              "Didiklah anakmu sesuai dengan zamannya."
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-orange-400 uppercase tracking-wider">Navigasi Utama</h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><a href="#profil-program" className="hover:text-white transition-colors">Profil & Program Unggulan</a></li>
              <li><a href="#alur-syarat" className="hover:text-white transition-colors">Alur & Syarat Pendaftaran</a></li>
              <li><a href="#form-pendaftaran" className="hover:text-white transition-colors">Formulir Pendaftaran Online</a></li>
              <li><button onClick={onOpenAdminLogin} className="hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer"><Lock className="w-3 h-3 text-orange-400" /> Portal Login Panitia Admin</button></li>
            </ul>
          </div>

          {/* Program Options */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-sm text-orange-400 uppercase tracking-wider">Jenjang Pendidikan</h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Kelompok Bermain / Playgroup (Usia 3-4 Tahun)</li>
              <li>• Taman Kanak-Kanak Kelompok A (Usia 4-5 Tahun)</li>
              <li>• Taman Kanak-Kanak Kelompok B (Usia 5-6 Tahun)</li>
              <li>• Program Tahfidz Anak & Hadits Pilihan</li>
              <li>• Simulasi Entrepreneurship Cilik (Market Day)</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-sm text-orange-400 uppercase tracking-wider">Kontak & Sekretariat</h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Jl. Hertasning Raya / Panakkukang (Komp. IDI), Kota Makassar, Sulawesi Selatan 90222</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Hotline WA: 0812-4567-8901 / 0852-9988-7766</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <span>ppdb@tkkhalifah4makassar.sch.id</span>
            </p>
          </div>

        </div>

        {/* Bottom copyright & Scroll to top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 TK Khalifah 4 Makassar. All rights reserved. Zero-Cost System Architecture.</p>
          
          <button
            onClick={onScrollToTop}
            className="bg-slate-800 hover:bg-slate-700 text-orange-400 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
