/*
  ÁLBUM DAS RAÍZES — BRINCADEIRAS DA ESTAÇÃO 3
  ============================================
  - Terra-Mar: a criança clica no lado certo da linha (terra ou mar).
  - Oware (mancala): jogo de semear sementes contra o computador,
    com três níveis (bem fácil, médio e regras completas).
  - Shisima: jogo de tabuleiro octogonal contra o computador.

  Os textos das regras ficam em js/conteudo.js.
  Cada brincadeira recebe a área da tela e uma função "terminou",
  que dá a figurinha quando a partida chega ao fim.
*/

const BRINCADEIRAS = {};

/* ======================= MOTOR DA MANCALA =======================
   As regras do jogo, sem tela. Usado pela mancala com mouse (oware)
   e pela mancala falada do Modo Áudio (js/modo-audio.js).
   Casas 0..n-1: do estudante. Casas n..2n-1: do computador.
   As sementes andam sempre para a casa seguinte (0, 1, 2, ... 2n-1, 0...). */
BRINCADEIRAS.motorMancala = function (cfg) {
  const n = cfg.casas;
  function dono(i) { return i < n ? 0 : 1; }
  function ladoVazio(t, j) {
    for (let i = j * n; i < j * n + n; i++) if (t[i] > 0) return false;
    return true;
  }

  // Calcula o resultado de uma jogada, sem mexer no tabuleiro de verdade.
  function simular(t, origem) {
    const novo = t.slice();
    let sementes = novo[origem];
    novo[origem] = 0;
    let pos = origem;
    const caminho = [];
    let pulou = false;
    while (sementes > 0) {
      pos = (pos + 1) % (2 * n);
      if (cfg.regrasCompletas && pos === origem) { pulou = true; continue; }
      novo[pos]++;
      sementes--;
      caminho.push(pos);
    }
    const jogador = dono(origem);
    let capt = [];
    if (dono(pos) !== jogador) {
      let p = pos;
      while (p >= 0 && dono(p) !== jogador && (novo[p] === 2 || novo[p] === 3)) {
        capt.push(p);
        if (!cfg.capturaEmCadeia) break;
        p--;
        if (p < 0 || dono(p) === jogador) break;
      }
    }
    let grandSlam = false;
    if (cfg.regrasCompletas && capt.length) {
      // Não vale capturar todas as sementes do adversário de uma vez.
      const adv = 1 - jogador;
      let soma = 0, somaCapt = 0;
      for (let i = adv * n; i < adv * n + n; i++) soma += novo[i];
      capt.forEach(function (c) { somaCapt += novo[c]; });
      if (soma === somaCapt) { grandSlam = true; capt = []; }
    }
    let ganho = 0;
    capt.forEach(function (c) { ganho += novo[c]; });
    const final = novo.slice();
    capt.forEach(function (c) { final[c] = 0; });
    return { depoisDeSemear: novo, final: final, caminho: caminho, capturas: capt, ganho: ganho, pulou: pulou, grandSlam: grandSlam };
  }

  function jogadasValidas(t, j) {
    const lista = [];
    for (let i = j * n; i < j * n + n; i++) if (t[i] > 0) lista.push(i);
    if (cfg.regrasCompletas && ladoVazio(t, 1 - j)) {
      // O adversário está sem sementes: é preciso dar sementes a ele.
      return lista.filter(function (i) { return !ladoVazio(simular(t, i).final, 1 - j); });
    }
    return lista;
  }

  function escolhaDoComputador(tab, nivel) {
    const validas = jogadasValidas(tab, 1);
    if (nivel === 1) return J.sortear(validas);
    let melhor = -999, opcoes = [];
    validas.forEach(function (i) {
      const r = simular(tab, i);
      let nota = r.ganho;
      if (nivel === 3) {
        // Olha também a melhor resposta da criança.
        let pior = 0;
        jogadasValidas(r.final, 0).forEach(function (k) { pior = Math.max(pior, simular(r.final, k).ganho); });
        nota -= pior * 0.9;
      }
      if (nota > melhor + 0.01) { melhor = nota; opcoes = [i]; }
      else if (Math.abs(nota - melhor) <= 0.01) opcoes.push(i);
    });
    return J.sortear(opcoes);
  }

  return { n: n, dono: dono, ladoVazio: ladoVazio, simular: simular, jogadasValidas: jogadasValidas, escolhaDoComputador: escolhaDoComputador };
};


