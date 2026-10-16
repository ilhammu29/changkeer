import { CustomerProfile } from '@/types';

/**
 * Safely parses customer session JSON from cookies, headers, or localStorage.
 * Handles:
 * 1. Already decoded JSON strings (containing literal '%' like "0%", "50%", "100%")
 * 2. URL-encoded JSON strings
 * 3. Malformed percent-encoded sequences by cleaning unescaped '%' characters
 */
export function safeParseCustomerSession(raw: string | undefined | null): CustomerProfile | null {
  if (!raw || typeof raw !== 'string') return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Try direct JSON parse
  try {
    const direct = JSON.parse(trimmed);
    if (direct && typeof direct === 'object' && direct.email) {
      return direct as CustomerProfile;
    }
  } catch {}

  // 2. Try decodeURIComponent then JSON parse
  try {
    const decoded = decodeURIComponent(trimmed);
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed as CustomerProfile;
    }
  } catch {}

  // 3. Fix unescaped '%' characters before decodeURIComponent (e.g., preferred_sweetness: "0%")
  try {
    const cleaned = trimmed.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
    const decoded = decodeURIComponent(cleaned);
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed as CustomerProfile;
    }
  } catch {}

  return null;
}
