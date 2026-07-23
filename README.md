# Marketing Performance

Dashboard de performance da equipe de marketing, construído com Next.js.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem nenhuma configuração adicional, o dashboard roda com dados de demonstração (vem de [`src/data/mock.ts`](src/data/mock.ts)).

## Conectando a planilha de dados (Google Sheets)

O dashboard busca os dados em `GET /api/performance`, que por sua vez lê um CSV publicado de uma planilha Google Sheets. Sem essa planilha configurada, ele cai automaticamente nos dados de demonstração (e mostra um aviso amarelo no topo da página).

### 1. Criar a planilha

Crie uma planilha no Google Sheets com uma coluna de cabeçalho por campo. Os nomes podem ter acentos/maiúsculas normalmente — o dashboard normaliza tudo (`Mês`, `Em Dia`, `Meta%` etc. são reconhecidos automaticamente):

| Mês     | Ano  | Colaborador      | Cargo    | Cliente | Em Dia | Atraso | Meta |
| ------- | ---- | ---------------- | -------- | ------- | ------ | ------ | ---- |
| Janeiro | 2026 | Carolina Brandão | Designer | Geral   | 31     | 4      | 70   |

- `Mês`: nome do mês por extenso (Janeiro, Fevereiro, ...).
- `Cliente` e `Meta` são opcionais — se vazios, assume `"Geral"` e `70` respectivamente.
- Total de atividades, performance % e GAP são calculados automaticamente a partir de `Em Dia`/`Atraso` — não precisa preenchê-los (se a planilha já tiver essas colunas, elas são ignoradas).
- Uma linha por colaborador/mês.

### 2. Deixar o CSV acessível publicamente

Duas formas, ambas geram uma URL usável em `GOOGLE_SHEET_CSV_URL`:

- **Link de compartilhamento** (mais simples): clique em **Compartilhar**, ative "Qualquer pessoa com o link" como Leitor, e monte a URL assim:
  `https://docs.google.com/spreadsheets/d/SEU_ID_DA_PLANILHA/export?format=csv&gid=0`
  (troque `SEU_ID_DA_PLANILHA` pelo trecho entre `/d/` e `/edit` do link de compartilhamento; `gid=0` é a primeira aba).
- **Publicar na Web** (mais formal/estável): **Arquivo → Compartilhar → Publicar na Web**, formato **CSV**, gera um link `.../pub?output=csv`.

> Qualquer uma das duas torna a planilha legível por quem tiver o link — consistente com o dashboard não ter login. Se os dados forem sensíveis, use autenticação em vez disso.

### 3. Configurar a variável de ambiente

Copie `.env.example` para `.env.local` e cole a URL:

```bash
GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/SEU_ID/export?format=csv&gid=0"
```

Reinicie `npm run dev`. O aviso amarelo deve sumir e os dados da planilha aparecem no lugar dos de demonstração.

Os dados são recarregados automaticamente a cada 60 segundos no navegador (e o servidor revalida o CSV a cada 5 minutos), então a cliente só precisa editar a planilha — nada de redeploy.

## Deploy (Vercel)

1. Suba o código para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Environment Variables**, adicione `GOOGLE_SHEET_CSV_URL` com o mesmo valor do `.env.local`.
4. Deploy. A cada `git push` na branch principal, a Vercel publica a versão nova automaticamente.
5. Compartilhe a URL gerada (ou configure um domínio próprio em **Settings → Domains**) com a cliente.

## Abas adicionais da planilha

O dashboard lê mais duas abas da mesma planilha. Por padrão, cada página deriva a URL a partir de `GOOGLE_SHEET_CSV_URL`, apenas trocando o `gid` — então não é preciso configurar nada extra. Se o `gid` da sua aba for diferente, dá pra sobrescrever com a variável indicada.

### Produtividade (por colaborador)

Página **Produtividade** — volume de trabalho e horas por colaborador:

```
Mês, Ano, Colaborador, Qtd_Clientes, Qtd_Projetos, Qtd_Atividades, Qtd_Etapas, Total_Horas_HHMM
```

- `Total_Horas_HHMM`: horas acumuladas no formato `HH:MM:SS` (ex.: `90:58:00`). O dashboard converte e soma automaticamente.
- Override opcional: `GOOGLE_SHEET_PRODUCTIVITY_CSV_URL`.

### Projetos por Cliente

Página **Clientes** — volume de trabalho e horas dedicadas a cada cliente:

```
Mês, Ano, Cliente, Projetos, Atividades, Etapas, Total de tempo
```

- `Total de tempo`: mesmo formato `HH:MM:SS`.
- Override opcional: `GOOGLE_SHEET_CLIENTS_CSV_URL`.

## Estrutura

- `src/app/page.tsx` — painel geral (KPIs, gráficos, tabela do time).
- `src/app/produtividade/page.tsx` — volume de trabalho e horas por colaborador.
- `src/app/clientes/page.tsx` — projetos, atividades e horas por cliente.
- `src/app/colaborador/page.tsx` — perfil individual de colaborador.
- `src/app/relatorio/page.tsx` — ficha de avaliação para impressão/PDF.
- `src/app/api/*/route.ts` — leem e normalizam os dados das abas da planilha.
- `src/lib/*-source.ts` — parsing do CSV e fallback para dados de demonstração.
- `src/lib/horas.ts` — conversão do formato de horas `HH:MM:SS`.
