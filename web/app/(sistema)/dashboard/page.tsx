'use client'
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'

const rotasPorPerfil = {
    0: '/dashboard/admin',
    1: '/dashboard/profissional',
    2: '/dashboard/colaborador',
    3: '/dashboard/paciente'
} as const;


export default function Dashboard() {
    const context = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if(!context) return;

        const perfil = rotasPorPerfil[context.perfilAtivo as keyof typeof rotasPorPerfil];
        router.replace(perfil)
    }, [context, router]);

    return null
}