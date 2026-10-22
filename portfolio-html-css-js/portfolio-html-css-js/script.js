/* ============================================================
   script.js — interatividade do portfólio do Kauã
   Tudo em JavaScript puro, organizado por recurso, na ordem:
   1) menu  2) navbar  3) terminal  4) animações  5) galerias
   6) certificados  7) copiar e-mail
   ============================================================ */

"use strict";

/* ---------- 1. Menu de navegação (versão celular) ---------- */
const botaoMenu = document.getElementById("botaoMenu");
const menu = document.getElementById("menu");
const iconeMenu = document.getElementById("iconeMenu");

function alternarMenu() {
  const aberto = menu.classList.toggle("aberto");
  botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  iconeMenu.innerHTML = '<use href="' + (aberto ? "#i-x" : "#i-menu") + '"/>';
}

botaoMenu.addEventListener("click", alternarMenu);

// Ao clicar em qualquer link do menu, fecha o menu no celular
menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    menu.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    iconeMenu.innerHTML = '<use href="#i-menu"/>';
  });
});

/* ---------- 2. Navbar ganha fundo quando a página rola ---------- */
const navbar = document.getElementById("navbar");

function atualizarNavbar() {
  navbar.classList.toggle("rolou", window.scrollY > 12);
}
window.addEventListener("scroll", atualizarNavbar, { passive: true });
atualizarNavbar();

// Marca no menu a seção que está aparecendo (scroll-spy)
const secoes = document.querySelectorAll("main section[id]");
const linksDoMenu = menu.querySelectorAll("a");

const observadorSecoes = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      linksDoMenu.forEach(function (link) {
        link.classList.toggle(
          "ativo",
          link.getAttribute("href") === "#" + entrada.target.id
        );
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
secoes.forEach(function (secao) { observadorSecoes.observe(secao); });

/* ---------- 3. Terminal animado do início ---------- */
const LINHAS_DO_TERMINAL = [
  { comando: "whoami",      saida: "estudante de Desenvolvimento de Sistemas" },
  { comando: "cat foco.txt", saida: "criar sites e apps que as pessoas curtam usar" },
  { comando: "status --hoje", saida: "aprendendo, construindo e evoluindo ✦" },
];

const terminal = document.getElementById("terminal");

function linhaHTML(comando, saida) {
  // Monta o HTML de uma linha já digitada: comando + saída comentada
  return (
    '<div class="linha-term">' +
      '<p><span class="usuario">kaua@senai</span>' +
      '<span class="doispontos">:$ </span>' +
      '<span class="comando">' + comando + "</span></p>" +
      '<p class="saida">// ' + saida + "</p>" +
    "</div>"
  );
}

async function rodarTerminal() {
  let pronto = ""; // HTML das linhas já concluídas (acumula)

  for (const linha of LINHAS_DO_TERMINAL) {
    // Passo 1: digita o comando letra por letra, com o cursor piscando
    for (let i = 1; i <= linha.comando.length; i++) {
      terminal.innerHTML = pronto +
        '<div class="linha-term"><p>' +
          '<span class="usuario">kaua@senai</span><span class="doispontos">:$ </span>' +
          '<span class="comando">' + linha.comando.slice(0, i) + '</span>' +
          '<span class="cursor">▊</span>' +
        "</p></div>";
      await esperar(65);
    }
    // Passo 2: pequena pausa e mostra a saída — a linha fica pronta
    await esperar(350);
    pronto += linhaHTML(linha.comando, linha.saida);
    terminal.innerHTML = pronto;
    await esperar(900);
  }
  // Passo 3: prompt final piscando
  terminal.innerHTML = pronto +
    '<div class="linha-term"><p>' +
      '<span class="usuario">kaua@senai</span><span class="doispontos">:$ </span>' +
      '<span class="cursor">▊</span>' +
    "</p></div>";
}

function esperar(milissegundos) {
  return new Promise(function (resolver) { setTimeout(resolver, milissegundos); });
}

if (terminal) { rodarTerminal(); }

/* ---------- 4. Animação de entrada dos elementos ao rolar ---------- */
const elementosRevelaveis = document.querySelectorAll(".revelar");

const observadorRevelar = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observadorRevelar.unobserve(entrada.target); // anima só uma vez
      }
    });
  },
  { rootMargin: "-60px" }
);

