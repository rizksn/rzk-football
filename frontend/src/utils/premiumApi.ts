import { fetchWithAuth } from "./fetchWithAuth"; // import your auth-fetch helper

export async function fetchPremiumFeature() {
  try {
    const res = await fetchWithAuth("/api/premium-feature");
    if (res.status === 403) {
      alert("You must be a subscriber to use this feature.");
      // Optionally redirect to subscription page, e.g.:
      // window.location.href = "/subscribe";
      return null;
    }
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch (error) {
    console.error("Failed to load premium feature:", error);
    return null;
  }
}
