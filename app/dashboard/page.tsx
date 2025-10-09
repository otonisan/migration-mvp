'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface UserData {
  email: string;
  created_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser({
        email: user.email || '',
        created_at: user.created_at
      });
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    };

    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <div className="text-gray-600 font-medium">読み込み中...</div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { href: '/vibe-map', label: '空気感マップ', desc: '街の雰囲気を可視化', icon: '🗺️', badge: 'NEW', color: 'from-emerald-500 to-teal-500' },
    { href: '/simulator/story', label: '生活ストーリー', desc: 'AI生成の一日体験', icon: '📖', badge: 'AI', color: 'from-teal-500 to-cyan-500' },
    { href: '/diagnostic', label: 'AI診断', desc: '移住診断を開始', icon: '🎯', color: 'from-emerald-600 to-green-600' },
    { href: '/properties/ai-match', label: 'AIおすすめ物件', desc: 'あなたに最適な物件', icon: '🏠', badge: 'AI', color: 'from-green-500 to-emerald-500' },
    { href: '/properties', label: '物件検索', desc: '条件から探す', icon: '🔍', color: 'from-teal-600 to-emerald-600' },
    { href: '/plan-builder', label: 'プラン作成', desc: '移住計画を立てる', icon: '📋', color: 'from-cyan-500 to-teal-500' },
    { href: '/simulator', label: '生活費試算', desc: 'コストを計算', icon: '💰', color: 'from-green-600 to-emerald-600' },
    { href: '/dashboard/history', label: '診断履歴', desc: '過去の結果を確認', icon: '📊', color: 'from-emerald-500 to-teal-500' },
    { href: '/dashboard/saved-plans', label: '保存プラン', desc: 'お気に入りのプラン', icon: '⭐', color: 'from-teal-500 to-cyan-500' },
    { href: '/dashboard/settings', label: '設定', desc: 'アカウント管理', icon: '⚙️', color: 'from-gray-600 to-gray-700' },
    { href: '/dashboard/support', label: 'サポート', desc: 'お問い合わせ', icon: '💬', color: 'from-emerald-600 to-teal-600' },
    { href: '/admin/vibes', label: 'AI空気感算出', desc: '管理者機能', icon: '🤖', color: 'from-purple-600 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}>
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b-2 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              移
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">移住サポート</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium"
          >
            ログアウト
          </button>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* ウェルカムセクション */}
          <div 
            className={`mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                  👋
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">おかえりなさい</h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* メニューグリッド */}
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                {/* グラデーション背景 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                {item.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                    {item.badge}
                  </div>
                )}
                
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl text-3xl mb-4 shadow-lg`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* アカウント情報 */}
          <div 
            className={`max-w-2xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-100 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">アカウント情報</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">メールアドレス</span>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">登録日</span>
                <span className="text-gray-900 font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}