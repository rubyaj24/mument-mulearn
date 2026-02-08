'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCheckpointsForExport() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('checkpoints')
            .select(`
                *,
                teams:team_id (
                    id,
                    team_name
                ),
                colleges:campus_id (
                    id,
                    name
                )
            `)
            .order('created_at', { ascending: false })
            .limit(1000)

        if (error) {
            console.error('Error fetching checkpoints for export:', error)
            return null
        }

        // Fetch buddy names for all checkpoints
        if (data && data.length > 0) {
            const buddyIds = [...new Set(data.map(c => c.buddy_id))]
            
            // Fetch from buddies table
            const { data: buddies } = await supabase
                .from('buddies')
                .select('id, name')
                .in('id', buddyIds)
            
            const buddyMap = new Map((buddies || []).map(b => [b.id, b.name]))
            
            // For buddy_ids not found in buddies table, fetch from profiles
            const missingIds = buddyIds.filter(id => !buddyMap.has(id))
            
            if (missingIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', missingIds)
                
                ;(profiles || []).forEach((p) => {
                    buddyMap.set(p.id, p.full_name || 'Unknown')
                })
            }
            
            // Add buddy name to each checkpoint
            return data.map((cp: any) => ({
                ...cp,
                buddy_name: buddyMap.get(cp.buddy_id) || 'Unknown'
            }))
        }

        return data
    } catch (error) {
        console.error('Failed to fetch checkpoints:', error)
        return null
    }
}
