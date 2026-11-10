# Portfólio — Warney Rego

Portfólio de [warneyrego.com](https://warneyrego.com) em Next.js (App Router), com colagens editoriais, textura de papel e animações de rolagem.

Hero e Sobre compartilham uma gravura contínua em `src/app/opening.module.css`: a arte aprovada da hero foi unida a uma continuação de terreno e ruínas gerada no GPT Images, com área central livre para leitura. Um único fundo atravessa as duas seções, nos temas claro e escuro, e se dissolve no papel do site apenas ao final de Sobre. As seções seguintes mantêm as texturas rasterizadas de papel levemente amassado em `public/images/background/`.

As laterais e a base de Sobre recebem gravuras adicionais geradas no GPT Images: colunas quebradas, cornijas, louros, oliveiras, moedas e fragmentos de mosaico. As máscaras `about-roman-{left,right,bottom}-dither.webp` e `eye-paper-dither.webp` usam dithering ordenado Bayer nas sombras, com cobertura binária, uma única tinta laranja no claro e tinta clara no escuro. Não há camada sobre o papel ou os textos. O conteúdo tem recuo lateral e inferior para não disputar espaço com as gravuras.

A hero mantém a gravura à esquerda e o nome em tinta contrastante na área livre. No mobile, uma superfície opaca de papel protege a leitura do nome sobre o recorte da imagem.

A parte superior da gravura preserva o tratamento de nitidez localizada (sigma 0,6) do original htp.png, de 1672 × 941. Os fundos compostos `hero-about-continuous{,-dark}.webp` têm 1672 × 1928, são armazenados sem perdas e entregues diretamente via CSS, sem recompressão do Next Image. Não há retícula artificial nem filtro de contraste global; o tratamento não recupera detalhes ausentes do original.

A hero é estática, com WARNEY REGO em duas linhas monumentais de caixa alta. REGO fica centralizado em relação a WARNEY. Os links de navegação, o monograma WR, a apresentação e o CTA ficam fora da hero; apenas o botão de tema permanece no topo direito.

O botão circular no topo alterna os temas claro e escuro e persiste a escolha em localStorage. Sem escolha salva, mudanças no tema do sistema continuam sendo acompanhadas.

A seção Sobre usa uma composição aberta em duas colunas. A ilustração `public/images/about/eye-paper-dither.webp`, gerada no GPT Images a partir da referência enviada, mostra um olho e uma mão saindo de um rasgo de papel, com nuvens gravadas. A máscara sem fundo acompanha a tinta dos dois temas, sem busto ou cabeça inteira. Em telas de até 800 px, título, introdução, gravura e textos seguem em uma coluna. Os dados profissionais e o currículo permanecem em `src/data/portfolio.ts`.

O currículo para download fica em `public/curriculo-warney-rego.pdf`: PDF de duas páginas com texto selecionável e links, incluindo Inforgeneses, encerramento da MedSafe em outubro de 2026, Estúdio e certificações.

O cartão do Estúdio destaca a captura do site e mantém a descrição compacta; os detalhes de recursos ficam em uma área expansível, sem JavaScript adicional.

A branch `main` abre diretamente o design Colagem em `/`, sem seletor de estética. A versão com as duas estéticas e a tela de escolha está preservada na branch `twodesigns`.

Os dados de conteúdo ficam em `src/data/portfolio.ts`. A seção de experiência é renderizada por `src/components/experience/Experience.tsx`, após a transição com nuvens e pássaros. Os cartões podem ser abertos para exibir detalhes, tecnologias e resultados. As pombas atravessam os quadros durante a rolagem; as animações respeitam a preferência por movimento reduzido.

Vínculos profissionais ficam em ordem do mais recente para o mais antigo. Quando não há resultados informados, o cartão não exibe uma faixa vazia de métricas.

Projetos, educação e contato ficam em componentes próprios em `src/components/`, com os textos e links também definidos em `src/data/portfolio.ts`. Em Projetos, o gladiador puxa uma linha contínua ligada ao título, que começa fora da tela e para na posição final. Depois, sete quadros adicionais mostram o gladiador sentando. A abertura permanece fixa durante a sequência; voltar a rolagem reverte a cena. Com movimento reduzido, o título e o gladiador sentado permanecem estáticos. As retículas dos painéis de projetos e contato ficam atrás de uma camada opaca, preservando a leitura nos dois temas.

O ritmo das cenas é controlado pela distância de rolagem: a abertura de Experiência ocupa quatro alturas de viewport e a sequência de Projetos ocupa três. As pombas percorrem uma faixa mais longa, com ciclo de asas de 960 ms.

O projeto em destaque é o [Estúdio](https://studiomkt.com.br), com descrição baseada no site público. A logo oficial e a captura enviada pelo usuário estão em `public/images/projects/studio-*`; os recursos apresentados não implicam uma stack técnica verificada.

O monograma WR continua disponível em `public/images/brand/warney-rego.png` e `warney-rego-light.png`, mas não é exibido na hero. O favicon em `src/app/favicon.ico` usa o monograma sobre fundo creme.

O fundo contínuo acompanha a proporção da hero e usa o mesmo posicionamento ao atravessar o Sobre, sem recortes independentes na emenda. As importações CSS geram URLs com hash; `hero-about-continuous.webp.json` registra a referência, o modelo e a composição dos painéis.

Educação e Contato usam sprites de seis quadros gerados com GPT Images, com pares de máscaras em `public/images/education/` e `public/images/contact/`. A coruja move a cabeça enquanto a página do livro vira; em Certificações, um carimbo desce sobre o diploma; em Contato, a carta alada voa e pousa. As cenas seguem a rolagem sem prender a página e ficam estáticas com movimento reduzido.

```bash
npm install
npm run dev
```
