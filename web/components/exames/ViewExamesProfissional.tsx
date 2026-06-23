import { buscarDadosExamesProfissional } from '@/actions/examesActions'
import TemplateExames from '@/components/exames/TemplateExames'


export default function ViewExamesProfissional() {

    return (
        <div>
            <TemplateExames funcao={buscarDadosExamesProfissional} exibirFiltroPaciente={true} />
        </div>
    );
}