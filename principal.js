import { inicializarJogo } from './estado.js';
import { inicializarElementosDOM, atualizarUI } from './interface.js';
import { inicializarBotoes, configurarEventosTabuleiro, configurarEventosGerais } from './eventos.js';
import { configurarModal } from './modal.js';
import { configurarAcessibilidade } from './acessibilidade.js';

function inicializarUI() {
  inicializarElementosDOM();
  inicializarBotoes();
  
  const elementoTabuleiro = document.querySelector('.jogo__tabuleiro');
  const elementoStatus = document.querySelector('.jogo__status');
  const botaoReiniciar = document.querySelector('.jogo__botao-reiniciar');
  const botaoInstrucoes = document.querySelector('.jogo__botao-instrucoes');
  
  if (!elementoTabuleiro || !elementoStatus || !botaoReiniciar || !botaoInstrucoes) {
    console.error('Elementos do DOM não encontrados!');
    return;
  }
  
  configurarEventosTabuleiro();
  configurarEventosGerais();
  configurarModal();
  configurarAcessibilidade();
  inicializarJogo();
  atualizarUI();
}

document.addEventListener('DOMContentLoaded', inicializarUI);