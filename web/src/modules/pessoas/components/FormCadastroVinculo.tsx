'use client'

import { FormEvent, useCallback, useState } from 'react';
import { Save } from 'lucide-react';
import { RequestPostPaciente } from '@/src/modules/pacientes/PacientesDTO';
import { RequestPostProfissional } from '@/src/modules/profissionais/profissionaisDTO';
import SeletorMunicipio from '@/src/modules/localidades/components/SeletorMunicipio';
import CampoCep from '@/src/modules/localidades/components/CampoCep';
import { EnderecoViaCep } from '@/src/modules/localidades/cepService';
import { TIPOS_ENDERECO } from '@/src/modules/pessoas/pessoasDTO';

type Props =
    | {
        tipo: 'paciente';
        salvar: (dados: RequestPostPaciente) => Promise<string>;
        onSucesso: () => void;
    }
    | {
        tipo: 'profissional';
        salvar: (dados: RequestPostProfissional) => Promise<string>;
        onSucesso: () => void;
    };

interface EstadoFormulario {
    nome: string;
    documentoIdentificacao: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    tipoContato: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    tipoEndereco: string;
    idCidade: string;
    complemento: string;
    sexo: '' | 'MASCULINO' | 'FEMININO';
    etnia: string;
    estadoCivil: string;
    profissao: string;
    idProfissao: string;
}

const estadoInicial: EstadoFormulario = {
    nome: '',
    documentoIdentificacao: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    tipoContato: 'PRINCIPAL',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    tipoEndereco: 'RESIDENCIAL',
    idCidade: '',
    complemento: '',
    sexo: '',
    etnia: '',
    estadoCivil: '',
    profissao: '',
    idProfissao: ''
};

