import { redirect } from 'next/navigation'
import { tokenExtractor } from '@/src/shared/tokenAction';
import { definirHierarquia } from '@/src/shared/utils/PerfisDashboard';
import PayloadUsuario from '@/src/shared/PayloadUsuario';
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { AuthProvider } from '@/src/shared/AuthContext';
import { PerfilID } from '@/src/shared/utils/PerfisEnum'
import DashboardShell from '@/src/shared/components/DashboardShell';

export default async function DashboardLayout( { children }: Readonly<{children: React.ReactNode}> ) {

    const dadosIniciais: PayloadUsuario | null =  await tokenExtractor();

    if(!dadosIniciais) {
        return redirect('/login');
    }
    const perfilEntrada: number | null = definirHierarquia(dadosIniciais.perfis as PerfilID[])
    const contextoUsuario: UserContextDTO = {
        id: dadosIniciais.id,
        nome: dadosIniciais.nome,
        perfisDisponiveis: dadosIniciais.perfis as PerfilID[],
        perfilAtivo: perfilEntrada as PerfilID ?? null,
    }


    return (
        <AuthProvider initialData={contextoUsuario}>
            <DashboardShell>
                        {children}
            </DashboardShell>
        </AuthProvider>
    )
}