
export interface CardPacientes {
    mesAtual: number,
    mesAnterior: number
}

export interface CardProfissionais {
    mesAtual: number,
    mesAnterior: number
}

export interface CardSolicitacoes {
    mesAtual: number,
    mesAnterior: number
}

export interface CardExames {
    mesAtual: number,
    mesAnterior: number
}

export interface ResponseCardsResumo {
    cardPacientes: CardPacientes,
    cardProfissionais: CardProfissionais,
    cardSolicitacoes: CardSolicitacoes,
    cardExames: CardExames
}

export interface TiposExame {
    idTipoExame: number,
    nomeTipoExame: string,
    contagem: number
}

export interface ResponseCardTipoExame {
    TiposExame: TiposExame[]
}