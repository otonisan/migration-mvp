import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 空気感タイプの説明
const VIBE_DESCRIPTIONS = {
  calm_nature: '静穏・自然: 緑、静か、散歩、川、公園などの要素',
  family: '家族・子育て: 保育園、子ども、安全、公園などの要素',
  creative: 'クリエイティブ: ギャラリー、カフェ、アート、リノベなどの要素',
  nightlife: 'ナイト・活気: バー、音楽、活気、賑やかさなどの要素',
  heritage: '歴史・伝統: 神社、古民家、伝統、文化などの要素',
  industrial: '産業・ギア感: 倉庫、工場、職人、ものづくりなどの要素',
  seaside: '海・リゾート: 海、風、光、リゾート感などの要素',
  academic: '学術・静学: 図書館、大学、静か、学問などの要素',
  luxury: '上質・洗練: カフェ、雑貨、洗練、上質などの要素',
  startup: 'スタートアップ: コワーキング、IT、起業、革新などの要素',
};

export async function POST(req: Request) {
  try {
    const { area_id, context } = await req.json();

    if (!area_id) {
      return NextResponse.json({ error: 'area_id is required' }, { status: 400 });
    }

    // エリア情報取得
    const { data: area, error: areaError } = await supabase
      .from('areas')
      .select('*')
      .eq('id', area_id)
      .single();

    if (areaError || !area) {
      return NextResponse.json({ error: 'Area not found' }, { status: 404 });
    }

    // Claude APIで空気感スコア算出
    const prompt = `
以下のエリア情報から、10種類の空気感スコア（0-100）を算出してください。

エリア名: ${area.name}
位置: 緯度${area.lat}, 経度${area.lng}

追加情報:
${context || 'このエリアは山形県にある住宅・商業混在エリアです。'}

空気感タイプ（10種類）:
${Object.entries(VIBE_DESCRIPTIONS).map(([key, desc]) => `- ${key}: ${desc}`).join('\n')}

各空気感について、このエリアがどの程度その特性を持っているか0-100のスコアで評価してください。
スコアの基準:
- 90-100: 非常に強い特徴
- 70-89: 強い特徴
- 50-69: 中程度の特徴
- 30-49: 弱い特徴
- 0-29: ほとんど特徴なし

JSON形式で出力してください:
{
  "calm_nature": 85,
  "family": 72,
  ...
}
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    // レスポンスからJSONを抽出
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    // JSONブロックを抽出（```json ... ``` または直接JSON）
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                     responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const scores = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // 4つの時間帯すべてにスコアを保存
    const timeOfDays: ('morning' | 'day' | 'evening' | 'night')[] = ['morning', 'day', 'evening', 'night'];
    
    const savedScores: Record<string, Record<string, number>> = {};

    for (const timeOfDay of timeOfDays) {
      // 時間帯による微調整（夜は静穏系が上がる、活気系が下がるなど）
      const adjustedScores = adjustScoresForTime(scores, timeOfDay);

      for (const [vibeType, score] of Object.entries(adjustedScores)) {
        const { error } = await supabase
          .from('area_vibes')
          .upsert({
            area_id,
            vibe_type_id: vibeType,
            time_of_day: timeOfDay,
            score: Math.min(100, Math.max(0, Math.round(score as number))),
          }, {
            onConflict: 'area_id,vibe_type_id,time_of_day',
          })
          .select();

        if (error) {
          console.error(`Error saving ${vibeType} for ${timeOfDay}:`, error);
        } else {
          console.log(`Saved ${vibeType} (${score}) for ${timeOfDay}`);
          if (!savedScores[timeOfDay]) savedScores[timeOfDay] = {};
          savedScores[timeOfDay][vibeType] = score as number;
        }
      }
    }

    return NextResponse.json({
      success: true,
      area_id,
      scores,
      saved_scores: savedScores,
      message: 'Vibe scores calculated and saved',
    });

  } catch (error) {
    console.error('Error calculating vibes:', error);
    return NextResponse.json(
      { error: 'Failed to calculate vibes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 時間帯による調整関数
function adjustScoresForTime(
  baseScores: Record<string, number>,
  timeOfDay: 'morning' | 'day' | 'evening' | 'night'
): Record<string, number> {
  const adjusted = { ...baseScores };

  switch (timeOfDay) {
    case 'morning':
      // 朝は静穏・家族が少し上がる
      adjusted.calm_nature = (adjusted.calm_nature || 0) * 1.1;
      adjusted.family = (adjusted.family || 0) * 1.05;
      adjusted.nightlife = (adjusted.nightlife || 0) * 0.3;
      break;
    case 'day':
      // 昼はバランス型（ベーススコアそのまま）
      break;
    case 'evening':
      // 夕方は活気が上がり始める
      adjusted.nightlife = (adjusted.nightlife || 0) * 1.2;
      adjusted.family = (adjusted.family || 0) * 0.9;
      break;
    case 'night':
      // 夜は静穏が上がり、活気も上がる（エリアによる）
      adjusted.calm_nature = (adjusted.calm_nature || 0) * 1.15;
      adjusted.nightlife = (adjusted.nightlife || 0) * 1.3;
      adjusted.family = (adjusted.family || 0) * 0.6;
      break;
  }

  return adjusted;
}