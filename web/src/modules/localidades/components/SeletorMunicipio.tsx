'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncAutocomplete from '@/src/shared/components/AsyncAutocomplete';
import {
    buscarEstados,
    buscarMunicipios,
    buscarPaises
} from '../localidadesActions';
import { EstadoDTO, PaisDTO } from '../localidadesDTO';

interface SeletorMunicipioProps {
    idMunicipio: string;
    onChange: (idMunicipio: string) => void;
    classeCampo: string;
    ufSugerida?: string;
    municipioSugerido?: string;
}

export default function SeletorMunicipio({
    idMunicipio,
    onChange,
    classeCampo,
    ufSugerida,
    municipioSugerido
}: SeletorMunicipioProps) {
    const [paises, setPaises] = useState<PaisDTO[]>([]);
    const [estados, setEstados] = useState<EstadoDTO[]>([]);
    const [idPais, setIdPais] = useState('');
    const [idEstado, setIdEstado] = useState('');
    const [nomeMunicipioSelecionado, setNomeMunicipioSelecionado] = useState('');
    const [carregandoEstados, setCarregandoEstados] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        let ativo = true;

        async function carregarPaises() {
            try {
                const resposta = await buscarPaises({ limit: '100', page: '1' });
                if (!ativo) return;

                setPaises(resposta.paises);
                const brasil = resposta.paises.find((pais) =>
                    pais.nomePais.localeCompare('Brasil', 'pt-BR', { sensitivity: 'base' }) === 0
                );
                if (brasil) setIdPais(String(brasil.idPais));
            } catch (causa) {
                if (ativo) {
                    setErro(causa instanceof Error ? causa.message : 'Erro ao buscar países.');
                }
            }
        }

        void carregarPaises();
        return () => {
            ativo = false;
        };
    }, []);

    useEffect(() => {
        let ativo = true;

        if (!idPais) return () => {
            ativo = false;
        };

        async function carregarEstados() {
            setCarregandoEstados(true);
            setErro(null);
            try {
                const resposta = await buscarEstados({
                    idPais: Number(idPais),
                    limit: '100',
                    page: '1'
                });
                if (!ativo) return;

                setEstados(resposta.estados);

                const estadoSugerido = ufSugerida
                    ? resposta.estados.find(
                        (estado) => estado.siglaEstado === ufSugerida.toUpperCase()
                    )
                    : undefined;

                if (estadoSugerido && municipioSugerido) {
                    setIdEstado(String(estadoSugerido.idEstado));
                    const respostaMunicipios = await buscarMunicipios({
                        idEstado: estadoSugerido.idEstado,
                        nomeMunicipio: municipioSugerido,
                        limit: '10',
                        page: '1'
                    });
                    if (!ativo) return;

                    const municipio = respostaMunicipios.municipios.find(
                        (item) => item.nomeMunicipio.localeCompare(
                            municipioSugerido,
                            'pt-BR',
                            { sensitivity: 'base' }
                        ) === 0
                    ) ?? respostaMunicipios.municipios[0];

                    if (municipio) {
                        setNomeMunicipioSelecionado(municipio.nomeMunicipio);
                        onChangeRef.current(String(municipio.idMunicipio));
                    }
                }
            } catch (causa) {
                if (ativo) {
                    setErro(causa instanceof Error ? causa.message : 'Erro ao buscar estados.');
                }
            } finally {
                if (ativo) setCarregandoEstados(false);
            }
        }

        void carregarEstados();
        return () => {
            ativo = false;
        };
    }, [idPais, municipioSugerido, ufSugerida]);

    const buscarOpcoesMunicipios = useCallback(async (nomeMunicipio: string) => {
        if (!idEstado) return [];

        const resposta = await buscarMunicipios({
            idEstado: Number(idEstado),
            nomeMunicipio: nomeMunicipio.trim() || undefined,
            limit: '10',
            page: '1'
        });

        return resposta.municipios.map((municipio) => ({
            id: municipio.idMunicipio,
            label: municipio.nomeMunicipio
        }));
    }, [idEstado]);

    return (
        <>
            <label className="block text-sm font-medium text-gray-700">
                <span className="mb-1 block">País *</span>
                <select
                    required
                    value={idPais}
                    onChange={(evento) => {
                        setIdPais(evento.target.value);
                        setEstados([]);
                        setIdEstado('');
                        setNomeMunicipioSelecionado('');
                        onChange('');
                    }}
                    className={classeCampo}
                >
                    <option value="">Selecione</option>
                    {paises.map((pais) => (
                        <option key={pais.idPais} value={pais.idPais}>
                            {pais.nomePais}
                        </option>
                    ))}
                </select>
            </label>

            <label className="block text-sm font-medium text-gray-700">
                <span className="mb-1 block">Estado *</span>
                <select
                    required
                    disabled={!idPais || carregandoEstados}
                    value={idEstado}
                    onChange={(evento) => {
                        setIdEstado(evento.target.value);
                        setNomeMunicipioSelecionado('');
                        onChange('');
                    }}
                    className={classeCampo}
                >
                    <option value="">Selecione</option>
                    {estados.map((estado) => (
                        <option key={estado.idEstado} value={estado.idEstado}>
                            {estado.nomeEstado} ({estado.siglaEstado})
                        </option>
                    ))}
                </select>
            </label>

            <div>
                <AsyncAutocomplete
                    key={`${idEstado || 'sem-estado'}-${nomeMunicipioSelecionado}`}
                    label="Município *"
                    placeholder={
                        idEstado
                            ? 'Digite o nome do município...'
                            : 'Selecione o estado primeiro'
                    }
                    value={idMunicipio}
                    disabled={!idEstado}
                    required
                    onInputChange={() => onChange('')}
                    onChange={(id, label) => {
                        setNomeMunicipioSelecionado(label);
                        onChange(String(id));
                    }}
                    fetcher={buscarOpcoesMunicipios}
                    initialSearchTerm={nomeMunicipioSelecionado}
                />
                {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
            </div>
        </>
    );
}
