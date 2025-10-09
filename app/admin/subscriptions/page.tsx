'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { CreditCard, DollarSign, TrendingUp, Calendar, User, CheckCircle, XCircle } from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_type: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

interface SubscriptionStats {
  total: number;
  active: number;
  canceled: number;
  trial: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchSubscriptions();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmails = ['youyangg1@gmail.com'];
      
      if (!session || !session.user) {
        alert('ログインしてください');
        router.push('/login');
        return;
      }
      
      if (!adminEmails.includes(session.user.email || '')) {
        alert('管理者権限がありません');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('認証エラー:', error);
      router.push('/login');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      let query = supabase
        .from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;

      setSubscriptions(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('サブスクリプション取得エラー:', error);
      setSubscriptions([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Subscription[]) => {
    const active = data.filter(s => s.status === 'active').length;
    const canceled = data.filter(s => s.status === 'canceled').length;
    const trial = data.filter(s => s.status === 'trialing').length;

    // 月額収益の概算（プランタイプによって異なる）
    const monthlyRevenue = data
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        if (s.plan_type === 'premium_monthly') return sum + 980;
        if (s.plan_type === 'premium_yearly') return sum + 9800 / 12;
        return sum;
      }, 0);

    const yearlyRevenue = monthlyRevenue * 12;

    setStats({
      total: data.length,
      active,
      canceled,
      trial,
      monthlyRevenue: Math.round(monthlyRevenue),
      yearlyRevenue: Math.round(yearlyRevenue),
    });
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('このサブスクリプションをキャンセルしますか？')) return;

    try {
      // 実際のStripe APIを使う場合はバックエンドAPIを呼び出す
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          cancel_at_period_end: true 
        })
        .eq('id', subscriptionId);

      if (error) throw error;
      alert('サブスクリプションをキャンセルしました');
      fetchSubscriptions();
    } catch (error) {
      console.error('キャンセルエラー:', error);
      alert('キャンセルに失敗しました');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'canceled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'trialing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'past_due':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '有効';
      case 'canceled':
        return 'キャンセル済';
      case 'trialing':
        return 'トライアル';
      case 'past_due':
        return '支払い遅延';
      default:
        return status;
    }
  };

  const getPlanText = (planType: string) => {
    switch (planType) {
      case 'premium_monthly':
        return '月額プラン';
      case 'premium_yearly':
        return '年額プラン';
      default:
        return planType;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">サブスク管理</h1>
          </div>
        </div>

        {/* 統計カード */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-6 h-6 text-blue-300" />
                <p className="text-white/80 text-sm">総数</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-300" />
                <p className="text-white/80 text-sm">有効</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.active}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-300" />
                <p className="text-white/80 text-sm">解約</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.canceled}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-blue-300" />
                <p className="text-white/80 text-sm">試用中</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.trial}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-yellow-300" />
                <p className="text-white/80 text-sm">月額収益</p>
              </div>
              <p className="text-2xl font-bold text-white">¥{stats.monthlyRevenue.toLocaleString()}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-pink-300" />
                <p className="text-white/80 text-sm">年間予測</p>
              </div>
              <p className="text-2xl font-bold text-white">¥{stats.yearlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* フィルター */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">ステータス:</span>
            <div className="flex gap-2">
              {['all', 'active', 'trialing', 'canceled', 'past_due'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-white text-purple-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {status === 'all' ? '全て' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* サブスク一覧 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">サブスクリプション一覧</h2>
          {subscriptions.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              サブスクリプションが見つかりません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/80 border-b border-white/20">
                    <th className="text-left py-3 px-4">ユーザーID</th>
                    <th className="text-left py-3 px-4">プラン</th>
                    <th className="text-left py-3 px-4">ステータス</th>
                    <th className="text-left py-3 px-4">開始日</th>
                    <th className="text-left py-3 px-4">終了日</th>
                    <th className="text-left py-3 px-4">自動更新</th>
                    <th className="text-right py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="text-white border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-white/60" />
                          <span className="font-mono text-sm">{sub.user_id.slice(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                          {getPlanText(sub.plan_type)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(sub.status)}`}>
                          {getStatusText(sub.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(sub.current_period_start).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(sub.current_period_end).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="py-3 px-4">
                        {sub.cancel_at_period_end ? (
                          <span className="text-red-300">❌ OFF</span>
                        ) : (
                          <span className="text-green-300">✅ ON</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          {sub.status === 'active' && !sub.cancel_at_period_end && (
                            <button
                              onClick={() => handleCancelSubscription(sub.id)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm font-medium"
                            >
                              キャンセル
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}