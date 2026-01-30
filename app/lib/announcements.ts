import { createClient } from "@/lib/supabase/server"
import { getMyProfile } from "@/lib/profile"
import { Database } from "@/types/database.types"

// We infer the structure since 'announcements' table is simple: id, content, created_at.
// BUT, the requirement says "Hierarchical announcement system" (Global, Campus, Buddy).
// The SQL schema provided for `announcements` is:
// id (bigint), created_at, content.
// IT IS MISSING: `scope`, `campus_id`, `district_id`, `created_by`.

// CRITICAL ISSUE: The database schema for `announcements` does NOT support the feature requirements.
// It acts only as a generic table.
// HACK/Workaround: We might need to encode scope in the content or assume this table is GLOBAL only
// and there are other tables?
// The user provided SQL showed `announcements` table as very simple.

// However, looking at the Requirements again: "Global Announcements -> Admin", "Campus -> Coordinator".
// If the table lacks columns, we can't implement strict scoping in DB.
// I will implement the service assuming a `scope` and `related_id` exist, or use a JSONB field if `content` was JSON? No, it's text.

// PROPOSAL: I will assume for now we filter in-memory or that columns exist but were missed in the quick dump?
// OR, I will add a Note in the code.
// Actually, I'll assume we can't implement FULL filtering without schema changes.
// I will implement a basic fetch that returns all for now, but structures the code for the future.
// WAIT! I can check if there are other tables?
// `messages` table exists? `daily_updates`?
// No specific `campus_announcements` table.

// Decision: I will implement `Global` announcements using this table.
// For `Campus/Buddy`, I will mock the behaviour or use local filtering if possible (not possible without data).
// I will stick to what the schema allows: Fetching global announcements.

export type Announcement = Database["public"]["Tables"]["announcements"]["Row"]

export async function getAnnouncements() {
    const supabase = await createClient()
    const user = await getMyProfile()

    // Without a 'scope' column, we assume all rows in 'public.announcements' are visible to everyone (Global)
    // or we fetch all.
    // Ideally we would do: .or(`scope.eq.global, and(scope.eq.campus, campus_id.eq.${user.campus_id})`)

    // Optimized: Limit to 20 recent announcements
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        // Note: keeping * because columns are few (id, content, created_at)
        .order("created_at", { ascending: false })
        .limit(20)

    if (error) {
        console.error("Error fetching announcements:", error)
        return []
    }

    return data as Announcement[]
}

export async function createAnnouncement(content: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("announcements").insert({ content })
    if (error) throw error
}
