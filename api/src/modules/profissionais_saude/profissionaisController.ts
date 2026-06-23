import { Request, Response } from 'express';
import { cadastraProfissionais, buscaProfissionais } from './profissionaisService';
import { ProfissionaisRequest, ReqCadastroDTO } from './profissionaisDTO';
import ApiError from '../../errors/ApiErrors'


export async function postProfissionais(req: Request, res: Response) {
    try {
        console.log(req.body)
        const requestCadastro: ReqCadastroDTO = req.body;
        console.log(requestCadastro);

        if (req.perfilAtivo != 0 && req.perfilAtivo != 2) {
            return res.status(401).json({
                error: 'Não autorizado'
            })
        }

        await cadastraProfissionais(requestCadastro);

        return res.status(200).json('Paciente cadastrado');

    } catch(erro) {
        if (erro instanceof ApiError) {
            return res.status(erro.statusCode).json({
                error: erro.message
            })
        }
        console.log(erro)
        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}

export async function getProfissionais(req: Request, res: Response) {
    try{

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const offsetCalculado = (page - 1) * limit;

        let requestProfissional: ProfissionaisRequest;
        
        switch(req.perfilAtivo){
            case 0:
                requestProfissional = {
                    nome: req.query.nome as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                }
                break;

            case 2:
                requestProfissional = {
                    nome: req.query.nome as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                }
                break;
            
            default:
                throw new ApiError(401, 'Não autorizado');
        }
        const dadosProfissionais = await buscaProfissionais(requestProfissional);

        return res.status(200).json(dadosProfissionais);
    } catch(erro) {
        if (erro instanceof ApiError) {
            return res.status(erro.statusCode).json({
                error: erro.message
            })
        }
        console.log(erro)
        return res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
}