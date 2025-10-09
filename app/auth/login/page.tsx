'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setMessage('ログイン成功！リダイレクト中...');
      router.push('/dashboard');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'ログインに失敗しました');
      } else {
        setMessage('ログインに失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ロゴエリア */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Migration Support
          </h1>
          <p className="text-purple-200">ログイン</p>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* エラー/成功メッセージ */}
            {message && (
              <div className={`p-4 rounded-xl ${message.includes('成功') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              href="/auth/signup"
              className="block text-purple-200 hover:text-white transition-colors"
            >
              アカウントをお持ちでない方はこちら
            </Link>
            <Link
              href="/auth/reset-password"
              className="block text-purple-300 hover:text-white transition-colors text-sm"
            >
              パスワードを忘れた方
            </Link>
          </div>
        </div>

        {/* ホームに戻る */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-purple-200 hover:text-white transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}