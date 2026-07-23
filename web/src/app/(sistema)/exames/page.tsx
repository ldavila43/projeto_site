'use client'
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/src/shared/AuthContext';
import { useRouter } from 'next/navigation'
import { PERFIS } from '@/src/shared/utils/PerfisEnum';

const rotasPorPerfil = {
    [PERFIS.ADMINISTRADOR]: '/exames/admin',
    [PERFIS.PROFISSIONAL]: '/exames/profissional',
    [PERFIS.COLABORADOR]: '/exames/admin',
    [PERFIS.PACIENTE]: '/exames/paciente'
} as const;


export default function Exames() {
    const context = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if(!context) return;

        const perfil = rotasPorPerfil[context.perfilAtivo as keyof typeof rotasPorPerfil];
        router.replace(perfil)
    }, [context, router]);

    return null
}
