import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { X, Plus, Loader2, DollarSign, Tag, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}transaction`;

const CreateNewTransactionForm = ({ isOpen, onClose, yearId, monthId, onTransactionCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense' // Default
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        yearId,
        monthId,
        title: formData.title,
        amount: Number(formData.amount),
        type: formData.type
      });

      if (response.data.success) {
        setFormData({ title: '', amount: '', type: 'expense' });
        if (onTransactionCreated) onTransactionCreated(response.data.data);
        onClose();
      }
    } catch (err) {
      console.error("Transaction Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-[#002366]/30 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative bg-white w-full max-w-[380px] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Minimal Header */}
            <div className="bg-[#002366] px-6 py-5 text-white flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest italic">New Entry</h2>
                <p className="text-[9px] text-blue-200 font-bold uppercase tracking-tighter opacity-70">Add transaction details</p>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Type Toggle (Segmented Control) */}
              <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    formData.type === 'income' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <ArrowUpCircle size={14} /> Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    formData.type === 'expense' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <ArrowDownCircle size={14} /> Expense
                </button>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Title / Category</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#002366] transition-colors">
                    <Tag size={14} />
                  </div>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Shopping, Salary"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-xs font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:font-medium placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1.5 block">Amount (Rs.)</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#002366] transition-colors font-bold text-[10px]">
                    Rs.
                  </div>
                  <input 
                    required
                    type="number" 
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:font-medium placeholder:text-gray-300 appearance-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button 
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className={`w-full py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all mt-2 ${
                  loading ? 'bg-gray-100 text-gray-400' : 'bg-[#002366] text-white hover:bg-black shadow-blue-900/10'
                }`}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Record Transaction</>}
              </motion.button>
            </form>

            <div className="pb-6 text-center">
               <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.3em]">Encrypted Transaction Protocol</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateNewTransactionForm;