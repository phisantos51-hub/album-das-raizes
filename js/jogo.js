/*
  ÁLBUM DAS RAÍZES — FUNCIONAMENTO DO JOGO
  ========================================
  Este arquivo controla as telas, o progresso salvo, as figurinhas,
  a pausa, o som, o "Como jogar" e a Área do professor.
  Os TEXTOS ficam em js/conteudo.js. Os DESENHOS ficam em js/desenhos.js.
  As brincadeiras da Estação 3 (Terra-Mar, mancala e shisima) ficam em
  js/brincadeiras.js.

  O progresso é guardado só neste computador, no próprio navegador
  (localStorage). Nada é enviado para a internet.
*/

const J = (function () {
  "use strict";

  /* =================== PROGRESSO SALVO =================== */

  const CHAVE = "albumDasRaizes.v1";

  function progressoVazio() {
    return { ano: null, som: false, acess: acessPadrao(), anos: { 1: anoVazio(), 2: anoVazio(), 3: anoVazio() } };
  }
  function anoVazio() {
    return { figurinhas: [], estrelas: [], liberadas: false, quebraCabeca: false, comemorou: false };
  }
  // Escolhas de acessibilidade (ficam salvas neste computador).
  function acessPadrao() {
    return {
      modoAudio: false,     // o jogo fala e funciona só pelo teclado
      vozPropria: true,     // voz do próprio jogo (desligar com NVDA ou Narrador)
      vozLenta: false,      // voz mais devagar
      letrasGrandes: false, // letras e botões maiores
      altoContraste: false, // cores de alto contraste
      braille: false        // atividade de braille no Modo Áudio (Área do professor)
    };
  }

  function carregar() {
    try {
      const texto = window.localStorage.getItem(CHAVE);
      if (!texto) return progressoVazio();
      const d = JSON.parse(texto);
      const base = progressoVazio();
      base.ano = [1, 2, 3].indexOf(d.ano) >= 0 ? d.ano : null;
      base.som = d.som === true;
      if (d.acess) Object.keys(base.acess).forEach(function (k) { if (typeof d.acess[k] === "boolean") base.acess[k] = d.acess[k]; });
      [1, 2, 3].forEach(function (a) {
        const x = d.anos && d.anos[a];
        if (x) {
          base.anos[a].figurinhas = Array.isArray(x.figurinhas) ? x.figurinhas.filter(function (f) { return typeof f === "string"; }) : [];
          base.anos[a].estrelas = Array.isArray(x.estrelas) ? x.estrelas.filter(function (f) { return typeof f === "string"; }) : [];
          base.anos[a].liberadas = x.liberadas === true;
          base.anos[a].quebraCabeca = x.quebraCabeca === true;
          base.anos[a].comemorou = x.comemorou === true;
        }
      });
      return base;
    } catch (e) {
      return progressoVazio();
    }
  }

  function salvar() {
    try { window.localStorage.setItem(CHAVE, JSON.stringify(dados)); } catch (e) { /* sem armazenamento: o jogo continua */ }
  }

  let dados = carregar();

  function ano() { return dados.ano || 1; }
  function prog() { return dados.anos[ano()]; }
  function tem(id) { return prog().figurinhas.indexOf(id) >= 0; }
  function temEstrela(id) { return prog().estrelas.indexOf(id) >= 0; }
  function darEstrela(id) { if (!temEstrela(id)) { prog().estrelas.push(id); salvar(); } }
  function acess() { return dados.acess; }
  function modoAudio() { return dados.acess.modoAudio; }
  function descricao(id) { return (CONTEUDO.acessibilidade.descricoes[id]) || ""; }

  // Aplica letras grandes, alto contraste e a voz escolhida.
  function aplicarAcessibilidade() {
    const raiz = document.documentElement;
    raiz.classList.toggle("letras-grandes", dados.acess.letrasGrandes);
    raiz.classList.toggle("alto-contraste", dados.acess.altoContraste);
    document.body.classList.toggle("modo-audio", dados.acess.modoAudio);
    VOZ.configurar({ ligada: dados.acess.vozPropria, lenta: dados.acess.vozLenta });
  }

  /* =================== CONTEÚDO POR ANO =================== */

  function doAno(lista) {
    return lista.filter(function (item) { return item.anos.indexOf(ano()) >= 0; });
  }

  function itensDaEstacao(n) {
    if (n === 1) return doAno(CONTEUDO.pessoas);
    if (n === 2) return doAno(CONTEUDO.paises);
    if (n === 3) return doAno(CONTEUDO.brincadeiras);
    if (n === 4) return doAno(CONTEUDO.cultura);
    return [];
  }

  function estacaoDoItem(id) {
    for (let n = 1; n <= 4; n++) {
      const lista = [CONTEUDO.pessoas, CONTEUDO.paises, CONTEUDO.brincadeiras, CONTEUDO.cultura][n - 1];
      if (lista.some(function (i) { return i.id === id; })) return n;
    }
    return 5;
  }

  function buscarItem(id) {
    const todas = CONTEUDO.pessoas.concat(CONTEUDO.paises, CONTEUDO.brincadeiras, CONTEUDO.cultura, [CONTEUDO.desafio.medalha]);
    return todas.find(function (i) { return i.id === id; });
  }

  function contagem(n) {
    const itens = itensDaEstacao(n);
    return { tem: itens.filter(function (i) { return tem(i.id); }).length, total: itens.length };
  }
  function completa(n) { const c = contagem(n); return c.tem === c.total; }
  function liberada(n) { return n === 1 || prog().liberadas || completa(n - 1); }
  function albumCompleto() { return [1, 2, 3, 4].every(completa); }
  function desafioLiberado() { return ano() === 3 && (albumCompleto() || prog().liberadas); }

  // Explicação certa para o ano: 1º ano usa o texto curto.
  function explica(item) { return ano() === 1 ? item.curto : item.texto; }
  function pista(item) { return item.pista[ano()]; }

  /* =================== AJUDANTES =================== */

  // Cria um elemento: h("button", {class: "x", onclick: f}, "texto", outroElemento)
  function h(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        const v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (let i = 2; i < arguments.length; i++) {
      const c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) el.append(x); });
      else el.append(c);
    }
    return el;
  }

  function icone(nome) { return h("span", { class: "icone", html: DESENHOS.icone(nome) }); }

  function embaralhar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sortear(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

  function anunciar(texto) {
    const a = document.getElementById("anuncio");
    a.textContent = "";
    window.setTimeout(function () { a.textContent = texto; }, 50);
  }

  /* ---------- Tempo que respeita a pausa ----------
     Tudo que acontece "depois de um tempinho" (sementes andando,
     computador jogando) espera enquanto o jogo está pausado. */
  let pausado = false;
  let filaPausa = [];
  let geracao = 0; // muda a cada troca de tela, para cancelar o que ficou pendente

  function depois(ms, fn) {
    const minha = geracao;
    window.setTimeout(function () {
      if (minha !== geracao) return;
      if (pausado) filaPausa.push(function () { if (minha === geracao) fn(); });
      else fn();
    }, ms);
  }

  /* =================== SOM (desligado no início) =================== */

  let audio = null;
  function tocar(tipo) {
    if (!dados.som) return;
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      const notas = { certo: [523, 659, 784], errado: [330, 262], figurinha: [523, 659, 784, 1047], clique: [440], festa: [523, 659, 784, 1047, 784, 1047] }[tipo] || [440];
      notas.forEach(function (f, i) {
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        const t = audio.currentTime + i * 0.12;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
        o.connect(g); g.connect(audio.destination);
        o.start(t); o.stop(t + 0.22);
      });
    } catch (e) { /* sem som neste computador */ }
  }

  function atualizarBotaoSom() {
    const b = document.getElementById("botao-som");
    b.setAttribute("aria-pressed", dados.som ? "true" : "false");
    b.classList.toggle("ligado", dados.som);
    b.innerHTML = "";
    b.append(icone(dados.som ? "somLigado" : "somDesligado"), h("span", null, dados.som ? "Som: ligado" : "Som: desligado"));
  }

  /* =================== JANELAS (avisos por cima da tela) =================== */

  const pilha = [];

  function abrirJanela(conteudo, opcoes) {
    opcoes = opcoes || {};
    const caixa = h("div", { class: "janela " + (opcoes.classe || ""), role: "dialog", "aria-modal": "true", "aria-labelledby": "titulo-janela-" + pilha.length });
    const fundo = h("div", { class: "fundo-janela" }, caixa);
    caixa.append(conteudo);
    const titulo = caixa.querySelector("h2");
    if (titulo) titulo.id = "titulo-janela-" + pilha.length;
    document.body.append(fundo);
    pilha.push({ fundo: fundo, aoFechar: opcoes.aoFechar, focoAntes: document.activeElement });
    const foco = caixa.querySelector("[data-foco]") || caixa.querySelector("button");
    if (foco) foco.focus();
    return fundo;
  }

  function fecharJanela() {
    const j = pilha.pop();
    if (!j) return;
    j.fundo.remove();
    if (j.focoAntes && document.body.contains(j.focoAntes)) j.focoAntes.focus();
    if (j.aoFechar) j.aoFechar();
  }

  function fecharTodas() {
    while (pilha.length) { const j = pilha.pop(); j.fundo.remove(); }
  }

  function botao(texto, nomeIcone, acao, classe) {
    return h("button", { type: "button", class: "botao " + (classe || ""), onclick: acao },
      nomeIcone ? icone(nomeIcone) : null, h("span", null, texto));
  }

  /* =================== FIGURINHAS =================== */

  function rotuloDoItem(item) {
    if (item.area) return item.area;
    if (item.grupo) return CONTEUDO.grupos[item.grupo];
    const n = estacaoDoItem(item.id);
    if (n === 2) return "País da África";
    if (n === 3) return "Brincadeira e jogo";
    return "Medalha";
  }

  // Desenha uma figurinha (moldura colorida + desenho + nome).
  function figurinha(item, opcoes) {
    opcoes = opcoes || {};
    const est = estacaoDoItem(item.id);
    const cor = est <= 4 ? CONTEUDO.estacoes[est - 1].cor : "#e9c46a";
    // A ilustração tem texto alternativo (descrição) para leitores de tela.
    const rotuloArte = descricao(item.id) ? "Ilustração: " + descricao(item.id) : (opcoes.semNome ? item.nome : "");
    return h("span", { class: "figurinha" + (opcoes.grande ? " grande" : "") + (opcoes.semNome ? " sem-nome" : ""), style: "--cor-estacao:" + cor + ";--cor-fundo:" + item.cor },
      h("span", { class: "figurinha-arte", html: DESENHOS.svg(item.desenho, rotuloArte) }),
      opcoes.semNome ? null : h("span", { class: "figurinha-nome" }, item.nome),
      opcoes.comRotulo ? h("span", { class: "figurinha-rotulo" }, rotuloDoItem(item)) : null,
      temEstrela(item.id) ? h("span", { class: "estrela-braille" }, icone("estrelaIcone"), h("span", null, "Braille")) : null);
  }

  /* Dá uma figurinha à criança e mostra a janela "Nova figurinha!".
     Depois de fechar a janela, chama "continuar". */
  function ganhar(id, continuar) {
    if (modoAudio()) { MODO_AUDIO.ganhar(id, continuar); return; }
    const item = buscarItem(id);
    const nova = !tem(id);
    const estacao = estacaoDoItem(id);
    const completavaAntes = estacao <= 4 && completa(estacao);
    const albumAntes = albumCompleto();
    if (nova) { prog().figurinhas.push(id); salvar(); }
    tocar("figurinha");

    const conteudo = h("div", { class: "nova-figurinha" },
      h("h2", null, nova ? "Nova figurinha!" : "Você já tem esta figurinha!"),
      h("div", { class: "brilho" }, figurinha(item, { grande: true, comRotulo: true })),
      h("p", { class: "explicacao" }, explica(item)),
      botao("Continuar", "setaDir", function () { fecharJanela(); }, "botao-principal"));
    anunciar((nova ? "Nova figurinha: " : "") + item.nome + ". " + explica(item));

    abrirJanela(conteudo, {
      classe: "janela-figurinha",
      aoFechar: function () {
        if (nova && estacao <= 4 && !completavaAntes && completa(estacao)) {
          if (!albumAntes && albumCompleto() && !prog().comemorou) {
            prog().comemorou = true; salvar();
            comemorar(continuar);
          } else {
            avisoEstacaoCompleta(estacao, continuar);
          }
        } else if (continuar) {
          continuar();
        }
      }
    });
  }

  function avisoEstacaoCompleta(n, continuar) {
    const prox = n < 4 ? CONTEUDO.estacoes[n] : null;
    tocar("festa");
    abrirJanela(h("div", { class: "aviso-estacao" },
      icone("trofeu"),
      h("h2", null, "Estação completa!"),
      h("p", null, "Você ganhou todas as figurinhas da estação “" + CONTEUDO.estacoes[n - 1].nome + "”."),
      prox ? h("p", null, "A estação “" + prox.nome + "” está aberta no mapa!") : null,
      botao("Continuar", "setaDir", function () { fecharJanela(); }, "botao-principal")),
      { aoFechar: continuar });
  }

  /* ---------- Comemoração do álbum completo (confete) ---------- */
  function comemorar(continuar) {
    tocar("festa");
    const tela = h("canvas", { class: "confete", "aria-hidden": "true" });
    const conteudo = h("div", { class: "comemoracao" },
      h("div", { class: "comemoracao-trofeu", html: DESENHOS.svg("trofeu") }),
      h("h2", null, "Parabéns! Você completou o Álbum das Raízes!"),
      h("p", null, "Você conheceu pessoas, lugares, brincadeiras e culturas que fazem a nossa história."),
      ano() === 3 ? h("p", null, "O Desafio final está aberto no mapa!") : null,
      h("div", { class: "fila-botoes" },
        botao("Folhear o meu álbum", "album", function () { fecharJanela(); mostrar("album"); }, "botao-principal"),
        botao("Voltar ao mapa", "casa", function () { fecharJanela(); mostrar("mapa"); })));
    const janela = abrirJanela(conteudo, { classe: "janela-festa", aoFechar: function () { pararConfete = true; } });
    janela.prepend(tela);
    confete(tela);
  }

  let pararConfete = false;
  function confete(canvas) {
    pararConfete = false;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;
    const reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cores = ["#e63946", "#ffd166", "#06d6a0", "#118ab2", "#9d4edd", "#f4a261"];
    function ajustar() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    ajustar();
    const pedacos = [];
    const total = reduzir ? 40 : 160;
    for (let i = 0; i < total; i++) {
      pedacos.push({ x: Math.random() * canvas.width, y: -Math.random() * canvas.height, v: 1.5 + Math.random() * 3, g: Math.random() * 6, l: 8 + Math.random() * 8, c: sortear(cores) });
    }
    let quadros = 0;
    function passo() {
      if (pararConfete || !document.body.contains(canvas)) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pedacos.forEach(function (p) {
        if (!pausado) { p.y += reduzir ? p.v * 0.5 : p.v; p.g += 0.05; }
        if (p.y > canvas.height) p.y = -20;
        ctx.save();
        ctx.translate(p.x + Math.sin(p.g) * 10, p.y);
        ctx.rotate(p.g);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.l / 2, -p.l / 4, p.l, p.l / 2);
        ctx.restore();
      });
      quadros++;
      if (quadros < 900) window.requestAnimationFrame(passo);
    }
    window.requestAnimationFrame(passo);
  }

  /* =================== CAIXA DE MENSAGEM DAS ATIVIDADES =================== */

  // Uma caixa colorida que mostra acertos (verde) e explicações (laranja).
  function caixaMensagem() {
    const el = h("div", { class: "mensagem", role: "status" });
    el.mostrar = function (tipo, texto) {
      el.className = "mensagem " + tipo;
      el.innerHTML = "";
      el.append(icone(tipo === "certo" ? "certo" : tipo === "tentar" ? "tentar" : "lupa"), h("span", null, texto));
      if (tipo === "certo") tocar("certo"); else if (tipo === "tentar") tocar("errado");
      anunciar(texto);
    };
    el.limpar = function () { el.className = "mensagem"; el.innerHTML = ""; };
    return el;
  }

  function acerto() { return sortear(CONTEUDO.acertos); }

  /* =================== TELAS =================== */

  const telaEl = document.getElementById("tela");
  let telaAtual = "inicio";
  let ajudaAtual = "inicio";

  function definirAjuda(chave) { ajudaAtual = chave; }

  function mostrar(nome, extra) {
    geracao++;
    filaPausa = [];
    fecharTodas();
    telaAtual = nome;
    ajudaAtual = nome;
    document.body.classList.toggle("ano-1", dados.ano === 1 && !modoAudio());
    document.body.dataset.tela = nome;
    telaEl.innerHTML = "";
    window.scrollTo(0, 0);
    MODO_AUDIO.limpar();
    // No Modo Áudio, cada tela tem uma versão falada (js/modo-audio.js).
    if (modoAudio() && MODO_AUDIO.telas[nome]) {
      MODO_AUDIO.telas[nome](telaEl, extra);
      return;
    }
    const f = TELAS[nome];
    f(telaEl, extra);
    telaEl.focus({ preventScroll: true });
  }

  function titulo(texto, cor) {
    return h("h1", { class: "titulo-tela", style: cor ? "--cor:" + cor : null }, texto);
  }

  function barraProgresso(c) {
    const pct = c.total ? Math.round(c.tem / c.total * 100) : 0;
    return h("span", { class: "progresso" },
      h("span", { class: "progresso-barra", "aria-hidden": "true" }, h("span", { style: "width:" + pct + "%" })),
      h("span", { class: "progresso-texto" }, c.tem + " de " + c.total + " figurinhas"));
  }

  const TELAS = {};

  /* ---------- Tela de abertura: escolher o ano ---------- */
  TELAS.inicio = function (tela) {
    const anos = [1, 2, 3].map(function (a) {
      const total = [1, 2, 3, 4].reduce(function (s, n) {
        const lista = [CONTEUDO.pessoas, CONTEUDO.paises, CONTEUDO.brincadeiras, CONTEUDO.cultura][n - 1];
        return s + lista.filter(function (i) { return i.anos.indexOf(a) >= 0; }).length;
      }, 0);
      const temA = dados.anos[a].figurinhas.filter(function (id) { return estacaoDoItem(id) <= 4; }).length;
      return h("button", { type: "button", class: "botao-ano ano-" + a, onclick: function () {
        dados.ano = a; salvar(); tocar("clique"); mostrar("mapa");
      } },
        h("span", { class: "botao-ano-numero" }, a + "º"),
        h("span", { class: "botao-ano-nome" }, "ano"),
        h("span", { class: "botao-ano-conta" }, icone("album"), h("span", null, Math.min(temA, total) + " de " + total)));
    });
    tela.append(h("div", { class: "inicio" },
      h("button", { type: "button", class: "botao botao-acessibilidade", id: "botao-acessibilidade", onclick: painelAcessibilidade },
        icone("acessibilidade"), h("span", null, "Acessibilidade"),
        h("span", { class: "so-leitor" }, ": Modo Áudio para jogar só com o teclado e ouvindo, letras maiores e alto contraste")),
      h("div", { class: "inicio-criancas", html: DESENHOS.criancas() }),
      h("h1", { class: "inicio-titulo" }, "Álbum das Raízes"),
      h("p", { class: "inicio-frase" }, "Conheça pessoas, lugares e culturas que fazem nossa história!"),
      h("h2", { class: "inicio-pergunta" }, "Qual é o seu ano?"),
      h("div", { class: "anos" }, anos)));
  };

  /* ---------- Mapa com as quatro estações ---------- */
  TELAS.mapa = function (tela) {
    if (!dados.ano) { mostrar("inicio"); return; }
    const estacoes = CONTEUDO.estacoes.map(function (e) {
      const aberta = liberada(e.id);
      const c = contagem(e.id);
      const feita = c.tem === c.total;
      return h("button", { type: "button", class: "estacao" + (aberta ? "" : " fechada") + (feita ? " feita" : ""), style: "--cor:" + e.cor,
        onclick: function () {
          if (!aberta) {
            caixa.mostrar("tentar", "Esta estação ainda está fechada. Complete a estação " + (e.id - 1) + " para abrir!");
            return;
          }
          tocar("clique");
          mostrar("estacao" + e.id);
        } },
        h("span", { class: "estacao-numero" }, "Estação " + e.id),
        h("span", { class: "estacao-desenho", html: DESENHOS.svg(e.desenho) }),
        h("span", { class: "estacao-nome" }, e.nome),
        aberta ? barraProgresso(c) : h("span", { class: "estacao-cadeado" }, icone("cadeado"), h("span", null, "Fechada")),
        feita ? h("span", { class: "selo-feita" }, icone("certo"), h("span", null, "Completa")) : null);
    });

    const caixa = caixaMensagem();
    const total = [1, 2, 3, 4].reduce(function (s, n) { return s + contagem(n).total; }, 0);
    const temT = [1, 2, 3, 4].reduce(function (s, n) { return s + contagem(n).tem; }, 0);

    const extras = [
      h("button", { type: "button", class: "botao botao-album-grande", onclick: function () { mostrar("album"); } },
        icone("album"), h("span", null, "Meu álbum: " + temT + " de " + total))
    ];
    if (ano() === 3) {
      const aberto = desafioLiberado();
      extras.push(h("button", { type: "button", class: "botao botao-desafio" + (aberto ? "" : " fechada"), onclick: function () {
        if (!aberto) { caixa.mostrar("tentar", "O Desafio final abre quando você completar as 4 estações."); return; }
        mostrar("desafio");
      } }, icone(aberto ? "trofeu" : "cadeado"), h("span", null, tem("guardiao") ? "Desafio final (vencido!)" : "Desafio final")));
    }
    if (albumCompleto()) {
      extras.push(h("button", { type: "button", class: "botao", onclick: function () { comemorar(); } }, icone("estrelaIcone"), h("span", null, "Ver a comemoração")));
    }

    tela.append(h("div", { class: "mapa" },
      h("div", { class: "mapa-topo" },
        titulo("Mapa das Raízes"),
        h("span", { class: "etiqueta-ano" }, ano() + "º ano"),
        h("button", { type: "button", class: "botao botao-pequeno", onclick: function () { mostrar("inicio"); } }, icone("tentar"), h("span", null, "Trocar o ano"))),
      h("div", { class: "trilha" },
        h("div", { class: "trilha-caminho", "aria-hidden": "true", html: caminhoDoMapa() }),
        h("div", { class: "estacoes" }, estacoes)),
      caixa,
      h("div", { class: "fila-botoes centro" }, extras)));
  };

  function caminhoDoMapa() {
    return '<svg viewBox="0 0 1000 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M0 230 Q120 120 250 180 T500 150 T750 170 T1000 110 L1000 300 L0 300 Z" fill="#b7e4a0"/>' +
      '<path d="M0 260 Q150 190 300 240 T650 220 T1000 200 L1000 300 L0 300 Z" fill="#95d5b2"/>' +
      '<path d="M40 200 C200 60 300 260 480 150 S760 60 960 160" stroke="#f6d186" stroke-width="44" fill="none" stroke-linecap="round"/>' +
      '<path d="M40 200 C200 60 300 260 480 150 S760 60 960 160" stroke="#fff" stroke-width="5" stroke-dasharray="18 16" fill="none"/>' +
      '</svg>';
  }

  /* ---------- Estação concluída (quando volta a uma estação completa) ---------- */
  function telaConcluida(tela, n, jogarDeNovo) {
    const e = CONTEUDO.estacoes[n - 1];
    tela.append(h("div", { class: "concluida" },
      titulo("Estação " + n + ": " + e.nome, e.cor),
      h("p", { class: "frase-grande" }, icone("certo"), h("span", null, "Você já tem todas as figurinhas desta estação!")),
      h("div", { class: "fila-figurinhas" }, itensDaEstacao(n).map(function (i) {
        return h("button", { type: "button", class: "botao-figurinha", onclick: function () { verFigurinha(i.id, itensDaEstacao(n).map(function (x) { return x.id; })); } }, figurinha(i));
      })),
      h("div", { class: "fila-botoes centro" },
        botao("Jogar de novo", "tentar", jogarDeNovo, "botao-principal"),
        botao("Voltar ao mapa", "casa", function () { mostrar("mapa"); }))));
  }

  /* ---------- ESTAÇÃO 1: Gente que faz história ---------- */
  TELAS.estacao1 = function (tela, extra) {
    const itens = itensDaEstacao(1);
    let fila = itens.filter(function (i) { return !tem(i.id); });
    if (!fila.length) {
      if (!(extra && extra.deNovo)) { telaConcluida(tela, 1, function () { mostrar("estacao1", { deNovo: true }); }); return; }
      fila = itens.slice();
    }
    fila = embaralhar(fila);
    const numOpcoes = ano() === 1 ? 2 : 3;
    const e = CONTEUDO.estacoes[0];

    const area = h("div", { class: "rodada" });
    const caixa = caixaMensagem();
    tela.append(h("div", { class: "estacao-tela" },
      titulo("Estação 1: " + e.nome, e.cor),
      area, caixa));

    function rodada() {
      area.innerHTML = ""; window.scrollTo(0, 0);
      caixa.limpar();
      if (!fila.length) { mostrar("estacao1"); return; }
      const certo = fila[0];
      let outros = embaralhar(itens.filter(function (i) { return i.id !== certo.id; }));
      if (outros.length < numOpcoes - 1) outros = embaralhar(CONTEUDO.pessoas.filter(function (i) { return i.id !== certo.id; }));
      const opcoes = embaralhar([certo].concat(outros.slice(0, numOpcoes - 1)));
      const c = contagem(1);

      area.append(
        h("div", { class: "contador" }, barraProgresso(c)),
        h("div", { class: "pista" }, icone("lupa"), h("p", null, pista(certo))),
        h("p", { class: "pedido" }, "Quem é? Clique na figurinha certa."),
        h("div", { class: "opcoes opcoes-" + opcoes.length }, opcoes.map(function (op) {
          const b = h("button", { type: "button", class: "opcao", onclick: function () {
            if (b.disabled) return;
            if (op.id === certo.id) {
              b.classList.add("certa");
              area.querySelectorAll(".opcao").forEach(function (x) { x.disabled = true; });
              caixa.mostrar("certo", acerto() + " É " + certo.nome + "!");
              depois(900, function () { ganhar(certo.id, function () { fila.shift(); rodada(); }); });
            } else {
              b.classList.add("errada");
              b.disabled = true;
              caixa.mostrar("tentar", "Esta figurinha é de " + op.nome + ". " + op.curto + " Leia a pista de novo e tente outra!");
            }
          } }, figurinha(op));
          return b;
        })));
    }
    rodada();
  };

  /* ---------- ESTAÇÃO 2: África ---------- */
  TELAS.estacao2 = function (tela, extra) {
    const e = CONTEUDO.estacoes[1];
    const itens = itensDaEstacao(2);
    if (itens.every(function (i) { return tem(i.id); }) && !(extra && extra.deNovo)) {
      telaConcluida(tela, 2, function () { mostrar("estacao2", { deNovo: true }); });
      return;
    }
    const area = h("div", { class: "estacao-tela" }, titulo("Estação 2: " + e.nome, e.cor));
    tela.append(area);
    const ab = CONTEUDO.africa;
    const intro = h("div", { class: "intro" },
      h("div", { class: "intro-mapa", html: '<svg viewBox="0 0 600 600" aria-hidden="true"><path d="' + DESENHOS.AFRICA_CAMINHO + '" fill="#52b788" stroke="#2b2118" stroke-width="5" stroke-linejoin="round"/></svg>' }),
      h("div", null,
        h("p", { class: "frase-grande" }, explica(ab.abertura)),
        h("div", { class: "fila-botoes" },
          botao("Montar o quebra-cabeça", "mouse", function () { quebraCabeca(area); }, "botao-principal"),
          prog().quebraCabeca ? botao("Ir direto para os países", "alfinete", function () { paises(area); }) : null)));
    area.append(intro);
  };

  function limparAbaixoDoTitulo(area) {
    while (area.children.length > 1) area.lastChild.remove();
  }

  // Cores alegres das peças do quebra-cabeça.
  const CORES_PECAS = ["#52b788", "#f4a261", "#e9c46a", "#2a9d8f", "#e76f51", "#90be6d"];

  function quebraCabeca(area) {
    definirAjuda("quebracabeca");
    limparAbaixoDoTitulo(area);
    const linhas = ano() === 1 ? 2 : 3;
    const colunas = 2;
    // Retângulo que contém a África no desenho (600 x 600).
    const X0 = 15, Y0 = 0, LARG = 565, ALT = 590;
    const w = LARG / colunas, hh = ALT / linhas;
    const pecas = [];
    for (let l = 0; l < linhas; l++) for (let c = 0; c < colunas; c++) {
      pecas.push({ i: pecas.length, x: X0 + c * w, y: Y0 + l * hh, cor: CORES_PECAS[pecas.length % CORES_PECAS.length] });
    }
    function svgPeca(p, fantasma) {
      return '<svg viewBox="' + p.x + ' ' + p.y + ' ' + w + ' ' + hh + '" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<path d="' + DESENHOS.AFRICA_CAMINHO + '" fill="' + (fantasma ? "#d8e2dc" : p.cor) + '" stroke="' + (fantasma ? "#9aa5a0" : "#2b2118") + '" stroke-width="' + (fantasma ? 3 : 5) + '" stroke-linejoin="round" ' + (fantasma ? 'stroke-dasharray="10 8"' : "") + '/></svg>';
    }
    let escolhida = null;
    let colocadas = 0;
    const caixa = caixaMensagem();
    const tabuleiro = h("div", { class: "qc-tabuleiro", style: "grid-template-columns: repeat(" + colunas + ", 1fr); aspect-ratio: " + LARG + " / " + ALT });
    const bandeja = h("div", { class: "qc-bandeja" });

    pecas.forEach(function (p) {
      const vaga = h("button", { type: "button", class: "qc-vaga", "aria-label": "Lugar " + (p.i + 1), html: svgPeca(p, true), onclick: function () {
        if (vaga.classList.contains("ocupada")) return;
        if (!escolhida) { caixa.mostrar("dica", "Primeiro clique numa peça colorida, embaixo ou ao lado do mapa."); return; }
        if (escolhida.p.i === p.i) {
          vaga.innerHTML = svgPeca(p, false);
          vaga.classList.add("ocupada");
          vaga.setAttribute("aria-label", "Peça encaixada");
          escolhida.botao.remove();
          escolhida = null;
          colocadas++;
          if (colocadas === pecas.length) {
            prog().quebraCabeca = true; salvar();
            caixa.mostrar("certo", explica(CONTEUDO.africa.montado));
            tabuleiro.classList.add("pronto");
            bandeja.append(botao("Conhecer os países", "alfinete", function () { paises(area); }, "botao-principal"));
            bandeja.querySelector("button").focus();
          } else {
            caixa.mostrar("certo", acerto() + " Faltam " + (pecas.length - colocadas) + " peças.");
          }
        } else {
          vaga.classList.add("tremer");
          depois(500, function () { vaga.classList.remove("tremer"); });
          caixa.mostrar("tentar", "Essa peça não encaixa aqui. Compare o formato da peça com a sombra do mapa!");
        }
      } });
      tabuleiro.append(vaga);
    });

    embaralhar(pecas).forEach(function (p, k) {
      const b = h("button", { type: "button", class: "qc-peca", "aria-label": "Peça " + (k + 1), html: svgPeca(p, false), onclick: function () {
        bandeja.querySelectorAll(".qc-peca").forEach(function (x) { x.classList.remove("escolhida"); });
        b.classList.add("escolhida");
        escolhida = { p: p, botao: b };
        caixa.mostrar("dica", "Agora clique no lugar do mapa onde esta peça se encaixa.");
      } });
      bandeja.append(b);
    });

    area.append(h("p", { class: "pedido" }, "Monte o mapa da África: clique numa peça e depois no lugar dela."),
      h("div", { class: "qc" }, tabuleiro, bandeja), caixa);
  }

  function paises(area) {
    definirAjuda("paises");
    limparAbaixoDoTitulo(area);
    const itens = itensDaEstacao(2);
    const caixa = caixaMensagem();
    const pedido = h("div", { class: "pista" });
    const mapa = h("div", { class: "mapa-africa" },
      h("div", { html: '<svg viewBox="0 0 600 600" aria-hidden="true"><path d="' + DESENHOS.AFRICA_CAMINHO + '" fill="#95d5b2" stroke="#2b2118" stroke-width="4" stroke-linejoin="round"/></svg>' }));
    // 1º ano: clica em qualquer alfinete. 2º ano: procura o nome. 3º ano: lê a pista.
    let alvo = null;
    let fila = embaralhar(itens.filter(function (i) { return !tem(i.id); }));
    if (!fila.length) fila = embaralhar(itens.slice());
    const vistos = {};

    itens.forEach(function (p) {
      const xy = DESENHOS.projetar(p.lon, p.lat);
      const b = h("button", { type: "button", class: "alfinete rotulo-" + p.rotulo + (tem(p.id) ? " visto" : ""), style: "left:" + (xy[0] / 6) + "%;top:" + (xy[1] / 6) + "%",
        onclick: function () { clicar(p, b); } },
        h("span", { class: "alfinete-ponta" }, icone(tem(p.id) ? "certo" : "alfinete")),
        h("span", { class: "alfinete-nome" }, p.nome));
      mapa.append(b);
    });

    function marcar(p, b) {
      vistos[p.id] = true;
      b.classList.add("visto");
      b.querySelector(".alfinete-ponta").innerHTML = "";
      b.querySelector(".alfinete-ponta").append(icone("certo"));
    }

    function proximo() {
      fila = fila.filter(function (i) { return !vistos[i.id]; });
      if (!fila.length) {
        pedido.innerHTML = "";
        pedido.append(icone("certo"), h("p", null, "Você conheceu todos os países desta estação!"));
        area.append(h("div", { class: "fila-botoes centro" }, botao("Voltar ao mapa", "casa", function () { mostrar("mapa"); }, "botao-principal"),
          botao("Ver o álbum", "album", function () { mostrar("album"); })));
        return;
      }
      pedido.innerHTML = "";
      if (ano() === 1) {
        alvo = null;
        pedido.append(icone("alfinete"), h("p", null, "Clique num alfinete para conhecer um país."));
      } else if (ano() === 2) {
        alvo = fila[0];
        pedido.append(icone("lupa"), h("p", null, h("span", { class: "procure" }, "Encontre: " + alvo.nome), h("br"), h("span", null, pista(alvo))));
      } else {
        alvo = fila[0];
        pedido.append(icone("lupa"), h("p", null, pista(alvo), h("br"), h("span", { class: "procure" }, "Que país é este? Clique no alfinete.")));
      }
    }

    function clicar(p, b) {
      if (vistos[p.id] && !alvo) { caixa.mostrar("dica", "Você já conheceu " + p.nome + ". Clique em outro alfinete!"); return; }
      if (!alvo || alvo.id === p.id) {
        marcar(p, b);
        caixa.mostrar("certo", acerto() + " " + p.nome + "!");
        depois(700, function () { ganhar(p.id, proximo); });
      } else {
        b.classList.add("tremer");
        depois(500, function () { b.classList.remove("tremer"); });
        caixa.mostrar("tentar", "Este alfinete é do país " + p.nome + ". " + p.curto + " Procure de novo!");
      }
    }

    area.append(h("div", { class: "paises" }, h("div", { class: "paises-lado" }, pedido, caixa), mapa));
    proximo();
  }

  /* ---------- ESTAÇÃO 3: Brincadeiras e jogos ---------- */
  TELAS.estacao3 = function (tela) {
    const e = CONTEUDO.estacoes[2];
    const itens = itensDaEstacao(3);
    const cartoes = itens.map(function (b) {
      return h("button", { type: "button", class: "cartao-brincadeira" + (tem(b.id) ? " feita" : ""), onclick: function () { mostrar(b.id); } },
        figurinha(b),
        h("span", { class: "cartao-texto" }, explica(b)),
        h("span", { class: "cartao-acao" }, icone(tem(b.id) ? "certo" : "play"), h("span", null, tem(b.id) ? "Jogar de novo" : "Jogar")));
    });
    tela.append(h("div", { class: "estacao-tela" },
      titulo("Estação 3: " + e.nome, e.cor),
      h("p", { class: "pedido" }, "Escolha uma brincadeira ou um jogo. Jogue até o fim para ganhar a figurinha!"),
      h("div", { class: "cartoes-brincadeiras" }, cartoes),
      h("div", { class: "fila-botoes centro" }, botao("Voltar ao mapa", "casa", function () { mostrar("mapa"); }))));
  };

  function telaBrincadeira(id) {
    return function (tela) {
      const item = buscarItem(id);
      const e = CONTEUDO.estacoes[2];
      const area = h("div", { class: "brincadeira-area" });
      tela.append(h("div", { class: "estacao-tela" },
        h("div", { class: "topo-brincadeira" },
          titulo(item.nome, e.cor),
          botao("Voltar às brincadeiras", "setaEsq", function () { mostrar("estacao3"); }, "botao-pequeno")),
        area));
      BRINCADEIRAS[id](area, function terminou() {
        ganhar(id, function () { /* continua na mesma tela para jogar de novo */ });
      });
    };
  }
  TELAS.terramar = telaBrincadeira("terramar");
  TELAS.oware = telaBrincadeira("oware");
  TELAS.shisima = telaBrincadeira("shisima");
  // A ajuda da mancala usa a chave "mancala".
  const ajudaDe = { oware: "mancala" };

  /* ---------- ESTAÇÃO 4: Cultura que está em todo lugar ---------- */
  TELAS.estacao4 = function (tela, extra) {
    const e = CONTEUDO.estacoes[3];
    const itens = itensDaEstacao(4);
    let fila = itens.filter(function (i) { return !tem(i.id); });
    if (!fila.length) {
      if (!(extra && extra.deNovo)) { telaConcluida(tela, 4, function () { mostrar("estacao4", { deNovo: true }); }); return; }
      fila = itens.slice();
    }
    fila = embaralhar(fila);
    const porRodada = CONTEUDO.paresPorRodada[ano()];
    const area = h("div", { class: "rodada" });
    const caixa = caixaMensagem();
    tela.append(h("div", { class: "estacao-tela" }, titulo("Estação 4: " + e.nome, e.cor), area, caixa));

    function rodada() {
      area.innerHTML = ""; window.scrollTo(0, 0);
      caixa.limpar();
      if (!fila.length) { mostrar("estacao4"); return; }
      let grupo = fila.splice(0, porRodada);
      // Se sobrou só um item, junta com outro para ainda haver escolha.
      if (grupo.length === 1) {
        const outro = embaralhar(itens.filter(function (i) { return i.id !== grupo[0].id; }))[0];
        if (outro) grupo.push(outro);
      }
      let selecionado = null; // { lado: "nome" | "imagem", item, botao }
      let faltam = grupo.length;
      const coluna1 = h("div", { class: "ligar-coluna" });
      const coluna2 = h("div", { class: "ligar-coluna" });

      function selecionar(lado, item, b) {
        if (b.classList.contains("ligado")) return;
        if (!selecionado || selecionado.lado === lado) {
          area.querySelectorAll(".ligar-" + lado).forEach(function (x) { x.classList.remove("escolhido"); });
          b.classList.add("escolhido");
          selecionado = { lado: lado, item: item, botao: b };
          caixa.mostrar("dica", lado === "nome" ? "Agora clique na imagem que combina com “" + item.nome + "”." : "Agora clique no nome que combina com esta imagem.");
          return;
        }
        if (selecionado.item.id === item.id) {
          [selecionado.botao, b].forEach(function (x) { x.classList.remove("escolhido"); x.classList.add("ligado"); x.disabled = true; });
          const par = grupo.indexOf(item) + 1;
          selecionado.botao.dataset.par = par; b.dataset.par = par;
          selecionado = null;
          faltam--;
          caixa.mostrar("certo", acerto() + " " + item.nome + "!");
          depois(700, function () {
            ganhar(item.id, function () {
              if (faltam === 0) {
                if (fila.length) {
                  caixa.mostrar("certo", "Você ligou tudo! Vamos para a próxima rodada.");
                  area.append(h("div", { class: "fila-botoes centro" }, botao("Próxima rodada", "setaDir", rodada, "botao-principal")));
                  area.querySelector(".fila-botoes .botao").focus();
                } else {
                  mostrar("estacao4");
                }
              }
            });
          });
        } else {
          b.classList.add("tremer");
          depois(500, function () { b.classList.remove("tremer"); });
          caixa.mostrar("tentar", "Não combina. Olhe bem a imagem e tente outra vez!");
        }
      }

      grupo.forEach(function (item) {
        const bn = h("button", { type: "button", class: "ligar-nome", onclick: function () { selecionar("nome", item, bn); } },
          h("span", { class: "ligar-palavra" }, item.nome),
          h("span", { class: "ligar-grupo" }, CONTEUDO.grupos[item.grupo]));
        coluna1.append(bn);
      });
      embaralhar(grupo).forEach(function (item) {
        const bi = h("button", { type: "button", class: "ligar-imagem", "aria-label": "Imagem: " + (descricao(item.id) || "sem descrição"), onclick: function () { selecionar("imagem", item, bi); } },
          h("span", { class: "figurinha-arte", style: "--cor-fundo:" + item.cor, html: DESENHOS.svg(item.desenho) }));
        coluna2.append(bi);
      });

      area.append(
        h("div", { class: "contador" }, barraProgresso(contagem(4))),
        h("p", { class: "pedido" }, "Ligue cada nome à sua imagem: clique no nome e depois na imagem."),
        h("div", { class: "ligar" }, coluna1, h("div", { class: "ligar-meio", "aria-hidden": "true" }, icone("setaDir")), coluna2));
    }
    rodada();
  };

  /* ---------- DESAFIO FINAL (3º ano) ---------- */
  function mascarar(texto, nome) {
    const esc = nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return texto.replace(new RegExp(esc + "[a-zà-úç]*", "gi"), "___");
  }

  TELAS.desafio = function (tela) {
    if (!desafioLiberado()) { mostrar("mapa"); return; }
    const perguntas = [];
    function pegar(lista, n, fazer) {
      embaralhar(lista).slice(0, n).forEach(function (i) { perguntas.push({ certo: i, lista: lista, texto: fazer(i) }); });
    }
    pegar(doAno(CONTEUDO.pessoas), 2, function (i) { return i.pista[3]; });
    pegar(doAno(CONTEUDO.paises), 2, function (i) { return i.pista[3]; });
    pegar(doAno(CONTEUDO.brincadeiras), 1, function (i) { return mascarar(i.curto, i.nome.split(" ")[0]); });
    pegar(doAno(CONTEUDO.cultura), CONTEUDO.desafio.perguntas - 5, function (i) { return mascarar(i.curto, i.nome); });
    const fila = embaralhar(perguntas);
    let k = 0;
    const area = h("div", { class: "rodada" });
    const caixa = caixaMensagem();
    tela.append(h("div", { class: "estacao-tela" }, titulo("Desafio final", "#e76f51"), area, caixa));

    function rodada() {
      area.innerHTML = ""; window.scrollTo(0, 0);
      caixa.limpar();
      if (k >= fila.length) {
        ganhar("guardiao", function () { mostrar("album", { pagina: 4 }); });
        return;
      }
      const q = fila[k];
      const opcoes = embaralhar([q.certo].concat(embaralhar(q.lista.filter(function (i) { return i.id !== q.certo.id; })).slice(0, 2)));
      area.append(
        h("div", { class: "contador" }, h("span", { class: "progresso-texto" }, "Pergunta " + (k + 1) + " de " + fila.length)),
        h("div", { class: "pista" }, icone("lupa"), h("p", null, q.texto)),
        h("p", { class: "pedido" }, "Qual é a figurinha certa?"),
        h("div", { class: "opcoes opcoes-3" }, opcoes.map(function (op) {
          const b = h("button", { type: "button", class: "opcao", onclick: function () {
            if (op.id === q.certo.id) {
              b.classList.add("certa");
              area.querySelectorAll(".opcao").forEach(function (x) { x.disabled = true; });
              caixa.mostrar("certo", acerto() + " " + explica(q.certo));
              area.append(h("div", { class: "fila-botoes centro" }, botao(k + 1 < fila.length ? "Próxima pergunta" : "Ganhar a medalha", "setaDir", function () { k++; rodada(); }, "botao-principal")));
              area.querySelector(".fila-botoes .botao").focus();
            } else {
              b.classList.add("errada");
              b.disabled = true;
              caixa.mostrar("tentar", op.nome + ": " + explica(op) + " Tente de novo!");
            }
          } }, figurinha(op));
          return b;
        })));
    }
    rodada();
  };

  /* ---------- ÁLBUM ---------- */
  function paginasDoAlbum() {
    const paginas = CONTEUDO.estacoes.map(function (e) { return { titulo: "Estação " + e.id + ": " + e.nome, cor: e.cor, itens: itensDaEstacao(e.id) }; });
    if (ano() === 3) paginas.push({ titulo: "Desafio final", cor: "#e76f51", itens: [CONTEUDO.desafio.medalha] });
    return paginas;
  }

  TELAS.album = function (tela, extra) {
    if (!dados.ano) { mostrar("inicio"); return; }
    const paginas = paginasDoAlbum();
    let pag = extra && typeof extra.pagina === "number" ? Math.min(extra.pagina, paginas.length - 1) : 0;
    const total = paginas.reduce(function (s, p) { return s + p.itens.length; }, 0);
    const temT = paginas.reduce(function (s, p) { return s + p.itens.filter(function (i) { return tem(i.id); }).length; }, 0);
    const corpo = h("div", { class: "album-pagina" });

    function desenhar() {
      const p = paginas[pag];
      corpo.innerHTML = "";
      corpo.style.setProperty("--cor", p.cor);
      const colecionadas = paginas.reduce(function (l, pp) { return l.concat(pp.itens.filter(function (i) { return tem(i.id); }).map(function (i) { return i.id; })); }, []);
      corpo.append(
        h("h2", { class: "album-titulo" }, p.titulo),
        h("div", { class: "album-grade" }, p.itens.map(function (i) {
          if (tem(i.id)) {
            return h("button", { type: "button", class: "botao-figurinha", onclick: function () { verFigurinha(i.id, colecionadas); } }, figurinha(i));
          }
          return h("span", { class: "figurinha vazia" }, h("span", { class: "vazia-sinal" }, "?"), h("span", { class: "figurinha-nome" }, "Ainda falta"));
        })),
        h("div", { class: "album-navegacao" },
          h("button", { type: "button", class: "botao", disabled: pag === 0, onclick: function () { pag--; desenhar(); } }, icone("setaEsq"), h("span", null, "Página anterior")),
          h("span", { class: "album-numero" }, "Página " + (pag + 1) + " de " + paginas.length),
          h("button", { type: "button", class: "botao", disabled: pag === paginas.length - 1, onclick: function () { pag++; desenhar(); } }, h("span", null, "Próxima página"), icone("setaDir"))));
    }

    tela.append(h("div", { class: "album" },
      h("div", { class: "mapa-topo" },
        titulo("Meu álbum"),
        h("span", { class: "etiqueta-ano" }, ano() + "º ano"),
        barraProgresso({ tem: temT, total: total })),
      corpo,
      h("div", { class: "fila-botoes centro" },
        temT ? botao("Ver as figurinhas uma por uma", "estrelaIcone", function () {
          const ids = paginas.reduce(function (l, pp) { return l.concat(pp.itens.filter(function (i) { return tem(i.id); }).map(function (i) { return i.id; })); }, []);
          verFigurinha(ids[0], ids);
        }) : null,
        botao("Voltar ao mapa", "casa", function () { mostrar("mapa"); }))));
    desenhar();
  };

  // Mostra uma figurinha grande, com setas para folhear as outras.
  function verFigurinha(id, lista) {
    let k = Math.max(0, lista.indexOf(id));
    const corpo = h("div", { class: "ver-figurinha" });
    function desenhar() {
      const item = buscarItem(lista[k]);
      corpo.innerHTML = "";
      corpo.append(
        h("h2", { class: "so-leitor" }, item.nome),
        h("div", { class: "ver-linha" },
          h("button", { type: "button", class: "botao seta", disabled: k === 0, onclick: function () { k--; desenhar(); } }, icone("setaEsq"), h("span", { class: "so-leitor" }, "Figurinha anterior")),
          figurinha(item, { grande: true, comRotulo: true }),
          h("button", { type: "button", class: "botao seta", disabled: k === lista.length - 1, onclick: function () { k++; desenhar(); } }, icone("setaDir"), h("span", { class: "so-leitor" }, "Próxima figurinha"))),
        h("p", { class: "explicacao" }, explica(item)),
        h("p", { class: "ver-numero" }, "Figurinha " + (k + 1) + " de " + lista.length),
        botao("Fechar", "fechar", fecharJanela, "botao-principal"));
      anunciar(item.nome + ". " + explica(item));
    }
    desenhar();
    abrirJanela(corpo, { classe: "janela-figurinha" });
  }

  /* =================== COMO JOGAR =================== */
  function comoJogar() {
    if (modoAudio()) { MODO_AUDIO.ajuda(); return; }
    const chave = ajudaDe[ajudaAtual] || ajudaAtual;
    const passos = CONTEUDO.ajuda[chave] || CONTEUDO.ajuda.mapa;
    abrirJanela(h("div", { class: "como-jogar" },
      h("h2", null, icone("ajuda"), h("span", null, "Como jogar")),
      h("ol", { class: "passos" }, passos.map(function (p, i) {
        return h("li", null, h("span", { class: "passo-numero" }, String(i + 1)), h("span", { class: "passo-desenho", html: DESENHOS.svg(p.icone) }), h("span", { class: "passo-texto" }, p.texto));
      })),
      h("p", { class: "lembrete" }, icone("tentar"), h("span", null, "Errou? Sem problema! Leia a explicação e tente de novo.")),
      botao("Entendi!", "certo", fecharJanela, "botao-principal")));
  }

  /* =================== PAUSA =================== */
  function pausar() {
    if (pausado) return;
    pausado = true;
    const conteudo = h("div", { class: "pausa" },
      h("div", { class: "pausa-icone", html: DESENHOS.icone("pausa") }),
      h("h2", null, "Jogo pausado"),
      h("p", null, "Descanse um pouco. Quando quiser, clique em Continuar."),
      h("button", { type: "button", class: "botao botao-principal botao-enorme", "data-foco": true, onclick: continuarJogo }, icone("play"), h("span", null, "Continuar")));
    const f = abrirJanela(conteudo, { classe: "janela-pausa" });
    f.classList.add("fundo-pausa");
  }
  function continuarJogo() {
    if (!pausado) return;
    // fecha a janela de pausa (que é sempre a de cima)
    fecharJanela();
    pausado = false;
    const fila = filaPausa; filaPausa = [];
    fila.forEach(function (fn) { fn(); });
  }

  /* =================== ACESSIBILIDADE =================== */
  // Uma caixa de marcar com texto de explicação.
  function marcador(id, texto, ajuda, chave, aoMudar) {
    const caixa = h("input", { type: "checkbox", id: id, "aria-describedby": id + "-ajuda" });
    caixa.checked = !!dados.acess[chave];
    caixa.addEventListener("change", function () {
      dados.acess[chave] = caixa.checked;
      salvar();
      aplicarAcessibilidade();
      if (aoMudar) aoMudar(caixa.checked);
    });
    return h("div", { class: "marcador" },
      caixa,
      h("label", { for: id }, texto),
      h("p", { id: id + "-ajuda", class: "marcador-ajuda" }, ajuda));
  }

  // Painel "Acessibilidade" (na tela inicial e na Área do professor).
  function painelAcessibilidade(comBraille) {
    const modoAntes = dados.acess.modoAudio;
    const aviso = h("p", { class: "aviso-professor", role: "status" });
    const itens = [
      marcador("ac-audio", "Modo Áudio", "O jogo fala sozinho e funciona só pelo teclado: setas para escolher, Enter para confirmar, Esc para voltar, barra de espaço para repetir e H para ajuda. Para estudantes cegos ou com baixa visão.", "modoAudio"),
      marcador("ac-voz", "Voz do próprio jogo", "Deixe ligada para o jogo falar sozinho. Desligue se o computador usa o NVDA ou o Narrador do Windows, para não ouvir duas vozes ao mesmo tempo.", "vozPropria"),
      marcador("ac-lenta", "Voz mais devagar", "A voz do jogo fala mais devagar.", "vozLenta"),
      marcador("ac-grandes", "Letras e botões maiores", "Aumenta o tamanho de tudo na tela.", "letrasGrandes"),
      marcador("ac-contraste", "Alto contraste", "Fundo preto, letras brancas e destaques em amarelo.", "altoContraste")
    ];
    if (comBraille === true) {
      itens.push(marcador("ac-braille", "Atividade de braille (Modo Áudio)", "Ao ganhar figurinhas de pessoas e países, o estudante pode escrever em braille a primeira letra do nome, usando as teclas F, D, S, J, K e L como os pontos 1 a 6. Se acertar, ganha uma estrela extra.", "braille"));
    }
    // Ao fechar (botão ou Esc): se o Modo Áudio mudou, recomeça pela tela certa.
    function aoFechar() {
      if (dados.acess.modoAudio !== modoAntes) mostrar(dados.ano ? "mapa" : "inicio");
    }
    abrirJanela(h("div", { class: "professor acessibilidade" },
      h("h2", null, icone("acessibilidade"), h("span", null, "Acessibilidade")),
      h("p", null, "As escolhas ficam guardadas neste computador, neste navegador."),
      h("div", { class: "marcadores" }, itens),
      h("div", { class: "fila-botoes" },
        botao("Testar a voz", "somLigado", function () {
          VOZ.destravar();
          VOZ.falar("Olá! Esta é a voz do Álbum das Raízes.");
          aviso.textContent = VOZ.temSintese ? (dados.acess.vozPropria ? "Se não ouviu nada, confira o volume e se há uma voz em português instalada no computador." : "A voz do próprio jogo está desligada: o NVDA ou o Narrador vai ler os avisos.") : "Este navegador não tem voz. Use o Google Chrome ou o Microsoft Edge, ou um leitor de tela.";
        }),
        botao("Fechar", "fechar", fecharJanela, "botao-principal")),
      aviso), { aoFechar: aoFechar });
  }

  /* =================== ÁREA DO PROFESSOR =================== */
  function areaProfessor() {
    const a = 3 + Math.floor(Math.random() * 7);
    const b = 4 + Math.floor(Math.random() * 6);
    const campo = h("input", { type: "number", inputmode: "numeric", id: "resposta-professor", class: "campo", autocomplete: "off", "data-foco": true });
    const erro = h("p", { class: "erro-professor", role: "alert" });
    function entrar(ev) {
      if (ev) ev.preventDefault();
      if (parseInt(campo.value, 10) === a + b) { fecharJanela(); painelProfessor(); }
      else { erro.textContent = "Resposta errada. Tente de novo."; campo.value = ""; campo.focus(); }
    }
    abrirJanela(h("form", { class: "professor", onsubmit: entrar },
      h("h2", null, icone("chave"), h("span", null, "Área do professor")),
      h("label", { for: "resposta-professor" }, "Para entrar, responda: quanto é " + a + " + " + b + "?"),
      campo, erro,
      h("div", { class: "fila-botoes" },
        h("button", { type: "submit", class: "botao botao-principal" }, icone("certo"), h("span", null, "Entrar")),
        botao("Cancelar", "fechar", fecharJanela))));
  }

  function painelProfessor() {
    const resumo = [1, 2, 3].map(function (a) {
      const n = dados.anos[a].figurinhas.length;
      return h("li", null, a + "º ano: " + n + " figurinha" + (n === 1 ? "" : "s") + (dados.anos[a].liberadas ? " (estações liberadas)" : ""));
    });
    const aviso = h("p", { class: "aviso-professor", role: "status" });
    abrirJanela(h("div", { class: "professor" },
      h("h2", null, icone("chave"), h("span", null, "Área do professor")),
      h("p", null, "O progresso fica guardado só neste computador, neste navegador."),
      h("ul", { class: "resumo" }, resumo),
      h("div", { class: "fila-botoes coluna" },
        botao("Liberar todas as estações", "cadeado", function () {
          [1, 2, 3].forEach(function (a) { dados.anos[a].liberadas = true; });
          salvar();
          aviso.textContent = "Pronto! Todas as estações (e o Desafio final do 3º ano) estão liberadas em todos os anos.";
        }, "botao-principal"),
        botao("Acessibilidade e atividade de braille", "acessibilidade", function () { painelAcessibilidade(true); }),
        botao("Apagar progresso", "lixeira", function () { confirmarApagar(); }, "botao-perigo"),
        botao("Fechar", "fechar", function () { fecharJanela(); mostrar(telaAtual === "inicio" ? "inicio" : "mapa"); })),
      aviso));
  }

  function confirmarApagar() {
    abrirJanela(h("div", { class: "professor" },
      h("h2", null, icone("lixeira"), h("span", null, "Apagar progresso?")),
      h("p", null, "Todas as figurinhas de todos os anos serão apagadas deste computador. Isso não pode ser desfeito."),
      h("div", { class: "fila-botoes" },
        h("button", { type: "button", class: "botao", "data-foco": true, onclick: fecharJanela }, icone("setaEsq"), h("span", null, "Não, voltar")),
        botao("Sim, apagar tudo", "lixeira", function () {
          const som = dados.som;
          const escolhas = dados.acess; // as escolhas de acessibilidade continuam
          dados = progressoVazio();
          dados.som = som;
          dados.acess = escolhas;
          salvar();
          fecharTodas();
          mostrar("inicio");
          abrirJanela(h("div", { class: "professor" }, h("h2", null, "Progresso apagado."), h("p", null, "O jogo começou do zero neste computador."), botao("OK", "certo", fecharJanela, "botao-principal")));
        }, "botao-perigo"))));
  }

  /* =================== BOTÕES DA BARRA =================== */
  function iniciar() {
    document.querySelectorAll("[data-icone]").forEach(function (el) {
      el.classList.add("icone");
      el.innerHTML = DESENHOS.icone(el.getAttribute("data-icone"));
    });
    document.getElementById("botao-mapa").addEventListener("click", function () { if (pausado) return; mostrar(dados.ano ? "mapa" : "inicio"); });
    document.getElementById("botao-album").addEventListener("click", function () { if (pausado) return; mostrar(dados.ano ? "album" : "inicio"); });
    document.getElementById("botao-ajuda").addEventListener("click", function () { if (pausado) return; comoJogar(); });
    document.getElementById("botao-pausa").addEventListener("click", function () { if (pausado) continuarJogo(); else pausar(); });
    document.getElementById("botao-som").addEventListener("click", function () {
      dados.som = !dados.som; salvar(); atualizarBotaoSom(); tocar("clique");
    });
    document.getElementById("botao-professor").addEventListener("click", function () { if (pausado) return; areaProfessor(); });
    document.addEventListener("keydown", function (ev) {
      if (pilha.length) {
        if (ev.key === "Escape") { if (pausado) continuarJogo(); else fecharJanela(); }
        return;
      }
      const alvo = ev.target;
      if (alvo && /^(INPUT|SELECT|TEXTAREA)$/.test(alvo.tagName)) return;
      // Modo Áudio: setas, Enter, Esc, espaço, H e as outras teclas do jogo.
      if (modoAudio()) { MODO_AUDIO.tecla(ev); return; }
      // Na tela inicial, a tecla A abre a Acessibilidade.
      if (telaAtual === "inicio" && (ev.key === "a" || ev.key === "A") && !ev.ctrlKey && !ev.altKey && !ev.metaKey) {
        ev.preventDefault();
        painelAcessibilidade();
      }
    });
    document.addEventListener("keyup", function (ev) {
      if (!pilha.length && modoAudio()) MODO_AUDIO.teclaSolta(ev);
    });
    // Impede que o clique duplo selecione textos sem querer.
    document.addEventListener("dblclick", function (ev) { ev.preventDefault(); });
    atualizarBotaoSom();
    aplicarAcessibilidade();
    // No Modo Áudio, a primeira tela pede uma tecla (o navegador só deixa
    // o jogo falar depois que alguém aperta uma tecla ou clica).
    mostrar(modoAudio() ? "abertura" : (dados.ano ? "mapa" : "inicio"));
  }

  // O que as brincadeiras (js/brincadeiras.js) podem usar.
  const api = {
    h: h, icone: icone, botao: botao, caixaMensagem: caixaMensagem, depois: depois,
    embaralhar: embaralhar, sortear: sortear, ano: ano, explica: explica, acerto: acerto,
    tocar: tocar, definirAjuda: definirAjuda, anunciar: anunciar,
    estaPausado: function () { return pausado; }
  };

  // O que o Modo Áudio (js/modo-audio.js) usa do jogo principal.
  api.interno = {
    telaEl: telaEl, mostrar: mostrar, salvar: salvar,
    dados: function () { return dados; }, acess: acess, prog: prog, ano: ano,
    tem: tem, temEstrela: temEstrela, darEstrela: darEstrela,
    doAno: doAno, itensDaEstacao: itensDaEstacao, estacaoDoItem: estacaoDoItem, buscarItem: buscarItem,
    contagem: contagem, completa: completa, liberada: liberada, albumCompleto: albumCompleto, desafioLiberado: desafioLiberado,
    explica: explica, pista: pista, mascarar: mascarar, paginasDoAlbum: paginasDoAlbum
  };

  document.addEventListener("DOMContentLoaded", iniciar);
  return api;
})();
