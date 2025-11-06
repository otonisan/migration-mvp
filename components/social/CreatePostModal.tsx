'use client';

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Video, MapPin, Tag } from 'lucide-react';
import { uploadVideo } from '@/lib/supabase/posts';
import { VIBE_TYPES } from '@/lib/mapbox';
import type { CreatePostData } from '@/lib/types/post';
import { useSupabase } from '@/components/providers/SupabaseProvider';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  areas: Array<{ id: string; name: string; display_name: string }>;
}

export default function CreatePostModal({ isOpen, onClose, onSuccess, areas }: CreatePostModalProps) {
  const { supabase } = useSupabase(); // 追加
  const [type, setType] = useState<'text' | 'video'>('text');
  const [content, setContent] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 50MB制限
    if (file.size > 50 * 1024 * 1024) {
      alert('動画は50MB以下にしてください');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

 const handleSubmit = async () => {
  if (type === 'text' && !content.trim()) {
    alert('本文を入力してください');
    return;
  }

  if (type === 'video' && !videoFile) {
    alert('動画を選択してください');
    return;
  }

  setIsUploading(true);

  try {
    const postData = {
      type,
      content: content.trim() || null,
      area_id: selectedArea || null,
      vibe_tags: selectedTags.length > 0 ? selectedTags : null,
    };

    console.log('投稿データ:', postData);

    // 直接insertを試みる（RLSポリシーがuser_idをチェックする）
    const { data: post, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2)); // この行を追加
      if (error.message.includes('JWT') || error.message.includes('auth')) {
        alert('ログインしてください');
      } else {
        alert('投稿に失敗しました: ' + error.message);
      }
      return;
    }

    console.log('✅ 投稿成功:', post);

    // 動画がある場合はアップロード
    if (type === 'video' && videoFile && post) {
      const mediaUrl = await uploadVideo(videoFile, post.id);
      
      // Supabaseで直接更新
      await supabase
        .from('posts')
        .update({ media_url: mediaUrl })
        .eq('id', post.id);
    }

    // 成功
    onSuccess();
    handleClose();
  } catch (error) {
    console.error('Failed to create post:', error);
    alert('投稿に失敗しました: ' + (error instanceof Error ? error.message : '不明なエラー'));
  } finally {
    setIsUploading(false);
  }
};

  const handleClose = () => {
    setContent('');
    setSelectedArea('');
    setSelectedTags([]);
    setVideoFile(null);
    setVideoPreview(null);
    setType('text');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">投稿を作成</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* タブ */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={() => setType('text')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              type === 'text'
                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            📝 テキスト
          </button>
          <button
            onClick={() => setType('video')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              type === 'video'
                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎬 ショート動画
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 動画選択 */}
          {type === 'video' && (
            <div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
              
              {videoPreview ? (
                <div className="relative aspect-[9/16] max-h-[400px] bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full aspect-[9/16] max-h-[400px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <Video className="w-12 h-12 text-gray-400" />
                  <div className="text-center">
                    <p className="font-medium text-gray-700">動画を選択</p>
                    <p className="text-sm text-gray-500 mt-1">最大50MB、30秒まで</p>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* 本文 */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === 'video' ? 'キャプションを追加...' : '山形での暮らしについて投稿しよう...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={type === 'video' ? 3 : 6}
            />
          </div>

          {/* エリア選択 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              エリア
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">選択なし</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.display_name}
                </option>
              ))}
            </select>
          </div>

          {/* タグ選択 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              空気感タグ
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(VIBE_TYPES).map(([key, vibe]) => (
                <button
                  key={key}
                  onClick={() => toggleTag(key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTags.includes(key)
                      ? 'border-2'
                      : 'border border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(key) ? `${vibe.hex}20` : 'white',
                    borderColor: selectedTags.includes(key) ? vibe.hex : undefined,
                    color: selectedTags.includes(key) ? vibe.hex : '#6b7280',
                  }}
                >
                  {vibe.icon} {vibe.description}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </div>
    </div>
  );
}