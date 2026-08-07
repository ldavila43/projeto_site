# Rotas, schemas Zod e acesso para o front-end

Este documento descreve as rotas atualmente registradas pelo backend, os dados
aceitos pelos schemas Zod e os privilégios efetivamente aplicados pelos
middlewares e services.

> Fonte de verdade: código atual em `src/app.ts`, routers, schemas e services.
> Rotas não registradas não fazem parte deste contrato.

## 1. Autenticação e perfil ativo

### Perfis

| ID | Perfil |
|---:|---|
| `1` | Administrador |
| `2` | Profissional |
| `3` | Colaborador |
| `4` | Paciente |

### Headers

Com exceção de `POST /auth/login`, todas as rotas exigem:

```http
Authorization: Bearer <token>
```

O formato é estrito: deve existir exatamente o prefixo `Bearer`, um espaço e o
token.

Quase todas as rotas também exigem:

```http
x-perfil-ativo: <id-do-perfil>
```

O perfil ativo deve:

- ser um dos IDs da tabela acima;
- estar presente na lista de perfis do token;
- estar autorizado para a operação, quando houver uma matriz explícita.

Rotas que dependem apenas do token e não exigem `x-perfil-ativo`:

- `GET /operadores/perfis`;
- `GET /pessoas/meus-dados`;
- `PATCH /pessoas/meus-dados`.

### Erros

