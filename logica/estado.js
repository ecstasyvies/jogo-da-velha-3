let estado = {};

const COMBINACOES_VITORIA = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let combinacaoVencedora = null;

function inicializarJogo() {
  estado = {
    tabuleiro: Array(9).fill(null),
    jogadorAtual: 'X',
    fase: 'POSICIONAMENTO',
    pecasPosicionadas: { X: 0, O: 0 },
    vencedor: null,
    jogoTerminado: false,
  };
  combinacaoVencedora = null;
}

function obterEstado() {
  return { ...estado };
}

function processarCliqueCasa(indice) {
  if (estado.jogoTerminado || !indiceValido(indice)) {
    return { sucesso: false, motivo: 'Jogo terminado ou índice inválido' };
  }
  if (estado.fase === 'POSICIONAMENTO') {
    return processarFasePosicionamento(indice);
  } else {
    return { sucesso: false, motivo: 'Use arrastar e soltar para mover peças' };
  }
}

function processarFasePosicionamento(indice) {
  if (estado.tabuleiro[indice]) {
    return { sucesso: false, motivo: 'Casa já ocupada' };
  }
  
  estado.tabuleiro[indice] = estado.jogadorAtual;
  estado.pecasPosicionadas[estado.jogadorAtual]++;
  
  const vitoria = verificarVencedor();
  if (vitoria) {
    estado.vencedor = estado.jogadorAtual;
    estado.jogoTerminado = true;
    combinacaoVencedora = vitoria;
    return { sucesso: true };
  }
  
  if (estado.pecasPosicionadas.X + estado.pecasPosicionadas.O === 6) {
    estado.fase = 'MOVIMENTO';
  }
  
  alternarJogador();
  return { sucesso: true };
}

function processarMovimentoArrastar(indiceOrigem, indiceDestino) {
  if (estado.jogoTerminado || !indiceValido(indiceOrigem) || !indiceValido(indiceDestino)) {
    return { sucesso: false, motivo: 'Jogo terminado ou índices inválidos' };
  }
  
  if (estado.tabuleiro[indiceOrigem] !== estado.jogadorAtual) {
    return { sucesso: false, motivo: 'Essa peça não é sua.' };
  }
  
  if (estado.tabuleiro[indiceDestino] !== null) {
    return { sucesso: false, motivo: 'Você deve mover para uma casa vazia.' };
  }
  
  estado.tabuleiro[indiceOrigem] = null;
  estado.tabuleiro[indiceDestino] = estado.jogadorAtual;
  
  const vitoria = verificarVencedor();
  if (vitoria) {
    estado.vencedor = estado.jogadorAtual;
    estado.jogoTerminado = true;
    combinacaoVencedora = vitoria;
    return { sucesso: true };
  }
  
  alternarJogador();
  return { sucesso: true };
}

function alternarJogador() {
  estado.jogadorAtual = estado.jogadorAtual === 'X' ? 'O' : 'X';
}

function verificarVencedor() {
  for (const combinacao of COMBINACOES_VITORIA) {
    if (combinacao.every(indice => estado.tabuleiro[indice] === estado.jogadorAtual)) {
      return combinacao;
    }
  }
  return null;
}

function indiceValido(indice) {
  return typeof indice === 'number' && indice >= 0 && indice <= 8;
}

function getCombinacaoVencedora() {
  return combinacaoVencedora;
}

export {
  estado,
  COMBINACOES_VITORIA,
  inicializarJogo,
  obterEstado,
  processarCliqueCasa,
  processarMovimentoArrastar,
  verificarVencedor,
  indiceValido,
  getCombinacaoVencedora
};