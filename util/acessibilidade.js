import { estado, obterEstado, processarCliqueCasa, processarMovimentoArrastar } from '../logica/estado.js';
import { elementosCasa, atualizarUI } from '../interface/interface.js';
import { modal } from '../interface/modal.js';

function configurarAcessibilidade() {
  let casaSelecionada = null;
  let casaOrigem = null;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('modal--aberto')) {
        modal.classList.remove('modal--aberto');
      }
      if (casaSelecionada) {
        casaSelecionada.classList.remove('jogo__casa--selecionada');
        casaSelecionada = null;
        casaOrigem = null;
      }
    }

    const estado = obterEstado();
    if (estado.jogoTerminado) return;

    const currentFocus = document.activeElement;
    if (!currentFocus || !currentFocus.classList.contains('jogo__casa')) return;

    const currentIndex = parseInt(currentFocus.dataset.index, 10);
    let nextIndex;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < 8 ? currentIndex + 1 : currentIndex;
        e.preventDefault();
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - 3 >= 0 ? currentIndex - 3 : currentIndex;
        e.preventDefault();
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + 3 <= 8 ? currentIndex + 3 : currentIndex;
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (estado.fase === 'MOVIMENTO') {
          if (casaOrigem === null && estado.tabuleiro[currentIndex] === estado.jogadorAtual) {
            casaOrigem = currentFocus;
            casaOrigem.classList.add('jogo__casa--selecionada');
          } else if (casaOrigem && estado.tabuleiro[currentIndex] === null) {
            const indiceOrigem = parseInt(casaOrigem.dataset.index, 10);
            processarMovimentoArrastar(indiceOrigem, currentIndex);
            casaOrigem.classList.remove('jogo__casa--selecionada');
            casaOrigem = null;
            atualizarUI();
          }
        } else {
          processarCliqueCasa(currentIndex);
          atualizarUI();
        }
        break;
    }

    if (nextIndex !== undefined && nextIndex !== currentIndex) {
      elementosCasa[nextIndex].focus();
    }
  });
}

function atualizarAriaLabels() {
  const estado = obterEstado();
  
  elementosCasa.forEach((casa, indice) => {
    const peca = estado.tabuleiro[indice];
    let ariaLabel = `Casa ${indice + 1}, `;
    
    if (peca) {
      ariaLabel += `Ocupada por ${peca}`;
      if (estado.fase === 'MOVIMENTO' && peca === estado.jogadorAtual && !estado.jogoTerminado) {
        ariaLabel += '. Pressione Enter para selecionar e mover';
      }
    } else {
      ariaLabel += 'Vazia';
      if (estado.fase === 'POSICIONAMENTO' && !estado.jogoTerminado) {
        ariaLabel += '. Pressione Enter para posicionar peça';
      }
    }
    
    casa.setAttribute('aria-label', ariaLabel);
    
    // Configurar atributos ARIA adicionais
    casa.setAttribute('role', 'gridcell');
    casa.setAttribute('aria-disabled', estado.jogoTerminado ? 'true' : 'false');
  });
}

export {
  configurarAcessibilidade,
  atualizarAriaLabels
};