'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { getComments, addComment } from '@/lib/supabase/posts';
import type { PostComment } from '@/lib/types/post';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  currentUserId?: string;
}

export default function CommentModal({ isOpen, onClose, postId, currentUserId }: CommentModalProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !currentUserId) return;

    setIsSending(true);
    try {
      const comment = await addComment(postId, newComment.trim());
      setComments(prev => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('コメントの投稿に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">コメント</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コメント一覧 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">読み込み中...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              まだコメントがありません
            </div>
          ) : (
            comments.map(comment => {
              const userName = comment.user?.user_metadata?.full_name || 
                               comment.user?.email?.split('@')[0] || 
                               '匿名ユーザー';
              const userAvatar = comment.user?.user_metadata?.avatar_url;

              return (
                <div key={comment.id} className="flex gap-3">
                  {/* アバター */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      userName[0].toUpperCase()
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <p className="font-semibold text-sm text-gray-900 mb-1">
                        {userName}
                      </p>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-4">
                      {new Date(comment.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* コメント入力 */}
        {currentUserId ? (
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSending}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200 p-4 text-center">
            <p className="text-gray-500">
              コメントするには
              <a href="/auth/login" className="text-emerald-600 hover:underline ml-1">
                ログイン
              </a>
              してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}