'use client';

import { VIBE_TYPES } from '@/lib/mapbox';

interface VibeSidebarProps {
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  onTimeChange: (time: 'morning' | 'day' | 'evening' | 'night') => void;
  selectedVibes: string[];
  onVibeToggle: (vibeId: string) => void;
  ageGroup?: string;
  onAgeGroupChange?: (ageGroup: string) => void;
}

const TIME_LABELS = {
  morning: '朝',
  day: '昼',
  evening: '夕',
  night: '夜',
};

const AGE_GROUPS = {
  '20s': { label: '20代', desc: '単身・カップル', icon: '✨' },
  '30s': { label: '30代', desc: '子育て世代', icon: '👶' },
  '40s': { label: '40代', desc: 'ファミリー', icon: '👨‍👩‍👧‍👦' },
  '50s': { label: '50代', desc: 'セカンドライフ', icon: '🌿' },
  '60plus': { label: '60代以上', desc: 'リタイア世代', icon: '♨️' },
};

export default function VibeSidebar({
  timeOfDay,
  onTimeChange,
  selectedVibes,
  onVibeToggle,
  ageGroup = '',
  onAgeGroupChange,
}: VibeSidebarProps) {
  return (
    <aside className="w-80 border-r-2 border-emerald-100 p-8 bg-gradient-to-b from-emerald-50 to-white overflow-y-auto">
      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        空気感マップ
      </h1>
      <p className="text-sm text-gray-700 mb-8 font-medium">
        街の雰囲気を可視化
      </p>

      {/* 年齢層選択 */}
      {onAgeGroupChange && (
        <div className="mb-8">
          <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
            Age Group
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onAgeGroupChange('')}
              className={`w-full px-4 py-3 border-2 transition-all text-sm font-bold rounded-lg text-left ${
                ageGroup === ''
                  ? 'border-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
            >
              すべて
            </button>
            {Object.entries(AGE_GROUPS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => onAgeGroupChange(key)}
                className={`w-full px-4 py-3 border-2 transition-all text-sm font-bold rounded-lg text-left ${
                  ageGroup === key
                    ? 'border-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{value.icon}</span>
                  <div>
                    <div>{value.label}</div>
                    <div className="text-xs opacity-75">{value.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 時間帯選択 */}
      <div className="mb-8">
        <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
          Time of Day
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TIME_LABELS) as Array<keyof typeof TIME_LABELS>).map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              className={`px-4 py-3 border-2 transition-all text-sm font-bold rounded-lg ${
                timeOfDay === time
                  ? 'border-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                  : 'border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
            >
              {TIME_LABELS[time]}
            </button>
          ))}
        </div>
      </div>

      {/* 空気感フィルター */}
      <div className="mb-8">
        <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
          Vibes
        </label>
        <div className="space-y-2">
          {Object.values(VIBE_TYPES).map((vibe) => {
            const isSelected = selectedVibes.includes(vibe.id);
            return (
              <label
                key={vibe.id}
                className={`flex items-center gap-3 cursor-pointer group py-3 px-3 rounded-lg transition-all ${
                  isSelected ? 'bg-emerald-50 border-2 border-emerald-200' : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onVibeToggle(vibe.id)}
                  className="w-4 h-4 cursor-pointer accent-emerald-600"
                />
                
                {/* アイコン追加 */}
                <span className="text-2xl flex-shrink-0">
                  {vibe.icon}
                </span>
                
                <span
                  className="w-4 h-4 border-2 border-gray-300 flex-shrink-0 transition-all rounded shadow-sm"
                  style={{ backgroundColor: vibe.hex }}
                />
                
                <div className="flex-1">
                  <div className="text-sm text-gray-900 font-bold">{vibe.name_ja}</div>
                  <div className="text-xs text-gray-500">{vibe.name_en}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 選択数 */}
      <div className="text-xs text-gray-500 font-medium">
        {selectedVibes.length} / {Object.keys(VIBE_TYPES).length} 選択中
      </div>
    </aside>
  );
}