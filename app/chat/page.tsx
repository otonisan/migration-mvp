'use client';

import { useState, useEffect } from 'react';
import { getChatRooms } from '@/lib/supabase/chat';
import type { ChatRoom } from '@/lib/types/chat';
import ChatRoomCard from '@/components/chat/ChatRoomCard';
import CreateRoomModal from '@/components/chat/CreateRoomModal';

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getChatRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💬 みんなのチャット</h1>
          <p className="text-gray-600">気軽に話せる掲示板スタイルのチャットです</p>
        </div>

               {/* ルーム作成ボタン */}
        <div className="mb-6">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span className="text-xl">➕</span>
            新しいルームを作成
          </button>
        </div>

        {/* チャットルーム一覧 */}
        <div className="space-y-4">
          {rooms.map((room) => (
            <ChatRoomCard key={room.id} room={room} />
          ))}

           {/* ルーム作成モーダル */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadRooms}
      />
        </div>
      </div>
    </div>
  );
}