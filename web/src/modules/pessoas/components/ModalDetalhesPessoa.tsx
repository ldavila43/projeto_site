'use client'
import { useState } from 'react';
import { X, User, Loader2, Edit2, Save } from 'lucide-react';
import {
    PessoaDTO,
    ResponsePessoaDTO,
    TIPOS_EMAIL,
    TIPOS_TELEFONE,
    TipoEmail,
    TipoTelefone
} from '../pessoasDTO';
import { useModalPessoa } from '../usePessoas';
import GerenciadorContatos from './GerenciadorContatos';
import GerenciadorEnderecos, {
    DadosFormularioEndereco
} from './GerenciadorEnderecos';
import {
    atualizarEmailPessoa,
    atualizarEnderecoPessoa,
    atualizarTelefonePessoa,
    cadastrarEmailPessoa,
    cadastrarEnderecoPessoa,
    cadastrarTelefonePessoa,
    excluirEmailPessoa,
    excluirEnderecoPessoa,
    excluirTelefonePessoa
} from '../pessoasActions';
import { formatarData } from '@/src/shared/utils/formatarData';

export interface ModalDetalhesPessoaProps {
    isOpen: boolean;
    onClose: () => void;
    titulo: string;
    funcaoBusca: (filtros: object) => Promise<ResponsePessoaDTO>;
    funcaoEdicao?: (dados: PessoaDTO) => Promise<string>;
    onSucesso?: (dadosAtualizados: PessoaDTO) => void;
    filtros?: object;
    permitirEditarDocumento?: boolean;
    permitirEditarContatos?: boolean;
}

