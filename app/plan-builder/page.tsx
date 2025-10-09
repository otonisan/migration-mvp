'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function PlanBuilder() {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/" className="text-purple-200 hover:text-white transition-colors">
            ← ホームに戻る
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            移住プランビルダー
          </h1>
          <p className="text-purple-200 text-lg">
            あなただけの移住計画を作成しましょう
          </p>
        </div>

        {/* メインフォーム */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 mb-8">
          <div className="space-y-8">
            {/* プラン名 */}
            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                プラン名 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="例: 長野県移住計画2025"
              />
            </div>

            {/* 移住先 */}
            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                移住先 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="例: 長野県松本市"
              />
            </div>

            {/* 予算 */}
            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                総予算（万円）
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="500"
              />
            </div>

            {/* タイムライン */}
            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                移住予定時期
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="" className="bg-purple-900">選択してください</option>
                <option value="3ヶ月以内" className="bg-purple-900">3ヶ月以内</option>
                <option value="6ヶ月以内" className="bg-purple-900">6ヶ月以内</option>
                <option value="1年以内" className="bg-purple-900">1年以内</option>
                <option value="1年以上" className="bg-purple-900">1年以上</option>
              </select>
            </div>

            {/* 費用詳細 */}
            <div className="border-t border-white/20 pt-8">
              <h3 className="text-2xl font-bold text-white mb-6">費用内訳</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* 住居費用 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    住居費用（初期費用・万円）
                  </label>
                  <input
                    type="number"
                    value={housingCost}
                    onChange={(e) => setHousingCost(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder="100"
                  />
                </div>

                {/* 引越し費用 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    引越し費用（万円）
                  </label>
                  <input
                    type="number"
                    value={movingCost}
                    onChange={(e) => setMovingCost(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder="30"
                  />
                </div>

                {/* 緊急資金 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    緊急資金（万円）
                  </label>
                  <input
                    type="number"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder="50"
                  />
                </div>

                {/* 月間生活費 */}
                <div>
                  <label className="block text-white font-semibold mb-2">
                    月間生活費（万円）
                  </label>
                  <input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                    placeholder="25"
                  />
                </div>
              </div>

              {/* 合計表示 */}
              <div className="mt-6 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-6 border border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 text-lg">初期費用合計</span>
                  <span className="text-3xl font-bold text-white">
                    {calculateTotal().toLocaleString()} 万円
                  </span>
                </div>
              </div>
            </div>

            {/* メモ */}
            <div>
              <label className="block text-white text-lg font-semibold mb-3">
                メモ・備考
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                placeholder="移住に関するメモや注意点を記入してください"
              />
            </div>
          </div>

          {/* 保存メッセージ */}
          {saveMessage && (
            <div className={`mt-6 p-4 rounded-xl ${saveMessage.includes('保存しました') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
              {saveMessage}
            </div>
          )}

          {/* 未ログインメッセージ */}
          {!isLoggedIn && (
            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <p className="text-yellow-200 text-center mb-4">
                プランを保存するにはログインが必要です
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/auth/login"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                >
                  ログイン
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
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
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {saving ? '保存中...' : '💾 プランを保存'}
              </button>
            </div>
          )}
        </div>

        {/* ダッシュボードリンク */}
        {isLoggedIn && (
          <div className="text-center">
            <Link
              href="/dashboard/saved-plans"
              className="text-purple-200 hover:text-white transition-colors"
            >
              → 保存したプラン一覧を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}