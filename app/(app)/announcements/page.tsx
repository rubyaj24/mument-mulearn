import { permissions } from "@/lib/permissions"
import { Role } from "@/types/user"
import { getMyProfile } from "@/lib/profile"
import CreateAnnouncement from "./components/CreateAnnouncement"
import ViewAnnouncements from "./components/ViewAnnouncements"

export default async function AnnouncementsPage() {
    const profile = await getMyProfile()
    const role = profile?.role as Role | undefined
    const canCreate = role ? permissions.canCreateAnnouncements(role) : false

    return (
        <div>
            {canCreate && (
                <div className="mb-4">
                    <CreateAnnouncement />
                </div>
            )}
            <ViewAnnouncements />
        </div>
    )
}