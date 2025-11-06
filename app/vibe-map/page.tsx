'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import VibeSidebar from '@/components/vibe/VibeSidebar';
import AreaDetailModal from '@/components/vibe/AreaDetailModal';
import { VIBE_TYPES } from '@/lib/mapbox';

// 動的インポート
const VibeMapWrapper = dynamic(
  () => import('@/components/vibe/VibeMapWrapper'),
  { ssr: false }
);

interface Area {
  area_id: string;
  name: string;
  location: { lat: number; lng: number };
  top_vibe: string;
  top_score: number;
  vibes_for_time: Record<string, number>;
}

export default function VibeMapPage() {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(Object.keys(VIBE_TYPES));
  const [ageGroup, setAgeGroup] = useState<string>('');
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // データ取得
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/vibes/areas?time=${timeOfDay}`);
        const data = await res.json();
        setAreas(data);
      } catch (error) {
        console.error('Failed to fetch areas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [timeOfDay]);

  // 年齢層が変わったら、おすすめの空気感を自動選択
  useEffect(() => {
    if (ageGroup === '') {
      // すべて選択
      setSelectedVibes(Object.keys(VIBE_TYPES));
    } else if (ageGroup === '20s') {
      // 20代：若者・活気、商業、カフェ重視
      setSelectedVibes(['youthful_vibrant', 'commercial', 'heritage_tourism']);
    } else if (ageGroup === '30s') {
      // 30代：子育て、ファミリー、公園重視
      setSelectedVibes(['family', 'quiet_residential', 'agriculture_nature']);
    } else if (ageGroup === '40s') {
      // 40代：ファミリー、静か、利便性重視
      setSelectedVibes(['family', 'quiet_residential', 'commercial']);
    } else if (ageGroup === '50s') {
      // 50代：静か、自然、温泉重視
      setSelectedVibes(['quiet_residential', 'onsen_relax', 'agriculture_nature']);
    } else if (ageGroup === '60plus') {
      // 60代以上：温泉、歴史、静か重視
      setSelectedVibes(['onsen_relax', 'heritage_tourism', 'quiet_residential']);
    }
  }, [ageGroup]);

  const handleVibeToggle = (vibeId: string) => {
    if (selectedVibes.includes(vibeId)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibeId));
    } else {
      setSelectedVibes([...selectedVibes, vibeId]);
    }
  };

  const handleAreaClick = (area: Area) => {
    console.log('Area clicked in page.tsx:', area);
    setSelectedArea(area);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* サイドバー */}
      <VibeSidebar
        timeOfDay={timeOfDay}
        onTimeChange={setTimeOfDay}
        selectedVibes={selectedVibes}
        onVibeToggle={handleVibeToggle}
        ageGroup={ageGroup}
        onAgeGroupChange={setAgeGroup}
      />

      {/* 地図エリア */}
      <main className="flex-1 relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-sm text-gray-400 tracking-wider mb-2">Loading areas...</div>
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
            </div>
          </div>
        ) : (
          <VibeMapWrapper
            areas={areas}
            timeOfDay={timeOfDay}
            selectedVibes={selectedVibes}
            onAreaClick={handleAreaClick}
          />
        )}

       {/* 使い方ガイド - デスクトップのみ表示 */}
        <div className="hidden lg:block absolute top-24 left-8 bg-emerald-50/95 backdrop-blur-sm p-4 border-2 border-emerald-500 rounded-xl shadow-xl max-w-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-emerald-900 mb-1">使い方</p>
              <ul className="text-xs text-emerald-800 space-y-1">
                <li>• 色付きの円をクリックで詳細表示</li>
                <li>• 左のサイドバーで空気感を絞り込み</li>
                <li>• 時間帯で雰囲気が変わります</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 凡例 - レスポンシブ対応 */}
        <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 bg-white/98 backdrop-blur-sm p-3 lg:p-6 border-2 border-gray-300 rounded-xl shadow-xl max-w-[280px] lg:max-w-md">
          <p className="text-xs lg:text-sm tracking-[0.2em] text-gray-900 mb-2 lg:mb-4 uppercase font-bold flex items-center gap-2">
            <span className="text-lg lg:text-xl">🎨</span>
            <span className="hidden lg:inline">空気感の種類</span>
            <span className="lg:hidden">空気感</span>
          </p>
          <div className="space-y-2 lg:space-y-3 max-h-[200px] lg:max-h-none overflow-y-auto">
            {Object.values(VIBE_TYPES)
              .filter((vibe) => selectedVibes.includes(vibe.id))
              .slice(0, 6)
              .map((vibe) => (
                <div key={vibe.id} className="flex items-center gap-2 lg:gap-3">
                  {/* アイコン */}
                  <span className="text-lg lg:text-2xl flex-shrink-0">
                    {vibe.icon}
                  </span>
                  
                  {/* 色 + 名前 + 説明 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 lg:mb-1">
                      <span
                        className="w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2 border-gray-400 flex-shrink-0"
                        style={{ backgroundColor: vibe.hex }}
                      />
                      <span className="text-xs lg:text-sm text-gray-900 font-bold truncate">
                        {vibe.name_ja}
                      </span>
                    </div>
                    <p className="hidden lg:block text-xs text-gray-600 leading-relaxed">
                      {vibe.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          
          {/* 表示数が多い場合 */}
          {selectedVibes.length > 6 && (
            <div className="mt-2 lg:mt-3 pt-2 lg:pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                他 {selectedVibes.length - 6} 種類
              </p>
            </div>
          )}
        </div>

        {/* エリア数表示 - レスポンシブ対応 */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8 bg-white/98 backdrop-blur-sm px-3 py-2 lg:px-6 lg:py-3 border border-gray-300 rounded shadow-lg">
          <div className="text-xs text-gray-900 tracking-wider uppercase mb-0.5 lg:mb-1 font-medium">Areas</div>
          <div className="text-xl lg:text-2xl font-light text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
            {areas.filter((a) => selectedVibes.includes(a.top_vibe)).length}
          </div>
        </div>

        {/* マップ中心の説明 - デスクトップのみ */}
        <div className="hidden lg:block absolute top-8 left-1/2 -translate-x-1/2 bg-white/98 backdrop-blur-sm px-6 py-3 border border-gray-300 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <div className="text-xs text-gray-900 tracking-wider uppercase font-medium">Map Center</div>
              <div className="text-sm text-gray-700">山形市 - 山形県の中心地</div>
            </div>
          </div>
        </div>
      </main>

      {/* エリア詳細モーダル */}
      <AreaDetailModal
        area={selectedArea}
        timeOfDay={timeOfDay}
        onClose={() => setSelectedArea(null)}
      />
    </div>
  );
}