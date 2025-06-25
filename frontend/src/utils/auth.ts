import { auth } from "@/utils/firebase";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const persistUser = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const token = await user.getIdToken();

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/persist`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error("❌ Failed to persist user. Status:", res.status);
    } else {
      console.log("✅ User persisted");
    }
  } catch (err) {
    console.error("❌ Error hitting /auth/persist:", err);
  }
};