import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Play, RefreshCw, BarChart3, Terminal, CheckCircle2, ServerCrash, Layers } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';

const Admin = () => {
  const [datasetStats, setDatasetStats] = useState(null);
  const [loadingDataset, setLoadingDataset] = useState(true);
  const [trainingStatus, setTrainingStatus] = useState({ status: 'idle', current_epoch: 0, total_epochs: 5, logs: [] });
  const [trainingActive, setTrainingActive] = useState(false);
  const [triggering, setTriggering] = useState(false);
  
  const consoleEndRef = useRef(null);
  const API_URL = 'http://localhost:5000/api';

  const fetchDatasetStats = async () => {
    try {
      setLoadingDataset(true);
      const response = await axios.get(`${API_URL}/admin/dataset-stats`);
      setDatasetStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dataset distribution stats.');
    } finally {
      setLoadingDataset(false);
    }
  };

  const checkTrainingStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/retrain/status`);
      setTrainingStatus(response.data);
      if (response.data.status === 'running') {
        setTrainingActive(true);
      } else {
        setTrainingActive(false);
      }
    } catch (err) {
      console.error('Failed to fetch training status logs.');
    }
  };

  const startRetraining = async () => {
    if (trainingActive) return;
    try {
      setTriggering(true);
      const response = await axios.post(`${API_URL}/admin/retrain`);
      if (response.data.success) {
        setTrainingActive(true);
        checkTrainingStatus();
      }
    } catch (err) {
      alert('Failed to launch model training session.');
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchDatasetStats();
    checkTrainingStatus();
  }, []);

  // Poll training progress while active
  useEffect(() => {
    let interval = null;
    if (trainingActive) {
      interval = setInterval(() => {
        checkTrainingStatus();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [trainingActive]);

  // Autoscroll training log console
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [trainingStatus.logs]);

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-y-auto max-h-[calc(100vh-100px)] px-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Admin Center</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Trigger model training sessions, view dataset class distributions, and inspect system logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dataset Distribution Panel */}
        <GlassCard className="lg:col-span-5 p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-glass-dark dark:border-glass-light pb-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dataset Allocations</span>
            </h3>
            <button 
              onClick={fetchDatasetStats}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              title="Refresh Stats"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {loadingDataset ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : datasetStats ? (
            <div className="flex flex-col gap-3">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-bold bg-slate-100/60 dark:bg-slate-800/40 p-2.5 rounded-lg border border-glass-dark dark:border-glass-light">
                <span>Total Registered Images:</span>
                <span>{datasetStats.total_images} files</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2 pr-1">
                {Object.keys(datasetStats.splits_distribution).map((cls) => {
                  const data = datasetStats.splits_distribution[cls];
                  const total = data.train + data.val + data.test;
                  return (
                    <div key={cls} className="flex justify-between items-center text-xs p-2 bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-glass-dark dark:border-glass-light">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cls}</span>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">Tr: {data.train}</span>
                        <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 px-1.5 py-0.5 rounded text-[10px]">Vl: {data.val}</span>
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">Ts: {data.test}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 ml-1">({total})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs text-center text-slate-400 py-12">Failed to load dataset distribution.</div>
          )}
        </GlassCard>

        {/* Retraining Console Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Controls Card */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>Deep Learning Retraining Dashboard</span>
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Launch transfer learning training over the current waste dataset. The model will run gradient updates on its linear classification projection block using the SGD/Adam optimizer and update its weights.
            </p>

            <div className="flex items-center justify-between border-t border-glass-dark dark:border-glass-light pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Job Status</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  trainingStatus.status === 'running' ? 'text-blue-500' :
                  trainingStatus.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    trainingStatus.status === 'running' ? 'bg-blue-500 animate-ping' :
                    trainingStatus.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}></span>
                  <span className="capitalize">{trainingStatus.status}</span>
                </span>
              </div>

              <button
                disabled={trainingActive || triggering}
                onClick={startRetraining}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl sustainability-gradient-bg text-white text-xs font-bold disabled:opacity-50 shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                {trainingActive ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Fine Tuning Model...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Retrain Model</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Progress Bar */}
            {trainingActive && (
              <div className="flex flex-col gap-1.5 mt-2 text-xs">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>Training Progress</span>
                  <span>{trainingStatus.current_epoch} / {trainingStatus.total_epochs} Epochs</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full sustainability-gradient-bg transition-all duration-500" 
                    style={{ width: `${(trainingStatus.current_epoch / trainingStatus.total_epochs) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Logging Console Card */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-slate-600 dark:text-slate-400" />
              <span>Real-Time Output Terminal</span>
            </h3>
            
            <div className="bg-slate-950 rounded-2xl p-4 font-mono text-[10px] text-slate-300 h-64 overflow-y-auto flex flex-col gap-1.5 border border-slate-900 shadow-inner">
              {trainingStatus.logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start leading-normal">
                  <span className="text-emerald-500 shrink-0 select-none">[LOG]</span>
                  <span>{log}</span>
                </div>
              ))}
              {trainingStatus.logs.length === 0 && (
                <div className="text-slate-600 italic select-none">Terminal idle. Click "Retrain Model" to view training updates.</div>
              )}
              <div ref={consoleEndRef} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Admin;
