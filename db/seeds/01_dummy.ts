import type { Knex } from "knex";
import bcrypt from "bcryptjs";

/**
 * Data DUMMY untuk pengembangan & demo.
 * Semua akun memakai password: partnerseek123
 * (Nama dan karya di bawah ini fiktif.)
 */

const SKILLS: [string, string][] = [
  ["JavaScript", "Pemrograman"], ["TypeScript", "Pemrograman"], ["React", "Pemrograman"],
  ["Next.js", "Pemrograman"], ["Node.js", "Pemrograman"], ["Python", "Pemrograman"],
  ["Java", "Pemrograman"], ["Flutter", "Pemrograman"], ["Laravel", "Pemrograman"],
  ["MySQL", "Pemrograman"], ["Machine Learning", "Pemrograman"], ["IoT & Arduino", "Pemrograman"],
  ["UI/UX Design", "Desain"], ["Figma", "Desain"], ["Desain Grafis", "Desain"],
  ["Ilustrasi", "Desain"], ["Motion Graphics", "Desain"],
  ["Copywriting", "Konten & Media"], ["Content Creator", "Konten & Media"], ["Video Editing", "Konten & Media"],
  ["Fotografi", "Konten & Media"], ["Public Speaking", "Konten & Media"],
  ["Business Plan", "Bisnis"], ["Digital Marketing", "Bisnis"], ["Manajemen Proyek", "Bisnis"],
  ["Analisis Keuangan", "Bisnis"], ["Riset Pasar", "Bisnis"],
  ["Karya Tulis Ilmiah", "Akademik"], ["Analisis Data", "Akademik"], ["Statistik", "Akademik"],
  ["Penerjemah Inggris", "Akademik"],
];

interface Seed {
  name: string; username: string; role: "mahasiswa" | "umkm" | "organisasi";
  university: string; prodi: string; faculty?: string; angkatan?: number;
  headline: string; bio: string; wa?: string; verified?: boolean; open?: boolean;
  skills: [string, "pemula" | "menengah" | "mahir"][];
  interests: string[];
  exp: [("pendidikan" | "pengalaman" | "prestasi"), string, string, number, number | null, string?][];
  works: [string, string, string, string][]; // title, desc, tags, link
}

const U = "Universitas Negeri Semarang";