elementosRevelaveis.forEach(function (elemento) { observadorRevelar.observe(elemento); });

/* ---------- 5. Galerias de imagens dos projetos ---------- */
// As legendas aparecem no visualizador em tela cheia.
// "site" = projeto que roda de verdade (abre em nova aba pela legenda).
const GALERIAS = {
  manual: {
    site: "manuals/postura-profissional/index.html",
    fotos: [
      { src: "assets/projects/manual-postura-01-hero.jpg", legenda: "Página inicial — manual interativo de postura profissional" },
      { src: "assets/projects/manual-postura-02-pilares.jpg", legenda: "Os 6 pilares do profissional SENAI" },
      { src: "assets/projects/manual-postura-03-ambientes.jpg", legenda: "Guia prático de ambientes com filtro dinâmico" },
      { src: "assets/projects/manual-postura-04-accordion.jpg", legenda: "Matriz de atitudes com accordion expansível" },
      { src: "assets/projects/manual-postura-05-quiz.jpg", legenda: "Termômetro de postura — quiz com pontuação e perfil" },
      { src: "assets/projects/manual-postura-06-certificado.jpg", legenda: "Certificado de compromisso gerado com nome e data automáticos" },
    ],
  },
  techstore: {
    fotos: [
      { src: "assets/projects/techstore.jpg", legenda: "Página completa da loja — vitrine de produtos em destaque" },
    ],
  },
  sabor: {
    fotos: [
      { src: "assets/projects/sabor-caseiro-01.jpg", legenda: "Capa — da ideia ao protótipo: entendendo o cliente de verdade" },
      { src: "assets/projects/sabor-caseiro-02.jpg", legenda: "Apresentação do projeto — app de delivery de comida caseira" },
      { src: "assets/projects/sabor-caseiro-03.jpg", legenda: "Levantamento de requisitos funcionais e não funcionais" },
      { src: "assets/projects/sabor-caseiro-04.jpg", legenda: "Reflexões sobre o cliente e sobre o processo" },
      { src: "assets/projects/sabor-caseiro-05.jpg", legenda: "Dificuldades encontradas na comunicação equipe–cliente" },
      { src: "assets/projects/sabor-caseiro-06.jpg", legenda: "Protótipo em papel — telas iniciais do app" },
      { src: "assets/projects/sabor-caseiro-07.jpg", legenda: "Protótipo em papel — fluxo do pedido" },
      { src: "assets/projects/sabor-caseiro-08.jpg", legenda: "Protótipo em papel — acompanhamento da entrega" },
      { src: "assets/projects/sabor-caseiro-09.jpg", legenda: "Protótipo em papel — cadastro e perfil do usuário" },
      { src: "assets/projects/sabor-caseiro-10.jpg", legenda: "Importância do protótipo — evita retrabalho e valida ideias" },
      { src: "assets/projects/sabor-caseiro-11.jpg", legenda: "O que faríamos diferente na próxima entrega" },
      { src: "assets/projects/sabor-caseiro-12.jpg", legenda: "Identidade visual — creme, marrom e verde, estilo acolhedor" },
      { src: "assets/projects/sabor-caseiro-13.jpg", legenda: "Encerramento com a equipe do projeto" },
    ],
  },
  futuretech: {
    fotos: [
      { src: "assets/projects/futuretech-01.jpg", legenda: "Capa — FutureTech: conectando dados, criando soluções" },
      { src: "assets/projects/futuretech-02.jpg", legenda: "O que é a empresa — análise de dados com inteligência artificial" },
      { src: "assets/projects/futuretech-03.jpg", legenda: "Serviços — organização e análise automática de dados" },
      { src: "assets/projects/futuretech-04.jpg", legenda: "Para quem — pequenas e médias empresas e lojas online" },
      { src: "assets/projects/futuretech-05.jpg", legenda: "Problemas que resolve — dados desorganizados e decisões lentas" },
      { src: "assets/projects/futuretech-06.jpg", legenda: "Exemplo de funcionamento — caso real com aumento de 20% nas vendas" },
      { src: "assets/projects/futuretech-07.jpg", legenda: "Conclusão — IA a favor de decisões melhores" },
      { src: "assets/projects/futuretech-08.jpg", legenda: "Encerramento — obrigado pela atenção" },
    ],
  },
  mercadolivre: {
    fotos: [
      { src: "assets/projects/mercado-livre-antes.jpg", legenda: "Antes — página original do Mercado Livre" },
      { src: "assets/projects/mercado-livre-depois.jpg", legenda: "Depois — header e produtos transformados com JavaScript" },
      { src: "assets/projects/mercado-livre-js-01.jpg", legenda: "Documento da atividade — site escolhido, antes e depois" },
      { src: "assets/projects/mercado-livre-js-02.jpg", legenda: "Códigos JavaScript utilizados na transformação (DOM)" },
    ],
  },
  scrum: {
    fotos: [
      { src: "assets/projects/scrum-01.jpg", legenda: "Capa — Scrum e metodologias ágeis no desenvolvimento de software" },
      { src: "assets/projects/scrum-02.jpg", legenda: "O que é Scrum — framework ágil iterativo e incremental" },
      { src: "assets/projects/scrum-03.jpg", legenda: "O problema que o Scrum resolve — limites do modelo cascata" },
      { src: "assets/projects/scrum-04.jpg", legenda: "Tradicional vs Ágil — Cascata comparado às metodologias ágeis" },
      { src: "assets/projects/scrum-05.jpg", legenda: "Papéis do Scrum — Product Owner, Scrum Master e Time" },
      { src: "assets/projects/scrum-06.jpg", legenda: "Product Owner — quem prioriza o valor do produto" },
      { src: "assets/projects/scrum-07.jpg", legenda: "Scrum Master — facilitador que remove impedimentos" },
      { src: "assets/projects/scrum-08.jpg", legenda: "Time de Desenvolvimento — quem constrói o produto" },
      { src: "assets/projects/scrum-09.jpg", legenda: "Eventos do Scrum — cerimônias que organizam a Sprint" },
      { src: "assets/projects/scrum-10.jpg", legenda: "Sprint — ciclo de 1 a 4 semanas com incremento" },
      { src: "assets/projects/scrum-11.jpg", legenda: "Sprint Planning — planejamento do que será feito" },
      { src: "assets/projects/scrum-12.jpg", legenda: "Daily Scrum — reunião diária de 15 minutos" },
      { src: "assets/projects/scrum-13.jpg", legenda: "Sprint Review — apresentação do incremento" },
      { src: "assets/projects/scrum-14.jpg", legenda: "Sprint Retrospective — melhorias do processo" },
      { src: "assets/projects/scrum-15.jpg", legenda: "Artefatos — Product Backlog, Sprint Backlog e Incremento" },
      { src: "assets/projects/scrum-16.jpg", legenda: "Exemplo de backlog — app delivery de comida" },
      { src: "assets/projects/scrum-17.jpg", legenda: "Analogia — Scrum como a produção de um filme" },
      { src: "assets/projects/scrum-18.jpg", legenda: "Como aplicamos no grupo — papéis divididos e organização no Trello" },
      { src: "assets/projects/scrum-19.jpg", legenda: "Outras metodologias ágeis — XP e Lean Development" },
      { src: "assets/projects/scrum-20.jpg", legenda: "Comparação entre metodologias" },
      { src: "assets/projects/scrum-21.jpg", legenda: "Estudo de caso — aplicativo de estudos para estudantes" },
      { src: "assets/projects/scrum-22.jpg", legenda: "Exemplo de Sprint (bônus) — sistema de cadastro de usuários" },
      { src: "assets/projects/scrum-23.jpg", legenda: "Conclusão — comunicação e entregas rápidas" },
      { src: "assets/projects/scrum-24.jpg", legenda: "Obrigado pela atenção" },
    ],
  },
  umbrella: {
    fotos: [
      { src: "assets/projects/umbrella-01.jpg", legenda: "Capa — referência visual: pôster de The Umbrella Academy" },
      { src: "assets/projects/umbrella-02.jpg", legenda: "Pôster do elenco — estudo de composição e clima sombrio" },
      { src: "assets/projects/umbrella-03.jpg", legenda: "Paleta de cores — vermelhos, marrons, preto e dourado" },
      { src: "assets/projects/umbrella-04.jpg", legenda: "Sobre o trabalho — dificuldades, escolha do filme e tipografia" },
    ],
  },
};

