import CadastroDTO from '@/src/modules/auth/CadastroDTO';
import { fetchAutenticado } from '@/src/shared/Service';

interface RespostaCadastroUsuario {
    message: string;
}

export async function registrarUsuario(
    token: string,
    perfilAtivo: string,
    dados: CadastroDTO
): Promise<RespostaCadastroUsuario> {
    return fetchAutenticado(
        'POST',
        '/users',
        token,
        perfilAtivo,
        dados
    );
}
