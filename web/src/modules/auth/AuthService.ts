import LoginDTO from '@/src/modules/auth/LoginDTO'


interface RespostaLogin {
    token: string;
}

interface RespostaErroLogin {
    error?: {
        message?: string;
    } | string;
}

export async function enviarLogin(dados: LoginDTO): Promise<string> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_BASE_URL não configurada');
    const url = new URL('/auth/login', baseUrl);
    const response = await fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
    );
    let result: RespostaLogin | RespostaErroLogin;
    try {
        result = await response.json() as RespostaLogin | RespostaErroLogin;
    } catch {
        throw new Error('Resposta inválida do servidor');
    }
    if (!response.ok) {
        const erro = (result as RespostaErroLogin).error;
        throw new Error(
            typeof erro === 'string'
                ? erro
                : erro?.message ?? 'Erro ao realizar login'
        );
    }

    const token = (result as RespostaLogin).token;
    if (!token) throw new Error('Token não retornado pelo servidor');

    return token;
}
