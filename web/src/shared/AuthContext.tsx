'use client'
import { PerfilID } from '@/src/shared/utils/PerfisEnum';
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { useEffect, useState, createContext } from 'react';
import AuthContextDTO from '@/src/modules/auth/AuthContextDTO';
import { actionAlterarPerfil } from '@/src/modules/auth/authActions';
type Props = {
    children: React.ReactNode,
    initialData: UserContextDTO
}

export const AuthContext = createContext<AuthContextDTO | undefined>(undefined);

export function AuthProvider({ children, initialData }: Props) {
    const [perfilAtivo, setPerfilAtivo] = useState(initialData.perfilAtivo);

    useEffect(() => {
        setPerfilAtivo(initialData.perfilAtivo);
    }, [initialData.perfilAtivo]);


    async function alterarPerfil(novoPerfil: string) {
        const perfil = Number(novoPerfil);

        if (Number.isNaN(perfil)) {
            throw new Error('Perfil inválido');
        }

        setPerfilAtivo(perfil as PerfilID);

        'trocando perfil'
        await actionAlterarPerfil(novoPerfil)
    }
    return (
        <AuthContext.Provider
            value={{
                ...initialData,
                perfilAtivo,
                alterarPerfil
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}