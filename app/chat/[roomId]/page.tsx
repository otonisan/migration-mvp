'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getRoomMessages, sendMessage, getChatRooms, deleteMessage } from '@/lib/supabase/chat';
import { useSupabase } from '../../../components/providers/SupabaseProvider';
import { createClient } from '@/lib/supabase/client';
import type { ChatMessageWithProfile, ChatRoom } from '@/lib/types/chat';


export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useSupabase();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRoom();
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    loadRoom();
    loadMessages();
  }, [roomId]);

  // ↓↓↓ ここから追加（26行目の後） ↓↓↓
  // リアルタイム購読
  // リアルタイム購読
  useEffect(() => {
    if (!roomId) return;

    const supabase = createClient();
    
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          // 新しいメッセージが来たらリロード
          loadMessages();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          // メッセージが削除されたらリロード
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);
  // ↑↑↑ ここまで追加 ↑↑↑

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoom = async () => {
    try {
      const rooms = await getChatRooms();
      const foundRoom = rooms.find((r) => r.id === roomId);
      setRoom(foundRoom || null);
    } catch (error) {
      console.error('Failed to load room:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await getRoomMessages(roomId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      await sendMessage(roomId, newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('このメッセージを削除しますか？')) return;

    try {
      await deleteMessage(messageId);
      await loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('メッセージの削除に失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">ルームが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/chat')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 戻る
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-sm text-gray-600">{room.description}</p>
          </div>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.user_id === user?.id ? 'flex-row-reverse' : ''
              }`}
            >
              {/* アバター */}
              <img
                src={message.profiles.avatar_url}
                alt={message.profiles.full_name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />

              {/* メッセージ */}
              <div
                className={`flex-1 ${
                  message.user_id === user?.id ? 'text-right' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {message.profiles.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div
                    className={`inline-block px-4 py-2 rounded-lg ${
                      message.user_id === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {/* 削除ボタン（自分のメッセージのみ） */}
                  {message.user_id === user?.id && (
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                      title="削除"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力フォーム */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {user ? (
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                送信
              </button>
            </form>
          ) : (
            <div className="text-center text-gray-600">
              ログインするとメッセージを送信できます
            </div>
          )}
        </div>
      </div>
    </div>
  );
}