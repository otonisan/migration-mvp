'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState('diagnostic');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}>
      
      {/* ヒーロー + 検索セクション */}
      <section 
        className="relative text-white py-32 overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.9) 50%, rgba(20, 184, 166, 0.95) 100%), url(https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* 動くグラデーション背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 animate-pulse"></div>
        
        {/* パーティクル風の装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-12 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-7xl animate-bounce">🍒</span>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-2">
                  山形で、新しい暮らしを
                </h1>
                <div className="h-1 w-32 bg-gradient-to-r from-white to-transparent rounded-full"></div>
              </div>
            </div>
            <p className="text-2xl text-emerald-50 leading-relaxed font-light">
              温泉、自然、歴史。AIがあなたにぴったりの山形エリアを提案します
            </p>
          </div>

          {/* 検索ボックス */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-0 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              {[
                { id: 'diagnostic', label: '診断', icon: '🎯' },
                { id: 'vibe', label: '空気感', icon: '🗺️' },
                { id: 'properties', label: '物件', icon: '🏠' },
                { id: 'simulator', label: '生活費', icon: '💰' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 px-6 py-5 font-bold transition-all duration-300 transform ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-105 shadow-lg'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/50 hover:scale-102'
                  }`}
                >
                  <div className="text-3xl mb-2 transform transition-transform group-hover:scale-110">{tab.icon}</div>
                  <div className="text-sm font-semibold">{tab.label}</div>
                </button>
              ))}
            </div>

            <div className="p-8">
              {selectedTab === 'diagnostic' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    山形移住AI診断を始める
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    簡単な質問に答えるだけで、あなたに最適な山形のエリアをAIが提案します
                  </p>
                  <Link
                    href="/diagnostic"
                    className="block w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10">今すぐ診断を始める →</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </Link>
                </div>
              )}

              {selectedTab === 'vibe' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    山形の街の空気感を可視化
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    温泉、子育て、農業など8種類の空気感で、住む前に街の雰囲気を体験
                  </p>
                  <Link
                    href="/vibe-map"
                    className="block w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10">空気感マップを見る →</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </Link>
                </div>
              )}

              {selectedTab === 'properties' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    山形の物件を探す
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="山形市、天童市など"
                      className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 transition-all"
                    />
                    <input
                      type="text"
                      placeholder="予算"
                      className="px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 transition-all"
                    />
                  </div>
                  <Link
                    href="/properties"
                    className="block w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10">物件を検索 →</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </Link>
                </div>
              )}

              {selectedTab === 'simulator' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    山形での生活費シミュレーター
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    山形での生活費を事前に計算できます
                  </p>
                  <Link
                    href="/simulator"
                    className="block w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white text-center rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative overflow-hidden group"
                  >
                    <span className="relative z-10">シミュレーターを使う →</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 波のSVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* 人気のエリア */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">山形の人気エリア</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
                title: '山形市城西エリア',
                desc: '静かな住宅街、子育て環境◎',
                tags: ['♨️ 温泉', '👨‍👩‍👧‍👦 ファミリー'],
              },
              {
                image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80',
                title: '七日町エリア',
                desc: '歴史とアートの街',
                tags: ['🏯 歴史', '✨ 活気'],
              },
              {
                image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80',
                title: '天童温泉エリア',
                desc: '温泉と果樹園のまち',
                tags: ['♨️ 温泉', '🍒 果樹園'],
              },
            ].map((area, index) => (
              <Link
                key={index}
                href="/vibe-map"
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 group relative"
              >
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <img 
                    src={area.image} 
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{area.desc}</p>
                  <div className="flex gap-2 flex-wrap">
                    {area.tags.map((tag, i) => (
                      <span key={i} className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 text-sm rounded-full font-medium shadow-sm">
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
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">人気の機能</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'AI診断',
                desc: '最適なエリアを提案',
                href: '/diagnostic',
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                icon: '🗺️',
                title: '空気感マップ',
                desc: '街の雰囲気を可視化',
                href: '/vibe-map',
                gradient: 'from-teal-500 to-cyan-500',
                badge: 'NEW',
              },
              {
                icon: '💬',
                title: 'チャット',
                desc: '移住者同士で交流',
                href: '/chat',
                gradient: 'from-blue-500 to-indigo-500',
                badge: 'NEW',
              },
              {
                icon: '👥',
                title: 'コミュニティ',
                desc: '地域の情報を共有',
                href: '/community',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: '📖',
                title: '生活ストーリー',
                desc: 'AI生成の一日体験',
                href: '/simulator/story',
                gradient: 'from-cyan-500 to-blue-500',
                badge: 'AI',
              },
              {
                icon: '💰',
                title: '生活費試算',
                desc: '実際の費用を計算',
                href: '/simulator',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: '🏠',
                title: '物件検索',
                desc: '理想の家を見つける',
                href: '/properties',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: '🏔️',
                title: 'プランビルダー',
                desc: '移住計画を立てる',
                href: '/plan-builder',
                gradient: 'from-indigo-500 to-purple-500',
              },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 group relative overflow-hidden"
              >
                {/* グラデーション背景（ホバー時） */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {item.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {item.badge}
                  </span>
                )}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                
                {/* 下線アニメーション */}
                <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${item.gradient} mt-4 rounded-full transition-all duration-500`}></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 体験談・レビュー */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">山形移住者の声</h2>
            <p className="text-gray-600 text-lg">実際に山形に移住された方の体験談</p>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
                name: '田中さん (30代女性)',
                location: '東京 → 山形市',
                text: 'AI診断で提案された山形市に移住。温泉も近く、子育て環境も良く、生活費も抑えられて大満足です。',
                rating: 5,
              },
              {
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                name: '佐藤さん (40代男性)',
                location: '大阪 → 天童市',
                text: '空気感マップで街の雰囲気を事前に確認できたのが良かった。果樹園に囲まれた暮らしが最高です。',
                rating: 5,
              },
              {
                image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                name: '鈴木さん (20代女性)',
                location: '神奈川 → 七日町',
                text: 'リモートワークで山形へ。歴史ある街並みとカフェ文化が気に入ってます。生活ストーリー機能が役立ちました。',
                rating: 5,
              },
            ].map((review, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 relative overflow-hidden group">
                {/* グラデーション背景 */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-100"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      ✓
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.location}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
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
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-teal-50"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">かんたん3ステップ</h2>
            <p className="text-gray-600 text-lg">誰でも簡単に山形移住計画を立てられます</p>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* 接続線（デスクトップのみ） */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-1 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200"></div>
            
            {[
              { num: '1', title: '診断を受ける', desc: '簡単な質問に答えるだけ', icon: '📝', gradient: 'from-emerald-500 to-teal-500' },
              { num: '2', title: 'エリアを探す', desc: 'AIがおすすめを提案', icon: '🔍', gradient: 'from-teal-500 to-cyan-500' },
              { num: '3', title: '計画を立てる', desc: '生活費や物件を確認', icon: '✅', gradient: 'from-cyan-500 to-blue-500' },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${step.gradient} text-white rounded-full text-3xl font-bold mb-6 shadow-2xl relative z-10 transform hover:scale-110 transition-transform`}>
                  {step.num}
                </div>
                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform">{step.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 料金プラン */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">料金プラン</h2>
            <p className="text-gray-600 text-lg">買い切り型で追加費用なし</p>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: 'ベーシック', price: '9,800', features: ['山形移住診断', 'プランビルダー', 'メールサポート'], gradient: 'from-gray-500 to-gray-600' },
              { name: 'スタンダード', price: '29,800', features: ['ベーシック機能', '個別相談1回', 'リサーチ'], popular: true, gradient: 'from-emerald-500 to-teal-500' },
              { name: 'プレミアム', price: '49,800', features: ['スタンダード機能', '個別相談3回', 'コンシェルジュ'], gradient: 'from-purple-500 to-pink-500' },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 ${
                  plan.popular ? 'ring-4 ring-emerald-500 shadow-2xl transform scale-105' : 'shadow-xl'
                } relative hover:shadow-2xl transition-all transform hover:-translate-y-2`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-8 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg">
                    ⭐ 人気No.1
                  </div>
                )}
                <div className={`h-2 w-full bg-gradient-to-r ${plan.gradient} rounded-full mb-6`}></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-8">
                  <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">¥{plan.price}</span>
                  <span className="text-gray-600 text-sm ml-2">買い切り</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className={`flex-shrink-0 w-6 h-6 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center`}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`block w-full py-4 text-center rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white`
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  選択する →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section 
        className="relative py-32 px-6 text-white overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.97) 0%, rgba(5, 150, 105, 0.95) 50%, rgba(20, 184, 166, 0.97) 100%), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* 動くグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-teal-500/30 animate-pulse"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-7xl mb-8 animate-bounce">🍒</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">山形での新しい生活を<br />始めましょう</h2>
          <p className="text-2xl text-emerald-50 mb-12 leading-relaxed">無料診断で理想の山形エリアを見つけよう</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/diagnostic"
              className="px-12 py-5 bg-white text-emerald-600 rounded-2xl hover:bg-gray-50 transition-all font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 relative overflow-hidden group"
            >
              <span className="relative z-10">無料診断を始める</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <Link
              href="/auth/signup"
              className="px-12 py-5 bg-transparent border-4 border-white text-white rounded-2xl hover:bg-white/10 transition-all font-bold text-xl backdrop-blur-sm transform hover:-translate-y-2"
            >
              会員登録
            </Link>
          </div>
        </div>

        {/* パーティクル */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">山</div>
                <span className="font-bold text-xl">山形移住ナビ</span>
              </div>
              <p className="text-gray-400 leading-relaxed">山形での暮らしを、もっと身近に</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">サービス</h4>
              <div className="space-y-3">
                <Link href="/vibe-map" className="block text-gray-400 hover:text-white transition-colors">空気感マップ</Link>
                <Link href="/diagnostic" className="block text-gray-400 hover:text-white transition-colors">診断</Link>
                <Link href="/properties" className="block text-gray-400 hover:text-white transition-colors">物件検索</Link>
                <Link href="/simulator" className="block text-gray-400 hover:text-white transition-colors">シミュレーター</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">サポート</h4>
              <div className="space-y-3">
                <Link href="/dashboard/support" className="block text-gray-400 hover:text-white transition-colors">お問い合わせ</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition-colors">料金</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">アカウント</h4>
              <div className="space-y-3">
                <Link href="/auth/login" className="block text-gray-400 hover:text-white transition-colors">ログイン</Link>
                <Link href="/auth/signup" className="block text-gray-400 hover:text-white transition-colors">会員登録</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © 2025 山形移住ナビ. All rights reserved.
              </div>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}