import { Music, Video, Image as ImageIcon, PenTool, Layout, Layers, User, Settings, LogIn } from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onProfile: () => void;
  onSettings: () => void;
  isVisible: boolean;
}

export function Sidebar({ activeTab, setActiveTab, onProfile, onSettings, isVisible }: SidebarProps) {
  const menuItems = [
    { id: "audio", icon: Music, label: "Audio" },
    { id: "video", icon: Video, label: "Video" },
    { id: "photo", icon: ImageIcon, label: "Photo" },
    { id: "design", icon: PenTool, label: "Design" },
  ];

  const bottomItems = [
    { id: "profile", icon: User, label: "Profile", onClick: onProfile },
    { id: "settings", icon: Settings, label: "Settings", onClick: onSettings },
  ];

  return (
    <motion.aside 
      id="sidebar-nav" 
      initial={false}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed bottom-0 left-0 right-0 h-16 md:top-0 md:right-auto md:h-screen md:w-16 border-t md:border-t-0 md:border-r border-white/5 bg-studio-bg flex md:flex-col items-center py-0 md:py-6 px-2 sm:px-4 md:px-0 gap-2 md:gap-8 z-[60] overflow-hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:-translate-x-full pointer-events-none opacity-0'
      }`}
    >
      <div className="hidden md:flex w-10 h-10 bg-studio-primary rounded-lg items-center justify-center font-bold text-white text-xl mb-4 shadow-[0_0_20px_rgba(255,59,48,0.3)]">
        S1
      </div>

      <nav className="flex flex-1 md:flex-col items-center justify-around md:justify-start gap-1 sm:gap-4 md:gap-8 w-full md:w-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`group relative p-2.5 sm:p-3 rounded-xl transition-all ${
              activeTab === item.id ? "bg-studio-primary/20 text-studio-primary" : "text-slate-600 hover:text-slate-300"
            }`}
          >
            <item.icon size={22} className="md:w-[24px] md:h-[24px]" />
            {activeTab === item.id && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute -bottom-1 md:bottom-auto md:left-0 md:top-2 md:bottom-2 w-full md:w-1 h-1 md:h-auto bg-studio-primary rounded-full"
              />
            )}
            <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-studio-surface text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/5">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="flex md:flex-col items-center gap-1 sm:gap-4 md:gap-6 mt-auto">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="group relative p-2.5 sm:p-3 text-slate-600 hover:text-slate-300 transition-colors rounded-xl"
          >
            <item.icon size={22} className="md:w-[24px] md:h-[24px]" />
            <span className="hidden md:block absolute left-full ml-4 px-2 py-1 bg-studio-surface text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/5">
              {item.label}
            </span>
          </button>
        ))}
        <button className="hidden md:block p-3 text-studio-primary hover:bg-studio-hover rounded-xl transition-colors">
          <LogIn size={24} />
        </button>
      </div>
    </motion.aside>
  );
}
