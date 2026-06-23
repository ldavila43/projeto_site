import { Request, Response } from 'express';
import { cadastraPacientes, buscaPacientes } from './pacientesService';
import { PacienteRequest, ReqCadastroDTO } from './pacienteDTO';
import ApiError from '../../errors/ApiErrors'


export async function postPacientes(req: Request, res: Response) {
    try {
        console.log(req.body)
        const requestCadastro: ReqCadastroDTO = req.body;
        console.log(requestCadastro);

        if (req.perfilAtivo != 0 && req.perfilAtivo != 2) {
            return res.status(401).json({
                error: 'Não autorizado'
            })
        }

        await cadastraPacientes(requestCadastro);

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

export async function getPacientes(req: Request, res: Response) {
    try{

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const offsetCalculado = (page - 1) * limit;

        let requestPaciente: PacienteRequest;
        
        switch(req.perfilAtivo){
            case 0:
                requestPaciente = {
                    idProfissional: undefined,
                    nome: req.query.nome as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                }
                break;

            case 1:
                requestPaciente = {
                    idProfissional: req.usuarioLogado?.id,
                    nome: req.query.nome as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                }
                break;

            case 2:
                requestPaciente = {
                    idProfissional: undefined,
                    nome: req.query.nome as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                }
                break;
            
            default:
                throw new Error("Perfil inválido");
        }

        const dadosPacientes = await buscaPacientes(requestPaciente);

        return res.status(200).json(dadosPacientes);
    } catch(erro) {
        return res.status(500).json({
            error: erro
        })
    }
}