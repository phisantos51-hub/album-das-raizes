/*
  ÁLBUM DAS RAÍZES — SONS DOS INSTRUMENTOS (Modo Áudio)
  =====================================================
  Os sons são CALCULADOS pelo próprio jogo, sem gravações e sem internet.
  Cada instrumento imita o jeito como ele vibra de verdade:

  - berimbau: uma corda de aço batida por uma vareta (modelo de corda
    "Karplus-Strong"). A cabaça funciona como uma caixa de ressonância
    que o tocador afasta e aproxima da barriga, fazendo o "uóm". A moeda
    (dobrão) encostada de leve faz o "tch"; apertada, deixa a nota mais
    aguda ("dim"). O caxixi chacoalha junto.
  - atabaque: um couro esticado vibra em vários modos ao mesmo tempo,
    com o som grave (mão no centro), o som aberto e o tapa.
  - agogô: dois sinos de metal com sobretons de sino, batidos com vareta.
  - ganzá: muitas sementinhas batendo na parede do tubo a cada chacoalhada.
  - kalimba: lâminas de metal puxadas com o polegar, que soam e somem
    devagar, numa caixinha de madeira.

  gerar(nome, taxa) devolve o som pronto (uma lista de números) e a
  duração. js/voz.js toca esse som com um pouco de eco de sala.
*/

