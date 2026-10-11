export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const isConfigured = Boolean(
    url &&
    anonKey &&
    !url.includes('placeholder') &&
    !anonKey.includes('placeholder')
  );

  return {
    url: url || 'https://placeholder-changkeer.supabase.co',
    anonKey: anonKey || 'placeholder-anon-key',
    serviceKey,
    isConfigured,
  };
}