// Elementos do modal da galeria
const modalGaleria = document.getElementById("modalGaleria");
const imagemGaleria = document.getElementById("imagemGaleria");
const legendaGaleria = document.getElementById("legendaGaleria");
const contadorGaleria = document.getElementById("contadorGaleria");
const siteGaleria = document.getElementById("siteGaleria");

let galeriaAtual = null; // { fotos, site, indice }

function abrirGaleria(chave) {
  const galeria = GALERIAS[chave];
  if (!galeria) return;
  galeriaAtual = { fotos: galeria.fotos, site: galeria.site || "", indice: 0 };
  mostrarImagem();
  modalGaleria.hidden = false;
  document.body.style.overflow = "hidden"; // trava o scroll do fundo
}

function mostrarImagem() {
  const foto = galeriaAtual.fotos[galeriaAtual.indice];
  imagemGaleria.src = foto.src;
  imagemGaleria.alt = foto.legenda;
  legendaGaleria.textContent = foto.legenda;
  contadorGaleria.textContent = (galeriaAtual.indice + 1) + " / " + galeriaAtual.fotos.length;

  // Link "abrir o site ao vivo" só existe no Manual Interativo
  if (galeriaAtual.site) {
    siteGaleria.hidden = false;
    siteGaleria.href = galeriaAtual.site;
  } else {
    siteGaleria.hidden = true;
  }
}

