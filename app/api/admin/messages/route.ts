import { NextRequest, NextResponse } from 'next/server';
import {
  getContactMessagesAdmin,
  deleteContactMessage,
  updateContactMessageRead,
} from '@/lib/data/contact';
import { verifyAdminOrUnauthorized } from '@/lib/auth/session';

export async function GET() {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const messages = await getContactMessagesAdmin();
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { id, is_read } = body;

    if (!id || typeof is_read !== 'boolean') {
      return NextResponse.json({ success: false, error: 'ID pesan dan status baca diperlukan' }, { status: 400 });
    }

    const ok = await updateContactMessageRead(id, is_read);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Gagal memperbarui status pesan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID pesan diperlukan' }, { status: 400 });
    }

    const ok = await deleteContactMessage(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Gagal menghapus pesan' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
