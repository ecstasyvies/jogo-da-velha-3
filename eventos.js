import { estado, processarCliqueCasa, inicializarJogo } from './estado.js';
import { atualizarUI, elementosCasa } from './interface.js';
import { limparEstadoArrasto } from './arrasto.js';
import {
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
} from './arrasto.js';

export let botaoReiniciar = null;
export let botaoInstrucoes = null;

function inicializarBotoes() {
  botaoReiniciar = document.querySelector('.jogo__botao-reiniciar');
  botaoInstrucoes = document.querySelector('.jogo__botao-instrucoes');
}

function configurarEventosTabuleiro() {
  elementosCasa.forEach(casa => {
    casa.addEventListener('click', aoClicarCasa);
    
    casa.addEventListener('dragstart', aoIniciarArrasto);
    casa.addEventListener('drag', aoArrastar);
    casa.addEventListener('dragover', aoArrastarSobre);
    casa.addEventListener('dragenter', aoEntrarArrasto);
    casa.addEventListener('dragleave', aoSairArrasto);
    casa.addEventListener('drop', aoSoltar);
    casa.addEventListener('dragend', aoFinalizarArrasto);
    
    casa.addEventListener('touchstart', aoIniciarToque, { passive: false });
    casa.addEventListener('touchmove', aoMoverToque, { passive: false });
    casa.addEventListener('touchend', aoTerminarToque);
    casa.addEventListener('touchcancel', aoCancelarToque);
    casa.addEventListener('contextmenu', (e) => e.preventDefault());
  });
}

function configurarEventosGerais() {
  botaoReiniciar.addEventListener('click', aoClicarReiniciar);
  
  document.addEventListener('touchmove', (e) => {
    const elementoArrastando = document.querySelector('.jogo__casa--arrastando');
    if (elementoArrastando) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  document.addEventListener('gestureend', (e) => e.preventDefault());
}

function aoClicarCasa(evento) {
  const indice = parseInt(evento.currentTarget.dataset.index, 10);
  const resultado = processarCliqueCasa(indice);
  atualizarUI();
}

function aoClicarReiniciar() {
  limparEstadoArrasto();
  inicializarJogo();
  atualizarUI();
  
  // Focar na primeira casa do tabuleiro após reiniciar
  const primeiraCasa = elementosCasa[0];
  if (primeiraCasa) {
    setTimeout(() => {
      primeiraCasa.focus();
    }, 0);
  }
}

export {
  inicializarBotoes,
  configurarEventosTabuleiro,
  configurarEventosGerais,
  aoClicarCasa,
  aoClicarReiniciar
};