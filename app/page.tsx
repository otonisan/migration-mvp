'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('diagnostic');

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}>
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-emerald-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                移
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">移住サポート</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/vibe-map" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                空気感マップ
              </Link>
              <Link href="/properties" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                物件
              </Link>
              <Link href="/simulator" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                シミュレーター
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                料金
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                ログイン
              </Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md hover:shadow-lg font-medium">
                会員登録
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーロー + 検索セクション */}
      <section 
        className="relative text-white py-20"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.85) 50%, rgba(20, 184, 166, 0.9) 100%), url(https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              理想の移住先を見つけよう
            </h1>
            <p className="text-xl text-blue-50">
              AI診断で、あなたにぴったりの地域をご提案します
            </p>
          </div>

          {/* 検索ボックス */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-emerald-100">
            <div className="flex gap-0 border-b-2 border-gray-100">
              {[
                { id: 'diagnostic', label: '診断', icon: '🎯' },
                { id: 'vibe', label: '空気感', icon: '🗺️' },
                { id: 'properties', label: '物件', icon: '🏠' },
                { id: 'simulator', label: '生活費', icon: '💰' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-bold transition-all ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-b from-emerald-50 to-white text-emerald-600 border-b-3 border-emerald-500'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{tab.icon}</div>
                  <div className="text-sm">{tab.label}</div>
                </button>
              ))}
            </div>

            <div className="p-6">
              {selectedTab === 'diagnostic' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    AI移住診断を始める
                  </h3>
                  <p className="text-gray-600 mb-6">
                    簡単な質問に答えるだけで、あなたに最適な移住先をAIが提案します
                  </p>
                  <Link
                    href="/diagnostic"
                    className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    今すぐ診断を始める →
                  </Link>
                </div>
              )}

              {selectedTab === 'vibe' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    街の空気感を可視化
                  </h3>
                  <p className="text-gray-600 mb-6">
                    10種類の空気感で、住む前に街の雰囲気を体験できます
                  </p>
                  <Link
                    href="/vibe-map"
                    className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    空気感マップを見る →
                  </Link>
                </div>
              )}

              {selectedTab === 'properties' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    物件を探す
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="エリア名"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="予算"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <Link
                    href="/properties"
                    className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    物件を検索 →
                  </Link>
                </div>
              )}

              {selectedTab === 'simulator' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    生活費シミュレーター
                  </h3>
                  <p className="text-gray-600 mb-6">
                    移住先での生活費を事前に計算できます
                  </p>
                  <Link
                    href="/simulator"
                    className="block w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    シミュレーターを使う →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 人気のエリア */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">人気の移住先エリア</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
                title: '山形市城西エリア',
                desc: '静かな住宅街、子育て環境◎',
                tags: ['自然豊か', '子育て'],
              },
              {
                image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80',
                title: '七日町エリア',
                desc: '歴史とアートの街',
                tags: ['文化', 'カフェ'],
              },
              {
                image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80',
                title: '霞城公園周辺',
                desc: '緑豊かな公園の近く',
                tags: ['公園', 'ファミリー'],
              },
            ].map((area, index) => (
              <Link
                key={index}
                href="/vibe-map"
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition-all group"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{area.desc}</p>
                  <div className="flex gap-2">
                    {area.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 人気の機能 */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">人気の機能</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'AI診断',
                desc: '最適な地域を提案',
                href: '/diagnostic',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: '🗺️',
                title: '空気感マップ',
                desc: '街の雰囲気を可視化',
                href: '/vibe-map',
                color: 'bg-teal-50 text-teal-600',
                badge: 'NEW',
              },
              {
                icon: '📖',
                title: '生活ストーリー',
                desc: 'AI生成の一日体験',
                href: '/simulator/story',
                color: 'bg-cyan-50 text-cyan-600',
                badge: 'AI',
              },
              {
                icon: '💰',
                title: '生活費試算',
                desc: '実際の費用を計算',
                href: '/simulator',
                color: 'bg-green-50 text-green-600',
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition-all group relative"
              >
                {item.badge && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    {item.badge}
                  </span>
                )}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${item.color} text-3xl mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 体験談・レビュー */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">移住者の声</h2>
          <p className="text-gray-600 text-center mb-12">実際に移住された方の体験談</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                name: '田中さん (30代女性)',
                location: '東京 → 山形市',
                text: 'AI診断で提案された山形市に移住。子育て環境が良く、生活費も抑えられて大満足です。',
                rating: 5,
              },
              {
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                name: '佐藤さん (40代男性)',
                location: '大阪 → 天童市',
                text: '空気感マップで街の雰囲気を事前に確認できたのが良かった。イメージ通りの暮らしができています。',
                rating: 5,
              },
              {
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                name: '鈴木さん (20代女性)',
                location: '神奈川 → 七日町',
                text: 'リモートワークなので地方へ。生活ストーリー機能で一日の流れをイメージできて助かりました。',
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={review.image} 
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.location}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">かんたん3ステップ</h2>
          <p className="text-gray-600 text-center mb-12">誰でも簡単に移住計画を立てられます</p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '1', title: '診断を受ける', desc: '簡単な質問に答えるだけ', icon: '📝' },
              { num: '2', title: '地域を探す', desc: 'AIがおすすめを提案', icon: '🔍' },
              { num: '3', title: '計画を立てる', desc: '生活費や物件を確認', icon: '✅' },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                  {step.num}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-6 text-2xl text-gray-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">料金プラン</h2>
          <p className="text-gray-600 text-center mb-12">買い切り型で追加費用なし</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'ベーシック', price: '9,800', features: ['移住診断', 'プランビルダー', 'メールサポート'] },
              { name: 'スタンダード', price: '29,800', features: ['ベーシック機能', '個別相談1回', 'リサーチ'], popular: true },
              { name: 'プレミアム', price: '49,800', features: ['スタンダード機能', '個別相談3回', 'コンシェルジュ'] },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 ${
                  plan.popular ? 'ring-4 ring-emerald-500 shadow-2xl transform scale-105' : 'shadow-lg'
                } relative hover:shadow-xl transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold rounded-full shadow-lg">
                    人気No.1
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">¥{plan.price}</span>
                  <span className="text-gray-600 text-sm ml-2">買い切り</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`block w-full py-3 text-center rounded-xl font-bold transition-all shadow-md hover:shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  選択する
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="relative py-24 px-6 text-white"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.9) 50%, rgba(20, 184, 166, 0.95) 100%), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">今すぐ始めましょう</h2>
          <p className="text-xl text-emerald-50 mb-8">無料診断で理想の移住先を見つけよう</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/diagnostic"
              className="px-10 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-lg shadow-2xl hover:shadow-3xl"
            >
              無料診断を始める
            </Link>
            <Link
              href="/auth/signup"
              className="px-10 py-4 bg-transparent border-3 border-white text-white rounded-xl hover:bg-white/10 transition-all font-bold text-lg"
            >
              会員登録
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center font-bold text-white shadow-md">移</div>
                <span className="font-bold">移住サポート</span>
              </div>
              <p className="text-gray-400 text-sm">地方移住を、もっと身近に</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">サービス</h4>
              <div className="space-y-2 text-sm">
                <Link href="/vibe-map" className="block text-gray-400 hover:text-white">空気感マップ</Link>
                <Link href="/diagnostic" className="block text-gray-400 hover:text-white">診断</Link>
                <Link href="/properties" className="block text-gray-400 hover:text-white">物件検索</Link>
                <Link href="/simulator" className="block text-gray-400 hover:text-white">シミュレーター</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">サポート</h4>
              <div className="space-y-2 text-sm">
                <Link href="/dashboard/support" className="block text-gray-400 hover:text-white">お問い合わせ</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">料金</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">アカウント</h4>
              <div className="space-y-2 text-sm">
                <Link href="/auth/login" className="block text-gray-400 hover:text-white">ログイン</Link>
                <Link href="/auth/signup" className="block text-gray-400 hover:text-white">会員登録</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2025 移住サポート. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}