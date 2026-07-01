'use client'
import { useState } from 'react';
import TemplateSolicitacoes from './TemplateViewSolicitacoes';
import ModalNovaSolicitacao from './ModalNovaSolicitacao';
import { buscarDadosSolicitacoes } from '@/src/modules/solicitacoes_exame/solicitacoesActions';
import { GetSolicitacoesResponse } from '../SolicitacaoDTO';

export default function ViewSolicitacoes({ dadosIni }: { dadosIni: GetSolicitacoesResponse }) {
    const [modalAberto, setModalAberto] = useState(false);
    return (
        <div>
            <TemplateSolicitacoes
                initialDados={dadosIni}
                funcao={buscarDadosSolicitacoes}
                onAbrirNovaSolicitacao={() => setModalAberto(true)}
            />

            <ModalNovaSolicitacao
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
            />
        </div>
    );
}