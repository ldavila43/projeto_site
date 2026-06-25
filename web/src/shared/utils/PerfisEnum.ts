export const PERFIS = {
    ADMIN: 0,
    PROFISSIONAL_SAUDE: 1,
    COLABORADOR: 2,
    PACIENTE: 3,
} as const;

export type PerfilID = typeof PERFIS[keyof typeof PERFIS];

export const PERFIS_INFO = {
    [PERFIS.ADMIN]: {
        nome: 'ADMIN',
        hierarquia: 0,
    },

    [PERFIS.PROFISSIONAL_SAUDE]: {
        nome: 'PROFISSIONAL_SAUDE',
        hierarquia: 1,
    },

    [PERFIS.COLABORADOR]: {
        nome: 'COLABORADOR',
        hierarquia: 2,
    },

    [PERFIS.PACIENTE]: {
        nome: 'PACIENTE',
        hierarquia: 3,
    },
} as const;

export function nomePerfil(perfil: PerfilID) {
    if (perfil){
    return PERFIS_INFO[perfil];
    }
    else return ''
}