Erros controlados usam o formato:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem legível",
    "details": []
  }
}
```

Em erros de validação, `details` possui itens neste formato:

```json
{
  "field": "body.nome",
  "message": "Mensagem da validação"
}
```

## 2. Regras compartilhadas dos schemas

### Paginação

As consultas paginadas aceitam:

| Campo | Tipo recebido | Obrigatório | Default | Regra |
|---|---|:---:|---:|---|
| `page` | número ou string numérica | Não | `1` | inteiro positivo |
| `limit` | número ou string numérica | Não | `10` | inteiro entre `1` e `100` |

O backend transforma esses campos em `limit` e `offset` internamente.

### Coerções

- Campos `z.coerce.number()` aceitam número ou string numérica.
- Campos `z.coerce.date()` aceitam valores convertíveis em data. O front-end
  deve enviar datas em ISO 8601.
- Campos de documento normalmente removem pontuação antes do uso.
- Campos UUID devem seguir um formato UUID válido.

### Valores enumerados

`status` genérico:

```text
ATIVO | INATIVO
```

Status de kits:

```text
INATIVO | ATIVO | INVÁLIDO | DESCARTADO
```

Status de solicitações:

```text
SOLICITADO | KIT ENVIADO | AMOSTRAS EM ANÁLISE | PRONTA | CANCELADA
```

Status de exames:

```text
AGUARDANDO ENVIO
EM ANÁLISE
AGUARDANDO PROCESSAMENTO INTERNO
LIBERAÇÃO PENDENTE
LIBERADO
CANCELADO
```

Status de amostras:

```text
AGUARDANDO | RECEBIDA | EM PROCESSAMENTO | PROCESSADA | DESCARTADA | RECOLETA
```

Status de envios:

```text
PENDENTE | EM TRÂNSITO | ENTREGUE | EXTRAVIADO
```

Categoria de envios:

```text
APOIO | PESSOA
```

Sexo:

```text
MASCULINO | FEMININO
```

## 3. Matriz geral de rotas

Legenda:

- **Token:** exige somente `Authorization`;
- **Perfil ativo:** exige também `x-perfil-ativo`;
- **Contextual:** a permissão depende da identidade, vínculo ou recurso alvo.

| Método | Rota | Schema Zod | Autenticação | Acesso efetivo |
|---|---|---|---|---|
| POST | `/auth/login` | `postLoginSchema` | Pública | Todos |
| POST | `/users` | `postUserSchema` | Perfil ativo | Administrador |
| GET | `/dashboard/pacientes/meus-dados` | Sem schema | Perfil ativo | Administrador, Paciente |
| GET | `/dashboard/profissionais/meus-dados` | `getDadosDashProfissional` | Perfil ativo | Administrador, Profissional |
| GET | `/dashboard/laboratorio/cards-resumo` | Sem schema | Perfil ativo | Administrador, Colaborador |
| GET | `/dashboard/laboratorio/grafico-exames` | `getDadosTipoExameColaborador` | Perfil ativo | Administrador, Colaborador |
| GET | `/dashboard/admin` | `getDadosDashAdmin` | Perfil ativo | Administrador |
| GET | `/dashboard/admin/solicitacoes` | `getDadosDashAdmin` | Perfil ativo | Administrador |
| GET | `/exames/dados` | `getExamesSchema` | Perfil ativo | Todos os perfis, com escopo |
| GET | `/exames/:idExame/visao-geral` | `getResultadosExames` | Perfil ativo | Todos os perfis, com escopo |
| GET | `/pacientes/dados` | `getPacientesSchema` | Perfil ativo | Administrador, Colaborador, Profissional |
| POST | `/pacientes/cadastro` | `postPacienteSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/profissionais-saude/dados` | `getProfissionaisSchema` | Perfil ativo | Administrador, Colaborador |
| POST | `/profissionais-saude/cadastro` | `postProfissionalSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/solicitacoes/dados` | `getSolicitacoesSchema` | Perfil ativo | Todos os perfis, com escopo |
| POST | `/solicitacoes/cadastro` | `postSolicitacoesSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/kits/dados` | `getKitsSchema` | Perfil ativo | Administrador, Colaborador |
| POST | `/kits/cadastro` | `postKitSchema` | Perfil ativo | Administrador, Colaborador |
| PATCH | `/kits/:idKit` | `patchKitSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/operadores/dados` | `getOperadoresSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/operadores/perfis` | Sem schema | Token | Todos os autenticados |
| GET | `/operadores/rotas` | Sem schema | Perfil ativo | Todos os perfis |
| GET | `/pessoas/dados` | `getPessoasSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/pessoas/meus-dados` | Sem schema | Token | Próprios dados |
| PATCH | `/pessoas/meus-dados` | `patchMeusDadosSchema` | Token | Próprios dados |
| GET | `/pessoas/:idPessoa` | `getPessoaSchema` | Perfil ativo | Contextual |
| POST | `/pessoas/cadastro` | `postPessoaSchema` | Perfil ativo | Todos os perfis |
| PATCH | `/pessoas/:idPessoa` | `patchPessoaSchema` | Perfil ativo | Contextual |
| GET | `/tipos-exame/dados` | `getTiposExameSchema` | Perfil ativo | Todos os perfis |
| POST | `/tipos-exame/novo` | `postTiposExameSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/categorias-exame/dados` | `getCategoriasExameSchema` | Perfil ativo | Todos os perfis |
| GET | `/tipos-kit/dados` | `getTiposKitAmostraSchema` | Perfil ativo | Todos os perfis |
| GET | `/tipos-envio/dados` | `getTiposEnvioSchema` | Perfil ativo | Todos os perfis |
| POST | `/tipos-envio/cadastro` | `postTipoEnvioSchema` | Perfil ativo | Administrador, Colaborador |
| PATCH | `/tipos-envio/:idTipoEnvio` | `patchTipoEnvioSchema` | Perfil ativo | Administrador, Colaborador |
| DELETE | `/tipos-envio/:idTipoEnvio` | `deleteTipoEnvioSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/envios/dados` | `getEnviosSchema` | Perfil ativo | Administrador, Colaborador |
| POST | `/envios/cadastro` | `postEnvioSchema` | Perfil ativo | Administrador, Colaborador |
| GET | `/amostras/dados` | `getAmostrasSchema` | Perfil ativo | Todos os perfis, com escopo |

### 3.1. Contratos de resposta

Os contratos abaixo representam as respostas de sucesso efetivamente montadas
pelos controllers e services. UUIDs são enviados como `string`. Objetos `Date`
são serializados como `string` no JSON; o formato exato pode variar entre uma
data (`YYYY-MM-DD`) e um instante ISO 8601 conforme o tipo da coluna retornada
pelo PostgreSQL.

Todas as listas paginadas usam:

```ts
interface Metadados {
  totalRegistros: number;
  totalPaginas: number;
  page: number;
  limit: number;
}
```

Arrays sem resultados são enviados como `[]`. Campos provenientes de colunas
ou relacionamentos opcionais podem ser `null`, conforme indicado.

#### Autenticação e comandos

`POST /auth/login` — `200 OK`:

```ts
{
  message: "Login Autenticado!";
  token: string;
}
```

Além dos erros compartilhados, o limite de tentativas pode responder
`429 Too Many Requests` com:

```ts
{
  erro: string;
}
```

As demais rotas de comando retornam:

| Rota | Sucesso | Body | Header adicional |
|---|---:|---|---|
| `POST /users` | `201` | `{ "message": "Usuário cadastrado com sucesso." }` | — |
| `POST /pacientes/cadastro` | `201` | `{ "message": "Paciente cadastrado com sucesso." }` | — |
| `POST /profissionais-saude/cadastro` | `201` | `{ "message": "Profissional cadastrado com sucesso." }` | — |
| `POST /solicitacoes/cadastro` | `201` | `{ "message": "Solicitação cadastrada com sucesso." }` | — |
| `POST /kits/cadastro` | `201` | `{ "message": "Kit cadastrado com sucesso." }` | — |
| `PATCH /kits/:idKit` | `200` | `{ "message": "Kit atualizado." }` | — |
| `PATCH /pessoas/meus-dados` | `200` | `{ "message": "Cadastro atualizado!" }` | — |
| `POST /pessoas/cadastro` | `201` | `{ "message": "Pessoa cadastrada com sucesso." }` | `Location: /pessoas/{idPessoa}` |
| `PATCH /pessoas/:idPessoa` | `200` | `{ "message": "Cadastro atualizado!" }` | — |
| `POST /tipos-exame/novo` | `201` | `{ "message": "Tipo de exame cadastrado com sucesso." }` | — |
| `POST /tipos-envio/cadastro` | `201` | `{ "message": "Tipo de envio cadastrado com sucesso.", "idTipoEnvio": number }` | — |
| `PATCH /tipos-envio/:idTipoEnvio` | `200` | `{ "message": "Tipo de envio atualizado com sucesso." }` | — |
| `DELETE /tipos-envio/:idTipoEnvio` | `200` | `{ "message": "Tipo de envio deletado com sucesso." }` | — |
| `POST /envios/cadastro` | `201` | `{ "message": "Envio cadastrado com sucesso." }` | — |

Os identificadores gerados por pacientes, profissionais, solicitações, kits e
tipos de exame não são incluídos no body atual.

#### Dashboard

`GET /dashboard/pacientes/meus-dados` — `200 OK`:

```ts
{
  estatisticas: {
    total: number;
    concluidos: number;
  };
  exames: Array<{
    protocolo: string;
    tipoExame: string;
    status: string;
    dataSolicitacao: string;
  }>;
}
```

`GET /dashboard/profissionais/meus-dados` — `200 OK`:

```ts
{
  estatisticas: {
    totalPacientes: number;
    analisesCompletas: number;
    analisesPendentes: number;
  };
  exames: Array<{
    periodo: string;
    exames: Array<{
      tipoExame: string;
      contagem: number;
    }>;
  }>;
}
```

`GET /dashboard/laboratorio/cards-resumo` — `200 OK`:

```ts
{
  cardPacientes: { mesAtual: number; mesAnterior: number };
  cardProfissionais: { mesAtual: number; mesAnterior: number };
  cardSolicitacoes: { mesAtual: number; mesAnterior: number };
  cardExames: { mesAtual: number; mesAnterior: number };
}
```

`GET /dashboard/laboratorio/grafico-exames` — `200 OK`:

```ts
{
  TiposExame: Array<{
    idTipoExame: number;
    nomeTipoExame: string;
    contagem: number | string;
  }>;
}
```

`contagem` pode chegar como string numérica porque o valor de `COUNT` ainda não
é convertido pelo repository dessa rota.

`GET /dashboard/admin` — `200 OK`:

```ts
{
  estatisticas: {
    colaboradores: number;
    usuarios: number;
  };
  solicitacoesPeriodo: Array<{
    periodo: string;
    solicitacoes: number;
  }>;
  anosDisponiveis: string[];
}
```

`GET /dashboard/admin/solicitacoes` — `200 OK`:

```ts
{
  solicitacoesPeriodo: Array<{
    periodo: string;
    solicitacoes: number;
  }>;
}
```

#### Exames e resultados

`GET /exames/dados` — `200 OK`:

```ts
{
  dados: Array<{
    idExame: number;
    protocolo: string;
    nomePaciente: string;
    tipoExame: string;
    categoriaExame: number | null;
    documentoPaciente: string;
    nomeProfissional: string | null;
    dataSolicitacao: string;
    status: string;
  }>;
  metadados: Metadados;
}
```

`GET /exames/:idExame/visao-geral` — `200 OK` para a categoria atualmente
suportada:

```ts
{
  composicaoDominio: Array<{
    especie: string;
    abundancia: number | string;
  }>;
  bacilotaBacteroidota: {
    razao: number | string | null;
    bacilota: number | string;
    bacteroidota: number | string;
  };
  topVias: Array<{
    nomeVia: string;
    abundancia: string;
  }>;
  severidadePersistencia: Array<{
    tipo: string;
    abundancia: string;
  }>;
}
```

Valores agregados do PostgreSQL podem ser serializados como strings numéricas
enquanto os repositories não fizerem a conversão explícita.

#### Pacientes e profissionais

`GET /pacientes/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  pacientes: Array<{
    idPessoa: string;
    idPaciente: string;
    nome: string;
    criadoEm: string;
    atualizadoEm: string | null;
  }>;
}
```

`GET /profissionais-saude/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  profissionais: Array<{
    idPessoa: string;
    idProfissional: string;
    nome: string;
    profissaoRegistro: string;
    criadoEm: string;
    atualizadoEm: string | null;
  }>;
}
```

#### Solicitações e kits

`GET /solicitacoes/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  solicitacoes: Array<{
    idSolicitacao: string;
    protocolo: string;
    nomePaciente: string;
    nomeProfissional: string;
    dataSolicitacao: string;
    statusSolicitacao: string;
    quantidadeExames: number;
    quantidadeKits: number;
    tiposExame: string | null;
  }>;
}
```

`tiposExame` é atualmente uma única string produzida por `string_agg`, com os
tipos separados por vírgula; não é um array.

`GET /kits/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  kitsAmostra: Array<{
    idKit: number;
    codApoio: string | null;
    codBgk: string;
    codLote?: string;
    tipoKit: string | null;
    local: string | null;
    status: string;
    dataValidade: string;
    dataAtivacao: string;
    responsavel: string | null;
  }>;
}
```

`codLote` está marcado como opcional porque a projeção SQL atual usa
`codigo_lote`, enquanto o mapeamento lê `cod_lote`. Esse campo não deve ser
considerado estável no front-end até os nomes serem alinhados.

#### Operadores

`GET /operadores/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  dados: Array<{
    idOperador: string;
    nomeOperador: string;
    documentoOperador: string;
    statusOperador: string;
    listaPerfis: string;
  }>;
}
```

`listaPerfis` é atualmente uma string com valores separados por vírgula.

`GET /operadores/perfis` — `200 OK`:

```ts
{
  dados: {
    perfis: Array<{
      id: number;
      nome: string;
    }>;
  };
}
```

`GET /operadores/rotas` — `200 OK`:

```ts
{
  rotas: Array<{
    idRota: string;
    label: string;
    href: string;
    subMenus: Array<{
      idRota: string;
      label: string;
      href: string;
    }>;
  }>;
}
```

#### Pessoas

`GET /pessoas/dados` — `200 OK`:

```ts
{
  dados: Array<{
    idPessoa: string;
    nome: string | null;
    documentoIdentificacao: string | null;
    dataNascimento: string | null;
    papeis: Array<"PACIENTE" | "PROFISSIONAL_SAUDE" | "FUNCIONARIO">;
    sexo: "MASCULINO" | "FEMININO" | null;
    etnia: string | null;
  }>;
  metadados: Metadados;
}
```

`GET /pessoas/meus-dados` e `GET /pessoas/:idPessoa` — `200 OK`:

```ts
{
  dadosPessoa: {
    idPessoa: string;
    nome: string | null;
    documentoIdentificacao: string | null;
    dataNascimento: string | null;
    papeis: Array<"PACIENTE" | "PROFISSIONAL_SAUDE" | "FUNCIONARIO">;
    sexo: "MASCULINO" | "FEMININO" | null;
    etnia: string | null;
  };
  telefones: Array<{
    idPessoa: string;
    telefone: string;
    tipo: string;
  }>;
  emails: Array<{
    idPessoa: string;
    email: string;
    tipo: string;
  }>;
  enderecos: Array<{
    idEndereco: string;
    tipoEndereco: string;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    idCidade: number;
    cidade: string;
    estado: string;
    pais: string;
  }>;
}
```

#### Tipos, categorias e amostras

`GET /tipos-exame/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  tiposExame: Array<{
    idTipoExame: number;
    descricao: string;
    status: string;
    idCategoriaExame: number | null;
    categoriaExame: string | null;
  }>;
}
```

`GET /categorias-exame/dados` — `200 OK`:

```ts
{
  categorias: Array<{
    idCategoria: number;
    descricao: string;
    texto: string | null;
    status: string;
  }>;
  metadados: Metadados;
}
```

`GET /tipos-kit/dados` — `200 OK`:

```ts
{
  tiposKit: Array<{
    idTipoKit: number;
    materialColeta: string;
    tipoAmostra: string;
    status: string;
  }>;
  metadados: Metadados;
}
```

`GET /amostras/dados` — `200 OK`:

```ts
{
  metadados: Metadados;
  amostras: Array<{
    idAmostra: string;
    nomePaciente: string;
    nomeProfissional: string | null;
    status: string;
    observacoes: string | null;
    flagRecoleta: boolean;
    dataColeta: string | null;
    dataRecebimento: string | null;
    dataEnvioApoio: string | null;
    dataResultadoApoio: string | null;
    tipoAmostra: string;
    protocolosVinculados: string;
  }>;
}
```

`protocolosVinculados` é atualmente uma única string produzida por
`string_agg`, com os protocolos separados por vírgula; não é um array.

#### Tipos de envio e envios

`GET /tipos-envio/dados` — `200 OK`:

```ts
{
  dados: Array<{
    idTipoEnvio: number;
    descricao: string;
  }>;
  metadados: Metadados;
}
```

`GET /envios/dados` — `200 OK`:

```ts
{
  dados: Array<{
    idEnvio: number;
    numeroItens: number;
    itensEnviados: Array<{
      idKit: number;
      codBgk: string;
    }>;
    nomeDestinatario: string;
    status: "PENDENTE" | "EM TRÂNSITO" | "ENTREGUE" | "EXTRAVIADO";
    dataEnvio: string;
    dataPrazoPostagem: string | null;
    dataChegada: string | null;
    codRastreio: string | null;
    categoriaEnvio: "APOIO" | "PESSOA";
  }>;
  metadados: Metadados;
}
```

O filtro `codBgk` é aplicado sobre os kits agregados pela consulta atual. Ao
informá-lo, `numeroItens` e `itensEnviados` representam somente os kits cujo
código corresponde ao filtro.

## 4. Autenticação e usuários

### `POST /auth/login`

Schema: `postLoginSchema`

Não exige token nem perfil ativo. Existe limite de cinco tentativas de login
malsucedidas por janela de quinze minutos.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `documentoIdentificacao` | string | Sim | trim, remove caracteres não alfanuméricos, mínimo 1 |
| `senhaLogin` | string | Sim | mínimo 8 caracteres |

### `POST /users`

Schema: `postUserSchema`

Acesso: somente Administrador.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Sim | trim, mínimo 1 |
| `dataNascimento` | data ISO | Sim | não pode estar no futuro nem há mais de 100 anos |
| `documentoIdentificacao` | string | Sim | remove pontuação, converte para maiúsculas, mínimo 1 |
| `sexo` | enum | Sim | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Sim | trim; atualmente aceita string vazia |
| `senha` | string | Sim | mínimo 8 caracteres |

## 5. Dashboard

### `GET /dashboard/pacientes/meus-dados`

Sem schema de entrada.

Acesso: Administrador e Paciente. O backend utiliza o ID da pessoa contido no
token, sem aceitar ID de paciente pela requisição.

### `GET /dashboard/profissionais/meus-dados`

Schema: `getDadosDashProfissional`

Acesso: Administrador e Profissional. O backend utiliza o ID da pessoa do
token como profissional.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idPaciente` | UUID | Não | UUID válido |
| `dataIni` | data ISO | Sim | data válida |
| `dataFim` | data ISO | Sim | deve ser igual ou posterior a `dataIni` |

