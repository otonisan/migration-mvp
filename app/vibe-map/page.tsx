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

  // デバッグ用
  console.log('selectedArea:', selectedArea);

  return (
    <div className="flex h-screen bg-white">
      {/* サイドバー */}
      <VibeSidebar
        timeOfDay={timeOfDay}
        onTimeChange={setTimeOfDay}
        selectedVibes={selectedVibes}
        onVibeToggle={handleVibeToggle}
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

        {/* 凡例 */}
        <div className="absolute bottom-8 left-8 bg-white/98 backdrop-blur-sm p-6 border border-gray-300 rounded shadow-lg max-w-xs">
          <p className="text-xs tracking-[0.3em] text-gray-900 mb-4 uppercase font-medium">Legend</p>
          <div className="space-y-3">
            {Object.values(VIBE_TYPES)
              .filter((vibe) => selectedVibes.includes(vibe.id))
              .slice(0, 5)
              .map((vibe) => (
                <div key={vibe.id} className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-400"
                    style={{ backgroundColor: vibe.hex }}
                  />
                  <div className="flex-1">
                    <div className="text-xs text-gray-900 tracking-wide font-medium">{vibe.name_ja}</div>
                    <div className="text-xs text-gray-600">{vibe.name_en}</div>
                  </div>
                </div>
              ))}
            {selectedVibes.length > 5 && (
              <div className="text-xs text-gray-700 tracking-wide font-medium">
                +{selectedVibes.length - 5} more
              </div>
            )}
          </div>
        </div>

        {/* エリア数表示 */}
        <div className="absolute top-8 right-8 bg-white/98 backdrop-blur-sm px-6 py-3 border border-gray-300 rounded">
          <div className="text-xs text-gray-900 tracking-wider uppercase mb-1 font-medium">Areas</div>
          <div className="text-2xl font-light text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
            {areas.filter((a) => selectedVibes.includes(a.top_vibe)).length}
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