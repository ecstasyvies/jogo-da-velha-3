import { estado, processarMovimentoArrastar, getCombinacaoVencedora } from './estado.js';
import { vibrar } from './utilidades.js';
import { atualizarUI } from './interface.js';

let elementoArrastando = null;
let indiceOrigemArrasto = null;
let elementoFantasma = null;
let posicaoFantasma = { x: 0, y: 0 };
let ultimaCasaAlvo = null;

function criarElementoFantasma(casaOrigem) {
  elementoFantasma = casaOrigem.cloneNode(true);
  elementoFantasma.classList.add('jogo__casa--fantasma');
  elementoFantasma.style.position = 'fixed';
  elementoFantasma.style.zIndex = '1000';
  elementoFantasma.style.pointerEvents = 'none';
  elementoFantasma.style.transform = 'translate(-50%, -50%) scale(1.1)';
  elementoFantasma.style.opacity = '0.8';
  elementoFantasma.style.transition = 'transform 0.1s ease, opacity 0.1s ease';
  document.body.appendChild(elementoFantasma);
  return elementoFantasma;
}

function atualizarPosicaoFantasma(x, y) {
  if (elementoFantasma) {
    elementoFantasma.style.left = x + 'px';
    elementoFantasma.style.top = y + 'px';
  }
}

