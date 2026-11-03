# Portfólio — Warney Rego

Portfólio de [warney.dev](https://www.warney.dev) em Next.js (App Router), com identidade visual em preto e branco e animações de rolagem.

A branch `main` abre diretamente o design Colagem em `/`, sem seletor de estética. A versão com as duas estéticas e a tela de escolha está preservada na branch `twodesigns`.

Os dados de conteúdo ficam em `src/data/portfolio.ts`. A seção de experiência é renderizada por `src/components/experience/Experience.tsx`, após a transição com nuvens e pássaros. Os cartões podem ser abertos para exibir detalhes, tecnologias e resultados. As pombas atravessam os quadros durante a rolagem; as animações respeitam a preferência por movimento reduzido.

Projetos, educação e contato ficam em componentes próprios em `src/components/`, com os textos e links também definidos em `src/data/portfolio.ts`. Em Projetos, o gladiador puxa uma linha contínua ligada ao título, que começa fora da tela e para na posição final. Depois, sete quadros adicionais mostram o gladiador sentando. A abertura permanece fixa durante a sequência; voltar a rolagem reverte a cena. Com movimento reduzido, o título e o gladiador sentado permanecem estáticos. As retículas dos painéis de projetos e contato ficam atrás de uma camada opaca, preservando a leitura nos dois temas.

O projeto em destaque é o [Estúdio](https://studiomkt.com.br), com descrição baseada no site público. A logo oficial e a captura enviada pelo usuário estão em `public/images/projects/studio-*`; os recursos apresentados não implicam uma stack técnica verificada.

```bash
npm install
npm run dev
```
