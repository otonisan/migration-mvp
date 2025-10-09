'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalDiagnostics: number;
  totalSubscriptions: number;
  todayDiagnostics: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const adminEmails = ['youyangg1@gmail.com'];
    
    if (!adminEmails.includes(user.email || '')) {
      alert('管理者権限がありません');
      router.push('/dashboard');
      return;
    }

    setIsAdmin(true);
    loadStats();
  };

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [users, properties, diagnostics, todayDiag, subscriptions] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('diagnostic_results').select('id', { count: 'exact', head: true }),
        supabase.from('diagnostic_results').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalUsers: users.count || 0,
        totalProperties: properties.count || 0,
        totalDiagnostics: diagnostics.count || 0,
        todayDiagnostics: todayDiag.count || 0,
        totalSubscriptions: subscriptions.count || 0,
      });
    } catch (error) {
      console.error('統計取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-purple-300 hover:text-purple-100 mb-4 inline-block">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">🔧 管理者ダッシュボード</h1>
          <p className="text-xl text-purple-200">システム全体の管理と統計</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-purple-200 mb-2">総ユーザー数</p>
            <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">🏠</div>
            <p className="text-purple-200 mb-2">総物件数</p>
            <p className="text-4xl font-bold text-white">{stats?.totalProperties || 0}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-purple-200 mb-2">診断実施数</p>
            <p className="text-4xl font-bold text-white">{stats?.totalDiagnostics || 0}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-purple-200 mb-2">今日の診断</p>
            <p className="text-4xl font-bold text-white">{stats?.todayDiagnostics || 0}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-2">💳</div>
            <p className="text-purple-200 mb-2">有料会員数</p>
            <p className="text-4xl font-bold text-white">{stats?.totalSubscriptions || 0}</p>
          </div>
        </div>

        {/* 管理メニュー */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/properties">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-white mb-3">物件管理</h3>
              <p className="text-purple-200 mb-4">
                物件の追加・編集・削除
              </p>
              <span className="text-purple-300 font-semibold">
                管理する →
              </span>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-white mb-3">ユーザー管理</h3>
              <p className="text-purple-200 mb-4">
                ユーザー一覧・権限管理
              </p>
              <span className="text-purple-300 font-semibold">
                管理する →
              </span>
            </div>
          </Link>

          <Link href="/admin/diagnostics">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-3">診断データ</h3>
              <p className="text-purple-200 mb-4">
                診断結果の分析・統計
              </p>
              <span className="text-purple-300 font-semibold">
                分析する →
              </span>
            </div>
          </Link>

          <Link href="/admin/subscriptions">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-2xl font-bold text-white mb-3">サブスク管理</h3>
              <p className="text-purple-200 mb-4">
                有料会員の管理・売上確認
              </p>
              <span className="text-purple-300 font-semibold">
                管理する →
              </span>
            </div>
          </Link>

          <Link href="/admin/inquiries">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-2xl font-bold text-white mb-3">お問い合わせ</h3>
              <p className="text-purple-200 mb-4">
                お問い合わせ一覧・対応状況
              </p>
              <span className="text-purple-300 font-semibold">
                確認する →
              </span>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition cursor-pointer border border-white/20 h-full">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold text-white mb-3">システム設定</h3>
              <p className="text-purple-200 mb-4">
                全体設定・メンテナンス
              </p>
              <span className="text-purple-300 font-semibold">
                設定する →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}