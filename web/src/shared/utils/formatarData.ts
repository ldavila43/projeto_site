const FUSO_HORARIO_APLICACAO = 'America/Sao_Paulo';
const DATA_SIMPLES = /^(\d{4})-(\d{2})-(\d{2})$/;

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO_HORARIO_APLICACAO
});

const formatadorPartesData = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO_HORARIO_APLICACAO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
});

export function formatarData(
    valor?: string | Date | null,
    valorAusente = '-'
): string {
    if (!valor) return valorAusente;

    if (typeof valor === 'string') {
        const dataSimples = DATA_SIMPLES.exec(valor);
        if (dataSimples) {
            const [, ano, mes, dia] = dataSimples;
            return `${dia}/${mes}/${ano}`;
        }
    }

    const data = valor instanceof Date ? valor : new Date(valor);
    return Number.isNaN(data.getTime()) ? valorAusente : formatadorData.format(data);
}

export function formatarDataParaInput(data: Date): string {
    const partes = formatadorPartesData.formatToParts(data);
    const obterParte = (tipo: Intl.DateTimeFormatPartTypes) =>
        partes.find((parte) => parte.type === tipo)?.value ?? '';

    return [
        obterParte('year'),
        obterParte('month'),
        obterParte('day')
    ].join('-');
}
