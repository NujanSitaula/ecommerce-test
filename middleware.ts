import { NextRequest, NextResponse } from 'next/server';

// Protect checkout on the edge to avoid showing it to unauthenticated users.
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // If no token, redirect to home with a flag we can use to open login modal client-side.
  if (!token) {
    const url = request.nextUrl.clone();
    // Preserve locale segment (first pathname part)
    const segments = url.pathname.split('/').filter(Boolean);
    const lang = segments[0] || 'en';
    url.pathname = `/${lang}`;
    url.searchParams.set('login', '1');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:lang/checkout',
  ],
};


