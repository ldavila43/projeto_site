export const STATUS_GENERICO = ['ATIVO', 'INATIVO'] as const;
export type StatusGenerico = (typeof STATUS_GENERICO)[number];

export const STATUS_KITS = [
    'INATIVO',
    'ATIVO',
    'INVÁLIDO',
    'DESCARTADO'
] as const;
export type StatusKit = (typeof STATUS_KITS)[number];

export const STATUS_SOLICITACOES = [
    'AMOSTRAS EM ANÁLISE',
    'KIT ENVIADO',
    'AGUARDANDO PAGAMENTO',
    'PAGA',
    'PRONTA',
    'CANCELADA'
] as const;
export type StatusSolicitacao = (typeof STATUS_SOLICITACOES)[number];

export const STATUS_EXAMES = [
    'AGUARDANDO ENVIO',
    'EM ANÁLISE',
    'AGUARDANDO PROCESSAMENTO INTERNO',
    'LIBERAÇÃO PENDENTE',
    'LIBERADO',
    'CANCELADO'
] as const;
export type StatusExame = (typeof STATUS_EXAMES)[number];

export const STATUS_AMOSTRAS = [
    'RECEBIDA',
    'EM PROCESSAMENTO',
    'PROCESSADA',
    'DESCARTADA'
] as const;
export type StatusAmostra = (typeof STATUS_AMOSTRAS)[number];

export const STATUS_ENVIOS = [
    'PENDENTE',
    'EM TRÂNSITO',
    'ENTREGUE',
    'EXTRAVIADO',
    'DEVOLVIDO'
] as const;
export type StatusEnvio = (typeof STATUS_ENVIOS)[number];

export const CATEGORIAS_ENVIO = ['KITS', 'AMOSTRAS', 'OUTROS'] as const;
export type CategoriaEnvio = (typeof CATEGORIAS_ENVIO)[number];

export const SEXOS = ['MASCULINO', 'FEMININO'] as const;
export type Sexo = (typeof SEXOS)[number];

export function formatarValorEnum(valor: string): string {
    return valor
        .toLocaleLowerCase('pt-BR')
        .replace(/(^|\s)\p{L}/gu, (letra) => letra.toLocaleUpperCase('pt-BR'));
}
