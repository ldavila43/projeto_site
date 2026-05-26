import LoginDTO from '@/DTO/LoginDTO'

const url_auth = process.env.NEXT_PUBLIC_URL_BACKEND_LOGIN!;

export async function enviarLogin(dados: LoginDTO) {
    const response = await fetch(
        url_auth,
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
    } catch {
        result = null;
    }
    if (!response.ok) {
        throw new Error(
            typeof result === "string" ? result : result?.error || "Erro desconhecido"
        );
    }
    return result?.token;
}