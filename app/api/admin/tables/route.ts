import { NextRequest, NextResponse } from 'next/server';
import { getAllCafeTablesAdmin, createCafeTable, updateCafeTable, deleteCafeTable } from '@/lib/data/tables';

export async function GET() {
  try {
    const tables = await getAllCafeTablesAdmin();
    return NextResponse.json(tables);
  } catch (err: any) {
    console.error('API Error GET /api/admin/tables:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil data meja' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table_number, capacity, description } = body;

    if (!table_number) {
      return NextResponse.json({ error: 'Nomor meja wajib diisi' }, { status: 400 });
    }

    const created = await createCafeTable({
      table_number,
      capacity: Number(capacity) || 2,
      description,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error('API Error POST /api/admin/tables:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal membuat meja cafe' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID meja diperlukan' }, { status: 400 });
    }

    const updated = await updateCafeTable(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Meja tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('API Error PATCH /api/admin/tables:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui meja' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID meja diperlukan' }, { status: 400 });
    }

    const success = await deleteCafeTable(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    console.error('API Error DELETE /api/admin/tables:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal menghapus meja' },
      { status: 500 }
    );
  }
}
