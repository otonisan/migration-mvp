'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, MapPin } from 'lucide-react';
import PostCard from '@/components/social/PostCard';
import CreatePostModal from '@/components/social/CreatePostModal';
import CommentModal from '@/components/social/CommentModal';
import { getPosts, getPostsByArea } from '@/lib/supabase/posts';
import type { Post } from '@/lib/types/post';
import { useSupabase } from '@/components/providers/SupabaseProvider';

export default function CommunityPage() {
  const { supabase, user } = useSupabase();
  const [posts, setPosts] = useState<Post[]>([]);
  const [areas, setAreas] = useState<Array<{ id: string; name: string; display_name: string }>>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [commentModalPostId, setCommentModalPostId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAreas();
    loadPosts();
  }, [selectedArea]);

  const loadAreas = async () => {
    const { data } = await supabase
      .from('areas')
      .select('id, name')
      .order('name');
    
    if (data) {
      setAreas(data.map(area => ({
        ...area,
        display_name: area.name,
      })));
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const data = selectedArea 
        ? await getPostsByArea(selectedArea)
        : await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-emerald-600" />
                山形移住コミュニティ
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                移住者同士で情報交換しよう 🍒
              </p>
            </div>
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              投稿する
            </button>
          </div>

          {/* エリアフィルター */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedArea('')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedArea === ''
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {areas.map(area => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedArea === area.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {area.display_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* タイムライン */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">読み込み中...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">まだ投稿がありません</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors"
            >
              最初の投稿をする
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDelete={loadPosts}
                onComment={() => setCommentModalPostId(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* モーダル */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadPosts}
        areas={areas}
      />

      {commentModalPostId && (
        <CommentModal
          isOpen={!!commentModalPostId}
          onClose={() => setCommentModalPostId(null)}
          postId={commentModalPostId}
          currentUserId={user?.id}
        />
      )}
    </div>
  );
}