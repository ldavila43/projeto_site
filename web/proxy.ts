import { NextRequest, NextResponse } from 'next/server';

const publicRoutes: string[] = ['/login', '/register', '/']
const privateRoutes: string[] = ['/dashboard']

export default async function proxy(req: NextRequest) {
    const session = req.cookies.get('session')

    const caminho = req.nextUrl.pathname;

    if (privateRoutes.includes(caminho) && !session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (publicRoutes.includes(caminho) && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*'
}