/**
 * resourceStorage.ts
 * 자료실 CRUD — nlm_resources 테이블
 */

import getSupabase, { TABLES } from './supabase';

export interface Resource {
  id: number;
  title: string;
  title_en?: string;
  description: string;
  file_url?: string;
  external_url?: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export async function getResources(category?: string): Promise<Resource[]> {
  const client = getSupabase();
  if (!client) return [];

  let query = client
    .from(TABLES.resources)
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getResources error:', error);
    return [];
  }
  return (data || []) as Resource[];
}

export async function createResource(resource: Omit<Resource, 'id' | 'created_at'>): Promise<Resource | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from(TABLES.resources)
    .insert(resource)
    .select()
    .single();

  if (error) {
    console.error('createResource error:', error);
    return null;
  }
  return data as Resource;
}

export async function updateResource(id: number, updates: Partial<Resource>): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from(TABLES.resources)
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('updateResource error:', error);
    return false;
  }
  return true;
}

export async function deleteResource(id: number): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from(TABLES.resources)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteResource error:', error);
    return false;
  }
  return true;
}
