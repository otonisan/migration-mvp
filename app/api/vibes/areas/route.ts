import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const time = (searchParams.get('time') as 'morning' | 'day' | 'evening' | 'night') || 'day';

  try {
    // エリア情報取得
    const { data: areas, error: areasError } = await supabase
      .from('areas')
      .select('*');

    if (areasError) throw areasError;

    // 各エリアの空気感スコア取得
    const areasWithVibes = await Promise.all(
      areas.map(async (area) => {
        const { data: vibes, error: vibesError } = await supabase
          .from('area_vibes')
          .select('vibe_type_id, score')
          .eq('area_id', area.id)
          .eq('time_of_day', time);

        if (vibesError) throw vibesError;

        // スコアをオブジェクトに変換
        const vibesForTime: Record<string, number> = {};
        vibes.forEach((v) => {
          vibesForTime[v.vibe_type_id] = v.score;
        });

        // トップ空気感を計算
        const topVibe = Object.entries(vibesForTime)
          .sort(([, a], [, b]) => b - a)[0] || ['calm_nature', 0];

        return {
          area_id: area.id,
          name: area.name,
          location: { lat: parseFloat(area.lat), lng: parseFloat(area.lng) },
          top_vibe: topVibe[0],
          top_score: topVibe[1],
          vibes_for_time: vibesForTime,
        };
      })
    );

    return NextResponse.json(areasWithVibes);
  } catch (error) {
    console.error('Error fetching vibes:', error);
    return NextResponse.json({ error: 'Failed to fetch vibes' }, { status: 500 });
  }
}