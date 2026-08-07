'use client'

import { useEffect, useState } from 'react';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import { buscarVisaoGeralExame } from '../examesActions';
import { VisaoGeralExame } from '../ExamesDTO';

interface Props {
    idExame: number | null;
    onClose: () => void;
}

export default function ModalVisaoGeralExame({ idExame, onClose }: Props) {
    const [dados, setDados] = useState<VisaoGeralExame | null>(null);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!idExame) return;

        let ativo = true;
        buscarVisaoGeralExame(idExame)
            .then((resultado) => {
                if (ativo) setDados(resultado);
            })
            .catch((falha: unknown) => {
                if (ativo) setErro(falha instanceof Error ? falha.message : 'Erro ao buscar resultado.');
            });

        return () => {
            ativo = false;
        };
    }, [idExame]);

    function fechar() {
        setDados(null);
        setErro('');
        onClose();
    }

    return (
        <ModalFormulario aberto={idExame !== null} titulo="Visão Geral do Exame" onClose={fechar} largura="xl">
            {erro && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{erro}</p>}
            {!dados && !erro && <p className="py-8 text-center text-gray-500">Carregando resultado...</p>}
            {dados && (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Secao titulo="Relação Bacillota/Bacteroidota">
                        {dados.bacilotaBacteroidota ? (
                            <dl className="grid grid-cols-3 gap-3 text-sm">
                                <Metrica nome="Razão" valor={dados.bacilotaBacteroidota.razao} />
                                <Metrica nome="Bacillota" valor={dados.bacilotaBacteroidota.bacilota} />
                                <Metrica nome="Bacteroidota" valor={dados.bacilotaBacteroidota.bacteroidota} />
                            </dl>
                        ) : <Vazio />}
                    </Secao>
                    <Secao titulo="Composição por Espécie">
                        <Lista itens={dados.composicaoDominio.map((item) => ({
                            nome: item.especie,
                            valor: item.abundancia
                        }))} />
                    </Secao>
                    <Secao titulo="Principais Vias">
                        <Lista itens={dados.topVias.map((item) => ({ nome: item.nomeVia, valor: item.abundancia }))} />
                    </Secao>
                    <Secao titulo="Severidade e Persistência">
                        <Lista itens={dados.severidadePersistencia.map((item) => ({ nome: item.tipo, valor: item.abundancia }))} />
                    </Secao>
                </div>
            )}
        </ModalFormulario>
    );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <section className="rounded-md border bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-800">{titulo}</h3>
            {children}
        </section>
    );
}

function Metrica({ nome, valor }: { nome: string; valor: number }) {
    return <div><dt className="text-gray-500">{nome}</dt><dd className="font-semibold">{valor}</dd></div>;
}

function Lista({ itens }: { itens: Array<{ nome: string; valor: string | number }> }) {
    if (itens.length === 0) return <Vazio />;
    return (
        <ul className="divide-y text-sm">
            {itens.map((item, indice) => (
                <li key={`${item.nome}-${indice}`} className="flex justify-between py-2">
                    <span>{item.nome}</span><strong>{item.valor}</strong>
                </li>
            ))}
        </ul>
    );
}

function Vazio() {
    return <p className="text-sm text-gray-500">Sem dados disponíveis.</p>;
}
