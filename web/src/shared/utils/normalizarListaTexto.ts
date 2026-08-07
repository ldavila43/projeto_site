export function normalizarListaTexto(valor: unknown): string[] {
    if (Array.isArray(valor)) {
        return valor
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    if (typeof valor === 'string') {
        return valor
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}
