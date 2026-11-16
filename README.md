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

## Área do professor

Botão discreto **Área do professor**, no canto de baixo da tela. Para entrar, responda a uma conta de soma. Lá é possível:

- **Liberar todas as estações** (em todos os anos, incluindo o Desafio final do 3º ano);
- **Apagar progresso** (pede confirmação antes de apagar).

## Arquivos

- `index.html`: a página do jogo.
- `css/estilo.css`: cores, tamanhos e visual.
- `js/conteudo.js`: **todos os textos** (personalidades, países, brincadeiras, cultura e instruções). É aqui que se edita o conteúdo.
- `js/desenhos.js`: as ilustrações, desenhadas em código.
- `js/brincadeiras.js`: Terra-Mar, mancala (oware) e shisima.
- `js/jogo.js`: telas, figurinhas, álbum, pausa, som e Área do professor.
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
