import { obterEstado } from './estado.js';
import { elementosCasa } from './interface.js';
import { modal } from './modal.js';

function configurarAcessibilidade() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal--aberto')) {
      modal.classList.remove('modal--aberto');
    }
  });
}

function atualizarAriaLabels() {
  const estado = obterEstado();
  
  elementosCasa.forEach((casa, indice) => {
    const peca = estado.tabuleiro[indice];
    let ariaLabel = `Casa ${indice + 1}, `;
    ariaLabel += peca ? `Ocupada por ${peca}` : 'Vazia';
    casa.setAttribute('aria-label', ariaLabel);
  });
}

export {
  configurarAcessibilidade,
  atualizarAriaLabels
};