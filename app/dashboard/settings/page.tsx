'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);
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

      setEmail(user.email || '');
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    };

    checkUser();
  }, [router, supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('パスワードが一致しません');
      setUpdating(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('パスワードは6文字以上で設定してください');
      setUpdating(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage('パスワードを更新しました');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'パスワード更新に失敗しました');
      } else {
        setMessage('パスワード更新に失敗しました');
      }
    } finally {
      setUpdating(false);
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
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="pt-32 pb-24 px-8">
        <div className="max-w-3xl mx-auto">
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
              Settings
            </h1>
          </div>

          {/* メールアドレス */}
          <div 
            className={`border border-gray-200 p-8 mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-2xl font-light text-gray-900 mb-6 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Email
            </h2>
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-4">
              <span className="text-sm tracking-wider text-gray-600">ADDRESS</span>
              <span className="text-gray-900 tracking-wide">{email}</span>
            </div>
            <p className="text-sm text-gray-500 tracking-wide">
              メールアドレスの変更は現在サポートされていません
            </p>
          </div>

          {/* パスワード変更 */}
          <div 
            className={`border border-gray-200 p-8 mb-6 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-2xl font-light text-gray-900 mb-8 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Password
            </h2>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="6文字以上"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="再入力"
                />
              </div>

              {message && (
                <div className={`p-4 border text-center ${
                  message.includes('更新しました') 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-gray-300 text-gray-600'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={updating || !newPassword || !confirmPassword}
                className="w-full py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          </div>

          {/* アカウント削除 */}
          <div 
            className={`border border-gray-900 p-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-2xl font-light text-gray-900 mb-4 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Danger Zone
            </h2>
            <p className="text-gray-600 mb-6 tracking-wide leading-relaxed">
              アカウントを削除すると、すべてのデータが失われます。<br />
              この操作は取り消せません。
            </p>
            <button
              className="w-full py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-gray-800 transition-all duration-300"
              onClick={() => alert('アカウント削除機能は現在準備中です')}
            >
              DELETE ACCOUNT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}