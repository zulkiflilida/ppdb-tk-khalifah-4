export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * SISTEM PPDB ENTERPRISE - TK KHALIFAH 4 MAKASSAR (BACKEND ENGINE)
 * ==============================================================================
 * File: Code.gs
 * Target Database: Google Sheets
 * Topologi: Single Web App Endpoint with LockService & Authentication Guard
 * 
 * PANDUAN DEPLOYMENT GOOGLE APPS SCRIPT:
 * 1. Buka Google Sheet baru Anda.
 * 2. Klik menu 'Ekstensi' (Extensions) -> 'Apps Script'.
 * 3. Hapus seluruh kode bawaan, lalu Salin & Tempel seluruh kode di bawah ini.
 * 4. Klik ikon 'Simpan' (Diskette).
 * 5. PENTING (AGAR BERKAS TERSIMPAN DI GOOGLE DRIVE DENGAN LINK DRIVING LENGKAP):
 *    - Pilih fungsi 'inisialisasiFolderDanIzinDrive' di bagian dropdown atas.
 *    - Klik 'Jalankan' (Run) -> Berikan Otorisasi Izin Google Drive (Review Permissions).
 *    - Folder "PPDB_TK_Khalifah_4_Berkas" akan otomatis dibuat di Google Drive Anda!
 * 6. Klik 'Deploy' (Terapkan) -> 'Deployment baru' (New deployment).
 * 7. Pilih Jenis: 'Aplikasi Web' (Web App).
 * 8. Deskripsi: "API PPDB TK Khalifah 4 v1.0"
 * 9. Jalankan sebagai (Execute as): 'Saya' (Me / email anda)
 * 10. Siapa yang memiliki akses (Who has access): 'Siapa saja' (Anyone)
 * 11. Klik 'Deploy', berikan Izin Akses (Authorize Access), lalu Salin 'URL Aplikasi Web'.
 * 12. Tempel URL tersebut ke menu Pengaturan API PPDB pada Dashboard Admin.
 * ==============================================================================
 */

// KONFIGURASI UTAMA
const SHEET_PENDAFTAR = "Pendaftar";
const SHEET_AUTH = "Auth_Admin";
const SHEET_LOGS = "System_Logs";

// ID Folder Google Drive (Opsional). Jika dikosongkan, sistem akan otomatis membuat folder "PPDB_TK_Khalifah_4_Berkas" di Google Drive Anda.
const FOLDER_ID = ""; 

// DEFAULT MASTER TOKEN ADMIN (Dapat diubah di tab Auth_Admin)
const DEFAULT_ADMIN_TOKEN = "TK4-SECRET-TOKEN-2026";
const DEFAULT_ADMIN_USER = "admintk4";
const DEFAULT_ADMIN_PASS = "bismillah123";

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    // Public Action: Check status by ID or WA
    if (action === "check_status") {
      const query = e.parameter.id || e.parameter.wa || e.parameter.query;
      if (!query) {
        return createJsonResponse({ success: false, message: "ID Pendaftaran atau Nomor WA wajib diisi." }, 400);
      }
      return checkStatusHandler(query);
    }
    
    // Private Action: Fetch all records (for Admin GET fallback)
    if (action === "get_all") {
      const token = e.parameter.admin_token;
      if (!verifyAdmin(token)) {
        return createJsonResponse({ success: false, message: "401 Unauthorized: Token Admin tidak valid!" }, 401);
      }
      return getAllPendaftarHandler();
    }
    
    // Default response for Root GET
    return createJsonResponse({
      status: "ONLINE",
      app: "PPDB TK Khalifah 4 Makassar API",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return createJsonResponse({ success: false, message: error.toString() }, 500);
  }
}

/**
 * Handle HTTP POST Requests
 * Karena website Anda mengirim data dalam bentuk body JSON string, 
 * pada kode .gs di Google Apps Script Anda wajib menggunakan e.postData.contents untuk menangkapnya.
 */
