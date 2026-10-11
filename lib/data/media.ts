import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { MediaAsset } from '@/types';

const localMedia: MediaAsset[] = [
  {
    id: 'm1',
    bucket: 'product-images',
    file_path: 'products/changkeer-lemongrass-ginger.jpg',
    file_name: 'changkeer-lemongrass-ginger.jpg',
    file_size: 245000,
    mime_type: 'image/jpeg',
    alt_text: 'Kemasan teh herbal serai jahe CHANGKEER',
    public_url: '/images/products/changkeer-lemongrass-ginger.jpg',
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    bucket: 'product-images',
    file_path: 'products/changkeer-rosella-mint.jpg',
    file_name: 'changkeer-rosella-mint.jpg',
    file_size: 198000,
    mime_type: 'image/jpeg',
    alt_text: 'Kemasan tisane rosella mint CHANGKEER',
    public_url: '/images/products/changkeer-rosella-mint.jpg',
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
