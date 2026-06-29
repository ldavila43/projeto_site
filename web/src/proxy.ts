import { NextRequest, NextResponse } from 'next/server';

const publicRoutes: string[] = ['/login', '/register', '/', '']

const regrasDeAcesso: Record<string, number[]> = {
    '/dashboard/admin': [0],
    '/dashboard/profissional': [0, 1],
    '/dashboard/colaborador': [0, 2],
    '/cadastros': [0, 2],
    '/profissionais': [0,2],
    '/solicitacoes':[0,2],
    '/kits-amostra':[0,2]
};

export default function proxy(req: NextRequest) {
    const session = req.cookies.get('session');

    const caminho = req.nextUrl.pathname;

    if (publicRoutes.includes(caminho)) {
        if (session) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const payload = JSON.parse(
        atob(session.value.split('.')[1])
    );

    if (!payload) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (!possuiPermissao(caminho, payload.perfis)) {
        return NextResponse.redirect(
            new URL('/dashboard', req.url)
        );
    }
    return NextResponse.next();
}

function possuiPermissao(
    caminho: string,
    perfisUsuario: number[]
): boolean {
    const regra = Object.entries(regrasDeAcesso).find(
        ([rota]) => caminho.startsWith(rota)
    );

    if (!regra) {
        return true;
    }

    const [, perfisPermitidos] = regra;

    return perfisUsuario.some(
        perfil => perfisPermitidos.includes(perfil)
    );
}

export const config = {
    matcher: [
        '/register',
        '/login',
        '/dashboard/:path*',
        '/cadastros/:path*',
        '/exames/:path*',
        '/pacientes/:path*',
        '/profissionais/:path',
        '/solicitacoes'
    ]
};