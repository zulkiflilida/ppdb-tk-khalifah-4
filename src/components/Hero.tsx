import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award, BookOpen, Search, CheckCircle } from 'lucide-react';

interface HeroProps {
  onScrollToForm: () => void;
  onOpenCheckStatus: () => void;
  onScrollToInfo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm, onOpenCheckStatus, onScrollToInfo }) => {
  return (
    <div className="relative bg-[#FFF9F2] text-slate-800 overflow-hidden pt-8 pb-16 lg:pb-24 border-b border-orange-100">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-400/15 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badges */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-orange-500 text-white shadow-md shadow-orange-200 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                PPDB Online TA 2026 / 2027
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-200">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                TK Islam Unggulan Makassar
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Pendaftaran Peserta Didik Baru <br className="hidden sm:inline" />
              <span className="text-orange-600">
                TK Khalifah 4 Makassar
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Pelopor Pendidikan Anak Usia Dini Berbasis <strong className="text-orange-600 font-bold">Tauhid & Entrepreneurship</strong> sejak dini. Membentuk karakter anak yang sholeh, cerdas, mandiri, dan berakhlak mulia di Kota Makassar.
            </p>

            {/* Feature Pills */}
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-orange-200 shadow-xs">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>Tahfidz Juz 'Amma & Hadits</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-orange-200 shadow-xs">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>Praktek Entrepreneur Cilik</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-2xl border border-orange-200 shadow-xs">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>Fun Learning & Kurikulum Merdeka</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-2xl font-black text-base shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Isi Formulir Pendaftaran</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={onOpenCheckStatus}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-white px-6 py-4 rounded-2xl font-bold text-base shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-5 h-5 text-white" />
                <span>Cek Status Pendaftaran</span>
              </button>
            </div>

            {/* Micro reassurance */}
            <p className="text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Sistem Pendaftaran Aman & Bebas Biaya Pendaftaran Online (Zero Cost Admin System)</span>
            </p>

          </div>

          {/* Right Column: Hero Card Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-orange-400 to-amber-300 opacity-30 blur-xl"></div>
              
              {/* Main Card - Vibrant Palette standard Card */}
              <div className="relative bg-white border-b-4 border-orange-400 border-x border-t border-orange-100 rounded-[32px] p-6 sm:p-8 shadow-md space-y-6">
                
                {/* Gelombang Banner */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md shadow-orange-200">
                    G1
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-orange-600">Gelombang 1 - Early Bird</h2>
                    <p className="text-sm font-black text-slate-900">Diskon SPP / Uang Pangkal 15%</p>
                    <p className="text-[11px] text-slate-500 font-medium">Kuota Terbatas: Sisa 14 Kursi Lagi!</p>
                  </div>
                </div>

                {/* Program Options Showcase */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilihan Kelas & Usia:</h2>
                  
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-orange-100 flex justify-between items-center hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                        PG
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Playgroup / Kelompok Bermain</h3>
                        <p className="text-xs text-slate-500">Usia 3 - 4 Tahun</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                      Tersedia
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-orange-100 flex justify-between items-center hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                        TKA
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">TK Kelompok A</h3>
                        <p className="text-xs text-slate-500">Usia 4 - 5 Tahun</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      Favorit
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-orange-100 flex justify-between items-center hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                        TKB
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">TK Kelompok B</h3>
                        <p className="text-xs text-slate-500">Usia 5 - 6 Tahun</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                      Tersedia
                    </span>
                  </div>
                </div>

                {/* Counter Stats */}
                <div className="pt-2 grid grid-cols-3 gap-2 text-center border-t border-slate-100">
                  <div className="p-2">
                    <p className="text-xl font-black text-orange-600">100%</p>
                    <p className="text-[10px] font-semibold text-slate-400">Guru Berpengalaman</p>
                  </div>
                  <div className="p-2 border-x border-slate-100">
                    <p className="text-xl font-black text-orange-600">1:10</p>
                    <p className="text-[10px] font-semibold text-slate-400">Rasio Guru:Murid</p>
                  </div>
                  <div className="p-2">
                    <p className="text-xl font-black text-orange-600">98%</p>
                    <p className="text-[10px] font-semibold text-slate-400">Orang Tua Puas</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
