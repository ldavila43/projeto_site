import { buscarDadosProfissionais } from '../profissionaisActions';
import TemplateProfissionais from './TemplateProfissionais';
import { ProfissionaisResponse } from '@/src/modules/profissionais/profissionaisDTO';


export default function ViewProfissionais({ dadosIni }: { dadosIni: ProfissionaisResponse }){

    return (
        <div>
            <TemplateProfissionais funcao={buscarDadosProfissionais}/>
        </div>
    );
}