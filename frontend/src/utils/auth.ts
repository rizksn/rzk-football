import { auth } from "@/utils/firebase";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const persistUser = async () => {
  try {
    const res = await fetchWithAuth(`${BACKEND_URL}/api/auth/persist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
