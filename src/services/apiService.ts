import { Pendaftar, SystemLog, ApiConfig } from '../types';
import { INITIAL_PENDAFTAR, INITIAL_LOGS } from '../data/initialData';

const CONFIG_KEY = 'ppdb_tk4_api_config';
const LOCAL_STORAGE_KEY = 'ppdb_tk4_pendaftar_db';
const LOGS_STORAGE_KEY = 'ppdb_tk4_logs_db';
const AUTH_KEY = 'ppdb_tk4_auth_session';

export function getApiConfig(): ApiConfig {
  const metaEnv = (import.meta as any).env || {};
  const envGasUrl = (metaEnv.VITE_GAS_URL || '').trim();
  const envUseReal = metaEnv.VITE_USE_REAL_GAS === 'true' || Boolean(envGasUrl);

  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        useRealGas: parsed.useRealGas ?? envUseReal,
        gasUrl: parsed.gasUrl || envGasUrl,
        adminToken: parsed.adminToken || 'TK4-SECRET-TOKEN-2026',
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {
    useRealGas: envUseReal,
    gasUrl: envGasUrl,
    adminToken: 'TK4-SECRET-TOKEN-2026',
  };
}

export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Ensure local storage is seeded with realistic initial data for TK Khalifah 4 Makassar
export function seedLocalStorageIfNeeded(): Pendaftar[] {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PENDAFTAR));
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
    return INITIAL_PENDAFTAR;
  }
  try {
    return JSON.parse(existing);
  } catch {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PENDAFTAR));
    return INITIAL_PENDAFTAR;
  }
}

export function getLocalLogs(): SystemLog[] {
  const existing = localStorage.getItem(LOGS_STORAGE_KEY);
  if (!existing) return INITIAL_LOGS;
  try {
    return JSON.parse(existing);
  } catch {
    return INITIAL_LOGS;
  }
}

export function addLocalLog(actor: string, action_type: SystemLog['action_type'], target_id: string, details?: string) {
  const logs = getLocalLogs();
  const now = new Date();
  const timestamp = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');

  const newLog: SystemLog = {
    id: `LOG-${Date.now()}`,
    timestamp,
    actor,
    action_type,
    target_id,
    details
  };
  logs.unshift(newLog);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
}

export async function submitRegistration(formData: Partial<Pendaftar>): Promise<{ success: boolean; message: string; data?: Pendaftar }> {
  const config = getApiConfig();

  if (config.useRealGas && config.gasUrl) {
    try {
      const response = await fetch(config.gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Apps Script compatible
        },
        body: JSON.stringify({
          action: 'register',
          ...formData
        })
      });

      const resText = await response.text();
      let resJson;
      try {
        resJson = JSON.parse(resText);
      } catch {
        throw new Error('Response dari Google Apps Script bukan JSON yang valid.');
      }

      if (resJson.success) {
        return {
          success: true,
          message: resJson.message || 'Pendaftaran berhasil!',
          data: resJson.data
        };
      } else {
        return {
          success: false,
          message: resJson.message || 'Gagal menyimpan pendaftaran ke Google Sheet.'
        };
      }
    } catch (err: any) {
      console.warn('GAS Endpoint error:', err);
      return {
        success: false,
        message: 'Koneksi ke server gagal. Silakan periksa koneksi internet Anda dan coba lagi.'
      };
    }
  } else {
    // Local Simulator Engine with LockService simulation delay
    await new Promise(res => setTimeout(res, 800));
    return submitRegistrationLocal(formData);
  }
}

