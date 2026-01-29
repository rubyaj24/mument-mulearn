export type Role =
  | "participant"
  | "buddy"
  | "campus_coordinator"
  | "qa_foreman"
  | "qa_watcher"
  | "admin"

export interface UserProfile {
  id: string
  full_name: string
  role: Role
  district_id: string
  campus_id?: string
  created_at?: string
}
