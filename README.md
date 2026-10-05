# Site institucional Rubli

Site estático em português do Brasil, pronto para versionar no GitHub e publicar como **Static Site** no Render. Não precisa instalar dependências.

## Desenvolvimento

Requer Node.js 20 ou superior.

```bash
npm run build
```

Use `npm run preview` e abra `http://127.0.0.1:8765`. `npm run dev` recompila ao alterar os arquivos de `src`.

## Configuração

As variáveis de `.env.example` são lidas do ambiente no momento do build. `SITE_URL` habilita canonical e sitemap com o domínio correto. `APP_URL`, `PROVIDER_SIGNUP_URL`, `SUPPORT_URL` e `INSTAGRAM_URL` habilitam links oficiais. Sem elas, o site mantém chamadas internas seguras e informa que o contato está sendo preparado. Configure as variáveis no painel do Render.

## Publicação no Render

Conecte o repositório GitHub ao Render como **Static Site**. Use `npm run build` como Build Command e `dist` como Publish Directory. O arquivo `render.yaml` contém a mesma configuração. Após definir `SITE_URL`, execute um novo deploy para gerar canonical e sitemap.

## Publicação no GitHub Pages

O fluxo `.github/workflows/pages.yml` publica automaticamente o site após cada envio para a branch `main`. No GitHub, abra **Settings → Pages** e selecione **GitHub Actions** em **Source**. O endereço público deste repositório é:

```text
https://p3rtub4d00.github.io/webrubli/
```

O build do Pages usa `BASE_PATH=/webrubli` para que imagens, estilos, scripts e links funcionem dentro do caminho do repositório.

## Termos e privacidade

As páginas `/termos/` e `/privacidade/` são geradas diretamente dos arquivos Markdown em `docs/`, copiados dos documentos do projeto Rubli original. Atualize esses arquivos e execute um novo build para publicar versões revisadas. Os documentos ainda contêm campos entre colchetes para CNPJ, endereço e contatos e pedem revisão jurídica antes do lançamento público.

## Conteúdo que requer validação

Esta pasta não contém o aplicativo nem a API. Por isso, as demais páginas evitam promessas específicas sobre verificação, proteção de endereço, preços, disponibilidade de modalidades e suporte. Compare os documentos legais com o comportamento real do produto antes da publicação pública.

## Estrutura

- `src/pages.mjs`: textos e rotas
- `docs/`: fontes Markdown dos Termos e da Política de Privacidade
- `src/markdown.mjs`: renderização dos documentos legais
- `src/site.css`: estilos e tokens
- `src/site.js`: menu móvel
- `scripts/build.mjs`: geração estática, metadados, robots e sitemap
- `public/brand/rubli-logo.png`: logo enviada pelo usuário

## Verificação

```bash
npm test
npm run build
```
