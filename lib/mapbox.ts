// lib/mapbox.ts
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export const MAP_STYLE = 'mapbox://styles/mapbox/light-v11';

export const DEFAULT_VIEW = {
  longitude: 140.3278,
  latitude: 38.2544,
  zoom: 12,
};

// 山形特化：空気感カラー定義（カラーユニバーサルデザイン対応）
export const VIBE_TYPES = {
  onsen_relax: {
    id: 'onsen_relax',
    name_ja: '温泉・リラックス',
    name_en: 'Onsen & Relax',
    icon: '♨️',
    hue: 30,
    hex: '#D2691E',
    keywords: ['温泉', 'リラックス', '癒し', '静か'],
    description: '温泉地が近く、リラックスできる環境',
  },
  family: {
    id: 'family',
    name_ja: '子育て・ファミリー',
    name_en: 'Family',
    icon: '👨‍👩‍👧‍👦',
    hue: 340,
    hex: '#FF69B4',
    keywords: ['保育園', '学校', '公園', '子育て'],
    description: '保育園・学校が充実、公園も多い',
  },
  agriculture_nature: {
    id: 'agriculture_nature',
    name_ja: '農業・自然',
    name_en: 'Agriculture',
    icon: '🌾',
    hue: 120,
    hex: '#228B22',
    keywords: ['田畑', '自然', '農業', '広々'],
    description: '田畑が広がる自然豊かなエリア',
  },
  commercial: {
    id: 'commercial',
    name_ja: '商業・利便性',
    name_en: 'Commercial',
    icon: '🏪',
    hue: 210,
    hex: '#1E90FF',
    keywords: ['スーパー', 'お店', '便利', '駅近'],
    description: 'スーパーやお店が近く便利',
  },
  heritage_tourism: {
    id: 'heritage_tourism',
    name_ja: '歴史・観光',
    name_en: 'Heritage',
    icon: '🏯',
    hue: 270,
    hex: '#8B008B',
    keywords: ['神社', '寺', '観光', '歴史'],
    description: '歴史的建造物や観光地が多い',
  },
  quiet_residential: {
    id: 'quiet_residential',
    name_ja: '静か・住宅地',
    name_en: 'Quiet',
    icon: '🏡',
    hue: 0,
    hex: '#696969',
    keywords: ['閑静', '住宅街', '落ち着き', '静か'],
    description: '閑静な住宅街、落ち着いた環境',
  },
  youthful_vibrant: {
    id: 'youthful_vibrant',
    name_ja: '若者・活気',
    name_en: 'Vibrant',
    icon: '✨',
    hue: 30,
    hex: '#FF8C00',
    keywords: ['カフェ', '若者', '活気', 'おしゃれ'],
    description: 'カフェや若者向けのお店が多い',
  },
  orchard: {
    id: 'orchard',
    name_ja: '果樹園エリア',
    name_en: 'Orchard',
    icon: '🍒',
    hue: 0,
    hex: '#DC143C',
    keywords: ['さくらんぼ', 'ぶどう', '果樹園', 'フルーツ'],
    description: 'さくらんぼやぶどう園が広がる',
  },
};

// HSL変換ヘルパー
export function getVibeHSL(
  vibeType: keyof typeof VIBE_TYPES,
  score: number,
  timeOfDay: 'morning' | 'day' | 'evening' | 'night'
) {
  const vibe = VIBE_TYPES[vibeType];
  const saturation = (score / 100) * 0.7;

  const lightnessMap = {
    morning: 0.80,
    day: 0.75,
    evening: 0.55,
    night: 0.35,
  };

  return `hsl(${vibe.hue}, ${saturation * 100}%, ${lightnessMap[timeOfDay] * 100}%)`;
}