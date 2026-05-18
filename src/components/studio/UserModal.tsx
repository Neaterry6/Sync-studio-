import { X, User, Mail, Shield, Trash2, Smartphone, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../context/AuthContext";

import { useThemeStore, StudioTheme } from "../../store/useThemeStore";

interface UserModalProps {
  type: "profile" | "settings";
  onClose: () => void;
}

const THEMES: { id: StudioTheme; name: string; color: string }[] = [
  { id: 'purple', name: 'Studio Purple', color: '#7C3AED' },
  { id: 'cyan', name: 'Neon Cyan', color: '#00D9FF' },
  { id: 'orange', name: 'Sunset Orange', color: '#F59E0B' },
  { id: 'pink', name: 'Vapor Pink', color: '#EC4899' },
  { id: 'mono', name: 'Mono Dark', color: '#FFFFFF' },
];

export function UserModal({ type, onClose }: UserModalProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useThemeStore();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#151515] border border-[#222] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#222]">
          <h2 className="text-xl font-bold uppercase tracking-widest text-studio-primary">
            {type === 'profile' ? 'User Profile' : 'Account Settings'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[#222] rounded-full text-[#555] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {type === 'profile' ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-[#111] border-2 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-studio-primary/20 flex items-center justify-center text-studio-primary text-3xl font-bold">
                      {user?.displayName ? getInitials(user.displayName) : <User size={40} />}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-studio-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer transform translate-x-1 translate-y-1">
                   <Smartphone size={14} />
                   <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div className="w-full space-y-4">
                <div className="p-4 bg-studio-bg rounded-xl border border-white/5">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 block mb-1 font-bold">Display Name</span>
                   <div className="text-sm font-medium">{user?.displayName || 'Studio Artist'}</div>
                </div>
                <div className="p-4 bg-studio-bg rounded-xl border border-white/5">
                   <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 block mb-1 font-bold">Email Address</span>
                   <div className="text-sm font-medium">{user?.email || 'not-linked@studio-one.app'}</div>
                </div>
                <div className="p-4 bg-studio-bg rounded-xl border border-white/5 flex items-center justify-between">
                   <div>
                     <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 block mb-1 font-bold">Account Tier</span>
                     <div className="text-studio-primary text-sm font-black italic">FREE EDITION</div>
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 block mb-1 font-bold">Cloud Storage</span>
                     <div className="text-xs text-slate-400">1.2GB / 10GB</div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
               <section>
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Appearance</h3>
                 <div className="grid grid-cols-1 gap-2">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          theme === t.id 
                            ? 'bg-studio-primary/10 border-studio-primary' 
                            : 'bg-studio-bg border-white/5 hover:bg-studio-hover'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.color }} />
                          <span className={`text-sm font-bold ${theme === t.id ? 'text-white' : 'text-slate-400'}`}>
                            {t.name}
                          </span>
                        </div>
                        {theme === t.id && (
                          <div className="w-2 h-2 rounded-full bg-studio-primary shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        )}
                      </button>
                    ))}
                 </div>
               </section>

               <section>
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Security</h3>
                 <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222] rounded-xl transition-colors border border-[#222]">
                       <div className="flex items-center gap-3">
                          <Shield size={18} className="text-[#888]" />
                          <span className="text-sm">Change Password</span>
                       </div>
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#222] rounded-xl transition-colors border border-[#222]">
                       <div className="flex items-center gap-3">
                          <Smartphone size={18} className="text-[#888]" />
                          <span className="text-sm">Manage Devices</span>
                       </div>
                    </button>
                 </div>
               </section>

               <section>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#444] mb-4">Communication</h3>
                 <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#222]">
                    <div className="text-sm">Marketing Emails</div>
                    <div className="w-10 h-5 bg-[#222] rounded-full relative">
                       <div className="absolute left-1 top-1 w-3 h-3 bg-[#444] rounded-full" />
                    </div>
                 </div>
               </section>

               <section className="pt-4 border-t border-[#222]">
                  <button className="w-full flex items-center gap-3 p-4 bg-red-950/20 hover:bg-red-950/40 text-red-500 rounded-xl transition-colors border border-red-900/20 group">
                    <Trash2 size={18} />
                    <span className="text-sm font-bold">Delete Account</span>
                  </button>
                  <p className="mt-2 text-[10px] text-[#444] px-4 italic">
                    All cloud projects and assets will be permanently deleted. This action cannot be undone.
                  </p>
               </section>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#222] bg-[#0d0d0d] flex items-center justify-between">
           <button 
             onClick={() => { logout(); onClose(); }}
             className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
           >
             <LogOut size={16} />
             <span>Sign Out</span>
           </button>
           <button 
             onClick={onClose}
             className="bg-studio-primary text-white px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-studio-primary-hover shadow-lg shadow-studio-primary/20 transition-all hover:scale-105 active:scale-95"
           >
             Save Changes
           </button>
        </div>
      </motion.div>
    </div>
  );
}
