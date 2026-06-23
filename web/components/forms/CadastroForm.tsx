'use client';
import { useState } from 'react';
import CadastroDTO from '@/models/CadastroDTO';
import FormDTO from '@/models/FormDTO';
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
        <form onSubmit={enviarCadastro} className="w-full py-10 max-w-sm flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-[22px] font-semibold tracking-tight">Criar nova conta</h1>
                <p className="text-sm text-gray-500 mt-1">Preencha os dados para solicitar acesso</p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">
                    Nome <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        required
                        name="nome"
                        className={`pl-9 ${submited && !formData.nome ? 'border-red-500' : ''}`}
                        value={formData.nome}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Data de Nascimento <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        required
                        name="dataNascimento"
                        className={`pl-9 ${submited && !formData.dataNascimento ? 'border-red-500' : ''}`}
                        value={formData.dataNascimento}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Documento Identificação <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        required
                        name="dataNascimento"
                        className={`pl-9 ${submited && !formData.documentoIdentificacao ? 'border-red-500' : ''}`}
                        value={formData.documentoIdentificacao}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Sexo <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                        className="w-full h-10 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-[#2E6DA4] focus:ring-2 focus:ring-[#2E6DA4]/10"
                    >
                        <option value="Masculino"> Masculino</option>
                        <option value="Feminino">Feminino</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Etnia <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        name="etnia"
                        className={`pl-9 ${submited && !formData.etnia ? 'border-red-500' : ''}`}
                        value={formData.etnia}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        required
                        type='password'
                        name="senha"
                        className={`pl-9 ${submited && !formData.senha ? 'border-red-500' : ''}`}
                        value={formData.senha}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-medium text-gray-500">
                    Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <i className="ti ti-user absolute left-3 text-gray-400 text-base pointer-events-none" />
                    <Input
                        required
                        type='password'
                        name="confirmarSenha"
                        className={`pl-9 ${submited && !formData.confirmarSenha ? 'border-red-500' : ''}`}
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <Button className='bg-[#1E3A5F] text-white hover:bg-[#2E6DA4] w-full' type="submit">Criar Conta</Button>
        </form>
    );
}