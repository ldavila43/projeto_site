export interface ComparativoMensal {
    mesAtual: number;
    mesAnterior: number;
}

export interface CardsResumoLaboratorio {
    cardPacientes: ComparativoMensal;
    cardProfissionais: ComparativoMensal;
    cardSolicitacoes: ComparativoMensal;
    cardExames: ComparativoMensal;
}

export interface TipoExameLaboratorio {
    idTipoExame: number;
    nomeTipoExame: string;
    contagem: number;
}

export interface GraficoExamesLaboratorio {
    TiposExame: TipoExameLaboratorio[];
}

export interface FiltrosGraficoLaboratorio {
    dataIni?: string;
    dataFim?: string;
    limite?: number;
}
