import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { CalendarDays, ChevronDown, Check, Loader2, X } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL}month`;

const monthsList = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const CreateNewMonthForm = ({ isOpen, onClose, yearId, onMonthCreated }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!selectedMonth) return;

  setLoading(true);
  try {
    const response = await axios.post(API_URL, {
      yearId: yearId, // Make sure iska name backend ki requirement ke mutabiq ho (yearId ya YearId)
      monthName: selectedMonth
    });

    if (response.data.success) {
      // Pehle dropdown aur selection clear karein
      setSelectedMonth('');
      setIsDropdownOpen(false);
      
      // Parent ko batayein ke data change hua hai (Ye useEffect trigger karega)
      if (onMonthCreated) onMonthCreated(response.data.data);
      
      // Modal close kar dein
      if (onClose) onClose();
    }
  } catch (err) {
    console.error("Error creating month:", err);
    alert("Failed to create month. Maybe it already exists?");
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-[#002366]/30 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
          >
            <div className="bg-[#002366] p-6 text-white">
              <button onClick={onClose} className="absolute right-4 top-4 p-1 hover:bg-white/10 rounded-full transition-colors"><X size={18} /></button>
              <h2 className="text-lg font-black italic">Add New Month</h2>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest mt-1">Select month to initialize</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-6 relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Choose Month</label>
                
                {/* Custom Dropdown Trigger */}
                <div 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-[#002366] flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all"
                >
                  {selectedMonth || "Select a month"}
                  <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-48 overflow-y-auto custom-scrollbar"
                    >
                      {monthsList.map((m) => (
                        <div 
                          key={m}
                          onClick={() => { setSelectedMonth(m); setIsDropdownOpen(false); }}
                          className="px-5 py-3 text-xs font-bold text-gray-600 hover:bg-blue-50 hover:text-[#002366] flex items-center justify-between cursor-pointer"
                        >
                          {m}
                          {selectedMonth === m && <Check size={14} className="text-blue-600" />}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                disabled={loading || !selectedMonth}
                className="w-full bg-[#002366] text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><CalendarDays size={16} /> Create Month</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateNewMonthForm;