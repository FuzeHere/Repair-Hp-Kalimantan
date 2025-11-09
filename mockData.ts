
import { User, Role, Damage, Transaction, TransactionStatus } from './types';

export const USERS: User[] = [
  { id: 1, username: 'pemilik', password: 'password123', role: Role.OWNER },
  { id: 2, username: 'pegawai', password: 'password123', role: Role.EMPLOYEE },
];

export const DAMAGES: Damage[] = [
  {
    id: 'dmg001',
    name: 'Layar LCD Retak',
    category: 'Layar',
    description: 'Kerusakan fisik pada layar LCD yang menyebabkan retakan atau garis-garis aneh.',
    videoUrl: 'https://www.youtube.com/embed/qiJ_2-8Tf7w',
    steps: [
      'Buka casing belakang dengan hati-hati.',
      'Lepaskan konektor baterai untuk keamanan.',
      'Panaskan pinggiran layar untuk melunakkan perekat.',
      'Gunakan alat pembuka tipis untuk memisahkan layar dari frame.',
      'Bersihkan sisa perekat lama.',
      'Pasang layar baru dan sambungkan fleksibelnya.',
      'Pasang kembali baterai dan casing.',
    ],
    estimatedCost: 850000,
  },
  {
    id: 'dmg002',
    name: 'Baterai Kembung',
    category: 'Baterai',
    description: 'Baterai mengalami pembengkakan yang bisa mendorong casing belakang.',
    videoUrl: 'https://www.youtube.com/embed/zEqyR4D3-3w',
    steps: [
      'Matikan perangkat.',
      'Buka casing belakang.',
      'Lepaskan konektor baterai.',
      'Keluarkan baterai lama dengan hati-hati, jangan menusuknya.',
      'Pasang baterai baru.',
      'Sambungkan konektor dan pasang kembali casing.',
    ],
    estimatedCost: 450000,
  },
  {
    id: 'dmg003',
    name: 'Port Charger Longgar',
    category: 'Komponen',
    description: 'Konektor charger tidak terhubung dengan baik, pengisian daya sering terputus.',
    videoUrl: 'https://www.youtube.com/embed/YXd6s-HYp3E',
    steps: [
      'Pastikan port bersih dari debu atau kotoran.',
      'Buka casing perangkat.',
      'Identifikasi modul port charger.',
      'Lepaskan modul lama dan ganti dengan yang baru.',
      'Periksa apakah solderan perlu diperbaiki (jika bukan modul).',
      'Rakit kembali perangkat.',
    ],
    estimatedCost: 250000,
  },
  {
    id: 'dmg004',
    name: 'Tombol Power Tidak Berfungsi',
    category: 'Komponen',
    description: 'Tombol power tidak merespon saat ditekan.',
    videoUrl: 'https://www.youtube.com/embed/5N7uIIA6S2c',
    steps: [
        'Buka casing perangkat.',
        'Periksa fleksibel tombol power, pastikan tidak sobek atau terlepas.',
        'Bersihkan area kontak tombol.',
        'Ganti set fleksibel tombol jika rusak.',
        'Rakit kembali dan tes fungsi.',
    ],
    estimatedCost: 180000,
  },
   {
    id: 'dmg005',
    name: 'Kerusakan Speaker Earpiece',
    category: 'Audio',
    description: 'Suara tidak terdengar saat melakukan panggilan telepon.',
    videoUrl: 'https://www.youtube.com/embed/0T0i1D-S2pY',
    steps: [
        'Buka perangkat dan akses bagian atas motherboard.',
        'Lepaskan modul speaker earpiece yang lama.',
        'Bersihkan grill speaker dari debu.',
        'Pasang speaker earpiece yang baru.',
        'Rakit kembali perangkat.',
    ],
    estimatedCost: 200000,
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: 'trx001',
    customerName: 'Budi Santoso',
    customerPhone: '081234567890',
    damageId: 'dmg001',
    cost: 850000,
    entryDate: '2023-10-01',
    pickupDate: '2023-10-03',
    status: TransactionStatus.PICKED_UP,
  },
  {
    id: 'trx002',
    customerName: 'Ani Wijaya',
    customerPhone: '082345678901',
    damageId: 'dmg002',
    cost: 450000,
    entryDate: '2023-10-02',
    pickupDate: '2023-10-02',
    status: TransactionStatus.COMPLETED,
  },
  {
    id: 'trx003',
    customerName: 'Citra Lestari',
    customerPhone: '083456789012',
    damageId: 'dmg003',
    cost: 250000,
    entryDate: '2023-10-04',
    pickupDate: '',
    status: TransactionStatus.PENDING,
  },
];
