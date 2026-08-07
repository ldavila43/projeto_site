export interface PaisDTO {
    idPais: number;
    nomePais: string;
    siglaPais: string;
}

export interface EstadoDTO {
    idEstado: number;
    nomeEstado: string;
    siglaEstado: string;
    idPais: number;
}

export interface MunicipioDTO {
    idMunicipio: number;
    nomeMunicipio: string;
    idEstado: number;
}

export interface MetadadosLocalidades {
    totalRegistros: number;
    totalPaginas: number;
    page: number;
    limit: number;
}

export interface ResponsePaises {
    paises: PaisDTO[];
    metadados: MetadadosLocalidades;
}

export interface ResponseEstados {
    estados: EstadoDTO[];
    metadados: MetadadosLocalidades;
}

export interface ResponseMunicipios {
    municipios: MunicipioDTO[];
    metadados: MetadadosLocalidades;
}

export interface FiltrosPaises {
    nomePais?: string;
    page?: string;
    limit?: string;
}

export interface FiltrosEstados {
    idPais: number;
    nomeEstado?: string;
    siglaEstado?: string;
    page?: string;
    limit?: string;
}

export interface FiltrosMunicipios {
    idEstado: number;
    nomeMunicipio?: string;
    page?: string;
    limit?: string;
}
