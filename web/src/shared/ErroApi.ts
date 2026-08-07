export interface DetalheErroApi {
    field: string;
    message: string;
}

export type DetalhesErroApi =
    | DetalheErroApi[]
    | Record<string, unknown>;

export interface CorpoErroApi {
    error: {
        code: string;
        message: string;
        details?: DetalhesErroApi;
    };
}

export class ErroApi extends Error {
    constructor(
        message: string,
        public readonly codigo: string,
        public readonly status: number,
        public readonly detalhes: DetalhesErroApi = []
    ) {
        super(message);
        this.name = 'ErroApi';
    }
}
