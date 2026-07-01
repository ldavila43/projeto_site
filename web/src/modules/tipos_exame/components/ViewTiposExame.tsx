'use client'
import { useState } from 'react';
import TemplateTiposExame from './TemplateTiposExame';
import ModalNovoTipoExame from './ModalNovoTipoExame';
import { buscarDadosTiposExame } from '@/src/modules/tipos_exame/tiposExameActions';
import { ResponseGetTiposExame } from '../TiposExameDTO';

export default function ViewTiposExame({ dadosIni }: { dadosIni: ResponseGetTiposExame }) {
    const [modalAberto, setModalAberto] = useState(false);

    return (
        <div>
            {/* Passamos a função de abrir o modal para o template de listagem */}
            <TemplateTiposExame
                initialDados={dadosIni}
                funcao={buscarDadosTiposExame}
                onAbrirNovoTipo={() => setModalAberto(true)}
            />

            {/* O Modal de Cadastro */}
            <ModalNovoTipoExame
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
            />
        </div>
    );
}