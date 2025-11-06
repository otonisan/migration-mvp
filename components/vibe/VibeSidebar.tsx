'use client';

import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーメニューボタン（スマホのみ） */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-30 left-4 z-50 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all"
        aria-label="メニューを開く"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* オーバーレイ（スマホのみ） */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバー本体 */}
      <aside
        className={`
          fixed lg:relative
          top-0 left-0 h-screen
          w-80 lg:w-80
          border-r-2 border-emerald-100
          p-6 lg:p-8
          bg-gradient-to-b from-emerald-50 to-white
          overflow-y-auto
          z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* タイトル */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              空気感マップ
            </h1>
            <p className="text-xs lg:text-sm text-gray-700 font-medium">
              街の雰囲気を可視化
            </p>
          </div>
          
          {/* 閉じるボタン（スマホのみ） */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 年齢層選択 */}
        {onAgeGroupChange && (
          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
              Age Group
            </label>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onAgeGroupChange('');
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 lg:px-4 lg:py-3 border-2 transition-all text-xs lg:text-sm font-bold rounded-lg text-left ${
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
                  onClick={() => {
                    onAgeGroupChange(key);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 lg:px-4 lg:py-3 border-2 transition-all text-xs lg:text-sm font-bold rounded-lg text-left ${
                    ageGroup === key
                      ? 'border-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'border-gray-200 text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg lg:text-xl">{value.icon}</span>
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
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
            Time of Day
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(TIME_LABELS) as Array<keyof typeof TIME_LABELS>).map((time) => (
              <button
                key={time}
                onClick={() => {
                  onTimeChange(time);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 lg:px-4 lg:py-3 border-2 transition-all text-xs lg:text-sm font-bold rounded-lg ${
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
        <div className="mb-6">
          <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider">
            Vibes
          </label>
          <div className="space-y-2">
            {Object.values(VIBE_TYPES).map((vibe) => {
              const isSelected = selectedVibes.includes(vibe.id);
              return (
                <label
                  key={vibe.id}
                  className={`flex items-center gap-2 lg:gap-3 cursor-pointer group py-2 lg:py-3 px-2 lg:px-3 rounded-lg transition-all ${
                    isSelected ? 'bg-emerald-50 border-2 border-emerald-200' : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onVibeToggle(vibe.id)}
                    className="w-4 h-4 cursor-pointer accent-emerald-600"
                  />
                  
                  {/* アイコン */}
                  <span className="text-xl lg:text-2xl flex-shrink-0">
                    {vibe.icon}
                  </span>
                  
                  <span
                    className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-gray-300 flex-shrink-0 transition-all rounded shadow-sm"
                    style={{ backgroundColor: vibe.hex }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs lg:text-sm text-gray-900 font-bold truncate">{vibe.name_ja}</div>
                    <div className="text-xs text-gray-500 truncate">{vibe.name_en}</div>
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
    </>
  );
}