const USERS: Seed[] = [
  {
    name: "Rina Kusuma", username: "rina-kusuma", role: "mahasiswa", university: U,
    prodi: "Desain Komunikasi Visual", faculty: "Fakultas Bahasa dan Seni", angkatan: 2023,
    headline: "UI/UX Designer · Juara 1 Lomba UI/UX Tingkat Nasional",
    bio: "Suka merancang antarmuka yang rapi dan mudah dipakai. Sudah dua kali memimpin riset pengguna untuk lomba aplikasi. Mencari tim developer yang rajin untuk proyek berikutnya.",
    wa: "6281200000001", verified: true,
    skills: [["UI/UX Design", "mahir"], ["Figma", "mahir"], ["Desain Grafis", "menengah"], ["Motion Graphics", "pemula"]],
    interests: ["lomba", "startup", "freelance"],
    exp: [
      ["pendidikan", "S1 Desain Komunikasi Visual", U, 2023, null],
      ["prestasi", "Juara 1 Lomba UI/UX Nasional", "Kompetisi Desain Aplikasi Kampus", 2025, 2025, "Merancang aplikasi layanan kesehatan mental mahasiswa."],
      ["pengalaman", "UI/UX Designer Magang", "Studio Kreatif Lokal", 2025, 2025, "Mendesain 12 layar aplikasi pemesanan dan membuat design system."],
    ],
    works: [
      ["Aplikasi Konseling Kampus", "Prototipe aplikasi konseling dengan alur booking sesi dan chat anonim.", "UI/UX, Figma, Riset", "https://example.com/konseling"],
      ["Redesain Portal Akademik", "Studi kasus redesain portal akademik agar navigasi lebih sederhana.", "UI/UX, Case Study", "https://example.com/portal"],
    ],
  },
  {
    name: "Dimas Prakoso", username: "dimas-prakoso", role: "mahasiswa", university: U,
    prodi: "Pendidikan Teknik Informatika dan Komputer", faculty: "Fakultas Teknik", angkatan: 2023,
    headline: "Fullstack Web Developer · Next.js & MySQL",
    bio: "Membangun aplikasi web end-to-end, dari desain database sampai deploy. Sedang mencari desainer UI/UX dan content writer untuk lomba pengembangan perangkat lunak.",
    wa: "6281200000002",
    skills: [["Next.js", "mahir"], ["TypeScript", "mahir"], ["React", "mahir"], ["Node.js", "menengah"], ["MySQL", "menengah"]],
    interests: ["lomba", "proyek", "freelance", "startup"],
    exp: [
      ["pendidikan", "S1 Pendidikan Teknik Informatika dan Komputer", U, 2023, null],
      ["pengalaman", "Web Developer Freelance", "Klien UMKM kuliner", 2024, null, "Membuat website katalog dan sistem pemesanan untuk 3 UMKM."],
      ["prestasi", "Finalis Lomba Pengembangan Perangkat Lunak", "Kompetisi Mahasiswa Nasional", 2025, 2025],
    ],
    works: [
      ["Toko Kue Online", "E-commerce kue artisan dengan keranjang, checkout, dan dashboard admin.", "React, Node.js, MySQL", "https://example.com/tokokue"],
      ["Platform Loyalitas UMKM", "Sistem poin loyalitas bersama untuk banyak UMKM dalam satu aplikasi.", "Next.js, MySQL", "https://example.com/loyalty"],
    ],
  },
  {
    name: "Alya Putri", username: "alya-putri", role: "mahasiswa", university: U,
    prodi: "Ilmu Komunikasi", faculty: "Fakultas Ilmu Sosial dan Ilmu Politik", angkatan: 2022,
    headline: "Copywriter & Content Strategist",
    bio: "Menulis naskah promosi, caption, dan skrip video pendek. Terbiasa mengelola akun media sosial organisasi kampus dan UMKM.",
    wa: "6281200000003",
    skills: [["Copywriting", "mahir"], ["Content Creator", "mahir"], ["Digital Marketing", "menengah"], ["Public Speaking", "menengah"]],
    interests: ["lomba", "freelance", "organisasi"],
    exp: [
      ["pendidikan", "S1 Ilmu Komunikasi", U, 2022, null],
      ["pengalaman", "Kepala Divisi Media Kreatif", "HIMA Ilmu Komunikasi", 2024, 2025, "Memimpin 8 anggota, menaikkan jangkauan Instagram 3x dalam 6 bulan."],
    ],
    works: [
      ["Kampanye Hemat Air Kampus", "Rangkaian konten edukasi 4 minggu dengan skrip Reels dan carousel.", "Copywriting, Kampanye", "https://example.com/hemat-air"],
    ],
  },
  {
    name: "Bagas Saputra", username: "bagas-saputra", role: "mahasiswa", university: U,
    prodi: "Manajemen", faculty: "Fakultas Ekonomika dan Bisnis", angkatan: 2022,
    headline: "Business Plan & Riset Pasar · Peraih Dana Hibah Wirausaha",
    bio: "Menyusun business plan, analisis kelayakan, dan pitch deck. Mencari tim teknis untuk mewujudkan ide startup edukasi.",
    wa: "6281200000004",
    skills: [["Business Plan", "mahir"], ["Riset Pasar", "mahir"], ["Analisis Keuangan", "menengah"], ["Manajemen Proyek", "menengah"]],
    interests: ["startup", "lomba", "pkm"],
    exp: [
      ["pendidikan", "S1 Manajemen", U, 2022, null],
      ["prestasi", "Pendanaan Program Mahasiswa Wirausaha", "Kemdikbud", 2025, 2025, "Lolos pendanaan untuk usaha minuman herbal."],
    ],
    works: [
      ["Pitch Deck Ngajar Kita", "Pitch deck startup bimbingan belajar komunitas lengkap dengan proyeksi keuangan.", "Business Plan, Pitch", "https://example.com/pitch"],
    ],
  },
  {
    name: "Nadia Rahma", username: "nadia-rahma", role: "mahasiswa", university: U,
    prodi: "Sistem Informasi", faculty: "Fakultas Matematika dan Ilmu Pengetahuan Alam", angkatan: 2023,
    headline: "Data Analyst · Python, SQL & Visualisasi",
    bio: "Mengolah data survei dan membuat dasbor yang mudah dibaca. Senang membantu tim yang butuh analisis untuk penelitian atau PKM.",
    wa: "6281200000005", verified: true,
    skills: [["Analisis Data", "mahir"], ["Python", "mahir"], ["MySQL", "menengah"], ["Statistik", "menengah"]],
    interests: ["lomba", "pkm", "proyek"],
    exp: [
      ["pendidikan", "S1 Sistem Informasi", U, 2023, null],
      ["pengalaman", "Asisten Praktikum Basis Data", U, 2024, 2025, "Membimbing 40 mahasiswa dalam praktikum SQL."],
    ],
    works: [
      ["Dasbor Kualitas Tidur Mahasiswa", "Analisis survei 300 responden dengan visualisasi interaktif.", "Python, Data, Dashboard", "https://example.com/tidur"],
      ["Prediksi Kelulusan Tepat Waktu", "Model sederhana prediksi kelulusan dari data akademik anonim.", "Python, ML", "https://example.com/lulus"],
    ],
  },
  {
    name: "Raka Wijaya", username: "raka-wijaya", role: "mahasiswa", university: "Universitas Diponegoro",
    prodi: "Teknik Komputer", angkatan: 2022,
    headline: "Machine Learning Engineer · Computer Vision",
    bio: "Fokus pada computer vision untuk deteksi objek. Mau gabung tim lomba AI atau riset PKM bidang teknologi.",
    wa: "6281200000006",
    skills: [["Machine Learning", "mahir"], ["Python", "mahir"], ["IoT & Arduino", "menengah"]],
    interests: ["lomba", "pkm", "startup"],
    exp: [
      ["pendidikan", "S1 Teknik Komputer", "Universitas Diponegoro", 2022, null],
      ["prestasi", "Juara 2 Lomba AI Regional", "Kompetisi Kecerdasan Buatan Jateng", 2025, 2025],
    ],
    works: [
      ["Deteksi Masker & Helm", "Model YOLO untuk memantau penggunaan APD di area proyek.", "Computer Vision, Python", "https://example.com/apd"],
    ],
  },
  {
    name: "Salsa Maharani", username: "salsa-maharani", role: "mahasiswa", university: U,
    prodi: "Pendidikan Seni Rupa", faculty: "Fakultas Bahasa dan Seni", angkatan: 2023,
    headline: "Ilustrator & Video Editor",
    bio: "Membuat ilustrasi karakter, maskot, dan video pendek bergaya kartun. Terbuka untuk proyek freelance dan kolaborasi lomba kreatif.",
    wa: "6281200000007",
    skills: [["Ilustrasi", "mahir"], ["Video Editing", "mahir"], ["Motion Graphics", "menengah"], ["Desain Grafis", "menengah"]],
    interests: ["freelance", "lomba", "proyek"],
    exp: [
      ["pendidikan", "S1 Pendidikan Seni Rupa", U, 2023, null],
      ["pengalaman", "Ilustrator Lepas", "Beberapa UMKM lokal", 2024, null, "Membuat maskot dan stiker kemasan untuk 6 UMKM."],
    ],
    works: [
      ["Maskot Kopi Kelana", "Desain maskot dan set stiker untuk kedai kopi lokal.", "Ilustrasi, Branding", "https://example.com/maskot"],
      ["Motion Logo Pack", "Animasi logo 5 detik untuk kebutuhan konten Reels.", "Motion, After Effects", "https://example.com/motion"],
    ],
  },
  {
    name: "Farhan Alfarizi", username: "farhan-alfarizi", role: "mahasiswa", university: "Universitas Dian Nuswantoro",
    prodi: "Teknik Informatika", angkatan: 2022,
    headline: "Mobile Developer · Flutter",
    bio: "Membangun aplikasi Android/iOS dengan Flutter dan Firebase. Siap bergabung ke tim lomba aplikasi atau startup tahap awal.",
    wa: "6281200000008",
    skills: [["Flutter", "mahir"], ["Java", "menengah"], ["UI/UX Design", "pemula"]],
    interests: ["lomba", "startup", "proyek"],
    exp: [
      ["pendidikan", "S1 Teknik Informatika", "Universitas Dian Nuswantoro", 2022, null],
      ["pengalaman", "Mobile Developer Magang", "Startup Edutech Semarang", 2025, 2025, "Mengembangkan fitur kuis dan notifikasi pada aplikasi belajar."],
    ],
    works: [
      ["Aplikasi Parkir Kampus", "Aplikasi cek slot parkir real-time dengan peta kampus.", "Flutter, Firebase", "https://example.com/parkir"],
    ],
  },
  {
    name: "Putri Anjani", username: "putri-anjani", role: "mahasiswa", university: U,
    prodi: "Akuntansi", faculty: "Fakultas Ekonomika dan Bisnis", angkatan: 2023,
    headline: "Analisis Keuangan & Penyusun Proposal",
    bio: "Menyusun RAB, laporan keuangan, dan proposal pendanaan. Pernah menjadi bendahara dua kepanitiaan besar.",
    wa: "6281200000009",
    skills: [["Analisis Keuangan", "mahir"], ["Business Plan", "menengah"], ["Manajemen Proyek", "menengah"]],
    interests: ["pkm", "lomba", "organisasi"],
    exp: [
      ["pendidikan", "S1 Akuntansi", U, 2023, null],
      ["pengalaman", "Bendahara Umum", "Seminar Nasional Mahasiswa", 2025, 2025, "Mengelola anggaran Rp180 juta tanpa selisih."],
    ],
    works: [
      ["Template RAB PKM", "Templat anggaran PKM dengan formula otomatis sesuai pedoman.", "Keuangan, Spreadsheet", "https://example.com/rab"],
    ],
  },
  {
    name: "Aldi Firmansyah", username: "aldi-firmansyah", role: "mahasiswa", university: U,
    prodi: "Ilmu Komputer", faculty: "Fakultas Matematika dan Ilmu Pengetahuan Alam", angkatan: 2022,
    headline: "Backend Developer · Laravel & Node.js",
    bio: "Mengerjakan REST API, autentikasi, dan integrasi pembayaran. Mencari tim frontend dan desainer.",
    wa: "6281200000010",
    skills: [["Laravel", "mahir"], ["Node.js", "menengah"], ["MySQL", "mahir"], ["JavaScript", "menengah"]],
    interests: ["proyek", "freelance", "startup"],
    exp: [
      ["pendidikan", "S1 Ilmu Komputer", U, 2022, null],
      ["pengalaman", "Backend Developer Freelance", "Proyek kasir digital", 2024, null],
    ],
    works: [
      ["API Kasir Digital", "REST API kasir dengan multi-outlet dan laporan harian.", "Laravel, MySQL", "https://example.com/kasir"],
    ],
  },
  {
    name: "Citra Dewi", username: "citra-dewi", role: "mahasiswa", university: U,
    prodi: "Pendidikan Matematika", faculty: "Fakultas Matematika dan Ilmu Pengetahuan Alam", angkatan: 2022,
    headline: "Penulis Karya Tulis Ilmiah · Pendanaan PKM",
    bio: "Pernah lolos pendanaan PKM-RE dan PKM-PM. Siap membantu menyusun proposal, kajian pustaka, dan analisis statistik.",
    wa: "6281200000011", verified: true,
    skills: [["Karya Tulis Ilmiah", "mahir"], ["Statistik", "mahir"], ["Analisis Data", "menengah"]],
    interests: ["pkm", "lomba"],
    exp: [
      ["pendidikan", "S1 Pendidikan Matematika", U, 2022, null],
      ["prestasi", "Lolos Pendanaan PKM-RE", "Belmawa Kemdikbudristek", 2025, 2025],
    ],
    works: [
      ["Proposal PKM-RE Pembelajaran Adaptif", "Proposal penelitian dengan desain eksperimen dan analisis uji beda.", "PKM, Statistik", "https://example.com/pkm-re"],
    ],
  },
  {
    name: "Yoga Pratama", username: "yoga-pratama", role: "mahasiswa", university: U,
    prodi: "Teknik Elektro", faculty: "Fakultas Teknik", angkatan: 2023,
    headline: "IoT & Embedded Systems",
    bio: "Membuat prototipe perangkat IoT dengan ESP32, sensor, dan dasbor monitoring. Cari partner software untuk lomba inovasi teknologi.",
    wa: "6281200000012",
    skills: [["IoT & Arduino", "mahir"], ["Python", "menengah"], ["Manajemen Proyek", "pemula"]],
    interests: ["lomba", "pkm", "startup"],
    exp: [
      ["pendidikan", "S1 Teknik Elektro", U, 2023, null],
      ["prestasi", "Finalis Lomba Inovasi Teknologi Tepat Guna", "Kompetisi Inovasi Jateng", 2025, 2025],
    ],
    works: [
      ["Monitoring Kelembapan Kebun", "Sensor kelembapan nirkabel dengan notifikasi ke ponsel petani.", "ESP32, IoT", "https://example.com/kebun"],
    ],
  },
  {
    name: "Meilani Sari", username: "meilani-sari", role: "mahasiswa", university: U,
    prodi: "Pendidikan Bahasa Inggris", faculty: "Fakultas Bahasa dan Seni", angkatan: 2022,
    headline: "Penerjemah, MC & Public Speaker",
    bio: "Menerjemahkan dokumen ID–EN, menjadi MC acara, dan melatih presentasi tim lomba.",
    wa: "6281200000013",
    skills: [["Penerjemah Inggris", "mahir"], ["Public Speaking", "mahir"], ["Copywriting", "menengah"]],
    interests: ["lomba", "organisasi", "freelance"],
    exp: [
      ["pendidikan", "S1 Pendidikan Bahasa Inggris", U, 2022, null],
      ["pengalaman", "MC & Moderator", "Berbagai seminar kampus", 2024, null],
    ],
    works: [
      ["Terjemahan Jurnal Pendidikan", "Terjemahan ID–EN artikel jurnal untuk publikasi internasional.", "Translation", "https://example.com/translate"],
    ],
  },
  {
    name: "Kevin Hartanto", username: "kevin-hartanto", role: "mahasiswa", university: "Universitas Dian Nuswantoro",
    prodi: "Manajemen", angkatan: 2023,
    headline: "Digital Marketer · Meta Ads & Analytics",
    bio: "Mengelola iklan berbayar skala kecil dengan anggaran terbatas, lengkap dengan pelacakan konversi.",
    wa: "6281200000014",
    skills: [["Digital Marketing", "mahir"], ["Riset Pasar", "menengah"], ["Content Creator", "menengah"]],
    interests: ["freelance", "startup", "lomba"],
    exp: [
      ["pendidikan", "S1 Manajemen", "Universitas Dian Nuswantoro", 2023, null],
      ["pengalaman", "Marketing Intern", "Brand fashion lokal", 2025, 2025, "Mengelola anggaran iklan Rp5 juta/bulan dengan ROAS 3,2."],
    ],
    works: [
      ["Studi Kasus Meta Ads Brand Lokal", "Optimasi iklan dari CPA Rp18.000 menjadi Rp9.500 dalam 3 minggu.", "Meta Ads, Analytics", "https://example.com/ads"],
    ],
  },
  // ── Mitra (UMKM / Startup / Organisasi) ──
  {
    name: "Kopi Kelana Semarang", username: "kopi-kelana", role: "umkm", university: "Semarang",
    prodi: "UMKM Kuliner", headline: "Kedai kopi lokal · mencari talenta kreatif mahasiswa",
    bio: "Kedai kopi dengan 3 cabang di Semarang. Sering membuka proyek desain kemasan, konten media sosial, dan website pemesanan untuk mahasiswa.",
    wa: "6281200000101", verified: true,
    skills: [], interests: ["freelance"], exp: [], works: [],
  },
  {
    name: "Batik Pesisir", username: "batik-pesisir", role: "umkm", university: "Semarang",
    prodi: "UMKM Fesyen", headline: "Brand batik modern · terbuka untuk kolaborasi desain",
    bio: "Brand batik motif pesisir. Mencari mahasiswa untuk katalog digital, fotografi produk, dan strategi marketplace.",
    wa: "6281200000102",
    skills: [], interests: ["freelance"], exp: [], works: [],
  },
  {
    name: "Ngajar.in", username: "ngajar-in", role: "umkm", university: "Semarang",
    prodi: "Startup Edutech", headline: "Startup bimbingan belajar · scouting talenta produk",
    bio: "Startup tahap awal yang membangun platform bimbingan belajar. Rutin mengadakan tantangan produk untuk mencari talenta.",
    wa: "6281200000103", verified: true,
    skills: [], interests: ["startup"], exp: [], works: [],
  },
  {
    name: "HIMA Sistem Informasi UNNES", username: "hima-si-unnes", role: "organisasi", university: U,
    prodi: "Himpunan Mahasiswa", headline: "Wadah pengembangan mahasiswa Sistem Informasi",
    bio: "Mengadakan lomba, pelatihan, dan proyek kolaborasi untuk mahasiswa lintas jurusan.",
    wa: "6281200000104", verified: true,
    skills: [], interests: ["lomba", "organisasi"], exp: [], works: [],
  },
];

