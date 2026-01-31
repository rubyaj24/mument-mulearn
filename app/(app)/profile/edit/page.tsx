import { redirect } from "next/navigation"
import { getMyProfile, getDistricts, getColleges } from "@/lib/profile"
import EditProfileForm from "../components/EditProfileForm"

export default async function EditProfilePage() {
  const profile = await getMyProfile()
  if (!profile) redirect("/login")

  const districts = await getDistricts()
  const colleges = await getColleges()

  return <EditProfileForm profile={profile} districts={districts} colleges={colleges} />
}
