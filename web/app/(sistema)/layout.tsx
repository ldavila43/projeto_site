import { redirect } from 'next/navigation'
import { tokenExtractor } from '@/actions/tokenAction';
import { definirHierarquia } from '@/utils/PerfisDashboard';
import PayloadUsuario from '@/models/PayloadUsuario';
import UserContextDTO from '@/models/UserContextDTO';
import { AuthProvider } from '@/contexts/AuthContext';
import { PerfilID } from '@/utils/PerfisEnum'
import DashboardShell from '@/components/dashboard/DashboardShell';

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