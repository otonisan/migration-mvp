'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'ベーシック',
    price: '9,800',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC!,
    features: [
      '移住診断（無制限）',
      'プランビルダー',
      '診断結果の保存',
      'メールサポート',
      'よくある質問へのアクセス',
    ],
    icon: '📋',
    popular: false,
  },
  {
    name: 'スタンダード',
    price: '29,800',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD!,
    features: [
      'ベーシックの全機能',
      '個別相談（1回）',
      '移住先候補地リサーチ',
      '住居探しサポート',
      '移住支援制度の案内',
      '優先メールサポート',
    ],
    icon: '🎯',
    popular: true,
  },
  {
    name: 'プレミアム',
    price: '49,800',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!,
    features: [
      'スタンダードの全機能',
      '個別相談（3回）',
      '現地視察同行サポート',
      '引越し業者の紹介',
      '移住後フォローアップ（3ヶ月）',
      '24時間チャットサポート',
      '専用コンシェルジュ',
    ],
    icon: '👑',
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    try {
      // チェックアウトセッションを作成
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.error) {
        alert('エラーが発生しました: ' + data.error);
        setLoading(null);
        return;
      }

      // Stripe Checkout URLを取得してリダイレクト
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('決済処理でエラーが発生しました');
      setLoading(null);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 py-12 px-4"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/" className="text-white hover:text-emerald-100 transition-colors font-bold">
            ← ホームに戻る
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            💰 料金プラン
          </h1>
          <p className="text-emerald-50 text-xl font-medium">
            あなたに最適なプランを選んでください
          </p>
        </div>

        {/* プランカード */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular
                  ? 'border-emerald-400 shadow-2xl shadow-emerald-900/50 ring-4 ring-emerald-300'
                  : 'border-emerald-200 shadow-lg'
              }`}
            >
              {/* 人気バッジ */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ 人気No.1
                  </span>
                </div>
              )}

              {/* アイコン */}
              <div className="text-6xl mb-4 text-center">{plan.icon}</div>

              {/* プラン名 */}
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-2">
                {plan.name}
              </h3>

              {/* 価格 */}
              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-gray-900">¥{plan.price}</span>
                <span className="text-gray-600 ml-2 font-medium">（買い切り）</span>
              </div>

              {/* 機能リスト */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-emerald-600 text-xl mt-0.5 font-bold">✓</span>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 購入ボタン */}
              <button
                onClick={() => handleCheckout(plan.priceId)}
                disabled={loading === plan.priceId}
                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  plan.popular
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.priceId ? '処理中...' : `${plan.name}を購入`}
              </button>
            </div>
          ))}
        </div>

        {/* 注意事項 */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border-2 border-emerald-200 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            ℹ️ ご購入前にご確認ください
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="font-medium">すべてのプランは買い切り型です（月額料金は発生しません）</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="font-medium">お支払いはクレジットカードのみ対応しています</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="font-medium">決済はStripeの安全なシステムで処理されます</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="font-medium">購入後すぐにサービスをご利用いただけます</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-600 font-bold">✓</span>
              <span className="font-medium">返金保証: 7日以内であれば全額返金いたします</span>
            </li>
          </ul>
        </div>

        {/* お問い合わせ */}
        <div className="text-center mt-12">
          <p className="text-emerald-50 font-medium mb-4">
            プランについてのご質問がありますか？
          </p>
          <Link 
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  );
}