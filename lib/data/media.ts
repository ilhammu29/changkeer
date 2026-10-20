import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { MediaAsset } from '@/types';

const localMedia: MediaAsset[] = [
  {
    id: 'm1',
    bucket: 'product-images',
    file_path: 'products/start-of-spring.jpg',
    file_name: 'start-of-spring.jpg',
    file_size: 719122,
    mime_type: 'image/jpeg',
    alt_text: 'Kemasan teh herbal First Bloom (Start of Spring) CHANGKEER',
    public_url: '/images/products/start-of-spring.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    bucket: 'product-images',
    file_path: 'products/start-of-summer.jpg',
    file_name: 'start-of-summer.jpg',
    file_size: 876287,
    mime_type: 'image/jpeg',
    alt_text: 'Kemasan teh herbal Hibiscus Sun (Start of Summer) CHANGKEER',
    public_url: '/images/products/start-of-summer.jpg',
    created_at: new Date().toISOString(),
  },
];

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return localMedia;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media assets:', error);
      return localMedia;
    }
    return (data as MediaAsset[]) || [];
  } catch (err) {
    console.error('Failed to get media assets:', err);
    return localMedia;
  }
}
