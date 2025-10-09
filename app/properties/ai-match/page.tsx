// app/properties/ai-match/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  region: string;
  rent: number;
  image_url: string;
  description: string;
  lat: number;
  lng: number;
  ai_score: number;
  match_reasons: string[];
  score_breakdown: {
    budget: number;
    lifestyle: number;
    environment: number;
    workstyle: number;
    family: number;
  };
}

export default function AIMatchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAIMatches();
  }, []);

const loadAIMatches = async () => {
  try {
    setIsLoading(true);
    
    const diagnosticResult = localStorage.getItem('diagnostic_result');
    
    if (!diagnosticResult) {
      setError('診断結果が見つかりません。先に診断を受けてください。');
      setIsLoading(false);
      return;
    }

    const answers = JSON.parse(diagnosticResult);
    
    console.log('送信データ:', answers);

    const response = await fetch('/api/ai-match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answers.answers || answers),
    });

    if (!response.ok) {
      throw new Error('マッチング処理に失敗しました');
    }

    const data = await response.json();
    
    console.log('受信データ全体:', data);
    console.log('物件データ:', data.properties);
    console.log('最初の物件:', data.properties?.[0]);
    
    setProperties(data.properties.slice(0, 10));
    
  } catch (err) {
    console.error('エラー詳細:', err);
    setError('マッチング結果の取得に失敗しました');
  } finally {
    setIsLoading(false);
  }
};

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '最適';
    if (score >= 80) return '非常に良い';
    if (score >= 70) return '良い';
    if (score >= 60) return 'まあまあ';
    return '要検討';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">AIがあなたに最適な物件を分析中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-white text-xl font-bold mb-4">{error}</h2>
          <Link
            href="/diagnostic"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            診断を受ける
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* ヘッダー */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/properties" className="text-purple-200 hover:text-white transition-colors">
            ← 物件一覧に戻る
          </Link>
          <h1 className="text-white text-xl font-bold">🤖 AIおすすめ物件</h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* タイトルセクション */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            あなたにぴったりの物件
          </h2>
          <p className="text-purple-200 text-lg">
            診断結果をもとに、AIが最適な物件をランキング形式でご提案します
          </p>
        </div>

        {/* 物件リスト */}
        <div className="space-y-6">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/15 transition-all hover:scale-[1.02] border border-white/20"
            >
              <div className="flex flex-col md:flex-row">
                {/* ランキングバッジ */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-purple-500 to-purple-700'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                {/* 画像 */}
<div className="relative w-full md:w-1/3 h-64 md:h-auto min-h-[300px]">
  <img
    src={property.image_url}
    alt={property.name}
    className="w-full h-full object-cover"
  />
  
  {/* スコアバッジ */}
  <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg">
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-purple-600">
        {property.ai_score}
      </span>
      <span className="text-sm text-gray-600">点</span>
    </div>
    <div className={`text-xs font-bold text-center mt-1 px-2 py-1 rounded ${getScoreColor(property.ai_score)}`}>
      {getScoreLabel(property.ai_score)}
    </div>
  </div>
</div>

                {/* 物件情報 */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-4 text-purple-200">
                        <span className="flex items-center gap-1">
                          📍 {property.region}
                        </span>
                        <span className="flex items-center gap-1">
                         💰 {property.rent?.toLocaleString() || '価格未定'}円/月
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* マッチング理由 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-purple-200 mb-3">
                      🎯 この物件をおすすめする理由
                    </h4>
                    <div className="space-y-2">
                      {property.match_reasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span className="text-white text-sm">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* スコア詳細 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-purple-200 mb-3">
                      📊 詳細スコア
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { label: '予算', value: property.score_breakdown.budget },
                        { label: 'ライフ', value: property.score_breakdown.lifestyle },
                        { label: '環境', value: property.score_breakdown.environment },
                        { label: '仕事', value: property.score_breakdown.workstyle },
                        { label: '家族', value: property.score_breakdown.family },
                      ].map((item) => (
                        <div key={item.label} className="bg-white/10 rounded-lg p-3 text-center">
                          <div className="text-xs text-purple-200 mb-1">{item.label}</div>
                          <div className="text-lg font-bold text-white">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ボタン */}
                  <div className="flex gap-3">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-center hover:shadow-lg transition-all"
                    >
                      詳細を見る
                    </Link>
                    <button className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
                      💝
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-block text-purple-200 hover:text-white transition-colors"
          >
            すべての物件を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}