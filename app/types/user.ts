export type Role =
  | "participant"
  | "buddy"
  | "campus_coordinator"
  | "qa_foreman"
  | "qa_watcher"
  | "qa_lead"
  | "admin"

export interface UserProfile {
  id: string
  full_name: string
  role: Role
  district_id: string
  district_name?: string | undefined
  campus_id?: string
  campus_name?: string | undefined
  created_at?: string
}
