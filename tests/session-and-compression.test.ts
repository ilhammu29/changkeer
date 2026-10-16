import { describe, it, expect } from 'vitest';
import { validateImageSize, compressImage } from '../lib/utils/image-compression';
import { safeParseCustomerSession } from '../lib/auth/session-helpers';

describe('Image Compression & Size Validation Tests', () => {
  it('accepts files under 5MB', () => {
    // 3MB mock file
    const file = new File([new ArrayBuffer(3 * 1024 * 1024)], 'profile.jpg', { type: 'image/jpeg' });
    const result = validateImageSize(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('strictly rejects files exceeding 5MB limit', () => {
    // 5.5MB mock file
    const file = new File([new ArrayBuffer(5.5 * 1024 * 1024)], 'large-banner.jpg', { type: 'image/jpeg' });
    const result = validateImageSize(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Maksimal ukuran file adalah 5MB');
  });

  it('rejects files over 5MB in compressImage call', async () => {
    const file = new File([new ArrayBuffer(6 * 1024 * 1024)], 'too-large.png', { type: 'image/png' });
    await expect(compressImage(file)).rejects.toThrow('Maksimal ukuran file adalah 5MB');
  });

  it('safely handles non-browser SSR environment without hanging', async () => {
    const file = new File([new ArrayBuffer(50 * 1024)], 'small-avatar.png', { type: 'image/png' });
    const res = await compressImage(file);
    expect(res.file).toBeDefined();
    expect(res.originalSize).toBe(50 * 1024);
  });
});

describe('Safe Customer Session Parser Tests', () => {
  const sampleProfile = {
    id: 'user-123',
    email: 'dewi.lestari@gmail.com',
    full_name: 'Dewi Lestari',
    phone_number: '081234567890',
    preferred_sweetness: '0%',
    preferred_temperature: 'iced',
  };

  it('parses valid raw JSON strings', () => {
    const raw = JSON.stringify(sampleProfile);
    const parsed = safeParseCustomerSession(raw);
    expect(parsed).not.toBeNull();
    expect(parsed?.email).toBe('dewi.lestari@gmail.com');
    expect(parsed?.full_name).toBe('Dewi Lestari');
  });

  it('parses URL-encoded JSON strings', () => {
    const encoded = encodeURIComponent(JSON.stringify(sampleProfile));
    const parsed = safeParseCustomerSession(encoded);
    expect(parsed).not.toBeNull();
    expect(parsed?.email).toBe('dewi.lestari@gmail.com');
  });

  it('safely handles unescaped percent signs without throwing URIError', () => {
    // This is the exact bug that caused PATCH /api/auth/customer/profile to fail with 401:
    // A string containing unescaped '%' such as {"preferred_sweetness":"0%"}
    const malformed = `{"id":"user-1","email":"dewi@example.com","preferred_sweetness":"0%","full_name":"Dewi"}`;
    const parsed = safeParseCustomerSession(malformed);
    expect(parsed).not.toBeNull();
    expect(parsed?.email).toBe('dewi@example.com');
  });

  it('returns null for null, empty or invalid session data', () => {
    expect(safeParseCustomerSession(null)).toBeNull();
    expect(safeParseCustomerSession(undefined)).toBeNull();
    expect(safeParseCustomerSession('')).toBeNull();
    expect(safeParseCustomerSession('not-json-at-all')).toBeNull();
    expect(safeParseCustomerSession('{"foo":"bar"}')).toBeNull(); // Missing email
  });
});
