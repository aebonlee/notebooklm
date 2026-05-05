/**
 * boardStorage.ts
 * 게시판 CRUD — nlm_board_posts 테이블
 */

import getSupabase, { TABLES } from './supabase';

export interface BoardPost {
  id: number;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBoardPostData {
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
}

export async function getBoardPosts(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: BoardPost[]; count: number }> {
  const client = getSupabase();
  if (!client) return { data: [], count: 0 };

  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = client
    .from(TABLES.board_posts)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category);
  }

  if (options?.search) {
    const pattern = `%${options.search}%`;
    query = query.or(`title.ilike.${pattern},content.ilike.${pattern}`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error('getBoardPosts error:', error);
    return { data: [], count: 0 };
  }
  return { data: (data || []) as BoardPost[], count: count || 0 };
}

export async function getBoardPost(id: number): Promise<BoardPost | null> {
  const client = getSupabase();
  if (!client) return null;

  // 조회수 증가
  try {
    await client.rpc('increment_views', { row_id: id, table_name: TABLES.board_posts });
  } catch { /* ignore */ }

  const { data, error } = await client
    .from(TABLES.board_posts)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getBoardPost error:', error);
    return null;
  }
  return data as BoardPost | null;
}

export async function createBoardPost(post: CreateBoardPostData): Promise<BoardPost | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from(TABLES.board_posts)
    .insert(post)
    .select()
    .single();

  if (error) {
    console.error('createBoardPost error:', error);
    return null;
  }
  return data as BoardPost;
}

export async function updateBoardPost(id: number, updates: Partial<Pick<BoardPost, 'title' | 'content' | 'category'>>): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from(TABLES.board_posts)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('updateBoardPost error:', error);
    return false;
  }
  return true;
}

export async function deleteBoardPost(id: number): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from(TABLES.board_posts)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteBoardPost error:', error);
    return false;
  }
  return true;
}
