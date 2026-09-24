import React from 'react';
import type { OverallHealth } from '../types/database';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface HealthBadgeProps {
  status: OverallHealth;
  score?: number;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({ status, score }) => {
  const getDetails = () => {
    switch (status) {
      case 'good':
        return {
          label: 'Healthy & Optimized',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          icon: CheckCircle2,
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        };
      case 'fair':
        return {
          label: 'Fair / Minor Issues',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          icon: AlertTriangle,
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'
        };
      case 'poor':
        return {
          label: 'Performance Degraded',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          icon: AlertCircle,
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]'
        };
      case 'critical':
      default:
        return {
          label: 'Critical Bottlenecks Detected',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: ShieldAlert,
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        };
    }
  };

  const details = getDetails();
  const Icon = details.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${details.bg} ${details.border} ${details.text} ${details.glow}`}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-bold tracking-wide uppercase">{details.label}</span>
      {score !== undefined && (
        <span className="ml-1 pl-2 border-l border-current/30 font-mono font-extrabold text-xs">
          {score}/100
        </span>
      )}
    </div>
  );
};
