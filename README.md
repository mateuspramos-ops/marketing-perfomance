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

Crie uma planilha no Google Sheets com estas colunas na primeira linha (nomes exatos, minúsculo):

| mes     | ano  | colaborador      | cargo    | cliente | em_dia | atraso | meta |
| ------- | ---- | ---------------- | -------- | ------- | ------ | ------ | ---- |
| Janeiro | 2026 | Carolina Brandão | Designer | Geral   | 31     | 4      | 70   |

- `mes`: nome do mês por extenso (Janeiro, Fevereiro, ...).
- `cliente` e `meta` são opcionais — se vazios, assume `"Geral"` e `70` respectivamente.
- O total de atividades, a performance % e o GAP são calculados automaticamente a partir de `em_dia` e `atraso` — a cliente não precisa preencher essas colunas.
- Uma linha por colaborador/mês.

### 2. Publicar como CSV

Na planilha: **Arquivo → Compartilhar → Publicar na Web**. Selecione a aba correta, escolha o formato **CSV** e clique em **Publicar**. Copie o link gerado (algo como `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).

> Isso torna a planilha legível por qualquer pessoa com o link — consistente com o dashboard não ter login. Se os dados forem sensíveis, use login (ver abaixo) em vez de publicar a planilha.

### 3. Configurar a variável de ambiente

Copie `.env.example` para `.env.local` e cole a URL:

```bash
GOOGLE_SHEET_CSV_URL="https://docs.google.com/spreadsheets/d/e/SEU_ID/pub?output=csv"
```

Reinicie `npm run dev`. O aviso amarelo deve sumir e os dados da planilha aparecem no lugar dos de demonstração.

Os dados são recarregados automaticamente a cada 60 segundos no navegador (e o servidor revalida o CSV a cada 5 minutos), então a cliente só precisa editar a planilha — nada de redeploy.

## Deploy (Vercel)

1. Suba o código para um repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. Em **Environment Variables**, adicione `GOOGLE_SHEET_CSV_URL` com o mesmo valor do `.env.local`.
4. Deploy. A cada `git push` na branch principal, a Vercel publica a versão nova automaticamente.
5. Compartilhe a URL gerada (ou configure um domínio próprio em **Settings → Domains**) com a cliente.

## Estrutura

- `src/app/page.tsx` — painel geral (KPIs, gráficos, tabela do time).
- `src/app/colaborador/page.tsx` — perfil individual de colaborador.
- `src/app/relatorio/page.tsx` — ficha de avaliação para impressão/PDF.
- `src/app/api/performance/route.ts` — lê e normaliza os dados da planilha.
- `src/lib/sheet-source.ts` — parsing do CSV e fallback para dados de demonstração.
