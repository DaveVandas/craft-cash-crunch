/**
 * Client-side input validation utilities
 * These mirror server-side validation to prevent unnecessary API calls
 * and provide better UX with immediate feedback
 */

// Maximum length for name inputs
const MAX_NAME_LENGTH = 100;

// Pattern for valid celebrity names (letters, spaces, hyphens, apostrophes, periods)
const NAME_PATTERN = /^[a-zA-Z\s\-'.]+$/;

/**
 * Validates a celebrity name input
 * Returns the sanitized name or null if invalid
 */
export function validateCelebrityName(input: string | null | undefined): string | null {
  if (!input || typeof input !== 'string') return null;
  
  const trimmed = input.trim();
  
  // Check length constraints
  if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) {
    return null;
  }
  
  // Check character pattern
  if (!NAME_PATTERN.test(trimmed)) {
    return null;
  }
  
  return trimmed;
}

/**
 * Converts a URL slug (e.g., "elon-musk") to a display name ("Elon Musk")
 * Returns null if the slug is invalid
 */
export function slugToName(slug: string | undefined): string | null {
  if (!slug) return null;
  
  // Convert slug to name format
  const name = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  // Validate the resulting name
  return validateCelebrityName(name);
}

/**
 * Converts a name to a URL slug (e.g., "Elon Musk" -> "elon-musk")
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/**
 * Sanitizes a search query for display
 * Returns empty string if invalid (safe for display but won't be sent to API)
 */
export function sanitizeSearchQuery(query: string | null): string {
  if (!query) return '';
  
  const trimmed = query.trim();
  
  // For display purposes, limit length but allow any characters
  // The actual API call will use validateCelebrityName
  return trimmed.slice(0, MAX_NAME_LENGTH);
}