function fecharGaleria() {
  modalGaleria.hidden = true;
  galeriaAtual = null;
  document.body.style.overflow = "";
}

function trocarImagem(direcao) {
  if (!galeriaAtual) return;
  const total = galeriaAtual.fotos.length;
  galeriaAtual.indice = (galeriaAtual.indice + direcao + total) % total;
  mostrarImagem();
}

// Todo elemento com data-abre-galeria="chave" abre a galeria
document.querySelectorAll("[data-abre-galeria]").forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    abrirGaleria(elemento.getAttribute("data-abre-galeria"));
  });
});
document.getElementById("fecharGaleria").addEventListener("click", fecharGaleria);
document.getElementById("anteriorImagem").addEventListener("click", function () { trocarImagem(-1); });
document.getElementById("proximaImagem").addEventListener("click", function () { trocarImagem(1); });

/* ---------- 6. Visualizador dos certificados ---------- */
// A lista de certificados vem do próprio HTML (botões com data-cert)
const botoesCertificados = Array.from(document.querySelectorAll("[data-cert]"));
const dadosCertificados = botoesCertificados.map(function (botao) {
  return {
    src: botao.querySelector("img").getAttribute("src"),
    titulo: botao.getAttribute("data-titulo"),
    emissor: botao.getAttribute("data-emissor"),
    data: botao.getAttribute("data-data"),
  };
});

const modalCertificado = document.getElementById("modalCertificado");
const imagemCertificado = document.getElementById("imagemCertificado");
const tituloCertificado = document.getElementById("tituloCertificado");
const metaCertificado = document.getElementById("metaCertificado");
const contadorCertificado = document.getElementById("contadorCertificado");

