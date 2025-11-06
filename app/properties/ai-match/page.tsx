// app/properties/ai-match/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-gray-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '最適';
    if (score >= 80) return '非常に良い';
    if (score >= 70) return '良い';
    if (score >= 60) return 'まあまあ';
    return '要検討';
  };

  const getRankBadgeColor = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-yellow-600';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-orange-600';
    return 'from-emerald-500 to-teal-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">AIがあなたに最適な物件を分析中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center border-2 border-red-200">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-gray-900 text-2xl font-bold mb-4">{error}</h2>
          <Link
            href="/diagnostic"
            className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
          >
            診断を受ける
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/properties" className="text-gray-600 hover:text-gray-900 transition-colors font-medium flex items-center gap-2">
              <span>←</span> 物件一覧に戻る
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🤖</span> AIおすすめ物件
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* タイトルセクション */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            あなたにぴったりの物件
          </h2>
          <p className="text-xl text-gray-600">
            診断結果をもとに、AIが最適な物件をランキング形式でご提案します
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* 物件リスト */}
        <div className="space-y-8">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-200 animate-fade-in-up relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col lg:flex-row">
                {/* ランキングバッジ */}
                <div className="absolute top-6 left-6 z-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-2xl bg-gradient-to-br ${getRankBadgeColor(index)}`}>
                    {index + 1}
                  </div>
                </div>

                {/* 画像 */}
                <div className="relative w-full lg:w-1/3 h-80 lg:h-auto">
                  <Image
                    src={property.image_url || `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80`}
                    alt={property.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  
                  {/* スコアバッジ */}
                  <div className="absolute top-6 right-6 bg-white rounded-2xl px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(property.ai_score)} bg-clip-text text-transparent`}>
                        {property.ai_score}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">点</span>
                    </div>
                    <div className={`text-xs font-bold text-center mt-2 px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(property.ai_score)} text-white`}>
                      {getScoreLabel(property.ai_score)}
                    </div>
                  </div>
                </div>

                {/* 物件情報 */}
                <div className="flex-1 p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {property.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-2 font-medium">
                        <span>📍</span> {property.region}
                      </span>
                      <span className="flex items-center gap-2 font-bold text-emerald-600">
                        <span>💰</span> {property.rent?.toLocaleString() || '価格未定'}円/月
                      </span>
                    </div>
                  </div>

                  {/* マッチング理由 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>🎯</span> この物件をおすすめする理由
                    </h4>
                    <div className="space-y-2">
                      {property.match_reasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                          <span className="text-emerald-600 text-xl flex-shrink-0">✓</span>
                          <span className="text-gray-900 font-medium">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* スコア詳細 */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📊</span> 詳細スコア
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {[
                        { label: '予算', value: property.score_breakdown.budget, icon: '💰' },
                        { label: 'ライフ', value: property.score_breakdown.lifestyle, icon: '✨' },
                        { label: '環境', value: property.score_breakdown.environment, icon: '🌳' },
                        { label: '仕事', value: property.score_breakdown.workstyle, icon: '💼' },
                        { label: '家族', value: property.score_breakdown.family, icon: '👨‍👩‍👧‍👦' },
                      ].map((item) => (
                        <div key={item.label} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-200 shadow-sm">
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <div className="text-xs text-gray-600 mb-1 font-medium">{item.label}</div>
                          <div className="text-xl font-bold text-gray-900">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ボタン */}
                  <div className="flex gap-3">
                    <Link
                      href={`/properties/${property.id}`}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-4 rounded-xl font-bold text-center hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      詳細を見る
                    </Link>
                    <button className="px-8 py-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 rounded-xl transition-all text-2xl">
                      💝
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="mt-16 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold text-lg"
          >
            <span>すべての物件を見る</span>
            <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}