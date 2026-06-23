import pool from '../../../../../config/DatabaseConfig';


export async function buscaTopVias(idExame: number, idProfissional?: string, idPaciente?: string) {
    const busca = await pool.query(
        `
        select
            vias.descricao,
            abundancia_relativa
        from resultados_vias res
        join vias
            on res.id_via = vias.id_via
        join exames
            on res.id_exame = exames.id_exame
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
        where res.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        order by abundancia_relativa desc
        limit 5;
        `, [idExame, idPaciente, idProfissional]
    )
}

export async function buscaSomaViasBioquimicas(idExame: number, idProfissional?: string, idPaciente?: string): Promise<Number> {
    const busca = await pool.query(
        `
        select
            count(id_via) numero_vias
        from resultados_vias res
        join vias
            on res.id_via = vias.id_via
        join exames
            on res.id_exame = exames.id_exame
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
        where res.id_exame = $1
        and pac.id_pessoa = coalesce($2, pac.id_pessoa)
        and prof.id_pessoa = coalesce($3, prof.id_pessoa)
        order by abundancia_relativa desc
        limit 5;
        `, [idExame, idPaciente, idProfissional]
    )

    return Number(busca.rows[0])
}