function atualizarAlvoValido(elementoAlvo) {
  if (!elementoAlvo || !elementoAlvo.classList.contains('jogo__casa')) {
    if (ultimaCasaAlvo) {
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x');
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-o');
      ultimaCasaAlvo = null;
    }
    return;
  }
  
  const indiceAlvo = parseInt(elementoAlvo.dataset.index, 10);
  
  if (estado.tabuleiro[indiceAlvo] === null) {
    if (ultimaCasaAlvo && ultimaCasaAlvo !== elementoAlvo) {
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x');
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-o');
    }
    
    elementoAlvo.classList.add(estado.jogadorAtual === 'X' ? 'jogo__casa--alvo-valido-x' : 'jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = elementoAlvo;
  } else {
    if (ultimaCasaAlvo) {
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x');
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-o');
      ultimaCasaAlvo = null;
    }
  }
}

function limparEstadoArrasto() {
  if (elementoArrastando) {
    elementoArrastando.classList.remove('jogo__casa--arrastando');
    elementoArrastando.style.opacity = '';
    elementoArrastando = null;
  }
  
  if (elementoFantasma) {
    elementoFantasma.remove();
    elementoFantasma = null;
  }
  
  if (ultimaCasaAlvo) {
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x');
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = null;
  }
  
  indiceOrigemArrasto = null;
}

function aoIniciarArrasto(evento) {
  const casa = evento.currentTarget;
  const indice = parseInt(casa.dataset.index, 10);
  
  if (estado.fase === 'MOVIMENTO' && estado.tabuleiro[indice] === estado.jogadorAtual && !estado.jogoTerminado) {
    elementoArrastando = casa;
    indiceOrigemArrasto = indice;
    
    elementoFantasma = criarElementoFantasma(casa);
    
    const rect = casa.getBoundingClientRect();
    posicaoFantasma.x = rect.left + rect.width / 2;
    posicaoFantasma.y = rect.top + rect.height / 2;
    atualizarPosicaoFantasma(posicaoFantasma.x, posicaoFantasma.y);
    
    evento.dataTransfer.setData('text/plain', indice.toString());
    evento.dataTransfer.effectAllowed = 'move';
    
    casa.classList.add('jogo__casa--arrastando');
    casa.style.opacity = '0.4';
    
    evento.preventDefault();
  } else {
    evento.preventDefault();
  }
}

function aoArrastar(evento) {
  if (elementoFantasma) {
    const clientX = evento.clientX;
    const clientY = evento.clientY;
    
    if (clientX && clientY) {
      atualizarPosicaoFantasma(clientX, clientY);
      const elementoAlvo = document.elementFromPoint(clientX, clientY);
      atualizarAlvoValido(elementoAlvo);
    }
  }
}

function aoArrastarSobre(evento) {
  evento.preventDefault();
}

function aoEntrarArrasto(evento) {
  evento.preventDefault();
  const casa = evento.currentTarget;
  const indice = parseInt(casa.dataset.index, 10);
  
  if (estado.tabuleiro[indice] === null) {
    atualizarAlvoValido(casa);
  }
}

function aoSairArrasto(evento) {
  const casa = evento.currentTarget;
  if (ultimaCasaAlvo === casa) {
    casa.classList.remove('jogo__casa--alvo-valido-x');
    casa.classList.remove('jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = null;
  }
}

function aoSoltar(evento) {
  evento.preventDefault();
  const casa = evento.currentTarget;
  const indiceDestino = parseInt(casa.dataset.index, 10);
  
  if (ultimaCasaAlvo) {
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x');
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = null;
  }
  
  if (indiceOrigemArrasto !== null && indiceOrigemArrasto !== indiceDestino) {
    const resultado = processarMovimentoArrastar(indiceOrigemArrasto, indiceDestino);
    if (resultado.sucesso) {
      vibrar();
    }
    atualizarUI();
  }
  
  limparEstadoArrasto();
}

function aoFinalizarArrasto(evento) {
  limparEstadoArrasto();
}

function aoIniciarToque(evento) {
  const casa = evento.currentTarget;
  const indice = parseInt(casa.dataset.index, 10);
  
  if (estado.fase === 'MOVIMENTO' && estado.tabuleiro[indice] === estado.jogadorAtual && !estado.jogoTerminado) {
    evento.preventDefault();
    elementoArrastando = casa;
    indiceOrigemArrasto = indice;
    
    elementoFantasma = criarElementoFantasma(casa);
    
    const touch = evento.touches[0];
    posicaoFantasma.x = touch.clientX;
    posicaoFantasma.y = touch.clientY;
    atualizarPosicaoFantasma(posicaoFantasma.x, posicaoFantasma.y);
    
    casa.classList.add('jogo__casa--arrastando');
    casa.style.opacity = '0.4';
  }
}

function aoMoverToque(evento) {
  if (elementoArrastando) {
    evento.preventDefault();
    const touch = evento.touches[0];
    
    atualizarPosicaoFantasma(touch.clientX, touch.clientY);
    
    const elementoAlvo = document.elementFromPoint(touch.clientX, touch.clientY);
    atualizarAlvoValido(elementoAlvo);
  }
}

function aoTerminarToque(evento) {
  if (elementoArrastando) {
    evento.preventDefault();
    const touch = evento.changedTouches[0];
    const elementoAlvo = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (elementoAlvo && elementoAlvo.classList.contains('jogo__casa')) {
      const indiceDestino = parseInt(elementoAlvo.dataset.index, 10);
      
      if (indiceOrigemArrasto !== null && indiceOrigemArrasto !== indiceDestino) {
        const resultado = processarMovimentoArrastar(indiceOrigemArrasto, indiceDestino);
        if (resultado.sucesso) {
          vibrar();
        }
        atualizarUI();
      }
    }
    
    limparEstadoArrasto();
  }
}

function aoCancelarToque(evento) {
  if (elementoArrastando) {
    evento.preventDefault();
    limparEstadoArrasto();
  }
}

export {
  elementoArrastando,
  indiceOrigemArrasto,
  elementoFantasma,
  ultimaCasaAlvo,
  criarElementoFantasma,
  atualizarPosicaoFantasma,
  atualizarAlvoValido,
  limparEstadoArrasto,
  aoIniciarArrasto,
  aoArrastar,
  aoArrastarSobre,
  aoEntrarArrasto,
  aoSairArrasto,
  aoSoltar,
  aoFinalizarArrasto,
  aoIniciarToque,
  aoMoverToque,
  aoTerminarToque,
  aoCancelarToque
};