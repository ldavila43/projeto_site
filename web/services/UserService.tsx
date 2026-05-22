import CadastroDTO from '@/DTO/CadastroDTO';

const url_usuarios = process.env.NEXT_PUBLIC_URL_BACKEND + '/users';

export async function registrarUsuario(dados: CadastroDTO) {
    console.log(url_usuarios);
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
        result = null;
    }
    if (!response.ok) {
        throw new Error(
            typeof result === "string" ? result : result?.error || "Erro desconhecido"
        );
    }
    return result?.message;
}