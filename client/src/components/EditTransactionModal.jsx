import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, Save, Loader2, Tag, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL;

const EditTransactionModal = ({ isOpen, onClose, yearId, monthId, transaction, onUpdated }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense' });
  const [loading, setLoading] = useState(false);

  // Jab modal khule aur transaction data aaye, toh form fill ho jaye
  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE}transaction/${transaction._id}`, {
        yearId,
        monthId,
        ...formData,
        amount: Number(formData.amount)
      });

      if (res.data.success) {
        onUpdated();
        onClose();
      }
    } catch (err) {
      console.error("Update Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#002366]/30 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-[380px] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-[#002366] px-6 py-5 text-white flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-widest italic">Edit Transaction</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full cursor-pointer transition-colors"><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                {['income', 'expense'].map((t) => (
                  <button key={t} type="button" onClick={() => setFormData({ ...formData, type: t })}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${formData.type === t ? 'bg-white shadow-sm text-[#002366]' : 'text-gray-400'}`}>
                    {t === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />} {t}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Title</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-[#002366] focus:outline-none focus:border-blue-400 transition-all" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">Amount (Rs.)</label>
                  <input required type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold text-[#002366] focus:outline-none focus:border-blue-400 transition-all" />
                </div>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full py-4 bg-[#002366] text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer hover:bg-black transition-all">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Update Details</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditTransactionModal;