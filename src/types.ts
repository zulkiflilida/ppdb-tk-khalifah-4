export type StatusPendaftaran = 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Perlu Berkas';

export type ProgramPilihan = 'Playgroup / KB (Usia 3-4 Tahun)' | 'TK-A (Usia 4-5 Tahun)' | 'TK-B (Usia 5-6 Tahun)';

export type GelombangPendaftaran = 'Gelombang 1 (Early Bird - Diskon 15%)' | 'Gelombang 2 (Reguler)' | 'Gelombang 3 (Susulan)';

export interface Pendaftar {
  id_pendaftaran: string;
  timestamp: string;
  nama_anak: string;
  panggilan_anak?: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tempat_lahir: string;
  tanggal_lahir: string;
  anak_ke?: number;
  jumlah_saudara?: number;
  
  // Data Ortu
  nama_ortu: string;
  hubungan_ortu: 'Ayah' | 'Ibu' | 'Wali';
  pekerjaan_ortu: string;
  nomor_whatsapp: string;
  email_ortu?: string;
  alamat_lengkap: string;
  kecamatan_kota?: string;

  // Berkas Upload Persyaratan PPDB
  berkas_akta?: string; // Data URL or File description
  berkas_kk?: string;
  berkas_foto?: string;
  
  // Program & Status
  program_pilihan: ProgramPilihan;
  gelombang: GelombangPendaftaran;
  status: StatusPendaftaran;
  catatan_admin?: string;
}

export interface AuthAdmin {
  username: string;
  token: string;
  name: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  action_type: 'Register' | 'Update Status' | 'Edit Pendaftar' | 'Delete' | 'Login' | 'Export Data';
  target_id: string;
  details?: string;
}

export interface ApiConfig {
  useRealGas: boolean;
  gasUrl: string;
  adminToken: string;
}
