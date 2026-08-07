'use client'

import { useContext, useState } from 'react';
import { UserPlus } from 'lucide-react';
import TemplateOperadores from './TemplateOperadores';
import { OperadoresResponse } from '../operadoresDTO';
import ModalFormulario from '@/src/shared/components/ModalFormulario';
import CadastroForm from '@/src/modules/auth/components/forms/CadastroForm';
import { AuthContext } from '@/src/shared/AuthContext';
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

export default function ViewOperadores({ dadosIni }: { dadosIni: OperadoresResponse }) {
    const contexto = useContext(AuthContext);
    const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-end gap-2">
                {contexto?.perfilAtivo === PERFIS.ADMINISTRADOR && (
                    <button
                        type="button"
                        onClick={() => setModalUsuarioAberto(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        <UserPlus className="h-4 w-4" />
                        Novo Usuário
                    </button>
                )}
            </div>

            <TemplateOperadores dadosIni={dadosIni} />

            <ModalFormulario
                aberto={modalUsuarioAberto}
                titulo="Novo Usuário"
                onClose={() => setModalUsuarioAberto(false)}
            >
                <CadastroForm onSucesso={() => setModalUsuarioAberto(false)} />
            </ModalFormulario>
        </div>
    );
}
