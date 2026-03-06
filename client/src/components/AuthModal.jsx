import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import axios from 'axios';

const AuthModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  // 1. Show/Hide Password State
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
   e.preventDefault()
   setLoading(true)
   const email = formData.email
   const password = formData.password 
   setTimeout(()=> {
if (email === "shahzaib@gmail.com" && password === "Artist0306") {
sessionStorage.setItem("isAdmin", true)
window.location.reload()
   } else {
       null
    }
    setLoading(false)
   }, 1500)
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-[#002366]/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <div className="bg-[#002366] p-8 text-center relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
            className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 border border-white/10 shadow-inner"
          >
            <ShieldCheck size={24} />
          </motion.div>
          <h2 className="text-white text-xl font-black tracking-tight">Access Secure Node</h2>
          <p className="text-blue-200/60 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Spendl Authentication</p>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20" />
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002366] uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={16} />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-gray-50 border border-gray-100 text-sm py-3.5 pl-11 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300 font-medium"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#002366] uppercase tracking-widest ml-1">Secret Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={16} />
                </div>
                
                <input 
                  type={showPassword ? "text" : "password"} // Dynamic Type Switch
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 text-sm py-3.5 pl-11 pr-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder:text-gray-300 font-medium"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />

                {/* 2. Password Toggle Button */}
                <button 
                  type="button" // Important: Form submit hone se rokne ke liye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#002366] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#002366] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 hover:bg-black transition-all cursor-pointer mt-8"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>Login <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Bottom Info */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              Protected Environment. Unauthorized attempts are <br /> 
              <span className="text-blue-600 font-bold">strictly monitored.</span>
            </p>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-[#002366] to-blue-400" />
      </motion.div>
    </div>
  );
};

export default AuthModal;