import { buscarDadosExamesAdmin } from '@/actions/examesActions'
import TemplateExames from '@/components/exames/TemplateExames';


export default function ViewExamesAdmin() {

    return (
        <div>
            <TemplateExames 
                funcao={buscarDadosExamesAdmin} exibirFiltroPaciente={true} exibirFiltroProfissional={true}/>
        </div>
    );
}