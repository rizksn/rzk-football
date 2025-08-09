import { auth } from "@/utils/firebase";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let token = await user.getIdToken();

  const doFetch = async (jwt: string) => {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${jwt}`);

    const fetchOptions: RequestInit = {
      ...options,
      headers,
      cache: "no-store",
    };
    return fetch(url, fetchOptions);
  };

  let res = await doFetch(token);

  if (res.status === 401) {
    token = await user.getIdToken(true);
    res = await doFetch(token);
  }

  return res;
}