const INSTRUMENTOS_SOM = (function () {
  "use strict";

  /* ---------- Ferramentas ---------- */

  // Números "aleatórios" sempre iguais, para o som ser igual toda vez.
  function sorteio(semente) {
    let s = semente >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296 * 2 - 1;
    };
  }

  function somarEm(destino, origem, inicio, volume) {
    for (let i = 0; i < origem.length && inicio + i < destino.length; i++) destino[inicio + i] += origem[i] * volume;
  }

  function normalizar(s, pico) {
    let max = 0;
    for (let i = 0; i < s.length; i++) max = Math.max(max, Math.abs(s[i]));
    if (max > 0) for (let i = 0; i < s.length; i++) s[i] = s[i] / max * pico;
    // Entrada e saída suaves, sem estalos.
    const borda = Math.min(256, s.length);
    for (let i = 0; i < borda; i++) { s[s.length - 1 - i] *= i / borda; }
    return s;
  }

  // Filtro "biquad" (passa-faixa, passa-baixa, passa-alta) calculado aqui mesmo.
  function filtro(tipo, taxa, freq, q) {
    let b0, b1, b2, a1, a2, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    function ajustar(f) {
      const w = 2 * Math.PI * Math.min(f, taxa * 0.45) / taxa;
      const al = Math.sin(w) / (2 * q);
      const cw = Math.cos(w);
      const a0 = 1 + al;
      if (tipo === "faixa") { b0 = al / a0; b1 = 0; b2 = -al / a0; }
      else if (tipo === "baixa") { b0 = (1 - cw) / 2 / a0; b1 = (1 - cw) / a0; b2 = b0; }
      else { b0 = (1 + cw) / 2 / a0; b1 = -(1 + cw) / a0; b2 = b0; }
      a1 = -2 * cw / a0; a2 = (1 - al) / a0;
    }
    ajustar(freq);
    return {
      ajustar: ajustar,
      passo: function (x) {
        const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1; x1 = x; y2 = y1; y1 = y;
        return y;
      }
    };
  }

  /* Corda (Karplus-Strong): uma "fila" de valores que circula e perde
     energia, como uma corda vibrando.
     f0: nota; seg: duração; t60: em quantos segundos o som quase some;
     brilho: 0 (abafado) a 1 (metálico); ataque: 0 (macio) a 1 (seco). */
  function corda(taxa, f0, seg, t60, brilho, ataque, semente) {
    const n = Math.max(2, Math.round(taxa / f0));
    const fila = new Float32Array(n);
    const r = sorteio(semente);
    // A vareta bate perto da ponta: excitação curta e brilhante.
    let anterior = 0;
    const suavizar = 1 - ataque * 0.85;
    for (let i = 0; i < n; i++) {
      const pos = i / n;
      const janela = pos < 0.35 ? Math.sin(Math.PI * pos / 0.35) : 0;
      anterior = anterior * suavizar + r() * (1 - suavizar);
      fila[i] = anterior * janela;
    }
    const total = Math.ceil(taxa * seg);
    const saida = new Float32Array(total);
    const perda = Math.pow(0.001, 1 / (t60 * f0));
    const mistura = 0.5 - brilho * 0.42; // menos média = mais brilho
    let k = 0;
    for (let i = 0; i < total; i++) {
      const atual = fila[k];
      const prox = fila[(k + 1) % n];
      saida[i] = atual;
      fila[k] = perda * ((1 - mistura) * atual + mistura * prox);
      k = (k + 1) % n;
    }
    return saida;
  }

  // Som que soa e some: soma de "modos" (frequências) com quedas diferentes.
  function modos(taxa, seg, f0, lista, glide, semente, ruido) {
    const total = Math.ceil(taxa * seg);
    const s = new Float32Array(total);
    // Cada modo é calculado por "giro" (seno e cosseno atualizados por
    // multiplicação), bem mais rápido que calcular o seno a cada amostra.
    // O cálculo para quando o modo já ficou inaudível.
    const ataque = Math.exp(-1 / (taxa * 0.0015));
    for (let m = 0; m < lista.length; m++) {
      const md = lista[m];
      const queda = Math.exp(-6.9 / (taxa * md[2]));
      const fim = Math.min(total, Math.ceil(taxa * md[2] * 1.4));
      let amp = md[1], subida = 1;
      let sen = 0, cos = 1;
      let w = 2 * Math.PI * f0 * md[0] / taxa;
      let cw = Math.cos(w), sw = Math.sin(w);
      for (let i = 0; i < fim; i++) {
        if (glide && i % 32 === 0) {
          const curva = 1 + glide.quanto * Math.exp(-(i / taxa) / glide.tempo);
          w = 2 * Math.PI * f0 * md[0] * curva / taxa;
          cw = Math.cos(w); sw = Math.sin(w);
        }
        const ns = sen * cw + cos * sw;
        cos = cos * cw - sen * sw;
        sen = ns;
        subida *= ataque;
        s[i] += amp * (1 - subida) * sen;
        amp *= queda;
      }
    }
    if (ruido) {
      // Batida da mão ou da vareta: um pouquinho de ruído no começo.
      const r = sorteio(semente);
      const f = filtro("faixa", taxa, ruido.freq, ruido.q || 1.2);
      const dur = Math.ceil(taxa * ruido.dur);
      for (let i = 0; i < dur && i < total; i++) s[i] += f.passo(r()) * ruido.vol * Math.exp(-i / taxa * 6.9 / ruido.dur);
    }
    return s;
  }

  /* Chacoalhada: muitos grãos batendo (caxixi e ganzá). */
  function chacoalho(taxa, dur, graos, centro, volume, semente) {
    const total = Math.ceil(taxa * (dur + 0.05));
    const s = new Float32Array(total);
    const r = sorteio(semente);
    for (let g = 0; g < graos; g++) {
      // Mais grãos no começo da chacoalhada.
      const u = (r() + 1) / 2;
      const inicio = Math.floor(Math.pow(u, 1.6) * dur * taxa);
      const amp = (0.3 + (r() + 1) / 2 * 0.7) * volume;
      const len = Math.floor(taxa * 0.0012);
      for (let i = 0; i < len && inicio + i < total; i++) s[inicio + i] += r() * amp * Math.exp(-i / (len / 4));
    }
    const fa = filtro("faixa", taxa, centro, 1.1);
    const fb = filtro("alta", taxa, 2200, 0.7);
    for (let i = 0; i < total; i++) s[i] = fb.passo(fa.passo(s[i]));
    return s;
  }

  /* ---------- BERIMBAU ---------- */
  function berimbau(taxa) {
    const seg = 4.6;
    const out = new Float32Array(Math.ceil(taxa * seg));
    const DOM = 110;        // corda solta
    const DIM = 123.5;      // com a moeda apertada (um tom acima)
    const batida = 0.36;    // tempo entre as batidas

    // Toque: "tch, tch, dom, dim" duas vezes (um toque de capoeira comum).
    const toques = [];
    for (let rep = 0; rep < 2; rep++) {
      const b = rep * batida * 6;
      toques.push(["tch", b], ["tch", b + batida], ["dom", b + batida * 2], ["dim", b + batida * 4]);
    }
    toques.forEach(function (tq, idx) {
      const ini = Math.floor(tq[1] * taxa);
      let nota;
      if (tq[0] === "tch") {
        // Moeda encostada de leve: som curto, chiado e "zumbido".
        nota = corda(taxa, DIM * 1.01, 0.25, 0.09, 0.9, 1, 11 + idx);
        for (let i = 0; i < nota.length; i++) nota[i] = Math.tanh(nota[i] * 3) * 0.5;
      } else {
        const f = tq[0] === "dom" ? DOM : DIM;
        nota = corda(taxa, f, 1.6, 1.8, 0.85, 1, 31 + idx);
        // A cabaça: ressonância que se abre ("uóm") quando o tocador
        // afasta a cabaça da barriga.
        const res = filtro("faixa", taxa, 380, 3.5);
        for (let i = 0; i < nota.length; i++) {
          if (i % 64 === 0) {
            const t = i / taxa;
            res.ajustar(380 + 520 * (1 - Math.exp(-t / 0.18)));
          }
          nota[i] = nota[i] * 0.55 + res.passo(nota[i]) * 1.6;
        }
      }
      somarEm(out, nota, ini, tq[0] === "tch" ? 0.7 : 1);
      // O caxixi chacoalha a cada batida.
      somarEm(out, chacoalho(taxa, 0.07, 45, 5200, 0.5, 77 + idx), ini, 0.35);
    });
    return { som: normalizar(out, 0.85), dur: seg };
  }

  /* ---------- ATABAQUE ---------- */
  // Modos de um couro redondo (proporções da física das membranas).
  const MEMBRANA = [[1, 1, 0.55], [1.59, 0.55, 0.3], [2.14, 0.35, 0.22], [2.3, 0.3, 0.2], [2.65, 0.2, 0.16], [2.92, 0.15, 0.12], [3.16, 0.1, 0.1]];

  function batidaAtabaque(taxa, tipo, semente) {
    if (tipo === "grave") { // mão no centro: grave e encorpado
      return modos(taxa, 0.9, 72, [[1, 1, 0.7], [1.59, 0.25, 0.25], [2.14, 0.1, 0.15]], { quanto: 0.18, tempo: 0.03 }, semente, { freq: 400, dur: 0.03, vol: 0.4 });
    }
    if (tipo === "aberto") { // dedos na borda: som aberto, cantado
      return modos(taxa, 0.8, 118, MEMBRANA, { quanto: 0.1, tempo: 0.025 }, semente, { freq: 1500, dur: 0.02, vol: 0.5 });
    }
    // tapa: estalo seco
    return modos(taxa, 0.35, 150, MEMBRANA.map(function (m) { return [m[0], m[1] * 0.7, m[2] * 0.3]; }), { quanto: 0.08, tempo: 0.02 }, semente, { freq: 2600, dur: 0.05, vol: 1.6, q: 0.9 });
  }

  function atabaque(taxa) {
    const seg = 3.3;
    const out = new Float32Array(Math.ceil(taxa * seg));
    const b = 0.2; // colcheia
    const ritmo = [["grave", 0], ["aberto", 2], ["aberto", 3], ["tapa", 4], ["aberto", 6], ["aberto", 7],
                   ["grave", 8], ["aberto", 10], ["aberto", 11], ["tapa", 12], ["grave", 14]];
    ritmo.forEach(function (x, i) {
      somarEm(out, batidaAtabaque(taxa, x[0], 100 + i), Math.floor(x[1] * b * taxa), x[0] === "tapa" ? 0.8 : 1);
    });
    return { som: normalizar(out, 0.9), dur: seg };
  }

  /* ---------- AGOGÔ ---------- */
  // Sobretons de sino de metal (não são múltiplos exatos da nota).
  function sino(taxa, f, semente) {
    return modos(taxa, 1.4, f, [[1, 1, 1.1], [2.03, 0.35, 0.5], [2.76, 0.45, 0.6], [4.07, 0.2, 0.3], [5.4, 0.18, 0.2], [6.8, 0.08, 0.12]],
      null, semente, { freq: 5000, dur: 0.008, vol: 0.9 });
  }

  function agogo(taxa) {
    const seg = 3.6;
    const out = new Float32Array(Math.ceil(taxa * seg));
    const sc = 0.15; // semicolcheia
    const AGUDO = 880, GRAVE = 622; // sino pequeno e sino grande
    const ritmo = [["a", 0], ["a", 2], ["g", 3], ["a", 5], ["g", 6], ["g", 8],
                   ["a", 10], ["a", 12], ["g", 13], ["a", 15], ["g", 16], ["g", 18]];
    ritmo.forEach(function (x, i) {
      somarEm(out, sino(taxa, x[0] === "a" ? AGUDO : GRAVE, 200 + i), Math.floor(x[1] * sc * taxa), x[0] === "a" ? 0.9 : 1);
    });
    return { som: normalizar(out, 0.8), dur: seg };
  }

  /* ---------- GANZÁ ---------- */
  function ganza(taxa) {
    const seg = 2.8;
    const out = new Float32Array(Math.ceil(taxa * seg));
    const sc = 0.15;
    for (let i = 0; i < 16; i++) {
      // Acento no tempo e na "volta" do braço (como no samba).
      const acento = i % 4 === 0 ? 1 : i % 4 === 2 ? 0.75 : 0.45;
      somarEm(out, chacoalho(taxa, 0.09, 140, i % 2 ? 4200 : 5600, acento, 300 + i), Math.floor(i * sc * taxa), 1);
    }
    return { som: normalizar(out, 0.75), dur: seg };
  }

  /* ---------- KALIMBA ---------- */
  function lamina(taxa, f, semente) {
    // Nota principal longa, um sobretom agudo que some rápido (a lâmina)
    // e um pouco de som da caixa de madeira.
    return modos(taxa, 2.4, f, [[1, 1, 2.2], [2, 0.06, 0.6], [5.9, 0.22, 0.18], [0.5, 0.05, 0.5]],
      null, semente, { freq: 3000, dur: 0.006, vol: 0.4 });
  }

  function kalimba(taxa) {
    const seg = 5;
    const out = new Float32Array(Math.ceil(taxa * seg));
    const notas = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 587.33, 523.25, 392, 523.25];
    const tempos = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0];
    notas.forEach(function (f, i) { somarEm(out, lamina(taxa, f, 400 + i), Math.floor(tempos[i] * taxa), i === notas.length - 1 ? 1 : 0.8); });
    return { som: normalizar(out, 0.8), dur: seg };
  }

  const GERADORES = { berimbau: berimbau, atabaque: atabaque, agogo: agogo, ganza: ganza, kalimba: kalimba };

  // Eco de sala pequena (para o som não ficar "seco").
  function ecoDeSala(taxa) {
    const len = Math.floor(taxa * 0.7);
    const s = new Float32Array(len);
    const r = sorteio(999);
    for (let i = 0; i < len; i++) s[i] = r() * Math.exp(-i / taxa * 6.9 / 0.55);
    return s;
  }

  return {
    nomes: Object.keys(GERADORES),
    gerar: function (nome, taxa) { return GERADORES[nome] ? GERADORES[nome](taxa) : null; },
    ecoDeSala: ecoDeSala
  };
})();