function submitRegistrationLocal(formData: Partial<Pendaftar>): { success: boolean; message: string; data: Pendaftar } {
  const list = seedLocalStorageIfNeeded();
  const now = new Date();
  const dateCode = String(now.getFullYear()).substring(2) + String(now.getMonth() + 1).padStart(2, '0');
  const randomNum = Math.floor(100 + Math.random() * 900);
  const id_pendaftaran = `TK4-${dateCode}-${randomNum}`;
  
  const timestamp = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');

  const newPendaftar: Pendaftar = {
    id_pendaftaran,
    timestamp,
    nama_anak: formData.nama_anak || '',
    panggilan_anak: formData.panggilan_anak || '',
    jenis_kelamin: formData.jenis_kelamin || 'Laki-laki',
    tempat_lahir: formData.tempat_lahir || 'Makassar',
    tanggal_lahir: formData.tanggal_lahir || '',
    anak_ke: formData.anak_ke || 1,
    jumlah_saudara: formData.jumlah_saudara || 1,
    nama_ortu: formData.nama_ortu || '',
    hubungan_ortu: formData.hubungan_ortu || 'Ayah',
    pekerjaan_ortu: formData.pekerjaan_ortu || '',
    nomor_whatsapp: formData.nomor_whatsapp || '',
    email_ortu: formData.email_ortu || '',
    alamat_lengkap: formData.alamat_lengkap || '',
    kecamatan_kota: formData.kecamatan_kota || 'Makassar',
    berkas_akta: formData.berkas_akta || '',
    berkas_kk: formData.berkas_kk || '',
    berkas_foto: formData.berkas_foto || '',
    program_pilihan: formData.program_pilihan || 'TK-A (Usia 4-5 Tahun)',
    gelombang: formData.gelombang || 'Gelombang 1 (Early Bird - Diskon 15%)',
    status: 'Menunggu Verifikasi',
    catatan_admin: 'Pendaftaran berhasil diterima oleh sistem. Menunggu jadwal verifikasi fisik oleh Panitia PPDB TK Khalifah 4 Makassar.'
  };

  list.unshift(newPendaftar);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  addLocalLog('Form Public', 'Register', id_pendaftaran, `Pendaftaran baru anak: ${newPendaftar.nama_anak}`);

  return {
    success: true,
    message: 'Pendaftaran berhasil dikirim!',
    data: newPendaftar
  };
}

