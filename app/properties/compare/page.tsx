// app/properties/compare/page.tsx
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Property {
  id: string;
  title: string;
  region: string;
  city: string;
  rent: number;
  deposit: number;
  area: number;
  building_age: number;
  address: string;
  description: string;
  image_url: string;
}

function ComparePageContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProperties = useCallback(async () => {
    try {
      const ids = searchParams.get('ids')?.split(',') || [];
      
      if (ids.length === 0) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/compare?ids=${ids}`);
      
      if (!response.ok) {
        throw new Error('物件の取得に失敗しました');
      }

      const data = await response.json();
      setProperties(data.properties);
      
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
          <div className="text-yellow-400 text-5xl mb-4">📋</div>
          <h2 className="text-white text-xl font-bold mb-4">比較する物件を選択してください</h2>
          <Link
            href="/properties"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            物件一覧へ
          </Link>
        </div>
      </div>
    );
  }

  const comparisonItems = [
    { label: '物件名', key: 'title'},
    { label: '地域', key: 'region' },
    { label: '市区町村', key: 'city' },
    { label: '住所', key: 'address' },
    { label: '家賃（月額）', key: 'rent', format: (v: number) => `${v.toLocaleString()}円` },
    { label: '敷金', key: 'deposit', format: (v: number) => `${v.toLocaleString()}円` },
    { label: '面積', key: 'area', format: (v: number) => `${v}㎡` },
    { label: '築年数', key: 'building_age', format: (v: number) => `築${v}年` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* ヘッダー */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/properties" className="text-purple-200 hover:text-white transition-colors">
            ← 物件一覧に戻る
          </Link>
          <h1 className="text-white text-xl font-bold">物件比較</h1>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* タイトル */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            物件を比較する
          </h2>
          <p className="text-purple-200 text-lg">
            {properties.length}件の物件を比較しています
          </p>
        </div>

        {/* 比較テーブル */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-4 text-left text-purple-200 font-bold bg-white/5">項目</th>
                  {properties.map((property) => (
                    <th key={property.id} className="p-4 text-center bg-white/5">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-2">
                          <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white font-bold">{property.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item) => (
                  <tr key={item.key} className="border-b border-white/5">
                    <td className="p-4 text-purple-200 font-semibold border-r border-white/10">
                      {item.label}
                    </td>
                    {properties.map((property) => {
                      const value = property[item.key as keyof Property];
                      const displayValue = item.format && typeof value === 'number' 
                        ? item.format(value) 
                        : value;
                      
                      return (
                        <td key={property.id} className="p-4 text-white text-center">
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-bold"
            >
              {property.title}の詳細
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <ComparePageContent />
    </Suspense>
  );
}