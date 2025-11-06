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

// 空気感の日本語マッピング
const VIBE_NAMES: Record<string, string> = {
  onsen_relax: '温泉・リラックス',
  family: '子育て・ファミリー',
  agriculture_nature: '農業・自然',
  commercial: '商業・利便性',
  heritage_tourism: '歴史・観光',
  quiet_residential: '静か・住宅地',
  youthful_vibrant: '若者・活気',
  orchard: '果樹園エリア',
};

export async function POST(req: Request) {
  try {
    const { area_id, persona } = await req.json();

    if (!area_id || !persona) {
      return NextResponse.json(
        { error: 'area_id and persona are required' },
        { status: 400 }
      );
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

    // 空気感スコア取得
    const { data: vibes } = await supabase
      .from('area_vibes')
      .select('vibe_type_id, time_of_day, score')
      .eq('area_id', area_id)
      .order('score', { ascending: false });

    // トップ空気感を時間帯別に整理
    const vibesByTime: Record<string, Array<{ type: string; score: number }>> = {
      morning: [],
      day: [],
      evening: [],
      night: [],
    };

    vibes?.forEach((v) => {
      if (vibesByTime[v.time_of_day]) {
        vibesByTime[v.time_of_day].push({
          type: VIBE_NAMES[v.vibe_type_id] || v.vibe_type_id,
          score: v.score,
        });
      }
    });

    // Claude APIで生活ストーリー生成（山形特化プロンプト）
    const prompt = `
あなたは山形移住支援アドバイザーです。以下の情報から、具体的な「山形での一日の生活ストーリー」を生成してください。

【エリア情報】
- エリア名: ${area.name}
- 位置: 緯度${area.lat}, 経度${area.lng}

【このエリアの空気感（時間帯別トップ3）】
- 朝: ${vibesByTime.morning.slice(0, 3).map((v) => `${v.type}(スコア${v.score})`).join(', ')}
- 昼: ${vibesByTime.day.slice(0, 3).map((v) => `${v.type}(スコア${v.score})`).join(', ')}
- 夕: ${vibesByTime.evening.slice(0, 3).map((v) => `${v.type}(スコア${v.score})`).join(', ')}
- 夜: ${vibesByTime.night.slice(0, 3).map((v) => `${v.type}(スコア${v.score})`).join(', ')}

【ペルソナ】
- 年齢: ${persona.age}歳
- 家族構成: ${persona.family}
- 働き方: ${persona.work_style}
- 趣味・関心: ${persona.interests}

【山形の特色を活かすこと】
- 温泉が近い場合は、朝風呂や仕事終わりの温泉を織り込む
- さくらんぼやぶどうなど、果樹園の季節感を入れる
- 蔵王、月山などの自然環境を活かす
- 芋煮会、冷やしラーメンなど山形の食文化を入れる
- 七日町の歴史的な街並みや、霞城公園の桜などを活かす
- 地元のスーパーや商店街、温泉施設など具体的な場所を想像して記載

このペルソナが山形のこのエリアに住んだ場合の「ある一日」を、以下の形式で生成してください。

JSON形式で出力:
{
  "timeline": [
    {
      "time": "07:00",
      "period": "morning",
      "activity": "起床・朝の散歩",
      "location": "自宅〜近くの公園",
      "description": "山形の清々しい朝。蔵王連峰を眺めながらの散歩が日課に。",
      "vibe": "農業・自然"
    },
    {
      "time": "09:00",
      "period": "morning",
      "activity": "地元カフェで朝食",
      "location": "七日町のカフェ",
      "description": "歴史ある街並みの中にある落ち着いたカフェで、山形産のフルーツを使ったモーニング。",
      "vibe": "歴史・観光"
    },
    ...（合計6-8個のアクティビティ）
  ],
  "summary": "山形でのこのエリアでの生活の総評（2-3文）。温泉、自然、食文化など山形の魅力を盛り込む。",
  "recommended_spots": [
    {"name": "○○温泉", "reason": "徒歩圏内で毎日通える地元の温泉"},
    {"name": "△△果樹園", "reason": "季節のフルーツ狩りが楽しめる"},
    {"name": "□□公園", "reason": "蔵王を望む絶景スポット"},
    ...（3-5個）
  ]
}

※timelineは07:00から22:00くらいまでカバー
※空気感スコアを活かした具体的な施設名や場所を想像して記載
※ペルソナの特性を反映させる
※山形らしさを全体に散りばめる
`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    // レスポンスからJSONを抽出
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                     responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const simulation = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // Supabaseに保存（オプション）
    const { data: saved } = await supabase
      .from('life_simulations')
      .insert({
        area_id,
        persona,
        generated_story: simulation,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      area_id,
      area_name: area.name,
      simulation,
      saved_id: saved?.id,
    });

  } catch (error) {
    console.error('Error generating simulation:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate simulation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}