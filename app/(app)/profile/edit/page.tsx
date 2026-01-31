import { redirect } from "next/navigation"
import { getMyProfile, getDistricts, getColleges } from "@/lib/profile"
import EditProfileForm from "../components/EditProfileForm"

export default async function EditProfilePage() {
  const currentUserProfile = await getMyProfile()
  if (!currentUserProfile) redirect("/login")

  const districts = await getDistricts()
  const colleges = await getColleges()

  return (
    <EditProfileForm
      profile={currentUserProfile}
      currentUserRole={currentUserProfile.role}
      districts={districts}
      colleges={colleges}
    />
  )
}
