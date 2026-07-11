import React, { useState, useEffect } from 'react';
import { Sun, Moon, Leaf, Activity } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [systemOnline, setSystemOnline] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        if (response.data.status === 'healthy') {
          setSystemOnline(true);
        } else {
          setSystemOnline(false);
        }
      } catch (error) {
        setSystemOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-dark dark:border-glass-light glass-panel px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl sustainability-gradient-bg text-white animate-pulse">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
            EcoSort <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Smart Waste Management System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* API Backend Health Status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          systemOnline 
            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' 
            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
        }`}>
          <Activity className={`w-3.5 h-3.5 ${systemOnline ? 'animate-bounce' : ''}`} />
          <span>{systemOnline ? 'AI Server Online' : 'Connecting to Server...'}</span>
          <span className={`w-2 h-2 rounded-full ${systemOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl border border-glass-dark dark:border-glass-light hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-slate-600 dark:text-slate-300"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
