import { buscarDadosOperadores } from '../operadoresActions'
import TemplateExames from './TemplateOperadores';


export default function ViewExamesAdmin() {

    return (
        <div>
            <TemplateExames
                funcao={buscarDadosOperadores}/>
        </div>
    );
}