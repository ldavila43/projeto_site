'use client'
import { X, User, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { ResponsePessoaDTO } from '../pessoasDTO';
import { useModalPessoa } from '../usePessoas';

export interface ModalDetalhesPessoaProps {
    isOpen: boolean;
    onClose: () => void;
    titulo: string;
    funcao: (filtros: object) => Promise<ResponsePessoaDTO>;
    filtros?: object;
}

export default function ModalDetalhesPessoa({ isOpen, onClose, titulo, funcao, filtros = {} }: ModalDetalhesPessoaProps) {
    const { dados, carregando } = useModalPessoa(isOpen, funcao, filtros);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                
                {/* Header do Modal */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corpo do Modal */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50">
                    {carregando || !dados ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span>Buscando informações...</span>
                        </div>
                    ) : (
                        <>
                            {/* Sessão: Dados Pessoais */}
                            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-3 border-b pb-2">
                                    <User className="w-5 h-5" />
                                    <h3 className="font-medium">Dados Pessoais</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><span className="font-semibold text-gray-600">Nome:</span> {dados.dadosPessoa.nome || '-'}</div>
                                    <div><span className="font-semibold text-gray-600">Documento:</span> {dados.dadosPessoa.documentoIdentificacao || '-'}</div>
                                    <div><span className="font-semibold text-gray-600">Sexo:</span> {dados.dadosPessoa.sexo || '-'}</div>
                                    <div><span className="font-semibold text-gray-600">Etnia:</span> {dados.dadosPessoa.etnia || '-'}</div>
                                </div>
                            </div>

                            {/* Sessão: Contatos (Telefones e Emails) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-green-600 mb-3 border-b pb-2">
                                        <Phone className="w-5 h-5" />
                                        <h3 className="font-medium">Telefones</h3>
                                    </div>
                                    {dados.telefones.length > 0 ? (
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            {dados.telefones.map(tel => (
                                                <li key={tel.idPessoa + tel.telefone}>
                                                    <span className="font-medium text-gray-500">[{tel.tipo}]</span> {tel.telefone}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <span className="text-sm text-gray-400">Nenhum telefone cadastrado.</span>}
                                </div>

                                <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2 text-orange-600 mb-3 border-b pb-2">
                                        <Mail className="w-5 h-5" />
                                        <h3 className="font-medium">E-mails</h3>
                                    </div>
                                    {dados.emails.length > 0 ? (
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            {dados.emails.map(email => (
                                                <li key={email.idPessoa + email.email}>
                                                    <span className="font-medium text-gray-500">[{email.tipo}]</span> {email.email}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <span className="text-sm text-gray-400">Nenhum e-mail cadastrado.</span>}
                                </div>
                            </div>

                            {/* Sessão: Endereços */}
                            <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-3 border-b pb-2">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="font-medium">Endereços</h3>
                                </div>
                                {dados.enderecos.length > 0 ? (
                                    <div className="space-y-4">
                                        {dados.enderecos.map(end => (
                                            <div key={end.idEndereco} className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                                                <div className="font-medium text-gray-800 mb-1">{end.tipoEndereco}</div>
                                                <div>{end.logradouro}, {end.numero} {end.complemento && `- ${end.complemento}`}</div>
                                                <div>{end.bairro} - {end.cidade}/{end.estado} - {end.cep}</div>
                                                <div>{end.pais}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <span className="text-sm text-gray-400">Nenhum endereço cadastrado.</span>}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}