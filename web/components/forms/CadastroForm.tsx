'use client';
import { useState, useEffect } from 'react';
import CadastroDTO from '@/DTO/CadastroDTO'
import { validarCadastro } from '@/utils/ValidacoesCadastro'
import { registrarUsuario } from '@/services/UserService';
import Input from '@/components/ui/Input'

export default function CadastroForm() {
    const [formData, setFormData] = useState<CadastroDTO>({
        nome: '',
        dataNascimento: new Date(),
        documentoIdentificacao: '',
        sexo: '',
        etnia: '',
        senha: ''
    });

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }

    async function enviarCadastro() {
        try {
        const cadastro: CadastroDTO = formData;

        const valido = validarCadastro(cadastro);

        const mensagem = await registrarUsuario(cadastro);

        setFormData({
            nome: '',
            dataNascimento: new Date(),
            documentoIdentificacao: '',
            sexo: '',
            etnia: '',
            senha: ''
        })

        alert (mensagem)

        } catch (erro) {
            if (erro instanceof Error) {
                alert(erro.message)
            } else {
                alert ('Erro inesperado!')
            }
        }
    }

    return (
        <main>
            <div>
                <h1>Criar nova conta</h1>
                Nome: <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                />
                <br />
                CPF: <Input
                    name="documentoIdentificacao"
                    value={formData.documentoIdentificacao}
                    onChange={handleChange}
                />
                <br />
                Sexo: <Input
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                />
                <br />
                Etnia: <Input
                    name="etnia"
                    value={formData.etnia}
                    onChange={handleChange}
                />
                <br />
                Senha: <Input
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                />
                <br />
                Data de Nascimento: <Input
                    className="mt-4"
                    type="date"
                    value={formData.dataNascimento
                        .toISOString()
                        .split('T')[0]}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            dataNascimento: new Date(e.target.value)
                        })
                    }
                />
                <br />
                <button onClick={enviarCadastro}>Criar Conta</button>
            </div>
        </main>
    );
}