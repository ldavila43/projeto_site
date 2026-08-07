import 'server-only';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { PayloadUsuario } from '@/src/shared/PayloadUsuario';
import { isPerfilID, PerfilID } from '@/src/shared/utils/PerfisEnum';

interface OpcoesSessao {
    exigirPerfil?: boolean;
    perfisPermitidos?: readonly PerfilID[];
}

export interface Sessao {
    token: string;
    perfilAtivo: PerfilID | null;
    usuario: PayloadUsuario;
}

function perfilPertenceAoUsuario(usuario: PayloadUsuario, perfilAtivo: PerfilID): boolean {
    return usuario.perfis.some((perfil) => perfil.id === perfilAtivo);
}

export async function obterSessao({
    exigirPerfil = true,
    perfisPermitidos
}: OpcoesSessao = {}): Promise<Sessao> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        throw new Error('Sessão não encontrada');
    }

    let usuario: PayloadUsuario;
    try {
        usuario = jwtDecode<PayloadUsuario>(token);
    } catch {
        throw new Error('Sessão inválida');
    }

    if (usuario.exp && usuario.exp * 1000 <= Date.now()) {
        throw new Error('Sessão expirada');
    }

    const perfilRecebido = Number(cookieStore.get('x-perfil-ativo')?.value);
    const perfilAtivo = isPerfilID(perfilRecebido) ? perfilRecebido : null;

    if (
        exigirPerfil
        && (!perfilAtivo || !perfilPertenceAoUsuario(usuario, perfilAtivo))
    ) {
        throw new Error('Perfil ativo inválido ou não informado');
    }

    if (
        perfilAtivo
        && perfisPermitidos
        && !perfisPermitidos.includes(perfilAtivo)
    ) {
        throw new Error('Perfil sem permissão para esta operação');
    }

    return { token, perfilAtivo, usuario };
}
