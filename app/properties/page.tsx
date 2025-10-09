'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
      <p className="text-emerald-600 font-medium">地図を読み込み中...</p>
    </div>
  ),
});

interface Property {
  id: string;
  title: string;
  prefecture: string;
  city: string;
  rent: number;
  layout: string;
  area: number;
  nearest_station: string;
  station_distance: number;
  features: string[];
  images: string[];
  lat: number;
  lng: number;
}

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState({
    prefecture: '',
    minRent: '',
    maxRent: '',
    layout: '',
  });
  const supabase = createClient();

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('properties').select('*').eq('available', true);

    if (filters.prefecture) {
      query = query.eq('prefecture', filters.prefecture);
    }
    if (filters.minRent) {
      query = query.gte('rent', parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      query = query.lte('rent', parseInt(filters.maxRent));
    }
    if (filters.layout) {
      query = query.eq('layout', filters.layout);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  }, [filters, supabase]);

  useEffect(() => {
    fetchProperties();
    setTimeout(() => setIsVisible(true), 100);
  }, [fetchProperties]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      prefecture: '',
      minRent: '',
      maxRent: '',
      layout: '',
    });
  };

  const handleMarkerClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  const toggleCompare = (propertyId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        if (prev.length >= 4) {
          alert('最大4件まで比較できます');
          return prev;
        }
        return [...prev, propertyId];
      }
    });
  };

  const goToCompare = () => {
    if (compareList.length < 2) {
      alert('2件以上選択してください');
      return;
    }
    router.push(`/properties/compare?ids=${compareList.join(',')}`);
  };

  return (
    <div 
      className="min-h-screen bg-emerald-50 pb-24"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}
    >
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            🏡 MIGRATION
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            ダッシュボード
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div 
            className={`mb-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              🏠 物件検索
            </h1>
            <p className="text-lg font-medium text-gray-700">
              理想の住まいを見つけましょう
            </p>
          </div>

          {/* フィルター */}
          <div 
            className={`bg-white border-2 border-emerald-200 rounded-2xl p-8 mb-12 shadow-lg transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">📍 都道府県</label>
                <select
                  value={filters.prefecture}
                  onChange={(e) => handleFilterChange('prefecture', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
                >
                  <option value="">全て</option>
                  <option value="長野県">長野県</option>
                  <option value="静岡県">静岡県</option>
                  <option value="岡山県">岡山県</option>
                  <option value="福岡県">福岡県</option>
                  <option value="北海道">北海道</option>
                  <option value="沖縄県">沖縄県</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">💰 最低賃料</label>
                <input
                  type="number"
                  value={filters.minRent}
                  onChange={(e) => handleFilterChange('minRent', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="40,000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">💵 最高賃料</label>
                <input
                  type="number"
                  value={filters.maxRent}
                  onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
                  placeholder="100,000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">🏠 間取り</label>
                <select
                  value={filters.layout}
                  onChange={(e) => handleFilterChange('layout', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all bg-white"
                >
                  <option value="">全て</option>
                  <option value="1K">1K</option>
                  <option value="1LDK">1LDK</option>
                  <option value="2DK">2DK</option>
                  <option value="2LDK">2LDK</option>
                  <option value="3DK">3DK</option>
                  <option value="3LDK">3LDK</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={fetchProperties}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                🔍 検索
              </button>
              <button
                onClick={clearFilters}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                クリア
              </button>
            </div>
          </div>

          {/* 表示切替 */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-gray-700 font-medium">
              {loading ? '読み込み中...' : `${properties.length}件の物件`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 font-bold rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                📋 リスト
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 font-bold rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50'
                }`}
              >
                🗺️ 地図
              </button>
            </div>
          </div>

          {/* コンテンツ */}
          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <div className="text-gray-900 text-xl font-bold">読み込み中...</div>
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-16 text-center shadow-lg">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                物件が見つかりませんでした
              </h3>
              <p className="text-gray-700 mb-8 font-medium">
                条件を変更して再度検索してください
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
              >
                フィルターをクリア
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <div className="border-2 border-emerald-200 rounded-2xl overflow-hidden shadow-lg" style={{ height: '600px' }}>
              <PropertyMap properties={properties} onMarkerClick={handleMarkerClick} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <div
                  key={property.id}
                  className={`group bg-white border-2 border-emerald-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-500 relative ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: `${index * 100 + 400}ms`,
                  }}
                >
                  <div className="absolute top-4 left-4 z-20">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleCompare(property.id);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all shadow-lg ${
                        compareList.includes(property.id)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                          : 'bg-white border-2 border-emerald-300 text-emerald-600 hover:border-emerald-500'
                      }`}
                    >
                      {compareList.includes(property.id) ? '✓' : '□'}
                    </button>
                  </div>

                  <Link href={`/properties/${property.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                        ¥{property.rent.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 font-medium">
                        📍 {property.prefecture} {property.city}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b-2 border-emerald-100">
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">間取り</p>
                          <p className="text-gray-900 font-bold">{property.layout}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1">面積</p>
                          <p className="text-gray-900 font-bold">{property.area}m²</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-600 mb-1">最寄り駅</p>
                        <p className="text-sm text-gray-900 font-medium">
                          🚃 {property.nearest_station} 徒歩{property.station_distance}分
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {property.features.slice(0, 3).map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 比較バー */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-200 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="text-gray-900">
              <span className="font-bold text-xl">{compareList.length}</span>
              <span className="ml-2 text-gray-700 font-medium">件選択中</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCompareList([])}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                クリア
              </button>
              <button
                onClick={goToCompare}
                disabled={compareList.length < 2}
                className={`px-8 py-2 font-bold rounded-lg transition-all shadow-lg ${
                  compareList.length >= 2
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                比較する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}