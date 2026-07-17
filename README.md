# Dot Frontend Test

Projeto frontend estático desenvolvido com `HTML5`, `CSS` e `JavaScript Vanilla`, sem uso de frameworks.

## Como rodar

### Opção 1: abrir direto no navegador

Você pode abrir o arquivo `index.html` diretamente no navegador.

Observação:
- Para uma experiência mais próxima do ambiente real, o ideal é servir o projeto por um servidor local.
- O projeto usa `Swiper` via CDN, então é necessário estar conectado à internet.

### Opção 2: usar um servidor local simples

Na pasta do projeto, rode um destes comandos:

```powershell
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

Se preferir `Node.js`, também pode usar:

```powershell
npx serve .
```

### Opção 3: VS Code com Live Server

Se estiver usando VS Code:

1. Instale a extensão `Live Server`
2. Abra a pasta do projeto
3. Clique com o botão direito em `index.html`
4. Selecione `Open with Live Server`

## Stack

- `HTML5`
- `CSS`
- `JavaScript Vanilla`
- `Swiper` via CDN para o slider

## Estrutura do projeto

```text
edtech-test/
├── assets/        # imagens, ícones e áudio
├── index.html     # estrutura da página
├── style.css      # estilos e responsividade
└── script.js      # interações e regras de negócio
```

## Componentes implementados

- Header com hero inicial
- Player de vídeo com embed do YouTube
- Bloco com imagem lateral responsiva
- Slider de imagens com `Swiper`
- Recurso de destaque em bloco escuro
- Cards interativos com abrir/fechar
- Player de áudio customizado
- Atividade discursiva
- Atividade objetiva com `checkbox`
- FAQ em formato accordion
- Footer

## Decisões técnicas

### 1. Projeto sem build

O projeto foi mantido como uma aplicação estática simples, sem `bundler`, sem `framework` e sem `package.json`, para ficar aderente ao requisito de uso apenas de tecnologias base.

### 2. Swiper para o slider

O slider foi implementado com `Swiper` via CDN porque:

- atende o requisito do teste
- reduz complexidade de implementação
- já oferece navegação, paginação e estados básicos

### 3. Atividades feitas do zero

As atividades discursiva e objetiva foram implementadas manualmente em `script.js`, sem plugins.

Fluxos cobertos:
- habilitar e desabilitar botões
- exibir feedback
- permitir alteração após envio
- persistir estado em `sessionStorage`
- restaurar estado ao recarregar a página

### 4. Persistência com sessionStorage

Foi usado `sessionStorage` porque o requisito pede persistência apenas durante a sessão do navegador.

Estados restaurados:
- conteúdo do `textarea`
- feedback exibido
- estado dos botões
- opções marcadas na atividade objetiva

### 5. FAQ com recurso nativo

O accordion foi implementado com botões nativos e controle de `aria-expanded`, priorizando:

- semântica
- acessibilidade básica
- navegação por teclado
- transições leves em CSS

### 6. Responsividade

O layout foi ajustado para funcionar em desktop e mobile com:

- containers fluidos com `width: min(...)`
- imagens responsivas
- `iframe` responsivo com `aspect-ratio`
- ajustes de grid e empilhamento em `media queries`

## Arquivos principais

### `index.html`

Contém a marcação semântica da página e os componentes visuais.

### `style.css`

Contém:
- layout
- responsividade
- estados visuais
- animações e microinterações

### `script.js`

Contém:
- inicialização do slider
- lógica do accordion
- lógica dos cards interativos
- player de áudio
- comportamento das atividades
- persistência em `sessionStorage`

## Requisitos de ambiente

- Navegador moderno
- Internet para carregar o CDN do `Swiper`

## Observações

- Os textos e imagens atuais são placeholders do teste.