### `GET /dashboard/laboratorio/cards-resumo`

Sem schema de entrada.

Acesso: Administrador e Colaborador.

### `GET /dashboard/laboratorio/grafico-exames`

Schema: `getDadosTipoExameColaborador`

Acesso: Administrador e Colaborador.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `dataIni` | data ISO | Não | data válida |
| `dataFim` | data ISO | Não | não pode ser anterior a `dataIni` |
| `limite` | número ou string numérica | Não | inteiro |

### `GET /dashboard/admin`

### `GET /dashboard/admin/solicitacoes`

Schema compartilhado: `getDadosDashAdmin`

Acesso: somente Administrador.

Query:

| Campo | Tipo | Obrigatório | Default | Regras |
|---|---|:---:|---:|---|
| `ano` | número ou string numérica | Não | ano atual | inteiro positivo |

## 6. Exames e resultados

### `GET /exames/dados`

Schema: `getExamesSchema`

Acesso:

- Administrador e Colaborador: consulta geral;
- Profissional: `idProfissional` é substituído pelo ID da pessoa logada;
- Paciente: `idPaciente` é substituído pelo ID da pessoa logada.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `idPaciente` | UUID | Não | UUID válido |
| `idProfissional` | UUID | Não | UUID válido |
| `tipoExame` | string | Não | trim |
| `protocolo` | string | Não | trim |
| `nomePaciente` | string | Não | trim |
| `nomeProfissional` | string | Não | trim |
| `status` | enum de exame | Não | valor exato da enumeração |

