/*
  ÁLBUM DAS RAÍZES — MODO ÁUDIO
  =============================
  Versão do jogo para estudantes cegos ou com baixa visão.
  O jogo fala sozinho (js/voz.js) e funciona só pelo teclado, sempre
  com as mesmas teclas:
    - setas: escolher           - Enter: confirmar
    - Esc: voltar               - barra de espaço: ouvir de novo
    - H: ajuda falada           - números 1, 2, 3...: escolher direto
    - T (na mancala): como está o tabuleiro
    - F, D, S, J, K, L (na atividade de braille): pontos 1 a 6
  Cada tela é uma lista de botões de verdade, com nomes completos, para
  funcionar também com o NVDA e o Narrador do Windows.
  As falas ficam em js/conteudo.js (parte "MODO ÁUDIO E ACESSIBILIDADE").
*/

const MODO_AUDIO = (function () {
  "use strict";

  const A = CONTEUDO.acessibilidade;
  const TECLAS_BRAILLE = { f: 1, d: 2, s: 3, j: 4, k: 5, l: 6 };

  let ctrl = null;          // o que as teclas fazem na tela atual
  let geracao = 0;          // muda a cada troca de tela
  let aoSair = null;        // limpeza da tela atual (por exemplo, parar a mancala)

  // Toca um som e, se a tela ainda for a mesma, continua depois dele.
  function som(nome, depois) {
    const g = geracao;
    VOZ.tocar(nome, depois ? function () { if (g === geracao) depois(); } : null);
  }
  let indiceMenu = 0;       // última estação escolhida no menu principal
  let jaOuviuAfrica = false;

  // Atalhos para o jogo principal (js/jogo.js).
  function I() { return J.interno; }
  function h() { return J.h.apply(null, arguments); }
  function tela() { return I().telaEl; }

  function desc(id) { return A.descricoes[id] || ""; }
  function vozPropria() { return I().acess().vozPropria; }
  function erroEncorajador() { return J.sortear(A.falas.erro); }

  function falar(texto, aoTerminar) { VOZ.falar(texto, { aoTerminar: aoTerminar }); }

  /* =================== TELA BASE =================== */
  function base(titulo) {
    const t = tela();
    t.innerHTML = "";
    const corpo = h("div", { class: "audio-corpo" });
    t.append(h("section", { class: "audio", role: "application", "aria-labelledby": "audio-titulo", "aria-describedby": "audio-dicas" },
      h("h1", { id: "audio-titulo", class: "audio-titulo" }, titulo),
      h("p", { id: "fala-atual", class: "fala-atual", "aria-hidden": "true" }),
      corpo,
      h("p", { id: "audio-dicas", class: "audio-teclas" }, A.falas.teclas)));
    return corpo;
  }

  /* =================== MENU FALADO ===================
     cfg.titulo, cfg.fala (dita ao abrir), cfg.opcoes [{texto, fala, acao}],
     cfg.lerOpcoes (lê as opções numeradas ao abrir), cfg.inicial,
     cfg.aoVoltar (Esc), cfg.ajuda (tecla H), cfg.teclas {letra: função},
     cfg.repetir (barra de espaço), cfg.extra (elemento mostrado na tela). */
  function menu(cfg) {
    const corpo = base(cfg.titulo);
    if (cfg.extra) corpo.append(cfg.extra);
    const botoes = [];
    const lista = h("ul", { class: "audio-menu" });
    cfg.opcoes.forEach(function (op, i) {
      const rotulo = (i + 1) + ". " + op.texto;
      const b = h("button", { type: "button", class: "audio-opcao" + (op.marcada ? " marcada" : ""), "aria-label": (i + 1) + ". " + (op.fala || op.texto),
        onclick: function () { escolher(i); } }, rotulo);
      botoes.push(b);
      lista.append(h("li", null, b));
    });
    corpo.append(lista);
    let indice = Math.min(cfg.inicial || 0, Math.max(0, cfg.opcoes.length - 1));

    function focar(i) {
      indice = i;
      botoes.forEach(function (b, k) { b.classList.toggle("atual", k === i); b.tabIndex = k === i ? 0 : -1; });
      if (botoes[i]) botoes[i].focus({ preventScroll: false });
    }
    function falaDaOpcao(i) {
      const op = cfg.opcoes[i];
      if (cfg.semNumero) return op.fala || op.texto;
      return "Opção " + (i + 1) + ": " + (op.fala || op.texto);
    }
    function escolher(i) {
      if (!cfg.opcoes[i]) return;
      focar(i);
      cfg.opcoes[i].acao(i, botoes[i]);
    }
    function lerTudo() {
      let texto = cfg.fala || "";
      if (cfg.lerOpcoes) texto += " " + cfg.opcoes.map(function (op, i) { return falaDaOpcao(i) + "."; }).join(" ");
      return texto.trim();
    }

    ctrl = {
      mover: function (d) {
        if (!botoes.length) return;
        const i = (indice + d + botoes.length) % botoes.length;
        VOZ.tocar("mover");
        focar(i);
        // Com NVDA ou Narrador, o próprio leitor lê o botão em foco.
        if (vozPropria()) falar(falaDaOpcao(i));
      },
      enter: function () { escolher(indice); },
      numero: function (n) { if (n >= 1 && n <= botoes.length) escolher(n - 1); },
      voltar: cfg.aoVoltar,
      ajuda: cfg.ajuda,
      teclas: cfg.teclas || {},
      repetir: cfg.repetir || null,
      falaDaOpcao: falaDaOpcao
    };
    focar(indice);
    const texto = lerTudo();
    if (texto && !cfg.silencioso) falar(texto, cfg.depoisDeFalar);
    return { botoes: botoes, focar: focar, falaDaOpcao: falaDaOpcao };
  }

  /* Pergunta de escolha: opções numeradas, acerto e erro falados.
     cfg.opcoes [{texto, fala, certa, erro}], cfg.aoAcertar. */
  function perguntar(cfg) {
    let resolvida = false;
    const m = menu({
      titulo: cfg.titulo,
      fala: cfg.enunciado + (cfg.semInstrucao ? "" : " Escolha com as setas e Enter, ou aperte o número."),
      silencioso: cfg.silencioso,
      lerOpcoes: true,
      opcoes: cfg.opcoes.map(function (op) {
        return {
          texto: op.texto, fala: op.fala,
          acao: function (i, botao) {
            if (resolvida) return;
            if (op.certa) {
              resolvida = true;
              botao.classList.add("certa");
              VOZ.tocar("certo");
              // Depois do acerto, segue sozinho; Enter adianta.
              let seguiu = false;
              const seguir = function () { if (seguiu) return; seguiu = true; if (cfg.aoAcertar) cfg.aoAcertar(); };
              ctrl = { enter: seguir, numero: seguir, voltar: seguir, mover: function () {}, repetir: function () {}, ajudaTecla: function () {} };
              falar(J.acerto() + (cfg.falaAcerto ? " " + cfg.falaAcerto : ""), seguir);
            } else {
              botao.classList.add("errada");
              VOZ.tocar("tentar");
              falar((op.erro || "Não é essa.") + " " + erroEncorajador());
            }
          }
        };
      }),
      aoVoltar: cfg.aoVoltar,
      ajuda: cfg.ajuda || A.ajuda.pergunta,
      repetir: cfg.repetir || function () {
        falar(cfg.enunciado + " " + cfg.opcoes.map(function (op, i) { return "Opção " + (i + 1) + ": " + (op.fala || op.texto) + "."; }).join(" "));
      }
    });
    return m;
  }

  /* =================== TECLADO =================== */
  function tecla(ev) {
    VOZ.destravar();
    if (!ctrl) return;
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    const k = ev.key;
    if (ctrl.braille) { ctrl.teclaApertada(ev); return; }
    // Enquanto o jogo fala algo que leva à próxima etapa (ou o computador
    // joga), as teclas esperam. Só o Esc continua valendo.
    if (ctrl.ocupado && ctrl.ocupado()) {
      if (k === "Escape" || k === "Esc") { ev.preventDefault(); if (ctrl.voltar) ctrl.voltar(); }
      else if (k.indexOf("Arrow") === 0 || k === " " || k === "Enter") ev.preventDefault();
      return;
    }
    const minuscula = k.length === 1 ? k.toLowerCase() : k;
    if (k === " " || k === "Spacebar") {
      ev.preventDefault();
      if (ctrl.repetir) ctrl.repetir(); else VOZ.repetir();
      return;
    }
    if (minuscula === "h") {
      ev.preventDefault();
      if (ctrl.ajudaTecla) ctrl.ajudaTecla();
      else falar((ctrl.ajuda ? ctrl.ajuda + " " : "") + A.falas.teclas);
      return;
    }
    if (k === "Escape" || k === "Esc") {
      ev.preventDefault();
      if (ctrl.voltar) ctrl.voltar();
      return;
    }
    if (k === "ArrowUp" || k === "ArrowLeft" || k === "Up" || k === "Left") { ev.preventDefault(); if (ctrl.mover) ctrl.mover(-1, k); return; }
    if (k === "ArrowDown" || k === "ArrowRight" || k === "Down" || k === "Right") { ev.preventDefault(); if (ctrl.mover) ctrl.mover(1, k); return; }
    if (k === "Enter") { ev.preventDefault(); if (ctrl.enter) ctrl.enter(); return; }
    if (/^[1-9]$/.test(k)) { ev.preventDefault(); if (ctrl.numero) ctrl.numero(parseInt(k, 10)); return; }
    if (ctrl.teclas && ctrl.teclas[minuscula]) { ev.preventDefault(); ctrl.teclas[minuscula](); }
  }

  function teclaSolta(ev) {
    if (ctrl && ctrl.braille) ctrl.teclaSolta(ev);
  }

  /* =================== TELAS =================== */
  const TELAS = {};

  // Primeira tela: o navegador só deixa o jogo falar depois de uma tecla.
  TELAS.abertura = function () {
    const corpo = base("Álbum das Raízes: Modo Áudio");
    corpo.append(h("button", { type: "button", class: "audio-opcao atual", onclick: comecar }, A.falas.abertura));
    corpo.querySelector("button").focus();
    function comecar() { VOZ.destravar(); I().mostrar(I().dados().ano ? "mapa" : "inicio"); }
    ctrl = { enter: comecar, numero: comecar, mover: function () { falar(A.falas.abertura); }, ajuda: A.falas.abertura };
    falar(A.falas.abertura);
  };

  TELAS.inicio = function () {
    const d = I().dados();
    menu({
      titulo: "Qual é o seu ano?",
      fala: A.falas.boasVindas + " Qual é o seu ano?",
      lerOpcoes: true,
      inicial: d.ano ? d.ano - 1 : 0,
      opcoes: [1, 2, 3].map(function (a) {
        return { texto: a + "º ano", fala: a === 1 ? "primeiro ano" : a === 2 ? "segundo ano" : "terceiro ano",
          acao: function () { d.ano = a; I().salvar(); VOZ.tocar("certo"); I().mostrar("mapa"); } };
      }),
      aoVoltar: function () { falar("Você está no começo do jogo. Escolha o seu ano."); },
      ajuda: A.ajuda.inicio
    });
  };

  function totalAlbum() {
    let tem = 0, total = 0;
    [1, 2, 3, 4].forEach(function (n) { const c = I().contagem(n); tem += c.tem; total += c.total; });
    return { tem: tem, total: total };
  }

  /* ---------- Menu das estações (no lugar do mapa) ---------- */
  TELAS.mapa = function () {
    const it = I();
    if (!it.dados().ano) { it.mostrar("inicio"); return; }
    const t = totalAlbum();
    const opcoes = CONTEUDO.estacoes.map(function (e) {
      const c = it.contagem(e.id);
      const aberta = it.liberada(e.id);
      let estado;
      if (c.tem === c.total) estado = "concluída";
      else if (!aberta) estado = "fechada";
      else estado = c.tem + " de " + c.total + " figurinhas";
      return {
        texto: "Estação " + e.id + ": " + e.nome + ". " + estado,
        marcada: c.tem === c.total,
        acao: function (i) {
          indiceMenu = i;
          if (!aberta) { VOZ.tocar("tentar"); falar(A.falas.estacaoFechada); return; }
          VOZ.tocar("certo");
          it.mostrar("estacao" + e.id);
        }
      };
    });
    opcoes.push({ texto: "Meu álbum: " + t.tem + " de " + t.total + " figurinhas", acao: function (i) { indiceMenu = i; it.mostrar("album"); } });
    if (it.ano() === 3) {
      const aberto = it.desafioLiberado();
      opcoes.push({ texto: "Desafio final. " + (it.tem("guardiao") ? "vencido" : aberto ? "aberto" : "fechado"), acao: function (i) {
        indiceMenu = i;
        if (!aberto) { VOZ.tocar("tentar"); falar("O Desafio final abre quando você completar as 4 estações."); return; }
        it.mostrar("desafio");
      } });
    }
    opcoes.push({ texto: "Trocar o ano", acao: function () { indiceMenu = 0; it.mostrar("inicio"); } });
    const feitas = [1, 2, 3, 4].filter(it.completa).length;
    menu({
      titulo: "Menu das estações",
      fala: "Menu das estações. Você está no " + it.ano() + "º ano e tem " + t.tem + " de " + t.total + " figurinhas. " +
        (feitas ? "Você já concluiu " + feitas + (feitas === 1 ? " estação." : " estações.") : ""),
      lerOpcoes: true,
      inicial: indiceMenu,
      opcoes: opcoes,
      aoVoltar: function () { falar("Este é o menu das estações. Escolha uma estação com as setas e aperte Enter."); },
      ajuda: A.ajuda.mapa
    });
  };

  /* ---------- Álbum folheado com as setas ---------- */
  function falaDaFigurinha(item, numero, total) {
    const it = I();
    if (!it.tem(item.id)) {
      const n = it.estacaoDoItem(item.id);
      return "Figurinha " + numero + " de " + total + ": ainda falta. " + (n <= 4 ? "Ela é da estação " + n + "." : "Ela é do Desafio final.");
    }
    let texto = "Figurinha " + numero + " de " + total + ". Figurinha de " + item.nome + ": " + desc(item.id) + ". " + it.explica(item);
    if (it.temEstrela(item.id)) texto += " Esta figurinha tem uma estrela de braille!";
    return texto;
  }

  TELAS.album = function () {
    const it = I();
    if (!it.dados().ano) { it.mostrar("inicio"); return; }
    const itens = it.paginasDoAlbum().reduce(function (l, p) { return l.concat(p.itens); }, []);
    const tem = itens.filter(function (i) { return it.tem(i.id); }).length;
    menu({
      titulo: "Meu álbum",
      fala: "Seu álbum. Você tem " + tem + " de " + itens.length + " figurinhas. Use as setas para folhear.",
      semNumero: true,
      opcoes: itens.map(function (item, k) {
        const fala = falaDaFigurinha(item, k + 1, itens.length);
        return { texto: it.tem(item.id) ? item.nome : "Ainda falta", fala: fala, marcada: it.tem(item.id),
          acao: function () { falar(fala); } };
      }),
      aoVoltar: function () { it.mostrar("mapa"); },
      ajuda: A.ajuda.album
    });
  };

  /* ---------- Figurinha ganha ---------- */
  function ganhar(id, continuar) {
    const it = I();
    const item = it.buscarItem(id);
    const nova = !it.tem(id);
    const estacao = it.estacaoDoItem(id);
    const completavaAntes = estacao <= 4 && it.completa(estacao);
    const albumAntes = it.albumCompleto();
    if (nova) { it.prog().figurinhas.push(id); it.salvar(); }
    const t = totalAlbum();
    const faltam = t.total - t.tem;

    let texto = nova ? "Parabéns! Você ganhou a figurinha de " + item.nome + "!" : "Você já tem a figurinha de " + item.nome + ".";
    texto += " Na figurinha tem " + desc(id) + ". " + it.explica(item);
    if (A.instrumentos[id]) texto += " " + A.instrumentos[id];
    let festa = false;
    if (nova && estacao <= 4 && !completavaAntes && it.completa(estacao)) {
      festa = true;
      texto += " Você completou a estação " + estacao + ": " + CONTEUDO.estacoes[estacao - 1].nome + "!";
    }
    if (nova && !albumAntes && it.albumCompleto() && !it.prog().comemorou) {
      it.prog().comemorou = true; it.salvar();
      texto += " Parabéns! Você completou o Álbum das Raízes! Você conheceu pessoas, lugares, brincadeiras e culturas que fazem a nossa história.";
    } else if (estacao <= 4) {
      texto += faltam ? " Faltam " + faltam + (faltam === 1 ? " figurinha" : " figurinhas") + " para completar o álbum." : " Seu álbum está completo!";
    }

    const letra = letraInicial(item);
    const podeBraille = it.acess().braille && (estacao === 1 || estacao === 2) && letra;
    const opcoes = [];
    if (podeBraille) {
      opcoes.push({ texto: "Escrever em braille a letra " + letra.toUpperCase(), fala: "Escrever em braille a primeira letra de " + item.nome + ", a letra " + letra.toUpperCase(),
        acao: function () { braille(item, letra, continuar); } });
    }
    opcoes.push({ texto: "Continuar", acao: function () { if (continuar) continuar(); } });
    if (podeBraille) texto += " " + A.braille.convite.replace("{nome}", item.nome).replace("{letra}", letra.toUpperCase()) + " Opção 1: escrever em braille. Opção 2: continuar.";
    else texto += " Aperte Enter para continuar.";

    som(festa ? "festa" : "figurinha", function () {
      menu({ titulo: nova ? "Nova figurinha!" : "Figurinha", fala: texto, opcoes: opcoes,
        aoVoltar: function () { if (continuar) continuar(); }, ajuda: A.ajuda.figurinha });
    });
    // Enquanto o som toca, já mostra a tela (sem teclas ativas).
    ctrl = null;
  }

  /* =================== BRAILLE =================== */
  function letraInicial(item) {
    const l = item.nome.trim().charAt(0).toLowerCase();
    return A.braille.letras[l] ? l : null;
  }
  // "o ponto 1" ou "os pontos 1 e 4".
  function nomePontos(lista) {
    if (lista.length === 1) return "o ponto " + lista[0];
    return "os pontos " + lista.slice(0, -1).join(", ") + " e " + lista[lista.length - 1];
  }
  function letraDosPontos(lista) {
    const chave = lista.join(",");
    const letras = A.braille.letras;
    return Object.keys(letras).find(function (l) { return letras[l].join(",") === chave; }) || null;
  }

  function braille(item, letra, continuar) {
    const it = I();
    const certos = A.braille.letras[letra];
    const corpo = base("Braille: letra " + letra.toUpperCase());
    const cela = h("div", { class: "cela", "aria-hidden": "true" });
    const pontosEl = [];
    // Cela braille: pontos 1, 2, 3 à esquerda e 4, 5, 6 à direita.
    [1, 4, 2, 5, 3, 6].forEach(function (p) {
      const el = h("span", { class: "cela-ponto" }, String(p));
      pontosEl[p] = el;
      cela.append(el);
    });
    corpo.append(cela, h("p", { class: "audio-dica" }, "F = 1, D = 2, S = 3, J = 4, K = 5, L = 6"),
      h("button", { type: "button", class: "audio-opcao", onclick: function () { if (continuar) continuar(); } }, "Pular a atividade de braille (Esc)"));

    const apertadas = {};   // teclas seguradas agora
    let pontos = {};        // pontos marcados nesta letra
    let tentativas = 0;
    let terminou = false;

    function desenhar() {
      for (let p = 1; p <= 6; p++) pontosEl[p].classList.toggle("ligado", !!pontos[p]);
    }
    const inicio = "Escreva em braille a letra " + letra.toUpperCase() + ", a primeira letra de " + item.nome + ". Use as teclas F, D, S, J, K e L, como os pontos 1 a 6. Aperte as teclas juntas e depois solte.";

    function avaliar() {
      const lista = Object.keys(pontos).map(Number).sort();
      pontos = {};
      const escreveu = letraDosPontos(lista);
      const acertou = lista.join(",") === certos.join(",");
      // Em "África", aceita também o A sem acento, explicando o acento.
      const quaseA = letra === "á" && lista.join(",") === "1";
      if (acertou || quaseA) {
        terminou = true;
        it.darEstrela(item.id);
        VOZ.tocar("festa");
        const fala = (quaseA ? "Muito bem! Você escreveu a letra A, ponto 1. Em África, a letra tem acento: Á, com os pontos 1, 2, 3, 5 e 6." :
          "Muito bem! Você escreveu a letra " + letra.toUpperCase() + ": " + nomePontos(lista) + ".") +
          " Você ganhou uma estrela extra na figurinha de " + item.nome + "!";
        menu({ titulo: "Estrela de braille!", fala: fala + " Aperte Enter para continuar.",
          opcoes: [{ texto: "Continuar", acao: function () { if (continuar) continuar(); } }],
          aoVoltar: function () { if (continuar) continuar(); } });
        return;
      }
      tentativas++;
      VOZ.tocar("tentar");
      let fala = "Você escreveu " + nomePontos(lista) + (escreveu ? ", que é a letra " + escreveu.toUpperCase() + "." : ".");
      fala += " A letra " + letra.toUpperCase() + " tem " + nomePontos(certos) + ". " + erroEncorajador();
      falar(fala);
      desenhar();
    }

    ctrl = {
      braille: true,
      teclaApertada: function (ev) {
        const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
        if (terminou) return;
        if (k === "Escape" || k === "Esc") { ev.preventDefault(); if (continuar) continuar(); return; }
        if (k === " " || k === "Spacebar") { ev.preventDefault(); VOZ.repetir(); return; }
        if (k === "h") { ev.preventDefault(); falar(A.ajuda.braille); return; }
        if (k === "Enter") { ev.preventDefault(); falar(inicio); return; }
        const p = TECLAS_BRAILLE[k];
        if (!p) return;
        ev.preventDefault();
        if (ev.repeat || apertadas[k]) return;
        apertadas[k] = true;
        pontos[p] = true;
        VOZ.tocar("ponto");
        desenhar();
      },
      teclaSolta: function (ev) {
        const k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
        if (!TECLAS_BRAILLE[k] || terminou) return;
        ev.preventDefault();
        delete apertadas[k];
        // A letra é registrada quando todas as teclas são soltas.
        if (!Object.keys(apertadas).length && Object.keys(pontos).length) avaliar();
      }
    };
    falar(inicio);
  }

  /* =================== ESTAÇÕES =================== */
  function concluida(n, jogarDeNovo) {
    const e = CONTEUDO.estacoes[n - 1];
    menu({
      titulo: "Estação " + n + ": " + e.nome,
      fala: "Estação " + n + ": " + e.nome + ". Você já tem todas as figurinhas desta estação!",
      lerOpcoes: true,
      opcoes: [
        { texto: "Jogar de novo", acao: jogarDeNovo },
        { texto: "Voltar ao menu das estações", acao: function () { I().mostrar("mapa"); } }
      ],
      aoVoltar: function () { I().mostrar("mapa"); }
    });
  }

  /* ---------- Estação 1 ---------- */
  TELAS.estacao1 = function (t, extra) {
    const it = I();
    const itens = it.itensDaEstacao(1);
    let fila = itens.filter(function (i) { return !it.tem(i.id); });
    if (!fila.length) {
      if (!(extra && extra.deNovo)) { concluida(1, function () { it.mostrar("estacao1", { deNovo: true }); }); return; }
      fila = itens.slice();
    }
    fila = J.embaralhar(fila);
    const numOpcoes = it.ano() === 1 ? 2 : 3;
    const e = CONTEUDO.estacoes[0];
    let primeira = true;

    function rodada() {
      if (!fila.length) { it.mostrar("mapa"); return; }
      const certo = fila[0];
      let outros = J.embaralhar(itens.filter(function (i) { return i.id !== certo.id; }));
      if (outros.length < numOpcoes - 1) outros = J.embaralhar(CONTEUDO.pessoas.filter(function (i) { return i.id !== certo.id; }));
      const opcoes = J.embaralhar([certo].concat(outros.slice(0, numOpcoes - 1)));
      const inicio = primeira ? "Estação 1: " + e.nome + ". Ouça a pista e descubra quem é. " : "";
      primeira = false;
      perguntar({
        titulo: "Estação 1: " + e.nome,
        enunciado: inicio + "A pista é: " + it.pista(certo) + " Quem é?",
        opcoes: opcoes.map(function (op) {
          return { texto: op.nome, certa: op.id === certo.id,
            erro: "Essa é a figurinha de " + op.nome + ": " + op.curto + " Ouça a pista de novo: " + it.pista(certo) };
        }),
        falaAcerto: "É " + certo.nome + "!",
        aoAcertar: function () { ganhar(certo.id, function () { fila.shift(); rodada(); }); },
        aoVoltar: function () { it.mostrar("mapa"); },
        ajuda: A.ajuda.estacao1
      });
    }
    rodada();
  };

  /* ---------- Estação 2: Viagem pela África ---------- */
  function infoPais(p) { return A.viagem.paises[p.id] || { onde: "", portugues: false, lingua: "" }; }

  TELAS.estacao2 = function (t, extra) {
    const it = I();
    const itens = it.itensDaEstacao(2);
    if (itens.every(function (i) { return it.tem(i.id); }) && !(extra && extra.deNovo)) {
      concluida(2, function () { it.mostrar("estacao2", { deNovo: true }); });
      return;
    }
    const visitados = {};
    itens.forEach(function (p) { if (it.tem(p.id)) visitados[p.id] = true; });
    let indice = 0;

    function viagem(falaExtra) {
      const todos = itens.every(function (p) { return visitados[p.id]; });
      const opcoes = itens.map(function (p, i) {
        return { texto: p.nome + (visitados[p.id] ? ", já visitado" : ""), marcada: !!visitados[p.id],
          acao: function () { indice = i; visitar(p); } };
      });
      opcoes.push({ texto: "Perguntas da viagem" + (todos ? "" : " (visite todos os países primeiro)"), acao: function (i) {
        indice = i;
        if (!todos) { VOZ.tocar("tentar"); falar("Primeiro visite todos os países. Ainda faltam " + itens.filter(function (p) { return !visitados[p.id]; }).length + "."); return; }
        perguntas();
      } });
      opcoes.push({ texto: "Voltar ao menu das estações", acao: function () { it.mostrar("mapa"); } });
      let fala = falaExtra || "";
      if (!jaOuviuAfrica) { jaOuviuAfrica = true; fala = it.explica(CONTEUDO.africa.abertura) + " " + A.viagem.abertura; }
      menu({
        titulo: "Viagem pela África",
        fala: (fala ? fala + " " : "Viagem pela África. Escolha um país.") ,
        lerOpcoes: !falaExtra,
        inicial: indice,
        opcoes: opcoes,
        aoVoltar: function () { it.mostrar("mapa"); },
        ajuda: A.ajuda.viagem
      });
    }

    function visitar(p) {
      const info = infoPais(p);
      const nova = !it.tem(p.id);
      const fala = p.nome + " fica " + info.onde + ". " + it.explica(p) + " " + info.lingua;
      visitados[p.id] = true;
      // Na primeira visita, a figurinha vem logo depois da fala
      // (ou quando a criança sai, se interromper a fala).
      let deu = false;
      function sair(texto) {
        if (nova && !deu) { deu = true; ganhar(p.id, function () { viagem("Escolha o próximo país."); }); }
        else viagem(texto);
      }
      menu({
        titulo: p.nome,
        fala: fala,
        opcoes: [
          { texto: "Ouvir de novo", acao: function () { falar(fala, nova && !deu ? function () { sair(); } : null); } },
          { texto: nova ? "Ganhar a figurinha e continuar a viagem" : "Voltar para a viagem", acao: function () { sair("De volta à viagem."); } }
        ],
        aoVoltar: function () { sair("De volta à viagem."); },
        depoisDeFalar: nova ? function () { sair(); } : null
      });
    }

    function perguntas() {
      const num = it.ano() === 1 ? 2 : 3;
      const lista = [];
      const pt = itens.filter(function (p) { return infoPais(p).portugues; });
      const naoPt = itens.filter(function (p) { return !infoPais(p).portugues; });
      if (pt.length && naoPt.length) {
        const certo = J.sortear(pt);
        lista.push({ enunciado: A.viagem.perguntaPortugues, certo: certo, outros: J.embaralhar(naoPt).slice(0, num - 1) });
      }
      J.embaralhar(itens).slice(0, 3).forEach(function (p) {
        lista.push({ enunciado: "Ouça a pista: " + it.pista(p) + " Qual é o país?", certo: p,
          outros: J.embaralhar(itens.filter(function (x) { return x.id !== p.id; })).slice(0, num - 1) });
      });
      // Uma pergunta sobre onde o país fica, com lugares bem diferentes.
      const alvo = J.sortear(itens);
      const outrosLugar = J.embaralhar(itens.filter(function (x) {
        return x.id !== alvo.id && infoPais(x).onde.slice(0, 22) !== infoPais(alvo).onde.slice(0, 22);
      })).slice(0, num - 1);
      if (outrosLugar.length === num - 1) lista.push({ enunciado: "Qual destes países fica " + infoPais(alvo).onde + "?", certo: alvo, outros: outrosLugar });

      let k = 0;
      (function proxima() {
        if (k >= lista.length) {
          VOZ.tocar("festa");
          viagem(A.viagem.fim);
          return;
        }
        const q = lista[k];
        const opcoes = J.embaralhar([q.certo].concat(q.outros));
        perguntar({
          titulo: "Perguntas da viagem: " + (k + 1) + " de " + lista.length,
          enunciado: "Pergunta " + (k + 1) + ". " + q.enunciado,
          opcoes: opcoes.map(function (op) {
            const info = infoPais(op);
            return { texto: op.nome, certa: op.id === q.certo.id, erro: op.nome + " fica " + info.onde + ". " + info.lingua };
          }),
          falaAcerto: "É " + q.certo.nome + "!",
          aoAcertar: function () { k++; proxima(); },
          aoVoltar: function () { viagem("De volta à viagem."); }
        });
      })();
    }

    viagem();
  };

  /* ---------- Estação 3 ---------- */
  TELAS.estacao3 = function () {
    const it = I();
    const e = CONTEUDO.estacoes[2];
    const itens = it.itensDaEstacao(3);
    menu({
      titulo: "Estação 3: " + e.nome,
      fala: "Estação 3: " + e.nome + ". Escolha uma brincadeira.",
      lerOpcoes: true,
      opcoes: itens.map(function (b) {
        return { texto: b.nome + (it.tem(b.id) ? ", figurinha ganha" : ""), marcada: it.tem(b.id), acao: function () { it.mostrar(b.id); } };
      }).concat([{ texto: "Voltar ao menu das estações", acao: function () { it.mostrar("mapa"); } }]),
      aoVoltar: function () { it.mostrar("mapa"); },
      ajuda: A.ajuda.estacao3
    });
  };

  function depoisDaBrincadeira(id) {
    ganhar(id, function () {
      menu({
        titulo: I().buscarItem(id).nome,
        fala: "O que você quer fazer agora?",
        lerOpcoes: true,
        opcoes: [
          { texto: "Jogar de novo", acao: function () { I().mostrar(id); } },
          { texto: "Voltar às brincadeiras", acao: function () { I().mostrar("estacao3"); } }
        ],
        aoVoltar: function () { I().mostrar("estacao3"); }
      });
    });
  }

  /* Terra-Mar: seta para a esquerda = terra, seta para a direita = mar. */
  TELAS.terramar = function () {
    const it = I();
    const item = it.buscarItem("terramar");
    const total = CONTEUDO.terramar.rodadas[it.ano()];
    let feitas = 0, ordem = null, historico = [], esperando = true;
    const corpo = base("Terra-Mar");
    const placar = h("p", { class: "audio-dica" });
    corpo.append(placar,
      h("div", { class: "fila-botoes" },
        h("button", { type: "button", class: "audio-opcao", onclick: function () { escolher("terra"); } }, "Terra (seta para a esquerda)"),
        h("button", { type: "button", class: "audio-opcao", onclick: function () { escolher("mar"); } }, "Mar (seta para a direita)")));

    function atualizar() { placar.textContent = "Acertos: " + feitas + " de " + total; }
    function novaOrdem() {
      let nova = Math.random() < 0.5 ? "terra" : "mar";
      if (historico.length >= 2 && historico[historico.length - 1] === nova && historico[historico.length - 2] === nova) nova = nova === "terra" ? "mar" : "terra";
      historico.push(nova);
      ordem = nova;
      // A resposta vale assim que a ordem começa a ser falada.
      som(nova, function () { esperando = false; falar(nova === "terra" ? "Terra!" : "Mar!"); });
    }
    function escolher(lado) {
      if (esperando || !ordem) return;
      if (lado === ordem) {
        esperando = true;
        feitas++;
        atualizar();
        VOZ.tocar("certo");
        const fala = (lado === "terra" ? "Pulou para a terra!" : "Pulou para o mar!") + " " + J.acerto();
        if (feitas >= total) {
          falar(fala + " Você completou o Terra-Mar com " + total + " acertos!", function () { depoisDaBrincadeira("terramar"); });
        } else {
          falar(fala, novaOrdem);
        }
      } else {
        VOZ.tocar("tentar");
        falar("Quase! " + (ordem === "terra" ? "Terra é a seta para a esquerda." : "Mar é a seta para a direita.") + " Tente de novo.");
      }
    }
    ctrl = {
      mover: function (d, k) {
        if (k === "ArrowLeft" || k === "Left") escolher("terra");
        else if (k === "ArrowRight" || k === "Right") escolher("mar");
        else falar("Use a seta para a esquerda para terra, ou a seta para a direita para mar.");
      },
      enter: function () { falar("Use a seta para a esquerda para terra, ou a seta para a direita para mar."); },
      repetir: function () { falar(ordem === "terra" ? "Terra!" : "Mar!"); },
      voltar: function () { it.mostrar("estacao3"); },
      ajuda: A.ajuda.terramar,
      ocupado: function () { return esperando; }
    };
    atualizar();
    falar(item.curto + " " + A.ajuda.terramar + " São " + total + " ordens. Vamos começar!", novaOrdem);
  };

  /* Mancala falada: nível mais fácil e ritmo lento. */
  TELAS.oware = function () {
    const it = I();
    const cfg = CONTEUDO.mancala.niveis[1];
    const motor = BRINCADEIRAS.motorMancala(cfg);
    const n = cfg.casas;
    const TOTAL = n * 2 * cfg.sementes;
    let tab = [];
    for (let i = 0; i < 2 * n; i++) tab.push(cfg.sementes);
    const capt = [0, 0];
    let sel = 0, ocupado = true, acabou = false, semCaptura = 0;
    let jogando = null; // quem está jogando agora: 0 = estudante, 1 = computador
    let quadro = null, casasEl = [];
    // Ao sair da tela, a jogada em andamento para.
    aoSair = function () { seq = null; acabou = true; };

    function semente(x) { return x === 1 ? "1 semente" : x === 0 ? "vazia" : x + " sementes"; }
    function deposito(x) { return x === 1 ? "1 semente" : x + " sementes"; }
    function falaCasa(i) { return "Casa " + (i + 1) + ": " + semente(tab[i]) + "."; }
    function falaTabuleiro() {
      let s = "Suas casas: ";
      for (let i = 0; i < n; i++) s += "casa " + (i + 1) + ", " + semente(tab[i]) + (i < n - 1 ? "; " : ". ");
      s += "Casas do computador: ";
      for (let i = n; i < 2 * n; i++) s += "casa " + (i + 1) + ", " + semente(tab[i]) + (i < 2 * n - 1 ? "; " : ". ");
      s += "Seu depósito: " + deposito(capt[0]) + ". Depósito do computador: " + deposito(capt[1]) + ".";
      if (!acabou) s += jogando === 0 ? " Você está jogando agora." : jogando === 1 ? " Agora é a vez do computador." : " É a sua vez.";
      return s;
    }

    // Tabuleiro na tela, para quem acompanha olhando.
    function desenharQuadro(ativa) {
      if (!quadro) return;
      for (let i = 0; i < 2 * n; i++) {
        casasEl[i].textContent = "Casa " + (i + 1) + ": " + tab[i];
        casasEl[i].classList.toggle("ativa", i === ativa);
        casasEl[i].classList.toggle("escolhida", i === sel && !ocupado);
      }
      quadro.querySelector(".dep-voce").textContent = "Seu depósito: " + capt[0];
      quadro.querySelector(".dep-comp").textContent = "Depósito do computador: " + capt[1];
    }

    /* Sequência de falas da jogada (uma semente de cada vez).
       Se a criança apertar T, H ou espaço no meio, a sequência pausa,
       responde e depois continua de onde parou. */
    let seq = null;
    function sequencia(partes, aCada, fim, pausa) {
      seq = { partes: partes, aCada: aCada, fim: fim, pausa: pausa || 650, k: 0, parada: false, atual: "", pendente: null };
      rodarSeq();
    }
    function rodarSeq() {
      const s = seq;
      if (!s || s.parada) return;
      if (s.k >= s.partes.length) { seq = null; if (s.fim) s.fim(); return; }
      const k = s.k++;
      if (s.aCada) s.aCada(k);
      s.atual = s.partes[k];
      s.pendente = k; // esta parte ainda não foi dita até o fim
      window.setTimeout(function () {
        if (seq !== s || s.parada) return;
        falarParte(s, k);
      }, s.aCada ? 160 : 0);
    }
    function falarParte(s, k) {
      falar(s.partes[k], function () {
        s.pendente = null;
        window.setTimeout(function () { if (seq === s && !s.parada) rodarSeq(); }, s.pausa);
      });
    }
    function interromperCom(texto) {
      const s = seq;
      if (!s) { falar(texto); return; }
      s.parada = true;
      falar(texto, function () {
        window.setTimeout(function () {
          if (seq !== s) return;
          s.parada = false;
          // A parte que foi interrompida é dita de novo; depois segue.
          if (s.pendente !== null) falarParte(s, s.pendente); else rodarSeq();
        }, 400);
      });
    }

    function desenharJogo(fala) {
      const corpo = base("Mancala");
      casasEl = [];
      const cima = h("div", { class: "audio-mc-linha" });
      const baixo = h("div", { class: "audio-mc-linha" });
      for (let i = 2 * n - 1; i >= n; i--) { const el = h("span", { class: "audio-mc-casa comp" }); casasEl[i] = el; cima.append(el); }
      for (let i = 0; i < n; i++) { const el = h("span", { class: "audio-mc-casa" }); casasEl[i] = el; baixo.append(el); }
      quadro = h("div", { class: "audio-mc", "aria-hidden": "true" },
        h("p", { class: "dep-comp" }), cima, baixo, h("p", { class: "dep-voce" }));
      const botaoCasa = h("button", { type: "button", class: "audio-opcao atual", onclick: jogarEscolhida }, "");
      corpo.append(quadro, botaoCasa);
      ctrl = {
        mover: function (d) {
          if (acabou || ocupado) return;
          sel = (sel + d + n) % n;
          VOZ.tocar("mover");
          atualizarBotao();
          desenharQuadro(-1);
          falar(falaCasa(sel));
        },
        numero: function (k) {
          if (acabou || ocupado || k < 1 || k > n) return;
          sel = k - 1; atualizarBotao(); desenharQuadro(-1); falar(falaCasa(sel));
        },
        enter: jogarEscolhida,
        teclas: { t: function () { interromperCom(falaTabuleiro()); } },
        repetir: function () { if (seq) interromperCom(seq.atual); else VOZ.repetir(); },
        ajudaTecla: function () { if (seq || ocupado) interromperCom(A.ajuda.mancala); else regras(); },
        voltar: function () { seq = null; acabou = true; VOZ.parar(); it.mostrar("estacao3"); }
      };
      atualizarBotao();
      botaoCasa.focus();
      desenharQuadro(-1);
      if (fala) falar(fala);
    }
    function atualizarBotao() {
      const b = tela().querySelector(".audio-opcao");
      if (b) b.textContent = falaCasa(sel) + " Enter para jogar.";
    }

    function jogarEscolhida() {
      if (acabou) { depoisDaBrincadeira("oware"); return; }
      if (ocupado) return;
      if (tab[sel] === 0) { VOZ.tocar("tentar"); falar("A casa " + (sel + 1) + " está vazia. Escolha uma casa com sementes."); return; }
      jogar(sel, 0);
    }

    function jogar(origem, quem) {
      ocupado = true;
      jogando = quem;
      const r = motor.simular(tab, origem);
      const qtd = tab[origem];
      const partes = [(quem === 0 ? "Você pegou " : "O computador pegou ") + semente(qtd) + " da casa " + (origem + 1) + "."];
      r.caminho.forEach(function (pos, k) { partes.push((k === 0 ? "Uma semente na casa " : "Uma na casa ") + (pos + 1) + "."); });
      const capturaEm = partes.length;
      if (r.capturas.length) {
        r.capturas.forEach(function (c) { partes.push("A casa " + (c + 1) + " ficou com " + semente(r.depoisDeSemear[c]) + "."); });
        partes.push((quem === 0 ? "Você capturou " : "O computador capturou ") + semente(r.ganho) + "!");
      }
      const fimDaJogada = partes.length;
      partes.push("");  // lugar da fala dos depósitos (montada na hora)
      sequencia(partes, function (k) {
        if (k === 0) { tab[origem] = 0; desenharQuadro(origem); return; }
        if (k < capturaEm) {
          const pos = r.caminho[k - 1];
          tab[pos]++;
          VOZ.tocar("semente");
          desenharQuadro(pos);
          return;
        }
        if (r.capturas.length && k === capturaEm + r.capturas.length) VOZ.tocar("captura");
        if (k === fimDaJogada) {
          if (r.capturas.length) { capt[quem] += r.ganho; semCaptura = 0; } else semCaptura++;
          tab = r.final.slice();
          seq.partes[k] = "Seu depósito tem " + deposito(capt[0]) + ". O depósito do computador tem " + deposito(capt[1]) + ".";
          desenharQuadro(-1);
        }
      }, function () { proximaVez(quem); }, 600);
    }

    function proximaVez(quem) {
      const metade = TOTAL / 2;
      if (capt[0] > metade || capt[1] > metade) { terminar(""); return; }
      if (semCaptura >= 60) { recolher(); terminar("As sementes ficaram rodando sem ninguém capturar, então cada um ficou com as sementes do seu lado. "); return; }
      const vez = 1 - quem;
      jogando = vez === 1 ? 1 : null;
      if (!motor.jogadasValidas(tab, vez).length) {
        recolher();
        terminar((vez === 0 ? "Você não tem sementes para jogar" : "O computador não tem sementes para jogar") + ", então cada um ficou com as sementes do seu lado. ");
        return;
      }
      if (vez === 1) {
        sequencia(["Agora é a vez do computador."], null, function () {
          if (!acabou) jogar(motor.escolhaDoComputador(tab, 1), 1);
        }, 500);
      } else {
        ocupado = false;
        if (tab[sel] === 0) { const v = motor.jogadasValidas(tab, 0); if (v.length) sel = v[0]; }
        desenharQuadro(-1);
        atualizarBotao();
        falar("Sua vez! Escolha uma casa com as setas. " + falaCasa(sel));
      }
    }

    function recolher() {
      for (let i = 0; i < 2 * n; i++) { capt[motor.dono(i)] += tab[i]; tab[i] = 0; }
      desenharQuadro(-1);
    }

    function terminar(motivo) {
      acabou = true;
      ocupado = true;
      const v = capt[0], c = capt[1];
      let res;
      if (v > c) res = "Você venceu! Seu depósito tem " + deposito(v) + " e o do computador, " + deposito(c) + ".";
      else if (c > v) res = "O computador venceu desta vez: " + deposito(c) + " contra " + deposito(v) + ". Você jogou muito bem!";
      else res = "Empate! Cada um ficou com " + deposito(v) + ".";
      VOZ.tocar("festa");
      sequencia([motivo + res], null, function () { depoisDaBrincadeira("oware"); });
    }

    // Regras: cada uma pode ser repetida quantas vezes quiser.
    function regras() {
      menu({
        titulo: "Regras da mancala",
        fala: "Regras da mancala. " + A.ajuda.regras,
        lerOpcoes: false,
        opcoes: A.mancala.regras.map(function (r, i) {
          return { texto: "Regra " + (i + 1) + ": " + r, acao: function () { falar("Regra " + (i + 1) + ": " + r); } };
        }),
        aoVoltar: function () { desenharJogo("De volta ao jogo. " + falaCasa(sel)); }
      });
    }

    const abertura = A.mancala.abertura.replace(/\{n\}/g, n).replace("{n1}", n + 1).replace("{n2}", 2 * n).replace("{s}", cfg.sementes);
    desenharJogo();
    sequencia([abertura, A.ajuda.mancala, "Você começa. " + falaCasa(sel)], null, function () { ocupado = false; desenharQuadro(-1); }, 300);
  };

  /* Shisima (2º e 3º ano): conhecer o jogo e responder uma pergunta. */
  TELAS.shisima = function () {
    const it = I();
    const item = it.buscarItem("shisima");
    const explicacao = it.explica(item);
    perguntar({
      titulo: "Shisima",
      enunciado: explicacao + " Agora, uma pergunta: para ganhar no shisima, o que é preciso formar?",
      opcoes: J.embaralhar([
        { texto: "Uma linha reta de 3 peças passando pelo meio", certa: true },
        { texto: "Um círculo com todas as peças", erro: "No shisima não é um círculo." },
        { texto: "Uma pilha de peças", erro: "No shisima as peças não ficam empilhadas." }
      ]),
      aoAcertar: function () { depoisDaBrincadeira("shisima"); },
      aoVoltar: function () { it.mostrar("estacao3"); }
    });
  };

  /* ---------- Estação 4 ---------- */
  const INSTRUMENTOS = ["berimbau", "atabaque", "agogo", "ganza", "kalimba"];
  function ehInstrumento(item) { return INSTRUMENTOS.indexOf(item.id) >= 0; }

  TELAS.estacao4 = function (t, extra) {
    const it = I();
    const e = CONTEUDO.estacoes[3];
    const itens = it.itensDaEstacao(4);
    const faltam = itens.filter(function (i) { return !it.tem(i.id); }).length;
    menu({
      titulo: "Estação 4: " + e.nome,
      fala: "Estação 4: " + e.nome + ". Aqui tem palavras de origem africana, instrumentos, comidas, a capoeira e o samba. " +
        (faltam ? "Primeiro, ouça os instrumentos. Depois, responda às perguntas." : "Você já tem todas as figurinhas desta estação!"),
      lerOpcoes: true,
      inicial: extra && extra.inicial || 0,
      opcoes: [
        { texto: "Ouvir os instrumentos", acao: salaDosInstrumentos },
        { texto: faltam ? "Perguntas: faltam " + faltam + " figurinhas" : "Perguntas: jogar de novo", acao: function () { perguntas(!faltam); } },
        { texto: "Voltar ao menu das estações", acao: function () { it.mostrar("mapa"); } }
      ],
      aoVoltar: function () { it.mostrar("mapa"); },
      ajuda: A.ajuda.estacao4
    });

    function salaDosInstrumentos() {
      let tocando = false;
      menu({
        titulo: "Os instrumentos",
        fala: "Os instrumentos. Escolha um instrumento com as setas e aperte Enter para ouvir.",
        lerOpcoes: true,
        opcoes: INSTRUMENTOS.map(function (id) {
          const item = it.buscarItem(id);
          return { texto: item.nome, acao: function () {
            if (tocando) return;
            tocando = true;
            falar("Ouça o som do " + item.nome + ".", function () {
              som(id, function () { tocando = false; falar(A.instrumentos[id]); });
            });
          } };
        }).concat([{ texto: "Voltar", acao: function () { it.mostrar("estacao4", { inicial: 1 }); } }]),
        aoVoltar: function () { it.mostrar("estacao4", { inicial: 1 }); },
        ajuda: A.ajuda.instrumentos
      });
      // Enquanto o som toca, as teclas esperam (Esc continua valendo).
      ctrl.ocupado = function () { return tocando; };
    }

    function perguntas(deNovo) {
      let fila = itens.filter(function (i) { return deNovo || !it.tem(i.id); });
      fila = J.embaralhar(fila);
      const num = it.ano() === 1 ? 2 : 3;
      (function proxima() {
        if (!fila.length) { it.mostrar("estacao4"); return; }
        const item = fila[0];
        const continuar = function () { fila.shift(); proxima(); };
        if (ehInstrumento(item)) {
          // Ouve o som e escolhe o nome do instrumento.
          const outros = J.embaralhar(INSTRUMENTOS.filter(function (id) { return id !== item.id; })).slice(0, num - 1).map(it.buscarItem);
          const opcoes = J.embaralhar([item].concat(outros));
          const enunciado = "Qual instrumento é este?";
          const m = perguntar({
            titulo: "Qual instrumento é este?",
            enunciado: enunciado,
            silencioso: true, // primeiro toca o som, depois a pergunta
            opcoes: opcoes.map(function (op) {
              return { texto: op.nome, certa: op.id === item.id, erro: "Não é o " + op.nome + ". Aperte a barra de espaço para ouvir o som de novo." };
            }),
            falaAcerto: "É o " + item.nome + "!",
            aoAcertar: function () { ganhar(item.id, continuar); },
            aoVoltar: function () { it.mostrar("estacao4"); },
            repetir: function () { VOZ.parar(); som(item.id, function () { falar(enunciado + " " + opcoes.map(function (op, i) { return "Opção " + (i + 1) + ": " + op.nome + "."; }).join(" ")); }); }
          });
          // Toca o som antes de ler as opções.
          VOZ.parar();
          falar("Ouça este som.", function () { ctrl.repetir(); });
          return m;
        }
        // Palavras, comidas, capoeira e samba: escolher a imagem que combina.
        const parecidos = itens.filter(function (x) { return !ehInstrumento(x) && x.id !== item.id; });
        const outros = J.embaralhar(parecidos).slice(0, num - 1);
        const opcoes = J.embaralhar([item].concat(outros));
        const comPalavra = item.grupo === "palavra" ? "com a palavra " : "com ";
        perguntar({
          titulo: item.nome,
          enunciado: "Ouça: " + item.nome + ". Qual imagem combina " + comPalavra + item.nome + "?",
          opcoes: opcoes.map(function (op) {
            return { texto: desc(op.id), certa: op.id === item.id, erro: "Essa imagem combina com " + op.nome + "." };
          }),
          falaAcerto: "A imagem de " + item.nome + " tem " + desc(item.id) + ".",
          aoAcertar: function () { ganhar(item.id, continuar); },
          aoVoltar: function () { it.mostrar("estacao4"); }
        });
      })();
    }
  };

  /* ---------- Desafio final (3º ano) ---------- */
  TELAS.desafio = function () {
    const it = I();
    if (!it.desafioLiberado()) { it.mostrar("mapa"); return; }
    const perguntas = [];
    function pegar(lista, n, fazer) {
      J.embaralhar(lista).slice(0, n).forEach(function (i) { perguntas.push({ certo: i, lista: lista, texto: fazer(i) }); });
    }
    pegar(it.doAno(CONTEUDO.pessoas), 2, function (i) { return i.pista[3]; });
    pegar(it.doAno(CONTEUDO.paises), 2, function (i) { return i.pista[3]; });
    pegar(it.doAno(CONTEUDO.brincadeiras), 1, function (i) { return it.mascarar(i.curto, i.nome.split(" ")[0]); });
    pegar(it.doAno(CONTEUDO.cultura), CONTEUDO.desafio.perguntas - 5, function (i) { return it.mascarar(i.curto, i.nome); });
    const fila = J.embaralhar(perguntas);
    let k = 0;
    (function proxima() {
      if (k >= fila.length) { ganhar("guardiao", function () { it.mostrar("album"); }); return; }
      const q = fila[k];
      const opcoes = J.embaralhar([q.certo].concat(J.embaralhar(q.lista.filter(function (i) { return i.id !== q.certo.id; })).slice(0, 2)));
      perguntar({
        titulo: "Desafio final: pergunta " + (k + 1) + " de " + fila.length,
        enunciado: "Pergunta " + (k + 1) + " de " + fila.length + ". " + q.texto.replace(/___/g, "a palavra secreta") + " Qual é a figurinha certa?",
        opcoes: opcoes.map(function (op) { return { texto: op.nome, certa: op.id === q.certo.id, erro: op.nome + ": " + it.explica(op) }; }),
        falaAcerto: it.explica(q.certo),
        aoAcertar: function () { k++; proxima(); },
        aoVoltar: function () { it.mostrar("mapa"); }
      });
    })();
  };

  /* Ajuda falada (tecla H ou botão "Como jogar"). */
  function ajuda() {
    if (ctrl && ctrl.ajudaTecla) { ctrl.ajudaTecla(); return; }
    falar(((ctrl && ctrl.ajuda) ? ctrl.ajuda + " " : "") + A.falas.teclas);
  }

  return {
    telas: TELAS,
    ganhar: ganhar,
    tecla: tecla,
    teclaSolta: teclaSolta,
    ajuda: ajuda,
    // Chamada a cada troca de tela: para falas, sons pendentes e jogadas.
    limpar: function () {
      geracao++;
      if (aoSair) { const f = aoSair; aoSair = null; f(); }
      ctrl = null;
      VOZ.parar();
    }
  };
})();
