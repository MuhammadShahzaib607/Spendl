import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  CalendarDays, 
  ChevronRight, 
  Info,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Layers
} from 'lucide-react';
import CreateNewMonthForm from '../components/CreateNewMonthForm';

const API_BASE = import.meta.env.VITE_API_URL;

const YearDetails = () => {
  const { id } = useParams();
  const [yearData, setYearData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete States
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchYearDetails = async (showMainLoader = false) => {
    if (showMainLoader) setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}year/${id}`);
      if (res.data.success) {
        setYearData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching year details:", err);
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (id) fetchYearDetails(true);
  }, [id]);

  // DELETE FUNCTION
  const handleDeleteMonth = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      // URL: month/:yearId/:monthId
      const res = await axios.delete(`${API_BASE}month/${id}/${deleteId}`);
      if (res.data.success) {
        setDeleteId(null);
        fetchYearDetails(false); // Refresh data without full screen loader
      }
    } catch (err) {
      console.error("Delete Error:", err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#002366] mb-4" size={32} />
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Loading Year Data...</p>
      </div>
    );
  }

  return (
    <>
      <CreateNewMonthForm
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        yearId={id} 
        onMonthCreated={() => fetchYearDetails(false)} 
      />

      {/* DELETE CONFIRMATION MODAL */}
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
              <h3 className="text-lg font-black text-[#002366] mb-2">Remove Month?</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8 font-medium">
                Are you sure you want to delete this month? All transactions within this period will be lost forever.
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
                  onClick={handleDeleteMonth}
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

      <div className="min-h-screen bg-[#FDFDFF] pb-20 font-sans">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[#002366] transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-wider cursor-pointer">Back to Years</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-black text-[#002366]">Year {yearData?.year}</h1>
            </div>
            <div className="w-24 flex justify-end"> {/* Placeholder to keep title centered */}
               <Layers size={18} className="text-gray-200" />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 mt-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-[#002366] p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-blue-900/10"
            >
              <div className="relative z-10">
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Total Annual Income</p>
                <h2 className="text-3xl font-black">Rs. {yearData?.annualIncome.toLocaleString()}</h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] bg-white/10 w-fit px-3 py-1 rounded-full">
                  <TrendingUp size={12} /> Analytics Pulse Active
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 text-white"><TrendingUp size={120} /></div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden"
            >
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Annual Expense</p>
              <h2 className="text-3xl font-black text-[#002366]">Rs. {yearData?.annualExpense.toLocaleString()}</h2>
              <div className="mt-4 flex items-center gap-2 text-[10px] bg-rose-50 text-rose-600 w-fit px-3 py-1 rounded-full font-bold">
                <TrendingDown size={12} /> Monitoring Outflow
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 text-[#002366]"><TrendingDown size={120} /></div>
            </motion.div>
          </div>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-[#002366] flex items-center gap-2 uppercase tracking-tighter italic">
                <CalendarDays size={18} /> Monthly Ledger
              </h3>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-[#002366] text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-900/10 cursor-pointer"
              >
                <Plus size={14} /> Add Month
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {yearData?.months.map((month, idx) => (
                  <div key={month._id} className="relative group">
                    {/* DELETE BUTTON */}
                    <button 
                      onClick={(e) => { e.preventDefault(); setDeleteId(month._id); }}
                      className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white border border-gray-100 cursor-pointer shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>

                    <Link to={`/month/${id}/${month._id}`}>
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white border border-gray-100 p-6 rounded-[2rem] hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-100/30 group/card"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="font-black text-[#002366] text-lg">{month.monthName}</h4>
                          <div className="text-[#002366] opacity-0 group-hover/card:translate-x-1 group-hover/card:opacity-100 transition-all">
                            <ChevronRight size={18} />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Income</span>
                            <span className="text-xs font-black text-emerald-600">+Rs. {month.totalIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Expense</span>
                            <span className="text-xs font-black text-rose-500">-Rs. {month.totalExpense.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="mt-6 h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((month.totalExpense / (month.totalIncome || 1)) * 100, 100)}%` }}
                            className={`h-full rounded-full ${
                              (month.totalExpense > month.totalIncome) ? 'bg-rose-400' : 'bg-blue-500'
                            }`} 
                           />
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* SAVING EFFICIENCY SECTION */}
          <section className="bg-white border border-gray-100 rounded-[2.5rem] p-8 mb-10 shadow-sm shadow-blue-900/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h3 className="text-sm font-black text-[#002366] uppercase tracking-tight">Saving Efficiency</h3>
                <p className="text-[10px] text-gray-400 font-medium">Annualized Savings Potential</p>
              </div>
              <div className="text-3xl font-black text-[#002366]">
                {yearData?.annualIncome > 0 ? Math.round(((yearData.annualIncome - yearData.annualExpense) / yearData.annualIncome) * 100) : 0}%
              </div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
              <div className="bg-blue-600 h-full w-[70%]" />
              <div className="bg-blue-300 h-full w-[15%]" />
            </div>
            <div className="mt-5 flex gap-6">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /><span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Fixed Allocation</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-300" /><span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Variable Flow</span></div>
            </div>
          </section>

          {/* INSIGHTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-blue-50/50 border border-blue-100 p-6 rounded-[2.5rem] flex items-start gap-4">
              <div className="bg-[#002366] p-2.5 rounded-xl text-white shadow-lg shadow-blue-900/20"><Info size={18} /></div>
              <div>
                <h4 className="text-[10px] font-black text-[#002366] uppercase mb-1 tracking-widest">Financial Intelligence</h4>
                <p className="text-xs text-blue-900/60 leading-relaxed font-medium">
                  Your data nodes are synchronized. Based on current trends, your annual net surplus is 
                  <span className="text-[#002366] font-bold"> Rs. {(yearData?.annualIncome - yearData?.annualExpense).toLocaleString()}</span>. 
                  Keep monitoring variable expenses to optimize growth.
                </p>
              </div>
            </div>
          </div>

        </main>

        <footer className="mt-20 py-10 text-center border-t border-gray-50">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Node: {id} — Spendl Secure</p>
        </footer>
      </div>
    </>
  );
};

export default YearDetails;