### `GET /exames/:idExame/visao-geral`

Schema: `getResultadosExames`

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idExame` | número ou string numérica | Sim | inteiro positivo |

Acesso:

- Administrador e Colaborador: qualquer exame encontrado;
- Profissional: somente exame associado à pessoa logada;
- Paciente: somente exame associado à pessoa logada.

Atualmente há resolver registrado somente para a categoria interna `2`.

## 7. Pacientes

### `GET /pacientes/dados`

Schema: `getPacientesSchema`

Acesso:

- Administrador e Colaborador: consulta geral;
- Profissional: somente pacientes vinculados ao profissional logado;
- Paciente: acesso negado pelo service.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `idProfissional` | UUID | Não | ignorado/substituído para perfil Profissional |
| `nome` | string | Não | trim, mínimo 1 quando informado |
| `documentoPaciente` | string | Não | trim e remoção de pontuação |

### `POST /pacientes/cadastro`

Schema: `postPacienteSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Sim | trim, mínimo 1 |
| `documentoIdentificacao` | string | Sim | remove pontuação, maiúsculas, mínimo 1 |
| `dataNascimento` | data ISO | Sim | não futura e no máximo 100 anos |
| `email` | string | Sim | trim, minúsculas e e-mail válido |
| `telefone` | string | Sim | mantém `+` inicial e remove outros caracteres não numéricos |
| `tipoContato` | string | Sim | trim |
| `cep` | string | Sim | trim |
| `logradouro` | string | Sim | trim |
| `numero` | string | Sim | trim |
| `bairro` | string | Sim | trim |
| `idCidade` | número | Sim | inteiro positivo |
| `tipoEndereco` | string | Sim | trim |
| `estadoCivil` | string | Sim | trim |
| `profissao` | string | Sim | trim |
| `complemento` | string | Sim | trim |
| `sexo` | enum | Sim | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Sim | trim |

