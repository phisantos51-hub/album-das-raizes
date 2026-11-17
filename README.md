# Álbum das Raízes

Jogo educativo para o **Dia da Consciência Negra (20 de novembro)**, para o Ciclo de Alfabetização (1º, 2º e 3º ano do Ensino Fundamental), pensado a partir do Currículo da Cidade de São Paulo e da Lei 10.639/2003 (ensino de história e cultura africana e afro-brasileira).

Endereço do jogo: https://phisantos51-hub.github.io/album-das-raizes/

A criança percorre um mapa com quatro estações e ganha figurinhas para completar o seu álbum:

1. **Gente que faz história**: personalidades negras brasileiras (pista + escolher a figurinha certa).
2. **África, um continente de muitos países**: quebra-cabeça do mapa da África e alfinetes de países.
3. **Brincadeiras e jogos**: Terra-Mar, oware (mancala) contra o computador e shisima.
4. **Cultura que está em todo lugar**: ligar palavras, instrumentos, capoeira, comidas e samba às suas imagens.

No 3º ano, depois das quatro estações, abre o **Desafio final**.

## Como funciona

- Só HTML, CSS e JavaScript: nada para instalar. Funciona sem internet depois de aberto.
- Tudo com cliques simples do mouse, sem clique duplo e sem arrastar.
- Não depende de som: todo retorno é visual. O som começa **desligado** (botão “Som” na barra de cima).
- Botões **Pausa** e **Como jogar** sempre visíveis.
- Sem anúncios, sem links externos e sem coleta de dados. O progresso fica guardado só no navegador de cada computador.
- Todas as ilustrações são desenhadas pelo próprio jogo (sem fotos e sem imagens da internet). As personalidades aparecem com desenhos simbólicos, não com retratos.

## Acessibilidade e Modo Áudio

Na tela inicial há o botão **Acessibilidade** (também se abre com a tecla **A**). O mesmo painel está na **Área do professor**. As escolhas ficam guardadas no navegador daquele computador:

- **Modo Áudio**: o jogo fala sozinho em português e funciona só pelo teclado, para estudantes cegos ou com baixa visão. Teclas, sempre as mesmas:
  - **setas**: escolher; **Enter**: confirmar; **Esc**: voltar;
  - **barra de espaço**: ouvir de novo; **H**: ajuda falada;
  - **números 1, 2, 3...**: escolher a opção direto;
  - **T** (na mancala): como está o tabuleiro;
  - **F, D, S, J, K, L** (atividade de braille): pontos 1 a 6.
- **Voz do próprio jogo**: desligue se o computador usa o **NVDA** ou o **Narrador** do Windows, para não ouvir duas vozes. Aí o leitor de tela lê os avisos do jogo.
- **Voz mais devagar**.
- **Letras e botões maiores**.
- **Alto contraste** (fundo preto, letras brancas e destaques em amarelo).
- **Atividade de braille** (só na Área do professor): ao ganhar figurinhas de pessoas e países no Modo Áudio, o estudante pode escrever em braille a primeira letra do nome e ganhar uma estrela extra.

No Modo Áudio, o mapa vira um menu falado; o quebra-cabeça vira a “Viagem pela África”; a mancala é falada casa por casa, no nível mais fácil e em ritmo lento; e a Estação 4 tem a “sala dos instrumentos”, com sons criados pelo próprio jogo.

A voz usada é a do próprio computador. No Windows, a voz em português do Brasil (por exemplo, “Maria”) funciona sem internet. Se o jogo não falar, confira em Configurações do Windows → Hora e idioma → Fala se há uma voz em português instalada. Use o Google Chrome ou o Microsoft Edge.

## Área do professor

Botão discreto **Área do professor**, no canto de baixo da tela. Para entrar, responda a uma conta de soma. Lá é possível:

- **Liberar todas as estações** (em todos os anos, incluindo o Desafio final do 3º ano);
- **Acessibilidade e atividade de braille** (o mesmo painel da tela inicial, mais a opção de ligar ou desligar o braille);
- **Apagar progresso** (pede confirmação antes de apagar).

## Arquivos

- `index.html`: a página do jogo.
- `css/estilo.css`: cores, tamanhos e visual.
- `js/conteudo.js`: **todos os textos** (personalidades, países, brincadeiras, cultura e instruções). É aqui que se edita o conteúdo.
- `js/desenhos.js`: as ilustrações, desenhadas em código.
- `js/brincadeiras.js`: Terra-Mar, mancala (oware) e shisima.
- `js/jogo.js`: telas, figurinhas, álbum, pausa, som, Acessibilidade e Área do professor.
- `js/voz.js`: a voz do jogo e os sons de acerto, figurinha e sementes.
- `js/instrumentos.js`: os sons do berimbau, atabaque, agogô, ganzá e kalimba, calculados pelo próprio jogo imitando como cada instrumento vibra (sem gravações).
- `js/modo-audio.js`: as telas faladas do Modo Áudio e a atividade de braille.
- `REVISAR.md`: **lista de todas as informações históricas e culturais** para conferir antes de usar com as turmas.

## Como editar os textos

1. Abra `js/conteudo.js` (no GitHub, clique no arquivo e depois no lápis ✏️ “Edit this file”).
2. Troque só o que está **entre aspas**. Cada pessoa, país ou item tem:
   - `nome`, `pista` (uma por ano: 1, 2 e 3), `curto` (explicação do 1º ano) e `texto` (explicação do 2º e 3º ano);
   - `anos`: em quais anos o item aparece, por exemplo `[1, 2, 3]` ou `[3]`.
3. Não apague aspas, vírgulas nem chaves. Não mude o `id`.
4. Salve (botão verde “Commit changes”). Em alguns minutos o jogo publicado é atualizado.
5. Depois de mudar arquivos, aumente o número `?v=1` no `index.html` (por exemplo, para `?v=2`) em todas as linhas, para os computadores baixarem a versão nova.

No 1º ano, o jogo mostra tudo em letra de imprensa maiúscula automaticamente.

As falas do Modo Áudio, as descrições das ilustrações, onde fica cada país e como se toca cada instrumento ficam no fim do `js/conteudo.js`, na parte **MODO ÁUDIO E ACESSIBILIDADE**.
