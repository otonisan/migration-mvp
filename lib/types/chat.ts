export interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface ChatMessageWithProfile extends ChatMessage {
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}