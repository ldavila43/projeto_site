

export interface AbundanciaEspecie {
    especie: string,
    abundancia: number
}

export interface ComposicaoPorDominio {
    abundanciasEspecie: AbundanciaEspecie[]
}

export interface RazaoBacillotaBacteroidota {
    razao: number,
    bacilota: number,
    bacteroidota: number
}