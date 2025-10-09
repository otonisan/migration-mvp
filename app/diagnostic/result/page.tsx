'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

function DiagnosticResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const recommendation = searchParams.get('recommendation') || '地方移住に最適';
  const riskLevel = searchParams.get('risk') || '低';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
    setTimeout(() => setIsVisible(true), 100);
  }, [supabase]);

  const handleSaveResult = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSaveMessage('ログインが必要です');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('diagnostic_results')
        .insert({
          user_id: user.id,
          recommendation: recommendation,
          risk_level: riskLevel,
          age: parseInt(searchParams.get('age') || '0'),
          income: parseInt(searchParams.get('income') || '0'),
          savings: parseInt(searchParams.get('savings') || '0'),
          family_size: parseInt(searchParams.get('family') || '1'),
          has_children: searchParams.get('children') === 'true',
          employment_status: searchParams.get('employment') || '',
          remote_work_possible: searchParams.get('remote') === 'true',
          preferred_regions: searchParams.get('regions')?.split(',') || [],
          budget_range: searchParams.get('budget') || '',
          priorities: searchParams.get('priorities')?.split(',') || [],
          lifestyle_preferences: searchParams.get('lifestyle')?.split(',') || []
        });

      if (error) throw error;

      setSaveMessage('診断結果を保存しました');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSaveMessage(error.message || '保存に失敗しました');
      } else {
        setSaveMessage('保存に失敗しました');
      }
    } finally {
      setSaving(false);
    }
  };

  const getRecommendationDetails = () => {
    switch (recommendation) {
      case '地方移住に最適':
        return {
          title: '🎉 移住準備OK！',
          subtitle: '地方移住に最適です',
          description: 'あなたの状況は地方移住に非常に適しています。素晴らしい新生活が待っています！',
          emoji: '🌟',
          details: [
            '✅ 十分な貯蓄があり、移住後の生活も安定しています',
            '✅ リモートワークが可能で、仕事の継続性があります',
            '✅ 家族構成も移住に適した状況です',
            '✅ 地方での生活コストダウンにより、生活の質が向上します'
          ],
          nextSteps: [
            '候補地の下見ツアーを計画する',
            '移住支援制度を調べる',
            '住居探しを始める',
            '地域のコミュニティに参加する'
          ]
        };
      case '準備期間が必要':
        return {
          title: '📅 準備を進めよう',
          subtitle: '準備期間を設けましょう',
          description: 'もう少し準備を整えてから移住するのがおすすめです。着実に進めていきましょう！',
          emoji: '⏰',
          details: [
            '💰 貯蓄をもう少し増やすと安心です',
            '💼 移住後の収入源を確保しましょう',
            '👨‍👩‍👧‍👦 家族との話し合いを重ねましょう',
            '📍 移住先の情報収集を始めましょう'
          ],
          nextSteps: [
            '6ヶ月から1年の準備期間を設定',
            '毎月の貯蓄目標を立てる',
            '移住先候補地の情報収集',
            'リモートワークの可能性を探る'
          ]
        };
      default:
        return {
          title: '🔍 慎重に計画しよう',
          subtitle: '慎重な計画が必要です',
          description: 'より詳細な計画を立ててから移住を検討しましょう。焦らず進めていきましょう！',
          emoji: '📋',
          details: [
            '💪 経済的な基盤をしっかり固めましょう',
            '🔎 移住先での仕事を確保しましょう',
            '👥 家族の同意と理解を得ましょう',
            '🏠 段階的な移住を検討しましょう'
          ],
          nextSteps: [
            '1年以上の準備期間を設定',
            '移住先での仕事探しを開始',
            '試験的な短期滞在を計画',
            '専門家への相談を検討'
          ]
        };
    }
  };

  const getRiskLevelData = () => {
    switch (riskLevel) {
      case '低': 
        return { text: '低リスク', color: 'emerald', emoji: '✅' };
      case '中': 
        return { text: '中リスク', color: 'yellow', emoji: '⚠️' };
      case '高': 
        return { text: '高リスク', color: 'red', emoji: '🔴' };
      default: 
        return { text: 'リスクレベル', color: 'gray', emoji: '📊' };
    }
  };

  const result = getRecommendationDetails();
  const riskData = getRiskLevelData();

  return (
    <div 
      className="min-h-screen bg-emerald-50"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}
    >
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            🏡 MIGRATION
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            ダッシュボード →
          </Link>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="pt-32 pb-24 px-8">
        <div className="max-w-5xl mx-auto">
          {/* ヘッダー */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-200 rounded-full mb-6">
              <span className="text-xs font-bold text-emerald-700">診断結果</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {result.title}
            </h1>
            
            <p className="text-2xl font-bold text-gray-900 mb-4">
              {result.subtitle}
            </p>
            
            <p className="text-lg font-medium text-gray-700 max-w-2xl mx-auto">
              {result.description}
            </p>
          </div>

          {/* リスクレベル */}
          <div 
            className={`text-center mb-16 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-block bg-white border-2 border-emerald-200 rounded-2xl px-12 py-6 shadow-lg">
              <p className="text-sm font-bold text-gray-700 mb-2">
                リスクレベル
              </p>
              <p className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <span>{riskData.emoji}</span>
                <span>{riskData.text}</span>
              </p>
            </div>
          </div>

          {/* 詳細分析 */}
          <div 
            className={`mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              📊 詳細分析
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {result.details.map((detail, index) => (
                <div 
                  key={index} 
                  className="bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all"
                >
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 次のステップ */}
          <div 
            className={`mb-16 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              🎯 次のステップ
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {result.nextSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-4 bg-white border-2 border-emerald-200 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-900 font-medium leading-relaxed pt-2">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 保存ボタン */}
          {isLoggedIn && (
            <div 
              className={`mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {saveMessage && (
                <div className={`mb-4 p-4 rounded-xl text-center font-bold border-2 ${
                  saveMessage.includes('保存しました') 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-red-500 bg-red-50 text-red-700'
                }`}>
                  {saveMessage}
                </div>
              )}
              <button
                onClick={handleSaveResult}
                disabled={saving || saveMessage.includes('保存しました')}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold tracking-wider hover:from-emerald-600 hover:to-teal-700 transition-all rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : saveMessage.includes('保存しました') ? '✅ 保存済み' : '💾 診断結果を保存'}
              </button>
            </div>
          )}

          {/* 未ログイン */}
          {!isLoggedIn && (
            <div 
              className={`mb-12 max-w-3xl mx-auto bg-white border-2 border-emerald-200 rounded-2xl p-12 text-center shadow-lg transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-xl font-bold text-gray-900 mb-6">
                🔐 診断結果を保存するにはログインが必要です
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all"
                >
                  新規登録
                </Link>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div 
            className={`grid md:grid-cols-2 gap-6 max-w-3xl mx-auto transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/plan-builder"
              className="block py-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              📝 移住プランを作成
            </Link>
            <Link
              href="/"
              className="block py-5 border-2 border-emerald-500 text-emerald-600 text-center font-bold rounded-xl hover:bg-emerald-50 transition-all"
            >
              🏠 ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DiagnosticResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <DiagnosticResultContent />
    </Suspense>
  );
}