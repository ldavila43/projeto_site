import pool from '../config/DatabaseConfig';
import UsuarioModel from '../models/UsuarioModel'

export async function buscaPorCpf(cpf: string) {
    const busca = await pool.query(
        `
            select exists (
                select 1
                from pessoas
                where documento_identificacao = $1
        ) as existe
        `,
        [cpf]
    )

    return busca.rows[0].existe;
}

export async function criarConta(usuario: UsuarioModel){
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const insert_pessoas = await client.query(
            `
                insert into pessoas(nome, data_nascimento, documento_identificacao, sexo, etnia)
                values ($1, $2, $3, $4, $5)
                returning id_pessoa
            `,
            [
                usuario.nome,
                usuario.dataNascimento,
                usuario.documentoIdentificacao,
                usuario.sexo,
                usuario.etnia
            ]
        )
        const id_pessoa = insert_pessoas.rows[0].id_pessoa;

        const insert_operadores = await client.query(
            `
                insert into operadores(id_pessoa)
                values ($1)
                returning id_operador
            `,
            [id_pessoa]
        )

        const id_operador = insert_operadores.rows[0].id_operador;

        await client.query(
            `
                insert into operadores_credenciais(id_operador, senha_hash)
                values($1, $2)
            `,
            [
                id_operador,
                usuario.senhaHash
            ]
        )

        await client.query('COMMIT')

        return true;

    } catch (erro) {
        await client.query('ROLLBACK')
        throw(erro);
    } finally {
        client.release()
    }
}