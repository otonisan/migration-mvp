import { createClient } from '@/lib/supabase/client';
import type { ChatRoom, ChatMessage, ChatMessageWithProfile } from '@/lib/types/chat';

// チャットルーム一覧を取得
export async function getChatRooms(): Promise<ChatRoom[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// 特定のルームのメッセージを取得
export async function getRoomMessages(roomId: string): Promise<ChatMessageWithProfile[]> {
  const supabase = createClient();
  
  // まずメッセージを取得
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
  
  if (messagesError) throw messagesError;
  if (!messages || messages.length === 0) return [];
  
  // ユーザーIDを集める
  const userIds = [...new Set(messages.map(m => m.user_id))];
  
  // プロフィールを別途取得
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
  
  if (profilesError) throw profilesError;
  
  // メッセージとプロフィールを結合
  const messagesWithProfiles = messages.map(message => ({
    ...message,
    profiles: profiles?.find(p => p.id === message.user_id) || {
      full_name: 'Unknown User',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    }
  }));
  
  return messagesWithProfiles as ChatMessageWithProfile[];
}

// メッセージを送信
export async function sendMessage(roomId: string, content: string): Promise<ChatMessage> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      user_id: user.id,
      content
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// メッセージを削除
export async function deleteMessage(messageId: string): Promise<void> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('id', messageId)
    .eq('user_id', user.id); // 自分のメッセージのみ削除可能
  
  if (error) throw error;
}