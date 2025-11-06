export type PostType = 'text' | 'video';

export interface Post {
  id: string;
  user_id: string;
  content: string | null;
  type: PostType;
  area_id: string | null;
  vibe_tags: string[] | null;
  media_url: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // JOIN用
  user?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  area?: {
    id: string;
    name: string;
    display_name: string;
  };
  is_liked?: boolean; // 現在のユーザーがいいねしているか
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export interface CreatePostData {
  content?: string;
  type: PostType;
  area_id?: string;
  vibe_tags?: string[];
  media_url?: string;
  thumbnail_url?: string;
}