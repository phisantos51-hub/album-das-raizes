/*
  ÁLBUM DAS RAÍZES — CONTEÚDO DO JOGO
  ===================================
  Este arquivo guarda TODOS os textos do jogo: as pessoas, os países,
  as brincadeiras, os itens de cultura e as instruções.
  Para mudar um texto, troque só o que está ENTRE AS ASPAS ("...").

  REGRAS PARA EDITAR SEM QUEBRAR O JOGO
  - Não apague as aspas, as vírgulas no fim das linhas nem as chaves { }.
  - Para usar aspas dentro de um texto, use as aspas curvas “assim”.
  - Depois de salvar, abra o jogo de novo (ou aperte F5) para ver a mudança.
  - Se o jogo parar de abrir, provavelmente sumiu uma vírgula ou uma aspa.

  O QUE É CADA CAMPO
  - id:      nome interno da figurinha. NÃO MUDE (o progresso salvo usa esse nome).
  - nome:    o nome que aparece na figurinha.
  - anos:    em quais anos a figurinha aparece. [1, 2, 3] = 1º, 2º e 3º ano;
             [2, 3] = só 2º e 3º ano; [3] = só 3º ano.
  - desenho: qual ilustração usar (os desenhos ficam em js/desenhos.js).
  - cor:     cor do fundo da figurinha (código de cor, como "#ffd166").
  - pista:   as pistas da Estação 1 e da Estação 2. Uma para cada ano:
             pista[1] = 1º ano (frase bem curta), pista[2] = 2º ano,
             pista[3] = 3º ano (frase mais elaborada).
  - curto:   explicação curta mostrada no álbum para o 1º ano.
  - texto:   explicação mostrada no álbum para o 2º e o 3º ano.

  No 1º ano, o jogo mostra tudo em LETRA DE IMPRENSA MAIÚSCULA
  automaticamente. Pode escrever normalmente aqui.

  Todas as informações históricas e culturais estão listadas no arquivo
  REVISAR.md, para conferência antes de usar com as turmas.
*/

