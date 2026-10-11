# Panduan Konfigurasi GitHub Actions Build Android APK (Bengkel Qu 1.60)

File konfigurasi workflow GitHub Actions telah dibuat di:  
📁 `.github/workflows/build-apk.yml`

---

## 🛠️ Fitur-Fitur Utama yang Disematkan

1. **Keystore Persisten & Anti-Bentrok Signature (In-Place Update)**:
   - File sertifikat penandatanganan (`android/app/debug.keystore`) kini disimpan permanen di dalam repositori.
   - **Masalah Teratasi**: Sebelumnya, runner GitHub Actions membuat keystore baru yang acak di setiap build, sehingga Android menolak pembaruan (*conflicting signatures*) dan memaksa user menghapus app lama. Kini setiap APK selalu ditandatangani dengan *Signature Key* yang sama persis, sehingga **update APK langsung menimpa tanpa perlu hapus aplikasi lama dan tanpa kehilangan data**.
2. **Auto-Increment Version Code**:
   - `versionCode` otomatis menggunakan nomor urut GitHub Run (`${{ github.run_number }}`) sehingga Android selalu mengenali APK baru sebagai versi upgrade yang sah.
3. **Node.js 22 & Java JDK 21 & Gradle**:
   - Menyiapkan environment **Node.js 22** dan **Java 21 (Temurin)** serta Android SDK bawaan GitHub Runner untuk mengompilasi APK debug via Gradle (`./gradlew assembleDebug`).
4. **Pengecekan File `.env` Otomatis**:
   - Skrip memeriksa ketersediaan file `.env`. Jika belum ada, skrip otomatis menyalin dari `.env.example` agar build web tidak gagal karena variabel hilang.
5. **Hak Akses `chmod +x` untuk `gradlew`**:
   - Memastikan file `gradlew` memiliki izin eksekusi (*executable*) sebelum perintah kompilasi Gradle dijalankan.
6. **Penyimpanan Berkas via `actions/upload-artifact@v4`**:
   - Hasil build APK disimpan menggunakan action artifact terbaru (`v4`) dengan nama **`BengkelQu-1.60-APK`** (tersedia untuk diunduh langsung selama 30 hari).

---

## 🚀 Cara Menjalankan Build APK di GitHub

### Opsi A: Jalankan Manual (1-Klik via GitHub Actions)
1. Buka repositori proyek Anda di **GitHub**.
2. Klik tab **Actions** di menu atas.
3. Di panel kiri, klik **`Build Android APK (Debug)`**.
4. Klik tombol **Run workflow** lalu pilih branch (misal: `main` atau `master`).
5. Klik **Run workflow**.

### Opsi B: Otomatis Saat `git push`
Setiap kali Anda melakukan push ke branch `main`, `master`, atau push tag versi (misal: `v1.60`), GitHub Actions akan otomatis memulai proses build.

---

## 📥 Cara Mengunduh File APK Hasil Build

1. Buka riwayat proses build yang sudah selesai (bertanda centang hijau ✅).
2. Gulir ke bawah ke bagian **Artifacts**.
3. Klik artifact **`BengkelQu-1.60-APK`** untuk mengunduh file zip yang berisi:
   - 📱 **`BengkelQu-1.60.apk`**
4. Kirim dan instal file `.apk` tersebut langsung di ponsel Android Anda!
