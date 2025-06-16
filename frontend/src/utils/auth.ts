import { auth } from "@/utils/firebase"

export const persistUser = async () => {
  const user = auth.currentUser
  if (!user) return

  const token = await user.getIdToken()

  await fetch("/api/auth/persist", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}