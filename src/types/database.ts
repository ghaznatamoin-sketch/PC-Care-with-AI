export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type OverallHealth = 'good' | 'fair' | 'poor' | 'critical';
export type FixStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  device_name: string;
  os_info: string | null;
  scan_status: ScanStatus;
  overall_health: OverallHealth;
  health_score: number;
  issues_count: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  scan_results?: ScanResult;
  recommendations?: Recommendation[];
}

export interface ScanResult {
  id?: string;
  scan_id: string;
  cpu_usage_pct: number;
  ram_usage_pct: number;
  ram_used_gb: number;
  ram_total_gb: number;
  disk_usage_pct: number;
  disk_free_gb: number;
  disk_total_gb: number;
  running_processes_count: number;
  startup_apps_count: number;
  raw_metrics?: Record<string, unknown>;
  created_at?: string;
}

export interface Recommendation {
  id?: string;
  scan_id: string;
  category: 'cpu' | 'memory' | 'disk' | 'startup' | 'background_process' | 'system';
  title: string;
  explanation: string;
  recommended_action: string;
  severity: Severity;
  is_safe_auto_fix: boolean;
  status: 'detected' | 'resolved' | 'ignored';
  created_at?: string;
  fix_actions?: FixAction[];
}

export interface FixAction {
  id?: string;
  recommendation_id: string;
  action_type: string;
  action_title: string;
  description: string | null;
  action_status: FixStatus;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at?: string;
}
