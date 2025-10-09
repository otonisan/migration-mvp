'use client';

import { VIBE_TYPES } from '@/lib/mapbox';

interface VibeSidebarProps {
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  onTimeChange: (time: 'morning' | 'day' | 'evening' | 'night') => void;
  selectedVibes: string[];
  onVibeToggle: (vibeId: string) => void;
}

const TIME_LABELS = {
  morning: '朝',
  day: '昼',
  evening: '夕',
  night: '夜',
};

export default function VibeSidebar({
  timeOfDay,
  onTimeChange,
  selectedVibes,
  onVibeToggle,
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
                className={`flex items-center gap-3 cursor-pointer group py-2 px-3 rounded-lg transition-all ${
                  isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onVibeToggle(vibe.id)}
                  className="w-4 h-4 cursor-pointer accent-emerald-600"
                />
                <span
                  className="w-5 h-5 border-2 border-gray-300 flex-shrink-0 transition-all rounded shadow-sm"
                  style={{ backgroundColor: vibe.hex }}
                />
                <div className="flex-1">
                  <div className="text-sm text-gray-900 font-medium">{vibe.name_ja}</div>
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