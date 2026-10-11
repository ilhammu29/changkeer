import { describe, it, expect } from 'vitest';
import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('Admin Authentication & Route Protection Middleware', () => {
  it('redirects unauthenticated visitor requesting /admin to /admin/login', () => {
    const req = new NextRequest('http://localhost:3000/admin');
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/admin/login');
  });

  it('redirects unauthenticated visitor requesting /admin/products to /admin/login with redirect query', () => {
    const req = new NextRequest('http://localhost:3000/admin/products');
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/admin/login?redirect=%2Fadmin%2Fproducts');
  });

  it('blocks unauthenticated requests to /api/admin/products with HTTP 401 JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Hacked Tea' }),
    });
    const res = middleware(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Akses tidak sah');
  });

  it('blocks unauthenticated requests to /api/admin/messages with HTTP 401 JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/messages');
    const res = middleware(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it('allows access to public auth endpoint /api/admin/auth/login without redirect', () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
    });
    const res = middleware(req);
    // When next() is returned, status is 200 (pass-through)
    expect(res.status).toBe(200);
  });

  it('allows access to /admin/login without redirect', () => {
    const req = new NextRequest('http://localhost:3000/admin/login');
    const res = middleware(req);
    expect(res.status).toBe(200);
  });

  it('allows access to /admin when authenticated dev session cookie is present', () => {
    const req = new NextRequest('http://localhost:3000/admin', {
      headers: {
        cookie: 'changkeer_admin_session=dev_authorized',
      },
    });
    const res = middleware(req);
    expect(res.status).toBe(200);
  });
});
