import { createClient } from '@supabase/supabase-js';
import type { Scan, ScanResult, Recommendation, FixAction, Profile } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function saveCompleteScan(
  userId: string,
  scanData: Omit<Scan, 'id' | 'created_at' | 'user_id'>,
  metrics: Omit<ScanResult, 'id' | 'scan_id' | 'created_at'>,
  recs: Array<Omit<Recommendation, 'id' | 'scan_id' | 'created_at'>>
): Promise<Scan | null> {
  try {
    // 1. Insert Scan
    const { data: scan, error: scanErr } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        device_name: scanData.device_name,
        os_info: scanData.os_info,
        scan_status: scanData.scan_status,
        overall_health: scanData.overall_health,
        health_score: scanData.health_score,
        issues_count: recs.length,
        started_at: scanData.started_at,
        completed_at: scanData.completed_at
      })
      .select()
      .single();

    if (scanErr || !scan) throw scanErr || new Error('Failed to create scan record');

    // 2. Insert Scan Results
    const { data: result, error: resErr } = await supabase
      .from('scan_results')
      .insert({
        scan_id: scan.id,
        cpu_usage_pct: metrics.cpu_usage_pct,
        ram_usage_pct: metrics.ram_usage_pct,
        ram_used_gb: metrics.ram_used_gb,
        ram_total_gb: metrics.ram_total_gb,
        disk_usage_pct: metrics.disk_usage_pct,
        disk_free_gb: metrics.disk_free_gb,
        disk_total_gb: metrics.disk_total_gb,
        running_processes_count: metrics.running_processes_count,
        startup_apps_count: metrics.startup_apps_count,
        raw_metrics: metrics.raw_metrics || {}
      })
      .select()
      .single();

    if (resErr) console.error('Error inserting scan results:', resErr);

    // 3. Insert Recommendations
    let insertedRecs: Recommendation[] = [];
    if (recs.length > 0) {
      const recsPayload = recs.map(r => ({
        scan_id: scan.id,
        category: r.category,
        title: r.title,
        explanation: r.explanation,
        recommended_action: r.recommended_action,
        severity: r.severity,
        is_safe_auto_fix: r.is_safe_auto_fix,
        status: r.status
      }));

      const { data: recData, error: recErr } = await supabase
        .from('recommendations')
        .insert(recsPayload)
        .select();

      if (recErr) console.error('Error inserting recommendations:', recErr);
      else insertedRecs = recData || [];
    }

    return {
      ...scan,
      scan_results: result,
      recommendations: insertedRecs
    };
  } catch (error) {
    console.error('saveCompleteScan error:', error);
    return null;
  }
}

export async function fetchScanHistory(userId: string): Promise<Scan[]> {
  const { data, error } = await supabase
    .from('scans')
    .select(`
      *,
      scan_results (*),
      recommendations (
        *,
        fix_actions (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
  return data || [];
}

export async function recordFixAction(
  recommendationId: string,
  actionType: string,
  actionTitle: string,
  status: 'pending' | 'running' | 'completed' | 'failed'
): Promise<FixAction | null> {
  const { data, error } = await supabase
    .from('fix_actions')
    .insert({
      recommendation_id: recommendationId,
      action_type: actionType,
      action_title: actionTitle,
      action_status: status,
      started_at: new Date().toISOString(),
      completed_at: status === 'completed' ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording fix action:', error);
    return null;
  }

  // Update recommendation status to resolved if completed
  if (status === 'completed') {
    await supabase
      .from('recommendations')
      .update({ status: 'resolved' })
      .eq('id', recommendationId);
  }

  return data;
}

export async function deleteScan(scanId: string): Promise<boolean> {
  const { error } = await supabase
    .from('scans')
    .delete()
    .eq('id', scanId);

  if (error) {
    console.error('Error deleting scan:', error);
    return false;
  }
  return true;
}
