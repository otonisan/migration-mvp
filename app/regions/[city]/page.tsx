'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RegionData {
  city: string;
  prefecture: string;
  description: string;
  features: string[];
  climate: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  livingCost: {
    rent: string;
    food: string;
    transport: string;
    utilities: string;
  };
  atmosphere: string;
  attractions: string[];
}

const regionData: Record<string, RegionData> = {
  '松本市': {
    city: '松本市',
    prefecture: '長野県',
    description: 'アルプスの麓に広がる城下町。歴史と自然が調和した暮らしやすい街です。',
    features: [
      '🏔️ 北アルプスの絶景',
      '🏯 国宝松本城',
      '♨️ 豊富な温泉',
      '🎨 芸術・文化が盛ん',
      '🍎 新鮮な地元農産物'
    ],
    climate: {
      spring: '桜と新緑が美しい穏やかな季節',
      summer: '涼しく過ごしやすい高原の夏',
      autumn: '紅葉と澄んだ空気が魅力',
      winter: '雪景色と冬のアクティビティ'
    },
    livingCost: {
      rent: '4〜8万円（1LDK）',
      food: '3〜5万円',
      transport: '1〜2万円',
      utilities: '1〜2万円'
    },
    atmosphere: '落ち着いた城下町の雰囲気と、アウトドア好きが集まるアクティブなコミュニティが共存。週末は登山やスキーを楽しむ人が多い。',
    attractions: ['松本城', '上高地', '美ヶ原高原', '浅間温泉', '松本市美術館']
  },
  '伊豆市': {
    city: '伊豆市',
    prefecture: '静岡県',
    description: '温泉と海に恵まれた癒しのリゾート地。豊かな自然と温暖な気候が魅力です。',
    features: [
      '♨️ 豊富な温泉地',
      '🌊 美しい海岸線',
      '🗻 富士山の眺望',
      '🍊 温暖な気候',
      '🚃 都心へのアクセス良好'
    ],
    climate: {
      spring: '温暖で花々が咲き誇る',
      summer: '海風が心地よい夏',
      autumn: '穏やかで過ごしやすい',
      winter: '温暖で雪がほとんど降らない'
    },
    livingCost: {
      rent: '4〜7万円（1LDK）',
      food: '3〜4万円',
      transport: '1〜3万円',
      utilities: '1〜2万円'
    },
    atmosphere: 'リゾート地ならではののんびりした雰囲気。温泉好きやサーフィン愛好家が多い。移住者も多く新しいコミュニティが生まれている。',
    attractions: ['修善寺温泉', '浄蓮の滝', '天城峠', '土肥温泉', '達磨山']
  },
  '倉敷市': {
    city: '倉敷市',
    prefecture: '岡山県',
    description: '白壁の美観地区で知られる歴史ある街。文化と産業が調和した中核都市です。',
    features: [
      '🏛️ 美観地区の町並み',
      '🎨 大原美術館',
      '🏭 産業が盛ん',
      '🌊 瀬戸内の温暖な気候',
      '🚄 交通の便が良い'
    ],
    climate: {
      spring: '穏やかで晴れの日が多い',
      summer: '温暖だが瀬戸内の風で快適',
      autumn: '爽やかで過ごしやすい',
      winter: '温暖で雪は稀'
    },
    livingCost: {
      rent: '5〜8万円（1LDK）',
      food: '3〜5万円',
      transport: '1〜2万円',
      utilities: '1〜2万円'
    },
    atmosphere: '歴史ある街並みと現代的な生活が融合。観光地でもあり、文化的なイベントが多い。地元の人は温厚で親しみやすい。',
    attractions: ['倉敷美観地区', '大原美術館', '鷲羽山', '瀬戸大橋', '水島コンビナート夜景']
  },
  '糸島市': {
    city: '糸島市',
    prefecture: '福岡県',
    description: '福岡市に隣接する海辺のおしゃれな街。自然とカフェ文化が魅力です。',
    features: [
      '🌊 美しい海岸',
      '☕ おしゃれなカフェ',
      '🌾 地産地消の農産物',
      '🏖️ サーフスポット',
      '🚃 福岡市へ30分'
    ],
    climate: {
      spring: '花々が咲き心地よい',
      summer: '海が輝く夏',
      autumn: '爽やかな風が吹く',
      winter: '比較的温暖'
    },
    livingCost: {
      rent: '5〜9万円（1LDK）',
      food: '3〜5万円',
      transport: '1〜3万円',
      utilities: '1〜2万円'
    },
    atmosphere: '自然派・おしゃれ志向の若い世代が多く移住。週末はカフェ巡りやサーフィンを楽しむライフスタイル。都会と田舎のバランスが良い。',
    attractions: ['二見ヶ浦', '芥屋の大門', '白糸の滝', '桜井二見ヶ浦神社', '糸島クラフトフェス']
  },
  '富良野市': {
    city: '富良野市',
    prefecture: '北海道',
    description: 'ラベンダー畑で有名な北の大地。四季折々の自然が美しい街です。',
    features: [
      '💜 ラベンダー畑',
      '⛷️ スキーリゾート',
      '🌾 豊かな農産物',
      '🏔️ 大雪山系の景観',
      '🎬 ドラマのロケ地'
    ],
    climate: {
      spring: '遅い春、雪解けと新緑',
      summer: '爽やかで過ごしやすい',
      autumn: '紅葉が美しい短い秋',
      winter: '雪景色とウィンタースポーツ'
    },
    livingCost: {
      rent: '3〜6万円（1LDK）',
      food: '3〜4万円',
      transport: '1〜2万円',
      utilities: '2〜3万円（冬は暖房費高め）'
    },
    atmosphere: '自然を愛する人々が集まるコミュニティ。農業や観光業に携わる人が多い。冬はスキー客で賑わい、夏は観光シーズン。',
    attractions: ['ファーム富田', '富良野スキー場', '青い池', 'ニングルテラス', '麓郷の森']
  },
  '石垣市': {
    city: '石垣市',
    prefecture: '沖縄県',
    description: '八重山諸島の中心地。美しい海と島時間が流れる南国の楽園です。',
    features: [
      '🏝️ エメラルドグリーンの海',
      '🐠 世界有数のダイビングスポット',
      '🌺 亜熱帯の自然',
      '⭐ 満天の星空',
      '🏖️ 離島へのアクセス拠点'
    ],
    climate: {
      spring: '初夏のような暖かさ',
      summer: '日差しは強いが海風で快適',
      autumn: '台風シーズンだが温暖',
      winter: '温暖で20度前後'
    },
    livingCost: {
      rent: '4〜8万円（1LDK）',
      food: '4〜6万円（物価やや高め）',
      transport: '1〜2万円',
      utilities: '1〜2万円'
    },
    atmosphere: 'のんびりとした島時間が流れる。移住者も多く、オープンなコミュニティ。海や自然が好きな人が多く、マリンスポーツが盛ん。',
    attractions: ['川平湾', '石垣島鍾乳洞', 'フサキビーチ', '平久保崎灯台', '八重山諸島への離島巡り']
  }
};

