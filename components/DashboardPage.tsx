
import React, { useState, useMemo, useEffect } from 'react';
import type { User, Damage, Transaction } from '../types';
import { Role, TransactionStatus } from '../types';
import { DAMAGES as MOCK_DAMAGES, TRANSACTIONS } from '../mockData';
import { SearchIcon, ClipboardListIcon, ChartBarIcon, LogoutIcon, XIcon, DevicePhoneMobileIcon } from './icons';

// Props for the main DashboardPage
interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

const convertToEmbedUrl = (url: string): string => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    
    return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : url;
};

// Modal Component for Repair Guide Details
const RepairDetailModal: React.FC<{ damage: Damage; onClose: () => void }> = ({ damage, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-surface/70 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-accent">{damage.name}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                                <iframe
                                    src={damage.videoUrl}
                                    title={damage.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            <p className="text-text-secondary mb-2">{damage.description}</p>
                            <p className="text-lg font-semibold text-text-primary">
                                Estimasi Biaya: <span className="text-green-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(damage.estimatedCost)}</span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-text-primary">Langkah Perbaikan:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-text-secondary">
                                {damage.steps.map((step, index) => <li key={index}>{step}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal for Adding New Damage
const AddDamageModal: React.FC<{ onClose: () => void; onAdd: (damage: Omit<Damage, 'id'>) => void; }> = ({ onClose, onAdd }) => {
    const [newDamage, setNewDamage] = useState({
        name: '', category: '', description: '', videoUrl: '', steps: '', estimatedCost: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewDamage({ ...newDamage, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...newDamage,
            steps: newDamage.steps.split('\n').filter(s => s.trim()),
            estimatedCost: parseFloat(newDamage.estimatedCost) || 0,
            videoUrl: convertToEmbedUrl(newDamage.videoUrl),
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-surface/70 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-accent">Tambah Kerusakan Baru</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><XIcon className="h-6 w-6" /></button>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder="Nama Kerusakan" value={newDamage.name} onChange={handleChange} required className="input-field" />
                            <input type="text" name="category" placeholder="Kategori" value={newDamage.category} onChange={handleChange} required className="input-field" />
                        </div>
                        <textarea name="description" placeholder="Deskripsi singkat" value={newDamage.description} onChange={handleChange} required className="input-field w-full min-h-[80px]"></textarea>
                        <input type="url" name="videoUrl" placeholder="URL Video Tutorial (YouTube)" value={newDamage.videoUrl} onChange={handleChange} required className="input-field" />
                        <textarea name="steps" placeholder="Langkah-langkah perbaikan (satu langkah per baris)..." value={newDamage.steps} onChange={handleChange} required className="input-field w-full min-h-[120px]"></textarea>
                        <input type="number" name="estimatedCost" placeholder="Estimasi Biaya (IDR)" value={newDamage.estimatedCost} onChange={handleChange} required className="input-field" />
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-500/50 hover:bg-gray-500/80 text-white font-bold py-2 px-4 rounded-lg">Batal</button>
                        <button type="submit" className="bg-accent hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Simpan</button>
                    </div>
                </div>
            </form>
        </div>
    );
};


interface RepairGuideViewProps {
    damages: Damage[];
    setDamages: React.Dispatch<React.SetStateAction<Damage[]>>;
}

// View for Repair Guides
const RepairGuideView: React.FC<RepairGuideViewProps> = ({ damages, setDamages }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDamage, setSelectedDamage] = useState<Damage | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const categories = useMemo(() => ['all', ...Array.from(new Set(damages.map(d => d.category)))], [damages]);

    const filteredDamages = useMemo(() =>
        damages.filter(d =>
            (selectedCategory === 'all' || d.category === selectedCategory) &&
            (d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.category.toLowerCase().includes(searchTerm.toLowerCase()))
        ), [searchTerm, selectedCategory, damages]);

    const handleAddDamage = (damageData: Omit<Damage, 'id'>) => {
        const newDamage: Damage = {
            id: `dmg${Date.now()}`,
            ...damageData
        };
        setDamages(prev => [newDamage, ...prev]);
        setShowAddModal(false);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text-primary">Cari Kerusakan HP</h1>
                 <button onClick={() => setShowAddModal(true)} className="bg-accent hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto">
                    + Tambah Kerusakan
                </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Ketik nama atau kategori kerusakan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface/50 border border-white/20 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="bg-surface/50 border border-white/20 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-surface">{cat === 'all' ? 'Semua Kategori' : cat}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDamages.map(damage => (
                    <div key={damage.id} onClick={() => setSelectedDamage(damage)} className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg shadow-md hover:shadow-lg hover:bg-surface/80 transition duration-300 cursor-pointer">
                        <h3 className="text-xl font-bold text-accent mb-2">{damage.name}</h3>
                        <p className="text-text-secondary text-sm mb-4 line-clamp-3">{damage.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xs bg-primary text-white font-semibold px-2 py-1 rounded-full">{damage.category}</span>
                            <span className="text-green-400 font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(damage.estimatedCost)}</span>
                        </div>
                    </div>
                ))}
            </div>
            {selectedDamage && <RepairDetailModal damage={selectedDamage} onClose={() => setSelectedDamage(null)} />}
            {showAddModal && <AddDamageModal onClose={() => setShowAddModal(false)} onAdd={handleAddDamage} />}
             <style>{`.line-clamp-3 {
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;  
                overflow: hidden;
            }`}</style>
        </div>
    );
};

interface TransactionsViewProps {
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    damages: Damage[];
}

// View for Transactions
const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, setTransactions, damages }) => {
    const [showForm, setShowForm] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        customerName: '',
        customerPhone: '',
        damageId: damages[0]?.id || '',
        entryDate: new Date().toISOString().split('T')[0],
        pickupDate: '',
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const damage = damages.find(d => d.id === newTransaction.damageId);
        if (!damage) return;

        const newTx: Transaction = {
            id: `trx${Date.now()}`,
            ...newTransaction,
            cost: damage.estimatedCost,
            status: TransactionStatus.PENDING,
        };
        setTransactions([newTx, ...transactions]);
        setShowForm(false);
        setNewTransaction({
            customerName: '', customerPhone: '', damageId: damages[0]?.id || '', 
            entryDate: new Date().toISOString().split('T')[0], pickupDate: ''
        });
    };

    const handleStatusChange = (id: string, status: TransactionStatus) => {
        setTransactions(transactions.map(tx => tx.id === id ? { ...tx, status } : tx));
    };
    
    const handlePickupDateChange = (id: string, date: string) => {
        setTransactions(transactions.map(tx => (tx.id === id ? { ...tx, pickupDate: date } : tx)));
    };

    const getDamageName = (damageId: string) => damages.find(d => d.id === damageId)?.name || 'Unknown';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Data Transaksi Pelanggan</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-accent hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    {showForm ? 'Batal' : '+ Tambah Transaksi'}
                </button>
            </div>

            {showForm && (
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-4">Form Transaksi Baru</h2>
                    <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="customerName" placeholder="Nama Pelanggan" value={newTransaction.customerName} onChange={handleInputChange} required className="input-field" />
                        <input type="tel" name="customerPhone" placeholder="No. HP" value={newTransaction.customerPhone} onChange={handleInputChange} required className="input-field" />
                        <select name="damageId" value={newTransaction.damageId} onChange={handleInputChange} className="input-field">
                            {damages.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <input type="date" name="entryDate" value={newTransaction.entryDate} onChange={handleInputChange} className="input-field" />
                        <input type="date" name="pickupDate" value={newTransaction.pickupDate} onChange={handleInputChange} className="input-field" />
                        <button type="submit" className="md:col-span-2 bg-accent/80 hover:bg-accent text-white font-bold py-2 px-4 rounded-lg">Simpan</button>
                    </form>
                </div>
            )}

            <div className="bg-surface/60 backdrop-blur-lg border border-white/10 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-transparent">
                        <tr>
                            <th className="p-4">Nama Pelanggan</th>
                            <th className="p-4">Kerusakan</th>
                            <th className="p-4">Biaya</th>
                            <th className="p-4">Tanggal Masuk</th>
                            <th className="p-4">Tanggal Ambil</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b border-white/10 hover:bg-white/5">
                                <td className="p-4">{tx.customerName}</td>
                                <td className="p-4">{getDamageName(tx.damageId)}</td>
                                <td className="p-4">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.cost)}</td>
                                <td className="p-4">{tx.entryDate}</td>
                                <td className="p-4">
                                    <input
                                        type="date"
                                        value={tx.pickupDate || ''}
                                        onChange={(e) => handlePickupDateChange(tx.id, e.target.value)}
                                        className="input-field w-full p-2"
                                    />
                                </td>
                                <td className="p-4">
                                    <select 
                                        value={tx.status}
                                        onChange={(e) => handleStatusChange(tx.id, e.target.value as TransactionStatus)}
                                        className={`rounded px-2 py-1 text-sm text-white border-0 ${
                                            tx.status === TransactionStatus.PENDING ? 'bg-yellow-500/80' :
                                            tx.status === TransactionStatus.COMPLETED ? 'bg-blue-500/80' : 'bg-green-500/80'
                                        }`}
                                    >
                                        {Object.values(TransactionStatus).map(s => <option key={s} value={s} className="bg-surface">{s}</option>)}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>{`
            .input-field {
                background-color: rgba(18, 16, 23, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                color: #f9fafb;
            }
            .input-field:focus {
                outline: none;
                border-color: #a855f7;
            }
            `}</style>
        </div>
    );
};

interface Expense {
    id: number;
    description: string;
    amount: number;
}
interface ReportsViewProps {
    user: User;
    transactions: Transaction[];
    damages: Damage[];
}

// View for Reports
const ReportsView: React.FC<ReportsViewProps> = ({ user, transactions, damages }) => {
    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
            return JSON.parse(savedExpenses);
        }
        return [
            { id: 1, description: 'Sewa Ruko Bulan Ini', amount: 2000000 },
            { id: 2, description: 'Pembelian Stok Sparepart', amount: 3500000 },
        ];
    });
    const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNumber = parseFloat(newExpense.amount);
        if (newExpense.description && !isNaN(amountNumber) && amountNumber > 0) {
            setExpenses([...expenses, { id: Date.now(), description: newExpense.description, amount: amountNumber }]);
            setNewExpense({ description: '', amount: '' });
        }
    };

    const handleRemoveExpense = (id: number) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    const totalTransactions = transactions.length;
    const totalRevenue = transactions.reduce((acc, tx) => acc + tx.cost, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    const damageCounts = useMemo(() => {
        const counts = new Map<string, number>();
        transactions.forEach(tx => {
            counts.set(tx.damageId, (counts.get(tx.damageId) || 0) + 1);
        });
        return counts;
    }, [transactions]);

    const mostCommonDamageId = useMemo(() => {
        if (damageCounts.size === 0) return null;
        return [...damageCounts.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
    }, [damageCounts]);

    const mostCommonDamage = damages.find(d => d.id === mostCommonDamageId);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-text-primary">Laporan Keuangan & Operasional</h1>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                    <h3 className="text-text-secondary text-lg">Total Transaksi</h3>
                    <p className="text-4xl lg:text-3xl xl:text-2xl font-bold text-accent">{totalTransactions}</p>
                </div>
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                    <h3 className="text-text-secondary text-lg">Total Pendapatan</h3>
                    <p className="text-4xl lg:text-3xl xl:text-2xl font-bold text-green-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalRevenue)}</p>
                </div>
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                    <h3 className="text-text-secondary text-lg">Total Pengeluaran</h3>
                    <p className="text-4xl lg:text-3xl xl:text-2xl font-bold text-red-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalExpenses)}</p>
                </div>
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                    <h3 className="text-text-secondary text-lg">Laba Bersih</h3>
                    <p className="text-4xl lg:text-3xl xl:text-2xl font-bold text-teal-400">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(netProfit)}</p>
                </div>
                <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                    <h3 className="text-text-secondary text-lg">Kerusakan Terbanyak</h3>
                    <p className="text-2xl font-bold text-yellow-400">{mostCommonDamage?.name || 'N/A'}</p>
                    {mostCommonDamage && <p className="text-text-secondary">{damageCounts.get(mostCommonDamage.id)} kali</p>}
                </div>
            </div>

            {/* Expense Management */}
            <div className="bg-surface/60 backdrop-blur-lg border border-white/10 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">Detail Pengeluaran</h2>
                
                {user.role === Role.OWNER && (
                    <form onSubmit={handleAddExpense} className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input type="text" placeholder="Deskripsi Pengeluaran" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} required className="input-field flex-grow" />
                        <input type="number" placeholder="Jumlah (IDR)" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} required className="input-field" />
                        <button type="submit" className="bg-accent hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">Tambah</button>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-transparent">
                            <tr>
                                <th className="p-4">Deskripsi</th>
                                <th className="p-4 text-right">Jumlah</th>
                                {user.role === Role.OWNER && <th className="p-4 text-right">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(exp => (
                                <tr key={exp.id} className="border-b border-white/10">
                                    <td className="p-4">{exp.description}</td>
                                    <td className="p-4 text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(exp.amount)}</td>
                                    {user.role === Role.OWNER && (
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleRemoveExpense(exp.id)} className="text-red-500 hover:text-red-400 font-semibold">
                                                Hapus
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
            .input-field {
                background-color: rgba(18, 16, 23, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                color: #f9fafb;
            }
            .input-field:focus {
                outline: none;
                border-color: #a855f7;
            }
            `}</style>
        </div>
    );
};


// Main Dashboard Component
const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<'repair' | 'transactions' | 'reports'>('repair');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : TRANSACTIONS;
  });

  const [damages, setDamages] = useState<Damage[]>(() => {
    const savedDamages = localStorage.getItem('damages');
    return savedDamages ? JSON.parse(savedDamages) : MOCK_DAMAGES;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('damages', JSON.stringify(damages));
  }, [damages]);


  const NavItem: React.FC<{
    label: string;
    view: 'repair' | 'transactions' | 'reports';
    icon: React.ReactNode;
  }> = ({ label, view, icon }) => (
    <button
        onClick={() => setActiveView(view)}
        className={`flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
            activeView === view ? 'bg-accent text-white' : 'text-text-secondary hover:bg-white/10 hover:text-white'
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface/60 backdrop-blur-xl border-r border-white/10 p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-10 px-2">
            <DevicePhoneMobileIcon className="h-8 w-8 text-accent"/>
            <h1 className="text-xl font-bold text-text-primary">Repair HP Kaltim</h1>
        </div>
        <nav className="flex-grow">
          <NavItem label="Cari Kerusakan" view="repair" icon={<SearchIcon className="h-5 w-5" />} />
          <NavItem label="Data Transaksi" view="transactions" icon={<ClipboardListIcon className="h-5 w-5" />} />
          <NavItem label="Laporan" view="reports" icon={<ChartBarIcon className="h-5 w-5" />} />
        </nav>
        <div className="mt-auto">
            <button onClick={onLogout} className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition duration-200">
                <LogoutIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-surface/60 backdrop-blur-xl border-b border-white/10 p-4 flex justify-end items-center shadow-md">
            <div className="text-right">
                <p className="font-semibold text-text-primary">{user.username}</p>
                <p className="text-sm text-text-secondary capitalize">{user.role}</p>
            </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {activeView === 'repair' && <RepairGuideView damages={damages} setDamages={setDamages} />}
          {activeView === 'transactions' && <TransactionsView transactions={transactions} setTransactions={setTransactions} damages={damages}/>}
          {activeView === 'reports' && <ReportsView user={user} transactions={transactions} damages={damages} />}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;