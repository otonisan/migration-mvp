'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function PlanBuilder() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  const [planName, setPlanName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [housingCost, setHousingCost] = useState('');
  const [movingCost, setMovingCost] = useState('');
  const [emergencyFund, setEmergencyFund] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
    setTimeout(() => setIsVisible(true), 100);
  }, [supabase]);

  const calculateTotal = () => {
    const housing = parseInt(housingCost) || 0;
    const moving = parseInt(movingCost) || 0;
    const emergency = parseInt(emergencyFund) || 0;
    return housing + moving + emergency;
  };

  const handleSavePlan = async () => {
    if (!planName || !destination) {
      setSaveMessage('プラン名と移住先は必須です');
      return;
    }

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
        .from('saved_plans')
        .insert({
          user_id: user.id,
          plan_name: planName,
          destination: destination,
          budget: parseInt(budget) || 0,
          timeline: timeline,
          housing_cost: parseInt(housingCost) || 0,
          moving_cost: parseInt(movingCost) || 0,
          emergency_fund: parseInt(emergencyFund) || 0,
          monthly_expenses: parseInt(monthlyExpenses) || 0,
          notes: notes,
          status: 'draft'
        });

      if (error) throw error;

      setSaveMessage('プランを保存しました！');
      // フォームをクリア
      setTimeout(() => {
        setPlanName('');
        setDestination('');
        setBudget('');
        setTimeline('');
        setHousingCost('');
        setMovingCost('');
        setEmergencyFund('');
        setMonthlyExpenses('');
        setNotes('');
        setSaveMessage('');
      }, 2000);
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

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}
    >
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            🏔️ 山形移住ナビ
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            ダッシュボード →
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div 
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-200 rounded-full mb-6">
              <span className="text-xs font-bold text-emerald-700">移住計画ツール</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              🏔️ 移住プランビルダー
            </h1>
            
            <p className="text-xl text-gray-600">
              あなただけの山形移住計画を作成しましょう
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6"></div>
          </div>

          {/* メインフォーム */}
          <div 
            className={`bg-white border-2 border-emerald-200 rounded-3xl p-8 md:p-12 shadow-xl mb-8 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="space-y-8">
              {/* プラン名 */}
              <div>
                <label className="block text-gray-900 text-lg font-bold mb-3 flex items-center gap-2">
                  <span>📝</span>
                  プラン名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                  placeholder="例: 山形市移住計画2025"
                />
              </div>

              {/* 移住先 */}
              <div>
                <label className="block text-gray-900 text-lg font-bold mb-3 flex items-center gap-2">
                  <span>📍</span>
                  移住先 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                  placeholder="例: 山形県山形市"
                />
              </div>

              {/* 予算 */}
              <div>
                <label className="block text-gray-900 text-lg font-bold mb-3 flex items-center gap-2">
                  <span>💰</span>
                  総予算（万円）
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                  placeholder="500"
                />
              </div>

              {/* タイムライン */}
              <div>
                <label className="block text-gray-900 text-lg font-bold mb-3 flex items-center gap-2">
                  <span>📅</span>
                  移住予定時期
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium bg-white"
                >
                  <option value="">選択してください</option>
                  <option value="3ヶ月以内">3ヶ月以内</option>
                  <option value="6ヶ月以内">6ヶ月以内</option>
                  <option value="1年以内">1年以内</option>
                  <option value="1年以上">1年以上</option>
                </select>
              </div>

              {/* 費用詳細 */}
              <div className="border-t-2 border-emerald-100 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>💵</span>
                  費用内訳
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* 住居費用 */}
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <span>🏠</span>
                      住居費用（初期費用・万円）
                    </label>
                    <input
                      type="number"
                      value={housingCost}
                      onChange={(e) => setHousingCost(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                      placeholder="100"
                    />
                  </div>

                  {/* 引越し費用 */}
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <span>🚚</span>
                      引越し費用（万円）
                    </label>
                    <input
                      type="number"
                      value={movingCost}
                      onChange={(e) => setMovingCost(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                      placeholder="30"
                    />
                  </div>

                  {/* 緊急資金 */}
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <span>🆘</span>
                      緊急資金（万円）
                    </label>
                    <input
                      type="number"
                      value={emergencyFund}
                      onChange={(e) => setEmergencyFund(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                      placeholder="50"
                    />
                  </div>

                  {/* 月間生活費 */}
                  <div>
                    <label className="block text-gray-900 font-bold mb-3 flex items-center gap-2">
                      <span>📊</span>
                      月間生活費（万円）
                    </label>
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                      placeholder="25"
                    />
                  </div>
                </div>

                {/* 合計表示 */}
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 text-xl font-bold">初期費用合計</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {calculateTotal().toLocaleString()} 万円
                    </span>
                  </div>
                </div>
              </div>

              {/* メモ */}
              <div>
                <label className="block text-gray-900 text-lg font-bold mb-3 flex items-center gap-2">
                  <span>📝</span>
                  メモ・備考
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none font-medium"
                  placeholder="移住に関するメモや注意点を記入してください"
                />
              </div>
            </div>

            {/* 保存メッセージ */}
            {saveMessage && (
              <div className={`mt-8 p-5 rounded-xl border-2 font-bold text-center ${
                saveMessage.includes('保存しました') 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                  : 'bg-red-50 border-red-500 text-red-700'
              }`}>
                {saveMessage}
              </div>
            )}

            {/* 未ログインメッセージ */}
            {!isLoggedIn && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8">
                <p className="text-gray-900 text-center mb-6 font-bold text-lg">
                  🔐 プランを保存するにはログインが必要です
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/auth/login"
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all"
                  >
                    新規登録
                  </Link>
                </div>
              </div>
            )}

            {/* 保存ボタン */}
            {isLoggedIn && (
              <div className="mt-8">
                <button
                  onClick={handleSavePlan}
                  disabled={saving || !planName || !destination}
                  className="w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl font-bold hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {saving ? '保存中...' : '💾 プランを保存する'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                </button>
              </div>
            )}
          </div>

          {/* ダッシュボードリンク */}
          {isLoggedIn && (
            <div 
              className={`text-center transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <Link
                href="/dashboard/saved-plans"
                className="text-emerald-600 hover:text-emerald-700 transition-colors font-semibold text-lg inline-flex items-center gap-2"
              >
                <span>保存したプラン一覧を見る</span>
                <span>→</span>
              </Link>
            </div>
          )}

          {/* おすすめ機能 */}
          <div 
            className={`mt-16 grid md:grid-cols-3 gap-6 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/vibe-map"
              className="bg-white border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-400 transition-all group"
            >
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                空気感マップ
              </h3>
              <p className="text-gray-600">エリアの雰囲気を確認</p>
            </Link>

            <Link
              href="/simulator"
              className="bg-white border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-400 transition-all group"
            >
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                生活費試算
              </h3>
              <p className="text-gray-600">実際の費用を計算</p>
            </Link>

            <Link
              href="/properties"
              className="bg-white border-2 border-emerald-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-400 transition-all group"
            >
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                物件検索
              </h3>
              <p className="text-gray-600">理想の家を見つける</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}