# The Vault

Demo pintu interaktif dengan React 19 dan Vite. Ketuk pintu, isi nama serta passcode, pilih ruangan, lalu pintu berayun terbuka.

## Menjalankan

```powershell
npm install
npm run dev
```

Buka URL yang ditampilkan Vite, biasanya <http://localhost:5173>.

## Alur interaksi

- Pengetuk dan tombol "Ketuk pintu" membuka lubang intip.
- Penutup lubang intip dapat dibuka atau ditutup dengan mouse, sentuhan, Enter, atau Space.
- Mata penjaga mengikuti kursor di area pintu dan merespons fokus formulir.
- Nama wajib diisi; passcode wajib diisi dan minimal 4 karakter. Semua passcode yang memenuhi aturan ini diterima oleh demo.
- Formulir terkunci selama pemeriksaan dan pembukaan pintu agar data tidak berubah di tengah proses.
- Setelah masuk, nama dan ruangan tampil pada layar sambutan. Tombol "Tutup & kunci pintu" mengembalikan formulir dan menghapus passcode dari state.
- "Ingat nama saya" menyimpan nama saja di localStorage perangkat ini, setelah pintu dibuka. Passcode dan sesi akses tidak disimpan. Menghapus centang juga menghapus nama tersimpan.
- Tombol suara mengendalikan efek Web Audio. Aplikasi tetap bekerja jika audio atau penyimpanan browser tidak tersedia.
- Tata letak menyesuaikan lebar layar. Pengaturan `prefers-reduced-motion` mengganti ayunan 3D dengan pergantian langsung dan menonaktifkan animasi dekoratif.

**Ini simulasi lokal, bukan autentikasi atau kontrol akses sungguhan.** Hubungkan verifikasi server sebelum digunakan untuk melindungi data.

## Pemeriksaan

```powershell
npm test
npm run lint
npm run build
```

Tes memakai test runner bawaan Node untuk memeriksa kredensial kosong, batas panjang passcode, nama terlalu panjang, dan pilihan ruangan yang tersedia.

## Tampilan

Latar ivory, teks charcoal, aksen kuningan, dan tekstur pintu yang dikompresi menjadi JPEG. Gerakan pintu, lubang intip, mata, dan pengetuk tetap elemen HTML/CSS/SVG interaktif. Font Inter memakai Google Fonts dengan fallback font sistem; judul memakai Georgia lokal.
