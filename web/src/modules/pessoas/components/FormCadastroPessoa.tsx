'use client'

import { FormEvent, useState } from 'react';
import { Save } from 'lucide-react';
import { cadastrarPessoa } from '../pessoasActions';
import { RequestPostPessoa } from '../pessoasDTO';

export default function FormCadastroPessoa({ onSucesso }: { onSucesso: () => void }) {
    const [form, setForm] = useState<RequestPostPessoa>({
        nome: '',
        documentoIdentificacao: '',
        dataNascimento: '',
        sexo: 'MASCULINO',
        etnia: ''
    });
    const [salvando, setSalvando] = useState(false);

    function alterar<K extends keyof RequestPostPessoa>(campo: K, valor: RequestPostPessoa[K]) {
        setForm((anterior) => ({ ...anterior, [campo]: valor }));
    }

    async function enviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setSalvando(true);
        try {
            const mensagem = await cadastrarPessoa({
                ...form,
                etnia: form.etnia?.trim() || undefined
            });
            alert(mensagem);
            onSucesso();
        } catch (erro) {
            alert(erro instanceof Error ? erro.message : 'Erro ao cadastrar pessoa.');
        } finally {
            setSalvando(false);
        }
    }

    const classe = 'w-full rounded-md border border-gray-300 p-2 text-sm';

    return (
        <form onSubmit={enviar} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
                <span className="mb-1 block">Nome *</span>
                <input required className={classe} value={form.nome} onChange={(e) => alterar('nome', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-gray-700">
                <span className="mb-1 block">Documento *</span>
                <input required className={classe} value={form.documentoIdentificacao} onChange={(e) => alterar('documentoIdentificacao', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-gray-700">
                <span className="mb-1 block">Data de nascimento *</span>
                <input type="date" required className={classe} value={form.dataNascimento} onChange={(e) => alterar('dataNascimento', e.target.value)} />
            </label>
            <label className="text-sm font-medium text-gray-700">
                <span className="mb-1 block">Sexo *</span>
                <select className={classe} value={form.sexo} onChange={(e) => alterar('sexo', e.target.value as RequestPostPessoa['sexo'])}>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                </select>
            </label>
            <label className="text-sm font-medium text-gray-700 md:col-span-2">
                <span className="mb-1 block">Etnia</span>
                <input className={classe} value={form.etnia ?? ''} onChange={(e) => alterar('etnia', e.target.value)} />
            </label>
            <div className="flex justify-end md:col-span-2">
                <button disabled={salvando} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
                    <Save className="h-4 w-4" />
                    {salvando ? 'Salvando...' : 'Cadastrar Pessoa'}
                </button>
            </div>
        </form>
    );
}