function doPost(e) {
  let lock = LockService.getScriptLock();
  
  try {
    let payload = {};
    // Pengecekan wajib e.postData.contents untuk menangkap JSON payload dari fetch API website
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || (e && e.parameter ? e.parameter.action : "");

    // RUTE 1: PUBLIC REGISTER (Wajib LockService Concurrency Guard untuk 1000+ peserta)
    if (action === "register") {
      try {
        // Queueing Lock hingga 30 detik agar pendaftaran masal tidak pernah bentrok atau tertolak
        lock.waitLock(30000);
        return registerHandler(payload);
      } catch (lockErr) {
        return createJsonResponse({ 
          success: false, 
          message: "Sistem sedang memproses antrean pendaftaran masal. Silakan coba beberapa detik lagi." 
        }, 503);
      } finally {
        try { lock.releaseLock(); } catch (e) {}
      }
    }

    // RUTE 2: ADMIN LOGIN
    if (action === "admin_login") {
      return adminLoginHandler(payload);
    }

    // VERIFIKASI TOKEN UTAMA UNTUK ACTION ADMIN BERIKUTNYA
    const token = payload.admin_token || (e && e.parameter ? e.parameter.admin_token : "");
    if (!verifyAdmin(token)) {
      return createJsonResponse({ success: false, message: "401 Unauthorized: Akses ditolak! Token tidak valid." }, 401);
    }

    // RUTE 3: ADMIN READ ALL
    if (action === "get_all") {
      return getAllPendaftarHandler();
    }

    // RUTE 4: ADMIN UPDATE STATUS
    if (action === "update_status") {
      return updateStatusHandler(payload);
    }

    // RUTE 5: ADMIN DELETE RECORD
    if (action === "delete") {
      return deleteHandler(payload);
    }

    return createJsonResponse({ success: false, message: "Action tidak dikenal: " + action }, 400);

  } catch (error) {
    return createJsonResponse({ success: false, message: error.toString() }, 500);
  }
}

/**
 * FUNGSI INISIALISASI FOLDER GOOGLE DRIVE & OTORISASI IZIN
 * PENTING: Jalankan fungsi ini 1x di Editor Google Apps Script (Klik 'Jalankan' / 'Run')
 * untuk membuat folder 'PPDB_TK_Khalifah_4_Berkas' dan memberikan izin akses DriveApp.
 */
function inisialisasiFolderDanIzinDrive() {
  const folderName = "PPDB_TK_Khalifah_4_Berkas";
  const folders = DriveApp.getFoldersByName(folderName);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
    Logger.log("✓ Folder sudah ada: " + folder.getUrl());
  } else {
    folder = DriveApp.createFolder(folderName);
    Logger.log("✓ Folder baru berhasil dibuat di Google Drive: " + folder.getUrl());
  }
  Logger.log("✓ Izin Google Drive BERHASIL diaktifkan! Semua berkas akan tersimpan sebagai URL Google Drive resmi di Sheet.");
  return folder.getUrl();
}

/**
 * Helper untuk memproses file upload (Base64 DataURL) agar tersimpan otomatis di Google Drive
 * Mengembalikan URL Google Drive resmi (https://drive.google.com/file/d/...)
 */
