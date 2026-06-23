import { buscarDadosExamesPaciente } from '@/actions/examesActions'
import TemplateExames from '@/components/exames/TemplateExames'


export default function ViewExamesPaciente() {

    return (
        <div>
            <TemplateExames funcao={buscarDadosExamesPaciente} />
        </div>
    );
}