## 8. Profissionais de saúde

### `GET /profissionais-saude/dados`

Schema: `getProfissionaisSchema`

Acesso: Administrador e Colaborador.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `nome` | string | Não | trim |
| `documentoProfissional` | string | Não | trim e remoção de pontuação |

### `POST /profissionais-saude/cadastro`

Schema: `postProfissionalSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Sim | trim, mínimo 1 |
| `documentoIdentificacao` | string | Sim | remove pontuação, maiúsculas, mínimo 1 |
| `dataNascimento` | data ISO | Sim | não futura e no máximo 100 anos |
| `email` | string | Sim | trim, minúsculas e e-mail válido |
| `telefone` | string | Sim | mantém `+` inicial e remove outros caracteres não numéricos |
| `tipoContato` | string | Sim | trim |
| `cep` | string | Sim | trim |
| `logradouro` | string | Sim | trim |
| `numero` | string | Sim | trim |
| `bairro` | string | Sim | trim |
| `idCidade` | número | Sim | inteiro positivo |
| `tipoEndereco` | string | Sim | trim |
| `idProfissao` | número | Sim | inteiro positivo |
| `complemento` | string | Sim | trim |
| `sexo` | enum | Sim | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Sim | trim |

## 9. Solicitações de exame

### `GET /solicitacoes/dados`

Schema: `getSolicitacoesSchema`

Acesso:

- Administrador e Colaborador: consulta geral;
- Profissional: solicitações associadas ao profissional logado;
- Paciente: solicitações associadas ao paciente logado.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `dataIni` | data ISO | Não | data válida |
| `dataFim` | data ISO | Não | não pode ser anterior a `dataIni` |
| `status` | enum de solicitação | Não | valor exato da enumeração |
| `protocolo` | string | Não | trim |
| `nomePaciente` | string | Não | trim; não aplicado ao perfil Paciente |
| `nomeProfissional` | string | Não | trim; não aplicado ao perfil Paciente |

### `POST /solicitacoes/cadastro`

Schema: `postSolicitacoesSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Default/Regras |
|---|---|:---:|---|
| `idPaciente` | UUID | Sim | UUID válido |
| `idProfissional` | UUID | Não | UUID válido |
| `dataSolicitacao` | data ISO | Não | default interno; não futura e no máximo 100 anos |
| `statusSolicitacao` | enum de solicitação | Sim | sem default |
| `protocolo` | string | Sim | trim, mínimo 1 |
| `idKits` | número[] | Sim | ao menos um ID inteiro positivo |
| `exames` | objeto[] | Sim | ao menos um exame |

