'use client'
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/src/shared/AuthContext';
import { useRouter } from 'next/navigation'

const rotasPorPerfil = {
    0: '/pacientes/admin',
    1: '/pacientes/profissional',
    2: '/pacientes/colaborador',
} as const;


export default function Pacientes() {
    const context = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if(!context) return;

        const perfil = rotasPorPerfil[context.perfilAtivo as keyof typeof rotasPorPerfil];
        router.replace(perfil)
    }, [context, router]);

    return null
}