function processUploadedFile(fileData, fileNamePrefix) {
  if (!fileData || fileData === "-" || fileData === "") return "-";
  
  // Jika sudah berupa URL (http / https / drive link), kembalikan langsung
  if (fileData.toString().startsWith("http://") || fileData.toString().startsWith("https://")) {
    return fileData.toString();
  }

  if (fileData.toString().startsWith("data:")) {
    try {
      if (typeof DriveApp !== "undefined") {
        let folder;
        if (typeof FOLDER_ID !== "undefined" && FOLDER_ID && FOLDER_ID.trim() !== "") {
          folder = DriveApp.getFolderById(FOLDER_ID.trim());
        } else {
          const folderName = "PPDB_TK_Khalifah_4_Berkas";
          const folders = DriveApp.getFoldersByName(folderName);
          if (folders.hasNext()) {
            folder = folders.next();
          } else {
            folder = DriveApp.createFolder(folderName);
          }
        }

        const parts = fileData.split(",");
        const mimeMatch = parts[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
        const base64Str = parts[1];
        const bytes = Utilities.base64Decode(base64Str);
        const ext = mime.includes("png") ? ".png" : mime.includes("jpeg") || mime.includes("jpg") ? ".jpg" : mime.includes("pdf") ? ".pdf" : ".bin";
        const blob = Utilities.newBlob(bytes, mime, fileNamePrefix + "_" + Date.now() + ext);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        // Kembalikan Link URL Google Drive resmi
        return file.getUrl();
      }
    } catch (e) {
      // Jika DriveApp belum diotorisasi di Google Apps Script
      Logger.log("Error DriveApp: " + e.toString());
    }
    const approxKb = Math.round(fileData.length / 1024);
    return "[Berkas Upload: " + fileNamePrefix + " (" + approxKb + " KB)]";
  }
  
  return fileData.toString().length > 45000 
    ? "[Berkas Upload: " + fileNamePrefix + " (File Terlampir)]"
    : fileData;
}

/**
 * HANDLER 1: REGISTRASI PENDAFTAR BARU (Insert-Only)
 */
function registerHandler(data) {
  const sheet = getOrCreateSheet(SHEET_PENDAFTAR, [
    "id_pendaftaran", "timestamp", "nama_anak", "panggilan_anak", "jenis_kelamin",
    "tempat_lahir", "tanggal_lahir", "anak_ke", "jumlah_saudara",
    "nama_ortu", "hubungan_ortu", "pekerjaan_ortu", "nomor_whatsapp", "email_ortu",
    "alamat_lengkap", "kecamatan_kota", "program_pilihan", "gelombang",
    "berkas_akta", "berkas_kk", "berkas_foto",
    "status", "catatan_admin"
  ]);

  const now = new Date();
  const dateCode = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyMM");
  const randomNum = Math.floor(100 + Math.random() * 900);
  const idPendaftaran = "TK4-" + dateCode + "-" + randomNum;
  const timestampStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");

  const newRow = [
    idPendaftaran,
    timestampStr,
    data.nama_anak || "",
    data.panggilan_anak || "",
    data.jenis_kelamin || "Laki-laki",
    data.tempat_lahir || "Makassar",
    data.tanggal_lahir || "",
    data.anak_ke || 1,
    data.jumlah_saudara || 1,
    data.nama_ortu || "",
    data.hubungan_ortu || "Ayah",
    data.pekerjaan_ortu || "",
    cleanPhoneNumber(data.nomor_whatsapp || ""),
    data.email_ortu || "",
    data.alamat_lengkap || "",
    data.kecamatan_kota || "Makassar",
    data.program_pilihan || "TK-A (Usia 4-5 Tahun)",
    data.gelombang || "Gelombang 1 (Early Bird)",
    processUploadedFile(data.berkas_akta, "Akta_" + idPendaftaran),
    processUploadedFile(data.berkas_kk, "KK_" + idPendaftaran),
    processUploadedFile(data.berkas_foto, "Foto_" + idPendaftaran),
    "Menunggu Verifikasi",
    "Pendaftaran berhasil dikirim. Menunggu jadwal verifikasi berkas oleh panitia."
  ];

  sheet.appendRow(newRow);

  // Record System Log
  writeLog("Public Form", "Register", idPendaftaran, "Pendaftaran baru untuk " + data.nama_anak);

  return createJsonResponse({
    success: true,
    message: "Pendaftaran berhasil disimpan!",
    data: {
      id_pendaftaran: idPendaftaran,
      timestamp: timestampStr,
      nama_anak: data.nama_anak,
      status: "Menunggu Verifikasi"
    }
  });
}

/**
 * HANDLER 2: CEK STATUS PENDAFTARAN (Specific-Read-Only)
 */
function checkStatusHandler(queryStr) {
  const sheet = getOrCreateSheet(SHEET_PENDAFTAR);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    return createJsonResponse({ success: false, message: "Data pendaftaran tidak ditemukan." }, 404);
  }

  const cleanQuery = queryStr.toString().trim().toLowerCase();
  const headers = data[0];
  const idCol = headers.indexOf("id_pendaftaran");
  const waCol = headers.indexOf("nomor_whatsapp");

  let match = null;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowId = row[idCol] ? row[idCol].toString().trim().toLowerCase() : "";
    const rowWa = row[waCol] ? row[waCol].toString().trim().toLowerCase() : "";

    if (rowId === cleanQuery || rowWa.includes(cleanQuery) || cleanQuery.includes(rowWa)) {
      match = {};
      headers.forEach((h, idx) => {
        match[h] = row[idx];
      });
      break;
    }
  }

  if (match) {
    return createJsonResponse({
      success: true,
      data: match
    });
  } else {
    return createJsonResponse({
      success: false,
      message: "Nomor Pendaftaran atau WA tidak ditemukan dalam sistem."
    }, 404);
  }
}

/**
 * HANDLER 3: AMBIL SEMUA DATA (Admin Private Action)
 */
function getAllPendaftarHandler() {
  const sheet = getOrCreateSheet(SHEET_PENDAFTAR);
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return createJsonResponse({ success: true, data: [] });
  }

  const headers = data[0];
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {};
    headers.forEach((h, idx) => {
      item[h] = row[idx];
    });
    result.push(item);
  }

  return createJsonResponse({ success: true, data: result });
}

/**
 * HANDLER 4: UPDATE STATUS PENDAFTARAN (Admin Private Action)
 */
