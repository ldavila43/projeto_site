import LoginDTO from '@/DTO/LoginDTO'


export async function enviarLogin(dados: LoginDTO) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
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
    let result
    try {
        result = await response.json();
    } catch(erro) {
        throw new Error('Resposta inválida do servidor');
    }
    if (!response.ok) {
        throw new Error(
            typeof result === "string" ? result : result?.error || "Erro desconhecido"
        );
    }
    return result?.token;
}