const POSTS: {
  by: string; title: string; type: "lomba" | "pkm" | "proyek" | "freelance" | "startup";
  desc: string; skills: string[]; days: number; slots: number;
}[] = [
  { by: "dimas-prakoso", title: "Cari UI/UX Designer untuk lomba pengembangan perangkat lunak", type: "lomba",
    desc: "Tim kami (2 developer) mengikuti lomba pengembangan perangkat lunak nasional. Butuh desainer yang bisa membuat prototipe Figma lengkap dan membantu riset pengguna. Pengerjaan sekitar 6 minggu, kerja hybrid di sekitar Gunungpati.",
    skills: ["UI/UX Design", "Figma"], days: 20, slots: 1 },
  { by: "bagas-saputra", title: "Startup edukasi cari CTO / developer fullstack", type: "startup",
    desc: "Ide bimbingan belajar berbasis komunitas sudah punya riset pasar dan business plan. Sekarang butuh developer yang mau membangun MVP bersama. Sistem bagi hasil saham tim, bukan gaji.",
    skills: ["Next.js", "Node.js", "MySQL"], days: 30, slots: 1 },
  { by: "citra-dewi", title: "PKM-RE butuh anggota yang jago olah data dan visualisasi", type: "pkm",
    desc: "Proposal PKM-RE sedang disusun. Dibutuhkan 1 anggota yang bisa mengolah data hasil eksperimen dengan Python dan membuat grafik yang rapi untuk laporan.",
    skills: ["Analisis Data", "Python", "Statistik"], days: 14, slots: 1 },
  { by: "yoga-pratama", title: "Prototipe IoT pertanian cari partner software & dashboard", type: "lomba",
    desc: "Perangkat sensor sudah jadi. Kami butuh partner untuk membuat aplikasi monitoring (web atau mobile) agar siap didemokan di lomba inovasi teknologi.",
    skills: ["Flutter", "React", "IoT & Arduino"], days: 25, slots: 2 },
  { by: "kopi-kelana", title: "Proyek desain kemasan & konten untuk menu musiman", type: "freelance",
    desc: "Kami membuka proyek freelance untuk ilustrator dan content creator. Output: set ilustrasi menu musiman, 8 konten Reels, dan caption. Dibayar per proyek, ada kesempatan jangka panjang.",
    skills: ["Ilustrasi", "Content Creator", "Video Editing"], days: 18, slots: 2 },
  { by: "alya-putri", title: "Lomba business case cari analis keuangan & desainer slide", type: "lomba",
    desc: "Tim 3 orang untuk business case competition tingkat regional. Kami sudah punya strategi dan storyline, butuh yang kuat di proyeksi keuangan serta desain presentasi.",
    skills: ["Analisis Keuangan", "Desain Grafis"], days: 12, slots: 2 },
  { by: "ngajar-in", title: "Cari mahasiswa mobile developer untuk magang proyek", type: "proyek",
    desc: "Kami membuka proyek 3 bulan untuk pengembangan fitur kuis harian di aplikasi mobile. Ada uang saku dan sertifikat. Pengalaman Flutter menjadi nilai tambah.",
    skills: ["Flutter", "UI/UX Design"], days: 28, slots: 1 },
  { by: "rina-kusuma", title: "Cari developer frontend untuk portofolio kolaborasi redesain aplikasi", type: "proyek",
    desc: "Ingin mengimplementasikan desain aplikasi konseling menjadi prototipe web yang bisa diklik. Cocok untuk yang ingin menambah portofolio. Bebas kerja jarak jauh.",
    skills: ["React", "TypeScript"], days: 22, slots: 1 },
];

