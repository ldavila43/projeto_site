export const PERFIS = {
    ADMINISTRADOR: 1,
    PROFISSIONAL: 2,
    COLABORADOR: 3,
    PACIENTE: 4,
} as const;

export type PerfilID = (typeof PERFIS)[keyof typeof PERFIS];

export function isPerfilID(perfil: number): perfil is PerfilID {
    return Object.values(PERFIS).some((id) => id === perfil);
}

export function obterPerfilPrioritario(perfis: ReadonlyArray<{ id: number }>): PerfilID | null {
    return Object.values(PERFIS).find(
        (perfilId) => perfis.some(({ id }) => id === perfilId)
    ) ?? null;
}
