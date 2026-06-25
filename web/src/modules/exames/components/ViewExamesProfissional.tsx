import { buscarDadosExames } from '@/src/modules/exames/examesActions'
import TemplateExames from './TemplateExames'


export default function ViewExamesProfissional() {

    return (
        <div>
            <TemplateExames funcao={buscarDadosExames}/>
        </div>
    );
}