'use client';

import { useRouter } from 'next/navigation';
import { VIBE_TYPES } from '@/lib/mapbox';

interface Area {
  area_id: string;
  name: string;
  location: { lat: number; lng: number };
  top_vibe: string;
  top_score: number;
  vibes_for_time: Record<string, number>;
}

interface AreaDetailModalProps {
  area: Area | null;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  onClose: () => void;
}

export default function AreaDetailModal({ area, timeOfDay, onClose }: AreaDetailModalProps) {
  const router = useRouter();

  if (!area) return null;

  // トップ3の空気感を取得
  const sortedVibes = Object.entries(area.vibes_for_time)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const handleGoToStory = () => {
    router.push(`/simulator/story?area_id=${area.area_id}`);
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* モーダル */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
          {/* ヘッダー */}
          <div className="border-b border-gray-200 p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs tracking-[0.3em] text-gray-400 mb-2 uppercase">
                  Area Details
                </p>
                <h2
                  className="text-4xl font-light mb-2 text-gray-900"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {area.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {area.location.lat.toFixed(4)}, {area.location.lng.toFixed(4)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-900 hover:text-gray-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 360°映像プレースホルダー */}
          <div className="p-8 border-b border-gray-200">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">
              360° Experience
            </p>
            <div className="aspect-video bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎥</div>
                <p className="text-sm text-gray-500">360° Video Coming Soon</p>
              </div>
            </div>
          </div>

          {/* 空気感スコア - アイコン追加 */}
          <div className="p-8 border-b border-gray-200">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-4 uppercase">
              Vibe Scores - {timeOfDay}
            </p>
            <div className="space-y-4">
              {sortedVibes.map(([vibeId, score], index) => {
                const vibe = VIBE_TYPES[vibeId as keyof typeof VIBE_TYPES];
                if (!vibe) return null;

                return (
                  <div key={vibeId}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {/* アイコン追加 */}
                        <span className="text-2xl">{vibe.icon}</span>
                        <span
                          className="w-4 h-4 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: vibe.hex }}
                        />
                        <div>
                          <div className="text-sm text-gray-900 font-bold">{vibe.name_ja}</div>
                          <div className="text-xs text-gray-500">{vibe.description}</div>
                        </div>
                        {index === 0 && (
                          <span className="text-xs px-2 py-1 bg-gray-900 text-white rounded ml-auto">
                            TOP
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-light text-gray-900 ml-4" style={{ fontFamily: 'var(--font-serif)' }}>
                        {score}
                      </span>
                    </div>
                    {/* プログレスバー */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${score}%`,
                          backgroundColor: vibe.hex,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* アクション */}
          <div className="p-8 space-y-3">
            <button
              onClick={handleGoToStory}
              className="w-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-all text-sm tracking-wide font-medium rounded-lg"
            >
              このエリアの生活ストーリーを見る →
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-200 hover:border-gray-900 transition-all text-sm tracking-wide text-gray-900 rounded-lg"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  );
}