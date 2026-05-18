import { Users, Layout, Activity, MessageSquare, ShieldCheck, Search, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'system' | 'ai'>('users');

  return (
    <div className="flex h-screen bg-[#050608] text-slate-200 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0B0F] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-studio-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-studio-primary/20">
            S1
          </div>
          <span className="font-bold uppercase tracking-widest text-sm">Admin Control</span>
        </div>

        <nav className="flex-1 space-y-2">
          <AdminNavItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <AdminNavItem icon={Layout} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <AdminNavItem icon={Activity} label="System Health" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
          <AdminNavItem icon={MessageSquare} label="Support" active={activeTab === 'support' as any} onClick={() => setActiveTab('support' as any)} />
          <AdminNavItem icon={ShieldCheck} label="AI Control" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-3">
             <div className="w-8 h-8 rounded-full bg-studio-surface border border-white/10 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <Users size={16} />}
             </div>
             <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{user?.displayName || 'Admin'}</div>
                <div className="text-[10px] text-slate-500 uppercase">Super User</div>
             </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-white transition-colors text-sm">
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
         <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0B0F]/50 backdrop-blur-xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
               {activeTab} Management
            </h2>
            <div className="flex items-center gap-4">
               <div className="bg-studio-surface border border-white/5 rounded-full px-4 py-1.5 flex items-center gap-2 group focus-within:border-studio-primary/50 transition-colors">
                  <Search size={14} className="text-slate-600 group-focus-within:text-studio-primary" />
                  <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs w-48" />
               </div>
               <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
         </header>

         <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'system' && <SystemHealth />}
            {activeTab === 'projects' && <ProjectBrowser />}
            {activeTab === 'ai' && <AIControl />}
         </div>
      </main>
    </div>
  );
}

function AdminNavItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-studio-primary text-white shadow-lg shadow-studio-primary/20' : 'text-slate-500 hover:bg-studio-surface hover:text-slate-200'}`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium tracking-tight">{label}</span>
    </button>
  );
}

function UserManagement() {
  const users = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', storage: '4.2 GB', status: 'active', joined: '2024-01-15' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', storage: '8.1 GB', status: 'active', joined: '2024-02-01' },
    { id: '3', name: 'Charlie Dave', email: 'charlie@example.com', storage: '1.2 GB', status: 'suspended', joined: '2024-02-12' },
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Users" value="1,284" change="+12%" />
          <StatCard label="Active Now" value="42" change="+5" />
          <StatCard label="Storage Capacity" value="12.4 TB" change="42%" />
          <StatCard label="AI Jobs (24h)" value="842" change="-2%" />
       </div>

       <div className="bg-studio-surface border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
             <thead className="bg-black/20 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
                <tr>
                   <th className="px-6 py-4">User</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Storage</th>
                   <th className="px-6 py-4">Joined</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-studio-hover/50 transition-colors">
                    <td className="px-6 py-5">
                       <div className="flex flex-col">
                          <span className="font-bold">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                          {u.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs">{u.storage}</td>
                    <td className="px-6 py-5 text-slate-500">{u.joined}</td>
                    <td className="px-6 py-5 text-right">
                       <button className="text-studio-primary hover:underline text-xs font-bold px-3">Suspend</button>
                       <button className="text-slate-500 hover:text-white text-xs font-bold">Edit</button>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function SystemHealth() {
  return (
    <div className="grid grid-cols-2 gap-8">
       <div className="bg-studio-surface border border-white/5 rounded-2xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center justify-between">
             <span>Server Load (CPU)</span>
             <span className="text-success">12%</span>
          </h3>
          <div className="h-48 flex items-end gap-1 px-2">
             {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="flex-1 bg-studio-primary/20 hover:bg-studio-primary transition-colors rounded-t-sm" style={{ height: `${20 + Math.random() * 80}%` }} />
             ))}
          </div>
       </div>

       <div className="bg-studio-surface border border-white/5 rounded-2xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Database Health</h3>
          <div className="space-y-4">
             <HealthMetric label="Query Latency" value="14ms" status="excellent" />
             <HealthMetric label="Active Connections" value="1,204" status="normal" />
             <HealthMetric label="Error Rate" value="0.02%" status="excellent" />
             <HealthMetric label="Redis Cache Hit" value="98.2%" status="excellent" />
          </div>
       </div>
    </div>
  );
}

