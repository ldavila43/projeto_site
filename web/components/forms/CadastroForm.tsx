'use client';
import { useState } from 'react';
import CadastroDTO from '@/DTO/CadastroDTO';
import FormDTO from '@/DTO/FormDTO';
import { validarCadastro } from '@/utils/ValidacoesCadastro';
import { registrarUsuario } from '@/services/UserService';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/button';

export default function CadastroForm() {
    const [formData, setFormData] = useState<FormDTO>({
        nome: '',
        dataNascimento: '',
        documentoIdentificacao: '',
        sexo: '',
        etnia: '',
        senha: '',
        confirmarSenha: ''
    });

    const [submited, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function enviarCadastro(e: { preventDefault : () => void }) {
        e.preventDefault();
        try {
            setSubmitted(true);
            const cadastro: CadastroDTO = validarCadastro(formData);
            
            const mensagem: string = await registrarUsuario(cadastro);
            setFormData({
                nome: '',
                dataNascimento: '',
                documentoIdentificacao: '',
                sexo: '',
                etnia: '',
                senha: '',
                confirmarSenha: ''
            });
            alert(mensagem);
        } catch (erro) {
            alert(
                erro instanceof Error
                    ? erro.message
                    : 'Erro inesperado!'
                );
        }
    }

    return (
        <form
        onSubmit={enviarCadastro}
        className="w-full p-8 rounded-2xl shadow-lg flex flex-col gap-4"
        >
            <h1 className="text-2xl font-bold text-center">Criar nova conta</h1>

            <label className="flex flex-col gap-1 required">
                <span>
                    Nome<span className="text-red-500">* </span>:
                </span>
                <Input required name="nome" className={submited && !formData.nome ? 'border-red-500': ''} value={formData.nome} onChange={handleChange} />
            </label>

            <label className="flex flex-col gap-1">
                <span>
                    Data de Nascimento<span className="text-red-500">* </span>:
                </span>
                <Input
                    required
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                />
            </label>

            <label className="flex flex-col gap-1">
                <span>
                    Documento<span className="text-red-500">* </span>:
                </span>
            <Input required name="documentoIdentificacao" className={submited && !formData.documentoIdentificacao ? 'border-red-500': ''} value={formData.documentoIdentificacao} onChange={handleChange} />
            </label>

            <label className="flex flex-col gap-1">
            Sexo:
            <select name="sexo" value={formData.sexo} onChange={handleChange}>
                <option value="Masculino"> Masculino</option>
                <option value="Feminino">Feminino</option>
            </select>
            </label>

            <label className="flex flex-col gap-1">
            Etnia:
            <Input name="etnia" value={formData.etnia} onChange={handleChange} />
            </label>

            <label className="flex flex-col gap-1">
                <span>
                    Senha<span className="text-red-500">* </span>:
                </span>
            <Input required name="senha" className={submited && !formData.senha ? 'border-red-500': ''} type="password" value={formData.senha} onChange={handleChange} />
            </label>

            <label className="flex flex-col gap-1">
                <span>
                    Confirmar senha<span className="text-red-500">* </span>:
                </span>
            <Input required name="confirmarSenha" className={submited && !formData.confirmarSenha ? 'border-red-500': ''} type="password" value={formData.confirmarSenha} onChange={handleChange} />
            </label>
            <Button type="submit">Criar Conta</Button>
        </form>
    );
}