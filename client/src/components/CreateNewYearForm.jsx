import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calendar, Plus, Loader2, X, AlertCircle } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}year`;

const CreateNewYearForm = ({ isOpen, onClose, onYearCreated }) => {
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation: Year should be a valid 4-digit number
    if (!year || year.length !== 4) {
      setError('Please enter a valid 4-digit year.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        year: Number(year) // Ensuring it's sent as a number
      });

      if (response.data.success) {
        setYear('');
        if (onYearCreated) onYearCreated(response.data.data);
        if (onClose) onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create year. Try again.');
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#002366]/20 backdrop-blur-sm"
          />

          {/* Form Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden border border-gray-100"
          >
            {/* Header Area */}
            <div className="bg-[#002366] p-6 text-white relative">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-400/30">
                <Calendar size={20} className="text-blue-100" />
              </div>
              <h2 className="text-lg font-black tracking-tight italic">Initialize New Year</h2>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest opacity-80 mt-1">
                Start tracking a new fiscal period
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2 block">
                    Target Year
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      placeholder="e.g. 2026"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      disabled={loading}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-[#002366] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300 appearance-none"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100"
                  >
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">{error}</span>
                  </motion.div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002366] hover:bg-black text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Create Year</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">
                Secure Cloud Initialization
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateNewYearForm;