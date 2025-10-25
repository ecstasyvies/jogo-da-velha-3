import { estado, obterEstado, getCombinacaoVencedora, processarMovimentoArrastar, processarCliqueCasa } from './estado.js';

export let elementoTabuleiro = null;
export let elementosCasa = null;
export let elementoStatus = null;

let nomeJogadorX = "Jogador X";
let nomeJogadorO = "Jogador O";

function inicializarElementosDOM() {
  elementoTabuleiro = document.querySelector('.jogo__tabuleiro');
  elementosCasa = document.querySelectorAll('.jogo__casa');
  elementoStatus = document.querySelector('.jogo__status');
  
  if (!elementoTabuleiro || elementosCasa.length === 0 || !elementoStatus) {
    console.error('Elementos do tabuleiro não encontrados!');
  }
}

function setNomeJogadores(x, o) {
  nomeJogadorX = x;
  nomeJogadorO = o;
}

function getNomeJogadores() {
  return { nomeJogadorX, nomeJogadorO };
}

function renderizarTabuleiro() {
  const estadoAtual = obterEstado();
  const combinacaoVencedora = getCombinacaoVencedora();
  
  elementoTabuleiro.classList.toggle('jogo__tabuleiro--terminado', estadoAtual.jogoTerminado);
  
  // Atualizar classes de turno para o foco
  elementosCasa.forEach(casa => {
    casa.classList.remove('jogo__casa--turno-x', 'jogo__casa--turno-o');
    if (!estadoAtual.jogoTerminado) {
      casa.classList.add(`jogo__casa--turno-${estadoAtual.jogadorAtual.toLowerCase()}`);
    }
  });
  
  // Gerenciar ordem de tabulação e foco
  const botaoReiniciar = document.querySelector('.jogo__botao-reiniciar');
  if (estadoAtual.jogoTerminado) {
    // Desabilitar tabulação nas casas e focar no botão de reiniciar
    elementosCasa.forEach(casa => {
      casa.setAttribute('tabindex', '-1');
      if (casa === document.activeElement) {
        botaoReiniciar.focus();
      }
    });
    botaoReiniciar.setAttribute('tabindex', '0');
  } else {
    // Habilitar tabulação nas casas
    elementosCasa.forEach(casa => casa.setAttribute('tabindex', '0'));
    botaoReiniciar.setAttribute('tabindex', '0');
  }
  
  // Configurar a ordem de tabulação
  if (estadoAtual.jogoTerminado) {
    elementosCasa.forEach(casa => casa.setAttribute('tabindex', '-1'));
    document.querySelector('.jogo__botao-reiniciar').setAttribute('tabindex', '0');
  } else {
    elementosCasa.forEach(casa => casa.setAttribute('tabindex', '0'));
  }
  
  elementosCasa.forEach((casa, indice) => {
    const peca = estadoAtual.tabuleiro[indice];
    casa.textContent = peca || '';
    casa.classList.toggle('jogo__casa--x', peca === 'X');
    casa.classList.toggle('jogo__casa--o', peca === 'O');
    casa.classList.remove(
      'jogo__casa--vencedora',
      'jogo__casa--vencedora-x',
      'jogo__casa--vencedora-o'
    );
    casa.style.animation = '';
    
    if (estadoAtual.jogoTerminado && combinacaoVencedora && combinacaoVencedora.includes(indice)) {
      const corVencedor = estadoAtual.vencedor === 'X' ? 'jogo__casa--vencedora-x' : 'jogo__casa--vencedora-o';
      casa.classList.add('jogo__casa--vencedora', corVencedor);
    }
    
    let ariaLabel = `Casa ${indice + 1}, `;
    ariaLabel += peca ? `Ocupada por ${peca}` : 'Vazia';
    casa.setAttribute('aria-label', ariaLabel);
    
    if (estadoAtual.jogoTerminado) {
      casa.disabled = true;
      casa.draggable = false;
    } else {
      casa.disabled = false;
      casa.draggable = estadoAtual.fase === 'MOVIMENTO' && peca === estadoAtual.jogadorAtual;
    }
  });
}

function renderizarStatus() {
  const estadoAtual = obterEstado();
  let textoStatus = '';
  
  const nomeJogadorAtual = estadoAtual.jogadorAtual === 'X' ? nomeJogadorX : nomeJogadorO;
  
  if (estadoAtual.vencedor) {
    const nomeVencedor = estadoAtual.vencedor === 'X' ? nomeJogadorX : nomeJogadorO;
    textoStatus = `Vitória de <strong>${nomeVencedor}</strong>!`;
  } else if (estadoAtual.fase === 'POSICIONAMENTO') {
    textoStatus = `Fase de Posicionamento. Vez de ${nomeJogadorAtual}.`;
  } else {
    textoStatus = `Fase de Movimento. ${nomeJogadorAtual}: Arraste suas peças para casas vazias.`;
  }
  
  elementoStatus.innerHTML = textoStatus;
}

function destacarCombinacaoVencedora() {
  const combinacaoVencedora = getCombinacaoVencedora();
  if (!combinacaoVencedora) return;
  
  const corVencedor = estado.vencedor === 'X' ? 'jogo__casa--vencedora-x' : 'jogo__casa--vencedora-o';
  
  combinacaoVencedora.forEach((indice, sequencia) => {
    setTimeout(() => {
      const casa = elementosCasa[indice];
      casa.classList.add('jogo__casa--vencedora', corVencedor);
      casa.style.animation = `escalaSuave 0.3s ease ${sequencia * 0.1}s`;
    }, sequencia * 100);
  });
}

function atualizarUI() {
  renderizarTabuleiro();
  renderizarStatus();
  
  if (estado.jogoTerminado && getCombinacaoVencedora()) {
    destacarCombinacaoVencedora();
  }
}

export {
  inicializarElementosDOM,
  setNomeJogadores,
  getNomeJogadores,
  renderizarTabuleiro,
  renderizarStatus,
  destacarCombinacaoVencedora,
  atualizarUI
};