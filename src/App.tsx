import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SchoolProfile } from './components/SchoolProfile';
import { RegistrationWizard } from './components/RegistrationWizard';
import { RegistrationReceiptModal } from './components/RegistrationReceiptModal';
import { StatusCheckerModal } from './components/StatusCheckerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { GasSetupModal } from './components/GasSetupModal';
import { Footer } from './components/Footer';
import { Pendaftar } from './types';
import { getAdminSession, seedLocalStorageIfNeeded } from './services/apiService';

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const [showingAdminDashboard, setShowingAdminDashboard] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Modals state
  const [checkStatusOpen, setCheckStatusOpen] = useState<boolean>(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);
  const [gasSetupOpen, setGasSetupOpen] = useState<boolean>(false);
  const [activeReceiptPendaftar, setActiveReceiptPendaftar] = useState<Pendaftar | null>(null);

  useEffect(() => {
    // Seed initial local storage with realistic mock data for preview
    seedLocalStorageIfNeeded();
    
    // Check initial admin session
    const session = getAdminSession();
    if (session && session.token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleScrollToForm = () => {
    const el = document.getElementById('form-pendaftaran');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToInfo = () => {
    const el = document.getElementById('profil-program');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (pendaftar: Pendaftar) => {
    setActiveReceiptPendaftar(pendaftar);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowingAdminDashboard(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowingAdminDashboard(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Universal Navigation Header */}
      <Navbar
        onOpenCheckStatus={() => setCheckStatusOpen(true)}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
        onScrollToForm={handleScrollToForm}
        onScrollToInfo={handleScrollToInfo}
        isAdminLoggedIn={isAdminLoggedIn}
        onToggleAdminView={() => setShowingAdminDashboard(!showingAdminDashboard)}
        showingAdminDashboard={showingAdminDashboard}
      />

      {/* Main View Router Condition */}
      {showingAdminDashboard ? (
        <ErrorBoundary fallbackTitle="Kendala Memuat Panel Admin" onReset={handleAdminLogout}>
          <AdminDashboard
            onLogout={handleAdminLogout}
            onOpenGasSetup={() => setGasSetupOpen(true)}
            onOpenReceipt={(pendaftar) => setActiveReceiptPendaftar(pendaftar)}
          />
        </ErrorBoundary>
      ) : (
        <main>
          {/* Hero Banner Section */}
          <Hero
            onScrollToForm={handleScrollToForm}
            onOpenCheckStatus={() => setCheckStatusOpen(true)}
            onScrollToInfo={handleScrollToInfo}
          />

          {/* School Profile & Program Highlights */}
          <SchoolProfile onScrollToForm={handleScrollToForm} />

          {/* Registration Form Wizard */}
          <RegistrationWizard onSuccess={handleRegistrationSuccess} />
        </main>
      )}

      {/* Footer */}
      <Footer
        onScrollToTop={handleScrollToTop}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* MODAL DIALOGS */}
      
      {/* 1. Status Checker Modal */}
      <StatusCheckerModal
        isOpen={checkStatusOpen}
        onClose={() => setCheckStatusOpen(false)}
        onSelectPendaftarForReceipt={(pendaftar) => setActiveReceiptPendaftar(pendaftar)}
      />

      {/* 2. Registration Digital Receipt Modal */}
      <RegistrationReceiptModal
        pendaftar={activeReceiptPendaftar}
        onClose={() => setActiveReceiptPendaftar(null)}
      />

      {/* 3. Admin Login Auth Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 4. Google Apps Script Configuration & Code.gs Modal */}
      <GasSetupModal
        isOpen={gasSetupOpen}
        onClose={() => setGasSetupOpen(false)}
      />

    </div>
  );
}
