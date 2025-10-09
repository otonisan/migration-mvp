'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface DiagnosticResult {
  id: string;
  recommendation: string;
  risk_level: string;
  age: number;
  income: number;
  savings: number;
  family_size: number;
  created_at: string;
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data, error } = await supabase
        .from('diagnostic_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setResults(data || []);
      }

      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    };

    fetchData();
  }, [router, supabase]);

  const getRiskLevelText = (risk: string) => {
    switch (risk) {
      case '低': return 'Low';
      case '中': return 'Medium';
      case '高': return 'High';
      default: return risk;
    }
  };

  const getRecommendationTitle = (recommendation: string) => {
    switch (recommendation) {
      case '地方移住に最適': return 'Ready';
      case '準備期間が必要': return 'Preparation';
      case '慎重な計画が必要': return 'Planning';
      default: return recommendation;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この診断結果を削除しますか？')) return;

    const { error } = await supabase
      .from('diagnostic_results')
      .delete()
      .eq('id', id);

    if (error) {
      alert('削除に失敗しました');
    } else {
      setResults(results.filter(r => r.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="text-2xl tracking-[0.2em] font-light text-gray-900 hover:text-gray-600 transition-colors duration-300"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            MIGRATION
          </Link>
          <Link
            href="/diagnostic"
            className="text-sm tracking-wider text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            NEW DIAGNOSTIC
          </Link>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <div 
            className={`mb-16 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link 
              href="/dashboard"
              className="inline-block text-sm tracking-wider text-gray-600 hover:text-gray-900 transition-colors mb-8"
            >
              ← BACK
            </Link>
            <h1 
              className="text-5xl md:text-6xl font-light text-gray-900 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              History
            </h1>
          </div>

          {/* 履歴がない場合 */}
          {results.length === 0 ? (
            <div 
              className={`border border-gray-200 p-16 text-center transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 
                className="text-3xl font-light text-gray-900 mb-4 tracking-wide"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                No History
              </h3>
              <p className="text-gray-600 mb-12 tracking-wide">
                診断履歴がありません
              </p>
              <Link
                href="/diagnostic"
                className="inline-block px-12 py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-gray-800 transition-all duration-300"
              >
                START DIAGNOSTIC
              </Link>
            </div>
          ) : (
            /* 診断履歴リスト */
            <div className="space-y-6">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`border border-gray-200 p-8 hover:border-gray-900 hover:shadow-lg transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 
                        className="text-2xl font-light text-gray-900 mb-2 tracking-wide"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {getRecommendationTitle(result.recommendation)}
                      </h3>
                      <p className="text-sm text-gray-600 tracking-wider">
                        {formatDate(result.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs tracking-widest text-gray-400 mb-1">RISK</p>
                      <p className="text-gray-900 tracking-wide">
                        {getRiskLevelText(result.risk_level)}
                      </p>
                    </div>
                  </div>

                  {/* データ概要 */}
                  <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-xs tracking-widest text-gray-400 mb-2">AGE</p>
                      <p className="text-gray-900">{result.age}</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-gray-400 mb-2">INCOME</p>
                      <p className="text-gray-900">¥{result.income.toLocaleString()}万</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-gray-400 mb-2">SAVINGS</p>
                      <p className="text-gray-900">¥{result.savings.toLocaleString()}万</p>
                    </div>
                    <div>
                      <p className="text-xs tracking-widest text-gray-400 mb-2">FAMILY</p>
                      <p className="text-gray-900">{result.family_size}人</p>
                    </div>
                  </div>

                  {/* アクション */}
                  <div className="flex gap-4">
                    <Link
                      href={`/diagnostic/result?recommendation=${encodeURIComponent(result.recommendation)}&risk=${encodeURIComponent(result.risk_level)}`}
                      className="flex-1 py-3 bg-gray-900 text-white text-center text-sm tracking-widest hover:bg-gray-800 transition-all duration-300"
                    >
                      VIEW DETAIL
                    </Link>
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="px-8 py-3 border border-gray-900 text-gray-900 text-sm tracking-widest hover:bg-gray-50 transition-all duration-300"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 統計 */}
          {results.length > 0 && (
            <div 
              className={`mt-16 border border-gray-200 p-12 transition-all duration-1000 delay-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 
                className="text-2xl font-light text-gray-900 mb-8 tracking-wide"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Statistics
              </h3>
              <div className="grid md:grid-cols-3 gap-12">
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-3">TOTAL</p>
                  <p className="text-4xl font-light text-gray-900">{results.length}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-3">LATEST</p>
                  <p className="text-xl font-light text-gray-900 tracking-wide">
                    {getRecommendationTitle(results[0]?.recommendation)}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-3">RISK LEVEL</p>
                  <p className="text-xl font-light text-gray-900 tracking-wide">
                    {getRiskLevelText(results[0]?.risk_level)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}