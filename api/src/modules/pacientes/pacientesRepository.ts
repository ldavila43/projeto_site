import pool from '../../config/DatabaseConfig';
import { PacienteDTO, PacienteResponse } from './pacienteDTO'


export async function buscaPorCPF(documento: string) {
    const busca = await pool.query(
        `
            select exists (
                select 1
                from pessoas
                join pacientes
                    on pacientes.id_pessoa = pessoas.id_pessoa
                where documento_identificacao = $1
        ) as existe
        `,
        [documento]
    )

    return busca.rows[0].existe;
}

export async function cadastraPaciente(
    nome: string,
    documentoIdentificacao: string,
    nascimento: Date,
    email: string,
    telefone: string,
    tipoContato: string,
    cep: string,
    logradouro: string,
    numero: string,
    bairro: string,
    tipoEndereco: string,
    idCidade: number,
    estadoCivil?: string,
    profissao?: string,
    complemento?: string,
    sexo?: string,
    etnia?: string,
): Promise<{ status: 'criado' | 'ja_paciente' | 'ja_pessoa' }> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const existe = await client.query(
        `
            select exists (
                select 1
                from pessoas
                join pacientes
                    on pacientes.id_pessoa = pessoas.id_pessoa
                where documento_identificacao = $1
        ) as existe
        `,
        [documentoIdentificacao]
        )

        if (existe.rows[0].existe) {
            await client.query('ROLLBACK');
            return { status: 'ja_paciente' };
        }

        const insertPessoas = await client.query(
            `
            insert into pessoas(nome, data_nascimento, documento_identificacao, sexo, etnia)
            values ($1, $2, $3, $4, $5)
            on conflict (documento_identificacao)
            do update set
                documento_identificacao = excluded.documento_identificacao
            returning 
                id_pessoa,
                (xmax = 0) as inserido;
            `,
            [
                nome,
                nascimento,
                documentoIdentificacao,
                sexo,
                etnia
            ]
        );

        const idPessoa = insertPessoas.rows[0].id_pessoa;
        const insercaoNova = insertPessoas.rows[0].inserido;

        if (insercaoNova) {
            await client.query (
                `
                    insert into pessoas_emails(id_pessoa, email, tipo)
                    values ($1, $2, $3)
                `,
                [idPessoa, email, tipoContato]
            );

            await client.query (
                `
                    insert into pessoas_telefone(id_pessoa, telefone, tipo)
                    values ($1, $2, $3)
                `,
                [idPessoa, telefone, tipoContato]
            );

            const insertEnderecos = await client.query(
                `
                insert into enderecos(tipo_endereco, cep, logradouro, numero, complemento, bairro, id_municipio)
                values ($1, $2, $3, $4, $5, $6, $7)
                returning id_endereco
                `, 
                [
                    tipoEndereco,
                    cep,
                    logradouro,
                    numero,
                    complemento,
                    bairro,
                    idCidade
                ]
            )

            const idEndereco = insertEnderecos.rows[0].id_endereco;

            await client.query(
                `
                    insert into pessoas_enderecos(id_pessoa, id_endereco)
                    values($1, $2)
                `,
                [
                    idPessoa,
                    idEndereco
                ]
            );
        }

        await client.query(
            `
            insert into pacientes(id_pessoa, estado_civil, profissao)
            values($1, $2, $3)
            `,
            [
                idPessoa,
                estadoCivil,
                profissao
            ]
        )
        await client.query('COMMIT');
        
        return { status: insercaoNova ? 'criado' : 'ja_pessoa' };

    } catch (erro) {
        await client.query('ROLLBACK');
        throw erro
    } finally {
        client.release()
    }
}

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
