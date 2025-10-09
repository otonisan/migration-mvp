'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { BarChart3, Download, Calendar, Users, TrendingUp, Filter } from 'lucide-react';

interface Diagnostic {
  id: string;
  user_id: string;
  answers: Record<string, string | number | boolean>;
  scores: {
    education: number;
    medical: number;
    income: number;
    community: number;
    mobility: number;
  };
  created_at: string;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  avgScores: {
    education: number;
    medical: number;
    income: number;
    community: number;
    mobility: number;
  };
}

export default function AdminDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchDiagnostics();
    };
    init();
  }, [dateFilter]);

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

  const fetchDiagnostics = async () => {
    try {
      let query = supabase
        .from('diagnostics')
        .select('*')
        .order('created_at', { ascending: false });

      // 日付フィルター
      if (dateFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query = query.gte('created_at', weekAgo.toISOString());
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        query = query.gte('created_at', monthAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setDiagnostics(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('診断データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Diagnostic[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = data.filter(d => new Date(d.created_at) >= today).length;
    const weekCount = data.filter(d => new Date(d.created_at) >= weekAgo).length;
    const monthCount = data.filter(d => new Date(d.created_at) >= monthAgo).length;

    // 平均スコア計算
    const avgScores = {
      education: 0,
      medical: 0,
      income: 0,
      community: 0,
      mobility: 0,
    };

    if (data.length > 0) {
      data.forEach(d => {
        if (d.scores) {
          avgScores.education += d.scores.education || 0;
          avgScores.medical += d.scores.medical || 0;
          avgScores.income += d.scores.income || 0;
          avgScores.community += d.scores.community || 0;
          avgScores.mobility += d.scores.mobility || 0;
        }
      });

      avgScores.education = Math.round(avgScores.education / data.length);
      avgScores.medical = Math.round(avgScores.medical / data.length);
      avgScores.income = Math.round(avgScores.income / data.length);
      avgScores.community = Math.round(avgScores.community / data.length);
      avgScores.mobility = Math.round(avgScores.mobility / data.length);
    }

    setStats({
      total: data.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      avgScores,
    });
  };

  const exportToCSV = () => {
    if (diagnostics.length === 0) {
      alert('エクスポートするデータがありません');
      return;
    }

    const headers = ['ID', '実施日', '教育', '医療', '収入', '地域', '交通'];
    const rows = diagnostics.map(d => [
      d.id,
      new Date(d.created_at).toLocaleDateString('ja-JP'),
      d.scores?.education || 0,
      d.scores?.medical || 0,
      d.scores?.income || 0,
      d.scores?.community || 0,
      d.scores?.mobility || 0,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `diagnostics_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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
            <BarChart3 className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">診断データ</h1>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            <Download className="w-5 h-5" />
            CSVエクスポート
          </button>
        </div>

        {/* フィルター */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">期間フィルター:</span>
            <div className="flex gap-2">
              {['all', 'today', 'week', 'month'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    dateFilter === filter
                      ? 'bg-white text-purple-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {filter === 'all' ? '全期間' : filter === 'today' ? '今日' : filter === 'week' ? '今週' : '今月'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 統計カード */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6 text-blue-300" />
                <p className="text-white/80">総診断数</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-green-300" />
                <p className="text-white/80">今日</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.today}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-yellow-300" />
                <p className="text-white/80">今週</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.thisWeek}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-pink-300" />
                <p className="text-white/80">今月</p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.thisMonth}</p>
            </div>
          </div>
        )}

        {/* 平均スコアグラフ */}
        {stats && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">平均スコア</h2>
            <div className="space-y-4">
              {Object.entries(stats.avgScores).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-white mb-2">
                    <span className="font-medium">
                      {key === 'education' ? '教育環境' :
                       key === 'medical' ? '医療アクセス' :
                       key === 'income' ? '収入見込み' :
                       key === 'community' ? '地域コミュニティ' : '交通利便性'}
                    </span>
                    <span className="font-bold">{value}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 診断一覧 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">診断履歴</h2>
          {diagnostics.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              診断データがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/80 border-b border-white/20">
                    <th className="text-left py-3 px-4">実施日</th>
                    <th className="text-left py-3 px-4">教育</th>
                    <th className="text-left py-3 px-4">医療</th>
                    <th className="text-left py-3 px-4">収入</th>
                    <th className="text-left py-3 px-4">地域</th>
                    <th className="text-left py-3 px-4">交通</th>
                    <th className="text-left py-3 px-4">平均</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnostics.map((diagnostic) => {
                    const scores = diagnostic.scores || {};
                    const avg = Math.round(
                      ((scores.education || 0) +
                        (scores.medical || 0) +
                        (scores.income || 0) +
                        (scores.community || 0) +
                        (scores.mobility || 0)) / 5
                    );

                    return (
                      <tr key={diagnostic.id} className="text-white border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4">
                          {new Date(diagnostic.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                            {scores.education || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                            {scores.medical || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-medium">
                            {scores.income || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-medium">
                            {scores.community || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                            {scores.mobility || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold">
                            {avg}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}