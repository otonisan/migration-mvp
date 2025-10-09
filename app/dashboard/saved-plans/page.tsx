'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface SavedPlan {
  id: string;
  plan_name: string;
  destination: string;
  budget: number;
  timeline: string;
  housing_cost: number;
  moving_cost: number;
  emergency_fund: number;
  monthly_expenses: number;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function SavedPlansPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
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
        .from('saved_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plans:', error);
      } else {
        setPlans(data || []);
      }

      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    };

    fetchData();
  }, [router, supabase]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('このプランを削除しますか？')) return;

    const { error } = await supabase
      .from('saved_plans')
      .delete()
      .eq('id', id);

    if (error) {
      alert('削除に失敗しました');
    } else {
      setPlans(plans.filter(p => p.id !== id));
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('saved_plans')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('ステータス更新に失敗しました');
    } else {
      setPlans(plans.map(p => p.id === id ? { ...p, status: newStatus } : p));
      if (selectedPlan?.id === id) {
        setSelectedPlan({ ...selectedPlan, status: newStatus });
      }
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
            href="/plan-builder"
            className="text-sm tracking-wider text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            NEW PLAN
          </Link>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
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
              Saved Plans
            </h1>
          </div>

          {/* プランがない場合 */}
          {plans.length === 0 ? (
            <div 
              className={`border border-gray-200 p-16 text-center transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 
                className="text-3xl font-light text-gray-900 mb-4 tracking-wide"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                No Plans
              </h3>
              <p className="text-gray-600 mb-12 tracking-wide">
                保存したプランがありません
              </p>
              <Link
                href="/plan-builder"
                className="inline-block px-12 py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-gray-800 transition-all duration-300"
              >
                CREATE PLAN
              </Link>
            </div>
          ) : (
            /* プラン一覧 */
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左側: プラン一覧 */}
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`border border-gray-200 p-6 cursor-pointer hover:border-gray-900 hover:shadow-lg transition-all duration-500 ${
                      selectedPlan?.id === plan.id ? 'border-gray-900 shadow-lg' : ''
                    } ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 
                          className="text-xl font-light text-gray-900 mb-2 tracking-wide"
                          style={{ fontFamily: 'var(--font-serif)' }}
                        >
                          {plan.plan_name}
                        </h3>
                        <p className="text-sm text-gray-600 tracking-wide">
                          {plan.destination}
                        </p>
                      </div>
                      <span className="text-xs tracking-widest text-gray-400">
                        {getStatusLabel(plan.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 mb-4">
                      <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">BUDGET</p>
                        <p className="text-gray-900">¥{plan.budget.toLocaleString()}万</p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest text-gray-400 mb-1">TIMELINE</p>
                        <p className="text-gray-900">{plan.timeline || '-'}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 tracking-wider">
                      {formatDate(plan.created_at)}
                    </p>
                  </div>
                ))}
              </div>

              {/* 右側: 詳細表示 */}
              <div className="lg:sticky lg:top-32 h-fit">
                {selectedPlan ? (
                  <div 
                    className={`border border-gray-200 p-8 transition-all duration-700 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
                      <h2 
                        className="text-3xl font-light text-gray-900 tracking-wide"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {selectedPlan.plan_name}
                      </h2>
                      <span className="text-sm tracking-wider text-gray-600">
                        {getStatusLabel(selectedPlan.status)}
                      </span>
                    </div>

                    {/* 基本情報 */}
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-sm tracking-wider text-gray-600">DESTINATION</span>
                        <span className="text-gray-900">{selectedPlan.destination}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-sm tracking-wider text-gray-600">BUDGET</span>
                        <span className="text-gray-900">¥{selectedPlan.budget.toLocaleString()}万</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-sm tracking-wider text-gray-600">TIMELINE</span>
                        <span className="text-gray-900">{selectedPlan.timeline || '-'}</span>
                      </div>
                    </div>

                    {/* 費用内訳 */}
                    <div className="mb-8 pb-8 border-b border-gray-200">
                      <h3 className="text-xs tracking-widest text-gray-400 mb-4">BREAKDOWN</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">住居費用</span>
                          <span className="text-gray-900">¥{selectedPlan.housing_cost.toLocaleString()}万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">引越し費用</span>
                          <span className="text-gray-900">¥{selectedPlan.moving_cost.toLocaleString()}万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">緊急資金</span>
                          <span className="text-gray-900">¥{selectedPlan.emergency_fund.toLocaleString()}万</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">月間生活費</span>
                          <span className="text-gray-900">¥{selectedPlan.monthly_expenses.toLocaleString()}万</span>
                        </div>
                      </div>
                    </div>

                    {/* メモ */}
                    {selectedPlan.notes && (
                      <div className="mb-8 pb-8 border-b border-gray-200">
                        <h3 className="text-xs tracking-widest text-gray-400 mb-4">NOTES</h3>
                        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                          {selectedPlan.notes}
                        </p>
                      </div>
                    )}

                    {/* ステータス変更 */}
                    <div className="mb-8">
                      <h3 className="text-xs tracking-widest text-gray-400 mb-4">STATUS</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedPlan.id, 'draft')}
                          className={`py-2 text-sm tracking-wider transition-all ${
                            selectedPlan.status === 'draft'
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-gray-900'
                          }`}
                        >
                          Draft
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedPlan.id, 'in_progress')}
                          className={`py-2 text-sm tracking-wider transition-all ${
                            selectedPlan.status === 'in_progress'
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-gray-900'
                          }`}
                        >
                          Progress
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedPlan.id, 'completed')}
                          className={`py-2 text-sm tracking-wider transition-all ${
                            selectedPlan.status === 'completed'
                              ? 'bg-gray-900 text-white'
                              : 'border border-gray-200 text-gray-600 hover:border-gray-900'
                          }`}
                        >
                          Done
                        </button>
                      </div>
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => handleDelete(selectedPlan.id)}
                      className="w-full py-3 border border-gray-900 text-gray-900 text-sm tracking-widest hover:bg-gray-50 transition-all duration-300"
                    >
                      DELETE
                    </button>

                    {/* 日付 */}
                    <div className="mt-8 pt-8 border-t border-gray-200 text-xs text-gray-500 tracking-wider">
                      <div className="flex justify-between mb-2">
                        <span>Created</span>
                        <span>{formatDate(selectedPlan.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated</span>
                        <span>{formatDate(selectedPlan.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 p-16 text-center">
                    <p className="text-gray-600 tracking-wide">
                      プランを選択してください
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}