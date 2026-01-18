import { APIMatch, MatchDetail, Sport } from '../types';

const BASE_URL = 'https://livesport.su/api';

/**
 * Helper to handle fetch responses
 */
async function fetchJson<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`[API] Fetching: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[API] HTTP Error ${response.status} for ${url}`);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`[API] Response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Network/Parse Error for ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  /**
   * Get all available sports categories
   */
  getSports: async () => {
    const data = await fetchJson<any>('/sports');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.sports)) return data.sports;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn('[API] Unexpected format for getSports:', data);
    return [];
  },

  /**
   * Get all matches (used for search)
   */
  getAllMatches: async () => {
    const data = await fetchJson<any>('/matches');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.matches)) return data.matches;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn('[API] Unexpected format for getAllMatches:', data);
    return [];
  },

  /**
   * Get all live matches
   */
  getLiveMatches: async () => {
    const data = await fetchJson<any>('/matches/live');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.matches)) return data.matches;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn('[API] Unexpected format for getLiveMatches:', data);
    return [];
  },

  /**
   * Get today's matches
   */
  getTodayMatches: async () => {
    const data = await fetchJson<any>('/matches/all-today');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.matches)) return data.matches;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn('[API] Unexpected format for getTodayMatches:', data);
    return [];
  },

  /**
   * Get popular matches
   */
  getPopularMatches: async () => {
    const data = await fetchJson<any>('/matches/popular');
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.matches)) return data.matches;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn('[API] Unexpected format for getPopularMatches:', data);
    return [];
  },

  /**
   * Get matches for a specific sport
   */
  getMatchesBySport: async (sportId: string) => {
    const data = await fetchJson<any>(`/matches/${sportId}`);
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.matches)) return data.matches;
    if (data && Array.isArray(data.data)) return data.data;
    console.warn(`[API] Unexpected format for getMatchesBySport(${sportId}):`, data);
    return [];
  },

  /**
   * Get match details including streams
   */
  getMatchDetail: async (matchId: string) => {
    const data = await fetchJson<any>(`/matches/${matchId}/detail`);
    // Handle various API response structures
    if (data && data.id) return data; // Direct object
    if (data && data.match && data.match.id) return data.match; // Wrapped in match
    if (data && data.data && data.data.id) return data.data; // Wrapped in data
    
    console.warn(`[API] Unexpected format for getMatchDetail(${matchId}):`, data);
    return data;
  },
};