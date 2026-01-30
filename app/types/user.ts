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
  district_id?: string | null
  district_name?: string | undefined
  campus_id?: string | null
  campus_name?: string | undefined
}
