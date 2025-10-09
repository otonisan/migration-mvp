'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMessage('');

    setTimeout(() => {
      setStatusMessage('お問い合わせを受け付けました');
      setName('');
      setSubject('');
      setMessage('');
      setSending(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl tracking-wider">Loading...</div>
      </div>
    );
  }

  const faqs = [
    {
      q: '診断結果はどこで確認できますか？',
      a: 'ダッシュボードの「診断履歴」から過去の診断結果をすべて確認できます。'
    },
    {
      q: 'プランは保存できますか？',
      a: 'はい、プランビルダーで作成したプランは自動的に保存され、「保存したプラン」から確認・編集できます。'
    },
    {
      q: 'パスワードを忘れた場合は？',
      a: 'ログインページの「パスワードを忘れた方」リンクからリセット手続きができます。'
    },
    {
      q: '料金プランについて教えてください',
      a: '基本的な診断機能は無料でご利用いただけます。詳細なサポートが必要な場合は有料プランもご用意しています。'
    }
  ];

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
        <div className="max-w-4xl mx-auto">
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
              Support
            </h1>
          </div>

          {/* FAQ */}
          <div 
            className={`mb-16 transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-3xl font-light text-gray-900 mb-8 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              FAQ
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-light text-gray-900 mb-3 tracking-wide">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 tracking-wide leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* お問い合わせフォーム */}
          <div 
            className={`border border-gray-200 p-8 mb-16 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-3xl font-light text-gray-900 mb-8 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Contact
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="お名前"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  SUBJECT
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors"
                  placeholder="お問い合わせの件名"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-widest text-gray-400 mb-3">
                  MESSAGE
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  required
                />
              </div>

              {statusMessage && (
                <div className="p-4 border border-gray-900 text-center text-gray-900">
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-gray-900 text-white text-sm tracking-widest hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

          {/* 連絡先情報 */}
          <div 
            className={`border border-gray-200 p-8 transition-all duration-1000 delay-600 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 
              className="text-2xl font-light text-gray-900 mb-6 tracking-wide"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Other Contact
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm tracking-wider text-gray-600">EMAIL</span>
                <span className="text-gray-900">support@migration-support.com</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm tracking-wider text-gray-600">PHONE</span>
                <span className="text-gray-900">0120-XXX-XXX</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm tracking-wider text-gray-600">HOURS</span>
                <span className="text-gray-900">平日 10:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}