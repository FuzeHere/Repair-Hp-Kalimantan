
export enum Role {
  OWNER = 'pemilik',
  EMPLOYEE = 'pegawai',
}

export interface User {
  id: number;
  username: string;
  password?: string;
  role: Role;
}

export interface Damage {
  id: string;
  name: string;
  category: string;
  description: string;
  videoUrl: string;
  steps: string[];
  estimatedCost: number;
}

export enum TransactionStatus {
  PENDING = 'Dalam Perbaikan',
  COMPLETED = 'Selesai',
  PICKED_UP = 'Sudah Diambil',
}

export interface Transaction {
  id: string;
  customerName: string;
  customerPhone: string;
  damageId: string;
  cost: number;
  entryDate: string;
  pickupDate: string;
  status: TransactionStatus;
}
