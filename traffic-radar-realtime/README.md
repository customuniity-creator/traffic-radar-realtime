# Traffic Radar Realtime by Kacipoko

Peta umum Pontianak Raya dengan GPS, mobil mengikuti GPS, autocomplete tujuan, rute TomTom, overlay trafik TomTom, refresh 1–3 menit, tombol refresh, serta dark mode dan rerouting otomatis berdasarkan posisi GPS.

## Deployment aman (disarankan)

1. Upload seluruh folder proyek ini ke repository GitHub **private**.
2. Di Netlify, buka site Anda → Site configuration / Build & deploy → Continuous deployment, sambungkan repository tersebut ke **site Netlify yang sudah ada**. Pilih folder proyek sebagai base jika diperlukan, publish directory `.` dan functions `netlify/functions` (sudah diatur pada netlify.toml).
3. Di Netlify → Site configuration → Environment variables, tambahkan `TOMTOM_API_KEY` berisi key TomTom Anda (jangan menaruhnya di HTML / GitHub). Pastikan tersedia untuk Functions.
4. Trigger **Deploy site** / redeploy setelah menambahkan variable.
5. Cek `https://DOMAIN-ANDA.netlify.app/api/status` → `{"configured":true}`. Buka aplikasinya lalu izinkan GPS.

**Penting:** Jika hanya drag-and-drop `index.html`, backend API tidak akan terpasang. Netlify Functions memerlukan proses deploy yang membundel functions (Git integration atau Netlify CLI). Jika tidak ingin Git, bisa deploy dari folder dengan Netlify CLI setelah `netlify login` lalu `netlify deploy --prod`, tetapi env variable tetap perlu diset di dashboard.

## Uji cepat statis

Bila hanya melakukan upload file statis, upload `index.html`, `app.js`, dan `style.css` bersama-sama. Buka Pengaturan, isi API key pribadi lalu klik Simpan. Browser akan menyimpan key pada localStorage, tetapi key **terlihat pada network request** dan tidak aman untuk website yang diumumkan publik. Hindari cara ini pada situs publik. Mode server lebih aman.

## Batasan

- GPS memerlukan HTTPS, izin lokasi dan browser aktif. Update posisi dapat berhenti di latar belakang terutama iOS; ini bukan navigasi turn-by-turn.
- Mobil merupakan penanda posisi GPS aktual, bukan simulasi perjalanan di jalan. Akurasi arah tergantung heading/perpindahan GPS.
- **Rerouting otomatis**: ketika GPS menunjukkan posisi lebih dari sekitar 70 m (atau 2× akurasi GPS) di luar garis rute, pada dua pembacaan terpisah ≥4 detik, aplikasi meminta rute alternatif. Ada jeda minimum 30 detik antar percobaan; pembacaan GPS dengan akurasi di atas 80 m diabaikan. Rute otomatis dihitung dari posisi terkini. Ini bukan navigasi instruksi belokan demi belokan.
- Jika routing gagal, rute lama tetap terlihat dan tersedia tombol refresh manual. Waktu rerouting bergantung pada internet dan API TomTom; kondisi trafik bisa terlambat.
- Selama permintaan sedang diproses, update GPS baru tidak langsung memicu permintaan tambahan. Untuk hasil terbaik, izinkan lokasi akurat dan biarkan browser tetap di depan.
- Warna trafik tergantung penyedia TomTom dan bisa tidak lengkap di jalan sekitar Pontianak.
- Refresh 1–3 menit adalah interval meminta pembaruan, tidak menjamin sensor lalu lintas terbaru.
- Key berada di backend, namun endpoint publik dapat dipakai pengunjung dan menghabiskan kuota. Untuk penggunaan publik yang lebih besar, tambahkan rate limiting, autentikasi, atau batas kuota.
- TomTom API mengirim lokasi asal dan tujuan untuk permintaan navigasi. Untuk peta dasar memakai tile OpenStreetMap.


## v0.9 — Hemat baterai/kuota & rotasi peta
- Trafik pause saat halaman/tab tersembunyi; tile layer dilepas agar tidak meminta tile baru. Saat kembali, satu refresh dilakukan, lalu siklus dimulai lagi.
- GPS `watchPosition` dihentikan melalui `clearWatch` saat tab tersembunyi, lalu dilanjutkan saat tab kembali terlihat jika sebelumnya dimulai oleh pengguna. Tombol Jeda GPS untuk menjeda manual.
- Interval trafik 1–5 menit (default 5 menit untuk instalasi baru; jika sebelumnya menyimpan interval lain, pilih 5 menit satu kali).
- Peta bisa diputar dengan dua jari pada perangkat sentuh; mouse klik-kanan drag di desktop; tombol kompas kembali ke arah utara. Fitur ini memakai `@tomickigrzegorz/leaflet-rotate@0.3.0` dari CDN sehingga butuh internet.
- GPS browser tidak bisa diandalkan untuk berjalan di latar belakang. Saat tab disembunyikan navigasi dan rerouting ikut dijeda.
- Karena peta tetap memuat tile dasar dan trafik saat dibuka, kuota tidak dapat dijamin nol untuk satu siklus pembukaan, dan browser mungkin menunda event visibilitas.
- Uji di Safari iPhone sebelum dipakai di jalan; perubahan ini belum diuji dengan API key pengguna.