const classeCampo = 'w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function FormCadastroVinculo(props: Props) {
    const [form, setForm] = useState(estadoInicial);
    const [salvando, setSalvando] = useState(false);
    const [localidadeCep, setLocalidadeCep] = useState<{
        uf: string;
        municipio: string;
        chave: number;
    } | null>(null);

    const alterar = useCallback((campo: keyof EstadoFormulario, valor: string) => {
        setForm((anterior) => ({ ...anterior, [campo]: valor }));
    }, []);

    const alterarMunicipio = useCallback((idMunicipio: string) => {
        alterar('idCidade', idMunicipio);
    }, [alterar]);

    const preencherEnderecoPorCep = useCallback((endereco: EnderecoViaCep) => {
        setForm((anterior) => ({
            ...anterior,
            cep: endereco.cep.replace(/\D/g, ''),
            logradouro: endereco.logradouro || anterior.logradouro,
            bairro: endereco.bairro || anterior.bairro,
            complemento: endereco.complemento || anterior.complemento,
            idCidade: ''
        }));
        setLocalidadeCep({
            uf: endereco.uf,
            municipio: endereco.localidade,
            chave: Date.now()
        });
    }, []);

    async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!form.idCidade) {
            alert('Selecione um município da lista.');
            return;
        }
        setSalvando(true);

        try {
            const dadosComuns = {
                nome: form.nome,
                documentoIdentificacao: form.documentoIdentificacao,
                dataNascimento: form.dataNascimento,
                email: form.email,
                telefone: form.telefone,
                tipoContato: form.tipoContato,
                cep: form.cep,
                logradouro: form.logradouro,
                numero: form.numero,
                bairro: form.bairro,
                tipoEndereco: form.tipoEndereco,
                idCidade: Number(form.idCidade),
                complemento: form.complemento,
                sexo: form.sexo as 'MASCULINO' | 'FEMININO',
                etnia: form.etnia
            };

            const mensagem = props.tipo === 'paciente'
                ? await props.salvar({
                    ...dadosComuns,
                    estadoCivil: form.estadoCivil,
                    profissao: form.profissao
                })
                : await props.salvar({
                    ...dadosComuns,
                    idProfissao: Number(form.idProfissao)
                });

            alert(mensagem);
            props.onSucesso();
        } catch (erro) {
            alert(erro instanceof Error ? erro.message : 'Erro ao realizar cadastro.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Campo label="Nome" obrigatorio>
                    <input required value={form.nome} onChange={(e) => alterar('nome', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Documento de identificação" obrigatorio>
                    <input required value={form.documentoIdentificacao} onChange={(e) => alterar('documentoIdentificacao', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Data de nascimento" obrigatorio>
                    <input type="date" required value={form.dataNascimento} onChange={(e) => alterar('dataNascimento', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Sexo" obrigatorio>
                    <select required value={form.sexo} onChange={(e) => alterar('sexo', e.target.value)} className={classeCampo}>
                        <option value="">Selecione</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMININO">Feminino</option>
                    </select>
                </Campo>
                <Campo label="Etnia" obrigatorio>
                    <input required value={form.etnia} onChange={(e) => alterar('etnia', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="E-mail" obrigatorio>
                    <input type="email" required value={form.email} onChange={(e) => alterar('email', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Telefone" obrigatorio>
                    <input required value={form.telefone} onChange={(e) => alterar('telefone', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Tipo de contato" obrigatorio>
                    <input required value={form.tipoContato} onChange={(e) => alterar('tipoContato', e.target.value)} className={classeCampo} />
                </Campo>
            </div>

            <fieldset className="grid grid-cols-1 gap-4 rounded-md border border-gray-200 p-4 md:grid-cols-2">
                <legend className="px-2 text-sm font-semibold text-gray-700">Endereço</legend>
                <CampoCep
                    value={form.cep}
                    onChange={(cep) => alterar('cep', cep)}
                    onEnderecoEncontrado={preencherEnderecoPorCep}
                    classeCampo={classeCampo}
                    required
                />
                <Campo label="Logradouro" obrigatorio>
                    <input required value={form.logradouro} onChange={(e) => alterar('logradouro', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Número" obrigatorio>
                    <input required value={form.numero} onChange={(e) => alterar('numero', e.target.value)} className={classeCampo} />
                </Campo>
                <Campo label="Bairro" obrigatorio>
                    <input required value={form.bairro} onChange={(e) => alterar('bairro', e.target.value)} className={classeCampo} />
                </Campo>
                <SeletorMunicipio
                    key={localidadeCep?.chave ?? 'municipio-cadastro'}
                    idMunicipio={form.idCidade}
                    onChange={alterarMunicipio}
                    classeCampo={classeCampo}
                    ufSugerida={localidadeCep?.uf}
                    municipioSugerido={localidadeCep?.municipio}
                />
                <Campo label="Tipo de endereço" obrigatorio>
                    <select required value={form.tipoEndereco} onChange={(e) => alterar('tipoEndereco', e.target.value)} className={classeCampo}>
                        {TIPOS_ENDERECO.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo === 'OUTRO'
                                    ? 'Outro'
                                    : tipo.charAt(0) + tipo.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </Campo>
                <Campo label="Complemento" obrigatorio>
                    <input required value={form.complemento} onChange={(e) => alterar('complemento', e.target.value)} className={classeCampo} />
                </Campo>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {props.tipo === 'paciente' ? (
                    <>
                        <Campo label="Estado civil" obrigatorio>
                            <input required value={form.estadoCivil} onChange={(e) => alterar('estadoCivil', e.target.value)} className={classeCampo} />
                        </Campo>
                        <Campo label="Profissão" obrigatorio>
                            <input required value={form.profissao} onChange={(e) => alterar('profissao', e.target.value)} className={classeCampo} />
                        </Campo>
                    </>
                ) : (
                    <Campo label="ID da profissão" obrigatorio>
                        <input type="number" min="1" required value={form.idProfissao} onChange={(e) => alterar('idProfissao', e.target.value)} className={classeCampo} />
                    </Campo>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={salvando}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {salvando ? 'Salvando...' : 'Cadastrar'}
                </button>
            </div>
        </form>
    );
}

function Campo({
    label,
    obrigatorio,
    children
}: {
    label: string;
    obrigatorio?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label className="block text-sm font-medium text-gray-700">
            <span className="mb-1 block">{label}{obrigatorio ? ' *' : ''}</span>
            {children}
        </label>
    );
}
