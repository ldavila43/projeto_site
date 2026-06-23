import pool from '../../config/DatabaseConfig';
import { ProfissionalDTO, ProfissionaisResponse } from './profissionaisDTO'


export async function buscaPorCPF(documento: string) {
    const busca = await pool.query(
        `
            select exists (
                select 1
                from pessoas
                join profissionais_saude
                    on profissionais_saudde.id_pessoa = pessoas.id_pessoa
                where documento_identificacao = $1
        ) as existe
        `,
        [documento]
    )

    return busca.rows[0].existe;
}

export async function cadastraProfissional(
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
    idProfissao: number,
    complemento?: string,
    sexo?: string,
    etnia?: string,
): Promise<{ status: 'criado' | 'ja_pessoa' | 'ja_profissional' }> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const existe = await client.query(
        `
            select exists (
                select 1
                from pessoas
                join profissionais_saude
                    on profissionais_saude.id_pessoa = pessoas.id_pessoa
                where documento_identificacao = $1
        ) as existe
        `,
        [documentoIdentificacao]
        )

        if (existe.rows[0].existe) {
            await client.query('ROLLBACK');
            return { status: 'ja_profissional' };
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
            insert into profissionais_saude(id_pessoa, profissao_registro)
            values($1, $2)
            `,
            [
                idPessoa,
                idProfissao
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

export async function buscaMetadadosProfissionais(nome?: string): Promise<number> {
    const busca = await pool.query(
        `
        select
            count(*) as total_profissionaiss
        from profissionais_saude
        join pessoas
            on profissionais_saude.id_pessoa = pessoas.id_pessoa
        where ($1::text is null or pessoas.nome ilike '%' || $1 || '%');
        `,
        [nome]
    )
    return busca.rows[0].total_profissionaiss
}

export async function buscaProfissionaisNome(nome?: string, limit?: number, offset?: number): Promise<ProfissionalDTO[]> {
    const busca = await pool.query(
        `
        select
            profissionais_saude.id_profissional,
            pessoas.id_pessoa,
            pessoas.nome,
            pessoas.criado_em,
            pessoas.atualizado_em,
            especializacoes.descricao as profissao_registro
        from profissionais_saude
        join especializacoes
            on profissionais_saude.profissao_registro = especializacoes.id_especializacao
        join pessoas
            on profissionais_saude.id_pessoa = pessoas.id_pessoa
        where ($1::text is null or pessoas.nome ilike '%' || $1 || '%')
        limit coalesce($2, 10)
        offset coalesce($3, 0);
        `,
        [nome, limit, offset]
    )

    const profissionais: ProfissionalDTO[] = busca.rows.map(profissionais => ({
            idPessoa: profissionais.id_pessoa,
            idProfissional: profissionais.id_profissional,
            nome: profissionais.nome,
            profissaoRegistro: profissionais.profissao_registro,
            criadoEm: profissionais.criado_em,
            atualizadoEm: profissionais.atualizado_em
    }))

    return profissionais;
}
