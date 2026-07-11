import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Camera, Layers, CheckCircle2, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api';
  const COLORS = ['#2e7d32', '#388e3c', '#4caf50', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e9', '#66bb6a', '#43a047', '#1b5e20'];

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/dashboard`);
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard metrics. Check server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCcw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Aggregating analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center max-w-md mx-auto my-12 border-rose-200">
        <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-2">{error}</p>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all duration-300"
        >
          Retry Connection
        </button>
      </GlassCard>
    );
  }

  // Formatting chart data
  const barChartData = Object.keys(stats.class_distribution).map((key) => ({
    name: key,
    count: stats.class_distribution[key]
  }));

  const pieChartData = Object.keys(stats.class_distribution).map((key) => ({
    name: key,
    value: stats.class_distribution[key]
  }));

  const timelineData = stats.timeline.map((item) => ({
    name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    Uploads: item.count
  }));

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-y-auto max-h-[calc(100vh-100px)] px-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Analytics Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">General metrics, waste category ratios, and timeline logging data.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-2 border border-glass-dark dark:border-glass-light rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all duration-300"
        >
          <RefreshCcw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Total Scans</span>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.total_predictions}</h4>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-teal-500">
          <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Average Confidence</span>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.average_confidence}%</h4>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 flex items-center gap-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Model Accuracy (Test)</span>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white mt-0.5">{stats.accuracy}%</h4>
          </div>
        </GlassCard>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Area Chart */}
        <GlassCard className="lg:col-span-8 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Classification Scanning Activity</h3>
          <div className="h-64">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#388e3c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#388e3c" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Uploads" stroke="#388e3c" strokeWidth={2} fillOpacity={1} fill="url(#colorUploads)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No activity data logged yet.</div>
            )}
          </div>
        </GlassCard>

        {/* Category Pie Chart */}
        <GlassCard className="lg:col-span-4 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Waste Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No classification distribution records.</div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Bar Chart Class Distribution */}
      <GlassCard className="p-6 flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Material Frequency Chart</h3>
        <div className="h-72">
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2e7d32" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No items classified.</div>
          )}
        </div>
      </GlassCard>

      {/* Recent Predictions Table */}
      <GlassCard className="p-6 flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-glass-dark dark:border-glass-light text-slate-500">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Thumbnail</th>
                <th className="py-3 px-4">Predicted Class</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Scan Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_predictions.map((row) => (
                <tr key={row.id} className="border-b border-glass-dark dark:border-glass-light hover:bg-slate-100/30 dark:hover:bg-slate-800/10">
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">#{row.id}</td>
                  <td className="py-3 px-4">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-glass-dark dark:border-glass-light">
                      <img src={`http://localhost:5000${row.original_image_path}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">{row.predicted_class}</td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{row.confidence.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {stats.recent_predictions.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">No predictions have been recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard;
