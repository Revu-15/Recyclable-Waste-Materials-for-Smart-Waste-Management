import React, { useState, useEffect } from 'react';
import { Search, Trash2, FileText, Download, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [limit] = useState(8);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (page - 1) * limit;
      const response = await axios.get(`${API_URL}/history`, {
        params: { search, limit, offset }
      });
      setPredictions(response.data.predictions);
      setTotal(response.data.total);
    } catch (err) {
      setError('Failed to fetch prediction history log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page
  };

  const deleteRecord = async (id) => {
    if (!window.confirm(`Are you sure you want to delete prediction record #${id}?`)) return;
    try {
      await axios.delete(`${API_URL}/history/${id}`);
      fetchHistory(); // Refresh history
    } catch (err) {
      alert('Failed to delete history record.');
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_URL}/history/export/csv`);
  };

  const handleExportXLSX = () => {
    window.open(`${API_URL}/history/export/xlsx`);
  };

  const downloadPDFReport = (id) => {
    window.open(`${API_URL}/history/export/pdf/${id}`);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex flex-col gap-6 pb-12 overflow-y-auto max-h-[calc(100vh-100px)] px-2">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Classification Log</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Searchable history log of all waste classification scans, with Excel/PDF exports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-glass-dark dark:border-glass-light text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>CSV Export</span>
          </button>
          <button 
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-all duration-300"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Export</span>
          </button>
        </div>
      </div>

      {/* Searchbar Card */}
      <GlassCard className="p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input 
          type="text" 
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by class name or image name..." 
          className="bg-transparent border-0 outline-none text-slate-800 dark:text-white placeholder-slate-400 text-xs w-full"
        />
        {loading && <RefreshCcw className="w-4 h-4 text-emerald-500 animate-spin" />}
      </GlassCard>

      {/* History Table Grid */}
      <GlassCard className="p-6 overflow-hidden flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-glass-dark dark:border-glass-light text-slate-500">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Predicted Class</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Latency (s)</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((row) => (
                <tr key={row.id} className="border-b border-glass-dark dark:border-glass-light hover:bg-slate-100/30 dark:hover:bg-slate-800/10">
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">#{row.id}</td>
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-glass-dark dark:border-glass-light">
                      <img src={`http://localhost:5000${row.original_image_path}`} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-white">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                      {row.predicted_class}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">{row.confidence.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-slate-500">{row.processing_time.toFixed(4)}s</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => downloadPDFReport(row.id)}
                        className="p-1.5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg transition-all duration-300 border border-transparent hover:border-emerald-500/20"
                        title="Download PDF Report"
                      >
                        <FileText className="w-4.5 h-4.5" />
                      </button>
                      <button 
                        onClick={() => deleteRecord(row.id)}
                        className="p-1.5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg transition-all duration-300 border border-transparent hover:border-rose-500/20"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && predictions.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">No matching classification history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-glass-dark dark:border-glass-light pt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-glass-dark dark:border-glass-light hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-glass-dark dark:border-glass-light hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default History;
