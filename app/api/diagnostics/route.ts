// app/api/diagnostics/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase初期化（この方法で一時的に接続）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const answers = await request.json();
    console.log('受信した回答:', answers);
    
    // スコア計算（簡易版）
    const scores = {
      education: 0.7,
      medical: 0.8,
      income: 0.6,
      community: 0.75,
      mobility: 0.5
    };
    
    // 診断結果をSupabaseに保存
    const { data: diagnosticData, error: diagnosticError } = await supabase
      .from('diagnostics')
      .insert({
        answers: answers,
        scores: scores
      })
      .select()
      .single();

    if (diagnosticError) {
      console.error('Supabase保存エラー:', diagnosticError);
      throw new Error(`診断保存エラー: ${diagnosticError.message}`);
    }

    console.log('診断保存成功:', diagnosticData);

    // シナリオデータ
    const scenarios = [
      {
        diagnostic_id: diagnosticData.id,
        type: 'A',
        label: '1週間お試しプラン',
        duration: '1週間',
        estimate: 88000,
        fit_scores: scores,
        description: '短期間で地域の雰囲気を体験'
      },
      {
        diagnostic_id: diagnosticData.id,
        type: 'B',
        label: '2週間スタンダードプラン',
        duration: '2週間',
        estimate: 210000,
        fit_scores: scores,
        description: '生活リズムを体験できる標準プラン'
      },
      {
        diagnostic_id: diagnosticData.id,
        type: 'C',
        label: '1ヶ月じっくりプラン',
        duration: '1ヶ月',
        estimate: 320000,
        fit_scores: scores,
        description: '本格的な移住体験'
      }
    ];

   // シナリオを保存の部分を以下に変更
const { error: scenariosError } = await supabase
  .from('scenarios')
  .insert(scenarios)
  .select();

if (scenariosError) {
  console.error('シナリオ保存エラー:', scenariosError);
}

console.log('シナリオ保存完了');

    // レスポンスを返す
    return NextResponse.json({
      success: true,
      diagnostic_id: diagnosticData.id,
      scenarios: scenarios.map(s => ({
        type: s.type,
        label: s.label,
        duration: s.duration,
        estimate: s.estimate,
        fit: s.fit_scores,
        description: s.description
      }))
    });
    
  } catch (error) {
    console.error('エラー詳細:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'APIエラーが発生しました'
      },
      { status: 500 }
    );
  }
}