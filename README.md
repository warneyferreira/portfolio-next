# Portfólio — Warney Rego

Portfólio de [warneyrego.com](https://warneyrego.com) em Next.js (App Router). Direção visual: uma tinta (`--ink: #c43c00`) sobre papel (`--paper: #fef0d3`), com gravuras de linha e retículas Bayer. A arte já usa esses tokens; a migração dos estilos residuais está registrada em `PROGRESS.md`.

Hero e Sobre compartilham uma gravura contínua em `src/app/opening.module.css`: a gravura aprovada da hero (Lady Justiça e Coliseu, gerada no GPT Images) é impressa como máscara 1 bit em `public/images/background/hero-engraving.webp` (3344 × 2229, ~164 KiB), com área central livre para leitura. Um único fundo atravessa as duas seções e não reinicia na seção Sobre. As laterais e a base de Sobre recebem gravuras adicionais geradas no GPT Images: colunas quebradas, cornijas, louros, oliveiras, moedas e fragmentos de mosaico. As máscaras `about-roman-{left,right,bottom}-dither.webp` e `eye-paper-dither.webp` usam dithering ordenado Bayer nas sombras, com cobertura binária, uma única tinta. Não há camada sobre o papel ou os textos. O conteúdo tem recuo lateral e inferior para não disputar espaço com as gravuras.

A hero mantém a gravura à esquerda e o nome em tinta contrastante na área livre. No mobile, uma superfície opaca de papel com borda de tinta e um bloco reticulado deslocado protegem a leitura do nome sobre o recorte da imagem.

A parte superior da gravura preserva o traço da gravura gerada: linhas limpas, sem re-reticulação — re-reticular gravura de linha cria moiré. A máscara é entregue diretamente via CSS, sem recompressão do Next Image. Não há retícula artificial nem filtro de contraste global.

A hero é estática, com WARNEY REGO em duas linhas monumentais de caixa alta. REGO fica centralizado em relação a WARNEY. Os links de navegação, o monograma WR, a apresentação e o CTA ficam fora da hero. Não há botão de tema: um tema só, claro.

A seção Sobre usa uma composição aberta em duas colunas. A ilustração `public/images/about/eye-paper-dither.webp`, gravura do olho e da mão no rasgo de papel, acompanha o título. Em telas de até 800 px, título, introdução, gravura e textos seguem em uma coluna. Os dados profissionais e o currículo permanecem em `src/data/portfolio.ts`.

O currículo para download fica em `public/curriculo-warney-rego.pdf`: PDF de duas páginas com texto selecionável e links, incluindo Inforgeneses, encerramento da MedSafe em outubro de 2026, Estúdio e certificações.

O cartão do Estúdio destaca a captura real do site, reticulada em 1 bit (`studio-screenshot-dither.webp`, Bayer). A prévia usa uma máscara CSS pintada com `var(--ink)`, sem recompressão pelo Next Image nem exibição do original em cores. A logo usa uma única tinta; os detalhes de recursos ficam em uma área expansível, sem JavaScript adicional.

A branch `main` abre diretamente o design de uma tinta em `/`, sem seletor de estética. A versão com as duas estéticas e a tela de escolha está preservada na branch `twodesigns`.

Os dados de conteúdo ficam em `src/data/portfolio.ts`. A seção de experiência é renderizada por `src/components/experience/Experience.tsx`, com um friso da ponte em obras abrindo a seção. Os cartões podem ser abertos para exibir detalhes, tecnologias e resultados. Nada de cenas presas à rolagem: a arte das seções seguintes é estática e respeita a preferência por movimento reduzido.

Vínculos profissionais ficam em ordem do mais recente para o mais antigo. Quando não há resultados informados, o cartão não exibe uma faixa vazia de métricas.

Projetos, educação e contato ficam em componentes próprios em `src/components/`, com os textos e links também definidos em `src/data/portfolio.ts`. Em Projetos, a marca tipográfica da bancada do gravador acompanha o título; a captura do Estúdio é reticulada, nunca exibida em cores. Em Educação, o atlas aberto com compasso acompanha as certificações; em Contato, a mão que lacra a correspondência acompanha o cartão-carta, sem asas.

As gravuras das seções seguintes foram geradas no GPT Images 2 a partir da gravura aprovada da hero como referência de estilo, reticuladas por `scripts/dither-art.mjs --mode line` em ~2x a largura de exibição, e registradas em provenance sidecars (`*.webp.json`) sem caminhos absolutos. As fontes contínuas ficam em `scripts/sources/`.

O projeto em destaque é o [Estúdio](https://studiomkt.com.br), com descrição baseada no site público. A logo oficial e a captura enviada pelo usuário estão em `public/images/projects/studio-*`; a captura em cores contínua fica em `scripts/sources/studio-screenshot.webp` como fonte da retícula.

A marca pixel-W aparece na barra de navegação e no favicon `src/app/icon.svg`. A abertura de vidro monocromático entrega a marca à barra; pode ser pulada e fica desativada com movimento reduzido ou sem JavaScript. Os monogramas antigos permanecem em `public/images/brand/` até a revisão de arquivos sem uso.

As importações CSS geram URLs com hash; `hero-engraving.webp.json` registra a referência, o modelo e o pipeline da gravura.

```bash
npm install
npm run dev
```
