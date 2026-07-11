import React from 'react';
import { Home, Camera, BarChart3, Database, ShieldAlert, Award } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'classify', label: 'AI Classification', icon: Camera },
    { id: 'dashboard', label: 'Analytics Board', icon: BarChart3 },
    { id: 'history', label: 'Classification Log', icon: Database },
    { id: 'admin', label: 'Admin Center', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 border-r border-glass-dark dark:border-glass-light glass-panel h-[calc(100vh-73px)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'sustainability-gradient-bg text-white shadow-lg shadow-emerald-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Academy B.Tech Capstone Info Badge */}
      <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/40 border border-glass-dark dark:border-glass-light flex flex-col gap-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Award className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Capstone Project</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
          Suitable for final-year B.Tech CS (Data Science) major project. Real-time Grad-CAM XAI and transfer learning with MobileNetV2.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
