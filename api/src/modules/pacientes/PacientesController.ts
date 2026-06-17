import { Request, Response } from 'express';
import { buscaPacientes } from './PacientesService';
import { PacienteRequest } from './PacienteDTO';

export async function controllerPacientesProf(req: Request, res: Response) {
    try {

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const offsetCalculado = (page - 1) * limit;

        const requestPaciente: PacienteRequest = {
            idProfissional: req.usuarioLogado?.id,
            nome: req.query.nome as string | undefined,
            limit: limit,
            offset: offsetCalculado
        }

        const dadosPacientes = await buscaPacientes(requestPaciente);

        return res.status(200).json(dadosPacientes)
    } catch(erro) {
        return res.status(500).json({
            error: 'Erro ao buscar pacientes'
        });
    }
}

export async function controllerPacientesAdmin(req: Request, res: Response) {
    try {

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const offsetCalculado = (page - 1) * limit;

        const requestPaciente: PacienteRequest = {
            idProfissional: undefined,
            nome: req.query.nome as string | undefined,
            limit: limit,
            offset: offsetCalculado
        }

        const dadosPacientes = await buscaPacientes(requestPaciente);

        return res.status(200).json(dadosPacientes)
    } catch(erro) {
        console.log(erro)
        return res.status(500).json({
            error: 'Erro ao buscar pacientes'
        });
    }
}