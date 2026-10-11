import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { ContactFormData } from '@/lib/validation/schemas';
import { ContactMessage } from '@/types';

// In-memory store for fallback development when remote DB is not yet plugged in
const localMessages: ContactMessage[] = [];

export async function saveContactMessage(
  data: ContactFormData,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // In local dev without live database credentials, store in memory safely
    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      is_read: false,
      ip_address: ipAddress || null,
      created_at: new Date().toISOString(),
    };
    localMessages.unshift(newMessage);
    return { success: true };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      ip_address: ipAddress || null,
    });

    if (error) {
      console.error('Error inserting contact message:', error);
      return { success: false, error: 'Gagal menyimpan pesan ke database' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Failed to save contact message:', err);
    return { success: false, error: err.message || 'Terjadi kesalahan sistem' };
  }
}

export async function getContactMessagesAdmin(): Promise<ContactMessage[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return localMessages;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return localMessages;
    }
    return (data as ContactMessage[]) || [];
  } catch (err) {
    console.error('Failed to get contact messages:', err);
    return localMessages;
  }
}
