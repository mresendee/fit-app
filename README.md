# Fit App

App de controle calórico, treino, água, passos e acompanhamento de peso.

Igual ao Baba TBT: **um arquivo HTML só**, sem instalar nada, sem build.
Os dados ficam no navegador da pessoa (localStorage), e dá pra sincronizar
entre aparelhos com uma chave de 6 caracteres (🔑 no topo do app).

## O que o app já faz

- Controle calórico diário com favoritos de 1 toque
- **Reconhecimento de calorias por foto** — tira foto do prato e a IA
  identifica os alimentos e estima as calorias (precisa de uma chave da
  Anthropic — veja abaixo)
- Cronograma de treino semanal **gerado automaticamente** com base no
  objetivo escolhido no cadastro (emagrecer / manter / ganhar massa)
- Contador de passos real, via acelerômetro do celular
- Peso, altura e gráfico de progresso
- Sincronização entre aparelhos por chave (opcional)
- Instalável na tela inicial (PWA)

## Testar antes de publicar

Dê duplo clique no `index.html` — abre no navegador. Sincronização (🔑) e
reconhecimento de foto só funcionam depois de publicado na Vercel.

## Publicar (GitHub + Vercel)

1. No **GitHub Desktop**: File → Add local repository → selecione esta pasta
   → "create a repository" → escreva um resumo → **Commit to main** →
   **Publish repository**.
2. Na [Vercel](https://vercel.com): **Add New → Project** → selecione o
   repositório → **Deploy**.

## Ativar o reconhecimento de calorias por foto

1. Crie uma conta em [console.anthropic.com](https://console.anthropic.com)
   e gere uma chave de API (Settings → API Keys → Create Key).
2. No painel do projeto na Vercel → **Settings → Environment Variables**.
3. Adicione uma variável: nome `ANTHROPIC_API_KEY`, valor a chave que você
   gerou. Salve.
4. Vá em **Deployments** → ⋯ do deployment mais recente → **Redeploy**.

Isso tem custo (cobrado pela Anthropic, por uso — bem barato pra esse tipo de
uso). Sem esse passo, o botão de foto mostra um erro amigável explicando que
a chave não foi configurada; o resto do app funciona normal.

## Ativar a sincronização entre aparelhos (opcional)

1. No painel do projeto na Vercel → **Storage** → **Create Database** →
   **Upstash** → **Redis** → conectar ao projeto.
2. **Deployments** → ⋯ → **Redeploy**.

A partir daí, tocar no 🔑 mostra o código do aparelho. Digitar esse mesmo
código em outro aparelho puxa os dados pra lá.

## Instalar como app (PWA)

Depois de publicado, abrir pelo celular mostra "Adicionar à tela inicial".

## Sobre o contador de passos

Usa o sensor de movimento do navegador (funciona em celular, direto pelo
Chrome/Safari). Só conta enquanto o app estiver aberto na tela — diferente
de um app nativo, não roda em segundo plano. No iPhone, o Safari pede
permissão de movimento na primeira vez que você toca em "Ativar contador".

## Arquivos

```
index.html              → o app inteiro (telas, estilos, lógica)
api/sync.js              → sincronização entre aparelhos (Upstash Redis)
api/analisar-foto.js     → reconhecimento de calorias por foto (Anthropic)
manifest.webmanifest, icon-192.png, icon-512.png, sw.js  → PWA
package.json             → dependências das duas funções acima
```
