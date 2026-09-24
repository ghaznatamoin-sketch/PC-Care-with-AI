import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtitle: string;
  percentage?: number;
  status?: 'optimal' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  percentage,
  status = 'optimal'
}) => {
  const getStatusColor = () => {
    if (status === 'danger' || (percentage && percentage > 85)) return 'text-red-400 border-red-500/30 bg-red-500/10';
    if (status === 'warning' || (percentage && percentage > 70)) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  };

  const getBarColor = () => {
    if (status === 'danger' || (percentage && percentage > 85)) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (status === 'warning' || (percentage && percentage > 70)) return 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden">
      {/* Decorative gradient corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent pointer-events-none rounded-tr-xl" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</span>
        <div className={`p-2 rounded-lg border ${getStatusColor()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-400">{unit}</span>}
      </div>

      {percentage !== undefined && (
        <div className="w-full bg-gray-800/80 rounded-full h-1.5 mb-2 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ease-out ${getBarColor()}`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      )}

      <p className="text-xs text-gray-400 truncate">{subtitle}</p>
    </div>
  );
};
