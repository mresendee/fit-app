# Fit App

App de controle calórico, treino, água, passos e acompanhamento de peso.

Igual ao Baba TBT: **um arquivo HTML só**, sem instalar nada, sem build.
Os dados ficam no navegador da pessoa (localStorage), e dá pra sincronizar
entre aparelhos com uma chave de 6 caracteres (🔑 no topo do app).

## Testar antes de publicar

Dê duplo clique no `index.html` — abre no navegador. A sincronização (🔑)
só funciona depois de publicado na Vercel; sem isso, o resto do app funciona
normal.

## Publicar (GitHub + Vercel)

1. No **GitHub Desktop**: File → Add local repository → selecione esta pasta
   → "create a repository" → escreva um resumo → **Commit to main** →
   **Publish repository**.
2. Na [Vercel](https://vercel.com): **Add New → Project** → selecione o
   repositório → **Deploy**. Não precisa mudar nenhuma configuração.

Pronto — em cerca de 1 minuto o app está no ar.

## Ativar a sincronização entre aparelhos (opcional)

1. No painel do projeto na Vercel → **Storage** → **Create Database** →
   **Upstash** → **Redis** → conectar ao projeto.
2. Vercel → aba **Deployments** → ⋯ → **Redeploy**.

A partir daí, tocar no 🔑 mostra o código do aparelho. Digitar esse mesmo
código em outro aparelho puxa os dados pra lá.

## Instalar como app (PWA)

Depois de publicado, abrir pelo celular mostra a opção "Adicionar à tela
inicial" — vira um ícone normal, abre em tela cheia.

## Arquivos

```
index.html              → o app inteiro (telas, estilos, lógica)
api/sync.js             → função de sincronização (só roda na Vercel)
manifest.webmanifest, icon-192.png, icon-512.png, sw.js  → PWA
package.json            → só a dependência da função de sincronização
```
