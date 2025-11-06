import { createClient } from '@/lib/supabase/client';
import type { Post, PostComment, CreatePostData } from '@/lib/types/post';

const supabase = createClient();

// 投稿一覧取得（タイムライン）
export async function getPosts(limit = 20, offset = 0) {
  const { data: { user } } = await supabase.auth.getUser();
  
  // 投稿を取得
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Posts fetch error:', error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // ユーザー情報を取得
  const userIds = [...new Set(posts.map((p: { user_id: string | null }) => p.user_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  // エリア情報を取得
  const areaIds = [...new Set(posts.map(p => p.area_id).filter(Boolean))];
  const { data: areas } = await supabase
    .from('areas')
    .select('id, name')
    .in('id', areaIds);

  // いいね情報を取得
  let likedPostIds = new Set<string>();
  if (user) {
    const postIds = posts.map(p => p.id);
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds);
    likedPostIds = new Set(likes?.map(l => l.post_id) || []);
  }

  // データを結合
  return posts.map(post => {
    const profile = profiles?.find(p => p.id === post.user_id);
    const area = areas?.find(a => a.id === post.area_id);
    
    return {
      ...post,
      user: profile ? {
        id: profile.id,
        email: '',
        user_metadata: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      } : undefined,
      area: area ? {
        id: area.id,
        name: area.name,
        display_name: area.name, // nameをdisplay_nameとして使う
      } : undefined,
      is_liked: likedPostIds.has(post.id),
    } as Post;
  });
}

// エリアでフィルター
export async function getPostsByArea(areaId: string, limit = 20, offset = 0) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('area_id', areaId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Posts fetch error:', error);
    return [];
  }

  if (!posts || posts.length === 0) {
    return [];
  }

  // ユーザー情報を取得
const userIds = [...new Set(posts.map((p: { user_id: string | null }) => p.user_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  // エリア情報を取得
  const { data: area } = await supabase
    .from('areas')
    .select('id, name')
    .eq('id', areaId)
    .single();

  // いいね情報を取得
  let likedPostIds = new Set<string>();
  if (user) {
    const postIds = posts.map(p => p.id);
    const { data: likes } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds);
    likedPostIds = new Set(likes?.map(l => l.post_id) || []);
  }

  return posts.map(post => {
    const profile = profiles?.find(p => p.id === post.user_id);
    
    return {
      ...post,
      user: profile ? {
        id: profile.id,
        email: '',
        user_metadata: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      } : undefined,
      area: area ? {
        id: area.id,
        name: area.name,
        display_name: area.name,
      } : undefined,
      is_liked: likedPostIds.has(post.id),
    } as Post;
  });
}

// 投稿作成
export async function createPost(data: CreatePostData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return post as Post;
}

// 投稿削除
export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) throw error;
}

// いいね追加
export async function likePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error: likeError } = await supabase
    .from('post_likes')
    .insert({
      post_id: postId,
      user_id: user.id,
    });

  if (likeError) throw likeError;

  const { data: post } = await supabase
    .from('posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  await supabase
    .from('posts')
    .update({ likes_count: (post?.likes_count || 0) + 1 })
    .eq('id', postId);
}

// いいね削除
export async function unlikePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error: unlikeError } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (unlikeError) throw unlikeError;

  const { data: post } = await supabase
    .from('posts')
    .select('likes_count')
    .eq('id', postId)
    .single();

  await supabase
    .from('posts')
    .update({ likes_count: Math.max((post?.likes_count || 0) - 1, 0) })
    .eq('id', postId);
}

// コメント一覧取得
export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  if (!data || data.length === 0) {
    return [];
  }

  // ユーザー情報を取得
 const userIds = [...new Set(data.map((c: { user_id: string | null }) => c.user_id).filter(Boolean))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds);

  return data.map(comment => {
    const profile = profiles?.find(p => p.id === comment.user_id);
    
    return {
      ...comment,
      user: profile ? {
        id: profile.id,
        email: '',
        user_metadata: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      } : undefined,
    } as PostComment;
  });
}

// コメント追加
export async function addComment(postId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: comment, error: commentError } = await supabase
    .from('post_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (commentError) throw commentError;

  const { data: post } = await supabase
    .from('posts')
    .select('comments_count')
    .eq('id', postId)
    .single();

  await supabase
    .from('posts')
    .update({ comments_count: (post?.comments_count || 0) + 1 })
    .eq('id', postId);

  // 現在のユーザーのプロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...comment,
    user: profile ? {
      id: profile.id,
      email: '',
      user_metadata: {
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      },
    } : undefined,
  } as PostComment;
}

// 動画アップロード
export async function uploadVideo(file: File, postId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${postId}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('post-videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('post-videos')
    .getPublicUrl(filePath);

  return publicUrl;
}