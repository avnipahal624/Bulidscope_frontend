const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://buildscope-backend.onrender.com/api').replace(/\/$/, '');

export async function searchLiveHackathons(query, limit = 12) {
  const params = new URLSearchParams({ query, limit: String(limit) });
  const response = await fetch(`${API_BASE_URL}/hackathons/search?${params}`);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || `Live search failed (HTTP ${response.status}).`);
  return payload;
}
