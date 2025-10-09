'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;

      setMessage('パスワードリセットメールを送信しました。メールをご確認ください。');
      setEmail('');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message || 'メール送信に失敗しました');
      } else {
        setMessage('メール送信に失敗しました');
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
          <p className="text-purple-200">パスワードリセット</p>
        </div>

        {/* リセットフォーム */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <p className="text-purple-100 mb-6 text-sm">
            登録したメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
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

            {/* メッセージ */}
            {message && (
              <div className={`p-4 rounded-xl ${message.includes('送信しました') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? '送信中...' : 'リセットメールを送信'}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 space-y-3 text-center">
            <Link
              href="/auth/login"
              className="block text-purple-200 hover:text-white transition-colors"
            >
              ログインページに戻る
            </Link>
            <Link
              href="/auth/signup"
              className="block text-purple-300 hover:text-white transition-colors text-sm"
            >
              新規登録はこちら
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