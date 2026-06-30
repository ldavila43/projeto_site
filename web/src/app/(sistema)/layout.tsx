import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { tokenExtractor } from '@/src/shared/tokenAction';
import { PayloadUsuario } from '@/src/shared/PayloadUsuario';
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { AuthProvider } from '@/src/shared/AuthContext';
import DashboardShell from '@/src/shared/components/DashboardShell';
import { buscaRotasOperadores } from '@/src/modules/operadores/operadoresActions';

export default async function DashboardLayout({ children }: Readonly<{children: React.ReactNode}>) {

    const dadosIniciais: PayloadUsuario = await tokenExtractor();

    if (!dadosIniciais) {
        return redirect('/login');
    }

    const cookieStore = await cookies();
    const perfilSalvoNoCookie = cookieStore.get('x-perfil-ativo')?.value;

    const linksDaSidebar = await buscaRotasOperadores();
    
    const perfilEntrada = dadosIniciais.perfis.length > 0 ? dadosIniciais.perfis[0].id : undefined;

    const perfilAtual = perfilSalvoNoCookie ? Number(perfilSalvoNoCookie) : perfilEntrada;

    const contextoUsuario: UserContextDTO = {
        id: dadosIniciais.id,
        nome: dadosIniciais.nome,
        perfisDisponiveis: dadosIniciais.perfis,
        perfilAtivo: perfilAtual,
    }

    return (
        <AuthProvider initialData={contextoUsuario}>
            <DashboardShell linksDaSidebar={linksDaSidebar}>
                {children}
            </DashboardShell>
        </AuthProvider>
    )
}