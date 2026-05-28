import { PerfilID, PERFIS_INFO, PERFIS } from '@/utils/PerfisEnum'

const HIERARQUIA_PERFIS = [
    { id: 0, nome: 'admin' },
    { id: 1, nome: 'profissional_saude' },
    { id: 2, nome: 'colaborador' },
    { id: 3, nome: 'paciente' }
];

const perfilAdmin = 0

export function definirHierarquia(
    perfisUsuario: PerfilID[]
): PerfilID | null {

    if (perfisUsuario.length === 0) {
        return null;
    }

    return perfisUsuario.reduce((melhorPerfil, perfilAtual) => {
        const hierarquiaAtual =
            PERFIS_INFO[perfilAtual].hierarquia;

        const melhorHierarquia =
            PERFIS_INFO[melhorPerfil].hierarquia;

        return hierarquiaAtual < melhorHierarquia
            ? perfilAtual
            : melhorPerfil;

    });
}

export function definirPerfis(
    perfisUsuario: PerfilID[]
): PerfilID[] {

    const isAdmin =
        perfisUsuario.includes(PERFIS.ADMIN);

    if (isAdmin) {
        return Object.values(PERFIS);
    }

    return perfisUsuario;
}