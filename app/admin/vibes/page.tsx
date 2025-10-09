'use client';

import { useState } from 'react';

interface CalculateResult {
  success?: boolean;
  area_id?: string;
  scores?: Record<string, number>;
  message?: string;
  error?: string;
  details?: string;
}

export default function AdminVibesPage() {
  const [areaId, setAreaId] = useState('yamagata_castle_west');
  const [context, setContext] = useState('静かな住宅街で、緑が多く、子育て世代が多い。近くに公園がある。');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateResult | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/vibes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area_id: areaId, context }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to calculate' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-4xl font-light mb-8 text-gray-900"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          AI空気感スコア算出
        </h1>

        <div className="bg-white border border-gray-300 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <label className="block text-sm text-gray-900 mb-2 font-medium">エリアID</label>
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

          <div className="mb-6">
            <label className="block text-sm text-gray-900 mb-2 font-medium">
              エリアの特徴・コンテキスト
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded h-32 text-gray-900"
              placeholder="エリアの特徴を入力..."
            />
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className={`w-full px-6 py-3 bg-gray-900 text-white rounded transition-all font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {loading ? 'AI分析中...' : 'スコア算出'}
          </button>
        </div>

        {result && (
          <div className="bg-white border border-gray-300 rounded-lg p-8">
            <h2 className="text-2xl font-light mb-4 text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
              結果
            </h2>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto text-gray-900 border border-gray-200">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}