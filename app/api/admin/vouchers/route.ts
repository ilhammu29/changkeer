import { NextRequest, NextResponse } from 'next/server';
import { getAllVouchersAdmin, createVoucher, updateVoucher, deleteVoucher } from '@/lib/data/vouchers';
import { voucherSchema } from '@/lib/validation/schemas';

export async function GET() {
  try {
    const vouchers = await getAllVouchersAdmin();
    return NextResponse.json(vouchers);
  } catch (err: any) {
    console.error('API Error GET /api/admin/vouchers:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil data voucher' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = voucherSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi voucher gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const created = await createVoucher(parsed.data as any);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('API Error POST /api/admin/vouchers:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal membuat voucher' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Voucher ID diperlukan' }, { status: 400 });
    }

    const updated = await updateVoucher(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Voucher tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('API Error PATCH /api/admin/vouchers:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui voucher' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Voucher ID diperlukan' }, { status: 400 });
    }

    const success = await deleteVoucher(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    console.error('API Error DELETE /api/admin/vouchers:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus voucher' },
      { status: 500 }
    );
  }
}
