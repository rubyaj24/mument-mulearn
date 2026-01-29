import { Role } from "@/types/user"

export function hasRole(role: Role, allowed: Role[]) {
  return allowed.includes(role)
}

export const permissions = {
  canManageCheckpoints(role: Role) {
    return ["buddy", "campus_coordinator", "admin"].includes(role)
  },

  canViewFeedbackInbox(role: Role) {
    return ["qa_foreman", "qa_watcher", "qa_lead", "admin"].includes(role)
  },

  canCreateAnnouncements(role: Role) {
    return ["campus_coordinator", "admin"].includes(role)
  },

  canCreateGlobalAnnouncements(role: Role) {
    return role === "admin"
  },

  canPromoteUsers(role: Role) {
    return role === "admin" || role === "campus_coordinator"
  },
}
