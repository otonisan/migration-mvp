// app/api/properties/compare/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids')?.split(',') || [];

    if (ids.length === 0) {
      return NextResponse.json({ properties: [] });
    }

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .in('id', ids);

    if (error) {
      throw error;
    }

    return NextResponse.json({ properties });

  } catch (error) {
    console.error('比較API エラー:', error);
    return NextResponse.json(
      { error: '物件の取得に失敗しました' },
      { status: 500 }
    );
  }
}