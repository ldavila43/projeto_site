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
        <div className={'flex flex-col w-full max-w-6xl mx-auto p-6 font-sans text-xl'}>
            <span className={'text-2xl font-bold'}>Olá {context.nome.split(' ')[0]}!</span>
            <Component />
        </div>
    )
}