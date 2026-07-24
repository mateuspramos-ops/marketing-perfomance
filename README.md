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

## Aba adicional da planilha

Além da aba principal, o dashboard lê a aba "projeto por cliente". Por padrão, a página deriva a URL a partir de `GOOGLE_SHEET_CSV_URL`, apenas trocando o `gid` — então não é preciso configurar nada extra. Se o `gid` da sua aba for diferente, dá pra sobrescrever com a variável indicada.

### Projetos por Cliente

Página **Clientes** — volume de trabalho e horas dedicadas a cada cliente:

```
Mês, Ano, Cliente, Projetos, Atividades, Etapas, Total de tempo
```

- `Total de tempo`: horas acumuladas no formato `HH:MM:SS` (ex.: `81:11:35`). O dashboard converte e soma automaticamente.
- Override opcional: `GOOGLE_SHEET_CLIENTS_CSV_URL`.

## Campanhas (Meta Ads + Google Ads)

A página **Campanhas** (`/campanhas`) mostra investimento, impressões, cliques, CTR, conversões e CPA consolidados de Meta Ads e Google Ads. **Hoje ela roda só com dados de demonstração** — a integração real com as APIs de anúncios ainda não foi implementada, porque depende de credenciais que só a agência/cliente pode gerar:

- **Meta Ads**: criar um app em [developers.facebook.com](https://developers.facebook.com), solicitar acesso à Marketing API e gerar um token de acesso de longa duração para a conta de anúncios.
- **Google Ads**: solicitar um Developer Token na conta Google Ads (aprovação da própria Google) e configurar OAuth (client id/secret + refresh token) vinculado à conta de anúncios.

Quando essas credenciais existirem, defina as variáveis de ambiente:

```bash
META_ADS_ACCESS_TOKEN=
META_ADS_ACCOUNT_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
```

E implemente as chamadas reais em `fetchMetaAdsData()` / `fetchGoogleAdsData()` dentro de [`src/lib/ads-source.ts`](src/lib/ads-source.ts) — o restante do pipeline (rota `/api/campaigns`, hook, página) já está pronto para consumir o formato `CampaignData[]` sem mais mudanças.

## Estrutura

- `src/app/page.tsx` — painel geral (KPIs, gráficos, tabela do time).
- `src/app/campanhas/page.tsx` — investimento e performance de Meta Ads / Google Ads.
- `src/app/clientes/page.tsx` — projetos, atividades e horas por cliente.
- `src/app/colaborador/page.tsx` — perfil individual de colaborador.
- `src/app/relatorio/page.tsx` — ficha de avaliação para impressão/PDF.
- `src/app/api/*/route.ts` — leem e normalizam os dados das abas da planilha e das campanhas.
- `src/lib/*-source.ts` — parsing/fetch e fallback para dados de demonstração.
- `src/lib/ads-service.ts` — agregações de campanhas (por dia, por plataforma, por campanha).
- `src/lib/client-brands.ts` — cor/logo por cliente final, compartilhado entre Clientes e Campanhas.
- `src/lib/horas.ts` — conversão do formato de horas `HH:MM:SS`.
