import React, { useState } from 'react';
import type { Recommendation, Scan } from '../types/database';
import { HealthBadge } from './HealthBadge';
import { 
  Wrench, 
  CheckCircle, 
  HelpCircle, 
  Cpu, 
  Database, 
  HardDrive, 
  Clock, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import { recordFixAction } from '../services/supabase';

interface DiagnosisViewProps {
  scan: Scan;
  onReScan: () => void;
  onBackToDashboard: () => void;
}

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
  scan,
  onReScan,
  onBackToDashboard
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    scan.recommendations || []
  );
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [fixSuccessMsg, setFixSuccessMsg] = useState<string | null>(null);

  const handleFixNow = async (rec: Recommendation) => {
    const recId = rec.id;
    if (!recId) return;
    setFixingId(recId);
    setFixSuccessMsg(null);

    // Record running action
    await recordFixAction(recId, 'safe_cleanup', `Auto-fix for ${rec.title}`, 'running');

    // Simulate safe execution delay
    setTimeout(async () => {
      await recordFixAction(recId, 'safe_cleanup', `Auto-fix for ${rec.title}`, 'completed');

      setRecommendations(prev =>
        prev.map(r => (r.id === recId ? { ...r, status: 'resolved' } : r))
      );
      setFixingId(null);
      setFixSuccessMsg(`Successfully resolved "${rec.title}". Performance reclaimed!`);
      setTimeout(() => setFixSuccessMsg(null), 4000);
    }, 1200);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cpu': return Cpu;
      case 'memory': return Database;
      case 'disk': return HardDrive;
      case 'startup': return Clock;
      default: return Sparkles;
    }
  };

  const activeIssues = recommendations.filter(r => r.status !== 'resolved');
  const resolvedIssues = recommendations.filter(r => r.status === 'resolved');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-extrabold text-white">Diagnostic Health Report</h2>
              <HealthBadge status={scan.overall_health} score={scan.health_score} />
            </div>
            <p className="text-xs text-gray-400">
              Scanned on {new Date(scan.started_at).toLocaleString()} • Device: {scan.device_name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReScan}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Re-scan PC</span>
            </button>
            <button
              onClick={onBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
            >
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {fixSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{fixSuccessMsg}</span>
        </div>
      )}

      {/* Issues Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Detected Problems & Recommendations</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-300 font-mono">
              {activeIssues.length} active
            </span>
          </h3>
        </div>

        {activeIssues.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center border border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">All Systems Optimal</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              No unresolved performance bottlenecks detected on your computer. Your PC is in peak condition!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeIssues.map(rec => {
              const CategoryIcon = getCategoryIcon(rec.category || 'system');
              const isFixing = fixingId === rec.id;
              const isGuideOpen = expandedGuideId === rec.id;

              return (
                <div
                  key={rec.id || rec.title}
                  className="glass-panel glass-card-hover rounded-xl p-5 border border-gray-800/90 relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 text-emerald-400 flex-shrink-0 mt-0.5">
                        <CategoryIcon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                              rec.severity === 'critical'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                : rec.severity === 'high'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {rec.severity} Severity
                          </span>
                        </div>

                        {/* AI Explanation */}
                        <div className="p-3 rounded-lg bg-gray-900/70 border border-gray-800 text-xs text-gray-300 leading-relaxed">
                          <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Root-Cause Explanation:</span>
                          </div>
                          {rec.explanation}
                        </div>

                        {/* Recommended Action */}
                        <div className="text-xs text-gray-400 pt-1">
                          <strong className="text-gray-200">Recommended Action:</strong>{' '}
                          {rec.recommended_action}
                        </div>

                        {/* Guided Help Box */}
                        {isGuideOpen && (
                          <div className="mt-3 p-3 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-300 space-y-2">
                            <h5 className="font-bold text-white">Manual Optimization Steps:</h5>
                            <ol className="list-decimal list-inside space-y-1 text-gray-400">
                              <li>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 font-mono text-[10px]">Ctrl + Shift + Esc</kbd> to open Windows Task Manager.</li>
                              <li>Navigate to the <strong>Startup Apps</strong> tab.</li>
                              <li>Right-click unnecessary heavy apps (like Spotify, Cortana, Torrent clients) and select <strong>Disable</strong>.</li>
                              <li>Restart or re-scan your PC to verify improvement.</li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sm:self-center flex-shrink-0 flex items-center gap-2">
                      {rec.is_safe_auto_fix ? (
                        <button
                          onClick={() => handleFixNow(rec)}
                          disabled={isFixing}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all"
                        >
                          <Wrench className={`w-3.5 h-3.5 ${isFixing ? 'animate-spin' : ''}`} />
                          <span>{isFixing ? 'Fixing...' : 'Fix Now'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setExpandedGuideId(isGuideOpen ? null : (rec.id || null))}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isGuideOpen ? 'Hide Guide' : 'How to Fix'}</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resolved Section */}
        {resolvedIssues.length > 0 && (
          <div className="pt-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Resolved Issues ({resolvedIssues.length})
            </h4>
            <div className="space-y-2 opacity-75">
              {resolvedIssues.map(r => (
                <div key={r.id || r.title} className="p-3 rounded-lg bg-gray-900/40 border border-gray-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-300 line-through">{r.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Fixed</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
