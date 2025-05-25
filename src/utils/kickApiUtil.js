/**
 * Kick.com API Utility
 * 
 * Provides functions to fetch live stream data from Kick.com
 */

// Kick.com API configuration
const KICK_USERNAME = import.meta.env.KICK_USERNAME || process.env.KICK_USERNAME || 'nosytlabs';
const KICK_API_BASE = 'https://kick.com/api/v2';

/**
 * Fetches user data from Kick.com
 * @param {string} username - Kick.com username
 * @returns {Promise<Object>} - User data including stream status
 */
export async function fetchKickUserData(username = KICK_USERNAME) {
  try {
    const response = await fetch(`${KICK_API_BASE}/channels/${username}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NosytLabs-Website/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Kick API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      username: data.user?.username || username,
      displayName: data.user?.username || username,
      bio: data.user?.bio || '',
      avatar: data.user?.profile_pic || '',
      banner: data.banner?.url || '',
      isLive: data.livestream !== null,
      streamTitle: data.livestream?.session_title || '',
      streamThumbnail: data.livestream?.thumbnail || '',
      viewerCount: data.livestream?.viewer_count || 0,
      followers: data.followers_count || 0,
      streamUrl: `https://kick.com/${username}`,
      embedUrl: `https://player.kick.com/${username}`,
      lastStreamAt: data.livestream?.created_at || null,
      source: 'kick-api'
    };
  } catch (error) {
    console.warn('Kick.com API error:', error.message);
    
    // Return fallback data
    return {
      username: username,
      displayName: username,
      bio: 'Live streaming on Kick.com',
      isLive: false,
      streamTitle: 'Check out my stream!',
      viewerCount: 0,
      followers: 0,
      streamUrl: `https://kick.com/${username}`,
      embedUrl: `https://player.kick.com/${username}`,
      source: 'fallback',
      error: error.message
    };
  }
}

/**
 * Fetches recent clips from a Kick.com channel
 * @param {string} username - Kick.com username
 * @param {number} limit - Number of clips to fetch (default: 10)
 * @returns {Promise<Array>} - Array of clip objects
 */
export async function fetchKickClips(username = KICK_USERNAME, limit = 10) {
  try {
    const response = await fetch(`${KICK_API_BASE}/channels/${username}/clips?limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NosytLabs-Website/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Kick API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data.map(clip => ({
      id: clip.id,
      title: clip.title,
      duration: clip.duration,
      viewCount: clip.views,
      thumbnail: clip.thumbnail_url,
      url: clip.clip_url,
      createdAt: clip.created_at,
      category: clip.category?.name || 'Gaming',
      source: 'kick-api'
    }));
  } catch (error) {
    console.warn('Kick.com clips API error:', error.message);
    return [];
  }
}

/**
 * Checks if a Kick.com user is currently live
 * @param {string} username - Kick.com username
 * @returns {Promise<boolean>} - True if live, false otherwise
 */
export async function isKickUserLive(username = KICK_USERNAME) {
  try {
    const userData = await fetchKickUserData(username);
    return userData.isLive;
  } catch (error) {
    console.warn('Error checking Kick.com live status:', error.message);
    return false;
  }
}

/**
 * Gets live stream embed URL for Kick.com
 * @param {string} username - Kick.com username
 * @param {Object} options - Embed options
 * @returns {string} - Embed URL
 */
export function getKickEmbedUrl(username = KICK_USERNAME, options = {}) {
  const {
    autoplay = false,
    muted = false,
    quality = 'auto'
  } = options;

  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', 'true');
  if (muted) params.append('muted', 'true');
  if (quality !== 'auto') params.append('quality', quality);

  const queryString = params.toString();
  return `https://player.kick.com/${username}${queryString ? '?' + queryString : ''}`;
}

/**
 * Formats viewer count for display
 * @param {number} count - Raw viewer count
 * @returns {string} - Formatted count (e.g., "1.2K", "5.6M")
 */
export function formatViewerCount(count) {
  if (count < 1000) return count.toString();
  if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
  return (count / 1000000).toFixed(1) + 'M';
}

/**
 * Gets stream status text
 * @param {boolean} isLive - Whether the stream is live
 * @param {number} viewerCount - Current viewer count
 * @returns {string} - Status text
 */
export function getStreamStatus(isLive, viewerCount = 0) {
  if (isLive) {
    return `🔴 LIVE with ${formatViewerCount(viewerCount)} viewers`;
  }
  return '⚫ Offline';
}
