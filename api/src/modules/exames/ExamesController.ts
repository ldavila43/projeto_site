import { Request, Response } from 'express'
import { buscaExames } from './ExamesService'
import { RequestExames } from './ExamesDTO'


export async function controladorExames(req: Request, res: Response) {
    try {
        
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;
        const offsetCalculado = (page - 1) * limit;
        
        let requestExames: RequestExames;

        switch (req.perfilAtivo) {
            case 0:
                requestExames = {
                    idPaciente: req.query.idPaciente as string | undefined,
                    idProfissional: req.query.idProfissional as string | undefined,
                    tipoExame: req.query.tipoExame as string | undefined,
                    protocolo: req.query.protocolo as string | undefined,
                    nomePaciente: req.query.nomePaciente as string | undefined,
                    nomeProfissional: req.query.nomeProfissional as string | undefined,
                    limit,
                    offset: offsetCalculado
                };
                break;

            case 1:
                requestExames = {
                    idPaciente: req.query.idPaciente as string | undefined,
                    idProfissional: req.usuarioLogado!.id,
                    tipoExame: req.query.tipoExame as string | undefined,
                    protocolo: req.query.protocolo as string | undefined,
                    nomePaciente: req.query.nomePaciente as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                };
                break;
            case 2:

                requestExames = {
                    idPaciente: req.query.idPaciente as string | undefined,
                    idProfissional: req.query.idProfissional as string | undefined,
                    tipoExame: req.query.tipoExame as string | undefined,
                    protocolo: req.query.protocolo as string | undefined,
                    nomePaciente: req.query.nomePaciente as string | undefined,
                    nomeProfissional: req.query.nomeProfissional as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                };
                break;
            case 3:
                requestExames = {
                    idPaciente: req.usuarioLogado!.id,
                    tipoExame: req.query.tipoExame as string | undefined,
                    protocolo: req.query.protocolo as string | undefined,
                    limit: limit,
                    offset: offsetCalculado
                };
                break;
            default:
                throw new Error("Perfil inválido");
        }

        const dadosExames = await buscaExames(requestExames);

        console.log(dadosExames.dados)

        return res.status(200).json(dadosExames)
    } catch(erro) {
        return res.status(500).json({
            error: 'Erro ao buscar exames'
        });
    }
}