let certificadoAtual = -1;

function abrirCertificado(indice) {
  certificadoAtual = indice;
  const cert = dadosCertificados[indice];
  imagemCertificado.src = cert.src;
  imagemCertificado.alt = cert.titulo;
  tituloCertificado.textContent = cert.titulo;
  metaCertificado.textContent = cert.emissor + " · " + cert.data;
  contadorCertificado.textContent = (indice + 1) + " / " + dadosCertificados.length;
  modalCertificado.hidden = false;
  document.body.style.overflow = "hidden";
}

function fecharCertificado() {
  modalCertificado.hidden = true;
  certificadoAtual = -1;
  document.body.style.overflow = "";
}

function trocarCertificado(direcao) {
  if (certificadoAtual === -1) return;
  const total = dadosCertificados.length;
  abrirCertificado((certificadoAtual + direcao + total) % total);
}

botoesCertificados.forEach(function (botao, indice) {
  botao.addEventListener("click", function () { abrirCertificado(indice); });
});
document.getElementById("fecharCertificado").addEventListener("click", fecharCertificado);
document.getElementById("anteriorCertificado").addEventListener("click", function () { trocarCertificado(-1); });
document.getElementById("proximaCertificado").addEventListener("click", function () { trocarCertificado(1); });

// Teclado: ESC fecha o que estiver aberto; setas navegam
document.addEventListener("keydown", function (evento) {
  const galeriaAberta = !modalGaleria.hidden;
  const certificadoAberto = !modalCertificado.hidden;

  if (evento.key === "Escape") {
    if (galeriaAberta) fecharGaleria();
    if (certificadoAberto) fecharCertificado();
  }
  if (evento.key === "ArrowLeft") {
    if (galeriaAberta) trocarImagem(-1);
    if (certificadoAberto) trocarCertificado(-1);
  }
  if (evento.key === "ArrowRight") {
    if (galeriaAberta) trocarImagem(1);
    if (certificadoAberto) trocarCertificado(1);
  }
});

// Clicar fora da imagem também fecha
modalGaleria.addEventListener("click", function (evento) {
  if (evento.target === modalGaleria) fecharGaleria();
});
modalCertificado.addEventListener("click", function (evento) {
  if (evento.target === modalCertificado) fecharCertificado();
});

/* ---------- 7. Copiar e-mail (com aviso na tela) ---------- */
const EMAIL = "kaua.b.barbosa@edu.senai.br";
const botaoCopiar = document.getElementById("botaoCopiar");
const textoCopiar = document.getElementById("textoCopiar");
const iconeCopiar = document.getElementById("iconeCopiar");
const toast = document.getElementById("toast");

let temporizadorToast = null;

function avisar(mensagem) {
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(function () {
    toast.classList.remove("visivel");
  }, 2200);
}

// Plano B para quando a API de copiar não está disponível (ex.: abrindo por arquivo)
function copiarDoJeitoAntigo(texto) {
  const area = document.createElement("textarea");
  area.value = texto;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const deu = document.execCommand("copy");
  document.body.removeChild(area);
  return deu;
}

botaoCopiar.addEventListener("click", async function () {
  let copiou = false;
  try {
    await navigator.clipboard.writeText(EMAIL);
    copiou = true;
  } catch {
    copiou = copiarDoJeitoAntigo(EMAIL);
  }

  if (copiou) {
    textoCopiar.textContent = "Copiado!";
    iconeCopiar.innerHTML = '<use href="#i-check"/>';
    avisar("E-mail copiado! " + EMAIL);
    setTimeout(function () {
      textoCopiar.textContent = "Copiar e-mail";
      iconeCopiar.innerHTML = '<use href="#i-copiar"/>';
    }, 2000);
  } else {
    avisar("Não consegui copiar — copie manualmente: " + EMAIL);
  }
});