export async function checkStatus(query: string): Promise<{ success: boolean; data?: Pendaftar; message?: string }> {
  const config = getApiConfig();
  const q = query.trim().toLowerCase();

  if (config.useRealGas && config.gasUrl) {
    try {
      const url = `${config.gasUrl}?action=check_status&query=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('Real GAS check status error, checking local:', e);
      return checkStatusLocal(q);
    }
  } else {
    await new Promise(r => setTimeout(r, 400));
    return checkStatusLocal(q);
  }
}

function checkStatusLocal(q: string): { success: boolean; data?: Pendaftar; message?: string } {
  const list = seedLocalStorageIfNeeded();
  const cleanQ = q.replace(/[^a-zA-Z0-9]/g, '');

  const found = list.find(item => {
    const idClean = String(item.id_pendaftaran || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const waClean = String(item.nomor_whatsapp || '').replace(/[^0-9]/g, '');
    const namaClean = String(item.nama_anak || '').toLowerCase();
    return idClean.includes(cleanQ) || waClean.includes(cleanQ) || namaClean.includes(q.toLowerCase());
  });

  if (found) {
    return { success: true, data: found };
  }
  return {
    success: false,
    message: 'Nomor Registrasi atau WA tidak ditemukan. Pastikan format nomor sudah sesuai.'
  };
}

export async function getAllPendaftar(adminToken: string): Promise<{ success: boolean; data: Pendaftar[]; message?: string }> {
  const config = getApiConfig();

  if (config.useRealGas && config.gasUrl) {
    try {
      const response = await fetch(config.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'get_all',
          admin_token: adminToken
        })
      });
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        const sanitized = json.data.map((item: any) => ({
          ...item,
          id_pendaftaran: String(item.id_pendaftaran || ''),
          timestamp: String(item.timestamp || ''),
          nama_anak: String(item.nama_anak || ''),
          panggilan_anak: String(item.panggilan_anak || ''),
          jenis_kelamin: String(item.jenis_kelamin || 'Laki-laki'),
          tempat_lahir: String(item.tempat_lahir || ''),
          tanggal_lahir: String(item.tanggal_lahir || ''),
          nama_ortu: String(item.nama_ortu || ''),
          hubungan_ortu: String(item.hubungan_ortu || 'Ayah'),
          pekerjaan_ortu: String(item.pekerjaan_ortu || ''),
          nomor_whatsapp: String(item.nomor_whatsapp || ''),
          email_ortu: String(item.email_ortu || ''),
          alamat_lengkap: String(item.alamat_lengkap || ''),
          kecamatan_kota: String(item.kecamatan_kota || ''),
          berkas_akta: String(item.berkas_akta || ''),
          berkas_kk: String(item.berkas_kk || ''),
          berkas_foto: String(item.berkas_foto || ''),
          program_pilihan: String(item.program_pilihan || 'TK-A (Usia 4-5 Tahun)'),
          gelombang: String(item.gelombang || ''),
          status: item.status || 'Menunggu Verifikasi',
          catatan_admin: String(item.catatan_admin || '')
        }));
        return { success: true, data: sanitized };
      }
      return { success: false, data: [], message: json.message || 'Gagal memuat data dari Sheet.' };
    } catch (e: any) {
      console.warn('Real GAS get_all error:', e);
      return { success: true, data: seedLocalStorageIfNeeded() };
    }
  } else {
    await new Promise(r => setTimeout(r, 300));
    return { success: true, data: seedLocalStorageIfNeeded() };
  }
}

export async function updateStatus(
  adminToken: string,
  id_pendaftaran: string,
  newStatus: Pendaftar['status'],
  catatanAdmin?: string
): Promise<{ success: boolean; message: string }> {
  const config = getApiConfig();

  if (config.useRealGas && config.gasUrl) {
    try {
      const res = await fetch(config.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'update_status',
          admin_token: adminToken,
          id_pendaftaran,
          status: newStatus,
          catatan_admin: catatanAdmin || ''
        })
      });
      const json = await res.json();
      return json;
    } catch (e: any) {
      console.warn('Real GAS update error, updating local:', e);
      return updateStatusLocal(id_pendaftaran, newStatus, catatanAdmin);
    }
  } else {
    await new Promise(r => setTimeout(r, 400));
    return updateStatusLocal(id_pendaftaran, newStatus, catatanAdmin);
  }
}

function updateStatusLocal(id_pendaftaran: string, newStatus: Pendaftar['status'], catatanAdmin?: string) {
  const list = seedLocalStorageIfNeeded();
  const idx = list.findIndex(item => item.id_pendaftaran === id_pendaftaran);
  if (idx !== -1) {
    list[idx].status = newStatus;
    if (catatanAdmin !== undefined) {
      list[idx].catatan_admin = catatanAdmin;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    addLocalLog('Admin Panitia', 'Update Status', id_pendaftaran, `Ubah status ke: ${newStatus}`);
    return { success: true, message: 'Status berhasil diperbarui!' };
  }
  return { success: false, message: 'Data pendaftar tidak ditemukan.' };
}

export async function deletePendaftar(adminToken: string, id_pendaftaran: string): Promise<{ success: boolean; message: string }> {
  const config = getApiConfig();

  if (config.useRealGas && config.gasUrl) {
    try {
      const res = await fetch(config.gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          admin_token: adminToken,
          id_pendaftaran
        })
      });
      const json = await res.json();
      return json;
    } catch (e: any) {
      console.warn('Real GAS delete error, deleting local:', e);
      return deletePendaftarLocal(id_pendaftaran);
    }
  } else {
    await new Promise(r => setTimeout(r, 300));
    return deletePendaftarLocal(id_pendaftaran);
  }
}

function deletePendaftarLocal(id_pendaftaran: string) {
  let list = seedLocalStorageIfNeeded();
  list = list.filter(item => item.id_pendaftaran !== id_pendaftaran);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  addLocalLog('Admin Panitia', 'Delete', id_pendaftaran, 'Dihapus dari database');
  return { success: true, message: 'Data pendaftar berhasil dihapus.' };
}

export function setAdminSession(token: string, user: { username: string; name: string }) {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify({ token, user }));
}

export function getAdminSession(): { token: string; user: { username: string; name: string } } | null {
  const saved = sessionStorage.getItem(AUTH_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(AUTH_KEY);
}
