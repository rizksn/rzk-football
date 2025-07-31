import { auth } from "@/utils/firebase";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const token = await user.getIdToken(true);

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  const fetchOptions = { ...options, headers };

  return fetch(url, fetchOptions);
}
