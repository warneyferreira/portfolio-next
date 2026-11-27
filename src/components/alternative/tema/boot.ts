/* Antes da primeira pintura: aplica o tema guardado (tema.ts) em
   html[data-alt-tema]. Escuro é o padrão. Fica fora de tema.ts ("use
   client") para o layout (server component) poder importar a string. */
export const TEMA_BOOT = `
  try {
    var t = localStorage.getItem("alt-tema");
    document.documentElement.dataset.altTema = t === "claro" ? "claro" : "escuro";
  } catch (e) {
    document.documentElement.dataset.altTema = "escuro";
  }
`;
