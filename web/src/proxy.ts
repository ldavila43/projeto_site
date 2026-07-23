import { NextRequest, NextResponse } from 'next/server';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

const publicRoutes: string[] = ['/login', '/register', '/', '']

const regrasDeAcesso: Record<string, number[]> = {
    '/dashboard/admin': [PERFIS.ADMINISTRADOR],
    '/dashboard/profissional': [PERFIS.ADMINISTRADOR, PERFIS.PROFISSIONAL],
    '/dashboard/colaborador': [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR],
    '/cadastros': [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR],
    '/profissionais': [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR],
    '/solicitacoes': [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR],
    '/kits-amostra': [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR]
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

    const perfilAtivo = Number(req.cookies.get('x-perfil-ativo')?.value);

    if (!possuiPermissao(caminho, payload.perfis, perfilAtivo)) {
        return NextResponse.redirect(
            new URL('/dashboard', req.url)
        );
    }
    
    return NextResponse.next();
}

function possuiPermissao(
    caminho: string,
    perfisUsuario: { id: number, nome: string }[],
    perfilAtivo: number
): boolean {
    const regra = Object.entries(regrasDeAcesso).find(
        ([rota]) => caminho.startsWith(rota)
    );

    if (!regra) {
        return true;
    }

    const [, perfisPermitidos] = regra;

    const perfilPertenceAoUsuario = perfisUsuario.some((perfil) => {
        const idPerfil = typeof perfil === 'object' ? perfil.id : perfil;

        return idPerfil === perfilAtivo;
    });

    return perfilPertenceAoUsuario && perfisPermitidos.includes(perfilAtivo);
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
        '/solicitacoes',
        '/kits-amostra/:path*'
    ]
};
