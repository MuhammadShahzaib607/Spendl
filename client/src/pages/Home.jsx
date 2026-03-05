import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, ShieldCheck, PieChart, Zap, ArrowRight, 
  Loader2, Plus, Trash2, AlertCircle 
} from 'lucide-react';
import CreateNewYearForm from '../components/CreateNewYearForm.jsx';

const API_BASE = import.meta.env.VITE_API_URL;

const Home = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Delete States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchYears = async () => {
    try {
      const res = await axios.get(`${API_BASE}years`);
      setYears(res.data.data || []);
    } catch (err) {
      console.error("Error fetching years:", err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => { fetchYears(); }, []);

  // DELETE FUNCTION
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`${API_BASE}year/${deleteId}`);
      if (res.data.success) {
        setYears(years.filter(y => y._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()}`;
  };

  return (
    <>
      {/* 1. CREATE YEAR MODAL */}
      <CreateNewYearForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onYearCreated={(newYear) => setYears([...years, newYear])}
      />

      {/* 2. CUSTOM DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteId(null)}
              className="absolute inset-0 bg-[#002366]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm w-full relative z-10 border border-gray-100"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-[#002366] mb-2">Delete Record?</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8 font-medium">
                This action cannot be undone. All monthly data for this year will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-lg shadow-rose-200 flex items-center justify-center min-h-[44px]"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
        
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-16 px-6 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="bg-blue-100 text-[#002366] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Finance Manager v1.0
              </span>
              <h1 className="mt-6 text-4xl md:text-5xl font-black text-[#002366] tracking-tight">
                Track Your Wealth <br /> <span className="text-blue-600">Year by Year.</span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="px-6 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Assets", val: "Secure", icon: ShieldCheck, color: "text-blue-600" },
              { label: "Real-time Sync", val: "Active", icon: Zap, color: "text-amber-500" },
              { label: "Analytics", val: "Enabled", icon: PieChart, color: "text-emerald-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}><stat.icon size={18} /></div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{stat.label}</p>
                  <p className="text-sm font-bold text-[#002366]">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* YEARS GRID */}
        <section className="max-w-7xl mx-auto px-6 py-20 min-h-[400px]">
          <div className="mb-10 flex justify-between items-end">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#002366]">Financial Years</h2>
              <p className="text-sm text-gray-400">Select a year to view monthly breakdown</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-[#002366] text-white p-3 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-black transition-colors cursor-pointer"
            >
              <Plus size={24} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
                <Loader2 className="text-[#002366] animate-spin mb-4" size={40} />
                <p className="text-sm font-medium text-gray-400 animate-pulse">Fetching records...</p>
              </motion.div>
            ) : (
              <motion.div initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {years.length > 0 ? (
                  years.map((item) => (
                    <div key={item._id} className="relative group">
                      {/* Delete Trigger Button */}
                      <button 
                        onClick={() => setDeleteId(item._id)}
                        className="absolute top-4 right-4 z-30 p-2 bg-white/80 backdrop-blur-md text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white border border-gray-100 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>

                      <Link to={`/year/${item._id}`}>
                        <motion.div 
                          whileHover={{ y: -5 }}
                          className="bg-white border border-gray-100 p-6 rounded-[2.5rem] h-full transition-all hover:shadow-xl hover:shadow-blue-100/50"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="bg-blue-50 p-3 rounded-2xl text-[#002366] group-hover:bg-[#002366] group-hover:text-white transition-colors">
                              <Calendar size={18} />
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 italic mt-1">{formatDate(item.createdAt)}</p>
                          </div>

                          <h3 className="text-3xl font-black text-[#002366] mb-4">{item.year}</h3>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/20">
                              <span className="text-[9px] font-bold text-emerald-700/60 uppercase">Income</span>
                              <span className="text-sm font-black text-emerald-600">Rs. {item.annualIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/20">
                              <span className="text-[9px] font-bold text-rose-700/60 uppercase">Expense</span>
                              <span className="text-sm font-black text-rose-600">Rs. {item.annualExpense.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mt-6 flex items-center text-[#002366] font-bold text-[10px] gap-2 uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                            View Ledger <ArrowRight size={12} />
                          </div>
                        </motion.div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No records found. Add a year to begin.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* INFO SECTION */}
        <section className="bg-[#002366] py-24 px-6 overflow-hidden relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-white">
              <h2 className="text-3xl font-black mb-6 italic tracking-tight">Financial Intelligence.</h2>
              <p className="text-blue-200 text-sm leading-relaxed mb-8 opacity-70 max-w-sm">
                Our architecture ensures every penny is accounted for. Track trends, analyze monthly spikes, and grow your savings.
              </p>
              <div className="flex gap-10">
                <div><h4 className="text-2xl font-black text-white">99.9%</h4><p className="text-[9px] uppercase font-black text-blue-400">Accuracy</p></div>
                <div><h4 className="text-2xl font-black text-white">Cloud</h4><p className="text-[9px] uppercase font-black text-blue-400">Storage</p></div>
              </div>
            </div>
            <div className="hidden lg:block">
               <div className="border border-blue-400/20 bg-white/5 backdrop-blur-md p-10 rounded-[3.5rem]">
                  <p className="text-blue-100 italic text-sm leading-loose opacity-80">
                    "Control your money or the lack of it will control you. This dashboard is your first step towards total financial command."
                  </p>
               </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-10 -mr-20 -mt-20"></div>
        </section>

        <footer className="py-12 text-center border-t border-gray-50">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">
            &copy; 2026 Spendl — Financial Command Center
          </p>
        </footer>
      </div>
    </>
  );
};

export default Home;