/* ======================= TERRA-MAR ======================= */
BRINCADEIRAS.terramar = function (area, terminou) {
  const h = J.h, icone = J.icone;
  J.definirAjuda("terramar");
  const cfg = CONTEUDO.terramar;
  const total = cfg.rodadas[J.ano()];
  let feitas = 0;
  let ordem = null;
  let historico = [];
  let esperando = false;

  const caixa = J.caixaMensagem();
  const ordemEl = h("div", { class: "tm-ordem", "aria-live": "polite" });
  const estrelas = h("div", { class: "tm-estrelas", "aria-label": "Acertos" });
  const crianca = h("div", { class: "tm-crianca", html: DESENHOS.svg("crianca") });

  const terra = h("button", { type: "button", class: "tm-lado tm-terra", onclick: function () { escolher("terra", terra); } },
    h("span", { class: "tm-rotulo" }, "TERRA"));
  const mar = h("button", { type: "button", class: "tm-lado tm-mar", onclick: function () { escolher("mar", mar); } },
    h("span", { class: "tm-ondas", "aria-hidden": "true" }), h("span", { class: "tm-rotulo" }, "MAR"));
  const campo = h("div", { class: "tm-campo" }, terra, mar, h("div", { class: "tm-linha", "aria-hidden": "true" }), crianca);

  function desenharEstrelas() {
    estrelas.innerHTML = "";
    for (let i = 0; i < total; i++) {
      estrelas.append(h("span", { class: "tm-estrela" + (i < feitas ? " acesa" : "") }, J.icone("estrelaIcone")));
    }
    estrelas.setAttribute("aria-label", feitas + " de " + total + " acertos");
  }

  function novaOrdem() {
    // Sorteia TERRA ou MAR, sem repetir a mesma ordem mais de 2 vezes seguidas.
    let nova = Math.random() < 0.5 ? "terra" : "mar";
    if (historico.length >= 2 && historico[historico.length - 1] === nova && historico[historico.length - 2] === nova) {
      nova = nova === "terra" ? "mar" : "terra";
    }
    historico.push(nova);
    ordem = nova;
    ordemEl.className = "tm-ordem " + (J.ano() === 3 ? "neutra" : nova);
    ordemEl.innerHTML = "";
    ordemEl.append(h("span", null, nova === "terra" ? "TERRA!" : "MAR!"));
    esperando = false;
  }

  function escolher(lado, botao) {
    if (esperando || !ordem) return;
    if (lado === ordem) {
      esperando = true;
      feitas++;
      crianca.className = "tm-crianca pula-" + lado;
      desenharEstrelas();
      caixa.mostrar("certo", J.acerto());
      if (feitas >= total) {
        J.depois(900, fim);
      } else {
        J.depois(1000, novaOrdem);
      }
    } else {
      botao.classList.add("tremer");
      J.depois(500, function () { botao.classList.remove("tremer"); });
      caixa.mostrar("tentar", cfg.erro);
    }
  }

  function fim() {
    ordemEl.className = "tm-ordem neutra";
    ordemEl.textContent = "Fim!";
    caixa.mostrar("certo", "Você completou o Terra-Mar com " + total + " acertos!");
    area.append(h("div", { class: "fila-botoes centro" },
      J.botao("Jogar de novo", "tentar", function () { area.innerHTML = ""; BRINCADEIRAS.terramar(area, terminou); }, "botao-principal")));
    terminou();
  }

  area.append(
    h("p", { class: "pedido" }, J.explica(cfg.explicacao)),
    h("div", { class: "tm-topo" }, ordemEl, estrelas),
    campo, caixa);
  desenharEstrelas();
  novaOrdem();
};

