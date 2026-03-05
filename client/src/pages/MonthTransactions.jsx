import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, Plus, Search, Filter, ArrowUpCircle, 
  ArrowDownCircle, Wallet, Calendar, Trash2, Edit3, 
  Loader2, MoreHorizontal 
} from 'lucide-react';
import CreateNewTransactionForm from '../components/CreateNewTransactionForm.jsx';
import EditTransactionModal from '../components/EditTransactionModal.jsx';

const API_BASE = import.meta.env.VITE_API_URL;

const MonthTransactions = () => {
  const { yearId, monthId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // New: For Delete/Actions
  
  // States for Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async (showMainLoader = false) => {
    if (showMainLoader) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}month/${yearId}/${monthId}`);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setActionLoading(false);
      }, 600);
    }
  };

  useEffect(() => { fetchTransactions(true); }, [yearId, monthId]);

  // DELETE FUNCTION with Loading State
  const handleDelete = async (txId) => {
  setActionLoading(true); // Start Loading
    try {
      const res = await axios.delete(`${API_BASE}transaction/${txId}`, {
        data: { yearId, monthId } 
      });
      if (res.data.success) {
        await fetchTransactions(false); // Re-fetch without showing main full-screen loader
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  });

  // Full Screen Initial Loader
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-[#002366]" size={30} />
      <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Loading Records...</p>
    </div>
  );

  return (
    <>
      {/* Global Action Loader (Overlay when deleting) */}
      <AnimatePresence>
        {actionLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white/60 backdrop-blur-[2px] flex items-center justify-center"
          >
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
              <Loader2 className="animate-spin text-rose-500 mb-3" size={24} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Updating Ledger...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <CreateNewTransactionForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        yearId={yearId} 
        monthId={monthId} 
        onTransactionCreated={() => fetchTransactions(false)} 
      />
      
      <EditTransactionModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedTx(null); }} 
        yearId={yearId} 
        monthId={monthId} 
        transaction={selectedTx} 
        onUpdated={() => fetchTransactions(false)} 
      />

      <div className="min-h-screen bg-[#FBFDFF] text-gray-900 font-sans pb-10">
        
        {/* 1. COMPACT STICKY HEADER */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-gray-500">
              <ArrowLeft size={20} />
            </button>
            <div className="text-center">
              <h1 className="text-sm font-black text-[#002366] uppercase tracking-widest">
                {data?.monthName} Transactions
              </h1>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="p-2 bg-[#002366] text-white rounded-xl shadow-lg cursor-pointer active:scale-95 transition-all hover:bg-black">
              <Plus size={18} />
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          
          {/* 2. SUMMARY DASHBOARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={16}/></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Current Balance</p>
              </div>
              <h2 className="text-xl font-black text-[#002366]">Rs. {data?.balance.toLocaleString()}</h2>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ArrowUpCircle size={16}/></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Income</p>
              </div>
              <h2 className="text-xl font-black text-emerald-600">Rs. {data?.totalIncome.toLocaleString()}</h2>
            </div>

            <div className="bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ArrowDownCircle size={16}/></div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Expense</p>
              </div>
              <h2 className="text-xl font-black text-rose-500">Rs. {data?.totalExpense.toLocaleString()}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 3. TRANSACTIONS LIST */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-[#002366] uppercase tracking-widest">Recent Activity</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#002366] cursor-pointer"><Search size={14}/></button>
                  <button className="p-2 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-[#002366] cursor-pointer"><Filter size={14}/></button>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {data?.data.map((item, idx) => (
                    <motion.div 
                      key={item._id} 
                      layout 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-blue-200 transition-all shadow-sm shadow-gray-500/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                          item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {item.type === 'income' ? <ArrowUpCircle size={18}/> : <ArrowDownCircle size={18}/>}
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-800">{item.title}</h4>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Calendar size={10} /> {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-black ${
                            item.type === 'income' ? 'text-emerald-600' : 'text-gray-900'
                          }`}>
                            {item.type === 'income' ? '+' : '-'} Rs. {item.amount.toLocaleString()}
                          </p>
                        </div>

                        {/* EDIT & DELETE ACTIONS */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            disabled={actionLoading}
                            onClick={() => { setSelectedTx(item); setIsEditModalOpen(true); }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer disabled:opacity-50"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            disabled={actionLoading}
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {data?.data.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No transactions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. SIDEBAR SECTIONS */}
            <div className="space-y-6">
              {/* Quick Analytics Card */}
              <div className="bg-[#002366] text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-4">Budget Health</h4>
                <p className="text-xs leading-relaxed opacity-80 mb-6">
                  You have utilized <span className="text-white font-bold">{(data?.totalExpense / (data?.totalIncome || 1) * 100).toFixed(0)}%</span> of your total income this month. 
                </p>
                <div className="h-1.5 w-full bg-blue-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.min((data?.totalExpense / (data?.totalIncome || 1) * 100), 100)}%` }} 
                    className="h-full bg-blue-400" 
                  />
                </div>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
              </div>

              {/* Daily Average Card */}
              <div className="bg-white border border-gray-100 p-6 rounded-[2rem]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Spending Velocity</h4>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-black text-[#002366]">Rs. {(data?.totalExpense / 30).toFixed(0)}</h3>
                  <span className="text-[10px] text-gray-400 pb-1 font-bold">/ AVG DAY</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">*Based on 30-day billing cycle</p>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-gray-50 py-8 text-center">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">Audit Trail Active</p>
        </footer>
      </div>
    </>
  );
};

export default MonthTransactions;