const CHALLENGES: {
  by: string; title: string; category: string; reward: string; days: number;
  desc: string; skills: string[];
}[] = [
  { by: "kopi-kelana", title: "Tantangan Desain Maskot & Kemasan Musim Hujan", category: "Desain", reward: "Rp1.500.000 + kontrak proyek", days: 21,
    desc: "Rancang maskot dan konsep kemasan cup untuk kampanye menu musim hujan. Karya terpilih akan dipakai di seluruh cabang dan penulisnya mendapat kontrak desain lanjutan.", skills: ["Ilustrasi", "Desain Grafis"] },
  { by: "ngajar-in", title: "Product Sprint: Fitur Belajar Berkelompok", category: "Produk & Teknologi", reward: "Magang berbayar 3 bulan", days: 35,
    desc: "Bentuk tim 2–4 orang (developer, desainer, riset) dan usulkan fitur belajar berkelompok untuk aplikasi kami. Tim terbaik berpeluang masuk program magang dan kolaborasi produk.", skills: ["UI/UX Design", "React", "Flutter"] },
  { by: "batik-pesisir", title: "Katalog Digital & Foto Produk Koleksi Baru", category: "Konten & Media", reward: "Rp2.000.000", days: 16,
    desc: "Buat katalog digital interaktif dan seri foto produk untuk koleksi batik terbaru. Dinilai dari kreativitas, kerapian, dan kesesuaian dengan brand.", skills: ["Fotografi", "Desain Grafis", "Copywriting"] },
  { by: "hima-si-unnes", title: "Lomba Ide Aplikasi Kampus 2026", category: "Lomba Ide", reward: "Total hadiah Rp5.000.000", days: 40,
    desc: "Lomba terbuka untuk mahasiswa lintas kampus. Kirim ide aplikasi yang menyelesaikan masalah di lingkungan kampus beserta prototipe sederhana.", skills: ["UI/UX Design", "Business Plan", "Next.js"] },
];

