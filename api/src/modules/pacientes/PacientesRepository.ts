import pool from '../../config/DatabaseConfig';
import { PacienteDTO, PacienteResponse } from './PacienteDTO'

export async function buscaMetadadosPacientes(nome?: string, idProfissional?: string): Promise<number> {
    const busca = await pool.query(
        `
        select
            count(*) as total_pacientes
        from pacientes
        join pessoas
            on pacientes.id_pessoa = pessoas.id_pessoa
        left join solicitacoes_exame
            on pacientes.id_paciente = solicitacoes_exame.id_paciente
        left join profissionais_saude
            on profissionais_saude.id_profissional = solicitacoes_exame.id_profissional_saude
        left join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where ($1::text is null or pessoas.nome ilike '%' || $1 || '%')
        and ($2::text is null or prof.id_pessoa = coalesce($2::uuid, prof.id_pessoa))
        `,
        [nome, idProfissional]
    )
    return busca.rows[0].total_pacientes
}

export async function buscaPacientesNome(nome?: string, idProfissional?: string, limit?: number, offset?: number): Promise<PacienteDTO[]> {
    const busca = await pool.query(
        `
        select
            pacientes.id_paciente,
            pessoas.id_pessoa,
            pessoas.nome,
            pessoas.criado_em,
            pessoas.atualizado_em
        from pacientes
        join pessoas
            on pacientes.id_pessoa = pessoas.id_pessoa
        left join solicitacoes_exame
            on pacientes.id_paciente = solicitacoes_exame.id_paciente
        left join profissionais_saude
            on profissionais_saude.id_profissional = solicitacoes_exame.id_profissional_saude
        left join pessoas prof
            on profissionais_saude.id_pessoa = prof.id_pessoa
        where ($1::text is null or pessoas.nome ilike '%' || $1 || '%')
        and ($2::text is null or prof.id_pessoa = coalesce($2::uuid, prof.id_pessoa))
        limit coalesce($3, 10)
        offset coalesce($4, 0)
        `,
        [nome, idProfissional, limit, offset]
    )

    const pacientes: PacienteDTO[] = busca.rows.map(paciente => ({
            idPessoa: paciente.id_pessoa,
            idPaciente: paciente.id_paciente,
            nome: paciente.nome,
            criadoEm: paciente.criado_em,
            atualizadoEm: paciente.atualizado_em
    }))

    return pacientes;
}
