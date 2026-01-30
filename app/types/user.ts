import { Database } from "./database.types"

export type Role = Database["public"]["Enums"]["user_role"]

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"] & {
  district_name?: string | undefined
  campus_name?: string | undefined
}
