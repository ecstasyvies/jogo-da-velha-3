import { CONFIG } from './constantes.js';

function vibrar() {
  if ('vibrate' in navigator) {
    navigator.vibrate(CONFIG.TIMING.DURACAO_VIBRACAO);
  }
}

function indiceValido(indice) {
  return typeof indice === 'number' && indice >= 0 && indice <= 8;
}

function prevenirComportamentoPadrao(evento) {
  evento.preventDefault();
  evento.stopPropagation();
}

function elementoECasa(elemento) {
  return elemento && elemento.classList.contains('jogo__casa');
}

export {
  vibrar,
  indiceValido,
  prevenirComportamentoPadrao,
  elementoECasa
};