import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Database, Sparkles, Check, Loader2 } from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const scanSteps = [
  { label: 'Initializing Telemetry Engine', icon: Sparkles },
  { label: 'Scanning CPU Cycles & Thread Latency', icon: Cpu },
  { label: 'Inspecting Memory & Cache Footprint', icon: Database },
  { label: 'Analyzing Drive C: Storage & Temp Logs', icon: HardDrive },
  { label: 'Checking Startup & Background Services', icon: Cpu },
  { label: 'Synthesizing AI Health Diagnosis', icon: Sparkles }
];

export const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setProgress(5);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const stepIndex = Math.min(
          scanSteps.length - 1,
          Math.floor((next / 100) * scanSteps.length)
        );
        setCurrentStep(stepIndex);
        return Math.min(100, next);
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center relative overflow-hidden">
        
        {/* Animated Cyber Radar Pulse */}
        <div className="w-24 h-24 mx-auto mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-emerald-500/40 animate-pulse"></div>
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Cpu className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">Scanning Your PC...</h3>
        <p className="text-sm text-gray-400 mb-6">
          Analyzing hardware performance, memory bottlenecks, and startup items.
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-mono font-semibold mb-2">
            <span className="text-emerald-400">{scanSteps[currentStep]?.label}</span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5 p-0.5 border border-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2 text-left bg-gray-950/60 rounded-xl p-4 border border-gray-800/80">
          {scanSteps.map((step, idx) => {
            const isDone = idx < currentStep || progress === 100;
            const isCurrent = idx === currentStep && progress < 100;
            // StepIcon removed

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 text-xs py-1 transition-colors ${
                  isDone
                    ? 'text-emerald-400 font-medium'
                    : isCurrent
                    ? 'text-white font-semibold'
                    : 'text-gray-500'
                }`}
              >
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-700" />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-gray-500 mt-4">
          Please keep this window open while real Windows system telemetry is processed.
        </p>

      </div>
    </div>
  );
};
