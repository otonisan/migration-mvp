'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TimelineItem {
  time: string;
  period: string;
  activity: string;
  location: string;
  description: string;
  vibe: string;
}

interface Simulation {
  timeline: TimelineItem[];
  summary: string;
  recommended_spots: Array<{ name: string; reason: string }>;
}

function SimulatorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedAreaId = searchParams.get('area_id');

  const [areaId, setAreaId] = useState(preselectedAreaId || 'yamagata_castle_west');
  const [age, setAge] = useState('35');
  const [family, setFamily] = useState('配偶者・子ども2人（小学生）');
  const [workStyle, setWorkStyle] = useState('リモートワーク中心');
  const [interests, setInterests] = useState('子育て、自然、カフェ巡り');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState<Simulation | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setSimulation(null);

    try {
      const res = await fetch('/api/simulator/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area_id: areaId,
          persona: { age, family, work_style: workStyle, interests },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSimulation(data.simulation);
      } else {
        alert('生成に失敗しました: ' + data.error);
      }
    } catch (error) {
      alert('エラーが発生しました');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-200 p-8">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-4xl font-light mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            生活シミュレーター
          </h1>
          <p className="text-gray-600 tracking-wide">
            あなたがこのエリアに住んだら、どんな一日を過ごす？
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* 入力フォーム */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-900 mb-6 uppercase font-medium">
            Step 1: エリアとペルソナを設定
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* エリア選択 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-medium">エリア</label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
              >
                <option value="yamagata_castle_west">山形市城西エリア</option>
                <option value="yamagata_station">山形駅前エリア</option>
                <option value="yamagata_nanokamachi">七日町エリア</option>
                <option value="yamagata_kajo_park">霞城公園周辺</option>
                <option value="tendo_onsen">天童温泉エリア</option>
              </select>
            </div>

            {/* 年齢 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-medium">年齢</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                placeholder="例: 35"
              />
            </div>

            {/* 家族構成 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-medium">家族構成</label>
              <input
                type="text"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                placeholder="例: 配偶者・子ども2人"
              />
            </div>

            {/* 働き方 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-medium">働き方</label>
              <input
                type="text"
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                placeholder="例: リモートワーク"
              />
            </div>

            {/* 趣味・関心 */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-900 mb-2 font-medium">趣味・関心</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
                placeholder="例: 子育て、自然、カフェ巡り"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full mt-6 px-6 py-3 bg-gray-900 text-white rounded transition-all font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {loading ? 'AI生成中...' : '生活ストーリーを生成'}
          </button>
        </div>

        {/* 結果表示 */}
        {simulation && (
          <div className="space-y-8">
            {/* サマリー */}
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <p className="text-xs tracking-[0.3em] text-gray-900 mb-4 uppercase font-medium">
                Summary
              </p>
              <p className="text-gray-900 leading-relaxed tracking-wide">
                {simulation.summary}
              </p>
            </div>

            {/* タイムライン */}
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <p className="text-xs tracking-[0.3em] text-gray-900 mb-6 uppercase font-medium">
                Timeline - ある一日
              </p>
              <div className="space-y-6">
                {simulation.timeline.map((item, index) => (
                  <div key={index} className="flex gap-6 pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 w-20">
                      <div
                        className="text-2xl font-light text-gray-900"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {item.time}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                        {item.period}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {item.activity}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">📍 {item.location}</p>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* おすすめスポット */}
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <p className="text-xs tracking-[0.3em] text-gray-900 mb-6 uppercase font-medium">
                Recommended Spots
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulation.recommended_spots.map((spot, index) => (
                  <div key={index} className="border border-gray-200 rounded p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{spot.name}</h4>
                    <p className="text-sm text-gray-600">{spot.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* アクション */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/vibe-map')}
                className="flex-1 px-6 py-3 border border-gray-300 hover:border-gray-900 transition-all text-gray-900 font-medium"
              >
                ← 空気感マップに戻る
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-all font-medium"
              >
                別のストーリーを生成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <SimulatorPageContent />
    </Suspense>
  );
}