import { Response } from 'express'
import { servicoDadosDashPaciente } from '../services/DashboardService'
import { RequestComUsuario } from '../models/RequestAutenticada';


export async function dadosDashPacientes(req: RequestComUsuario, res: Response) {
    try {
        
        const idPaciente = req.usuarioLogado.id;
        console.log(idPaciente)
        const dadosDash = await servicoDadosDashPaciente(idPaciente);

        return res.status(200).json(dadosDash);
    } catch {
        return res.status(500).json({
            error: 'Erro ao buscar dashboard'
        });
    }
}