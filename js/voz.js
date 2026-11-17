/*
  ÁLBUM DAS RAÍZES — VOZ E SONS DO MODO ÁUDIO
  ===========================================
  - VOZ: o jogo fala em português do Brasil usando a voz do próprio
    navegador (síntese de voz). Não usa internet nem gravações.
    Se a "voz do próprio jogo" estiver desligada (para quem usa NVDA ou
    o Narrador), as falas vão para uma região de aviso que o leitor de
    tela lê sozinho, e o jogo não fala por cima dele.
  - SONS: todos os sons (acerto, figurinha, semente e os instrumentos)
    são criados pelo próprio jogo, com o sintetizador do navegador.
*/

const VOZ = (function () {
  "use strict";

  let config = { ligada: true, lenta: false };
  let ultima = "";          // última fala, para repetir com a barra de espaço
  let ficha = 0;            // muda a cada fala nova, para ignorar finais antigos
  let vozEscolhida = null;

  const temSintese = typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";

  function escolherVoz() {
    if (!temSintese) return null;
    const vozes = window.speechSynthesis.getVoices() || [];
    const pt = vozes.filter(function (v) { return /^pt[-_]?BR/i.test(v.lang); });
    const ptQualquer = vozes.filter(function (v) { return /^pt/i.test(v.lang); });
    // Prefere vozes instaladas no computador (funcionam sem internet).
    const lista = pt.length ? pt : ptQualquer;
    vozEscolhida = lista.filter(function (v) { return v.localService; })[0] || lista[0] || null;
    return vozEscolhida;
  }
  if (temSintese) {
    escolherVoz();
    window.speechSynthesis.onvoiceschanged = escolherVoz;
  }

  // Região lida pelo NVDA / Narrador quando a voz própria está desligada.
  function avisoLeitor(texto) {
    const a = document.getElementById("anuncio-audio");
    if (!a) return;
    a.textContent = "";
    window.setTimeout(function () { a.textContent = texto; }, 60);
  }

  // Mostra na tela o que está sendo falado (para quem acompanha olhando).
  function mostrarTexto(texto) {
    const el = document.getElementById("fala-atual");
    if (el) el.textContent = texto;
  }

  // Divide falas longas em frases (algumas vozes param no meio de textos longos).
  function frases(texto) {
    const partes = String(texto).match(/[^.!?]+[.!?]*["”]?/g) || [texto];
    return partes.map(function (p) { return p.trim(); }).filter(Boolean);
  }

  function tempoEstimado(texto) {
    const porLetra = config.lenta ? 85 : 65;
    return Math.max(900, String(texto).length * porLetra);
  }

  function parar() {
    ficha++;
    if (temSintese) window.speechSynthesis.cancel();
  }

  /* Fala um texto sem interromper nada (uso interno).
     "minha" é a ficha da fala: se outra fala começar, esta para. */
  function dizer(texto, minha, aoTerminar) {
    mostrarTexto(texto);
    const fim = function () { if (minha === ficha && aoTerminar) aoTerminar(); };
    if (!config.ligada || !temSintese) {
      avisoLeitor(texto);
      window.setTimeout(fim, tempoEstimado(texto));
      return;
    }
    const lista = frases(texto);
    let i = 0;
    function proxima() {
      if (minha !== ficha) return;
      if (i >= lista.length) { fim(); return; }
      const u = new window.SpeechSynthesisUtterance(lista[i]);
      u.lang = "pt-BR";
      if (vozEscolhida || escolherVoz()) u.voice = vozEscolhida;
      u.rate = config.lenta ? 0.8 : 0.95;
      let terminou = false;
      // Segurança: se a voz não avisar que terminou, segue mesmo assim.
      const seguranca = window.setTimeout(function () {
        if (!terminou) { terminou = true; i++; proxima(); }
      }, tempoEstimado(lista[i]) * 2 + 2000);
      u.onend = u.onerror = function () {
        if (terminou) return;
        terminou = true;
        window.clearTimeout(seguranca);
        i++;
        window.setTimeout(proxima, 120);
      };
      window.speechSynthesis.speak(u);
    }
    proxima();
  }

  /* Fala um texto. Interrompe a fala anterior.
     opcoes.aoTerminar: chamada quando a fala acaba.
     opcoes.naoGuardar: não guarda como "última fala" (para a barra de espaço). */
  function falar(texto, opcoes) {
    opcoes = opcoes || {};
    parar();
    if (!texto) { if (opcoes.aoTerminar) opcoes.aoTerminar(); return; }
    if (!opcoes.naoGuardar) ultima = texto;
    dizer(texto, ficha, opcoes.aoTerminar);
  }

  function repetir(aoTerminar) {
    falar(ultima || "", { aoTerminar: aoTerminar });
  }

  /* =================== SONS =================== */
  let ctx = null;
  let ruido = null;

  function contexto() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }

  function bufferRuido(c) {
    if (ruido) return ruido;
    ruido = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ruido;
  }

  // Um "toque" simples: frequência, início, duração, volume, forma da onda.
  function nota(c, f, t, dur, vol, tipo, destino) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = tipo || "sine";
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(destino || c.destination);
    o.start(t); o.stop(t + dur + 0.05);
    return o;
  }

  function chiado(c, t, dur, vol, filtro, freq) {
    const s = c.createBufferSource();
    s.buffer = bufferRuido(c);
    const f = c.createBiquadFilter();
    f.type = filtro || "highpass";
    f.frequency.value = freq || 3000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(c.destination);
    s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
  }

  const EFEITOS = {
    // Som alegre de figurinha nova.
    figurinha: function (c, t) { [523, 659, 784, 1047, 1319].forEach(function (f, i) { nota(c, f, t + i * 0.11, 0.35, 0.2, "triangle"); }); return 1.0; },
    // Acerto.
    certo: function (c, t) { [659, 880].forEach(function (f, i) { nota(c, f, t + i * 0.12, 0.25, 0.2, "triangle"); }); return 0.4; },
    // Tentar de novo: suave, sem ser "feio".
    tentar: function (c, t) { [440, 392].forEach(function (f, i) { nota(c, f, t + i * 0.15, 0.25, 0.12, "sine"); }); return 0.45; },
    // Andar pelo menu.
    mover: function (c, t) { nota(c, 880, t, 0.06, 0.08, "sine"); return 0.08; },
    // Uma semente caindo na casa.
    semente: function (c, t) { nota(c, 1200, t, 0.05, 0.18, "triangle"); nota(c, 750, t + 0.02, 0.08, 0.12, "sine"); return 0.12; },
    // Captura de sementes.
    captura: function (c, t) { for (let i = 0; i < 5; i++) nota(c, 900 + i * 120, t + i * 0.06, 0.08, 0.14, "triangle"); return 0.4; },
    // Festa: estação ou álbum completo.
    festa: function (c, t) { [523, 659, 784, 659, 784, 1047].forEach(function (f, i) { nota(c, f, t + i * 0.14, 0.3, 0.2, "triangle"); }); return 1.0; },
    // Braille: cada ponto apertado.
    ponto: function (c, t) { nota(c, 600, t, 0.05, 0.1, "square"); return 0.06; },
    // Terra-Mar.
    terra: function (c, t) { tambor(c, t, 110, 0.5); tambor(c, t + 0.25, 110, 0.4); return 0.6; },
    mar: function (c, t) { chiado(c, t, 1.0, 0.18, "lowpass", 900); chiado(c, t + 0.4, 0.9, 0.12, "lowpass", 700); return 1.2; }
  };

  function tambor(c, t, grave, vol) {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(grave * 1.8, t);
    o.frequency.exponentialRampToValueAtTime(grave * 0.7, t + 0.18);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 0.5);
  }

  /* ----- Instrumentos -----
     Os sons são calculados em js/instrumentos.js (imitando como cada
     instrumento vibra) e guardados para tocar de novo sem recalcular. */
  const guardados = {};
  let eco = null;

  function tocarInstrumento(c, t, nome) {
    if (typeof INSTRUMENTOS_SOM === "undefined") return 0;
    if (!guardados[nome]) {
      const g = INSTRUMENTOS_SOM.gerar(nome, c.sampleRate);
      if (!g) return 0;
      const buf = c.createBuffer(1, g.som.length, c.sampleRate);
      buf.getChannelData(0).set(g.som);
      guardados[nome] = { buf: buf, dur: g.dur };
    }
    if (!eco) {
      const ir = INSTRUMENTOS_SOM.ecoDeSala(c.sampleRate);
      eco = c.createConvolver();
      const b = c.createBuffer(1, ir.length, c.sampleRate);
      b.getChannelData(0).set(ir);
      eco.buffer = b;
      const volEco = c.createGain();
      volEco.gain.value = 0.18;
      eco.connect(volEco); volEco.connect(c.destination);
    }
    const fonte = c.createBufferSource();
    fonte.buffer = guardados[nome].buf;
    const vol = c.createGain();
    vol.gain.value = 0.8;
    fonte.connect(vol);
    vol.connect(c.destination);
    vol.connect(eco);
    fonte.start(t);
    return guardados[nome].dur;
  }

  const INSTRUMENTOS = {};
  ["berimbau", "atabaque", "agogo", "ganza", "kalimba"].forEach(function (nome) {
    INSTRUMENTOS[nome] = function (c, t) { return tocarInstrumento(c, t, nome); };
  });

  // Toca um efeito ou instrumento e avisa quando acabar.
  function tocar(nome, aoTerminar) {
    const c = contexto();
    let dur = 0.3;
    if (c) {
      const t = c.currentTime + 0.03;
      const f = INSTRUMENTOS[nome] || EFEITOS[nome];
      try { if (f) dur = f(c, t); } catch (e) { /* sem som */ }
    }
    if (aoTerminar) window.setTimeout(aoTerminar, dur * 1000 + 150);
    return dur;
  }

  return {
    falar: falar,
    repetir: repetir,
    parar: parar,
    tocar: tocar,
    // Para preparar o som depois do primeiro toque no teclado ou clique.
    destravar: function () { contexto(); },
    configurar: function (c) { config.ligada = c.ligada !== false; config.lenta = !!c.lenta; },
    temSintese: temSintese,
    instrumentos: Object.keys(INSTRUMENTOS)
  };
})();
