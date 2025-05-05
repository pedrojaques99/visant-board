/**
 * Adds a cache-busting parameter to image URLs
 */
export const getVersionedImageUrl = (url: string) => {
  if (!url) return url;
  
  // Add a timestamp as a query parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
};

/**
 * Checks if an image URL is valid
 */
export const isValidImageUrl = (url: string) => {
  if (!url) return false;
  return url.trim().length > 0 && url.startsWith('http');
}; 