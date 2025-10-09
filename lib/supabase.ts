// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// 環境変数の型チェック
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase環境変数が設定されていません');
}

// Supabaseクライアントの作成（シングルトン）
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// 既存のコードとの互換性のため
export const supabase = getSupabase();

// データベースの型定義
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin' | 'partner';
  created_at: string;
  updated_at: string;
}

export interface Diagnostic {
  id: string;
  user_id?: string;
  answers: {
    q1_work_mode?: string;
    q2_income_stability?: string;
    q3_household?: string;
    q4_priority?: string;
    q5_budget?: string;
    q6_duration?: string;
    q7_timing?: string;
    [key: string]: string | undefined;
  };
  scores?: {
    education: number;
    medical: number;
    income: number;
    community: number;
    mobility: number;
  };
  created_at: string;
}

export interface Scenario {
  id: string;
  diagnostic_id: string;
  type: 'A' | 'B' | 'C';
  label: string;
  duration: string;
  estimate: number;
  fit_scores: Record<string, number>;
  description?: string;
  created_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  scenario_id: string;
  start_date?: string;
  end_date?: string;
  total_amount?: number;
  status: 'draft' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}