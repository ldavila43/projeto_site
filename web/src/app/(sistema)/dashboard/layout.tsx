'use client'
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/src/shared/AuthContext';

export default function LayoutDashboard({ children }: Readonly<{children: React.ReactNode}> ) {

    const context = useContext(AuthContext);

    if (!context){
        return null
    }

    return (
    <div className={'flex flex-col w-full max-w-6xl mx-auto p-6 font-sans text-xl'}>
        <span className={'text-2xl font-bold'}>Olá {context.nome.split(' ')[0]}!</span>
        {children}
    </div>
    )
}