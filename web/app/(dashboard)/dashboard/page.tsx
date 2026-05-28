'use client'

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { ViewPaciente } from '@/components/dashboard/ViewPaciente'
import { ViewProfissional } from '@/components/dashboard/ViewProfissional'
import { ViewColaborador } from '@/components/dashboard/ViewColaborador'
import { ViewAdmin } from '@/components/dashboard/ViewAdmin'


const views = {
    0: ViewAdmin,
    1: ViewProfissional,
    2: ViewColaborador,
    3: ViewPaciente,
} as const;


export default function Dashboard() {
    const context = useContext(AuthContext);
    if (!context){
        return null
    }
    const Component =
        context.perfilAtivo !== null
            ? views[context.perfilAtivo]
            : ViewPaciente;
    return (
        <div>
            <div className={'font-sans text-xl'}>Olá {context.nome}</div>
            <Component />
        </div>
    )
}