function updateStatusHandler(payload) {
  const sheet = getOrCreateSheet(SHEET_PENDAFTAR);
  const data = sheet.getDataRange().getValues();
  const targetId = payload.id_pendaftaran;
  
  if (!targetId) {
    return createJsonResponse({ success: false, message: "ID Pendaftaran wajib dispesifikasikan." }, 400);
  }

  const headers = data[0];
  const idCol = headers.indexOf("id_pendaftaran");
  const statusCol = headers.indexOf("status");
  const notesCol = headers.indexOf("catatan_admin");

  let foundRowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === targetId) {
      foundRowIndex = i + 1; // Row Index 1-based in Apps Script
      break;
    }
  }

  if (foundRowIndex === -1) {
    return createJsonResponse({ success: false, message: "ID Pendaftaran tidak ditemukan." }, 404);
  }

  if (payload.status) {
    sheet.getRange(foundRowIndex, statusCol + 1).setValue(payload.status);
  }

  if (payload.catatan_admin !== undefined) {
    sheet.getRange(foundRowIndex, notesCol + 1).setValue(payload.catatan_admin);
  }

  writeLog("Admin Panitia", "Update Status", targetId, "Status diubah menjadi: " + payload.status);

  return createJsonResponse({
    success: true,
    message: "Status pendaftaran berhasil diperbarui!"
  });
}

/**
 * HANDLER 5: DELETE RECORD (Admin Private Action)
 */
function deleteHandler(payload) {
  const sheet = getOrCreateSheet(SHEET_PENDAFTAR);
  const data = sheet.getDataRange().getValues();
  const targetId = payload.id_pendaftaran;
  const headers = data[0];
  const idCol = headers.indexOf("id_pendaftaran");

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === targetId) {
      sheet.deleteRow(i + 1);
      writeLog("Admin Panitia", "Delete", targetId, "Data pendaftar dihapus dari sistem.");
      return createJsonResponse({ success: true, message: "Data berhasil dihapus." });
    }
  }

  return createJsonResponse({ success: false, message: "Data tidak ditemukan." }, 404);
}

/**
 * HANDLER 6: LOGIN ADMIN
 */
function adminLoginHandler(payload) {
  const authSheet = getOrCreateSheet(SHEET_AUTH, ["username", "password_hash", "active_token"]);
  const data = authSheet.getDataRange().getValues();
  
  // Jika sheet auth kosong, inisialisasi default admin
  if (data.length <= 1) {
    authSheet.appendRow([DEFAULT_ADMIN_USER, DEFAULT_ADMIN_PASS, DEFAULT_ADMIN_TOKEN]);
  }

  const username = payload.username;
  const password = payload.password;

  if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
    writeLog("Admin Panitia", "Login", username, "Login Admin Berhasil");
    return createJsonResponse({
      success: true,
      token: DEFAULT_ADMIN_TOKEN,
      user: { username: DEFAULT_ADMIN_USER, name: "Panitia PPDB TK Khalifah 4" }
    });
  }

  return createJsonResponse({ success: false, message: "Username atau Password Admin salah!" }, 401);
}

/**
 * HELPER & MIDDLEWARE VERIFIKASI TOKEN ADMIN
 */
function verifyAdmin(token) {
  if (!token) return false;
  if (token === DEFAULT_ADMIN_TOKEN) return true;

  const authSheet = getOrCreateSheet(SHEET_AUTH);
  const data = authSheet.getDataRange().getValues();
  if (data.length <= 1) return false;

  const tokenCol = data[0].indexOf("active_token");
  for (let i = 1; i < data.length; i++) {
    if (data[i][tokenCol] === token) return true;
  }
  return false;
}

/**
 * HELPER AUDIT LOGGING
 */
function writeLog(actor, actionType, targetId, details) {
  try {
    const logSheet = getOrCreateSheet(SHEET_LOGS, ["timestamp", "actor", "action_type", "target_id", "details"]);
    const timestampStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    logSheet.appendRow([timestampStr, actor, actionType, targetId, details || ""]);
  } catch (err) {
    console.error("Gagal mencatat log: " + err);
  }
}

/**
 * HELPER UNTUK MENDAPATKAN ATAU MEMBUAT SHEET BILA BELUM ADA
 */
function getOrCreateSheet(sheetName, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
    }
  }
  return sheet;
}

/**
 * HELPER FORMAT RESPONSE JSON & CORS
 */
function createJsonResponse(dataObject) {
  return ContentService.createTextOutput(JSON.stringify(dataObject))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * HELPER UNTUK CLEAN NOMOR WA
 */
function cleanPhoneNumber(phone) {
  let str = phone.toString().replace(/[^0-9]/g, "");
  if (str.startsWith("0")) {
    str = "62" + str.substring(1);
  }
  return str;
}
`;
