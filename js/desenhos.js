/*
  ÁLBUM DAS RAÍZES — DESENHOS
  ===========================
  Todas as ilustrações do jogo são desenhadas aqui, em código (SVG).
  Não há fotos nem imagens tiradas da internet.

  Cada desenho é uma função que devolve o desenho num quadrado de 100 x 100.
  Para usar um desenho numa figurinha, coloque o nome dele no campo
  "desenho" do arquivo js/conteudo.js (por exemplo, desenho: "livro").

  As pessoas desenhadas (crianças e adultos nas cenas) usam vários tons de
  pele e estilos de cabelo. As figurinhas das personalidades NÃO têm rostos:
  usam objetos ligados ao que cada pessoa fez.
*/

const DESENHOS = (function () {
  // Contorno escuro usado em todos os desenhos (alto contraste).
  const C = "#2b2118";
  const L = 'stroke="' + C + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';

  // Tons de pele e de cabelo variados para as pessoas das cenas.
  const PELE = ["#5c3a21", "#8d5524", "#a86b3c", "#c68642", "#3d2314", "#7a4a2a"];
  const CABELO = "#1c120c";

  /* Cabeça simples e sorridente. estilo do cabelo:
     "crespo" (black power), "trancas", "coque", "curto", "cachos" */
  function cabeca(x, y, r, pele, estilo) {
    let cab = "";
    if (estilo === "crespo") {
      cab = '<circle cx="' + x + '" cy="' + (y - r * 0.35) + '" r="' + (r * 1.45) + '" fill="' + CABELO + '"/>';
    } else if (estilo === "coque") {
      cab = '<circle cx="' + x + '" cy="' + (y - r * 1.25) + '" r="' + (r * 0.6) + '" fill="' + CABELO + '"/>' +
        '<path d="M' + (x - r * 1.05) + ' ' + y + ' Q' + x + ' ' + (y - r * 1.9) + ' ' + (x + r * 1.05) + ' ' + y + ' Z" fill="' + CABELO + '"/>';
    } else if (estilo === "trancas") {
      cab = '<path d="M' + (x - r * 1.1) + ' ' + (y + r * 0.2) + ' Q' + x + ' ' + (y - r * 2) + ' ' + (x + r * 1.1) + ' ' + (y + r * 0.2) + ' Z" fill="' + CABELO + '"/>';
      for (let i = -1; i <= 1; i += 2) {
        cab += '<path d="M' + (x + i * r * 0.95) + ' ' + y + ' L' + (x + i * r * 1.15) + ' ' + (y + r * 1.6) + '" stroke="' + CABELO + '" stroke-width="' + (r * 0.35) + '" stroke-linecap="round"/>' +
          '<circle cx="' + (x + i * r * 1.15) + '" cy="' + (y + r * 1.7) + '" r="' + (r * 0.22) + '" fill="#e63946"/>';
      }
    } else if (estilo === "cachos") {
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + (i / 6) * Math.PI;
        cab += '<circle cx="' + (x + Math.cos(a) * r) + '" cy="' + (y + Math.sin(a) * r * 0.95) + '" r="' + (r * 0.45) + '" fill="' + CABELO + '"/>';
      }
    } else {
      cab = '<path d="M' + (x - r) + ' ' + (y - r * 0.1) + ' Q' + x + ' ' + (y - r * 1.55) + ' ' + (x + r) + ' ' + (y - r * 0.1) + ' Z" fill="' + CABELO + '"/>';
    }
    const rosto = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + pele + '" stroke="' + C + '" stroke-width="2"/>' +
      '<circle cx="' + (x - r * 0.35) + '" cy="' + (y - r * 0.1) + '" r="' + (r * 0.11) + '" fill="' + C + '"/>' +
      '<circle cx="' + (x + r * 0.35) + '" cy="' + (y - r * 0.1) + '" r="' + (r * 0.11) + '" fill="' + C + '"/>' +
      '<path d="M' + (x - r * 0.35) + ' ' + (y + r * 0.35) + ' Q' + x + ' ' + (y + r * 0.65) + ' ' + (x + r * 0.35) + ' ' + (y + r * 0.35) + '" stroke="' + C + '" stroke-width="2" fill="none" stroke-linecap="round"/>';
    // Nos estilos com franja, o cabelo fica por cima da testa.
    if (estilo === "curto" || estilo === "trancas" || estilo === "coque") {
      const franja = '<path d="M' + (x - r) + ' ' + (y - r * 0.1) + ' Q' + x + ' ' + (y - r * 1.55) + ' ' + (x + r) + ' ' + (y - r * 0.1) + ' Q' + x + ' ' + (y - r * 0.75) + ' ' + (x - r) + ' ' + (y - r * 0.1) + ' Z" fill="' + CABELO + '"/>';
      return cab + rosto + franja;
    }
    return cab + rosto;
  }

  // Ponto (lon, lat) do contorno da África, usado no mapa e no quebra-cabeça.
  const AFRICA_PONTOS = [
    [-5.8, 35.8], [-2, 35.2], [3, 36.8], [10, 37.2], [11, 36.8], [10.2, 34], [11.5, 33.1],
    [15, 32.4], [19, 30.4], [20, 32.1], [23, 32.6], [25, 31.6], [29.9, 31.2], [32.3, 31.3],
    [32.6, 29.9], [33.6, 27.3], [35.5, 24], [37.2, 21], [38.5, 18], [39.6, 15.5], [41.7, 13.4],
    [43.3, 11.8], [44.5, 10.4], [51.2, 11.8], [51, 10.4], [49.5, 6.8], [48, 4.6], [45.3, 2],
    [42, -1], [40.2, -3], [39.3, -6.8], [40.5, -10.5], [40.7, -14.5], [39, -17], [34.8, -19.8],
    [35.5, -22], [35.5, -24], [32.6, -25.9], [32.6, -28], [31, -29.8], [27.9, -33], [25.6, -33.9],
    [20, -34.8], [18.4, -34.3], [18, -32.5], [16.5, -28.6], [15, -26.6], [14.5, -22.9],
    [11.8, -17.3], [12.4, -13.5], [13.4, -12.6], [13.2, -8.8], [12.3, -6], [11.8, -4.8],
    [9, -1], [9.5, 2], [9.7, 4], [8.5, 4.5], [6, 4.3], [3.4, 6.4], [1.2, 6.1], [-0.2, 5.6],
    [-2, 4.8], [-4, 5.2], [-7.5, 4.4], [-10.8, 6.3], [-13.2, 8.5], [-15, 10.8], [-16.7, 12.5],
    [-17.5, 14.7], [-16.5, 16.5], [-16, 18], [-16.5, 20], [-17, 21], [-14.8, 24], [-13, 27.7],
    [-9.8, 30], [-9.5, 32.5], [-7.6, 33.6], [-6.8, 34]
  ];
  const MADAGASCAR = [
    [49.3, -12], [50.5, -15.5], [49.7, -17], [48, -22], [47, -25], [45, -25.5], [43.7, -23.5],
    [43.3, -21.5], [44.4, -19.5], [44, -17], [46, -15.7], [47.8, -13.5]
  ];

  // Converte longitude e latitude em posição na tela do mapa (600 x 600).
  // O mapa vai de 20° W a 55° E e de 38° N a 37° S.
  function projetar(lon, lat) {
    return [(lon + 20) * 8, (38 - lat) * 8];
  }
  function caminho(pontos) {
    return "M" + pontos.map(function (p) {
      const xy = projetar(p[0], p[1]);
      return xy[0].toFixed(1) + " " + xy[1].toFixed(1);
    }).join(" L") + " Z";
  }
  const AFRICA_CAMINHO = caminho(AFRICA_PONTOS) + " " + caminho(MADAGASCAR);

  // Moldura: todos os desenhos usam viewBox 0 0 100 100.
  function svg(conteudo, rotulo) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" ' +
      (rotulo ? 'role="img" aria-label="' + rotulo + '"' : 'aria-hidden="true" focusable="false"') + '>' + conteudo + '</svg>';
  }

  const D = {};

  /* ===== Figurinhas da Estação 1 (objetos, sem rostos) ===== */

  D.palmeira = function () { // Zumbi: Palmares
    return '<rect x="0" y="78" width="100" height="22" fill="#7cb342"/>' +
      '<path d="M50 85 Q46 60 52 30" stroke="#8d6e63" stroke-width="7" fill="none" stroke-linecap="round"/>' +
      '<path d="M52 30 Q30 18 12 32 Q32 26 52 30 Z M52 30 Q72 16 90 30 Q70 25 52 30 Z M52 30 Q38 34 26 52 Q42 36 52 30 Z M52 30 Q66 36 78 52 Q62 36 52 30 Z M52 30 Q50 16 56 6 Q54 20 52 30 Z" fill="#2e7d32" ' + L + '/>' +
      '<circle cx="48" cy="33" r="4" fill="#795548"/><circle cx="56" cy="34" r="4" fill="#795548"/>' +

      '<circle cx="82" cy="14" r="8" fill="#ffca28"/>';
  };

  D.estrela = function () { // Dandara: estrela entre folhas de palmeira
    return '<path d="M22 88 Q10 60 24 34" stroke="#2e7d32" stroke-width="5" fill="none"/>' +
      '<path d="M78 88 Q90 60 76 34" stroke="#2e7d32" stroke-width="5" fill="none"/>' +
      [0, 1, 2, 3].map(function (i) {
        const y = 80 - i * 13;
        return '<ellipse cx="' + (16 - i) + '" cy="' + y + '" rx="7" ry="3.5" fill="#43a047" transform="rotate(-35 ' + (16 - i) + ' ' + y + ')"/>' +
          '<ellipse cx="' + (84 + i) + '" cy="' + y + '" rx="7" ry="3.5" fill="#43a047" transform="rotate(35 ' + (84 + i) + ' ' + y + ')"/>';
      }).join("") +
      '<path d="M50 12 L60 38 L88 39 L66 56 L74 83 L50 67 L26 83 L34 56 L12 39 L40 38 Z" fill="#ffca28" ' + L + '/>' +
      '<path d="M50 30 L54 42 L66 43 L56 50 L60 62 L50 55 L40 62 L44 50 L34 43 L46 42 Z" fill="#fff59d"/>';
  };

  D.diario = function () { // Carolina: caderno/diário com lápis
    return '<rect x="20" y="12" width="56" height="76" rx="4" fill="#ef6c00" ' + L + '/>' +
      '<rect x="27" y="12" width="49" height="76" rx="2" fill="#fff8e1" ' + L + '/>' +
      [0, 1, 2, 3, 4, 5, 6].map(function (i) {
        return '<path d="M33 ' + (28 + i * 8) + ' L70 ' + (28 + i * 8) + '" stroke="#90a4ae" stroke-width="2"/>';
      }).join("") +
      '<path d="M33 28 Q40 24 46 28 T60 28" stroke="#1565c0" stroke-width="2.5" fill="none"/>' +
      '<path d="M33 36 Q42 32 50 36 T66 36" stroke="#1565c0" stroke-width="2.5" fill="none"/>' +
      [16, 26, 36, 46, 56, 66, 76].map(function (y) { return '<circle cx="23.5" cy="' + y + '" r="2" fill="' + C + '"/>'; }).join("") +
      '<g transform="rotate(35 70 70)"><rect x="64" y="40" width="10" height="46" fill="#fdd835" ' + L + '/><path d="M64 86 L69 96 L74 86 Z" fill="#ffe0b2" ' + L + '/><rect x="64" y="40" width="10" height="7" fill="#e57373" ' + L + '/></g>';
  };

  D.livro = function () { // Machado: livro aberto com pena
    return '<path d="M8 30 Q30 22 50 32 Q70 22 92 30 L92 82 Q70 74 50 84 Q30 74 8 82 Z" fill="#1565c0" ' + L + '/>' +
      '<path d="M12 28 Q30 20 50 30 L50 80 Q30 70 12 78 Z" fill="#fffde7" ' + L + '/>' +
      '<path d="M88 28 Q70 20 50 30 L50 80 Q70 70 88 78 Z" fill="#fffde7" ' + L + '/>' +
      [0, 1, 2, 3].map(function (i) {
        return '<path d="M18 ' + (38 + i * 9) + ' Q30 ' + (33 + i * 9) + ' 44 ' + (40 + i * 9) + '" stroke="#90a4ae" stroke-width="2" fill="none"/>' +
          '<path d="M56 ' + (40 + i * 9) + ' Q70 ' + (33 + i * 9) + ' 82 ' + (38 + i * 9) + '" stroke="#90a4ae" stroke-width="2" fill="none"/>';
      }).join("") +
      '<path d="M70 4 Q86 8 84 26 L66 30 Q64 14 70 4 Z" fill="#fff" ' + L + '/><path d="M66 30 L82 8" ' + L + '/>';
  };

  D.medalha = function () { // Rebeca: medalha de ouro
    return '<path d="M30 6 L44 46 L56 46 L42 6 Z" fill="#43a047" ' + L + '/>' +
      '<path d="M70 6 L56 46 L44 46 L58 6 Z" fill="#fdd835" ' + L + '/>' +
      '<circle cx="50" cy="66" r="26" fill="#ffc107" ' + L + '/>' +
      '<circle cx="50" cy="66" r="18" fill="#ffe082" stroke="#b28704" stroke-width="2"/>' +
      '<path d="M50 54 L54 63 L64 63 L56 69 L59 78 L50 72 L41 78 L44 69 L36 63 L46 63 Z" fill="#ff8f00"/>';
  };

  D.violao = function () { // Gilberto Gil: violão e notas
    return '<g transform="rotate(-30 50 55)">' +
      '<rect x="46" y="4" width="8" height="46" fill="#6d4c41" ' + L + '/>' +
      '<rect x="43" y="0" width="14" height="10" rx="2" fill="#4e342e" ' + L + '/>' +
      '<path d="M50 44 C30 44 30 60 36 64 C26 70 28 94 50 94 C72 94 74 70 64 64 C70 60 70 44 50 44 Z" fill="#ffa726" ' + L + '/>' +
      '<circle cx="50" cy="68" r="7" fill="' + C + '"/>' +
      '<rect x="42" y="82" width="16" height="4" fill="#4e342e"/>' +
      '<path d="M48 10 L48 84 M52 10 L52 84" stroke="#eeeeee" stroke-width="1"/></g>' +
      '<path d="M78 20 L78 38 M78 20 L90 16 L90 34" stroke="#7b1fa2" stroke-width="3" fill="none"/>' +
      '<circle cx="75" cy="38" r="4" fill="#7b1fa2"/><circle cx="87" cy="34" r="4" fill="#7b1fa2"/>' +
      '<path d="M14 64 L14 80" stroke="#7b1fa2" stroke-width="3"/><circle cx="11" cy="80" r="4" fill="#7b1fa2"/>';
  };

  D.balanca = function () { // Luiz Gama: balança da Justiça
    return '<rect x="30" y="86" width="40" height="8" rx="3" fill="#8d6e63" ' + L + '/>' +
      '<rect x="47" y="20" width="6" height="66" fill="#ffb300" ' + L + '/>' +
      '<circle cx="50" cy="16" r="6" fill="#ffb300" ' + L + '/>' +
      '<path d="M14 30 L86 30" stroke="#ffb300" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M14 30 L4 58 M14 30 L24 58 M86 30 L76 58 M86 30 L96 58" stroke="' + C + '" stroke-width="1.8"/>' +
      '<path d="M2 58 Q14 70 26 58 Z" fill="#ffca28" ' + L + '/>' +
      '<path d="M74 58 Q86 70 98 58 Z" fill="#ffca28" ' + L + '/>';
  };

  D.regua = function () { // Enedina: capacete, esquadro e régua
    return '<path d="M18 52 Q18 22 50 22 Q82 22 82 52 Z" fill="#fdd835" ' + L + '/>' +
      '<rect x="10" y="50" width="80" height="8" rx="4" fill="#fbc02d" ' + L + '/>' +
      '<path d="M44 22 L44 50 M56 22 L56 50" stroke="#f9a825" stroke-width="3"/>' +
      '<path d="M12 66 L12 94 L52 94 Z" fill="#4fc3f7" ' + L + '/><path d="M20 80 L20 88 L30 88 Z" fill="#fffde7" ' + L + '/>' +
      '<rect x="56" y="70" width="40" height="12" fill="#ffe0b2" ' + L + '/>' +
      [60, 66, 72, 78, 84, 90].map(function (x, i) { return '<path d="M' + x + ' 70 L' + x + ' ' + (i % 2 ? 74 : 77) + '" stroke="' + C + '" stroke-width="1.5"/>'; }).join("");
  };

  D.globo = function () { // Milton Santos: globo terrestre
    return '<path d="M50 88 L50 96 M34 96 L66 96" ' + L + ' fill="none"/>' +
      '<path d="M18 48 A34 34 0 0 0 82 60" stroke="#8d6e63" stroke-width="4" fill="none"/>' +
      '<circle cx="50" cy="48" r="32" fill="#42a5f5" ' + L + '/>' +
      '<path d="M34 26 Q44 22 48 30 Q44 38 50 44 Q46 52 38 50 Q30 44 34 36 Z" fill="#66bb6a" ' + L + '/>' +
      '<path d="M56 34 Q66 28 72 36 Q76 48 68 58 Q64 70 58 64 Q56 54 60 48 Q54 42 56 34 Z" fill="#66bb6a" ' + L + '/>' +
      '<path d="M30 62 Q38 60 42 68 Q36 74 30 70 Z" fill="#66bb6a" ' + L + '/>' +
      '<path d="M18 48 L82 48" stroke="#e3f2fd" stroke-width="1.5" stroke-dasharray="3 3"/>';
  };

  D.pena = function () { // Conceição Evaristo: pena e folha com poema
    return '<rect x="14" y="16" width="56" height="72" rx="3" fill="#fffde7" ' + L + '/>' +
      [0, 1, 2, 3, 4].map(function (i) {
        return '<path d="M22 ' + (32 + i * 11) + ' Q' + (38 + i * 2) + ' ' + (27 + i * 11) + ' ' + (58 - i * 3) + ' ' + (32 + i * 11) + '" stroke="#6a1b9a" stroke-width="2.5" fill="none"/>';
      }).join("") +
      '<path d="M92 6 Q60 20 54 74 Q78 50 92 6 Z" fill="#ce93d8" ' + L + '/>' +
      '<path d="M90 10 L56 72" stroke="#6a1b9a" stroke-width="2"/>' +
      '<path d="M56 72 L50 86" stroke="' + C + '" stroke-width="3" stroke-linecap="round"/>';
  };

  D.mascaras = function () { // Ruth de Souza: máscaras de teatro
    return '<path d="M8 20 Q30 10 50 20 L48 50 Q44 72 28 74 Q12 72 10 50 Z" fill="#ffd54f" ' + L + '/>' +
      '<path d="M18 36 Q22 32 26 36 M34 36 Q38 32 42 36" stroke="' + C + '" stroke-width="3" fill="none"/>' +
      '<path d="M20 52 Q29 64 38 52 Z" fill="' + C + '"/>' +
      '<path d="M52 30 Q72 20 92 30 L90 60 Q86 82 70 84 Q54 82 52 60 Z" fill="#4dd0e1" ' + L + '/>' +
      '<path d="M60 48 Q64 44 68 48 M76 48 Q80 44 84 48" stroke="' + C + '" stroke-width="3" fill="none"/>' +
      '<path d="M62 70 Q71 60 80 70" stroke="' + C + '" stroke-width="3" fill="none"/>' +
      '<path d="M40 76 Q50 92 64 86" stroke="#e53935" stroke-width="3" fill="none"/>';
  };

  D.pegadas = function () { // Adhemar: salto triplo (três saltos na areia)
    return '<rect x="0" y="70" width="100" height="30" fill="#ffe0b2"/>' +
      '<path d="M0 70 L100 70" ' + L + '/>' +
      '<path d="M10 66 Q22 40 34 66 M34 66 Q48 34 62 66 M62 66 Q78 24 94 66" stroke="#e53935" stroke-width="3" stroke-dasharray="5 4" fill="none"/>' +
      [10, 34, 62].map(function (x, i) {
        return '<ellipse cx="' + x + '" cy="80" rx="5" ry="8" fill="#8d6e63"/><text x="' + x + '" y="98" font-size="11" text-anchor="middle" font-weight="bold" fill="' + C + '">' + (i + 1) + '</text>';
      }).join("") +
      '<path d="M86 62 L94 62 L94 70 L86 70 Z" fill="#fdd835" ' + L + '/>' +
      '<circle cx="80" cy="16" r="9" fill="#ffc107" ' + L + '/><path d="M80 10 L82 15 L87 15 L83 18 L84 23 L80 20 L76 23 L77 18 L73 15 L78 15 Z" fill="#ff8f00"/>';
  };

  /* ===== Figurinhas da Estação 2 (países) ===== */

  D.piramides = function () { // Egito
    return '<rect x="0" y="0" width="100" height="72" fill="#81d4fa"/>' +
      '<circle cx="82" cy="18" r="9" fill="#ffca28"/>' +
      '<rect x="0" y="72" width="100" height="28" fill="#ffcc80"/>' +
      '<path d="M4 72 L32 30 L60 72 Z" fill="#ffb74d" ' + L + '/><path d="M32 30 L40 72" stroke="#e65100" stroke-width="2"/>' +
      '<path d="M44 72 L68 38 L92 72 Z" fill="#ffa726" ' + L + '/><path d="M68 38 L74 72" stroke="#e65100" stroke-width="2"/>' +
      '<path d="M0 90 Q25 84 50 90 T100 90" stroke="#1e88e5" stroke-width="5" fill="none"/>';
  };

  D.ola = function () { // Angola: balão de fala "Olá!" e prédios de Luanda à beira-mar
    return '<rect x="0" y="0" width="100" height="100" fill="#e1f5fe"/>' +
      '<rect x="0" y="82" width="100" height="18" fill="#29b6f6"/>' +
      '<rect x="8" y="50" width="14" height="32" fill="#90a4ae" ' + L + '/>' +
      '<rect x="24" y="38" width="16" height="44" fill="#78909c" ' + L + '/>' +
      '<rect x="42" y="56" width="12" height="26" fill="#b0bec5" ' + L + '/>' +
      '<rect x="56" y="44" width="14" height="38" fill="#90a4ae" ' + L + '/>' +
      '<rect x="72" y="58" width="20" height="24" fill="#b0bec5" ' + L + '/>' +
      '<path d="M10 8 L90 8 Q96 8 96 14 L96 30 Q96 36 90 36 L40 36 L30 46 L32 36 L10 36 Q4 36 4 30 L4 14 Q4 8 10 8 Z" fill="#fff" ' + L + '/>' +
      '<text x="50" y="30" font-size="20" font-weight="bold" text-anchor="middle" fill="#c62828" font-family="Verdana, sans-serif">Olá!</text>';
  };

  D.barco = function () { // Moçambique: barco à vela no Oceano Índico
    return '<rect x="0" y="0" width="100" height="62" fill="#b3e5fc"/>' +
      '<circle cx="20" cy="18" r="9" fill="#ffca28"/>' +
      '<rect x="0" y="62" width="100" height="38" fill="#0288d1"/>' +
      '<path d="M50 14 L50 66" ' + L + '/>' +
      '<path d="M52 16 Q84 40 52 62 Z" fill="#fff" ' + L + '/>' +
      '<path d="M24 66 L80 66 L70 78 L32 78 Z" fill="#8d6e63" ' + L + '/>' +
      '<path d="M0 88 Q12 82 25 88 T50 88 T75 88 T100 88" stroke="#e1f5fe" stroke-width="3" fill="none"/>';
  };

  D.claquete = function () { // Nigéria: claquete de cinema
    return '<g transform="rotate(-12 50 30)"><rect x="12" y="20" width="76" height="14" fill="#fff" ' + L + '/>' +
      [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (16 + i * 16) + ' 20 L' + (26 + i * 16) + ' 34 L' + (34 + i * 16) + ' 34 L' + (24 + i * 16) + ' 20 Z" fill="' + C + '"/>'; }).join("") + '</g>' +
      '<rect x="12" y="38" width="76" height="52" fill="#37474f" ' + L + '/>' +
      [0, 1, 2, 3, 4].map(function (i) { return '<path d="M' + (16 + i * 16) + ' 38 L' + (26 + i * 16) + ' 48 L' + (34 + i * 16) + ' 48 L' + (24 + i * 16) + ' 38 Z" fill="#fff"/>'; }).join("") +
      '<path d="M24 60 L76 60 M24 72 L60 72" stroke="#eceff1" stroke-width="3"/>' +
      '<path d="M66 70 L66 84 L78 77 Z" fill="#66bb6a"/>';
  };

  D.kente = function () { // Gana: tecido kente (faixas coloridas)
    let s = '<rect x="6" y="6" width="88" height="88" fill="#ffca28" ' + L + '/>';
    const cores = ["#2e7d32", "#c62828", "#212121", "#2e7d32", "#c62828"];
    for (let i = 0; i < 5; i++) {
      s += '<rect x="' + (10 + i * 17) + '" y="6" width="7" height="88" fill="' + cores[i] + '"/>';
    }
    for (let j = 0; j < 4; j++) {
      s += '<rect x="6" y="' + (14 + j * 22) + '" width="88" height="6" fill="#1565c0" opacity="0.85"/>';
      for (let i = 0; i < 5; i++) {
        s += '<rect x="' + (19 + i * 17) + '" y="' + (22 + j * 22) + '" width="6" height="6" fill="#212121"/>';
      }
    }
    return s + '<rect x="6" y="6" width="88" height="88" fill="none" ' + L + '/>';
  };

  D.bola = function () { // África do Sul: bola de futebol (Copa de 2010)
    return '<rect x="0" y="74" width="100" height="26" fill="#66bb6a"/>' +
      '<circle cx="50" cy="46" r="34" fill="#fff" ' + L + '/>' +
      '<path d="M50 32 L63 41 L58 56 L42 56 L37 41 Z" fill="' + C + '"/>' +
      '<path d="M50 32 L50 14 M63 41 L80 35 M58 56 L68 72 M42 56 L32 72 M37 41 L20 35" ' + L + '/>' +
      '<path d="M44 13 L56 13 L50 19 Z M82 30 L84 42 L77 38 Z M70 76 L62 79 L65 70 Z M30 76 L38 79 L35 70 Z M18 30 L16 42 L23 38 Z" fill="' + C + '"/>';
  };

  D.baoba = function () { // Senegal: baobá
    return '<rect x="0" y="0" width="100" height="78" fill="#fff3e0"/>' +
      '<circle cx="84" cy="16" r="9" fill="#ff7043"/>' +
      '<rect x="0" y="78" width="100" height="22" fill="#d7ccc8"/>' +
      '<path d="M36 82 Q40 56 38 38 L62 38 Q60 56 64 82 Z" fill="#a1887f" ' + L + '/>' +
      '<path d="M40 40 L24 26 M44 38 L40 20 M56 38 L60 18 M60 40 L78 26 M50 38 L50 22" stroke="#8d6e63" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="22" cy="22" r="10" fill="#7cb342"/><circle cx="40" cy="16" r="10" fill="#7cb342"/>' +
      '<circle cx="60" cy="14" r="10" fill="#7cb342"/><circle cx="80" cy="24" r="10" fill="#7cb342"/>' +
      '<circle cx="50" cy="18" r="9" fill="#9ccc65"/>';
  };

  D.girafa = function () { // Quênia: girafa perto dos prédios de Nairóbi
    return '<rect x="0" y="0" width="100" height="100" fill="#e3f2fd"/>' +
      '<rect x="56" y="30" width="12" height="56" fill="#90a4ae" ' + L + '/>' +
      '<rect x="70" y="18" width="14" height="68" fill="#78909c" ' + L + '/>' +
      '<rect x="86" y="40" width="10" height="46" fill="#b0bec5" ' + L + '/>' +
      '<rect x="0" y="84" width="100" height="16" fill="#c5e1a5"/>' +
      '<path d="M18 86 L18 64 M38 86 L38 64" stroke="#f9a825" stroke-width="5"/>' +
      '<ellipse cx="28" cy="60" rx="16" ry="9" fill="#ffca28" ' + L + '/>' +
      '<path d="M38 56 L48 20" stroke="#ffca28" stroke-width="9" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="18" rx="8" ry="5" fill="#ffca28" ' + L + '/>' +
      '<path d="M46 12 L45 6 M51 12 L51 6" ' + L + '/>' +
      '<circle cx="52" cy="17" r="1.5" fill="' + C + '"/>' +
      '<circle cx="24" cy="58" r="3" fill="#a1887f"/><circle cx="33" cy="61" r="3" fill="#a1887f"/><circle cx="43" cy="38" r="2.5" fill="#a1887f"/>';
  };

  /* ===== Figurinhas da Estação 3 (brincadeiras) ===== */

  D.terramar = function () { // Terra-Mar: linha no chão, terra e mar, e uma criança pulando
    return '<rect x="0" y="0" width="50" height="100" fill="#a1887f"/>' +
      '<rect x="50" y="0" width="50" height="100" fill="#4fc3f7"/>' +
      '<path d="M50 0 L50 100" stroke="#fff" stroke-width="4" stroke-dasharray="8 5"/>' +
      '<path d="M58 80 Q66 74 74 80 T90 80" stroke="#e1f5fe" stroke-width="3" fill="none"/>' +
      '<text x="25" y="94" font-size="13" text-anchor="middle" font-weight="bold" fill="#fff" font-family="Verdana, sans-serif">TERRA</text>' +
      '<text x="75" y="94" font-size="13" text-anchor="middle" font-weight="bold" fill="' + C + '" font-family="Verdana, sans-serif">MAR</text>' +
      '<path d="M40 54 L36 70 M48 54 L56 66" stroke="' + PELE[1] + '" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="36" y="38" width="14" height="18" rx="5" fill="#ffeb3b" ' + L + '/>' +
      '<path d="M36 42 L26 32 M50 42 L60 32" stroke="' + PELE[1] + '" stroke-width="5" stroke-linecap="round"/>' +
      cabeca(43, 28, 8, PELE[1], "trancas");
  };

  D.oware = function () { // Oware: tabuleiro de mancala com sementes
    let s = '<rect x="4" y="26" width="92" height="48" rx="12" fill="#a1683a" ' + L + '/>';
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 6; i++) {
        const cx = 14 + i * 14.4, cy = 40 + r * 20;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="6.3" fill="#6d4321" stroke="' + C + '" stroke-width="1.5"/>';
        s += '<circle cx="' + (cx - 2) + '" cy="' + (cy - 1.5) + '" r="1.8" fill="#f5deb3"/><circle cx="' + (cx + 2) + '" cy="' + (cy + 1.5) + '" r="1.8" fill="#f5deb3"/>';
      }
    }
    return s;
  };

  D.shisima = function () { // Shisima: tabuleiro octogonal
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 4;
      pts.push([50 + Math.cos(a) * 38, 50 + Math.sin(a) * 38]);
    }
    let s = '<rect x="0" y="0" width="100" height="100" fill="#fff8e1"/>';
    s += '<path d="M' + pts.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + ' Z" fill="#d7ccc8" ' + L + '/>';
    for (let i = 0; i < 4; i++) {
      s += '<path d="M' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1) + ' L' + pts[i + 4][0].toFixed(1) + ' ' + pts[i + 4][1].toFixed(1) + '" ' + L + '/>';
    }
    [0, 1, 7].forEach(function (i) { s += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="6" fill="#fdd835" ' + L + '/>'; });
    [3, 4, 5].forEach(function (i) { s += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="6" fill="#8e24aa" ' + L + '/>'; });
    return s;
  };

  /* ===== Figurinhas da Estação 4 (cultura) ===== */

  D.bebe = function () { // caçula: irmãos e o bebê caçula
    return '<rect x="0" y="80" width="100" height="20" fill="#ffe0b2"/>' +
      '<rect x="8" y="50" width="22" height="34" rx="8" fill="#42a5f5" ' + L + '/>' + cabeca(19, 38, 11, PELE[0], "crespo") +
      '<rect x="36" y="58" width="20" height="26" rx="8" fill="#ef5350" ' + L + '/>' + cabeca(46, 46, 10, PELE[3], "trancas") +
      '<ellipse cx="76" cy="74" rx="16" ry="11" fill="#fff59d" ' + L + '/>' + cabeca(76, 58, 9, PELE[2], "curto") +
      '<path d="M88 40 L96 32 M92 46 L100 44" stroke="#ec407a" stroke-width="2.5"/>' +
      '<path d="M66 30 Q70 22 76 30 Q82 22 86 30 Q86 36 76 42 Q66 36 66 30 Z" fill="#ec407a"/>';
  };

  D.pipa = function () { // moleque: menino soltando pipa
    return '<rect x="0" y="0" width="100" height="100" fill="#e1f5fe"/>' +
      '<rect x="0" y="84" width="100" height="16" fill="#9ccc65"/>' +
      '<path d="M70 6 L88 20 L72 40 L56 22 Z" fill="#ff7043" ' + L + '/><path d="M70 6 L72 40 M56 22 L88 20" stroke="' + C + '" stroke-width="1.5"/>' +
      '<path d="M72 40 Q66 50 74 56 Q66 62 70 70" stroke="#c62828" stroke-width="2" fill="none"/>' +
      '<path d="M72 40 L38 54" stroke="' + C + '" stroke-width="1.2"/>' +
      '<path d="M26 70 L22 86 M34 70 L38 86" stroke="#1565c0" stroke-width="6" stroke-linecap="round"/>' +
      '<rect x="20" y="48" width="20" height="24" rx="6" fill="#fdd835" ' + L + '/>' +
      '<path d="M38 52 L44 46" stroke="' + PELE[4] + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M22 54 L14 64" stroke="' + PELE[4] + '" stroke-width="5" stroke-linecap="round"/>' +
      cabeca(30, 36, 11, PELE[4], "curto");
  };

  D.rede = function () { // cochilo: pessoa cochilando na rede
    return '<rect x="0" y="0" width="100" height="100" fill="#ede7f6"/>' +
      '<path d="M8 10 L8 96 M92 10 L92 96" stroke="#6d4c41" stroke-width="5"/>' +
      '<path d="M8 30 Q50 86 92 30 L92 40 Q50 96 8 40 Z" fill="#ff8a65" ' + L + '/>' +
      '<path d="M8 34 Q50 92 92 34" stroke="#ffd54f" stroke-width="3" fill="none"/>' +
      '<path d="M34 50 Q50 62 70 48" stroke="#5c6bc0" stroke-width="10" stroke-linecap="round" fill="none"/>' +
      '<circle cx="28" cy="46" r="9" fill="' + PELE[2] + '" stroke="' + C + '" stroke-width="2"/>' +
      '<path d="M20 42 Q26 32 36 40" fill="' + CABELO + '"/><circle cx="22" cy="40" r="5" fill="' + CABELO + '"/>' +
      '<path d="M24 46 Q26 48 28 46 M30 46 Q32 48 34 46" stroke="' + C + '" stroke-width="1.5" fill="none"/>' +
      '<text x="48" y="22" font-size="12" font-weight="bold" fill="#5e35b1" font-family="Verdana, sans-serif">Z</text>' +
      '<text x="58" y="14" font-size="15" font-weight="bold" fill="#5e35b1" font-family="Verdana, sans-serif">Z</text>' +
      '<text x="70" y="8" font-size="10" font-weight="bold" fill="#5e35b1" font-family="Verdana, sans-serif">Z</text>';
  };

  D.quitanda = function () { // quitanda: barraca de frutas
    return '<path d="M6 30 L94 30 L86 12 L14 12 Z" fill="#e53935" ' + L + '/>' +
      '<path d="M26 12 L22 30 M42 12 L40 30 M58 12 L60 30 M74 12 L78 30" stroke="#fff" stroke-width="5"/>' +
      '<path d="M12 30 L12 92 M88 30 L88 92" stroke="#6d4c41" stroke-width="4"/>' +
      '<rect x="8" y="62" width="84" height="30" fill="#a1683a" ' + L + '/>' +
      '<circle cx="22" cy="58" r="7" fill="#ff7043" ' + L + '/><circle cx="34" cy="58" r="7" fill="#ff7043" ' + L + '/><circle cx="28" cy="50" r="7" fill="#ff7043" ' + L + '/>' +
      '<path d="M44 58 Q52 40 64 56 Q54 52 44 58 Z" fill="#fdd835" ' + L + '/>' +
      '<circle cx="74" cy="56" r="8" fill="#7cb342" ' + L + '/><circle cx="84" cy="58" r="6" fill="#c62828" ' + L + '/>' +
      '<path d="M20 74 L80 74" stroke="#5d4037" stroke-width="2"/>';
  };

  D.cafune = function () { // cafuné: mão de um adulto fazendo carinho no cabelo de uma criança
    return '<rect x="0" y="0" width="100" height="100" fill="#fff3e0"/>' +
      '<path d="M22 100 Q22 76 46 74 Q70 76 70 100 Z" fill="#26a69a" ' + L + '/>' +
      cabeca(46, 56, 17, PELE[1], "crespo") +
      '<path d="M96 6 Q80 14 72 26" stroke="' + PELE[5] + '" stroke-width="12" stroke-linecap="round" fill="none"/>' +
      '<path d="M76 22 Q60 18 50 30 Q60 34 62 38 Q66 34 74 34 Z" fill="' + PELE[5] + '" ' + L + '/>' +
      '<path d="M56 30 L60 34 M60 27 L64 32" stroke="' + C + '" stroke-width="1.5"/>' +
      '<path d="M12 22 Q16 14 22 22 Q28 14 32 22 Q32 28 22 34 Q12 28 12 22 Z" fill="#ec407a"/>';
  };

  D.colar = function () { // miçanga: colar de continhas
    const cores = ["#e53935", "#fdd835", "#43a047", "#1e88e5", "#8e24aa", "#fb8c00"];
    let s = '<path d="M14 14 Q12 76 50 86 Q88 76 86 14" stroke="' + C + '" stroke-width="1.5" fill="none"/>';
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      // Ponto na curva do colar (aproximação da curva de Bézier).
      const x = (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 50 + t * t * 86;
      const y = (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * 120 + t * t * 14;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="' + cores[i % cores.length] + '" stroke="' + C + '" stroke-width="1.5"/>';
    }
    return s;
  };

  D.berimbau = function () {
    return '<path d="M30 6 Q14 50 30 94" stroke="#8d6e63" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M30 6 L30 94" stroke="' + C + '" stroke-width="1.5"/>' +
      '<circle cx="40" cy="72" r="14" fill="#ffb74d" ' + L + '/>' +
      '<path d="M30 70 L36 70" ' + L + '/>' +
      '<path d="M64 30 L84 70" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="20" rx="9" ry="12" fill="#d7ccc8" ' + L + '/>' +
      '<path d="M66 16 L78 16 M66 22 L78 22" stroke="#8d6e63" stroke-width="2"/>' +
      '<circle cx="54" cy="58" r="5" fill="#bdbdbd" ' + L + '/>';
  };

  D.atabaque = function () {
    return '<path d="M30 14 L70 14 L64 90 L36 90 Z" fill="#a1683a" ' + L + '/>' +
      '<ellipse cx="50" cy="14" rx="20" ry="6" fill="#ffe0b2" ' + L + '/>' +
      '<path d="M31 26 L69 26 M34 60 L66 60" stroke="#ffca28" stroke-width="4"/>' +
      '<path d="M32 26 L36 60 L40 26 L44 60 L48 26 L52 60 L56 26 L60 60 L64 26 L66 60" stroke="#fff3e0" stroke-width="1.5" fill="none"/>' +
      '<path d="M14 6 Q22 2 26 10 M86 6 Q78 2 74 10" stroke="#e53935" stroke-width="2.5" fill="none"/>';
  };

  D.agogo = function () {
    return '<path d="M20 30 Q40 6 70 22" stroke="#9e9e9e" stroke-width="4" fill="none"/>' +
      '<path d="M10 28 L30 28 L36 78 L4 78 Z" fill="#ffd54f" ' + L + '/>' +
      '<ellipse cx="20" cy="78" rx="16" ry="5" fill="#ffb300" ' + L + '/>' +
      '<path d="M60 22 L76 22 L82 64 L54 64 Z" fill="#ffe082" ' + L + '/>' +
      '<ellipse cx="68" cy="64" rx="14" ry="4.5" fill="#ffb300" ' + L + '/>' +
      '<path d="M96 40 L70 86" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>';
  };

  D.kalimba = function () {
    let s = '<rect x="12" y="28" width="76" height="62" rx="10" fill="#a1683a" ' + L + '/>' +
      '<circle cx="50" cy="74" r="7" fill="#4e342e"/>' +
      '<rect x="16" y="44" width="68" height="5" fill="#bdbdbd" ' + L + '/>';
    const alt = [34, 26, 18, 12, 10, 12, 18, 26, 34];
    for (let i = 0; i < 9; i++) {
      s += '<rect x="' + (20 + i * 7) + '" y="' + alt[i] + '" width="4" height="' + (56 - alt[i]) + '" rx="2" fill="#eeeeee" stroke="' + C + '" stroke-width="1.2"/>';
    }
    return s;
  };

  D.ganza = function () {
    return '<g transform="rotate(-20 50 50)"><rect x="18" y="38" width="64" height="24" rx="12" fill="#b0bec5" ' + L + '/>' +
      '<path d="M30 38 L30 62 M42 38 L42 62 M54 38 L54 62 M66 38 L66 62" stroke="#78909c" stroke-width="2"/></g>' +
      '<path d="M10 22 Q16 18 22 22 M80 76 Q86 80 92 76 M84 16 Q90 12 94 18 M6 78 Q10 84 16 82" stroke="#e53935" stroke-width="2.5" fill="none"/>';
  };

  D.capoeira = function () { // capoeira: duas pessoas jogando na roda
    return '<ellipse cx="50" cy="88" rx="46" ry="9" fill="#ffe082"/>' +
      // Pessoa 1: de cabeça erguida, braço protegendo.
      '<path d="M26 60 L18 86 M30 60 L40 84" stroke="#fafafa" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="20" y="38" width="16" height="24" rx="6" fill="#fafafa" ' + L + '/>' +
      '<path d="M22 44 L10 34 M34 44 L44 52" stroke="' + PELE[0] + '" stroke-width="5" stroke-linecap="round"/>' +
      cabeca(28, 28, 9, PELE[0], "curto") +
      // Pessoa 2: chute em meia-lua.
      '<path d="M68 62 L76 86" stroke="#fafafa" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M66 60 Q60 40 46 30" stroke="#fafafa" stroke-width="7" stroke-linecap="round" fill="none"/>' +
      '<rect x="62" y="40" width="16" height="24" rx="6" fill="#fafafa" ' + L + ' transform="rotate(15 70 52)"/>' +
      '<path d="M76 46 L88 40 M66 46 L58 56" stroke="' + PELE[3] + '" stroke-width="5" stroke-linecap="round"/>' +
      cabeca(76, 30, 9, PELE[3], "coque");
  };

  D.acaraje = function () {
    return '<ellipse cx="50" cy="78" rx="44" ry="12" fill="#eceff1" ' + L + '/>' +
      '<ellipse cx="36" cy="62" rx="20" ry="14" fill="#e65100" ' + L + '/>' +
      '<path d="M22 60 Q36 66 50 60" stroke="#ffcc80" stroke-width="3" fill="none"/>' +
      '<circle cx="30" cy="58" r="2" fill="#f4511e"/><circle cx="40" cy="57" r="2" fill="#ffab91"/>' +
      '<ellipse cx="66" cy="62" rx="20" ry="14" fill="#ef6c00" ' + L + '/>' +
      '<path d="M50 60 Q66 68 82 60" stroke="#ffcc80" stroke-width="3" fill="none"/>' +
      '<path d="M54 56 Q66 50 78 56" stroke="#43a047" stroke-width="3" fill="none"/>';
  };

  D.vatapa = function () {
    return '<path d="M10 48 L90 48 Q86 84 50 86 Q14 84 10 48 Z" fill="#8d6e63" ' + L + '/>' +
      '<ellipse cx="50" cy="48" rx="40" ry="10" fill="#ffb300" ' + L + '/>' +
      '<path d="M30 46 Q36 40 42 46 M56 44 Q62 38 68 44" stroke="#e65100" stroke-width="3" fill="none"/>' +
      '<circle cx="48" cy="48" r="2.5" fill="#43a047"/><circle cx="62" cy="50" r="2" fill="#43a047"/>' +
      '<path d="M70 10 L56 44" stroke="#bdbdbd" stroke-width="5" stroke-linecap="round"/><ellipse cx="54" cy="46" rx="6" ry="4" fill="#bdbdbd"/>';
  };

  D.pandeiro = function () { // samba: pandeiro e notas musicais
    let s = '<circle cx="44" cy="56" r="34" fill="#ffecb3" stroke="#6d4c41" stroke-width="7"/>';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      s += '<rect x="' + (44 + Math.cos(a) * 34 - 5) + '" y="' + (56 + Math.sin(a) * 34 - 3) + '" width="10" height="6" rx="2" fill="#ffd54f" ' + L + '/>';
    }
    s += '<path d="M78 8 L78 30 M78 8 L92 4 L92 26" stroke="#d81b60" stroke-width="3" fill="none"/>' +
      '<circle cx="75" cy="30" r="4" fill="#d81b60"/><circle cx="89" cy="26" r="4" fill="#d81b60"/>';
    return s;
  };

  D.trofeu = function () {
    return '<path d="M28 10 L72 10 L68 44 Q50 60 32 44 Z" fill="#ffc107" ' + L + '/>' +
      '<path d="M28 16 Q8 16 14 32 Q20 42 32 40 M72 16 Q92 16 86 32 Q80 42 68 40" stroke="' + C + '" stroke-width="2.5" fill="none"/>' +
      '<rect x="44" y="54" width="12" height="16" fill="#ffb300" ' + L + '/>' +
      '<rect x="30" y="70" width="40" height="10" rx="2" fill="#8d6e63" ' + L + '/>' +
      '<rect x="24" y="80" width="52" height="12" rx="2" fill="#6d4c41" ' + L + '/>' +
      '<path d="M50 18 L54 28 L64 28 L56 34 L59 44 L50 38 L41 44 L44 34 L36 28 L46 28 Z" fill="#fff59d"/>';
  };

  /* ===== Ícones das estações no mapa ===== */

  D.estacao1 = function () { // Gente que faz história: livro, medalha e estrela
    return '<path d="M50 6 L58 26 L80 27 L63 40 L69 62 L50 50 L31 62 L37 40 L20 27 L42 26 Z" fill="#ffca28" ' + L + '/>' +
      '<rect x="8" y="64" width="34" height="28" rx="3" fill="#1e88e5" ' + L + '/><path d="M14 72 L36 72 M14 80 L30 80" stroke="#fff" stroke-width="2.5"/>' +
      '<circle cx="74" cy="78" r="14" fill="#ffc107" ' + L + '/><path d="M74 70 L76 76 L82 76 L77 80 L79 86 L74 82 L69 86 L71 80 L66 76 L72 76 Z" fill="#ff8f00"/>';
  };
  D.estacao2 = function () { // África
    return '<svg viewBox="0 0 600 600" x="4" y="4" width="92" height="92"><path d="' + AFRICA_CAMINHO + '" fill="#43a047" stroke="' + C + '" stroke-width="14" stroke-linejoin="round"/></svg>';
  };
  D.estacao3 = function () { return D.oware(); };
  D.estacao4 = function () { return D.atabaque(); };

  /* ===== Ícones dos botões e das instruções ===== */

  D.casa = function () { return '<path d="M12 50 L50 14 L88 50" stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 46 L24 88 L42 88 L42 64 L58 64 L58 88 L76 88 L76 46" fill="currentColor"/>'; };
  D.album = function () { return '<rect x="14" y="10" width="72" height="80" rx="8" fill="none" stroke="currentColor" stroke-width="8"/><rect x="26" y="22" width="20" height="24" rx="3" fill="currentColor"/><rect x="54" y="22" width="20" height="24" rx="3" fill="currentColor"/><rect x="26" y="54" width="20" height="24" rx="3" fill="currentColor"/><path d="M64 54 L67 62 L75 62 L69 67 L71 76 L64 71 L57 76 L59 67 L53 62 L61 62 Z" fill="currentColor"/>'; };
  D.ajuda = function () { return '<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8"/><path d="M36 38 Q36 22 50 22 Q66 22 66 36 Q66 46 54 50 L54 60" stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="54" cy="76" r="6.5" fill="currentColor"/>'; };
  D.pausa = function () { return '<rect x="22" y="16" width="20" height="68" rx="5" fill="currentColor"/><rect x="58" y="16" width="20" height="68" rx="5" fill="currentColor"/>'; };
  D.play = function () { return '<path d="M26 14 L84 50 L26 86 Z" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>'; };
  D.somLigado = function () { return '<path d="M12 38 L30 38 L52 18 L52 82 L30 62 L12 62 Z" fill="currentColor"/><path d="M64 34 Q74 50 64 66 M74 24 Q90 50 74 76" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round"/>'; };
  D.somDesligado = function () { return '<path d="M12 38 L30 38 L52 18 L52 82 L30 62 L12 62 Z" fill="currentColor"/><path d="M64 36 L88 64 M88 36 L64 64" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>'; };
  D.cadeado = function () { return '<path d="M30 46 L30 32 Q30 12 50 12 Q70 12 70 32 L70 46" stroke="currentColor" stroke-width="10" fill="none"/><rect x="18" y="44" width="64" height="46" rx="8" fill="currentColor"/><circle cx="50" cy="64" r="7" fill="#fff"/><rect x="47" y="64" width="6" height="14" fill="#fff"/>'; };
  D.certo = function () { return '<path d="M16 52 L40 76 L86 24" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; };
  D.fechar = function () { return '<path d="M22 22 L78 78 M78 22 L22 78" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>'; };
  D.setaEsq = function () { return '<path d="M62 14 L26 50 L62 86" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; };
  D.setaDir = function () { return '<path d="M38 14 L74 50 L38 86" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; };
  D.seta = D.setaDir;
  D.chave = function () { return '<circle cx="32" cy="50" r="18" stroke="currentColor" stroke-width="10" fill="none"/><path d="M50 50 L90 50 M78 50 L78 66 M88 50 L88 62" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>'; };
  D.lixeira = function () { return '<path d="M20 26 L80 26 M40 26 L40 14 L60 14 L60 26" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M26 34 L74 34 L70 90 L30 90 Z" fill="currentColor"/>'; };
  D.estrelaIcone = function () { return '<path d="M50 6 L62 36 L94 37 L69 57 L78 90 L50 71 L22 90 L31 57 L6 37 L38 36 Z" fill="currentColor"/>'; };
  D.tentar = function () { return '<path d="M78 50 A28 28 0 1 1 64 26" stroke="currentColor" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M58 8 L74 26 L52 34 Z" fill="currentColor"/>'; };
  D.mouse = function () { return '<rect x="26" y="10" width="48" height="80" rx="24" fill="#fff" stroke="' + C + '" stroke-width="5"/><path d="M50 10 L50 42 M26 42 L74 42" stroke="' + C + '" stroke-width="5"/><path d="M28 40 L28 32 Q28 12 48 12 L48 40 Z" fill="#1e88e5"/>'; };
  D.lupa = function () { return '<circle cx="42" cy="42" r="26" fill="#e3f2fd" stroke="' + C + '" stroke-width="8"/><path d="M62 62 L88 88" stroke="#6d4c41" stroke-width="12" stroke-linecap="round"/>'; };
  D.alvo = function () { return '<circle cx="50" cy="50" r="40" fill="#e53935"/><circle cx="50" cy="50" r="28" fill="#fff"/><circle cx="50" cy="50" r="16" fill="#e53935"/><circle cx="50" cy="50" r="6" fill="#fff"/>'; };
  D.alfinete = function () { return '<path d="M50 94 L30 50 A22 22 0 1 1 70 50 Z" fill="#e53935" stroke="' + C + '" stroke-width="4"/><circle cx="50" cy="36" r="9" fill="#fff"/>'; };
  D.semente = function () { return '<ellipse cx="34" cy="50" rx="14" ry="10" fill="#f5deb3" stroke="' + C + '" stroke-width="4"/><ellipse cx="66" cy="40" rx="14" ry="10" fill="#f5deb3" stroke="' + C + '" stroke-width="4"/><ellipse cx="58" cy="68" rx="14" ry="10" fill="#f5deb3" stroke="' + C + '" stroke-width="4"/>'; };
  D.mapa = function () { return '<path d="M8 20 L34 10 L66 22 L92 12 L92 82 L66 92 L34 80 L8 90 Z" fill="#c8e6c9" stroke="' + C + '" stroke-width="5" stroke-linejoin="round"/><path d="M34 10 L34 80 M66 22 L66 92" stroke="' + C + '" stroke-width="4"/><path d="M18 70 Q40 40 56 56 T82 30" stroke="#e53935" stroke-width="5" stroke-dasharray="6 5" fill="none"/>'; };
  D.estrela = D.estrela; // (a figurinha de Dandara também serve de ícone)
  // Acessibilidade: pessoa de braços abertos dentro de um círculo.
  D.acessibilidade = function () { return '<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="8"/><circle cx="50" cy="26" r="8" fill="currentColor"/><path d="M24 40 L76 40 M50 40 L50 62 M50 62 L36 84 M50 62 L64 84" stroke="currentColor" stroke-width="8" stroke-linecap="round" fill="none"/>'; };

  // Criança da brincadeira Terra-Mar (corpo inteiro, braços para cima).
  D.crianca = function () {
    return '<path d="M42 70 L36 94 M58 70 L64 94" stroke="#1d3557" stroke-width="8" stroke-linecap="round"/>' +
      '<rect x="34" y="40" width="32" height="34" rx="10" fill="#e63946" ' + L + '/>' +
      '<path d="M36 46 L20 22 M64 46 L80 22" stroke="' + PELE[2] + '" stroke-width="7" stroke-linecap="round"/>' +
      cabeca(50, 26, 14, PELE[2], "cachos");
  };

  // Crianças da tela de abertura, com tons de pele e cabelos diferentes.
  D.criancas = function () {
    return '<svg viewBox="0 0 300 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<rect x="20" y="72" width="44" height="40" rx="14" fill="#ef476f" ' + L + '/>' + cabeca(42, 48, 22, PELE[0], "crespo") +
      '<rect x="88" y="74" width="44" height="38" rx="14" fill="#118ab2" ' + L + '/>' + cabeca(110, 52, 20, PELE[3], "curto") +
      '<rect x="156" y="74" width="44" height="38" rx="14" fill="#06d6a0" ' + L + '/>' + cabeca(178, 52, 20, PELE[1], "trancas") +
      '<rect x="224" y="74" width="44" height="38" rx="14" fill="#ffd166" ' + L + '/>' + cabeca(246, 52, 20, PELE[4], "coque") +
      '</svg>';
  };

  return {
    // Devolve o desenho pronto. "rotulo" é o texto lido por leitores de tela.
    svg: function (nome, rotulo) {
      const f = D[nome];
      return svg(f ? f() : "", rotulo);
    },
    icone: function (nome) {
      const f = D[nome];
      return svg(f ? f() : "");
    },
    criancas: function () { return D.criancas(); },
    AFRICA_CAMINHO: AFRICA_CAMINHO,
    projetar: projetar
  };
})();
