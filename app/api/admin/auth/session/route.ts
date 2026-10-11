import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: admin.user,
    profile: admin.profile,
  });
}
