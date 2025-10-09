'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

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

export default function SimulatorStoryPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}>
      {/* ヘッダー */}
      <header className="border-b-2 border-emerald-500 bg-white shadow-sm p-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/simulator" className="text-gray-600 hover:text-emerald-600 mb-4 inline-flex items-center gap-2 font-medium transition-colors">
            ← 生活費シミュレーターに戻る
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            生活ストーリー
          </h1>
          <p className="text-gray-700 font-medium">
            あなたがこのエリアに住んだら、どんな一日を過ごす？
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8">
        {/* 入力フォーム */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 mb-8 shadow-lg">
          <p className="text-xs text-gray-700 mb-6 uppercase font-bold tracking-wider">
            Step 1: エリアとペルソナを設定
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* エリア選択 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-bold">エリア</label>
              <select
                value={areaId}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
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
              <label className="block text-sm text-gray-900 mb-2 font-bold">年齢</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                placeholder="例: 35"
              />
            </div>

            {/* 家族構成 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-bold">家族構成</label>
              <input
                type="text"
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                placeholder="例: 配偶者・子ども2人"
              />
            </div>

            {/* 働き方 */}
            <div>
              <label className="block text-sm text-gray-900 mb-2 font-bold">働き方</label>
              <input
                type="text"
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                placeholder="例: リモートワーク"
              />
            </div>

            {/* 趣味・関心 */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-900 mb-2 font-bold">趣味・関心</label>
              <input
                type="text"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                placeholder="例: 子育て、自然、カフェ巡り"
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full mt-6 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-xl ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-emerald-600 hover:to-teal-700'
            }`}
          >
            {loading ? 'AI生成中...' : '生活ストーリーを生成'}
          </button>
        </div>

        {/* 結果表示 */}
        {simulation && (
          <div className="space-y-8">
            {/* サマリー */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-lg">
              <p className="text-xs text-gray-700 mb-4 uppercase font-bold tracking-wider">
                Summary
              </p>
              <p className="text-gray-900 leading-relaxed font-medium">
                {simulation.summary}
              </p>
            </div>

            {/* タイムライン */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-lg">
              <p className="text-xs text-gray-700 mb-6 uppercase font-bold tracking-wider">
                Timeline - ある一日
              </p>
              <div className="space-y-6">
                {simulation.timeline.map((item, index) => (
                  <div key={index} className="flex gap-6 pb-6 border-b-2 border-emerald-100 last:border-0">
                    <div className="flex-shrink-0 w-24">
                      <div className="text-3xl font-bold text-emerald-600">
                        {item.time}
                      </div>
                      <div className="text-xs text-gray-600 uppercase tracking-wider mt-1 font-bold">
                        {item.period}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.activity}
                      </h3>
                      <p className="text-sm text-gray-700 mb-2 font-medium">📍 {item.location}</p>
                      <p className="text-gray-800 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* おすすめスポット */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-lg">
              <p className="text-xs text-gray-700 mb-6 uppercase font-bold tracking-wider">
                Recommended Spots
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulation.recommended_spots.map((spot, index) => (
                  <div key={index} className="border-2 border-emerald-100 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                    <h4 className="font-bold text-gray-900 mb-2">{spot.name}</h4>
                    <p className="text-sm text-gray-700">{spot.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* アクション */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/vibe-map')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-gray-900 font-bold rounded-xl"
              >
                ← 空気感マップに戻る
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 transition-all font-bold rounded-xl shadow-lg hover:shadow-xl"
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