Cada item de `exames`:

| Campo | Tipo | Obrigatório | Default/Regras |
|---|---|:---:|---|
| `idTipoExame` | número | Sim | inteiro positivo |
| `descricao` | string | Não | sem trim no schema atual |
| `status` | enum de exame | Não | `AGUARDANDO ENVIO` |

O default atual de `dataSolicitacao` é criado quando o módulo do backend é
carregado. Até esse comportamento ser ajustado, o front-end deve enviar
explicitamente a data da solicitação.

## 10. Kits de amostra

### `GET /kits/dados`

Schema: `getKitsSchema`

Acesso: Administrador e Colaborador.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `codBgk` | string | Não | trim |
| `codLote` | string | Não | trim |
| `idResponsavel` | UUID | Não | UUID válido |
| `codApoio` | string | Não | trim |
| `status` | enum de kit | Não | valor exato da enumeração |
| `tipoKit` | string | Não | trim |
| `dataAtivacaoIni` | data ISO | Não | início do intervalo |
| `dataAtivacaoFim` | data ISO | Não | não anterior ao início |
| `dataValidadeIni` | data ISO | Não | início do intervalo |
| `dataValidadeFim` | data ISO | Não | não anterior ao início |

### `POST /kits/cadastro`

Schema: `postKitSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Default/Regras |
|---|---|:---:|---|
| `codBgk` | string | Sim | trim, mínimo 1 |
| `idTipoKit` | número | Sim | inteiro positivo |
| `local` | string | Não | trim |
| `codigoLote` | string | Sim | mínimo 1; atualmente não aplica trim |
| `codApoio` | string | Não | trim |
| `dataValidade` | data ISO | Sim | data válida |
| `status` | enum de kit | Não | `INATIVO` |
| `idResponsavel` | UUID | Não | deve identificar uma pessoa existente |
| `dataAtivacao` | data ISO | Não | data válida |

`idResponsavel` identifica o responsável pelo kit e não necessariamente a
pessoa que realizou o cadastro.

O schema atual não compara `dataAtivacao` com `dataValidade`.

### `PATCH /kits/:idKit`

Schema: `patchKitSchema`

Acesso: Administrador e Colaborador.

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idKit` | número ou string numérica | Sim | inteiro positivo |

Body: deve conter pelo menos um campo não vazio.

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `codBgk` | string | Não | trim |
| `idTipoKit` | número ou string numérica | Não | inteiro positivo |
| `local` | string | Não | trim |
| `codigoLote` | string | Não | sem trim no schema atual |
| `codApoio` | string | Não | trim |
| `dataValidade` | data ISO | Não | data válida |
| `status` | enum de kit | Não | valor exato da enumeração |
| `idResponsavel` | UUID | Não | UUID válido |
| `dataAtivacao` | data ISO | Não | data válida |

Status do contrato: apta para consumo pelo front-end no estado atual. A
atualização e o respectivo registro de auditoria são executados na mesma
transação.

## 11. Operadores

### `GET /operadores/dados`

Schema: `getOperadoresSchema`

Acesso: Administrador e Colaborador.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `nomeOperador` | string | Não | trim |
| `documentoOperador` | string | Não | trim e remoção de pontuação |
| `status` | enum | Não | `ATIVO` ou `INATIVO` |
| `idPerfil` | número | Não | somente `1`, `2`, `3` ou `4` |

### `GET /operadores/perfis`

Sem schema de entrada e sem `x-perfil-ativo`.

Acesso: qualquer usuário autenticado. O backend retorna os perfis associados à
pessoa do token.

### `GET /operadores/rotas`

Sem schema de entrada.

Acesso: qualquer perfil ativo válido. O backend utiliza a pessoa do token e o
valor de `x-perfil-ativo` para buscar as rotas associadas.

## 12. Pessoas

### `GET /pessoas/dados`

Schema: `getPessoasSchema`

Acesso: Administrador e Colaborador.

Status do contrato: apta para consumo pelo front-end no estado atual.

Esta rota retorna uma lista paginada de pessoas para seletores e cadastros,
incluindo os papéis de domínio que cada pessoa possui.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `nome` | string | Não | trim |
| `dataNascimento` | data ISO | Não | data válida |
| `documentoIdentificacao` | string | Não | remove pontuação e converte para maiúsculas |
| `sexo` | enum | Não | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Não | trim |

