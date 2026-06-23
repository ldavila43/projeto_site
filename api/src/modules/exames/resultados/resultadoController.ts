import { RequestExames } from './DTO/RequestExamesDTO';
import { Request, Response } from 'express';
import { buscaVisaoGeral } from './ResultadosService'

export async function getDadosPainel(req: Request, res: Response) {
    try {
        const solicitacao = montaSolicitacao(req);
        const dados = await buscaVisaoGeral(solicitacao);
        return res.status(200).json(dados)
    } catch(erro) {
        console.log(erro)
        return res.status(500).json({
            error:erro
        })
    }
}

export async function getDadosVisaoGeral(req: Request, res: Response) {
    try {
        const solicitacao = montaSolicitacao(req);
        const dados = await buscaVisaoGeral(solicitacao);
        return res.status(200).json(dados)
    } catch(erro) {
        console.log(erro)
        return res.status(500).json({
            error:erro
        })
    }
}

function montaSolicitacao(req: Request): RequestExames{
        if(!req.params.idExame) {
            throw new Error("Id não enviado");
        }

        const idExame = Number(req.params.idExame);
        let solicitacao: RequestExames;
        const idSolicitante = req.usuarioLogado!.id;

        switch (req.perfilAtivo) {
            case 0:
                solicitacao = {
                    idExame: idExame,
                    idPaciente: undefined,
                    idProfissional: undefined
                }
                break;
            case 1:

                solicitacao = {
                    idExame: idExame,
                    idPaciente: undefined,
                    idProfissional: idSolicitante
                }
                break;
            case 2:
                solicitacao = {
                    idExame: idExame,
                    idPaciente: undefined,
                    idProfissional: undefined
                }
                break;
            case 3:
                solicitacao = {
                    idExame: idExame,
                    idPaciente: idSolicitante,
                    idProfissional: undefined
                }
                break;
            default:
                throw new Error("")
        }

        return solicitacao;
}