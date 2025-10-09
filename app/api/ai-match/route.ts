// app/api/ai-match/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface DiagnosticAnswers {
  q1_work_mode?: string;
  q2_income_stability?: string;
  q3_household?: string;
  q4_priority?: string;
  q5_budget?: string;
  q6_duration?: string;
  q7_timing?: string;
}

interface Property {
  id: string;
  name: string;
  region: string;
  rent: number;
  image_url: string;
  description: string;
  lat: number;
  lng: number;
}

interface ScoredProperty extends Property {
  ai_score: number;
  match_reasons: string[];
  score_breakdown: {
    budget: number;
    lifestyle: number;
    environment: number;
    workstyle: number;
    family: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // ユーザー認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // 診断結果を取得
    const answers: DiagnosticAnswers = await request.json();

    // 全物件を取得
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*');

    if (propertiesError) {
      throw propertiesError;
    }

    // 各物件のスコアを計算
    const scoredProperties: ScoredProperty[] = properties.map((property: Property) => {
      const scoreResult = calculateMatchScore(property, answers);
      return {
        ...property,
        ...scoreResult
      };
    });

    // スコア順にソート
    scoredProperties.sort((a, b) => b.ai_score - a.ai_score);

    // 上位物件のスコアをDBに保存
    const topProperties = scoredProperties.slice(0, 5);
    
    for (const property of topProperties) {
      await supabase
        .from('ai_property_scores')
        .upsert({
          user_id: user.id,
          property_id: property.id,
          total_score: property.ai_score,
          budget_score: property.score_breakdown.budget,
          lifestyle_score: property.score_breakdown.lifestyle,
          environment_score: property.score_breakdown.environment,
          workstyle_score: property.score_breakdown.workstyle,
          family_score: property.score_breakdown.family,
          match_reasons: property.match_reasons
        }, {
          onConflict: 'user_id,property_id'
        });
    }

    return NextResponse.json({
      success: true,
      properties: scoredProperties
    });

  } catch (error) {
    console.error('AIマッチングエラー:', error);
    return NextResponse.json(
      { error: 'マッチング処理に失敗しました' },
      { status: 500 }
    );
  }
}

// スコア計算関数
function calculateMatchScore(
  property: Property,
  answers: DiagnosticAnswers
): {
  ai_score: number;
  match_reasons: string[];
  score_breakdown: {
    budget: number;
    lifestyle: number;
    environment: number;
    workstyle: number;
    family: number;
  };
} {
  const reasons: string[] = [];
  let budgetScore = 0;
  let lifestyleScore = 0;
  let environmentScore = 0;
  let workstyleScore = 0;
  let familyScore = 0;

  // 1. 予算適合度 (30%)
  budgetScore = calculateBudgetScore(property, answers.q5_budget, reasons);

  // 2. ライフスタイルマッチ (25%)
  lifestyleScore = calculateLifestyleScore(property, answers.q4_priority, reasons);

  // 3. 周辺環境 (20%)
  environmentScore = calculateEnvironmentScore(property, answers.q3_household, reasons);

  // 4. ワークスタイル (15%)
  workstyleScore = calculateWorkstyleScore(property, answers.q1_work_mode, reasons);

  // 5. 家族構成 (10%)
  familyScore = calculateFamilyScore(property, answers.q3_household, reasons);

  // 総合スコア計算
  const totalScore = Math.round(
    budgetScore * 0.30 +
    lifestyleScore * 0.25 +
    environmentScore * 0.20 +
    workstyleScore * 0.15 +
    familyScore * 0.10
  );

  return {
    ai_score: totalScore,
    match_reasons: reasons,
    score_breakdown: {
      budget: budgetScore,
      lifestyle: lifestyleScore,
      environment: environmentScore,
      workstyle: workstyleScore,
      family: familyScore
    }
  };
}

// 予算スコア計算
function calculateBudgetScore(
  property: Property,
  budget: string | undefined,
  reasons: string[]
): number {
  if (!budget) return 50;

  const price = property.rent
  let score = 0;

  if (budget === 'under_150k' && price <= 150000) {
    score = 100;
    reasons.push('予算に完璧に収まります');
  } else if (budget === '150k_250k' && price >= 150000 && price <= 250000) {
    score = 100;
    reasons.push('予算範囲内の理想的な物件です');
  } else if (budget === '250k_350k' && price >= 250000 && price <= 350000) {
    score = 100;
    reasons.push('ご予算にマッチしています');
  } else if (budget === 'over_350k' && price >= 350000) {
    score = 100;
    reasons.push('プレミアムな条件を満たしています');
  } else {
    // 予算オーバー・アンダーの場合は減点
    score = 30;
  }

  return score;
}

// ライフスタイルスコア計算
function calculateLifestyleScore(
  property: Property,
  priority: string | undefined,
  reasons: string[]
): number {
  if (!priority) return 50;

  const region = property.region;
  let score = 50;

  // 地域ごとの特性マッピング
  const regionCharacteristics: { [key: string]: string[] } = {
    '松本市': ['nature', 'community'],
    '伊豆市': ['nature', 'medical'],
    '倉敷市': ['community', 'education'],
    '糸島市': ['nature', 'community'],
    '富良野市': ['nature'],
    '石垣市': ['nature']
  };

  const characteristics = regionCharacteristics[region] || [];

  if (characteristics.includes(priority)) {
    score = 90;
    if (priority === 'nature') reasons.push('豊かな自然環境に恵まれています');
    if (priority === 'education') reasons.push('教育環境が充実しています');
    if (priority === 'medical') reasons.push('医療施設へのアクセスが良好です');
    if (priority === 'community') reasons.push('温かいコミュニティがあります');
  }

  return score;
}

// 周辺環境スコア
function calculateEnvironmentScore(
  property: Property,
  household: string | undefined,
  reasons: string[]
): number {
  if (!household) return 50;

  const region = property.region;
  let score = 50;

  // ファミリー向け地域
  const familyFriendly = ['倉敷市', '松本市'];
  // カップル・シングル向け地域
  const urbanAreas = ['糸島市', '伊豆市'];

  if (household === 'with_children' && familyFriendly.includes(region)) {
    score = 85;
    reasons.push('子育てに適した環境です');
  } else if ((household === 'couple' || household === 'single') && urbanAreas.includes(region)) {
    score = 80;
    reasons.push('快適な生活環境が整っています');
  }

  return score;
}

// ワークスタイルスコア
function calculateWorkstyleScore(
  property: Property,
  workMode: string | undefined,
  reasons: string[]
): number {
  if (!workMode) return 50;

  let score = 70; // デフォルトスコア

  // リモートワーク向け: 静かな環境
  if (workMode === 'remote_majority') {
    const remoteIdeal = ['富良野市', '石垣市', '伊豆市'];
    if (remoteIdeal.includes(property.region)) {
      score = 90;
      reasons.push('リモートワークに最適な静かな環境です');
    }
  }

  return score;
}

// 家族構成スコア
function calculateFamilyScore(
  property: Property,
  household: string | undefined,
  reasons: string[]
): number {
  if (!household) return 50;

  let score = 60;

  // 物件の価格帯で広さを推測
  if (household === 'with_children' && property.rent >= 250000) {
  score = 85;
  reasons.push('ファミリー向けの広さがあります');
} else if (household === 'single' && property.rent <= 150000) {
  score = 80;
  reasons.push('一人暮らしに最適なサイズです');
}

  return score;
}