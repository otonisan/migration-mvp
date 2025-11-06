'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Trash2, MapPin } from 'lucide-react';
import type { Post } from '@/lib/types/post';
import { likePost, unlikePost, deletePost } from '@/lib/supabase/posts';
import { VIBE_TYPES } from '@/lib/mapbox';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: () => void;
  onComment?: () => void;
}

export default function PostCard({ post, currentUserId, onDelete, onComment }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!currentUserId) {
      router.push('/auth/login');
      return;
    }

    try {
      if (isLiked) {
        await unlikePost(post.id);
        setIsLiked(false);
        setLikesCount(prev => Math.max(prev - 1, 0));
      } else {
        await likePost(post.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この投稿を削除しますか？')) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  const userName = post.user?.user_metadata?.full_name || post.user?.email?.split('@')[0] || '匿名ユーザー';
  const userAvatar = post.user?.user_metadata?.avatar_url;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* アバター */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
            ) : (
              userName[0].toUpperCase()
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{userName}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {post.area && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {post.area.display_name}
                </span>
              )}
              <span>·</span>
              <span>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </div>

        {/* 削除ボタン（自分の投稿のみ） */}
        {currentUserId === post.user_id && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 動画 or テキスト */}
      {post.type === 'video' && post.media_url ? (
        <div className="relative bg-black aspect-[9/16] max-h-[600px]">
          <video
            src={post.media_url}
            controls
            className="w-full h-full object-contain"
            poster={post.thumbnail_url || undefined}
          />
        </div>
      ) : null}

      {/* 本文 */}
      {post.content && (
        <div className="px-4 py-3">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* タグ */}
      {post.vibe_tags && post.vibe_tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.vibe_tags.map(tag => {
            const vibeType = VIBE_TYPES[tag as keyof typeof VIBE_TYPES];
            if (!vibeType) return null;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${vibeType.hex}20`,
                  color: vibeType.hex,
                }}
              >
                {vibeType.icon} {vibeType.description}
              </span>
            );
          })}
        </div>
      )}

      {/* アクション */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">{likesCount}</span>
        </button>

        <button
          onClick={onComment}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">{post.comments_count}</span>
        </button>
      </div>
    </div>
  );
}