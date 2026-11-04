# Portfólio — Warney Rego

Portfólio de [warney.dev](https://www.warney.dev) em Next.js (App Router), com identidade visual em preto e branco e animações de rolagem.

O fundo usa texturas rasterizadas de papel levemente amassado em `public/images/background/`, com versões clara e escura. A folha tem vincos suaves e é contínua entre as seções, sem grade de pontos nem filtros calculados durante a rolagem.

O currículo para download fica em `public/curriculo-warney-rego.pdf`: PDF de duas páginas com texto selecionável e links, incluindo Inforgeneses, encerramento da MedSafe em outubro de 2026, Estúdio e certificações.

O cartão do Estúdio destaca a captura do site e mantém a descrição compacta; os detalhes de recursos ficam em uma área expansível, sem JavaScript adicional.

A branch `main` abre diretamente o design Colagem em `/`, sem seletor de estética. A versão com as duas estéticas e a tela de escolha está preservada na branch `twodesigns`.

Os dados de conteúdo ficam em `src/data/portfolio.ts`. A seção de experiência é renderizada por `src/components/experience/Experience.tsx`, após a transição com nuvens e pássaros. Os cartões podem ser abertos para exibir detalhes, tecnologias e resultados. As pombas atravessam os quadros durante a rolagem; as animações respeitam a preferência por movimento reduzido.

Vínculos profissionais ficam em ordem do mais recente para o mais antigo. Quando não há resultados informados, o cartão não exibe uma faixa vazia de métricas.

Projetos, educação e contato ficam em componentes próprios em `src/components/`, com os textos e links também definidos em `src/data/portfolio.ts`. Em Projetos, o gladiador puxa uma linha contínua ligada ao título, que começa fora da tela e para na posição final. Depois, sete quadros adicionais mostram o gladiador sentando. A abertura permanece fixa durante a sequência; voltar a rolagem reverte a cena. Com movimento reduzido, o título e o gladiador sentado permanecem estáticos. As retículas dos painéis de projetos e contato ficam atrás de uma camada opaca, preservando a leitura nos dois temas.

O ritmo das cenas é controlado pela distância de rolagem: a abertura de Experiência ocupa quatro alturas de viewport e a sequência de Projetos ocupa três. As pombas percorrem uma faixa mais longa, com ciclo de asas de 960 ms.

O projeto em destaque é o [Estúdio](https://studiomkt.com.br), com descrição baseada no site público. A logo oficial e a captura enviada pelo usuário estão em `public/images/projects/studio-*`; os recursos apresentados não implicam uma stack técnica verificada.

O monograma WR está disponível em `public/images/brand/warney-rego.png` (tinta escura) e `warney-rego-light.png` (tinta clara), ambos com transparência. `warney-rego-preview.webp` apresenta a marca sobre o papel do portfólio. A hero usa a marca como máscara adaptável ao tema, preserva o retrato no “O” e oferece uma chamada direta para Projetos. O favicon em `src/app/favicon.ico` usa o monograma sobre fundo creme, com tamanhos de 16 a 256 px.

Educação e Contato usam sprites de seis quadros gerados com GPT Images, com pares de máscaras em `public/images/education/` e `public/images/contact/`. A coruja move a cabeça enquanto a página do livro vira; em Certificações, um carimbo desce sobre o diploma; em Contato, a carta alada voa e pousa. As cenas seguem a rolagem sem prender a página e ficam estáticas com movimento reduzido.

```bash
npm install
npm run dev
```
