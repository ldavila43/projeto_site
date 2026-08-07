'use client'
import { GraficoBarrasEmpilhadas } from '@/src/shared/components/GraficoBarrasEmpilhadas'
import { useState } from 'react';
import Card from '@/src/shared/components/Card';
import { buscarDadosProfissionais } from '@/src/modules/dashboard/dashBoardActions';
import { DashProfissionaisDTO } from '@/src/modules/dashboard/ViewProfissionaisDTO'
import { transformarExamesParaGrafico } from '@/src/shared/utils/transformarExames'

interface ViewProfissionalProps {
    dadosIni: DashProfissionaisDTO;
    dataIniInicial: string;
    dataFimInicial: string;
}

export function ViewProfissional({
    dadosIni,
    dataIniInicial,
    dataFimInicial
}: ViewProfissionalProps) {
    const [dados, setDados] = useState<DashProfissionaisDTO>(dadosIni);
    const [carregando, setCarregando] = useState(false);
    const { dadosTransformados, tiposUnicos } = dados
        ? transformarExamesParaGrafico(dados.exames)
        : { dadosTransformados: [], tiposUnicos: [] };
    const [dataIni, setDataIni] = useState(dataIniInicial);
    const [dataFim, setDataFim] = useState(dataFimInicial);

    async function carregarDados() {
        setCarregando(true);
        try {
            setDados(await buscarDadosProfissionais(undefined, dataIni, dataFim));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div >
            <span className='py-3 text-gray-600 text-base'>Acompanhe seus exames, incluindo os pendentes de aprobação no laboratório e os laudos já liberados para dowload</span>
            <div className='flex flex-col gap-3'>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card titulo="Total de Pacientes">
                        <span className="text-4xl font-bold text-gray-900 mt-2">
                            {dados?.estatisticas.totalPacientes}
                        </span>
                    </Card>

                    <Card titulo="Exames Concluídos">
                        <span className="text-4xl font-bold text-gray-900 mt-2">
                            {dados?.estatisticas.analisesCompletas}
                        </span>
                    </Card>


                    <Card titulo="Exames Pendentes">
                        <span className="text-4xl font-bold text-green-600 mt-2">
                            {dados?.estatisticas.analisesPendentes}
                        </span>
                    </Card>
                </div>

                <Card titulo="Resumo de exames">
                    <div className="mb-4 flex felx-col gap-2">
                        <label htmlFor="data-ini" className="text-sm font-medium text-gray-700 mr-2">Data Inicio:</label>
                        <input
                            id="data-ini"
                            type="date"
                            value={dataIni}
                            onChange={(e) => setDataIni(e.target.value)}
                            className="border border-gray-300 rounded-md p-1.5 text-sm"
                        >
                        </input>
                        <label htmlFor="data-fim" className="text-sm font-medium text-gray-700 mr-2">Data Fim:</label>
                        <input
                            id="data-fim"
                            type="date"
                            value={dataFim}
                            min={dataIni}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="border border-gray-300 rounded-md p-1.5 text-sm"
                        >
                        </input>
                        <button
                            type="button"
                            onClick={carregarDados}
                            disabled={carregando}
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white disabled:opacity-50"
                        >
                            {carregando ? 'Atualizando...' : 'Atualizar'}
                        </button>
                    </div>
                    <GraficoBarrasEmpilhadas
                        dados={dadosTransformados}
                        chaveX="periodo"
                        chavesY={tiposUnicos}
                    />
                </Card>
            </div>
        </div>
    );
}