/* ======================= OWARE (MANCALA) ======================= */
BRINCADEIRAS.oware = function (area, terminou, nivelEscolhido) {
  const h = J.h, icone = J.icone;
  J.definirAjuda("mancala");
  const nivel = nivelEscolhido || J.ano();
  const cfg = CONTEUDO.mancala.niveis[nivel];
  const passos = CONTEUDO.mancala.passos[nivel];
  const n = cfg.casas;
  const TOTAL = n * 2 * cfg.sementes;
  const VELOCIDADE = nivel === 1 ? 450 : 330;

  // Casinhas 0..n-1: as suas (embaixo, da esquerda para a direita).
  // Casinhas n..2n-1: do computador (em cima, da direita para a esquerda).
  let tab = [];
  for (let i = 0; i < 2 * n; i++) tab.push(cfg.sementes);
  let capturadas = [0, 0]; // [você, computador]
  let ocupado = false;
  let jogadasSemCaptura = 0;
  let acabou = false;

  const motor = BRINCADEIRAS.motorMancala(cfg);
  const dono = motor.dono, ladoVazio = motor.ladoVazio, simular = motor.simular, jogadasValidas = motor.jogadasValidas;
  function escolhaDoComputador() { return motor.escolhaDoComputador(tab, nivel); }

  /* ----- Tela ----- */
  const caixa = J.caixaMensagem();
  const linhaCima = h("div", { class: "mc-linha mc-cima" });
  const linhaBaixo = h("div", { class: "mc-linha mc-baixo" });
  const depositoComp = h("div", { class: "mc-deposito comp" });
  const depositoVoce = h("div", { class: "mc-deposito voce" });
  const listaPassos = h("ol", { class: "mc-passos" }, passos.map(function (p) { return h("li", null, p); }));
  const casas = [];

  for (let c = 0; c < n; c++) {
    const idxCima = 2 * n - 1 - c;
    const bc = h("div", { class: "mc-casa comp", "aria-label": "Casinha do computador" });
    casas[idxCima] = bc;
    linhaCima.append(bc);
  }
  for (let c = 0; c < n; c++) {
    const i = c;
    const bb = h("button", { type: "button", class: "mc-casa voce", onclick: function () { clicarCasa(i); } });
    casas[i] = bb;
    linhaBaixo.append(bb);
  }

  function desenharCasa(i, valor, destaque) {
    const el = casas[i];
    el.innerHTML = "";
    const sementes = h("span", { class: "mc-sementes", "aria-hidden": "true" });
    for (let k = 0; k < Math.min(valor, 15); k++) sementes.append(h("span", { class: "mc-semente" }));
    el.append(sementes, h("span", { class: "mc-numero" }, String(valor)));
    if (dono(i) === 0) el.setAttribute("aria-label", "Sua casinha " + (i + 1) + ": " + valor + " sementes");
    else el.setAttribute("aria-label", "Casinha do computador: " + valor + " sementes");
    el.classList.toggle("ativa", !!destaque);
  }

  function desenharDepositos() {
    [[depositoVoce, 0, "Você capturou"], [depositoComp, 1, "Computador capturou"]].forEach(function (d) {
      d[0].innerHTML = "";
      const s = h("span", { class: "mc-sementes", "aria-hidden": "true" });
      for (let k = 0; k < Math.min(capturadas[d[1]], 24); k++) s.append(h("span", { class: "mc-semente" }));
      d[0].append(h("span", { class: "mc-deposito-rotulo" }, d[2]), s, h("span", { class: "mc-numero" }, String(capturadas[d[1]])));
    });
  }

  function desenharTudo(t, ativa) {
    for (let i = 0; i < 2 * n; i++) desenharCasa(i, t[i], i === ativa);
    desenharDepositos();
    atualizarClicaveis();
  }

  function atualizarClicaveis() {
    const validas = (!ocupado && !acabou) ? jogadasValidas(tab, 0) : [];
    for (let i = 0; i < n; i++) {
      casas[i].disabled = validas.indexOf(i) < 0;
      casas[i].classList.toggle("pode", validas.indexOf(i) >= 0);
      casas[i].classList.remove("dica");
    }
  }

  function destacarPasso(k) {
    listaPassos.querySelectorAll("li").forEach(function (li, i) { li.classList.toggle("agora", i === k); });
  }

  // Índices dos passos de cada nível (para destacar a regra certa na hora certa).
  const P = { clicar: 1, semear: nivel === 3 ? 1 : 2, capturar: nivel === 3 ? 2 : (nivel === 1 ? 3 : 2), cadeia: nivel === 3 ? 2 : 3, pular: 3, alimentar: 4, grandSlam: 5, fim: passos.length - 1 };

  function clicarCasa(i) {
    if (ocupado || acabou) return;
    if (jogadasValidas(tab, 0).indexOf(i) < 0) {
      if (tab[i] === 0) caixa.mostrar("tentar", "Essa casinha está vazia. Escolha uma casinha com sementes.");
      else { caixa.mostrar("tentar", "O computador está sem sementes: escolha uma jogada que dê sementes para ele."); destacarPasso(P.alimentar); }
      return;
    }
    jogar(i, 0);
  }

  function jogar(i, quem) {
    ocupado = true;
    atualizarClicaveis();
    const r = simular(tab, i);
    const vis = tab.slice();
    vis[i] = 0;
    destacarPasso(P.semear);
    desenharTudo(vis, i);
    caixa.mostrar("dica", (quem === 0 ? "Você pegou " : "O computador pegou ") + tab[i] + " sementes. Semeando: uma em cada casinha...");
    let k = 0;
    function passo() {
      if (k < r.caminho.length) {
        const pos = r.caminho[k];
        vis[pos]++;
        desenharTudo(vis, pos);
        k++;
        J.depois(VELOCIDADE, passo);
        return;
      }
      depoisDeSemear();
    }
    function depoisDeSemear() {
      tab = r.depoisDeSemear;
      if (r.capturas.length) {
        r.capturas.forEach(function (c) { casas[c].classList.add("captura"); });
        destacarPasso(r.capturas.length > 1 ? P.cadeia : P.capturar);
        caixa.mostrar(quem === 0 ? "certo" : "dica", (quem === 0 ? "Você capturou " : "O computador capturou ") + r.ganho + " sementes!" +
          (r.capturas.length > 1 ? " Foram " + r.capturas.length + " casinhas em sequência." : ""));
        J.tocar(quem === 0 ? "certo" : "clique");
        J.depois(1300, function () {
          r.capturas.forEach(function (c) { casas[c].classList.remove("captura"); });
          tab = r.final;
          capturadas[quem] += r.ganho;
          jogadasSemCaptura = 0;
          proximaVez(quem);
        });
      } else {
        if (r.grandSlam) {
          destacarPasso(P.grandSlam);
          caixa.mostrar("dica", "Essa jogada pegaria todas as sementes do adversário de uma vez. Pela regra, ninguém captura.");
        } else if (r.pulou) {
          destacarPasso(P.pular);
        }
        jogadasSemCaptura++;
        J.depois(r.grandSlam ? 1600 : 500, function () { proximaVez(quem); });
      }
    }
    J.depois(VELOCIDADE, passo);
  }

  function proximaVez(quem) {
    desenharTudo(tab, -1);
    const metade = TOTAL / 2;
    if (capturadas[0] > metade || capturadas[1] > metade) { terminar(""); return; }
    if (jogadasSemCaptura >= 60) {
      recolherLados();
      terminar("As sementes ficaram rodando sem ninguém capturar, então cada um ficou com as sementes do seu lado. ");
      return;
    }
    const vez = 1 - quem;
    if (!jogadasValidas(tab, vez).length) {
      recolherLados();
      terminar((vez === 0 ? "Você não tem jogada" : "O computador não tem jogada") + ", então cada um ficou com as sementes do seu lado. ");
      return;
    }
    if (vez === 1) {
      ocupado = true;
      atualizarClicaveis();
      caixa.mostrar("dica", "Vez do computador. Ele está pensando...");
      J.depois(1000, function () { jogar(escolhaDoComputador(), 1); });
    } else {
      ocupado = false;
      atualizarClicaveis();
      destacarPasso(P.clicar);
      if (cfg.regrasCompletas && ladoVazio(tab, 1)) {
        destacarPasso(P.alimentar);
        caixa.mostrar("dica", "O computador ficou sem sementes. Escolha uma casinha que dê sementes para ele!");
      } else {
        caixa.mostrar("dica", "Sua vez! Clique numa casinha de baixo que tenha sementes.");
      }
    }
  }

  function recolherLados() {
    for (let i = 0; i < 2 * n; i++) { capturadas[dono(i)] += tab[i]; tab[i] = 0; }
    desenharTudo(tab, -1);
  }

  function terminar(motivo) {
    acabou = true;
    ocupado = true;
    atualizarClicaveis();
    destacarPasso(P.fim);
    const v = capturadas[0], c = capturadas[1];
    let resultado;
    if (v > c) resultado = "Você venceu! Você capturou " + v + " sementes e o computador, " + c + ".";
    else if (c > v) resultado = "O computador venceu desta vez: " + c + " sementes contra " + v + ". Que tal jogar de novo?";
    else resultado = "Empate! Cada um capturou " + v + " sementes.";
    caixa.mostrar("certo", motivo + resultado);
    controles.prepend(J.botao("Jogar de novo", "tentar", function () { recomecar(nivel); }, "botao-principal"));
    controles.querySelector(".botao").focus();
    terminou();
  }

  function recomecar(nv) {
    area.innerHTML = "";
    BRINCADEIRAS.oware(area, terminou, nv);
  }

  function dica() {
    if (ocupado || acabou) return;
    const validas = jogadasValidas(tab, 0);
    let melhor = -1, escolha = validas[0];
    validas.forEach(function (i) { const g = simular(tab, i).ganho; if (g > melhor) { melhor = g; escolha = i; } });
    atualizarClicaveis();
    casas[escolha].classList.add("dica");
    caixa.mostrar("dica", melhor > 0 ? "Dica: a casinha marcada captura " + melhor + " sementes!" : "Dica: experimente a casinha marcada.");
  }

  const niveis = h("div", { class: "mc-niveis", role: "group", "aria-label": "Nível" },
    h("span", { class: "mc-niveis-rotulo" }, "Nível:"),
    [1, 2, 3].map(function (k) {
      return h("button", { type: "button", class: "botao botao-pequeno" + (k === nivel ? " selecionado" : ""), "aria-pressed": k === nivel ? "true" : "false",
        onclick: function () { if (k !== nivel) recomecar(k); } }, CONTEUDO.mancala.niveis[k].nome);
    }));

  const controles = h("div", { class: "fila-botoes centro" },
    J.botao("Dica", "lupa", dica),
    J.botao("Recomeçar", "tentar", function () { recomecar(nivel); }));

  const tabuleiro = h("div", { class: "mc-tabuleiro", style: "--casas:" + n },
    depositoComp,
    h("div", { class: "mc-linhas" },
      h("div", { class: "mc-quem" }, "Computador", h("span", { class: "mc-seta", "aria-hidden": "true" }, icone("setaEsq"))),
      linhaCima, linhaBaixo,
      h("div", { class: "mc-quem" }, "Você", h("span", { class: "mc-seta", "aria-hidden": "true" }, icone("setaDir")))),
    depositoVoce);

  area.append(niveis,
    h("div", { class: "mc-layout" },
      h("div", { class: "mc-jogo" }, tabuleiro, caixa, controles),
      h("div", { class: "mc-regras" }, h("h2", null, icone("livro"), h("span", null, "Regras passo a passo")), listaPassos)));

  desenharTudo(tab, -1);
  destacarPasso(0);
  caixa.mostrar("dica", "Sua vez! Clique numa casinha de baixo que tenha sementes.");
};

