export interface ViewPacienteDTO {
    totalExames: number,
    examesConcluidos: number,
    examesRecentes: Exame[]
}

export interface Exame {
    protocolo: string,
    tipoExame: string,
    status: string,
    dataSolicitacao: Date
}