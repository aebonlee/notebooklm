/**
 * searchStorage.ts
 * 통합 검색 — board/gallery ilike 병렬 검색 (nlm_ prefix)
 */

import type { SearchResults, SearchResultItem } from '../types';
import getSupabase from './supabase';

function toCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function toCamel(row: Record<string, unknown> | null): SearchResultItem | null {
  if (!row) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[toCamelKey(k)] = v;
  }
  return out as unknown as SearchResultItem;
}

/**
 * 통합 검색: nlm_board_posts, nlm_gallery_items에서 ilike 병렬 검색
 */
export async function searchAll(query: string): Promise<SearchResults> {
  const client = getSupabase();
  if (!client || !query.trim()) {
    return { blog: [], board: [], gallery: [] };
  }

  const pattern = `%${query.trim()}%`;

  const [boardRes, galleryRes] = await Promise.all([
    client
      .from('nlm_board_posts')
      .select('id, title, category, author_name, created_at')
      .or(`title.ilike.${pattern},content.ilike.${pattern}`)
      .order('id', { ascending: false })
      .limit(5),
    client
      .from('nlm_gallery_items')
      .select('id, title, title_en, description, category, date')
      .or(`title.ilike.${pattern},title_en.ilike.${pattern},description.ilike.${pattern}`)
      .order('id', { ascending: false })
      .limit(5)
  ]);

  return {
    blog: [],
    board: (boardRes.data || []).map(r => toCamel(r as unknown as Record<string, unknown>)!),
    gallery: (galleryRes.data || []).map(r => toCamel(r as unknown as Record<string, unknown>)!)
  };
}
