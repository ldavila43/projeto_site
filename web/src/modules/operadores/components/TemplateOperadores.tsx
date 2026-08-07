'use client'

import TemplateListagem from '@/src/shared/components/TemplateListagem';
import { useListagem } from '@/src/shared/hooks/useListagem';
import { ColunaTabela } from '@/src/shared/components/TabelaDados';
import { CampoFiltroConfig } from '@/src/shared/types/listagem';
import { buscarDadosOperadores } from '../operadoresActions';
import { FiltroBuscaOperadores, Operador, OperadoresResponse } from '../operadoresDTO';

const camposFiltro: CampoFiltroConfig<FiltroBuscaOperadores>[] = [
    { tipo: 'texto', name: 'nomeOperador', label: 'Nome do Operador' },
    { tipo: 'texto', name: 'documentoOperador', label: 'Documento' },
    {
        tipo: 'select',
        name: 'status',
        label: 'Status',
        opcoes: [
            { value: '', label: 'Todos' },
            { value: 'ATIVO', label: 'Ativo' },
            { value: 'INATIVO', label: 'Inativo' }
        ]
    },
    { tipo: 'texto', name: 'idPerfil', label: 'ID do Perfil' }
];

const colunas: ColunaTabela<Operador>[] = [
    { chave: 'nomeOperador', titulo: 'Nome do Operador', className: 'font-medium text-gray-800' },
    { chave: 'documentoOperador', titulo: 'Documento' },
    {
        chave: 'listaPerfis',
        titulo: 'Perfis',
        render: (operador) => operador.listaPerfis?.join(', ') || '-'
    },
    {
        chave: 'statusOperador',
        titulo: 'Status',
        render: (operador) => (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                operador.statusOperador === 'ATIVO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>
                {operador.statusOperador}
            </span>
        )
    }
];

export default function TemplateOperadores({ dadosIni }: { dadosIni: OperadoresResponse }) {
    const listagem = useListagem<FiltroBuscaOperadores, OperadoresResponse, Operador>({
        funcao: buscarDadosOperadores,
        filtrosIniciais: {
            nomeOperador: '',
            documentoOperador: '',
            status: '',
            idPerfil: '',
            limit: '10',
            page: '1'
        },
        obterItens: (resposta) => resposta.dados,
        obterMetadados: (resposta) => resposta.metadados,
        initialDados: dadosIni,
        autoBuscar: true,
        camposAutoBusca: ['nomeOperador', 'documentoOperador', 'status', 'idPerfil']
    });

    return (
        <TemplateListagem
            titulo="Operadores"
            dados={listagem.dados}
            metadados={listagem.metadados}
            carregando={listagem.carregando}
            erro={listagem.erro}
            filtros={listagem.filtros}
            colunas={colunas}
            camposFiltro={camposFiltro}
            getKey={(operador) => operador.idOperador}
            onChangeFiltro={listagem.handleChange}
            onPesquisar={listagem.handlePesquisar}
            onLimparFiltros={listagem.handleLimparFiltros}
            onMudarPagina={listagem.handlePagina}
            onMudarLimite={listagem.handleLimite}
            mensagemVazio="Nenhum operador encontrado."
        />
    );
}