export default function ModalDetalhesPessoa({
    isOpen,
    onClose,
    titulo,
    funcaoBusca,
    funcaoEdicao,
    onSucesso,
    filtros = {},
    permitirEditarDocumento = true,
    permitirEditarContatos = true
}: ModalDetalhesPessoaProps) {
    const { dados, carregando, recarregar } = useModalPessoa(isOpen, funcaoBusca, filtros);
    
    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [formPessoa, setFormPessoa] = useState<PessoaDTO | null>(null);

    function handleChange(campo: keyof PessoaDTO, valor: string) {
        if (formPessoa) {
            setFormPessoa({ ...formPessoa, [campo]: valor });
        }
    }

    async function handleSalvarEdicao() {
        if (!funcaoEdicao || !formPessoa) return;
        
        setSalvando(true);
        try {
            await funcaoEdicao(formPessoa);
            await recarregar();
            setEditando(false);

            if (onSucesso) {
                onSucesso(formPessoa);
            }

        } catch (error) {
            console.error("Erro ao salvar edição:", error);
            alert("Erro ao atualizar dados.");
        } finally {
            setSalvando(false);
        }
    }

    function cancelarEdicao() {
        setEditando(false);
        setFormPessoa(dados?.dadosPessoa || null); // Restaura os dados originais
    }

    function obterIdPessoa(): string {
        if (!dados?.dadosPessoa.idPessoa) {
            throw new Error('Pessoa não informada.');
        }
        return dados.dadosPessoa.idPessoa;
    }

    async function adicionarEmail(email: string, tipo: string) {
        await cadastrarEmailPessoa({
            idPessoa: obterIdPessoa(),
            email,
            tipo: tipo as TipoEmail
        });
        await recarregar();
    }

    async function editarEmail(idEmail: number, email: string, tipo: string) {
        await atualizarEmailPessoa({
            idPessoa: obterIdPessoa(),
            idEmail,
            email,
            tipo: tipo as TipoEmail
        });
        await recarregar();
    }

    async function excluirEmail(idEmail: number) {
        await excluirEmailPessoa({
            idPessoa: obterIdPessoa(),
            idEmail
        });
        await recarregar();
    }

    async function adicionarTelefone(telefone: string, tipo: string) {
        await cadastrarTelefonePessoa({
            idPessoa: obterIdPessoa(),
            telefone,
            tipo: tipo as TipoTelefone
        });
        await recarregar();
    }

    async function editarTelefone(
        idTelefone: number,
        telefone: string,
        tipo: string
    ) {
        await atualizarTelefonePessoa({
            idPessoa: obterIdPessoa(),
            idTelefone,
            telefone,
            tipo: tipo as TipoTelefone
        });
        await recarregar();
    }

    async function excluirTelefone(idTelefone: number) {
        await excluirTelefonePessoa({
            idPessoa: obterIdPessoa(),
            idTelefone
        });
        await recarregar();
    }

    async function adicionarEndereco(
        endereco: DadosFormularioEndereco & { idMunicipio: number }
    ) {
        await cadastrarEnderecoPessoa({
            idPessoa: obterIdPessoa(),
            ...endereco
        });
        await recarregar();
    }

    async function editarEndereco(
        idEndereco: number,
        endereco: DadosFormularioEndereco
    ) {
        await atualizarEnderecoPessoa({
            idPessoa: obterIdPessoa(),
            idEndereco,
            ...endereco
        });
        await recarregar();
    }

    async function excluirEndereco(idEndereco: number) {
        await excluirEnderecoPessoa({
            idPessoa: obterIdPessoa(),
            idEndereco
        });
        await recarregar();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50">
                    {carregando || !dados ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span>Buscando informações...</span>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100 relative">
                                <div className="flex items-center justify-between border-b pb-2 mb-3">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <User className="w-5 h-5" />
                                        <h3 className="font-medium">Dados Pessoais</h3>
                                    </div>
                                    
                                    {funcaoEdicao && !editando && (
                                        <button
                                            onClick={() => {
                                                setFormPessoa(dados.dadosPessoa);
                                                setEditando(true);
                                            }}
                                            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
                                        >
                                            <Edit2 className="w-4 h-4" /> Editar
                                        </button>
                                    )}
                                    {editando && (
                                        <div className="flex gap-2">
                                            <button onClick={cancelarEdicao} disabled={salvando} className="text-sm text-gray-500 hover:text-red-600">
                                                Cancelar
                                            </button>
                                            <button onClick={handleSalvarEdicao} disabled={salvando} className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Salvar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-semibold text-gray-600 block mb-1">Nome:</span>
                                        {editando ? (
                                            <input type="text" value={formPessoa?.nome || ''} onChange={e => handleChange('nome', e.target.value)} className="w-full border rounded px-2 py-1 focus:outline-blue-500" />
                                        ) : ( dados.dadosPessoa.nome || '-' )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600 block mb-1">Documento:</span>
                                        {editando && permitirEditarDocumento ? (
                                            <input type="text" value={formPessoa?.documentoIdentificacao || ''} onChange={e => handleChange('documentoIdentificacao', e.target.value)} className="w-full border rounded px-2 py-1 focus:outline-blue-500" />
                                        ) : ( dados.dadosPessoa.documentoIdentificacao || '-' )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600 block mb-1">Data de nascimento:</span>
                                        {editando ? (
                                            <input
                                                type="date"
                                                value={formPessoa?.dataNascimento?.slice(0, 10) || ''}
                                                onChange={e => handleChange('dataNascimento', e.target.value)}
                                                className="w-full border rounded px-2 py-1 focus:outline-blue-500"
                                            />
                                        ) : (
                                            formatarData(dados.dadosPessoa.dataNascimento)
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600 block mb-1">Sexo:</span>
                                        {editando ? (
                                            <select value={formPessoa?.sexo || ''} onChange={e => handleChange('sexo', e.target.value)} className="w-full border rounded px-2 py-1 focus:outline-blue-500">
                                                <option value="">Selecione</option>
                                                <option value="MASCULINO">Masculino</option>
                                                <option value="FEMININO">Feminino</option>
                                            </select>
                                        ) : ( dados.dadosPessoa.sexo || '-' )}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-600 block mb-1">Etnia:</span>
                                        {editando ? (
                                            <input type="text" value={formPessoa?.etnia || ''} onChange={e => handleChange('etnia', e.target.value)} className="w-full border rounded px-2 py-1 focus:outline-blue-500" />
                                        ) : ( dados.dadosPessoa.etnia || '-' )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <GerenciadorContatos
                                    variante="telefone"
                                    contatos={dados.telefones.map((telefone) => ({
                                        id: telefone.idTelefone,
                                        valor: telefone.telefone,
                                        tipo: telefone.tipo
                                    }))}
                                    tiposPermitidos={TIPOS_TELEFONE}
                                    onAdicionar={adicionarTelefone}
                                    onEditar={editarTelefone}
                                    onExcluir={excluirTelefone}
                                    somenteLeitura={!permitirEditarContatos}
                                />

                                <GerenciadorContatos
                                    variante="email"
                                    contatos={dados.emails.map((email) => ({
                                        id: email.idEmail,
                                        valor: email.email,
                                        tipo: email.tipo
                                    }))}
                                    tiposPermitidos={TIPOS_EMAIL}
                                    onAdicionar={adicionarEmail}
                                    onEditar={editarEmail}
                                    onExcluir={excluirEmail}
                                    somenteLeitura={!permitirEditarContatos}
                                />
                            </div>

                            <GerenciadorEnderecos
                                enderecos={dados.enderecos}
                                onAdicionar={adicionarEndereco}
                                onEditar={editarEndereco}
                                onExcluir={excluirEndereco}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
