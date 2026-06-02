import CadastroDTO from '@/DTO/CadastroDTO';

const url_usuarios = process.env.NEXT_PUBLIC_URL_BACKEND_USERS!;

export async function registrarUsuario(dados: CadastroDTO) {
    const response = await fetch(
        url_usuarios,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        }
    );

    let result;
    try{
        result = await response.json();
    } catch {
        throw new Error('Resposta inválida do servidor');
    }
    if (!response.ok) {
        throw new Error(
            typeof result === "string" ? result : result?.error || "Erro desconhecido"
        );
    }
    return result?.message;
}