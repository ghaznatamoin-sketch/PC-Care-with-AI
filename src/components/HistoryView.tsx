import React, { useState } from 'react';
import type { Scan } from '../types/database';
import { HealthBadge } from './HealthBadge';
import { Search, Trash2, Calendar, Eye, Activity, AlertCircle } from 'lucide-react';
import { deleteScan } from '../services/supabase';

interface HistoryViewProps {
  scans: Scan[];
  onSelectScan: (scan: Scan) => void;
  onRefresh: () => void;
  onStartNewScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onSelectScan,
  onRefresh,
  onStartNewScan
}) => {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredScans = scans.filter(scan => {
    const matchesSearch = 
      scan.device_name.toLowerCase().includes(search.toLowerCase()) ||
      scan.overall_health.toLowerCase().includes(search.toLowerCase()) ||
      (scan.recommendations && scan.recommendations.some(r => r.title.toLowerCase().includes(search.toLowerCase())));
    
    if (severityFilter === 'all') return matchesSearch;
    return matchesSearch && scan.overall_health === severityFilter;
  });

  const handleDelete = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this scan record from your history?')) {
      const ok = await deleteScan(scanId);
      if (ok) onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Diagnostic Scan History</h2>
          <p className="text-xs text-gray-400">Review and audit previous PC health scans stored in Supabase PostgreSQL.</p>
        </div>

        <button
          onClick={onStartNewScan}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
        >
          <Activity className="w-4 h-4" />
          <span>New PC Scan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3 border border-gray-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scans by device, issue, or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-900/80 border border-gray-700/60 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Health States</option>
            <option value="good">Good (Optimized)</option>
            <option value="fair">Fair (Minor)</option>
            <option value="poor">Poor (Degraded)</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Scans List */}
      {filteredScans.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-gray-800">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Scan Records Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            {scans.length === 0
              ? "You haven't run any PC Health Scans yet. Start your first scan to save diagnostic history."
              : 'No scans match your search or filter criteria.'}
          </p>
          <button
            onClick={onStartNewScan}
            className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-gray-950 rounded-xl"
          >
            Run First Health Scan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredScans.map(scan => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="glass-panel glass-card-hover rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer border border-gray-800"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-sm font-bold text-white font-mono">{scan.device_name}</h4>
                  <HealthBadge status={scan.overall_health} score={scan.health_score} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {new Date(scan.started_at).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>{scan.issues_count} problems detected</span>
                  {scan.scan_results && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-emerald-400/90">
                        CPU: {scan.scan_results.cpu_usage_pct}% | RAM: {scan.scan_results.ram_usage_pct}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectScan(scan)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Report</span>
                </button>
                <button
                  onClick={e => handleDelete(e, scan.id)}
                  title="Delete scan"
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
