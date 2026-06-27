// constants/projectsLayoutConfig.js
// Fonte única de dados estáticos do ProjectsLayout.
// Importar daqui em qualquer componente que precise destas configs.

export const TOAST_CONFIG = {
  success: {
    icon: "✓",
    message: "Feedback enviado — obrigado!",
    classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  },
  error: {
    icon: "✕",
    message: "Não foi possível enviar. Tenta novamente.",
    classes: "border-red-400/40 bg-red-400/10 text-red-400",
  },
};

export const CTA_CONFIG = {
  Frontend: {
    heading: "Tens uma ideia de interface?",
    sub:     "Transformo designs e conceitos em interfaces modernas, rápidas e acessíveis.",
    cta:     "Falar sobre o projecto",
  },
  Backend: {
    heading: "Precisas de uma API sólida?",
    sub:     "Construo sistemas robustos, seguros e preparados para escalar.",
    cta:     "Discutir a arquitectura",
  },
  Fullstack: {
    heading: "Queres um produto completo?",
    sub:     "Do design ao banco de dados — entrego soluções de ponta a ponta.",
    cta:     "Arrancar o projecto",
  },
  default: {
    heading: "Vamos tirar essa ideia do papel?",
    sub:     "Disponível para colaborar em produtos digitais modernos.",
    cta:     "Entrar em contacto",
  },
};

export const FEEDBACK_CONFIG = {
  Frontend: {
    heading:     "O design funcionou?",
    sub:         "A tua opinião sobre usabilidade e estética ajuda a melhorar cada interface.",
    placeholder: "O layout está intuitivo? A navegação faz sentido? Diz-me tudo...",
  },
  Backend: {
    heading:     "A documentação está clara?",
    sub:         "Feedback sobre clareza das APIs e organização do código.",
    placeholder: "Os endpoints fazem sentido? Faltou alguma rota? Conta-me...",
  },
  Fullstack: {
    heading:     "A arquitectura faz sentido?",
    sub:         "A tua visão sobre a integração front-back ajuda a construir produtos melhores.",
    placeholder: "A stack escolhida faz sentido para o problema? O que melhorarias?",
  },
  default: {
    heading:     "Feedback",
    sub:         "A tua opinião ajuda a evoluir o código.",
    placeholder: "Deixa o teu comentário...",
  },
};