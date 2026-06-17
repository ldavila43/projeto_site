import pool from '../../../../config/DatabaseConfig';
import { AbundanciaEspecie, RazaoBacillotaBacteroidota } from '../../DTO/MicrobiomaDTO'

export async function buscaTaxonsPatogenos(idExame: number) {

}

export async function buscaComposicaoPorDominio(idExame: number, idPessoa?: string, idProfissional?: string): Promise< AbundanciaEspecie[] >{
    const busca = await pool.query(
        `
        SELECT
            tipo as especie,
            sum(abundancia_relativa) abundancia
        FROM resultados_composicao_microbioma res
        join taxons
            ON res.id_taxon = taxons.id_taxon
        join exames
            on exames.id_exame = res.id_exame
        join solicitacoes_exame
            on exames.id_solicitacao = solicitacoes_exame.id_solicitacao
        join pacientes
            on solicitacoes_exame.id_paciente = pacientes.id_paciente
        join pessoas pac
            on pac.id_pessoa = pacientes.id_pessoa
        join profissionais_saude 
            on profissionais_saude.id_profissional = solicitacoes_exame.id_profissional_saude
        join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where nivel = 'ESPECIE'
        and taxons.considerar_percentual = true
        and res.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        group by tipo;
        `, [idExame, idPessoa, idProfissional]
    );
    
    const abundanciaPorEspecie: AbundanciaEspecie[] = busca.rows.map(row => ({
        especie: row.especie,
        abundancia: row.abundancia
    }))

    return abundanciaPorEspecie;
}


export async function buscaRazaoBacilotaBacteroidota(idExame?: number, idPaciente?: string, idPessoa?: string): Promise<RazaoBacillotaBacteroidota> {
    const busca = await pool.query(
        `
        WITH dados AS (
            SELECT
                res.id_taxon,
                abundancia_relativa as valor
            FROM resultados_composicao_microbioma res
            join exames
                on exames.id_exame = res.id_exame
            join solicitacoes_exame
                on solicitacoes_exame.id_solicitacao = exames.id_solicitacao
            join pacientes
                on pacientes.id_paciente = solicitacoes_exame.id_paciente
            join pessoas pac
                on pacientes.id_pessoa = pac.id_pessoa
            left join profissionais_saude
                on solicitacoes_exame.id_profissional_saude = profissionais_saude.id_profissional
            join pessoas prof
                on profissionais_saude.id_pessoa = prof.id_pessoa
            WHERE res.id_taxon IN (39212, 40176)
            and res.id_exame = $1
            and pac.id_pessoa = coalesce($2, pac.id_pessoa)
            and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        )
        SELECT
            (SELECT valor FROM dados WHERE id_taxon = 39212)
            /
            NULLIF((SELECT valor FROM dados WHERE id_taxon = 40176), 0
        ) AS proporcao;
        `, [idExame, idPaciente, idPessoa]
    )

    return {
        razao: busca.rows[0]
    }
}