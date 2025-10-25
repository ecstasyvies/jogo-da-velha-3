import { estado, processarMovimentoArrastar } from '../logica/estado.js';
import { elementosCasa, atualizarUI } from './interface.js';

let elementoArrastando = null;
let indiceOrigemArrasto = null;
let elementoFantasma = null;
let ultimaCasaAlvo = null;

function criarElementoFantasma(casaOrigem) {
  elementoFantasma = casaOrigem.cloneNode(true);
  elementoFantasma.classList.add('jogo__casa--fantasma');
  elementoFantasma.style.position = 'fixed';
  elementoFantasma.style.zIndex = '1000';
  elementoFantasma.style.pointerEvents = 'none';
  elementoFantasma.style.transform = 'translate(-50%, -50%) scale(1.1)';
  elementoFantasma.style.opacity = '0.8';
  elementoFantasma.style.transition = 'none';
  elementoFantasma.style.willChange = 'transform';
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
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
      ultimaCasaAlvo = null;
    }
    return;
  }
  
  const indiceAlvo = parseInt(elementoAlvo.dataset.index, 10);
  const classeAlvo = estado.jogadorAtual === 'X' ? 'jogo__casa--alvo-valido-x' : 'jogo__casa--alvo-valido-o';
  
  if (estado.tabuleiro[indiceAlvo] === null) {
    if (ultimaCasaAlvo && ultimaCasaAlvo !== elementoAlvo) {
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
    }
    elementoAlvo.classList.add(classeAlvo);
    ultimaCasaAlvo = elementoAlvo;
  } else {
    if (ultimaCasaAlvo) {
      ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
      ultimaCasaAlvo = null;
    }
  }
}

function limparEstadoArrasto() {
  if (elementoArrastando) {
    elementoArrastando.classList.remove('jogo__casa--arrastando');
    elementoArrastando = null;
  }
  
  if (elementoFantasma) {
    elementoFantasma.remove();
    elementoFantasma = null;
  }
  
  if (ultimaCasaAlvo) {
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = null;
  }
  
  indiceOrigemArrasto = null;
}

function aoIniciarArrasto(evento) {
  const casa = evento.currentTarget;
  const indice = parseInt(casa.dataset.index, 10);
  
  if (estado.fase === 'MOVIMENTO' && estado.tabuleiro[indice] === estado.jogadorAtual && !estado.jogoTerminado) {
    evento.dataTransfer.effectAllowed = 'move';
    evento.dataTransfer.setData('text/plain', indice.toString());
    
    elementoArrastando = casa;
    indiceOrigemArrasto = indice;
    casa.classList.add('jogo__casa--arrastando');
    
    elementoFantasma = criarElementoFantasma(casa);
    const rect = casa.getBoundingClientRect();
    atualizarPosicaoFantasma(rect.left + rect.width / 2, rect.top + rect.height / 2);
    
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    evento.dataTransfer.setDragImage(img, 0, 0);
  } else {
    evento.preventDefault();
  }
}

function aoArrastar(evento) {
  if (elementoFantasma && evento.clientX !== 0 && evento.clientY !== 0) {
    const x = evento.clientX;
    const y = evento.clientY;
    atualizarPosicaoFantasma(x, y);
    
    const elementoAlvo = document.elementFromPoint(x, y);
    atualizarAlvoValido(elementoAlvo);
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
    casa.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
    ultimaCasaAlvo = null;
  }
}

function aoSoltar(evento) {
  evento.preventDefault();
  const casa = evento.currentTarget;
  const indiceDestino = parseInt(casa.dataset.index, 10);
  
  if (ultimaCasaAlvo) {
    ultimaCasaAlvo.classList.remove('jogo__casa--alvo-valido-x', 'jogo__casa--alvo-valido-o');
  }
  
  if (indiceOrigemArrasto !== null && indiceOrigemArrasto !== indiceDestino) {
    const resultado = processarMovimentoArrastar(indiceOrigemArrasto, indiceDestino);
    if (resultado.sucesso) {
      atualizarUI();
    }
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
    casa.classList.add('jogo__casa--arrastando');
    
    elementoFantasma = criarElementoFantasma(casa);
    const touch = evento.touches[0];
    atualizarPosicaoFantasma(touch.clientX, touch.clientY);
  }
}

function aoMoverToque(evento) {
  if (elementoArrastando) {
    evento.preventDefault();
    const touch = evento.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    atualizarPosicaoFantasma(x, y);
    
    const elementoAlvo = document.elementFromPoint(x, y);
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
          atualizarUI();
        }
      }
    }
    
    limparEstadoArrasto();
  }
}

function aoCancelarToque(evento) {
  if (elementoArrastando) {
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