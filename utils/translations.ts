// Helper function to get nested values from translation objects
export function getTranslation(obj: any, path: string, defaultValue: string = ''): string {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return defaultValue;
    }
  }
  
  return result || defaultValue;
}

// Type-safe translation access example
// Instead of: messages.section.subsection?.item || 'default'
// Use: t(messages, 'section.subsection.item', 'default')
export function t(messages: any, path: string, defaultValue: string = ''): string {
  return getTranslation(messages, path, defaultValue);
} 