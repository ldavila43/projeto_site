export interface EnderecoViaCep {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
}

interface RespostaViaCep extends EnderecoViaCep {
    erro?: boolean | 'true';
}

export async function buscarEnderecoPorCep(
    cepInformado: string,
    signal?: AbortSignal
): Promise<EnderecoViaCep> {
    const cep = cepInformado.replace(/\D/g, '');

    if (cep.length !== 8) {
        throw new Error('Informe um CEP com 8 dígitos.');
    }

    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: 'GET',
        signal
    });

    if (!resposta.ok) {
        throw new Error('Não foi possível consultar o CEP.');
    }

    const dados = await resposta.json() as RespostaViaCep;
    if (dados.erro === true || dados.erro === 'true') {
        throw new Error('CEP não encontrado.');
    }

    return dados;
}
