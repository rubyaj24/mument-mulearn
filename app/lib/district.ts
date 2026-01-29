import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Fetch district name from `districts` table using district id.
 * Uses `maybeSingle()` so a 0-row result does not throw PGRST116.
 * Returns the name string or null on error/not found.
 */
export async function getDistrictName(
  supabase: SupabaseClient,
  districtId?: string | null
): Promise<string | null> {
  if (!districtId) return null

  const { data, error } = await supabase
    .from('districts')
    .select('name')
    .eq('id', districtId)
    .maybeSingle()

  if (error) {
    console.error('getDistrictName error:', error)
    return null
  }

  return data?.name ?? null
}
