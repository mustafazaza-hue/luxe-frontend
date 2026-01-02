import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // الصفحات المحمية
  const protectedPaths = ['/dashboard', '/account', ];
  
  // إذا كانت الصفحة محمية ولا يوجد token
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // إذا كان المستخدم مسجل دخول ويحاول الوصول إلى صفحات التسجيل
  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// تحديد المسارات التي سيتم تطبيق الـ middleware عليها
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};