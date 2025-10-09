// lib/mapbox.ts
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

export const DEFAULT_VIEW = {
  longitude: 140.3278,
  latitude: 38.2544,
  zoom: 12,
};

// 空気感カラー定義
export const VIBE_TYPES = {
  calm_nature: {
    id: 'calm_nature',
    name_ja: '静穏・自然',
    name_en: 'Calm & Nature',
    hue: 120,
    hex: '#2BB673',
    keywords: ['緑', '静か', '散歩', '川', '公園'],
  },
  family: {
    id: 'family',
    name_ja: '家族・子育て',
    name_en: 'Family',
    hue: 50,
    hex: '#F7C948',
    keywords: ['保育園', '子ども', '安全', '公園'],
  },
  creative: {
    id: 'creative',
    name_ja: 'クリエイティブ',
    name_en: 'Creative',
    hue: 280,
    hex: '#9B5DE5',
    keywords: ['ギャラリー', 'カフェ', 'アート'],
  },
  nightlife: {
    id: 'nightlife',
    name_ja: 'ナイト・活気',
    name_en: 'Nightlife',
    hue: 15,
    hex: '#FF6B6B',
    keywords: ['バー', '音楽', '活気'],
  },
  heritage: {
    id: 'heritage',
    name_ja: '歴史・伝統',
    name_en: 'Heritage',
    hue: 20,
    hex: '#A0522D',
    keywords: ['神社', '古民家', '伝統'],
  },
  industrial: {
    id: 'industrial',
    name_ja: '産業・ギア感',
    name_en: 'Industrial',
    hue: 210,
    hex: '#5B6C8F',
    keywords: ['倉庫', '工場', '職人'],
  },
  seaside: {
    id: 'seaside',
    name_ja: '海・リゾート',
    name_en: 'Seaside',
    hue: 190,
    hex: '#56CFE1',
    keywords: ['海', '風', '光'],
  },
  academic: {
    id: 'academic',
    name_ja: '学術・静学',
    name_en: 'Academic',
    hue: 220,
    hex: '#3A86FF',
    keywords: ['図書館', '大学', '静か'],
  },
  luxury: {
    id: 'luxury',
    name_ja: '上質・洗練',
    name_en: 'Luxury',
    hue: 30,
    hex: '#E76F51',
    keywords: ['カフェ', '雑貨', '洗練'],
  },
  startup: {
    id: 'startup',
    name_ja: 'スタートアップ',
    name_en: 'Startup',
    hue: 170,
    hex: '#00C2A8',
    keywords: ['コワーキング', 'IT', '起業'],
  },
};

// HSL変換ヘルパー
export function getVibeHSL(
  vibeType: keyof typeof VIBE_TYPES,
  score: number,
  timeOfDay: 'morning' | 'day' | 'evening' | 'night'
) {
  const vibe = VIBE_TYPES[vibeType];
  const saturation = (score / 100) * 0.7; // 最大70%

  const lightnessMap = {
    morning: 0.80,
    day: 0.75,
    evening: 0.55,
    night: 0.35,
  };

  return `hsl(${vibe.hue}, ${saturation * 100}%, ${lightnessMap[timeOfDay] * 100}%)`;
}