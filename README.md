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

## AdSense e domínio principal

No Render, use o serviço **Static Site**, Build Command `npm run build` e Publish Directory `dist`. Não use `npm ci`: o projeto não tem dependências nem lockfile. O Blueprint configura Node 22, SITE_URL, WhatsApp e Instagram. Se o serviço já existir, preencha essas variáveis no painel; apenas adicionar o YAML ao GitHub não modifica um serviço manual existente.

Adicione `rubli.com.br` e, se desejar, `www.rubli.com.br` em Settings → Custom Domains. Configure no Registro.br os registros que o Render apresentar e aguarde a validação e o HTTPS. Mantenha o serviço e os registros de `clubeon.rubli.com.br` como estão. Deixe BASE_PATH vazio no Render. SITE_URL deve ser `https://rubli.com.br`.

Em Sites no AdSense, cadastre `rubli.com.br`. Copie seu identificador real para a variável de build `ADSENSE_PUBLISHER_ID` no Render e execute um novo deploy. O build aceita `pub-` ou `ca-pub-` com 16 dígitos e gera:

- metatag `google-adsense-account` no HTML de todas as páginas;
- `https://rubli.com.br/ads.txt` com o mesmo identificador;
- canonical, sitemap e robots quando SITE_URL estiver configurada.

Sem identificador, não há metatag nem ads.txt. Valores inválidos interrompem o build. Nenhuma conta fictícia é publicada, e nenhum script de anúncios ou cookie publicitário é ativado nesta etapa. Confira os dois recursos publicados e solicite a revisão no AdSense. A configuração técnica não garante aprovação: a decisão depende do conteúdo e da análise do Google.

Após o domínio receber o status Pronto, a integração dos blocos publicitários e das opções de privacidade será feita no catálogo. Usando a mesma conta, o ads.txt do domínio principal autoriza esse vendedor também no subdomínio; não é necessário acrescentar `subdomain=` nesse caso. Uma conta diferente no catálogo exige revisar essa configuração. Não há redirecionamento nem iframe para disfarçar o catálogo.

Fontes: [Conectar ao AdSense](https://support.google.com/adsense/answer/7584263?hl=pt-BR), [ads.txt e subdomínios](https://support.google.com/adsense/answer/9785052), [Blueprint Render](https://render.com/docs/blueprint-spec).

## Termos e privacidade

A página `/privacidade/` é gerada de `docs/PRIVACIDADE-SITE.md`, específica para o site institucional e a etapa de verificação do AdSense. A página `/termos/` usa o documento original do aplicativo em `docs/TERMOS-DE-USO.md`. Atualize esses arquivos e execute um novo build para publicar versões revisadas. Os termos originais do aplicativo ainda contêm campos de identificação entre colchetes; revise esses dados antes de usar o documento como termos definitivos do produto. A política original do aplicativo permanece preservada em docs/POLITICA-DE-PRIVACIDADE.md.

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
