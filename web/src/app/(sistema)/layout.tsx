import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { tokenExtractor } from '@/src/shared/tokenAction';
import UserContextDTO from '@/src/modules/auth/UserContextDTO';
import { AuthProvider } from '@/src/shared/AuthContext';
import DashboardShell from '@/src/shared/components/DashboardShell';
import { buscaRotasOperadores } from '@/src/modules/operadores/operadoresActions';
import { isPerfilID, obterPerfilPrioritario } from '@/src/shared/utils/PerfisEnum';

export default async function DashboardLayout({ children }: Readonly<{children: React.ReactNode}>) {

    const dadosIniciais = await tokenExtractor();

    if (!dadosIniciais) {
        return redirect('/login');
    }

    const cookieStore = await cookies();
    const perfilSalvoNoCookie = cookieStore.get('x-perfil-ativo')?.value;

    const perfilEntrada = obterPerfilPrioritario(dadosIniciais.perfis);

    const perfilDoCookie = Number(perfilSalvoNoCookie);
    const perfilAtual = isPerfilID(perfilDoCookie) && dadosIniciais.perfis.some(({ id }) => id === perfilDoCookie)
        ? perfilDoCookie
        : perfilEntrada;

    const linksDaSidebar = await buscaRotasOperadores();

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