Os valores atuais de `papeis` são `PACIENTE`, `PROFISSIONAL_SAUDE` e
`FUNCIONARIO`. Uma pessoa sem vínculo nessas tabelas recebe `papeis: []`.

### `GET /pessoas/meus-dados`

Sem schema de entrada e sem `x-perfil-ativo`.

Acesso: qualquer usuário autenticado, somente para a pessoa do token.

### `PATCH /pessoas/meus-dados`

Schema: `patchMeusDadosSchema`

Sem `x-perfil-ativo`. Atualiza a pessoa do token.

Body: deve conter pelo menos um campo não vazio.

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Não | trim |
| `documentoIdentificacao` | string | Não | aceito pelo schema, mas atualmente ignorado pelo service |
| `dataNascimento` | data ISO | Não | não futura e no máximo 100 anos |
| `sexo` | enum | Não | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Não | trim |

O front-end não deve enviar `documentoIdentificacao` por esta rota enquanto o
schema e o service estiverem divergentes.

### `GET /pessoas/:idPessoa`

Schema: `getPessoaSchema`

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idPessoa` | UUID | Sim | UUID válido |

Acesso contextual:

- a própria pessoa pode consultar seus dados;
- Administrador e Colaborador podem consultar qualquer pessoa;
- Profissional pode consultar paciente vinculado;
- Paciente não pode consultar outra pessoa.

### `POST /pessoas/cadastro`

Schema: `postPessoaSchema`

O router atual permite qualquer perfil ativo válido.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Sim | trim, mínimo 1 |
| `documentoIdentificacao` | string | Sim | remove pontuação, maiúsculas, mínimo 1 |
| `dataNascimento` | data ISO | Sim | não futura e no máximo 100 anos |
| `sexo` | enum | Sim | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Não | trim, mínimo 1 quando informado |

### `PATCH /pessoas/:idPessoa`

Schema: `patchPessoaSchema`

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idPessoa` | UUID | Sim | UUID válido |

Body: deve conter pelo menos um campo não vazio.

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Não | trim |
| `documentoIdentificacao` | string | Não | trim, remove pontuação e converte para maiúsculas |
| `dataNascimento` | data ISO | Não | não futura e no máximo 100 anos |
| `sexo` | enum | Não | `MASCULINO` ou `FEMININO` |
| `etnia` | string | Não | trim |

Acesso contextual:

- Administrador pode atualizar qualquer pessoa e o documento;
- Colaborador pode atualizar qualquer pessoa, exceto o documento;
- Profissional pode atualizar paciente vinculado, exceto o documento;
- Paciente não pode usar esta rota, devendo usar `/pessoas/meus-dados`.

## 13. Tipos e categorias

### `GET /tipos-exame/dados`

Schema: `getTiposExameSchema`

Acesso: qualquer perfil ativo válido.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `descricao` | string | Não | trim |
| `status` | enum | Não | `ATIVO` ou `INATIVO` |
| `categoriaExame` | string | Não | trim |

### `POST /tipos-exame/novo`

Schema: `postTiposExameSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `nome` | string | Sim | trim, mínimo 1 |
| `caminhoImagem` | string | Não | trim |
| `caminhoIcone` | string | Não | trim |
| `caminhoLogo` | string | Não | trim |
| `status` | enum | Não | `ATIVO` ou `INATIVO` |
| `idCategoriaExame` | número | Não | inteiro positivo |

### `GET /categorias-exame/dados`

Schema: `getCategoriasExameSchema`

Acesso: qualquer perfil ativo válido.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `idCategoria` | número | Não | inteiro positivo |
| `nome` | string | Não | trim |
| `status` | enum | Não | `ATIVO` ou `INATIVO` |

### `GET /tipos-kit/dados`

Schema: `getTiposKitAmostraSchema`

Acesso: qualquer perfil ativo válido.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `idTipoKit` | número | Não | inteiro positivo |
| `materialColeta` | string | Não | sem trim no schema atual |
| `tipoAmostra` | string | Não | sem trim no schema atual |
| `status` | enum | Não | `ATIVO` ou `INATIVO` |

## 14. Amostras

### `GET /amostras/dados`

Schema: `getAmostrasSchema`

Acesso:

- Administrador e Colaborador: consulta geral;
- Profissional: `idProfissional` é substituído pela pessoa logada;
- Paciente: `idPaciente` é substituído pela pessoa logada.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `idPaciente` | UUID | Não | UUID válido |
| `idProfissional` | UUID | Não | UUID válido |
| `dataIniColeta` | data ISO | Não | início do intervalo |
| `dataFimColeta` | data ISO | Não | não anterior ao início |
| `dataIniRecebimento` | data ISO | Não | início do intervalo |
| `dataFimRecebimento` | data ISO | Não | não anterior ao início |
| `dataIniEnvioApoio` | data ISO | Não | início do intervalo |
| `dataFimEnvioApoio` | data ISO | Não | não anterior ao início |
| `dataIniResultadoApoio` | data ISO | Não | início do intervalo |
| `dataFimResultadoApoio` | data ISO | Não | não anterior ao início |
| `tipoAmostra` | string | Não | trim |
| `nomePaciente` | string | Não | trim |
| `nomeProfissional` | string | Não | trim |
| `status` | enum de amostra | Não | valor exato da enumeração |

## 15. Tipos de envio e envios

Todas as rotas deste grupo exigem `Authorization: Bearer <token>` e
`x-perfil-ativo`.

### `GET /tipos-envio/dados`

Schema: `getTiposEnvioSchema`

Acesso: qualquer perfil ativo válido.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `descricao` | string | Não | trim, máximo de 255 caracteres; busca pelo início da descrição |

### `POST /tipos-envio/cadastro`

Schema: `postTipoEnvioSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `descricao` | string | Sim | trim, entre 1 e 255 caracteres |