function StatCard({ label, value, change }: { label: string, value: string, change: string }) {
  const isUp = change.startsWith('+');
  return (
    <div className="bg-studio-surface border border-white/5 p-6 rounded-2xl shadow-xl">
       <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">{label}</div>
       <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className={`text-xs font-bold ${isUp ? 'text-success' : 'text-danger'}`}>{change}</div>
       </div>
    </div>
  );
}

function HealthMetric({ label, value, status }: { label: string, value: string, status: 'excellent' | 'normal' | 'critical' }) {
   return (
      <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
         <span className="text-sm text-slate-400">{label}</span>
         <div className="flex items-center gap-3">
            <span className="text-sm font-bold font-mono">{value}</span>
            <div className={`w-2 h-2 rounded-full ${status === 'excellent' ? 'bg-success' : status === 'normal' ? 'bg-studio-primary' : 'bg-danger'}`} />
         </div>
      </div>
   );
}

function ProjectBrowser() {
   return (
      <div className="grid grid-cols-3 gap-6">
         {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group bg-studio-surface border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-studio-primary/30 transition-all">
               <div className="h-40 bg-black flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  <div className="text-[10px] uppercase tracking-tighter text-slate-700 font-bold group-hover:scale-110 transition-transform">NO THUMBNAIL</div>
               </div>
               <div className="p-4">
                  <div className="text-sm font-bold truncate mb-1">Untiteld Song_{i}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                     <span>Owner ID: user_k2j{i}</span>
                     <span>2.4 MB</span>
                  </div>
               </div>
               <div className="px-4 pb-4 flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase py-2 rounded-lg transition-colors">Inspect</button>
                  <button className="flex-1 bg-danger/10 hover:bg-danger/20 text-danger text-[10px] font-bold uppercase py-2 rounded-lg transition-colors">Delete</button>
               </div>
            </div>
         ))}
      </div>
   );
}

function AIControl() {
  const jobs = [
    { id: 'job_482', type: 'Suno AI', user: 'akewushola...', status: 'complete', cost: '$0.04' },
    { id: 'job_481', type: 'Whisper', user: 'bob_dev', status: 'complete', cost: '$0.01' },
    { id: 'job_480', type: 'Demucs', user: 'charlie', status: 'failed', cost: '$0.00' },
  ];

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-3 gap-6">
          <StatCard label="Token Usage" value="1.4M" change="+12%" />
          <StatCard label="AI API Cost" value="$142.50" change="-$14" />
          <StatCard label="Success Rate" value="99.2%" change="+0.5%" />
       </div>

       <div className="bg-studio-surface border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live AI Jobs</h3>
             <button className="text-[10px] uppercase font-bold text-studio-primary px-3 py-1 bg-studio-primary/10 rounded-full">Clear History</button>
          </div>
          <table className="w-full text-left">
             <thead className="bg-black/20 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
                <tr>
                   <th className="px-6 py-4">Job ID</th>
                   <th className="px-6 py-4">Type</th>
                   <th className="px-6 py-4">User</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Cost</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5 text-sm">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-studio-hover/50 transition-colors">
                    <td className="px-6 py-5 font-mono text-xs">{j.id}</td>
                    <td className="px-6 py-5 font-bold">{j.type}</td>
                    <td className="px-6 py-5 text-slate-400">{j.user}</td>
                    <td className="px-6 py-5">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${j.status === 'complete' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                          {j.status}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right font-mono">{j.cost}</td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}