const CONTEUDO = {

  /* ---------------------------------------------------------------
     ESTAÇÃO 1 — GENTE QUE FAZ HISTÓRIA
     Personalidades negras brasileiras. 6 mulheres e 6 homens.
     1º ano: 6 pessoas (3 mulheres e 3 homens)
     2º ano: 10 pessoas (5 e 5)
     3º ano: 12 pessoas (6 e 6)
     As figurinhas NÃO mostram rostos: cada uma tem um desenho
     simbólico ligado ao que a pessoa fez.
  --------------------------------------------------------------- */
  pessoas: [
    {
      id: "zumbi",
      nome: "Zumbi dos Palmares",
      area: "Luta pela liberdade",
      anos: [1, 2, 3],
      desenho: "palmeira",
      cor: "#ffd166",
      pista: {
        1: "Ele foi líder de Palmares.",
        2: "Ele foi líder do Quilombo dos Palmares e lutou pela liberdade.",
        3: "Ele liderou o Quilombo dos Palmares, onde muitas pessoas viveram livres. O dia 20 de novembro lembra a sua luta."
      },
      curto: "Líder de Palmares. Lutou pela liberdade.",
      texto: "Zumbi foi líder do Quilombo dos Palmares, uma grande comunidade onde viviam em liberdade pessoas que fugiram da escravidão. Ficava onde hoje é o estado de Alagoas. O dia 20 de novembro, Dia Nacional de Zumbi e da Consciência Negra, lembra a sua luta."
    },
    {
      id: "dandara",
      nome: "Dandara dos Palmares",
      area: "Luta pela liberdade",
      anos: [1, 2, 3],
      desenho: "estrela",
      cor: "#f4a6c6",
      pista: {
        1: "Ela foi uma guerreira de Palmares.",
        2: "Ela lutou pela liberdade em Palmares, ao lado de Zumbi.",
        3: "Ela é lembrada como uma guerreira do Quilombo dos Palmares que defendeu a liberdade do seu povo, ao lado de Zumbi."
      },
      curto: "Guerreira de Palmares.",
      texto: "Dandara é lembrada como uma guerreira do Quilombo dos Palmares, que lutou pela liberdade ao lado de Zumbi. Seu nome está no Livro dos Heróis e Heroínas da Pátria."
    },
    {
      id: "carolina",
      nome: "Carolina Maria de Jesus",
      area: "Literatura",
      anos: [1, 2, 3],
      desenho: "diario",
      cor: "#a0e7e5",
      pista: {
        1: "Ela escreveu um diário que virou livro.",
        2: "Ela escreveu um diário que virou um livro famoso no mundo todo.",
        3: "Ela morava em São Paulo, catava papel para cuidar dos filhos e escrevia em cadernos. Seu diário virou o livro Quarto de Despejo."
      },
      curto: "Escritora. Seu diário virou livro.",
      texto: "Carolina Maria de Jesus nasceu em Minas Gerais e viveu em São Paulo. Escrevia em cadernos sobre a sua vida. Seu diário virou o livro Quarto de Despejo, de 1960, traduzido para muitas línguas."
    },
    {
      id: "machado",
      nome: "Machado de Assis",
      area: "Literatura",
      anos: [1, 2, 3],
      desenho: "livro",
      cor: "#b4f8c8",
      pista: {
        1: "Ele escreveu muitos livros.",
        2: "Ele foi um grande escritor e ajudou a criar a Academia Brasileira de Letras.",
        3: "Ele escreveu o livro Dom Casmurro e foi o primeiro presidente da Academia Brasileira de Letras."
      },
      curto: "Grande escritor do Brasil.",
      texto: "Machado de Assis nasceu no Rio de Janeiro, em 1839. Escreveu romances, contos e poemas, como Dom Casmurro. Foi um dos criadores e o primeiro presidente da Academia Brasileira de Letras."
    },
    {
      id: "rebeca",
      nome: "Rebeca Andrade",
      area: "Esporte",
      anos: [1, 2, 3],
      desenho: "medalha",
      cor: "#ffcf99",
      pista: {
        1: "Ela é ginasta e ganhou medalhas.",
        2: "Ela é ginasta e ganhou medalhas de ouro nas Olimpíadas.",
        3: "Ela nasceu em Guarulhos, em São Paulo, é ginasta e é a atleta brasileira com mais medalhas olímpicas."
      },
      curto: "Ginasta. Ganhou ouro nas Olimpíadas.",
      texto: "Rebeca Andrade nasceu em Guarulhos, em São Paulo. É ginasta e ganhou medalhas de ouro nas Olimpíadas de Tóquio e de Paris. É a atleta brasileira com mais medalhas olímpicas."
    },
    {
      id: "gil",
      nome: "Gilberto Gil",
      area: "Música",
      anos: [1, 2, 3],
      desenho: "violao",
      cor: "#cdb4db",
      pista: {
        1: "Ele canta e toca violão.",
        2: "Ele é cantor e compositor e já foi ministro da Cultura.",
        3: "Ele é um cantor e compositor baiano, ganhou prêmios no mundo todo e foi ministro da Cultura do Brasil."
      },
      curto: "Cantor e compositor.",
      texto: "Gilberto Gil nasceu em Salvador, na Bahia. É cantor, compositor e violonista. Foi ministro da Cultura do Brasil e é membro da Academia Brasileira de Letras."
    },
    {
      id: "luizgama",
      nome: "Luiz Gama",
      area: "Luta por direitos",
      anos: [2, 3],
      desenho: "balanca",
      cor: "#ffe66d",
      pista: {
        1: "Ele usou as leis para libertar pessoas.",
        2: "Ele aprendeu a ler já jovem e ajudou a libertar muitas pessoas na Justiça.",
        3: "Ele foi escravizado quando era criança, conquistou a liberdade, aprendeu a ler e defendeu na Justiça a liberdade de centenas de pessoas."
      },
      curto: "Defendeu a liberdade na Justiça.",
      texto: "Luiz Gama nasceu em Salvador, na Bahia. Foi escravizado ainda criança, conquistou a liberdade e se tornou escritor, jornalista e defensor de pessoas na Justiça, em São Paulo. Ajudou a libertar mais de 500 pessoas."
    },
    {
      id: "enedina",
      nome: "Enedina Alves Marques",
      area: "Ciência e engenharia",
      anos: [2, 3],
      desenho: "regua",
      cor: "#9bf6ff",
      pista: {
        1: "Ela foi engenheira.",
        2: "Ela é lembrada como a primeira engenheira negra do Brasil.",
        3: "Ela se formou em 1945 e foi a primeira mulher engenheira do Paraná. Trabalhou na construção de uma usina que produz energia."
      },
      curto: "Engenheira pioneira.",
      texto: "Enedina Alves Marques nasceu em Curitiba, no Paraná. Em 1945, foi a primeira mulher a se formar em Engenharia no Paraná e é lembrada como a primeira engenheira negra do Brasil. Trabalhou na construção de uma grande usina de energia."
    },
    {
      id: "milton",
      nome: "Milton Santos",
      area: "Ciência",
      anos: [2, 3],
      desenho: "globo",
      cor: "#bde0fe",
      pista: {
        1: "Ele estudou os lugares do mundo.",
        2: "Ele foi um geógrafo famoso e estudou as cidades e o mundo.",
        3: "Ele foi um geógrafo baiano e recebeu um prêmio internacional chamado de “Nobel da Geografia”."
      },
      curto: "Geógrafo. Estudou os lugares.",
      texto: "Milton Santos nasceu na Bahia e foi um dos maiores geógrafos do mundo. Estudou as cidades e o jeito como as pessoas vivem nos lugares. Em 1994, recebeu o Prêmio Vautrin Lud, conhecido como o “Nobel da Geografia”."
    },
    {
      id: "conceicao",
      nome: "Conceição Evaristo",
      area: "Literatura",
      anos: [2, 3],
      desenho: "pena",
      cor: "#ffc8dd",
      pista: {
        1: "Ela escreve histórias e poemas.",
        2: "Ela é escritora e criou a palavra escrevivência.",
        3: "Ela é uma escritora mineira que criou a palavra escrevivência: escrever a partir da vida e das memórias do seu povo."
      },
      curto: "Escritora de histórias e poemas.",
      texto: "Conceição Evaristo nasceu em Belo Horizonte, em Minas Gerais. É escritora de romances, contos e poemas, e também professora. Criou a palavra escrevivência, que junta escrever e viver."
    },
    {
      id: "ruth",
      nome: "Ruth de Souza",
      area: "Artes",
      anos: [3],
      desenho: "mascaras",
      cor: "#e2ece9",
      pista: {
        1: "Ela foi atriz.",
        2: "Ela foi uma atriz de teatro, cinema e televisão.",
        3: "Ela começou no Teatro Experimental do Negro e abriu caminhos para atrizes e atores negros no teatro, no cinema e na TV."
      },
      curto: "Atriz de teatro, cinema e TV.",
      texto: "Ruth de Souza nasceu no Rio de Janeiro e foi atriz por muitas décadas. Começou no Teatro Experimental do Negro e abriu caminhos para atrizes e atores negros no teatro, no cinema e na televisão."
    },
    {
      id: "adhemar",
      nome: "Adhemar Ferreira da Silva",
      area: "Esporte",
      anos: [3],
      desenho: "pegadas",
      cor: "#caffbf",
      pista: {
        1: "Ele foi campeão de salto.",
        2: "Ele foi campeão olímpico de salto triplo duas vezes.",
        3: "Ele nasceu em São Paulo e foi o primeiro brasileiro a ganhar duas medalhas de ouro olímpicas, no salto triplo."
      },
      curto: "Campeão de salto triplo.",
      texto: "Adhemar Ferreira da Silva nasceu em São Paulo. Foi campeão olímpico do salto triplo em 1952 e em 1956 e bateu recordes mundiais. Foi o primeiro brasileiro bicampeão olímpico."
    }
  ],

  /* ---------------------------------------------------------------
     ESTAÇÃO 2 — ÁFRICA, UM CONTINENTE DE MUITOS PAÍSES
     lon e lat: posição aproximada do alfinete no mapa
     (longitude e latitude; não mude se não tiver certeza).
     rotulo: onde aparece o nome do país em relação ao alfinete
     ("cima", "baixo", "esquerda" ou "direita").
  --------------------------------------------------------------- */
  africa: {
    // Frases mostradas antes e depois do quebra-cabeça.
    abertura: {
      curto: "A África é um continente. Ela tem muitos países!",
      texto: "A África é um continente enorme, com 54 países e mais de mil línguas. Tem desertos, florestas, rios, praias e cidades grandes e modernas. A África não é um país só!"
    },
    montado: {
      curto: "Você montou a África! Agora vamos conhecer alguns países.",
      texto: "Você montou o mapa da África! Agora vamos conhecer alguns dos seus 54 países."
    }
  },

  paises: [
    {
      id: "egito",
      nome: "Egito",
      anos: [1, 2, 3],
      desenho: "piramides",
      cor: "#ffe8a3",
      lon: 30, lat: 26, rotulo: "cima",
      pista: {
        1: "Lá tem pirâmides.",
        2: "Lá ficam pirâmides muito antigas e passa o rio Nilo.",
        3: "Neste país ficam as pirâmides de Gizé e passa o rio Nilo. A capital, o Cairo, é uma das maiores cidades da África."
      },
      curto: "Tem pirâmides e o rio Nilo.",
      texto: "No Egito ficam as pirâmides de Gizé, construídas há mais de 4 mil anos, e passa o rio Nilo, um dos rios mais longos do mundo. A capital, o Cairo, é uma das maiores cidades da África."
    },
    {
      id: "angola",
      nome: "Angola",
      anos: [1, 2, 3],
      desenho: "ola",
      cor: "#ffb4a2",
      lon: 17.5, lat: -12.5, rotulo: "esquerda",
      pista: {
        1: "Lá também se fala português.",
        2: "Lá se fala português e também a língua quimbundo.",
        3: "Neste país se fala português e também quimbundo, a língua de onde vieram palavras como caçula e moleque."
      },
      curto: "Lá também se fala português.",
      texto: "Em Angola, a língua oficial é o português, mas também se falam outras línguas, como o quimbundo e o umbundo. Palavras que usamos, como caçula e moleque, vieram do quimbundo. A capital, Luanda, é uma cidade grande à beira-mar."
    },
    {
      id: "mocambique",
      nome: "Moçambique",
      anos: [1, 2, 3],
      desenho: "barco",
      cor: "#a2d2ff",
      lon: 35.5, lat: -17, rotulo: "direita",
      pista: {
        1: "De lá vem a brincadeira Terra-Mar.",
        2: "Lá se fala português, e de lá vem a brincadeira Terra-Mar.",
        3: "Este país fica de frente para o Oceano Índico, tem o português como língua oficial e é a terra da brincadeira Terra-Mar."
      },
      curto: "Lá se fala português. É a terra do Terra-Mar.",
      texto: "Moçambique fica no leste da África, de frente para o Oceano Índico. A língua oficial é o português, e muitas outras línguas também são faladas. A brincadeira Terra-Mar vem de lá. A capital é Maputo."
    },
    {
      id: "nigeria",
      nome: "Nigéria",
      anos: [1, 2, 3],
      desenho: "claquete",
      cor: "#b9fbc0",
      lon: 8, lat: 9.5, rotulo: "cima",
      pista: {
        1: "É o país com mais gente da África.",
        2: "É o país com mais gente da África e faz muitos filmes.",
        3: "É o país mais populoso da África, tem a enorme cidade de Lagos e uma das maiores indústrias de cinema do mundo."
      },
      curto: "É o país com mais gente da África.",
      texto: "A Nigéria é o país mais populoso da África. Lagos é uma das maiores cidades do continente. O país tem uma das maiores indústrias de cinema do mundo, chamada Nollywood. Lá se falam muitas línguas, como o iorubá, o igbo e o hauçá."
    },
    {
      id: "gana",
      nome: "Gana",
      anos: [2, 3],
      desenho: "kente",
      cor: "#fdffb6",
      lon: -1.2, lat: 7.9, rotulo: "baixo",
      pista: {
        1: "Lá se joga oware.",
        2: "Lá se joga oware, um jogo de tabuleiro com sementes.",
        3: "Neste país é muito jogado o oware, da família mancala, e é feito o kente, um tecido colorido."
      },
      curto: "Lá se joga oware.",
      texto: "Gana fica no oeste da África. Lá é muito jogado o oware, um jogo de tabuleiro da família mancala. Gana também é conhecida pelo kente, um tecido colorido feito em tear. A capital é Acra."
    },
    {
      id: "africadosul",
      nome: "África do Sul",
      anos: [2, 3],
      desenho: "bola",
      cor: "#d0f4de",
      lon: 24, lat: -29.5, rotulo: "baixo",
      pista: {
        1: "Lá teve uma Copa do Mundo.",
        2: "Lá aconteceu a primeira Copa do Mundo de futebol da África.",
        3: "Este país tem muitas línguas oficiais, recebeu a primeira Copa do Mundo da África e teve Nelson Mandela como presidente."
      },
      curto: "Teve a primeira Copa do Mundo da África.",
      texto: "A África do Sul tem muitas línguas oficiais e cidades grandes, como Joanesburgo e a Cidade do Cabo. Em 2010, recebeu a primeira Copa do Mundo de futebol feita na África. Nelson Mandela, que lutou pela igualdade de direitos, foi presidente do país."
    },
    {
      id: "senegal",
      nome: "Senegal",
      anos: [3],
      desenho: "baoba",
      cor: "#e4c1f9",
      lon: -14.5, lat: 14.5, rotulo: "esquerda",
      pista: {
        1: "Lá tem baobás.",
        2: "O baobá, uma árvore enorme, é símbolo deste país.",
        3: "A capital deste país, Dacar, fica no ponto mais a oeste da África, e o baobá é um símbolo do país."
      },
      curto: "O baobá é símbolo do país.",
      texto: "O Senegal fica no oeste da África. Sua capital, Dacar, fica no ponto mais a oeste do continente, à beira do Oceano Atlântico. O baobá, uma árvore enorme que pode viver muitos séculos, é um símbolo do país."
    },
    {
      id: "quenia",
      nome: "Quênia",
      anos: [3],
      desenho: "girafa",
      cor: "#ffd6a5",
      lon: 37.9, lat: 0.2, rotulo: "direita",
      pista: {
        1: "Lá tem girafas perto da cidade.",
        2: "Na capital deste país, girafas vivem num parque perto dos prédios.",
        3: "Na capital deste país, Nairóbi, há um parque nacional com girafas e zebras ao lado da cidade. De lá vem o jogo shisima."
      },
      curto: "Tem girafas perto da cidade.",
      texto: "O Quênia fica no leste da África. Na capital, Nairóbi, existe um parque nacional, com girafas e zebras, bem ao lado da cidade. O país é famoso por seus corredores de longa distância. A língua suaíli é muito falada lá."
    }
  ],

  /* ---------------------------------------------------------------
     ESTAÇÃO 3 — BRINCADEIRAS E JOGOS
     Cada brincadeira tem uma atividade no jogo:
       terramar -> brincadeira de pular para o lado certo
       oware    -> jogo de mancala contra o computador
       shisima  -> jogo de tabuleiro contra o computador
  --------------------------------------------------------------- */
  brincadeiras: [
    {
      id: "terramar",
      nome: "Terra-Mar",
      anos: [1, 2, 3],
      desenho: "terramar",
      cor: "#ffd166",
      curto: "Brincadeira de Moçambique. Pule para a terra ou para o mar!",
      texto: "Terra-Mar é uma brincadeira de Moçambique. Risca-se uma linha no chão: de um lado é a terra, do outro é o mar. Quem comanda grita “Terra!” ou “Mar!”, e todo mundo pula para o lado certo."
    },
    {
      id: "oware",
      nome: "Oware (mancala)",
      anos: [1, 2, 3],
      desenho: "oware",
      cor: "#d4a373",
      curto: "Jogo de sementes de Gana. É da família mancala.",
      texto: "O oware é um jogo de tabuleiro de Gana, da família mancala. Os jogos de mancala são jogados há muitos séculos em vários países da África. Os jogadores “semeiam” sementes nas casinhas e capturam sementes do outro lado."
    },
    {
      id: "shisima",
      nome: "Shisima",
      anos: [2, 3],
      desenho: "shisima",
      cor: "#a0c4ff",
      curto: "Jogo de tabuleiro do Quênia.",
      texto: "Shisima é um jogo de tabuleiro do Quênia. O tabuleiro tem a forma de um octógono. Cada jogador tem 3 peças e quer formar uma linha reta de 3 peças passando pelo meio."
    }
  ],

  /* Textos das atividades da Estação 3. */
  terramar: {
    rodadas: { 1: 5, 2: 6, 3: 8 },  // quantas ordens por partida, em cada ano
    explicacao: {
      curto: "Leia a ordem e clique no lado certo. TERRA é marrom. MAR é azul.",
      texto: "Leia a ordem e clique no lado certo da linha: TERRA é o lado marrom, MAR é o lado azul."
    },
    erro: "Ops! Olhe a cor: TERRA é marrom e MAR é azul. Tente de novo!"
  },

  mancala: {
    // Níveis do jogo de mancala. O nível de cada ano é escolhido sozinho,
    // mas a criança pode trocar de nível na tela do jogo.
    niveis: {
      1: { nome: "Bem fácil", casas: 4, sementes: 3, capturaEmCadeia: false, regrasCompletas: false },
      2: { nome: "Médio", casas: 6, sementes: 4, capturaEmCadeia: true, regrasCompletas: false },
      3: { nome: "Regras completas (oware)", casas: 6, sementes: 4, capturaEmCadeia: true, regrasCompletas: true }
    },
    // Regras explicadas passo a passo. Cada nível usa os passos da sua lista.
    passos: {
      1: [
        "Você joga com as casinhas de BAIXO.",
        "Clique numa casinha sua que tenha sementes.",
        "As sementes andam, uma em cada casinha, para a direita.",
        "Se a última semente cair do outro lado e ficar com 2 ou 3 sementes, você captura essas sementes!",
        "Ganha quem capturar mais sementes."
      ],
      2: [
        "Você joga com as casinhas de baixo. O computador joga com as de cima.",
        "Clique numa casinha sua: as sementes são semeadas uma a uma, andando para a direita e depois por cima, como num círculo.",
        "Se a última semente cair numa casinha do computador e ela ficar com 2 ou 3 sementes, você captura.",
        "Se a casinha anterior também tiver 2 ou 3, você captura ela também, e assim por diante.",
        "Ganha quem capturar mais sementes."
      ],
      3: [
        "Você joga com as 6 casinhas de baixo. O computador joga com as 6 de cima.",
        "Escolha uma casinha sua: as sementes são semeadas uma a uma, no sentido anti-horário.",
        "Captura: se a última semente deixar uma casinha do adversário com 2 ou 3 sementes, você captura. As casinhas anteriores do adversário com 2 ou 3 também são capturadas, em sequência.",
        "Com 12 sementes ou mais, a semeadura pula a casinha de onde saiu.",
        "Se o adversário estiver sem sementes, você precisa fazer uma jogada que dê sementes para ele.",
        "Não vale capturar todas as sementes do adversário de uma vez: nesse caso, ninguém captura.",
        "Ganha quem capturar 25 sementes ou mais. Se ninguém puder jogar, cada um fica com as sementes do seu lado."
      ]
    }
  },

  shisima: {
    passos: [
      "Você tem 3 peças amarelas. O computador tem 3 peças roxas.",
      "Na sua vez, clique numa peça sua e depois num lugar vazio ao lado dela (ou no meio).",
      "As peças andam pelas linhas, um lugar por vez.",
      "Ganha quem formar uma linha reta de 3 peças passando pelo meio."
    ]
  },

  /* ---------------------------------------------------------------
     ESTAÇÃO 4 — CULTURA QUE ESTÁ EM TODO LUGAR
     grupo: "palavra", "instrumento" ou "cultura".
     A criança liga o NOME à IMAGEM e depois lê a frase (texto).
  --------------------------------------------------------------- */
  cultura: [
    {
      id: "cacula", nome: "caçula", grupo: "palavra", anos: [1, 2, 3],
      desenho: "bebe", cor: "#ffcad4",
      curto: "Caçula é o filho mais novo. A palavra veio da África.",
      texto: "Caçula é o filho ou a filha mais nova da família. A palavra veio do quimbundo, uma língua de Angola."
    },
    {
      id: "moleque", nome: "moleque", grupo: "palavra", anos: [1, 2, 3],
      desenho: "pipa", cor: "#bde0fe",
      curto: "Moleque quer dizer menino. A palavra veio da África.",
      texto: "Moleque quer dizer menino. A palavra veio do quimbundo, uma língua de Angola."
    },
    {
      id: "cochilo", nome: "cochilo", grupo: "palavra", anos: [2, 3],
      desenho: "rede", cor: "#cdb4db",
      curto: "Cochilo é um soninho rápido.",
      texto: "Cochilo é um soninho rápido. A palavra veio do quimbundo, uma língua de Angola."
    },
    {
      id: "quitanda", nome: "quitanda", grupo: "palavra", anos: [2, 3],
      desenho: "quitanda", cor: "#caffbf",
      curto: "Quitanda é uma lojinha de frutas.",
      texto: "Quitanda é uma lojinha de frutas e verduras. A palavra veio do quimbundo, língua de Angola, em que quer dizer feira."
    },
    {
      id: "cafune", nome: "cafuné", grupo: "palavra", anos: [3],
      desenho: "cafune", cor: "#ffd6a5",
      curto: "Cafuné é carinho na cabeça.",
      texto: "Cafuné é o carinho feito na cabeça de alguém. A palavra veio do quimbundo, uma língua de Angola."
    },
    {
      id: "micanga", nome: "miçanga", grupo: "palavra", anos: [3],
      desenho: "colar", cor: "#fdffb6",
      curto: "Miçanga são continhas coloridas.",
      texto: "Miçangas são continhas coloridas usadas para fazer colares e pulseiras. A palavra veio do quimbundo, uma língua de Angola."
    },
    {
      id: "berimbau", nome: "berimbau", grupo: "instrumento", anos: [1, 2, 3],
      desenho: "berimbau", cor: "#ffe66d",
      curto: "O berimbau comanda a roda de capoeira.",
      texto: "O berimbau é um instrumento de uma corda só, com uma cabaça. Ele comanda o ritmo da roda de capoeira. Instrumentos parecidos existem em vários países da África."
    },
    {
      id: "atabaque", nome: "atabaque", grupo: "instrumento", anos: [1, 2, 3],
      desenho: "atabaque", cor: "#ffb4a2",
      curto: "Atabaque é um tambor tocado com as mãos.",
      texto: "O atabaque é um tambor alto, tocado com as mãos. Ele aparece na roda de capoeira e em muitos ritmos brasileiros de origem africana."
    },
    {
      id: "agogo", nome: "agogô", grupo: "instrumento", anos: [2, 3],
      desenho: "agogo", cor: "#e2ece9",
      curto: "Agogô tem dois sininhos de metal.",
      texto: "O agogô tem dois sininhos de metal e é tocado com uma varinha. É usado no samba e na capoeira. A palavra veio do iorubá, uma língua africana."
    },
    {
      id: "kalimba", nome: "kalimba", grupo: "instrumento", anos: [2, 3],
      desenho: "kalimba", cor: "#a0e7e5",
      curto: "Kalimba se toca com os polegares.",
      texto: "A kalimba é um instrumento africano com plaquinhas de metal, tocadas com os polegares. Cada plaquinha faz uma nota diferente."
    },
    {
      id: "ganza", nome: "ganzá", grupo: "instrumento", anos: [3],
      desenho: "ganza", cor: "#f1c0e8",
      curto: "Ganzá é um chocalho.",
      texto: "O ganzá é um chocalho em forma de tubo, com sementes ou pedrinhas dentro. Aparece no samba e em outros ritmos brasileiros."
    },
    {
      id: "capoeira", nome: "capoeira", grupo: "cultura", anos: [1, 2, 3],
      desenho: "capoeira", cor: "#b9fbc0",
      curto: "Capoeira é luta, dança e música.",
      texto: "A capoeira mistura luta, dança, música e jogo. Foi criada no Brasil por africanos e seus descendentes. A roda de capoeira é Patrimônio Cultural da Humanidade."
    },
    {
      id: "acaraje", nome: "acarajé", grupo: "cultura", anos: [1, 2, 3],
      desenho: "acaraje", cor: "#ffcf99",
      curto: "Acarajé é um bolinho de feijão.",
      texto: "O acarajé é um bolinho de feijão-fradinho frito no azeite de dendê, muito famoso na Bahia. O ofício das baianas de acarajé é patrimônio cultural do Brasil."
    },
    {
      id: "vatapa", nome: "vatapá", grupo: "cultura", anos: [2, 3],
      desenho: "vatapa", cor: "#fde4cf",
      curto: "Vatapá é um creme com dendê.",
      texto: "O vatapá é um creme temperado com leite de coco, amendoim e azeite de dendê. É muito comum na Bahia."
    },
    {
      id: "samba", nome: "samba", grupo: "cultura", anos: [2, 3],
      desenho: "pandeiro", cor: "#ffc8dd",
      curto: "Samba é um ritmo com raízes africanas.",
      texto: "O samba é um ritmo brasileiro com raízes africanas. O samba de roda do Recôncavo Baiano é Patrimônio Cultural da Humanidade."
    }
  ],

  // Quantos pares de "ligar" aparecem de cada vez, em cada ano.
  paresPorRodada: { 1: 3, 2: 4, 3: 4 },

  // Nomes dos grupos da Estação 4 (aparecem na figurinha).
  grupos: {
    palavra: "Palavra de origem africana",
    instrumento: "Instrumento",
    cultura: "Cultura afro-brasileira"
  },

  /* ---------------------------------------------------------------
     DESAFIO FINAL (só no 3º ano, depois das 4 estações)
  --------------------------------------------------------------- */
  desafio: {
    perguntas: 8, // quantas perguntas
    medalha: {
      id: "guardiao",
      nome: "Guardiã ou Guardião das Raízes",
      desenho: "trofeu",
      cor: "#ffd166",
      curto: "Você venceu o desafio final!",
      texto: "Você venceu o desafio final e conhece pessoas, lugares, brincadeiras e cultura que fazem a nossa história!"
    }
  },

  /* ---------------------------------------------------------------
     NOMES DAS ESTAÇÕES (aparecem no mapa)
  --------------------------------------------------------------- */
  estacoes: [
    { id: 1, nome: "Gente que faz história", desenho: "estacao1", cor: "#f4a261" },
    { id: 2, nome: "África, um continente de muitos países", desenho: "estacao2", cor: "#2a9d8f" },
    { id: 3, nome: "Brincadeiras e jogos", desenho: "estacao3", cor: "#3a86ff" },
    { id: 4, nome: "Cultura que está em todo lugar", desenho: "estacao4", cor: "#9d4edd" }
  ],

  /* ---------------------------------------------------------------
     MENSAGENS DE ACERTO (o jogo sorteia uma)
  --------------------------------------------------------------- */
  acertos: ["Muito bem!", "Isso mesmo!", "Você acertou!", "Que legal!", "Parabéns!"],

  /* ---------------------------------------------------------------
     COMO JOGAR — instruções de cada tela.
     icone: desenho que aparece ao lado do passo (ver js/desenhos.js).
  --------------------------------------------------------------- */
  ajuda: {
    inicio: [
      { icone: "mouse", texto: "Use o mouse. Clique uma vez nos botões." },
      { icone: "estrela", texto: "Escolha o seu ano." }
    ],
    mapa: [
      { icone: "mapa", texto: "Este é o mapa. Ele tem 4 estações." },
      { icone: "mouse", texto: "Clique numa estação para jogar." },
      { icone: "album", texto: "Em cada estação você ganha figurinhas para o seu álbum." },
      { icone: "cadeado", texto: "Complete uma estação para abrir a próxima." }
    ],
    estacao1: [
      { icone: "lupa", texto: "Leia a pista." },
      { icone: "mouse", texto: "Clique na figurinha da pessoa certa." },
      { icone: "album", texto: "Acertou? A figurinha vai para o álbum!" },
      { icone: "tentar", texto: "Errou? Leia a explicação e tente de novo." }
    ],
    quebracabeca: [
      { icone: "mouse", texto: "Clique numa peça do mapa." },
      { icone: "alvo", texto: "Depois clique no quadrado onde ela se encaixa." },
      { icone: "estrela", texto: "Monte o mapa inteiro da África!" }
    ],
    paises: [
      { icone: "lupa", texto: "Leia a pista ou o nome do país." },
      { icone: "alfinete", texto: "Clique no alfinete do país no mapa." },
      { icone: "album", texto: "Cada país vira uma figurinha!" }
    ],
    estacao3: [
      { icone: "mouse", texto: "Escolha uma brincadeira ou jogo." },
      { icone: "album", texto: "Jogue até o fim para ganhar a figurinha." }
    ],
    terramar: [
      { icone: "lupa", texto: "Leia a ordem: TERRA ou MAR." },
      { icone: "mouse", texto: "Clique no lado certo. TERRA é marrom. MAR é azul." }
    ],
    mancala: [
      { icone: "mouse", texto: "Clique numa casinha de baixo que tenha sementes." },
      { icone: "semente", texto: "As sementes andam uma por casinha." },
      { icone: "estrela", texto: "Caiu do outro lado e ficou com 2 ou 3? Você captura!" },
      { icone: "livro", texto: "Leia as regras no quadro ao lado do tabuleiro." }
    ],
    shisima: [
      { icone: "mouse", texto: "Clique numa peça amarela." },
      { icone: "alvo", texto: "Depois clique num lugar marcado para ela andar." },
      { icone: "estrela", texto: "Forme uma linha de 3 passando pelo meio!" }
    ],
    estacao4: [
      { icone: "mouse", texto: "Clique numa palavra." },
      { icone: "alvo", texto: "Depois clique na imagem que combina com ela." },
      { icone: "album", texto: "Leia a história e ganhe a figurinha!" }
    ],
    album: [
      { icone: "album", texto: "Aqui estão as suas figurinhas." },
      { icone: "mouse", texto: "Clique numa figurinha para ler a explicação." },
      { icone: "seta", texto: "Use as setas para folhear o álbum." }
    ],
    desafio: [
      { icone: "lupa", texto: "Leia a pergunta." },
      { icone: "mouse", texto: "Clique na figurinha certa." },
      { icone: "trofeu", texto: "Acerte todas para ganhar a medalha!" }
    ]
  }
};
