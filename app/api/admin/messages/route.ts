import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { getContactMessagesAdmin } from '@/lib/data/contact';

export async function GET() {
  try {
    const messages = await getContactMessagesAdmin();
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, is_read } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pesan diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pesan diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
