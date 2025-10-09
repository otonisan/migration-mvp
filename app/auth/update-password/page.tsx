'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // パスワード確認
    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません');
      setLoading(false);
      return;
    }

    // パスワード長チェック
    if (password.length < 6) {
      setMessage('パスワードは6文字以上で設定してください');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage('パスワードを更新しました！ログインページに移動します...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'パスワード更新に失敗しました');
      } else {
        setMessage('パスワード更新に失敗しました');
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
          <p className="text-purple-200">新しいパスワード設定</p>
        </div>

        {/* パスワード更新フォーム */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {/* 新しいパスワード */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                新しいパスワード（6文字以上）
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

            {/* パスワード確認 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* メッセージ */}
            {message && (
              <div className={`p-4 rounded-xl ${message.includes('更新しました') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            {/* 更新ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '更新中...' : 'パスワードを更新'}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-purple-200 hover:text-white transition-colors text-sm"
            >
              ログインページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}