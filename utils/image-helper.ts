/**
 * Adds a stable version parameter to image URLs for caching
 */
export const getVersionedImageUrl = (url: string) => {
  if (!url) return url;
  
  // Use a stable version number instead of timestamp
  // This ensures the same URL is generated across page loads
  const version = process.env.NEXT_PUBLIC_IMAGE_VERSION || '1.0';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${version}`;
};

/**
 * Checks if an image URL is valid
 */
export const isValidImageUrl = (url: string) => {
  if (!url) return false;
  return url.trim().length > 0 && url.startsWith('http');
}; 