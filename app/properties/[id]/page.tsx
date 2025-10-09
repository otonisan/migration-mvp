'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

interface Property {
  id: string;
  title: string;
  prefecture: string;
  city: string;
  address: string;
  rent: number;
  management_fee: number;
  deposit: number;
  key_money: number;
  layout: string;
  area: number;
  floor: number;
  building_age: number;
  nearest_station: string;
  station_distance: number;
  features: string[];
  description: string;
  images: string[];
  lat: number;
  lng: number;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const supabase = createClient();

  const fetchProperty = useCallback(async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      router.push('/properties');
    } else {
      setProperty(data);
    }
    setLoading(false);
  }, [params.id, router, supabase]);

  const checkFavorite = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('favorite_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', params.id)
      .single();

    setIsFavorite(!!data);
  }, [params.id, supabase]);

  useEffect(() => {
    fetchProperty();
    checkFavorite();
  }, [fetchProperty, checkFavorite]);

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('お気に入りに追加するにはログインが必要です');
      router.push('/auth/login');
      return;
    }

    setFavoriteLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorite_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', params.id);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from('favorite_properties')
        .insert({
          user_id: user.id,
          property_id: params.id,
        });

      if (!error) {
        setIsFavorite(true);
      }
    }

    setFavoriteLoading(false);
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const totalInitialCost = property.rent + property.management_fee + property.deposit + property.key_money;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors">
              Migration Support
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/properties" className="text-purple-200 hover:text-white transition-colors">
            ← 物件一覧に戻る
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 mb-8">
          <div className="relative h-96">
            <Image
              src={property.images[currentImageIndex] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              fill
              className="object-cover"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </>
            )}

            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all disabled:opacity-50"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          {property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {property.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-purple-400' : 'border-white/20'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${property.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-4">{property.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-purple-200">
                  📍 {property.prefecture} {property.city} {property.address}
                </p>
                <Link
                  href={`/regions/${encodeURIComponent(property.city)}`}
                  className="text-purple-300 hover:text-purple-100 underline text-sm"
                >
                  → この地域について詳しく見る
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-1">家賃</p>
                  <p className="text-3xl font-bold text-white">¥{property.rent.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-1">管理費</p>
                  <p className="text-2xl font-bold text-white">¥{property.management_fee.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-1">敷金</p>
                  <p className="text-2xl font-bold text-white">¥{property.deposit.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-1">礼金</p>
                  <p className="text-2xl font-bold text-white">¥{property.key_money.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-lg p-4 border border-white/20">
                <p className="text-purple-200 text-sm mb-1">初期費用合計（目安）</p>
                <p className="text-3xl font-bold text-white">¥{totalInitialCost.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">物件詳細</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">間取り</span>
                  <span className="text-white font-semibold">{property.layout}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">専有面積</span>
                  <span className="text-white font-semibold">{property.area}m²</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">階数</span>
                  <span className="text-white font-semibold">{property.floor}階</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">築年数</span>
                  <span className="text-white font-semibold">築{property.building_age}年</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">最寄り駅</span>
                  <span className="text-white font-semibold">{property.nearest_station}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-purple-300">駅徒歩</span>
                  <span className="text-white font-semibold">{property.station_distance}分</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">物件説明</h2>
              <p className="text-purple-100 whitespace-pre-wrap leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">設備・特徴</h2>
              <div className="flex flex-wrap gap-3">
                {property.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-lg border border-purple-500/30"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 sticky top-6">
              <h3 className="text-xl font-bold text-white mb-4">この物件について</h3>
              
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 mb-3 ${
                  isFavorite
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {isFavorite ? '❤️ お気に入り登録済み' : '🤍 お気に入りに追加'}
              </button>

              <Link
                href="/dashboard/support"
                className="block w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-center mb-3"
              >
                📧 お問い合わせ
              </Link>

              <Link
                href="/properties"
                className="block w-full py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center border border-white/20"
              >
                🔍 他の物件を探す
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">💰 月額費用</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-purple-200">
                  <span>家賃</span>
                  <span>¥{property.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-purple-200">
                  <span>管理費</span>
                  <span>¥{property.management_fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/20 pt-2 mt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>合計</span>
                    <span>¥{(property.rent + property.management_fee).toLocaleString()}/月</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}