export default function RegionPage() {
  const params = useParams();
  const city = decodeURIComponent(params.city as string);
  const [region, setRegion] = useState<RegionData | null>(null);

  useEffect(() => {
    const data = regionData[city];
    setRegion(data || null);
  }, [city]);

  if (!region) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">地域情報が見つかりません</h1>
          <Link href="/properties" className="text-purple-300 hover:text-purple-100">
            ← 物件一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/properties" className="text-purple-300 hover:text-purple-100 mb-4 inline-block">
            ← 物件一覧に戻る
          </Link>
          <h1 className="text-5xl font-bold mb-2">{region.city}</h1>
          <p className="text-2xl text-purple-200">{region.prefecture}</p>
        </div>

        {/* 概要 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <p className="text-xl leading-relaxed">{region.description}</p>
        </div>

        {/* 特徴 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">✨ この街の魅力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {region.features.map((feature, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4">
                <p className="text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 気候 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">🌤️ 四季の様子</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pink-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">🌸 春</h3>
              <p>{region.climate.spring}</p>
            </div>
            <div className="bg-orange-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">☀️ 夏</h3>
              <p>{region.climate.summer}</p>
            </div>
            <div className="bg-yellow-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">🍂 秋</h3>
              <p>{region.climate.autumn}</p>
            </div>
            <div className="bg-blue-500/20 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">❄️ 冬</h3>
              <p>{region.climate.winter}</p>
            </div>
          </div>
        </div>

        {/* 生活コスト */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">💰 生活コスト目安</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-purple-300 mb-2">家賃（1LDK）</p>
              <p className="text-2xl font-bold">{region.livingCost.rent}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-purple-300 mb-2">食費</p>
              <p className="text-2xl font-bold">{region.livingCost.food}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-purple-300 mb-2">交通費</p>
              <p className="text-2xl font-bold">{region.livingCost.transport}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <p className="text-purple-300 mb-2">光熱費</p>
              <p className="text-2xl font-bold">{region.livingCost.utilities}</p>
            </div>
          </div>
        </div>

        {/* 雰囲気 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">🏘️ 街の雰囲気</h2>
          <p className="text-lg leading-relaxed">{region.atmosphere}</p>
        </div>

        {/* 観光スポット */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">📍 人気スポット</h2>
          <div className="flex flex-wrap gap-3">
            {region.attractions.map((spot, index) => (
              <span key={index} className="bg-purple-500/30 px-4 py-2 rounded-full text-lg">
                {spot}
              </span>
            ))}
          </div>
        </div>

        {/* この地域の物件を見る */}
        <div className="mt-8 text-center">
          <Link 
            href={`/properties?city=${encodeURIComponent(region.city)}`}
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-xl text-lg"
          >
            {region.city}の物件を探す →
          </Link>
        </div>
      </div>
    </div>
  );
}