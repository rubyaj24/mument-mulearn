
import { getUsers, getReferenceData, UserFilters } from "@/lib/admin"
import { getMyProfile } from "@/lib/profile"
import { redirect } from "next/navigation"
import { Role } from "@/types/user"
import UserManagementTable from "./components/UserManagementTable"

export default async function AdminPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams
    const user = await getMyProfile()

    // Strict Admin Check
    if (!user || user.role !== "admin") {
        redirect("/dashboard")
    }

    const page = parseInt((searchParams.page as string) || "1")
    const limit = 50
    const offset = (page - 1) * limit

    const filters: UserFilters = {
        role: (searchParams.role as Role) || undefined,
        district_id: (searchParams.district_id as string) || undefined,
        campus_id: (searchParams.campus_id as string) || undefined,
        search: (searchParams.search as string) || undefined,
    }

    // Fetch data in parallel
    const [{ users, total }, refData] = await Promise.all([
        getUsers(filters, limit, offset),
        getReferenceData()
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="py-8 px-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
                <p className="text-slate-500">Manage users, roles, and platform settings.</p>
            </header>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
                    <div className="text-sm text-slate-400">
                        Total {total} users
                    </div>
                </div>
                <UserManagementTable
                    users={users}
                    districts={refData.districts}
                    campuses={refData.campuses}
                    currentPage={page}
                    totalPages={totalPages}
                />
            </section>
        </div>
    )
}