/* ======================= SHISIMA ======================= */
BRINCADEIRAS.shisima = function (area, terminou) {
  const h = J.h;
  J.definirAjuda("shisima");
  const MEIO = 8;
  // Posições: 0 a 7 nas pontas do octógono (0 em cima, sentido horário) e 8 no meio.
  const pos = [2, 2, 0, 1, 1, 1, 0, 2, 0]; // 1 = você (amarelo), 2 = computador (roxo)
  let selecionada = null;
  let ocupado = false;
  let acabou = false;
  let jogadas = 0;
  const LIMITE = 40;

  function vizinhos(p) {
    if (p === MEIO) return [0, 1, 2, 3, 4, 5, 6, 7];
    return [(p + 1) % 8, (p + 7) % 8, MEIO];
  }
  function movimentos(estado, j) {
    const lista = [];
    for (let p = 0; p < 9; p++) {
      if (estado[p] !== j) continue;
      vizinhos(p).forEach(function (q) { if (estado[q] === 0) lista.push([p, q]); });
    }
    return lista;
  }
  function venceu(estado, j) {
    if (estado[MEIO] !== j) return false;
    for (let i = 0; i < 4; i++) if (estado[i] === j && estado[i + 4] === j) return true;
    return false;
  }
  function aplicar(estado, m) {
    const e = estado.slice();
    e[m[1]] = e[m[0]];
    e[m[0]] = 0;
    return e;
  }

  function escolhaDoComputador() {
    const lista = movimentos(pos, 2);
    const ano = J.ano();
    let melhor = -9999, opcoes = [];
    lista.forEach(function (m) {
      const e = aplicar(pos, m);
      let nota = Math.random();
      if (venceu(e, 2)) nota += 1000;
      // A criança poderia vencer na próxima jogada?
      const perigo = movimentos(e, 1).some(function (r) { return venceu(aplicar(e, r), 1); });
      if (perigo) nota -= (ano === 3 ? 500 : 300);
      if (ano === 3 && m[1] === MEIO) nota += 5;
      if (nota > melhor) { melhor = nota; opcoes = [m]; }
      else if (nota === melhor) opcoes.push(m);
    });
    // No 2º ano, às vezes o computador joga sem pensar.
    if (ano === 2 && Math.random() < 0.3) return J.sortear(lista);
    return J.sortear(opcoes);
  }

  const caixa = J.caixaMensagem();
  const tabuleiro = h("div", { class: "sh-tabuleiro" });
  const pontos = [];
  function coord(p) {
    if (p === MEIO) return [50, 50];
    const a = -Math.PI / 2 + p * Math.PI / 4;
    return [50 + Math.cos(a) * 40, 50 + Math.sin(a) * 40];
  }
  let linhas = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M';
  for (let p = 0; p < 8; p++) linhas += coord(p).map(function (v) { return v.toFixed(2); }).join(" ") + (p < 7 ? " L" : " Z");
  linhas += '" fill="#f1e3c8" stroke="#6d4c41" stroke-width="1.6" stroke-linejoin="round"/>';
  for (let i = 0; i < 4; i++) {
    const a = coord(i), b = coord(i + 4);
    linhas += '<path d="M' + a[0] + ' ' + a[1] + ' L' + b[0] + ' ' + b[1] + '" stroke="#6d4c41" stroke-width="1.6"/>';
  }
  linhas += "</svg>";
  tabuleiro.innerHTML = linhas;
  for (let p = 0; p < 9; p++) {
    const xy = coord(p);
    const ponto = p;
    const b = h("button", { type: "button", class: "sh-ponto", style: "left:" + xy[0] + "%;top:" + xy[1] + "%", onclick: function () { clicar(ponto); } });
    pontos.push(b);
    tabuleiro.append(b);
  }

  function desenhar() {
    const destinos = selecionada !== null ? vizinhos(selecionada).filter(function (q) { return pos[q] === 0; }) : [];
    for (let p = 0; p < 9; p++) {
      const b = pontos[p];
      b.className = "sh-ponto" + (pos[p] === 1 ? " voce" : pos[p] === 2 ? " comp" : "") +
        (p === selecionada ? " escolhida" : "") + (destinos.indexOf(p) >= 0 ? " destino" : "");
      b.setAttribute("aria-label", (p === MEIO ? "Meio" : "Ponta " + (p + 1)) + ": " + (pos[p] === 1 ? "sua peça" : pos[p] === 2 ? "peça do computador" : "vazio"));
    }
  }

  function clicar(p) {
    if (ocupado || acabou) return;
    if (pos[p] === 1) {
      const destinos = vizinhos(p).filter(function (q) { return pos[q] === 0; });
      if (!destinos.length) { caixa.mostrar("tentar", "Essa peça não tem para onde andar. Escolha outra!"); return; }
      selecionada = p;
      desenhar();
      caixa.mostrar("dica", "Agora clique num lugar marcado para a peça andar.");
      return;
    }
    if (selecionada === null) {
      caixa.mostrar("tentar", pos[p] === 2 ? "Essa peça é do computador. Clique numa peça amarela!" : "Primeiro clique numa peça amarela.");
      return;
    }
    if (pos[p] !== 0 || vizinhos(selecionada).indexOf(p) < 0) {
      caixa.mostrar("tentar", "A peça só anda pelas linhas, um lugar por vez, para um lugar vazio. Veja os lugares marcados!");
      return;
    }
    mover([selecionada, p], 1);
  }

  function mover(m, quem) {
    const e = aplicar(pos, m);
    for (let i = 0; i < 9; i++) pos[i] = e[i];
    selecionada = null;
    jogadas++;
    desenhar();
    pontos[m[1]].classList.add("chegou");
    if (venceu(pos, quem)) {
      fim(quem === 1 ? "Você venceu! Formou uma linha de 3 passando pelo meio!" : "O computador formou uma linha de 3. Que tal jogar de novo?");
      return;
    }
    if (jogadas >= LIMITE) { fim("Empate! Ninguém conseguiu formar a linha. Muito bem jogado!"); return; }
    if (quem === 1) {
      ocupado = true;
      caixa.mostrar("dica", "Vez do computador...");
      J.depois(900, function () {
        const lista = movimentos(pos, 2);
        if (!lista.length) { ocupado = false; caixa.mostrar("dica", "O computador não pode andar. Sua vez de novo!"); return; }
        mover(escolhaDoComputador(), 2);
      });
    } else {
      ocupado = false;
      if (!movimentos(pos, 1).length) {
        caixa.mostrar("dica", "Suas peças não podem andar. O computador joga de novo.");
        ocupado = true;
        J.depois(1200, function () { mover(escolhaDoComputador(), 2); });
        return;
      }
      caixa.mostrar("dica", "Sua vez! Clique numa peça amarela.");
    }
  }

  function fim(texto) {
    acabou = true;
    caixa.mostrar(texto.indexOf("Você venceu") === 0 || texto.indexOf("Empate") === 0 ? "certo" : "dica", texto);
    area.append(h("div", { class: "fila-botoes centro" },
      J.botao("Jogar de novo", "tentar", function () { area.innerHTML = ""; BRINCADEIRAS.shisima(area, terminou); }, "botao-principal")));
    terminou();
  }

  area.append(h("div", { class: "sh-layout" },
    h("div", { class: "sh-jogo" }, tabuleiro, caixa),
    h("div", { class: "mc-regras" }, h("h2", null, J.icone("livro"), h("span", null, "Regras")),
      h("ol", { class: "mc-passos" }, CONTEUDO.shisima.passos.map(function (p) { return h("li", null, p); })))));
  desenhar();
  caixa.mostrar("dica", "Sua vez! Clique numa peça amarela.");
};