const CHAT: [string, string, string[]][] = [
  // [userA, userB, lines alternating starting from A]
  ["dimas-prakoso", "rina-kusuma", [
    "Halo Rina, aku Dimas. Lihat portofolio UI/UX kamu, keren banget yang aplikasi konseling!",
    "Halo Dimas, makasih ya! Kamu yang posting cari desainer buat lomba itu, kan?",
    "Betul. Kami butuh prototipe Figma sama bantuan riset pengguna. Kamu tertarik?",
    "Tertarik banget. Timeline-nya 6 minggu ya? Aku kosong mulai minggu depan.",
  ]],
  ["nadia-rahma", "citra-dewi", [
    "Kak Citra, aku Nadia dari Sistem Informasi. Aku mau bantu olah data untuk PKM-RE kakak.",
    "Wah pas banget! Datanya sudah ada di Excel, nanti aku kirim ya.",
  ]],
];

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function seed(knex: Knex): Promise<void> {
  const hash = await bcrypt.hash("partnerseek123", 10);
  const rand = mulberry32(2026);

  await knex.transaction(async (trx) => {
    await trx.raw("SET FOREIGN_KEY_CHECKS = 0");
    for (const t of [
      "messages", "conversations", "challenge_entries", "challenge_skills", "challenges",
      "post_skills", "posts", "portfolio_items", "experiences", "skill_endorsements",
      "user_interests", "user_skills", "skills", "users", "waitlist",
    ]) await trx(t).truncate();
    await trx.raw("SET FOREIGN_KEY_CHECKS = 1");

    await trx("skills").insert(SKILLS.map(([name, category]) => ({ name, category })));
    const skillRows = await trx("skills").select("id", "name");
    const skillId = new Map(skillRows.map((s) => [s.name as string, s.id as number]));

    const userId = new Map<string, number>();
    for (const u of USERS) {
      const [id] = await trx("users").insert({
        name: u.name, username: u.username, email: `${u.username.replace(/-/g, ".")}@example.com`,
        password_hash: hash, role: u.role, university: u.university, prodi: u.prodi,
        faculty: u.faculty ?? null, angkatan: u.angkatan ?? null, headline: u.headline, bio: u.bio,
        location: "Semarang, Jawa Tengah", whatsapp: u.wa ?? null, is_verified: !!u.verified,
        open_to_collab: u.open ?? true,
      });
      userId.set(u.username, id);
      if (u.skills.length)
        await trx("user_skills").insert(u.skills.map(([n, level]) => ({ user_id: id, skill_id: skillId.get(n)!, level })));
      if (u.interests.length)
        await trx("user_interests").insert(u.interests.map((interest) => ({ user_id: id, interest })));
      for (const [type, title, organization, start, end, description] of u.exp)
        await trx("experiences").insert({ user_id: id, type, title, organization, start_year: start, end_year: end, description: description ?? null });
      let hue = (id * 47) % 360;
      for (const [title, description, tags, link] of u.works) {
        hue = (hue + 63) % 360;
        await trx("portfolio_items").insert({ user_id: id, title, description, tags, link, hue });
      }
    }

    // Endorsement antar mahasiswa (deterministik)
    const students = USERS.filter((u) => u.role === "mahasiswa");
    for (const u of students) {
      for (const [sn] of u.skills) {
        for (const other of students) {
          if (other.username === u.username) continue;
          if (rand() < 0.28) {
            await trx("skill_endorsements").insert({
              endorser_id: userId.get(other.username)!, user_id: userId.get(u.username)!, skill_id: skillId.get(sn)!,
            });
          }
        }
      }
    }

    const postId: number[] = [];
    for (const p of POSTS) {
      const [id] = await trx("posts").insert({
        author_id: userId.get(p.by)!, title: p.title, description: p.desc, type: p.type,
        deadline: dateOffset(p.days), slots: p.slots,
        created_at: new Date(Date.now() - Math.floor(rand() * 6 * 86400000) - 3600000),
      });
      postId.push(id);
      await trx("post_skills").insert(p.skills.map((s) => ({ post_id: id, skill_id: skillId.get(s)! })));
    }

    const chId: number[] = [];
    for (const c of CHALLENGES) {
      const [id] = await trx("challenges").insert({
        organizer_id: userId.get(c.by)!, title: c.title, description: c.desc, category: c.category,
        reward: c.reward, deadline: dateOffset(c.days),
      });
      chId.push(id);
      await trx("challenge_skills").insert(c.skills.map((s) => ({ challenge_id: id, skill_id: skillId.get(s)! })));
    }
    // beberapa peserta dummy
    await trx("challenge_entries").insert([
      { challenge_id: chId[0], user_id: userId.get("salsa-maharani")!, note: "Siap kirim 3 konsep maskot." },
      { challenge_id: chId[1], user_id: userId.get("farhan-alfarizi")!, note: "Mau ikut bareng Rina." },
      { challenge_id: chId[1], user_id: userId.get("rina-kusuma")!, note: "Tim desain + riset." },
      { challenge_id: chId[3], user_id: userId.get("dimas-prakoso")!, note: null },
    ]);

    // Percakapan contoh
    for (const [a, b, lines] of CHAT) {
      const ids = [userId.get(a)!, userId.get(b)!].sort((x, y) => x - y);
      const [convId] = await trx("conversations").insert({ user_a_id: ids[0], user_b_id: ids[1] });
      let ts = Date.now() - lines.length * 3600_000;
      for (let i = 0; i < lines.length; i++) {
        ts += 600_000 + Math.floor(rand() * 1_200_000);
        await trx("messages").insert({
          conversation_id: convId, sender_id: userId.get(i % 2 === 0 ? a : b)!, body: lines[i], created_at: new Date(ts),
        });
      }
      await trx("conversations").where({ id: convId }).update({ last_message_at: new Date(ts) });
    }
  });
}