O retorno inclui o `idTipoEnvio` gerado.

### `PATCH /tipos-envio/:idTipoEnvio`

Schema: `patchTipoEnvioSchema`

Acesso: Administrador e Colaborador.

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idTipoEnvio` | número | Sim | coerção numérica, inteiro positivo |

Body:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `descricao` | string | Sim | trim, não vazia e máximo de 255 caracteres |

Tipo inexistente retorna `404 TIPO_ENVIO_NOT_FOUND`.

### `DELETE /tipos-envio/:idTipoEnvio`

Schema: `deleteTipoEnvioSchema`

Acesso: Administrador e Colaborador.

Params:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `idTipoEnvio` | número | Sim | coerção numérica, inteiro positivo |

Tipo inexistente retorna `404 TIPO_ENVIO_NOT_FOUND`. Tipo com envio vinculado
retorna `409 TIPO_ENVIO_HAS_DEPENDENCIES`.

### `GET /envios/dados`

Schema: `getEnviosSchema`

Acesso: Administrador e Colaborador.

Query:

| Campo | Tipo | Obrigatório | Regras |
|---|---|:---:|---|
| `page` | número | Não | paginação compartilhada |
| `limit` | número | Não | paginação compartilhada |
| `codBgk` | string | Não | trim; busca pelo início do código |
| `destinatario` | string | Não | trim; busca pelo início do nome |
| `dataEnvioIni` | data ISO | Não | início do intervalo de envio |
| `dataEnvioFim` | data ISO | Não | não anterior ao início |
| `idTipoEnvio` | número | Não | coerção numérica, inteiro positivo |
| `dataChegadaIni` | data ISO | Não | início do intervalo de chegada |
| `dataChegadaFim` | data ISO | Não | não anterior ao início |
| `categoriaEnvio` | enum | Não | `APOIO` ou `PESSOA` |
| `status` | enum | Não | `PENDENTE`, `EM TRÂNSITO`, `ENTREGUE` ou `EXTRAVIADO` |
| `codRastreio` | string | Não | trim; busca pelo início do código |
| `dataPrazoPostagemIni` | data ISO | Não | início do intervalo do prazo |
| `dataPrazoPostagemFim` | data ISO | Não | não anterior ao início |

### `POST /envios/cadastro`

Schema: `postEnvioSchema`

Acesso: Administrador e Colaborador.

Body:

| Campo | Tipo | Obrigatório | Default/Regras |
|---|---|:---:|---|
| `idTipoEnvio` | número | Sim | coerção numérica, inteiro positivo e tipo existente |
| `idKits` | número[] | Sim | ao menos um inteiro positivo; duplicidades são rejeitadas |
| `idPessoa` | UUID | Sim | pessoa destinatária existente |
| `status` | enum | Não | `PENDENTE` |
| `dataPrazoPostagem` | data ISO | Não | data válida |
| `dataEnvio` | data ISO | Não | instante atual por requisição |
| `dataChegada` | data ISO | Não | não anterior a `dataEnvio` |
| `codRastreio` | string | Não | trim |
| `categoriaEnvio` | enum | Não | `PESSOA`; aceita `APOIO` ou `PESSOA` |

Todos os kits devem existir, estar `INATIVO` e não possuir responsável. O
cadastro bloqueia os kits, cria o envio, registra os vínculos em
`envios_kits` e define `idPessoa` como responsável dentro da mesma transação.
Kit inexistente retorna `404 KIT_NOT_FOUND`; kit indisponível retorna
`409 KIT_NOT_AVAILABLE`.

PATCH e DELETE de envios ainda não estão registrados.

## 16. Observações de contrato encontradas

Os pontos abaixo descrevem o comportamento atual e merecem revisão antes de o
front-end depender deles definitivamente:

1. `PATCH /pessoas/meus-dados` aceita `documentoIdentificacao` no Zod, mas o
   service não aplica o campo.
2. `POST /pessoas/cadastro` não possui uma matriz explícita e atualmente aceita
   qualquer perfil ativo.
3. Rotas de catálogo (`categorias-exame`, `tipos-exame` e `tipos-kit`) aceitam
   qualquer perfil ativo.
4. Administrador pode acessar dashboards de “meus dados”, mas esses endpoints
   utilizam o ID da própria pessoa administradora.
5. `POST /kits/cadastro` não valida a ordem entre data de ativação e validade.
6. A autorização de resultados depende do vínculo encontrado no banco e existe
   resolver somente para a categoria interna `2`.
7. O default de `dataSolicitacao` é calculado no carregamento do módulo, e não a
   cada requisição.
8. `GET /kits/dados` ainda não entrega `codLote` por divergência entre o alias
   SQL e o mapeamento do repository.
