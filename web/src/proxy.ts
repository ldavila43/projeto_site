import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { PayloadUsuario } from '@/src/shared/PayloadUsuario';
import {
    obterPerfilPrioritario,
    PERFIS,
    PerfilID,
    isPerfilID
} from '@/src/shared/utils/PerfisEnum';

const rotasPublicas = new Set(['/login', '/', '']);

const regrasDeAcesso: Array<{
    prefixo: string;
    perfis: readonly PerfilID[];
}> = [
    { prefixo: '/dashboard/admin', perfis: [PERFIS.ADMINISTRADOR] },
    { prefixo: '/dashboard/profissional', perfis: [PERFIS.ADMINISTRADOR, PERFIS.PROFISSIONAL] },
    { prefixo: '/dashboard/colaborador', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/dashboard/paciente', perfis: [PERFIS.ADMINISTRADOR, PERFIS.PACIENTE] },
    { prefixo: '/cadastros', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/pessoas', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/exames/admin', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/exames/profissional', perfis: [PERFIS.ADMINISTRADOR, PERFIS.PROFISSIONAL] },
    { prefixo: '/exames/paciente', perfis: [PERFIS.ADMINISTRADOR, PERFIS.PACIENTE] },
    { prefixo: '/pacientes/admin', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/pacientes/profissional', perfis: [PERFIS.ADMINISTRADOR, PERFIS.PROFISSIONAL] },
    { prefixo: '/pacientes', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR, PERFIS.PROFISSIONAL] },
    { prefixo: '/profissionais', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] },
    { prefixo: '/kits-amostra', perfis: [PERFIS.ADMINISTRADOR, PERFIS.COLABORADOR] }
];

function decodificarSessao(token: string): PayloadUsuario | null {
    try {
        return jwtDecode<PayloadUsuario>(token);
    } catch {
        return null;
    }
}

function possuiAcesso(
    caminho: string,
    usuario: PayloadUsuario,
    perfilAtivo: number
): boolean {
    const regra = regrasDeAcesso.find(({ prefixo }) => caminho.startsWith(prefixo));
    if (!regra) return true;
    if (!isPerfilID(perfilAtivo)) return false;

    const pertenceAoUsuario = usuario.perfis.some(({ id }) => id === perfilAtivo);
    return pertenceAoUsuario && regra.perfis.includes(perfilAtivo);
}

function armazenarPerfilAtivo(resposta: NextResponse, perfilAtivo: PerfilID) {
    resposta.cookies.set('x-perfil-ativo', String(perfilAtivo), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60
    });
    return resposta;
}

export default function proxy(req: NextRequest) {
    const caminho = req.nextUrl.pathname;
    const token = req.cookies.get('session')?.value;
    const publica = rotasPublicas.has(caminho);

    if (!token) {
        return publica
            ? NextResponse.next()
            : NextResponse.redirect(new URL('/login', req.url));
    }

    const usuario = decodificarSessao(token);
    if (!usuario || (usuario.exp && usuario.exp * 1000 <= Date.now())) {
        const resposta = NextResponse.redirect(new URL('/login', req.url));
        resposta.cookies.delete('session');
        resposta.cookies.delete('x-perfil-ativo');
        return resposta;
    }

    const perfilRecebido = Number(req.cookies.get('x-perfil-ativo')?.value);
    const perfilRecebidoValido = isPerfilID(perfilRecebido)
        && usuario.perfis.some(({ id }) => id === perfilRecebido);
    const perfilAtivo = perfilRecebidoValido
        ? perfilRecebido
        : obterPerfilPrioritario(usuario.perfis);

    if (!perfilAtivo) {
        const resposta = NextResponse.redirect(new URL('/login', req.url));
        resposta.cookies.delete('session');
        resposta.cookies.delete('x-perfil-ativo');
        return resposta;
    }

    if (!perfilRecebidoValido) {
        const destino = publica ? '/dashboard' : req.nextUrl;
        return armazenarPerfilAtivo(
            NextResponse.redirect(new URL(destino, req.url)),
            perfilAtivo
        );
    }

    if (publica) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!possuiAcesso(caminho, usuario, perfilAtivo)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
